# Compliance Q\&A Authoring Guide (Final, v1)

*Aligned with ArionComply v1 architecture, retrieval, and calibration pipeline.*

---

## 0) Purpose, Scope & Audience

**Audience:** total beginners to compliance using our platform.
**Goal:** practical, plain‑English answers + clear, actionable **“do this next in our platform.”**
**In‑scope frameworks (authoring):** ISO/IEC 27001:2022, ISO/IEC 27701:2019, GDPR, CPRA, NIS2 (via Member State law), EU AI Act.
**Note:** v1 retrieval ships with **ISO 27001 & ISO 27701** live. Other packs are welcome in authoring and will be queued for ingestion; they’re activated when the corpora are enabled.

---

## 1) File Format & Submission

* **Preferred:** Markdown with **YAML front‑matter** per Q/A (see §4 + the micro‑template in §10).
* Multiple Q/As per file are fine — separate with a line containing only `---`.
* **Accepted:** `.docx` (will be converted to Markdown with YAML).
* **Location in repo:** `docs/qa/bank/*.md` (source); derived artifacts land in `docs/qa/derived/*` (see §12).

---

## 2) Style Rules

* Short, friendly, **no legal advice** or speculation.
* Never make things up. If not knowable, add **\[RESEARCH NEEDED]** and move on.
* Use **standard & article/section numbers** as sources (no random blogs).
* Explain jargon **before** you use it.
* Keep consultant language **neutral** (see §7).

---

## 3) The 8‑Part Body Template (required in every Q/A)

1. **Standard terms)** — define any jargon in the question.
2. **Plain‑English answer** — 3–6 crisp sentences.
3. **Applies to** — **Primary** (standard+article) and **Also relevant / Overlaps** (crosswalk).
4. **Why it matters** — 1 line, business impact.
5. **Do next in our platform** — concrete steps/checklist.
6. **How our platform will help** — reference capabilities with **tags** (see §6.2).
7. **Likely follow‑ups** — what they’ll ask next (use flags if needed).
8. **Sources** — list **standards & specific articles/clauses only**.

   * If details vary: add **\[LOCAL LAW CHECK]**, **\[CB POLICY VARIES]**, or **\[MARKET PRACTICE—VALIDATE]** at the end of the sentence they qualify.

**Legal note (include only when clearly relevant):**
*We’re not your lawyers and this isn’t legal advice. For legal interpretations or decisions with legal implications, consult qualified counsel. Where country‑specific nuances apply, see \[LOCAL LAW CHECK].*

---

## 4) YAML Front‑Matter Schema (machine fields)

Add the following **above** the body of each Q/A.

```yaml
id: Q###                      # unique id, e.g., Q021
query: >-                     # the user question verbatim
  What evidence is acceptable for ISO 27001 A.8.12?
packs: ["ISO27001:2022"]     # canonical pack ids; future packs allowed
primary_ids: ["ISO27001:2022/A.8.12"]    # exact clause/article ids in our corpus
overlap_ids: ["ISO27002:2022/8.12"]      # crosswalk/related ids; optional
capability_tags: ["Evidence","Control","SoA"]   # 3–6 from §6.2
flags: []                     # optional (see §6.3)
sources:                      # primary sources only
  - title: "ISO/IEC 27001:2022 — A.8.12"
    id: "ISO27001:2022/A.8.12"   # must match chunk ids[] formatting
    locator: "p.74"              # page/section/url pointer if available
ui:                           # optional UI hints
  cards_hint:
    - "Evidence for malware prevention"
  actions:                    # see §6.4 for action types
    - type: "upload_evidence"
      target: "malware_prevention_controls"
      label: "Attach AV logs / config"
output_mode: "both"           # cards|prose|both (default both)
graph_required: false          # true if crosswalk is essential to answer
notes: "Prefer explicit technical controls and evidence fields."
```

**Why:** These fields power **retrieval evaluation (gold set)**, **synonym/graph proposals**, and **UI rendering** without losing explainability. See §12 for the pipeline.

---

## 5) Platform Stance (what we do / don’t)

* We act as expert, consultant, internal manager, and trainer in one.
* We generate & manage: **policies, processes, SoA, DPIA/TIA, DPA/SCC packs, notices; registers & trackers** (RoPA, Risk, SoA, Vendor, Transfers, Incidents, DSR, CAP/NC, Assets/Systems, Training, Audit).
* We run workflows (DSR, DPIA, incident/breach, vendor DD, internal audit, management review, exceptions/CAPs) with planning/scheduling and reminders.
* We provide dashboards/reports, guided evidence collection (no blanket “full automation” claims), and classification assistance (assistive to near‑full depending on module).
* We do **not** publish a trust center or claim legal conclusions.

---

## 6) Controlled Vocabularies (tags, flags, IDs, actions)

### 6.1 Pack IDs

* **Live (v1):** `ISO27001:2022`, `ISO27701:2019`
* **Authored (future‑enabled):** `GDPR:2016`, `CPRA:2023`, `NIS2:2023`, `EUAI:2024`

### 6.2 Capability Tags (use inside “How our platform will help”)

Use **3–6** per Q/A — only what’s truly used.

* `[NL-Portal]` Natural‑language command center (jump to screens).
* `[Draft Doc]` Auto‑generate documents from approved templates (policies, DPIA/TIA, DPA/SCC packs, notices, SoA, playbooks).
* `[Approval]` Route docs/decisions for e‑sign/off with tracked approvers and timestamps.
* `[Versioning]` Full change history, redlines, effective dates, rollback for documents/records.
* `[Register]` Structured inventories (RoPA, Risk, SoA, Vendor, Transfer, Asset/System, Incident, DSR, CAP/NC, Training, Audit).
* `[Tracker]` Ownered items with due dates and states (findings/CAPs, tasks, issues).
* `[Workflow]` Orchestrated step‑by‑step processes with gates (DPIA/TIA, incident/breach, vendor DD, internal audit, management review, exceptions).
* `[Reminder]` Automated nudges, SLAs, timers (e.g., GDPR **72h** clock, training refresh, audit cycles).
* `[Planner]` Calendars/cadences for recurring activities (risk, audits, reviews, training, policy refresh).
* `[Dashboard]` Live KPIs/status (control coverage, DSR SLA, incident MTTR, audit readiness).
* `[Report]` Exportable evidence/assurance packs for auditors, customers, or management.
* `[Virtual Manager]` Guided orchestration: assigns work, chases owners, checks completeness/readiness.
* `[Classify-Assist]` Assisted tagging and data/system classification (PII categories, special category flags, locations).
* `[Evidence-Guided]` Step prompts for exactly what evidence to collect and where to attach; immutable timestamps.

*(Internal extended tags allowed: `Template`, `Policy`, `SoA`, `Risk`, `Control`, `Evidence`, `DataMap`, `DPIA`, `RoPA` — use only when they clarify the step.)*

### 6.3 Decision Flags & Qualifiers

Put at the **end** of the sentence they qualify; use sparingly.

* `[LOCAL LAW CHECK]` national/state implementation or sector rules may change the answer.
* `[CB POLICY VARIES]` certification body scheme details may differ.
* `[MARKET PRACTICE—VALIDATE]` industry behavior not set by law/standard.
* `[RESEARCH NEEDED]` we don’t have a verifiable source right now.
  *(Optional advanced flags: **\`\`**.)*

### 6.4 UI Action Types (for `ui.actions[*].type`)

`open_register`, `start_workflow`, `open_template`, `create_policy`, `open_tracker`, `upload_evidence`

### 6.5 Canonical ID Format (ENFORCED in machine fields)

* **Canonical string:** `PACK:YEAR/SECTION` — e.g., `ISO27001:2022/A.8.12`, `ISO27701:2019/6.5`, `GDPR:2016/Art.33`, `EUAI:2024/Annex.III`.
* **Do not include** the word `Annex` for ISO 27001 in machine fields (use `A.8.12`, not `Annex.A.8.12`).
* **Always quote** IDs in YAML because they contain `:`.
* **Where enforced:** YAML front‑matter fields `primary_ids`, `overlap_ids`, and `sources[].id`.
* **Prose:** authors may write variants (e.g., `ISO27001:2022 A.8.12`); our linter auto‑normalizes when mining text.

**Examples (canonical):**

* ISO 27001: `ISO27001:2022/A.8.12`
* ISO 27701: `ISO27701:2019/6.5`
* ISO 27002: `ISO27002:2022/8.12`
* GDPR: `GDPR:2016/Art.33`
* CPRA: `CPRA:2023/§1798.100`
* NIS2: `NIS2:2023/Art.23`
* EU AI Act: `EUAI:2024/Annex.III`

### 6.6 Canonicalization & Lint Rules

* **Fail** (block commit) if any YAML machine field contains a non‑canonical ID.
* **Warn** (allow commit) if prose uses variants; these will be normalized during parsing.
* Normalizer logic (summary):

  1. Convert `PACK:YEAR SECTION` → `PACK:YEAR/SECTION`.
  2. Remove `Annex.` when followed by `A.` for ISO 27001 (`Annex.A.8.12` → `A.8.12`).
  3. Collapse duplicate dots and trim spaces.

### 6.7 Database/URL/File Safety

* **Databases (Postgres):** store IDs as **TEXT**; index by structured columns `(pack_id, version, clause_id)` or `section_path[]`. Do **not** rely on FTS for ID matching.
* **URLs:** pass IDs as query params or percent‑encode (e.g., `/api/clause?id=ISO27001%3A2022%2FA.8.12`). Prefer `/api/clause?pack=ISO27001&ver=2022&section=A.8.12`.
* **Filenames:** never use canonical IDs directly (because of `:` and `/`). Slugify as `ISO27001-2022__A.8.12` if needed.
* **Graph:** keep human‑readable `canonical_id` but join via integer PKs for performance.

## 7) Consultants / Externals (how to mention) / Externals (how to mention)

* Default neutrality: don’t say “never hire consultants.”
* Use only when relevant (e.g., staffing, audits):

  * Most teams can run compliance internally with our platform.
  * You **will** need an accredited certification body (external auditor) to issue ISO certificates.
  * You **may** need legal counsel for legal interpretations.
* Do not mention pen‑testing or other testing unless the question is about testing.

---

## 8) Sourcing & Uncertainty

* Cite **only** standards/laws with exact articles/clauses: e.g., *GDPR Art. 33; ISO 27001 Cl. 9.2; NIS2 Art. 23; EU AI Act Art. 2, Annex III*.
* If national implementation or CB practice differs, add **\[LOCAL LAW CHECK] / \[CB POLICY VARIES]**.
* If we genuinely don’t know or can’t verify, add **\[RESEARCH NEEDED]**.

---

## 9) Do / Don’t Quick List

**Do:** define jargon, keep answers actionable, map to platform steps, keep articles precise, use tags.
**Don’t:** add legal boilerplate unless relevant; promise integrations/automation we don’t have; recommend hiring consultants by default; include pen‑testing unless asked.

---

## 10) Micro‑Template (copy‑paste)

```yaml
id: Q###
query: >-
  {Question}
packs: ["ISO27001:2022","ISO27701:2019"]
primary_ids: ["{Pack}:{Version}/{SectionID}"]
overlap_ids: ["{Pack}:{Version}/{SectionID}"]
capability_tags: ["Register","Workflow","Evidence"]
flags: []
sources:
  - title: "{Source title}"
    id: "{Pack}:{Version}/{SectionID}"
    locator: "{page/section/url}"
ui:
  cards_hint:
    - "{Short card subtitle(s)}"
  actions:
    - type: "{open_register|start_workflow|open_template|create_policy|open_tracker|upload_evidence}"
      target: "{system/register/workflow id}"
      label: "{Button label}"
output_mode: "both"
graph_required: false
notes: "{Author guidance or constraints}"
---
### {N) Question}

**Standard terms)**  
- {Term}: {Plain definition}.

**Plain‑English answer**  
{3–6 sentences. No speculation.}

**Applies to**  
- **Primary:** {Standard} {Article/Clause}.  
- **Also relevant/Overlaps:** {Other standards/controls}.

**Why it matters**  
{1‑line business impact.}

**Do next in our platform**  
- {Step 1}  
- {Step 2}  
- {Step 3}

**How our platform will help**  
- {Tags + short capability bullets tied to steps}

**Likely follow‑ups**  
- {Logical next question(s)} {Optional flags}

**Sources**  
- {Standard + exact article/section refs}
```

---

## 11) Minimal Example

Below is a **fully filled example** for **ISO27001:2022 A.8.12 (malware protection)**, including YAML front‑matter and the 8‑part body.

```yaml
id: Q021
query: >-
  What evidence is acceptable for ISO 27001 A.8.12 (malware protection)?
packs: ["ISO27001:2022","ISO27002:2022"]
primary_ids: ["ISO27001:2022/A.8.12"]
overlap_ids: ["ISO27002:2022/8.12"]
capability_tags: ["Evidence","Control","SoA","Register","Workflow"]
flags: []
sources:
  - title: "ISO/IEC 27001:2022 — Annex A.8.12"
    id: "ISO27001:2022/A.8.12"
    locator: "Annex A"
  - title: "ISO/IEC 27002:2022 — 8.12 Protection against malware"
    id: "ISO27002:2022/8.12"
    locator: "Section 8.12"
ui:
  cards_hint:
    - "Evidence for malware protection"
    - "Coverage, updates, alerts, exceptions"
  actions:
    - type: "upload_evidence"
      target: "malware_protection_controls"
      label: "Attach AV/EDR configs & update logs"
    - type: "open_register"
      target: "soa"
      label: "Update SoA mapping for A.8.12"
output_mode: "both"
graph_required: false
notes: "Prefer explicit technical controls and evidence fields; map exceptions with approvals."
---
### 1) What evidence is acceptable for ISO 27001 A.8.12 (malware protection)?

**Standard terms)**  
- **Malware protection**: Controls to prevent, detect, and recover from malware on endpoints/servers and email/web gateways.

**Plain‑English answer**  
Provide evidence that malware controls are **implemented, up to date, and monitored**. Typical artifacts include: configuration/export from your AV/EDR tool (policies, exclusions), **coverage report** (assets in scope vs protected), **update/signature logs** showing regular updates, **alert and incident tickets** with triage/resolution, and any **approved exceptions** with compensating controls. Link these to SoA control **A.8.12** and record ownership and review cadence. Avoid generic screenshots without dates or scope.

**Applies to**  
- **Primary:** ISO27001:2022 **A.8.12**.  
- **Also relevant/Overlaps:** ISO27002:2022 **8.12** (implementation guidance).

**Why it matters**  
Demonstrates that malware risk is actively managed and that detections would surface with timely response (auditors sample for this).

**Do next in our platform**  
- Inventory assets/systems; mark which are covered by AV/EDR.  
- Upload current AV/EDR **policy config** and **coverage/export**.  
- Ingest last **90 days of update logs** and **alert tickets**.  
- Record **exceptions** with justification and compensating controls; set review dates.  
- Update **SoA** to reference tool names, owners, and review cadence.

**How our platform will help**  
- [Register] Track covered assets/systems and coverage deltas.  
- [Evidence-Guided] Prompts for required artifacts (configs, logs, tickets).  
- [Workflow] Exception approval flow with expiry reminders.  
- [SoA] Map A.8.12 to implemented controls/tools and owners.  
- [Dashboard] Show coverage %, update freshness, and open alerts.

**Likely follow‑ups**  
- Do we need **EDR** rather than AV? [MARKET PRACTICE—VALIDATE]  
- How long should we **retain logs**? [LOCAL LAW CHECK]  
- How to handle **isolated servers** without internet updates? [RESEARCH NEEDED]

**Sources**  
- ISO/IEC 27001:2022 — Annex **A.8.12** (Protection against malware).  
- ISO/IEC 27002:2022 — **8.12** Protection against malware (guidance).
```

---

## 12) Pipeline & Repo Mapping (where your work goes)

* **Source (you author):** `docs/qa/bank/*.md`
* **Derived outputs (generated):**

  * **Gold JSONL:** `docs/gold_set_v0.1.jsonl`
  * **Synonyms (proposed):** `docs/qa/derived/synonyms_proposed.csv`
  * **Graph edges (proposed):** `docs/qa/derived/graph_edges_proposed.csv`
  * **Integration cases (optional):** `docs/qa/derived/integration_cases.json`
* **Plan reference:** Detailed Plan §16 (*Q/A → Gold Pipeline*).
* **Governance:** proposals reviewed before ingestion; each gold set change triggers calibration.

---

## 13) Per‑Q/A Author Checklist

* [ ] **Canonical IDs:** machine fields use `PACK:YEAR/SECTION` (quoted); overlaps only when relevant.
* [ ] **Packs:** include all frameworks the answer truly depends on.
* [ ] **Capability tags:** 3–6 public tags tied to concrete platform steps.
* [ ] **UI actions:** only canonical slugs (Appx. A); params provided for workflows/templates where needed.
* [ ] **Evidence:** bucket names from Appx. A.4; no ad‑hoc names.
* [ ] **Sources:** primary clauses/articles only; add locators when stable.
* [ ] **Flags:** only when necessary; placed at sentence end.
* [ ] **Prose:** 3–6 crisp sentences; define jargon first; no speculation.
* [ ] **Do next:** actionable steps aligned to registers/trackers/workflows.
* [ ] **Saved to:** `docs/qa/bank/…` and passes qa\_lint (when enabled).

---

## Appendix A — Canonical UI Action Targets (v1)

Use these **exact slugs** in `ui.actions[*].target`. All are **snake\_case** and stable.

### A.1 Registers (for `type: open_register`)

| target                        | Label in UI                      |
| ----------------------------- | -------------------------------- |
| `risk`                        | Risk Register                    |
| `soa`                         | Statement of Applicability       |
| `vendors`                     | Vendor Register                  |
| `ropa`                        | Record of Processing Activities  |
| `transfers`                   | Data Transfers Register          |
| `incidents`                   | Incident Register                |
| `dsr`                         | Data Subject Requests            |
| `assets_systems`              | Assets & Systems Register        |
| `training`                    | Training Records                 |
| `audits`                      | Audits Register                  |
| `document_register`           | Document Register                |
| `byod_compliance`             | BYOD Compliance Register         |
| `risk_communications`         | Risk Communications Matrix       |
| `business_impact`             | Business Impact Analysis         |
| `privacy_compliance`          | Data Privacy Compliance Register |
| `operational_controls`        | Operational Planning — Controls  |
| `access_control_matrix`       | Access Control Matrix            |
| `policy_acknowledgements`     | Security Policy Acknowledgments  |
| `kpi_metrics`                 | Information Security KPI Tracker |
| `legal_regulatory_compliance` | Legal & Regulatory Register      |

> Note: `cap_nc`, `change_management`, `monitoring`, `security_assessments`, `penetration_tests`, and `security_reviews` are **trackers** (see A.3), not registers.

### A.2 Workflows (for `type: start_workflow`)

| target                        | Purpose                                                                                       | Required params (minimum)                                |
| ----------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `program_readiness`           | Stand up/upgrade a compliance program across selected packs                                   | `packs[]`, `scope_boundary`, `owner_role`, `target_date` |
| `program_external_assessment` | Plan/coordinate any external assessment (e.g., ISO, SOC 2, customer audit, regulator inquiry) | `assessment_scheme`, `target_dates?`                     |
| `program_maintenance`         | Continuous compliance + surveillance/recert prep                                              | `cadences{risk,audit,policy,training}`                   |
| `gdpr_quick_start`            | Guided setup for GDPR pack (future‑enabled)                                                   | —                                                        |
| `dpa_pack`                    | Create DPA/SCC bundle                                                                         | `processor_name?`, `transfer_country?`                   |
| `dpia`                        | Start a DPIA/TIA workflow                                                                     | `system_name`, `owner_role`, `due_in_days`               |
| `incident_breach`             | Incident / breach handling                                                                    | `incident_title`, `severity`, `owner_role`               |
| `internal_audit`              | Internal audit cycle                                                                          | `scope`, `start_date`, `owner_role`                      |
| `management_review`           | Management review meeting cycle                                                               | `period`, `meeting_date`                                 |
| `exception`                   | Control/Policy exception request & approval                                                   | `control_id`, `justification`, `expiry_date`             |
| `vendor_dd`                   | Vendor due‑diligence workflow                                                                 | `vendor_name`, `risk_tier?`                              |
| `dsr_fulfillment`             | Data subject request fulfillment                                                              | `request_id`, `request_type`                             |
| `policy_refresh`              | Scheduled policy review/refresh                                                               | `policy_id`, `review_date`                               |
| `risk_assessment`             | Periodic risk assessment                                                                      | `scope`, `method?`                                       |
| `bc_dr_plan`                  | Create/maintain BC/DR plan                                                                    | `plan_scope`, `owner_role`                               |

### A.3 Trackers (for `type: open_tracker`) (for `type: open_tracker`)

| target                 | What it tracks                         |
| ---------------------- | -------------------------------------- |
| `cap_nc`               | Non‑conformities & Corrective Actions  |
| `change_management`    | Change requests/approvals              |
| `monitoring`           | Control monitoring results/exceptions  |
| `security_assessments` | Security assessments (general)         |
| `penetration_tests`    | Penetration testing activities         |
| `security_reviews`     | Quarterly security reviews             |
| `findings`             | Audit/assessment findings              |
| `remediation`          | Remediation tasks & owners             |
| `tasks`                | General tasks/cross‑functional actions |
| `issues`               | Issues/bugs/defects (non‑audit)        |
| `evidence_requests`    | Outstanding evidence asks              |

### A.4 Evidence buckets (for `type: upload_evidence`)

`ui.actions[*].target` may also point to an **evidence bucket** key used by the product. Use **snake\_case** and be specific. Examples:

* `malware_protection_controls`
* `endpoint_protection_logs`
* `patch_management_reports`
* `backup_and_restore_procedures`
* `backup_test_results`
* `edr_policies_exports`
* `siem_alert_exports`
* `iam_access_reviews`
* `privileged_access_logs`
* `vulnerability_scan_reports`
* `pentest_reports`
* `vendor_dd_packages`
* `incident_tickets`
* `breach_notifications`
* `training_completion_exports`
* `policy_acknowledgments`
* `risk_assessment_records`
* `risk_treatment_approvals`
* `soa_evidence_pack`
* `change_approvals`
* `document_versions`
* `audit_reports`
* `management_review_minutes`
* `bc_dr_exercise_reports`
* `data_inventory_exports`
* `access_control_matrix_exports`

**Naming rules:**

* Lowercase `snake_case`; nouns only; avoid verbs.
* Prefer **system/control‑oriented** names over project names.
* If a bucket is missing, propose it in the PR description; product will whitelist it.
* **Contracts:** include `nda_signed_copies`, `employee_nda_acknowledgments`, and `dpa_signed_pack` when applicable.

### A.5 Conventions & Extensibility

* These slugs are versioned via the product config; avoid inventing new ones in YAML unless approved.
* If you need a new slug, add a comment in the Q/A `notes` and tag `@product‑taxonomy` in the PR.
* These slugs are versioned via the product config; avoid inventing new ones in YAML unless approved.
* If you need a new slug, add a comment in the Q/A `notes` and tag `@product‑taxonomy` in the PR.

---

## Appendix B — Capability Tags in YAML vs. Prose

* **YAML `capability_tags`:** use **public tags only** (the set in §6.2). These drive UI chips and analytics.
* **Prose:** you may use extended/internal tags (e.g., `SoA`, `Risk`, `Control`) for clarity, but they are **not parsed**.
* If you need an extended tag to influence UI, prefer adding an explicit `ui.actions[*]` entry instead of extending `capability_tags`.

---

## Appendix C — Source Locators

* `sources[*].locator` may be **empty** when page numbers are unstable across editions.
* Prefer **section labels** over page numbers when possible: e.g., "Annex A", "Art. 33", "Section 8.12".
* Keep locators short and consistent; avoid third‑party URLs.

---

## Appendix D — When to set `graph_required: true`

Set to **true** when the answer **depends** on cross‑standard mappings to be retrieved correctly or evaluated fairly. Examples:

* The query requires **ISO27001 ↔ ISO27701** crosswalk to surface the right clause(s).
* You’re aligning **ISO 27001 control(s)** with **GDPR Art. 32/25** obligations.
* The question explicitly asks to **compare/align** frameworks.

Leave **false** when the answer is fully satisfied by the primary pack’s clauses.

---

## Appendix E — `cards_hint` Guidance

* Provide **1–3** short items; ≤ **40 characters** each.
* Use **nouns/noun phrases**, not full sentences (e.g., `Territorial scope quick check`).
* Order from most to least useful.
* Avoid duplicating the main question text.

## Appendix F — Authoring “Do next” to match targets

* In **“Do next in our platform”**, prefer steps that align with Appendix A slugs. Example: “Update SoA mapping for A.8.12” → add `ui.actions: { type: open_register, target: soa }`.
* For trackers (e.g., nonconformities), use `open_tracker` with the correct target (e.g., `cap_nc`).
* For artifacts upload, use `upload_evidence` with a bucket from A.4.
* Avoid inventing new names in YAML; if needed, note it in `notes` and tag `@product-taxonomy`.

---

## Appendix G — One‑Page Cheat Sheet (v1)

**IDs (canonical):** `PACK:YEAR/SECTION` → e.g., `ISO27001:2022/A.8.12` • Quote in YAML • Encode in URLs • Slugify for filenames.
**Graph flag:** set `graph_required: true` only if the answer depends on cross‑framework mapping (see Appx. D).
**cards\_hint:** 1–3 short noun phrases (≤40 chars).

### G.1 Capability Tags (public — allowed in YAML)

`[NL-Portal]` `[Draft Doc]` `[Approval]` `[Versioning]` `[Register]` `[Tracker]` `[Workflow]` `[Reminder]` `[Planner]` `[Dashboard]` `[Report]` `[Virtual Manager]` `[Classify-Assist]` `[Evidence-Guided]`

*(Extended tags like `SoA`, `Risk`, `Control` are **prose-only**; use `ui.actions` to drive UI instead.)*

### G.2 UI Action Types & Targets (use in `ui.actions`)

* **Types:** `open_register` • `open_tracker` • `start_workflow` • `upload_evidence` • `open_template` • `create_policy`

**Registers (`open_register → target`)**
`risk` • `soa` • `vendors` • `ropa` • `transfers` • `incidents` • `dsr` • `assets_systems` • `training` • `audits` • `document_register` • `byod_compliance` • `risk_communications` • `business_impact` • `privacy_compliance` • `operational_controls` • `access_control_matrix` • `policy_acknowledgements` • `kpi_metrics` • `legal_regulatory_compliance`

**Trackers (`open_tracker → target`)**
`cap_nc` • `change_management` • `monitoring` • `security_assessments` • `penetration_tests` • `security_reviews` • `findings` • `remediation` • `tasks` • `issues` • `evidence_requests`

**Workflows (`start_workflow → target`)**
`program_readiness` • `program_external_assessment` • `program_maintenance` • `gdpr_quick_start` • `dpa_pack` • `dpia` • `incident_breach` • `internal_audit` • `management_review` • `exception` • `vendor_dd` • `dsr_fulfillment` • `policy_refresh` • `risk_assessment` • `bc_dr_plan`

**Evidence buckets (`upload_evidence → target`)**   (`upload_evidence → target`)\*\*
Examples: `malware_protection_controls` • `endpoint_protection_logs` • `patch_management_reports` • `backup_and_restore_procedures` • `backup_test_results` • `edr_policies_exports` • `siem_alert_exports` • `iam_access_reviews` • `privileged_access_logs` • `vulnerability_scan_reports` • `pentest_reports` • `vendor_dd_packages` • `incident_tickets` • `breach_notifications` • `training_completion_exports` • `policy_acknowledgments` • `risk_assessment_records` • `risk_treatment_approvals` • `soa_evidence_pack` • `change_approvals` • `document_versions` • `audit_reports` • `management_review_minutes` • `bc_dr_exercise_reports` • `data_inventory_exports` • `access_control_matrix_exports`

**Naming rules for buckets:** snake\_case • nouns only • propose new ones via PR note to `@product-taxonomy`.

### G.3 YAML Front‑Matter — Minimal Skeleton

```yaml
id: Q###
query: >-
  {Question}
packs: ["ISO27001:2022"]
primary_ids: ["ISO27001:2022/A.8.12"]
overlap_ids: []
capability_tags: ["Register","Workflow","Evidence"]
ui:
  cards_hint: ["{short 1}", "{short 2}"]
  actions:
    - type: open_register
      target: soa
      label: "Update SoA"
    - type: upload_evidence
      target: soa_evidence_pack
      label: "Attach SoA pack"
output_mode: both
graph_required: false
```

### G.4 Quick “Do next” Patterns

* **Register update:** “Update SoA mapping for {ID}” → `open_register: soa`
* **Start workflow:** “Kick off DPIA for {system}” → `start_workflow: dpia`
* **Track finding:** “Open CAP for {finding}” → `open_tracker: cap_nc`
* **Attach artifacts:** “Upload AV policy export” → `upload_evidence: edr_policies_exports`

*For full details see: Appx. A–F.*

---

## Appendix H — Workflow Templates vs. Instances (generic)

**Templates** are stateless definitions (slug + params). **Instances** are runs with state, owners, SLAs, and tasks. States apply to **instances** (and their tasks), not templates.

### H.1 Canonical instance states

| template (slug)               | States (canonical progression)                                                                    | Writes to (primary)                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `program_readiness`           | planned → in\_progress → ready\_for\_internal\_review → ready\_for\_external\_assessment → closed | risk, control mapping/SoA/privacy map, documents, vendors, training |
| `program_external_assessment` | planned → evidence\_pack\_ready → fieldwork → findings → actions → closed/certified               | documents, audits, evidence\_requests, cap\_nc                      |
| `program_maintenance`         | active → surveillance\_y1 → surveillance\_y2 → recert\_window → active                            | kpi\_metrics, audits, management\_reviews, risk                     |
| `dpia`                        | draft → in\_review → approved → closed                                                            | privacy\_compliance, documents                                      |
| `incident_breach`             | open → triage → contained → resolved → closed                                                     | incidents, cap\_nc, evidence\_requests                              |
| `internal_audit`              | planned → fieldwork → report → closed                                                             | audits, findings                                                    |
| `management_review`           | scheduled → held → actions\_open → closed                                                         | management\_reviews, tasks                                          |
| `vendor_dd`                   | requested → in\_progress → approved/rejected                                                      | vendors, vendor\_risks                                              |
| `exception`                   | requested → approved/denied → expired                                                             | nonconformities (or exceptions)                                     |
| `risk_assessment`             | planned → in\_progress → approved → closed                                                        | risk\_register                                                      |
| `policy_refresh`              | scheduled → in\_review → approved → published                                                     | documents, policy\_acks                                             |
| `dpa_pack`                    | draft → reviewed → executed                                                                       | documents, transfers, vendors                                       |
| `dsr_fulfillment`             | received → verifying → fulfilling → closed                                                        | dsr, evidence\_requests                                             |
| `bc_dr_plan`                  | draft → approved → active                                                                         | bc\_dr\_plan, tasks                                                 |

### H.2 Minimal authoring block for workflows

```yaml
- type: start_workflow
  target: program_readiness
  label: "Start readiness across selected packs"
  params:
    packs: ["ISO27001:2022","GDPR:2016"]
    scope_boundary: "EU platform + corp IT"
    owner_role: "CISO"
    target_date: "2026-03-31"
```

### H.3 Trigger sources & chaining (runtime)

| Trigger type                            | Who/what fires it                                          | Path to workflow engine                                                  | Typical use‑case                                  |
| --------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------- |
| **UI action** (`start_workflow …`)      | End‑user clicks a button rendered from `ui.actions`        | Front‑end ➜ **`workflows_start`** RPC/Edge                               | "Kick off DPIA"; "Launch readiness programme"     |
| **API/webhook**                         | External system posts JSON to `/integrations/events`       | Integration router ➜ **`workflows_start`** or **`workflow_event`**       | New vendor in ERP triggers `vendor_dd`            |
| **Register/Tracker event** *(internal)* | Row‑level trigger in Postgres (or service emits Kafka msg) | `workflow_events` NOTIFY ➜ **event\_bridge\_service** ➜ `workflow_event` | High‑risk finding inserted ➜ auto‑open `cap_nc`   |
| **Chained workflow**                    | Parent instance hits a state with **auto‑spawn rule**      | Orchestrator creates child instance via `workflows_start`                | `program_readiness` auto‑spawns `risk_assessment` |

> **Developers**: internal events live in `app_core.workflow_events`; `event_bridge_service.py` listens to `pg_notify`, evaluates rules in `workflow_templates.rules`, and posts to the orchestrator. See Detailed Plan §07.
> yaml

* type: start\_workflow
  target: program\_readiness
  label: "Start readiness across selected packs"
  params:
  packs: \["ISO27001:2022","GDPR:2016"]
  scope\_boundary: "EU platform + corp IT"
  owner\_role: "CISO"
  target\_date: "2026-03-31"

````

---

## Appendix I — Artifact Templates Catalog (v1, cross‑framework)
**Naming:** slugs are `snake_case`. **Category:** policy|procedure|plan|report|contract|notice|pack|record|template.

### I.1 Core (ISMS baseline)
- `isms_policy` (policy)
- `risk_management_policy` (policy)
- `asset_management_policy` (policy)
- `access_control_policy` (policy)
- `change_management_policy` (policy)
- `incident_response_plan` (plan)
- `logging_monitoring_policy` (policy)
- `malware_protection_policy` (policy)
- `backup_dr_policy` (policy)
- `bc_dr_plan` (plan)
- `vendor_security_policy` (policy)
- `encryption_policy` (policy)
- `statement_of_applicability` (pack/report)
- `internal_audit_plan` (plan), `internal_audit_report` (report)
- `management_review_minutes` (record)
- `training_policy` (policy), `security_awareness_materials` (template/pack)
- `kpi_metrics_report` (report)

### I.2 Privacy (27701/GDPR/CPRA) — optional unless privacy pack active
- `privacy_policy_external_notice` (notice)
- `privacy_internal_policy` (policy)
- `data_inventory_ropa_export` (register_export)
- `dpia_template` (template)
- `dsr_procedure` (procedure)
- `retention_schedule` (policy/record)
- `dpa_pack` (contract/pack)

### I.3 Vendor & third‑party (contracts)
- `nda_mutual` (contract)
- `nda_unilateral` (contract)
- `supplier_requirements_addendum` (contract/addendum)

### I.4 Secure build & ops (goal‑dependent)
- `secure_development_policy` (policy)
- `vulnerability_management_procedure` (procedure)
- `access_review_procedure` (procedure)
- `change_advisory_board_tor` (record/policy)

### I.5 Reports/exports (auto‑generated)
- `risk_register_export`, `assets_register_export`, `access_matrix_export`, `incident_summary_report`, `training_completion_export`, `audit_readiness_pack`

### I.6 Template invocation examples
```yaml
- type: open_template
  target: nda_mutual
  label: "Generate NDA (mutual)"
  params:
    counterparty_name: "Acme Ltd."
    effective_date: "2025-09-01"
    term_years: 3
    confidentiality_duration_years: 5
    governing_law: "CZ"
    jurisdiction: "Prague"

- type: create_policy
  target: access_control_policy
  label: "Draft Access Control Policy"
  params:
    owner_role: "CISO"
    review_cadence: "annual"
````
