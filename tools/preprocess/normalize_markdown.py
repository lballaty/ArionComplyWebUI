#!/usr/bin/env python3
"""
Normalize Markdown body text for vocabulary mining.
- Lowercase, ASCII fold, strip punctuation except hyphen.
- Emits a `.norm.txt` alongside each input for inspection.

Usage:
  python tools/preprocess/normalize_markdown.py --root data/corpus --glob "**/*.md"
"""
from __future__ import annotations
import argparse, unicodedata
from pathlib import Path
import re

WORD = re.compile(r"[a-z0-9\-]+")


def normalize_text(t: str) -> str:
    t = unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode("ascii")
    t = t.lower()
    # keep words only; join with space
    return " ".join(WORD.findall(t))


def extract_body(text: str) -> str:
    if text.startswith("---") or text.startswith("+++"):
        fence = "---" if text.startswith("---") else "+++"
        end = text.find("\n" + fence, len(fence))
        if end != -1:
            nl = text.find("\n", end + 1)
            return text[nl+1:]
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="data/corpus")
    ap.add_argument("--glob", default="**/*.md")
    a = ap.parse_args()
    for p in Path(a.root).glob(a.glob):
        txt = p.read_text(encoding="utf-8", errors="ignore")
        body = extract_body(txt)
        norm = normalize_text(body)
        out = p.with_suffix(p.suffix + ".norm.txt")
        out.write_text(norm, encoding="utf-8")
        print("normalized:", out)

if __name__ == "__main__":
    main()