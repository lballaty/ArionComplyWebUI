# Customer Assessment & Company Profiling — Addendum (Granular v1)

*Aligned with Compliance Q&A Authoring Guide (Final, v1). RAG/Graph-ready. Pack: **``**.*

---

## 0) Purpose, Scope & Audience

**Purpose:** Plain-language, granular intake for company profiling and customer assessment that directly drives registers, trackers, workflows, policies, and evidence collection.

**Scope:** Superset of attributes to: (1) map obligations; (2) activate artifacts; (3) plan and prove audits.

**Audience:** Internal users, consultants, auditors. No prior knowledge assumed.

**Authoring notes:**

- **Pack ID:** `CompanyProfile:2025`
- **Canonical IDs:** `CompanyProfile:2025/<Section>/<Subtopic>`
- **Overlap mapping:** use `overlap_ids` to encode dependencies; graph edges exported to `docs/qa/derived/graph_edges_proposed.csv`.
- **Capability tags:** choose from public set (§6.2 in base guide).
- **UI actions:** use slugs from Appendix A in base guide.
- **Evidence buckets:** use Appendix A.4 names.

---

## 1) CoreIdentity (granular)

```yaml
id: Q001a
query: >-
  What is your company’s legal name, registration number, and HQ country?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/CoreIdentity/EntityRecord"]
overlap_ids: []
capability_tags: ["Register","Classify-Assist","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/CoreIdentity"
    locator: "Section 1"
ui:
  cards_hint: ["Legal name","Reg. number","HQ country"]
  actions:
    - type: open_register
      target: legal_regulatory_compliance
      label: "Record legal entity details"
output_mode: both
graph_required: false
notes: "Anchor record for all profiling data."
---
### What is your company’s legal name, registration number, and HQ country?

**Standard terms)**  
- **Legal name**: Official name in registry.  
- **Registration number**: Company identifier assigned by authority.  
- **HQ**: Main management location.

**Plain-English answer**  
Provide legal name, registration number, and HQ country.

**Applies to**  
- **Primary:** CompanyProfile:2025/CoreIdentity/EntityRecord

**Why it matters**  
Sets jurisdiction and legal scope.

**Do next in our platform**  
- Enter name, reg. number, HQ.  
- Upload registry extract (optional).  
- Link group entities later (Q009*).

**How our platform will help**  
- [Register] Legal & Regulatory register.  
- [Classify-Assist] Jurisdiction mapping.  
- [Evidence-Guided] Registry proof prompt.

**Likely follow-ups**  
- Trading names? Parent/subsidiaries?

**Sources**  
- Company Profiling Schema v1 — Core Identity
```

```yaml
id: Q001b
query: >-
  Do you use trading names or brands different from the legal name?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/CoreIdentity/TradingNames"]
overlap_ids: ["CompanyProfile:2025/CoreIdentity/EntityRecord"]
capability_tags: ["Register","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/CoreIdentity"
    locator: "Section 1"
ui:
  cards_hint: ["Brands","DBA names"]
  actions:
    - type: open_register
      target: legal_regulatory_compliance
      label: "Add trading names"
output_mode: both
graph_required: false
notes: "Used in notices, contracts, and SoA labeling."
---
### Do you use trading names or brands different from the legal name?

**Standard terms)**  
- **Trading/DBA name**: Name used in business not equal to legal name.

**Plain-English answer**  
List any DBAs or brands.

**Applies to**  
- **Primary:** CompanyProfile:2025/CoreIdentity/TradingNames

**Why it matters**  
Aligns public documents and contracts.

**Do next in our platform**  
- Record DBAs.  
- Ensure notices/policies reference correct names.

**How our platform will help**  
- [Register] Legal register entries.  
- [Report] Consistency checks across docs.

**Likely follow-ups**  
- Brand-specific privacy notices needed?

**Sources**  
- Company Profiling Schema v1 — Core Identity
```

---

## 2) SizeScale (granular)

```yaml
id: Q002a
query: >-
  What is your current total headcount in FTE and the split of employees vs contractors?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/SizeScale/Headcount"]
overlap_ids: []
capability_tags: ["Register","Dashboard","Classify-Assist"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/SizeScale"
    locator: "Section 2"
ui:
  cards_hint: ["FTE total","Contractors %"]
  actions:
    - type: open_register
      target: kpi_metrics
      label: "Record headcount"
output_mode: both
graph_required: false
notes: "Thresholds affect GDPR duties and audit scope."
---
### What is your current total headcount in FTE and the split of employees vs contractors?

**Standard terms)**  
- **FTE**: Full-time equivalent.

**Plain-English answer**  
Provide FTE and contractor breakdown.

**Applies to**  
- **Primary:** CompanyProfile:2025/SizeScale/Headcount

**Why it matters**  
Impacts governance expectations and training scope.

**Do next in our platform**  
- Record metrics.  
- Link to training coverage (Q008e).

**How our platform will help**  
- [Dashboard] KPIs and thresholds.  
- [Register] KPI Metrics register.

**Likely follow-ups**  
- Seasonal peaks? Outsourced teams?

**Sources**  
- Company Profiling Schema v1 — Size & Scale
```

```yaml
id: Q002b
query: >-
  What is your approximate annual revenue bracket and growth rate?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/SizeScale/RevenueGrowth"]
overlap_ids: []
capability_tags: ["Register","Planner","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/SizeScale"
    locator: "Section 2"
ui:
  cards_hint: ["Revenue range","Growth rate"]
  actions:
    - type: open_register
      target: kpi_metrics
      label: "Record revenue metrics"
output_mode: both
graph_required: false
notes: "Signals resource availability for program maturity."
---
### What is your approximate annual revenue bracket and growth rate?

**Plain-English answer**  
Select a revenue range and growth rate.

**Why it matters**  
Guides program planning cadence and audit readiness resourcing.

**Do next in our platform**  
- Record revenue and growth.  
- Plan management reviews cadence.

**How our platform will help**  
- [Planner] Program maintenance cadence.  
- [Report] Maturity vs resources view.

**Sources**  
- Company Profiling Schema v1 — Size & Scale
```

---

## 3) IndustrySector (granular)

```yaml
id: Q003a
query: >-
  Which primary industry code (NAICS/SIC) and sub-sector best fit your activities?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/IndustrySector/Classification"]
overlap_ids: []
capability_tags: ["Register","Classify-Assist","Workflow"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/IndustrySector"
    locator: "Section 3"
ui:
  cards_hint: ["NAICS/SIC","Sub-sector"]
  actions:
    - type: open_register
      target: legal_regulatory_compliance
      label: "Record industry classification"
    - type: start_workflow
      target: program_readiness
      label: "Start sector readiness"
output_mode: both
graph_required: false
notes: "Sector may imply domain standards (e.g., PCI, HIPAA, NIS2)."
---
### Which primary industry code (NAICS/SIC) and sub-sector best fit your activities?

**Plain-English answer**  
Pick code and sub-sector.

**Why it matters**  
Drives sector-specific obligations and audits.

**Do next in our platform**  
- Record code/sub-sector.  
- Launch sector readiness if critical.

**How our platform will help**  
- [Classify-Assist] Standards suggestions.  
- [Workflow] Readiness orchestration.

**Sources**  
- Company Profiling Schema v1 — Industry & Sector
```

```yaml
id: Q003b
query: >-
  Are you designated as critical infrastructure by any authority?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/IndustrySector/CriticalInfra"]
overlap_ids: ["CompanyProfile:2025/GeographicFootprint/Countries"]
capability_tags: ["Register","Reminder","Workflow"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/IndustrySector"
    locator: "Section 3"
ui:
  cards_hint: ["CI designation","Regulator"]
  actions:
    - type: open_register
      target: legal_regulatory_compliance
      label: "Record designation"
    - type: start_workflow
      target: program_readiness
      label: "Plan CI obligations"
output_mode: both
graph_required: false
notes: "Impacts NIS2-like regimes."
---
### Are you designated as critical infrastructure by any authority?

**Plain-English answer**  
Indicate any CI designation and regulator.

**Why it matters**  
Raises minimum controls and reporting duties.

**Do next in our platform**  
- Record designation & authority.  
- Plan CI compliance program.

**How our platform will help**  
- [Reminder] Statutory reporting cadences.  
- [Workflow] Program readiness template.

**Sources**  
- Company Profiling Schema v1 — Industry & Sector
```

---

## 4) GeographicFootprint (granular)

```yaml
id: Q004a
query: >-
  List countries where you operate, have staff, or host infrastructure.
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/GeographicFootprint/Countries"]
overlap_ids: ["CompanyProfile:2025/TechnologyStack/CloudRegions","CompanyProfile:2025/TechnologyStack/OnPremControls"]
capability_tags: ["Register","Classify-Assist","Reminder"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/GeographicFootprint"
    locator: "Section 4"
ui:
  cards_hint: ["Ops countries","Infra sites"]
  actions:
    - type: open_register
      target: legal_regulatory_compliance
      label: "Record footprint"
output_mode: both
graph_required: false
notes: "Feeds transfer checks and regulator scope."
---
### List countries where you operate, have staff, or host infrastructure.

**Plain-English answer**  
Provide operating and infra countries.

**Why it matters**  
Determines applicable laws and regulators.

**Do next in our platform**  
- Record countries.  
- Link to cloud/on-prem entries.

**How our platform will help**  
- [Classify-Assist] Map laws per country.  
- [Reminder] Expansion triggers.

**Sources**  
- Company Profiling Schema v1 — Geographic Footprint
```

```yaml
id: Q004b
query: >-
  List countries where your customers are located.
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/GeographicFootprint/CustomerRegions"]
overlap_ids: ["CompanyProfile:2025/Customers/Types","CompanyProfile:2025/DataHandling/Transfers"]
capability_tags: ["Register","Report","Classify-Assist"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/GeographicFootprint"
    locator: "Section 4"
ui:
  cards_hint: ["Customer regions"]
  actions:
    - type: open_register
      target: legal_regulatory_compliance
      label: "Record customer regions"
output_mode: both
graph_required: false
notes: "Enables extraterritorial law checks."
---
### List countries where your customers are located.

**Plain-English answer**  
Provide customer regions.

**Why it matters**  
Customer location can impose regional duties.

**Do next in our platform**  
- Record regions.  
- Align notices and contracts to region.

**How our platform will help**  
- [Report] Region-to-obligation map.  
- [Classify-Assist] Triggers packs.

**Sources**  
- Company Profiling Schema v1 — Geographic Footprint
```

```yaml
id: Q004c
query: >-
  List countries where your key vendors or processors are based or process data.
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/GeographicFootprint/VendorCountries"]
overlap_ids: ["CompanyProfile:2025/ContractsThirdParties/VendorInventory","CompanyProfile:2025/DataHandling/Transfers"]
capability_tags: ["Register","Workflow","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/GeographicFootprint"
    locator: "Section 4"
ui:
  cards_hint: ["Vendor countries"]
  actions:
    - type: open_register
      target: vendors
      label: "Record vendor countries"
    - type: start_workflow
      target: vendor_dd
      label: "Start vendor due diligence"
output_mode: both
graph_required: false
notes: "Supports transfer & DPA needs."
---
### List countries where your key vendors or processors are based or process data.
```

---

## 5) Customers (granular)

```yaml
id: Q005a
query: >-
  What customer types do you serve (B2B, B2C, Government, NGOs)?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/Customers/Types"]
overlap_ids: ["CompanyProfile:2025/GeographicFootprint/CustomerRegions"]
capability_tags: ["Register","Classify-Assist","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/Customers"
    locator: "Section 5"
ui:
  cards_hint: ["B2B/B2C/Gov/NGO"]
  actions:
    - type: open_register
      target: ropa
      label: "Create RoPA entries"
output_mode: both
graph_required: false
notes: "Triggers privacy and contract posture."
---
### What customer types do you serve (B2B, B2C, Government, NGOs)?
```

```yaml
id: Q005b
query: >-
  Do you serve any sensitive groups (children, patients, financial clients)?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/Customers/SensitiveGroups"]
overlap_ids: ["CompanyProfile:2025/DataHandling/PIIType"]
capability_tags: ["Register","Workflow","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/Customers"
    locator: "Section 5"
ui:
  cards_hint: ["Children","Patients","Finance"]
  actions:
    - type: start_workflow
      target: risk_assessment
      label: "Assess sensitive group risks"
    - type: open_register
      target: ropa
      label: "Link sensitive processing"
output_mode: both
graph_required: false
notes: "May require consent records and DPIA."
---
### Do you serve any sensitive groups (children, patients, financial clients)?
```

```yaml
id: Q005c
query: >-
  Do you have regulated customers (e.g., banks, hospitals) with extra requirements?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/Customers/RegulatedClients"]
overlap_ids: ["CompanyProfile:2025/ContractsThirdParties/ContractPosture"]
capability_tags: ["Register","Workflow","Evidence-Guided","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/Customers"
    locator: "Section 5"
ui:
  cards_hint: ["Regulated clients","Questionnaires"]
  actions:
    - type: open_tracker
      target: evidence_requests
      label: "Track customer evidence asks"
    - type: start_workflow
      target: program_external_assessment
      label: "Plan external/customer audits"
output_mode: both
graph_required: false
notes: "Expect security questionnaires and SLAs."
---
### Do you have regulated customers (e.g., banks, hospitals) with extra requirements?
```

---

## 6) TechnologyStack (granular)

*See also previously authored Q006a–Q006f entries; included here for completeness.*

```yaml
id: Q006a
query: >-
  What is your primary hosting model: cloud, on-premise, or hybrid?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/TechnologyStack/HostingModel"]
overlap_ids: []
capability_tags: ["Register","Classify-Assist","Workflow"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/TechnologyStack"
    locator: "Hosting"
ui:
  cards_hint: ["Cloud/on-prem/hybrid"]
  actions:
    - type: open_register
      target: assets_systems
      label: "Record systems by hosting"
    - type: start_workflow
      target: risk_assessment
      label: "Run hosting risk assessment"
output_mode: both
graph_required: false
notes: "Branch: if cloud → Q006b; if on-prem → Q006c; hybrid → both."
---
### What is your primary hosting model: cloud, on-premise, or hybrid?
```

```yaml
id: Q006b
query: >-
  Which cloud provider(s) and regions do you use?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/TechnologyStack/CloudRegions"]
overlap_ids: ["CompanyProfile:2025/GeographicFootprint/Countries","CompanyProfile:2025/DataHandling/Transfers"]
capability_tags: ["Register","Evidence-Guided","Workflow"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/TechnologyStack"
    locator: "Cloud"
ui:
  cards_hint: ["Provider","Regions"]
  actions:
    - type: open_register
      target: assets_systems
      label: "Tag systems by region"
    - type: start_workflow
      target: dpa_pack
      label: "Draft DPA/SCC if needed"
output_mode: both
graph_required: false
notes: "Depends on Q006a includes cloud."
---
### Which cloud provider(s) and regions do you use?
```

```yaml
id: Q006c
query: >-
  Where are your on-premise environments located and which controls are in place?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/TechnologyStack/OnPremControls"]
overlap_ids: ["CompanyProfile:2025/GeographicFootprint/Countries"]
capability_tags: ["Register","Evidence-Guided","Workflow"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/TechnologyStack"
    locator: "On-prem"
ui:
  cards_hint: ["Sites","Controls"]
  actions:
    - type: open_register
      target: assets_systems
      label: "Record on-prem sites"
    - type: start_workflow
      target: risk_assessment
      label: "Assess on-prem risks"
output_mode: both
graph_required: false
notes: "Depends on Q006a includes on-prem."
---
### Where are your on-premise environments located and which controls are in place?
```

```yaml
id: Q006d
query: >-
  Do you run AI/ML in production and for which use-cases?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/TechnologyStack/AIUseCases"]
overlap_ids: ["CompanyProfile:2025/DataHandling/PIIType","CompanyProfile:2025/Customers/SensitiveGroups"]
capability_tags: ["Register","Workflow","Evidence-Guided","Classify-Assist"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/TechnologyStack"
    locator: "AI/ML"
ui:
  cards_hint: ["AI use-case","Data inputs"]
  actions:
    - type: open_register
      target: operational_controls
      label: "Record AI controls"
    - type: start_workflow
      target: risk_assessment
      label: "AI risk assessment"
output_mode: both
graph_required: false
notes: "Links to EUAI:2024 high-risk scope if applicable."
---
### Do you run AI/ML in production and for which use-cases?
```

```yaml
id: Q006e
query: >-
  Do you use biometrics, IoT, or blockchain in any product or process?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/TechnologyStack/SensitiveTech"]
overlap_ids: ["CompanyProfile:2025/DataHandling/PIIType"]
capability_tags: ["Register","Workflow","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/TechnologyStack"
    locator: "Sensitive tech"
ui:
  cards_hint: ["Biometrics/IoT/Blockchain"]
  actions:
    - type: start_workflow
      target: risk_assessment
      label: "Assess sensitive tech"
output_mode: both
graph_required: false
notes: "If biometrics → likely DPIA."
---
### Do you use biometrics, IoT, or blockchain in any product or process?
```

```yaml
id: Q006f
query: >-
  What logging and monitoring do you have for production systems?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/TechnologyStack/LoggingMonitoring"]
overlap_ids: []
capability_tags: ["Register","Evidence-Guided","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/TechnologyStack"
    locator: "Monitoring"
ui:
  cards_hint: ["SIEM/alerts","Retention"]
  actions:
    - type: open_register
      target: operational_controls
      label: "Record monitoring controls"
output_mode: both
graph_required: false
notes: "Tie to evidence freshness windows."
---
### What logging and monitoring do you have for production systems?
```

---

## 7) DataHandling (granular)

*See previously authored Q007a–Q007f entries; included for completeness.*

```yaml
id: Q007a
query: >-
  Do you process personal data in your company operations?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/DataHandling/PersonalData"]
overlap_ids: []
capability_tags: ["Register","Classify-Assist","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/DataHandling"
    locator: "Section 7"
ui:
  cards_hint: ["Personal data yes/no"]
  actions:
    - type: open_register
      target: ropa
      label: "Add processing activity"
output_mode: both
graph_required: false
notes: "Parent; sub-questions apply only if Yes."
---
### Do you process personal data in your company operations?
```

```yaml
id: Q007b
query: >-
  What types of personal or sensitive data do you process?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/DataHandling/PIIType"]
overlap_ids: ["CompanyProfile:2025/DataHandling/PersonalData"]
capability_tags: ["Register","Evidence-Guided","Classify-Assist"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/DataHandling"
    locator: "Section 7"
ui:
  cards_hint: ["Data categories"]
  actions:
    - type: open_register
      target: ropa
      label: "Categorize data types"
output_mode: both
graph_required: false
notes: "Depends on Q007a == Yes."
---
### What types of personal or sensitive data do you process?
```

```yaml
id: Q007c
query: >-
  Are you a data controller, processor, or joint controller?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/DataHandling/ProcessingRole"]
overlap_ids: ["CompanyProfile:2025/DataHandling/PIIType"]
capability_tags: ["Register","Classify-Assist","Workflow"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/DataHandling"
    locator: "Section 7"
ui:
  cards_hint: ["Role in processing"]
  actions:
    - type: open_register
      target: ropa
      label: "Record processing role"
output_mode: both
graph_required: false
notes: "Depends on Q007a == Yes."
---
### Are you a data controller, processor, or joint controller?
```

```yaml
id: Q007d
query: >-
  Do you transfer personal data across borders, and if so to which countries?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/DataHandling/Transfers"]
overlap_ids: ["CompanyProfile:2025/DataHandling/PIIType"]
capability_tags: ["Register","Workflow","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/DataHandling"
    locator: "Section 7"
ui:
  cards_hint: ["Cross-border data","Destination countries"]
  actions:
    - type: open_register
      target: transfers
      label: "Record transfers"
    - type: start_workflow
      target: dpa_pack
      label: "Generate SCC/DPA pack"
output_mode: both
graph_required: false
notes: "Depends on Q007a == Yes."
---
### Do you transfer personal data across borders, and if so to which countries?
```

```yaml
id: Q007e
query: >-
  How long do you keep personal data and what is your retention policy?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/DataHandling/Retention"]
overlap_ids: ["CompanyProfile:2025/DataHandling/PIIType"]
capability_tags: ["Register","Evidence-Guided","Reminder"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/DataHandling"
    locator: "Section 7"
ui:
  cards_hint: ["Retention schedule"]
  actions:
    - type: open_register
      target: document_register
      label: "Record retention schedule"
output_mode: both
graph_required: false
notes: "Depends on Q007a == Yes."
---
### How long do you keep personal data and what is your retention policy?
```

```yaml
id: Q007f
query: >-
  What technical and organizational measures do you use to secure personal data?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/DataHandling/Security"]
overlap_ids: ["CompanyProfile:2025/DataHandling/Retention"]
capability_tags: ["Register","Evidence-Guided","Workflow"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/DataHandling"
    locator: "Section 7"
ui:
  cards_hint: ["Encryption","Access controls"]
  actions:
    - type: open_register
      target: operational_controls
      label: "Record security measures"
output_mode: both
graph_required: false
notes: "Depends on Q007a == Yes."
---
### What technical and organizational measures do you use to secure personal data?
```

---

## 8) GovernanceCompliance (granular)

```yaml
id: Q008a
query: >-
  Which formal compliance roles exist (e.g., CISO, DPO, Compliance Officer)?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/GovernanceCompliance/Roles"]
overlap_ids: []
capability_tags: ["Register","Planner","Reminder"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/GovernanceCompliance"
    locator: "Section 8"
ui:
  cards_hint: ["Role coverage"]
  actions:
    - type: open_register
      target: audits
      label: "Record governance roles"
output_mode: both
graph_required: false
notes: "Drives ownership of registers and workflows."
---
### Which formal compliance roles exist (e.g., CISO, DPO, Compliance Officer)?
```

```yaml
id: Q008b
query: >-
  Which policies are formally approved and in force (security, privacy, AI, etc.)?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/GovernanceCompliance/PolicyCoverage"]
overlap_ids: []
capability_tags: ["Draft Doc","Versioning","Reminder","Register"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/GovernanceCompliance"
    locator: "Section 8"
ui:
  cards_hint: ["Policy list","Effective dates"]
  actions:
    - type: create_policy
      target: isms_policy
      label: "Draft ISMS policy"
    - type: open_template
      target: privacy_internal_policy
      label: "Generate Privacy Policy"
    - type: start_workflow
      target: policy_refresh
      label: "Schedule reviews"
output_mode: both
graph_required: false
notes: "Map each to owners and review cadence."
---
### Which policies are formally approved and in force (security, privacy, AI, etc.)?
```

```yaml
id: Q008c
query: >-
  What certifications or attestations do you hold (ISO 27001, SOC 2, PCI, etc.)?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/GovernanceCompliance/Certifications"]
overlap_ids: []
capability_tags: ["Register","Report","Reminder"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/GovernanceCompliance"
    locator: "Section 8"
ui:
  cards_hint: ["Certs & expiry"]
  actions:
    - type: open_register
      target: audits
      label: "Record certifications"
    - type: start_workflow
      target: program_maintenance
      label: "Surveillance/recert cadence"
output_mode: both
graph_required: false
notes: "Track expiry and surveillance visits."
---
### What certifications or attestations do you hold (ISO 27001, SOC 2, PCI, etc.)?
```

```yaml
id: Q008d
query: >-
  How often do you run internal audits and management reviews?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/GovernanceCompliance/AuditCadence"]
overlap_ids: []
capability_tags: ["Planner","Workflow","Register"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/GovernanceCompliance"
    locator: "Section 8"
ui:
  cards_hint: ["Audit frequency","MR cadence"]
  actions:
    - type: start_workflow
      target: internal_audit
      label: "Plan internal audit"
    - type: start_workflow
      target: management_review
      label: "Schedule MR"
output_mode: both
graph_required: false
notes: "Evidence: reports and minutes."
---
### How often do you run internal audits and management reviews?
```

```yaml
id: Q008e
query: >-
  Do you run security and privacy training for relevant staff and how is completion tracked?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/GovernanceCompliance/TrainingProgram"]
overlap_ids: ["CompanyProfile:2025/SizeScale/Headcount"]
capability_tags: ["Register","Reminder","Report","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/GovernanceCompliance"
    locator: "Section 8"
ui:
  cards_hint: ["Training cadence","Completion %"]
  actions:
    - type: open_register
      target: training
      label: "Record training program"
output_mode: both
graph_required: false
notes: "Evidence: training_completion_exports."
---
### Do you run security and privacy training for relevant staff and how is completion tracked?
```

---

## 9) CorporateStructure (granular)

```yaml
id: Q009a
query: >-
  Do you have a parent company, subsidiaries, or joint ventures? List legal names and countries.
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/CorporateStructure/GroupMap"]
overlap_ids: ["CompanyProfile:2025/CoreIdentity/EntityRecord"]
capability_tags: ["Register","Report","Classify-Assist"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/CorporateStructure"
    locator: "Section 9"
ui:
  cards_hint: ["Parent","Subsidiaries"]
  actions:
    - type: open_register
      target: legal_regulatory_compliance
      label: "Record group structure"
output_mode: both
graph_required: false
notes: "Scope definition for certifications."
---
### Do you have a parent company, subsidiaries, or joint ventures? List legal names and countries.
```

```yaml
id: Q009b
query: >-
  Which entities are in scope for compliance and certification?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/CorporateStructure/ScopeOfCertification"]
overlap_ids: ["CompanyProfile:2025/GovernanceCompliance/Certifications"]
capability_tags: ["Register","Workflow","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/CorporateStructure"
    locator: "Section 9"
ui:
  cards_hint: ["In-scope entities"]
  actions:
    - type: start_workflow
      target: program_readiness
      label: "Plan scoped readiness"
output_mode: both
graph_required: false
notes: "Clarifies audit boundaries."
---
### Which entities are in scope for compliance and certification?
```

```yaml
id: Q009c
query: >-
  Do entities share central services (HR, IT, security)? Which ones and where?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/CorporateStructure/SharedServices"]
overlap_ids: ["CompanyProfile:2025/TechnologyStack/HostingModel"]
capability_tags: ["Register","Workflow","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/CorporateStructure"
    locator: "Section 9"
ui:
  cards_hint: ["Shared services"]
  actions:
    - type: start_workflow
      target: risk_assessment
      label: "Assess shared services"
output_mode: both
graph_required: false
notes: "Impacts responsibility assignment."
---
### Do entities share central services (HR, IT, security)? Which ones and where?
```

---

## 10) ContractsThirdParties (granular)

```yaml
id: Q010a
query: >-
  Provide a list of critical vendors/processors and the services they provide.
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/ContractsThirdParties/VendorInventory"]
overlap_ids: ["CompanyProfile:2025/GeographicFootprint/VendorCountries"]
capability_tags: ["Register","Report","Workflow"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/ContractsThirdParties"
    locator: "Section 10"
ui:
  cards_hint: ["Vendor list","Service"]
  actions:
    - type: open_register
      target: vendors
      label: "Record vendor inventory"
    - type: start_workflow
      target: vendor_dd
      label: "Start due diligence"
output_mode: both
graph_required: false
notes: "Vendor risk posture."
---
### Provide a list of critical vendors/processors and the services they provide.
```

```yaml
id: Q010b
query: >-
  For each vendor, do you have NDAs, DPAs, and SLAs in place and up to date?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/ContractsThirdParties/ContractPosture"]
overlap_ids: ["CompanyProfile:2025/DataHandling/ProcessingRole"]
capability_tags: ["Register","Evidence-Guided","Reminder"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/ContractsThirdParties"
    locator: "Section 10"
ui:
  cards_hint: ["NDA/DPA/SLA status"]
  actions:
    - type: open_register
      target: vendors
      label: "Link contract status"
output_mode: both
graph_required: false
notes: "Evidence: dpa_signed_pack, nda_signed_copies."
---
### For each vendor, do you have NDAs, DPAs, and SLAs in place and up to date?
```

```yaml
id: Q010c
query: >-
  Do you maintain a public or customer-provided subprocessor list?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/ContractsThirdParties/SubprocessorTransparency"]
overlap_ids: ["CompanyProfile:2025/GeographicFootprint/VendorCountries"]
capability_tags: ["Register","Report","Reminder"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/ContractsThirdParties"
    locator: "Section 10"
ui:
  cards_hint: ["Subprocessor list"]
  actions:
    - type: open_register
      target: vendors
      label: "Maintain subprocessor list"
output_mode: both
graph_required: false
notes: "Supports customer notifications."
---
### Do you maintain a public or customer-provided subprocessor list?
```

```yaml
id: Q010d
query: >-
  How do you tier vendor risk and how often do you re-assess?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/ContractsThirdParties/RiskTiering"]
overlap_ids: ["CompanyProfile:2025/ContractsThirdParties/VendorInventory"]
capability_tags: ["Register","Workflow","Planner","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/ContractsThirdParties"
    locator: "Section 10"
ui:
  cards_hint: ["Tiering","Cadence"]
  actions:
    - type: start_workflow
      target: vendor_dd
      label: "Schedule re-assessment"
output_mode: both
graph_required: false
notes: "Map cadence by tier."
---
### How do you tier vendor risk and how often do you re-assess?
```

---

## 11) RiskChangeDrivers (granular)

```yaml
id: Q011a
query: >-
  Do you plan expansion to new markets, products, or sectors in the next 12–24 months?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/RiskChangeDrivers/Expansion"]
overlap_ids: ["CompanyProfile:2025/GeographicFootprint/Countries","CompanyProfile:2025/IndustrySector/Classification"]
capability_tags: ["Register","Planner","Workflow"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/RiskChangeDrivers"
    locator: "Section 11"
ui:
  cards_hint: ["New markets","Timeline"]
  actions:
    - type: start_workflow
      target: program_readiness
      label: "Expansion readiness"
output_mode: both
graph_required: false
notes: "Prepare obligations before launch."
---
### Do you plan expansion to new markets, products, or sectors in the next 12–24 months?
```

```yaml
id: Q011b
query: >-
  Do you plan to introduce or scale AI features that affect customers or employees?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/RiskChangeDrivers/AIRoadmap"]
overlap_ids: ["CompanyProfile:2025/TechnologyStack/AIUseCases","CompanyProfile:2025/DataHandling/PIIType"]
capability_tags: ["Workflow","Planner","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/RiskChangeDrivers"
    locator: "Section 11"
ui:
  cards_hint: ["AI roadmap"]
  actions:
    - type: start_workflow
      target: risk_assessment
      label: "Plan AI risk & controls"
output_mode: both
graph_required: false
notes: "Potential EU AI Act scope."
---
### Do you plan to introduce or scale AI features that affect customers or employees?
```

```yaml
id: Q011c
query: >-
  Are M&A or major restructuring events expected that could change compliance scope?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/RiskChangeDrivers/MandA"]
overlap_ids: ["CompanyProfile:2025/CorporateStructure/GroupMap"]
capability_tags: ["Register","Workflow","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/RiskChangeDrivers"
    locator: "Section 11"
ui:
  cards_hint: ["M&A pipeline"]
  actions:
    - type: start_workflow
      target: program_readiness
      label: "M&A readiness"
output_mode: both
graph_required: false
notes: "Plan integration and scope changes."
---
### Are M&A or major restructuring events expected that could change compliance scope?
```

```yaml
id: Q011d
query: >-
  Have you had regulator inquiries, findings, or fines in the last 36 months?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/RiskChangeDrivers/RegulatoryHistory"]
overlap_ids: []
capability_tags: ["Register","Tracker","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/RiskChangeDrivers"
    locator: "Section 11"
ui:
  cards_hint: ["Inquiries","Fines"]
  actions:
    - type: open_tracker
      target: findings
      label: "Track regulator findings"
output_mode: both
graph_required: false
notes: "Influences risk posture and audits."
---
### Have you had regulator inquiries, findings, or fines in the last 36 months?
```

```yaml
id: Q011e
query: >-
  Do you have resource gaps (people, tools) that could hinder compliance?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/RiskChangeDrivers/ResourceGaps"]
overlap_ids: ["CompanyProfile:2025/GovernanceCompliance/Roles"]
capability_tags: ["Tracker","Planner","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/RiskChangeDrivers"
    locator: "Section 11"
ui:
  cards_hint: ["Gaps","Mitigations"]
  actions:
    - type: open_tracker
      target: remediation
      label: "Plan gap remediation"
output_mode: both
graph_required: false
notes: "Link gaps to owners and dates."
---
### Do you have resource gaps (people, tools) that could hinder compliance?
```

---

## 12) Graph/RAG Notes

- Use `overlap_ids` in YAML for soft links.
- Export hard graph edges to `docs/qa/derived/graph_edges_proposed.csv` with columns: `subject_id,predicate,object_id,confidence,notes`.
- Predicates: `triggers`, `requires_evidence`, `overlaps_with`, `implies`, `populates`, `start_workflow`, `supports`.
- Keep one Q/A per chunk for clean retrieval.

**Example edges (abbrev.):**

```
CompanyProfile:2025/DataHandling/Transfers,populates,ui/register/transfers,0.95,"track x-border"
CompanyProfile:2025/ContractsThirdParties/ContractPosture,requires_evidence,evidence/dpa_signed_pack,0.9,"DPAs"
CompanyProfile:2025/GovernanceCompliance/TrainingProgram,requires_evidence,evidence/training_completion_exports,0.9,"training"
CompanyProfile:2025/TechnologyStack/LoggingMonitoring,requires_evidence,evidence/siem_alert_exports,0.85,"alerts"
CompanyProfile:2025/TechnologyStack/AIUseCases,overlaps_with,EUAI:2024/Annex.III,0.6,"potential high-risk"
```

---

## 13) Author Checklist (profiling)

-



---

## Completeness Expansion — Additional Granular Q/As

### 1) CoreIdentity — more granularity

```yaml
id: Q001c
query: >-
  What is the year founded and legal entity type (LLC, GmbH, Plc, etc.)?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/CoreIdentity/EntityType"]
overlap_ids: ["CompanyProfile:2025/CoreIdentity/EntityRecord"]
capability_tags: ["Register","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/CoreIdentity"
    locator: "Section 1"
ui:
  cards_hint: ["Year founded","Entity type"]
  actions:
    - type: open_register
      target: legal_regulatory_compliance
      label: "Record entity type"
output_mode: both
notes: "Used for maturity context and regulator forms."
---
### What is the year founded and legal entity type (LLC, GmbH, Plc, etc.)?
```

```yaml
id: Q001d
query: >-
  In which jurisdictions are you registered and what are your tax IDs?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/CoreIdentity/Registrations"]
overlap_ids: ["CompanyProfile:2025/GeographicFootprint/Countries"]
capability_tags: ["Register","Evidence-Guided","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/CoreIdentity"
    locator: "Section 1"
ui:
  cards_hint: ["Registrations","Tax IDs"]
  actions:
    - type: open_register
      target: legal_regulatory_compliance
      label: "Record registrations"
output_mode: both
notes: "Supports regulator correspondence and filings."
---
### In which jurisdictions are you registered and what are your tax IDs?
```

---

### 2) SizeScale — more granularity

```yaml
id: Q002c
query: >-
  What is your staff distribution by country and by function (Eng, Ops, Sales, Support)?
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/SizeScale/StaffDistribution"]
overlap_ids: ["CompanyProfile:2025/GeographicFootprint/Countries"]
capability_tags: ["Register","Report"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/SizeScale"
    locator: "Section 2"
ui:
  cards_hint: ["Country split","Function split"]
  actions:
    - type: open_register
      target: kpi_metrics
      label: "Record staff distribution"
output_mode: both
notes: "Impacts training scope and DSR coverage."
---
### What is your staff distribution by country and by function (Eng, Ops, Sales, Support)?
```

```yaml
id: Q002d
query: >-
  Do you rely on outsourcing or staffing agencies? List the providers and locations.
packs: ["CompanyProfile:2025"]
primary_ids: ["CompanyProfile:2025/SizeScale/Outsourcing"]
overlap_ids: ["CompanyProfile:2025/ContractsThirdParties/VendorInventory"]
capability_tags: ["Register","Workflow","Evidence-Guided"]
sources:
  - title: "Company Profiling Schema v1"
    id: "CompanyProfile:2025/SizeScale"
    locator: "Section 2"
ui:
  cards_hint: ["Outsourcers","Locations"]
  actions:
    - type: open_register
      target: vendors
      label: "Record staffing vendors"
    - type: start_workflow
      target: vendor_dd
      label: "Due diligence for staffing"
output_mode: both
notes: "Third-party access risk."
---
### Do you rely on outsourcing or staffing agen
```
