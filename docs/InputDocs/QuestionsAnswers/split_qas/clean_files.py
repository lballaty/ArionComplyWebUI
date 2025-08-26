#!/usr/bin/env python3
import os

# these are the exact trailer‐lines to remove if found at the end (case‐insensitive)
TRAILERS = {"yaml", "copy", "edit"}

def clean_file(path):
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # strip off any trailing trailer‐lines
    new_lines = list(lines)
    while new_lines and new_lines[-1].strip().lower() in TRAILERS:
        new_lines.pop()

    # if we removed anything, overwrite the file
    if new_lines != lines:
        with open(path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
        return True
    return False

def main():
    md_files = [f for f in os.listdir(".") if f.endswith(".md")]
    if not md_files:
        print("No .md files found in current directory.")
        return

    updated = []
    for md in md_files:
        if clean_file(md):
            updated.append(md)

    if updated:
        print("Cleaned trailer lines from:")
        for fn in updated:
            print(f"  – {fn}")
    else:
        print("No files needed cleaning.")

if __name__ == "__main__":
    main()

