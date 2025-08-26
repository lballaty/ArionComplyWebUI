import os
import yaml
import re

# Path to your QAs root folder
QA_DIR = "/path/to/qa/files"

# Optional: If some IDs can be empty, list them here
ALLOW_EMPTY_PRIMARY = {"Q191", "Q194", "Q198"}  # example exceptions

def validate_qa_file(path):
    errors = []
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Parse YAML frontmatter
    match = re.match(r"(?s)^---\n(.*?)\n---", content)
    if not match:
        errors.append("Missing or malformed YAML frontmatter")
        return errors

    try:
        data = yaml.safe_load(match.group(1))
    except yaml.YAMLError as e:
        errors.append(f"YAML parse error: {e}")
        return errors

    qa_id = data.get("id", "UNKNOWN")
    
    # Required top-level keys
    required_keys = ["query", "packs", "primary_ids", "capability_tags", "sources", "ui", "output_mode"]
    for key in required_keys:
        if key not in data:
            errors.append(f"Missing key: {key}")

    # Primary IDs check
    if not data.get("primary_ids") and qa_id not in ALLOW_EMPTY_PRIMARY:
        errors.append("primary_ids is empty")

    # Sources check
    sources = data.get("sources", [])
    if not sources:
        errors.append("No sources defined")
    else:
        for s in sources:
            for subkey in ["title", "id", "locator"]:
                if subkey not in s or not s[subkey]:
                    errors.append(f"Source missing {subkey}")

    return errors


def main():
    all_errors = {}
    for root, _, files in os.walk(QA_DIR):
        for file in files:
            if file.lower().endswith((".md", ".yml", ".yaml")):
                path = os.path.join(root, file)
                errs = validate_qa_file(path)
                if errs:
                    all_errors[path] = errs

    if not all_errors:
        print("✅ All QA files passed validation!")
    else:
        print("❌ Issues found in the following files:")
        for path, errs in all_errors.items():
            print(f"\n{path}")
            for e in errs:
                print(f"  - {e}")


if __name__ == "__main__":
    main()

