#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
QA Linter — robust, granular checks against Compliance Q&A Authoring Guide (v1)

Outputs:
  - qa_validation_report.md  (pretty summary)
  - qa_validation_report.csv (spreadsheet-friendly)
Exit codes:
  0 = no FAIL issues
  1 = at least one FAIL

Requires: pyyaml
  pip install pyyaml
"""

import os, re, sys, csv, yaml
from datetime import datetime
from typing import List, Dict, Any, Tuple

# --------- CONFIG ---------
QA_DIR = "./"               # <- change this to your repo path
REPORT_MD = "qa_validation_report.md"
REPORT_CSV = "qa_validation_report.csv"

# Allowed packs (Guide §6.1)
ALLOWED_PACKS = {
    "ISO27001:2022","ISO27701:2019","GDPR:2016","CPRA:2023","NIS2:2023","EUAI:2024","ISO27002:2022","ISO27000:2018"
}

# Capability tags (Guide §6.2) — YAML “public” tags only
ALLOWED_CAPABILITY_TAGS = {
    "NL-Portal","Draft Doc","Approval","Versioning","Register","Tracker","Workflow",
    "Reminder","Planner","Dashboard","Report","Virtual Manager","Classify-Assist","Evidence-Guided"
}

# UI action types (Guide §6.4)
ALLOWED_ACTION_TYPES = {"open_register","start_workflow","open_template","create_policy","open_tracker","upload_evidence"}

# Canonical registers / trackers / workflows (Appendix A)
REGISTERS = {
    "risk","soa","vendors","ropa","transfers","incidents","dsr","assets_systems","training","audits",
    "document_register","byod_compliance","risk_communications","business_impact","privacy_compliance",
    "operational_controls","access_control_matrix","policy_acknowledgements","kpi_metrics",
    "legal_regulatory_compliance"
}
TRACKERS = {
    "cap_nc","change_management","monitoring","security_assessments","penetration_tests",
    "security_reviews","findings","remediation","tasks","issues","evidence_requests"
}
WORKFLOWS = {
    "program_readiness","program_external_assessment","program_maintenance","gdpr_quick_start",
    "dpa_pack","dpia","incident_breach","internal_audit","management_review","exception","vendor_dd",
    "dsr_fulfillment","policy_refresh","risk_assessment","bc_dr_plan"
}
# Evidence buckets: allow any snake_case noun-ish; we’ll enforce snake_case only.
SNAKE_CASE = re.compile(r"^[a-z0-9]+(?:_[a-z0-9]+)*$")

# Flags (Guide §6.3)
ALLOWED_FLAGS = {"LOCAL LAW CHECK","CB POLICY VARIES","MARKET PRACTICE—VALIDATE","RESEARCH NEEDED"}

# Canonical ID format (Guide §6.5 & §6.6)
ID_CANONICAL = re.compile(r"^[A-Z0-9]+:\d{4}/[A-Za-z0-9.\-§]+(?:\.[A-Za-z0-9.\-§]+)*$")

# Output modes
ALLOWED_OUTPUT_MODES = {"cards","prose","both"}

# Body required sections (Guide §3)
REQUIRED_SECTIONS_ORDER = [
    r"\#\#\#\s*\d+\)\s*",           # Title line (e.g., "### 41) ...")
    r"\*\*Standard term\(s\)\*\*",  # exact
    r"\*\*Plain-English answer\*\*",
    r"\*\*Applies to\*\*",
    r"\*\*Why it matters\*\*",
    r"\*\*Do next in our platform\*\*",
    r"\*\*How our platform will help\*\*",
    r"\*\*Likely follow-ups\*\*",
    r"\*\*Sources\*\*",
]

# Cards hint constraints (Appendix E)
MAX_CARDS_HINT = 3
MAX_CARD_CHARS = 40

# --------- Helpers ---------
FM_RE = re.compile(r"(?s)^---\n(.*?)\n---\s*")
BULLET_LINE = re.compile(r"^\s*[-*]\s+", re.M)

def load_frontmatter_and_body(path: str) -> Tuple[Dict[str, Any], str]:
    with open(path, "r", encoding="utf-8") as f:
        txt = f.read()
    m = FM_RE.match(txt)
    if not m:
        raise ValueError("Missing or malformed YAML frontmatter")
    data = yaml.safe_load(m.group(1)) or {}
    body = txt[m.end():]
    return data, body

def norm(s: str) -> str:
    return (s or "").strip()

def check_sections_order(body: str) -> List[str]:
    errs = []
    last_end = 0
    for pat in REQUIRED_SECTIONS_ORDER:
        m = re.search(pat, body)
        if not m:
            errs.append(f"Body missing section marker matching /{pat}/")
        else:
            if m.start() < last_end:
                errs.append(f"Section out of order around /{pat}/")
            last_end = m.end()
    return errs

def extract_sources_from_body(body: str) -> List[str]:
    # After **Sources**, collect bullet lines or lines until blank section end
    idx = body.find("**Sources**")
    if idx == -1:
        return []
    tail = body[idx+len("**Sources**"):]
    lines = [l.strip(" -*") for l in tail.strip().splitlines() if l.strip()]
    # Keep only first continuous block until next heading-like line
    collected = []
    for l in lines:
        if l.startswith("**"):  # next section (unlikely) or malformed
            break
        collected.append(l)
    return collected

def is_canonical_id(s: str) -> bool:
    return bool(ID_CANONICAL.match(s))

def find_noncanonical_ids(ids: List[str]) -> List[str]:
    return [i for i in ids if not is_canonical_id(i)]

def ensure_pack_ids_match(ids: List[str]) -> List[str]:
    """Warn if pack prefix not in ALLOWED_PACKS"""
    probs = []
    for i in ids:
        pack = i.split(":",1)[0] + ":" + i.split(":",1)[1].split("/",1)[0]
        if pack not in ALLOWED_PACKS:
            probs.append(f"Unknown pack/year in id: {i}")
    return probs

def parse_ui_actions(ui: Dict[str, Any]) -> List[Tuple[str, str]]:
    acts = []
    for a in (ui or {}).get("actions", []) or []:
        acts.append((a.get("type",""), a.get("target","")))
    return acts

def check_ui_action(a_type: str, target: str) -> Tuple[str, str]:
    if a_type not in ALLOWED_ACTION_TYPES:
        return ("FAIL", f"ui.actions.type '{a_type}' not in allowed set {sorted(ALLOWED_ACTION_TYPES)}")
    if a_type == "open_register" and target not in REGISTERS:
        return ("WARN", f"open_register target '{target}' is not canonical (Appendix A.1)")
    if a_type == "open_tracker" and target not in TRACKERS:
        return ("WARN", f"open_tracker target '{target}' is not canonical (Appendix A.3)")
    if a_type == "start_workflow" and target not in WORKFLOWS:
        return ("WARN", f"start_workflow target '{target}' is not canonical (Appendix A.2)")
    if a_type == "upload_evidence" and not SNAKE_CASE.match(target or ""):
        return ("WARN", f"upload_evidence target '{target}' is not snake_case")
    # open_template/create_policy: skip strict checks; they are catalog-driven (Appx I)
    return ("PASS", "")
# --------- Validation per file ---------
def validate_file(path: str) -> List[Tuple[str, str]]:
    """
    Returns list of tuples: (level, message)
      level in {"PASS","WARN","FAIL"}
    """
    msgs: List[Tuple[str,str]] = []
    try:
        data, body = load_frontmatter_and_body(path)
    except Exception as e:
        return [("FAIL", str(e))]

    # Required YAML keys
    required_yaml = ["id","query","packs","primary_ids","capability_tags","sources","ui","output_mode","graph_required"]
    for k in required_yaml:
        if k not in data:
            msgs.append(("FAIL", f"Missing YAML key: {k}"))

    # Packs
    packs = data.get("packs") or []
    if not isinstance(packs, list) or not packs:
        msgs.append(("FAIL","packs must be a non-empty list"))
    else:
        for p in packs:
            if p not in ALLOWED_PACKS:
                msgs.append(("WARN", f"Unknown pack '{p}' (not in guide’s allowed set)"))

    # IDs canonical
    primary_ids = data.get("primary_ids") or []
    overlap_ids = data.get("overlap_ids") or []
    for field_name, id_list in [("primary_ids", primary_ids), ("overlap_ids", overlap_ids)]:
        if not isinstance(id_list, list):
            msgs.append(("FAIL", f"{field_name} must be a list"))
            id_list = []
        bad = find_noncanonical_ids(id_list)
        if bad:
            msgs.append(("FAIL", f"Non-canonical IDs in {field_name}: {bad}"))
        pack_mismatch = ensure_pack_ids_match(id_list)
        for w in pack_mismatch:
            msgs.append(("WARN", w))

    if not primary_ids:
        msgs.append(("FAIL","primary_ids is empty"))

    # capability_tags: 3–6 (guide §6.2). Use WARN if outside range.
    caps = data.get("capability_tags") or []
    if not isinstance(caps, list) or not caps:
        msgs.append(("FAIL","capability_tags must be a non-empty list"))
    else:
        unknown = [c for c in caps if c not in ALLOWED_CAPABILITY_TAGS]
        if unknown:
            msgs.append(("FAIL", f"Unknown capability_tags: {unknown}"))
        if len(caps) < 3 or len(caps) > 6:
            msgs.append(("WARN", f"capability_tags should be 3–6 (found {len(caps)})"))

    # sources in YAML
    sources = data.get("sources") or []
    if not isinstance(sources, list) or not sources:
        msgs.append(("FAIL","sources missing or empty"))
    else:
        for i, s in enumerate(sources, 1):
            for sub in ("title","id","locator"):
                if not norm(s.get(sub)):
                    msgs.append(("FAIL", f"source #{i} missing {sub}"))
            sid = norm(s.get("id"))
            if sid and not is_canonical_id(sid):
                msgs.append(("FAIL", f"source #{i} id not canonical: {sid}"))

    # output_mode
    if data.get("output_mode") not in ALLOWED_OUTPUT_MODES:
        msgs.append(("FAIL", f"output_mode must be one of {sorted(ALLOWED_OUTPUT_MODES)}"))

    # cards_hint constraints
    cards = (data.get("ui") or {}).get("cards_hint") or []
    if cards:
        if len(cards) > MAX_CARDS_HINT:
            msgs.append(("WARN", f"cards_hint should have ≤{MAX_CARDS_HINT} items"))
        for c in cards:
            if len(c) > MAX_CARD_CHARS:
                msgs.append(("WARN", f"cards_hint item over {MAX_CARD_CHARS} chars: '{c}'"))

    # ui.actions checks
    for a_type, target in parse_ui_actions(data.get("ui") or {}):
        level, message = check_ui_action(a_type, target)
        if level != "PASS":
            msgs.append((level, message))
        # If non-canonical target: check @product-taxonomy note present
        if level == "WARN" and ("not canonical" in message):
            notes = norm(data.get("notes",""))
            if "@product-taxonomy" not in notes:
                msgs.append(("WARN", "Non-canonical UI target without '@product-taxonomy' note in `notes`"))

    # body sections (presence + order)
    msgs += [("FAIL", e) for e in check_sections_order(body)]

    # Flags in YAML (if any)
    for f in data.get("flags") or []:
        if f not in ALLOWED_FLAGS:
            msgs.append(("WARN", f"Unknown flag in YAML: '{f}'"))

    # Flags in body like [LOCAL LAW CHECK]
    for flag in re.findall(r"\[(.*?)\]", body):
        if flag in {"",}:
            continue
        if flag not in ALLOWED_FLAGS:
            # Don’t fail—authors sometimes bracket non-flags; warn only.
            msgs.append(("WARN", f"Bracketed tag in body not in allowed flags: [{flag}]"))

    # Sources cross-check: ensure body has a Sources section & at least one entry
    body_sources = extract_sources_from_body(body)
    if not body_sources:
        msgs.append(("FAIL","Body lacks **Sources** entries"))
    # Soft check: ensure at least one YAML source ID pack appears in body Sources text
    yaml_pack_prefixes = {sid.split("/",1)[0] for sid in [s.get("id","") for s in sources if s.get("id")]}
    if body_sources and yaml_pack_prefixes:
        joined = " | ".join(body_sources)
        if not any(pfx.split(":")[0] in joined for pfx in yaml_pack_prefixes):
            msgs.append(("WARN","Body Sources don’t appear to reference YAML packs (manual check advised)"))

    return msgs

# --------- Runner ---------
def main():
    rows = []   # for CSV
    issues_summary = []  # for MD
    files_scanned = 0
    fails = 0

    for root, _, files in os.walk(QA_DIR):
        for fn in files:
            if not fn.lower().endswith((".md",".yml",".yaml")):
                continue
            path = os.path.join(root, fn)
            files_scanned += 1
            msgs = validate_file(path)

            max_level = "PASS"
            for lvl, _ in msgs:
                if lvl == "FAIL":
                    max_level = "FAIL"; break
                elif lvl == "WARN" and max_level != "FAIL":
                    max_level = "WARN"
            if max_level == "FAIL":
                fails += 1

            # record
            issues_summary.append((path, max_level, msgs))
            for lvl, msg in msgs:
                rows.append({"file": path, "level": lvl, "message": msg})

    # Write CSV
    with open(REPORT_CSV, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["file","level","message"])
        w.writeheader()
        for r in rows:
            w.writerow(r)

    # Write MD
    lines = []
    lines.append(f"# QA Validation Report")
    lines.append(f"_Generated: {datetime.utcnow().isoformat()}Z_")
    lines.append(f"\n**Files scanned:** {files_scanned}")
    lines.append(f"**Files with FAIL issues:** {fails}\n")

    if not issues_summary:
        lines.append("✅ No QA files found (check QA_DIR).")
    else:
        for path, status, msgs in sorted(issues_summary, key=lambda x: (x[1], x[0])):
            badge = "✅ PASS" if status=="PASS" else ("⚠️ WARN" if status=="WARN" else "❌ FAIL")
            lines.append(f"\n## {badge} — {path}")
            if not msgs:
                lines.append("- No issues.")
            else:
                for lvl, m in msgs:
                    emoji = "❌" if lvl=="FAIL" else ("⚠️" if lvl=="WARN" else "✅")
                    lines.append(f"- {emoji} **{lvl}**: {m}")

    with open(REPORT_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Report written: {REPORT_MD}\nCSV: {REPORT_CSV}")
    sys.exit(1 if fails else 0)

if __name__ == "__main__":
    main()

