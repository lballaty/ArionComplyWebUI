# ArionComply NIS2 Compliance Coverage Matrix (Full)

This document maps **all key Chapters and Articles of the NIS2 Directive (Directive (EU) 2022/2555)** to ArionComply scope elements, tagged **Mandatory (M)** or **Optional (O)**, and highlights overlaps with ISO/IEC 27001, ISO/IEC 27701, GDPR, and EU AI Act.

---

## Chapter I – General Provisions
| Article | Requirement Area | Scope Elements | Tag | Overlap |
|---------|------------------|----------------|-----|---------|
| Arts. 1–4 | Subject matter, scope, definitions | Document Automation (compliance register, glossary, scope metadata) | M | ISO 27001 Cl. 4, GDPR Ch. I |
| Art. 5–6 | Entities covered (essential and important entities, sector classification) | Data Management (entity type registry, sector tagging) | M | ISO 27001 Asset Mgmt |

---

## Chapter II – Cybersecurity Risk Management and Reporting
| Article | Requirement Area | Scope Elements | Tag | Overlap |
|---------|------------------|----------------|-----|---------|
| Art. 20 | Governance (management accountability, board oversight) | Dashboards & Analytics (executive reporting, accountability dashboards) | M | ISO 27001 Cl. 5 |
| Art. 21(1) | General cybersecurity risk management measures | Workflow Engine (risk workflows, mitigation, monitoring) | M | ISO 27001 Cl. 6, AI Act Art. 8 |
| Art. 21(2)(a) | Policies on risk analysis and information security | Document Automation (security policies) | M | ISO 27001 A.5.1 |
| Art. 21(2)(b) | Incident handling | Workflow Engine (incident management workflows, evidence packages) | M (Audit/Evidence) | ISO 27001 A.5.29, GDPR Art. 33 |
| Art. 21(2)(c) | Business continuity, backup mgmt, disaster recovery | Workflow Engine (BCP/DR workflows, test evidence), Data Mgmt (backup records) | M (Audit/Evidence) | ISO 27001 A.7.5, A.8.13 |
| Art. 21(2)(d) | Supply chain security | Workflow Engine (vendor risk workflows, monitoring) | M | ISO 27001 A.5.16, GDPR Art. 28 |
| Art. 21(2)(e) | Security in network and information systems acquisition, development and maintenance | Workflow Engine (secure SDLC workflows, change mgmt, evidence logs) | M | ISO 27001 A.8.26–A.8.32, AI Act Art. 14 |
| Art. 21(2)(f) | Policies and procedures to assess effectiveness of cybersecurity measures | Dashboards & Analytics (compliance KPIs, maturity models) | M | ISO 27001 Cl. 9 |
| Art. 21(2)(g) | Basic cyber hygiene, training | Workflow Engine (training workflows), AI Assistant (mentoring, education) | M (Audit/Evidence) | ISO 27001 Cl. 7.2, GDPR Art. 39 |
| Art. 21(2)(h) | Cryptography and encryption | Workflow Engine (crypto workflows, key mgmt logs) | M (Audit/Evidence) | ISO 27001 A.8.24–25 |
| Art. 21(2)(i) | Human resources security, access policies | Vendor Admin Portal (RBAC, RLS, access logs) | M (Audit/Evidence) | ISO 27001 A.6.1–6.8 |
| Art. 21(3) | Vulnerability handling and disclosure | Workflow Engine (vulnerability workflows, evidence logs) | M (Audit/Evidence) | ISO 27001 A.8.8, AI Act Art. 14 |

---

## Chapter III – Cybersecurity Information Sharing
| Article | Requirement Area | Scope Elements | Tag | Overlap |
|---------|------------------|----------------|-----|---------|
| Art. 22 | Voluntary info sharing | Workflow Engine (threat intel workflows, evidence logs) | O | ISO 27001 A.5.7 |

---

## Chapter IV – Reporting Obligations
| Article | Requirement Area | Scope Elements | Tag | Overlap |
|---------|------------------|----------------|-----|---------|
| Art. 23 | Incident reporting (initial 24h, intermediate 72h, final report 1 month) | Workflow Engine (incident workflows, reporting templates, evidence) | M (Audit/Evidence) | GDPR Art. 33, ISO 27001 A.5.29 |

---

## Chapter V – Implementation and Enforcement
| Article | Requirement Area | Scope Elements | Tag | Overlap |
|---------|------------------|----------------|-----|---------|
| Arts. 24–28 | Supervision and enforcement | Document Automation (audit templates, regulator liaison) | M | GDPR Ch. VI–VII, ISO 27001 Cl. 9 |
| Arts. 29–33 | Penalties and sanctions | Dashboards & Analytics (penalty tracking, accountability reporting) | O | GDPR Art. 83–84, AI Act Title VII |

---

## Chapter VI – Cooperation and Strategic Frameworks
| Article | Requirement Area | Scope Elements | Tag | Overlap |
|---------|------------------|----------------|-----|---------|
| Arts. 34–45 | Cooperation group, CSIRTs, national strategies, peer reviews | Document Automation (liaison templates, national strategy alignment registers) | O | GDPR Ch. VII, AI Act Title VI |

---

## Completeness Notes
- All **Chapters and Articles of NIS2 Directive** mapped.
- Tags (M/O) applied, with audit/evidence emphasis on incident handling, reporting, vulnerability management, supply chain, and board-level accountability.
- Explicit overlaps marked with ISO 27001, ISO 27701, GDPR, and AI Act.
- Provides **superset reference** for NIS2 compliance in ArionComply.

