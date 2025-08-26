## Integration with Existing Screens

The data models defined above integrate with the existing screens as follows:

### 1. Control Review Workflow

- **Primary Tables**: 
  - `controls`, `control_implementations`, `control_implementation_tasks`, `control_test_cases`, `control_test_results`, `control_implementation_evidence`
- **Screen Integration**:
  - **Record Editor** for control implementation details
  - **ListView** for control inventory management
  - **Kanban Board** for implementation task tracking
  - **Document Editor** for control documentation
  - **Dashboard** for control implementation status
  - **Timeline View** for implementation milestones tracking

### 2. Multi-Standard Strategy Workflow

- **Primary Tables**: 
  - `control_frameworks`, `soa_control_mappings`, `statements_of_applicability`
- **Screen Integration**:
  - **Record Editor** for framework mapping
  - **ListView** for framework comparison
  - **Relationship Mapper** for visualizing control relationships
  - **Document Editor** for mapping documentation
  - **Tree View** for framework hierarchy visualization

### 3. Risk Assessment Workflow

- **Primary Tables**: 
  - `risk_assessments`, `risks`, `risk_treatment_plans`, `risk_treatments`, `risk_treatment_actions`, `risk_acceptances`
- **Screen Integration**:
  - **Record Editor** for risk assessment details
  - **ListView** for risk register
  - **Dashboard** for risk visualization
  - **Kanban Board** for risk treatment tracking
  - **Document Editor** for risk assessment reports
  - **Timeline View** for risk treatment planning

### 4. Feedback Action Workflow

- **Primary Tables**: 
  - `audit_findings`, `corrective_action_plans`, `corrective_actions`, `effectiveness_verifications`
- **Screen Integration**:
  - **Record Editor** for finding details
  - **ListView** for finding tracking
  - **Kanban Board** for corrective action management
  - **Document Editor** for corrective action plans
  - **Timeline View** for action milestone tracking

### 5. Document Editor Screen

- **Primary Tables**: 
  - `documents`, `document_versions`, `document_relationships`, `document_templates`, `document_reviews`, `document_distributions`
- **Screen Integration**:
  - **Document Editor** for creating and editing documents
  - **Record Editor** for document metadata
  - **ListView** for document inventory
  - **Relationship Mapper** for document relationship visualization

### 6. File Manager Screen

- **Primary Tables**: 
  - `documents`, `document_versions`, `audit_evidence_items`, `control_implementation_evidence`
- **Screen Integration**:
  - **File Manager** for document organization and search
  - **ListView** for file inventory
  - **Tree View** for hierarchical file organization

### 7. ListView Screen

- **Primary Tables**: 
  - All primary entity tables (`risks`, `controls`, `assets`, `audit_findings`, etc.)
- **Screen Integration**:
  - **ListView** for displaying and managing all record types
  - **ListView Template Configurator** for creating custom views
  - **Search Interface** for advanced searching within lists

### 8. Record Editor Screen

- **Primary Tables**: 
  - All primary entity tables
- **Screen Integration**:
  - **Record Editor** for detailed editing of all entity records
  - **Document Editor** for associated documentation
  - **Relationship Mapper** for visualizing entity relationships

### 9. Dashboard Screen

- **Primary Tables**: 
  - All metrics tables (`readiness_metric_values`, `dsr_metrics`, etc.)
- **Screen Integration**:
  - **Dashboard** for compliance metrics visualization
  - **ListView** for detailed metrics data

### 10. Wizard Screen

- **Primary Tables**: 
  - `risk_assessments`, `privacy_impact_assessments`, `pia_sections`, `pia_questions`, `pia_answers`
- **Screen Integration**:
  - **Wizard** for guided assessment processes
  - **Record Editor** for reviewing completed assessments
  - **Document Editor** for assessment reports

### 11. User Management Screen

- **Primary Tables**: 
  - `users`, `roles`, `role_permissions`
- **Screen Integration**:
  - **User Management** for user administration and role assignment
  - **ListView** for user and role inventory
  - **Record Editor** for detailed user and role editing

### 12. Search Interface Screen

- **Primary Tables**: 
  - All searchable content tables
- **Screen Integration**:
  - **Search Interface** for finding content across all tables
  - **ListView** for search results display
  - **Document Editor** for document search and editing

### 13. Notification Center Screen

- **Primary Tables**: 
  - `document_distributions`, `audit_findings`, `corrective_actions`
- **Screen Integration**:
  - **Notification Center** for alerts and reminders
  - **ListView** for notification history
  - **Record Editor** for notification configuration

### 14. Chat Interface Screen

- **Primary Tables**: 
  - All related context tables
- **Screen Integration**:
  - **Chat Interface** for context-aware assistance
  - Integration with all screens for in-context help

### 15. Timeline View Screen

- **Primary Tables**:
  - `audit_engagements`, `risk_treatment_plans`, `control_implementation_tasks`
- **Screen Integration**:
  - **Timeline View** for visualizing time-based activities
  - **Record Editor** for editing timeline items
  - **ListView** for timeline item inventory

### 16. Relationship Mapper Screen

- **Primary Tables**:
  - `data_flows`, `document_relationships`, `soa_control_mappings`
- **Screen Integration**:
  - **Relationship Mapper** for visualizing entity relationships
  - **Record Editor** for editing relationship properties
  - **ListView** for relationship inventory

### 17. Kanban Board Screen

- **Primary Tables**:
  - `corrective_actions`, `control_implementation_tasks`, `risk_treatment_actions`
- **Screen Integration**:
  - **Kanban Board** for workflow visualization
  - **Record Editor** for task details
  - **ListView** for task inventory

### 18. Tree View Screen

- **Primary Tables**:
  - `control_categories`, `document_relationships`, `context_issues`
- **Screen Integration**:
  - **Tree View** for hierarchical data visualization
  - **Record Editor** for node details
  - **ListView** for node inventory

## Additional Workflow Screen Mappings

### 1. Context Analysis Workflow
- **Primary Screens**: Record Editor, ListView, Document Editor, Relationship Mapper
- **Support Screens**: Dashboard, Search Interface, Chat Interface

### 2. ISMS Scope Definition Workflow
- **Primary Screens**: Record Editor, Document Editor, Relationship Mapper
- **Support Screens**: ListView, Dashboard, Search Interface, Chat Interface

### 3. Information Security Policy Development Workflow
- **Primary Screens**: Document Editor, Record Editor, ListView
- **Support Screens**: File Manager, Search Interface, Chat Interface

### 4. Risk Management Workflows
- **Primary Screens**: Risk Assessment Workflow (custom screen), Record Editor, Dashboard
- **Support Screens**: ListView, Document Editor, Relationship Mapper, Timeline View

### 5. Privacy Information Management Workflows
- **Primary Screens**: Record Editor, ListView, Relationship Mapper, Document Editor
- **Support Screens**: Dashboard, Search Interface, Chat Interface, Wizard

### 6. Documentation Management Workflow
- **Primary Screens**: Document Editor, File Manager, Record Editor
- **Support Screens**: ListView, Search Interface, Timeline View

### 7. Audit Preparation and Response Workflows
- **Primary Screens**: Record Editor, ListView, Document Editor, Timeline View
- **Support Screens**: Dashboard, Kanban Board, Search Interface, File Manager

### 8. Awareness and Competence Workflow
- **Primary Screens**: Record Editor, ListView, Document Editor
- **Support Screens**: Dashboard, Search Interface, Chat Interface, Notification Center

### 9. Asset Management Workflow
- **Primary Screens**: Record Editor, ListView, Relationship Mapper
- **Support Screens**: Dashboard, Search Interface, Document Editor

### 10. Access Control Management Workflow
- **Primary Screens**: Record Editor, ListView, User Management
- **Support Screens**: Dashboard, Search Interface, Document Editor

### 11. Incident Management Workflow
- **Primary Screens**: Record Editor, ListView, Timeline View, Kanban Board
- **Support Screens**: Dashboard, Document Editor, Relationship Mapper, Notification Center

### 12. Business Continuity Workflow
- **Primary Screens**: Record Editor, ListView, Document Editor, Timeline View
- **Support Screens**: Dashboard, Relationship Mapper, Search Interface

### 13. Supplier Relationship Workflow
- **Primary Screens**: Record Editor, ListView, Document Editor
- **Support Screens**: Dashboard, Search Interface, Relationship Mapper

### 14. Compliance Management Workflow
- **Primary Screens**: Record Editor, ListView, Dashboard, Document Editor
- **Support Screens**: Search Interface, Relationship Mapper, Multi-Standard Strategy Workflow

### 15. Certification Management Workflow
- **Primary Screens**: Record Editor, ListView, Timeline View, Document Editor
- **Support Screens**: Dashboard, Search Interface, Notification Center

## Cross-Workflow Dependencies

The data model supports these key cross-workflow dependencies:

1. **Risk Assessment → Control Implementation**
   - Risk treatments link to control implementations
   - Control evidence links to risk assessment justification

2. **Control Implementation → Statement of Applicability**
   - Control implementation status feeds into SoA
   - SoA control selection drives implementation priorities

3. **Audit Findings → Corrective Actions**
   - Audit findings trigger corrective action plans
   - Corrective actions link back to specific findings

4. **Document Management → All Workflows**
   - Documents serve as evidence across all workflows
   - Document approval workflows integrate with all processes

5. **PIA → Risk Assessment**
   - Privacy risks identified in PIAs feed into risk register
   - Risk treatments link to PIA mitigations

6. **Continuous Readiness → Audit Preparation**
   - Continuous readiness evidence feeds into audit preparation
   - Audit findings feed back into readiness improvement

7. **Context Analysis → Risk Assessment**
   - Context issues feed into risk identification
   - Stakeholder requirements drive risk criteria

8. **Scope Definition → Control Implementation**
   - Scope boundaries determine control applicability
   - Assets in scope link to control implementation

9. **Incident Management → Corrective Actions**
   - Incidents trigger corrective actions
   - Incident lessons learned feed into control improvements

10. **Supplier Management → Risk Assessment**
    - Supplier risks feed into risk register
    - Risk treatments link to supplier requirements#### PII Identification and Inventory
- **Status**: Mandatory (for 27701)
- **Triggers**:
  - Initial PIMS establishment
  - New system or process implementation
  - Changes to data collection practices
  - New types of PII being processed
  - Periodic review (annual minimum)
- **Approval Requirements**:
  - Standard requires comprehensive inventory of PII
  - Data owner verification and approval
  - DPO/Privacy Officer review
  - Legal review of classification decisions
- **Artifacts & Implementation**:
  - PII inventory
    - *Implementation*: Database with tables for PII categories, locations, purposes, and processing activities
  - Data flow diagrams
    - *Implementation*: Drawing tool with database integration for PII flow tracking
  - Data categorization schema
    - *Implementation*: Database reference tables with PII sensitivity categories and handling requirements
- **Evidence & Implementation**:
  - Data discovery outputs
    - *Implementation*: Automated scanning tool results integrated with inventory database
  - Classification justifications
    - *Implementation*: Structured database fields capturing classification decisions with criteria references
- **Data Model Requirements**:
  - `pii_categories` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `category_name`: Name of PII category
    - `description`: Description of category
    - `sensitivity_level`: ENUM('basic', 'sensitive', 'special_category', 'highly_sensitive')
    - `examples`: Examples of data in this category
    - `legal_basis`: Legal references for categorization
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `pii_data_elements` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `category_id`: Foreign key to pii_categories
    - `element_name`: Name of data element
    - `description`: Description of data element
    - `format`: Format of data (e.g., text, number, date)
    - `example`: Example of data element (sanitized)
    - `retention_period`: Default retention period
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `processing_purposes` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `purpose_name`: Name of processing purpose
    - `description`: Description of purpose
    - `legal_basis`: ENUM('consent', 'contract', 'legal_obligation', 'vital_interest', 'public_interest', 'legitimate_interest')
    - `legal_basis_details`: Details of legal basis
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `processing_activities` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `activity_name`: Name of processing activity
    - `description`: Description of activity
    - `owner_id`: Foreign key to users (process owner)
    - `status`: ENUM('active', 'planned', 'suspended', 'terminated')
    - `systems_involved`: JSON array of system IDs
    - `review_frequency`: ENUM('quarterly', 'biannual', 'annual', 'biennial')
    - `next_review_date`: Date of next scheduled review
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `processing_activity_purposes` table:
    - `id`: Primary key
    - `activity_id`: Foreign key to processing_activities
    - `purpose_id`: Foreign key to processing_purposes
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `processing_activity_data` table:
    - `id`: Primary key
    - `activity_id`: Foreign key to processing_activities
    - `data_element_id`: Foreign key to pii_data_elements
    - `collection_method`: ENUM('direct_from_subject', 'third_party', 'public_source', 'derived', 'other')
    - `retention_period`: Period for which data is retained
    - `retention_justification`: Justification for retention period
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `data_flows` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `flow_name`: Name of data flow
    - `description`: Description of flow
    - `source_type`: ENUM('system', 'process', 'organization', 'individual', 'other')
    - `source_id`: ID of source (references various tables based on source_type)
    - `destination_type`: ENUM('system', 'process', 'organization', 'individual', 'other')
    - `destination_id`: ID of destination (references various tables based on destination_type)
    - `transfer_method`: ENUM('api', 'file_transfer', 'email', 'manual', 'other')
    - `transfer_frequency`: ENUM('real_time', 'daily', 'weekly', 'monthly', 'ad_hoc')
    - `security_measures`: JSON array of security measures
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `data_flow_elements` table:
    - `id`: Primary key
    - `flow_id`: Foreign key to data_flows
    - `data_element_id`: Foreign key to pii_data_elements
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `data_discovery_scans` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `scan_name`: Name of discovery scan
    - `scan_date`: Date of scan
    - `scan_scope`: Description of scan scope
    - `scan_method`: ENUM('automated', 'manual', 'hybrid')
    - `scan_tool`: Tool used for scan
    - `scan_status`: ENUM('scheduled', 'in_progress', 'completed', 'failed')
    - `findings_summary`: Summary of findings
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `data_discovery_findings` table:
    - `id`: Primary key
    - `scan_id`: Foreign key to data_discovery_scans
    - `system_id`: Foreign key to systems/assets
    - `data_element_id`: Foreign key to pii_data_elements
    - `location`: Location where data was found
    - `instance_count`: Number of instances found
    - `sample`: Sanitized sample of found data
    - `confidence_level`: ENUM('high', 'medium', 'low')
    - `remediation_required`: Boolean
    - `remediation_notes`: Notes on required remediation
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Record Editor for PII inventory management
    - ListView for processing activities
    - Relationship Mapper for data flow visualization
    - Document Editor for data mapping documentation# ISO 27001/27701 Compliance Workflows with Data Model Requirements

This document outlines the comprehensive workflows required for ISO 27001:2022 and ISO 27701:2019 compliance, including triggers, approval requirements, artifacts, implementation approaches, and data model requirements for each workflow.

## Core ISO 27001:2022 Workflows

### 1. ISMS Establishment & Planning

#### Context Analysis
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Annual review (minimum)
  - Significant organizational change (mergers, acquisitions, restructuring)
  - Major market changes affecting business context
  - Changes to interested parties or their requirements
- **Approval Requirements**:
  - Standard requires top management review and approval
  - Context document must be approved by senior leadership
  - Formal review and sign-off by ISMS manager
- **Artifacts & Implementation**:
  - External/internal issues register
    - *Implementation*: Database table with issue records, categorization, and status tracking
  - Interested parties analysis
    - *Implementation*: Relational database tables linking stakeholders to requirements and impact ratings
  - Needs and expectations document
    - *Implementation*: Structured document with digital approval workflow, stored in document management system
- **Evidence & Implementation**:
  - Meeting minutes
    - *Implementation*: Templated documents with digital signatures, stored with metadata in document management system
  - Stakeholder interview records
    - *Implementation*: Form-based data entry with structured fields, stored in database with relationship to stakeholders
  - PESTLE analysis document
    - *Implementation*: Collaborative document with version control and approval workflow
- **Data Model Requirements**:
  - `context_issues` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `issue_type`: ENUM('internal', 'external')
    - `category`: ENUM('political', 'economic', 'social', 'technological', 'legal', 'environmental', 'other')
    - `description`: Text description of the issue
    - `impact_level`: ENUM('high', 'medium', 'low')
    - `status`: ENUM('active', 'monitoring', 'resolved', 'archived')
    - `review_date`: Date for next review
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `interested_parties` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `party_name`: Name of stakeholder
    - `party_type`: ENUM('internal', 'external')
    - `category`: ENUM('customer', 'regulator', 'supplier', 'employee', 'shareholder', 'community', 'other')
    - `description`: Description of stakeholder
    - `influence_level`: ENUM('high', 'medium', 'low')
    - `status`: ENUM('active', 'inactive')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `stakeholder_requirements` table:
    - `id`: Primary key
    - `party_id`: Foreign key to interested_parties
    - `requirement_type`: ENUM('legal', 'contractual', 'business', 'other')
    - `description`: Description of requirement
    - `importance`: ENUM('critical', 'important', 'desirable')
    - `compliance_status`: ENUM('compliant', 'partially_compliant', 'non_compliant', 'not_applicable')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `context_documents` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `document_type`: ENUM('context_analysis', 'pestle', 'stakeholder_analysis', 'meeting_minutes', 'other')
    - `title`: Document title
    - `version`: Version number
    - `status`: ENUM('draft', 'in_review', 'approved', 'archived')
    - `document_path`: Path to document in storage
    - `approval_workflow_id`: Foreign key to approval_workflows (optional)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - ListView screen for viewing issues and stakeholders
    - Record Editor for creating/editing context issues and stakeholder requirements
    - Document Editor for creating/editing context documents

#### ISMS Scope Definition
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Changes to organizational structure
  - Addition/removal of locations, processes, or technologies
  - Mergers, acquisitions, or divestments
  - Changes to regulatory requirements affecting scope
- **Approval Requirements**:
  - Standard requires formal documentation and approval by top management
  - Scope must be communicated to interested parties
  - Exclusions must be explicitly justified and approved
- **Artifacts & Implementation**:
  - Formal scope statement document
    - *Implementation*: Structured document with digital approval workflow and version control
  - Network diagrams
    - *Implementation*: Drawing tools with database integration for asset relationship mapping
  - System inventory within scope
    - *Implementation*: Database table with asset records, linked to scope boundaries
- **Evidence & Implementation**:
  - Management approval of scope
    - *Implementation*: Digital signature workflow with timestamp and role validation
  - Justification for exclusions
    - *Implementation*: Structured database entries with reason codes and approval references
- **Data Model Requirements**:
  - `isms_scopes` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `scope_name`: Name/identifier of the scope definition
    - `version`: Version number
    - `description`: Detailed description of scope
    - `effective_date`: Date when scope becomes active
    - `status`: ENUM('draft', 'in_review', 'approved', 'archived')
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `next_review_date`: Scheduled date for next review
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `scope_inclusions` table:
    - `id`: Primary key
    - `scope_id`: Foreign key to isms_scopes
    - `inclusion_type`: ENUM('location', 'process', 'system', 'function', 'department', 'other')
    - `name`: Name of included element
    - `description`: Description of included element
    - `justification`: Reason for inclusion
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `scope_exclusions` table:
    - `id`: Primary key
    - `scope_id`: Foreign key to isms_scopes
    - `exclusion_type`: ENUM('location', 'process', 'system', 'function', 'department', 'other')
    - `name`: Name of excluded element
    - `description`: Description of excluded element
    - `justification`: Reason for exclusion (required by standard)
    - `risk_assessment_id`: Foreign key to risk_assessments (optional)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `scope_boundaries` table:
    - `id`: Primary key
    - `scope_id`: Foreign key to isms_scopes
    - `boundary_type`: ENUM('physical', 'organizational', 'technological', 'other')
    - `description`: Description of boundary
    - `notes`: Additional information
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `scope_assets` table:
    - `id`: Primary key
    - `scope_id`: Foreign key to isms_scopes
    - `asset_id`: Foreign key to assets
    - `inclusion_type`: ENUM('full', 'partial', 'reference_only')
    - `notes`: Additional information about inclusion
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `scope_diagrams` table:
    - `id`: Primary key
    - `scope_id`: Foreign key to isms_scopes
    - `diagram_type`: ENUM('network', 'data_flow', 'organization', 'process', 'other')
    - `title`: Title of diagram
    - `description`: Description of diagram
    - `diagram_path`: Path to diagram file in storage
    - `version`: Version number
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Record Editor for creating/editing scope definitions
    - Document Editor for creating scope documentation
    - ListView for viewing scope inclusions/exclusions
    - Relationship Mapper for visualizing scope boundaries

#### Information Security Policy Development
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Annual review (minimum)
  - Changes to risk environment
  - New regulatory requirements
  - Significant security incidents
  - Changes in organizational objectives
- **Approval Requirements**:
  - Standard requires policy to be approved by top management
  - Must be formally documented, communicated, and available
  - Policy must be appropriate to the organization's purpose
- **Artifacts & Implementation**:
  - Information security policy document
    - *Implementation*: Template-based document generation from database-stored policy elements
  - Supporting sub-policies
    - *Implementation*: Document management system with version control and relationship mapping
- **Evidence & Implementation**:
  - Policy approval records
    - *Implementation*: Digital signature workflow with role-based approvals tracked in database
  - Version history
    - *Implementation*: Automated versioning system with change tracking and comparison features
  - Distribution records
    - *Implementation*: Database log of policy distributions with recipient acknowledgments
- **Data Model Requirements**:
  - `policies` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `policy_type`: ENUM('master', 'sub_policy', 'procedure', 'standard', 'guideline')
    - `title`: Policy title
    - `version`: Version number
    - `status`: ENUM('draft', 'in_review', 'approved', 'published', 'archived', 'superseded')
    - `scope_id`: Foreign key to isms_scopes (optional)
    - `effective_date`: Date when policy becomes active
    - `expiration_date`: Date when policy expires (if applicable)
    - `review_frequency`: ENUM('annual', 'biannual', 'quarterly', 'as_needed')
    - `next_review_date`: Scheduled date for next review
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `document_path`: Path to policy document in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `policy_elements` table:
    - `id`: Primary key
    - `policy_id`: Foreign key to policies
    - `element_type`: ENUM('purpose', 'scope', 'objective', 'statement', 'requirement', 'responsibility', 'reference')
    - `sequence`: Integer for ordering
    - `title`: Element title/heading
    - `content`: Text content of the element
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `policy_relationships` table:
    - `id`: Primary key
    - `parent_policy_id`: Foreign key to policies
    - `child_policy_id`: Foreign key to policies
    - `relationship_type`: ENUM('implements', 'references', 'supersedes', 'expands')
    - `notes`: Description of relationship
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `policy_distributions` table:
    - `id`: Primary key
    - `policy_id`: Foreign key to policies
    - `distribution_date`: Date of distribution
    - `distribution_method`: ENUM('email', 'portal', 'training', 'meeting', 'other')
    - `target_audience`: ENUM('all_staff', 'management', 'department', 'role', 'individual')
    - `audience_id`: Foreign key to departments/roles/users (based on target_audience)
    - `notification_message`: Content of distribution message
    - `distribution_status`: ENUM('scheduled', 'in_progress', 'completed', 'failed')
    - `acknowledgment_required`: Boolean
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `policy_acknowledgments` table:
    - `id`: Primary key
    - `distribution_id`: Foreign key to policy_distributions
    - `user_id`: Foreign key to users
    - `acknowledgment_date`: Date of acknowledgment
    - `acknowledgment_status`: ENUM('pending', 'viewed', 'acknowledged', 'declined')
    - `comments`: User comments (optional)
    - `created_at`, `updated_at`: Audit fields
  
  - `policy_versions` table:
    - `id`: Primary key
    - `policy_id`: Foreign key to policies
    - `version`: Version number
    - `change_description`: Description of changes from previous version
    - `document_path`: Path to specific version in storage
    - `status`: ENUM('draft', 'approved', 'published', 'archived', 'superseded')
    - `created_by`, `created_at`: Audit fields
  
  - **UI Integration**:
    - Document Editor for creating/editing policies
    - Record Editor for policy metadata management
    - ListView for policy inventory management
    - Wizard for policy creation from templates

#### Risk Assessment Methodology Selection
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Identified deficiencies in current methodology
  - Changes in regulatory requirements for risk assessment
  - Industry adoption of new risk assessment techniques
  - Organizational maturity changes
- **Approval Requirements**:
  - Standard requires documented risk criteria
  - Methodology must ensure consistent, valid, and comparable results
  - Top management approval of risk acceptance criteria
- **Artifacts & Implementation**:
  - Risk assessment methodology document
    - *Implementation*: Document with digital approval and version control
  - Risk criteria definitions
    - *Implementation*: Database tables with configurable risk criteria, scoring models, and thresholds
- **Evidence & Implementation**:
  - Methodology selection justification
    - *Implementation*: Database record with structured justification fields and approval references
  - Criteria approval
    - *Implementation*: Digital signature workflow with tracked approvals in database
- **Data Model Requirements**:
  - `risk_methodologies` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `methodology_name`: Name of methodology
    - `version`: Version number
    - `status`: ENUM('draft', 'in_review', 'approved', 'archived')
    - `description`: Detailed description of methodology
    - `framework_type`: ENUM('qualitative', 'quantitative', 'semi-quantitative', 'hybrid')
    - `scope_id`: Foreign key to isms_scopes (optional)
    - `effective_date`: Date when methodology becomes active
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `next_review_date`: Scheduled date for next review
    - `document_path`: Path to methodology document in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_criteria_sets` table:
    - `id`: Primary key
    - `methodology_id`: Foreign key to risk_methodologies
    - `criteria_set_name`: Name of criteria set
    - `criteria_type`: ENUM('impact', 'likelihood', 'risk_level', 'acceptance')
    - `description`: Description of criteria set
    - `default`: Boolean indicating if this is the default set
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_criteria` table:
    - `id`: Primary key
    - `criteria_set_id`: Foreign key to risk_criteria_sets
    - `level`: Integer representing level (1, 2, 3, etc.)
    - `label`: Text label for level (e.g., "High", "Medium", "Low")
    - `value`: Numeric value (for quantitative frameworks)
    - `description`: Detailed description of criteria
    - `color_code`: Hex color for visualizations
    - `examples`: Example scenarios for this level
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_matrices` table:
    - `id`: Primary key
    - `methodology_id`: Foreign key to risk_methodologies
    - `matrix_name`: Name of risk matrix
    - `description`: Description of matrix
    - `impact_criteria_id`: Foreign key to risk_criteria_sets
    - `likelihood_criteria_id`: Foreign key to risk_criteria_sets
    - `risk_level_criteria_id`: Foreign key to risk_criteria_sets
    - `default`: Boolean indicating if this is the default matrix
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_matrix_cells` table:
    - `id`: Primary key
    - `matrix_id`: Foreign key to risk_matrices
    - `impact_level`: Integer for impact level
    - `likelihood_level`: Integer for likelihood level
    - `risk_level`: Integer for resulting risk level
    - `description`: Optional description for this specific combination
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_acceptance_criteria` table:
    - `id`: Primary key
    - `methodology_id`: Foreign key to risk_methodologies
    - `risk_level`: Integer for risk level
    - `acceptance_authority`: ENUM('board', 'executive', 'director', 'manager', 'supervisor')
    - `review_frequency`: ENUM('quarterly', 'biannual', 'annual', 'biennial')
    - `treatment_requirement`: ENUM('mandatory', 'recommended', 'optional', 'none')
    - `documentation_required`: JSON array of required documentation
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `methodology_justifications` table:
    - `id`: Primary key
    - `methodology_id`: Foreign key to risk_methodologies
    - `justification_type`: ENUM('selection', 'modification', 'rejection')
    - `description`: Detailed justification
    - `reference_documents`: JSON array of supporting documents
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Record Editor for methodology configuration
    - Document Editor for methodology documentation
    - Wizard for methodology selection process
    - Matrix visualization component for risk matrix configuration

#### Risk Assessment Execution
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Annual review (minimum)
  - Significant changes to information assets
  - New threats or vulnerabilities identified
  - Security incidents
  - Changes in business processes or technology
- **Approval Requirements**:
  - Standard requires documentation of risk assessment process
  - Results must be validated by process/asset owners
  - Risk assessment results must be approved by management
- **Artifacts & Implementation**:
  - Risk register
    - *Implementation*: Database with related tables for risks, assets, threats, vulnerabilities, and controls
  - Risk assessment reports
    - *Implementation*: Automated report generation from database risk records with filtering options
  - Threat/vulnerability catalogs
    - *Implementation*: Database reference tables with categorized threats and vulnerabilities
- **Evidence & Implementation**:
  - Completed risk assessment worksheets
    - *Implementation*: Form-based data collection with structured fields populating risk database
  - Assessment sign-offs
    - *Implementation*: Digital signature workflow with role validation and timestamp
- **Data Model Requirements**:
  - `risk_assessments` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `assessment_name`: Name of assessment
    - `methodology_id`: Foreign key to risk_methodologies
    - `scope_id`: Foreign key to isms_scopes
    - `status`: ENUM('planned', 'in_progress', 'completed', 'approved', 'archived')
    - `assessment_type`: ENUM('initial', 'periodic', 'change_based', 'incident_response')
    - `start_date`: Date assessment started
    - `completion_date`: Date assessment completed
    - `next_assessment_date`: Scheduled date for next assessment
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `assets_assessed` table:
    - `id`: Primary key
    - `assessment_id`: Foreign key to risk_assessments
    - `asset_id`: Foreign key to assets
    - `assessment_date`: Date of assessment
    - `assessor_id`: Foreign key to users
    - `notes`: Assessment notes
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `threats` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `threat_name`: Name of threat
    - `threat_category`: ENUM('natural', 'human_unintentional', 'human_intentional', 'technical', 'operational', 'physical')
    - `description`: Detailed description
    - `source`: Source of threat information
    - `global`: Boolean indicating if this is a global catalog entry
    - `active`: Boolean indicating if threat is active
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `vulnerabilities` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `vulnerability_name`: Name of vulnerability
    - `vulnerability_category`: ENUM('technical', 'physical', 'administrative', 'environmental', 'personnel')
    - `description`: Detailed description
    - `cve_id`: CVE identifier (if applicable)
    - `source`: Source of vulnerability information
    - `global`: Boolean indicating if this is a global catalog entry
    - `active`: Boolean indicating if vulnerability is active
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risks` table:
    - `id`: Primary key
    - `assessment_id`: Foreign key to risk_assessments
    - `risk_name`: Name or identifier of risk
    - `description`: Detailed description of risk
    - `risk_owner_id`: Foreign key to users (risk owner)
    - `risk_category`: ENUM('strategic', 'operational', 'financial', 'compliance', 'reputational', 'technical')
    - `asset_ids`: JSON array of affected asset IDs
    - `threat_ids`: JSON array of related threat IDs
    - `vulnerability_ids`: JSON array of related vulnerability IDs
    - `inherent_impact`: Integer representing impact level
    - `inherent_likelihood`: Integer representing likelihood level
    - `inherent_risk_level`: Integer representing risk level
    - `residual_impact`: Integer representing residual impact after controls
    - `residual_likelihood`: Integer representing residual likelihood after controls
    - `residual_risk_level`: Integer representing residual risk level after controls
    - `status`: ENUM('identified', 'analyzed', 'evaluated', 'treated', 'accepted', 'closed')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_assessment_worksheets` table:
    - `id`: Primary key
    - `assessment_id`: Foreign key to risk_assessments
    - `asset_id`: Foreign key to assets
    - `assessor_id`: Foreign key to users
    - `worksheet_data`: JSON object containing assessment data
    - `status`: ENUM('draft', 'completed', 'validated', 'approved')
    - `validator_id`: Foreign key to users (optional)
    - `validation_date`: Date of validation (optional)
    - `validation_notes`: Notes from validation (optional)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_assessment_reports` table:
    - `id`: Primary key
    - `assessment_id`: Foreign key to risk_assessments
    - `report_type`: ENUM('summary', 'detailed', 'executive', 'compliance')
    - `generated_date`: Date report was generated
    - `report_path`: Path to report document in storage
    - `created_by`, `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Risk Assessment Workflow screen
    - Record Editor for risks and assessments
    - ListView for risk register
    - Document Editor for assessment reports
    - Dashboard for risk visualization

#### Risk Treatment Planning
- **Status**: Mandatory
- **Triggers**:
  - Completion of risk assessment
  - Identification of unacceptable risks
  - Changes to risk environment
  - Follow-up on risk treatment effectiveness reviews
  - New control options becoming available
- **Approval Requirements**:
  - Standard requires approval of risk treatment plan by risk owners
  - Explicit approval for risk acceptance by appropriate managers
  - Documentation of decisions with justification
- **Artifacts & Implementation**:
  - Risk treatment plan
    - *Implementation*: Database tracking system linking risks to treatment actions, owners, and timelines
  - Risk acceptance records
    - *Implementation*: Database records with structured fields for acceptance criteria, approvals, and expiration
- **Evidence & Implementation**:
  - Management approval of risk treatments
    - *Implementation*: Digital signature workflow with role-based approvals tracked in database
  - Implementation plans
    - *Implementation*: Project management tool integration with task tracking and milestone reporting
- **Data Model Requirements**:
  - `risk_treatment_plans` table:
    - `id`: Primary key
    - `assessment_id`: Foreign key to risk_assessments
    - `plan_name`: Name of treatment plan
    - `plan_description`: Description of overall plan
    - `status`: ENUM('draft', 'in_review', 'approved', 'in_progress', 'completed', 'archived')
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_treatments` table:
    - `id`: Primary key
    - `plan_id`: Foreign key to risk_treatment_plans
    - `risk_id`: Foreign key to risks
    - `treatment_option`: ENUM('mitigate', 'transfer', 'avoid', 'accept')
    - `treatment_description`: Description of treatment approach
    - `justification`: Justification for selected treatment option
    - `owner_id`: Foreign key to users (treatment owner)
    - `target_risk_level`: Integer representing target risk level after treatment
    - `target_completion_date`: Target date for completion
    - `actual_completion_date`: Actual completion date (if completed)
    - `status`: ENUM('planned', 'in_progress', 'implemented', 'verified', 'effective', 'ineffective')
    - `cost_estimate`: Estimated cost of treatment
    - `benefit_estimate`: Estimated benefit of treatment
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_treatment_actions` table:
    - `id`: Primary key
    - `treatment_id`: Foreign key to risk_treatments
    - `action_description`: Description of specific action
    - `action_type`: ENUM('control_implementation', 'process_change', 'technology_change', 'resource_allocation', 'other')
    - `owner_id`: Foreign key to users (action owner)
    - `priority`: ENUM('critical', 'high', 'medium', 'low')
    - `start_date`: Planned start date
    - `due_date`: Due date
    - `completion_date`: Actual completion date
    - `status`: ENUM('not_started', 'in_progress', 'completed', 'delayed', 'cancelled')
    - `completion_evidence`: Text description of evidence
    - `evidence_links`: JSON array of document references
    - `dependencies`: JSON array of dependency information
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_acceptances` table:
    - `id`: Primary key
    - `risk_id`: Foreign key to risks
    - `acceptance_rationale`: Detailed rationale for acceptance
    - `accepted_risk_level`: Integer representing accepted risk level
    - `acceptance_type`: ENUM('temporary', 'permanent', 'conditional')
    - `acceptance_conditions`: Conditions under which risk is accepted
    - `expiration_date`: Date when acceptance expires (if temporary)
    - `review_frequency`: ENUM('monthly', 'quarterly', 'biannual', 'annual', 'none')
    - `next_review_date`: Date of next scheduled review
    - `acceptance_authority_id`: Foreign key to users (accepting authority)
    - `authority_role`: Role/title of accepting authority
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `status`: ENUM('pending', 'approved', 'expired', 'revoked', 'under_review')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `treatment_effectiveness_reviews` table:
    - `id`: Primary key
    - `treatment_id`: Foreign key to risk_treatments
    - `review_date`: Date of review
    - `reviewer_id`: Foreign key to users
    - `effectiveness_rating`: ENUM('effective', 'partially_effective', 'ineffective', 'undetermined')
    - `residual_risk_level`: Integer representing residual risk after treatment
    - `review_notes`: Detailed notes from review
    - `evidence_links`: JSON array of evidence references
    - `follow_up_required`: Boolean
    - `follow_up_actions`: Text description of required follow-up
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Risk Assessment Workflow screen
    - Record Editor for risk treatments
    - ListView for risk treatment plans
    - Kanban Board for treatment action tracking
    - Dashboard for treatment effectiveness visualization

#### Statement of Applicability (SoA)
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Completion of risk assessment and treatment planning
  - Changes to control implementation
  - Standard updates (e.g., new version of ISO 27001)
  - Annual review (minimum)
- **Approval Requirements**:
  - Standard requires formal documentation with justification for inclusion/exclusion
  - Must be approved by top management
  - Explicit approval of control implementation status
- **Artifacts & Implementation**:
  - SoA document mapping all Annex A controls
    - *Implementation*: Database-generated document from control tables with applicability flags and justification fields
- **Evidence & Implementation**:
  - Management approval of SoA
    - *Implementation*: Digital signature workflow with role validation
  - Control implementation evidence links
    - *Implementation*: Database relationships mapping controls to implementation evidence records
- **Data Model Requirements**:
  - `statements_of_applicability` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `soa_name`: Name of SoA document
    - `standard_version`: ENUM('ISO27001:2013', 'ISO27001:2022', 'custom')
    - `scope_id`: Foreign key to isms_scopes
    - `version`: Version number
    - `status`: ENUM('draft', 'in_review', 'approved', 'published', 'archived')
    - `effective_date`: Date when SoA becomes active
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `next_review_date`: Scheduled date for next review
    - `document_path`: Path to generated SoA document in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_frameworks` table:
    - `id`: Primary key
    - `framework_name`: Name of control framework
    - `framework_version`: Version identifier
    - `description`: Description of framework
    - `source`: Source of framework (e.g., ISO, NIST, custom)
    - `is_standard`: Boolean indicating if this is a standard framework
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_categories` table:
    - `id`: Primary key
    - `framework_id`: Foreign key to control_frameworks
    - `category_code`: Category identifier (e.g., A.5)
    - `category_name`: Name of category
    - `description`: Description of category
    - `sequence`: Order in framework
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `controls` table:
    - `id`: Primary key
    - `framework_id`: Foreign key to control_frameworks
    - `category_id`: Foreign key to control_categories
    - `control_code`: Control identifier (e.g., A.5.1.1)
    - `control_name`: Name of control
    - `description`: Description of control
    - `objective`: Control objective
    - `guidance`: Implementation guidance
    - `sequence`: Order in category
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `soa_controls` table:
    - `id`: Primary key
    - `soa_id`: Foreign key to statements_of_applicability
    - `control_id`: Foreign key to controls
    - `applicability`: ENUM('applicable', 'not_applicable')
    - `justification`: Justification for inclusion/exclusion
    - `implementation_status`: ENUM('not_implemented', 'partially_implemented', 'implemented', 'planned')
    - `implementation_description`: Description of how control is implemented
    - `implementation_evidence`: JSON array of evidence references
    - `risk_ids`: JSON array of related risk IDs
    - `treatment_ids`: JSON array of related treatment IDs
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `soa_control_mappings` table:
    - `id`: Primary key
    - `soa_id`: Foreign key to statements_of_applicability
    - `control_id`: Foreign key to controls
    - `mapped_control_id`: Foreign key to controls
    - `mapping_type`: ENUM('implements', 'partially_implements', 'related', 'supersedes')
    - `notes`: Notes about mapping relationship
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `soa_reviews` table:
    - `id`: Primary key
    - `soa_id`: Foreign key to statements_of_applicability
    - `review_date`: Date of review
    - `reviewer_id`: Foreign key to users
    - `review_type`: ENUM('initial', 'periodic', 'change_based')
    - `review_notes`: Notes from review
    - `changes_required`: Boolean
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Record Editor for SoA management
    - ListView for control inventory and implementation status
    - Document Editor for SoA generation
    - Dashboard for control implementation visualization
    - Multi-Standard Strategy Workflow for framework mapping

#### Detailed Organizational Context Mapping
- **Status**: Optional
- **Triggers**:
  - Complex organizational environment
  - Multiple stakeholder groups with diverse requirements
  - Strategic planning initiatives
  - Mergers or acquisitions
  - Entry into new markets
- **Approval Requirements**:
  - ISMS Manager approval
  - Business unit leader validation
  - No specific standard requirement beyond basic context
- **Artifacts & Implementation**:
  - Ecosystem map
    - *Implementation*: Interactive visualization tool with database backend for entity relationships
  - Value chain analysis
    - *Implementation*: Structured database entries with process dependencies and value metrics
- **Evidence & Implementation**:
  - Stakeholder influence/impact diagrams
    - *Implementation*: Visualization tool with database backend for stakeholder attributes
  - Context review records
    - *Implementation*: Scheduled review workflows with database tracking of completion

### 2. ISMS Implementation

#### Security Control Implementation
- **Status**: Mandatory
- **Triggers**:
  - Approved risk treatment plan
  - New or revised security requirements
  - Changes to organizational environment or technology
  - Identified control deficiencies
  - Results of effectiveness evaluations
- **Approval Requirements**:
  - Standard requires verification of control implementation
  - Control owner sign-off on implementation
  - Technical validation of control effectiveness
- **Artifacts & Implementation**:
  - Control implementation plans
    - *Implementation*: Project management tool with task tracking, milestones, and resource assignments
  - Control operating procedures
    - *Implementation*: Document management system with version control and relationship to controls
- **Evidence & Implementation**:
  - Control implementation records
    - *Implementation*: Database entries with implementation status, verification methods, and evidence links
  - Testing results
    - *Implementation*: Structured test case database with results, issues, and validation status
  - Configuration exports
    - *Implementation*: Automated system configuration snapshots stored with metadata in document system
- **Data Model Requirements**:
  - `control_implementations` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `control_id`: Foreign key to controls
    - `soa_control_id`: Foreign key to soa_controls (optional)
    - `treatment_id`: Foreign key to risk_treatments (optional)
    - `implementation_name`: Name/identifier for implementation
    - `implementation_description`: Description of implementation approach
    - `control_owner_id`: Foreign key to users (control owner)
    - `implementation_status`: ENUM('planned', 'in_progress', 'implemented', 'verified', 'effective', 'ineffective')
    - `implementation_date`: Date of implementation
    - `verification_date`: Date of verification
    - `verification_method`: ENUM('testing', 'inspection', 'observation', 'interview', 'documentation_review')
    - `verifier_id`: Foreign key to users (verifier)
    - `verification_results`: Text description of verification results
    - `effectiveness_rating`: ENUM('effective', 'partially_effective', 'ineffective', 'not_assessed')
    - `next_review_date`: Date of next scheduled review
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_implementation_tasks` table:
    - `id`: Primary key
    - `implementation_id`: Foreign key to control_implementations
    - `task_name`: Name of implementation task
    - `task_description`: Description of task
    - `assigned_to`: Foreign key to users
    - `priority`: ENUM('critical', 'high', 'medium', 'low')
    - `status`: ENUM('not_started', 'in_progress', 'completed', 'blocked', 'deferred')
    - `start_date`: Planned start date
    - `due_date`: Due date
    - `completion_date`: Actual completion date
    - `completion_notes`: Notes about completion
    - `dependencies`: JSON array of dependency information
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_implementation_costs` table:
    - `id`: Primary key
    - `implementation_id`: Foreign key to control_implementations
    - `cost_type`: ENUM('one_time', 'recurring')
    - `cost_category`: ENUM('personnel', 'hardware', 'software', 'services', 'training', 'other')
    - `description`: Description of cost
    - `amount`: Decimal amount
    - `currency`: Currency code
    - `recurring_frequency`: ENUM('monthly', 'quarterly', 'annual', 'none')
    - `approval_status`: ENUM('pending', 'approved', 'rejected')
    - `approver_id`: Foreign key to users
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_operating_procedures` table:
    - `id`: Primary key
    - `implementation_id`: Foreign key to control_implementations
    - `procedure_name`: Name of procedure
    - `procedure_type`: ENUM('technical', 'administrative', 'physical', 'other')
    - `version`: Version number
    - `status`: ENUM('draft', 'in_review', 'approved', 'published', 'archived')
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `document_path`: Path to procedure document in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_implementation_evidence` table:
    - `id`: Primary key
    - `implementation_id`: Foreign key to control_implementations
    - `evidence_type`: ENUM('document', 'screenshot', 'configuration', 'log', 'test_result', 'interview', 'observation', 'other')
    - `title`: Title of evidence
    - `description`: Description of evidence
    - `collection_date`: Date evidence was collected
    - `collector_id`: Foreign key to users (evidence collector)
    - `file_path`: Path to evidence file in storage
    - `verification_status`: ENUM('unverified', 'verified', 'rejected')
    - `verifier_id`: Foreign key to users (evidence verifier)
    - `verification_date`: Date of verification
    - `verification_notes`: Notes about verification
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_test_cases` table:
    - `id`: Primary key
    - `implementation_id`: Foreign key to control_implementations
    - `test_name`: Name of test case
    - `test_objective`: Objective of test
    - `test_procedure`: Step-by-step test procedure
    - `expected_result`: Expected result of test
    - `test_type`: ENUM('manual', 'automated', 'hybrid')
    - `test_frequency`: ENUM('one_time', 'monthly', 'quarterly', 'annual', 'as_needed')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_test_results` table:
    - `id`: Primary key
    - `test_case_id`: Foreign key to control_test_cases
    - `test_date`: Date of test execution
    - `tester_id`: Foreign key to users (test executor)
    - `test_result`: ENUM('pass', 'fail', 'partial', 'inconclusive')
    - `actual_result`: Actual result of test
    - `notes`: Additional notes about test execution
    - `evidence_ids`: JSON array of evidence IDs
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Control Review Workflow screen
    - Record Editor for control implementation
    - Document Editor for operating procedures
    - ListView for implementation tracking
    - Kanban Board for implementation tasks

#### Documentation Management
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Creation or revision of ISMS documents
  - Periodic document reviews (as defined in document control procedure)
  - Organizational changes affecting document owners
  - Process changes requiring procedure updates
- **Approval Requirements**:
  - Standard requires control of documents
  - Appropriate review and approval before issuance
  - Periodic review and update as necessary
- **Artifacts & Implementation**:
  - Document control procedure
    - *Implementation*: Workflow-enabled document with approval process
  - Document inventory
    - *Implementation*: Database catalog of all controlled documents with metadata
  - Template library
    - *Implementation*: Document management system with categorized templates and usage tracking
- **Evidence & Implementation**:
  - Document approval records
    - *Implementation*: Digital signature workflow with role validation and timestamp
  - Version control logs
    - *Implementation*: Automated version history tracking with change records and comparisons
- **Data Model Requirements**:
  - `document_types` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `type_name`: Name of document type
    - `description`: Description of document type
    - `naming_convention`: Standard naming convention
    - `retention_period`: Default retention period
    - `review_frequency`: Default review frequency
    - `approval_requirements`: JSON object defining required approvals
    - `template_id`: Default template ID (optional)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `documents` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `document_type_id`: Foreign key to document_types
    - `document_number`: Unique identifier/number for document
    - `title`: Document title
    - `description`: Document description
    - `owner_id`: Foreign key to users (document owner)
    - `status`: ENUM('draft', 'in_review', 'approved', 'published', 'superseded', 'archived')
    - `version`: Current version number
    - `effective_date`: Date when document becomes effective
    - `expiration_date`: Date when document expires (if applicable)
    - `next_review_date`: Date when document should be reviewed
    - `related_standard`: Associated standard (e.g., ISO 27001)
    - `classification`: ENUM('public', 'internal', 'confidential', 'restricted')
    - `document_path`: Path to current document version in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `document_versions` table:
    - `id`: Primary key
    - `document_id`: Foreign key to documents
    - `version_number`: Version number
    - `change_description`: Description of changes from previous version
    - `status`: ENUM('draft', 'in_review', 'approved', 'published', 'superseded', 'archived')
    - `document_path`: Path to specific version in storage
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `published_date`: Date of publication
    - `published_by`: Foreign key to users
    - `created_by`, `created_at`, `updated_at`: Audit fields
  
  - `document_relationships` table:
    - `id`: Primary key
    - `source_document_id`: Foreign key to documents
    - `related_document_id`: Foreign key to documents
    - `relationship_type`: ENUM('references', 'supersedes', 'implements', 'includes', 'requires')
    - `description`: Description of relationship
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `document_templates` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `template_name`: Name of template
    - `description`: Description of template
    - `document_type_id`: Foreign key to document_types
    - `version`: Version number
    - `status`: ENUM('draft', 'approved', 'published', 'archived')
    - `template_path`: Path to template file in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `document_reviews` table:
    - `id`: Primary key
    - `document_id`: Foreign key to documents
    - `review_date`: Date of review
    - `reviewer_id`: Foreign key to users
    - `review_type`: ENUM('scheduled', 'ad_hoc', 'post_incident')
    - `review_notes`: Notes from review
    - `outcome`: ENUM('no_change', 'minor_update', 'major_update', 'archive')
    - `next_review_date`: Date of next scheduled review
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `document_distributions` table:
    - `id`: Primary key
    - `document_id`: Foreign key to documents
    - `version_id`: Foreign key to document_versions
    - `distribution_date`: Date of distribution
    - `distribution_method`: ENUM('email', 'portal', 'training', 'meeting')
    - `distributed_by`: Foreign key to users
    - `target_audience`: ENUM('all_staff', 'department', 'role', 'individuals')
    - `audience_ids`: JSON array of department/role/user IDs
    - `acknowledgment_required`: Boolean
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Document Editor for creating/editing documents
    - Record Editor for document metadata management
    - ListView for document inventory
    - File Manager for document storage and organization

#### Security Metrics Program
- **Status**: Optional
- **Triggers**:
  - ISMS performance evaluation needs
  - Management request for measurement data
  - Identification of new areas requiring monitoring
  - Changes to organizational objectives
  - Control effectiveness questions
- **Approval Requirements**:
  - Standard requires monitoring, measurement, analysis and evaluation
  - Metrics must be approved by management
  - Measurement methods must be validated
- **Artifacts & Implementation**:
  - Advanced metrics framework
    - *Implementation*: Database structure with metric definitions, formulas, thresholds, and data sources
  - Leading/lagging indicator definitions
    - *Implementation*: Database tables categorizing metrics with relationship mappings
- **Evidence & Implementation**:
  - Metric validation studies
    - *Implementation*: Structured analysis records with statistical validation stored in database
  - Correlation analysis
    - *Implementation*: Data analytics tool results stored as reports with underlying data sets

### 3. ISMS Performance Evaluation

#### Monitoring and Measurement
- **Status**: Mandatory
- **Triggers**:
  - ISMS implementation
  - Defined monitoring schedule
  - Control implementation changes
  - Security incidents
  - Identified performance issues
- **Approval Requirements**:
  - Standard requires determination of what needs to be monitored
  - Management approval of monitoring approach
  - Validation of measurement methods
- **Artifacts & Implementation**:
  - Monitoring plan
    - *Implementation*: Database-driven schedule with monitoring parameters and frequencies
  - Performance dashboards
    - *Implementation*: Real-time visualization interfaces with key metrics
  - Measurement methodologies
    - *Implementation*: Document with workflow-based approval defining measurement approaches
- **Evidence & Implementation**:
  - Monitoring results
    - *Implementation*: Database records of all monitoring activities and results
  - Trend analysis reports
    - *Implementation*: Automated reporting with statistical analysis and visualization

#### Internal Audit Planning and Execution
- **Status**: Mandatory
- **Triggers**:
  - Annual audit planning
  - ISMS implementation milestones
  - Previous audit findings follow-up
  - Management request
  - Preparation for external audits
- **Approval Requirements**:
  - Standard requires planned audit program
  - Audit plan must be approved by management
  - Auditor independence must be verified
- **Artifacts & Implementation**:
  - Audit program
    - *Implementation*: Database-driven planning tool with audit schedule and scope definitions
  - Audit procedures
    - *Implementation*: Workflow-enabled documents with step-by-step audit methods
  - Audit checklists
    - *Implementation*: Electronic forms populating audit evidence database
- **Evidence & Implementation**:
  - Audit reports
    - *Implementation*: Templated reports with structured findings and recommendations
  - Working papers
    - *Implementation*: Document repository with audit evidence and analysis
  - Auditor qualifications
    - *Implementation*: Database records of auditor credentials and independence verification

#### Management Review Preparation and Execution
- **Status**: Mandatory
- **Triggers**:
  - Scheduled reviews (minimum annually)
  - Significant changes to ISMS
  - Major security incidents
  - External audit results
  - Strategic planning cycles
- **Approval Requirements**:
  - Standard requires management review of ISMS
  - Top management participation required
  - Decisions and actions must be documented
- **Artifacts & Implementation**:
  - Management review agenda
    - *Implementation*: Template document with required input items
  - Review input package
    - *Implementation*: Compiled performance data and status reports
  - Presentation materials
    - *Implementation*: Slide decks and executive summaries of key information
- **Evidence & Implementation**:
  - Meeting minutes
    - *Implementation*: Structured document with decisions, actions, and assignments
  - Action tracking
    - *Implementation*: Database of all actions with owners, due dates, and status

### 4. ISMS Improvement

#### Nonconformity Management
- **Status**: Mandatory
- **Triggers**:
  - Audit findings
  - Monitoring results indicating issues
  - Security incidents
  - Process failures
  - Compliance violations
- **Approval Requirements**:
  - Standard requires documented nonconformity process
  - Process owner validation of nonconformity
  - ISMS manager approval of severity classification
- **Artifacts & Implementation**:
  - Nonconformity register
    - *Implementation*: Database tracking all nonconformities with categorization and status
  - Root cause analysis templates
    - *Implementation*: Structured analysis forms with methodology guidance
- **Evidence & Implementation**:
  - Nonconformity documentation
    - *Implementation*: Database records with detailed description and impact assessment
  - Investigation records
    - *Implementation*: Documentation of root cause analysis process and results

#### Corrective Action Management
- **Status**: Mandatory
- **Triggers**:
  - Identified nonconformities
  - Audit findings requiring action
  - Security incident follow-up
  - Control effectiveness issues
  - Risk treatment needs
- **Approval Requirements**:
  - Standard requires documented corrective action process
  - Action plan approval by process owner
  - ISMS manager verification of plan adequacy
- **Artifacts & Implementation**:
  - Corrective action plans
    - *Implementation*: Database of planned actions with owners, timelines, and success criteria
  - Implementation tracking system
    - *Implementation*: Project management tool for action tracking and status updates
- **Evidence & Implementation**:
  - Implementation records
    - *Implementation*: Documentation of completed actions with verification evidence
  - Effectiveness evaluation
    - *Implementation*: Structured assessment of action results against success criteria
  - Closure reports
    - *Implementation*: Formal documentation of action completion and outcome

## ISO 27701:2019 Extension (PIMS)

### 5. Privacy Information Management

#### PII Identification and Inventory
- **Status**: Mandatory (for 27701)
- **Triggers**:
  - Initial PIMS establishment
  - New system or process implementation
  - Changes to data collection practices
  - New types of PII being processed
  - Periodic review (annual minimum)
- **Approval Requirements**:
  - Standard requires comprehensive inventory of PII
  - Data owner verification and approval
  - DPO/Privacy Officer review
  - Legal review of classification decisions
- **Artifacts & Implementation**:
  - PII inventory
    - *Implementation*: Database with tables for PII categories, locations, purposes, and processing activities
  - Data flow diagrams
    - *Implementation*: Drawing tool with database integration for PII flow tracking
  - Data categorization schema
    - *Implementation*: Database reference tables with PII sensitivity categories and handling requirements
- **Evidence & Implementation**:
  - Data discovery outputs
    - *Implementation*: Automated scanning tool results integrated with inventory database
  - Classification justifications
    - *Implementation*: Structured database fields capturing classification decisions with criteria references

#### Privacy Impact Assessment (PIA)
- **Status**: Mandatory (for 27701)
- **Triggers**:
  - New system or process involving PII
  - Significant changes to existing processing
  - New types of PII being processed
  - Changes to processing purposes
  - New data sharing arrangements
- **Approval Requirements**:
  - Standard requires PIAs for high-risk processing
  - DPO/Privacy Officer approval
  - System/process owner sign-off
  - Legal review for high-risk assessments
- **Artifacts & Implementation**:
  - PIA methodology
    - *Implementation*: Document with workflow-based approval and version control
  - PIA template
    - *Implementation*: Form-based data collection tool populating structured database entries
  - PIA register
    - *Implementation*: Database tracking all PIAs with status, findings, and actions
- **Evidence & Implementation**:
  - Completed PIAs
    - *Implementation*: Database records with structured assessment data and generated reports
  - Risk mitigation plans
    - *Implementation*: Database linking PIA findings to mitigation actions with tracking
  - Approval records
    - *Implementation*: Digital signature workflow with role validation and timestamp
- **Data Model Requirements**:
  - `pia_methodologies` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `methodology_name`: Name of methodology
    - `version`: Version number
    - `status`: ENUM('draft', 'in_review', 'approved', 'archived')
    - `description`: Detailed description of methodology
    - `effective_date`: Date when methodology becomes active
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `document_path`: Path to methodology document in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `pia_templates` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `template_name`: Name of template
    - `methodology_id`: Foreign key to pia_methodologies
    - `version`: Version number
    - `status`: ENUM('draft', 'approved', 'published', 'archived')
    - `description`: Description of template
    - `document_path`: Path to template document in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `privacy_impact_assessments` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `pia_name`: Name of assessment
    - `template_id`: Foreign key to pia_templates
    - `version`: Version number
    - `status`: ENUM('draft', 'in_progress', 'in_review', 'approved', 'implemented', 'archived')
    - `initiator_id`: Foreign key to users (assessment initiator)
    - `owner_id`: Foreign key to users (assessment owner)
    - `system_id`: Foreign key to systems/assets (optional)
    - `process_id`: Foreign key to processing_activities (optional)
    - `project_id`: Foreign key to projects (optional)
    - `assessment_date`: Date of assessment
    - `risk_level`: ENUM('low', 'medium', 'high', 'very_high')
    - `approval_workflow_id`: Foreign key to approval_workflows
    - `approval_date`: Date of approval
    - `approved_by`: Foreign key to users
    - `next_review_date`: Date of next scheduled review
    - `document_path`: Path to generated report in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `pia_sections` table:
    - `id`: Primary key
    - `pia_id`: Foreign key to privacy_impact_assessments
    - `section_name`: Name of section
    - `section_order`: Order in assessment
    - `section_type`: ENUM('information', 'questions', 'risk_assessment', 'recommendations', 'approval')
    - `status`: ENUM('not_started', 'in_progress', 'completed', 'skipped')
    - `completed_by`: Foreign key to users
    - `completion_date`: Date of completion
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `pia_questions` table:
    - `id`: Primary key
    - `template_id`: Foreign key to pia_templates (null for custom questions)
    - `section_id`: Foreign key to pia_sections
    - `question_text`: Text of question
    - `question_type`: ENUM('yes_no', 'multiple_choice', 'text', 'rating_scale', 'checklist')
    - `question_order`: Order in section
    - `guidance_notes`: Guidance for answering question
    - `options`: JSON array of options (for multiple choice, etc.)
    - `required`: Boolean indicating if answer is required
    - `risk_indicator`: Boolean indicating if this is a risk indicator question
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `pia_answers` table:
    - `id`: Primary key
    - `pia_id`: Foreign key to privacy_impact_assessments
    - `question_id`: Foreign key to pia_questions
    - `answer_value`: Answer value (format depends on question_type)
    - `notes`: Additional notes or justification
    - `attachments`: JSON array of attachment references
    - `answered_by`: Foreign key to users
    - `answered_date`: Date answered
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `pia_risks` table:
    - `id`: Primary key
    - `pia_id`: Foreign key to privacy_impact_assessments
    - `risk_name`: Name of risk
    - `description`: Description of risk
    - `risk_category`: ENUM('legal_compliance', 'individual_rights', 'security', 'transparency', 'purpose_limitation', 'data_minimization', 'other')
    - `impact`: Integer representing impact level
    - `likelihood`: Integer representing likelihood level
    - `risk_level`: Integer representing overall risk level
    - `affected_data_subjects`: Description of affected data subjects
    - `affected_data_elements`: JSON array of data element IDs
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `pia_mitigations` table:
    - `id`: Primary key
    - `pia_risk_id`: Foreign key to pia_risks
    - `mitigation_name`: Name of mitigation
    - `description`: Description of mitigation
    - `mitigation_type`: ENUM('technical', 'organizational', 'legal', 'procedural', 'other')
    - `status`: ENUM('proposed', 'approved', 'in_progress', 'implemented', 'rejected')
    - `owner_id`: Foreign key to users (mitigation owner)
    - `target_date`: Target date for implementation
    - `implementation_date`: Actual implementation date
    - `verification_method`: Method for verifying implementation
    - `residual_risk_level`: Integer representing residual risk after mitigation
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Wizard for PIA execution
    - Record Editor for PIA management
    - ListView for PIA inventory
    - Dashboard for PIA risk visualization

#### PIMS Scope Definition
- **Status**: Mandatory (for 27701)
- **Triggers**:
  - Initial PIMS establishment
  - Changes to data processing activities
  - New business functions involving PII
  - Organizational restructuring
  - Regulatory changes affecting scope
- **Approval Requirements**:
  - Standard requires documented PIMS scope
  - Top management approval
  - DPO/Privacy Officer validation
  - Legal review of scope adequacy
- **Artifacts & Implementation**:
  - PIMS scope statement
    - *Implementation*: Structured document with digital approval workflow and version control
  - Processing activities in scope
    - *Implementation*: Database catalog of all in-scope processing with detailed attributes
- **Evidence & Implementation**:
  - Scope justification
    - *Implementation*: Documented rationale for scope decisions with legal references
  - Boundary definitions
    - *Implementation*: Clear documentation of included/excluded processes and systems

#### Privacy Notice/Policy Development
- **Status**: Mandatory (for 27701)
- **Triggers**:
  - Initial PIMS establishment
  - Changes to data processing activities
  - New data collection methods
  - Regulatory changes affecting notice requirements
  - Periodic review (annual minimum)
- **Approval Requirements**:
  - Standard requires transparent information to data subjects
  - Legal review and approval
  - DPO/Privacy Officer sign-off
  - Marketing/Communication review for clarity
- **Artifacts & Implementation**:
  - Privacy notices
    - *Implementation*: Multi-format notices with version control and distribution tracking
  - Privacy policies
    - *Implementation*: Document management system with version control and relationship mapping
  - Consent forms
    - *Implementation*: Electronic forms with consent capture and storage capabilities
- **Evidence & Implementation**:
  - Policy approval
    - *Implementation*: Digital signature workflow with role-based approvals
  - Version history
    - *Implementation*: Automated versioning system with change tracking
  - Distribution logs
    - *Implementation*: Database tracking of notice publication and updates

#### Data Subject Rights Management
- **Status**: Mandatory (for 27701)
- **Triggers**:
  - Receipt of data subject request
  - Changes to data subject rights under regulations
  - Identification of process inefficiencies
  - Regulatory authority guidance
  - Complaints about request handling
- **Approval Requirements**:
  - Standard requires defined processes for handling rights requests
  - Legal/compliance review of response procedures
  - Management approval of response timelines
  - DPO/Privacy Officer oversight
- **Artifacts & Implementation**:
  - DSR procedures
    - *Implementation*: Workflow-enabled document with process steps and responsibilities
  - Request forms
    - *Implementation*: Electronic forms populating database request records
  - Response templates
    - *Implementation*: Document templates with variable fields populated from database
- **Evidence & Implementation**:
  - DSR request log
    - *Implementation*: Database tracking all requests with timestamps, status, and actions
  - Response records
    - *Implementation*: Database entries with response details, timelines, and completeness checks
  - Fulfillment evidence
    - *Implementation*: Document storage with metadata linking to request records
- **Data Model Requirements**:
  - `dsr_types` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `right_name`: Name of data subject right
    - `right_code`: Code identifier (e.g., 'access', 'erasure')
    - `regulation`: Related regulation (e.g., 'GDPR', 'CCPA')
    - `description`: Description of right
    - `sla_days`: Standard response time in days
    - `verification_requirements`: JSON object with verification requirements
    - `procedure_document_id`: Foreign key to documents (procedure document)
    - `active`: Boolean indicating if this right is active
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `dsr_request_forms` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `form_name`: Name of request form
    - `right_id`: Foreign key to dsr_types
    - `form_fields`: JSON object with form field definitions
    - `form_instructions`: Instructions for form completion
    - `active`: Boolean indicating if form is active
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `dsr_requests` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `request_number`: Unique identifier/reference number
    - `right_id`: Foreign key to dsr_types
    - `request_date`: Date request was received
    - `channel`: ENUM('web_form', 'email', 'phone', 'mail', 'in_person', 'other')
    - `requestor_name`: Name of requestor
    - `requestor_email`: Email of requestor
    - `requestor_phone`: Phone number of requestor
    - `requestor_address`: Address of requestor
    - `request_details`: Details of request
    - `data_subject_name`: Name of data subject (if different from requestor)
    - `relationship_to_subject`: Relationship if requestor is not data subject
    - `verification_status`: ENUM('not_verified', 'pending', 'verified', 'failed')
    - `verification_method`: Method used for verification
    - `verification_date`: Date of verification
    - `verification_notes`: Notes about verification
    - `status`: ENUM('received', 'verification_needed', 'in_progress', 'extended', 'fulfilled', 'denied', 'withdrawn')
    - `priority`: ENUM('normal', 'high', 'urgent')
    - `due_date`: Date when response is due
    - `extended_due_date`: Extended due date (if applicable)
    - `extension_reason`: Reason for extension
    - `assignee_id`: Foreign key to users (assigned handler)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `dsr_request_tasks` table:
    - `id`: Primary key
    - `request_id`: Foreign key to dsr_requests
    - `task_name`: Name of task
    - `task_description`: Description of task
    - `assigned_to`: Foreign key to users
    - `status`: ENUM('pending', 'in_progress', 'completed', 'blocked')
    - `due_date`: Due date for task
    - `completion_date`: Date of completion
    - `notes`: Notes about task
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `dsr_data_sources` table:
    - `id`: Primary key
    - `request_id`: Foreign key to dsr_requests
    - `source_type`: ENUM('system', 'database', 'file', 'third_party', 'other')
    - `source_name`: Name of data source
    - `source_id`: ID of source (optional)
    - `search_criteria`: Search criteria used
    - `search_date`: Date of search
    - `search_results`: Summary of search results
    - `status`: ENUM('not_searched', 'in_progress', 'completed', 'no_data_found')
    - `searched_by`: Foreign key to users
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `dsr_responses` table:
    - `id`: Primary key
    - `request_id`: Foreign key to dsr_requests
    - `response_type`: ENUM('interim', 'final', 'clarification', 'extension', 'denial')
    - `response_date`: Date of response
    - `response_method`: ENUM('email', 'letter', 'portal', 'phone', 'in_person')
    - `response_details`: Details of response
    - `response_template_id`: Foreign key to response templates (if used)
    - `response_document_path`: Path to response document in storage
    - `sent_by`: Foreign key to users
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `dsr_fulfillment_actions` table:
    - `id`: Primary key
    - `request_id`: Foreign key to dsr_requests
    - `action_type`: ENUM('disclosure', 'correction', 'deletion', 'restriction', 'portability', 'objection')
    - `action_date`: Date of action
    - `system_id`: Foreign key to systems/assets
    - `data_element_ids`: JSON array of affected data element IDs
    - `action_details`: Details of action taken
    - `verification_method`: How action was verified
    - `performed_by`: Foreign key to users
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `dsr_metrics` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `request_id`: Foreign key to dsr_requests
    - `right_id`: Foreign key to dsr_types
    - `receipt_to_verification_days`: Days from receipt to verification
    - `verification_to_fulfillment_days`: Days from verification to fulfillment
    - `total_processing_days`: Total days to process
    - `within_sla`: Boolean indicating if processed within SLA
    - `extension_applied`: Boolean indicating if extension was applied
    - `complexity_rating`: ENUM('simple', 'moderate', 'complex', 'very_complex')
    - `created_by`, `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Record Editor for DSR request management
    - ListView for request tracking
    - Wizard for request handling process
    - Dashboard for DSR metrics
    - Document Editor for response preparation

#### Privacy Engineering Methodologies
- **Status**: Optional
- **Triggers**:
  - Development of new systems handling PII
  - Major redesign of existing systems
  - Adoption of privacy-by-design approach
  - Regulatory requirements for privacy engineering
  - Maturity evolution of privacy program
- **Approval Requirements**:
  - DPO/Privacy Officer approval of methodology
  - IT/Development team acceptance
  - Legal validation of approach adequacy
  - Security architecture review
- **Artifacts & Implementation**:
  - Privacy design patterns catalog
    - *Implementation*: Database of reusable patterns with implementation guidance
  - Privacy architecture principles
    - *Implementation*: Document with workflow-based approval and version control
- **Evidence & Implementation**:
  - Privacy design reviews
    - *Implementation*: Database records of reviews with findings and resolutions
  - Technical implementation guides
    - *Implementation*: Document management system with version control and relationship mapping

## Supporting Workflows

### 6. ISO 27002:2022 Control Implementation

#### Controls Mapping
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - New version of control framework
  - Changes to organizational structure
  - New business processes
  - New systems or technologies
- **Approval Requirements**:
  - Standard requires identification of necessary controls
  - ISMS manager approval of control mapping
  - Business unit validation of applicability
  - Security architecture review
- **Artifacts & Implementation**:
  - Control framework mapping
    - *Implementation*: Database mapping controls to organizational structure and processes
  - Control assignment matrix
    - *Implementation*: Database assigning control ownership and implementation responsibility
- **Evidence & Implementation**:
  - Gap analysis results
    - *Implementation*: Structured assessment of control gaps with prioritization
  - Implementation priorities
    - *Implementation*: Database of prioritized controls with justification and timelines

#### Controls Implementation Tracking
- **Status**: Mandatory
- **Triggers**:
  - Control implementation planning
  - Implementation progress reporting needs
  - Management oversight requirements
  - Audit preparation
  - Compliance status reporting
- **Approval Requirements**:
  - ISMS manager approval of tracking approach
  - Control owners validation of status reporting
  - Management acceptance of tracking metrics
- **Artifacts & Implementation**:
  - Control implementation tracker
    - *Implementation*: Database tracking implementation status, evidence, and verification
  - Control status dashboard
    - *Implementation*: Real-time visualization of implementation progress and status
- **Evidence & Implementation**:
  - Implementation milestone tracking
    - *Implementation*: Project management tool with milestone verification
  - Progress reports
    - *Implementation*: Automated reporting with implementation metrics and trends

### 7. Risk Management (ISO 27005/31000)

#### Risk Assessment Methodology
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Identified weaknesses in current methodology
  - Changes in regulatory requirements
  - New industry best practices
  - Organizational maturity evolution
- **Approval Requirements**:
  - Standard requires documented methodology
  - Top management approval of risk criteria
  - Validation of methodology effectiveness
  - ISMS manager sign-off
- **Artifacts & Implementation**:
  - Risk methodology document
    - *Implementation*: Document with workflow-based approval and version control
  - Assessment templates
    - *Implementation*: Form-based data collection tools populating risk database
  - Evaluation criteria
    - *Implementation*: Database reference tables with configurable risk criteria and scoring models
- **Evidence & Implementation**:
  - Methodology validation records
    - *Implementation*: Database entries documenting validation activities and results
  - Criteria justification
    - *Implementation*: Structured database fields capturing rationale for criteria selections

#### Risk Treatment Planning
- **Status**: Mandatory
- **Triggers**:
  - Completion of risk assessment
  - Identification of unacceptable risks
  - New risk treatment options
  - Changes to risk context
  - Risk treatment reviews
- **Approval Requirements**:
  - Standard requires documented treatment plans
  - Risk owner approval of treatment approach
  - Management approval for resource allocation
  - Explicit approval for risk acceptance
- **Artifacts & Implementation**:
  - Risk treatment plans
    - *Implementation*: Database linking risks to treatment actions with owners and timelines
  - Residual risk register
    - *Implementation*: Database tracking post-treatment risk levels with acceptance status
- **Evidence & Implementation**:
  - Treatment approval
    - *Implementation*: Digital signature workflow with approval records
  - Implementation records
    - *Implementation*: Documentation of completed treatment actions with verification

#### Quantitative Risk Analysis
- **Status**: Optional
- **Triggers**:
  - Request for financial impact analysis
  - Investment decision requirements
  - Insurance assessment needs
  - Cost-benefit analysis requirements
  - Regulatory requirements for quantified risk
- **Approval Requirements**:
  - Finance department validation of financial models
  - CISO/Security Manager approval of analysis approach
  - Senior management acceptance of quantification method
  - Validation of data quality for calculations
- **Artifacts & Implementation**:
  - FAIR methodology implementation
    - *Implementation*: Specialized risk calculation database with statistical models
  - Quantitative models
    - *Implementation*: Database-driven analysis tools with scenario modeling capabilities
- **Evidence & Implementation**:
  - Data collection methods
    - *Implementation*: Database documentation of data sources, collection methods, and quality metrics
  - Uncertainty calculations
    - *Implementation*: Statistical analysis outputs stored in database with confidence levels

### 8. Awareness and Competence

#### Security Awareness Training
- **Status**: Mandatory
- **Triggers**:
  - New employee onboarding
  - Annual refresher requirements
  - Significant changes to policies
  - Security incidents indicating awareness gaps
  - New threat landscapes
- **Approval Requirements**:
  - Standard requires security awareness and training
  - ISMS manager approval of training content
  - HR validation of training approach
  - Management approval of training requirements
- **Artifacts & Implementation**:
  - Training materials
    - *Implementation*: Learning management system with multimedia content
  - Awareness campaigns
    - *Implementation*: Campaign management tool with messaging and delivery tracking
  - Completion requirements
    - *Implementation*: Database of training requirements by role and status tracking
- **Evidence & Implementation**:
  - Attendance records
    - *Implementation*: Learning management system tracking of completion with timestamps
  - Completion certificates
    - *Implementation*: Automated certificate generation with verification codes
  - Knowledge assessments
    - *Implementation*: Quiz system with scoring and analytics

#### Role-Based Security Training
- **Status**: Mandatory
- **Triggers**:
  - New specialized roles
  - Changes to role responsibilities
  - Identification of skill gaps
  - Technology changes requiring new skills
  - Incident analysis indicating training needs
- **Approval Requirements**:
  - Standard requires competence for specific roles
  - Department head approval of role requirements
  - HR validation of training approach
  - Budget approval for specialized training
- **Artifacts & Implementation**:
  - Role security matrices
    - *Implementation*: Database mapping roles to required security competencies
  - Specialized training curricula
    - *Implementation*: Learning management system with role-specific tracks
- **Evidence & Implementation**:
  - Training completion records
    - *Implementation*: Database tracking of specialized training completion
  - Competency assessments
    - *Implementation*: Structured evaluation of skills with scoring and feedback
  - Skills validation
    - *Implementation*: Practical assessment records with verification by supervisors

## Operational & Specialized Workflows

### 9. Asset Management

#### Information Asset Inventory
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - New asset acquisition
  - Asset retirement or disposal
  - Organizational changes affecting ownership
  - Periodic review (annual minimum)
  - Significant changes to asset value
- **Approval Requirements**:
  - Standard requires inventory of information assets
  - Asset owner designation and acceptance
  - ISMS manager approval of inventory completeness
  - Classification level approval by appropriate authority
- **Artifacts & Implementation**:
  - Asset register
    - *Implementation*: Database with comprehensive asset attributes, relationships, and lifecycle status
  - Asset ownership matrix
    - *Implementation*: Database mapping assets to business owners and technical custodians
  - Asset management procedure
    - *Implementation*: Workflow-enabled document with process steps and responsibilities
- **Evidence & Implementation**:
  - Inventory reviews
    - *Implementation*: Scheduled review workflows with database tracking of completion
  - Completeness verification
    - *Implementation*: Automated reconciliation reports comparing discovery results to inventory
  - Update logs
    - *Implementation*: Database audit trails of all inventory changes with timestamp and user

#### Automated Asset Discovery
- **Status**: Optional
- **Triggers**:
  - Network changes
  - Scheduled discovery runs
  - Security incidents suggesting unknown assets
  - Configuration management needs
  - Cloud resource provisioning
- **Approval Requirements**:
  - IT manager approval of scanning parameters
  - Security validation of discovery tools
  - Asset owner notification and verification
  - Reconciliation process approval
- **Artifacts & Implementation**:
  - Discovery tool configurations
    - *Implementation*: Configuration settings database with scan parameters and schedules
  - Reconciliation procedures
    - *Implementation*: Workflow-enabled document with process steps and exception handling
- **Evidence & Implementation**:
  - Discovery scan results
    - *Implementation*: Database storage of raw scan outputs with processing metadata
  - Reconciliation reports
    - *Implementation*: Automated comparison reports between discovered assets and inventory
  - Coverage metrics
    - *Implementation*: Database tracking of network/system coverage with gap identification

### 10. Access Control Management

#### Access Control Policy
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Changes to organizational structure
  - New systems or applications
  - Security incidents related to access
  - Periodic review (annual minimum)
  - Regulatory changes affecting access requirements
- **Approval Requirements**:
  - Standard requires documented access control policy
  - Top management approval of overall policy
  - HR confirmation of role definitions
  - System owner validation of access requirements
- **Artifacts & Implementation**:
  - Access control policy
    - *Implementation*: Document with workflow-based approval and version control
  - Role definitions
    - *Implementation*: Database tables defining roles with associated permissions and access rights
  - Access request forms
    - *Implementation*: Electronic forms populating database request records
- **Evidence & Implementation**:
  - Policy approval
    - *Implementation*: Digital signature workflow with role validation
  - Exception records
    - *Implementation*: Database tracking policy exceptions with justification, approval, and expiration
  - Review documentation
    - *Implementation*: Scheduled review workflows with database tracking of completion

#### Privileged Access Management
- **Status**: Optional
- **Triggers**:
  - Identification of privileged access risks
  - Security incidents involving privileged accounts
  - Audit findings related to privileged access
  - New systems with administrative functions
  - Regulatory requirements for privileged access controls
- **Approval Requirements**:
  - CISO/Security Manager approval of PAM framework
  - System owner approval of privileged account inventory
  - Management approval of privileged access procedures
  - Audit validation of control effectiveness
- **Artifacts & Implementation**:
  - PAM solution requirements
    - *Implementation*: Document with structured requirements and evaluation criteria
  - Privileged account inventory
    - *Implementation*: Database tracking privileged accounts with enhanced metadata
- **Evidence & Implementation**:
  - Privileged session logs
    - *Implementation*: Secure database storage of session recordings with searchable metadata
  - Checkout records
    - *Implementation*: Database tracking of credential checkout with purpose and duration
  - Usage monitoring
    - *Implementation*: Analytics platform for privileged account activity with alerting

### 11. Incident Management

#### Incident Response Process
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Security incidents
  - Changes to threat environment
  - Lessons learned from incident handling
  - Periodic review (annual minimum)
  - Simulation exercise outcomes
- **Approval Requirements**:
  - Standard requires documented incident management process
  - Top management approval of overall response plan
  - Department head sign-off on specific response procedures
  - Legal review of notification requirements
- **Artifacts & Implementation**:
  - Incident response plan
    - *Implementation*: Document with workflow-based approval and version control
  - Incident classification criteria
    - *Implementation*: Database reference tables with incident categories, severity levels, and response requirements
  - Response playbooks
    - *Implementation*: Workflow-enabled documents with step-by-step response procedures
- **Evidence & Implementation**:
  - Incident log
    - *Implementation*: Database tracking all incidents with timestamps, actions, and resolution
  - Response documentation
    - *Implementation*: Case management system with structured incident data and timeline
  - Remediation plans
    - *Implementation*: Database linking incidents to remediation actions with tracking

#### Security Operations Center
- **Status**: Optional
- **Triggers**:
  - Increased security monitoring requirements
  - Complex threat environment
  - Regulatory requirements for continuous monitoring
  - Security maturity evolution
  - Security strategy enhancement
- **Approval Requirements**:
  - CISO/Security Manager approval of SOC model
  - Top management approval for resourcing
  - Legal review of monitoring policies
  - IT governance committee oversight
- **Artifacts & Implementation**:
  - SOC operations manual
    - *Implementation*: Document with workflow-based approval and version control
  - Monitoring use cases
    - *Implementation*: Database of detection rules with logic, thresholds, and response actions
  - Alert thresholds
    - *Implementation*: Database configuration of alerting parameters with review history
- **Evidence & Implementation**:
  - Alert triage records
    - *Implementation*: Database tracking all alerts with triage decisions and actions
  - Shift logs
    - *Implementation*: Structured data entry forms populating activity database
  - Performance metrics
    - *Implementation*: Analytics platform tracking SOC KPIs with trending and benchmarking

#### Tabletop Exercise Program
- **Status**: Optional
- **Triggers**:
  - Need for incident response validation
  - Team training requirements
  - Post-incident improvements
  - New threat scenarios
  - New team members
- **Approval Requirements**:
  - CISO/Security Manager approval of exercise program
  - Department head agreement for participation
  - Legal review of exercise scenarios
  - Executive sponsorship for major exercises
- **Artifacts & Implementation**:
  - Exercise scenarios
    - *Implementation*: Database of scenario descriptions with injects and expected responses
  - Facilitation guides
    - *Implementation*: Structured documents with facilitator instructions and timelines
  - Evaluation criteria
    - *Implementation*: Assessment framework with scoring metrics and performance indicators
- **Evidence & Implementation**:
  - Exercise results
    - *Implementation*: Database records of exercise execution with outcomes and observations
  - Participant feedback
    - *Implementation*: Structured feedback collection with analysis and trends
  - Improvement recommendations
    - *Implementation*: Action tracking system with recommendations and implementation status

### 12. Business Continuity

#### Business Impact Analysis
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Changes to critical business processes
  - New dependencies identified
  - Organizational restructuring
  - Periodic review (annual minimum)
  - After significant incidents
- **Approval Requirements**:
  - Standard requires understanding of continuity needs
  - Business process owner validation of impact assessments
  - Top management approval of recovery priorities
  - BCM manager sign-off on BIA completeness
- **Artifacts & Implementation**:
  - BIA methodology
    - *Implementation*: Document with workflow-based approval and version control
  - Critical function inventory
    - *Implementation*: Database of business functions with criticality ratings and dependencies
  - Recovery priorities
    - *Implementation*: Database prioritization of systems and resources with recovery sequencing
- **Evidence & Implementation**:
  - Completed BIA worksheets
    - *Implementation*: Form-based data collection with structured fields populating BIA database
  - Maximum tolerable downtimes
    - *Implementation*: Database metrics for recovery time objectives with business justification

#### Continuity Planning
- **Status**: Mandatory
- **Triggers**:
  - Completion of business impact analysis
  - Changes to recovery priorities
  - New recovery strategies
  - Organizational changes
  - Technology environment changes
  - Periodic review (annual minimum)
- **Approval Requirements**:
  - Standard requires documented continuity plans
  - Top management approval of overall strategy
  - Department head sign-off on specific procedures
  - IT director approval of technical recovery plans
- **Artifacts & Implementation**:
  - Business continuity plans
    - *Implementation*: Document management system with structured plans and procedures
  - Disaster recovery procedures
    - *Implementation*: Step-by-step technical recovery instructions with dependencies
  - Crisis communication plan
    - *Implementation*: Document with notification procedures and message templates
- **Evidence & Implementation**:
  - Plan approval
    - *Implementation*: Digital signature workflow with role validation
  - Contact lists
    - *Implementation*: Database of emergency contacts with verification status
  - Resource requirements
    - *Implementation*: Inventory of recovery resources with availability verification

#### Disaster Recovery Automation
- **Status**: Optional
- **Triggers**:
  - Technology environment changes
  - Recovery time objective shortening
  - Failed recovery tests
  - Lessons learned from incidents
  - Technology capability improvements
- **Approval Requirements**:
  - IT Director approval of automation approach
  - Business owner approval of recovery sequence
  - Change management approval of automation scripts
  - Test validation before implementation
- **Artifacts & Implementation**:
  - Automated recovery procedures
    - *Implementation*: Workflow-enabled documents with technical procedures and decision points
  - Orchestration scripts
    - *Implementation*: Code repository with version control and testing validation
- **Evidence & Implementation**:
  - Automated recovery test results
    - *Implementation*: Database records of test executions with success metrics
  - Recovery time measurements
    - *Implementation*: Performance metrics database with historical trending

### 13. Supplier Relationships

#### Supplier Security Requirements
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - New supplier engagement
  - Changes to services provided by suppliers
  - Security incidents involving suppliers
  - Periodic review (annual minimum)
  - Regulatory changes affecting supplier requirements
- **Approval Requirements**:
  - Standard requires documented supplier security requirements
  - Procurement approval of security requirements
  - Legal review of contractual clauses
  - Security/Risk Manager sign-off on requirements
- **Artifacts & Implementation**:
  - Supplier security policy
    - *Implementation*: Document with workflow-based approval and version control
  - Minimum security requirements
    - *Implementation*: Database of control requirements categorized by supplier type
  - Assessment questionnaires
    - *Implementation*: Form-based assessment tools populating supplier risk database
- **Evidence & Implementation**:
  - Requirement communication records
    - *Implementation*: Database tracking of requirement distribution with acknowledgments
  - Supplier acknowledgments
    - *Implementation*: Digital signature records with timestamp and contact information

#### Third-Party Risk Management Program
- **Status**: Optional
- **Triggers**:
  - Increase in supplier relationships
  - Complex supply chain environment
  - Increased reliance on critical suppliers
  - Regulatory requirements for vendor management
  - Security incidents in supply chain
- **Approval Requirements**:
  - CISO/Risk Manager approval of TPRM framework
  - Legal review of assessment methodology
  - Top management approval of risk acceptance criteria
  - Procurement integration and sign-off
- **Artifacts & Implementation**:
  - TPRM framework
    - *Implementation*: Document with workflow-based approval and version control
  - Risk tiering methodology
    - *Implementation*: Database reference tables with tiering criteria and assessment requirements
  - Assessment templates
    - *Implementation*: Form-based assessment tools with risk scoring algorithms
- **Evidence & Implementation**:
  - Risk assessment results
    - *Implementation*: Database of supplier assessments with risk scores and findings
  - Mitigation plans
    - *Implementation*: Database linking assessment findings to remediation actions with tracking
  - Ongoing monitoring
    - *Implementation*: Automated monitoring platform with alerting and periodic reassessment

### 14. Compliance Management

#### Legal and Regulatory Tracking
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - New legislation or regulations
  - Changes to existing regulations
  - Entry into new markets/jurisdictions
  - Changes to business activities affecting compliance
  - Periodic review (quarterly minimum)
- **Approval Requirements**:
  - Standard requires identification of legal requirements
  - Legal department verification of obligations
  - Compliance manager approval of applicability assessment
  - ISMS manager sign-off on controls mapping
- **Artifacts & Implementation**:
  - Compliance obligations register
    - *Implementation*: Database of all compliance requirements with applicability and control mappings
  - Regulatory update procedure
    - *Implementation*: Workflow-enabled document with process steps and responsibilities
- **Evidence & Implementation**:
  - Regulatory research
    - *Implementation*: Database records of research activities with sources and findings
  - Update logs
    - *Implementation*: Database audit trails of all obligation changes with timestamp and user
  - Applicability determinations
    - *Implementation*: Structured database fields capturing applicability decisions with justification

#### Multi-Framework Compliance Program
- **Status**: Optional
- **Triggers**:
  - Multiple compliance obligations
  - Optimization of compliance activities
  - Reduction of audit fatigue
  - New framework adoption
  - Organizational maturity evolution
- **Approval Requirements**:
  - Compliance manager approval of framework integration
  - Top management approval of unified approach
  - Governance committee oversight
  - Internal audit validation of coverage
- **Artifacts & Implementation**:
  - Unified control framework
    - *Implementation*: Database mapping controls across multiple standards with common implementation
  - Cross-mapping tables
    - *Implementation*: Relational database with many-to-many mappings between framework requirements
- **Evidence & Implementation**:
  - Control rationalization
    - *Implementation*: Database documentation of rationalization decisions with justification
  - Consolidated compliance reporting
    - *Implementation*: Reporting platform generating multi-framework status from single data source

### 15. Audit Management

#### Internal Audit Program
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Annual audit planning
  - Significant changes to ISMS
  - Previous audit findings
  - Management request
  - Risk assessment results
- **Approval Requirements**:
  - Standard requires planned audit program
  - Audit committee/top management approval of program
  - Confirmation of auditor independence
  - Audit scope and criteria approval by ISMS manager
- **Artifacts & Implementation**:
  - Audit charter
    - *Implementation*: Document with workflow-based approval and version control
  - Annual audit plan
    - *Implementation*: Database-driven planning tool with audit schedule and resource allocation
  - Audit methodology
    - *Implementation*: Document with workflow-based approval and version control
- **Evidence & Implementation**:
  - Audit schedule
    - *Implementation*: Calendar system with audit activities and notifications
  - Auditor qualifications
    - *Implementation*: Database of auditor skills, certifications, and independence status
  - Independence verification
    - *Implementation*: Database verification records with conflict checks and approvals

#### Continuous Control Monitoring
- **Status**: Optional
- **Triggers**:
  - Need for real-time compliance visibility
  - Audit findings suggesting control lapses
  - Increased compliance requirements
  - Technology capability improvements
  - Risk assessment results
- **Approval Requirements**:
  - CISO/Security Manager approval of monitoring approach
  - System owner approval of monitoring configurations
  - Audit validation of monitoring effectiveness
  - Data privacy review of monitoring scope
- **Artifacts & Implementation**:
  - CCM framework
    - *Implementation*: Document with workflow-based approval and version control
  - Automated test cases
    - *Implementation*: Database of test scripts with expected results and control mappings
  - Alert thresholds
    - *Implementation*: Database configuration of alerting parameters with review history
- **Evidence & Implementation**:
  - Monitoring configurations
    - *Implementation*: Database storage of monitoring parameters with change control
  - Test results
    - *Implementation*: Database records of test executions with timestamp and outcome
  - Exception handling
    - *Implementation*: Case management system tracking exceptions with resolution

### 16. Documentation and Records

#### Document Control
- **Status**: Mandatory
- **Triggers**:
  - Initial ISMS establishment
  - Creation of new documents
  - Document revision requirements
  - Changes to document owners
  - Periodic review cycles
  - Process changes affecting documentation
- **Approval Requirements**:
  - Standard requires control of documents and records
  - Document owner approval of content
  - Process owner validation of procedures
  - ISMS manager approval of document structure
- **Artifacts & Implementation**:
  - Document control procedure
    - *Implementation*: Workflow-enabled document with process steps and responsibilities
  - Document register
    - *Implementation*: Database catalog of all controlled documents with metadata
  - Template library
    - *Implementation*: Document management system with categorized templates and usage tracking
- **Evidence & Implementation**:
  - Approval records
    - *Implementation*: Digital signature workflow with role validation and timestamp
  - Version history
    - *Implementation*: Automated version tracking with change records and comparisons
  - Distribution logs
    - *Implementation*: Database tracking of document distribution with recipient acknowledgments

#### Documentation Portal/Knowledge Base
- **Status**: Optional
- **Triggers**:
  - Growing document repository
  - User feedback on document accessibility
  - Knowledge sharing requirements
  - Organizational growth
  - Distributed workforce needs
- **Approval Requirements**:
  - ISMS manager approval of portal design
  - IT approval of technical implementation
  - Information security review of access controls
  - User acceptance testing sign-off
- **Artifacts & Implementation**:
  - Portal architecture
    - *Implementation*: Design document with component specifications and workflows
  - Search functionality
    - *Implementation*: Text indexing system with metadata filtering capabilities
  - Access controls
    - *Implementation*: Database mapping of document permissions to roles and users
- **Evidence & Implementation**:
  - Usage metrics
    - *Implementation*: Analytics platform tracking portal activity with trending
  - Search effectiveness
    - *Implementation*: Database records of search queries with result relevance metrics
  - User feedback
    - *Implementation*: Form-based feedback collection with structured evaluation criteria

### 17. Audit Preparation and Response

#### Certification Audit Preparation
- **Status**: Mandatory (for certification)
- **Triggers**:
  - Scheduled certification audit
  - Surveillance audit notification
  - Recertification planning
  - Change of certification body
  - Standard version update requiring re-certification
- **Approval Requirements**:
  - Top management approval of audit scope
  - ISMS manager sign-off on readiness declaration
  - Department heads' confirmation of preparedness
  - Resource allocation approval for audit support
- **Artifacts & Implementation**:
  - Audit preparation checklist
    - *Implementation*: Database-driven checklist with responsibilities and status tracking
  - Evidence compilation package
    - *Implementation*: Document management system with categorized evidence mapped to standard requirements
  - Pre-audit briefing materials
    - *Implementation*: Presentation slides and supporting documents with approval workflow
  - Audit logistics plan
    - *Implementation*: Schedule and resource allocation database with notifications and reminders

#### Regulatory Audit Preparation
- **Status**: Mandatory (when applicable)
- **Triggers**:
  - Regulatory authority audit notification
  - Mandatory compliance reviews (e.g., GDPR supervisory authority, sectoral regulator)
  - Follow-up audits from previous findings
  - Self-disclosure requiring verification
  - Regulatory investigation response
- **Approval Requirements**:
  - Top management notification and approval
  - Legal counsel review of preparation approach
  - Compliance officer sign-off on documentation
  - Department heads' confirmation of preparedness
- **Artifacts & Implementation**:
  - Regulatory requirements mapping
    - *Implementation*: Database mapping specific regulatory requirements to evidence and controls
  - Response procedure
    - *Implementation*: Workflow-enabled document with process steps and responsibilities
  - Authority communication protocol
    - *Implementation*: Document with approval workflow for all external communications
  - Evidence package templates
    - *Implementation*: Structured templates for different regulatory frameworks with required evidence types

#### Third-Party Audit Preparation
- **Status**: Mandatory (when applicable)
- **Triggers**:
  - Customer audit notification
  - Partner security assessment request
  - Supply chain verification requirement
  - Contractual audit clause activation
  - Industry peer review
- **Approval Requirements**:
  - Management approval of audit scope and access
  - Legal review of non-disclosure agreements
  - Information security review of evidence sharing
  - Department heads' approval of staff participation
- **Artifacts & Implementation**:
  - Third-party audit procedure
    - *Implementation*: Workflow-enabled document with process steps and responsibilities
  - Evidence repository
    - *Implementation*: Document management system with pre-approved shareable evidence
  - Confidentiality agreements
    - *Implementation*: Template documents with digital signature workflow
  - Scope limitation documentation
    - *Implementation*: Formal documentation of out-of-scope areas with justification

#### Audit Finding Management
- **Status**: Mandatory
- **Triggers**:
  - Receipt of audit report with findings
  - Identification of nonconformities
  - Observations requiring action
  - Opportunities for improvement
  - Management review of audit results
- **Approval Requirements**:
  - Management acknowledgment of findings
  - Process owner acceptance of finding validity
  - ISMS manager approval of corrective action plans
  - Resource allocation approval for remediation
- **Artifacts & Implementation**:
  - Finding register
    - *Implementation*: Database tracking all findings with categorization, priority, and status
  - Root cause analysis documentation
    - *Implementation*: Structured analysis forms with approval workflow
  - Corrective action plans
    - *Implementation*: Project management tool with tasks, responsibilities, and timelines
  - Effectiveness verification procedure
    - *Implementation*: Workflow-enabled document with verification criteria and evidence requirements
- **Data Model Requirements**:
  - `audit_reports` table:
    - `id`: Primary key
    - `engagement_id`: Foreign key to audit_engagements
    - `report_name`: Name of report
    - `report_date`: Date of report
    - `version`: Version number
    - `report_path`: Path to report document in storage
    - `overall_result`: ENUM('conformant', 'minor_nonconformities', 'major_nonconformities', 'critical_nonconformities')
    - `executive_summary`: Executive summary text
    - `received_date`: Date report was received
    - `acknowledged_by`: Foreign key to users
    - `acknowledgment_date`: Date of acknowledgment
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `audit_findings` table:
    - `id`: Primary key
    - `report_id`: Foreign key to audit_reports
    - `finding_number`: Unique identifier/number for finding
    - `finding_type`: ENUM('nonconformity_major', 'nonconformity_minor', 'observation', 'opportunity_for_improvement')
    - `title`: Short title of finding
    - `description`: Detailed description of finding
    - `standard_reference`: Reference to standard requirement
    - `control_id`: Foreign key to controls (optional)
    - `evidence_references`: JSON array of evidence references
    - `finding_owner_id`: Foreign key to users (finding owner)
    - `status`: ENUM('new', 'acknowledged', 'in_remediation', 'remediated', 'verified', 'closed', 'disputed')
    - `priority`: ENUM('critical', 'high', 'medium', 'low')
    - `due_date`: Due date for resolution
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `finding_root_causes` table:
    - `id`: Primary key
    - `finding_id`: Foreign key to audit_findings
    - `analysis_method`: ENUM('five_why', 'fishbone', 'fault_tree', 'barrier_analysis', 'change_analysis', 'other')
    - `analysis_date`: Date of analysis
    - `participants`: JSON array of participant IDs
    - `root_cause_category`: ENUM('people', 'process', 'technology', 'governance', 'external', 'other')
    - `root_cause_description`: Detailed description of root cause
    - `contributing_factors`: Text describing contributing factors
    - `approval_status`: ENUM('draft', 'submitted', 'approved', 'rejected')
    - `approved_by`: Foreign key to users
    - `approval_date`: Date of approval
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `corrective_action_plans` table:
    - `id`: Primary key
    - `finding_id`: Foreign key to audit_findings
    - `plan_name`: Name of corrective action plan
    - `description`: Description of plan
    - `plan_owner_id`: Foreign key to users (plan owner)
    - `containment_actions`: Text describing immediate containment actions
    - `target_completion_date`: Target date for completion
    - `actual_completion_date`: Actual completion date
    - `status`: ENUM('draft', 'approved', 'in_progress', 'completed', 'verified', 'ineffective')
    - `approval_status`: ENUM('pending', 'approved', 'rejected')
    - `approved_by`: Foreign key to users
    - `approval_date`: Date of approval
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `corrective_actions` table:
    - `id`: Primary key
    - `plan_id`: Foreign key to corrective_action_plans
    - `action_description`: Description of specific action
    - `action_type`: ENUM('process_change', 'system_change', 'training', 'documentation', 'control_implementation', 'other')
    - `assigned_to`: Foreign key to users
    - `priority`: ENUM('critical', 'high', 'medium', 'low')
    - `status`: ENUM('not_started', 'in_progress', 'completed', 'verified')
    - `target_date`: Target date for completion
    - `completion_date`: Actual completion date
    - `completion_evidence`: JSON array of evidence references
    - `notes`: Additional notes
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `effectiveness_verifications` table:
    - `id`: Primary key
    - `plan_id`: Foreign key to corrective_action_plans
    - `verification_method`: ENUM('audit', 'testing', 'inspection', 'review', 'analysis', 'other')
    - `verification_criteria`: Criteria for determining effectiveness
    - `verifier_id`: Foreign key to users (verifier)
    - `scheduled_date`: Scheduled date for verification
    - `actual_date`: Actual date of verification
    - `result`: ENUM('effective', 'partially_effective', 'ineffective', 'inconclusive')
    - `evidence_references`: JSON array of evidence references
    - `notes`: Verification notes
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `finding_disputes` table:
    - `id`: Primary key
    - `finding_id`: Foreign key to audit_findings
    - `dispute_reason`: Reason for disputing finding
    - `supporting_evidence`: JSON array of evidence references
    - `submitted_by`: Foreign key to users
    - `submission_date`: Date of submission
    - `status`: ENUM('submitted', 'under_review', 'accepted', 'rejected')
    - `reviewer_id`: Foreign key to users (reviewer)
    - `review_date`: Date of review
    - `review_notes`: Notes from review
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Record Editor for findings management
    - ListView for findings tracking
    - Kanban Board for corrective actions
    - Dashboard for audit findings metrics
    - Feedback Action Workflow for handling findings

#### Continuous Audit Readiness
- **Status**: Optional (Recommended)
- **Triggers**:
  - ISMS maturity evolution
  - Multiple audit obligations
  - Previous audit difficulties
  - Resource optimization needs
  - Regulatory complexity increase
- **Approval Requirements**:
  - Top management endorsement of approach
  - ISMS manager approval of continuous readiness program
  - Resource allocation for ongoing activities
  - Compliance officer validation of coverage
- **Artifacts & Implementation**:
  - Continuous readiness framework
    - *Implementation*: Document with workflow-based approval and version control
  - Evidence management system
    - *Implementation*: Document management system with automated evidence collection and organization
  - Control testing schedule
    - *Implementation*: Database-driven calendar with automated notifications and task assignments
  - Readiness dashboard
    - *Implementation*: Real-time visualization of compliance status with metrics and trend analysis
- **Data Model Requirements**:
  - `continuous_readiness_programs` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `program_name`: Name of program
    - `description`: Description of program
    - `status`: ENUM('planned', 'active', 'inactive')
    - `start_date`: Program start date
    - `end_date`: Program end date (if applicable)
    - `program_owner_id`: Foreign key to users (program owner)
    - `framework_ids`: JSON array of framework IDs
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_testing_schedules` table:
    - `id`: Primary key
    - `program_id`: Foreign key to continuous_readiness_programs
    - `schedule_name`: Name of testing schedule
    - `description`: Description of schedule
    - `start_date`: Schedule start date
    - `end_date`: Schedule end date
    - `recurrence_pattern`: JSON object defining recurrence pattern
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_test_cycles` table:
    - `id`: Primary key
    - `schedule_id`: Foreign key to control_testing_schedules
    - `cycle_name`: Name of test cycle
    - `cycle_start_date`: Cycle start date
    - `cycle_end_date`: Cycle end date
    - `status`: ENUM('planned', 'in_progress', 'completed', 'cancelled')
    - `completion_percentage`: Percentage of completed tests
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_tests` table:
    - `id`: Primary key
    - `cycle_id`: Foreign key to control_test_cycles
    - `control_id`: Foreign key to controls
    - `test_name`: Name of test
    - `test_description`: Description of test
    - `test_method`: ENUM('inspection', 'observation', 'interview', 'documentation_review', 'technical_test')
    - `test_procedure`: Test procedure steps
    - `expected_result`: Expected test result
    - `assigned_to`: Foreign key to users
    - `planned_date`: Planned test date
    - `actual_date`: Actual test date
    - `status`: ENUM('planned', 'in_progress', 'completed', 'deferred', 'cancelled')
    - `result`: ENUM('pass', 'fail', 'partial', 'inconclusive')
    - `finding_ids`: JSON array of related finding IDs
    - `evidence_references`: JSON array of evidence references
    - `notes`: Test notes
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `evidence_collection_rules` table:
    - `id`: Primary key
    - `program_id`: Foreign key to continuous_readiness_programs
    - `rule_name`: Name of collection rule
    - `description`: Description of rule
    - `control_id`: Foreign key to controls
    - `evidence_type`: ENUM('document', 'record', 'screenshot', 'log', 'configuration', 'other')
    - `collection_frequency`: ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'event_based')
    - `collection_method`: ENUM('manual', 'automated', 'hybrid')
    - `retention_period`: Period for evidence retention
    - `responsible_id`: Foreign key to users
    - `status`: ENUM('active', 'inactive')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `automated_evidence_collections` table:
    - `id`: Primary key
    - `rule_id`: Foreign key to evidence_collection_rules
    - `collection_date`: Date of collection
    - `status`: ENUM('scheduled', 'in_progress', 'completed', 'failed')
    - `system_id`: Foreign key to systems/assets
    - `collection_details`: Details of collection process
    - `evidence_path`: Path to evidence in storage
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `readiness_assessments` table:
    - `id`: Primary key
    - `program_id`: Foreign key to continuous_readiness_programs
    - `assessment_name`: Name of assessment
    - `assessment_date`: Date of assessment
    - `assessor_id`: Foreign key to users
    - `framework_id`: Foreign key to control_frameworks
    - `overall_readiness`: Percentage of readiness
    - `strengths`: Text describing strengths
    - `gaps`: Text describing gaps
    - `priority_actions`: Text describing priority actions
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `readiness_assessment_details` table:
    - `id`: Primary key
    - `assessment_id`: Foreign key to readiness_assessments
    - `control_id`: Foreign key to controls
    - `readiness_level`: ENUM('not_implemented', 'partially_implemented', 'mostly_implemented', 'fully_implemented')
    - `evidence_references`: JSON array of evidence references
    - `notes`: Assessment notes
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `readiness_metrics` table:
    - `id`: Primary key
    - `program_id`: Foreign key to continuous_readiness_programs
    - `metric_name`: Name of metric
    - `metric_description`: Description of metric
    - `metric_type`: ENUM('leading', 'lagging', 'diagnostic')
    - `calculation_method`: Description of calculation method
    - `target_value`: Target value for metric
    - `warning_threshold`: Warning threshold value
    - `critical_threshold`: Critical threshold value
    - `frequency`: ENUM('daily', 'weekly', 'monthly', 'quarterly')
    - `status`: ENUM('active', 'inactive')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `readiness_metric_values` table:
    - `id`: Primary key
    - `metric_id`: Foreign key to readiness_metrics
    - `measurement_date`: Date of measurement
    - `value`: Measured value
    - `status`: ENUM('on_target', 'warning', 'critical')
    - `notes`: Notes about measurement
    - `created_by`, `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Dashboard for readiness monitoring
    - ListView for control testing
    - Record Editor for evidence management
    - Document Editor for readiness documentation

### 18. Certification Management

#### Certification Readiness Assessment
- **Status**: Mandatory (for certification)
- **Triggers**:
  - Decision to pursue certification
  - Pre-certification planning
  - Prior to surveillance audits
  - After significant ISMS changes
  - New certification standards version
- **Approval Requirements**:
  - Top management commitment to certification
  - ISMS manager approval of assessment approach
  - Department head sign-off on readiness status
  - Resource allocation approval for remediation
- **Artifacts & Implementation**:
  - Readiness assessment methodology
    - *Implementation*: Document with workflow-based approval and version control
  - Gap analysis template
    - *Implementation*: Form-based assessment tool with structured gap categorization
- **Evidence & Implementation**:
  - Assessment results
    - *Implementation*: Database records of readiness evaluations with scoring and findings
  - Pre-certification action plans
    - *Implementation*: Project management tool with task tracking, milestones, and assignments

#### Multi-Standard Alignment Strategy
- **Status**: Optional
- **Triggers**:
  - Multiple certification objectives
  - New standard adoption
  - Efficiency improvement initiatives
  - Resource constraints for multiple certifications
  - Audit fatigue concerns
- **Approval Requirements**:
  - Top management approval of multi-standard approach
  - ISMS manager sign-off on control alignment
  - Compliance manager validation of coverage
  - Resource allocation approval
- **Artifacts & Implementation**:
  - Standards mapping document
    - *Implementation*: Database-generated document showing cross-standard requirements
  - Unified control framework
    - *Implementation*: Database mapping controls across multiple standards with common implementation
- **Evidence & Implementation**:
  - Gap analysis between standards
    - *Implementation*: Database comparison of standard requirements with identified gaps
  - Control rationalization
    - *Implementation*: Database documentation of rationalization decisions with justification
