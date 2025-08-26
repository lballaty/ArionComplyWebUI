#!/usr/bin/env python3
"""
Build canonical term and phrase sets from curated Markdown corpora.
- Reads TOML or YAML front matter for metadata.
- Mines tokens and bigrams from body text.
- Writes CSVs into outputs/vocab/ and overlap report.

Usage:
  python tools/analyze/build_vocab.py --root data/corpus --out outputs/vocab

Dependencies: pyyaml, tomli (for TOML read), pandas
"""
from __future__ import annotations
import argparse, csv, re
from pathlib import Path
import pandas as pd
import yaml
try:
    import tomllib as tomli  # py311+
except Exception:
    import tomli

WORD = re.compile(r"\b[a-z0-9\-]+\b")


def split_front(text: str):
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            body_start = text.find("\n", end + 4)
            return ("yaml", text[4:end], text[body_start+1:])
    if text.startswith("+++"):
        end = text.find("\n+++", 3)
        if end != -1:
            body_start = text.find("\n", end + 4)
            return ("toml", text[4:end], text[body_start+1:])
    return (None, None, text)


def parse_meta(kind: str, front: str) -> dict:
    if kind == "yaml":
        return yaml.safe_load(front) or {}
    if kind == "toml":
        return tomli.loads(front) or {}
    return {}


def mine_tokens(body: str) -> list[str]:
    body = body.lower()
    return WORD.findall(body)


def bigrams(tokens: list[str]) -> list[str]:
    return [f"{tokens[i]} {tokens[i+1]}" for i in range(len(tokens)-1)]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="data/corpus")
    ap.add_argument("--glob", default="**/*.md")
    ap.add_argument("--out", default="outputs/vocab")
    ap.add_argument("--min-phrase-freq", type=int, default=2)
    a = ap.parse_args()

    rows_terms, rows_phr = [], []
    for p in Path(a.root).glob(a.glob):
        txt = p.read_text(encoding="utf-8", errors="ignore")
        kind, front, body = split_front(txt)
        meta = parse_meta(kind, front or "")
        stds = meta.get("standards", [])
        cls = meta.get("clauses", [])
        doc_id = meta.get("id", "")
        # seed terms/phrases
        seed_terms = meta.get("terms", [])
        seed_phr = meta.get("phrases", [])
        toks = mine_tokens(body)
        bi = bigrams(toks)
        for t in set(seed_terms) | set(toks):
            rows_terms.append(["|".join(stds), "|".join(cls), t, doc_id, str(p)])
        # count bigrams
        from collections import Counter
        bi_cnt = Counter(bi)
        for ph, c in bi_cnt.items():
            if c >= a.min_phrase_freq:
                rows_phr.append(["|".join(stds), "|".join(cls), ph, "freq", c, doc_id, str(p)])
        for ph in set(seed_phr):
            rows_phr.append(["|".join(stds), "|".join(cls), ph, "curated", "", doc_id, str(p)])

    Path(a.out).mkdir(parents=True, exist_ok=True)
    pd.DataFrame(rows_terms, columns=["standards","clauses","term","doc_id","path"]).drop_duplicates().to_csv(Path(a.out)/"terms.csv", index=False)
    pd.DataFrame(rows_phr, columns=["standards","clauses","phrase","method","count","doc_id","path"]).drop_duplicates().to_csv(Path(a.out)/"phrases.csv", index=False)

    # uniques and overlaps
    df = pd.read_csv(Path(a.out)/"terms.csv")
    by_std = {}
    for _, row in df.iterrows():
        for s in str(row["standards"]).split("|"):
            if not s or s == "nan":
                continue
            by_std.setdefault(s, set()).add(row["term"])
    all_stds = sorted(by_std.keys())
    with open(Path(a.out)/"unique_terms_by_standard.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["standard","term"])
        for s in all_stds:
            others = set().union(*(by_std[o] for o in all_stds if o!=s))
            for t in sorted(by_std[s] - others):
                w.writerow([s, t])
    with open(Path(a.out)/"overlap_jaccard.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["standard"] + all_stds)
        for astd in all_stds:
            row = [astd]
            for bstd in all_stds:
                ua, ub = by_std[astd], by_std[bstd]
                j = len(ua & ub) / len(ua | ub) if ua | ub else 0.0
                row.append(f"{j:.4f}")
            w.writerow(row)

if __name__ == "__main__":
    main()