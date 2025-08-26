import os
import yaml
import re

# ========== CONFIG ==========
FOLDER = "./"  # change this if needed
OUTPUT_FILE = "qa_validation_report.txt"
VALID_ACTION_TYPES = {
    "open_register", "start_workflow", "open_dashboard", "draft_doc",
    "reminder", "report", "approval", "view_dashboard", "link_to_tool",
    "dashboard_view", "register_entry", "classify_assist"
}
REQUIRED_SECTIONS = [
    "**Standard terms)**",
    "**Plain-English answer**",
    "**Applies to**",
    "**Why it matters**",
    "**Do next in our platform**",
    "**How our platform will help**",
    "**Likely follow-ups**",
    "**Sources**"
]
# =============================

def validate_qa_file(file_path):
    results = {
        "file": file_path,
        "missing_sections": [],
        "invalid_actions": [],
        "error": None
    }
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Split YAML and markdown
        parts = content.split('---', 1)
        if len(parts) != 2:
            results["error"] = "Missing YAML/body separator"
            return results

        yaml_part = yaml.safe_load(parts[0])
        body = parts[1]

        # Check required markdown sections
        for section in REQUIRED_SECTIONS:
            if section not in body:
                results["missing_sections"].append(section)

        # Check action types
        actions = yaml_part.get("ui", {}).get("actions", [])
        for action in actions:
            if action.get("type") not in VALID_ACTION_TYPES:
                results["invalid_actions"].append(action.get("type"))

    except Exception as e:
        results["error"] = str(e)

    return results

# ========== MAIN ==========
with open(OUTPUT_FILE, 'w', encoding='utf-8') as report:
    all_files = sorted([f for f in os.listdir(FOLDER) if re.match(r"Q\\d{3}\\.md", f)])
    for filename in all_files:
        filepath = os.path.join(FOLDER, filename)
        result = validate_qa_file(filepath)

        report.write(f"\n📄 {result['file']}\n")
        if result['error']:
            report.write(f"  ❌ ERROR: {result['error']}\n")
        if result['missing_sections']:
            report.write(f"  ⚠️  Missing sections: {result['missing_sections']}\n")
        if result['invalid_actions']:
            report.write(f"  ❗ Invalid actions: {result['invalid_actions']}\n")
        if not result['error'] and not result['missing_sections'] and not result['invalid_actions']:
            report.write("  ✅ OK\n")

print(f"\n✅ Validation complete. Report written to: {OUTPUT_FILE}")

