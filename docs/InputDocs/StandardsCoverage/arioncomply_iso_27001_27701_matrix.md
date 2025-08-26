# ArionComply ISO/IEC 27001 & ISO/IEC 27701 Compliance Matrix

This document provides a **comprehensive mapping for ISO/IEC 27001:2022 and ISO/IEC 27701:2019**, showing how ArionComply scope elements align with all relevant controls and indicating overlaps with GDPR, EU AI Act, and NIS2 where applicable.

---

## ISO/IEC 27001:2022 (Clauses & Annex A Controls)
- **Status:** All 93 Annex A controls mapped (see detailed table in ArionComply ISO27001 Matrix Full).
- **Overlap Indicators:**
  - With **GDPR**: Data classification, access control, incident reporting, audit logs, retention, supplier agreements.
  - With **ISO 27701**: Roles & responsibilities, SoA extensions, PII protection controls.
  - With **AI Act**: Logging, bias testing, secure development.
  - With **NIS2**: Incident notification, vulnerability management, supply chain, monitoring.

### Key Areas
- ISMS establishment, leadership, and policies.
- Risk assessment and treatment.
- Control implementation and monitoring.
- Annex A organizational, people, physical, and technological controls.
- Auditability and evidence workflows.

(Reference: *Arioncomply Iso27001 Matrix Full*)

---

## ISO/IEC 27701:2019 (Privacy Information Management System)
- **Status:** Includes Annex A (Controller) and Annex B (Processor) controls.
- **Overlap Indicators:**
  - With **GDPR**: RoPA, lawful basis, DSRs, DPIAs, breach notification, consent.
  - With **ISO 27001**: Information classification, supplier security, access control.
  - With **AI Act**: Transparency, accountability for PII in AI systems.
  - With **NIS2**: Breach notification, business continuity.

### Annex A – Controller Controls (Examples)
| Control | Requirement Area | Scope Elements | Overlap |
|---------|------------------|----------------|---------|
| A.7.2.1 | Determining purpose and lawful basis | Data Mgmt (processing activities, lawful basis registry) | GDPR Art. 6 |
| A.7.3.1 | Privacy notice | Document Automation (privacy notices) | GDPR Art. 13/14 |
| A.7.3.5 | Responding to DSRs | AI Assistant (draft responses), Workflow Engine (DSR handling) | GDPR Art. 12–23 |
| A.7.4.1 | DPIAs | Workflow Engine (PIA workflows, evidence storage) | GDPR Art. 35 |
| A.7.5.1 | Breach notification | Workflow Engine (incident workflows, regulator notifications) | GDPR Art. 33/34, NIS2 |

### Annex B – Processor Controls (Examples)
| Control | Requirement Area | Scope Elements | Overlap |
|---------|------------------|----------------|---------|
| B.8.2.1 | Acting on controller’s instructions | Workflow Engine (processor workflows, contract evidence) | GDPR Art. 28 |
| B.8.2.2 | Assisting with DSRs | Workflow Engine (support workflows, evidence logs) | GDPR Art. 28 |
| B.8.2.3 | Supporting DPIAs | Workflow Engine (processor contribution workflows) | GDPR Art. 28/35 |
| B.8.2.4 | Security of processing | Vendor Admin Portal (RBAC, RLS, logs) | GDPR Art. 32, ISO 27001 A.8 |

---

## Overlap Summary
- **ISO 27001 ↔ ISO 27701**: Shared foundation (ISMS + PIMS integration).
- **ISO 27701 ↔ GDPR**: Substantial alignment (lawful basis, DPIAs, DSRs).
- **ISO 27001 ↔ NIS2**: Security and incident overlaps.
- **ISO 27701 ↔ AI Act**: AI systems processing PII must align with both.

---

This document serves as the **superset reference for ISO/IEC 27001 & ISO/IEC 27701**, with overlaps noted for GDPR, EU AI Act, and NIS2. Dedicated documents will cover those frameworks in depth.

