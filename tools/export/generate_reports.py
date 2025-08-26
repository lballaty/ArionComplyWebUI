#!/usr/bin/env python3
"""
Summarize outputs into simple Markdown reports.

Usage:
  python tools/export/generate_reports.py --in outputs/vocab --out outputs/reports
"""
from __future__ import annotations
import argparse
from pathlib import Path
import pandas as pd


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", default="outputs/vocab")
    ap.add_argument("--out", dest="out", default="outputs/reports")
    a = ap.parse_args()
    inp = Path(a.inp); out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)

    terms = pd.read_csv(inp/"terms.csv") if (inp/"terms.csv").exists() else None
    uniques = pd.read_csv(inp/"unique_terms_by_standard.csv") if (inp/"unique_terms_by_standard.csv").exists() else None
    jacc = pd.read_csv(inp/"overlap_jaccard.csv") if (inp/"overlap_jaccard.csv").exists() else None

    md = ["# Vocabulary Build Report\n"]
    if terms is not None:
        md.append(f"Total terms rows: {len(terms)}\n")
        md.append("## Standards present\n")
        stds = set()
        for s in terms["standards"].fillna(""):
            stds.update([x for x in str(s).split("|") if x])
        for s in sorted(stds):
            md.append(f"- {s}")
        md.append("")
    if uniques is not None:
        md.append("## Unique terms per standard (counts)\n")
        for s, grp in uniques.groupby("standard"):
            md.append(f"- {s}: {len(grp)}")
        md.append("")
    if jacc is not None:
        md.append("## Overlap (Jaccard)\n")
        md.append(jacc.to_csv(index=False))
    (out/"REPORT.md").write_text("\n".join(md), encoding="utf-8")
    print("Wrote", out/"REPORT.md")

if __name__ == "__main__":
    main()