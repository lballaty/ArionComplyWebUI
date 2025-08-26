#!/usr/bin/env python3
import re
import os
import sys

REPORT_FILE = "qa_validation_report.txt"
# matches lines exactly like: 📄 ./Q001.md
PATTERN = re.compile(r"^📄\s+\.\/(Q\d{3}\.md)\s*$")

def parse_report(report_path):
    """
    Return a list of tuples (filename, next_report_line) for each
    '📄 ./Qxxx.md' entry in the report.
    """
    entries = []
    with open(report_path, "r", encoding="utf-8") as f:
        lines = [line.rstrip("\n") for line in f]
    for idx, line in enumerate(lines):
        m = PATTERN.match(line)
        if not m:
            continue
        filename = m.group(1)
        # the very next line in the report (or empty string)
        next_line = lines[idx + 1].strip() if idx + 1 < len(lines) else ""
        entries.append((filename, next_line))
    return entries

def inspect_file(path):
    """
    Returns a tuple (third_line, total_lines) for the given file.
    If the file doesn't exist, returns (None, None).
    """
    try:
        with open(path, "r", encoding="utf-8") as f:
            file_lines = [l.rstrip("\n") for l in f]
    except FileNotFoundError:
        print(f"Warning: file not found: {path}", file=sys.stderr)
        return None, None

    third_line = file_lines[2] if len(file_lines) >= 3 else ""
    total = len(file_lines)
    return third_line, total

def main():
    if not os.path.isfile(REPORT_FILE):
        print(f"Error: report file not found: {REPORT_FILE}", file=sys.stderr)
        sys.exit(1)

    entries = parse_report(REPORT_FILE)
    if not entries:
        print("No matching entries found in report.")
        return

    for filename, next_report_line in entries:
        third_line, line_count = inspect_file(filename)
        if third_line is None:
            continue

        print(filename)
        print(next_report_line)
        print(third_line)
        print(f"Line count: {line_count}")
        print()  # blank line between entries

if __name__ == "__main__":
    main()
