#!/usr/bin/env python3
"""Validate TOML/YAML front matter for required keys.
Usage: python tools/preprocess/validate_front_matter.py --root data/corpus --glob "**/*.md"
"""
import argparse, sys
from pathlib import Path
import yaml
try:
    import tomllib as tomli
except Exception:
    import tomli

REQ_ANY = ("standards", "clauses")  # need at least one
REQ_ALL = ("id",)


def split_front(text: str):
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            body_start = text.find("\n", end + 4)
            return ("yaml", text[4:end])
    if text.startswith("+++"):
        end = text.find("\n+++", 3)
        if end != -1:
            body_start = text.find("\n", end + 4)
            return ("toml", text[4:end])
    return (None, None)


def parse(kind, front):
    if kind == "yaml":
        return yaml.safe_load(front) or {}
    if kind == "toml":
        return tomli.loads(front) or {}
    return {}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="data/corpus")
    ap.add_argument("--glob", default="**/*.md")
    a = ap.parse_args()

    bad = 0
    for p in Path(a.root).glob(a.glob):
        kind, front = split_front(p.read_text(encoding="utf-8", errors="ignore"))
        if not kind:
            print("[NO-FRONT]", p)
            bad += 1
            continue
        meta = parse(kind, front or "")
        missing_all = [k for k in REQ_ALL if k not in meta]
        has_any = any(meta.get(k) for k in REQ_ANY)
        if missing_all or not has_any:
            print("[INVALID]", p, "missing:", missing_all, "needs one of:", REQ_ANY)
            bad += 1
    if bad:
        print(f"Invalid files: {bad}")
        sys.exit(1)
    print("All files valid.")

if __name__ == "__main__":
    main()