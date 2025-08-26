# ArionComply Metadata & Authoring Guide (v2, JSON-based, generalized)

*Aligned with ArionComply v2 architecture, retrieval, calibration pipeline, and UI catalog integration. This is a full‑granularity rewrite of v1 with JSON metadata and generalized artifact coverage. All author‑facing rules from v1 are preserved or expanded. DB‑specific enumerations are removed and replaced by an export‑on‑change `ui_catalog.json` reference.*

---

## 0) Purpose, Scope & Audience

**Audience:** beginners to compliance using our platform.

**Purpose:** author accurate, actionable content with canonical metadata for ingestion into RAG, Graph, UI, and calibration pipelines.

**Scope:** Q/A, policy, procedure, template/guide, mapping, register/tracker references via UI actions. Not legal advice.

**Frameworks (authoring):**
- **Live:** ISO/IEC 27001:2022, ISO/IEC 27701:2019
- **Future-enabled:** GDPR:2016, CPRA:2023, NIS2:2023, EU AI Act:2024
- Extensible without schema change.

**Outcome:** every artifact has a `metadata.json` that validates against `schemas/metadata-v1.json`, and an optional `body.md` that follows the correct template for its type.

---

## 1) File Format & Submission

**Canonical layout (per artifact):**
```
content/<framework>/<type>/<slug>/
  metadata.json      # required, JSON
  body.md            # optional for long-form bodies
```

**Accepted inputs:** Markdown + JSON (canonical), `.docx` (converted during ingest).

**Multiple Q/A in one file:** permissible for drafting. Conversion script will split into canonical layout.

**Repo paths:**
- Sources: `content/...`
- Schemas: `schemas/metadata-v1.json`
- Config: `config/ui_catalog.json` (exported on change)
- Derived: `docs/derived/*` (gold sets, synonyms, graph edges, integration cases)

---

## 2) Style Rules

- Friendly and plain English. No legal advice or speculation.
- If unknown, write `[RESEARCH NEEDED]` and proceed.
- Cite only standards with exact article/section numbers.
- Define jargon before use.
- Keep neutral tone about consultants and externals.
- Prefer active voice, short sentences, concrete steps.
- Do not promise integrations or automation that do not exist.

**Legal note (use only when relevant):**
> We are not your lawyers and this is not legal advice. Where country-specific nuances apply, add `[LOCAL LAW CHECK]`.

---

## 3) Body Templates (by artifact type)

### 3.1 Q/A — 8‑part template (required in every Q/A `body.md`)
1. **Standard terms** — define jargon used in question and answer.
2. **Plain-English answer** — 3–6 sentences, crisp and specific.
3. **Applies to** — **Primary** (standard+article) and **Also relevant / Overlaps** (crosswalk).
4. **Why it matters** — one line business impact.
5. **Do next in our platform** — concrete steps as a checklist.
6. **How our platform will help** — use capability tags from §6.2 in brackets.
7. **Likely follow‑ups** — logical next questions; apply flags as needed.
8. **Sources** — list standards and exact clauses/articles only.

**Placement of flags:** at the end of the sentence they qualify.

---

### 3.2 Policy — body template
1. **Policy statement** — declarative statement of intent and requirement.
2. **Scope & applicability** — systems, people, processes, locations.
3. **Control objectives** — map to standards clauses.
4. **Roles & responsibilities** — owners, approvers, reviewers.
5. **Review & approval cadence** — frequency, triggers, versioning rules.
6. **Sources** — standards, clauses.

---

### 3.3 Procedure — body template
1. **Purpose** — why this procedure exists.
2. **Steps** — ordered list with clear outcomes.
3. **Responsibilities & roles** — RACI if useful.
4. **Evidence collected** — what to attach and where.
5. **Frequency/review** — cadence and triggers.
6. **Sources** — standards, clauses.

---

### 3.4 Template / Guide — body template
1. **Context** — when to use this template.
2. **Structure/sections** — what parts the template provides.
3. **Parameters** — variables to fill; reference `ui.actions` if a workflow creates it.
4. **Linkage** — related workflows, registers, trackers.
5. **Sources** — standards, clauses when relevant.

---

## 4) JSON Metadata Schema (machine fields)

**Validation:** JSON Schema 2020‑12. File `schemas/metadata-v1.json`. New fields are optional unless marked required.

```json
{
  "$id": "https://iso.arionetworks.com/schemas/metadata-v1.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["id","version","artifact","standard","lifecycle","security","provenance"],
  "additionalProperties": false,
  "properties": {
    "id": {"type":"string"},
    "version": {"type":"string"},
    "artifact": {
      "type":"object",
      "required":["type","title","language","status"],
      "properties":{
        "type":{"enum":["qa","policy","procedure","register","tracker","template","mapping","guide"]},
        "title":{"type":"string"},
        "description":{"type":"string"},
        "language":{"type":"string"},
        "locale":{"type":"string"},
        "status":{"enum":["draft","in_review","approved","published","deprecated"]},
        "tags":{"type":"array","items":{"type":"string"}},
        "display_date":{"type":"string"}
      }
    },
    "standard": {
      "type":"object",
      "required":["framework","version"],
      "properties":{
        "framework":{"type":"string"},
        "version":{"type":"string"},
        "spec_id":{"type":"string"},
        "jurisdictions":{"type":"array","items":{"type":"string"}},
        "clauses":{"type":"array","items":{"type":"string"}},
        "mappings":{"type":"array","items":{
          "type":"object",
          "required":["to","strength"],
          "properties":{
            "to":{"type":"string"},
            "strength":{"enum":["exact","partial","related"]},
            "weight":{"type":"number","minimum":0,"maximum":1},
            "rationale":{"type":"string"}
          }
        }}
      }
    },
    "content": {
      "type":"object",
      "properties":{
        "qa":{"type":"object","properties":{
          "question":{"type":"string"},
          "answer":{"type":"string"},
          "answer_steps":{"type":"array","items":{"type":"string"}},
          "audiences":{"type":"array","items":{"enum":["exec","security","it","legal","all"]}},
          "difficulty":{"enum":["intro","practitioner","expert"]},
          "variants":{"type":"array","items":{"type":"object","properties":{
            "audience":{"type":"string"},
            "answer":{"type":"string"},
            "redacted":{"type":"boolean"}
          }}}
        }},
        "document":{"type":"string"},
        "placeholders":{"type":"object","additionalProperties":{"type":"string"}},
        "score_hint":{"type":"object","properties":{
          "criticality":{"enum":["low","medium","high"]},
          "audit_impact":{"enum":["minor","moderate","major"]}
        }}
      }
    },
    "evidence": {
      "type":"object",
      "properties":{
        "expected":{"type":"array","items":{"type":"string"}},
        "collection":{"enum":["manual","automated","hybrid"]},
        "retention_days":{"type":"integer"},
        "locations":{"type":"array","items":{"type":"string"}},
        "hash":{"type":"string"},
        "signed_by":{"type":"string"},
        "chain_of_custody":{"type":"array","items":{"type":"string"}}
      }
    },
    "retrieval": {
      "type":"object",
      "properties":{
        "embeddings":{"type":"object","properties":{
          "model":{"type":"string"},
          "chunk_size":{"type":"integer"},
          "overlap":{"type":"integer"}
        }},
        "splitter":{"enum":["markdown","semantic","token"]},
        "per_section":{"type":"boolean"},
        "keywords":{"type":"array","items":{"type":"string"}},
        "summarization":{"type":"object","properties":{
          "model":{"type":"string"},
          "prompt_hash":{"type":"string"}
        }},
        "rerank":{"type":"object","properties":{
          "model":{"type":"string"},
          "version":{"type":"string"}
        }},
        "rerank_hint":{"type":"string"}
      }
    },
    "relations": {
      "type":"array",
      "items":{"type":"object","properties":{
        "id":{"type":"string"},
        "type":{"enum":["duplicates","supersedes","depends_on","conflicts_with","see_also"]}
      }}}
    },
    "governance": {
      "type":"object",
      "properties":{
        "soa_ids":{"type":"array","items":{"type":"string"}},
        "risk_ids":{"type":"array","items":{"type":"string"}},
        "control_ids":{"type":"array","items":{"type":"string"}},
        "test_ids":{"type":"array","items":{"type":"string"}},
        "capa_ids":{"type":"array","items":{"type":"string"}},
        "task_ids":{"type":"array","items":{"type":"string"}},
        "kpi":{"type":"array","items":{"type":"string"}}
      }
    },
    "workflow": {
      "type":"object",
      "properties":{
        "state":{"enum":["draft","in_review","approved","published","deprecated"]},
        "approvals":{"type":"array","items":{"type":"object","properties":{
          "by":{"type":"string"},
          "at":{"type":"string","format":"date-time"},
          "signature":{"type":"string"}
        }}} ,
        "changelog":{"type":"array","items":{"type":"object","properties":{
          "at":{"type":"string","format":"date-time"},
          "by":{"type":"string"},
          "note":{"type":"string"}
        }}}
      }
    },
    "roles": {
      "type":"object",
      "properties":{
        "owner":{"type":"string"},
        "approver":{"type":"string"},
        "reviewers":{"type":"array","items":{"type":"string"}},
        "raci":{"type":"array","items":{"type":"object","properties":{
          "role":{"type":"string"},
          "level":{"enum":["R","A","C","I"]}
        }}} ,
        "tenant_id":{"type":"string"}
      }
    },
    "i18n": {
      "type":"object",
      "properties":{
        "translations":{"type":"array","items":{"type":"object","properties":{
          "locale":{"type":"string"},
          "title":{"type":"string"},
          "answer":{"type":"string"},
          "keywords":{"type":"array","items":{"type":"string"}}
        }}}
      }
    },
    "privacy": {
      "type":"object",
      "properties":{
        "data_categories":{"type":"array","items":{"type":"string"}},
        "lawful_basis":{"type":"array","items":{"type":"string"}},
        "role":{"enum":["controller","processor","joint"]},
        "dpa_refs":{"type":"array","items":{"type":"string"}},
        "dpia_id":{"type":"string"}
      }
    },
    "security": {
      "type":"object",
      "properties":{
        "confidentiality":{"enum":["public","internal","confidential","restricted"]},
        "pii":{"type":"boolean"},
        "field_sensitivity":{"type":"object","additionalProperties":{"enum":["public","internal","confidential","restricted"]}},
        "export_controls":{"type":"array","items":{"type":"string"}},
        "license_spdx":{"type":"string"},
        "license":{"type":"string"}
      }
    },
    "lifecycle": {
      "type":"object",
      "properties":{
        "created_at":{"type":"string","format":"date-time"},
        "updated_at":{"type":"string","format":"date-time"},
        "review_cycle_days":{"type":"integer"},
        "owners":{"type":"array","items":{"type":"string"}}
      }
    },
    "provenance": {
      "type":"object",
      "properties":{
        "source":{"enum":["human","llm","import"]},
        "sources":{"type":"array","items":{"type":"string"}},
        "gen_model":{"type":"string"},
        "gen_params":{"type":"object"},
        "prompt_hash":{"type":"string"},
        "guardrail_policy_ids":{"type":"array","items":{"type":"string"}},
        "confidence":{"type":"number","minimum":0,"maximum":1}
      }
    },
    "ui": {
      "type":"object",
      "properties":{
        "cards_hint":{"type":"array","items":{"type":"string"}},
        "actions":{"type":"array","items":{"type":"object","properties":{
          "type":{"enum":["open_register","open_tracker","start_workflow","open_template","create_policy","upload_evidence"]},
          "target":{"type":"string"},
          "label":{"type":"string"},
          "params":{"type":"object"}
        }}}
      }
    },
    "packs": {"type":"array","items":{"type":"string"}},
    "primary_ids": {"type":"array","items":{"type":"string"}},
    "overlap_ids": {"type":"array","items":{"type":"string"}},
    "capability_tags": {"type":"array","items":{"type":"string"}},
    "flags": {"type":"array","items":{"type":"string"}},
    "sources": {"type":"array","items":{"type":"object","properties":{
      "title":{"type":"string"},
      "id":{"type":"string"},
      "locator":{"type":"string"}
    }}}
  }
}
```

**Canonical ID format:** `PACK:YEAR/SECTION` (e.g., `ISO27001:2022/A.8.12`, `GDPR:2016/Art.33`).

---

## 5) Platform Stance

- We assist as expert, internal manager, consultant, and trainer.
- We generate and manage: policies, processes, SoA, DPIA/TIA, DPA/SCC packs, notices; registers and trackers.
- We run workflows: DSR, DPIA, incident/breach, vendor due diligence, internal audit, management review, exceptions/CAPs.
- We provide dashboards, reports, guided evidence collection, and classification assistance.
- We do not publish a public trust center or give legal conclusions.

---

## 6) Controlled Vocabularies and Flags

### 6.1 Framework pack IDs
- Live: `ISO27001:2022`, `ISO27701:2019`
- Future-enabled: `GDPR:2016`, `CPRA:2023`, `NIS2:2023`, `EUAI:2024`

### 6.2 Capability tags (public set, allowed in metadata)
`[NL-Portal]`, `[Draft Doc]`, `[Approval]`, `[Versioning]`, `[Register]`, `[Tracker]`, `[Workflow]`, `[Reminder]`, `[Planner]`, `[Dashboard]`, `[Report]`, `[Virtual Manager]`, `[Classify-Assist]`, `[Evidence-Guided]`

Extended tags (e.g., `SoA`, `Risk`, `Control`, `Evidence`, `DPIA`, `RoPA`) are allowed in prose but are not parsed. Use `ui.actions` to drive UI.

### 6.3 Decision flags
- `[LOCAL LAW CHECK]` national/state implementation may vary.
- `[CB POLICY VARIES]` certification body scheme details may differ.
- `[MARKET PRACTICE—VALIDATE]` industry practice not set by law/standard.
- `[RESEARCH NEEDED]` not verifiable now.

Place flags at sentence end.

### 6.4 UI action types
- `open_register`, `open_tracker`, `start_workflow`, `open_template`, `create_policy`, `upload_evidence`
- **Targets and params must come from** `config/ui_catalog.json` (exported on change). Authors may not invent targets.

### 6.5 Canonicalization and lint rules
- **Fail** commit if `metadata.json` contains non‑canonical IDs.
- **Warn** if prose uses variants; normalized during parsing.
- Normalizer steps:
  1. Convert `PACK:YEAR SECTION` to `PACK:YEAR/SECTION`.
  2. Remove `Annex.` when followed by `A.` for ISO 27001.
  3. Collapse duplicate dots and trim spaces.

### 6.6 URL and filename safety
- Encode IDs in URLs or pass as structured params (`pack, ver, section`).
- Do not use IDs in filenames; slugify as `ISO27001-2022__A.8.12` when needed.

---

## 7) Consultants and Externals

- Neutral tone. Do not default to recommending consultants.
- Certification bodies are required for ISO certification.
- Legal counsel may be required for legal interpretations.
- Mention pen-testing only when asked or relevant.

---

## 8) Sourcing and Uncertainty

- Cite only standards and exact clauses/articles: e.g., GDPR Art. 33; ISO 27001 Cl. 9.2; NIS2 Art. 23; EU AI Act Annex III.
- Use `[LOCAL LAW CHECK]` or `[CB POLICY VARIES]` when relevant.
- Use `[RESEARCH NEEDED]` when not verifiable.

---

## 9) Do / Don’t Quick List

**Do**
- Define jargon, keep answers actionable, map to platform steps.
- Use precise citations, tags, and canonical IDs.
- Align “Do next” with UI actions and approved buckets.

**Don’t**
- Add legal boilerplate unless relevant.
- Promise features we do not have.
- Recommend consultants by default.

---

## 10) Authoring Micro‑Templates

### 10.1 Q/A — JSON metadata skeleton
```json
{
  "id": "Q###",
  "query": "{Question}",
  "packs": ["ISO27001:2022","ISO27701:2019"],
  "primary_ids": ["{Pack}:{Version}/{SectionID}"],
  "overlap_ids": ["{Pack}:{Version}/{SectionID}"],
  "capability_tags": ["Register","Workflow","Evidence"],
  "flags": [],
  "sources": [{"title":"{Source title}","id":"{Pack}:{Version}/{SectionID}","locator":"{page/section/url}"}],
  "ui": {
    "cards_hint": ["{Short card subtitle}", "{Another}"],
    "actions": [
      {"type":"open_register","target":"soa","label":"Update SoA"},
      {"type":"upload_evidence","target":"soa_evidence_pack","label":"Attach SoA pack"}
    ]
  },
  "output_mode": "both",
  "graph_required": false,
  "notes": "{Author guidance or constraints}",
  "artifact": {"type":"qa","title":"{Title}","language":"en","status":"draft"},
  "standard": {"framework":"ISO27001","version":"2022","clauses":["ISO27001:2022/{SectionID}"]},
  "lifecycle": {"created_at":"{ISO8601}","updated_at":"{ISO8601}"},
  "security": {"confidentiality":"internal","pii":false},
  "provenance": {"source":"human"}
}
```

**Q/A body.md** (8‑part template from §3.1).

---

### 10.2 Policy — JSON metadata skeleton
```json
{
  "id":"POL-####",
  "version":"1.0.0",
  "artifact":{"type":"policy","title":"Access Control Policy","language":"en","status":"draft","tags":["access_control"]},
  "standard":{"framework":"ISO27001","version":"2022","clauses":["ISO27001:2022/A.5.15","ISO27002:2022/5.15"]},
  "packs":["ISO27001:2022"],
  "primary_ids":["ISO27001:2022/A.5.15"],
  "overlap_ids":["ISO27002:2022/5.15"],
  "capability_tags":["Draft Doc","Approval","Versioning"],
  "ui":{ "actions":[{"type":"create_policy","target":"access_control_policy","label":"Create draft"}]},
  "lifecycle":{"created_at":"2025-08-26T08:00:00Z","updated_at":"2025-08-26T08:00:00Z","review_cycle_days":365},
  "security":{"confidentiality":"internal","pii":false},
  "provenance":{"source":"human"}
}
```

**Policy body.md** uses template from §3.2.

---

### 10.3 Procedure — JSON metadata skeleton
```json
{
  "id":"PROC-####",
  "version":"1.0.0",
  "artifact":{"type":"procedure","title":"Vulnerability Management","language":"en","status":"approved"},
  "standard":{"framework":"ISO27001","version":"2022","clauses":["ISO27001:2022/A.8.8"]},
  "packs":["ISO27001:2022"],
  "primary_ids":["ISO27001:2022/A.8.8"],
  "capability_tags":["Workflow","Evidence-Guided","Tracker"],
  "evidence":{"expected":["vulnerability_scan_reports","remediation"],"collection":"automated"},
  "ui":{"actions":[{"type":"open_tracker","target":"security_assessments","label":"Open assessments"}]},
  "lifecycle":{"created_at":"2025-08-26T08:10:00Z","updated_at":"2025-08-26T08:10:00Z"},
  "security":{"confidentiality":"internal","pii":false},
  "provenance":{"source":"human"}
}
```

**Procedure body.md** uses template from §3.3.

---

### 10.4 Template/Guide — JSON metadata skeleton
```json
{
  "id":"TPL-####",
  "version":"1.0.0",
  "artifact":{"type":"template","title":"DPIA Template","language":"en","status":"approved"},
  "standard":{"framework":"ISO27701","version":"2019","clauses":["ISO27701:2019/7.3.1"]},
  "packs":["ISO27701:2019","GDPR:2016"],
  "primary_ids":["ISO27701:2019/7.3.1"],
  "overlap_ids":["GDPR:2016/Art.35"],
  "capability_tags":["Draft Doc","Workflow"],
  "ui":{"actions":[{"type":"start_workflow","target":"dpia","label":"Start DPIA","params":{"system_name":"{Name}","owner_role":"DPO","due_in_days":30}}]},
  "lifecycle":{"created_at":"2025-08-26T08:20:00Z","updated_at":"2025-08-26T08:20:00Z"},
  "security":{"confidentiality":"internal","pii":false},
  "provenance":{"source":"human"}
}
```

**Template/Guide body.md** uses template from §3.4.

---

## 11) Fully Worked Examples

### 11.1 Q/A example — A.8.12 malware protection (metadata.json + body.md)

**metadata.json**
```json
{
  "id": "Q021",
  "version": "1.0.0",
  "artifact": {"type":"qa","title":"What evidence is acceptable for ISO 27001 A.8.12?","language":"en","status":"approved","tags":["evidence","security"]},
  "packs": ["ISO27001:2022","ISO27002:2022"],
  "primary_ids": ["ISO27001:2022/A.8.12"],
  "overlap_ids": ["ISO27002:2022/8.12"],
  "capability_tags": ["Evidence","Control","SoA","Register","Workflow"],
  "flags": [],
  "sources": [
    {"title":"ISO/IEC 27001:2022 — Annex A.8.12","id":"ISO27001:2022/A.8.12","locator":"Annex A"},
    {"title":"ISO/IEC 27002:2022 — 8.12 Protection against malware","id":"ISO27002:2022/8.12","locator":"Section 8.12"}
  ],
  "ui": {
    "cards_hint": ["Evidence for malware protection","Coverage, updates, alerts, exceptions"],
    "actions": [
      {"type": "upload_evidence", "target": "malware_protection_controls", "label": "Attach AV/EDR configs & update logs"},
      {"type": "open_register", "target": "soa", "label": "Update SoA mapping for A.8.12"}
    ]
  },
  "output_mode": "both",
  "graph_required": false,
  "notes": "Prefer explicit technical controls and evidence fields; map exceptions with approvals.",
  "standard": {"framework":"ISO27001","version":"2022","clauses":["ISO27001:2022/A.8.12"]},
  "evidence": {"expected":["edr_policies_exports","endpoint_protection_logs","incident_tickets","soa_evidence_pack"],"collection":"hybrid","retention_days":1095},
  "retrieval": {"embeddings":{"model":"text-embedding-3-large","chunk_size":1200,"overlap":200},"keywords":["continuous compliance","malware protection"],"rerank_hint":"maintenance vs certification"},
  "lifecycle": {"created_at":"2025-08-26T07:30:00Z","updated_at":"2025-08-26T07:30:00Z","review_cycle_days":180},
  "security": {"confidentiality":"internal","pii":false},
  "provenance": {"source":"human","confidence":0.9}
}
```

**body.md**
```
### 1) What evidence is acceptable for ISO 27001 A.8.12 (malware protection)?

**Standard terms**
- Malware protection: controls to prevent, detect, and recover from malware on endpoints, servers, email and web gateways.

**Plain-English answer**
Provide evidence that malware controls are implemented, up to date, and monitored. Typical artifacts include: configuration/export from your AV/EDR tool (policies, exclusions), coverage report (assets in scope vs protected), update/signature logs showing regular updates, alert and incident tickets with triage and resolution, and any approved exceptions with compensating controls. Link these to SoA control A.8.12 and record ownership and review cadence. Avoid generic screenshots without dates or scope.

**Applies to**
- Primary: ISO27001:2022 A.8.12.
- Also relevant/Overlaps: ISO27002:2022 8.12 (implementation guidance).

**Why it matters**
Demonstrates that malware risk is actively managed and detections surface with timely response.

**Do next in our platform**
- Inventory assets and systems; mark which are covered by AV/EDR.
- Upload current AV/EDR policy config and coverage/export.
- Ingest last 90 days of update logs and alert tickets.
- Record exceptions with justification and compensating controls; set review dates.
- Update SoA to reference tool names, owners, and review cadence.

**How our platform will help**
- [Register] Track covered assets and coverage deltas.
- [Evidence-Guided] Prompts for required artifacts (configs, logs, tickets).
- [Workflow] Exception approval flow with expiry reminders.
- [SoA] Map A.8.12 to implemented controls and owners.
- [Dashboard] Coverage percent, update freshness, open alerts.

**Likely follow‑ups**
- Do we need EDR rather than AV? [MARKET PRACTICE—VALIDATE]
- How long should we retain logs? [LOCAL LAW CHECK]
- How to handle isolated servers without internet updates? [RESEARCH NEEDED]

**Sources**
- ISO/IEC 27001:2022 — Annex A.8.12.
- ISO/IEC 27002:2022 — 8.12 Protection against malware.
```

---

### 11.2 Policy example — Access Control Policy (metadata.json + body.md)

**metadata.json** (see 10.2). **body.md** should follow §3.2 with mapped clauses and review cadence.

---

### 11.3 Procedure example — Vulnerability Management (metadata.json + body.md)

**metadata.json** (see 10.3). **body.md** should follow §3.3 with steps, roles, evidence.

---

## 12) Pipeline and Repo Mapping

**Author sources:** `content/...`.

**Derived outputs (generated):**
- **Gold JSONL**: `docs/derived/gold_set.jsonl`.
- **Synonyms proposals**: `docs/derived/synonyms_proposed.csv`.
- **Graph edges proposals**: `docs/derived/graph_edges_proposed.csv`.
- **Integration cases**: `docs/derived/integration_cases.json`.

**Governance:** proposals reviewed before ingestion. Gold set changes trigger calibration.

---

## 13) Author Checklist

- [ ] Canonical IDs use `PACK:YEAR/SECTION`.
- [ ] Packs reflect frameworks the answer depends on.
- [ ] 3–6 capability tags used.
- [ ] UI actions and targets exist in `ui_catalog.json`.
- [ ] Evidence buckets from approved list in `ui_catalog.json`.
- [ ] Sources cite clauses/articles only; locators included when stable.
- [ ] Flags placed at end of sentence and used sparingly.
- [ ] Prose follows the correct body template and length.
- [ ] “Do next” steps align with platform and UI actions.
- [ ] JSON validates against schema and qa_lint passes.

---

## 14) Migration from YAML and CI

**Convert YAML → JSON** (if migrating legacy files):
```bash
yq 'explode(.)' input.yaml | yq -o=json > metadata.json
```

**Validate JSON:**
```bash
ajv validate -s schemas/metadata-v1.json -d content/**/metadata.json
```

**CI checks:**
- JSON Schema validation
- Canonical ID linter
- `ui.actions` targets and params exist in `ui_catalog.json`
- Optional: embedding settings sanity checks

---

## 15) Notes on Dependencies and Practical Implementation

- Registers, trackers, workflows, templates, and evidence buckets are implemented in the application database. Authors do not define DB structure. They reference a stable, exported catalog.
- Export the `ui_catalog.json` **on change**. Allow manual re-baseline when detection is unclear.
- Content remains portable across cloud and on‑prem deployments as long as the catalog is shipped with each environment.

---

## 16) Glossary (selected)
- **Artifact**: authored item such as a Q/A, policy, procedure, or template.
- **Pack**: framework and version identifier, e.g., `ISO27001:2022`.
- **Canonical ID**: `PACK:YEAR/SECTION` string, e.g., `GDPR:2016/Art.33`.
- **Evidence bucket**: named target for uploaded artifacts managed by the platform.
- **Capability tag**: standardized label for platform features used in “How our platform will help”.

---

## Appendices

### Appendix A — UI Catalog (export-on-change)


- Static lists removed from guide. Authors must reference `config/ui_catalog.json` exported from the application database **on change** or via manual re-baseline.

- All registers, trackers, workflows, and evidence buckets were hard‑coded here. In v2 these are exported dynamically to `config/ui_catalog.json`.

### Obtaining the catalog

- **Generated by app**: The application exports `config/ui_catalog.json` automatically **on schema change** or by manual re-baseline.
- **Location**: always under the repo root in `/config/ui_catalog.json`.
- **Versioning**: each export includes a timestamp (`version` field). Commit into Git for traceability.

### Using the catalog

- **Authoring**: reference only slugs/targets that appear in the current catalog.
- **Validation**: CI checks `ui.actions[*].target` against the catalog.
- **Params**: workflows may require structured params; see catalog for required keys.
- **Extending**: propose new slugs by PR flagged to `@product-taxonomy`.


- Minimal shape:
```json
{
  "version": "2025-08-26T08:00:00Z",
  "registers": [{"slug":"soa","label":"Statement of Applicability"}],
  "trackers": [{"slug":"cap_nc","label":"Non-conformities & Corrective Actions"}],
  "workflows": [{"slug":"dpia","label":"DPIA/TIA","params":{"system_name":"string","owner_role":"string","due_in_days":"integer"}}],
  "templates": [{"slug":"access_control_policy","category":"policy"}],
  "evidence_buckets": ["soa_evidence_pack","edr_policies_exports"]
}
```
- CI validation checks `ui.actions[*].target` and workflow params against this catalog.
- **Naming rules for evidence buckets:** lowercase `snake_case`, nouns only, prefer system/control‑oriented names.

---

### Appendix B — Capability Tags in JSON vs Prose
- Metadata `capability_tags`: use only the **public set** (`[NL-Portal]`, `[Draft Doc]`, `[Approval]`, `[Versioning]`, `[Register]`, `[Tracker]`, `[Workflow]`, `[Reminder]`, `[Planner]`, `[Dashboard]`, `[Report]`, `[Virtual Manager]`, `[Classify-Assist]`, `[Evidence-Guided]`).
- Prose: may use extended tags (`SoA`, `Risk`, `Control`, `Evidence`, `DPIA`, `RoPA`) but these are not parsed.
- To drive UI, always use `ui.actions` not extended capability tags.

---

### Appendix C — Source Locators
- `sources[*].locator` may be empty when page numbers are unstable.
- Prefer section labels over page numbers: “Annex A”, “Art. 33”, “8.12”.
- Avoid third‑party URLs as locators.

---

### Appendix D — When to set `graph_required: true`
- Set `true` when the answer depends on cross‑standard mapping for correct retrieval or evaluation (e.g., ISO27001 ↔ GDPR Art. 32 alignment).
- Leave `false` when primary pack clauses fully satisfy the answer.

---

### Appendix E — `cards_hint` Guidance
- Provide 1–3 short items (≤40 chars).
- Use nouns/noun phrases, not full sentences.
- Order by usefulness.
- Avoid duplicating the question.

---

### Appendix F — Aligning “Do next” with targets
- Steps in body should match `ui.actions` in metadata.
- Use `open_register` for registers, `open_tracker` for trackers, `start_workflow` to kick off guided flows, `upload_evidence` to attach artifacts.
- Do not invent names; propose additions through product taxonomy workflow.
  
**Examples:**

  - “Update SoA mapping” → `open_register: soa`
  - “Start DPIA” → `start_workflow: dpia`
  - “Open CAP tracker” → `open_tracker: cap_nc`
  - “Upload SoA evidence pack” → `upload_evidence: soa_evidence_pack`

---

### Appendix G — One‑Page Cheat Sheet
- **IDs:** `PACK:YEAR/SECTION` (quote in JSON; encode in URLs; slugify in filenames).
- **Graph flag:** only when cross‑framework mapping is required.
- **Cards hint:** up to 3 short noun phrases.
- **Tags:** `[NL-Portal]` `[Draft Doc]` `[Approval]` `[Versioning]` `[Register]` `[Tracker]` `[Workflow]` `[Reminder]` `[Planner]` `[Dashboard]` `[Report]` `[Virtual Manager]` `[Classify-Assist]` `[Evidence-Guided]`
- **UI:** use action types from §6.4 and targets from `ui_catalog.json`.

**Minimal metadata skeleton:**

```json
{
  "id": "Q###",
  "query": "{Question}",
  "packs": ["ISO27001:2022"],
  "primary_ids": ["ISO27001:2022/A.8.12"],
  "capability_tags": ["Register","Workflow","Evidence"],
  "ui": {
    "cards_hint": ["{hint1}","{hint2}"],
    "actions": [
      {"type":"open_register","target":"soa","label":"Update SoA"},
      {"type":"upload_evidence","target":"soa_evidence_pack","label":"Attach SoA pack"}
    ]
  },
  "output_mode":"both",
  "graph_required":false
}
```

**Quick Do next patterns:**

- Register update → `open_register`
- Start workflow → `start_workflow`
- Track finding → `open_tracker`
- Attach evidence → `upload_evidence`

---

## Appendix H — Workflow Templates vs Instances

- **Templates**: stateless definitions (slug + params).
- **Instances**: runtime objects with state, owners, SLAs.
- **Canonical states** (examples):
  - `dpia`: draft → in\_review → approved → closed
  - `incident_breach`: open → triage → contained → resolved → closed
  - `internal_audit`: planned → fieldwork → report → closed
  - `management_review`: scheduled → held → actions\_open → closed
- **Triggers**:
  - UI action (`start_workflow`)
  - API/webhook
  - Register/tracker event
  - Chained workflow (auto‑spawn)

---

## Appendix I — Artifact Templates Catalog

**Naming:** snake\_case slugs. **Category:** policy | procedure | plan | report | contract | notice | pack | record | template.

**Core ISMS baseline:**

- `isms_policy` (policy)
- `risk_management_policy` (policy)
- `asset_management_policy` (policy)
- `access_control_policy` (policy)
- `incident_response_plan` (plan)
- `malware_protection_policy` (policy)
- `backup_dr_policy` (policy)
- `bc_dr_plan` (plan)
- `vendor_security_policy` (policy)
- `statement_of_applicability` (report)
- `internal_audit_plan` (plan), `internal_audit_report` (report)
- `management_review_minutes` (record)
- `training_policy` (policy), `security_awareness_materials` (template)
- `kpi_metrics_report` (report)

**Privacy packs (ISO27701/GDPR/CPRA):**

- `privacy_policy_external_notice` (notice)
- `privacy_internal_policy` (policy)
- `data_inventory_ropa_export` (register\_export)
- `dpia_template` (template)
- `dsr_procedure` (procedure)
- `retention_schedule` (policy)
- `dpa_pack` (contract)

**Vendor & contracts:**

- `nda_mutual` (contract)
- `nda_unilateral` (contract)
- `supplier_requirements_addendum` (contract)

**Ops & build:**

- `secure_development_policy` (policy)
- `vulnerability_management_procedure` (procedure)
- `access_review_procedure` (procedure)

**Reports/exports:**

- `risk_register_export`
- `assets_register_export`
- `incident_summary_report`
- `training_completion_export`
- `audit_readiness_pack`

**Invocation examples:**

```json
{
  "type":"open_template",
  "target":"nda_mutual",
  "label":"Generate NDA (mutual)",
  "params":{
    "counterparty_name":"Acme Ltd.",
    "effective_date":"2025-09-01",
    "term_years":3,
    "confidentiality_duration_years":5,
    "governing_law":"CZ",
    "jurisdiction":"Prague"
  }
}
```

---

*End of ArionComply Metadata & Authoring Guide v2 (JSON-based, generalized).*

