#!/usr/bin/env python3
"""
Convert Markdown files with YAML front matter (--- ... ---) to TOML front matter (+++ ... +++).

Usage examples:
  python tools/preprocess/convert_yaml_to_toml.py --root data/corpus --glob "**/*.md" --inplace --backup-dir backups/frontmatter
  python tools/preprocess/convert_yaml_to_toml.py --root data/corpus/qas --glob "*.md" --dry-run

Dependencies: pyyaml, tomlkit
  pip install pyyaml tomlkit
"""
from __future__ import annotations
import argparse, sys, traceback
from pathlib import Path
import yaml
import tomlkit

FRONT_Y = "---"
FRONT_T = "+++"


def split_front(text: str):
    if text.startswith(FRONT_Y):
        end = text.find("\n" + FRONT_Y, len(FRONT_Y))
        if end == -1:
            end = text.find("\r\n" + FRONT_Y, len(FRONT_Y))
        if end == -1:
            return ("yaml", None, text)
        # assume \n after closing fence
        body_start = text.find("\n", end + 1)
        return ("yaml", text[len(FRONT_Y)+1:end], text[body_start+1:])
    if text.startswith(FRONT_T):
        end = text.find("\n" + FRONT_T, len(FRONT_T))
        if end == -1:
            end = text.find("\r\n" + FRONT_T, len(FRONT_T))
        if end == -1:
            return ("toml", None, text)
        body_start = text.find("\n", end + 1)
        return ("toml", text[len(FRONT_T)+1:end], text[body_start+1:])
    return (None, None, text)


def yaml_to_toml(y: str) -> str:
    data = yaml.safe_load(y) if y else {}
    if data is None:
        data = {}
    if not isinstance(data, dict):
        data = {"_frontmatter": data}
    doc = tomlkit.document()
    for k, v in data.items():
        doc.add(k, v)
    return tomlkit.dumps(doc)


def convert_path(p: Path, inplace: bool, backup_dir: Path|None):
    text = p.read_text(encoding="utf-8", errors="ignore")
    kind, front, body = split_front(text)
    if kind is None or kind == "toml":
        return "skipped"
    if kind == "yaml" and front is None:
        return "malformed"
    toml = yaml_to_toml(front or "")
    new = f"{FRONT_T}\n{toml}{FRONT_T}\n\n{body}"
    if inplace:
        if backup_dir:
            backup_dir.mkdir(parents=True, exist_ok=True)
            (backup_dir / (p.name + ".bak")).write_text(text, encoding="utf-8")
        p.write_text(new, encoding="utf-8")
    else:
        out = p.with_suffix("")
        out = out.with_name(out.name + ".toml.md")
        out.write_text(new, encoding="utf-8")
    return "converted"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="data/corpus", help="Root directory to scan")
    ap.add_argument("--glob", default="**/*.md", help="Glob under root")
    ap.add_argument("--inplace", action="store_true")
    ap.add_argument("--backup-dir", default=None)
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    root = Path(a.root)
    files = list(root.glob(a.glob))
    if not files:
        print("No files matched")
        sys.exit(0)
    backup = Path(a.backup_dir) if a.backup_dir else None
    conv = skip = bad = 0
    for p in files:
        try:
            if a.dry_run:
                kind, front, _ = split_front(p.read_text(encoding="utf-8", errors="ignore"))
                if kind == "yaml" and front is not None:
                    conv += 1
                else:
                    skip += 1
                continue
            res = convert_path(p, a.inplace, backup)
            if res == "converted":
                conv += 1
            elif res == "malformed":
                bad += 1
            else:
                skip += 1
        except Exception:
            bad += 1
    print(f"converted={conv} skipped={skip} errors={bad}")
    sys.exit(1 if bad else 0)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
    except Exception:
        traceback.print_exc()
        sys.exit(1)