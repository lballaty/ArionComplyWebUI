# Statement of Applicability (SoA) - ISO 27001

## ArionComply Platform Metadata

```yaml
# Template Configuration
template_id: ISO27001-SOA-001
template_type: statement_of_applicability
template_version: 1.0
template_status: draft
created_date: {{CURRENT_DATE}}
last_modified: {{CURRENT_DATE}}

# Compliance Framework
compliance_framework: ISO_27001
standard_version: "2022"
document_priority: mandatory_core

# ISO 27001 Requirements Mapping
iso_27001_clauses:
  - Clause.6.1.3 # Information security risk treatment
  - Clause.A # Annex A Reference Controls

iso_27001_controls:
  - ALL_ANNEX_A_CONTROLS # This document addresses all Annex A controls

# Audit Evidence Points
audit_evidence:
  - control_applicability_decisions
  - implementation_status_documentation
  - justification_rationale
  - risk_treatment_alignment
  - control_effectiveness_evidence
  - management_approval_records
  - review_cycle_documentation

# Platform Integration
tenant_customizable_fields:
  - control_selection_criteria
  - implementation_approaches
  - justification_templates
  - maturity_levels
  - review_schedules
  - approval_workflows
  - effectiveness_metrics

approval_workflow:
  - role: Risk_Manager
    action: control_selection_review
    required: true
  - role: ISMS_Manager
    action: implementation_validation
    required: true
  - role: Business_Manager
    action: business_impact_review
    required: true
  - role: Senior_Management
    action: soa_approval
    required: true

review_cycle:
  frequency: annual
  mandatory_triggers:
    - risk_assessment_updates
    - control_implementation_changes
    - regulatory_requirement_changes
    - audit_findings
    - significant_incidents

automation_features:
  - control_mapping_automation
  - implementation_status_tracking
  - justification_validation
  - compliance_gap_analysis
  - effectiveness_monitoring
  - review_reminder_automation
  - reporting_generation

dependencies:
  prerequisite_documents:
    - isms_policy
    - isms_scope_definition
    - risk_management_policy
    - risk_assessment_results
    - risk_treatment_plan
  enables_documents:
    - control_implementation_procedures
    - security_control_specifications
    - monitoring_and_measurement_procedures
    - internal_audit_program
```

---

## Document Control Block

*This section tracks important information about this document*

| Field | Value | Explanation |
|-------|-------|-------------|
| **Document ID** | {{TEMPLATE_ID}} | *Unique identifier for this Statement of Applicability* |
| **Document Title** | Statement of Applicability (SoA) | *Document that declares which ISO 27001 controls apply to your organization* |
| **ISO 27001 Reference** | Clause 6.1.3, Annex A | *Control selection and documentation requirements* |
| **Document Type** | Mandatory Declaration | *Required document for ISO 27001 compliance* |
| **Classification** | {{CLASSIFICATION_LEVEL}} | *Usually Internal - contains organizational control decisions* |
| **Owner** | {{SOA_OWNER}} | *Person responsible for maintaining control applicability decisions* |
| **Approved By** | {{SENIOR_MANAGEMENT}} | *Management authority approving control selection strategy* |
| **Effective Date** | {{EFFECTIVE_DATE}} | *When these control decisions become official* |
| **Review Date** | {{REVIEW_DATE}} | *When control applicability must be reviewed again* |
| **Version** | {{VERSION_NUMBER}} | *Version tracking - SoA evolves with risk and business changes* |
| **Status** | {{DOCUMENT_STATUS}} | *Current status of this Statement of Applicability* |

---

## 1. Introduction to Statement of Applicability

*This section explains what a Statement of Applicability is and why it's essential*

### 1.1 What is a Statement of Applicability?

**Simple Definition:**
A Statement of Applicability (SoA) is a document that declares which ISO 27001 Annex A security controls your organization has chosen to implement, which ones you've excluded, and why you made these decisions. Think of it like a detailed menu where you check off which security "dishes" you're ordering for your organization and explain why you chose or declined each one.

**Real-World Analogy:**
Imagine you're planning a comprehensive health and fitness program:
- **Available Options** = All 93 ISO 27001 Annex A controls (like a complete fitness menu)
- **Your Assessment** = Your risk assessment (like a medical exam identifying health risks)
- **Your Selection** = Controls you choose to implement (like selecting specific exercises, diet changes, medications)
- **Your Justification** = Why you chose each option (like explaining why you need cardio for heart health but skip weightlifting due to back problems)
- **Your Plan** = How and when you'll implement each choice (like a structured fitness schedule)

**Why the SoA is Critical:**
- **Demonstrates Systematic Approach**: Shows you've considered all controls systematically, not randomly
- **Provides Audit Trail**: Documents your decision-making process for auditors and stakeholders
- **Ensures Complete Coverage**: Helps ensure no important security areas are overlooked
- **Justifies Exclusions**: Explains why certain controls aren't needed for your specific situation
- **Supports Compliance**: Required by ISO 27001 standard for certification
- **Guides Implementation**: Provides roadmap for implementing chosen controls

### 1.2 SoA Components and Structure

**Understanding SoA Elements:**

#### 1.2.1 Control Identification
*Which specific controls you're addressing*

**What is Control Identification?**
Each of the 93 controls in ISO 27001 Annex A has a unique identifier and title. Your SoA must address every single one - no exceptions.

**ISO 27001:2022 Annex A Structure:**
- **A.5**: Organizational Controls (37 controls)
- **A.6**: People Controls (8 controls)  
- **A.7**: Physical Controls (14 controls)
- **A.8**: Technological Controls (34 controls)

**Example Control References:**
- **A.5.1.1**: Information security policy
- **A.8.9.1**: Configuration management
- **A.7.2.1**: Equipment placement and protection

#### 1.2.2 Applicability Decision
*Whether each control applies to your organization*

**Applicability Options:**
- **Applicable**: Control is relevant and will be implemented
- **Not Applicable**: Control is not relevant to your organization or scope
- **Partially Applicable**: Some aspects of the control apply, others don't

**Applicability Factors to Consider:**
- **Risk Assessment Results**: Does your risk assessment identify risks this control addresses?
- **Business Environment**: Is this control relevant to your type of business?
- **Technology Environment**: Do you have technology that this control applies to?
- **Regulatory Requirements**: Do laws or regulations require this control?
- **ISMS Scope**: Is this control within your defined ISMS scope?

#### 1.2.3 Implementation Status
*Current status of control implementation*

**Implementation Status Options:**
{{IMPLEMENTATION_STATUS_OPTIONS}}

**Status Categories:**
- **Not Started**: Control implementation has not begun
- **In Planning**: Control implementation is being planned
- **In Progress**: Control implementation is underway
- **Implemented**: Control is fully implemented and operational
- **Under Review**: Control implementation is being reviewed for effectiveness

**Status Details to Include:**
- **Implementation Percentage**: How much of the control is implemented (0-100%)
- **Target Completion Date**: When full implementation is expected
- **Current Phase**: Which implementation phase is currently active
- **Key Milestones**: Major milestones completed or upcoming
- **Dependencies**: What the implementation depends on

#### 1.2.4 Justification
*Why you made each applicability decision*

**What is Justification?**
Justification explains the reasoning behind your applicability decisions. This is especially important for controls marked as "Not Applicable" - you need to clearly explain why.

**Justification Types:**
- **Risk-Based**: Based on risk assessment results
- **Business-Based**: Based on business model or operations
- **Technical-Based**: Based on technology environment
- **Regulatory-Based**: Based on regulatory requirements
- **Scope-Based**: Based on ISMS scope boundaries

**Good Justification Examples:**
- **A.7.1.2 Physical entry** - "Not Applicable: Organization operates fully remote with no physical offices"
- **A.8.15.1 Logging** - "Applicable: Risk assessment identified need for audit trails on all business systems"
- **A.6.3.1 Disciplinary process** - "Applicable: Required by employment law and internal HR policies"

### 1.3 SoA Benefits and Value

**How SoA Helps Your Organization:**

#### 1.3.1 Strategic Benefits
- **Risk-Based Security**: Ensures security controls directly address identified risks
- **Resource Optimization**: Focuses resources on controls that provide maximum value
- **Compliance Demonstration**: Provides clear evidence of systematic approach to compliance
- **Stakeholder Communication**: Helps communicate security approach to stakeholders
- **Decision Documentation**: Documents decision-making process for future reference

#### 1.3.2 Operational Benefits
- **Implementation Roadmap**: Provides clear roadmap for implementing security controls
- **Gap Identification**: Identifies gaps between current state and desired state
- **Priority Setting**: Helps prioritize control implementation based on risk and business needs
- **Resource Planning**: Supports resource planning for control implementation
- **Progress Tracking**: Enables tracking of implementation progress over time

#### 1.3.3 Audit and Compliance Benefits
- **Audit Preparation**: Provides foundation for internal and external audits
- **Evidence Collection**: Centralizes evidence about control decisions and implementation
- **Compliance Reporting**: Supports compliance reporting to management and stakeholders
- **Certification Support**: Essential document for ISO 27001 certification
- **Regulatory Alignment**: Demonstrates systematic approach required by many regulations

---

## 2. Control Selection Methodology

*This section explains the systematic approach for selecting applicable controls*

### 2.1 Selection Framework

#### 2.1.1 Selection Principles

**Our Control Selection Philosophy:**
{{ORGANIZATION_NAME}} selects security controls based on a systematic, risk-driven approach that considers business requirements, regulatory obligations, and cost-effectiveness while ensuring comprehensive protection of information assets.

**Selection Principles:**
{{CONTROL_SELECTION_PRINCIPLES}}

**Risk-Based Selection:**
- **Risk Coverage**: Controls must address risks identified in risk assessment
- **Risk Priority**: Higher priority risks receive more comprehensive control coverage
- **Risk Effectiveness**: Controls must effectively reduce identified risks to acceptable levels
- **Risk Efficiency**: Controls should provide maximum risk reduction for available resources

**Business-Aligned Selection:**
- **Business Support**: Controls must support rather than hinder business objectives
- **Operational Fit**: Controls must fit with existing business operations and culture
- **Resource Consideration**: Control requirements must be realistic given available resources
- **Value Demonstration**: Controls must provide clear value to business operations

**Compliance-Driven Selection:**
- **Regulatory Requirements**: Controls required by applicable laws and regulations must be included
- **Industry Standards**: Controls expected by industry standards and best practices
- **Contractual Obligations**: Controls required by customer or partner contracts
- **Certification Requirements**: Controls necessary for desired certifications

#### 2.1.2 Selection Process

**Control Selection Methodology:**
{{CONTROL_SELECTION_METHODOLOGY}}

**Selection Process Steps:**

**Step 1: Risk Assessment Alignment**
*Ensure control selection addresses identified risks*

**Risk-Control Mapping Process:**
1. **Risk Review**: Review all risks identified in risk assessment
2. **Control Identification**: Identify controls that could address each risk
3. **Coverage Analysis**: Analyze how well different controls address each risk
4. **Gap Assessment**: Identify any risks not adequately addressed by available controls
5. **Completeness Verification**: Verify that all significant risks have appropriate control coverage

**Risk-Control Mapping Template:**
```
RISK-CONTROL MAPPING

Risk ID: {{RISK_ID}}
Risk Description: {{RISK_DESCRIPTION}}
Risk Level: {{RISK_LEVEL}}

Relevant Controls:
Primary Controls:
- {{PRIMARY_CONTROL_1}}: {{PRIMARY_JUSTIFICATION_1}}
- {{PRIMARY_CONTROL_2}}: {{PRIMARY_JUSTIFICATION_2}}

Supporting Controls:
- {{SUPPORTING_CONTROL_1}}: {{SUPPORTING_JUSTIFICATION_1}}
- {{SUPPORTING_CONTROL_2}}: {{SUPPORTING_JUSTIFICATION_2}}

Control Coverage Assessment:
- Likelihood Reduction: {{LIKELIHOOD_REDUCTION}}
- Impact Reduction: {{IMPACT_REDUCTION}}
- Overall Effectiveness: {{OVERALL_EFFECTIVENESS}}
- Coverage Gaps: {{COVERAGE_GAPS}}
```

**Step 2: Business Environment Analysis**
*Consider how controls fit with business environment*

**Business Environment Factors:**
- **Industry Characteristics**: What controls are typical for your industry?
- **Business Model**: How does your business model affect control applicability?
- **Organizational Size**: How does your organization size affect control feasibility?
- **Technology Environment**: What technology do you have that controls apply to?
- **Geographic Scope**: Do you operate in multiple jurisdictions with different requirements?

**Business Environment Questions:**
- Does this control apply to our type of business?
- Do we have the assets or processes this control addresses?
- Is this control feasible given our organizational size and resources?
- Does this control conflict with our business operations?
- Are there alternative ways to achieve the same security objective?

**Step 3: Regulatory and Compliance Review**
*Ensure all required controls are included*

**Regulatory Analysis Process:**
1. **Requirement Identification**: Identify all applicable regulatory requirements
2. **Control Mapping**: Map regulatory requirements to ISO 27001 controls
3. **Mandatory Inclusion**: Mark controls required by regulation as mandatory
4. **Compliance Verification**: Verify that all regulatory requirements are addressed
5. **Documentation**: Document regulatory basis for control selection

**Common Regulatory Drivers:**
- **GDPR**: Data protection and privacy controls
- **HIPAA**: Healthcare information protection controls
- **PCI DSS**: Payment card data protection controls
- **SOX**: Financial reporting controls
- **Industry Regulations**: Sector-specific regulatory requirements

**Step 4: Cost-Benefit Analysis**
*Evaluate cost-effectiveness of control options*

**Cost-Benefit Factors:**
- **Implementation Costs**: One-time costs to implement control
- **Operational Costs**: Ongoing costs to operate and maintain control
- **Risk Reduction Value**: Value of risk reduction provided by control
- **Business Benefits**: Additional business benefits beyond risk reduction
- **Alternative Options**: Cost and effectiveness of alternative approaches

**Cost-Benefit Decision Matrix:**
| Control | Implementation Cost | Operational Cost | Risk Reduction | Business Value | Cost-Effectiveness |
|---------|-------------------|-----------------|----------------|---------------|-------------------|
| {{CONTROL_1}} | {{IMPL_COST_1}} | {{OPER_COST_1}} | {{RISK_RED_1}} | {{BUS_VALUE_1}} | {{COST_EFF_1}} |
| {{CONTROL_2}} | {{IMPL_COST_2}} | {{OPER_COST_2}} | {{RISK_RED_2}} | {{BUS_VALUE_2}} | {{COST_EFF_2}} |

### 2.2 Applicability Criteria

#### 2.2.1 Applicable Controls

**Criteria for Marking Controls as Applicable:**
{{APPLICABLE_CRITERIA}}

**Primary Applicability Indicators:**
- **Risk Assessment Coverage**: Control addresses risks identified in risk assessment
- **Asset Relevance**: Control applies to assets within ISMS scope
- **Business Relevance**: Control is relevant to organizational business activities
- **Regulatory Requirement**: Control is required by applicable regulations
- **Industry Expectation**: Control is expected for organizations in your industry

**Applicability Decision Process:**
1. **Initial Screening**: Does this control category apply to our organization?
2. **Risk Relevance**: Does this control address risks we've identified?
3. **Asset Applicability**: Do we have assets this control protects?
4. **Business Fit**: Can this control be integrated with our business operations?
5. **Resource Feasibility**: Can we realistically implement and maintain this control?
6. **Final Decision**: Is this control applicable to our organization?

#### 2.2.2 Not Applicable Controls

**Valid Reasons for Marking Controls as Not Applicable:**
{{NOT_APPLICABLE_CRITERIA}}

**Acceptable Non-Applicability Justifications:**

**Scope-Based Exclusions:**
- **Out of Scope Assets**: "Control addresses assets outside our ISMS scope"
- **Excluded Processes**: "Control applies to business processes excluded from ISMS scope"
- **Geographic Exclusions**: "Control applies to geographic locations outside ISMS scope"

**Business Model Exclusions:**
- **Irrelevant Business Activities**: "Organization doesn't engage in activities this control addresses"
- **Different Business Model**: "Control designed for different type of business model"
- **Service Model Differences**: "Control applies to service models we don't use"

**Technology Environment Exclusions:**
- **Technology Not Used**: "Organization doesn't use technology this control addresses"
- **Different Architecture**: "Control assumes technical architecture we don't have"
- **Cloud vs. On-Premises**: "Control applies to infrastructure model we don't use"

**Risk-Based Exclusions:**
- **No Identified Risk**: "Risk assessment found no significant risks this control addresses"
- **Risk Outside Tolerance**: "Risk this control addresses is below our risk tolerance threshold"
- **Alternative Controls**: "Risk is adequately addressed by other, more appropriate controls"

**Invalid Non-Applicability Justifications:**
- **Cost Concerns**: "Too expensive" is not valid justification for non-applicability
- **Resource Constraints**: "Don't have resources" doesn't make control non-applicable
- **Implementation Difficulty**: "Too hard to implement" doesn't affect applicability
- **Preference**: "Don't want to implement" is not valid justification

#### 2.2.3 Partially Applicable Controls

**When to Use Partial Applicability:**
{{PARTIAL_APPLICABILITY_CRITERIA}}

**Partial Applicability Scenarios:**
- **Mixed Environment**: Some control elements apply, others don't
- **Phased Implementation**: Control applicable but being implemented in phases
- **Scope Boundaries**: Control partially within and partially outside ISMS scope
- **Technology Mix**: Control applies to some technologies but not others
- **Business Unit Differences**: Control applies to some business units but not others

**Partial Applicability Documentation:**
```
PARTIAL APPLICABILITY EXAMPLE

Control: A.8.9.1 Configuration Management
Applicability: Partially Applicable

Applicable Elements:
- Configuration management for servers and network equipment
- Change control procedures for infrastructure modifications
- Configuration documentation and baselines

Not Applicable Elements:
- Desktop configuration management (outside ISMS scope)
- Legacy system configuration (systems being decommissioned)
- Development environment configuration (separate management process)

Implementation Approach:
- Phase 1: Implement for critical servers (Month 1-3)
- Phase 2: Implement for network equipment (Month 4-6)
- Phase 3: Integrate with existing change management (Month 7-9)

Justification:
Partial applicability due to mixed environment with different management approaches for different system categories based on criticality and scope boundaries.
```

### 2.3 Implementation Planning Integration

#### 2.3.1 Implementation Status Tracking

**Status Categories and Definitions:**
{{IMPLEMENTATION_STATUS_DEFINITIONS}}

**Detailed Status Descriptions:**

**Not Started (0% Complete):**
- **Definition**: No implementation activities have begun
- **Characteristics**: Control identified as applicable but no resources allocated
- **Next Steps**: Implementation planning and resource allocation
- **Timeline**: Implementation planning should begin within defined timeframes
- **Documentation**: Business case and implementation plan development needed

**In Planning (1-25% Complete):**
- **Definition**: Implementation planning is underway
- **Characteristics**: Resources allocated, planning activities in progress
- **Activities**: Requirements analysis, design, resource planning, vendor selection
- **Next Steps**: Complete planning and begin implementation
- **Documentation**: Implementation plan, requirements specification, resource allocation

**In Progress (26-75% Complete):**
- **Definition**: Active implementation activities underway
- **Characteristics**: Implementation team active, progress visible, milestones achieved
- **Activities**: System deployment, process implementation, training, testing
- **Next Steps**: Complete implementation and begin operational use
- **Documentation**: Implementation progress reports, testing results, training records

**Implemented (76-99% Complete):**
- **Definition**: Control is operational but may need optimization
- **Characteristics**: Control functioning, users trained, processes operational
- **Activities**: Operations, monitoring, optimization, fine-tuning
- **Next Steps**: Effectiveness assessment and optimization
- **Documentation**: Operational procedures, monitoring reports, effectiveness evidence

**Fully Operational (100% Complete):**
- **Definition**: Control fully implemented and optimized
- **Characteristics**: Control mature, effective, integrated, monitored
- **Activities**: Ongoing operations, continuous improvement, effectiveness measurement
- **Next Steps**: Ongoing monitoring and periodic review
- **Documentation**: Effectiveness assessments, monitoring reports, improvement plans

#### 2.3.2 Implementation Prioritization

**Priority Framework:**
{{IMPLEMENTATION_PRIORITY_FRAMEWORK}}

**Prioritization Factors:**

**Risk-Based Priority:**
- **Critical Controls**: Controls addressing critical risks (Risk Level 21-25)
- **High Priority Controls**: Controls addressing high risks (Risk Level 16-20)
- **Medium Priority Controls**: Controls addressing medium risks (Risk Level 11-15)
- **Low Priority Controls**: Controls addressing low risks (Risk Level 6-10)

**Regulatory Priority:**
- **Mandatory Controls**: Controls required by applicable regulations
- **Audit-Critical Controls**: Controls likely to be scrutinized during audits
- **Certification-Required Controls**: Controls necessary for ISO 27001 certification
- **Industry-Expected Controls**: Controls expected for industry certification or recognition

**Business Priority:**
- **Business-Critical Controls**: Controls protecting business-critical assets and processes
- **Customer-Facing Controls**: Controls affecting customer experience and satisfaction
- **Revenue-Protecting Controls**: Controls protecting revenue-generating activities
- **Reputation-Protecting Controls**: Controls protecting organizational reputation

**Implementation Priority Matrix:**
| Control Category | Critical Risk | High Risk | Medium Risk | Low Risk |
|-----------------|---------------|-----------|-------------|----------|
| **Regulatory Required** | Priority 1 | Priority 1 | Priority 2 | Priority 3 |
| **Business Critical** | Priority 1 | Priority 2 | Priority 3 | Priority 4 |
| **Customer Facing** | Priority 2 | Priority 3 | Priority 4 | Priority 5 |
| **Internal Operations** | Priority 3 | Priority 4 | Priority 5 | Priority 6 |

---

## 3. ISO 27001 Annex A Controls Assessment

*This section provides the complete assessment of all 93 ISO 27001 Annex A controls*

### 3.1 A.5 Organizational Controls

#### 3.1.1 Information Security Policy Controls

**A.5.1.1 Information Security Policy**
- **Control Objective**: To provide management direction and support for information security in accordance with business requirements and relevant laws and regulations
- **Applicability**: {{A_5_1_1_APPLICABILITY}}
- **Implementation Status**: {{A_5_1_1_STATUS}}
- **Implementation Percentage**: {{A_5_1_1_PERCENTAGE}}%
- **Target Completion**: {{A_5_1_1_TARGET_DATE}}
- **Justification**: {{A_5_1_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_5_1_1_NOTES}}

*Example Justification:*
"Applicable - Information security policy is fundamental requirement for ISMS establishment and operation. Policy provides framework for all other security controls and demonstrates management commitment to information security."

**A.5.1.2 Review of Information Security Policy**
- **Control Objective**: To ensure the information security policy remains suitable, adequate and effective for the organization
- **Applicability**: {{A_5_1_2_APPLICABILITY}}
- **Implementation Status**: {{A_5_1_2_STATUS}}
- **Implementation Percentage**: {{A_5_1_2_PERCENTAGE}}%
- **Target Completion**: {{A_5_1_2_TARGET_DATE}}
- **Justification**: {{A_5_1_2_JUSTIFICATION}}
- **Implementation Notes**: {{A_5_1_2_NOTES}}

#### 3.1.2 Information Security Organization Controls

**A.5.2.1 Management Commitment to Information Security**
- **Control Objective**: To ensure management commitment to information security through clear direction, demonstrated support, resource allocation and assignment of responsibilities
- **Applicability**: {{A_5_2_1_APPLICABILITY}}
- **Implementation Status**: {{A_5_2_1_STATUS}}
- **Implementation Percentage**: {{A_5_2_1_PERCENTAGE}}%
- **Target Completion**: {{A_5_2_1_TARGET_DATE}}
- **Justification**: {{A_5_2_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_5_2_1_NOTES}}

**A.5.2.2 Information Security Roles and Responsibilities**
- **Control Objective**: To ensure that information security roles and responsibilities are defined and allocated according to the organization's needs
- **Applicability**: {{A_5_2_2_APPLICABILITY}}
- **Implementation Status**: {{A_5_2_2_STATUS}}
- **Implementation Percentage**: {{A_5_2_2_PERCENTAGE}}%
- **Target Completion**: {{A_5_2_2_TARGET_DATE}}
- **Justification**: {{A_5_2_2_JUSTIFICATION}}
- **Implementation Notes**: {{A_5_2_2_NOTES}}

**A.5.2.3 Segregation of Duties**
- **Control Objective**: To reduce opportunities for unauthorized or unintentional modification or misuse of the organization's assets
- **Applicability**: {{A_5_2_3_APPLICABILITY}}
- **Implementation Status**: {{A_5_2_3_STATUS}}
- **Implementation Percentage**: {{A_5_2_3_PERCENTAGE}}%
- **Target Completion**: {{A_5_2_3_TARGET_DATE}}
- **Justification**: {{A_5_2_3_JUSTIFICATION}}
- **Implementation Notes**: {{A_5_2_3_NOTES}}

#### 3.1.3 Project Management Security Controls

**A.5.3.1 Information Security in Project Management**
- **Control Objective**: To ensure that information security is addressed when planning and implementing projects
- **Applicability**: {{A_5_3_1_APPLICABILITY}}
- **Implementation Status**: {{A_5_3_1_STATUS}}
- **Implementation Percentage**: {{A_5_3_1_PERCENTAGE}}%
- **Target Completion**: {{A_5_3_1_TARGET_DATE}}
- **Justification**: {{A_5_3_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_5_3_1_NOTES}}

#### 3.1.4 Information Security in Supplier Relationships

**A.5.4.1 Information Security Policy for Supplier Relationships**
- **Control Objective**: To ensure protection of the organization's assets that is accessible by suppliers
- **Applicability**: {{A_5_4_1_APPLICABILITY}}
- **Implementation Status**: {{A_5_4_1_STATUS}}
- **Implementation Percentage**: {{A_5_4_1_PERCENTAGE}}%
- **Target Completion**: {{A_5_4_1_TARGET_DATE}}
- **Justification**: {{A_5_4_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_5_4_1_NOTES}}

**A.5.4.2 Addressing Information Security Within Supplier Agreements**
- **Control Objective**: To establish and maintain an appropriate level of information security and service delivery in line with supplier agreements
- **Applicability**: {{A_5_4_2_APPLICABILITY}}
- **Implementation Status**: {{A_5_4_2_STATUS}}
- **Implementation Percentage**: {{A_5_4_2_PERCENTAGE}}%
- **Target Completion**: {{A_5_4_2_TARGET_DATE}}
- **Justification**: {{A_5_4_2_JUSTIFICATION}}
- **Implementation Notes**: {{A_5_4_2_NOTES}}

**A.5.4.3 ICT Supply Chain**
- **Control Objective**: To manage information security risks associated with ICT products and services supply chain
- **Applicability**: {{A_5_4_3_APPLICABILITY}}
- **Implementation Status**: {{A_5_4_3_STATUS}}
- **Implementation Percentage**: {{A_5_4_3_PERCENTAGE}}%
- **Target Completion**: {{A_5_4_3_TARGET_DATE}}
- **Justification**: {{A_5_4_3_JUSTIFICATION}}
- **Implementation Notes**: {{A_5_4_3_NOTES}}

*[Continue with remaining A.5 controls...]*

### 3.2 A.6 People Controls

#### 3.2.1 General People Security Controls

**A.6.1.1 Screening**
- **Control Objective**: To ensure that candidates for employment, contractors and third party users understand their responsibilities and are suitable for the roles for which they are considered
- **Applicability**: {{A_6_1_1_APPLICABILITY}}
- **Implementation Status**: {{A_6_1_1_STATUS}}
- **Implementation Percentage**: {{A_6_1_1_PERCENTAGE}}%
- **Target Completion**: {{A_6_1_1_TARGET_DATE}}
- **Justification**: {{A_6_1_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_6_1_1_NOTES}}

*Example Implementation Notes:*
"Background checks conducted for all employees with access to sensitive systems. Enhanced screening for privileged access roles. Verification of identity, employment history, and criminal background checks as permitted by law."

**A.6.1.2 Terms and Conditions of Employment**
- **Control Objective**: To ensure that employees, contractors and third party users understand their responsibilities and are suitable for the roles for which they are considered
- **Applicability**: {{A_6_1_2_APPLICABILITY}}
- **Implementation Status**: {{A_6_1_2_STATUS}}
- **Implementation Percentage**: {{A_6_1_2_PERCENTAGE}}%
- **Target Completion**: {{A_6_1_2_TARGET_DATE}}
- **Justification**: {{A_6_1_2_JUSTIFICATION}}
- **Implementation Notes**: {{A_6_1_2_NOTES}}

#### 3.2.2 Information Security Awareness and Training

**A.6.2.1 Information Security Awareness, Education and Training**
- **Control Objective**: To ensure that personnel are aware of and fulfill their information security responsibilities
- **Applicability**: {{A_6_2_1_APPLICABILITY}}
- **Implementation Status**: {{A_6_2_1_STATUS}}
- **Implementation Percentage**: {{A_6_2_1_PERCENTAGE}}%
- **Target Completion**: {{A_6_2_1_TARGET_DATE}}
- **Justification**: {{A_6_2_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_6_2_1_NOTES}}

#### 3.2.3 Disciplinary Process

**A.6.3.1 Disciplinary Process**
- **Control Objective**: To ensure a formal and communicated disciplinary process is in place to take action against personnel who have committed an information security breach
- **Applicability**: {{A_6_3_1_APPLICABILITY}}
- **Implementation Status**: {{A_6_3_1_STATUS}}
- **Implementation Percentage**: {{A_6_3_1_PERCENTAGE}}%
- **Target Completion**: {{A_6_3_1_TARGET_DATE}}
- **Justification**: {{A_6_3_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_6_3_1_NOTES}}

*[Continue with remaining A.6 controls...]*

### 3.3 A.7 Physical Controls

#### 3.3.1 Secure Areas

**A.7.1.1 Physical Security Perimeter**
- **Control Objective**: To prevent unauthorized physical access to areas containing information and other associated assets
- **Applicability**: {{A_7_1_1_APPLICABILITY}}
- **Implementation Status**: {{A_7_1_1_STATUS}}
- **Implementation Percentage**: {{A_7_1_1_PERCENTAGE}}%
- **Target Completion**: {{A_7_1_1_TARGET_DATE}}
- **Justification**: {{A_7_1_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_7_1_1_NOTES}}

*Example Not Applicable Justification:*
"Not Applicable - Organization operates fully remote with no physical offices or data centers. All systems are cloud-based and managed by third-party providers with their own physical security controls."

**A.7.1.2 Physical Entry**
- **Control Objective**: To ensure that access to areas containing information and other associated assets is appropriately controlled
- **Applicability**: {{A_7_1_2_APPLICABILITY}}
- **Implementation Status**: {{A_7_1_2_STATUS}}
- **Implementation Percentage**: {{A_7_1_2_PERCENTAGE}}%
- **Target Completion**: {{A_7_1_2_TARGET_DATE}}
- **Justification**: {{A_7_1_2_JUSTIFICATION}}
- **Implementation Notes**: {{A_7_1_2_NOTES}}

**A.7.1.3 Protection Against Environmental Threats**
- **Control Objective**: To prevent loss, damage, theft or compromise of assets and interruption to the organization's operations
- **Applicability**: {{A_7_1_3_APPLICABILITY}}
- **Implementation Status**: {{A_7_1_3_STATUS}}
- **Implementation Percentage**: {{A_7_1_3_PERCENTAGE}}%
- **Target Completion**: {{A_7_1_3_TARGET_DATE}}
- **Justification**: {{A_7_1_3_JUSTIFICATION}}
- **Implementation Notes**: {{A_7_1_3_NOTES}}

*[Continue with all A.7 controls...]*

### 3.4 A.8 Technological Controls

#### 3.4.1 User Endpoint Devices

**A.8.1.1 User Endpoint Devices**
- **Control Objective**: To ensure that user endpoint devices are protected against malware and unauthorized use
- **Applicability**: {{A_8_1_1_APPLICABILITY}}
- **Implementation Status**: {{A_8_1_1_STATUS}}
- **Implementation Percentage**: {{A_8_1_1_PERCENTAGE}}%
- **Target Completion**: {{A_8_1_1_TARGET_DATE}}
- **Justification**: {{A_8_1_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_8_1_1_NOTES}}

*Example Implementation Notes:*
"Endpoint Detection and Response (EDR) solution deployed on all corporate devices. Mobile Device Management (MDM) for mobile devices. Regular antivirus updates and patch management automated."

#### 3.4.2 Privileged Access Rights

**A.8.2.1 Privileged Access Management**
- **Control Objective**: To restrict and control the allocation and use of privileged access rights
- **Applicability**: {{A_8_2_1_APPLICABILITY}}
- **Implementation Status**: {{A_8_2_1_STATUS}}
- **Implementation Percentage**: {{A_8_2_1_PERCENTAGE}}%
- **Target Completion**: {{A_8_2_1_TARGET_DATE}}
- **Justification**: {{A_8_2_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_8_2_1_NOTES}}

#### 3.4.3 Information Access Restriction

**A.8.3.1 Management of Privileged Access Rights**
- **Control Objective**: To restrict access to information and application system functions in accordance with the access control policy
- **Applicability**: {{A_8_3_1_APPLICABILITY}}
- **Implementation Status**: {{A_8_3_1_STATUS}}
- **Implementation Percentage**: {{A_8_3_1_PERCENTAGE}}%
- **Target Completion**: {{A_8_3_1_TARGET_DATE}}
- **Justification**: {{A_8_3_1_JUSTIFICATION}}
- **Implementation Notes**: {{A_8_3_1_NOTES}}

*[Continue with all remaining A.8 controls...]*

---

## 4. Implementation Planning and Tracking

*This section explains how control implementation is planned, managed, and tracked*

### 4.1 Implementation Roadmap

#### 4.1.1 Overall Implementation Strategy

**Implementation Approach:**
{{IMPLEMENTATION_STRATEGY}}

**Strategic Implementation Principles:**
- **Risk-Based Prioritization**: Implement controls addressing highest risks first
- **Business-Aligned Scheduling**: Align implementation with business planning cycles
- **Resource-Optimized Approach**: Optimize resource utilization across implementations
- **Phased Implementation**: Implement controls in logical phases to manage complexity
- **Integration Focus**: Ensure controls work together effectively

**Implementation Phases:**

**Phase 1: Foundation Controls (Months 1-6)**
*Establish basic security foundation*
- **Policy and Governance**: A.5.1.1, A.5.1.2, A.5.2.1, A.5.2.2
- **Risk Management**: A.5.8.1, A.5.8.2, A.5.8.3
- **Asset Management**: A.5.9.1, A.5.9.2, A.5.9.3
- **Access Control Framework**: A.8.2.1, A.8.3.1, A.8.3.2

**Phase 2: Core Operational Controls (Months 7-12)**
*Implement core operational security controls*
- **People Security**: A.6.1.1, A.6.1.2, A.6.2.1, A.6.3.1
- **Physical Security**: A.7.1.1, A.7.1.2, A.7.2.1, A.7.3.1
- **Technical Controls**: A.8.1.1, A.8.4.1, A.8.5.1, A.8.6.1
- **Network Security**: A.8.20.1, A.8.21.1, A.8.22.1

**Phase 3: Advanced Controls (Months 13-18)**
*Implement advanced security capabilities*
- **Cryptography**: A.8.24.1, A.8.24.2, A.8.24.3
- **Security Monitoring**: A.8.15.1, A.8.15.2, A.8.16.1
- **Incident Response**: A.5.24.1, A.5.25.1, A.5.26.1
- **Business Continuity**: A.5.29.1, A.5.30.1

**Phase 4: Optimization and Integration (Months 19-24)**
*Optimize controls and ensure integration*
- **Performance Optimization**: Fine-tune implemented controls
- **Integration Enhancement**: Improve integration between controls
- **Monitoring Enhancement**: Enhance monitoring and measurement
- **Continuous Improvement**: Establish improvement processes

#### 4.1.2 Priority-Based Implementation Schedule

**Implementation Priority Framework:**
{{IMPLEMENTATION_PRIORITY_FRAMEWORK}}

**Priority 1 Controls (Immediate - Months 1-3):**
```
PRIORITY 1 CONTROL IMPLEMENTATION

Controls Included:
- A.5.1.1: Information Security Policy
- A.5.2.1: Management Commitment
- A.6.2.1: Security Awareness Training
- A.8.2.1: Privileged Access Management
- A.8.15.1: Logging

Total Controls: 5
Implementation Timeline: 3 months
Resource Allocation: 40% of available resources
Success Criteria: All controls operational and effective

Implementation Approach:
Month 1: Policy development and management commitment
Month 2: Access management and logging implementation
Month 3: Training delivery and effectiveness assessment

Key Milestones:
- Week 2: Information security policy approved
- Week 6: Privileged access management operational
- Week 10: Security awareness training delivered to all staff
- Week 12: Logging infrastructure operational
```

**Priority 2 Controls (High Priority - Months 4-9):**
```
PRIORITY 2 CONTROL IMPLEMENTATION

Controls Included:
- A.5.2.2: Roles and Responsibilities
- A.6.1.1: Personnel Screening
- A.7.1.1: Physical Security Perimeter
- A.8.1.1: User Endpoint Devices
- A.8.3.1: Access Rights Management
[Additional Priority 2 controls...]

Total Controls: 15
Implementation Timeline: 6 months
Resource Allocation: 35% of available resources
Success Criteria: Controls reducing high-priority risks operational

Implementation Phases:
Phase 2A (Months 4-6): People and physical controls
Phase 2B (Months 7-9): Technical and access controls
```

### 4.2 Implementation Tracking

#### 4.2.1 Progress Monitoring

**Tracking Methodology:**
{{PROGRESS_TRACKING_METHODOLOGY}}

**Progress Metrics:**
- **Implementation Percentage**: Overall percentage of controls implemented
- **Timeline Adherence**: Percentage of implementations completed on schedule
- **Budget Performance**: Actual vs. planned implementation costs
- **Quality Metrics**: Quality scores for implemented controls
- **Effectiveness Indicators**: Early indicators of control effectiveness

**Progress Reporting Dashboard:**
```
CONTROL IMPLEMENTATION DASHBOARD

Overall Progress:
- Total Controls: 93
- Applicable Controls: {{TOTAL_APPLICABLE}}
- Not Applicable Controls: {{TOTAL_NOT_APPLICABLE}}
- Implemented Controls: {{TOTAL_IMPLEMENTED}}
- In Progress Controls: {{TOTAL_IN_PROGRESS}}
- Not Started Controls: {{TOTAL_NOT_STARTED}}

Implementation by Category:
- Organizational (A.5): {{A5_IMPLEMENTED}}/{{A5_APPLICABLE}} ({{A5_PERCENTAGE}}%)
- People (A.6): {{A6_IMPLEMENTED}}/{{A6_APPLICABLE}} ({{A6_PERCENTAGE}}%)
- Physical (A.7): {{A7_IMPLEMENTED}}/{{A7_APPLICABLE}} ({{A7_PERCENTAGE}}%)
- Technological (A.8): {{A8_IMPLEMENTED}}/{{A8_APPLICABLE}} ({{A8_PERCENTAGE}}%)

Implementation by Priority:
- Priority 1: {{P1_IMPLEMENTED}}/{{P1_TOTAL}} ({{P1_PERCENTAGE}}%)
- Priority 2: {{P2_IMPLEMENTED}}/{{P2_TOTAL}} ({{P2_PERCENTAGE}}%)
- Priority 3: {{P3_IMPLEMENTED}}/{{P3_TOTAL}} ({{P3_PERCENTAGE}}%)
- Priority 4: {{P4_IMPLEMENTED}}/{{P4_TOTAL}} ({{P4_PERCENTAGE}}%)

Timeline Performance:
- On Schedule: {{ON_SCHEDULE_COUNT}} controls
- Behind Schedule: {{BEHIND_SCHEDULE_COUNT}} controls
- Ahead of Schedule: {{AHEAD_SCHEDULE_COUNT}} controls
- Average Delay: {{AVERAGE_DELAY}} days

Budget Performance:
- Total Budget: ${{TOTAL_BUDGET}}
- Spent to Date: ${{SPENT_TO_DATE}}
- Remaining Budget: ${{REMAINING_BUDGET}}
- Budget Utilization: {{BUDGET_UTILIZATION}}%
```

#### 4.2.2 Quality Assurance

**Implementation Quality Framework:**
{{IMPLEMENTATION_QUALITY_FRAMEWORK}}

**Quality Criteria:**
- **Completeness**: All required elements of control are implemented
- **Effectiveness**: Control effectively achieves its intended objective
- **Integration**: Control integrates properly with other controls and business processes
- **Sustainability**: Control can be maintained and operated over time
- **Documentation**: Control implementation is properly documented

**Quality Assessment Process:**
1. **Design Review**: Review control design against requirements
2. **Implementation Review**: Review implementation against design
3. **Testing**: Test control operation under realistic conditions
4. **User Acceptance**: Obtain user acceptance of control implementation
5. **Effectiveness Assessment**: Assess initial effectiveness of control
6. **Documentation Review**: Review completeness and accuracy of documentation

**Quality Scorecard Template:**
```
CONTROL IMPLEMENTATION QUALITY SCORECARD

Control: {{CONTROL_ID}} - {{CONTROL_NAME}}
Assessment Date: {{ASSESSMENT_DATE}}
Assessor: {{ASSESSOR_NAME}}

Quality Criteria Assessment:
Completeness: {{COMPLETENESS_SCORE}}/5
- All required elements implemented
- Score: {{COMPLETENESS_SCORE}}
- Comments: {{COMPLETENESS_COMMENTS}}

Effectiveness: {{EFFECTIVENESS_SCORE}}/5
- Control achieves intended objective
- Score: {{EFFECTIVENESS_SCORE}}
- Comments: {{EFFECTIVENESS_COMMENTS}}

Integration: {{INTEGRATION_SCORE}}/5
- Integrates with other controls and processes
- Score: {{INTEGRATION_SCORE}}
- Comments: {{INTEGRATION_COMMENTS}}

Sustainability: {{SUSTAINABILITY_SCORE}}/5
- Can be maintained over time
- Score: {{SUSTAINABILITY_SCORE}}
- Comments: {{SUSTAINABILITY_COMMENTS}}

Documentation: {{DOCUMENTATION_SCORE}}/5
- Implementation properly documented
- Score: {{DOCUMENTATION_SCORE}}
- Comments: {{DOCUMENTATION_COMMENTS}}

Overall Quality Score: {{OVERALL_SCORE}}/25
Quality Rating: {{QUALITY_RATING}}
Approval Status: {{APPROVAL_STATUS}}

Issues Identified:
- {{ISSUE_1}}
- {{ISSUE_2}}
- {{ISSUE_3}}

Recommendations:
- {{RECOMMENDATION_1}}
- {{RECOMMENDATION_2}}
- {{RECOMMENDATION_3}}
```

### 4.3 Control Effectiveness Measurement

#### 4.3.1 Effectiveness Assessment Framework

**Assessment Methodology:**
{{EFFECTIVENESS_ASSESSMENT_METHODOLOGY}}

**Effectiveness Measurement Approach:**
- **Objective-Based Assessment**: Measure how well control achieves its stated objective
- **Risk-Based Assessment**: Measure how effectively control reduces targeted risks
- **Performance-Based Assessment**: Measure technical and operational performance
- **User-Based Assessment**: Measure user satisfaction and acceptance
- **Business-Based Assessment**: Measure business impact and value

**Effectiveness Indicators:**

**Technical Effectiveness:**
- **Availability**: Percentage of time control is operational
- **Performance**: Response time and throughput metrics
- **Accuracy**: Accuracy of control operation and outputs
- **Coverage**: Percentage of intended scope covered by control
- **Reliability**: Consistency and dependability of control operation

**Operational Effectiveness:**
- **User Compliance**: Percentage of users complying with control requirements
- **Process Integration**: How well control integrates with business processes
- **Maintenance Requirements**: Effort required to maintain control operation
- **Issue Resolution**: Time to resolve control-related issues
- **Change Adaptability**: How well control adapts to business changes

**Business Effectiveness:**
- **Risk Reduction**: Measurable reduction in targeted risks
- **Incident Prevention**: Reduction in security incidents
- **Cost Impact**: Impact on operational costs
- **Productivity Impact**: Impact on user and business productivity
- **Value Delivery**: Value delivered relative to implementation cost

#### 4.3.2 Continuous Monitoring

**Monitoring Framework:**
{{CONTINUOUS_MONITORING_FRAMEWORK}}

**Monitoring Activities:**
- **Automated Monitoring**: Automated collection of control performance metrics
- **Periodic Assessment**: Regular assessment of control effectiveness
- **User Feedback**: Collection of feedback from control users
- **Incident Analysis**: Analysis of incidents for control effectiveness insights
- **Performance Review**: Regular review of control performance against targets

**Monitoring Schedule:**
- **Daily**: Automated monitoring of critical control functions
- **Weekly**: Review of control performance metrics and issues
- **Monthly**: Comprehensive assessment of control effectiveness
- **Quarterly**: Review of control effectiveness trends and patterns
- **Annually**: Complete evaluation of all control effectiveness

**Effectiveness Reporting:**
```
CONTROL EFFECTIVENESS REPORT

Reporting Period: {{REPORTING_PERIOD}}
Report Date: {{REPORT_DATE}}

Executive Summary:
- Total Implemented Controls: {{TOTAL_IMPLEMENTED}}
- Controls Meeting Effectiveness Targets: {{MEETING_TARGETS}}
- Controls Requiring Attention: {{REQUIRING_ATTENTION}}
- Overall Effectiveness Score: {{OVERALL_EFFECTIVENESS}}

Effectiveness by Category:
- Organizational Controls: {{A5_EFFECTIVENESS}}%
- People Controls: {{A6_EFFECTIVENESS}}%
- Physical Controls: {{A7_EFFECTIVENESS}}%
- Technological Controls: {{A8_EFFECTIVENESS}}%

Top Performing Controls:
1. {{TOP_CONTROL_1}}: {{TOP_SCORE_1}}%
2. {{TOP_CONTROL_2}}: {{TOP_SCORE_2}}%
3. {{TOP_CONTROL_3}}: {{TOP_SCORE_3}}%

Controls Requiring Improvement:
1. {{IMPROVEMENT_CONTROL_1}}: {{IMPROVEMENT_SCORE_1}}%
2. {{IMPROVEMENT_CONTROL_2}}: {{IMPROVEMENT_SCORE_2}}%
3. {{IMPROVEMENT_CONTROL_3}}: {{IMPROVEMENT_SCORE_3}}%

Key Findings:
- {{KEY_FINDING_1}}
- {{KEY_FINDING_2}}
- {{KEY_FINDING_3}}

Recommendations:
- {{RECOMMENDATION_1}}
- {{RECOMMENDATION_2}}
- {{RECOMMENDATION_3}}

Action Items:
- {{ACTION_ITEM_1}} (Due: {{ACTION_DATE_1}})
- {{ACTION_ITEM_2}} (Due: {{ACTION_DATE_2}})
- {{ACTION_ITEM_3}} (Due: {{ACTION_DATE_3}})
```

---

## 5. SoA Review and Maintenance

*This section explains how to keep the Statement of Applicability current and accurate*

### 5.1 Review Framework

#### 5.1.1 Review Objectives

**Why Regular SoA Review is Essential:**
The Statement of Applicability must evolve to remain accurate as risks change, controls are implemented, business environment shifts, and new threats emerge.

**Review Objectives:**
{{SOA_REVIEW_OBJECTIVES}}

**Primary Review Goals:**
- **Accuracy Maintenance**: Ensure SoA accurately reflects current control applicability and status
- **Currency Updates**: Update SoA to reflect changes in business environment and risk landscape
- **Implementation Progress**: Update implementation status and progress information
- **Effectiveness Assessment**: Review effectiveness of implemented controls
- **Compliance Verification**: Verify continued compliance with ISO 27001 requirements

#### 5.1.2 Review Schedule

**Review Frequency:**
{{SOA_REVIEW_SCHEDULE}}

**Scheduled Reviews:**

**Monthly Operational Reviews:**
- **Scope**: Implementation status updates and immediate issues
- **Participants**: Control owners, implementation teams
- **Duration**: 2-hour review session
- **Focus**: Progress tracking, issue resolution, schedule adjustments
- **Deliverables**: Updated implementation status, issue resolution plans

**Quarterly Strategic Reviews:**
- **Scope**: Control effectiveness and applicability assessment
- **Participants**: Risk managers, business unit leaders, control owners
- **Duration**: Half-day review session
- **Focus**: Control effectiveness, business alignment, resource optimization
- **Deliverables**: Effectiveness assessments, optimization recommendations

**Annual Comprehensive Reviews:**
- **Scope**: Complete SoA review and update
- **Participants**: All stakeholders, external advisors as needed
- **Duration**: Multi-day review process
- **Focus**: Complete applicability review, methodology updates, strategic alignment
- **Deliverables**: Updated SoA, methodology improvements, strategic recommendations

**Triggered Reviews:**

**Risk Environment Changes:**
- **Risk Assessment Updates**: When risk assessments identify new risks or change existing risk levels
- **Threat Landscape Changes**: When significant changes occur in threat environment
- **Vulnerability Discoveries**: When critical vulnerabilities are discovered
- **Incident Lessons**: When security incidents reveal control gaps or inefficiencies

**Business Environment Changes:**
- **Organizational Changes**: Mergers, acquisitions, restructuring, new business units
- **Technology Changes**: New systems, platforms, infrastructure changes
- **Regulatory Changes**: New laws, regulations, or compliance requirements
- **Business Strategy Changes**: Changes in business strategy, objectives, or operations

### 5.2 Review Process

#### 5.2.1 Review Planning and Preparation

**Review Preparation Process:**
{{SOA_REVIEW_PREPARATION}}

**Pre-Review Activities:**

**Data Collection:**
- **Implementation Status**: Current status of all control implementations
- **Effectiveness Data**: Performance and effectiveness data for implemented controls
- **Risk Updates**: Updates to risk assessments and risk register
- **Business Changes**: Changes in business environment, strategy, or operations
- **Regulatory Updates**: Changes in regulatory or compliance requirements

**Stakeholder Preparation:**
- **Review Materials**: Prepare comprehensive review materials for stakeholders
- **Agenda Development**: Develop detailed agenda for review sessions
- **Participant Briefing**: Brief participants on review objectives and process
- **Issue Identification**: Identify key issues requiring review attention

#### 5.2.2 Review Execution

**Review Process Steps:**
{{SOA_REVIEW_EXECUTION}}

**Review Session Structure:**

**Opening Session:**
- **Review Objectives**: Clarify objectives and expected outcomes
- **Current Status**: Present current SoA status and recent changes
- **Key Issues**: Identify key issues requiring review attention
- **Success Metrics**: Review success metrics and performance indicators

**Applicability Review:**
- **Risk Alignment**: Review control applicability against current risk assessment
- **Business Relevance**: Assess continued business relevance of control decisions
- **Scope Changes**: Review impact of any scope changes on control applicability
- **New Requirements**: Assess impact of new regulatory or business requirements

**Implementation Assessment:**
- **Progress Review**: Review implementation progress against plans
- **Quality Assessment**: Assess quality of implemented controls
- **Effectiveness Evaluation**: Evaluate effectiveness of implemented controls
- **Resource Performance**: Review resource utilization and efficiency

**Gap Analysis:**
- **Coverage Gaps**: Identify any gaps in control coverage
- **Implementation Gaps**: Identify gaps between planned and actual implementation
- **Effectiveness Gaps**: Identify gaps between expected and actual effectiveness
- **Compliance Gaps**: Identify any compliance gaps or issues

**Improvement Planning:**
- **Optimization Opportunities**: Identify opportunities for control optimization
- **Resource Reallocation**: Plan any necessary resource reallocations
- **Process Improvements**: Identify and plan process improvements
- **Technology Upgrades**: Plan technology upgrades or replacements

### 5.3 SoA Updates and Version Control

#### 5.3.1 Change Management Process

**SoA Change Management:**
{{SOA_CHANGE_MANAGEMENT}}

**Change Types:**

**Applicability Changes:**
- **New Applicable Controls**: Controls previously marked as not applicable now becoming applicable
- **New Non-Applicable Controls**: Controls previously applicable now becoming non-applicable
- **Partial Applicability Changes**: Changes in partial applicability scope or rationale

**Implementation Status Changes:**
- **Status Updates**: Regular updates to implementation status and percentage
- **Timeline Adjustments**: Changes to target completion dates
- **Resource Modifications**: Changes to resource allocation or requirements
- **Approach Changes**: Changes to implementation approach or methodology

**Justification Updates:**
- **Rationale Refinement**: Improvements to justification rationale and clarity
- **Evidence Updates**: Updates to supporting evidence and documentation
- **Regulatory Updates**: Updates based on regulatory or compliance changes
- **Business Updates**: Updates based on business environment changes

**Change Approval Process:**
```
SOA CHANGE REQUEST FORM

Change Information:
- Change ID: {{CHANGE_ID}}
- Requested By: {{CHANGE_REQUESTOR}}
- Date Requested: {{REQUEST_DATE}}
- Change Type: {{CHANGE_TYPE}}
- Priority Level: {{CHANGE_PRIORITY}}

Affected Controls:
- Control(s): {{AFFECTED_CONTROLS}}
- Current Status: {{CURRENT_STATUS}}
- Proposed Status: {{PROPOSED_STATUS}}
- Change Rationale: {{CHANGE_RATIONALE}}

Impact Analysis:
- Risk Impact: {{RISK_IMPACT}}
- Business Impact: {{BUSINESS_IMPACT}}
- Resource Impact: {{RESOURCE_IMPACT}}
- Timeline Impact: {{TIMELINE_IMPACT}}
- Compliance Impact: {{COMPLIANCE_IMPACT}}

Supporting Evidence:
- {{EVIDENCE_1}}
- {{EVIDENCE_2}}
- {{EVIDENCE_3}}

Approval Requirements:
- Technical Review: {{TECHNICAL_REVIEWER}} ({{TECHNICAL_REVIEW_DATE}})
- Business Review: {{BUSINESS_REVIEWER}} ({{BUSINESS_REVIEW_DATE}})
- Risk Review: {{RISK_REVIEWER}} ({{RISK_REVIEW_DATE}})
- Final Approval: {{FINAL_APPROVER}} ({{FINAL_APPROVAL_DATE}})

Implementation Plan:
- Implementation Steps: {{IMPLEMENTATION_STEPS}}
- Timeline: {{IMPLEMENTATION_TIMELINE}}
- Resources Required: {{RESOURCE_REQUIREMENTS}}
- Success Criteria: {{SUCCESS_CRITERIA}}
```

#### 5.3.2 Version Control and Documentation

**Version Management Process:**
{{SOA_VERSION_MANAGEMENT}}

**Version Control Requirements:**
- **Version Numbering**: Clear version numbering system (e.g., v1.0, v1.1, v2.0)
- **Change Documentation**: Comprehensive documentation of all changes
- **Approval Records**: Complete records of change approvals and authorizations
- **Distribution Control**: Control of SoA distribution and access
- **Archive Management**: Proper archiving of previous SoA versions

**Version Control Template:**
```
SOA VERSION CONTROL RECORD

Current Version Information:
- Version Number: {{VERSION_NUMBER}}
- Version Date: {{VERSION_DATE}}
- Version Owner: {{VERSION_OWNER}}
- Approval Authority: {{APPROVAL_AUTHORITY}}
- Next Review Date: {{NEXT_REVIEW_DATE}}

Version History:
Version 1.0 ({{V1_DATE}}):
- Initial SoA creation
- 93 controls assessed
- {{V1_APPLICABLE}} applicable, {{V1_NOT_APPLICABLE}} not applicable
- Approved by: {{V1_APPROVER}}

Version 1.1 ({{V1_1_DATE}}):
- Implementation status updates
- {{V1_1_CHANGES}} control status changes
- Approved by: {{V1_1_APPROVER}}

Version 2.0 ({{V2_DATE}}):
- Annual comprehensive review
- {{V2_APPLICABILITY_CHANGES}} applicability changes
- {{V2_IMPLEMENTATION_UPDATES}} implementation updates
- Approved by: {{V2_APPROVER}}

Change Summary Since Last Version:
- Controls Added: {{CONTROLS_ADDED}}
- Controls Removed: {{CONTROLS_REMOVED}}
- Status Changes: {{STATUS_CHANGES}}
- Justification Updates: {{JUSTIFICATION_UPDATES}}

Distribution Record:
- Internal Audit: Version {{IA_VERSION}} ({{IA_DATE}})
- Senior Management: Version {{SM_VERSION}} ({{SM_DATE}})
- Risk Committee: Version {{RC_VERSION}} ({{RC_DATE}})
- External Auditor: Version {{EA_VERSION}} ({{EA_DATE}})

Access Control:
- Read Access: {{READ_ACCESS_ROLES}}
- Modify Access: {{MODIFY_ACCESS_ROLES}}
- Approve Access: {{APPROVE_ACCESS_ROLES}}
```

---

## 6. Related Documents and Dependencies

*This section shows how the SoA connects to other important documents*

### 6.1 Foundation Dependencies

**Documents This SoA Depends On:**
{{SOA_DEPENDENCIES}}

#### 6.1.1 Risk Assessment Results Dependency
**Document**: Risk Assessment Results (ISO27001-PROC-001 Output)
**Dependency**: Control applicability decisions based on identified risks

**Connection Points:**
- **Risk-Control Mapping**: Controls selected to address specific assessed risks
- **Applicability Justification**: Risk assessment results justify control applicability
- **Priority Alignment**: Implementation priorities align with risk priorities
- **Coverage Verification**: SoA ensures all significant risks have appropriate control coverage

#### 6.1.2 Risk Treatment Plan Dependency
**Document**: Risk Treatment Plan (ISO27001-PLAN-001)
**Dependency**: Control selection aligns with risk treatment decisions

**Connection Points:**
- **Treatment Implementation**: SoA documents controls selected for risk treatment
- **Resource Coordination**: Implementation plans coordinate with treatment plan resources
- **Timeline Alignment**: Control implementation timelines align with treatment schedules
- **Effectiveness Coordination**: Control effectiveness supports treatment effectiveness

#### 6.1.3 ISMS Scope Dependency
**Document**: ISMS Scope Definition (ISO27001-SCOPE-001)
**Dependency**: Control applicability must align with ISMS scope boundaries

**Connection Points:**
- **Scope Boundaries**: Controls apply only within defined ISMS scope
- **Asset Coverage**: Controls cover assets within scope
- **Process Coverage**: Controls address business processes within scope
- **Exclusion Respect**: SoA respects scope exclusions in applicability decisions

### 6.2 Enabled Documents

**Documents That This SoA Enables:**
{{SOA_ENABLED_DOCUMENTS}}

#### 6.2.1 Control Implementation Procedures
**Document**: Various Control Implementation Procedures
**Enablement**: SoA provides foundation for detailed control implementation

**Connection Points:**
- **Implementation Guidance**: SoA decisions guide development of implementation procedures
- **Scope Definition**: SoA defines scope for each control implementation
- **Resource Planning**: SoA implementation plans inform resource requirements
- **Quality Standards**: SoA establishes quality standards for implementations

#### 6.2.2 Security Control Specifications
**Document**: Various Security Control Specifications
**Enablement**: SoA provides requirements for detailed control specifications

**Connection Points:**
- **Technical Requirements**: SoA implementation plans define technical requirements
- **Performance Standards**: SoA establishes performance standards for controls
- **Integration Requirements**: SoA defines integration requirements between controls
- **Monitoring Requirements**: SoA establishes monitoring and measurement requirements

#### 6.2.3 Internal Audit Program
**Document**: Internal Audit Program (ISO27001-AUDIT-001)
**Enablement**: SoA provides foundation for audit planning and execution

**Connection Points:**
- **Audit Scope**: SoA defines scope of controls to be audited
- **Audit Criteria**: SoA provides criteria for evaluating control implementation
- **Evidence Requirements**: SoA identifies evidence needed for audit verification
- **Compliance Assessment**: SoA supports compliance assessment activities

### 6.3 Supporting Relationships

#### 6.3.1 Policy Integration
**Related Policies:**
- **Information Security Policy**: SoA implements policy requirements through control selection
- **Risk Management Policy**: SoA aligns with risk management approach and criteria
- **Data Protection Policy**: SoA includes controls necessary for data protection compliance
- **Business Continuity Policy**: SoA includes controls supporting business continuity

#### 6.3.2 Process Integration
**Related Processes:**
- **Change Management**: Changes affecting control applicability trigger SoA reviews
- **Incident Response**: Incidents may reveal need for SoA updates
- **Vendor Management**: Vendor-related controls must align with vendor management processes
- **Compliance Management**: SoA supports overall compliance management activities

---

## 7. Contact Information and Support

*Who to contact for questions about the Statement of Applicability*

### 7.1 Primary Contacts

| Role | Contact | Email | Phone | Responsibility |
|------|---------|-------|-------|----------------|
| **SoA Owner** | {{SOA_OWNER_NAME}} | {{SOA_OWNER_EMAIL}} | {{SOA_OWNER_PHONE}} | *Overall SoA management and maintenance* |
| **Risk Manager** | {{RISK_MANAGER_NAME}} | {{RISK_MANAGER_EMAIL}} | {{RISK_MANAGER_PHONE}} | *Risk-based control selection and justification* |
| **ISMS Manager** | {{ISMS_MANAGER_NAME}} | {{ISMS_MANAGER_EMAIL}} | {{ISMS_MANAGER_PHONE}} | *ISMS integration and compliance coordination* |
| **Implementation Manager** | {{IMPLEMENTATION_MANAGER_NAME}} | {{IMPLEMENTATION_MANAGER_EMAIL}} | {{IMPLEMENTATION_MANAGER_PHONE}} | *Control implementation coordination and tracking* |

### 7.2 Support Resources

**SoA Development Support:**
- **Control Analysis**: {{CONTROL_ANALYSIS_SUPPORT}}
- **Applicability Assessment**: {{APPLICABILITY_ASSESSMENT_SUPPORT}}
- **Justification Development**: {{JUSTIFICATION_DEVELOPMENT_SUPPORT}}
- **Implementation Planning**: {{IMPLEMENTATION_PLANNING_SUPPORT}}

**SoA Maintenance Support:**
- **Review Coordination**: {{REVIEW_COORDINATION_SUPPORT}}
- **Update Management**: {{UPDATE_MANAGEMENT_SUPPORT}}
- **Version Control**: {{VERSION_CONTROL_SUPPORT}}
- **Change Management**: {{CHANGE_MANAGEMENT_SUPPORT}}

### 7.3 Escalation Procedures

**When to Escalate SoA Issues:**
- **Applicability Disagreements**: Disagreements about control applicability decisions
- **Resource Conflicts**: Conflicts over resources for control implementation
- **Timeline Issues**: Major delays or timeline conflicts in implementation
- **Quality Concerns**: Concerns about quality of control implementations
- **Compliance Issues**: Issues that may affect ISO 27001 compliance

**Escalation Path:**
1. **First Level**: SoA Owner or Control Owner
2. **Second Level**: ISMS Manager or Risk Manager  
3. **Third Level**: Risk Committee or Senior Management
4. **Final Level**: Executive Management (for major strategic decisions)

---

## 8. Approval and Authorization

*Official approval of this Statement of Applicability*

### 8.1 Review and Approval Process

**Review Process:**
1. **Technical Review**: Risk and security teams review for technical accuracy
2. **Business Review**: Business stakeholders review for business alignment
3. **Implementation Review**: Implementation teams review for feasibility
4. **Compliance Review**: Compliance team reviews for regulatory alignment
5. **Final Approval**: Senior management provides final authorization

### 8.2 Approval Records

| Role | Name | Signature | Date | Comments |
|------|------|-----------|------|----------|
| **SoA Owner** | {{SOA_OWNER_NAME}} | {{ELECTRONIC_SIGNATURE}} | {{TECHNICAL_REVIEW_DATE}} | *Technical accuracy and completeness verification* |
| **Risk Manager** | {{RISK_MANAGER_NAME}} | {{ELECTRONIC_SIGNATURE}} | {{RISK_REVIEW_DATE}} | *Risk-based control selection validation* |
| **Business Representative** | {{BUSINESS_REP_NAME}} | {{ELECTRONIC_SIGNATURE}} | {{BUSINESS_REVIEW_DATE}} | *Business alignment and feasibility confirmation* |
| **Implementation Manager** | {{IMPLEMENTATION_MANAGER_NAME}} | {{ELECTRONIC_SIGNATURE}} | {{IMPLEMENTATION_REVIEW_DATE}} | *Implementation feasibility and resource confirmation* |
| **Senior Management** | {{SENIOR_MANAGEMENT_NAME}} | {{ELECTRONIC_SIGNATURE}} | {{FINAL_APPROVAL_DATE}} | *Final SoA approval and strategic authorization* |

---

## Appendix A: Complete Control Applicability Matrix

*This section provides a comprehensive matrix of all 93 ISO 27001 Annex A controls*

### A.1 Control Applicability Summary

**Overall Control Distribution:**
```
CONTROL APPLICABILITY SUMMARY

Total ISO 27001 Annex A Controls: 93

By Category:
- A.5 Organizational Controls: 37 controls
  - Applicable: {{A5_APPLICABLE}}
  - Not Applicable: {{A5_NOT_APPLICABLE}}
  - Partially Applicable: {{A5_PARTIAL}}

- A.6 People Controls: 8 controls
  - Applicable: {{A6_APPLICABLE}}
  - Not Applicable: {{A6_NOT_APPLICABLE}}
  - Partially Applicable: {{A6_PARTIAL}}

- A.7 Physical Controls: 14 controls
  - Applicable: {{A7_APPLICABLE}}
  - Not Applicable: {{A7_NOT_APPLICABLE}}
  - Partially Applicable: {{A7_PARTIAL}}

- A.8 Technological Controls: 34 controls
  - Applicable: {{A8_APPLICABLE}}
  - Not Applicable: {{A8_NOT_APPLICABLE}}
  - Partially Applicable: {{A8_PARTIAL}}

Overall Summary:
- Total Applicable: {{TOTAL_APPLICABLE}} ({{APPLICABLE_PERCENTAGE}}%)
- Total Not Applicable: {{TOTAL_NOT_APPLICABLE}} ({{NOT_APPLICABLE_PERCENTAGE}}%)
- Total Partially Applicable: {{TOTAL_PARTIAL}} ({{PARTIAL_PERCENTAGE}}%)
```

### A.2 Detailed Control Matrix

**Complete Control Assessment Matrix:**

| Control ID | Control Name | Applicability | Status | % Complete | Target Date | Priority |
|------------|--------------|---------------|--------|------------|-------------|----------|
| **A.5 ORGANIZATIONAL CONTROLS** |
| A.5.1.1 | Information security policy | {{A_5_1_1_APPLICABILITY}} | {{A_5_1_1_STATUS}} | {{A_5_1_1_PERCENTAGE}}% | {{A_5_1_1_TARGET}} | {{A_5_1_1_PRIORITY}} |
| A.5.1.2 | Review of information security policy | {{A_5_1_2_APPLICABILITY}} | {{A_5_1_2_STATUS}} | {{A_5_1_2_PERCENTAGE}}% | {{A_5_1_2_TARGET}} | {{A_5_1_2_PRIORITY}} |
| A.5.2.1 | Management commitment to information security | {{A_5_2_1_APPLICABILITY}} | {{A_5_2_1_STATUS}} | {{A_5_2_1_PERCENTAGE}}% | {{A_5_2_1_TARGET}} | {{A_5_2_1_PRIORITY}} |
| A.5.2.2 | Information security roles and responsibilities | {{A_5_2_2_APPLICABILITY}} | {{A_5_2_2_STATUS}} | {{A_5_2_2_PERCENTAGE}}% | {{A_5_2_2_TARGET}} | {{A_5_2_2_PRIORITY}} |
| A.5.2.3 | Segregation of duties | {{A_5_2_3_APPLICABILITY}} | {{A_5_2_3_STATUS}} | {{A_5_2_3_PERCENTAGE}}% | {{A_5_2_3_TARGET}} | {{A_5_2_3_PRIORITY}} |
| A.5.3.1 | Information security in project management | {{A_5_3_1_APPLICABILITY}} | {{A_5_3_1_STATUS}} | {{A_5_3_1_PERCENTAGE}}% | {{A_5_3_1_TARGET}} | {{A_5_3_1_PRIORITY}} |
| A.5.4.1 | Information security policy for supplier relationships | {{A_5_4_1_APPLICABILITY}} | {{A_5_4_1_STATUS}} | {{A_5_4_1_PERCENTAGE}}% | {{A_5_4_1_TARGET}} | {{A_5_4_1_PRIORITY}} |
| A.5.4.2 | Addressing information security within supplier agreements | {{A_5_4_2_APPLICABILITY}} | {{A_5_4_2_STATUS}} | {{A_5_4_2_PERCENTAGE}}% | {{A_5_4_2_TARGET}} | {{A_5_4_2_PRIORITY}} |
| A.5.4.3 | ICT supply chain | {{A_5_4_3_APPLICABILITY}} | {{A_5_4_3_STATUS}} | {{A_5_4_3_PERCENTAGE}}% | {{A_5_4_3_TARGET}} | {{A_5_4_3_PRIORITY}} |
| A.5.5.1 | Information security in the management of projects | {{A_5_5_1_APPLICABILITY}} | {{A_5_5_1_STATUS}} | {{A_5_5_1_PERCENTAGE}}% | {{A_5_5_1_TARGET}} | {{A_5_5_1_PRIORITY}} |
| A.5.6.1 | Information security topics in contacts with authorities | {{A_5_6_1_APPLICABILITY}} | {{A_5_6_1_STATUS}} | {{A_5_6_1_PERCENTAGE}}% | {{A_5_6_1_TARGET}} | {{A_5_6_1_PRIORITY}} |
| A.5.6.2 | Information security topics in contact with special interest groups | {{A_5_6_2_APPLICABILITY}} | {{A_5_6_2_STATUS}} | {{A_5_6_2_PERCENTAGE}}% | {{A_5_6_2_TARGET}} | {{A_5_6_2_PRIORITY}} |
| A.5.7.1 | Threat intelligence | {{A_5_7_1_APPLICABILITY}} | {{A_5_7_1_STATUS}} | {{A_5_7_1_PERCENTAGE}}% | {{A_5_7_1_TARGET}} | {{A_5_7_1_PRIORITY}} |
| A.5.8.1 | Information security risk assessment | {{A_5_8_1_APPLICABILITY}} | {{A_5_8_1_STATUS}} | {{A_5_8_1_PERCENTAGE}}% | {{A_5_8_1_TARGET}} | {{A_5_8_1_PRIORITY}} |
| A.5.8.2 | Information security risk treatment | {{A_5_8_2_APPLICABILITY}} | {{A_5_8_2_STATUS}} | {{A_5_8_2_PERCENTAGE}}% | {{A_5_8_2_TARGET}} | {{A_5_8_2_PRIORITY}} |
| A.5.8.3 | Information security risk monitoring and review | {{A_5_8_3_APPLICABILITY}} | {{A_5_8_3_STATUS}} | {{A_5_8_3_PERCENTAGE}}% | {{A_5_8_3_TARGET}} | {{A_5_8_3_PRIORITY}} |
| A.5.9.1 | Inventory of information and other associated assets | {{A_5_9_1_APPLICABILITY}} | {{A_5_9_1_STATUS}} | {{A_5_9_1_PERCENTAGE}}% | {{A_5_9_1_TARGET}} | {{A_5_9_1_PRIORITY}} |
| A.5.9.2 | Ownership of information and other associated assets | {{A_5_9_2_APPLICABILITY}} | {{A_5_9_2_STATUS}} | {{A_5_9_2_PERCENTAGE}}% | {{A_5_9_2_TARGET}} | {{A_5_9_2_PRIORITY}} |
| A.5.9.3 | Acceptable use of information and other associated assets | {{A_5_9_3_APPLICABILITY}} | {{A_5_9_3_STATUS}} | {{A_5_9_3_PERCENTAGE}}% | {{A_5_9_3_TARGET}} | {{A_5_9_3_PRIORITY}} |
| A.5.9.4 | Return of assets | {{A_5_9_4_APPLICABILITY}} | {{A_5_9_4_STATUS}} | {{A_5_9_4_PERCENTAGE}}% | {{A_5_9_4_TARGET}} | {{A_5_9_4_PRIORITY}} |
| A.5.10.1 | Information and other associated assets classification | {{A_5_10_1_APPLICABILITY}} | {{A_5_10_1_STATUS}} | {{A_5_10_1_PERCENTAGE}}% | {{A_5_10_1_TARGET}} | {{A_5_10_1_PRIORITY}} |
| A.5.10.2 | Information labelling | {{A_5_10_2_APPLICABILITY}} | {{A_5_10_2_STATUS}} | {{A_5_10_2_PERCENTAGE}}% | {{A_5_10_2_TARGET}} | {{A_5_10_2_PRIORITY}} |
| A.5.10.3 | Information transfer | {{A_5_10_3_APPLICABILITY}} | {{A_5_10_3_STATUS}} | {{A_5_10_3_PERCENTAGE}}% | {{A_5_10_3_TARGET}} | {{A_5_10_3_PRIORITY}} |
| A.5.11.1 | Information transfer policies and procedures | {{A_5_11_1_APPLICABILITY}} | {{A_5_11_1_STATUS}} | {{A_5_11_1_PERCENTAGE}}% | {{A_5_11_1_TARGET}} | {{A_5_11_1_PRIORITY}} |
| A.5.11.2 | Agreements on information transfer | {{A_5_11_2_APPLICABILITY}} | {{A_5_11_2_STATUS}} | {{A_5_11_2_PERCENTAGE}}% | {{A_5_11_2_TARGET}} | {{A_5_11_2_PRIORITY}} |
| A.5.12.1 | Policy on the use of cryptographic controls | {{A_5_12_1_APPLICABILITY}} | {{A_5_12_1_STATUS}} | {{A_5_12_1_PERCENTAGE}}% | {{A_5_12_1_TARGET}} | {{A_5_12_1_PRIORITY}} |
| A.5.12.2 | Key management | {{A_5_12_2_APPLICABILITY}} | {{A_5_12_2_STATUS}} | {{A_5_12_2_PERCENTAGE}}% | {{A_5_12_2_TARGET}} | {{A_5_12_2_PRIORITY}} |
| A.5.13.1 | Reporting information security events | {{A_5_13_1_APPLICABILITY}} | {{A_5_13_1_STATUS}} | {{A_5_13_1_PERCENTAGE}}% | {{A_5_13_1_TARGET}} | {{A_5_13_1_PRIORITY}} |
| A.5.13.2 | Management of information security incidents and improvements | {{A_5_13_2_APPLICABILITY}} | {{A_5_13_2_STATUS}} | {{A_5_13_2_PERCENTAGE}}% | {{A_5_13_2_TARGET}} | {{A_5_13_2_PRIORITY}} |
| A.5.14.1 | Information security continuity | {{A_5_14_1_APPLICABILITY}} | {{A_5_14_1_STATUS}} | {{A_5_14_1_PERCENTAGE}}% | {{A_5_14_1_TARGET}} | {{A_5_14_1_PRIORITY}} |
| A.5.15.1 | Information security requirements for supplier relationships | {{A_5_15_1_APPLICABILITY}} | {{A_5_15_1_STATUS}} | {{A_5_15_1_PERCENTAGE}}% | {{A_5_15_1_TARGET}} | {{A_5_15_1_PRIORITY}} |
| A.5.15.2 | Addressing information security within supplier agreements | {{A_5_15_2_APPLICABILITY}} | {{A_5_15_2_STATUS}} | {{A_5_15_2_PERCENTAGE}}% | {{A_5_15_2_TARGET}} | {{A_5_15_2_PRIORITY}} |
| A.5.16.1 | Managing information security in the ICT supply chain | {{A_5_16_1_APPLICABILITY}} | {{A_5_16_1_STATUS}} | {{A_5_16_1_PERCENTAGE}}% | {{A_5_16_1_TARGET}} | {{A_5_16_1_PRIORITY}} |
| A.5.17.1 | Information security incident management procedures | {{A_5_17_1_APPLICABILITY}} | {{A_5_17_1_STATUS}} | {{A_5_17_1_PERCENTAGE}}% | {{A_5_17_1_TARGET}} | {{A_5_17_1_PRIORITY}} |
| A.5.18.1 | Identification of applicable legislation and contractual requirements | {{A_5_18_1_APPLICABILITY}} | {{A_5_18_1_STATUS}} | {{A_5_18_1_PERCENTAGE}}% | {{A_5_18_1_TARGET}} | {{A_5_18_1_PRIORITY}} |
| A.5.18.2 | Protection of records | {{A_5_18_2_APPLICABILITY}} | {{A_5_18_2_STATUS}} | {{A_5_18_2_PERCENTAGE}}% | {{A_5_18_2_TARGET}} | {{A_5_18_2_PRIORITY}} |
| A.5.18.3 | Privacy and protection of personally identifiable information | {{A_5_18_3_APPLICABILITY}} | {{A_5_18_3_STATUS}} | {{A_5_18_3_PERCENTAGE}}% | {{A_5_18_3_TARGET}} | {{A_5_18_3_PRIORITY}} |
| **A.6 PEOPLE CONTROLS** |
| A.6.1.1 | Screening | {{A_6_1_1_APPLICABILITY}} | {{A_6_1_1_STATUS}} | {{A_6_1_1_PERCENTAGE}}% | {{A_6_1_1_TARGET}} | {{A_6_1_1_PRIORITY}} |
| A.6.1.2 | Terms and conditions of employment | {{A_6_1_2_APPLICABILITY}} | {{A_6_1_2_STATUS}} | {{A_6_1_2_PERCENTAGE}}% | {{A_6_1_2_TARGET}} | {{A_6_1_2_PRIORITY}} |
| A.6.2.1 | Information security awareness, education and training | {{A_6_2_1_APPLICABILITY}} | {{A_6_2_1_STATUS}} | {{A_6_2_1_PERCENTAGE}}% | {{A_6_2_1_TARGET}} | {{A_6_2_1_PRIORITY}} |
| A.6.2.2 | Disciplinary process | {{A_6_2_2_APPLICABILITY}} | {{A_6_2_2_STATUS}} | {{A_6_2_2_PERCENTAGE}}% | {{A_6_2_2_TARGET}} | {{A_6_2_2_PRIORITY}} |
| A.6.3.1 | Information security responsibilities | {{A_6_3_1_APPLICABILITY}} | {{A_6_3_1_STATUS}} | {{A_6_3_1_PERCENTAGE}}% | {{A_6_3_1_TARGET}} | {{A_6_3_1_PRIORITY}} |
| A.6.4.1 | Management responsibilities | {{A_6_4_1_APPLICABILITY}} | {{A_6_4_1_STATUS}} | {{A_6_4_1_PERCENTAGE}}% | {{A_6_4_1_TARGET}} | {{A_6_4_1_PRIORITY}} |
| A.6.5.1 | Confidentiality or non-disclosure agreements | {{A_6_5_1_APPLICABILITY}} | {{A_6_5_1_STATUS}} | {{A_6_5_1_PERCENTAGE}}% | {{A_6_5_1_TARGET}} | {{A_6_5_1_PRIORITY}} |
| A.6.6.1 | Remote working | {{A_6_6_1_APPLICABILITY}} | {{A_6_6_1_STATUS}} | {{A_6_6_1_PERCENTAGE}}% | {{A_6_6_1_TARGET}} | {{A_6_6_1_PRIORITY}} |
| **A.7 PHYSICAL CONTROLS** |
| A.7.1.1 | Physical security perimeter | {{A_7_1_1_APPLICABILITY}} | {{A_7_1_1_STATUS}} | {{A_7_1_1_PERCENTAGE}}% | {{A_7_1_1_TARGET}} | {{A_7_1_1_PRIORITY}} |
| A.7.1.2 | Physical entry | {{A_7_1_2_APPLICABILITY}} | {{A_7_1_2_STATUS}} | {{A_7_1_2_PERCENTAGE}}% | {{A_7_1_2_TARGET}} | {{A_7_1_2_PRIORITY}} |
| A.7.1.3 | Protection against environmental threats | {{A_7_1_3_APPLICABILITY}} | {{A_7_1_3_STATUS}} | {{A_7_1_3_PERCENTAGE}}% | {{A_7_1_3_TARGET}} | {{A_7_1_3_PRIORITY}} |
| A.7.2.1 | Equipment placement and protection | {{A_7_2_1_APPLICABILITY}} | {{A_7_2_1_STATUS}} | {{A_7_2_1_PERCENTAGE}}% | {{A_7_2_1_TARGET}} | {{A_7_2_1_PRIORITY}} |
| A.7.2.2 | Supporting utilities | {{A_7_2_2_APPLICABILITY}} | {{A_7_2_2_STATUS}} | {{A_7_2_2_PERCENTAGE}}% | {{A_7_2_2_TARGET}} | {{A_7_2_2_PRIORITY}} |
| A.7.2.3 | Cabling security | {{A_7_2_3_APPLICABILITY}} | {{A_7_2_3_STATUS}} | {{A_7_2_3_PERCENTAGE}}% | {{A_7_2_3_TARGET}} | {{A_7_2_3_PRIORITY}} |
| A.7.3.1 | Equipment maintenance | {{A_7_3_1_APPLICABILITY}} | {{A_7_3_1_STATUS}} | {{A_7_3_1_PERCENTAGE}}% | {{A_7_3_1_TARGET}} | {{A_7_3_1_PRIORITY}} |
| A.7.3.2 | Removal of assets | {{A_7_3_2_APPLICABILITY}} | {{A_7_3_2_STATUS}} | {{A_7_3_2_PERCENTAGE}}% | {{A_7_3_2_TARGET}} | {{A_7_3_2_PRIORITY}} |
| A.7.3.3 | Unattended user equipment | {{A_7_3_3_APPLICABILITY}} | {{A_7_3_3_STATUS}} | {{A_7_3_3_PERCENTAGE}}% | {{A_7_3_3_TARGET}} | {{A_7_3_3_PRIORITY}} |
| A.7.4.1 | Secure disposal or reuse of equipment | {{A_7_4_1_APPLICABILITY}} | {{A_7_4_1_STATUS}} | {{A_7_4_1_PERCENTAGE}}% | {{A_7_4_1_TARGET}} | {{A_7_4_1_PRIORITY}} |
| A.7.5.1 | Secure working in offices, rooms and facilities | {{A_7_5_1_APPLICABILITY}} | {{A_7_5_1_STATUS}} | {{A_7_5_1_PERCENTAGE}}% | {{A_7_5_1_TARGET}} | {{A_7_5_1_PRIORITY}} |
| A.7.6.1 | Working in secure areas | {{A_7_6_1_APPLICABILITY}} | {{A_7_6_1_STATUS}} | {{A_7_6_1_PERCENTAGE}}% | {{A_7_6_1_TARGET}} | {{A_7_6_1_PRIORITY}} |
| A.7.7.1 | Clear desk and clear screen | {{A_7_7_1_APPLICABILITY}} | {{A_7_7_1_STATUS}} | {{A_7_7_1_PERCENTAGE}}% | {{A_7_7_1_TARGET}} | {{A_7_7_1_PRIORITY}} |
| A.7.8.1 | Equipment siting and protection | {{A_7_8_1_APPLICABILITY}} | {{A_7_8_1_STATUS}} | {{A_7_8_1_PERCENTAGE}}% | {{A_7_8_1_TARGET}} | {{A_7_8_1_PRIORITY}} |
| **A.8 TECHNOLOGICAL CONTROLS** |
| A.8.1.1 | User endpoint devices | {{A_8_1_1_APPLICABILITY}} | {{A_8_1_1_STATUS}} | {{A_8_1_1_PERCENTAGE}}% | {{A_8_1_1_TARGET}} | {{A_8_1_1_PRIORITY}} |
| A.8.1.2 | Privileged access rights | {{A_8_1_2_APPLICABILITY}} | {{A_8_1_2_STATUS}} | {{A_8_1_2_PERCENTAGE}}% | {{A_8_1_2_TARGET}} | {{A_8_1_2_PRIORITY}} |
| A.8.1.3 | Information access restriction | {{A_8_1_3_APPLICABILITY}} | {{A_8_1_3_STATUS}} | {{A_8_1_3_PERCENTAGE}}% | {{A_8_1_3_TARGET}} | {{A_8_1_3_PRIORITY}} |
| A.8.1.4 | Access to source code | {{A_8_1_4_APPLICABILITY}} | {{A_8_1_4_STATUS}} | {{A_8_1_4_PERCENTAGE}}% | {{A_8_1_4_TARGET}} | {{A_8_1_4_PRIORITY}} |

*[Matrix continues with all remaining A.8 controls through A.8.34.1]*

### A.3 Implementation Statistics

**Implementation Progress by Category:**
```
IMPLEMENTATION PROGRESS DASHBOARD

Overall Progress:
- Controls Fully Implemented: {{FULLY_IMPLEMENTED}} / {{TOTAL_APPLICABLE}}
- Controls In Progress: {{IN_PROGRESS}} / {{TOTAL_APPLICABLE}}
- Controls Not Started: {{NOT_STARTED}} / {{TOTAL_APPLICABLE}}
- Overall Implementation Percentage: {{OVERALL_PERCENTAGE}}%

By Category Progress:
- Organizational (A.5): {{A5_PROGRESS}}% complete
- People (A.6): {{A6_PROGRESS}}% complete  
- Physical (A.7): {{A7_PROGRESS}}% complete
- Technological (A.8): {{A8_PROGRESS}}% complete

By Priority Progress:
- Priority 1 (Critical): {{P1_PROGRESS}}% complete
- Priority 2 (High): {{P2_PROGRESS}}% complete
- Priority 3 (Medium): {{P3_PROGRESS}}% complete
- Priority 4 (Low): {{P4_PROGRESS}}% complete

Timeline Performance:
- On Schedule: {{ON_SCHEDULE}} controls
- Behind Schedule: {{BEHIND_SCHEDULE}} controls
- Ahead of Schedule: {{AHEAD_SCHEDULE}} controls

Budget Performance:
- Total Implementation Budget: ${{TOTAL_BUDGET}}
- Spent to Date: ${{SPENT_TO_DATE}} ({{BUDGET_USED}}%)
- Projected Final Cost: ${{PROJECTED_COST}}
- Budget Variance: {{BUDGET_VARIANCE}}%
```

---

## Appendix B: Justification Templates and Examples

*This section provides templates and examples for justifying control applicability decisions*

### B.1 Justification Templates

**Template for Applicable Controls:**
```
APPLICABLE CONTROL JUSTIFICATION TEMPLATE

Control: {{CONTROL_ID}} - {{CONTROL_NAME}}
Applicability Decision: Applicable

Risk-Based Justification:
- Primary Risk(s) Addressed: {{PRIMARY_RISKS}}
- Risk Assessment Reference: {{RISK_ASSESSMENT_REF}}
- Expected Risk Reduction: {{EXPECTED_REDUCTION}}

Business Justification:
- Business Assets Protected: {{BUSINESS_ASSETS}}
- Business Processes Supported: {{BUSINESS_PROCESSES}}
- Business Value Delivered: {{BUSINESS_VALUE}}

Regulatory Justification (if applicable):
- Applicable Regulations: {{APPLICABLE_REGULATIONS}}
- Specific Requirements: {{SPECIFIC_REQUIREMENTS}}
- Compliance Benefits: {{COMPLIANCE_BENEFITS}}

Implementation Approach:
- Implementation Method: {{IMPLEMENTATION_METHOD}}
- Resource Requirements: {{RESOURCE_REQUIREMENTS}}
- Timeline: {{IMPLEMENTATION_TIMELINE}}
- Success Criteria: {{SUCCESS_CRITERIA}}
```

**Template for Not Applicable Controls:**
```
NOT APPLICABLE CONTROL JUSTIFICATION TEMPLATE

Control: {{CONTROL_ID}} - {{CONTROL_NAME}}
Applicability Decision: Not Applicable

Justification Category: {{JUSTIFICATION_CATEGORY}}
(Scope-Based / Business Model / Technology / Risk-Based)

Detailed Justification:
{{DETAILED_JUSTIFICATION}}

Supporting Evidence:
- {{EVIDENCE_1}}
- {{EVIDENCE_2}}
- {{EVIDENCE_3}}

Alternative Risk Mitigation:
- Alternative Controls: {{ALTERNATIVE_CONTROLS}}
- Risk Coverage: {{RISK_COVERAGE}}
- Residual Risk Level: {{RESIDUAL_RISK}}

Review Triggers:
- {{REVIEW_TRIGGER_1}}
- {{REVIEW_TRIGGER_2}}
- {{REVIEW_TRIGGER_3}}
```

### B.2 Example Justifications

**Example 1: Applicable Control**
```
Control: A.8.15.1 - Logging
Applicability Decision: Applicable

Risk-Based Justification:
- Primary Risk(s) Addressed: 
  * Unauthorized access to customer data (Risk ID: RISK-2024-003)
  * Insider threats to financial systems (Risk ID: RISK-2024-007)
  * Advanced persistent threats (Risk ID: RISK-2024-012)
- Risk Assessment Reference: Risk Assessment Report v2.1, Section 4.3
- Expected Risk Reduction: 40% reduction in detection time for security incidents

Business Justification:
- Business Assets Protected: Customer database, financial systems, email systems
- Business Processes Supported: Customer service, financial reporting, communications
- Business Value Delivered: Enhanced incident detection, compliance support, forensic capability

Regulatory Justification:
- Applicable Regulations: GDPR Article 32 (Security of processing), SOX Section 404
- Specific Requirements: Audit trail for data processing activities, financial system monitoring
- Compliance Benefits: Demonstrates due diligence, supports compliance reporting

Implementation Approach:
- Implementation Method: Centralized SIEM solution with automated log collection
- Resource Requirements: $75,000 implementation, 0.5 FTE ongoing operation
- Timeline: 6 months implementation (Q1-Q2 2024)
- Success Criteria: 95% log collection coverage, <15 minute alert generation
```

**Example 2: Not Applicable Control**
```
Control: A.7.1.1 - Physical Security Perimeter
Applicability Decision: Not Applicable

Justification Category: Business Model

Detailed Justification:
Organization operates as a fully remote company with no physical offices, data centers, or facilities. All employees work from home offices, and all IT infrastructure is cloud-based and managed by third-party providers (AWS, Microsoft 365). The organization does not own, lease, or control any physical facilities that would require perimeter security controls.

Supporting Evidence:
- Corporate registration shows no physical business address
- IT inventory confirms 100% cloud-based infrastructure
- Employee handbook specifies remote-only work model
- Vendor contracts confirm cloud providers responsible for physical security

Alternative Risk Mitigation:
- Alternative Controls: A.5.19.1 (Cloud services security), A.8.1.1 (Endpoint security)
- Risk Coverage: Physical security risks transferred to cloud providers with appropriate SLAs
- Residual Risk Level: Low - cloud providers maintain comprehensive physical security

Review Triggers:
- Decision to establish physical offices or facilities
- Changes to business model requiring physical presence
- Risk assessment identifying physical security gaps in cloud provider arrangements
```

**Example 3: Partially Applicable Control**
```
Control: A.8.9.1 - Configuration Management
Applicability Decision: Partially Applicable

Applicable Elements:
- Configuration management for production servers and network infrastructure
- Change control procedures for security-critical system modifications
- Configuration baselines and monitoring for cloud infrastructure

Not Applicable Elements:
- Desktop/laptop configuration management (managed through separate MDM solution)
- Development environment configuration (managed through separate DevOps process)
- Legacy system configuration (systems scheduled for decommissioning within 12 months)

Implementation Approach:
Phase 1 (Months 1-3): Production server configuration management
- Deploy configuration management tools for critical servers
- Establish security configuration baselines
- Implement automated compliance monitoring

Phase 2 (Months 4-6): Network infrastructure configuration
- Extend configuration management to network devices
- Implement change control integration
- Establish configuration drift detection

Phase 3 (Months 7-9): Cloud infrastructure integration
- Integrate with cloud provider configuration services
- Implement infrastructure-as-code practices
- Establish automated compliance reporting

Justification for Partial Applicability:
Mixed environment with different management approaches based on system criticality and lifecycle status. Partial implementation provides risk-appropriate coverage while optimizing resource utilization and avoiding duplication with existing processes.
```

---

## Appendix C: Compliance Mapping

*This section maps ISO 27001 controls to common regulatory and framework requirements*

### C.1 Regulatory Compliance Mapping

**GDPR Compliance Mapping:**
| ISO 27001 Control | GDPR Article | Requirement Description |
|-------------------|--------------|------------------------|
| A.5.18.3 | Article 5 | Principles relating to processing of personal data |
| A.6.1.1 | Article 32 | Security of processing - personnel screening |
| A.6.2.1 | Article 32 | Security of processing - staff awareness |
| A.8.2.1 | Article 32 | Security of processing - access control |
| A.8.24.1 | Article 32 | Security of processing - encryption |
| A.5.13.1 | Article 33 | Notification of personal data breach to supervisory authority |
| A.5.13.2 | Article 34 | Communication of personal data breach to data subject |

**SOX Compliance Mapping:**
| ISO 27001 Control | SOX Section | Requirement Description |
|-------------------|-------------|------------------------|
| A.5.2.3 | Section 404 | Segregation of duties in financial processes |
| A.8.15.1 | Section 404 | Audit trails for financial system activities |
| A.8.3.1 | Section 404 | Access controls for financial applications |
| A.5.9.1 | Section 404 | Asset management for financial systems |
| A.8.9.1 | Section 404 | Configuration management for financial infrastructure |

**PCI DSS Compliance Mapping:**
| ISO 27001 Control | PCI DSS Requirement | Requirement Description |
|-------------------|-------------------|------------------------|
| A.8.2.1 | 7.1 | Restrict access to cardholder data by business need-to-know |
| A.8.24.1 | 3.4 | Render PAN unreadable anywhere it is stored |
| A.8.20.1 | 1.1 | Install and maintain firewall configuration |
| A.8.15.1 | 10.1 | Implement audit trails to link access to each individual user |
| A.6.2.1 | 12.6 | Implement security awareness program |

### C.2 Framework Alignment

**NIST Cybersecurity Framework Mapping:**
| ISO 27001 Control | NIST CSF Function | NIST CSF Category |
|-------------------|------------------|------------------|
| A.5.9.1 | IDENTIFY | Asset Management (ID.AM) |
| A.8.2.1 | PROTECT | Access Control (PR.AC) |
| A.8.15.1 | DETECT | Security Continuous Monitoring (DE.CM) |
| A.5.13.2 | RESPOND | Response Planning (RS.RP) |
| A.5.14.1 | RECOVER | Recovery Planning (RC.RP) |

**COBIT 2019 Mapping:**
| ISO 27001 Control | COBIT Process | Process Description |
|-------------------|---------------|-------------------|
| A.5.2.1 | APO01 | Manage the IT Management Framework |
| A.5.8.1 | APO12 | Manage Risk |
| A.8.3.1 | DSS05 | Manage Security Services |
| A.5.13.2 | DSS03 | Manage Problems |
| A.8.31.1 | DSS04 | Manage Continuity |

---

*This Statement of Applicability provides comprehensive documentation of ISO 27001 Annex A control applicability decisions, implementation status, and justifications. It serves as the foundation for demonstrating systematic, risk-based approach to information security control selection and implementation.*

**SoA Status**: {{SOA_STATUS}}
**ArionComply Template ID**: {{ARIONCOMPLY_TEMPLATE_ID}}
**SoA Version**: {{SOA_VERSION}}
**Next Mandatory Review**: {{NEXT_REVIEW_DATE}}
**SoA Effective Date**: {{EFFECTIVE_DATE}}
**Last Updated**: {{LAST_UPDATE_DATE}}
**Total Controls Assessed**: 93
**Certification Readiness**: {{CERTIFICATION_READINESS}}%