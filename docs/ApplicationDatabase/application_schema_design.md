# Improved Database Schema and Workflow Mapping

*Version 1.0 - August 22, 2025*

## Overview

This document outlines the improved database schema design for ArionComply, focusing on optimizing relationship modeling with junction tables, enhancing JSONB validation, and implementing tiered audit trails. The design follows our established database schema principles while addressing identified areas for improvement.

## Core Schema Improvements

### 1. Risk Assessment Workflow

#### Risk Management Data Model
- **Data Model Requirements**:
  - `risks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `assessment_id`: Foreign key to risk_assessments
    - `risk_name`: Name or identifier of risk
    - `description`: Detailed description of risk
    - `risk_owner_id`: Foreign key to users (risk owner)
    - `risk_category`: ENUM('strategic', 'operational', 'financial', 'compliance', 'reputational', 'technical')
    - `inherent_impact`: Integer representing impact level
    - `inherent_likelihood`: Integer representing likelihood level
    - `inherent_risk_level`: Integer representing risk level
    - `residual_impact`: Integer representing residual impact after controls
    - `residual_likelihood`: Integer representing residual likelihood after controls
    - `residual_risk_level`: Integer representing residual risk level after controls
    - `status`: ENUM('identified', 'analyzed', 'evaluated', 'treated', 'accepted', 'closed')
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
  
  - `risk_assets` table (junction table):
    - `risk_id`: UUID REFERENCES risks(id) ON DELETE CASCADE
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE RESTRICT
    - PRIMARY KEY (risk_id, asset_id)
    - `impact_level`: Text describing impact on this specific asset
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_threats` table (junction table):
    - `risk_id`: UUID REFERENCES risks(id) ON DELETE CASCADE
    - `threat_id`: UUID REFERENCES threats(id) ON DELETE RESTRICT
    - PRIMARY KEY (risk_id, threat_id)
    - `relevance_score`: Integer indicating threat relevance
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_vulnerabilities` table (junction table):
    - `risk_id`: UUID REFERENCES risks(id) ON DELETE CASCADE
    - `vulnerability_id`: UUID REFERENCES vulnerabilities(id) ON DELETE RESTRICT
    - PRIMARY KEY (risk_id, vulnerability_id)
    - `exploitation_ease`: Text describing ease of exploitation
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Record Editor for risk assessment details
    - ListView for risk register
    - Dashboard for risk visualization
    - Relationship Mapper for visualizing risk relationships
    - Document Editor for risk assessment reports

#### Risk Treatment Planning
- **Status**: Mandatory
- **Triggers**:
  - Risk assessment completion
  - Risk level exceeding acceptance threshold
  - Periodic risk treatment review
  - Changes to risk profile
- **Approval Requirements**:
  - Risk owner approval
  - Treatment approach authorization
  - Budget approval for mitigations
  - Management acceptance of residual risk
- **Artifacts & Implementation**:
  - Risk treatment plan
    - *Implementation*: Structured database records with treatment options and implementation tracking
  - Treatment option analysis
    - *Implementation*: Comparative database of treatment options with cost-benefit data
- **Data Model Requirements**:
  - `risk_treatment_plans` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_name`: Name of treatment plan
    - `description`: Description of plan
    - `plan_owner_id`: Foreign key to users
    - `status`: ENUM('draft', 'approved', 'in_progress', 'completed', 'cancelled')
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_treatments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `risk_id`: Foreign key to risks
    - `plan_id`: Foreign key to risk_treatment_plans
    - `treatment_type`: ENUM('mitigate', 'transfer', 'avoid', 'accept')
    - `treatment_description`: Description of treatment approach
    - `target_risk_level`: Target residual risk level
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `risk_treatment_control_mappings` table (junction table):
    - `treatment_id`: UUID REFERENCES risk_treatments(id) ON DELETE CASCADE
    - `control_id`: UUID REFERENCES controls(id) ON DELETE RESTRICT
    - `mapping_type`: ENUM('primary', 'supporting', 'compensating')
    - PRIMARY KEY (treatment_id, control_id)
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

### 2. Control Implementation Workflow

#### Control Review and Implementation
- **Status**: Mandatory
- **Triggers**:
  - New control framework adoption
  - Framework version updates
  - Risk treatment requirements
  - Periodic control reviews
  - Post-incident control assessments
- **Approval Requirements**:
  - Control owner approval
  - Implementation evidence validation
  - Technical review of implementation
  - Management approval of status changes
- **Artifacts & Implementation**:
  - Control implementation plan
    - *Implementation*: Database-driven implementation tracking with assignments and deadlines
  - Implementation evidence
    - *Implementation*: Document repository integrated with control database
- **Data Model Requirements**:
  - `control_implementations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `control_id`: Foreign key to controls
    - `organization_id`: Foreign key to organizations
    - `implementation_status`: ENUM('not_implemented', 'partially_implemented', 'implemented', 'not_applicable', 'planned')
    - `implementation_description`: Description of how control is implemented
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
  
  - `control_implementation_evidence` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `implementation_id`: Foreign key to control_implementations
    - `evidence_type`: ENUM('document', 'screenshot', 'log', 'test_result', 'certification', 'attestation', 'other')
    - `evidence_title`: Title of evidence
    - `evidence_description`: Description of evidence
    - `file_path`: Path to evidence file
    - `verification_status`: ENUM('unverified', 'verified', 'rejected')
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_implementation_risks` table (junction table):
    - `implementation_id`: UUID REFERENCES control_implementations(id) ON DELETE CASCADE
    - `risk_id`: UUID REFERENCES risks(id) ON DELETE RESTRICT
    - `effectiveness_rating_id`: UUID REFERENCES lookup_options(id) -- Standardized effectiveness rating
    - PRIMARY KEY (implementation_id, risk_id)
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Record Editor for control implementation details
    - ListView for control inventory management
    - Kanban Board for implementation task tracking
    - Document Editor for control documentation
    - Dashboard for control implementation status

#### Control Testing and Verification
- **Status**: Recommended
- **Triggers**:
  - Control implementation completion
  - Periodic testing schedule
  - Changes to control implementation
  - Risk-based testing prioritization
  - Audit preparation
- **Approval Requirements**:
  - Test plan approval by control owner
  - Test result validation by independent reviewer
  - Remediation plan approval for failed tests
  - Final test evidence approval
- **Data Model Requirements**:
  - `control_test_cases` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `implementation_id`: Foreign key to control_implementations
    - `test_name`: Name of test case
    - `test_description`: Description of test
    - `test_procedure`: Detailed test procedure
    - `expected_result`: Expected test result
    - `test_frequency`: ENUM('one_time', 'daily', 'weekly', 'monthly', 'quarterly', 'annually')
    - `next_test_date`: Scheduled date for next test
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_test_results` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `test_case_id`: Foreign key to control_test_cases
    - `test_date`: Date of test execution
    - `tester_id`: Foreign key to users
    - `test_result`: ENUM('pass', 'fail', 'partial', 'inconclusive')
    - `actual_result`: Actual test result
    - `notes`: Notes about test execution
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `control_test_evidence` table (junction table):
    - `test_result_id`: UUID REFERENCES control_test_results(id) ON DELETE CASCADE
    - `evidence_id`: UUID REFERENCES control_implementation_evidence(id) ON DELETE RESTRICT
    - PRIMARY KEY (test_result_id, evidence_id)
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`: Audit fields

### 3. Document Management Workflow

#### Document Creation and Management
- **Status**: Mandatory
- **Triggers**:
  - New compliance requirement
  - Policy development need
  - Procedure documentation
  - Periodic document review
  - Document template updates
- **Approval Requirements**:
  - Document owner approval
  - Technical review for accuracy
  - Management approval for policies
  - Legal review for sensitive documents
- **Data Model Requirements**:
  - `documents` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `title`: Title of document
    - `description`: Description of document
    - `document_type`: ENUM('policy', 'procedure', 'standard', 'guideline', 'form', 'record', 'evidence', 'report')
    - `status`: ENUM('draft', 'review', 'approved', 'published', 'deprecated', 'archived')
    - `content`: Text content
    - `content_format`: ENUM('markdown', 'html', 'text', 'json')
    - `parent_document_id`: Foreign key to documents (self-reference)
    - `current_version_id`: Foreign key to document_versions
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
  
  - `document_versions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `document_id`: Foreign key to documents
    - `version_number`: Version number
    - `content`: Text content
    - `content_format`: ENUM('markdown', 'html', 'text', 'json')
    - `change_summary`: Summary of changes
    - `status`: ENUM('draft', 'review', 'approved', 'published', 'deprecated')
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`: Audit fields
    - UNIQUE(document_id, version_number)
  
  - `document_relationships` table (junction table):
    - `source_document_id`: UUID REFERENCES documents(id) ON DELETE CASCADE
    - `target_document_id`: UUID REFERENCES documents(id) ON DELETE CASCADE
    - `relationship_type`: ENUM('references', 'replaces', 'implements', 'supports', 'related')
    - PRIMARY KEY (source_document_id, target_document_id, relationship_type)
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Document Editor for creating and editing documents
    - Record Editor for document metadata
    - ListView for document inventory
    - Relationship Mapper for document relationship visualization

#### Document Approval Workflow
- **Status**: Mandatory
- **Triggers**:
  - New document creation
  - Document revision
  - Periodic document review
  - Policy changes
  - Regulatory updates requiring document changes
- **Approval Requirements**:
  - Document owner approval
  - Subject matter expert review
  - Management approval for policies
  - Legal review for sensitive documents
- **Data Model Requirements**:
  - `document_approvals` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `document_version_id`: Foreign key to document_versions
    - `approver_id`: Foreign key to users
    - `approval_status`: ENUM('pending', 'approved', 'rejected', 'deferred')
    - `comments`: Approval comments
    - `approval_date`: Date of approval action
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `document_approval_workflows` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `document_id`: Foreign key to documents
    - `workflow_name`: Name of approval workflow
    - `current_step`: Current approval step number
    - `status`: ENUM('not_started', 'in_progress', 'completed', 'cancelled')
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `document_approval_steps` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `workflow_id`: Foreign key to document_approval_workflows
    - `step_number`: Order of step in workflow
    - `step_name`: Name of approval step
    - `approver_role_id`: Foreign key to roles
    - `approver_id`: Foreign key to users (optional)
    - `status`: ENUM('pending', 'in_progress', 'completed', 'skipped')
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

### 4. Multi-Standard Strategy Workflow

#### Framework Mapping and Statement of Applicability
- **Status**: Mandatory
- **Triggers**:
  - Multi-framework compliance requirements
  - New framework adoption
  - Framework version updates
  - Scope changes requiring control reassessment
  - Annual SoA review
- **Approval Requirements**:
  - Compliance manager approval
  - CISO/Security Manager sign-off
  - Business owner acceptance
  - External validation for certification
- **Data Model Requirements**:
  - `control_frameworks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `name`: Name of framework
    - `version`: Version of framework
    - `description`: Description of framework
    - `publisher`: Publisher/authority for framework
    - `type`: ENUM('security', 'privacy', 'regulatory', 'industry', 'internal')
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `framework_controls` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `framework_id`: Foreign key to control_frameworks
    - `control_id`: Control identifier (e.g., 'A.5.1.1')
    - `title`: Control title
    - `description`: Control description
    - `parent_id`: Foreign key to framework_controls (self-reference)
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `statements_of_applicability` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `name`: SoA name
    - `framework_id`: Foreign key to control_frameworks
    - `version`: Version of SoA
    - `effective_date`: Date SoA becomes effective
    - `status`: ENUM('draft', 'active', 'archived')
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `soa_control_inclusions` table (junction table):
    - `soa_id`: UUID REFERENCES statements_of_applicability(id)
    - `control_id`: UUID REFERENCES framework_controls(id)
    - `is_applicable`: Boolean indicating if control is applicable
    - `justification`: Justification for inclusion/exclusion
    - PRIMARY KEY (soa_id, control_id)
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `framework_control_mappings` table (junction table):
    - `source_control_id`: UUID REFERENCES framework_controls(id)
    - `target_control_id`: UUID REFERENCES framework_controls(id)
    - `mapping_type`: ENUM('equivalent', 'partial', 'related')
    - `mapping_strength`: ENUM('strong', 'medium', 'weak')
    - `mapping_notes`: Notes about mapping relationship
    - PRIMARY KEY (source_control_id, target_control_id)
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Record Editor for framework mapping
    - ListView for framework comparison
    - Relationship Mapper for visualizing control relationships
    - Document Editor for mapping documentation
    - Tree View for framework hierarchy visualization

## UI Management Improvements

### 1. ListView Template System

#### ListView Template Configuration
- **Status**: Core Feature
- **Triggers**:
  - System initialization
  - New content type addition
  - UI customization requirements
  - Specialized view requirements
- **Approval Requirements**:
  - Admin approval for system templates
  - User customization within permissions
- **Data Model Requirements**:
  - `listview_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `name`: Template name
    - `description`: Template description
    - `content_type`: Content type the template applies to
    - `is_default`: Boolean indicating if this is the default template
    - `is_system`: Boolean indicating if this is a system template
    - `display_config`: JSONB configuration for display options
    - `filter_config`: JSONB configuration for available filters
    - `permission_config`: JSONB configuration for required permissions
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_display_config CHECK (jsonb_typeof(display_config) = 'object')
    - CONSTRAINT valid_filter_config CHECK (jsonb_typeof(filter_config) = 'object')
    - UNIQUE(content_type, organization_id, is_default) WHERE is_default = true
  
  - `listview_template_versions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_id`: Foreign key to listview_templates
    - `version_number`: Integer version number
    - `template_config`: JSONB containing full template configuration
    - `created_by`: Foreign key to users
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - UNIQUE(template_id, version_number)
  
  - `listview_user_preferences` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: Foreign key to users
    - `content_type`: Content type preference applies to
    - `template_id`: Foreign key to listview_templates
    - `filter_state`: JSONB with user's saved filter state
    - `column_config`: JSONB with user's column preferences
    - `sort_config`: JSONB with user's sort preferences
    - `organization_id`: Foreign key to organizations
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(user_id, content_type)
  
  - **UI Integration**:
    - ListView Template Configurator for template management
    - User Preference Panel for saving personal settings
    - ListView for displaying configured data
    - Permission Management for template access control

## Audit and Tracking Improvements

### 1. Tiered Audit Trail System

#### Comprehensive Audit Trail
- **Status**: Mandatory
- **Triggers**:
  - All data modifications
  - Critical status changes
  - Security-relevant actions
  - Compliance-related changes
- **Approval Requirements**:
  - Automated implementation
  - No user approval required
- **Data Model Requirements**:
  - `critical_audit_trails` table (partitioned by time):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: Type of entity being audited
    - `entity_id`: UUID of entity being audited
    - `action_type`: ENUM('CREATE', 'UPDATE', 'DELETE', 'SOFT_DELETE', 'RESTORE', 'STATUS_CHANGE', 'APPROVAL')
    - `organization_id`: Foreign key to organizations
    - `performed_by`: Foreign key to users
    - `performed_at`: TIMESTAMPTZ DEFAULT NOW()
    - `previous_values`: JSONB containing previous values
    - `new_values`: JSONB containing new values
    - `context`: JSONB containing additional context
    - CONSTRAINT valid_previous_values CHECK (jsonb_typeof(previous_values) = 'object')
    - CONSTRAINT valid_new_values CHECK (jsonb_typeof(new_values) = 'object')
    - CONSTRAINT valid_context CHECK (jsonb_typeof(context) = 'object')
    - PARTITION BY RANGE (performed_at)
  
  - `routine_audit_logs` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: Type of entity being audited
    - `entity_id`: UUID of entity being audited
    - `action_type`: ENUM('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'IMPORT')
    - `organization_id`: Foreign key to organizations
    - `performed_by`: Foreign key to users
    - `performed_at`: TIMESTAMPTZ DEFAULT NOW()
    - `summary`: Text summary of action
    - `details`: JSONB containing action details
  
  - **Functions and Procedures**:
    - `determine_audit_tier`: Function to determine audit tier based on entity type and action
    - `create_audit_partitions`: Function to create time-based partitions for audit trails
    - `archive_old_audit_data`: Function to archive old audit data to cold storage
  
  - **UI Integration**:
    - Audit Trail Viewer for compliance evidence
    - Audit Search Interface for finding specific audit records
    - Activity Timeline for user activity visualization
    - Admin Dashboard for audit system health monitoring

### 5. Incident Management Workflow

#### SLA Management for Incidents
- **Status**: Enhancement
- **Triggers**:
  - Organization SLA policy creation or update
  - Incident classification changes
  - Response time requirements changes
  - Regulatory requirement updates
  - Customer-specific SLA needs
- **Approval Requirements**:
  - Management approval for organization-wide SLAs
  - Compliance review for regulatory SLAs
  - Customer approval for custom SLAs
  - Security team validation of incident response times
- **Data Model Requirements**:
  - `sla_policies` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `name`: TEXT NOT NULL
    - `description`: TEXT
    - `is_active`: BOOLEAN DEFAULT true
    - `effective_date`: TIMESTAMPTZ DEFAULT NOW()
    - `expiration_date`: TIMESTAMPTZ -- optional
    - `version`: INTEGER DEFAULT 1
    - `is_default`: BOOLEAN DEFAULT false
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `sla_definitions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `policy_id`: Foreign key to sla_policies
    - `incident_type_id`: UUID REFERENCES lookup_options(id) -- incident type
    - `severity`: risk_level_enum -- incident severity level
    - `priority`: priority_enum -- incident priority level
    - `response_time_minutes`: INTEGER -- time to initial response
    - `resolution_time_minutes`: INTEGER -- time to resolution
    - `escalation_time_minutes`: INTEGER -- time before escalation
    - `business_hours_only`: BOOLEAN DEFAULT false -- whether SLA applies only during business hours
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(policy_id, incident_type_id, severity, priority)
  
  - `business_hours` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `name`: TEXT NOT NULL
    - `description`: TEXT
    - `monday_start`: TIME,
    - `monday_end`: TIME,
    - `tuesday_start`: TIME,
    - `tuesday_end`: TIME,
    - `wednesday_start`: TIME,
    - `wednesday_end`: TIME,
    - `thursday_start`: TIME,
    - `thursday_end`: TIME,
    - `friday_start`: TIME,
    - `friday_end`: TIME,
    - `saturday_start`: TIME,
    - `saturday_end`: TIME,
    - `sunday_start`: TIME,
    - `sunday_end`: TIME,
    - `timezone`: TEXT NOT NULL -- IANA timezone
    - `holidays`: JSONB -- array of holiday dates
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_holidays CHECK (jsonb_typeof(holidays) = 'array')
  
  - `sla_business_hours` table (junction table):
    - `sla_policy_id`: UUID REFERENCES sla_policies(id) ON DELETE CASCADE
    - `business_hours_id`: UUID REFERENCES business_hours(id) ON DELETE RESTRICT
    - PRIMARY KEY (sla_policy_id, business_hours_id)
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`: Audit fields
  
  - `incident_slas` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `incident_id`: Foreign key to incidents
    - `sla_definition_id`: Foreign key to sla_definitions
    - `response_deadline`: TIMESTAMPTZ -- calculated deadline for response
    - `resolution_deadline`: TIMESTAMPTZ -- calculated deadline for resolution
    - `escalation_deadline`: TIMESTAMPTZ -- calculated deadline for escalation
    - `response_actual`: TIMESTAMPTZ -- most recent actual response time
    - `resolution_actual`: TIMESTAMPTZ -- most recent actual resolution time
    - `response_status`: ENUM('pending', 'met', 'breached')
    - `resolution_status`: ENUM('pending', 'met', 'breached')
    - `paused_at`: TIMESTAMPTZ -- if SLA timer is paused
    - `pause_reason`: TEXT -- reason for pause
    - `total_pause_minutes`: INTEGER DEFAULT 0 -- accumulated pause time
    - `actuals_history`: JSONB DEFAULT '[]' -- history of all response/resolution time changes
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_actuals_history CHECK (jsonb_typeof(actuals_history) = 'array')
  
  - `sla_notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `sla_policy_id`: Foreign key to sla_policies
    - `notification_type`: ENUM('approaching_response', 'approaching_resolution', 'approaching_escalation', 'breached_response', 'breached_resolution')
    - `threshold_minutes`: INTEGER -- minutes before deadline to notify
    - `notification_template_id`: Foreign key to notification_templates
    - `recipient_roles`: JSONB -- array of role IDs
    - `recipient_users`: JSONB -- array of user IDs
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_recipient_roles CHECK (jsonb_typeof(recipient_roles) = 'array')
    - CONSTRAINT valid_recipient_users CHECK (jsonb_typeof(recipient_users) = 'array')
  
  - `sla_escalations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `sla_policy_id`: Foreign key to sla_policies
    - `escalation_level`: INTEGER -- level of escalation (1, 2, 3, etc.)
    - `trigger_type`: ENUM('response_overdue', 'resolution_overdue', 'approaching_response', 'approaching_resolution')
    - `threshold_minutes`: INTEGER -- minutes before/after deadline to escalate
    - `escalation_roles`: JSONB -- array of role IDs to escalate to
    - `escalation_users`: JSONB -- array of user IDs to escalate to
    - `notification_template_id`: Foreign key to notification_templates
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_escalation_roles CHECK (jsonb_typeof(escalation_roles) = 'array')
    - CONSTRAINT valid_escalation_users CHECK (jsonb_typeof(escalation_users) = 'array')
  
  - `sla_events` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `incident_sla_id`: Foreign key to incident_slas
    - `event_type`: ENUM('created', 'responded', 'resolved', 'paused', 'resumed', 'breached', 'escalated', 'recalculated')
    - `event_time`: TIMESTAMPTZ DEFAULT NOW()
    - `event_user_id`: Foreign key to users
    - `details`: TEXT
    - `old_values`: JSONB
    - `new_values`: JSONB
    - `organization_id`: Foreign key to organizations
    - CONSTRAINT valid_old_values CHECK (jsonb_typeof(old_values) = 'object')
    - CONSTRAINT valid_new_values CHECK (jsonb_typeof(new_values) = 'object')
  
  - **UI Integration**:
    - **SLA Policy Manager** for SLA policy configuration
    - **SLA Definition Editor** for setting up response times
    - **Business Hours Configuration** for defining working hours
    - **Incident SLA Dashboard** for monitoring SLA compliance
    - **SLA Reports** for analyzing SLA performance

### 6. Supplier Relationship Management Workflow

#### Supplier Assessment and Monitoring
- **Status**: Mandatory
- **Triggers**:
  - New supplier onboarding
  - Periodic supplier review
  - Change in supplier services
  - Security incident involving supplier
  - Contract renewal
- **Approval Requirements**:
  - Procurement approval of supplier assessment
  - Security team validation of security assessment
  - Legal review of contractual requirements
  - Management approval for critical suppliers
- **Data Model Requirements**:
  - `suppliers` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `organization_id`: Foreign key to organizations
    - `supplier_name`: Name of supplier
    - `supplier_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic types
    - `description`: Description of supplier
    - `status`: record_status_enum DEFAULT 'active'
    - `criticality`: risk_level_enum -- Using platform-wide risk level enum
    - `data_access_level`: data_classification_level_enum -- Using platform-wide data classification enum
    - `contract_expiry_date`: Date of contract expiration
    - `contact_name`: Primary contact name
    - `contact_email`: Primary contact email
    - `contact_phone`: Primary contact phone
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
  
  - `supplier_assessments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `supplier_id`: Foreign key to suppliers
    - `assessment_type`: ENUM('initial', 'periodic', 'incident_response', 'contract_renewal')
    - `assessment_date`: Date of assessment
    - `assessor_id`: Foreign key to users
    - `status`: ENUM('planned', 'in_progress', 'completed', 'cancelled')
    - `risk_level`: risk_level_enum
    - `next_assessment_date`: Date of next scheduled assessment
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `supplier_services` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `supplier_id`: Foreign key to suppliers
    - `service_name`: Name of service
    - `service_description`: Description of service
    - `criticality`: ENUM('critical', 'high', 'medium', 'low')
    - `data_involved`: JSON array of data types involved
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `supplier_contracts` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `supplier_id`: Foreign key to suppliers
    - `contract_name`: Name of contract
    - `contract_type`: ENUM('service', 'product', 'consulting', 'support', 'other')
    - `start_date`: Contract start date
    - `end_date`: Contract end date
    - `renewal_type`: ENUM('automatic', 'manual', 'none')
    - `security_requirements`: Text describing security requirements
    - `data_protection_requirements`: Text describing data protection requirements
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - **Record Editor** for supplier management
    - **ListView** for supplier inventory
    - **Timeline View** for contract and assessment scheduling
    - **Document Editor** for contract management

### 9. Role-Based Access Control and User Management

#### User and Role Management
- **Status**: Core Feature
- **Triggers**:
  - User onboarding
  - Role assignment changes
  - Permission updates
  - Organizational structure changes
  - Access requirement changes
- **Approval Requirements**:
  - Admin approval for role creation
  - Manager approval for role assignment
  - Security review for privileged access
  - Compliance review for segregation of duties
- **Data Model Requirements**:
  - `users` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `email`: TEXT UNIQUE NOT NULL
    - `first_name`: TEXT
    - `last_name`: TEXT
    - `job_title`: TEXT
    - `department`: TEXT
    - `phone`: TEXT
    - `status`: ENUM('active', 'inactive', 'pending', 'locked', 'suspended')
    - `last_login`: TIMESTAMPTZ
    - `organization_id`: Foreign key to organizations
    - `manager_id`: Self-reference to manager user
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `settings`: JSONB DEFAULT '{}'
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_settings CHECK (jsonb_typeof(settings) = 'object')
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
  
  - `roles` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `name`: TEXT NOT NULL
    - `description`: TEXT
    - `role_type`: ENUM('system', 'custom', 'organizational', 'temporary')
    - `is_system`: BOOLEAN DEFAULT false
    - `is_admin`: BOOLEAN DEFAULT false
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
  
  - `user_role_assignments` table (junction table):
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `role_id`: UUID REFERENCES roles(id) ON DELETE CASCADE
    - PRIMARY KEY (user_id, role_id)
    - `assignment_start`: TIMESTAMPTZ DEFAULT NOW()
    - `assignment_end`: TIMESTAMPTZ -- for temporary assignments
    - `assignment_reason`: TEXT
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `is_active`: BOOLEAN DEFAULT true
  
#### Permission Management Automation

To streamline the process of maintaining the permissions system as new features are added, we'll implement functions to automatically register and update permissions based on configuration:

```sql
-- Function to register a new permission
CREATE OR REPLACE FUNCTION register_permission(
    p_code TEXT,
    p_name TEXT,
    p_description TEXT DEFAULT NULL,
    p_category TEXT DEFAULT NULL
) RETURNS UUID AS $func$
DECLARE
    v_permission_id UUID;
BEGIN
    -- Check if permission already exists
    SELECT id INTO v_permission_id
    FROM permissions
    WHERE code = p_code;
    
    IF v_permission_id IS NULL THEN
        -- Insert new permission
        INSERT INTO permissions (
            code, 
            name, 
            description, 
            category,
            is_system,
            created_at,
            updated_at
        ) VALUES (
            p_code,
            p_name,
            p_description,
            p_category,
            TRUE,
            NOW(),
            NOW()
        ) RETURNING id INTO v_permission_id;
        
        RAISE NOTICE 'Created new permission: %', p_code;
    ELSE
        -- Update existing permission
        UPDATE permissions
        SET 
            name = p_name,
            description = COALESCE(p_description, description),
            category = COALESCE(p_category, category),
            updated_at = NOW()
        WHERE id = v_permission_id;
        
        RAISE NOTICE 'Updated existing permission: %', p_code;
    END IF;
    
    RETURN v_permission_id;
END;
$func$ LANGUAGE plpgsql;

-- Function to register multiple permissions from a JSONB configuration
CREATE OR REPLACE FUNCTION register_permissions_from_config(config JSONB) 
RETURNS VOID AS $func$
DECLARE
    permission_item JSONB;
BEGIN
    -- Validate that config is an array
    IF jsonb_typeof(config) != 'array' THEN
        RAISE EXCEPTION 'Configuration must be a JSONB array';
    END IF;
    
    -- Process each permission in the array
    FOR permission_item IN SELECT jsonb_array_elements(config) LOOP
        PERFORM register_permission(
            permission_item->>'code',
            permission_item->>'name',
            permission_item->>'description',
            permission_item->>'category'
        );
    END LOOP;
END;
$func$ LANGUAGE plpgsql;

-- Example migration script that uses the function
-- This would be part of your schema migration process
DO $migration$
BEGIN
    -- Register core permissions from configuration
    PERFORM register_permissions_from_config('[
        {
            "code": "user.view",
            "name": "View Users",
            "description": "View user accounts and profiles",
            "category": "User Management"
        },
        {
            "code": "user.create",
            "name": "Create Users",
            "description": "Create new user accounts",
            "category": "User Management"
        },
        {
            "code": "user.edit",
            "name": "Edit Users",
            "description": "Edit existing user accounts",
            "category": "User Management"
        },
        {
            "code": "user.delete",
            "name": "Delete Users",
            "description": "Delete user accounts",
            "category": "User Management"
        },
        {
            "code": "role.view",
            "name": "View Roles",
            "description": "View roles and permissions",
            "category": "Role Management"
        }
        /* Additional permissions would be defined here */
    ]'::jsonb);
    
    -- You can also assign default permissions to system roles
    -- Example: Assign user management permissions to Admin role
    -- This would use a similar helper function
END;
$migration$;
```

This approach allows for:

1. **Declarative Permission Management**: Permissions are defined in a structured JSONB configuration
2. **Idempotent Updates**: The function safely handles both new permissions and updates to existing ones
3. **Automated Migration**: New permissions can be added as part of regular database migrations
4. **Categorization**: Permissions are organized by functional category
5. **Audit Trail**: All permission changes are tracked with timestamps

When developing new features, developers would:
1. Add new permission entries to the configuration file
2. Run the migration script as part of the deployment process
3. Update role assignments as needed for the new permissions

This significantly reduces the maintenance burden of keeping permissions in sync with new features and ensures consistency in how permissions are defined across the application.
  
  - **UI Integration**:
    - **User Management Screen** for user administration
    - **Role Management Screen** for role configuration
    - **Permission Matrix** for permission assignment
    - **User Profile** for user details and settings

#### Granular Access Control
- **Status**: Enhancement
- **Triggers**:
  - Access policy updates
  - Data classification changes
  - Regulatory requirement changes
  - Object-level access needs
  - Contextual access requirements
- **Data Model Requirements**:
  - `access_policies` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `name`: TEXT NOT NULL
    - `description`: TEXT
    - `policy_type`: ENUM('object', 'field', 'function', 'data', 'context')
    - `organization_id`: Foreign key to organizations
    - `is_system`: BOOLEAN DEFAULT false
    - `is_active`: BOOLEAN DEFAULT true
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
  
  - `access_rules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `policy_id`: Foreign key to access_policies
    - `rule_name`: TEXT NOT NULL
    - `rule_description`: TEXT
    - `object_type`: TEXT -- table or object type this applies to
    - `field_name`: TEXT -- specific field if applicable
    - `action`: ENUM('create', 'read', 'update', 'delete', 'approve', 'execute', 'export')
    - `condition`: JSONB -- conditional logic for when rule applies
    - `effect`: ENUM('allow', 'deny')
    - `priority`: INTEGER -- for conflict resolution
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_condition CHECK (jsonb_typeof(condition) = 'object')
  
  - `access_policy_assignments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `policy_id`: Foreign key to access_policies
    - `assignee_type`: ENUM('role', 'user', 'group', 'organization')
    - `assignee_id`: UUID -- ID of role, user, group, or organization
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `data_classification_levels` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `name`: TEXT NOT NULL
    - `description`: TEXT
    - `sensitivity`: INTEGER -- numeric level of sensitivity
    - `color_code`: TEXT -- for visual representation
    - `handling_requirements`: TEXT
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `object_classifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `object_type`: TEXT NOT NULL -- table or object type
    - `object_id`: UUID NOT NULL -- ID of the classified object
    - `classification_id`: Foreign key to data_classification_levels
    - `justification`: TEXT
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(object_type, object_id, organization_id)
  
  - **UI Integration**:
    - **Access Policy Manager** for policy configuration
    - **Access Rule Editor** for rule creation
    - **Data Classification Manager** for classification levels
    - **Object Classification UI** for applying classifications
    - **Access Audit Dashboard** for access review

#### Authentication and Session Management
- **Status**: Core Security Feature
- **Triggers**:
  - User login
  - Session timeout
  - Authentication policy changes
  - Multi-factor requirements
  - Security incident response
- **Data Model Requirements**:
  - `authentication_settings` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `organization_id`: Foreign key to organizations
    - `password_policy`: JSONB -- password requirements and settings
    - `mfa_required`: BOOLEAN DEFAULT false
    - `mfa_methods`: JSONB ARRAY of allowed MFA methods
    - `session_timeout_minutes`: INTEGER DEFAULT 60
    - `max_login_attempts`: INTEGER DEFAULT 5
    - `lockout_duration_minutes`: INTEGER DEFAULT 30
    - `ip_restriction_enabled`: BOOLEAN DEFAULT false
    - `allowed_ip_ranges`: JSONB ARRAY of allowed IP ranges
    - `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_password_policy CHECK (jsonb_typeof(password_policy) = 'object')
    - CONSTRAINT valid_mfa_methods CHECK (jsonb_typeof(mfa_methods) = 'array')
    - CONSTRAINT valid_allowed_ip_ranges CHECK (jsonb_typeof(allowed_ip_ranges) = 'array')
  
  - `user_sessions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: Foreign key to users
    - `session_start`: TIMESTAMPTZ DEFAULT NOW()
    - `session_last_active`: TIMESTAMPTZ DEFAULT NOW()
    - `session_expiry`: TIMESTAMPTZ
    - `ip_address`: TEXT
    - `user_agent`: TEXT
    - `device_info`: JSONB
    - `location_info`: JSONB
    - `session_status`: ENUM('active', 'expired', 'terminated')
    - `organization_id`: Foreign key to organizations
    - CONSTRAINT valid_device_info CHECK (jsonb_typeof(device_info) = 'object')
    - CONSTRAINT valid_location_info CHECK (jsonb_typeof(location_info) = 'object')
  
  - `login_attempts` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: Foreign key to users
    - `email`: TEXT -- may not match a user if attempt is for non-existent user
    - `attempt_time`: TIMESTAMPTZ DEFAULT NOW()
    - `ip_address`: TEXT
    - `user_agent`: TEXT
    - `success`: BOOLEAN
    - `failure_reason`: TEXT -- if failed
    - `organization_id`: Foreign key to organizations
  
  - `mfa_enrollments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: Foreign key to users
    - `mfa_type`: ENUM('totp', 'sms', 'email', 'hardware_token', 'push_notification')
    - `identifier`: TEXT -- email, phone, or device identifier
    - `is_primary`: BOOLEAN DEFAULT false
    - `is_active`: BOOLEAN DEFAULT true
    - `enrollment_date`: TIMESTAMPTZ DEFAULT NOW()
    - `last_used`: TIMESTAMPTZ
    - `organization_id`: Foreign key to organizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - **Login Screen** for authentication
    - **MFA Configuration** for multi-factor setup
    - **Security Settings** for authentication policy
    - **Session Management** for active session control
    - **Login History** for authentication audit
    - 

## New Sections Below 


# General Metrics Framework - Database Schema

**File Path**: `arioncomply-v1/docs/ApplicationDatabase/general_metrics_framework.md`

## Overview

This document defines the database schema for a comprehensive metrics framework that provides configurable analytics, KPI tracking, and dashboard capabilities across all compliance domains in the ArionComply platform. The design follows established database principles while providing flexibility for various organizational metrics requirements including compliance scorecards, performance monitoring, and trend analysis.

## General Metrics Framework Workflow

### 1. Core Metrics Definition System

#### Configurable Metrics Management
- **Status**: Core Feature
- **Triggers**:
  - Organizational KPI requirements
  - Compliance scorecard needs
  - Performance monitoring setup
  - Dashboard configuration
  - Regulatory reporting metrics
- **Approval Requirements**:
  - Metrics definition approval
  - Threshold setting authorization
  - Dashboard publication approval
  - Executive scorecard sign-off
- **Data Model Requirements**:
  - `metric_definitions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_code`: TEXT UNIQUE NOT NULL -- Short identifier (e.g., 'INC_MTTR')
    - `metric_name`: TEXT NOT NULL
    - `description`: TEXT NOT NULL
    - `metric_category_id`: UUID REFERENCES lookup_options(id) -- Dynamic metric categories
    - `metric_type`: ENUM('quantitative', 'qualitative', 'percentage', 'ratio', 'count', 'duration', 'currency', 'score')
    - `measurement_unit`: TEXT -- hours, days, percentage, dollars, etc.
    - `data_source_type`: ENUM('single_table', 'multi_table', 'calculated', 'manual_entry', 'external_api', 'formula')
    - `calculation_method`: TEXT NOT NULL -- How to calculate this metric
    - `calculation_formula`: JSONB DEFAULT '{}' -- Structured formula definition
    - `source_tables`: TEXT[] -- Tables involved in calculation
    - `source_fields`: JSONB DEFAULT '{}' -- Specific fields used
    - `aggregation_method`: ENUM('sum', 'average', 'median', 'count', 'min', 'max', 'distinct_count', 'percentage', 'custom')
    - `time_dimension`: ENUM('real_time', 'daily', 'weekly', 'monthly', 'quarterly', 'annually', 'point_in_time')
    - `is_cumulative`: BOOLEAN DEFAULT false
    - `baseline_value`: DECIMAL(15,4)
    - `target_value`: DECIMAL(15,4)
    - `target_operator`: ENUM('greater_than', 'less_than', 'equal_to', 'between', 'not_equal')
    - `good_threshold`: DECIMAL(15,4)
    - `warning_threshold`: DECIMAL(15,4)
    - `critical_threshold`: DECIMAL(15,4)
    - `trend_direction`: ENUM('higher_better', 'lower_better', 'target_better', 'stable_better')
    - `is_public`: BOOLEAN DEFAULT false -- Can be shared externally
    - `requires_approval`: BOOLEAN DEFAULT false
    - `approval_role_id`: UUID REFERENCES roles(id)
    - `refresh_frequency`: ENUM('real_time', 'hourly', 'daily', 'weekly', 'monthly', 'on_demand')
    - `last_calculated`: TIMESTAMPTZ
    - `is_active`: BOOLEAN DEFAULT true
    - `compliance_frameworks`: TEXT[] -- Which frameworks this supports
    - `regulatory_significance`: ENUM('none', 'low', 'medium', 'high', 'critical')
    - `owner_id`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_calculation_formula CHECK (jsonb_typeof(calculation_formula) = 'object')
    - CONSTRAINT valid_source_fields CHECK (jsonb_typeof(source_fields) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - INDEX idx_metric_definitions_category (metric_category_id, is_active) WHERE is_active = true
    - INDEX idx_metric_definitions_frameworks USING GIN (compliance_frameworks)
  
  - `metric_collection_rules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_definition_id`: UUID REFERENCES metric_definitions(id) ON DELETE CASCADE
    - `rule_name`: TEXT NOT NULL
    - `collection_trigger`: ENUM('schedule', 'event', 'manual', 'api_call', 'data_change')
    - `trigger_conditions`: JSONB DEFAULT '{}' -- When to collect this metric
    - `collection_query`: TEXT -- SQL query for data collection
    - `collection_parameters`: JSONB DEFAULT '{}' -- Query parameters
    - `validation_rules`: JSONB DEFAULT '{}' -- Data validation requirements
    - `transformation_rules`: JSONB DEFAULT '{}' -- Data transformation logic
    - `error_handling`: ENUM('fail', 'skip', 'default_value', 'alert')
    - `default_value`: DECIMAL(15,4)
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_trigger_conditions CHECK (jsonb_typeof(trigger_conditions) = 'object')
    - CONSTRAINT valid_collection_parameters CHECK (jsonb_typeof(collection_parameters) = 'object')
    - CONSTRAINT valid_validation_rules CHECK (jsonb_typeof(validation_rules) = 'object')
    - CONSTRAINT valid_transformation_rules CHECK (jsonb_typeof(transformation_rules) = 'object')

### 2. Metrics Data Collection and Storage

#### Metrics Data Management
- **Status**: Core Feature
- **Triggers**:
  - Scheduled collection cycles
  - Event-driven collection
  - Manual data entry
  - External system integration
- **Data Model Requirements**:
  - `metric_calculations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_definition_id`: UUID REFERENCES metric_definitions(id) ON DELETE CASCADE
    - `calculation_date`: DATE NOT NULL
    - `calculation_timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `period_start`: TIMESTAMPTZ -- Start of measurement period
    - `period_end`: TIMESTAMPTZ -- End of measurement period
    - `raw_value`: DECIMAL(15,4) NOT NULL
    - `normalized_value`: DECIMAL(15,4) -- Standardized value for comparison
    - `percentage_value`: DECIMAL(5,2) -- Percentage representation if applicable
    - `status_indicator`: ENUM('good', 'warning', 'critical', 'unknown') -- Based on thresholds
    - `calculation_method_used`: TEXT
    - `data_sources_used`: JSONB DEFAULT '{}' -- What data contributed to this calculation
    - `sample_size`: INTEGER -- Number of records in calculation
    - `confidence_level`: ENUM('high', 'medium', 'low') DEFAULT 'high'
    - `calculation_duration_ms`: INTEGER -- How long calculation took
    - `notes`: TEXT
    - `is_estimated`: BOOLEAN DEFAULT false
    - `estimated_accuracy`: DECIMAL(5,2) -- Percentage accuracy if estimated
    - `manual_override`: BOOLEAN DEFAULT false
    - `override_reason`: TEXT
    - `override_by`: UUID REFERENCES users(id)
    - `approved_for_reporting`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_data_sources CHECK (jsonb_typeof(data_sources_used) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - CONSTRAINT valid_confidence_accuracy CHECK (
        confidence_level != 'low' OR estimated_accuracy IS NOT NULL
    )
    - UNIQUE(metric_definition_id, calculation_date, period_start, period_end)
    - INDEX idx_metric_calculations_date (metric_definition_id, calculation_date DESC)
    - INDEX idx_metric_calculations_status (status_indicator, calculation_date)
  
  - `metric_snapshots` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `snapshot_name`: TEXT NOT NULL
    - `snapshot_date`: TIMESTAMPTZ DEFAULT NOW()
    - `snapshot_type`: ENUM('scheduled', 'ad_hoc', 'milestone', 'reporting_period', 'compliance_review')
    - `metrics_included`: UUID[] -- Array of metric definition IDs
    - `snapshot_data`: JSONB NOT NULL -- Complete metrics data at point in time
    - `comparison_baseline`: UUID REFERENCES metric_snapshots(id) -- Compare against this snapshot
    - `summary_statistics`: JSONB DEFAULT '{}' -- Aggregated summary data
    - `trend_analysis`: JSONB DEFAULT '{}' -- Trend information
    - `is_locked`: BOOLEAN DEFAULT false -- Prevent modification
    - `purpose`: TEXT NOT NULL -- Why this snapshot was taken
    - `audience`: ENUM('internal', 'management', 'board', 'regulatory', 'public')
    - `retention_period_months`: INTEGER DEFAULT 84 -- 7 years default
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_snapshot_data CHECK (jsonb_typeof(snapshot_data) = 'object')
    - CONSTRAINT valid_summary_statistics CHECK (jsonb_typeof(summary_statistics) = 'object')
    - CONSTRAINT valid_trend_analysis CHECK (jsonb_typeof(trend_analysis) = 'object')
    - INDEX idx_metric_snapshots_date (snapshot_date DESC)
    - INDEX idx_metric_snapshots_type (snapshot_type, snapshot_date DESC)

### 3. Analytics Dashboard Framework

#### Dashboard Configuration
- **Status**: Core Feature
- **Triggers**:
  - Dashboard creation requests
  - KPI monitoring setup
  - Executive reporting needs
  - Compliance scorecards
- **Data Model Requirements**:
  - `analytics_dashboards` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `dashboard_name`: TEXT NOT NULL
    - `description`: TEXT
    - `dashboard_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic dashboard types
    - `audience_level_id`: UUID REFERENCES lookup_options(id) -- Dynamic audience levels
    - `refresh_frequency`: ENUM('real_time', 'hourly', 'daily', 'weekly', 'monthly', 'on_demand')
    - `auto_refresh_enabled`: BOOLEAN DEFAULT true
    - `layout_configuration`: JSONB NOT NULL -- Dashboard layout and structure
    - `filter_configuration`: JSONB DEFAULT '{}' -- Available filters
    - `drill_down_configuration`: JSONB DEFAULT '{}' -- Drill-down capabilities
    - `export_configuration`: JSONB DEFAULT '{}' -- Export options
    - `access_permissions`: JSONB DEFAULT '{}' -- Who can view/edit
    - `is_public`: BOOLEAN DEFAULT false
    - `is_default`: BOOLEAN DEFAULT false -- Default dashboard for audience
    - `sort_order`: INTEGER DEFAULT 0
    - `last_viewed`: TIMESTAMPTZ
    - `view_count`: INTEGER DEFAULT 0
    - `is_active`: BOOLEAN DEFAULT true
    - `tags`: TEXT[] -- Searchable tags
    - `compliance_frameworks`: TEXT[] -- Which frameworks this supports
    - `owner_id`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_layout_configuration CHECK (jsonb_typeof(layout_configuration) = 'object')
    - CONSTRAINT valid_filter_configuration CHECK (jsonb_typeof(filter_configuration) = 'object')
    - CONSTRAINT valid_drill_down_configuration CHECK (jsonb_typeof(drill_down_configuration) = 'object')
    - CONSTRAINT valid_export_configuration CHECK (jsonb_typeof(export_configuration) = 'object')
    - CONSTRAINT valid_access_permissions CHECK (jsonb_typeof(access_permissions) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - INDEX idx_analytics_dashboards_audience (audience_level_id, is_active) WHERE is_active = true
    - INDEX idx_analytics_dashboards_tags USING GIN (tags)
  
  - `dashboard_widgets` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `dashboard_id`: UUID REFERENCES analytics_dashboards(id) ON DELETE CASCADE
    - `widget_name`: TEXT NOT NULL
    - `widget_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic widget types
    - `metric_definition_id`: UUID REFERENCES metric_definitions(id)
    - `position_x`: INTEGER NOT NULL
    - `position_y`: INTEGER NOT NULL
    - `width`: INTEGER NOT NULL
    - `height`: INTEGER NOT NULL
    - `visualization_config`: JSONB NOT NULL -- Chart configuration, colors, etc.
    - `data_filters`: JSONB DEFAULT '{}' -- Widget-specific filters
    - `time_range_config`: JSONB DEFAULT '{}' -- Time range settings
    - `threshold_display`: JSONB DEFAULT '{}' -- How to show thresholds
    - `drill_down_enabled`: BOOLEAN DEFAULT false
    - `drill_down_target`: TEXT -- Where to drill down to
    - `refresh_interval_seconds`: INTEGER -- Widget-specific refresh
    - `is_visible`: BOOLEAN DEFAULT true
    - `conditional_visibility`: JSONB DEFAULT '{}' -- When to show/hide widget
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_visualization_config CHECK (jsonb_typeof(visualization_config) = 'object')
    - CONSTRAINT valid_data_filters CHECK (jsonb_typeof(data_filters) = 'object')
    - CONSTRAINT valid_time_range_config CHECK (jsonb_typeof(time_range_config) = 'object')
    - CONSTRAINT valid_threshold_display CHECK (jsonb_typeof(threshold_display) = 'object')
    - CONSTRAINT valid_conditional_visibility CHECK (jsonb_typeof(conditional_visibility) = 'object')
    - INDEX idx_dashboard_widgets_position (dashboard_id, position_x, position_y)

### 4. KPI and Scorecard Management

#### Key Performance Indicators
- **Status**: Core Feature
- **Triggers**:
  - Executive reporting requirements
  - Compliance scorecard setup
  - Performance monitoring
  - Board reporting
- **Data Model Requirements**:
  - `kpi_scorecards` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `scorecard_name`: TEXT NOT NULL
    - `description`: TEXT
    - `scorecard_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic scorecard types
    - `scorecard_purpose`: TEXT NOT NULL
    - `target_audience_id`: UUID REFERENCES lookup_options(id) -- Dynamic target audiences
    - `reporting_frequency`: ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'on_demand')
    - `overall_scoring_method`: ENUM('weighted_average', 'simple_average', 'weighted_sum', 'custom')
    - `scoring_formula`: JSONB DEFAULT '{}' -- Custom scoring logic
    - `performance_bands`: JSONB DEFAULT '{}' -- Excellent, Good, Fair, Poor definitions
    - `is_public`: BOOLEAN DEFAULT false
    - `auto_generate_reports`: BOOLEAN DEFAULT false
    - `report_distribution_list`: JSONB DEFAULT '{}' -- Who gets reports
    - `effective_date`: DATE DEFAULT CURRENT_DATE
    - `expiry_date`: DATE
    - `is_active`: BOOLEAN DEFAULT true
    - `owner_id`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_scoring_formula CHECK (jsonb_typeof(scoring_formula) = 'object')
    - CONSTRAINT valid_performance_bands CHECK (jsonb_typeof(performance_bands) = 'object')
    - CONSTRAINT valid_report_distribution CHECK (jsonb_typeof(report_distribution_list) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
  
  - `kpi_definitions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `scorecard_id`: UUID REFERENCES kpi_scorecards(id) ON DELETE CASCADE
    - `metric_definition_id`: UUID REFERENCES metric_definitions(id)
    - `kpi_name`: TEXT NOT NULL
    - `kpi_weight`: DECIMAL(5,2) DEFAULT 1.0 -- Weight in scorecard calculation
    - `target_value`: DECIMAL(15,4) NOT NULL
    - `target_operator`: ENUM('greater_than', 'less_than', 'equal_to', 'between')
    - `stretch_target`: DECIMAL(15,4) -- Aspirational target
    - `minimum_acceptable`: DECIMAL(15,4) -- Floor value
    - `measurement_period`: ENUM('current', 'trailing_30_days', 'trailing_90_days', 'quarter_to_date', 'year_to_date', 'custom')
    - `custom_period_days`: INTEGER -- For custom measurement periods
    - `trend_weight`: DECIMAL(3,2) DEFAULT 0.0 -- How much trend matters vs absolute value
    - `display_order`: INTEGER DEFAULT 0
    - `is_critical`: BOOLEAN DEFAULT false -- Critical KPI that affects overall status
    - `escalation_threshold`: DECIMAL(15,4) -- When to escalate if not met
    - `responsible_party_id`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `kpi_calculations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `kpi_definition_id`: UUID REFERENCES kpi_definitions(id) ON DELETE CASCADE
    - `scorecard_id`: UUID REFERENCES kpi_scorecards(id)
    - `calculation_date`: DATE NOT NULL
    - `period_start`: DATE NOT NULL
    - `period_end`: DATE NOT NULL
    - `actual_value`: DECIMAL(15,4) NOT NULL
    - `target_value`: DECIMAL(15,4) NOT NULL
    - `achievement_percentage`: DECIMAL(5,2) -- Actual vs target
    - `weighted_score`: DECIMAL(5,2) -- Score with weight applied
    - `trend_direction`: ENUM('improving', 'stable', 'declining', 'unknown')
    - `trend_percentage`: DECIMAL(5,2) -- Trend vs previous period
    - `performance_band`: ENUM('excellent', 'good', 'fair', 'poor', 'critical')
    - `variance_from_target`: DECIMAL(15,4)
    - `variance_explanation`: TEXT
    - `action_required`: BOOLEAN DEFAULT false
    - `action_plan`: TEXT
    - `data_quality_score`: DECIMAL(3,2) DEFAULT 1.0 -- Confidence in data
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - UNIQUE(kpi_definition_id, calculation_date)
    - INDEX idx_kpi_calculations_scorecard (scorecard_id, calculation_date DESC)

### 5. Threshold Management and Alerting

#### Threshold Configuration
- **Status**: Core Feature
- **Triggers**:
  - Metric threshold breaches
  - Performance degradation
  - Compliance violations
  - KPI failures
- **Data Model Requirements**:
  - `metric_thresholds` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_definition_id`: UUID REFERENCES metric_definitions(id) ON DELETE CASCADE
    - `threshold_name`: TEXT NOT NULL
    - `threshold_type`: ENUM('absolute', 'percentage', 'trend', 'deviation', 'variance')
    - `threshold_level`: ENUM('information', 'warning', 'critical', 'emergency')
    - `operator`: ENUM('greater_than', 'less_than', 'equal_to', 'between', 'outside_range', 'percentage_change')
    - `threshold_value`: DECIMAL(15,4) NOT NULL
    - `secondary_value`: DECIMAL(15,4) -- For 'between' or 'outside_range'
    - `time_window_minutes`: INTEGER DEFAULT 0 -- How long condition must persist
    - `evaluation_frequency`: ENUM('real_time', 'hourly', 'daily', 'weekly', 'monthly')
    - `notification_template_id`: UUID REFERENCES notification_templates(id)
    - `escalation_delay_hours`: INTEGER DEFAULT 0
    - `auto_clear`: BOOLEAN DEFAULT true
    - `clear_condition`: JSONB DEFAULT '{}' -- When alert clears
    - `suppression_window_hours`: INTEGER DEFAULT 0 -- Prevent alert spam
    - `business_hours_only`: BOOLEAN DEFAULT false
    - `weekends_excluded`: BOOLEAN DEFAULT false
    - `holiday_calendar_id`: UUID -- Reference to holiday calendar
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_clear_condition CHECK (jsonb_typeof(clear_condition) = 'object')
    - INDEX idx_metric_thresholds_active (metric_definition_id, is_active) WHERE is_active = true
  
  - `metric_alerts` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `threshold_id`: UUID REFERENCES metric_thresholds(id) ON DELETE CASCADE
    - `metric_calculation_id`: UUID REFERENCES metric_calculations(id)
    - `alert_timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `alert_status`: ENUM('active', 'acknowledged', 'resolved', 'suppressed', 'escalated')
    - `trigger_value`: DECIMAL(15,4) NOT NULL
    - `threshold_value`: DECIMAL(15,4) NOT NULL
    - `severity_level`: ENUM('information', 'warning', 'critical', 'emergency')
    - `alert_message`: TEXT NOT NULL
    - `affected_entities`: JSONB DEFAULT '{}' -- What entities are impacted
    - `root_cause_analysis`: TEXT
    - `corrective_actions_taken`: TEXT
    - `acknowledged_by`: UUID REFERENCES users(id)
    - `acknowledged_at`: TIMESTAMPTZ
    - `resolved_by`: UUID REFERENCES users(id)
    - `resolved_at`: TIMESTAMPTZ
    - `resolution_notes`: TEXT
    - `escalated_to`: UUID REFERENCES users(id)
    - `escalation_level`: INTEGER DEFAULT 1
    - `notification_count`: INTEGER DEFAULT 0
    - `last_notification_sent`: TIMESTAMPTZ
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_affected_entities CHECK (jsonb_typeof(affected_entities) = 'object')
    - INDEX idx_metric_alerts_status (alert_status, alert_timestamp DESC) WHERE alert_status = 'active'
    - INDEX idx_metric_alerts_severity (severity_level, alert_timestamp DESC)

### 6. Benchmarking and Comparative Analysis

#### Benchmarking Framework
- **Status**: Enhancement
- **Triggers**:
  - Industry benchmark comparisons
  - Peer organization analysis
  - Historical trend analysis
  - Performance optimization
- **Data Model Requirements**:
  - `benchmark_datasets` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `dataset_name`: TEXT NOT NULL
    - `dataset_type`: ENUM('industry', 'peer_group', 'regulatory', 'best_practice', 'historical', 'synthetic')
    - `source_organization`: TEXT -- Industry association, analyst firm, etc.
    - `data_collection_method`: TEXT
    - `sample_size`: INTEGER
    - `geographic_scope`: TEXT
    - `industry_sectors`: TEXT[]
    - `organization_sizes`: TEXT[] -- Small, medium, large, enterprise
    - `effective_period_start`: DATE
    - `effective_period_end`: DATE
    - `data_quality_rating`: ENUM('high', 'medium', 'low')
    - `confidence_level`: DECIMAL(3,2) -- Statistical confidence
    - `dataset_metadata`: JSONB DEFAULT '{}' -- Additional context
    - `access_restrictions`: TEXT
    - `cost_per_query`: DECIMAL(10,2)
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_dataset_metadata CHECK (jsonb_typeof(dataset_metadata) = 'object')
  
  - `benchmark_comparisons` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `comparison_name`: TEXT NOT NULL
    - `metric_definition_id`: UUID REFERENCES metric_definitions(id)
    - `benchmark_dataset_id`: UUID REFERENCES benchmark_datasets(id)
    - `our_value`: DECIMAL(15,4) NOT NULL
    - `benchmark_median`: DECIMAL(15,4)
    - `benchmark_p25`: DECIMAL(15,4) -- 25th percentile
    - `benchmark_p75`: DECIMAL(15,4) -- 75th percentile
    - `benchmark_p90`: DECIMAL(15,4) -- 90th percentile
    - `our_percentile`: DECIMAL(5,2) -- Where we rank
    - `comparison_period`: DATE NOT NULL
    - `variance_from_median`: DECIMAL(15,4)
    - `variance_percentage`: DECIMAL(5,2)
    - `performance_category`: ENUM('top_quartile', 'above_median', 'below_median', 'bottom_quartile')
    - `trend_vs_benchmark`: ENUM('improving', 'stable', 'declining')
    - `statistical_significance`: BOOLEAN DEFAULT false
    - `analysis_notes`: TEXT
    - `improvement_opportunity`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - INDEX idx_benchmark_comparisons_metric (metric_definition_id, comparison_period DESC)

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_metric_definitions_active ON metric_definitions (organization_id, is_active, metric_category_id) 
    WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_metric_calculations_recent ON metric_calculations (metric_definition_id, calculation_date DESC, status_indicator);
CREATE INDEX idx_analytics_dashboards_audience_active ON analytics_dashboards (audience_level_id, is_active) 
    WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_kpi_calculations_current ON kpi_calculations (scorecard_id, calculation_date DESC);
CREATE INDEX idx_metric_alerts_active ON metric_alerts (alert_status, severity_level, alert_timestamp DESC) 
    WHERE alert_status = 'active';
CREATE INDEX idx_metric_thresholds_evaluation ON metric_thresholds (evaluation_frequency, is_active) 
    WHERE is_active = true;

-- GIN indexes for JSONB fields
CREATE INDEX idx_metric_definitions_formula ON metric_definitions USING GIN (calculation_formula);
CREATE INDEX idx_metric_calculations_sources ON metric_calculations USING GIN (data_sources_used);
CREATE INDEX idx_dashboard_layout ON analytics_dashboards USING GIN (layout_configuration);
CREATE INDEX idx_dashboard_widgets_config ON dashboard_widgets USING GIN (visualization_config);
CREATE INDEX idx_metric_snapshots_data ON metric_snapshots USING GIN (snapshot_data);

-- Text search indexes
CREATE INDEX idx_metric_definitions_search ON metric_definitions 
    USING GIN (to_tsvector('english', metric_name || ' ' || description));
CREATE INDEX idx_dashboard_search ON analytics_dashboards 
    USING GIN (to_tsvector('english', dashboard_name || ' ' || COALESCE(description, '')));
```

## Functions and Triggers

```sql
-- Function to calculate metric status based on thresholds
CREATE OR REPLACE FUNCTION calculate_metric_status(
    p_metric_value DECIMAL,
    p_good_threshold DECIMAL,
    p_warning_threshold DECIMAL,
    p_critical_threshold DECIMAL,
    p_trend_direction TEXT
) RETURNS TEXT AS $$
BEGIN
    -- Determine status based on trend direction and thresholds
    CASE p_trend_direction
        WHEN 'higher_better' THEN
            IF p_metric_value >= p_good_threshold THEN RETURN 'good';
            ELSIF p_metric_value >= p_warning_threshold THEN RETURN 'warning';
            ELSE RETURN 'critical';
            END IF;
        WHEN 'lower_better' THEN
            IF p_metric_value <= p_good_threshold THEN RETURN 'good';
            ELSIF p_metric_value <= p_warning_threshold THEN RETURN 'warning';
            ELSE RETURN 'critical';
            END IF;
        WHEN 'target_better' THEN
            -- Assumes good_threshold is the target
            IF ABS(p_metric_value - p_good_threshold) <= 
               ABS(p_warning_threshold - p_good_threshold) THEN RETURN 'good';
            ELSIF ABS(p_metric_value - p_good_threshold) <= 
                  ABS(p_critical_threshold - p_good_threshold) THEN RETURN 'warning';
            ELSE RETURN 'critical';
            END IF;
        ELSE
            RETURN 'unknown';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate status on metric calculation insert
CREATE OR REPLACE FUNCTION auto_calculate_metric_status()
RETURNS TRIGGER AS $$
DECLARE
    v_definition RECORD;
BEGIN
    -- Get metric definition details
    SELECT * INTO v_definition
    FROM metric_definitions
    WHERE id = NEW.metric_definition_id;
    
    -- Calculate status indicator
    NEW.status_indicator := calculate_metric_status(
        NEW.raw_value,
        v_definition.good_threshold,
        v_definition.warning_threshold,
        v_definition.critical_threshold,
        v_definition.trend_direction
    )::metric_status_enum;
    
    -- Update last calculated timestamp
    UPDATE metric_definitions
    SET last_calculated = NEW.calculation_timestamp,
        updated_at = NOW()
    WHERE id = NEW.metric_definition_id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER auto_calculate_status_trigger
    BEFORE INSERT ON metric_calculations
    FOR EACH ROW
    EXECUTE FUNCTION auto_calculate_metric_status();

-- Function to check metric thresholds and create alerts
CREATE OR REPLACE FUNCTION check_metric_thresholds()
RETURNS TRIGGER AS $
DECLARE
    v_threshold RECORD;
    v_alert_needed BOOLEAN;
    v_alert_message TEXT;
BEGIN
    -- Check all active thresholds for this metric
    FOR v_threshold IN 
        SELECT * FROM metric_thresholds 
        WHERE metric_definition_id = NEW.metric_definition_id 
        AND is_active = true
    LOOP
        v_alert_needed := false;
        
        -- Check threshold conditions
        CASE v_threshold.operator
            WHEN 'greater_than' THEN
                v_alert_needed := NEW.raw_value > v_threshold.threshold_value;
            WHEN 'less_than' THEN
                v_alert_needed := NEW.raw_value < v_threshold.threshold_value;
            WHEN 'equal_to' THEN
                v_alert_needed := NEW.raw_value = v_threshold.threshold_value;
            WHEN 'between' THEN
                v_alert_needed := NEW.raw_value BETWEEN v_threshold.threshold_value AND v_threshold.secondary_value;
            WHEN 'outside_range' THEN
                v_alert_needed := NEW.raw_value NOT BETWEEN v_threshold.threshold_value AND v_threshold.secondary_value;
        END CASE;
        
        -- Create alert if threshold breached
        IF v_alert_needed THEN
            v_alert_message := format('Metric %s breached %s threshold. Value: %s, Threshold: %s',
                (SELECT metric_name FROM metric_definitions WHERE id = NEW.metric_definition_id),
                v_threshold.threshold_level,
                NEW.raw_value,
                v_threshold.threshold_value
            );
            
            INSERT INTO metric_alerts (
                threshold_id,
                metric_calculation_id,
                trigger_value,
                threshold_value,
                severity_level,
                alert_message,
                organization_id,
                created_by
            ) VALUES (
                v_threshold.id,
                NEW.id,
                NEW.raw_value,
                v_threshold.threshold_value,
                v_threshold.threshold_level,
                v_alert_message,
                NEW.organization_id,
                NEW.created_by
            );
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER check_thresholds_trigger
    AFTER INSERT ON metric_calculations
    FOR EACH ROW
    EXECUTE FUNCTION check_metric_thresholds();

-- Function to calculate KPI achievement percentage
CREATE OR REPLACE FUNCTION calculate_kpi_achievement(
    p_actual_value DECIMAL,
    p_target_value DECIMAL,
    p_target_operator TEXT
) RETURNS DECIMAL AS $
DECLARE
    v_achievement DECIMAL;
BEGIN
    CASE p_target_operator
        WHEN 'greater_than', 'equal_to' THEN
            -- Higher is better
            v_achievement := LEAST(100.0, (p_actual_value / NULLIF(p_target_value, 0)) * 100);
        WHEN 'less_than' THEN
            -- Lower is better
            v_achievement := CASE 
                WHEN p_actual_value <= p_target_value THEN 100.0
                ELSE GREATEST(0.0, 100.0 - ((p_actual_value - p_target_value) / NULLIF(p_target_value, 0)) * 100)
            END;
        ELSE
            v_achievement := 0.0;
    END CASE;
    
    RETURN ROUND(v_achievement, 2);
END;
$ LANGUAGE plpgsql;

-- Function to generate metric snapshots
CREATE OR REPLACE FUNCTION generate_metric_snapshot(
    p_snapshot_name TEXT,
    p_metric_ids UUID[],
    p_snapshot_type TEXT,
    p_organization_id UUID,
    p_created_by UUID
) RETURNS UUID AS $
DECLARE
    v_snapshot_id UUID;
    v_snapshot_data JSONB := '{}';
    v_metric RECORD;
    v_latest_calculation RECORD;
BEGIN
    -- Collect data for each metric
    FOREACH v_metric_id IN ARRAY p_metric_ids LOOP
        -- Get latest calculation for each metric
        SELECT * INTO v_latest_calculation
        FROM metric_calculations mc
        JOIN metric_definitions md ON mc.metric_definition_id = md.id
        WHERE mc.metric_definition_id = v_metric_id
        AND mc.organization_id = p_organization_id
        ORDER BY mc.calculation_date DESC
        LIMIT 1;
        
        IF FOUND THEN
            v_snapshot_data := v_snapshot_data || jsonb_build_object(
                v_metric_id::TEXT,
                jsonb_build_object(
                    'metric_name', v_latest_calculation.metric_name,
                    'metric_code', v_latest_calculation.metric_code,
                    'calculation_date', v_latest_calculation.calculation_date,
                    'raw_value', v_latest_calculation.raw_value,
                    'normalized_value', v_latest_calculation.normalized_value,
                    'status_indicator', v_latest_calculation.status_indicator,
                    'target_value', v_latest_calculation.target_value,
                    'measurement_unit', v_latest_calculation.measurement_unit
                )
            );
        END IF;
    END LOOP;
    
    -- Create snapshot
    INSERT INTO metric_snapshots (
        snapshot_name,
        snapshot_type,
        metrics_included,
        snapshot_data,
        purpose,
        organization_id,
        created_by
    ) VALUES (
        p_snapshot_name,
        p_snapshot_type::metric_snapshot_type_enum,
        p_metric_ids,
        v_snapshot_data,
        'Generated via API',
        p_organization_id,
        p_created_by
    ) RETURNING id INTO v_snapshot_id;
    
    RETURN v_snapshot_id;
END;
$ LANGUAGE plpgsql;
```

## Required Lookup Options Configuration

To support the dynamic lookup tables used in this schema, the following lookup option lists must be configured:

```sql
-- Metric Categories
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('metric_categories', 'compliance', 'Compliance Metrics', 1, true, NULL),
('metric_categories', 'security', 'Security Metrics', 2, true, NULL),
('metric_categories', 'operational', 'Operational Metrics', 3, true, NULL),
('metric_categories', 'financial', 'Financial Metrics', 4, true, NULL),
('metric_categories', 'risk', 'Risk Metrics', 5, true, NULL),
('metric_categories', 'quality', 'Quality Metrics', 6, true, NULL),
('metric_categories', 'performance', 'Performance Metrics', 7, true, NULL),
('metric_categories', 'customer', 'Customer Metrics', 8, true, NULL);

-- Dashboard Types
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('dashboard_types', 'executive', 'Executive Dashboard', 1, true, NULL),
('dashboard_types', 'operational', 'Operational Dashboard', 2, true, NULL),
('dashboard_types', 'compliance', 'Compliance Dashboard', 3, true, NULL),
('dashboard_types', 'security', 'Security Dashboard', 4, true, NULL),
('dashboard_types', 'risk', 'Risk Dashboard', 5, true, NULL),
('dashboard_types', 'project', 'Project Dashboard', 6, true, NULL),
('dashboard_types', 'personal', 'Personal Dashboard', 7, true, NULL);

-- Audience Levels
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('audience_levels', 'board', 'Board of Directors', 1, true, NULL),
('audience_levels', 'executive', 'Executive Team', 2, true, NULL),
('audience_levels', 'management', 'Management', 3, true, NULL),
('audience_levels', 'team_lead', 'Team Leaders', 4, true, NULL),
('audience_levels', 'individual', 'Individual Contributors', 5, true, NULL),
('audience_levels', 'external', 'External Stakeholders', 6, true, NULL);

-- Widget Types
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('widget_types', 'line_chart', 'Line Chart', 1, true, NULL),
('widget_types', 'bar_chart', 'Bar Chart', 2, true, NULL),
('widget_types', 'pie_chart', 'Pie Chart', 3, true, NULL),
('widget_types', 'gauge', 'Gauge', 4, true, NULL),
('widget_types', 'kpi_card', 'KPI Card', 5, true, NULL),
('widget_types', 'table', 'Data Table', 6, true, NULL),
('widget_types', 'heatmap', 'Heat Map', 7, true, NULL),
('widget_types', 'scatter_plot', 'Scatter Plot', 8, true, NULL),
('widget_types', 'trend_indicator', 'Trend Indicator', 9, true, NULL),
('widget_types', 'progress_bar', 'Progress Bar', 10, true, NULL);

-- Scorecard Types
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('scorecard_types', 'balanced_scorecard', 'Balanced Scorecard', 1, true, NULL),
('scorecard_types', 'compliance_scorecard', 'Compliance Scorecard', 2, true, NULL),
('scorecard_types', 'security_scorecard', 'Security Scorecard', 3, true, NULL),
('scorecard_types', 'risk_scorecard', 'Risk Scorecard', 4, true, NULL),
('scorecard_types', 'operational_scorecard', 'Operational Scorecard', 5, true, NULL),
('scorecard_types', 'financial_scorecard', 'Financial Scorecard', 6, true, NULL);

-- Target Audiences
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('target_audiences', 'board_directors', 'Board of Directors', 1, true, NULL),
('target_audiences', 'c_suite', 'C-Suite Executives', 2, true, NULL),
('target_audiences', 'department_heads', 'Department Heads', 3, true, NULL),
('target_audiences', 'compliance_team', 'Compliance Team', 4, true, NULL),
('target_audiences', 'security_team', 'Security Team', 5, true, NULL),
('target_audiences', 'risk_team', 'Risk Management Team', 6, true, NULL),
('target_audiences', 'audit_committee', 'Audit Committee', 7, true, NULL),
('target_audiences', 'regulators', 'Regulatory Bodies', 8, true, NULL);
```

## UI Integration

- **Primary Screens**:
  - **Metrics Dashboard** for real-time metrics monitoring
  - **KPI Scorecard** for executive and management KPI tracking
  - **Metrics Definition Manager** for configuring new metrics
  - **Analytics Dashboard Builder** for creating custom dashboards
  - **Threshold Manager** for setting up alerts and notifications
  - **Benchmark Analysis** for comparative performance analysis
  - **Metrics Reports** for scheduled and ad-hoc reporting
  - **Alert Center** for managing metric alerts and notifications

- **Integration Points**:
  - **All Compliance Systems** for data source integration
  - **Unified SLA System** for deadline and performance metrics
  - **Notification System** for threshold breach alerts
  - **Task Management** for action items from metric failures
  - **Risk Management** for risk-based metrics
  - **Audit System** for audit metrics and compliance tracking
  - **Training System** for training effectiveness metrics
  - **Document Management** for policy and procedure metrics

## Migration and Operational Considerations

### 1. **Data Collection Strategy**
- **Automated Collection**: Real-time data from application databases
- **Scheduled Collection**: Batch processing for complex calculations
- **Manual Entry**: User-input metrics that can't be automated
- **External Integration**: API connections to third-party systems

### 2. **Performance Optimization**
- **Calculation Caching**: Store pre-calculated values for complex metrics
- **Incremental Updates**: Calculate only changed data where possible
- **Parallel Processing**: Distribute metric calculations across resources
- **Data Archival**: Archive old metric data based on retention policies

### 3. **Security and Access Control**
- **Role-Based Dashboards**: Different views for different roles
- **Data Classification**: Sensitive metrics restricted to authorized users
- **Audit Trail**: Complete tracking of all metric access and changes
- **Export Controls**: Controlled export of sensitive performance data

### 4. **Compliance and Governance**
- **Metrics Approval Process**: Formal approval for new organizational metrics
- **Data Quality Standards**: Validation and quality scoring for all metrics
- **Retention Policies**: Automated retention based on regulatory requirements
- **External Reporting**: Integration with regulatory and industry reporting

### 5. **Framework Benefits**
- **Unified Analytics**: Single source of truth for all organizational metrics
- **Configurable KPIs**: Flexible KPI definitions that adapt to changing needs
- **Automated Alerting**: Proactive notification of performance issues
- **Trend Analysis**: Historical analysis and predictive insights
- **Benchmarking**: Industry and peer comparison capabilities
- **Executive Visibility**: Real-time visibility into organizational performance

This comprehensive metrics framework provides the foundation for data-driven decision making across all compliance and operational domains while maintaining flexibility for organizational customization and regulatory requirements.

# Post-Incident Management - Database Schema

**File Path**: `arioncomply-v1/docs/ApplicationDatabase/post_incident_management.md`

## Overview

This document defines the database schema for comprehensive post-incident management that extends the existing incident management system. The design integrates with the unified SLA framework for deadline management while providing rich content storage for post-incident activities including timeline tracking, stakeholder communications, lessons learned, and remediation planning aligned with standards terminology.

## Post-Incident Management Workflow

### 1. Core Post-Incident Extensions

#### Enhanced Incident Data Model
- **Status**: Core Feature
- **Triggers**:
  - Incident closure
  - High-severity incident response
  - Regulatory incident requirements
  - Organizational learning initiatives
- **Approval Requirements**:
  - Post-incident review authorization
  - Lessons learned validation
  - Remediation plan approval
  - Communication plan sign-off
- **Data Model Requirements**:
      - Extensions to existing `incidents` table:
    ```sql
    -- NEW FIELDS added to existing incidents table:
    post_incident_review_required BOOLEAN DEFAULT false,
    post_incident_review_completed BOOLEAN DEFAULT false,
    post_incident_review_due_date TIMESTAMPTZ,
    lessons_learned_captured BOOLEAN DEFAULT false,
    remediation_plan_required BOOLEAN DEFAULT false,
    stakeholder_impact_level_id UUID REFERENCES lookup_options(id), -- Dynamic stakeholder impact levels
    communication_plan_id UUID REFERENCES incident_communication_plans(id),
    timeline_tracking_enabled BOOLEAN DEFAULT true,
    business_impact_assessment JSONB DEFAULT '{}',
    regulatory_implications JSONB DEFAULT '{}',
    media_attention BOOLEAN DEFAULT false,
    customer_impact_count INTEGER DEFAULT 0,
    financial_impact_estimate DECIMAL(12,2),
    reputation_impact_level_id UUID REFERENCES lookup_options(id), -- Dynamic reputation impact levels
    ai_metadata JSONB DEFAULT '{"generated_by_ai": false}'
    ```
    
    ```sql
    -- CONSTRAINTS for new fields:
    CONSTRAINT valid_business_impact CHECK (jsonb_typeof(business_impact_assessment) = 'object'),
    CONSTRAINT valid_regulatory_implications CHECK (jsonb_typeof(regulatory_implications) = 'object'),
    CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    ```

### 2. Incident Timeline Management

#### Detailed Timeline Tracking
- **Status**: Core Feature
- **Triggers**:
  - Any incident activity
  - Status changes
  - Communication events
  - Decision points
  - Milestone achievements
- **Data Model Requirements**:
  - `incident_timelines` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `incident_id`: UUID REFERENCES incidents(id) ON DELETE CASCADE
    - `timeline_entry_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic timeline entry types
    - `entry_timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `entry_title`: TEXT NOT NULL
    - `entry_description`: TEXT NOT NULL
    - `performed_by`: UUID REFERENCES users(id)
    - `affected_systems`: TEXT[] -- Systems involved in this timeline event
    - `stakeholders_involved`: JSONB DEFAULT '{}' -- Stakeholders affected or contacted
    - `decisions_made`: TEXT[] -- Key decisions at this point
    - `actions_required`: TEXT[] -- Follow-up actions needed
    - `entry_metadata`: JSONB DEFAULT '{}' -- Additional structured data
    - `is_milestone`: BOOLEAN DEFAULT false
    - `milestone_type`: TEXT -- Type of milestone if applicable
    - `visibility_level_id`: UUID REFERENCES lookup_options(id) -- Dynamic visibility levels
    - `related_documents`: UUID[] -- References to related documents
    - `communication_references`: UUID[] -- Related communications
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_stakeholders CHECK (jsonb_typeof(stakeholders_involved) = 'object')
    - CONSTRAINT valid_entry_metadata CHECK (jsonb_typeof(entry_metadata) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - INDEX idx_incident_timeline_chrono (incident_id, entry_timestamp DESC)
    - INDEX idx_incident_timeline_milestones (incident_id, is_milestone) WHERE is_milestone = true
  
  - `incident_timeline_attachments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `timeline_entry_id`: UUID REFERENCES incident_timelines(id) ON DELETE CASCADE
    - `attachment_name`: TEXT NOT NULL
    - `attachment_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic attachment types
    - `file_path`: TEXT NOT NULL
    - `file_size`: BIGINT
    - `mime_type`: TEXT
    - `description`: TEXT
    - `is_confidential`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')

### 3. Stakeholder Communication Management

#### Communication Planning and Tracking
- **Status**: Core Feature
- **Triggers**:
  - Incident escalation
  - Stakeholder notification requirements
  - Communication schedule
  - Status update cycles
- **Data Model Requirements**:
  - `incident_communication_plans` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_name`: TEXT NOT NULL
    - `incident_id`: UUID REFERENCES incidents(id) ON DELETE CASCADE
    - `communication_strategy`: TEXT NOT NULL
    - `target_audiences`: JSONB NOT NULL -- Stakeholder groups and contact methods
    - `communication_schedule`: JSONB -- When to communicate what
    - `escalation_triggers`: JSONB -- What triggers escalated communications
    - `template_mappings`: JSONB -- Which templates for which audiences
    - `approval_requirements`: JSONB -- Who must approve communications
    - `is_active`: BOOLEAN DEFAULT true
    - `activated_at`: TIMESTAMPTZ
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_target_audiences CHECK (jsonb_typeof(target_audiences) = 'object')
    - CONSTRAINT valid_comm_schedule CHECK (jsonb_typeof(communication_schedule) = 'object')
    - CONSTRAINT valid_escalation_triggers CHECK (jsonb_typeof(escalation_triggers) = 'object')
    - CONSTRAINT valid_template_mappings CHECK (jsonb_typeof(template_mappings) = 'object')
    - CONSTRAINT valid_approval_requirements CHECK (jsonb_typeof(approval_requirements) = 'object')
  
  - `incident_communications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `incident_id`: UUID REFERENCES incidents(id) ON DELETE CASCADE
    - `communication_plan_id`: UUID REFERENCES incident_communication_plans(id)
    - `communication_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic communication types
    - `audience_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic audience types
    - `communication_method_id`: UUID REFERENCES lookup_options(id) -- Dynamic communication methods
    - `communication_status`: ENUM('planned', 'draft', 'pending_approval', 'approved', 'sent', 'delivered', 'acknowledged', 'failed')
    - `scheduled_time`: TIMESTAMPTZ
    - `sent_time`: TIMESTAMPTZ
    - `subject_line`: TEXT
    - `message_content`: TEXT NOT NULL
    - `recipient_list`: JSONB DEFAULT '{}' -- Who received this communication
    - `sender_id`: UUID REFERENCES users(id)
    - `approved_by`: UUID REFERENCES users(id)
    - `approval_date`: TIMESTAMPTZ
    - `delivery_confirmation`: JSONB DEFAULT '{}' -- Delivery status per recipient
    - `response_tracking`: JSONB DEFAULT '{}' -- Responses and acknowledgments
    - `is_confidential`: BOOLEAN DEFAULT false
    - `requires_nda`: BOOLEAN DEFAULT false
    - `template_used`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_recipient_list CHECK (jsonb_typeof(recipient_list) = 'object')
    - CONSTRAINT valid_delivery_confirmation CHECK (jsonb_typeof(delivery_confirmation) = 'object')
    - CONSTRAINT valid_response_tracking CHECK (jsonb_typeof(response_tracking) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - INDEX idx_incident_communications_status (incident_id, communication_status, scheduled_time)
  
  - `incident_communication_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `template_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic template types
    - `audience_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic audience types
    - `incident_severity_applicability`: TEXT[] -- Which severities this applies to
    - `subject_template`: TEXT NOT NULL
    - `body_template`: TEXT NOT NULL
    - `variables`: JSONB DEFAULT '{}' -- Required template variables
    - `approval_required`: BOOLEAN DEFAULT false
    - `legal_review_required`: BOOLEAN DEFAULT false
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_variables CHECK (jsonb_typeof(variables) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')

### 4. Post-Incident Reviews

#### Formal Review Process
- **Status**: Core Feature
- **Triggers**:
  - Incident closure
  - High-severity incidents
  - Regulatory requirements
  - Learning initiatives
- **Data Model Requirements**:
  - `post_incident_reviews` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `incident_id`: UUID REFERENCES incidents(id) ON DELETE CASCADE
    - `review_number`: TEXT UNIQUE NOT NULL
    - `review_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic review types
    - `review_status`: ENUM('scheduled', 'in_progress', 'draft', 'review', 'approved', 'published', 'cancelled')
    - `review_scope`: TEXT NOT NULL
    - `review_methodology`: TEXT
    - `scheduled_date`: TIMESTAMPTZ
    - `actual_review_date`: TIMESTAMPTZ
    - `review_duration_minutes`: INTEGER
    - `facilitator_id`: UUID REFERENCES users(id)
    - `participants`: JSONB DEFAULT '{}' -- Review participants and roles
    - `incident_summary`: TEXT NOT NULL
    - `timeline_analysis`: TEXT NOT NULL
    - `root_cause_analysis`: TEXT NOT NULL
    - `contributing_factors`: TEXT[]
    - `response_effectiveness`: TEXT NOT NULL
    - `what_went_well`: TEXT NOT NULL
    - `what_went_wrong`: TEXT NOT NULL
    - `improvement_opportunities`: TEXT[]
    - `systemic_issues_identified`: TEXT[]
    - `communication_effectiveness`: TEXT
    - `stakeholder_feedback`: JSONB DEFAULT '{}'
    - `cost_impact_analysis`: JSONB DEFAULT '{}'
    - `regulatory_compliance_assessment`: TEXT
    - `recommendations`: JSONB DEFAULT '{}' -- Structured recommendations
    - `action_items`: JSONB DEFAULT '{}' -- Immediate action items
    - `lessons_learned_summary`: TEXT
    - `preventive_measures`: TEXT[]
    - `review_confidence_level_id`: UUID REFERENCES lookup_options(id) -- Dynamic confidence levels
    - `follow_up_required`: BOOLEAN DEFAULT false
    - `follow_up_date`: DATE
    - `approved_by`: UUID REFERENCES users(id)
    - `approval_date`: TIMESTAMPTZ
    - `published_externally`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_participants CHECK (jsonb_typeof(participants) = 'object')
    - CONSTRAINT valid_stakeholder_feedback CHECK (jsonb_typeof(stakeholder_feedback) = 'object')
    - CONSTRAINT valid_cost_impact CHECK (jsonb_typeof(cost_impact_analysis) = 'object')
    - CONSTRAINT valid_recommendations CHECK (jsonb_typeof(recommendations) = 'object')
    - CONSTRAINT valid_action_items CHECK (jsonb_typeof(action_items) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - INDEX idx_post_incident_reviews_date (scheduled_date, review_status)

### 5. Lessons Learned Management

#### Knowledge Repository
- **Status**: Core Feature
- **Triggers**:
  - Post-incident review completion
  - Pattern identification
  - Knowledge sharing initiatives
  - Training material development
- **Data Model Requirements**:
  - `lessons_learned` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `lesson_number`: TEXT UNIQUE NOT NULL
    - `incident_id`: UUID REFERENCES incidents(id)
    - `post_incident_review_id`: UUID REFERENCES post_incident_reviews(id)
    - `lesson_title`: TEXT NOT NULL
    - `lesson_category_id`: UUID REFERENCES lookup_options(id) -- Dynamic lesson categories
    - `lesson_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic lesson types
    - `incident_type_applicability`: TEXT[] -- Which incident types this applies to
    - `system_applicability`: TEXT[] -- Which systems this applies to
    - `lesson_description`: TEXT NOT NULL
    - `background_context`: TEXT NOT NULL
    - `what_happened`: TEXT NOT NULL
    - `why_it_happened`: TEXT NOT NULL
    - `what_should_have_happened`: TEXT NOT NULL
    - `key_learning_points`: TEXT[] NOT NULL
    - `preventive_actions`: TEXT[]
    - `detective_improvements`: TEXT[]
    - `response_improvements`: TEXT[]
    - `recovery_improvements`: TEXT[]
    - `stakeholder_impact`: TEXT
    - `cost_of_lesson`: DECIMAL(12,2) -- Cost that led to this lesson
    - `implementation_effort_id`: UUID REFERENCES lookup_options(id) -- Dynamic effort levels
    - `business_value_id`: UUID REFERENCES lookup_options(id) -- Dynamic business value levels
    - `implementation_priority`: priority_enum DEFAULT 'medium'
    - `applicable_frameworks`: TEXT[] -- Compliance frameworks this relates to
    - `tags`: TEXT[] -- Searchable tags
    - `similar_incidents`: UUID[] -- Related incident IDs
    - `implementation_status`: ENUM('identified', 'planned', 'in_progress', 'implemented', 'verified', 'not_implemented')
    - `implementation_deadline`: DATE
    - `implementation_owner`: UUID REFERENCES users(id)
    - `verification_method`: TEXT
    - `verified_by`: UUID REFERENCES users(id)
    - `verification_date`: DATE
    - `is_sharable_externally`: BOOLEAN DEFAULT false
    - `confidentiality_level_id`: UUID REFERENCES lookup_options(id) -- Dynamic confidentiality levels
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - INDEX idx_lessons_learned_category (lesson_category_id, implementation_status)
    - INDEX idx_lessons_learned_tags USING GIN (tags)
    - INDEX idx_lessons_learned_frameworks USING GIN (applicable_frameworks)
  
  - `lessons_learned_relationships` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `lesson_id`: UUID REFERENCES lessons_learned(id) ON DELETE CASCADE
    - `related_lesson_id`: UUID REFERENCES lessons_learned(id) ON DELETE CASCADE
    - `relationship_type`: ENUM('similar', 'contradicts', 'builds_on', 'supersedes', 'reinforces')
    - `relationship_description`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - UNIQUE(lesson_id, related_lesson_id, relationship_type)
    - CONSTRAINT no_self_reference CHECK (lesson_id != related_lesson_id)

### 6. Remediation Planning (Standards-Aligned)

#### Generic Remediation Framework
- **Status**: Core Feature
- **Triggers**:
  - Post-incident review completion
  - Gap identification
  - Risk assessment outcomes
  - Compliance violations
- **Data Model Requirements**:
  - `remediation_plans` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_number`: TEXT UNIQUE NOT NULL
    - `plan_name`: TEXT NOT NULL
    - `description`: TEXT NOT NULL
    - `source_type`: ENUM('incident', 'post_incident_review', 'lesson_learned', 'risk_assessment', 'audit_finding', 'compliance_gap', 'control_failure', 'vulnerability')
    - `source_id`: UUID NOT NULL -- References the triggering record
    - `remediation_category_id`: UUID REFERENCES lookup_options(id) -- Dynamic remediation categories
    - `remediation_scope_id`: UUID REFERENCES lookup_options(id) -- Dynamic remediation scope
    - `plan_status`: ENUM('draft', 'pending_approval', 'approved', 'in_progress', 'implemented', 'verified', 'closed', 'cancelled')
    - `priority`: priority_enum DEFAULT 'medium'
    - `business_justification`: TEXT NOT NULL
    - `risk_if_not_implemented`: TEXT NOT NULL
    - `estimated_cost`: DECIMAL(12,2)
    - `actual_cost`: DECIMAL(12,2)
    - `estimated_effort_hours`: INTEGER
    - `actual_effort_hours`: INTEGER
    - `target_completion_date`: DATE NOT NULL
    - `actual_completion_date`: DATE
    - `plan_owner_id`: UUID REFERENCES users(id)
    - `approved_by`: UUID REFERENCES users(id)
    - `approval_date`: TIMESTAMPTZ
    - `implementation_approach`: TEXT NOT NULL
    - `success_criteria`: TEXT NOT NULL
    - `verification_method`: TEXT NOT NULL
    - `stakeholders_involved`: JSONB DEFAULT '{}'
    - `dependencies`: JSONB DEFAULT '{}' -- Dependencies on other plans/projects
    - `standards_compliance_required`: JSONB DEFAULT '{}' -- Which standards this addresses
    - `can_create_risk_treatment_plan`: BOOLEAN DEFAULT false
    - `can_create_corrective_action_plan`: BOOLEAN DEFAULT false
    - `can_create_audit_action_items`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_stakeholders CHECK (jsonb_typeof(stakeholders_involved) = 'object')
    - CONSTRAINT valid_dependencies CHECK (jsonb_typeof(dependencies) = 'object')
    - CONSTRAINT valid_standards_compliance CHECK (jsonb_typeof(standards_compliance_required) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')risk_assessment', 'audit_finding', 'compliance_gap', 'control_failure', 'vulnerability')
    - `source_id`: UUID NOT NULL -- References the triggering record
    - `remediation_category`: ENUM('preventive', 'detective', 'corrective', 'recovery', 'compensating')
    - `remediation_scope`: ENUM('immediate', 'short_term', 'long_term', 'systemic')
    - `plan_status`: ENUM('draft', 'pending_approval', 'approved', 'in_progress', 'implemented', 'verified', 'closed', 'cancelled')
    - `priority`: priority_enum DEFAULT 'medium'
    - `business_justification`: TEXT NOT NULL
    - `risk_if_not_implemented`: TEXT NOT NULL
    - `estimated_cost`: DECIMAL(12,2)
    - `actual_cost`: DECIMAL(12,2)
    - `estimated_effort_hours`: INTEGER
    - `actual_effort_hours`: INTEGER
    - `target_completion_date`: DATE NOT NULL
    - `actual_completion_date`: DATE
    - `plan_owner_id`: UUID REFERENCES users(id)
    - `approved_by`: UUID REFERENCES users(id)
    - `approval_date`: TIMESTAMPTZ
    - `implementation_approach`: TEXT NOT NULL
    - `success_criteria`: TEXT NOT NULL
    - `verification_method`: TEXT NOT NULL
    - `stakeholders_involved`: JSONB
    - `dependencies`: JSONB -- Dependencies on other plans/projects
    - `standards_compliance_required`: JSONB -- Which standards this addresses
    - `can_create_risk_treatment_plan`: BOOLEAN DEFAULT false
    - `can_create_corrective_action_plan`: BOOLEAN DEFAULT false
    - `can_create_audit_action_items`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_stakeholders CHECK (jsonb_typeof(stakeholders_involved) = 'object')
    - CONSTRAINT valid_dependencies CHECK (jsonb_typeof(dependencies) = 'object')
    - CONSTRAINT valid_standards_compliance CHECK (jsonb_typeof(standards_compliance_required) = 'object')
  
  - `remediation_spawned_plans` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `remediation_plan_id`: UUID REFERENCES remediation_plans(id) ON DELETE CASCADE
    - `spawned_plan_type`: ENUM('risk_treatment_plan', 'corrective_action_plan', 'audit_action_items', 'training_assignment', 'policy_update')
    - `spawned_plan_id`: UUID NOT NULL -- References appropriate standards table
    - `standards_reference`: TEXT -- ISO 31000, ISO 27001, etc.
    - `spawning_reason`: TEXT NOT NULL
    - `spawned_date`: TIMESTAMPTZ DEFAULT NOW()
    - `spawned_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - INDEX idx_remediation_spawned_type (remediation_plan_id, spawned_plan_type)
  
  - `remediation_outcomes` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `remediation_plan_id`: UUID REFERENCES remediation_plans(id) ON DELETE CASCADE
    - `outcome_type`: ENUM('incident', 'new_risk', 'non_compliance', 'operational_issue', 'success', 'partial_success', 'failure')
    - `outcome_description`: TEXT NOT NULL
    - `outcome_date`: TIMESTAMPTZ DEFAULT NOW()
    - `outcome_entity_type`: TEXT -- 'incident', 'risk', 'audit_finding'
    - `outcome_entity_id`: UUID -- ID of created entity if applicable
    - `led_to_new_remediation`: BOOLEAN DEFAULT false
    - `lessons_learned`: TEXT
    - `recorded_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)

### 7. Integration with Unified SLA System

#### Post-Incident SLA Templates
- **Status**: Core Feature
- **Triggers**:
  - Incident creation
  - Severity escalation
  - Regulatory requirements
  - Communication schedules
- **Data Model Requirements**:
  - Extensions to existing `sla_definitions` table for post-incident contexts:
    ```sql
    -- Additional display_context values:
    display_context ENUM('task_deadline', 'incident_sla', 'regulatory_deadline', 'audit_action', 'training_deadline', 'breach_notification', 'post_incident_review', 'communication_schedule', 'remediation_deadline', 'lesson_implementation')
    
    -- Additional user_facing_labels examples:
    user_facing_labels JSONB DEFAULT '{
      "deadline_term": "Review Due", 
      "overdue_term": "Review Overdue", 
      "notification_term": "Review Reminder"
    }'
    ```
  
  - `post_incident_sla_triggers` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `trigger_name`: TEXT NOT NULL
    - `incident_criteria`: JSONB NOT NULL -- What incidents trigger this SLA
    - `sla_definition_id`: UUID REFERENCES sla_definitions(id)
    - `auto_create`: BOOLEAN DEFAULT true
    - `stakeholder_notification_rules`: JSONB
    - `escalation_matrix`: JSONB
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_incident_criteria CHECK (jsonb_typeof(incident_criteria) = 'object')
    - CONSTRAINT valid_stakeholder_rules CHECK (jsonb_typeof(stakeholder_notification_rules) = 'object')
    - CONSTRAINT valid_escalation_matrix CHECK (jsonb_typeof(escalation_matrix) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_incident_timelines_recent ON incident_timelines (incident_id, entry_timestamp DESC);
CREATE INDEX idx_incident_communications_pending ON incident_communications (communication_status, scheduled_time) 
    WHERE communication_status IN ('planned', 'draft', 'pending_approval', 'approved');
CREATE INDEX idx_post_incident_reviews_due ON post_incident_reviews (scheduled_date, review_status) 
    WHERE review_status NOT IN ('approved', 'published', 'cancelled');
CREATE INDEX idx_lessons_learned_implementation ON lessons_learned (implementation_status, implementation_deadline) 
    WHERE implementation_status NOT IN ('implemented', 'verified', 'not_implemented');
CREATE INDEX idx_remediation_plans_active ON remediation_plans (plan_status, target_completion_date) 
    WHERE deleted_at IS NULL AND plan_status NOT IN ('closed', 'cancelled');

-- GIN indexes for JSONB fields
CREATE INDEX idx_incident_business_impact ON incidents USING GIN (business_impact_assessment);
CREATE INDEX idx_timeline_stakeholders ON incident_timelines USING GIN (stakeholders_involved);
CREATE INDEX idx_communication_recipients ON incident_communications USING GIN (recipient_list);
CREATE INDEX idx_review_recommendations ON post_incident_reviews USING GIN (recommendations);
CREATE INDEX idx_remediation_dependencies ON remediation_plans USING GIN (dependencies);

-- Text search indexes
CREATE INDEX idx_lessons_learned_search ON lessons_learned USING GIN (to_tsvector('english', lesson_title || ' ' || lesson_description || ' ' || key_learning_points::text));
```

## Functions and Triggers

```sql
-- Function to generate remediation plan numbers
CREATE OR REPLACE FUNCTION generate_remediation_plan_number(
    p_organization_id UUID,
    p_source_type remediation_source_type_enum
) RETURNS TEXT AS $$
DECLARE
    v_prefix TEXT;
    v_year TEXT;
    v_sequence INTEGER;
BEGIN
    -- Determine prefix based on source type
    v_prefix := CASE p_source_type
        WHEN 'incident' THEN 'REM-INC'
        WHEN 'post_incident_review' THEN 'REM-PIR'
        WHEN 'lesson_learned' THEN 'REM-LL'
        WHEN 'risk_assessment' THEN 'REM-RA'
        WHEN 'audit_finding' THEN 'REM-AF'
        WHEN 'compliance_gap' THEN 'REM-CG'
        WHEN 'control_failure' THEN 'REM-CF'
        WHEN 'vulnerability' THEN 'REM-VUL'
    END;
    
    -- Get current year
    v_year := TO_CHAR(NOW(), 'YYYY');
    
    -- Get next sequence number
    SELECT COALESCE(MAX(CAST(SUBSTRING(plan_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM remediation_plans
    WHERE plan_number LIKE v_prefix || '-' || v_year || '-%'
    AND organization_id = p_organization_id;
    
    RETURN v_prefix || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to auto-create post-incident SLAs
CREATE OR REPLACE FUNCTION create_post_incident_slas()
RETURNS TRIGGER AS $$
DECLARE
    v_trigger RECORD;
    v_criteria_match BOOLEAN;
BEGIN
    -- Check if post-incident review is required
    IF NEW.status = 'closed' AND NEW.post_incident_review_required = true THEN
        -- Find applicable SLA triggers
        FOR v_trigger IN 
            SELECT * FROM post_incident_sla_triggers 
            WHERE is_active = true 
            AND organization_id = NEW.organization_id
        LOOP
            -- Simplified criteria matching (real implementation would be more sophisticated)
            v_criteria_match := true; -- Would check NEW against v_trigger.incident_criteria
            
            IF v_criteria_match AND v_trigger.auto_create THEN
                -- Create SLA instance
                INSERT INTO incident_slas (
                    incident_id,
                    sla_definition_id,
                    response_deadline,
                    organization_id
                ) VALUES (
                    NEW.id,
                    v_trigger.sla_definition_id,
                    NOW() + INTERVAL '30 days', -- Default, would be calculated from SLA definition
                    NEW.organization_id
                );
            END IF;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_post_incident_slas_trigger
    AFTER UPDATE OF status, post_incident_review_required ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION create_post_incident_slas();

-- Function to auto-create timeline entries for major events
CREATE OR REPLACE FUNCTION create_timeline_entry_for_major_events()
RETURNS TRIGGER AS $$
BEGIN
    -- Create timeline entry for status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO incident_timelines (
            incident_id,
            timeline_entry_type,
            entry_title,
            entry_description,
            performed_by,
            organization_id,
            created_by
        ) VALUES (
            NEW.id,
            'status_change',
            'Incident status changed',
            'Status changed from ' || OLD.status || ' to ' || NEW.status,
            NEW.updated_by,
            NEW.organization_id,
            NEW.updated_by
        );
    END IF;
    
    -- Create timeline entry for severity changes
    IF OLD.severity IS DISTINCT FROM NEW.severity THEN
        INSERT INTO incident_timelines (
            incident_id,
            timeline_entry_type,
            entry_title,
            entry_description,
            performed_by,
            is_milestone,
            milestone_type,
            organization_id,
            created_by
        ) VALUES (
            NEW.id,
            'escalation',
            'Incident severity changed',
            'Severity changed from ' || OLD.severity || ' to ' || NEW.severity,
            NEW.updated_by,
            true,
            'severity_change',
            NEW.organization_id,
            NEW.updated_by
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER incident_timeline_auto_entry
    AFTER UPDATE ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION create_timeline_entry_for_major_events();

-- Function to check remediation plan spawning eligibility
CREATE OR REPLACE FUNCTION check_remediation_spawning_eligibility(
    p_remediation_plan_id UUID,
    p_spawn_type TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_plan RECORD;
    v_eligible BOOLEAN := false;
BEGIN
    SELECT * INTO v_plan
    FROM remediation_plans
    WHERE id = p_remediation_plan_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Check eligibility based on spawn type
    CASE p_spawn_type
        WHEN 'risk_treatment_plan' THEN
            v_eligible := v_plan.can_create_risk_treatment_plan;
        WHEN 'corrective_action_plan' THEN
            v_eligible := v_plan.can_create_corrective_action_plan;
        WHEN 'audit_action_items' THEN
            v_eligible := v_plan.can_create_audit_action_items;
        ELSE
            v_eligible := false;
    END CASE;
    
    RETURN v_eligible;
END;
$$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **Post-Incident Dashboard** for overview of all post-incident activities
  - **Incident Timeline Viewer** for chronological incident progression
  - **Communication Center** for stakeholder communication management
  - **Post-Incident Review Form** for structured review process
  - **Lessons Learned Repository** for knowledge management and search
  - **Remediation Plan Manager** for remediation planning and tracking
  - **Communication Template Editor** for communication template management
  - **Timeline Editor** for manual timeline entry creation
  - **Review Calendar** for scheduling and tracking post-incident reviews

- **Integration Points**:
  - **Existing Incident Management** for core incident data and status
  - **Unified SLA System** for deadline management with contextual labeling:
    - Post-incident reviews show as "Review Due" not "SLA Deadline"
    - Communication schedules show as "Communication Due" 
    - Remediation deadlines show as "Remediation Due"
  - **Task Management** for remediation tasks and action items
  - **Document Management** for review reports and communication archives
  - **Risk Management** for risk treatment plan spawning
  - **Corrective Action System** for formal corrective action spawning
  - **Audit System** for audit action item spawning
  - **Training System** for training assignments from lessons learned
  - **Notification System** for stakeholder alerts and reminders
  - **Analytics Dashboard** for post-incident metrics and trends

## Required Lookup Options Configuration

To support the dynamic lookup tables used in this schema, the following lookup option lists must be configured in the `lookup_options` table:

### Post-Incident Management Lookup Lists:

```sql
-- Stakeholder Impact Levels
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('stakeholder_impact_levels', 'none', 'No Impact', 1, true, NULL),
('stakeholder_impact_levels', 'minimal', 'Minimal Impact', 2, true, NULL),
('stakeholder_impact_levels', 'moderate', 'Moderate Impact', 3, true, NULL),
('stakeholder_impact_levels', 'significant', 'Significant Impact', 4, true, NULL),
('stakeholder_impact_levels', 'critical', 'Critical Impact', 5, true, NULL);

-- Reputation Impact Levels
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('reputation_impact_levels', 'none', 'No Reputation Impact', 1, true, NULL),
('reputation_impact_levels', 'low', 'Low Reputation Impact', 2, true, NULL),
('reputation_impact_levels', 'medium', 'Medium Reputation Impact', 3, true, NULL),
('reputation_impact_levels', 'high', 'High Reputation Impact', 4, true, NULL),
('reputation_impact_levels', 'severe', 'Severe Reputation Impact', 5, true, NULL);

-- Timeline Entry Types
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('timeline_entry_types', 'status_change', 'Status Change', 1, true, NULL),
('timeline_entry_types', 'action_taken', 'Action Taken', 2, true, NULL),
('timeline_entry_types', 'decision_made', 'Decision Made', 3, true, NULL),
('timeline_entry_types', 'communication_sent', 'Communication Sent', 4, true, NULL),
('timeline_entry_types', 'milestone_reached', 'Milestone Reached', 5, true, NULL),
('timeline_entry_types', 'escalation', 'Escalation', 6, true, NULL),
('timeline_entry_types', 'evidence_collected', 'Evidence Collected', 7, true, NULL),
('timeline_entry_types', 'stakeholder_contact', 'Stakeholder Contact', 8, true, NULL),
('timeline_entry_types', 'system_change', 'System Change', 9, true, NULL),
('timeline_entry_types', 'external_contact', 'External Contact', 10, true, NULL);

-- Visibility Levels
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('visibility_levels', 'internal', 'Internal Only', 1, true, NULL),
('visibility_levels', 'management', 'Management Level', 2, true, NULL),
('visibility_levels', 'external', 'External Stakeholders', 3, true, NULL),
('visibility_levels', 'public', 'Public Information', 4, true, NULL);

-- Attachment Types
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('attachment_types', 'document', 'Document', 1, true, NULL),
('attachment_types', 'screenshot', 'Screenshot', 2, true, NULL),
('attachment_types', 'log_file', 'Log File', 3, true, NULL),
('attachment_types', 'communication', 'Communication', 4, true, NULL),
('attachment_types', 'evidence', 'Evidence', 5, true, NULL),
('attachment_types', 'decision_record', 'Decision Record', 6, true, NULL);

-- Communication Types
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('communication_types', 'initial_notification', 'Initial Notification', 1, true, NULL),
('communication_types', 'status_update', 'Status Update', 2, true, NULL),
('communication_types', 'resolution_notice', 'Resolution Notice', 3, true, NULL),
('communication_types', 'customer_notice', 'Customer Notice', 4, true, NULL),
('communication_types', 'media_response', 'Media Response', 5, true, NULL),
('communication_types', 'regulatory_notice', 'Regulatory Notice', 6, true, NULL),
('communication_types', 'internal_update', 'Internal Update', 7, true, NULL),
('communication_types', 'stakeholder_briefing', 'Stakeholder Briefing', 8, true, NULL);

-- Audience Types
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('audience_types', 'internal_team', 'Internal Team', 1, true, NULL),
('audience_types', 'management', 'Management', 2, true, NULL),
('audience_types', 'customers', 'Customers', 3, true, NULL),
('audience_types', 'partners', 'Partners', 4, true, NULL),
('audience_types', 'regulators', 'Regulators', 5, true, NULL),
('audience_types', 'media', 'Media', 6, true, NULL),
('audience_types', 'public', 'Public', 7, true, NULL),
('audience_types', 'board', 'Board of Directors', 8, true, NULL);

-- Communication Methods
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('communication_methods', 'email', 'Email', 1, true, NULL),
('communication_methods', 'phone', 'Phone', 2, true, NULL),
('communication_methods', 'sms', 'SMS', 3, true, NULL),
('communication_methods', 'portal', 'Portal', 4, true, NULL),
('communication_methods', 'website', 'Website', 5, true, NULL),
('communication_methods', 'press_release', 'Press Release', 6, true, NULL),
('communication_methods', 'social_media', 'Social Media', 7, true, NULL),
('communication_methods', 'in_person', 'In Person', 8, true, NULL),
('communication_methods', 'video_conference', 'Video Conference', 9, true, NULL);

-- Review Types
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('review_types', 'standard', 'Standard Review', 1, true, NULL),
('review_types', 'detailed', 'Detailed Review', 2, true, NULL),
('review_types', 'regulatory_required', 'Regulatory Required', 3, true, NULL),
('review_types', 'public_facing', 'Public Facing', 4, true, NULL),
('review_types', 'board_level', 'Board Level', 5, true, NULL);

-- Confidence Levels
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('confidence_levels', 'low', 'Low Confidence', 1, true, NULL),
('confidence_levels', 'medium', 'Medium Confidence', 2, true, NULL),
('confidence_levels', 'high', 'High Confidence', 3, true, NULL);

-- Lesson Categories
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('lesson_categories', 'technical', 'Technical', 1, true, NULL),
('lesson_categories', 'process', 'Process', 2, true, NULL),
('lesson_categories', 'communication', 'Communication', 3, true, NULL),
('lesson_categories', 'organizational', 'Organizational', 4, true, NULL),
('lesson_categories', 'regulatory', 'Regulatory', 5, true, NULL),
('lesson_categories', 'vendor_management', 'Vendor Management', 6, true, NULL);

-- Lesson Types
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('lesson_types', 'preventive', 'Preventive', 1, true, NULL),
('lesson_types', 'detective', 'Detective', 2, true, NULL),
('lesson_types', 'corrective', 'Corrective', 3, true, NULL),
('lesson_types', 'recovery', 'Recovery', 4, true, NULL);

-- Implementation Effort Levels
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('implementation_effort_levels', 'low', 'Low Effort', 1, true, NULL),
('implementation_effort_levels', 'medium', 'Medium Effort', 2, true, NULL),
('implementation_effort_levels', 'high', 'High Effort', 3, true, NULL),
('implementation_effort_levels', 'very_high', 'Very High Effort', 4, true, NULL);

-- Business Value Levels
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('business_value_levels', 'low', 'Low Business Value', 1, true, NULL),
('business_value_levels', 'medium', 'Medium Business Value', 2, true, NULL),
('business_value_levels', 'high', 'High Business Value', 3, true, NULL),
('business_value_levels', 'critical', 'Critical Business Value', 4, true, NULL);

-- Confidentiality Levels
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('confidentiality_levels', 'public', 'Public', 1, true, NULL),
('confidentiality_levels', 'partner', 'Partner', 2, true, NULL),
('confidentiality_levels', 'internal', 'Internal', 3, true, NULL),
('confidentiality_levels', 'confidential', 'Confidential', 4, true, NULL),
('confidentiality_levels', 'restricted', 'Restricted', 5, true, NULL);

-- Remediation Categories
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('remediation_categories', 'preventive', 'Preventive', 1, true, NULL),
('remediation_categories', 'detective', 'Detective', 2, true, NULL),
('remediation_categories', 'corrective', 'Corrective', 3, true, NULL),
('remediation_categories', 'recovery', 'Recovery', 4, true, NULL),
('remediation_categories', 'compensating', 'Compensating', 5, true, NULL);

-- Remediation Scope
INSERT INTO lookup_options (list_name, value, label, display_order, is_active, organization_id) VALUES
('remediation_scope', 'immediate', 'Immediate', 1, true, NULL),
('remediation_scope', 'short_term', 'Short Term', 2, true, NULL),
('remediation_scope', 'long_term', 'Long Term', 3, true, NULL),
('remediation_scope', 'systemic', 'Systemic', 4, true, NULL);
```

## Compliance Verification Summary:

### ✅ **Database Schema Design Principles Compliance**:

1. **Hybrid Relational & JSONB Model** ✅
   - Core entities use relational structures
   - JSONB used appropriately for dynamic metadata, configuration, and flexible content
   - All JSONB fields have proper defaults and validation constraints

2. **Explicit Relationships Over Polymorphic** ✅
   - Most relationships are explicit foreign keys
   - Polymorphic usage in remediation_plans is justified (generic behavior across many entity types)

3. **ENUM vs Lookup Tables Strategy** ✅
   - Stable concepts remain as ENUMs (communication_status, plan_status, implementation_status)
   - Dynamic, organization-specific concepts converted to lookup tables
   - Proper lookup table configuration provided

4. **AI Metadata Consistency** ✅
   - All relevant tables now include ai_metadata JSONB field
   - Consistent schema and validation across all tables

5. **Audit Trail Implementation** ✅
   - Standard audit fields consistently applied
   - Soft delete support where appropriate
   - Version control for remediation plans

6. **Standard Column Patterns** ✅
   - UUID primary keys throughout
   - Organization scoping on all tables
   - Consistent audit field naming and types

### 1. **Integration with Existing Incidents**
- **Backward Compatibility**: Existing incidents can be enhanced with post-incident features
- **Phased Rollout**: Enable post-incident features by incident severity or type
- **Data Migration**: Historical incidents can have timeline entries backfilled
- **Template Library**: Pre-built communication templates for common scenarios

### 2. **SLA Integration Benefits**
- **Unified Deadline Management**: All post-incident deadlines managed through existing SLA infrastructure
- **Contextual User Experience**: Same backend system with appropriate frontend terminology
- **Consistent Escalation**: Leverage existing escalation matrix for post-incident activities
- **Single Monitoring Dashboard**: All compliance deadlines in one view

### 3. **Standards Alignment**
- **ISO 27035 Compliance**: Incident management standard alignment
- **NIST Framework**: Incident response framework integration
- **ITIL v4**: Service management alignment
- **Regulatory Requirements**: Support for breach notification and reporting requirements

### 4. **Knowledge Management**
- **Searchable Repository**: Full-text search across lessons learned
- **Pattern Recognition**: Automated identification of recurring issues
- **Best Practice Capture**: Template-driven knowledge capture
- **Organizational Learning**: Metrics on lesson implementation and effectiveness

### 5. **Communication Management**
- **Template-Driven Communications**: Consistent messaging across incidents
- **Multi-Channel Support**: Email, SMS, portal, social media integration
- **Approval Workflows**: Legal and management review for sensitive communications
- **Delivery Tracking**: Confirmation and acknowledgment tracking

### 6. **Remediation Framework Benefits**
- **Standards Compliance**: Ability to spawn ISO/NIST compliant plans
- **Flexible Scope**: Support for immediate through systemic remediation
- **Outcome Tracking**: Monitor remediation effectiveness
- **Cost Management**: Track investment in remediation activities

## Compliance and Audit Considerations

### 1. **Regulatory Compliance**
- **Audit Trail**: Complete timeline of all post-incident activities
- **Evidence Management**: Structured storage of review evidence and decisions
- **Regulatory Reporting**: Integration with regulatory reporting for incident summaries
- **Retention Compliance**: Automated retention based on regulatory requirements

### 2. **Security and Access Control**
- **Role-Based Access**: Different access levels for timeline, communications, reviews
- **Confidentiality Levels**: Support for confidential and restricted information
- **Approval Workflows**: Multi-level approval for sensitive activities
- **Audit Logging**: Complete audit trail of all post-incident activities

### 3. **Performance Metrics**
- **Response Effectiveness**: Metrics on incident response quality
- **Learning Effectiveness**: Metrics on lesson implementation success
- **Communication Effectiveness**: Metrics on stakeholder satisfaction
- **Cost Effectiveness**: ROI analysis on remediation investments

### 4. **Continuous Improvement**
- **Trend Analysis**: Identification of systemic issues across incidents
- **Process Optimization**: Data-driven improvement of incident response processes
- **Resource Optimization**: Better allocation of incident response resources
- **Skill Development**: Identification of training needs from incident patterns

This comprehensive post-incident management system extends the existing incident management framework while leveraging the unified SLA system for deadline management, providing organizations with enterprise-grade capabilities for incident learning, stakeholder communication, and systematic improvement.


# Regulatory Reporting and Breach Management - Database Schema

**File Path**: `arioncomply-v1/docs/ApplicationDatabase/regulatory_reporting_breach_management.md`

## Overview

This document defines the database schema for managing regulatory reporting and breach management across multiple jurisdictions and compliance frameworks. The system leverages the unified SLA framework for deadline management while providing configurable support for various regulatory requirements including GDPR, CCPA, ISO standards, and other compliance frameworks.

## Regulatory Reporting and Breach Management Workflow

### 1. Core Regulatory Framework Management

#### Configurable Regulatory Framework
- **Status**: Core Feature
- **Triggers**:
  - Data breach detection
  - Regulatory assessment schedules
  - Compliance reporting deadlines
  - Authority notifications
  - Framework updates
- **Approval Requirements**:
  - Legal review of regulatory interpretations
  - Compliance officer approval of frameworks
  - Management approval of reporting procedures
  - Authority validation where required
- **Data Model Requirements**:
  - `regulatory_frameworks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `framework_name`: TEXT NOT NULL -- GDPR, CCPA, ISO 27001, etc.
    - `framework_code`: TEXT UNIQUE NOT NULL -- Short identifier
    - `framework_type`: ENUM('privacy', 'security', 'financial', 'industry', 'regional', 'custom')
    - `jurisdiction`: TEXT -- Country/region code
    - `authority_name`: TEXT -- Regulatory body name
    - `authority_contact`: JSONB -- Contact information
    - `is_active`: BOOLEAN DEFAULT true
    - `effective_date`: DATE
    - `last_updated`: DATE
    - `framework_url`: TEXT -- Official documentation URL
    - `description`: TEXT
    - `breach_notification_required`: BOOLEAN DEFAULT false
    - `default_notification_hours`: INTEGER -- Hours for breach notification
    - `reporting_frequency`: ENUM('none', 'annual', 'semi_annual', 'quarterly', 'monthly', 'ad_hoc')
    - `framework_config`: JSONB -- Framework-specific configuration
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_authority_contact CHECK (jsonb_typeof(authority_contact) = 'object')
    - CONSTRAINT valid_framework_config CHECK (jsonb_typeof(framework_config) = 'object')
    - INDEX idx_regulatory_frameworks_active (framework_type, is_active) WHERE is_active = true
  
  - `regulatory_requirements` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `framework_id`: UUID REFERENCES regulatory_frameworks(id) ON DELETE CASCADE
    - `requirement_code`: TEXT NOT NULL -- Article 33, Section 1798.82, etc.
    - `requirement_name`: TEXT NOT NULL
    - `requirement_type`: ENUM('notification', 'reporting', 'assessment', 'documentation', 'training', 'audit')
    - `trigger_conditions`: JSONB NOT NULL -- When this requirement applies
    - `timeline_config`: JSONB NOT NULL -- Deadline configuration
    - `evidence_requirements`: JSONB -- Required documentation
    - `notification_recipients`: JSONB -- Who must be notified
    - `exemptions`: JSONB -- Conditions for exemption
    - `severity_thresholds`: JSONB -- When requirement escalates
    - `is_mandatory`: BOOLEAN DEFAULT true
    - `description`: TEXT
    - `legal_reference`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_trigger_conditions CHECK (jsonb_typeof(trigger_conditions) = 'object')
    - CONSTRAINT valid_timeline_config CHECK (jsonb_typeof(timeline_config) = 'object')
    - CONSTRAINT valid_evidence_requirements CHECK (jsonb_typeof(evidence_requirements) = 'object')
    - CONSTRAINT valid_notification_recipients CHECK (jsonb_typeof(notification_recipients) = 'object')
    - UNIQUE(framework_id, requirement_code)
  
  - `regulatory_authorities` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `authority_name`: TEXT NOT NULL
    - `authority_code`: TEXT UNIQUE NOT NULL -- ICO, CNIL, etc.
    - `jurisdiction`: TEXT NOT NULL
    - `authority_type`: ENUM('data_protection', 'financial', 'security', 'industry', 'certification')
    - `contact_information`: JSONB NOT NULL
    - `notification_methods`: TEXT[] -- email, portal, api, postal
    - `portal_url`: TEXT
    - `api_endpoint`: TEXT
    - `business_hours`: JSONB
    - `escalation_contacts`: JSONB
    - `is_active`: BOOLEAN DEFAULT true
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_contact_info CHECK (jsonb_typeof(contact_information) = 'object')
    - CONSTRAINT valid_business_hours CHECK (jsonb_typeof(business_hours) = 'object')
    - CONSTRAINT valid_escalation_contacts CHECK (jsonb_typeof(escalation_contacts) = 'object')

### 2. Regulatory Reporting System

#### Report Management
- **Status**: Core Feature
- **Triggers**:
  - Scheduled reporting cycles
  - Ad-hoc regulatory requests
  - Incident-driven reports
  - Assessment completion
- **Data Model Requirements**:
  - `regulatory_reports` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `report_number`: TEXT UNIQUE NOT NULL -- Human-readable report ID
    - `framework_id`: UUID REFERENCES regulatory_frameworks(id)
    - `authority_id`: UUID REFERENCES regulatory_authorities(id)
    - `requirement_id`: UUID REFERENCES regulatory_requirements(id)
    - `report_type`: ENUM('breach_notification', 'annual_report', 'assessment_report', 'ad_hoc', 'certification', 'audit_response')
    - `report_status`: ENUM('draft', 'pending_review', 'approved', 'submitted', 'acknowledged', 'under_review', 'accepted', 'rejected')
    - `priority`: priority_enum DEFAULT 'high'
    - `reporting_period_start`: DATE
    - `reporting_period_end`: DATE
    - `due_date`: TIMESTAMPTZ NOT NULL
    - `submitted_date`: TIMESTAMPTZ
    - `acknowledged_date`: TIMESTAMPTZ
    - `report_title`: TEXT NOT NULL
    - `executive_summary`: TEXT
    - `report_content`: JSONB NOT NULL -- Structured report data
    - `attachments`: JSONB -- File references
    - `submission_method`: ENUM('email', 'portal', 'api', 'postal', 'in_person')
    - `submission_reference`: TEXT -- Authority reference number
    - `authority_response`: JSONB -- Response from authority
    - `follow_up_required`: BOOLEAN DEFAULT false
    - `follow_up_deadline`: TIMESTAMPTZ
    - `related_incidents`: UUID[] -- Array of incident IDs
    - `related_assessments`: UUID[] -- Array of assessment IDs
    - `organization_id`: UUID REFERENCES organizations(id)
    - `prepared_by`: UUID REFERENCES users(id)
    - `approved_by`: UUID REFERENCES users(id)
    - `submitted_by`: UUID REFERENCES users(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_report_content CHECK (jsonb_typeof(report_content) = 'object')
    - CONSTRAINT valid_attachments CHECK (jsonb_typeof(attachments) = 'object')
    - CONSTRAINT valid_authority_response CHECK (jsonb_typeof(authority_response) = 'object')
    - INDEX idx_regulatory_reports_due (due_date, report_status) WHERE report_status NOT IN ('submitted', 'acknowledged', 'accepted')
  
  - `regulatory_report_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `framework_id`: UUID REFERENCES regulatory_frameworks(id)
    - `requirement_id`: UUID REFERENCES regulatory_requirements(id)
    - `report_type`: ENUM('breach_notification', 'annual_report', 'assessment_report', 'ad_hoc', 'certification', 'audit_response')
    - `template_version`: TEXT NOT NULL
    - `is_active`: BOOLEAN DEFAULT true
    - `template_structure`: JSONB NOT NULL -- Report section structure
    - `required_fields`: JSONB NOT NULL -- Mandatory data points
    - `conditional_fields`: JSONB -- Fields based on conditions
    - `validation_rules`: JSONB -- Data validation requirements
    - `formatting_rules`: JSONB -- Output formatting
    - `submission_config`: JSONB -- How to submit this report type
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_template_structure CHECK (jsonb_typeof(template_structure) = 'object')
    - CONSTRAINT valid_required_fields CHECK (jsonb_typeof(required_fields) = 'object')
    - CONSTRAINT valid_conditional_fields CHECK (jsonb_typeof(conditional_fields) = 'object')
    - CONSTRAINT valid_validation_rules CHECK (jsonb_typeof(validation_rules) = 'object')
    - CONSTRAINT valid_formatting_rules CHECK (jsonb_typeof(formatting_rules) = 'object')
    - CONSTRAINT valid_submission_config CHECK (jsonb_typeof(submission_config) = 'object')

### 3. Breach Notification Management

#### Enhanced Breach Processing
- **Status**: Core Feature
- **Triggers**:
  - Data breach incident creation
  - Breach severity assessment
  - Regulatory notification requirements
  - Multi-jurisdiction compliance
- **Data Model Requirements**:
  - `breach_notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `notification_number`: TEXT UNIQUE NOT NULL
    - `incident_id`: UUID REFERENCES incidents(id) ON DELETE CASCADE
    - `framework_id`: UUID REFERENCES regulatory_frameworks(id)
    - `authority_id`: UUID REFERENCES regulatory_authorities(id)
    - `notification_type`: ENUM('initial', 'follow_up', 'final', 'closure')
    - `notification_status`: ENUM('required', 'preparing', 'pending_approval', 'submitted', 'acknowledged', 'under_review', 'accepted', 'not_required')
    - `breach_category`: ENUM('personal_data', 'confidentiality', 'integrity', 'availability', 'combined')
    - `data_subjects_affected`: INTEGER
    - `data_categories_involved`: JSONB NOT NULL
    - `breach_circumstances`: TEXT NOT NULL
    - `likely_consequences`: TEXT NOT NULL
    - `measures_taken`: TEXT NOT NULL
    - `measures_proposed`: TEXT
    - `risk_to_individuals`: ENUM('low', 'medium', 'high')
    - `cross_border_impact`: BOOLEAN DEFAULT false
    - `affected_jurisdictions`: TEXT[]
    - `notification_deadline`: TIMESTAMPTZ NOT NULL
    - `submitted_date`: TIMESTAMPTZ
    - `authority_reference`: TEXT
    - `authority_response`: JSONB
    - `requires_individual_notification`: BOOLEAN DEFAULT false
    - `individual_notification_deadline`: TIMESTAMPTZ
    - `individual_notification_method`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `prepared_by`: UUID REFERENCES users(id)
    - `approved_by`: UUID REFERENCES users(id)
    - `submitted_by`: UUID REFERENCES users(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_data_categories CHECK (jsonb_typeof(data_categories_involved) = 'object')
    - CONSTRAINT valid_authority_response CHECK (jsonb_typeof(authority_response) = 'object')
    - INDEX idx_breach_notifications_deadline (notification_deadline, notification_status) WHERE notification_status NOT IN ('submitted', 'acknowledged', 'not_required')
  
  - `breach_assessment_criteria` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `framework_id`: UUID REFERENCES regulatory_frameworks(id)
    - `criteria_name`: TEXT NOT NULL
    - `assessment_category`: ENUM('severity', 'scope', 'risk_level', 'notification_threshold')
    - `criteria_conditions`: JSONB NOT NULL -- When this applies
    - `notification_required`: BOOLEAN DEFAULT false
    - `notification_timeline_hours`: INTEGER
    - `individual_notification_required`: BOOLEAN DEFAULT false
    - `individual_notification_timeline_hours`: INTEGER
    - `escalation_required`: BOOLEAN DEFAULT false
    - `authority_contact_required`: BOOLEAN DEFAULT false
    - `description`: TEXT
    - `legal_basis`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_criteria_conditions CHECK (jsonb_typeof(criteria_conditions) = 'object')
  
  - `individual_notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `breach_notification_id`: UUID REFERENCES breach_notifications(id) ON DELETE CASCADE
    - `notification_method`: ENUM('email', 'postal_mail', 'phone', 'sms', 'website_notice', 'media_notice')
    - `notification_status`: ENUM('not_started', 'preparing', 'sending', 'sent', 'delivered', 'failed')
    - `target_audience`: TEXT NOT NULL -- Description of who is being notified
    - `estimated_recipients`: INTEGER
    - `actual_recipients`: INTEGER
    - `notification_content`: TEXT NOT NULL
    - `delivery_deadline`: TIMESTAMPTZ NOT NULL
    - `delivery_started`: TIMESTAMPTZ
    - `delivery_completed`: TIMESTAMPTZ
    - `delivery_evidence`: JSONB -- Proof of delivery
    - `failed_deliveries`: INTEGER DEFAULT 0
    - `failure_reasons`: JSONB
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_delivery_evidence CHECK (jsonb_typeof(delivery_evidence) = 'object')
    - CONSTRAINT valid_failure_reasons CHECK (jsonb_typeof(failure_reasons) = 'object')

### 4. Regulatory Assessment Management

#### Ongoing Compliance Monitoring
- **Status**: Core Feature
- **Triggers**:
  - Scheduled assessment cycles
  - Regulatory requirement changes
  - Incident-driven assessments
  - Certification renewals
- **Data Model Requirements**:
  - `regulatory_assessments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `assessment_name`: TEXT NOT NULL
    - `framework_id`: UUID REFERENCES regulatory_frameworks(id)
    - `assessment_type`: ENUM('self_assessment', 'third_party', 'regulatory_audit', 'certification', 'gap_analysis')
    - `assessment_scope`: TEXT NOT NULL
    - `assessment_status`: ENUM('planned', 'in_progress', 'review', 'completed', 'cancelled')
    - `scheduled_date`: DATE
    - `actual_start_date`: DATE
    - `completion_date`: DATE
    - `next_assessment_date`: DATE
    - `assessment_methodology`: TEXT
    - `assessor_type`: ENUM('internal', 'external', 'regulatory_body', 'certification_body')
    - `lead_assessor`: TEXT
    - `assessment_team`: JSONB -- Team member details
    - `assessment_criteria`: JSONB -- What is being assessed
    - `findings_summary`: TEXT
    - `compliance_score`: DECIMAL(5,2) -- Overall compliance percentage
    - `risk_rating`: risk_level_enum
    - `action_items_count`: INTEGER DEFAULT 0
    - `high_priority_issues`: INTEGER DEFAULT 0
    - `certification_outcome`: ENUM('certified', 'conditional', 'not_certified', 'not_applicable')
    - `certification_expiry`: DATE
    - `report_path`: TEXT -- Path to assessment report
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_assessment_team CHECK (jsonb_typeof(assessment_team) = 'object')
    - CONSTRAINT valid_assessment_criteria CHECK (jsonb_typeof(assessment_criteria) = 'object')
    - INDEX idx_regulatory_assessments_next (next_assessment_date) WHERE assessment_status = 'completed'
  
  - `regulatory_assessment_findings` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `assessment_id`: UUID REFERENCES regulatory_assessments(id) ON DELETE CASCADE
    - `finding_reference`: TEXT NOT NULL
    - `requirement_id`: UUID REFERENCES regulatory_requirements(id)
    - `finding_type`: ENUM('compliance_gap', 'non_conformity', 'observation', 'improvement_opportunity', 'best_practice')
    - `severity`: risk_level_enum DEFAULT 'medium'
    - `finding_title`: TEXT NOT NULL
    - `finding_description`: TEXT NOT NULL
    - `current_state`: TEXT NOT NULL
    - `required_state`: TEXT NOT NULL
    - `risk_if_unaddressed`: TEXT
    - `recommended_action`: TEXT NOT NULL
    - `responsible_party`: UUID REFERENCES users(id)
    - `target_completion_date`: DATE
    - `actual_completion_date`: DATE
    - `status`: ENUM('open', 'in_progress', 'resolved', 'accepted_risk', 'not_applicable')
    - `resolution_evidence`: JSONB -- Evidence of resolution
    - `verification_method`: TEXT
    - `verified_by`: UUID REFERENCES users(id)
    - `verified_date`: DATE
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_resolution_evidence CHECK (jsonb_typeof(resolution_evidence) = 'object')
    - INDEX idx_assessment_findings_status (assessment_id, status)

### 5. Integration with Unified SLA System

#### SLA Configuration for Regulatory Deadlines
- **Status**: Core Feature
- **Triggers**:
  - Framework configuration
  - Requirement definition
  - Breach detection
  - Assessment scheduling
- **Data Model Requirements**:
  - Extensions to existing `sla_definitions` table:
    ```sql
    -- NEW FIELDS added to existing sla_definitions table:
    display_context ENUM('task_deadline', 'incident_sla', 'regulatory_deadline', 'audit_action', 'training_deadline', 'breach_notification') DEFAULT 'incident_sla',
    user_facing_labels JSONB DEFAULT '{"deadline_term": "SLA Deadline", "overdue_term": "SLA Breach", "notification_term": "SLA Alert"}',
    regulatory_framework_id UUID REFERENCES regulatory_frameworks(id),
    regulatory_requirement_id UUID REFERENCES regulatory_requirements(id),
    auto_create_for_incident_types TEXT[], -- Incident types that trigger this SLA
    compliance_significance ENUM('critical', 'important', 'standard', 'administrative') DEFAULT 'standard'
    ```
  
  - New `regulatory_sla_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `framework_id`: UUID REFERENCES regulatory_frameworks(id)
    - `requirement_id`: UUID REFERENCES regulatory_requirements(id)
    - `sla_definition_id`: UUID REFERENCES sla_definitions(id)
    - `trigger_conditions`: JSONB NOT NULL -- When to create SLA instance
    - `recipient_rules`: JSONB NOT NULL -- Who gets notified
    - `escalation_matrix`: JSONB NOT NULL -- Escalation paths
    - `evidence_requirements`: JSONB -- Required completion evidence
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_trigger_conditions CHECK (jsonb_typeof(trigger_conditions) = 'object')
    - CONSTRAINT valid_recipient_rules CHECK (jsonb_typeof(recipient_rules) = 'object')
    - CONSTRAINT valid_escalation_matrix CHECK (jsonb_typeof(escalation_matrix) = 'object')
    - CONSTRAINT valid_evidence_requirements CHECK (jsonb_typeof(evidence_requirements) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_regulatory_frameworks_jurisdiction ON regulatory_frameworks (jurisdiction, framework_type) 
    WHERE deleted_at IS NULL AND is_active = true;
CREATE INDEX idx_regulatory_reports_framework ON regulatory_reports (framework_id, report_status, due_date) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_breach_notifications_incident ON breach_notifications (incident_id, notification_status);
CREATE INDEX idx_regulatory_assessments_upcoming ON regulatory_assessments (next_assessment_date, framework_id) 
    WHERE assessment_status = 'completed' AND next_assessment_date IS NOT NULL;
CREATE INDEX idx_assessment_findings_open ON regulatory_assessment_findings (responsible_party, target_completion_date) 
    WHERE status IN ('open', 'in_progress');

-- GIN indexes for JSONB fields
CREATE INDEX idx_regulatory_requirements_triggers ON regulatory_requirements USING GIN (trigger_conditions);
CREATE INDEX idx_regulatory_reports_content ON regulatory_reports USING GIN (report_content);
CREATE INDEX idx_breach_notifications_data ON breach_notifications USING GIN (data_categories_involved);
CREATE INDEX idx_assessment_criteria ON regulatory_assessments USING GIN (assessment_criteria);
```

## Functions and Triggers

```sql
-- Function to generate report numbers
CREATE OR REPLACE FUNCTION generate_regulatory_report_number(
    p_framework_id UUID,
    p_report_type regulatory_report_type_enum,
    p_organization_id UUID
) RETURNS TEXT AS $$
DECLARE
    v_framework_code TEXT;
    v_type_code TEXT;
    v_year TEXT;
    v_sequence INTEGER;
BEGIN
    -- Get framework code
    SELECT framework_code INTO v_framework_code
    FROM regulatory_frameworks
    WHERE id = p_framework_id;
    
    -- Determine type code
    v_type_code := CASE p_report_type
        WHEN 'breach_notification' THEN 'BN'
        WHEN 'annual_report' THEN 'AR'
        WHEN 'assessment_report' THEN 'AS'
        WHEN 'ad_hoc' THEN 'AH'
        WHEN 'certification' THEN 'CR'
        WHEN 'audit_response' THEN 'AU'
    END;
    
    -- Get current year
    v_year := TO_CHAR(NOW(), 'YYYY');
    
    -- Get next sequence
    SELECT COALESCE(MAX(CAST(SUBSTRING(report_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM regulatory_reports
    WHERE report_number LIKE v_framework_code || '-' || v_type_code || '-' || v_year || '-%'
    AND organization_id = p_organization_id;
    
    RETURN v_framework_code || '-' || v_type_code || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to assess breach notification requirements
CREATE OR REPLACE FUNCTION assess_breach_notification_requirements(
    p_incident_id UUID
) RETURNS TABLE (
    framework_id UUID,
    authority_notification_required BOOLEAN,
    notification_deadline TIMESTAMPTZ,
    individual_notification_required BOOLEAN,
    individual_deadline TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rf.id,
        bac.notification_required,
        NOW() + (bac.notification_timeline_hours || ' hours')::INTERVAL,
        bac.individual_notification_required,
        CASE 
            WHEN bac.individual_notification_required 
            THEN NOW() + (bac.individual_notification_timeline_hours || ' hours')::INTERVAL 
            ELSE NULL 
        END
    FROM regulatory_frameworks rf
    JOIN breach_assessment_criteria bac ON rf.id = bac.framework_id
    WHERE rf.is_active = true
    AND rf.breach_notification_required = true
    -- Additional logic here would assess incident details against criteria
    ORDER BY bac.notification_timeline_hours;
END;
$$ LANGUAGE plpgsql;

-- Function to create regulatory SLA from template
CREATE OR REPLACE FUNCTION create_regulatory_sla_from_template(
    p_template_id UUID,
    p_incident_id UUID,
    p_trigger_data JSONB
) RETURNS UUID AS $$
DECLARE
    v_template RECORD;
    v_sla_id UUID;
BEGIN
    SELECT * INTO v_template
    FROM regulatory_sla_templates rst
    JOIN sla_definitions sd ON rst.sla_definition_id = sd.id
    WHERE rst.id = p_template_id
    AND rst.is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'SLA template not found or inactive';
    END IF;
    
    -- Create incident SLA instance
    INSERT INTO incident_slas (
        incident_id,
        sla_definition_id,
        response_deadline,
        organization_id
    ) VALUES (
        p_incident_id,
        v_template.sla_definition_id,
        NOW() + (v_template.response_time_minutes || ' minutes')::INTERVAL,
        v_template.organization_id
    ) RETURNING id INTO v_sla_id;
    
    RETURN v_sla_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create breach notifications
CREATE OR REPLACE FUNCTION auto_create_breach_notification()
RETURNS TRIGGER AS $$
DECLARE
    v_framework RECORD;
BEGIN
    -- Only process data breach incidents
    IF NEW.incident_type = 'data_breach' THEN
        -- Create breach notifications for applicable frameworks
        FOR v_framework IN 
            SELECT * FROM regulatory_frameworks 
            WHERE is_active = true 
            AND breach_notification_required = true
            AND organization_id = NEW.organization_id
        LOOP
            INSERT INTO breach_notifications (
                incident_id,
                framework_id,
                authority_id,
                notification_type,
                notification_status,
                notification_deadline,
                organization_id,
                created_by
            ) VALUES (
                NEW.id,
                v_framework.id,
                (SELECT id FROM regulatory_authorities WHERE jurisdiction = v_framework.jurisdiction LIMIT 1),
                'initial',
                'required',
                NOW() + (v_framework.default_notification_hours || ' hours')::INTERVAL,
                NEW.organization_id,
                NEW.created_by
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_breach_notifications_trigger
    AFTER INSERT ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION auto_create_breach_notification();
```

## UI Integration

- **Primary Screens**:
  - **Regulatory Dashboard** for compliance overview and upcoming deadlines
  - **Breach Notification Manager** for managing data breach notifications
  - **Regulatory Report Builder** for creating and submitting reports
  - **Assessment Tracker** for managing compliance assessments
  - **Framework Configuration** for setting up regulatory requirements
  - **Authority Contact Manager** for maintaining regulatory body information
  - **Compliance Calendar** for visualizing all regulatory deadlines

- **Integration Points**:
  - **Incident Management** for breach notification triggers
  - **Task System** for assessment and remediation activities
  - **Document Management** for regulatory documentation
  - **Unified SLA System** for deadline management with contextual labeling
  - **Notification System** for regulatory alerts and reminders
  - **Audit System** for regulatory audit evidence
  - **Dashboard** for compliance metrics and status visualization

## Migration and Compliance Considerations

1. **Framework Configuration**:
   - Pre-configured templates for major regulations (GDPR, CCPA, etc.)
   - Wizard for setting up organization-specific requirements
   - Import/export capabilities for framework configurations

2. **Multi-Jurisdiction Support**:
   - Automatic determination of applicable frameworks
   - Cross-border notification coordination
   - Language localization for different jurisdictions

3. **Integration Requirements**:
   - API endpoints for authority portal integration
   - Automated report generation and submission
   - Real-time compliance status monitoring
   - Evidence collection and audit trail maintenance

# Enhanced Integration Management - Database Schema

## Overview

This document defines the enhanced database schema for comprehensive integration management that extends the basic integration tables to support field-level mappings, scheduling, templates, and advanced transformation capabilities across the ArionComply platform. The design follows established database principles while providing sophisticated integration orchestration.

## Enhanced Integration Management Workflow

### 1. Field-Level Mapping Management

#### Integration Field Mappings
- **Status**: Core Feature
- **Triggers**:
  - New integration setup
  - System field changes
  - Data model updates
  - Mapping optimization needs
  - Integration troubleshooting
- **Approval Requirements**:
  - Technical review of mappings
  - Data owner approval
  - Security validation
  - Testing sign-off
- **Data Model Requirements**:
  - `integration_mappings` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `config_id`: UUID REFERENCES integration_configs(id) ON DELETE CASCADE
    - `mapping_name`: TEXT NOT NULL
    - `mapping_type`: ENUM('field', 'object', 'array', 'custom')
    - `source_path`: TEXT NOT NULL -- JSONPath or field path in source
    - `target_path`: TEXT NOT NULL -- JSONPath or field path in target
    - `source_data_type`: TEXT -- Expected source data type
    - `target_data_type`: TEXT -- Expected target data type
    - `is_required`: BOOLEAN DEFAULT false
    - `default_value`: TEXT -- Default if source is null/missing
    - `transformation_rules`: JSONB -- Transformation logic
    - `validation_rules`: JSONB -- Pre/post transformation validation
    - `mapping_direction`: ENUM('inbound', 'outbound', 'bidirectional')
    - `is_active`: BOOLEAN DEFAULT true
    - `error_handling`: ENUM('fail', 'skip', 'default', 'null')
    - `mapping_notes`: TEXT
    - `test_coverage`: DECIMAL(5,2) -- Percentage of test coverage
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_transformation CHECK (jsonb_typeof(transformation_rules) = 'object')
    - CONSTRAINT valid_validation CHECK (jsonb_typeof(validation_rules) = 'object')
    - INDEX idx_integration_mappings_config (config_id, is_active)
  
  - `integration_mapping_tests` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `mapping_id`: UUID REFERENCES integration_mappings(id) ON DELETE CASCADE
    - `test_name`: TEXT NOT NULL
    - `test_type`: ENUM('unit', 'integration', 'edge_case', 'performance')
    - `input_data`: JSONB NOT NULL
    - `expected_output`: JSONB NOT NULL
    - `test_status`: ENUM('pending', 'passed', 'failed', 'skipped')
    - `actual_output`: JSONB
    - `execution_time_ms`: INTEGER
    - `error_message`: TEXT
    - `last_run`: TIMESTAMPTZ
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_input CHECK (jsonb_typeof(input_data) = 'object')
    - CONSTRAINT valid_expected CHECK (jsonb_typeof(expected_output) = 'object')
    - CONSTRAINT valid_actual CHECK (jsonb_typeof(actual_output) = 'object')

### 2. Integration Scheduling

#### Schedule Management
- **Status**: Core Feature
- **Triggers**:
  - Recurring data synchronization needs
  - Batch processing requirements
  - Time-based data collection
  - Compliance reporting schedules
- **Data Model Requirements**:
  - `integration_schedules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `config_id`: UUID REFERENCES integration_configs(id) ON DELETE CASCADE
    - `schedule_name`: TEXT NOT NULL
    - `schedule_type`: ENUM('cron', 'interval', 'fixed_time', 'event_based', 'manual')
    - `cron_expression`: TEXT -- For cron-based schedules
    - `interval_minutes`: INTEGER -- For interval-based
    - `fixed_times`: TIME[] -- For fixed daily times
    - `timezone`: TEXT DEFAULT 'UTC' -- IANA timezone
    - `is_active`: BOOLEAN DEFAULT true
    - `start_date`: DATE
    - `end_date`: DATE -- Optional end date
    - `next_run_time`: TIMESTAMPTZ
    - `last_run_time`: TIMESTAMPTZ
    - `retry_policy`: JSONB -- Retry configuration
    - `execution_timeout_seconds`: INTEGER DEFAULT 300
    - `concurrent_execution_allowed`: BOOLEAN DEFAULT false
    - `missed_execution_policy`: ENUM('run_once', 'run_all', 'skip')
    - `notification_on_failure`: BOOLEAN DEFAULT true
    - `notification_recipients`: UUID[] -- User IDs to notify
    - `execution_parameters`: JSONB -- Additional params for execution
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_retry_policy CHECK (jsonb_typeof(retry_policy) = 'object')
    - CONSTRAINT valid_exec_params CHECK (jsonb_typeof(execution_parameters) = 'object')
    - CONSTRAINT valid_schedule CHECK (
        (schedule_type = 'cron' AND cron_expression IS NOT NULL) OR
        (schedule_type = 'interval' AND interval_minutes IS NOT NULL) OR
        (schedule_type = 'fixed_time' AND fixed_times IS NOT NULL) OR
        (schedule_type IN ('event_based', 'manual'))
    )
    - INDEX idx_schedules_next_run (next_run_time, is_active) WHERE is_active = true
  
  - `integration_schedule_executions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `schedule_id`: UUID REFERENCES integration_schedules(id) ON DELETE CASCADE
    - `execution_id`: UUID REFERENCES integration_executions(id)
    - `scheduled_time`: TIMESTAMPTZ NOT NULL
    - `actual_start_time`: TIMESTAMPTZ
    - `actual_end_time`: TIMESTAMPTZ
    - `execution_status`: ENUM('scheduled', 'running', 'completed', 'failed', 'cancelled', 'skipped')
    - `records_processed`: INTEGER DEFAULT 0
    - `error_count`: INTEGER DEFAULT 0
    - `warning_count`: INTEGER DEFAULT 0
    - `execution_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - INDEX idx_schedule_executions_status (schedule_id, execution_status, scheduled_time DESC)

### 3. Integration Templates

#### Template Management
- **Status**: Enhancement
- **Triggers**:
  - Common integration patterns
  - Standardization needs
  - New system onboarding
  - Best practice implementation
- **Data Model Requirements**:
  - `integration_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `description`: TEXT
    - `integration_type`: TEXT NOT NULL -- Type of system/API
    - `template_category`: ENUM('compliance', 'security', 'hr', 'finance', 'operations', 'custom')
    - `version`: TEXT NOT NULL
    - `is_active`: BOOLEAN DEFAULT true
    - `is_certified`: BOOLEAN DEFAULT false -- Vendor-certified template
    - `certification_date`: DATE
    - `connection_template`: JSONB NOT NULL -- Connection config template
    - `mapping_templates`: JSONB NOT NULL -- Field mapping templates
    - `transformation_library`: JSONB -- Common transformations
    - `test_suite`: JSONB -- Template test cases
    - `documentation_url`: TEXT
    - `prerequisites`: TEXT[] -- Required setup steps
    - `supported_operations`: TEXT[] -- CRUD operations supported
    - `rate_limits`: JSONB -- API rate limit info
    - `organization_id`: UUID REFERENCES organizations(id) -- NULL for system templates
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_connection CHECK (jsonb_typeof(connection_template) = 'object')
    - CONSTRAINT valid_mappings CHECK (jsonb_typeof(mapping_templates) = 'object')
    - CONSTRAINT valid_transforms CHECK (jsonb_typeof(transformation_library) = 'object')
    - CONSTRAINT valid_tests CHECK (jsonb_typeof(test_suite) = 'object')
    - CONSTRAINT valid_rate_limits CHECK (jsonb_typeof(rate_limits) = 'object')
    - UNIQUE(template_name, version, organization_id)
  
  - `integration_template_instances` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_id`: UUID REFERENCES integration_templates(id)
    - `config_id`: UUID REFERENCES integration_configs(id)
    - `instance_name`: TEXT NOT NULL
    - `customizations`: JSONB -- Template overrides
    - `deployment_status`: ENUM('draft', 'testing', 'active', 'deprecated')
    - `deployed_date`: TIMESTAMPTZ
    - `deployed_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_customizations CHECK (jsonb_typeof(customizations) = 'object')

### 4. Advanced Integration Features

#### Transformation Pipeline
- **Status**: Enhancement
- **Triggers**:
  - Complex data transformations
  - Multi-step processing
  - Data enrichment needs
  - Format conversions
- **Data Model Requirements**:
  - `integration_transformations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `transformation_name`: TEXT NOT NULL
    - `description`: TEXT
    - `transformation_type`: ENUM('map', 'filter', 'aggregate', 'enrich', 'validate', 'custom')
    - `input_schema`: JSONB -- Expected input structure
    - `output_schema`: JSONB -- Expected output structure
    - `transformation_logic`: JSONB NOT NULL -- Transformation definition
    - `language`: ENUM('jmespath', 'jsonpath', 'javascript', 'python', 'sql')
    - `is_reusable`: BOOLEAN DEFAULT true
    - `performance_tier`: ENUM('lightweight', 'standard', 'heavy')
    - `timeout_seconds`: INTEGER DEFAULT 30
    - `error_output_schema`: JSONB -- Structure when transformation fails
    - `test_cases`: JSONB -- Built-in test cases
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_input_schema CHECK (jsonb_typeof(input_schema) = 'object')
    - CONSTRAINT valid_output_schema CHECK (jsonb_typeof(output_schema) = 'object')
    - CONSTRAINT valid_logic CHECK (jsonb_typeof(transformation_logic) = 'object')
    - CONSTRAINT valid_error_schema CHECK (jsonb_typeof(error_output_schema) = 'object')
    - CONSTRAINT valid_test_cases CHECK (jsonb_typeof(test_cases) = 'object')
  
  - `integration_pipeline_definitions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `pipeline_name`: TEXT NOT NULL
    - `description`: TEXT
    - `config_id`: UUID REFERENCES integration_configs(id)
    - `pipeline_type`: ENUM('linear', 'conditional', 'parallel', 'hybrid')
    - `pipeline_steps`: JSONB NOT NULL -- Ordered transformation steps
    - `error_handling_strategy`: ENUM('fail_fast', 'continue_on_error', 'dead_letter', 'retry')
    - `dead_letter_config`: JSONB -- Where to send failed records
    - `performance_config`: JSONB -- Batch size, parallelism, etc.
    - `monitoring_config`: JSONB -- What metrics to track
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_steps CHECK (jsonb_typeof(pipeline_steps) = 'object')
    - CONSTRAINT valid_dead_letter CHECK (jsonb_typeof(dead_letter_config) = 'object')
    - CONSTRAINT valid_performance CHECK (jsonb_typeof(performance_config) = 'object')
    - CONSTRAINT valid_monitoring CHECK (jsonb_typeof(monitoring_config) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_integration_mappings_active ON integration_mappings (config_id, is_active) 
    WHERE is_active = true;
CREATE INDEX idx_mapping_tests_status ON integration_mapping_tests (mapping_id, test_status);
CREATE INDEX idx_schedules_active_next ON integration_schedules (is_active, next_run_time) 
    WHERE is_active = true;
CREATE INDEX idx_schedule_executions_recent ON integration_schedule_executions (schedule_id, scheduled_time DESC);
CREATE INDEX idx_templates_active ON integration_templates (template_category, is_active) 
    WHERE is_active = true;
CREATE INDEX idx_transformations_reusable ON integration_transformations (transformation_type, is_reusable) 
    WHERE is_reusable = true;

-- GIN indexes for JSONB fields
CREATE INDEX idx_mappings_transformation ON integration_mappings USING GIN (transformation_rules);
CREATE INDEX idx_schedules_retry ON integration_schedules USING GIN (retry_policy);
CREATE INDEX idx_templates_mappings ON integration_templates USING GIN (mapping_templates);
CREATE INDEX idx_pipeline_steps ON integration_pipeline_definitions USING GIN (pipeline_steps);
```

## Functions and Triggers

```sql
-- Function to calculate next run time for schedules
CREATE OR REPLACE FUNCTION calculate_next_run_time()
RETURNS TRIGGER AS $$
DECLARE
    v_next_run TIMESTAMPTZ;
BEGIN
    CASE NEW.schedule_type
        WHEN 'interval' THEN
            v_next_run := COALESCE(NEW.last_run_time, NOW()) + 
                         (NEW.interval_minutes || ' minutes')::INTERVAL;
        WHEN 'fixed_time' THEN
            -- Find next fixed time after now
            WITH next_times AS (
                SELECT 
                    CURRENT_DATE + t + 
                    CASE 
                        WHEN CURRENT_DATE + t < NOW() 
                        THEN INTERVAL '1 day' 
                        ELSE INTERVAL '0 day' 
                    END as next_time
                FROM unnest(NEW.fixed_times) as t
            )
            SELECT MIN(next_time) INTO v_next_run FROM next_times;
        WHEN 'cron' THEN
            -- This would use a cron parser function
            -- Simplified for example
            v_next_run := NOW() + INTERVAL '1 hour';
        ELSE
            v_next_run := NULL;
    END CASE;
    
    NEW.next_run_time := v_next_run;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_next_run_time
    BEFORE INSERT OR UPDATE OF last_run_time, schedule_type, interval_minutes, fixed_times, cron_expression
    ON integration_schedules
    FOR EACH ROW
    EXECUTE FUNCTION calculate_next_run_time();

-- Function to validate field mappings
CREATE OR REPLACE FUNCTION validate_field_mapping()
RETURNS TRIGGER AS $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
BEGIN
    -- Get data types
    v_source_type := NEW.source_data_type;
    v_target_type := NEW.target_data_type;
    
    -- Check if transformation is needed
    IF v_source_type != v_target_type AND 
       NEW.transformation_rules IS NULL THEN
        RAISE WARNING 'Data type mismatch without transformation: % -> %', 
                      v_source_type, v_target_type;
    END IF;
    
    -- Validate transformation rules structure
    IF NEW.transformation_rules IS NOT NULL THEN
        IF NOT NEW.transformation_rules ? 'type' THEN
            RAISE EXCEPTION 'Transformation rules must include type';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_mapping_trigger
    BEFORE INSERT OR UPDATE ON integration_mappings
    FOR EACH ROW
    EXECUTE FUNCTION validate_field_mapping();

-- Function to create integration from template
CREATE OR REPLACE FUNCTION create_integration_from_template(
    p_template_id UUID,
    p_instance_name TEXT,
    p_customizations JSONB,
    p_organization_id UUID,
    p_created_by UUID
) RETURNS UUID AS $$
DECLARE
    v_template RECORD;
    v_config_id UUID;
    v_instance_id UUID;
BEGIN
    -- Get template
    SELECT * INTO v_template
    FROM integration_templates
    WHERE id = p_template_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found or inactive';
    END IF;
    
    -- Create integration config
    INSERT INTO integration_configs (
        integration_name,
        integration_type,
        connection_config,
        organization_id,
        created_by
    ) VALUES (
        p_instance_name,
        v_template.integration_type,
        v_template.connection_template || COALESCE(p_customizations->'connection', '{}'::jsonb),
        p_organization_id,
        p_created_by
    ) RETURNING id INTO v_config_id;
    
    -- Create template instance record
    INSERT INTO integration_template_instances (
        template_id,
        config_id,
        instance_name,
        customizations,
        deployment_status,
        deployed_by,
        organization_id
    ) VALUES (
        p_template_id,
        v_config_id,
        p_instance_name,
        p_customizations,
        'draft',
        p_created_by,
        p_organization_id
    ) RETURNING id INTO v_instance_id;
    
    -- Create default mappings from template
    INSERT INTO integration_mappings (
        config_id,
        mapping_name,
        source_path,
        target_path,
        transformation_rules,
        organization_id,
        created_by
    )
    SELECT 
        v_config_id,
        mapping->>'name',
        mapping->>'source_path',
        mapping->>'target_path',
        mapping->'transformation',
        p_organization_id,
        p_created_by
    FROM jsonb_array_elements(v_template.mapping_templates) as mapping;
    
    RETURN v_config_id;
END;
$$ LANGUAGE plpgsql;

-- Function to test pipeline execution
CREATE OR REPLACE FUNCTION test_integration_pipeline(
    p_pipeline_id UUID,
    p_test_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_pipeline RECORD;
    v_current_data JSONB;
    v_step JSONB;
    v_result JSONB;
BEGIN
    -- Get pipeline definition
    SELECT * INTO v_pipeline
    FROM integration_pipeline_definitions
    WHERE id = p_pipeline_id;
    
    v_current_data := p_test_data;
    v_result := jsonb_build_object('success', true, 'steps', '[]'::jsonb);
    
    -- Execute each step
    FOR v_step IN SELECT * FROM jsonb_array_elements(v_pipeline.pipeline_steps)
    LOOP
        -- This would execute actual transformation
        -- Simplified for example
        v_current_data := v_current_data || jsonb_build_object(
            'step_' || (v_step->>'order'), 
            'processed'
        );
        
        v_result := v_result || jsonb_build_object(
            'steps', v_result->'steps' || jsonb_build_array(
                jsonb_build_object(
                    'step', v_step->>'name',
                    'status', 'success',
                    'output_preview', v_current_data
                )
            )
        );
    END LOOP;
    
    v_result := v_result || jsonb_build_object('final_output', v_current_data);
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **Integration Hub** for managing all integrations
  - **Mapping Designer** for visual field mapping
  - **Schedule Manager** for integration scheduling
  - **Template Library** for browsing and deploying templates
  - **Transformation Builder** for creating data transformations
  - **Pipeline Designer** for visual pipeline creation
  - **Test Suite** for integration testing
  - **Monitoring Dashboard** for integration health

- **Integration Points**:
  - Visual mapping interface with drag-and-drop
  - Real-time transformation preview
  - Schedule visualization calendar
  - Template marketplace integration
  - Version control for configurations
  - Test automation framework
  - Performance monitoring
  - Error tracking and debugging

## Migration and Operational Considerations

1. **Template Management**:
   - Pre-built templates for common systems
   - Version control for template updates
   - Template certification process
   - Community template sharing

2. **Testing Framework**:
   - Automated test generation
   - Regression test suites
   - Performance benchmarking
   - Edge case detection

3. **Monitoring and Observability**:
   - Real-time execution monitoring
   - Performance metrics tracking
   - Error pattern analysis
   - SLA compliance monitoring

4. **Security Considerations**:
   - Credential encryption
   - API key rotation
   - Access control for integrations
   - Data masking in logs

# Enhanced Evidence Management - Database Schema

## Overview

This document defines the enhanced database schema for comprehensive evidence management that extends the basic evidence tables to support evidence reviews, collection workflows, categorization, and lifecycle management across the ArionComply platform. The design follows established database principles while providing advanced evidence handling capabilities.

## Enhanced Evidence Management Workflow

### 1. Evidence Review and Validation

#### Evidence Review Management
- **Status**: Core Feature
- **Triggers**:
  - New evidence submission
  - Periodic evidence review cycles
  - Evidence expiry approaching
  - Audit preparation
  - Compliance verification needs
- **Approval Requirements**:
  - Evidence validity confirmation
  - Authenticity verification
  - Relevance assessment
  - Quality assurance
- **Data Model Requirements**:
  - `evidence_reviews` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `evidence_id`: UUID REFERENCES evidence_items(id) ON DELETE CASCADE
    - `review_type`: ENUM('initial', 'periodic', 'pre_audit', 'validity_check', 'quality_assurance')
    - `review_status`: ENUM('pending', 'in_progress', 'completed', 'escalated')
    - `reviewer_id`: UUID REFERENCES users(id)
    - `review_date`: TIMESTAMPTZ DEFAULT NOW()
    - `validity_status`: ENUM('valid', 'invalid', 'expired', 'insufficient', 'conditional')
    - `authenticity_verified`: BOOLEAN DEFAULT false
    - `relevance_score`: INTEGER CHECK (relevance_score >= 0 AND relevance_score <= 100)
    - `quality_score`: INTEGER CHECK (quality_score >= 0 AND quality_score <= 100)
    - `review_notes`: TEXT
    - `issues_found`: TEXT[]
    - `remediation_required`: BOOLEAN DEFAULT false
    - `remediation_deadline`: DATE
    - `next_review_date`: DATE
    - `approval_decision`: ENUM('approved', 'rejected', 'conditional', 'deferred')
    - `conditions`: TEXT -- For conditional approval
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - INDEX idx_evidence_reviews_status (evidence_id, review_status)
    - INDEX idx_evidence_reviews_next (next_review_date) WHERE review_status = 'completed'
  
  - `evidence_review_criteria` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `criteria_name`: TEXT NOT NULL
    - `description`: TEXT
    - `evidence_type`: TEXT -- Type of evidence this applies to
    - `control_type`: TEXT -- Type of control this supports
    - `review_checklist`: JSONB NOT NULL -- Structured review criteria
    - `scoring_rubric`: JSONB -- How to score evidence
    - `minimum_score`: INTEGER -- Minimum acceptable score
    - `is_mandatory`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_checklist CHECK (jsonb_typeof(review_checklist) = 'object')
    - CONSTRAINT valid_rubric CHECK (jsonb_typeof(scoring_rubric) = 'object')

### 2. Evidence Collection Workflows

#### Evidence Collection Task Management
- **Status**: Core Feature
- **Triggers**:
  - Control implementation requirements
  - Audit evidence requests
  - Periodic evidence updates
  - Gap identification
  - Compliance reviews
- **Data Model Requirements**:
  - `evidence_collection_tasks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_name`: TEXT NOT NULL
    - `description`: TEXT
    - `collection_type`: ENUM('control_evidence', 'audit_evidence', 'incident_evidence', 'assessment_evidence', 'periodic_update')
    - `priority`: priority_enum DEFAULT 'medium'
    - `status`: ENUM('pending', 'assigned', 'in_progress', 'submitted', 'review', 'completed', 'overdue')
    - `source_type`: TEXT -- What triggered this collection
    - `source_id`: UUID -- ID of source record
    - `evidence_requirements`: JSONB NOT NULL -- What evidence is needed
    - `collection_guidance`: TEXT -- How to collect the evidence
    - `assigned_to`: UUID REFERENCES users(id)
    - `due_date`: TIMESTAMPTZ NOT NULL
    - `submitted_date`: TIMESTAMPTZ
    - `completed_date`: TIMESTAMPTZ
    - `evidence_count`: INTEGER DEFAULT 0
    - `rejection_count`: INTEGER DEFAULT 0
    - `rejection_reasons`: TEXT[]
    - `is_recurring`: BOOLEAN DEFAULT false
    - `recurrence_pattern`: JSONB -- For periodic collections
    - `next_collection_date`: DATE
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_requirements CHECK (jsonb_typeof(evidence_requirements) = 'object')
    - CONSTRAINT valid_recurrence CHECK (jsonb_typeof(recurrence_pattern) = 'object')
    - INDEX idx_collection_tasks_assignee (assigned_to, status) WHERE deleted_at IS NULL
    - INDEX idx_collection_tasks_due (due_date, status) WHERE status NOT IN ('completed', 'cancelled')
  
  - `evidence_collection_items` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES evidence_collection_tasks(id) ON DELETE CASCADE
    - `evidence_id`: UUID REFERENCES evidence_items(id)
    - `submission_status`: ENUM('pending', 'submitted', 'accepted', 'rejected')
    - `submitted_at`: TIMESTAMPTZ
    - `reviewed_at`: TIMESTAMPTZ
    - `reviewed_by`: UUID REFERENCES users(id)
    - `rejection_reason`: TEXT
    - `resubmission_required`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(task_id, evidence_id)

### 3. Evidence Categorization and Organization

#### Evidence Category Management
- **Status**: Enhancement
- **Triggers**:
  - Evidence organization needs
  - Search optimization
  - Reporting requirements
  - Audit preparation
- **Data Model Requirements**:
  - `evidence_categories` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `category_name`: TEXT NOT NULL
    - `description`: TEXT
    - `parent_category_id`: UUID REFERENCES evidence_categories(id)
    - `category_type`: ENUM('compliance', 'operational', 'technical', 'administrative', 'financial')
    - `is_active`: BOOLEAN DEFAULT true
    - `retention_period_months`: INTEGER -- Default retention for this category
    - `review_frequency_months`: INTEGER -- How often to review
    - `metadata_schema`: JSONB -- Required metadata for this category
    - `tagging_rules`: JSONB -- Auto-tagging rules
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_metadata_schema CHECK (jsonb_typeof(metadata_schema) = 'object')
    - CONSTRAINT valid_tagging_rules CHECK (jsonb_typeof(tagging_rules) = 'object')
    - UNIQUE(category_name, organization_id)
  
  - `evidence_category_assignments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `evidence_id`: UUID REFERENCES evidence_items(id) ON DELETE CASCADE
    - `category_id`: UUID REFERENCES evidence_categories(id) ON DELETE CASCADE
    - `is_primary`: BOOLEAN DEFAULT false
    - `assigned_by`: UUID REFERENCES users(id)
    - `assigned_at`: TIMESTAMPTZ DEFAULT NOW()
    - `auto_assigned`: BOOLEAN DEFAULT false
    - `confidence_score`: DECIMAL(3,2) -- For auto-assignments
    - `organization_id`: UUID REFERENCES organizations(id)
    - UNIQUE(evidence_id, category_id)
    - CONSTRAINT only_one_primary CHECK (
        NOT is_primary OR NOT EXISTS (
            SELECT 1 FROM evidence_category_assignments eca2
            WHERE eca2.evidence_id = evidence_id
            AND eca2.id != id
            AND eca2.is_primary = true
        )
    )

### 4. Evidence Lifecycle Management

#### Evidence Validity and Expiration
- **Status**: Core Feature
- **Triggers**:
  - Evidence expiration
  - Validity period completion
  - Renewal requirements
  - Compliance changes
- **Data Model Requirements**:
  - `evidence_validity_periods` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `evidence_id`: UUID REFERENCES evidence_items(id) ON DELETE CASCADE
    - `valid_from`: DATE NOT NULL
    - `valid_until`: DATE NOT NULL
    - `validity_type`: ENUM('time_based', 'event_based', 'conditional', 'perpetual')
    - `validity_conditions`: JSONB -- For conditional validity
    - `renewal_required`: BOOLEAN DEFAULT false
    - `renewal_period_days`: INTEGER -- Days before expiry to trigger renewal
    - `renewal_status`: ENUM('not_required', 'pending', 'in_progress', 'completed', 'failed')
    - `renewal_assigned_to`: UUID REFERENCES users(id)
    - `renewal_started_date`: DATE
    - `renewal_completed_date`: DATE
    - `auto_expire`: BOOLEAN DEFAULT true
    - `expiry_action`: ENUM('archive', 'delete', 'flag_for_review', 'none')
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_conditions CHECK (jsonb_typeof(validity_conditions) = 'object')
    - CONSTRAINT valid_dates CHECK (valid_from <= valid_until)
    - INDEX idx_evidence_validity_expiry (valid_until, renewal_status) WHERE auto_expire = true
  
  - `evidence_chain_of_custody` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `evidence_id`: UUID REFERENCES evidence_items(id) ON DELETE CASCADE
    - `custody_event`: ENUM('created', 'modified', 'accessed', 'reviewed', 'transferred', 'archived', 'deleted')
    - `event_timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `performed_by`: UUID REFERENCES users(id)
    - `event_details`: JSONB NOT NULL
    - `integrity_hash`: TEXT -- Hash of evidence at this point
    - `location`: TEXT -- Where evidence is stored
    - `access_method`: TEXT -- How it was accessed
    - `ip_address`: INET
    - `user_agent`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_details CHECK (jsonb_typeof(event_details) = 'object')
    - INDEX idx_chain_custody_evidence (evidence_id, event_timestamp DESC)

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_evidence_reviews_pending ON evidence_reviews (reviewer_id, review_status) 
    WHERE review_status IN ('pending', 'in_progress');
CREATE INDEX idx_collection_tasks_recurring ON evidence_collection_tasks (next_collection_date, is_recurring) 
    WHERE is_recurring = true AND deleted_at IS NULL;
CREATE INDEX idx_evidence_categories_active ON evidence_categories (organization_id, is_active) 
    WHERE is_active = true;
CREATE INDEX idx_validity_periods_renewal ON evidence_validity_periods (valid_until, renewal_required) 
    WHERE renewal_required = true AND renewal_status != 'completed';
CREATE INDEX idx_chain_custody_recent ON evidence_chain_of_custody (evidence_id, event_timestamp DESC);

-- GIN indexes for JSONB fields
CREATE INDEX idx_review_criteria_checklist ON evidence_review_criteria USING GIN (review_checklist);
CREATE INDEX idx_collection_requirements ON evidence_collection_tasks USING GIN (evidence_requirements);
CREATE INDEX idx_categories_metadata ON evidence_categories USING GIN (metadata_schema);
CREATE INDEX idx_validity_conditions ON evidence_validity_periods USING GIN (validity_conditions);
```

## Functions and Triggers

```sql
-- Function to check evidence expiration
CREATE OR REPLACE FUNCTION check_evidence_expiration()
RETURNS TABLE (
    evidence_id UUID,
    evidence_name TEXT,
    days_until_expiry INTEGER,
    renewal_required BOOLEAN,
    assigned_to UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.title,
        EXTRACT(DAY FROM evp.valid_until - CURRENT_DATE)::INTEGER,
        evp.renewal_required,
        evp.renewal_assigned_to
    FROM evidence_items e
    JOIN evidence_validity_periods evp ON e.id = evp.evidence_id
    WHERE evp.valid_until >= CURRENT_DATE
    AND evp.valid_until <= CURRENT_DATE + INTERVAL '90 days'
    AND evp.auto_expire = true
    AND evp.renewal_status NOT IN ('completed', 'in_progress')
    ORDER BY evp.valid_until;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-categorize evidence
CREATE OR REPLACE FUNCTION auto_categorize_evidence()
RETURNS TRIGGER AS $$
DECLARE
    v_category RECORD;
    v_matches BOOLEAN;
    v_confidence DECIMAL;
BEGIN
    -- Check each category's tagging rules
    FOR v_category IN 
        SELECT * FROM evidence_categories 
        WHERE organization_id = NEW.organization_id 
        AND is_active = true 
        AND tagging_rules IS NOT NULL
    LOOP
        -- Simplified rule matching - actual implementation would be more sophisticated
        v_matches := false;
        v_confidence := 0;
        
        -- Check if evidence matches category rules
        IF v_category.tagging_rules->>'title_pattern' IS NOT NULL AND 
           NEW.title ~* (v_category.tagging_rules->>'title_pattern') THEN
            v_matches := true;
            v_confidence := 0.8;
        END IF;
        
        IF v_matches THEN
            INSERT INTO evidence_category_assignments (
                evidence_id,
                category_id,
                auto_assigned,
                confidence_score,
                organization_id,
                assigned_by,
                assigned_at
            ) VALUES (
                NEW.id,
                v_category.id,
                true,
                v_confidence,
                NEW.organization_id,
                NEW.created_by,
                NOW()
            ) ON CONFLICT (evidence_id, category_id) DO NOTHING;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_categorize_evidence_trigger
    AFTER INSERT ON evidence_items
    FOR EACH ROW
    EXECUTE FUNCTION auto_categorize_evidence();

-- Function to track chain of custody
CREATE OR REPLACE FUNCTION track_evidence_custody()
RETURNS TRIGGER AS $$
DECLARE
    v_event TEXT;
    v_details JSONB;
BEGIN
    -- Determine event type
    IF TG_OP = 'INSERT' THEN
        v_event := 'created';
        v_details := jsonb_build_object(
            'action', 'Evidence created',
            'initial_status', NEW.status
        );
    ELSIF TG_OP = 'UPDATE' THEN
        v_event := 'modified';
        v_details := jsonb_build_object(
            'action', 'Evidence modified',
            'changes', jsonb_build_object(
                'old_status', OLD.status,
                'new_status', NEW.status,
                'fields_changed', ARRAY(
                    SELECT unnest(ARRAY[
                        CASE WHEN OLD.title != NEW.title THEN 'title' END,
                        CASE WHEN OLD.description != NEW.description THEN 'description' END,
                        CASE WHEN OLD.file_path != NEW.file_path THEN 'file_path' END
                    ])
                )
            )
        );
    ELSIF TG_OP = 'DELETE' THEN
        v_event := 'deleted';
        v_details := jsonb_build_object(
            'action', 'Evidence deleted',
            'deletion_type', CASE WHEN OLD.deleted_at IS NOT NULL THEN 'soft' ELSE 'hard' END
        );
    END IF;
    
    -- Insert custody record
    INSERT INTO evidence_chain_of_custody (
        evidence_id,
        custody_event,
        performed_by,
        event_details,
        integrity_hash,
        organization_id
    ) VALUES (
        COALESCE(NEW.id, OLD.id),
        v_event::evidence_custody_event_enum,
        COALESCE(NEW.updated_by, NEW.created_by, OLD.updated_by),
        v_details,
        encode(sha256((COALESCE(NEW, OLD)::TEXT)::BYTEA), 'hex'),
        COALESCE(NEW.organization_id, OLD.organization_id)
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evidence_custody_tracking
    AFTER INSERT OR UPDATE OR DELETE ON evidence_items
    FOR EACH ROW
    EXECUTE FUNCTION track_evidence_custody();

-- Function to create collection reminders
CREATE OR REPLACE FUNCTION create_collection_reminder()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status NOT IN ('completed', 'cancelled') AND 
       NEW.due_date > NOW() AND
       NEW.due_date <= NOW() + INTERVAL '7 days' THEN
        
        -- Create notification using the notification system
        PERFORM create_notification_from_template(
            (SELECT id FROM notification_templates WHERE template_name = 'evidence_collection_reminder'),
            NEW.assigned_to,
            jsonb_build_object(
                'task_name', NEW.task_name,
                'due_date', NEW.due_date,
                'days_remaining', EXTRACT(DAY FROM NEW.due_date - NOW())
            ),
            'evidence_collection_tasks',
            NEW.id,
            NULL,
            NEW.organization_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER evidence_collection_reminder_trigger
    AFTER INSERT OR UPDATE OF due_date, assigned_to ON evidence_collection_tasks
    FOR EACH ROW
    EXECUTE FUNCTION create_collection_reminder();
```

## UI Integration

- **Primary Screens**:
  - **Evidence Review Dashboard** for pending reviews and approvals
  - **Collection Task Manager** for evidence gathering workflows
  - **Evidence Category Manager** for organizing evidence
  - **Validity Calendar** for tracking expirations and renewals
  - **Chain of Custody Viewer** for audit trail
  - **Evidence Search** with advanced filtering by category/status
  - **Bulk Operations** for mass updates and reviews
  - **Analytics Dashboard** for evidence metrics

- **Integration Points**:
  - Control implementation for control evidence
  - Audit management for audit evidence
  - Risk management for risk evidence
  - Document management system integration
  - Task management for collection tasks
  - Notification system for alerts
  - Calendar integration for validity tracking
  - Reporting engine for evidence reports

## Compliance and Quality Considerations

1. **Evidence Integrity**:
   - Cryptographic hashing for tamper detection
   - Complete chain of custody tracking
   - Access logging and monitoring
   - Integrity verification on access

2. **Retention Compliance**:
   - Automated retention policy enforcement
   - Legal hold capabilities
   - Audit-compliant deletion processes
   - Retention reporting

3. **Quality Assurance**:
   - Structured review processes
   - Scoring and quality metrics
   - Peer review workflows
   - Continuous improvement tracking

4. **Search and Discovery**:
   - Full-text search capabilities
   - Metadata-based filtering
   - Category-based organization
   - Quick evidence location for audits


# Questionnaire Management System - Database Schema

## Overview

This document defines the database schema for a comprehensive questionnaire management system that supports vendor assessments, compliance questionnaires, security reviews, and general data collection across the ArionComply platform. The design follows established database principles while providing flexibility for various questionnaire types and response formats.

## Questionnaire Management Workflow

### 1. Core Questionnaire Management

#### Questionnaire Template Administration
- **Status**: Core Feature
- **Triggers**:
  - New vendor onboarding requirements
  - Compliance assessment needs
  - Security review cycles
  - Risk assessment questionnaires
  - Custom data collection requirements
- **Approval Requirements**:
  - Template approval by compliance team
  - Question set validation
  - Scoring methodology approval
  - Publishing authorization
- **Data Model Requirements**:
  - `questionnaire_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `description`: TEXT
    - `template_type`: ENUM('vendor_assessment', 'privacy_assessment', 'security_review', 'compliance_check', 'due_diligence', 'custom') NOT NULL
    - `category_id`: UUID REFERENCES lookup_options(id) -- Dynamic categories
    - `version`: INTEGER DEFAULT 1
    - `status`: ENUM('draft', 'active', 'deprecated', 'archived') DEFAULT 'draft'
    - `target_audience`: TEXT -- Who should complete this
    - `instructions`: TEXT -- How to complete the questionnaire
    - `estimated_completion_minutes`: INTEGER
    - `scoring_methodology`: JSONB -- How to calculate scores
    - `risk_thresholds`: JSONB -- Score ranges for risk levels
    - `requires_evidence`: BOOLEAN DEFAULT false
    - `evidence_requirements`: JSONB -- What evidence is needed per section
    - `approval_required`: BOOLEAN DEFAULT false
    - `approver_role_id`: UUID REFERENCES roles(id)
    - `effective_date`: DATE
    - `expiration_date`: DATE
    - `tags`: TEXT[] -- For categorization and search
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_scoring CHECK (jsonb_typeof(scoring_methodology) = 'object')
    - CONSTRAINT valid_thresholds CHECK (jsonb_typeof(risk_thresholds) = 'object')
    - CONSTRAINT valid_evidence_req CHECK (jsonb_typeof(evidence_requirements) = 'object')
  
  - `questionnaire_sections` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_id`: UUID REFERENCES questionnaire_templates(id) ON DELETE CASCADE
    - `section_name`: TEXT NOT NULL
    - `description`: TEXT
    - `section_order`: INTEGER NOT NULL
    - `is_conditional`: BOOLEAN DEFAULT false
    - `display_conditions`: JSONB -- When to show this section
    - `weight`: DECIMAL(5,2) DEFAULT 1.0 -- For scoring
    - `is_required`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_display_conditions CHECK (jsonb_typeof(display_conditions) = 'object')
    - UNIQUE(template_id, section_order)
  
  - `questionnaire_questions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `section_id`: UUID REFERENCES questionnaire_sections(id) ON DELETE CASCADE
    - `question_text`: TEXT NOT NULL
    - `question_type`: ENUM('text', 'textarea', 'number', 'date', 'single_choice', 'multiple_choice', 'yes_no', 'scale', 'matrix', 'file_upload')
    - `question_order`: INTEGER NOT NULL
    - `is_required`: BOOLEAN DEFAULT true
    - `answer_options`: JSONB -- For choice-based questions
    - `validation_rules`: JSONB -- Input validation
    - `scoring_rules`: JSONB -- How to score answers
    - `help_text`: TEXT
    - `placeholder_text`: TEXT
    - `default_value`: TEXT
    - `is_conditional`: BOOLEAN DEFAULT false
    - `display_conditions`: JSONB -- When to show this question
    - `evidence_required`: BOOLEAN DEFAULT false
    - `risk_indicators`: JSONB -- Answer patterns indicating risk
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_answer_options CHECK (jsonb_typeof(answer_options) = 'object')
    - CONSTRAINT valid_validation CHECK (jsonb_typeof(validation_rules) = 'object')
    - CONSTRAINT valid_scoring CHECK (jsonb_typeof(scoring_rules) = 'object')
    - CONSTRAINT valid_conditions CHECK (jsonb_typeof(display_conditions) = 'object')
    - CONSTRAINT valid_risk_indicators CHECK (jsonb_typeof(risk_indicators) = 'object')
    - UNIQUE(section_id, question_order)

#### Questionnaire Distribution and Response
- **Status**: Core Feature
- **Triggers**:
  - Vendor assessment initiation
  - Periodic review cycles
  - Compliance requirements
  - Risk-based assessments
- **Data Model Requirements**:
  - `questionnaire_instances` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_id`: UUID REFERENCES questionnaire_templates(id)
    - `instance_name`: TEXT NOT NULL
    - `description`: TEXT
    - `respondent_type`: ENUM('supplier', 'employee', 'customer', 'partner', 'auditor', 'other')
    - `respondent_id`: UUID -- References appropriate entity
    - `respondent_name`: TEXT NOT NULL -- For display/reporting
    - `respondent_email`: TEXT
    - `status`: ENUM('not_started', 'in_progress', 'submitted', 'under_review', 'approved', 'rejected', 'expired')
    - `sent_date`: TIMESTAMPTZ
    - `due_date`: TIMESTAMPTZ
    - `submitted_date`: TIMESTAMPTZ
    - `reminder_count`: INTEGER DEFAULT 0
    - `last_reminder_date`: TIMESTAMPTZ
    - `completion_percentage`: INTEGER DEFAULT 0
    - `total_score`: DECIMAL(5,2)
    - `risk_level`: risk_level_enum
    - `review_required`: BOOLEAN DEFAULT false
    - `reviewed_by`: UUID REFERENCES users(id)
    - `review_date`: TIMESTAMPTZ
    - `review_notes`: TEXT
    - `approval_status`: ENUM('pending', 'approved', 'rejected', 'conditional')
    - `approval_conditions`: TEXT
    - `expiry_date`: DATE -- When responses become invalid
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
  
  - `questionnaire_responses` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `instance_id`: UUID REFERENCES questionnaire_instances(id) ON DELETE CASCADE
    - `question_id`: UUID REFERENCES questionnaire_questions(id)
    - `response_value`: TEXT -- Store all responses as text
    - `response_data`: JSONB -- Structured response data
    - `response_score`: DECIMAL(5,2)
    - `is_flagged`: BOOLEAN DEFAULT false -- Requires attention
    - `flag_reason`: TEXT
    - `evidence_provided`: BOOLEAN DEFAULT false
    - `evidence_status`: ENUM('pending', 'approved', 'rejected', 'not_required')
    - `responded_at`: TIMESTAMPTZ DEFAULT NOW()
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_response_data CHECK (jsonb_typeof(response_data) = 'object')
    - UNIQUE(instance_id, question_id)
  
  - `questionnaire_evidence` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `response_id`: UUID REFERENCES questionnaire_responses(id) ON DELETE CASCADE
    - `evidence_name`: TEXT NOT NULL
    - `evidence_type`: ENUM('document', 'screenshot', 'certificate', 'report', 'url', 'other')
    - `file_path`: TEXT
    - `external_url`: TEXT
    - `description`: TEXT
    - `verification_status`: ENUM('unverified', 'verified', 'rejected')
    - `verified_by`: UUID REFERENCES users(id)
    - `verification_date`: TIMESTAMPTZ
    - `verification_notes`: TEXT
    - `expiry_date`: DATE -- For certificates/time-limited evidence
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support

#### Questionnaire Analytics and Reporting
- **Status**: Enhancement
- **Triggers**:
  - Response completion
  - Periodic analysis
  - Risk assessment updates
  - Management reporting
- **Data Model Requirements**:
  - `questionnaire_analytics` table (materialized view):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `analytics_date`: DATE NOT NULL
    - `template_id`: UUID REFERENCES questionnaire_templates(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `total_sent`: INTEGER DEFAULT 0
    - `total_completed`: INTEGER DEFAULT 0
    - `average_completion_time`: INTEGER -- In minutes
    - `average_score`: DECIMAL(5,2)
    - `risk_distribution`: JSONB -- Count by risk level
    - `response_rate`: DECIMAL(5,2)
    - `overdue_count`: INTEGER DEFAULT 0
    - `flagged_responses`: INTEGER DEFAULT 0
    - `common_gaps`: JSONB -- Frequently failed questions
    - `trend_data`: JSONB -- Historical comparison
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_risk_dist CHECK (jsonb_typeof(risk_distribution) = 'object')
    - CONSTRAINT valid_gaps CHECK (jsonb_typeof(common_gaps) = 'object')
    - CONSTRAINT valid_trends CHECK (jsonb_typeof(trend_data) = 'object')
    - UNIQUE(analytics_date, template_id, organization_id)

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_questionnaire_templates_active ON questionnaire_templates (organization_id, status) 
    WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_questionnaire_instances_status ON questionnaire_instances (status, due_date) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_questionnaire_instances_respondent ON questionnaire_instances (respondent_type, respondent_id) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_questionnaire_responses_flagged ON questionnaire_responses (instance_id, is_flagged) 
    WHERE is_flagged = true;
CREATE INDEX idx_questionnaire_evidence_expiry ON questionnaire_evidence (expiry_date) 
    WHERE deleted_at IS NULL AND expiry_date IS NOT NULL;

-- GIN indexes for JSONB fields
CREATE INDEX idx_questions_answer_options ON questionnaire_questions USING GIN (answer_options);
CREATE INDEX idx_questions_display_conditions ON questionnaire_questions USING GIN (display_conditions);
CREATE INDEX idx_responses_data ON questionnaire_responses USING GIN (response_data);
CREATE INDEX idx_analytics_risk ON questionnaire_analytics USING GIN (risk_distribution);
```

## Functions and Triggers

```sql
-- Function to calculate questionnaire completion percentage
CREATE OR REPLACE FUNCTION calculate_questionnaire_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_total_required INTEGER;
    v_total_answered INTEGER;
    v_percentage INTEGER;
BEGIN
    -- Count total required questions
    SELECT COUNT(DISTINCT qq.id) INTO v_total_required
    FROM questionnaire_questions qq
    JOIN questionnaire_sections qs ON qq.section_id = qs.id
    JOIN questionnaire_instances qi ON qs.template_id = qi.template_id
    WHERE qi.id = NEW.instance_id
    AND qq.is_required = true;
    
    -- Count answered required questions
    SELECT COUNT(DISTINCT qr.question_id) INTO v_total_answered
    FROM questionnaire_responses qr
    JOIN questionnaire_questions qq ON qr.question_id = qq.id
    WHERE qr.instance_id = NEW.instance_id
    AND qq.is_required = true
    AND qr.response_value IS NOT NULL;
    
    -- Calculate percentage
    IF v_total_required > 0 THEN
        v_percentage := (v_total_answered * 100 / v_total_required);
    ELSE
        v_percentage := 0;
    END IF;
    
    -- Update instance
    UPDATE questionnaire_instances
    SET completion_percentage = v_percentage,
        status = CASE 
            WHEN v_percentage = 0 THEN 'not_started'
            WHEN v_percentage = 100 THEN 'submitted'
            ELSE 'in_progress'
        END,
        updated_at = NOW()
    WHERE id = NEW.instance_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_questionnaire_completion
    AFTER INSERT OR UPDATE OR DELETE ON questionnaire_responses
    FOR EACH ROW
    EXECUTE FUNCTION calculate_questionnaire_completion();

-- Function to calculate risk score
CREATE OR REPLACE FUNCTION calculate_questionnaire_risk_score(
    p_instance_id UUID
) RETURNS VOID AS $$
DECLARE
    v_total_score DECIMAL;
    v_max_score DECIMAL;
    v_risk_level TEXT;
    v_risk_thresholds JSONB;
BEGIN
    -- Get scoring methodology
    SELECT qt.risk_thresholds INTO v_risk_thresholds
    FROM questionnaire_instances qi
    JOIN questionnaire_templates qt ON qi.template_id = qt.id
    WHERE qi.id = p_instance_id;
    
    -- Calculate scores
    SELECT 
        SUM(qr.response_score * qs.weight),
        SUM(
            CASE 
                WHEN qq.question_type IN ('yes_no', 'single_choice') THEN 100 * qs.weight
                WHEN qq.question_type = 'scale' THEN 
                    (qq.answer_options->>'max_value')::DECIMAL * qs.weight
                ELSE 100 * qs.weight
            END
        )
    INTO v_total_score, v_max_score
    FROM questionnaire_responses qr
    JOIN questionnaire_questions qq ON qr.question_id = qq.id
    JOIN questionnaire_sections qs ON qq.section_id = qs.id
    WHERE qr.instance_id = p_instance_id;
    
    -- Determine risk level based on thresholds
    IF v_max_score > 0 THEN
        v_total_score := (v_total_score / v_max_score) * 100;
        
        -- Apply risk thresholds
        IF v_total_score >= (v_risk_thresholds->>'high_threshold')::DECIMAL THEN
            v_risk_level := 'low';
        ELSIF v_total_score >= (v_risk_thresholds->>'medium_threshold')::DECIMAL THEN
            v_risk_level := 'medium';
        ELSIF v_total_score >= (v_risk_thresholds->>'low_threshold')::DECIMAL THEN
            v_risk_level := 'high';
        ELSE
            v_risk_level := 'critical';
        END IF;
    END IF;
    
    -- Update instance
    UPDATE questionnaire_instances
    SET total_score = v_total_score,
        risk_level = v_risk_level::risk_level_enum,
        updated_at = NOW()
    WHERE id = p_instance_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check response flags
CREATE OR REPLACE FUNCTION check_response_risk_flags()
RETURNS TRIGGER AS $$
DECLARE
    v_risk_indicators JSONB;
    v_should_flag BOOLEAN := false;
    v_flag_reason TEXT;
BEGIN
    -- Get risk indicators for the question
    SELECT risk_indicators INTO v_risk_indicators
    FROM questionnaire_questions
    WHERE id = NEW.question_id;
    
    IF v_risk_indicators IS NOT NULL THEN
        -- Check if response matches risk patterns
        -- This is simplified - actual implementation would be more sophisticated
        IF v_risk_indicators ? NEW.response_value THEN
            v_should_flag := true;
            v_flag_reason := v_risk_indicators->>NEW.response_value;
        END IF;
    END IF;
    
    -- Update flag status
    NEW.is_flagged := v_should_flag;
    NEW.flag_reason := v_flag_reason;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_risk_flags_trigger
    BEFORE INSERT OR UPDATE OF response_value ON questionnaire_responses
    FOR EACH ROW
    EXECUTE FUNCTION check_response_risk_flags();
```

## UI Integration

- **Primary Screens**:
  - **Questionnaire Designer** for template creation and management
  - **Question Bank** for reusable question management
  - **Distribution Manager** for sending questionnaires
  - **Response Portal** for respondents to complete questionnaires
  - **Review Dashboard** for response review and approval
  - **Analytics Dashboard** for questionnaire metrics
  - **Evidence Manager** for attached evidence review
  - **Comparison View** for comparing responses across vendors/time

- **Integration Points**:
  - Supplier management for vendor questionnaires
  - Risk management for risk-based questionnaires
  - Compliance dashboard for assessment status
  - Document management for evidence storage
  - Notification system for reminders
  - Task management for follow-up actions
  - Reporting engine for assessment reports

## Migration and Compliance Considerations

1. **Template Library**:
   - Pre-built templates for common standards (SIG, CAIQ, custom)
   - Industry-specific questionnaire templates
   - Regulatory questionnaire templates

2. **Response Import**:
   - Excel/CSV import for bulk responses
   - API for automated response collection
   - Integration with vendor portals

3. **Evidence Management**:
   - Automatic evidence expiry tracking
   - Evidence reuse across questionnaires
   - Evidence validation workflows

4. **Multi-language Support**:
   - Question translation management
   - Response collection in multiple languages
   - Localized help text and instructions


# Comments and Collaboration System - Database Schema

## Overview

This document defines the database schema for a comprehensive commenting and collaboration system that enables discussions, mentions, and collaborative work across all entity types in the ArionComply platform. The system supports threaded discussions, real-time collaboration, and activity tracking.

## Comments and Collaboration Workflow

### 1. Core Commenting System

#### Comment Management
- **Status**: Core Feature
- **Triggers**:
  - User adds comment to any record
  - Reply to existing comment
  - Mention of other users
  - Status change with comment
  - Review feedback
  - Collaborative discussions
- **Approval Requirements**:
  - None for general comments
  - Moderation for flagged content
  - Approval for official statements
- **Data Model Requirements**:
  - `comments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL -- Table name (polymorphic justified by generic behavior)
    - `entity_id`: UUID NOT NULL -- ID of the record being commented on
    - `parent_comment_id`: UUID REFERENCES comments(id) ON DELETE CASCADE -- For threaded replies
    - `comment_text`: TEXT NOT NULL
    - `comment_type`: ENUM('general', 'question', 'answer', 'feedback', 'review', 'decision', 'note')
    - `status`: ENUM('active', 'edited', 'deleted', 'hidden', 'flagged')
    - `is_internal`: BOOLEAN DEFAULT false -- Internal vs external visibility
    - `is_pinned`: BOOLEAN DEFAULT false -- Pinned to top
    - `edit_count`: INTEGER DEFAULT 0
    - `last_edited_at`: TIMESTAMPTZ
    - `deleted_reason`: TEXT
    - `flagged_reason`: TEXT
    - `flagged_by`: UUID REFERENCES users(id)
    - `resolved`: BOOLEAN DEFAULT false -- For questions/issues
    - `resolved_by`: UUID REFERENCES users(id)
    - `resolved_at`: TIMESTAMPTZ
    - `sentiment`: ENUM('positive', 'neutral', 'negative') -- AI-analyzed or manual
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - INDEX idx_comments_entity (entity_type, entity_id, status) WHERE deleted_at IS NULL
    - INDEX idx_comments_parent (parent_comment_id) WHERE deleted_at IS NULL
    - INDEX idx_comments_creator (created_by, created_at DESC) WHERE deleted_at IS NULL
  
  - `comment_threads` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL
    - `entity_id`: UUID NOT NULL
    - `thread_title`: TEXT
    - `thread_type`: ENUM('discussion', 'review', 'approval', 'issue', 'announcement')
    - `status`: ENUM('open', 'closed', 'locked', 'archived')
    - `priority`: priority_enum DEFAULT 'medium'
    - `participants`: UUID[] -- Array of user IDs in thread
    - `comment_count`: INTEGER DEFAULT 0
    - `last_activity_at`: TIMESTAMPTZ DEFAULT NOW()
    - `last_activity_by`: UUID REFERENCES users(id)
    - `is_pinned`: BOOLEAN DEFAULT false
    - `requires_resolution`: BOOLEAN DEFAULT false
    - `resolved_at`: TIMESTAMPTZ
    - `resolved_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(entity_type, entity_id, thread_title)
    - INDEX idx_threads_activity (last_activity_at DESC) WHERE status = 'open'
  
  - `comment_mentions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `comment_id`: UUID REFERENCES comments(id) ON DELETE CASCADE
    - `mentioned_user_id`: UUID REFERENCES users(id)
    - `mention_type`: ENUM('direct', 'team', 'role', 'everyone')
    - `mention_text`: TEXT -- The actual @mention text
    - `is_acknowledged`: BOOLEAN DEFAULT false
    - `acknowledged_at`: TIMESTAMPTZ
    - `notification_sent`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - UNIQUE(comment_id, mentioned_user_id)
    - INDEX idx_mentions_user (mentioned_user_id, is_acknowledged)
  
  - `comment_reactions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `comment_id`: UUID REFERENCES comments(id) ON DELETE CASCADE
    - `user_id`: UUID REFERENCES users(id)
    - `reaction_type`: ENUM('like', 'helpful', 'agree', 'disagree', 'question', 'important')
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - UNIQUE(comment_id, user_id, reaction_type)
    - INDEX idx_reactions_comment (comment_id)

#### Collaborative Editing
- **Status**: Enhancement
- **Triggers**:
  - Multiple users editing
  - Real-time collaboration
  - Version conflicts
  - Edit history tracking
- **Data Model Requirements**:
  - `collaboration_sessions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL
    - `entity_id`: UUID NOT NULL
    - `session_type`: ENUM('viewing', 'editing', 'reviewing', 'approving')
    - `started_at`: TIMESTAMPTZ DEFAULT NOW()
    - `ended_at`: TIMESTAMPTZ
    - `is_active`: BOOLEAN DEFAULT true
    - `participants`: JSONB -- Array of participant info with join/leave times
    - `session_data`: JSONB -- Session-specific data
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`: UUID REFERENCES users(id)
    - CONSTRAINT valid_participants CHECK (jsonb_typeof(participants) = 'array')
    - CONSTRAINT valid_session_data CHECK (jsonb_typeof(session_data) = 'object')
    - INDEX idx_collab_active (entity_type, entity_id) WHERE is_active = true
  
  - `collaborative_edits` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `session_id`: UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE
    - `edit_sequence`: BIGINT NOT NULL -- Order of edits
    - `user_id`: UUID REFERENCES users(id)
    - `edit_type`: ENUM('insert', 'delete', 'format', 'comment', 'suggestion')
    - `field_name`: TEXT -- Which field was edited
    - `position`: INTEGER -- Character position in field
    - `content`: TEXT -- What was added/changed
    - `previous_content`: TEXT -- What was there before
    - `edit_metadata`: JSONB -- Additional edit information
    - `timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_edit_metadata CHECK (jsonb_typeof(edit_metadata) = 'object')
    - UNIQUE(session_id, edit_sequence)
    - INDEX idx_edits_session_seq (session_id, edit_sequence)
  
  - `presence_tracking` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL
    - `entity_id`: UUID NOT NULL
    - `user_id`: UUID REFERENCES users(id)
    - `presence_type`: ENUM('viewing', 'editing', 'typing', 'idle')
    - `field_name`: TEXT -- Which field user is in
    - `cursor_position`: INTEGER -- Where their cursor is
    - `selection_start`: INTEGER -- Text selection start
    - `selection_end`: INTEGER -- Text selection end
    - `last_heartbeat`: TIMESTAMPTZ DEFAULT NOW()
    - `user_color`: TEXT -- Color for collaborative highlighting
    - `organization_id`: UUID REFERENCES organizations(id)
    - UNIQUE(entity_type, entity_id, user_id)
    - INDEX idx_presence_heartbeat (last_heartbeat) -- For cleanup

#### Discussion Analytics
- **Status**: Enhancement
- **Triggers**:
  - Reporting requirements
  - Engagement analysis
  - Sentiment tracking
  - Activity monitoring
- **Data Model Requirements**:
  - `comment_analytics` table (materialized view):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `analytics_date`: DATE NOT NULL
    - `entity_type`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `total_comments`: INTEGER DEFAULT 0
    - `active_threads`: INTEGER DEFAULT 0
    - `unique_commenters`: INTEGER DEFAULT 0
    - `avg_response_time_hours`: DECIMAL(5,2)
    - `resolution_rate`: DECIMAL(5,2) -- Percentage of resolved threads
    - `sentiment_distribution`: JSONB -- Breakdown by sentiment
    - `top_contributors`: JSONB -- Most active users
    - `busiest_entities`: JSONB -- Most discussed records
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(analytics_date, entity_type, organization_id)
  
  - `record_discussions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL
    - `entity_id`: UUID NOT NULL
    - `discussion_summary`: TEXT -- AI-generated summary
    - `key_decisions`: TEXT[] -- Important decisions made
    - `action_items`: JSONB -- Extracted action items
    - `participants_count`: INTEGER DEFAULT 0
    - `comments_count`: INTEGER DEFAULT 0
    - `unresolved_count`: INTEGER DEFAULT 0
    - `last_updated`: TIMESTAMPTZ DEFAULT NOW()
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_action_items CHECK (jsonb_typeof(action_items) = 'object')
    - UNIQUE(entity_type, entity_id, organization_id)

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_comments_recent ON comments (created_at DESC) 
    WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_comments_unresolved ON comments (entity_type, entity_id) 
    WHERE deleted_at IS NULL AND resolved = false;
CREATE INDEX idx_threads_open ON comment_threads (last_activity_at DESC) 
    WHERE status = 'open';
CREATE INDEX idx_mentions_pending ON comment_mentions (mentioned_user_id) 
    WHERE is_acknowledged = false;
CREATE INDEX idx_presence_active ON presence_tracking (entity_type, entity_id) 
    WHERE last_heartbeat > NOW() - INTERVAL '5 minutes';

-- GIN indexes for arrays and JSONB
CREATE INDEX idx_threads_participants ON comment_threads USING GIN (participants);
CREATE INDEX idx_collab_participants ON collaboration_sessions USING GIN (participants);
CREATE INDEX idx_analytics_sentiment ON comment_analytics USING GIN (sentiment_distribution);
CREATE INDEX idx_discussions_actions ON record_discussions USING GIN (action_items);
```

## Functions and Triggers

```sql
-- Function to update thread activity
CREATE OR REPLACE FUNCTION update_thread_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_thread_id UUID;
BEGIN
    -- Find or create thread
    SELECT id INTO v_thread_id
    FROM comment_threads
    WHERE entity_type = NEW.entity_type
    AND entity_id = NEW.entity_id
    AND status = 'open'
    LIMIT 1;
    
    IF v_thread_id IS NULL AND NEW.parent_comment_id IS NULL THEN
        -- Create new thread for top-level comment
        INSERT INTO comment_threads (
            entity_type,
            entity_id,
            thread_type,
            participants,
            comment_count,
            last_activity_by,
            organization_id,
            created_by
        ) VALUES (
            NEW.entity_type,
            NEW.entity_id,
            'discussion',
            ARRAY[NEW.created_by],
            1,
            NEW.created_by,
            NEW.organization_id,
            NEW.created_by
        ) RETURNING id INTO v_thread_id;
    ELSE
        -- Update existing thread
        UPDATE comment_threads
        SET comment_count = comment_count + 1,
            last_activity_at = NOW(),
            last_activity_by = NEW.created_by,
            participants = CASE 
                WHEN NEW.created_by = ANY(participants) THEN participants
                ELSE participants || NEW.created_by
            END
        WHERE (id = v_thread_id) OR 
              (entity_type = NEW.entity_type AND entity_id = NEW.entity_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_on_comment
    AFTER INSERT ON comments
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION update_thread_activity();

-- Function to extract mentions
CREATE OR REPLACE FUNCTION extract_comment_mentions()
RETURNS TRIGGER AS $$
DECLARE
    v_mention_pattern TEXT := '@[a-zA-Z0-9._-]+';
    v_mention TEXT;
    v_username TEXT;
    v_user_id UUID;
BEGIN
    -- Extract all @mentions from comment text
    FOR v_mention IN
        SELECT regexp_matches(NEW.comment_text, v_mention_pattern, 'g')
    LOOP
        v_username := substring(v_mention from 2); -- Remove @
        
        -- Find user by username
        SELECT id INTO v_user_id
        FROM users
        WHERE username = v_username
        AND organization_id = NEW.organization_id
        AND status = 'active';
        
        IF v_user_id IS NOT NULL THEN
            -- Create mention record
            INSERT INTO comment_mentions (
                comment_id,
                mentioned_user_id,
                mention_type,
                mention_text,
                organization_id
            ) VALUES (
                NEW.id,
                v_user_id,
                'direct',
                v_mention,
                NEW.organization_id
            ) ON CONFLICT (comment_id, mentioned_user_id) DO NOTHING;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER extract_mentions_trigger
    AFTER INSERT OR UPDATE OF comment_text ON comments
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION extract_comment_mentions();

-- Function to summarize discussions
CREATE OR REPLACE FUNCTION summarize_entity_discussions(
    p_entity_type TEXT,
    p_entity_id UUID
) RETURNS VOID AS $$
DECLARE
    v_summary TEXT;
    v_decisions TEXT[];
    v_participants INTEGER;
    v_comments INTEGER;
    v_unresolved INTEGER;
BEGIN
    -- Count statistics
    SELECT 
        COUNT(DISTINCT created_by),
        COUNT(*),
        COUNT(*) FILTER (WHERE resolved = false AND comment_type IN ('question', 'issue'))
    INTO v_participants, v_comments, v_unresolved
    FROM comments
    WHERE entity_type = p_entity_type
    AND entity_id = p_entity_id
    AND deleted_at IS NULL;
    
    -- Extract decisions
    SELECT ARRAY_AGG(comment_text)
    INTO v_decisions
    FROM comments
    WHERE

# Core Assets Management - Database Schema

## Overview

This document defines the database schema for managing information assets, which is foundational to risk management, compliance, and security programs. The system supports comprehensive asset inventory, classification, ownership, dependencies, and lifecycle management.

## Asset Management Workflow

### 1. Core Asset Management

#### Asset Inventory and Classification
- **Status**: Mandatory for Risk Management
- **Triggers**:
  - New system deployment
  - Infrastructure changes
  - Business process changes
  - Acquisition or merger
  - Regular inventory updates
  - Compliance requirements
- **Approval Requirements**:
  - Asset owner assignment
  - Classification approval
  - Critical asset designation
  - Decommissioning approval
- **Data Model Requirements**:
  - `assets` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_number`: TEXT UNIQUE NOT NULL -- Human-readable asset ID
    - `asset_name`: TEXT NOT NULL
    - `description`: TEXT
    - `asset_type`: ENUM('application', 'database', 'server', 'network_device', 'endpoint', 'cloud_service', 'data_store', 'physical', 'process', 'intangible')
    - `asset_subtype`: TEXT -- More specific categorization
    - `status`: ENUM('planned', 'active', 'inactive', 'decommissioning', 'decommissioned', 'archived')
    - `lifecycle_stage`: ENUM('planning', 'acquisition', 'deployment', 'operation', 'maintenance', 'disposal')
    - `criticality`: risk_level_enum DEFAULT 'medium'
    - `business_value`: ENUM('essential', 'high', 'medium', 'low', 'minimal')
    - `owner_id`: UUID REFERENCES users(id)
    - `custodian_id`: UUID REFERENCES users(id) -- Technical custodian
    - `department_id`: UUID REFERENCES lookup_options(id)
    - `location`: TEXT -- Physical or logical location
    - `environment`: ENUM('production', 'staging', 'development', 'test', 'dr', 'backup')
    - `deployment_date`: DATE
    - `last_review_date`: DATE
    - `next_review_date`: DATE
    - `decommission_date`: DATE
    - `purchase_date`: DATE
    - `purchase_cost`: DECIMAL(12,2)
    - `current_value`: DECIMAL(12,2)
    - `license_info`: JSONB -- License details if applicable
    - `technical_details`: JSONB -- Technical specifications
    - `tags`: TEXT[] -- Flexible tagging
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_license_info CHECK (jsonb_typeof(license_info) = 'object')
    - CONSTRAINT valid_technical_details CHECK (jsonb_typeof(technical_details) = 'object')
    - INDEX idx_assets_status (organization_id, status) WHERE deleted_at IS NULL
    - INDEX idx_assets_owner (owner_id, status) WHERE deleted_at IS NULL
  
  - `asset_classifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `classification_type`: ENUM('confidentiality', 'integrity', 'availability', 'privacy', 'regulatory')
    - `classification_level`: ENUM('public', 'internal', 'confidential', 'restricted', 'secret')
    - `classification_reason`: TEXT
    - `classified_by`: UUID REFERENCES users(id)
    - `classification_date`: DATE DEFAULT CURRENT_DATE
    - `review_date`: DATE
    - `declassification_date`: DATE -- When classification expires
    - `handling_requirements`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(asset_id, classification_type)
  
  - `asset_dependencies` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `dependent_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE -- Asset that depends
    - `dependency_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE -- Asset being depended on
    - `dependency_type`: ENUM('requires', 'uses', 'connects_to', 'stores_data_in', 'authenticates_with', 'backed_up_by')
    - `dependency_criticality`: ENUM('critical', 'important', 'standard', 'minimal')
    - `description`: TEXT
    - `is_single_point_of_failure`: BOOLEAN DEFAULT false
    - `has_failover`: BOOLEAN DEFAULT false
    - `failover_details`: TEXT
    - `validated_date`: DATE
    - `validated_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(dependent_asset_id, dependency_asset_id, dependency_type)
    - CONSTRAINT no_self_dependency CHECK (dependent_asset_id != dependency_asset_id)
    - INDEX idx_asset_deps_dependent (dependent_asset_id)
    - INDEX idx_asset_deps_dependency (dependency_asset_id)

#### Asset Components and Relationships
- **Status**: Core Feature
- **Triggers**:
  - Asset decomposition
  - System integration
  - Data flow mapping
  - Network topology changes
- **Data Model Requirements**:
  - `asset_components` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `parent_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `component_name`: TEXT NOT NULL
    - `component_type`: TEXT
    - `component_version`: TEXT
    - `is_critical`: BOOLEAN DEFAULT false
    - `vendor`: TEXT
    - `license_required`: BOOLEAN DEFAULT false
    - `end_of_support_date`: DATE
    - `configuration`: JSONB -- Component-specific config
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_configuration CHECK (jsonb_typeof(configuration) = 'object')
  
  - `asset_data_flows` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `source_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `destination_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `data_type`: TEXT NOT NULL -- Type of data flowing
    - `data_classification`: ENUM('public', 'internal', 'confidential', 'restricted', 'secret')
    - `flow_direction`: ENUM('unidirectional', 'bidirectional')
    - `protocol`: TEXT -- Communication protocol
    - `port`: INTEGER -- Network port if applicable
    - `encryption_in_transit`: BOOLEAN DEFAULT false
    - `encryption_method`: TEXT
    - `frequency`: ENUM('real_time', 'batch', 'on_demand', 'scheduled')
    - `volume_estimate`: TEXT -- Estimated data volume
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(source_asset_id, destination_asset_id, data_type)
  
  - `asset_access_permissions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `permission_type`: ENUM('read', 'write', 'execute', 'delete', 'admin', 'custom')
    - `grantee_type`: ENUM('user', 'role', 'group', 'service', 'external')
    - `grantee_id`: UUID -- ID of user/role/group
    - `grantee_name`: TEXT -- For external or service accounts
    - `access_level`: TEXT -- Specific access level details
    - `granted_date`: DATE DEFAULT CURRENT_DATE
    - `granted_by`: UUID REFERENCES users(id)
    - `expiry_date`: DATE
    - `last_reviewed`: DATE
    - `is_privileged`: BOOLEAN DEFAULT false
    - `justification`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

#### Asset Lifecycle Management
- **Status**: Core Feature
- **Triggers**:
  - Lifecycle stage transitions
  - Maintenance schedules
  - End-of-life planning
  - Disposal requirements
- **Data Model Requirements**:
  - `asset_lifecycle_events` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `event_type`: ENUM('created', 'deployed', 'updated', 'maintained', 'moved', 'reconfigured', 'incident', 'decommissioned')
    - `event_date`: TIMESTAMPTZ DEFAULT NOW()
    - `event_description`: TEXT NOT NULL
    - `previous_state`: JSONB -- State before event
    - `new_state`: JSONB -- State after event
    - `performed_by`: UUID REFERENCES users(id)
    - `approved_by`: UUID REFERENCES users(id)
    - `change_reference`: TEXT -- Change ticket/request number
    - `impact`: ENUM('none', 'minimal', 'moderate', 'significant', 'critical')
    - `downtime_minutes`: INTEGER
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - CONSTRAINT valid_previous_state CHECK (jsonb_typeof(previous_state) = 'object')
    - CONSTRAINT valid_new_state CHECK (jsonb_typeof(new_state) = 'object')
    - INDEX idx_lifecycle_events_asset (asset_id, event_date DESC)
  
  - `asset_maintenance_schedules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `maintenance_type`: ENUM('preventive', 'corrective', 'predictive', 'condition_based')
    - `schedule_name`: TEXT NOT NULL
    - `frequency`: ENUM('daily', 'weekly', 'monthly', 'quarterly', 'semi_annual', 'annual', 'as_needed')
    - `last_maintenance_date`: DATE
    - `next_maintenance_date`: DATE NOT NULL
    - `maintenance_window_hours`: INTEGER DEFAULT 4
    - `requires_downtime`: BOOLEAN DEFAULT true
    - `maintenance_procedure`: TEXT
    - `assigned_team`: TEXT
    - `estimated_cost`: DECIMAL(10,2)
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - INDEX idx_maintenance_next_date (next_maintenance_date, is_active)
  
  - `asset_disposal_records` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `disposal_date`: DATE DEFAULT CURRENT_DATE
    - `disposal_method`: ENUM('recycled', 'destroyed', 'donated', 'sold', 'returned', 'transferred')
    - `disposal_reason`: TEXT NOT NULL
    - `data_sanitization_method`: TEXT
    - `data_sanitization_verified`: BOOLEAN DEFAULT false
    - `verified_by`: UUID REFERENCES users(id)
    - `verification_date`: DATE
    - `disposal_certificate`: TEXT -- Reference to certificate
    - `disposal_vendor`: TEXT
    - `proceeds`: DECIMAL(10,2) -- If sold
    - `environmental_compliance`: BOOLEAN DEFAULT true
    - `final_approval_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields

#### Asset Monitoring and Metrics
- **Status**: Enhancement
- **Triggers**:
  - Performance monitoring
  - Availability tracking
  - Utilization analysis
  - Cost optimization
- **Data Model Requirements**:
  - `asset_metrics` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `metric_date`: DATE DEFAULT CURRENT_DATE
    - `availability_percentage`: DECIMAL(5,2)
    - `utilization_percentage`: DECIMAL(5,2)
    - `performance_score`: DECIMAL(5,2)
    - `incident_count`: INTEGER DEFAULT 0
    - `change_count`: INTEGER DEFAULT 0
    - `cost_to_date`: DECIMAL(12,2)
    - `compliance_score`: DECIMAL(5,2)
    - `risk_score`: DECIMAL(5,2)
    - `custom_metrics`: JSONB -- Additional metrics
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - CONSTRAINT valid_custom_metrics CHECK (jsonb_typeof(custom_metrics) = 'object')
    - UNIQUE(asset_id, metric_date)

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_assets_criticality ON assets (criticality, status) 
    WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_assets_environment ON assets (environment, asset_type) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_review ON assets (next_review_date) 
    WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_classifications_level ON asset_classifications (classification_level, asset_id);
CREATE INDEX idx_dependencies_spof ON asset_dependencies (is_single_point_of_failure) 
    WHERE is_single_point_of_failure = true;
CREATE INDEX idx_data_flows_classification ON asset_data_flows (data_classification) 
    WHERE is_active = true;

-- GIN indexes for JSONB and array fields
CREATE INDEX idx_assets_tags ON assets USING GIN (tags);
CREATE INDEX idx_assets_technical ON assets USING GIN (technical_details);
CREATE INDEX idx_components_config ON asset_components USING GIN (configuration);
CREATE INDEX idx_lifecycle_states ON asset_lifecycle_events USING GIN (previous_state, new_state);
```

## Functions and Triggers

```sql
-- Function to generate asset number
CREATE OR REPLACE FUNCTION generate_asset_number(
    p_organization_id UUID,
    p_asset_type asset_type_enum
) RETURNS TEXT AS $$
DECLARE
    v_org_code TEXT;
    v_type_code TEXT;
    v_year TEXT;
    v_sequence INTEGER;
BEGIN
    -- Get organization code
    SELECT UPPER(LEFT(name, 3)) INTO v_org_code
    FROM organizations WHERE id = p_organization_id;
    
    -- Determine type code
    v_type_code := CASE p_asset_type
        WHEN 'application' THEN 'APP'
        WHEN 'database' THEN 'DB'
        WHEN 'server' THEN 'SRV'
        WHEN 'network_device' THEN 'NET'
        WHEN 'endpoint' THEN 'END'
        WHEN 'cloud_service' THEN 'CLD'
        WHEN 'data_store' THEN 'DAT'
        WHEN 'physical' THEN 'PHY'
        WHEN 'process' THEN 'PRC'
        WHEN 'intangible' THEN 'INT'
    END;
    
    -- Get current year
    v_year := TO_CHAR(NOW(), 'YY');
    
    -- Get next sequence
    SELECT COALESCE(MAX(CAST(SUBSTRING(asset_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM assets
    WHERE organization_id = p_organization_id
    AND asset_number LIKE v_org_code || '-' || v_type_code || '-' || v_year || '-%';
    
    RETURN v_org_code || '-' || v_type_code || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to set asset number
CREATE OR REPLACE FUNCTION set_asset_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.asset_number IS NULL THEN
        NEW.asset_number := generate_asset_number(NEW.organization_id, NEW.asset_type);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_asset_number_trigger
    BEFORE INSERT ON assets
    FOR EACH ROW
    EXECUTE FUNCTION set_asset_number();

-- Function to check circular dependencies
CREATE OR REPLACE FUNCTION check_circular_asset_dependency()
RETURNS TRIGGER AS $$
DECLARE
    has_circular BOOLEAN;
BEGIN
    WITH RECURSIVE dep_chain AS (
        SELECT dependency_asset_id, dependent_asset_id
        FROM asset_dependencies
        WHERE dependent_asset_id = NEW.dependency_asset_id
        
        UNION ALL
        
        SELECT ad.dependency_asset_id, ad.dependent_asset_id
        FROM asset_dependencies ad
        JOIN dep_chain dc ON ad.dependent_asset_id = dc.dependency_asset_id
    )
    SELECT EXISTS (
        SELECT 1 FROM dep_chain 
        WHERE dependency_asset_id = NEW.dependent_asset_id
    ) INTO has_circular;
    
    IF has_circular THEN
        RAISE EXCEPTION 'Circular dependency detected between assets';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_circular_asset_dependencies
    BEFORE INSERT OR UPDATE ON asset_dependencies
    FOR EACH ROW
    EXECUTE FUNCTION check_circular_asset_dependency();

-- Function to calculate asset risk score
CREATE OR REPLACE FUNCTION calculate_asset_risk_score(
    p_asset_id UUID
) RETURNS DECIMAL AS $$
DECLARE
    v_criticality_score INTEGER;
    v_classification_score INTEGER;
    v_dependency_score INTEGER;
    v_vulnerability_score INTEGER;
    v_total_score DECIMAL;
BEGIN
    -- Get criticality score (1-5)
    SELECT CASE criticality
        WHEN 'critical' THEN 5
        WHEN 'high' THEN 4
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 2
        WHEN 'negligible' THEN 1
    END INTO v_criticality_score
    FROM assets WHERE id = p_asset_id;
    
    -- Get highest classification score (1-5)
    SELECT COALESCE(MAX(CASE classification_level
        WHEN 'secret' THEN 5
        WHEN 'restricted' THEN 4
        WHEN 'confidential' THEN 3
        WHEN 'internal' THEN 2
        WHEN 'public' THEN 1
    END), 1) INTO v_classification_score
    FROM asset_classifications
    WHERE asset_id = p_asset_id;
    
    -- Get dependency score based on SPOF
    SELECT CASE 
        WHEN COUNT(*) FILTER (WHERE is_single_point_of_failure = true) > 0 THEN 5
        WHEN COUNT(*) FILTER (WHERE dependency_criticality = 'critical') > 0 THEN 4
        WHEN COUNT(*) > 5 THEN 3
        WHEN COUNT(*) > 0 THEN 2
        ELSE 1
    END INTO v_dependency_score
    FROM asset_dependencies
    WHERE dependent_asset_id = p_asset_id;
    
    -- Get vulnerability score (would integrate with vulnerability data)
    v_vulnerability_score := 3; -- Placeholder
    
    -- Calculate weighted average
    v_total_score := (
        v_criticality_score * 0.35 +
        v_classification_score * 0.30 +
        v_dependency_score * 0.20 +
        v_vulnerability_score * 0.15
    );
    
    RETURN ROUND(v_total_score * 20, 2); -- Convert to 0-100 scale
END;
$$ LANGUAGE plpgsql;

-- Function to log lifecycle events
CREATE OR REPLACE FUNCTION log_asset_lifecycle_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO asset_lifecycle_events (
            asset_id,
            event_type,
            event_description,
            previous_state,
            new_state,
            performed_by,
            organization_id
        ) VALUES (
            NEW.id,
            CASE 
                WHEN NEW.status = 'decommissioned' THEN 'decommissioned'
                WHEN NEW.status = 'active' AND OLD.status = 'planned' THEN 'deployed'
                ELSE 'updated'
            END,
            'Asset status changed from ' || OLD.status || ' to ' || NEW.status,
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status),
            NEW.updated_by,
            NEW.organization_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER asset_lifecycle_logging_trigger
    AFTER UPDATE ON assets
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION log_asset_lifecycle_event();
```

## UI Integration

- **Primary Screens**:
  - **Asset Inventory** for comprehensive asset listing
  - **Asset Dashboard** for metrics and overview
  - **Asset Form** for detailed asset management
  - **Classification Wizard** for asset classification
  - **Dependency Mapper** for visualizing relationships
  - **Data Flow Diagram** for data flow visualization
  - **Lifecycle Timeline** for asset history
  - **Maintenance Calendar** for scheduled maintenance
  - **Disposal Tracker** for decommissioning

- **Integration Points**:
  - Risk management for asset risks
  - Vulnerability management integration
  - Incident management for asset incidents
  - Change management for asset changes
  - CMDB integration for configuration
  - Cost management for TCO tracking
  - Compliance mapping for requirements
  - Business continuity for critical assets

## Asset Management Features

1. **Discovery and Inventory**:
   - Automated discovery integration
   - Manual asset registration
   - Bulk import capabilities
   - Regular inventory reconciliation

2. **Relationship Mapping**:
   - Visual dependency mapping
   - Impact analysis tools
   - Critical path identification
   - Single point of failure detection

3. **Lifecycle Management**:
   - Automated lifecycle transitions
   - Maintenance scheduling
   - End-of-life planning
   - Disposal compliance

4. **Integration Capabilities**:
   - CMDB synchronization
   - Vulnerability scanner integration
   - Monitoring tool integration
   - Financial system integration


# Audit Engagement Management - Database Schema

## Overview

This document defines the database schema for managing internal and external audit engagements, including audit planning, execution, findings, and follow-up activities. The system supports various audit types and methodologies while maintaining comprehensive audit trails for compliance evidence.

## Audit Management Workflow

### 1. Core Audit Engagement Management

#### Audit Planning and Scheduling
- **Status**: Mandatory for Compliance Programs
- **Triggers**:
  - Annual audit calendar
  - Risk-based audit requirements
  - Regulatory requirements
  - Management requests
  - Incident-driven audits
  - Certification requirements
- **Approval Requirements**:
  - Audit plan approval
  - Resource allocation approval
  - Scope approval by process owners
  - External auditor approval (if applicable)
- **Data Model Requirements**:
  - `audit_engagements` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `audit_number`: TEXT UNIQUE NOT NULL -- Human-readable audit ID
    - `audit_name`: TEXT NOT NULL
    - `audit_type`: ENUM('internal', 'external', 'certification', 'regulatory', 'supplier', 'special')
    - `audit_category`: ENUM('compliance', 'operational', 'financial', 'it', 'quality', 'integrated')
    - `status`: ENUM('planned', 'preparation', 'fieldwork', 'reporting', 'completed', 'cancelled', 'follow_up')
    - `priority`: priority_enum DEFAULT 'medium'
    - `risk_based`: BOOLEAN DEFAULT true -- Is this risk-based audit
    - `recurrence`: ENUM('one_time', 'annual', 'semi_annual', 'quarterly', 'triggered')
    - `lead_auditor_id`: UUID REFERENCES users(id)
    - `audit_team`: UUID[] -- Array of team member IDs
    - `auditee_departments`: TEXT[] -- Departments being audited
    - `process_owners`: UUID[] -- Process owner user IDs
    - `objectives`: TEXT NOT NULL
    - `scope`: TEXT NOT NULL
    - `out_of_scope`: TEXT -- Explicitly excluded items
    - `methodology`: TEXT
    - `criteria`: TEXT[] -- Standards, regulations, policies
    - `planned_start_date`: DATE NOT NULL
    - `planned_end_date`: DATE NOT NULL
    - `actual_start_date`: DATE
    - `actual_end_date`: DATE
    - `fieldwork_start_date`: DATE
    - `fieldwork_end_date`: DATE
    - `estimated_hours`: INTEGER
    - `actual_hours`: INTEGER
    - `budget`: DECIMAL(10,2)
    - `actual_cost`: DECIMAL(10,2)
    - `opening_meeting_date`: TIMESTAMPTZ
    - `closing_meeting_date`: TIMESTAMPTZ
    - `report_due_date`: DATE
    - `report_issued_date`: DATE
    - `follow_up_due_date`: DATE
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_dates CHECK (planned_start_date <= planned_end_date)
    - INDEX idx_audit_engagements_status (organization_id, status) WHERE deleted_at IS NULL
  
  - `audit_programs` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `program_name`: TEXT NOT NULL
    - `description`: TEXT
    - `audit_type`: ENUM('internal', 'external', 'certification', 'regulatory', 'supplier', 'special')
    - `applicable_standards`: TEXT[] -- ISO 27001, SOC2, etc.
    - `is_template`: BOOLEAN DEFAULT true
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
  
  - `audit_checklists` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `engagement_id`: UUID REFERENCES audit_engagements(id) ON DELETE CASCADE
    - `program_id`: UUID REFERENCES audit_programs(id)
    - `checklist_name`: TEXT NOT NULL
    - `version`: INTEGER DEFAULT 1
    - `status`: ENUM('draft', 'approved', 'in_use', 'completed')
    - `approved_by`: UUID REFERENCES users(id)
    - `approved_date`: DATE
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

#### Audit Execution
- **Status**: Core Feature
- **Triggers**:
  - Audit start date
  - Checklist completion
  - Evidence collection
  - Finding identification
  - Audit completion
- **Data Model Requirements**:
  - `audit_checklist_items` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `checklist_id`: UUID REFERENCES audit_checklists(id) ON DELETE CASCADE
    - `section`: TEXT -- Grouping/section name
    - `item_number`: TEXT NOT NULL -- e.g., "A.5.1.1"
    - `requirement`: TEXT NOT NULL -- What is being checked
    - `guidance`: TEXT -- How to verify
    - `evidence_required`: TEXT -- What evidence to collect
    - `risk_level`: risk_level_enum DEFAULT 'medium'
    - `status`: ENUM('not_started', 'in_progress', 'completed', 'not_applicable')
    - `compliance_status`: ENUM('compliant', 'non_compliant', 'observation', 'not_determined', 'not_applicable')
    - `auditor_id`: UUID REFERENCES users(id) -- Assigned auditor
    - `tested_date`: DATE
    - `testing_method`: ENUM('inquiry', 'observation', 'inspection', 'reperformance', 'analytical')
    - `sample_size`: INTEGER
    - `sample_selection`: TEXT -- How sample was selected
    - `test_results`: TEXT -- Detailed test results
    - `evidence_collected`: JSONB -- References to evidence
    - `notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_evidence CHECK (jsonb_typeof(evidence_collected) = 'object')
    - INDEX idx_checklist_items_status (checklist_id, status)
    - UNIQUE(checklist_id, item_number)
  
  - `audit_findings` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `finding_number`: TEXT NOT NULL -- Unique within engagement
    - `engagement_id`: UUID REFERENCES audit_engagements(id) ON DELETE CASCADE
    - `checklist_item_id`: UUID REFERENCES audit_checklist_items(id)
    - `finding_type`: ENUM('non_conformity', 'observation', 'improvement_opportunity', 'positive_finding')
    - `severity`: risk_level_enum DEFAULT 'medium'
    - `title`: TEXT NOT NULL
    - `description`: TEXT NOT NULL -- Detailed finding description
    - `criteria`: TEXT NOT NULL -- Requirement not met
    - `condition`: TEXT NOT NULL -- Current state
    - `cause`: TEXT -- Why it occurred
    - `effect`: TEXT -- Impact/risk
    - `recommendation`: TEXT NOT NULL
    - `management_response`: TEXT
    - `responsible_party_id`: UUID REFERENCES users(id)
    - `target_date`: DATE -- For remediation
    - `status`: ENUM('draft', 'pending_review', 'accepted', 'disputed', 'closed')
    - `corrective_action_required`: BOOLEAN DEFAULT true
    - `corrective_action_plan_id`: UUID -- Link to CAPA
    - `repeat_finding`: BOOLEAN DEFAULT false
    - `previous_finding_ref`: TEXT -- Reference to previous finding
    - `evidence_references`: JSONB -- Supporting evidence
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_evidence_refs CHECK (jsonb_typeof(evidence_references) = 'object')
    - UNIQUE(engagement_id, finding_number)
    - INDEX idx_audit_findings_status (engagement_id, status)
  
  - `audit_evidence` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `engagement_id`: UUID REFERENCES audit_engagements(id) ON DELETE CASCADE
    - `evidence_number`: TEXT NOT NULL -- Unique reference number
    - `evidence_type`: ENUM('document', 'screenshot', 'photo', 'report', 'log', 'interview', 'observation')
    - `title`: TEXT NOT NULL
    - `description`: TEXT
    - `source`: TEXT -- Where/who it came from
    - `collection_date`: DATE DEFAULT CURRENT_DATE
    - `collected_by`: UUID REFERENCES users(id)
    - `file_path`: TEXT
    - `file_size`: BIGINT
    - `mime_type`: TEXT
    - `retention_period`: INTEGER -- Days to retain
    - `is_confidential`: BOOLEAN DEFAULT false
    - `related_items`: JSONB -- Links to findings, checklist items
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_related_items CHECK (jsonb_typeof(related_items) = 'object')
    - UNIQUE(engagement_id, evidence_number)
  
  - `audit_interviews` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `engagement_id`: UUID REFERENCES audit_engagements(id) ON DELETE CASCADE
    - `interviewee_name`: TEXT NOT NULL
    - `interviewee_role`: TEXT
    - `interview_date`: TIMESTAMPTZ NOT NULL
    - `duration_minutes`: INTEGER
    - `interviewer_id`: UUID REFERENCES users(id)
    - `additional_attendees`: JSONB -- Other attendees
    - `topics_covered`: TEXT[]
    - `key_points`: TEXT NOT NULL
    - `follow_up_required`: BOOLEAN DEFAULT false
    - `follow_up_items`: TEXT
    - `interview_notes_path`: TEXT -- Path to detailed notes
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_attendees CHECK (jsonb_typeof(additional_attendees) = 'object')

#### Audit Reporting
- **Status**: Mandatory
- **Triggers**:
  - Fieldwork completion
  - Finding finalization
  - Management responses
  - Report generation
- **Data Model Requirements**:
  - `audit_reports` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `engagement_id`: UUID REFERENCES audit_engagements(id) ON DELETE CASCADE
    - `report_type`: ENUM('draft', 'final', 'executive_summary', 'detailed', 'certificate')
    - `version`: INTEGER DEFAULT 1
    - `status`: ENUM('draft', 'review', 'approved', 'issued')
    - `executive_summary`: TEXT
    - `overall_conclusion`: ENUM('satisfactory', 'needs_improvement', 'unsatisfactory', 'qualified', 'unqualified')
    - `key_findings_summary`: TEXT
    - `recommendations_summary`: TEXT
    - `report_date`: DATE DEFAULT CURRENT_DATE
    - `issued_to`: JSONB -- Recipients list
    - `report_path`: TEXT -- Generated report file
    - `template_used`: TEXT -- Report template reference
    - `reviewed_by`: UUID REFERENCES users(id)
    - `review_date`: DATE
    - `approved_by`: UUID REFERENCES users(id)
    - `approval_date`: DATE
    - `distribution_list`: JSONB -- Who received the report
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_issued_to CHECK (jsonb_typeof(issued_to) = 'object')
    - CONSTRAINT valid_distribution CHECK (jsonb_typeof(distribution_list) = 'object')
  
  - `audit_action_items` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `engagement_id`: UUID REFERENCES audit_engagements(id) ON DELETE CASCADE
    - `finding_id`: UUID REFERENCES audit_findings(id)
    - `action_description`: TEXT NOT NULL
    - `responsible_party_id`: UUID REFERENCES users(id)
    - `due_date`: DATE NOT NULL
    - `status`: ENUM('open', 'in_progress', 'completed', 'overdue', 'cancelled')
    - `completion_date`: DATE
    - `completion_evidence`: TEXT
    - `follow_up_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - INDEX idx_action_items_status (responsible_party_id, status)

#### Audit Follow-up
- **Status**: Core Feature
- **Triggers**:
  - Follow-up schedule
  - Action item due dates
  - Verification requirements
  - Management requests
- **Data Model Requirements**:
  - `audit_follow_ups` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `engagement_id`: UUID REFERENCES audit_engagements(id) ON DELETE CASCADE
    - `follow_up_number`: INTEGER DEFAULT 1
    - `follow_up_date`: DATE DEFAULT CURRENT_DATE
    - `follow_up_type`: ENUM('scheduled', 'action_verification', 'closure', 'escalation')
    - `performed_by`: UUID REFERENCES users(id)
    - `findings_reviewed`: UUID[] -- Array of finding IDs reviewed
    - `open_items_count`: INTEGER DEFAULT 0
    - `closed_items_count`: INTEGER DEFAULT 0
    - `new_issues_identified`: BOOLEAN DEFAULT false
    - `overall_progress`: ENUM('on_track', 'delayed', 'at_risk', 'completed')
    - `notes`: TEXT
    - `next_follow_up_date`: DATE
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_audit_engagements_dates ON audit_engagements (planned_start_date, status) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_engagements_lead ON audit_engagements (lead_auditor_id, status) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_findings_severity ON audit_findings (engagement_id, severity) 
    WHERE status != 'closed';
CREATE INDEX idx_audit_evidence_engagement ON audit_evidence (engagement_id, evidence_type) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_action_overdue ON audit_action_items (due_date, status) 
    WHERE status NOT IN ('completed', 'cancelled');

-- GIN indexes for JSONB and array fields
CREATE INDEX idx_audit_team ON audit_engagements USING GIN (audit_team);
CREATE INDEX idx_audit_criteria ON audit_engagements USING GIN (criteria);
CREATE INDEX idx_evidence_related ON audit_evidence USING GIN (related_items);
CREATE INDEX idx_findings_evidence ON audit_findings USING GIN (evidence_references);
```

## Functions and Triggers

```sql
-- Function to generate audit number
CREATE OR REPLACE FUNCTION generate_audit_number(
    p_organization_id UUID,
    p_audit_type audit_type_enum
) RETURNS TEXT AS $$
DECLARE
    v_prefix TEXT;
    v_year TEXT;
    v_sequence INTEGER;
BEGIN
    -- Determine prefix based on audit type
    v_prefix := CASE p_audit_type
        WHEN 'internal' THEN 'IA'
        WHEN 'external' THEN 'EA'
        WHEN 'certification' THEN 'CA'
        WHEN 'regulatory' THEN 'RA'
        WHEN 'supplier' THEN 'SA'
        WHEN 'special' THEN 'SP'
    END;
    
    -- Get current year
    v_year := TO_CHAR(NOW(), 'YYYY');
    
    -- Get next sequence number
    SELECT COALESCE(MAX(CAST(SUBSTRING(audit_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM audit_engagements
    WHERE organization_id = p_organization_id
    AND audit_number LIKE v_prefix || '-' || v_year || '-%';
    
    RETURN v_prefix || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to set audit number
CREATE OR REPLACE FUNCTION set_audit_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.audit_number IS NULL THEN
        NEW.audit_number := generate_audit_number(NEW.organization_id, NEW.audit_type);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_audit_number_trigger
    BEFORE INSERT ON audit_engagements
    FOR EACH ROW
    EXECUTE FUNCTION set_audit_number();

-- Function to generate finding number
CREATE OR REPLACE FUNCTION generate_finding_number(
    p_engagement_id UUID
) RETURNS TEXT AS $$
DECLARE
    v_audit_number TEXT;
    v_sequence INTEGER;
BEGIN
    -- Get audit number
    SELECT audit_number INTO v_audit_number
    FROM audit_engagements
    WHERE id = p_engagement_id;
    
    -- Get next sequence
    SELECT COALESCE(MAX(CAST(SUBSTRING(finding_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM audit_findings
    WHERE engagement_id = p_engagement_id;
    
    RETURN v_audit_number || '-F' || LPAD(v_sequence::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to update engagement status
CREATE OR REPLACE FUNCTION update_audit_engagement_status()
RETURNS TRIGGER AS $$
DECLARE
    v_total_items INTEGER;
    v_completed_items INTEGER;
    v_findings_count INTEGER;
    v_status TEXT;
BEGIN
    -- Count checklist items
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'completed')
    INTO v_total_items, v_completed_items
    FROM audit_checklist_items aci
    JOIN audit_checklists ac ON aci.checklist_id = ac.id
    WHERE ac.engagement_id = NEW.engagement_id;
    
    -- Count findings
    SELECT COUNT(*)
    INTO v_findings_count
    FROM audit_findings
    WHERE engagement_id = NEW.engagement_id
    AND status NOT IN ('draft', 'disputed');
    
    -- Determine status
    IF v_completed_items = 0 THEN
        v_status := 'preparation';
    ELSIF v_completed_items < v_total_items THEN
        v_status := 'fieldwork';
    ELSIF v_findings_count > 0 AND NOT EXISTS (
        SELECT 1 FROM audit_reports 
        WHERE engagement_id = NEW.engagement_id 
        AND status = 'issued'
    ) THEN
        v_status := 'reporting';
    ELSE
        v_status := 'completed';
    END IF;
    
    -- Update engagement
    UPDATE audit_engagements
    SET status = v_status,
        updated_at = NOW()
    WHERE id = NEW.engagement_id
    AND status != v_status;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_engagement_status_trigger
    AFTER INSERT OR UPDATE ON audit_checklist_items
    FOR EACH ROW
    EXECUTE FUNCTION update_audit_engagement_status();

-- Function to calculate audit metrics
CREATE OR REPLACE FUNCTION calculate_audit_metrics(
    p_engagement_id UUID
) RETURNS TABLE (
    total_checks INTEGER,
    completed_checks INTEGER,
    compliance_rate DECIMAL,
    findings_count INTEGER,
    high_risk_findings INTEGER,
    overdue_actions INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT aci.id)::INTEGER,
        COUNT(DISTINCT aci.id) FILTER (WHERE aci.status = 'completed')::INTEGER,
        ROUND(
            COUNT(DISTINCT aci.id) FILTER (WHERE aci.compliance_status = 'compliant')::DECIMAL / 
            NULLIF(COUNT(DISTINCT aci.id) FILTER (WHERE aci.status = 'completed'), 0) * 100, 
            2
        ),
        COUNT(DISTINCT af.id)::INTEGER,
        COUNT(DISTINCT af.id) FILTER (WHERE af.severity = 'high' OR af.severity = 'critical')::INTEGER,
        COUNT(DISTINCT aai.id) FILTER (WHERE aai.status = 'overdue')::INTEGER
    FROM audit_engagements ae
    LEFT JOIN audit_checklists ac ON ae.id = ac.engagement_id
    LEFT JOIN audit_checklist_items aci ON ac.id = aci.checklist_id
    LEFT JOIN audit_findings af ON ae.id = af.engagement_id
    LEFT JOIN audit_action_items aai ON ae.id = aai.engagement_id
    WHERE ae.id = p_engagement_id
    GROUP BY ae.id;
END;
$$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **Audit Calendar** for planning and scheduling
  - **Audit Dashboard** for engagement overview
  - **Audit Planning Form** for engagement setup
  - **Audit Checklist** for execution
  - **Finding Form** for documenting findings
  - **Evidence Manager** for evidence collection
  - **Interview Tracker** for interview management
  - **Report Builder** for audit reports
  - **Follow-up Tracker** for action monitoring
  - **Analytics Dashboard** for audit metrics

- **Integration Points**:
  - Risk register for risk-based auditing
  - Control framework for audit criteria
  - CAPA system for findings
  - Document management for evidence
  - Task management for action items
  - Calendar integration for scheduling
  - Notification system for updates
  - Compliance dashboard integration

## Audit Program Features

1. **Risk-Based Auditing**:
   - Risk assessment integration
   - Audit universe management
   - Priority-based scheduling
   - Resource optimization

2. **Quality Assurance**:
   - Audit program peer review
   - Working paper standards
   - Evidence quality checks
   - Report quality review

3. **Continuous Auditing**:
   - Automated testing capabilities
   - Real-time monitoring
   - Exception reporting
   - Trend analysis

4. **External Audit Support**:
   - Document request management
   - Evidence preparation
   - Finding response tracking
   - Certification support

# Corrective Action Management - Database Schema

## Overview

This document defines the database schema for managing corrective and preventive actions (CAPA) arising from audits, incidents, non-conformities, and continuous improvement initiatives. The system supports the full lifecycle from root cause analysis through implementation and effectiveness verification.

## Corrective Action Workflow

### 1. Core Corrective Action Management

#### Corrective Action Planning
- **Status**: Mandatory for Compliance
- **Triggers**:
  - Audit findings (internal/external)
  - Non-conformities
  - Incident investigations
  - Customer complaints
  - Risk assessment outcomes
  - Management review actions
  - Regulatory observations
- **Approval Requirements**:
  - Action plan approval by process owner
  - Resource allocation approval
  - Timeline approval by management
  - Effectiveness criteria approval
- **Data Model Requirements**:
  - `corrective_action_plans` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_number`: TEXT UNIQUE NOT NULL -- Human-readable CA number
    - `title`: TEXT NOT NULL
    - `description`: TEXT NOT NULL
    - `action_type`: ENUM('corrective', 'preventive', 'improvement', 'remedial')
    - `priority`: priority_enum DEFAULT 'high'
    - `status`: ENUM('draft', 'pending_approval', 'approved', 'in_progress', 'verification', 'completed', 'cancelled', 'overdue')
    - `source_type`: ENUM('audit_finding', 'incident', 'risk_assessment', 'complaint', 'management_review', 'regulatory', 'other')
    - `source_reference_id`: UUID -- ID of source record
    - `source_reference_type`: TEXT -- Table name of source
    - `root_cause_required`: BOOLEAN DEFAULT true
    - `risk_level`: risk_level_enum
    - `compliance_impact`: BOOLEAN DEFAULT false
    - `regulatory_required`: BOOLEAN DEFAULT false
    - `plan_owner_id`: UUID REFERENCES users(id)
    - `plan_approver_id`: UUID REFERENCES users(id)
    - `approval_date`: TIMESTAMPTZ
    - `planned_start_date`: DATE
    - `planned_completion_date`: DATE NOT NULL
    - `actual_start_date`: DATE
    - `actual_completion_date`: DATE
    - `estimated_cost`: DECIMAL(10,2)
    - `actual_cost`: DECIMAL(10,2)
    - `effectiveness_criteria`: TEXT NOT NULL -- How to measure success
    - `verification_method`: TEXT -- How to verify effectiveness
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_dates CHECK (planned_start_date IS NULL OR planned_start_date <= planned_completion_date)
    - INDEX idx_ca_plans_status (organization_id, status) WHERE deleted_at IS NULL
  
  - `root_cause_analyses` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_id`: UUID REFERENCES corrective_action_plans(id) ON DELETE CASCADE
    - `analysis_method`: ENUM('5_whys', 'fishbone', 'fault_tree', 'pareto', 'fmea', 'other')
    - `problem_statement`: TEXT NOT NULL
    - `analysis_date`: DATE DEFAULT CURRENT_DATE
    - `led_by_id`: UUID REFERENCES users(id)
    - `participants`: UUID[] -- Array of user IDs who participated
    - `analysis_data`: JSONB NOT NULL -- Structured analysis results
    - `root_causes_identified`: TEXT[] NOT NULL
    - `contributing_factors`: TEXT[]
    - `systemic_issues`: BOOLEAN DEFAULT false
    - `recommendations`: TEXT[]
    - `supporting_evidence`: JSONB -- Links to documents, data, etc.
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_analysis_data CHECK (jsonb_typeof(analysis_data) = 'object')
    - CONSTRAINT valid_supporting_evidence CHECK (jsonb_typeof(supporting_evidence) = 'object')
  
  - `corrective_actions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_id`: UUID REFERENCES corrective_action_plans(id) ON DELETE CASCADE
    - `action_number`: INTEGER NOT NULL -- Sequence within plan
    - `action_title`: TEXT NOT NULL
    - `action_description`: TEXT NOT NULL
    - `action_type`: ENUM('immediate', 'short_term', 'long_term', 'systemic')
    - `responsible_user_id`: UUID REFERENCES users(id)
    - `target_root_cause`: TEXT -- Which root cause this addresses
    - `status`: ENUM('not_started', 'in_progress', 'completed', 'verified', 'ineffective', 'cancelled')
    - `planned_start_date`: DATE
    - `planned_completion_date`: DATE NOT NULL
    - `actual_start_date`: DATE
    - `actual_completion_date`: DATE
    - `completion_percentage`: INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
    - `resources_required`: TEXT
    - `constraints`: TEXT
    - `success_criteria`: TEXT NOT NULL
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(plan_id, action_number)
    - INDEX idx_corrective_actions_responsible (responsible_user_id, status)

#### Action Implementation and Tracking
- **Status**: Mandatory
- **Triggers**:
  - Plan approval
  - Task assignments
  - Progress updates
  - Milestone achievements
  - Blocker identification
- **Data Model Requirements**:
  - `corrective_action_tasks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `action_id`: UUID REFERENCES corrective_actions(id) ON DELETE CASCADE
    - `task_title`: TEXT NOT NULL
    - `task_description`: TEXT
    - `assigned_to_id`: UUID REFERENCES users(id)
    - `task_type`: ENUM('implementation', 'verification', 'documentation', 'training', 'communication')
    - `status`: ENUM('pending', 'in_progress', 'completed', 'blocked', 'cancelled')
    - `priority`: priority_enum DEFAULT 'medium'
    - `due_date`: TIMESTAMPTZ
    - `completed_date`: TIMESTAMPTZ
    - `estimated_hours`: DECIMAL(5,2)
    - `actual_hours`: DECIMAL(5,2)
    - `blocker_description`: TEXT
    - `completion_evidence`: JSONB -- Links to evidence of completion
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_completion_evidence CHECK (jsonb_typeof(completion_evidence) = 'object')
    - INDEX idx_ca_tasks_assignee (assigned_to_id, status) WHERE status NOT IN ('completed', 'cancelled')
  
  - `corrective_action_updates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_id`: UUID REFERENCES corrective_action_plans(id) ON DELETE CASCADE
    - `action_id`: UUID REFERENCES corrective_actions(id) -- Specific action if applicable
    - `update_type`: ENUM('progress', 'milestone', 'issue', 'change_request', 'completion')
    - `update_date`: TIMESTAMPTZ DEFAULT NOW()
    - `description`: TEXT NOT NULL
    - `old_values`: JSONB -- What changed
    - `new_values`: JSONB -- New values
    - `impact`: ENUM('none', 'minor', 'major', 'critical')
    - `requires_approval`: BOOLEAN DEFAULT false
    - `approved_by`: UUID REFERENCES users(id)
    - `approval_date`: TIMESTAMPTZ
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`: UUID REFERENCES users(id)
    - CONSTRAINT valid_old_values CHECK (jsonb_typeof(old_values) = 'object')
    - CONSTRAINT valid_new_values CHECK (jsonb_typeof(new_values) = 'object')
  
  - `corrective_action_evidence` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_id`: UUID REFERENCES corrective_action_plans(id) ON DELETE CASCADE
    - `action_id`: UUID REFERENCES corrective_actions(id)
    - `evidence_type`: ENUM('implementation', 'effectiveness', 'training', 'communication', 'other')
    - `evidence_name`: TEXT NOT NULL
    - `description`: TEXT
    - `file_path`: TEXT
    - `external_reference`: TEXT -- Link to external system
    - `collection_date`: DATE DEFAULT CURRENT_DATE
    - `collected_by`: UUID REFERENCES users(id)
    - `is_verified`: BOOLEAN DEFAULT false
    - `verified_by`: UUID REFERENCES users(id)
    - `verified_date`: DATE
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields

#### Effectiveness Verification
- **Status**: Mandatory
- **Triggers**:
  - Action completion
  - Verification schedule
  - Follow-up audits
  - Metric achievements
- **Data Model Requirements**:
  - `effectiveness_verifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_id`: UUID REFERENCES corrective_action_plans(id) ON DELETE CASCADE
    - `verification_date`: DATE DEFAULT CURRENT_DATE
    - `verification_type`: ENUM('immediate', '30_day', '60_day', '90_day', 'annual')
    - `verified_by`: UUID REFERENCES users(id)
    - `verification_method_used`: TEXT NOT NULL
    - `effectiveness_rating`: ENUM('effective', 'partially_effective', 'ineffective', 'too_early')
    - `objective_evidence`: TEXT NOT NULL -- What was reviewed
    - `metrics_achieved`: JSONB -- Quantitative results
    - `gaps_identified`: TEXT[]
    - `additional_actions_required`: BOOLEAN DEFAULT false
    - `recommendations`: TEXT
    - `next_verification_date`: DATE
    - `final_approval`: BOOLEAN DEFAULT false
    - `approved_by`: UUID REFERENCES users(id)
    - `approval_date`: DATE
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_metrics CHECK (jsonb_typeof(metrics_achieved) = 'object')
  
  - `effectiveness_metrics` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_id`: UUID REFERENCES corrective_action_plans(id) ON DELETE CASCADE
    - `metric_name`: TEXT NOT NULL
    - `metric_type`: ENUM('quantitative', 'qualitative', 'compliance', 'performance')
    - `target_value`: TEXT NOT NULL
    - `measurement_method`: TEXT
    - `baseline_value`: TEXT -- Value before action
    - `current_value`: TEXT
    - `measurement_date`: DATE
    - `target_achieved`: BOOLEAN DEFAULT false
    - `data_source`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

#### Corrective Action Reporting
- **Status**: Core Feature
- **Triggers**:
  - Management review
  - Audit preparation
  - Regulatory reporting
  - Performance analysis
- **Data Model Requirements**:
  - `corrective_action_metrics` table (materialized view):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_date`: DATE NOT NULL
    - `organization_id`: UUID REFERENCES organizations(id)
    - `total_plans`: INTEGER DEFAULT 0
    - `plans_on_time`: INTEGER DEFAULT 0
    - `plans_overdue`: INTEGER DEFAULT 0
    - `plans_effective`: INTEGER DEFAULT 0
    - `plans_ineffective`: INTEGER DEFAULT 0
    - `average_completion_days`: DECIMAL(5,2)
    - `by_source_type`: JSONB -- Breakdown by source
    - `by_action_type`: JSONB -- Breakdown by type
    - `by_department`: JSONB -- Breakdown by department
    - `cost_variance`: DECIMAL(10,2) -- Actual vs planned cost
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(metric_date, organization_id)

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_ca_plans_overdue ON corrective_action_plans (planned_completion_date, status) 
    WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_ca_plans_source ON corrective_action_plans (source_type, source_reference_id) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_corrective_actions_plan ON corrective_actions (plan_id, status);
CREATE INDEX idx_ca_tasks_due ON corrective_action_tasks (due_date, status) 
    WHERE status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_effectiveness_pending ON effectiveness_verifications (plan_id, final_approval) 
    WHERE final_approval = false;

-- GIN indexes for JSONB fields
CREATE INDEX idx_rca_analysis_data ON root_cause_analyses USING GIN (analysis_data);
CREATE INDEX idx_ca_evidence_completion ON corrective_action_tasks USING GIN (completion_evidence);
CREATE INDEX idx_effectiveness_metrics ON effectiveness_verifications USING GIN (metrics_achieved);
CREATE INDEX idx_ca_metrics_source ON corrective_action_metrics USING GIN (by_source_type);
```

## Functions and Triggers

```sql
-- Function to generate CA plan number
CREATE OR REPLACE FUNCTION generate_ca_plan_number(
    p_organization_id UUID,
    p_action_type corrective_action_type_enum
) RETURNS TEXT AS $$
DECLARE
    v_prefix TEXT;
    v_year TEXT;
    v_sequence INTEGER;
BEGIN
    -- Determine prefix based on action type
    v_prefix := CASE p_action_type
        WHEN 'corrective' THEN 'CA'
        WHEN 'preventive' THEN 'PA'
        WHEN 'improvement' THEN 'CI'
        WHEN 'remedial' THEN 'RA'
    END;
    
    -- Get current year
    v_year := TO_CHAR(NOW(), 'YYYY');
    
    -- Get next sequence number for this year and type
    SELECT COALESCE(MAX(CAST(SUBSTRING(plan_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM corrective_action_plans
    WHERE organization_id = p_organization_id
    AND plan_number LIKE v_prefix || '-' || v_year || '-%';
    
    RETURN v_prefix || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to set plan number
CREATE OR REPLACE FUNCTION set_ca_plan_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.plan_number IS NULL THEN
        NEW.plan_number := generate_ca_plan_number(NEW.organization_id, NEW.action_type);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_plan_number_trigger
    BEFORE INSERT ON corrective_action_plans
    FOR EACH ROW
    EXECUTE FUNCTION set_ca_plan_number();

-- Function to update plan status based on actions
CREATE OR REPLACE FUNCTION update_plan_status()
RETURNS TRIGGER AS $$
DECLARE
    v_total_actions INTEGER;
    v_completed_actions INTEGER;
    v_verified_actions INTEGER;
    v_plan_status TEXT;
BEGIN
    -- Count actions
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status IN ('completed', 'verified')),
        COUNT(*) FILTER (WHERE status = 'verified')
    INTO v_total_actions, v_completed_actions, v_verified_actions
    FROM corrective_actions
    WHERE plan_id = NEW.plan_id;
    
    -- Determine plan status
    IF v_total_actions = 0 THEN
        v_plan_status := 'approved';
    ELSIF v_verified_actions = v_total_actions THEN
        v_plan_status := 'verification';
    ELSIF v_completed_actions > 0 THEN
        v_plan_status := 'in_progress';
    ELSE
        v_plan_status := 'approved';
    END IF;
    
    -- Update plan if status changed
    UPDATE corrective_action_plans
    SET status = v_plan_status,
        updated_at = NOW()
    WHERE id = NEW.plan_id
    AND status != v_plan_status;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_plan_status_trigger
    AFTER INSERT OR UPDATE OF status ON corrective_actions
    FOR EACH ROW
    EXECUTE FUNCTION update_plan_status();

-- Function to check overdue actions
CREATE OR REPLACE FUNCTION check_overdue_corrective_actions()
RETURNS TABLE (
    plan_id UUID,
    plan_number TEXT,
    action_id UUID,
    action_title TEXT,
    days_overdue INTEGER,
    responsible_user_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.plan_number,
        a.id,
        a.action_title,
        EXTRACT(DAY FROM NOW() - a.planned_completion_date::TIMESTAMPTZ)::INTEGER,
        a.responsible_user_id
    FROM corrective_action_plans p
    JOIN corrective_actions a ON p.id = a.plan_id
    WHERE p.deleted_at IS NULL
    AND p.status NOT IN ('completed', 'cancelled')
    AND a.status NOT IN ('completed', 'verified', 'cancelled')
    AND a.planned_completion_date < CURRENT_DATE
    ORDER BY a.planned_completion_date;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate effectiveness score
CREATE OR REPLACE FUNCTION calculate_effectiveness_score(
    p_plan_id UUID
) RETURNS DECIMAL AS $$
DECLARE
    v_metrics_count INTEGER;
    v_metrics_achieved INTEGER;
    v_score DECIMAL;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE target_achieved = true)
    INTO v_metrics_count, v_metrics_achieved
    FROM effectiveness_metrics
    WHERE plan_id = p_plan_id;
    
    IF v_metrics_count = 0 THEN
        RETURN NULL;
    END IF;
    
    v_score := (v_metrics_achieved::DECIMAL / v_metrics_count) * 100;
    RETURN ROUND(v_score, 2);
END;
$$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **CAPA Dashboard** for overview and metrics
  - **CA Plan Form** for creating and managing plans
  - **Root Cause Analysis Wizard** for RCA process
  - **Record Editor** for detailed action management
  - **ListView** for CAPA inventory
  - **Kanban Board** for action tracking
  - **Timeline View** for deadline management
  - **Effectiveness Verification Form** for verification process
  - **CAPA Reports** for management reporting

- **Integration Points**:
  - Audit finding integration
  - Incident management linkage
  - Risk assessment connection
  - Task management for actions
  - Document management for evidence
  - Notification system for updates
  - Calendar integration for deadlines
  - Analytics dashboard for metrics

## Quality Management Integration

1. **Continuous Improvement**:
   - Trend analysis of root causes
   - Systemic issue identification
   - Preventive action generation
   - Lessons learned capture

2. **Audit Integration**:
   - Direct creation from findings
   - Evidence for audit closure
   - Follow-up audit triggers
   - Effectiveness verification in audits

3. **Management Review**:
   - CAPA performance metrics
   - Resource allocation analysis
   - Effectiveness trends
   - Systemic issue reports

4. **Regulatory Compliance**:
   - Regulatory observation tracking
   - Response documentation
   - Evidence of correction
   - Preventive measure implementation


# Processing Activities (GDPR Article 30) - Database Schema

## Overview

This document defines the database schema for managing Records of Processing Activities (RoPA) as required by GDPR Article 30 and similar privacy regulations. The system supports comprehensive documentation of personal data processing activities, legal bases, data flows, and privacy controls.

## Processing Activities Workflow

### 1. Core Processing Activity Management

#### Processing Activity Documentation
- **Status**: Mandatory for GDPR Compliance
- **Triggers**:
  - New business process involving personal data
  - System implementation processing personal data
  - Vendor relationship with data processing
  - Changes to existing processing activities
  - Annual privacy reviews
  - Privacy impact assessment outcomes
- **Approval Requirements**:
  - Data owner approval
  - DPO/Privacy Officer review
  - Legal basis validation
  - Business justification
- **Data Model Requirements**:
  - `processing_activities` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_name`: TEXT NOT NULL
    - `description`: TEXT NOT NULL
    - `processing_purpose`: TEXT NOT NULL -- Why data is processed
    - `is_controller`: BOOLEAN DEFAULT true -- Controller vs Processor
    - `joint_controllers`: JSONB -- Other controllers if joint processing
    - `department_id`: UUID REFERENCES lookup_options(id) -- Department responsible
    - `business_function`: TEXT -- Business area (HR, Marketing, etc.)
    - `processing_status`: ENUM('active', 'inactive', 'planned', 'retired')
    - `start_date`: DATE
    - `end_date`: DATE -- For time-limited processing
    - `is_high_risk`: BOOLEAN DEFAULT false -- Requires PIA
    - `pia_required`: BOOLEAN DEFAULT false
    - `pia_completed`: BOOLEAN DEFAULT false
    - `pia_id`: UUID -- Reference to PIA if completed
    - `data_subjects`: TEXT[] -- Categories of data subjects
    - `data_subject_volume`: ENUM('less_100', '100_1k', '1k_10k', '10k_100k', 'more_100k')
    - `vulnerable_subjects`: BOOLEAN DEFAULT false -- Children, employees, etc.
    - `cross_border_transfers`: BOOLEAN DEFAULT false
    - `automated_decision_making`: BOOLEAN DEFAULT false
    - `profiling`: BOOLEAN DEFAULT false
    - `large_scale_processing`: BOOLEAN DEFAULT false
    - `data_owner_id`: UUID REFERENCES users(id)
    - `privacy_contact_id`: UUID REFERENCES users(id)
    - `review_date`: DATE -- Next review date
    - `review_frequency_months`: INTEGER DEFAULT 12
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_joint_controllers CHECK (jsonb_typeof(joint_controllers) = 'object')
    - INDEX idx_processing_activities_status (organization_id, processing_status) WHERE deleted_at IS NULL
  
  - `processing_data_categories` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_id`: UUID REFERENCES processing_activities(id) ON DELETE CASCADE
    - `category_name`: TEXT NOT NULL
    - `category_type`: ENUM('personal', 'special', 'criminal', 'financial', 'health', 'biometric', 'genetic')
    - `data_elements`: TEXT[] -- Specific data fields
    - `is_special_category`: BOOLEAN DEFAULT false -- Article 9 data
    - `sensitivity_level`: ENUM('public', 'internal', 'confidential', 'restricted')
    - `source`: ENUM('data_subject', 'third_party', 'public_source', 'derived', 'observed')
    - `collection_method`: TEXT
    - `is_mandatory`: BOOLEAN DEFAULT false -- Required vs optional
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - INDEX idx_processing_data_categories (activity_id, category_type)
  
  - `processing_legal_bases` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_id`: UUID REFERENCES processing_activities(id) ON DELETE CASCADE
    - `legal_basis`: ENUM('consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests')
    - `legal_basis_details`: TEXT NOT NULL -- Specific justification
    - `applies_to_categories`: UUID[] -- Which data categories this basis covers
    - `consent_mechanism`: TEXT -- How consent is obtained if applicable
    - `consent_withdrawal_process`: TEXT -- How to withdraw consent
    - `legitimate_interest_assessment`: JSONB -- LIA documentation
    - `legal_obligation_reference`: TEXT -- Specific law/regulation
    - `retention_basis`: TEXT -- Legal basis for retention period
    - `is_primary`: BOOLEAN DEFAULT false -- Primary basis if multiple
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_lia CHECK (jsonb_typeof(legitimate_interest_assessment) = 'object')
    - UNIQUE(activity_id, legal_basis) WHERE is_primary = true -- Only one primary basis

#### Data Flow and Recipients
- **Status**: Mandatory
- **Triggers**:
  - New data sharing arrangements
  - System integrations
  - Third-party processor engagement
  - International transfers
- **Data Model Requirements**:
  - `processing_recipients` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_id`: UUID REFERENCES processing_activities(id) ON DELETE CASCADE
    - `recipient_name`: TEXT NOT NULL
    - `recipient_type`: ENUM('internal_department', 'group_company', 'processor', 'joint_controller', 'third_party', 'public_authority')
    - `recipient_category`: TEXT -- Category if not naming specific recipient
    - `processing_purpose`: TEXT NOT NULL -- Why sharing with this recipient
    - `data_categories_shared`: UUID[] -- References to processing_data_categories
    - `legal_basis_for_sharing`: ENUM('consent', 'contract', 'legal_obligation', 'vital_interests', 'public_task', 'legitimate_interests')
    - `sharing_mechanism`: ENUM('api', 'sftp', 'email', 'portal', 'database', 'manual', 'other')
    - `frequency`: ENUM('real_time', 'daily', 'weekly', 'monthly', 'on_demand', 'one_time')
    - `has_data_agreement`: BOOLEAN DEFAULT false
    - `agreement_reference`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `processing_international_transfers` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_id`: UUID REFERENCES processing_activities(id) ON DELETE CASCADE
    - `recipient_id`: UUID REFERENCES processing_recipients(id) ON DELETE CASCADE
    - `destination_country`: TEXT NOT NULL -- ISO country code
    - `adequacy_decision`: BOOLEAN DEFAULT false
    - `transfer_mechanism`: ENUM('adequacy', 'scc', 'bcr', 'derogation', 'consent', 'contract_necessity')
    - `scc_version`: TEXT -- Standard Contractual Clauses version
    - `bcr_reference`: TEXT -- Binding Corporate Rules reference
    - `derogation_type`: TEXT -- Specific derogation relied upon
    - `supplementary_measures`: TEXT[] -- Additional safeguards
    - `tia_completed`: BOOLEAN DEFAULT false -- Transfer Impact Assessment
    - `tia_date`: DATE
    - `tia_outcome`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `processing_systems` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_id`: UUID REFERENCES processing_activities(id) ON DELETE CASCADE
    - `system_name`: TEXT NOT NULL
    - `system_type`: ENUM('application', 'database', 'file_share', 'cloud_service', 'email', 'paper', 'other')
    - `is_primary`: BOOLEAN DEFAULT false
    - `system_owner`: TEXT
    - `hosting_location`: TEXT -- Physical/cloud location
    - `access_controls`: TEXT -- Description of access controls
    - `encryption_at_rest`: BOOLEAN DEFAULT false
    - `encryption_in_transit`: BOOLEAN DEFAULT false
    - `backup_location`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

#### Retention and Security
- **Status**: Mandatory
- **Triggers**:
  - Retention policy definition
  - Security measure implementation
  - Retention period expiry
  - Deletion activities
- **Data Model Requirements**:
  - `data_retention_policies` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `policy_name`: TEXT NOT NULL
    - `description`: TEXT
    - `is_global`: BOOLEAN DEFAULT false -- Applies to multiple activities
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
  
  - `processing_retention_rules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_id`: UUID REFERENCES processing_activities(id) ON DELETE CASCADE
    - `data_category_id`: UUID REFERENCES processing_data_categories(id)
    - `retention_policy_id`: UUID REFERENCES data_retention_policies(id)
    - `retention_period_value`: INTEGER NOT NULL
    - `retention_period_unit`: ENUM('days', 'months', 'years', 'indefinite', 'event_based')
    - `retention_trigger`: ENUM('collection_date', 'last_use', 'contract_end', 'consent_withdrawal', 'other')
    - `retention_trigger_description`: TEXT
    - `deletion_method`: ENUM('automated', 'manual', 'anonymization', 'pseudonymization')
    - `legal_basis_for_retention`: TEXT NOT NULL
    - `review_before_deletion`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `processing_security_measures` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_id`: UUID REFERENCES processing_activities(id) ON DELETE CASCADE
    - `measure_type`: ENUM('technical', 'organizational')
    - `measure_category`: TEXT -- Access control, encryption, monitoring, etc.
    - `measure_description`: TEXT NOT NULL
    - `implementation_status`: ENUM('implemented', 'planned', 'not_applicable')
    - `implementation_date`: DATE
    - `effectiveness_rating`: ENUM('high', 'medium', 'low')
    - `related_controls`: UUID[] -- Links to security controls
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

#### Processing Activity Reviews
- **Status**: Mandatory
- **Triggers**:
  - Scheduled review dates
  - Significant changes
  - Incidents or complaints
  - Regulatory updates
- **Data Model Requirements**:
  - `processing_activity_reviews` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_id`: UUID REFERENCES processing_activities(id) ON DELETE CASCADE
    - `review_date`: DATE DEFAULT CURRENT_DATE
    - `review_type`: ENUM('scheduled', 'ad_hoc', 'incident_driven', 'regulatory_required')
    - `reviewed_by`: UUID REFERENCES users(id)
    - `review_outcome`: ENUM('approved', 'changes_required', 'activity_ceased')
    - `changes_identified`: TEXT[]
    - `pia_required`: BOOLEAN DEFAULT false
    - `risk_level_change`: BOOLEAN DEFAULT false
    - `new_risk_level`: ENUM('low', 'medium', 'high')
    - `action_items`: JSONB -- Required actions from review
    - `next_review_date`: DATE
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_action_items CHECK (jsonb_typeof(action_items) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_processing_activities_review ON processing_activities (review_date, processing_status) 
    WHERE deleted_at IS NULL AND processing_status = 'active';
CREATE INDEX idx_processing_high_risk ON processing_activities (is_high_risk, pia_completed) 
    WHERE deleted_at IS NULL AND is_high_risk = true;
CREATE INDEX idx_processing_cross_border ON processing_activities (cross_border_transfers) 
    WHERE deleted_at IS NULL AND cross_border_transfers = true;
CREATE INDEX idx_data_categories_special ON processing_data_categories (activity_id, is_special_category) 
    WHERE is_special_category = true;
CREATE INDEX idx_retention_rules_trigger ON processing_retention_rules (retention_trigger, activity_id);
CREATE INDEX idx_security_measures_status ON processing_security_measures (implementation_status, activity_id);

-- GIN indexes for JSONB and array fields
CREATE INDEX idx_processing_subjects ON processing_activities USING GIN (data_subjects);
CREATE INDEX idx_legal_basis_lia ON processing_legal_bases USING GIN (legitimate_interest_assessment);
CREATE INDEX idx_recipients_categories ON processing_recipients USING GIN (data_categories_shared);
CREATE INDEX idx_transfers_measures ON processing_international_transfers USING GIN (supplementary_measures);
```

## Functions and Triggers

```sql
-- Function to check if PIA is required
CREATE OR REPLACE FUNCTION check_pia_requirement()
RETURNS TRIGGER AS $$
BEGIN
    -- Check conditions that require PIA
    IF NEW.is_high_risk = true OR
       NEW.automated_decision_making = true OR
       NEW.large_scale_processing = true OR
       NEW.vulnerable_subjects = true OR
       EXISTS (
           SELECT 1 FROM processing_data_categories
           WHERE activity_id = NEW.id
           AND is_special_category = true
       ) THEN
        NEW.pia_required := true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_pia_trigger
    BEFORE INSERT OR UPDATE ON processing_activities
    FOR EACH ROW
    EXECUTE FUNCTION check_pia_requirement();

-- Function to calculate next review date
CREATE OR REPLACE FUNCTION calculate_next_review_date()
RETURNS TRIGGER AS $$
DECLARE
    v_frequency_months INTEGER;
BEGIN
    -- Get review frequency
    SELECT review_frequency_months INTO v_frequency_months
    FROM processing_activities
    WHERE id = NEW.activity_id;
    
    -- Set next review date
    NEW.next_review_date := NEW.review_date + (v_frequency_months || ' months')::INTERVAL;
    
    -- Update activity review date
    UPDATE processing_activities
    SET review_date = NEW.next_review_date,
        updated_at = NOW()
    WHERE id = NEW.activity_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_next_review_trigger
    AFTER INSERT ON processing_activity_reviews
    FOR EACH ROW
    EXECUTE FUNCTION calculate_next_review_date();

-- Function to validate retention periods
CREATE OR REPLACE FUNCTION validate_retention_period()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure special category data doesn't have indefinite retention without justification
    IF NEW.retention_period_unit = 'indefinite' AND EXISTS (
        SELECT 1 FROM processing_data_categories
        WHERE id = NEW.data_category_id
        AND is_special_category = true
    ) AND NEW.legal_basis_for_retention IS NULL THEN
        RAISE EXCEPTION 'Special category data requires specific legal basis for indefinite retention';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_retention_trigger
    BEFORE INSERT OR UPDATE ON processing_retention_rules
    FOR EACH ROW
    EXECUTE FUNCTION validate_retention_period();

-- Function to create RoPA report data
CREATE OR REPLACE FUNCTION generate_ropa_record(
    p_activity_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_activity RECORD;
    v_categories JSONB;
    v_legal_bases JSONB;
    v_recipients JSONB;
    v_transfers JSONB;
    v_security JSONB;
BEGIN
    -- Get activity details
    SELECT * INTO v_activity
    FROM processing_activities
    WHERE id = p_activity_id;
    
    -- Get data categories
    SELECT jsonb_agg(jsonb_build_object(
        'category', category_name,
        'type', category_type,
        'elements', data_elements,
        'special_category', is_special_category
    )) INTO v_categories
    FROM processing_data_categories
    WHERE activity_id = p_activity_id;
    
    -- Get legal bases
    SELECT jsonb_agg(jsonb_build_object(
        'basis', legal_basis,
        'details', legal_basis_details,
        'is_primary', is_primary
    )) INTO v_legal_bases
    FROM processing_legal_bases
    WHERE activity_id = p_activity_id;
    
    -- Get recipients
    SELECT jsonb_agg(jsonb_build_object(
        'name', recipient_name,
        'type', recipient_type,
        'purpose', processing_purpose
    )) INTO v_recipients
    FROM processing_recipients
    WHERE activity_id = p_activity_id;
    
    -- Get international transfers
    SELECT jsonb_agg(jsonb_build_object(
        'country', destination_country,
        'mechanism', transfer_mechanism,
        'adequacy', adequacy_decision
    )) INTO v_transfers
    FROM processing_international_transfers it
    JOIN processing_recipients pr ON it.recipient_id = pr.id
    WHERE pr.activity_id = p_activity_id;
    
    -- Get security measures
    SELECT jsonb_agg(jsonb_build_object(
        'type', measure_type,
        'category', measure_category,
        'description', measure_description,
        'status', implementation_status
    )) INTO v_security
    FROM processing_security_measures
    WHERE activity_id = p_activity_id;
    
    -- Build complete record
    v_result := jsonb_build_object(
        'activity_name', v_activity.activity_name,
        'description', v_activity.description,
        'purpose', v_activity.processing_purpose,
        'controller_processor', CASE WHEN v_activity.is_controller THEN 'Controller' ELSE 'Processor' END,
        'data_subjects', v_activity.data_subjects,
        'data_categories', v_categories,
        'legal_bases', v_legal_bases,
        'recipients', v_recipients,
        'international_transfers', v_transfers,
        'security_measures', v_security,
        'high_risk', v_activity.is_high_risk,
        'pia_completed', v_activity.pia_completed,
        'review_date', v_activity.review_date
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **RoPA Dashboard** for overview and compliance status
  - **Processing Activity Form** for detailed documentation
  - **Record Editor** for activity management
  - **ListView** for activity inventory
  - **Data Flow Mapper** for visualizing data flows
  - **Legal Basis Wizard** for determining appropriate bases
  - **Retention Manager** for retention rule configuration
  - **Transfer Assessment Tool** for international transfers
  - **Review Calendar** for scheduling reviews
  - **RoPA Report Generator** for Article 30 reports

- **Integration Points**:
  - PIA system integration
  - Asset management for systems
  - Vendor management for processors
  - Control framework for security measures
  - Document management for agreements
  - Task system for review actions
  - Risk management for high-risk processing
  - Incident management for breach relevance

## Compliance and Reporting

1. **Article 30 Requirements**:
   - Controller vs processor views
   - Complete activity documentation
   - Contact information maintenance
   - Categories of processing
   - Transfer documentation
   - Security measure records

2. **Regulatory Variations**:
   - GDPR Article 30 format
   - CCPA processing disclosures
   - LGPD processing records
   - Jurisdiction-specific requirements

3. **Audit Support**:
   - Complete audit trail
   - Change history tracking
   - Review documentation
   - Evidence of compliance

4. **Integration with Privacy Program**:
   - Links to privacy policies
   - Consent management integration
   - DSR relevance identification
   - Incident response support


# Generic Task Management System - Database Schema

## Overview

This document defines the database schema for a comprehensive task management system that supports cross-entity task creation, assignment, tracking, and completion across all ArionComply workflows. The design follows established database principles while providing flexibility for tasks related to any entity type in the system.

## Task Management Workflow

### 1. Core Task Management

#### Task Creation and Assignment
- **Status**: Core Feature
- **Triggers**:
  - Control implementation requirements
  - Risk treatment actions
  - Audit findings requiring action
  - Document review assignments
  - Privacy request fulfillment
  - Incident response activities
  - Any workflow requiring tracked activities
- **Approval Requirements**:
  - Task creation by authorized users
  - Assignment acceptance by assignees (optional)
  - Completion approval by task owners
  - Escalation approval for overdue tasks
- **Data Model Requirements**:
  - `tasks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `title`: TEXT NOT NULL
    - `description`: TEXT
    - `task_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic task types
    - `priority`: priority_enum DEFAULT 'medium'
    - `status`: ENUM('draft', 'assigned', 'accepted', 'in_progress', 'pending_review', 'completed', 'cancelled', 'overdue')
    - `due_date`: TIMESTAMPTZ
    - `start_date`: TIMESTAMPTZ
    - `completed_date`: TIMESTAMPTZ
    - `estimated_hours`: DECIMAL(5,2)
    - `actual_hours`: DECIMAL(5,2)
    - `completion_percentage`: INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
    - `assignee_id`: UUID REFERENCES users(id)
    - `assigned_by_id`: UUID REFERENCES users(id)
    - `approver_id`: UUID REFERENCES users(id) -- For tasks requiring approval
    - `parent_task_id`: UUID REFERENCES tasks(id) -- For subtasks
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - CONSTRAINT valid_dates CHECK (start_date IS NULL OR due_date IS NULL OR start_date <= due_date)
    - CONSTRAINT valid_completion CHECK (completed_date IS NULL OR status IN ('completed', 'cancelled'))
  
  - `task_entity_links` table (polymorphic relationship - justified by truly generic behavior):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `entity_type`: TEXT NOT NULL -- 'risk', 'control', 'incident', etc.
    - `entity_id`: UUID NOT NULL
    - `link_type`: ENUM('related_to', 'implements', 'resolves', 'reviews', 'creates')
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - UNIQUE(task_id, entity_type, entity_id)
    - INDEX idx_task_entity_lookup (entity_type, entity_id) -- For finding tasks by entity
  
  - `task_dependencies` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `predecessor_task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `successor_task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `dependency_type`: ENUM('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish')
    - `lag_days`: INTEGER DEFAULT 0 -- Days between dependent tasks
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - UNIQUE(predecessor_task_id, successor_task_id)
    - CONSTRAINT no_self_dependency CHECK (predecessor_task_id != successor_task_id)
  
  - `task_assignments_history` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `assigned_to_id`: UUID REFERENCES users(id)
    - `assigned_by_id`: UUID REFERENCES users(id)
    - `assignment_date`: TIMESTAMPTZ DEFAULT NOW()
    - `unassignment_date`: TIMESTAMPTZ
    - `assignment_reason`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
  
  - `task_comments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `comment_text`: TEXT NOT NULL
    - `is_internal`: BOOLEAN DEFAULT false -- Internal notes vs. shared comments
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
  
  - `task_attachments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `file_name`: TEXT NOT NULL
    - `file_path`: TEXT NOT NULL
    - `file_size`: BIGINT
    - `mime_type`: TEXT
    - `description`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support

#### Task Notifications and Escalations
- **Status**: Core Feature
- **Triggers**:
  - Task assignment
  - Due date approaching
  - Task overdue
  - Status changes
  - Comment additions
  - Completion approval needed
- **Data Model Requirements**:
  - `task_notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `notification_type`: ENUM('assignment', 'due_soon', 'overdue', 'status_change', 'comment', 'approval_needed', 'completed', 'escalated')
    - `recipient_id`: UUID REFERENCES users(id)
    - `sent_at`: TIMESTAMPTZ DEFAULT NOW()
    - `read_at`: TIMESTAMPTZ
    - `notification_data`: JSONB -- Additional context for the notification
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_notification_data CHECK (jsonb_typeof(notification_data) = 'object')
  
  - `task_escalations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `escalation_level`: INTEGER DEFAULT 1
    - `escalated_to_id`: UUID REFERENCES users(id)
    - `escalation_reason`: TEXT
    - `escalated_at`: TIMESTAMPTZ DEFAULT NOW()
    - `resolved_at`: TIMESTAMPTZ
    - `resolution_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`: UUID REFERENCES users(id)

#### Task Templates
- **Status**: Enhancement
- **Triggers**:
  - Recurring compliance activities
  - Standard operating procedures
  - Common task patterns
- **Data Model Requirements**:
  - `task_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `description`: TEXT
    - `template_type_id`: UUID REFERENCES lookup_options(id)
    - `is_active`: BOOLEAN DEFAULT true
    - `task_data`: JSONB NOT NULL -- Template task structure
    - `default_assignments`: JSONB -- Default assignment rules
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_task_data CHECK (jsonb_typeof(task_data) = 'object')
    - CONSTRAINT valid_default_assignments CHECK (jsonb_typeof(default_assignments) = 'object')
  
  - `task_recurrence_patterns` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `template_id`: UUID REFERENCES task_templates(id)
    - `pattern_type`: ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom')
    - `pattern_config`: JSONB NOT NULL -- Recurrence configuration
    - `next_occurrence`: DATE
    - `end_date`: DATE -- Optional end date for recurrence
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_pattern_config CHECK (jsonb_typeof(pattern_config) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_tasks_assignee_status ON tasks (assignee_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due_date ON tasks (due_date) WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_tasks_org_status ON tasks (organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_task_entity_by_entity ON task_entity_links (entity_type, entity_id);
CREATE INDEX idx_task_notifications_unread ON task_notifications (recipient_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_task_dependencies_successor ON task_dependencies (successor_task_id);

-- GIN indexes for JSONB fields
CREATE INDEX idx_tasks_custom_fields ON tasks USING GIN (custom_fields);
CREATE INDEX idx_task_templates_data ON task_templates USING GIN (task_data);
```

## Functions and Triggers

```sql
-- Function to check circular dependencies
CREATE OR REPLACE FUNCTION check_circular_dependency()
RETURNS TRIGGER AS $$
DECLARE
    has_circular BOOLEAN;
BEGIN
    WITH RECURSIVE dep_chain AS (
        SELECT successor_task_id, predecessor_task_id
        FROM task_dependencies
        WHERE predecessor_task_id = NEW.successor_task_id
        
        UNION ALL
        
        SELECT td.successor_task_id, td.predecessor_task_id
        FROM task_dependencies td
        JOIN dep_chain dc ON td.predecessor_task_id = dc.successor_task_id
    )
    SELECT EXISTS (
        SELECT 1 FROM dep_chain 
        WHERE successor_task_id = NEW.predecessor_task_id
    ) INTO has_circular;
    
    IF has_circular THEN
        RAISE EXCEPTION 'Circular dependency detected';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_circular_dependencies
    BEFORE INSERT OR UPDATE ON task_dependencies
    FOR EACH ROW
    EXECUTE FUNCTION check_circular_dependency();

-- Function to update parent task completion percentage
CREATE OR REPLACE FUNCTION update_parent_task_completion()
RETURNS TRIGGER AS $$
DECLARE
    avg_completion DECIMAL;
BEGIN
    IF NEW.parent_task_id IS NOT NULL THEN
        SELECT AVG(completion_percentage)
        INTO avg_completion
        FROM tasks
        WHERE parent_task_id = NEW.parent_task_id
        AND deleted_at IS NULL;
        
        UPDATE tasks
        SET completion_percentage = COALESCE(avg_completion, 0),
            updated_at = NOW()
        WHERE id = NEW.parent_task_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_parent_completion
    AFTER INSERT OR UPDATE OF completion_percentage ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_parent_task_completion();

-- Function to create task from template
CREATE OR REPLACE FUNCTION create_task_from_template(
    p_template_id UUID,
    p_created_by UUID,
    p_organization_id UUID,
    p_custom_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    v_task_id UUID;
    v_template RECORD;
BEGIN
    SELECT * INTO v_template
    FROM task_templates
    WHERE id = p_template_id
    AND organization_id = p_organization_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found or inactive';
    END IF;
    
    -- Create task from template data
    INSERT INTO tasks (
        title,
        description,
        task_type_id,
        priority,
        estimated_hours,
        organization_id,
        created_by,
        custom_fields
    )
    SELECT 
        COALESCE(p_custom_data->>'title', v_template.task_data->>'title'),
        COALESCE(p_custom_data->>'description', v_template.task_data->>'description'),
        (v_template.task_data->>'task_type_id')::UUID,
        COALESCE((p_custom_data->>'priority')::priority_enum, (v_template.task_data->>'priority')::priority_enum),
        (v_template.task_data->>'estimated_hours')::DECIMAL,
        p_organization_id,
        p_created_by,
        v_template.task_data->'custom_fields' || p_custom_data->'custom_fields'
    RETURNING id INTO v_task_id;
    
    RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **Task Dashboard** for personal task management and overview
  - **Record Editor** for detailed task creation and editing
  - **ListView** for task inventory and bulk management
  - **Kanban Board** for visual task status management
  - **Calendar View** for deadline and schedule visualization
  - **Timeline/Gantt View** for project and dependency visualization
  - **Planning Hub** for integrated planning across all views

- **Integration Points**:
  - Tasks can be created from any entity screen (controls, risks, incidents, etc.)
  - Task status updates reflect in parent entity screens
  - Notification center shows task-related alerts
  - Dashboard widgets for task metrics and deadlines
  - Mobile app support for field task updates

## Migration Considerations

For organizations migrating from existing task systems:

1. **Data Import Support**:
   - Bulk import functionality for existing tasks
   - Mapping templates for common task management systems
   - Validation and conflict resolution during import

2. **Gradual Adoption**:
   - Ability to run parallel with existing systems
   - Selective migration by department or workflow
   - Historical task data preservation

3. **Integration APIs**:
   - RESTful APIs for third-party task system integration
   - Webhook support for real-time synchronization
   - Export capabilities for reporting tools


# Comprehensive Notification System - Database Schema

## Overview

This document defines the database schema for a comprehensive notification system that supports multi-channel delivery, template management, rule-based triggers, and user preferences across the ArionComply platform. The design follows established database principles while providing flexibility for various notification scenarios.

## Notification Management Workflow

### 1. Core Notification System

#### Notification Creation and Delivery
- **Status**: Core Feature
- **Triggers**:
  - Task assignments and updates
  - Approval requests
  - Deadline reminders
  - Compliance alerts
  - System events
  - Security incidents
  - Audit findings
  - Policy updates
  - Training assignments
- **Approval Requirements**:
  - Template approval for organization-wide notifications
  - Security review for external notifications
  - Compliance review for regulatory notifications
- **Data Model Requirements**:
  - `notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `notification_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic notification types
    - `title`: TEXT NOT NULL
    - `message`: TEXT NOT NULL
    - `priority`: priority_enum DEFAULT 'medium'
    - `status`: ENUM('pending', 'sent', 'delivered', 'read', 'failed', 'cancelled')
    - `recipient_id`: UUID REFERENCES users(id)
    - `sender_id`: UUID REFERENCES users(id) -- NULL for system notifications
    - `scheduled_for`: TIMESTAMPTZ DEFAULT NOW()
    - `sent_at`: TIMESTAMPTZ
    - `delivered_at`: TIMESTAMPTZ
    - `read_at`: TIMESTAMPTZ
    - `expires_at`: TIMESTAMPTZ -- Optional expiration for time-sensitive notifications
    - `template_id`: UUID REFERENCES notification_templates(id)
    - `template_data`: JSONB -- Data used to populate template
    - `related_entity_type`: TEXT -- Entity this notification relates to
    - `related_entity_id`: UUID -- ID of related entity
    - `action_url`: TEXT -- Deep link to relevant screen/action
    - `action_required`: BOOLEAN DEFAULT false
    - `action_completed`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_template_data CHECK (jsonb_typeof(template_data) = 'object')
    - CONSTRAINT valid_dates CHECK (scheduled_for <= COALESCE(expires_at, scheduled_for + INTERVAL '1 year'))
  
  - `notification_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `description`: TEXT
    - `template_type`: ENUM('system', 'compliance', 'security', 'administrative', 'custom')
    - `is_active`: BOOLEAN DEFAULT true
    - `subject_template`: TEXT NOT NULL -- Template for notification title
    - `body_template`: TEXT NOT NULL -- Template for notification content
    - `html_template`: TEXT -- Optional HTML version
    - `variables`: JSONB NOT NULL -- Required variables and their types
    - `default_priority`: priority_enum DEFAULT 'medium'
    - `default_expiry_hours`: INTEGER -- Default hours until expiration
    - `supported_channels`: TEXT[] DEFAULT ARRAY['in_app'] -- Array of supported delivery channels
    - `organization_id`: UUID REFERENCES organizations(id) -- NULL for system templates
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_variables CHECK (jsonb_typeof(variables) = 'object')
    - UNIQUE(template_name, organization_id)
  
  - `notification_channels` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `channel_name`: TEXT NOT NULL UNIQUE
    - `channel_type`: ENUM('in_app', 'email', 'sms', 'push', 'webhook', 'integration')
    - `is_enabled`: BOOLEAN DEFAULT true
    - `configuration`: JSONB NOT NULL -- Channel-specific configuration
    - `rate_limits`: JSONB -- Rate limiting configuration
    - `retry_policy`: JSONB -- Retry configuration for failed deliveries
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_configuration CHECK (jsonb_typeof(configuration) = 'object')
    - CONSTRAINT valid_rate_limits CHECK (jsonb_typeof(rate_limits) = 'object')
    - CONSTRAINT valid_retry_policy CHECK (jsonb_typeof(retry_policy) = 'object')
  
  - `notification_deliveries` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `notification_id`: UUID REFERENCES notifications(id) ON DELETE CASCADE
    - `channel_id`: UUID REFERENCES notification_channels(id)
    - `delivery_status`: ENUM('pending', 'sent', 'delivered', 'failed', 'bounced')
    - `attempt_count`: INTEGER DEFAULT 1
    - `sent_at`: TIMESTAMPTZ
    - `delivered_at`: TIMESTAMPTZ
    - `failed_at`: TIMESTAMPTZ
    - `failure_reason`: TEXT
    - `delivery_metadata`: JSONB -- Channel-specific delivery information
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_delivery_metadata CHECK (jsonb_typeof(delivery_metadata) = 'object')
    - UNIQUE(notification_id, channel_id)

#### Notification Rules and Automation
- **Status**: Core Feature
- **Triggers**:
  - Database events
  - Time-based triggers
  - Threshold breaches
  - Workflow state changes
  - External system events
- **Data Model Requirements**:
  - `notification_rules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `rule_name`: TEXT NOT NULL
    - `description`: TEXT
    - `rule_type`: ENUM('event', 'scheduled', 'threshold', 'workflow', 'external')
    - `is_active`: BOOLEAN DEFAULT true
    - `trigger_conditions`: JSONB NOT NULL -- Conditions that trigger the rule
    - `template_id`: UUID REFERENCES notification_templates(id)
    - `recipient_rules`: JSONB NOT NULL -- Rules for determining recipients
    - `channel_preferences`: TEXT[] -- Preferred delivery channels
    - `priority_override`: priority_enum -- Override template priority
    - `cooldown_minutes`: INTEGER -- Minimum time between notifications
    - `max_notifications_per_day`: INTEGER -- Daily limit
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_trigger_conditions CHECK (jsonb_typeof(trigger_conditions) = 'object')
    - CONSTRAINT valid_recipient_rules CHECK (jsonb_typeof(recipient_rules) = 'object')
  
  - `notification_rule_executions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `rule_id`: UUID REFERENCES notification_rules(id) ON DELETE CASCADE
    - `execution_time`: TIMESTAMPTZ DEFAULT NOW()
    - `trigger_data`: JSONB -- Data that triggered the rule
    - `notifications_created`: INTEGER DEFAULT 0
    - `execution_status`: ENUM('success', 'partial', 'failed')
    - `error_details`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_trigger_data CHECK (jsonb_typeof(trigger_data) = 'object')

#### User Notification Preferences
- **Status**: Core Feature
- **Triggers**:
  - User preference updates
  - Role-based defaults
  - Organization policies
- **Data Model Requirements**:
  - `notification_preferences` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `notification_type_id`: UUID REFERENCES lookup_options(id) -- Specific notification type
    - `is_enabled`: BOOLEAN DEFAULT true
    - `channel_preferences`: TEXT[] -- Ordered list of preferred channels
    - `frequency`: ENUM('immediate', 'hourly', 'daily', 'weekly') DEFAULT 'immediate'
    - `quiet_hours_start`: TIME -- Start of do-not-disturb period
    - `quiet_hours_end`: TIME -- End of do-not-disturb period
    - `quiet_hours_timezone`: TEXT -- IANA timezone
    - `digest_enabled`: BOOLEAN DEFAULT false -- Batch notifications
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(user_id, notification_type_id)
  
  - `notification_subscriptions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `subscription_type`: ENUM('entity', 'event', 'report', 'digest')
    - `entity_type`: TEXT -- For entity subscriptions
    - `entity_id`: UUID -- For specific entity subscriptions
    - `event_pattern`: TEXT -- For event subscriptions
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - INDEX idx_notification_subs_entity (entity_type, entity_id) WHERE subscription_type = 'entity'
  
  - `notification_digests` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `digest_type`: ENUM('daily', 'weekly')
    - `scheduled_for`: TIMESTAMPTZ
    - `sent_at`: TIMESTAMPTZ
    - `notification_count`: INTEGER DEFAULT 0
    - `digest_content`: JSONB -- Aggregated notification data
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_digest_content CHECK (jsonb_typeof(digest_content) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_notifications_recipient_unread ON notifications (recipient_id, read_at) 
    WHERE deleted_at IS NULL AND read_at IS NULL;
CREATE INDEX idx_notifications_scheduled ON notifications (scheduled_for) 
    WHERE deleted_at IS NULL AND status = 'pending';
CREATE INDEX idx_notifications_entity ON notifications (related_entity_type, related_entity_id) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_deliveries_pending ON notification_deliveries (delivery_status, sent_at) 
    WHERE delivery_status = 'pending';
CREATE INDEX idx_notification_rules_active ON notification_rules (is_active, rule_type) 
    WHERE is_active = true;
CREATE INDEX idx_notification_preferences_user ON notification_preferences (user_id, is_enabled);

-- GIN indexes for JSONB fields
CREATE INDEX idx_notification_templates_vars ON notification_templates USING GIN (variables);
CREATE INDEX idx_notification_rules_conditions ON notification_rules USING GIN (trigger_conditions);
CREATE INDEX idx_notification_rules_recipients ON notification_rules USING GIN (recipient_rules);
```

## Functions and Triggers

```sql
-- Function to create notifications from template
CREATE OR REPLACE FUNCTION create_notification_from_template(
    p_template_id UUID,
    p_recipient_id UUID,
    p_template_data JSONB,
    p_related_entity_type TEXT DEFAULT NULL,
    p_related_entity_id UUID DEFAULT NULL,
    p_sender_id UUID DEFAULT NULL,
    p_organization_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
    v_template RECORD;
    v_title TEXT;
    v_message TEXT;
BEGIN
    -- Get template
    SELECT * INTO v_template
    FROM notification_templates
    WHERE id = p_template_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found or inactive';
    END IF;
    
    -- Validate required variables
    IF NOT (v_template.variables <@ p_template_data) THEN
        RAISE EXCEPTION 'Missing required template variables';
    END IF;
    
    -- Render template (simplified - in practice would use proper template engine)
    v_title := v_template.subject_template;
    v_message := v_template.body_template;
    
    -- Simple variable replacement (in practice would be more sophisticated)
    FOR key, value IN SELECT * FROM jsonb_each_text(p_template_data) LOOP
        v_title := REPLACE(v_title, '{{' || key || '}}', value);
        v_message := REPLACE(v_message, '{{' || key || '}}', value);
    END LOOP;
    
    -- Create notification
    INSERT INTO notifications (
        template_id,
        title,
        message,
        priority,
        recipient_id,
        sender_id,
        template_data,
        related_entity_type,
        related_entity_id,
        organization_id,
        expires_at,
        created_by
    ) VALUES (
        p_template_id,
        v_title,
        v_message,
        v_template.default_priority,
        p_recipient_id,
        p_sender_id,
        p_template_data,
        p_related_entity_type,
        p_related_entity_id,
        p_organization_id,
        CASE 
            WHEN v_template.default_expiry_hours IS NOT NULL 
            THEN NOW() + (v_template.default_expiry_hours || ' hours')::INTERVAL 
            ELSE NULL 
        END,
        COALESCE(p_sender_id, p_recipient_id)
    ) RETURNING id INTO v_notification_id;
    
    -- Create delivery records for user's preferred channels
    INSERT INTO notification_deliveries (notification_id, channel_id, organization_id)
    SELECT 
        v_notification_id,
        nc.id,
        p_organization_id
    FROM notification_channels nc
    WHERE nc.channel_name = ANY(
        SELECT unnest(COALESCE(np.channel_preferences, ARRAY['in_app']))
        FROM notification_preferences np
        WHERE np.user_id = p_recipient_id
        AND np.notification_type_id = (
            SELECT id FROM lookup_options 
            WHERE list_name = 'notification_types' 
            AND value = v_template.template_type::TEXT
        )
    )
    AND nc.is_enabled = true;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process notification rules
CREATE OR REPLACE FUNCTION process_notification_rule(
    p_rule_id UUID,
    p_trigger_data JSONB
) RETURNS INTEGER AS $$
DECLARE
    v_rule RECORD;
    v_recipients UUID[];
    v_notification_count INTEGER := 0;
    v_recipient_id UUID;
BEGIN
    -- Get rule
    SELECT * INTO v_rule
    FROM notification_rules
    WHERE id = p_rule_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Check cooldown period
    IF EXISTS (
        SELECT 1 FROM notification_rule_executions
        WHERE rule_id = p_rule_id
        AND execution_time > NOW() - (v_rule.cooldown_minutes || ' minutes')::INTERVAL
    ) THEN
        RETURN 0;
    END IF;
    
    -- Determine recipients based on rule (simplified)
    -- In practice, this would be much more sophisticated
    IF v_rule.recipient_rules->>'type' = 'role' THEN
        SELECT ARRAY_AGG(u.id)
        INTO v_recipients
        FROM users u
        JOIN user_role_assignments ura ON u.id = ura.user_id
        WHERE ura.role_id = (v_rule.recipient_rules->>'role_id')::UUID
        AND u.status = 'active';
    END IF;
    
    -- Create notifications for each recipient
    FOREACH v_recipient_id IN ARRAY v_recipients LOOP
        PERFORM create_notification_from_template(
            v_rule.template_id,
            v_recipient_id,
            p_trigger_data,
            v_rule.trigger_conditions->>'entity_type',
            (v_rule.trigger_conditions->>'entity_id')::UUID,
            NULL,
            v_rule.organization_id
        );
        v_notification_count := v_notification_count + 1;
    END LOOP;
    
    -- Log execution
    INSERT INTO notification_rule_executions (
        rule_id,
        trigger_data,
        notifications_created,
        execution_status,
        organization_id
    ) VALUES (
        p_rule_id,
        p_trigger_data,
        v_notification_count,
        'success',
        v_rule.organization_id
    );
    
    RETURN v_notification_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to mark notifications as read when accessed
CREATE OR REPLACE FUNCTION mark_notification_read()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.read_at IS NULL AND NEW.read_at IS NOT NULL THEN
        -- Update delivery status
        UPDATE notification_deliveries
        SET delivered_at = NOW(),
            delivery_status = 'delivered'
        WHERE notification_id = NEW.id
        AND delivery_status IN ('sent', 'pending');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_read_status
    AFTER UPDATE OF read_at ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION mark_notification_read();
```

## UI Integration

- **Primary Screens**:
  - **Notification Center** for viewing and managing all notifications
  - **Notification Preferences** in user settings
  - **Notification Templates** in admin panel
  - **Notification Rules** configuration screen
  - **Global notification bell/icon** in header with count badge

- **Integration Points**:
  - Real-time notifications via WebSocket
  - Push notifications for mobile apps
  - Email integration for external delivery
  - SMS gateway integration
  - Calendar integration for time-based notifications
  - Deep linking from notifications to relevant screens

## Migration and Integration Considerations

1. **Email Service Integration**:
   - Support for SendGrid, AWS SES, SMTP
   - Template synchronization with email service
   - Bounce and complaint handling

2. **Mobile Push Notifications**:
   - FCM (Firebase Cloud Messaging) for Android
   - APNs (Apple Push Notification service) for iOS
   - Token management and device registration

3. **Webhook Delivery**:
   - Configurable webhook endpoints
   - Retry logic with exponential backoff
   - Signature verification for security

4. **Rate Limiting**:
   - Per-user rate limits
   - Per-channel rate limits
   - Organization-wide limits
   - Burst allowances for critical notifications


# Data Subject Request (DSR) Management - Database Schema

## Overview

This document defines the database schema for managing Data Subject Requests (DSRs) as required by GDPR, CCPA, and other privacy regulations. The system supports the full lifecycle of privacy rights requests including access, deletion, rectification, portability, and objection requests.

## DSR Management Workflow

### 1. Core DSR Processing

#### Request Intake and Validation
- **Status**: Mandatory for Privacy Compliance
- **Triggers**:
  - Direct request from data subject
  - Request via privacy portal
  - Email/letter request
  - Third-party request (with authorization)
  - Regulatory authority request
- **Approval Requirements**:
  - Identity verification
  - Request legitimacy validation
  - DPO/Privacy Officer review
  - Legal review for complex requests
- **Data Model Requirements**:
  - `dsr_requests` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_number`: TEXT UNIQUE NOT NULL -- Human-readable request ID
    - `request_type`: ENUM('access', 'deletion', 'rectification', 'portability', 'objection', 'restriction', 'automated_decision_review')
    - `status`: ENUM('received', 'verifying_identity', 'in_progress', 'pending_approval', 'approved', 'completed', 'rejected', 'withdrawn')
    - `priority`: priority_enum DEFAULT 'high' -- DSRs typically high priority
    - `channel`: ENUM('portal', 'email', 'phone', 'letter', 'in_person', 'third_party')
    - `received_date`: TIMESTAMPTZ DEFAULT NOW()
    - `due_date`: TIMESTAMPTZ NOT NULL -- Calculated based on regulation
    - `completed_date`: TIMESTAMPTZ
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'other')
    - `requestor_type`: ENUM('data_subject', 'authorized_agent', 'parent_guardian', 'legal_representative')
    - `data_subject_id`: UUID -- Internal ID if known
    - `requestor_name`: TEXT NOT NULL
    - `requestor_email`: TEXT
    - `requestor_phone`: TEXT
    - `requestor_address`: TEXT
    - `preferred_language`: TEXT DEFAULT 'en'
    - `preferred_response_method`: ENUM('email', 'portal', 'mail', 'phone')
    - `request_details`: TEXT NOT NULL -- Full request description
    - `specific_data_requested`: JSONB -- For access/portability requests
    - `verification_status`: ENUM('not_started', 'pending', 'verified', 'failed')
    - `verification_method`: TEXT
    - `verification_completed_by`: UUID REFERENCES users(id)
    - `verification_completed_at`: TIMESTAMPTZ
    - `rejection_reason`: TEXT
    - `notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_specific_data CHECK (jsonb_typeof(specific_data_requested) = 'object')
    - CONSTRAINT valid_due_date CHECK (due_date > received_date)
  
  - `dsr_request_documents` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `document_type`: ENUM('request_form', 'identity_proof', 'authorization', 'supporting_docs', 'response', 'evidence')
    - `document_name`: TEXT NOT NULL
    - `file_path`: TEXT NOT NULL
    - `file_size`: BIGINT
    - `mime_type`: TEXT
    - `is_redacted`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
  
  - `dsr_data_sources` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `source_name`: TEXT NOT NULL -- System/database name
    - `source_type`: ENUM('database', 'file_system', 'cloud_storage', 'third_party', 'paper_records', 'backup')
    - `search_status`: ENUM('pending', 'in_progress', 'completed', 'failed', 'not_applicable')
    - `search_started_at`: TIMESTAMPTZ
    - `search_completed_at`: TIMESTAMPTZ
    - `records_found`: INTEGER DEFAULT 0
    - `data_categories_found`: TEXT[] -- Categories of personal data found
    - `search_query`: TEXT -- Query/criteria used
    - `search_results_summary`: JSONB -- Summary of findings
    - `requires_manual_review`: BOOLEAN DEFAULT false
    - `manual_review_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `searched_by`: UUID REFERENCES users(id)
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_search_results CHECK (jsonb_typeof(search_results_summary) = 'object')

#### Request Fulfillment
- **Status**: Mandatory
- **Triggers**:
  - Identity verification completion
  - Search completion across systems
  - Data compilation
  - Approval workflow completion
- **Data Model Requirements**:
  - `dsr_responses` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `response_type`: ENUM('full', 'partial', 'denial', 'no_data_found')
    - `response_date`: TIMESTAMPTZ DEFAULT NOW()
    - `response_method`: ENUM('email', 'portal', 'mail', 'api')
    - `response_summary`: TEXT NOT NULL
    - `data_provided`: JSONB -- Summary of data provided
    - `exemptions_applied`: JSONB -- Legal exemptions used
    - `redactions_applied`: JSONB -- Information about redactions
    - `response_format`: ENUM('pdf', 'json', 'csv', 'xml', 'structured_package')
    - `delivery_status`: ENUM('pending', 'sent', 'delivered', 'failed')
    - `delivery_confirmation`: TEXT
    - `follow_up_required`: BOOLEAN DEFAULT false
    - `follow_up_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_data_provided CHECK (jsonb_typeof(data_provided) = 'object')
    - CONSTRAINT valid_exemptions CHECK (jsonb_typeof(exemptions_applied) = 'object')
    - CONSTRAINT valid_redactions CHECK (jsonb_typeof(redactions_applied) = 'object')
  
  - `dsr_request_tasks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `task_type`: ENUM('verify_identity', 'search_data', 'review_data', 'apply_redactions', 'prepare_response', 'delete_data', 'update_data', 'legal_review')
    - `title`: TEXT NOT NULL
    - `description`: TEXT
    - `assigned_to`: UUID REFERENCES users(id)
    - `status`: ENUM('pending', 'in_progress', 'completed', 'blocked', 'cancelled')
    - `priority`: priority_enum DEFAULT 'high'
    - `due_date`: TIMESTAMPTZ
    - `completed_date`: TIMESTAMPTZ
    - `blocked_reason`: TEXT
    - `completion_notes`: TEXT
    - `estimated_hours`: DECIMAL(5,2)
    - `actual_hours`: DECIMAL(5,2)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - INDEX idx_dsr_tasks_assignee (assigned_to, status) WHERE status != 'completed'
  
  - `dsr_fulfillment_actions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `action_type`: ENUM('data_exported', 'data_deleted', 'data_updated', 'processing_restricted', 'consent_updated', 'marketing_opt_out')
    - `action_timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `system_name`: TEXT NOT NULL
    - `record_count`: INTEGER
    - `action_details`: JSONB NOT NULL
    - `verification_method`: TEXT
    - `verified_by`: UUID REFERENCES users(id)
    - `verified_at`: TIMESTAMPTZ
    - `rollback_possible`: BOOLEAN DEFAULT false
    - `rollback_deadline`: TIMESTAMPTZ
    - `organization_id`: UUID REFERENCES organizations(id)
    - `performed_by`: UUID REFERENCES users(id)
    - CONSTRAINT valid_action_details CHECK (jsonb_typeof(action_details) = 'object')

#### Request Metrics and Compliance
- **Status**: Mandatory
- **Triggers**:
  - Request completion
  - SLA monitoring
  - Regulatory reporting
  - Performance analysis
- **Data Model Requirements**:
  - `dsr_metrics` table (materialized view updated regularly):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_date`: DATE NOT NULL
    - `organization_id`: UUID REFERENCES organizations(id)
    - `request_type`: dsr_request_type_enum
    - `total_requests`: INTEGER DEFAULT 0
    - `completed_on_time`: INTEGER DEFAULT 0
    - `completed_late`: INTEGER DEFAULT 0
    - `rejected_requests`: INTEGER DEFAULT 0
    - `average_completion_days`: DECIMAL(5,2)
    - `median_completion_days`: DECIMAL(5,2)
    - `pending_requests`: INTEGER DEFAULT 0
    - `by_regulatory_framework`: JSONB -- Breakdown by regulation
    - `by_channel`: JSONB -- Breakdown by request channel
    - `by_response_type`: JSONB -- Breakdown by response type
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(metric_date, organization_id, request_type)
  
  - `dsr_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `template_type`: ENUM('request_form', 'response_letter', 'denial_letter', 'verification_form', 'consent_form')
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'other')
    - `language`: TEXT DEFAULT 'en'
    - `subject_template`: TEXT
    - `body_template`: TEXT NOT NULL
    - `variables`: JSONB -- Required template variables
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_variables CHECK (jsonb_typeof(variables) = 'object')
  
  - `dsr_exemptions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `exemption_name`: TEXT NOT NULL
    - `exemption_type`: ENUM('legal_privilege', 'third_party_data', 'disproportionate_effort', 'public_interest', 'investigation', 'ip_rights')
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'other')
    - `description`: TEXT NOT NULL
    - `legal_basis`: TEXT
    - `requires_approval`: BOOLEAN DEFAULT true
    - `approver_role_id`: UUID REFERENCES roles(id)
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_dsr_requests_status_due ON dsr_requests (status, due_date) 
    WHERE deleted_at IS NULL AND status NOT IN ('completed', 'rejected', 'withdrawn');
CREATE INDEX idx_dsr_requests_org_status ON dsr_requests (organization_id, status) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_dsr_requests_number ON dsr_requests (request_number) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_dsr_data_sources_request ON dsr_data_sources (request_id, search_status);
CREATE INDEX idx_dsr_tasks_due ON dsr_request_tasks (due_date, status) 
    WHERE status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_dsr_fulfillment_verification ON dsr_fulfillment_actions (verified_at) 
    WHERE verified_at IS NULL;

-- GIN indexes for JSONB fields
CREATE INDEX idx_dsr_requests_specific_data ON dsr_requests USING GIN (specific_data_requested);
CREATE INDEX idx_dsr_responses_data ON dsr_responses USING GIN (data_provided);
CREATE INDEX idx_dsr_metrics_framework ON dsr_metrics USING GIN (by_regulatory_framework);
```

## Functions and Triggers

```sql
-- Function to calculate DSR due date based on regulation
CREATE OR REPLACE FUNCTION calculate_dsr_due_date(
    p_request_type dsr_request_type_enum,
    p_regulatory_framework dsr_regulatory_framework_enum,
    p_received_date TIMESTAMPTZ
) RETURNS TIMESTAMPTZ AS $$
DECLARE
    v_days_allowed INTEGER;
BEGIN
    -- Determine days allowed based on regulation and request type
    CASE p_regulatory_framework
        WHEN 'gdpr' THEN
            CASE p_request_type
                WHEN 'access' THEN v_days_allowed := 30;
                WHEN 'deletion' THEN v_days_allowed := 30;
                WHEN 'rectification' THEN v_days_allowed := 30;
                WHEN 'portability' THEN v_days_allowed := 30;
                ELSE v_days_allowed := 30;
            END CASE;
        WHEN 'ccpa' THEN
            CASE p_request_type
                WHEN 'access' THEN v_days_allowed := 45;
                WHEN 'deletion' THEN v_days_allowed := 45;
                ELSE v_days_allowed := 45;
            END CASE;
        ELSE
            v_days_allowed := 30; -- Default
    END CASE;
    
    -- Calculate due date (accounting for business days would be more complex)
    RETURN p_received_date + (v_days_allowed || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set due date on request creation
CREATE OR REPLACE FUNCTION set_dsr_due_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.due_date IS NULL THEN
        NEW.due_date := calculate_dsr_due_date(
            NEW.request_type,
            NEW.regulatory_framework,
            NEW.received_date
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_due_date_trigger
    BEFORE INSERT ON dsr_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_dsr_due_date();

-- Function to check DSR SLA compliance
CREATE OR REPLACE FUNCTION check_dsr_sla_compliance()
RETURNS TABLE (
    request_id UUID,
    request_number TEXT,
    days_until_due INTEGER,
    is_overdue BOOLEAN,
    business_days_remaining INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.request_number,
        EXTRACT(DAY FROM r.due_date - NOW())::INTEGER as days_until_due,
        r.due_date < NOW() as is_overdue,
        -- Simplified business days calculation
        EXTRACT(DAY FROM r.due_date - NOW())::INTEGER * 5 / 7 as business_days_remaining
    FROM dsr_requests r
    WHERE r.status NOT IN ('completed', 'rejected', 'withdrawn')
    AND r.deleted_at IS NULL
    ORDER BY r.due_date;
END;
$$ LANGUAGE plpgsql;

-- Function to create standard DSR tasks
CREATE OR REPLACE FUNCTION create_dsr_tasks(
    p_request_id UUID,
    p_request_type dsr_request_type_enum,
    p_organization_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Create standard tasks based on request type
    CASE p_request_type
        WHEN 'access' THEN
            INSERT INTO dsr_request_tasks (request_id, task_type, title, priority, organization_id, created_by)
            VALUES 
                (p_request_id, 'verify_identity', 'Verify requestor identity', 'emergency', p_organization_id, NEW.created_by),
                (p_request_id, 'search_data', 'Search all data sources', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'review_data', 'Review collected data', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'apply_redactions', 'Apply necessary redactions', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'prepare_response', 'Prepare access response', 'high', p_organization_id, NEW.created_by);
                
        WHEN 'deletion' THEN
            INSERT INTO dsr_request_tasks (request_id, task_type, title, priority, organization_id, created_by)
            VALUES 
                (p_request_id, 'verify_identity', 'Verify requestor identity', 'emergency', p_organization_id, NEW.created_by),
                (p_request_id, 'search_data', 'Identify data for deletion', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'legal_review', 'Legal review for deletion', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'delete_data', 'Delete personal data', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'prepare_response', 'Prepare deletion confirmation', 'high', p_organization_id, NEW.created_by);
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create tasks on request creation
CREATE TRIGGER create_standard_tasks_trigger
    AFTER INSERT ON dsr_requests
    FOR EACH ROW
    EXECUTE FUNCTION create_dsr_tasks(NEW.id, NEW.request_type, NEW.organization_id);
```

## UI Integration

- **Primary Screens**:
  - **DSR Dashboard** for overview and metrics
  - **DSR Request Form** for intake and processing
  - **Record Editor** for detailed request management
  - **ListView** for request inventory and tracking
  - **Kanban Board** for task management
  - **Timeline View** for deadline visualization
  - **Document Manager** for request documents
  - **Response Builder** for creating responses
  - **Audit Trail Viewer** for compliance evidence

- **Integration Points**:
  - Public privacy portal for request submission
  - Email integration for request intake
  - Identity verification integration
  - Data discovery tools integration
  - Document generation for responses
  - Secure portal for response delivery
  - Analytics dashboard for metrics
  - Calendar integration for deadline management

## Compliance and Security Considerations

1. **Data Minimization**:
   - Automatic purging of completed request data after retention period
   - Redaction capabilities for sensitive information
   - Audit trail of all data access

2. **Security Requirements**:
   - Encryption of all personal data at rest
   - Secure communication channels for responses
   - Role-based access control for DSR processing
   - Activity logging for all DSR operations

3. **Regulatory Compliance**:
   - Configurable workflows per regulation
   - Template library for standard responses
   - Automated deadline tracking and alerts
   - Comprehensive audit trail for regulatory defense

4. **Integration Requirements**:
   - API endpoints for automated data discovery
   - Webhook support for system integration
   - Batch processing for high-volume requests
   - Export capabilities for regulatory reporting


# Training and Awareness Management - Database Schema

## Overview

This document defines the database schema for a comprehensive training and awareness management system that supports compliance training programs, awareness campaigns, certification tracking, and effectiveness measurement across the ArionComply platform. The design follows established database principles while providing flexibility for various training delivery methods and content types.

## Training Management Workflow

### 1. Core Training Program Management

#### Training Program Administration
- **Status**: Core Feature
- **Triggers**:
  - New compliance requirements
  - Annual training cycles
  - Role changes requiring training
  - Incident-driven training needs
  - Regulatory updates
  - New employee onboarding
- **Approval Requirements**:
  - Training content approval
  - Budget approval for external training
  - Compliance officer sign-off
  - Management approval for mandatory training
- **Data Model Requirements**:
  - `training_programs` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `program_name`: TEXT NOT NULL
    - `description`: TEXT
    - `program_type`: ENUM('compliance', 'security', 'privacy', 'role_specific', 'onboarding', 'refresher', 'remedial')
    - `status`: ENUM('draft', 'active', 'inactive', 'archived')
    - `target_audience`: JSONB -- Roles, departments, or specific users
    - `compliance_frameworks`: TEXT[] -- Related frameworks (ISO 27001, GDPR, etc.)
    - `is_mandatory`: BOOLEAN DEFAULT false
    - `passing_score`: INTEGER DEFAULT 80 -- Percentage required to pass
    - `validity_period_months`: INTEGER -- How long certification is valid
    - `estimated_duration_minutes`: INTEGER
    - `delivery_methods`: TEXT[] DEFAULT ARRAY['online'] -- online, instructor_led, blended, self_study
    - `prerequisites`: UUID[] -- Array of prerequisite program IDs
    - `effective_date`: DATE
    - `expiration_date`: DATE
    - `program_owner_id`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_target_audience CHECK (jsonb_typeof(target_audience) = 'object')
    - CONSTRAINT valid_passing_score CHECK (passing_score >= 0 AND passing_score <= 100)
  
  - `training_modules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `module_name`: TEXT NOT NULL
    - `description`: TEXT
    - `program_id`: UUID REFERENCES training_programs(id) ON DELETE CASCADE
    - `sequence_number`: INTEGER NOT NULL -- Order within program
    - `module_type`: ENUM('video', 'presentation', 'document', 'quiz', 'interactive', 'scenario', 'external_link')
    - `content_url`: TEXT -- Location of content
    - `content_data`: JSONB -- For quiz questions, scenarios, etc.
    - `is_optional`: BOOLEAN DEFAULT false
    - `estimated_duration_minutes`: INTEGER
    - `passing_score`: INTEGER -- Override program default if needed
    - `max_attempts`: INTEGER DEFAULT 3
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_content_data CHECK (jsonb_typeof(content_data) = 'object')
    - UNIQUE(program_id, sequence_number)
  
  - `training_assignments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `program_id`: UUID REFERENCES training_programs(id) ON DELETE CASCADE
    - `assignee_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `assignment_type`: ENUM('individual', 'role_based', 'department_based', 'compliance_driven', 'remedial')
    - `assignment_reason`: TEXT
    - `assigned_date`: TIMESTAMPTZ DEFAULT NOW()
    - `due_date`: TIMESTAMPTZ NOT NULL
    - `start_date`: TIMESTAMPTZ
    - `completion_date`: TIMESTAMPTZ
    - `status`: ENUM('assigned', 'not_started', 'in_progress', 'completed', 'expired', 'exempted')
    - `completion_percentage`: INTEGER DEFAULT 0
    - `attempts`: INTEGER DEFAULT 0
    - `final_score`: INTEGER
    - `exemption_reason`: TEXT
    - `exempted_by`: UUID REFERENCES users(id)
    - `reminder_count`: INTEGER DEFAULT 0
    - `last_reminder_sent`: TIMESTAMPTZ
    - `organization_id`: UUID REFERENCES organizations(id)
    - `assigned_by`: UUID REFERENCES users(id)
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(program_id, assignee_id)
    - INDEX idx_training_assignments_due (due_date, status) WHERE status NOT IN ('completed', 'exempted')

#### Training Execution and Tracking
- **Status**: Core Feature
- **Triggers**:
  - User starts training
  - Module completion
  - Assessment submission
  - Time-based progress tracking
- **Data Model Requirements**:
  - `training_activities` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `assignment_id`: UUID REFERENCES training_assignments(id) ON DELETE CASCADE
    - `module_id`: UUID REFERENCES training_modules(id) ON DELETE CASCADE
    - `activity_type`: ENUM('started', 'progress', 'completed', 'failed', 'abandoned')
    - `activity_timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `time_spent_seconds`: INTEGER
    - `progress_percentage`: INTEGER DEFAULT 0
    - `score`: INTEGER
    - `passed`: BOOLEAN
    - `activity_data`: JSONB -- Module-specific data (answers, interactions, etc.)
    - `ip_address`: TEXT
    - `user_agent`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_activity_data CHECK (jsonb_typeof(activity_data) = 'object')
    - INDEX idx_training_activities_assignment (assignment_id, module_id)
  
  - `training_assessments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `module_id`: UUID REFERENCES training_modules(id) ON DELETE CASCADE
    - `question_text`: TEXT NOT NULL
    - `question_type`: ENUM('multiple_choice', 'true_false', 'multi_select', 'short_answer', 'scenario')
    - `answer_options`: JSONB -- For multiple choice/select
    - `correct_answer`: JSONB NOT NULL
    - `explanation`: TEXT -- Why this answer is correct
    - `points`: INTEGER DEFAULT 1
    - `sequence_number`: INTEGER NOT NULL
    - `is_required`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_answer_options CHECK (jsonb_typeof(answer_options) = 'object')
    - CONSTRAINT valid_correct_answer CHECK (jsonb_typeof(correct_answer) = 'object')
    - UNIQUE(module_id, sequence_number)
  
  - `training_assessment_responses` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `activity_id`: UUID REFERENCES training_activities(id) ON DELETE CASCADE
    - `assessment_id`: UUID REFERENCES training_assessments(id) ON DELETE CASCADE
    - `user_answer`: JSONB NOT NULL
    - `is_correct`: BOOLEAN
    - `points_earned`: INTEGER DEFAULT 0
    - `time_spent_seconds`: INTEGER
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - CONSTRAINT valid_user_answer CHECK (jsonb_typeof(user_answer) = 'object')
    - UNIQUE(activity_id, assessment_id)

#### Training Completion and Certification
- **Status**: Core Feature
- **Triggers**:
  - Training completion
  - Assessment passing
  - Certification issuance
  - Renewal requirements
- **Data Model Requirements**:
  - `training_completions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `assignment_id`: UUID REFERENCES training_assignments(id) ON DELETE CASCADE
    - `completion_date`: TIMESTAMPTZ DEFAULT NOW()
    - `final_score`: INTEGER
    - `passed`: BOOLEAN NOT NULL
    - `time_spent_minutes`: INTEGER
    - `attempt_number`: INTEGER DEFAULT 1
    - `completion_method`: ENUM('online', 'instructor_verified', 'exempted', 'prior_learning')
    - `instructor_id`: UUID REFERENCES users(id) -- For instructor-led training
    - `comments`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - INDEX idx_training_completions_date (completion_date, passed)
  
  - `training_certificates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `certificate_number`: TEXT UNIQUE NOT NULL -- Human-readable certificate ID
    - `completion_id`: UUID REFERENCES training_completions(id) ON DELETE CASCADE
    - `program_id`: UUID REFERENCES training_programs(id)
    - `user_id`: UUID REFERENCES users(id)
    - `issue_date`: DATE DEFAULT CURRENT_DATE
    - `expiry_date`: DATE NOT NULL
    - `certificate_template_id`: UUID -- Reference to certificate template
    - `certificate_data`: JSONB -- Data used to generate certificate
    - `file_path`: TEXT -- Path to generated certificate file
    - `verification_code`: TEXT UNIQUE -- For external verification
    - `is_active`: BOOLEAN DEFAULT true
    - `revoked_date`: DATE
    - `revoked_reason`: TEXT
    - `revoked_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - CONSTRAINT valid_certificate_data CHECK (jsonb_typeof(certificate_data) = 'object')
    - INDEX idx_certificates_expiry (expiry_date, is_active) WHERE is_active = true
    - INDEX idx_certificates_user (user_id, is_active)

### 2. Awareness Campaign Management

#### Campaign Creation and Management
- **Status**: Enhancement
- **Triggers**:
  - Compliance awareness requirements
  - Security incident follow-up
  - Policy updates
  - Seasonal campaigns (e.g., Cybersecurity Month)
- **Data Model Requirements**:
  - `awareness_campaigns` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `campaign_name`: TEXT NOT NULL
    - `description`: TEXT
    - `campaign_type`: ENUM('security', 'privacy', 'compliance', 'policy', 'general')
    - `status`: ENUM('draft', 'scheduled', 'active', 'completed', 'cancelled')
    - `target_audience`: JSONB -- Roles, departments, or locations
    - `objectives`: TEXT[]
    - `key_messages`: TEXT[]
    - `start_date`: DATE NOT NULL
    - `end_date`: DATE NOT NULL
    - `delivery_channels`: TEXT[] -- email, posters, intranet, meetings, digital_signage
    - `frequency`: ENUM('one_time', 'weekly', 'monthly', 'quarterly')
    - `budget`: DECIMAL(10,2)
    - `success_metrics`: JSONB -- How to measure effectiveness
    - `campaign_owner_id`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_target_audience CHECK (jsonb_typeof(target_audience) = 'object')
    - CONSTRAINT valid_success_metrics CHECK (jsonb_typeof(success_metrics) = 'object')
    - CONSTRAINT valid_dates CHECK (start_date <= end_date)
  
  - `campaign_materials` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `campaign_id`: UUID REFERENCES awareness_campaigns(id) ON DELETE CASCADE
    - `material_name`: TEXT NOT NULL
    - `material_type`: ENUM('email', 'poster', 'video', 'article', 'quiz', 'infographic', 'presentation')
    - `content`: TEXT -- For text-based materials
    - `file_path`: TEXT -- For file-based materials
    - `thumbnail_path`: TEXT -- Preview image
    - `language`: TEXT DEFAULT 'en'
    - `target_channel`: TEXT -- Which delivery channel this is for
    - `schedule_date`: DATE -- When to release this material
    - `usage_count`: INTEGER DEFAULT 0
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `campaign_schedules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `campaign_id`: UUID REFERENCES awareness_campaigns(id) ON DELETE CASCADE
    - `material_id`: UUID REFERENCES campaign_materials(id) ON DELETE CASCADE
    - `scheduled_date`: TIMESTAMPTZ NOT NULL
    - `delivery_channel`: TEXT NOT NULL
    - `target_audience_filter`: JSONB -- Specific subset of campaign audience
    - `delivery_status`: ENUM('scheduled', 'in_progress', 'delivered', 'failed', 'cancelled')
    - `delivered_at`: TIMESTAMPTZ
    - `recipient_count`: INTEGER DEFAULT 0
    - `delivery_metadata`: JSONB -- Channel-specific delivery info
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - CONSTRAINT valid_audience_filter CHECK (jsonb_typeof(target_audience_filter) = 'object')
    - CONSTRAINT valid_delivery_metadata CHECK (jsonb_typeof(delivery_metadata) = 'object')
    - INDEX idx_campaign_schedules_date (scheduled_date, delivery_status)

#### Campaign Engagement Tracking
- **Status**: Enhancement
- **Triggers**:
  - Material views
  - Link clicks
  - Quiz completions
  - Feedback submissions
- **Data Model Requirements**:
  - `campaign_engagement` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `campaign_id`: UUID REFERENCES awareness_campaigns(id) ON DELETE CASCADE
    - `material_id`: UUID REFERENCES campaign_materials(id) ON DELETE CASCADE
    - `user_id`: UUID REFERENCES users(id)
    - `engagement_type`: ENUM('view', 'click', 'download', 'share', 'complete', 'feedback')
    - `engagement_timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `engagement_data`: JSONB -- Additional context (e.g., quiz score, feedback text)
    - `ip_address`: TEXT
    - `user_agent`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_engagement_data CHECK (jsonb_typeof(engagement_data) = 'object')
    - INDEX idx_campaign_engagement_user (user_id, campaign_id)
    - INDEX idx_campaign_engagement_timestamp (engagement_timestamp, campaign_id)

### 3. Training Analytics and Reporting

#### Training Metrics
- **Status**: Core Feature
- **Triggers**:
  - Scheduled metric calculation
  - Report generation
  - Dashboard refresh
- **Data Model Requirements**:
  - `training_metrics` table (materialized view):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_date`: DATE NOT NULL
    - `organization_id`: UUID REFERENCES organizations(id)
    - `program_id`: UUID REFERENCES training_programs(id)
    - `total_assigned`: INTEGER DEFAULT 0
    - `total_completed`: INTEGER DEFAULT 0
    - `total_passed`: INTEGER DEFAULT 0
    - `total_failed`: INTEGER DEFAULT 0
    - `total_overdue`: INTEGER DEFAULT 0
    - `average_score`: DECIMAL(5,2)
    - `average_completion_days`: DECIMAL(5,2)
    - `by_department`: JSONB -- Breakdown by department
    - `by_role`: JSONB -- Breakdown by role
    - `effectiveness_score`: DECIMAL(5,2) -- Based on post-training assessments
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(metric_date, organization_id, program_id)
  
  - `training_effectiveness` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `program_id`: UUID REFERENCES training_programs(id)
    - `evaluation_type`: ENUM('immediate', '30_day', '90_day', 'annual')
    - `evaluation_date`: DATE
    - `participants_evaluated`: INTEGER
    - `knowledge_retention_score`: DECIMAL(5,2) -- 0-100
    - `behavior_change_score`: DECIMAL(5,2) -- 0-100
    - `incident_reduction_percentage`: DECIMAL(5,2) -- For security training
    - `evaluation_method`: TEXT
    - `evaluation_data`: JSONB -- Detailed metrics
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - CONSTRAINT valid_evaluation_data CHECK (jsonb_typeof(evaluation_data) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_training_programs_active ON training_programs (organization_id, status) 
    WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_training_assignments_user ON training_assignments (assignee_id, status) 
    WHERE status NOT IN ('completed', 'exempted');
CREATE INDEX idx_training_activities_module ON training_activities (module_id, activity_type);
CREATE INDEX idx_training_certificates_verify ON training_certificates (verification_code) 
    WHERE is_active = true;
CREATE INDEX idx_awareness_campaigns_active ON awareness_campaigns (organization_id, status, start_date) 
    WHERE deleted_at IS NULL AND status IN ('scheduled', 'active');

-- GIN indexes for JSONB fields
CREATE INDEX idx_training_programs_audience ON training_programs USING GIN (target_audience);
CREATE INDEX idx_campaign_materials_metadata ON campaign_materials USING GIN (target_channel);
CREATE INDEX idx_training_metrics_dept ON training_metrics USING GIN (by_department);
```

## Functions and Triggers

```sql
-- Function to calculate training due dates
CREATE OR REPLACE FUNCTION calculate_training_due_date(
    p_assignment_type training_assignment_type_enum,
    p_validity_months INTEGER
) RETURNS TIMESTAMPTZ AS $
BEGIN
    CASE p_assignment_type
        WHEN 'onboarding' THEN
            RETURN NOW() + INTERVAL '30 days';
        WHEN 'compliance_driven' THEN
            RETURN NOW() + INTERVAL '60 days';
        WHEN 'remedial' THEN
            RETURN NOW() + INTERVAL '14 days';
        ELSE
            RETURN NOW() + INTERVAL '90 days';
    END CASE;
END;
$ LANGUAGE plpgsql;

-- Function to check training prerequisites
CREATE OR REPLACE FUNCTION check_training_prerequisites(
    p_user_id UUID,
    p_program_id UUID
) RETURNS BOOLEAN AS $
DECLARE
    v_prerequisites UUID[];
    v_completed_count INTEGER;
BEGIN
    -- Get prerequisites for the program
    SELECT prerequisites INTO v_prerequisites
    FROM training_programs
    WHERE id = p_program_id;
    
    IF v_prerequisites IS NULL OR array_length(v_prerequisites, 1) IS NULL THEN
        RETURN TRUE; -- No prerequisites
    END IF;
    
    -- Check if user has completed all prerequisites
    SELECT COUNT(DISTINCT tc.program_id)
    INTO v_completed_count
    FROM training_completions tc
    JOIN training_assignments ta ON tc.assignment_id = ta.id
    WHERE ta.assignee_id = p_user_id
    AND tc.passed = true
    AND tc.program_id = ANY(v_prerequisites);
    
    RETURN v_completed_count = array_length(v_prerequisites, 1);
END;
$ LANGUAGE plpgsql;

-- Trigger to update assignment completion percentage
CREATE OR REPLACE FUNCTION update_assignment_completion()
RETURNS TRIGGER AS $
DECLARE
    v_total_modules INTEGER;
    v_completed_modules INTEGER;
    v_percentage INTEGER;
BEGIN
    -- Count total modules in the program
    SELECT COUNT(*) INTO v_total_modules
    FROM training_modules
    WHERE program_id = (
        SELECT program_id FROM training_assignments WHERE id = NEW.assignment_id
    );
    
    -- Count completed modules
    SELECT COUNT(DISTINCT module_id) INTO v_completed_modules
    FROM training_activities
    WHERE assignment_id = NEW.assignment_id
    AND activity_type = 'completed';
    
    -- Calculate percentage
    v_percentage := CASE 
        WHEN v_total_modules > 0 THEN (v_completed_modules * 100 / v_total_modules)
        ELSE 0
    END;
    
    -- Update assignment
    UPDATE training_assignments
    SET completion_percentage = v_percentage,
        updated_at = NOW()
    WHERE id = NEW.assignment_id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER update_completion_percentage_trigger
    AFTER INSERT OR UPDATE ON training_activities
    FOR EACH ROW
    WHEN (NEW.activity_type = 'completed')
    EXECUTE FUNCTION update_assignment_completion();

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number(
    p_organization_id UUID,
    p_program_id UUID
) RETURNS TEXT AS $
DECLARE
    v_org_code TEXT;
    v_program_code TEXT;
    v_year TEXT;
    v_sequence INTEGER;
BEGIN
    -- Get organization code (first 3 letters)
    SELECT UPPER(LEFT(name, 3)) INTO v_org_code
    FROM organizations WHERE id = p_organization_id;
    
    -- Get program code (first 4 letters)
    SELECT UPPER(LEFT(program_name, 4)) INTO v_program_code
    FROM training_programs WHERE id = p_program_id;
    
    -- Get current year
    v_year := TO_CHAR(NOW(), 'YY');
    
    -- Get next sequence number
    SELECT COALESCE(MAX(CAST(SUBSTRING(certificate_number FROM '[0-9]+) AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM training_certificates
    WHERE certificate_number LIKE v_org_code || '-' || v_program_code || '-' || v_year || '-%';
    
    RETURN v_org_code || '-' || v_program_code || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
END;
$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **Training Dashboard** for learner overview and progress
  - **Training Catalog** for browsing available programs
  - **Training Calendar** for scheduled sessions
  - **Record Editor** for program and module creation
  - **ListView** for training inventory management
  - **Assignment Manager** for bulk assignments
  - **Certificate Viewer** for viewing/downloading certificates
  - **Campaign Manager** for awareness campaigns
  - **Analytics Dashboard** for training metrics

- **Integration Points**:
  - LMS integration for content delivery
  - Calendar integration for instructor-led sessions
  - Email integration for notifications
  - Document management for training materials
  - Compliance dashboard for training status
  - Mobile app for on-the-go training
  - QR codes for attendance tracking
  - Digital signature for completion verification

## Migration and Compliance Considerations

1. **Content Migration**:
   - Import existing training materials
   - Map historical training records
   - Convert existing certifications

2. **Compliance Requirements**:
   - Automated assignment based on regulations
   - Evidence of training for audits
   - Renewal tracking and notifications
   - Exemption management with justification

3. **Integration Points**:
   - SCORM/xAPI support for e-learning
   - Video conferencing for virtual sessions
   - Document signing for acknowledgments
   - HR systems for employee data sync


# Generic Task Management System - Database Schema

## Overview

This document defines the database schema for a comprehensive task management system that supports cross-entity task creation, assignment, tracking, and completion across all ArionComply workflows. The design follows established database principles while providing flexibility for tasks related to any entity type in the system.

## Task Management Workflow

### 1. Core Task Management

#### Task Creation and Assignment
- **Status**: Core Feature
- **Triggers**:
  - Control implementation requirements
  - Risk treatment actions
  - Audit findings requiring action
  - Document review assignments
  - Privacy request fulfillment
  - Incident response activities
  - Any workflow requiring tracked activities
- **Approval Requirements**:
  - Task creation by authorized users
  - Assignment acceptance by assignees (optional)
  - Completion approval by task owners
  - Escalation approval for overdue tasks
- **Data Model Requirements**:
  - `tasks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `title`: TEXT NOT NULL
    - `description`: TEXT
    - `task_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic task types
    - `priority`: priority_enum DEFAULT 'medium'
    - `status`: ENUM('draft', 'assigned', 'accepted', 'in_progress', 'pending_review', 'completed', 'cancelled', 'overdue')
    - `due_date`: TIMESTAMPTZ
    - `start_date`: TIMESTAMPTZ
    - `completed_date`: TIMESTAMPTZ
    - `estimated_hours`: DECIMAL(5,2)
    - `actual_hours`: DECIMAL(5,2)
    - `completion_percentage`: INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
    - `assignee_id`: UUID REFERENCES users(id)
    - `assigned_by_id`: UUID REFERENCES users(id)
    - `approver_id`: UUID REFERENCES users(id) -- For tasks requiring approval
    - `parent_task_id`: UUID REFERENCES tasks(id) -- For subtasks
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - CONSTRAINT valid_dates CHECK (start_date IS NULL OR due_date IS NULL OR start_date <= due_date)
    - CONSTRAINT valid_completion CHECK (completed_date IS NULL OR status IN ('completed', 'cancelled'))
  
  - `task_entity_links` table (polymorphic relationship - justified by truly generic behavior):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `entity_type`: TEXT NOT NULL -- 'risk', 'control', 'incident', etc.
    - `entity_id`: UUID NOT NULL
    - `link_type`: ENUM('related_to', 'implements', 'resolves', 'reviews', 'creates')
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - UNIQUE(task_id, entity_type, entity_id)
    - INDEX idx_task_entity_lookup (entity_type, entity_id) -- For finding tasks by entity
  
  - `task_dependencies` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `predecessor_task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `successor_task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `dependency_type`: ENUM('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish')
    - `lag_days`: INTEGER DEFAULT 0 -- Days between dependent tasks
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - UNIQUE(predecessor_task_id, successor_task_id)
    - CONSTRAINT no_self_dependency CHECK (predecessor_task_id != successor_task_id)
  
  - `task_assignments_history` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `assigned_to_id`: UUID REFERENCES users(id)
    - `assigned_by_id`: UUID REFERENCES users(id)
    - `assignment_date`: TIMESTAMPTZ DEFAULT NOW()
    - `unassignment_date`: TIMESTAMPTZ
    - `assignment_reason`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
  
  - `task_comments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `comment_text`: TEXT NOT NULL
    - `is_internal`: BOOLEAN DEFAULT false -- Internal notes vs. shared comments
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
  
  - `task_attachments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `file_name`: TEXT NOT NULL
    - `file_path`: TEXT NOT NULL
    - `file_size`: BIGINT
    - `mime_type`: TEXT
    - `description`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support

#### Task Notifications and Escalations
- **Status**: Core Feature
- **Triggers**:
  - Task assignment
  - Due date approaching
  - Task overdue
  - Status changes
  - Comment additions
  - Completion approval needed
- **Data Model Requirements**:
  - `task_notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `notification_type`: ENUM('assignment', 'due_soon', 'overdue', 'status_change', 'comment', 'approval_needed', 'completed', 'escalated')
    - `recipient_id`: UUID REFERENCES users(id)
    - `sent_at`: TIMESTAMPTZ DEFAULT NOW()
    - `read_at`: TIMESTAMPTZ
    - `notification_data`: JSONB -- Additional context for the notification
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_notification_data CHECK (jsonb_typeof(notification_data) = 'object')
  
  - `task_escalations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `escalation_level`: INTEGER DEFAULT 1
    - `escalated_to_id`: UUID REFERENCES users(id)
    - `escalation_reason`: TEXT
    - `escalated_at`: TIMESTAMPTZ DEFAULT NOW()
    - `resolved_at`: TIMESTAMPTZ
    - `resolution_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`: UUID REFERENCES users(id)

#### Task Templates
- **Status**: Enhancement
- **Triggers**:
  - Recurring compliance activities
  - Standard operating procedures
  - Common task patterns
- **Data Model Requirements**:
  - `task_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `description`: TEXT
    - `template_type_id`: UUID REFERENCES lookup_options(id)
    - `is_active`: BOOLEAN DEFAULT true
    - `task_data`: JSONB NOT NULL -- Template task structure
    - `default_assignments`: JSONB -- Default assignment rules
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_task_data CHECK (jsonb_typeof(task_data) = 'object')
    - CONSTRAINT valid_default_assignments CHECK (jsonb_typeof(default_assignments) = 'object')
  
  - `task_recurrence_patterns` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `template_id`: UUID REFERENCES task_templates(id)
    - `pattern_type`: ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom')
    - `pattern_config`: JSONB NOT NULL -- Recurrence configuration
    - `next_occurrence`: DATE
    - `end_date`: DATE -- Optional end date for recurrence
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_pattern_config CHECK (jsonb_typeof(pattern_config) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_tasks_assignee_status ON tasks (assignee_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due_date ON tasks (due_date) WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_tasks_org_status ON tasks (organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_task_entity_by_entity ON task_entity_links (entity_type, entity_id);
CREATE INDEX idx_task_notifications_unread ON task_notifications (recipient_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_task_dependencies_successor ON task_dependencies (successor_task_id);

-- GIN indexes for JSONB fields
CREATE INDEX idx_tasks_custom_fields ON tasks USING GIN (custom_fields);
CREATE INDEX idx_task_templates_data ON task_templates USING GIN (task_data);
```

## Functions and Triggers

```sql
-- Function to check circular dependencies
CREATE OR REPLACE FUNCTION check_circular_dependency()
RETURNS TRIGGER AS $$
DECLARE
    has_circular BOOLEAN;
BEGIN
    WITH RECURSIVE dep_chain AS (
        SELECT successor_task_id, predecessor_task_id
        FROM task_dependencies
        WHERE predecessor_task_id = NEW.successor_task_id
        
        UNION ALL
        
        SELECT td.successor_task_id, td.predecessor_task_id
        FROM task_dependencies td
        JOIN dep_chain dc ON td.predecessor_task_id = dc.successor_task_id
    )
    SELECT EXISTS (
        SELECT 1 FROM dep_chain 
        WHERE successor_task_id = NEW.predecessor_task_id
    ) INTO has_circular;
    
    IF has_circular THEN
        RAISE EXCEPTION 'Circular dependency detected';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_circular_dependencies
    BEFORE INSERT OR UPDATE ON task_dependencies
    FOR EACH ROW
    EXECUTE FUNCTION check_circular_dependency();

-- Function to update parent task completion percentage
CREATE OR REPLACE FUNCTION update_parent_task_completion()
RETURNS TRIGGER AS $$
DECLARE
    avg_completion DECIMAL;
BEGIN
    IF NEW.parent_task_id IS NOT NULL THEN
        SELECT AVG(completion_percentage)
        INTO avg_completion
        FROM tasks
        WHERE parent_task_id = NEW.parent_task_id
        AND deleted_at IS NULL;
        
        UPDATE tasks
        SET completion_percentage = COALESCE(avg_completion, 0),
            updated_at = NOW()
        WHERE id = NEW.parent_task_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_parent_completion
    AFTER INSERT OR UPDATE OF completion_percentage ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_parent_task_completion();

-- Function to create task from template
CREATE OR REPLACE FUNCTION create_task_from_template(
    p_template_id UUID,
    p_created_by UUID,
    p_organization_id UUID,
    p_custom_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    v_task_id UUID;
    v_template RECORD;
BEGIN
    SELECT * INTO v_template
    FROM task_templates
    WHERE id = p_template_id
    AND organization_id = p_organization_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found or inactive';
    END IF;
    
    -- Create task from template data
    INSERT INTO tasks (
        title,
        description,
        task_type_id,
        priority,
        estimated_hours,
        organization_id,
        created_by,
        custom_fields
    )
    SELECT 
        COALESCE(p_custom_data->>'title', v_template.task_data->>'title'),
        COALESCE(p_custom_data->>'description', v_template.task_data->>'description'),
        (v_template.task_data->>'task_type_id')::UUID,
        COALESCE((p_custom_data->>'priority')::priority_enum, (v_template.task_data->>'priority')::priority_enum),
        (v_template.task_data->>'estimated_hours')::DECIMAL,
        p_organization_id,
        p_created_by,
        v_template.task_data->'custom_fields' || p_custom_data->'custom_fields'
    RETURNING id INTO v_task_id;
    
    RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **Task Dashboard** for personal task management and overview
  - **Record Editor** for detailed task creation and editing
  - **ListView** for task inventory and bulk management
  - **Kanban Board** for visual task status management
  - **Calendar View** for deadline and schedule visualization
  - **Timeline/Gantt View** for project and dependency visualization
  - **Planning Hub** for integrated planning across all views

- **Integration Points**:
  - Tasks can be created from any entity screen (controls, risks, incidents, etc.)
  - Task status updates reflect in parent entity screens
  - Notification center shows task-related alerts
  - Dashboard widgets for task metrics and deadlines
  - Mobile app support for field task updates

## Migration Considerations

For organizations migrating from existing task systems:

1. **Data Import Support**:
   - Bulk import functionality for existing tasks
   - Mapping templates for common task management systems
   - Validation and conflict resolution during import

2. **Gradual Adoption**:
   - Ability to run parallel with existing systems
   - Selective migration by department or workflow
   - Historical task data preservation

3. **Integration APIs**:
   - RESTful APIs for third-party task system integration
   - Webhook support for real-time synchronization
   - Export capabilities for reporting tools
    

# Comprehensive Notification System - Database Schema

## Overview

This document defines the database schema for a comprehensive notification system that supports multi-channel delivery, template management, rule-based triggers, and user preferences across the ArionComply platform. The design follows established database principles while providing flexibility for various notification scenarios.

## Notification Management Workflow

### 1. Core Notification System

#### Notification Creation and Delivery
- **Status**: Core Feature
- **Triggers**:
  - Task assignments and updates
  - Approval requests
  - Deadline reminders
  - Compliance alerts
  - System events
  - Security incidents
  - Audit findings
  - Policy updates
  - Training assignments
- **Approval Requirements**:
  - Template approval for organization-wide notifications
  - Security review for external notifications
  - Compliance review for regulatory notifications
- **Data Model Requirements**:
  - `notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `notification_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic notification types
    - `title`: TEXT NOT NULL
    - `message`: TEXT NOT NULL
    - `priority`: priority_enum DEFAULT 'medium'
    - `status`: ENUM('pending', 'sent', 'delivered', 'read', 'failed', 'cancelled')
    - `recipient_id`: UUID REFERENCES users(id)
    - `sender_id`: UUID REFERENCES users(id) -- NULL for system notifications
    - `scheduled_for`: TIMESTAMPTZ DEFAULT NOW()
    - `sent_at`: TIMESTAMPTZ
    - `delivered_at`: TIMESTAMPTZ
    - `read_at`: TIMESTAMPTZ
    - `expires_at`: TIMESTAMPTZ -- Optional expiration for time-sensitive notifications
    - `template_id`: UUID REFERENCES notification_templates(id)
    - `template_data`: JSONB -- Data used to populate template
    - `related_entity_type`: TEXT -- Entity this notification relates to
    - `related_entity_id`: UUID -- ID of related entity
    - `action_url`: TEXT -- Deep link to relevant screen/action
    - `action_required`: BOOLEAN DEFAULT false
    - `action_completed`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_template_data CHECK (jsonb_typeof(template_data) = 'object')
    - CONSTRAINT valid_dates CHECK (scheduled_for <= COALESCE(expires_at, scheduled_for + INTERVAL '1 year'))
  
  - `notification_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `description`: TEXT
    - `template_type`: ENUM('system', 'compliance', 'security', 'administrative', 'custom')
    - `is_active`: BOOLEAN DEFAULT true
    - `subject_template`: TEXT NOT NULL -- Template for notification title
    - `body_template`: TEXT NOT NULL -- Template for notification content
    - `html_template`: TEXT -- Optional HTML version
    - `variables`: JSONB NOT NULL -- Required variables and their types
    - `default_priority`: priority_enum DEFAULT 'medium'
    - `default_expiry_hours`: INTEGER -- Default hours until expiration
    - `supported_channels`: TEXT[] DEFAULT ARRAY['in_app'] -- Array of supported delivery channels
    - `organization_id`: UUID REFERENCES organizations(id) -- NULL for system templates
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_variables CHECK (jsonb_typeof(variables) = 'object')
    - UNIQUE(template_name, organization_id)
  
  - `notification_channels` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `channel_name`: TEXT NOT NULL UNIQUE
    - `channel_type`: ENUM('in_app', 'email', 'sms', 'push', 'webhook', 'integration')
    - `is_enabled`: BOOLEAN DEFAULT true
    - `configuration`: JSONB NOT NULL -- Channel-specific configuration
    - `rate_limits`: JSONB -- Rate limiting configuration
    - `retry_policy`: JSONB -- Retry configuration for failed deliveries
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_configuration CHECK (jsonb_typeof(configuration) = 'object')
    - CONSTRAINT valid_rate_limits CHECK (jsonb_typeof(rate_limits) = 'object')
    - CONSTRAINT valid_retry_policy CHECK (jsonb_typeof(retry_policy) = 'object')
  
  - `notification_deliveries` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `notification_id`: UUID REFERENCES notifications(id) ON DELETE CASCADE
    - `channel_id`: UUID REFERENCES notification_channels(id)
    - `delivery_status`: ENUM('pending', 'sent', 'delivered', 'failed', 'bounced')
    - `attempt_count`: INTEGER DEFAULT 1
    - `sent_at`: TIMESTAMPTZ
    - `delivered_at`: TIMESTAMPTZ
    - `failed_at`: TIMESTAMPTZ
    - `failure_reason`: TEXT
    - `delivery_metadata`: JSONB -- Channel-specific delivery information
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_delivery_metadata CHECK (jsonb_typeof(delivery_metadata) = 'object')
    - UNIQUE(notification_id, channel_id)

#### Notification Rules and Automation
- **Status**: Core Feature
- **Triggers**:
  - Database events
  - Time-based triggers
  - Threshold breaches
  - Workflow state changes
  - External system events
- **Data Model Requirements**:
  - `notification_rules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `rule_name`: TEXT NOT NULL
    - `description`: TEXT
    - `rule_type`: ENUM('event', 'scheduled', 'threshold', 'workflow', 'external')
    - `is_active`: BOOLEAN DEFAULT true
    - `trigger_conditions`: JSONB NOT NULL -- Conditions that trigger the rule
    - `template_id`: UUID REFERENCES notification_templates(id)
    - `recipient_rules`: JSONB NOT NULL -- Rules for determining recipients
    - `channel_preferences`: TEXT[] -- Preferred delivery channels
    - `priority_override`: priority_enum -- Override template priority
    - `cooldown_minutes`: INTEGER -- Minimum time between notifications
    - `max_notifications_per_day`: INTEGER -- Daily limit
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_trigger_conditions CHECK (jsonb_typeof(trigger_conditions) = 'object')
    - CONSTRAINT valid_recipient_rules CHECK (jsonb_typeof(recipient_rules) = 'object')
  
  - `notification_rule_executions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `rule_id`: UUID REFERENCES notification_rules(id) ON DELETE CASCADE
    - `execution_time`: TIMESTAMPTZ DEFAULT NOW()
    - `trigger_data`: JSONB -- Data that triggered the rule
    - `notifications_created`: INTEGER DEFAULT 0
    - `execution_status`: ENUM('success', 'partial', 'failed')
    - `error_details`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_trigger_data CHECK (jsonb_typeof(trigger_data) = 'object')

#### User Notification Preferences
- **Status**: Core Feature
- **Triggers**:
  - User preference updates
  - Role-based defaults
  - Organization policies
- **Data Model Requirements**:
  - `notification_preferences` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `notification_type_id`: UUID REFERENCES lookup_options(id) -- Specific notification type
    - `is_enabled`: BOOLEAN DEFAULT true
    - `channel_preferences`: TEXT[] -- Ordered list of preferred channels
    - `frequency`: ENUM('immediate', 'hourly', 'daily', 'weekly') DEFAULT 'immediate'
    - `quiet_hours_start`: TIME -- Start of do-not-disturb period
    - `quiet_hours_end`: TIME -- End of do-not-disturb period
    - `quiet_hours_timezone`: TEXT -- IANA timezone
    - `digest_enabled`: BOOLEAN DEFAULT false -- Batch notifications
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(user_id, notification_type_id)
  
  - `notification_subscriptions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `subscription_type`: ENUM('entity', 'event', 'report', 'digest')
    - `entity_type`: TEXT -- For entity subscriptions
    - `entity_id`: UUID -- For specific entity subscriptions
    - `event_pattern`: TEXT -- For event subscriptions
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - INDEX idx_notification_subs_entity (entity_type, entity_id) WHERE subscription_type = 'entity'
  
  - `notification_digests` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `digest_type`: ENUM('daily', 'weekly')
    - `scheduled_for`: TIMESTAMPTZ
    - `sent_at`: TIMESTAMPTZ
    - `notification_count`: INTEGER DEFAULT 0
    - `digest_content`: JSONB -- Aggregated notification data
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_digest_content CHECK (jsonb_typeof(digest_content) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_notifications_recipient_unread ON notifications (recipient_id, read_at) 
    WHERE deleted_at IS NULL AND read_at IS NULL;
CREATE INDEX idx_notifications_scheduled ON notifications (scheduled_for) 
    WHERE deleted_at IS NULL AND status = 'pending';
CREATE INDEX idx_notifications_entity ON notifications (related_entity_type, related_entity_id) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_deliveries_pending ON notification_deliveries (delivery_status, sent_at) 
    WHERE delivery_status = 'pending';
CREATE INDEX idx_notification_rules_active ON notification_rules (is_active, rule_type) 
    WHERE is_active = true;
CREATE INDEX idx_notification_preferences_user ON notification_preferences (user_id, is_enabled);

-- GIN indexes for JSONB fields
CREATE INDEX idx_notification_templates_vars ON notification_templates USING GIN (variables);
CREATE INDEX idx_notification_rules_conditions ON notification_rules USING GIN (trigger_conditions);
CREATE INDEX idx_notification_rules_recipients ON notification_rules USING GIN (recipient_rules);
```

## Functions and Triggers

```sql
-- Function to create notifications from template
CREATE OR REPLACE FUNCTION create_notification_from_template(
    p_template_id UUID,
    p_recipient_id UUID,
    p_template_data JSONB,
    p_related_entity_type TEXT DEFAULT NULL,
    p_related_entity_id UUID DEFAULT NULL,
    p_sender_id UUID DEFAULT NULL,
    p_organization_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
    v_template RECORD;
    v_title TEXT;
    v_message TEXT;
BEGIN
    -- Get template
    SELECT * INTO v_template
    FROM notification_templates
    WHERE id = p_template_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found or inactive';
    END IF;
    
    -- Validate required variables
    IF NOT (v_template.variables <@ p_template_data) THEN
        RAISE EXCEPTION 'Missing required template variables';
    END IF;
    
    -- Render template (simplified - in practice would use proper template engine)
    v_title := v_template.subject_template;
    v_message := v_template.body_template;
    
    -- Simple variable replacement (in practice would be more sophisticated)
    FOR key, value IN SELECT * FROM jsonb_each_text(p_template_data) LOOP
        v_title := REPLACE(v_title, '{{' || key || '}}', value);
        v_message := REPLACE(v_message, '{{' || key || '}}', value);
    END LOOP;
    
    -- Create notification
    INSERT INTO notifications (
        template_id,
        title,
        message,
        priority,
        recipient_id,
        sender_id,
        template_data,
        related_entity_type,
        related_entity_id,
        organization_id,
        expires_at,
        created_by
    ) VALUES (
        p_template_id,
        v_title,
        v_message,
        v_template.default_priority,
        p_recipient_id,
        p_sender_id,
        p_template_data,
        p_related_entity_type,
        p_related_entity_id,
        p_organization_id,
        CASE 
            WHEN v_template.default_expiry_hours IS NOT NULL 
            THEN NOW() + (v_template.default_expiry_hours || ' hours')::INTERVAL 
            ELSE NULL 
        END,
        COALESCE(p_sender_id, p_recipient_id)
    ) RETURNING id INTO v_notification_id;
    
    -- Create delivery records for user's preferred channels
    INSERT INTO notification_deliveries (notification_id, channel_id, organization_id)
    SELECT 
        v_notification_id,
        nc.id,
        p_organization_id
    FROM notification_channels nc
    WHERE nc.channel_name = ANY(
        SELECT unnest(COALESCE(np.channel_preferences, ARRAY['in_app']))
        FROM notification_preferences np
        WHERE np.user_id = p_recipient_id
        AND np.notification_type_id = (
            SELECT id FROM lookup_options 
            WHERE list_name = 'notification_types' 
            AND value = v_template.template_type::TEXT
        )
    )
    AND nc.is_enabled = true;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process notification rules
CREATE OR REPLACE FUNCTION process_notification_rule(
    p_rule_id UUID,
    p_trigger_data JSONB
) RETURNS INTEGER AS $$
DECLARE
    v_rule RECORD;
    v_recipients UUID[];
    v_notification_count INTEGER := 0;
    v_recipient_id UUID;
BEGIN
    -- Get rule
    SELECT * INTO v_rule
    FROM notification_rules
    WHERE id = p_rule_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Check cooldown period
    IF EXISTS (
        SELECT 1 FROM notification_rule_executions
        WHERE rule_id = p_rule_id
        AND execution_time > NOW() - (v_rule.cooldown_minutes || ' minutes')::INTERVAL
    ) THEN
        RETURN 0;
    END IF;
    
    -- Determine recipients based on rule (simplified)
    -- In practice, this would be much more sophisticated
    IF v_rule.recipient_rules->>'type' = 'role' THEN
        SELECT ARRAY_AGG(u.id)
        INTO v_recipients
        FROM users u
        JOIN user_role_assignments ura ON u.id = ura.user_id
        WHERE ura.role_id = (v_rule.recipient_rules->>'role_id')::UUID
        AND u.status = 'active';
    END IF;
    
    -- Create notifications for each recipient
    FOREACH v_recipient_id IN ARRAY v_recipients LOOP
        PERFORM create_notification_from_template(
            v_rule.template_id,
            v_recipient_id,
            p_trigger_data,
            v_rule.trigger_conditions->>'entity_type',
            (v_rule.trigger_conditions->>'entity_id')::UUID,
            NULL,
            v_rule.organization_id
        );
        v_notification_count := v_notification_count + 1;
    END LOOP;
    
    -- Log execution
    INSERT INTO notification_rule_executions (
        rule_id,
        trigger_data,
        notifications_created,
        execution_status,
        organization_id
    ) VALUES (
        p_rule_id,
        p_trigger_data,
        v_notification_count,
        'success',
        v_rule.organization_id
    );
    
    RETURN v_notification_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to mark notifications as read when accessed
CREATE OR REPLACE FUNCTION mark_notification_read()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.read_at IS NULL AND NEW.read_at IS NOT NULL THEN
        -- Update delivery status
        UPDATE notification_deliveries
        SET delivered_at = NOW(),
            delivery_status = 'delivered'
        WHERE notification_id = NEW.id
        AND delivery_status IN ('sent', 'pending');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_read_status
    AFTER UPDATE OF read_at ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION mark_notification_read();
```

## UI Integration

- **Primary Screens**:
  - **Notification Center** for viewing and managing all notifications
  - **Notification Preferences** in user settings
  - **Notification Templates** in admin panel
  - **Notification Rules** configuration screen
  - **Global notification bell/icon** in header with count badge

- **Integration Points**:
  - Real-time notifications via WebSocket
  - Push notifications for mobile apps
  - Email integration for external delivery
  - SMS gateway integration
  - Calendar integration for time-based notifications
  - Deep linking from notifications to relevant screens

## Migration and Integration Considerations

1. **Email Service Integration**:
   - Support for SendGrid, AWS SES, SMTP
   - Template synchronization with email service
   - Bounce and complaint handling

2. **Mobile Push Notifications**:
   - FCM (Firebase Cloud Messaging) for Android
   - APNs (Apple Push Notification service) for iOS
   - Token management and device registration

3. **Webhook Delivery**:
   - Configurable webhook endpoints
   - Retry logic with exponential backoff
   - Signature verification for security

4. **Rate Limiting**:
   - Per-user rate limits
   - Per-channel rate limits
   - Organization-wide limits
   - Burst allowances for critical notifications


# Data Subject Request (DSR) Management - Database Schema

## Overview

This document defines the database schema for managing Data Subject Requests (DSRs) as required by GDPR, CCPA, and other privacy regulations. The system supports the full lifecycle of privacy rights requests including access, deletion, rectification, portability, and objection requests.

## DSR Management Workflow

### 1. Core DSR Processing

#### Request Intake and Validation
- **Status**: Mandatory for Privacy Compliance
- **Triggers**:
  - Direct request from data subject
  - Request via privacy portal
  - Email/letter request
  - Third-party request (with authorization)
  - Regulatory authority request
- **Approval Requirements**:
  - Identity verification
  - Request legitimacy validation
  - DPO/Privacy Officer review
  - Legal review for complex requests
- **Data Model Requirements**:
  - `dsr_requests` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_number`: TEXT UNIQUE NOT NULL -- Human-readable request ID
    - `request_type`: ENUM('access', 'deletion', 'rectification', 'portability', 'objection', 'restriction', 'automated_decision_review')
    - `status`: ENUM('received', 'verifying_identity', 'in_progress', 'pending_approval', 'approved', 'completed', 'rejected', 'withdrawn')
    - `priority`: priority_enum DEFAULT 'high' -- DSRs typically high priority
    - `channel`: ENUM('portal', 'email', 'phone', 'letter', 'in_person', 'third_party')
    - `received_date`: TIMESTAMPTZ DEFAULT NOW()
    - `due_date`: TIMESTAMPTZ NOT NULL -- Calculated based on regulation
    - `completed_date`: TIMESTAMPTZ
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'other')
    - `requestor_type`: ENUM('data_subject', 'authorized_agent', 'parent_guardian', 'legal_representative')
    - `data_subject_id`: UUID -- Internal ID if known
    - `requestor_name`: TEXT NOT NULL
    - `requestor_email`: TEXT
    - `requestor_phone`: TEXT
    - `requestor_address`: TEXT
    - `preferred_language`: TEXT DEFAULT 'en'
    - `preferred_response_method`: ENUM('email', 'portal', 'mail', 'phone')
    - `request_details`: TEXT NOT NULL -- Full request description
    - `specific_data_requested`: JSONB -- For access/portability requests
    - `verification_status`: ENUM('not_started', 'pending', 'verified', 'failed')
    - `verification_method`: TEXT
    - `verification_completed_by`: UUID REFERENCES users(id)
    - `verification_completed_at`: TIMESTAMPTZ
    - `rejection_reason`: TEXT
    - `notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_specific_data CHECK (jsonb_typeof(specific_data_requested) = 'object')
    - CONSTRAINT valid_due_date CHECK (due_date > received_date)
  
  - `dsr_request_documents` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `document_type`: ENUM('request_form', 'identity_proof', 'authorization', 'supporting_docs', 'response', 'evidence')
    - `document_name`: TEXT NOT NULL
    - `file_path`: TEXT NOT NULL
    - `file_size`: BIGINT
    - `mime_type`: TEXT
    - `is_redacted`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
  
  - `dsr_data_sources` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `source_name`: TEXT NOT NULL -- System/database name
    - `source_type`: ENUM('database', 'file_system', 'cloud_storage', 'third_party', 'paper_records', 'backup')
    - `search_status`: ENUM('pending', 'in_progress', 'completed', 'failed', 'not_applicable')
    - `search_started_at`: TIMESTAMPTZ
    - `search_completed_at`: TIMESTAMPTZ
    - `records_found`: INTEGER DEFAULT 0
    - `data_categories_found`: TEXT[] -- Categories of personal data found
    - `search_query`: TEXT -- Query/criteria used
    - `search_results_summary`: JSONB -- Summary of findings
    - `requires_manual_review`: BOOLEAN DEFAULT false
    - `manual_review_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `searched_by`: UUID REFERENCES users(id)
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_search_results CHECK (jsonb_typeof(search_results_summary) = 'object')

#### Request Fulfillment
- **Status**: Mandatory
- **Triggers**:
  - Identity verification completion
  - Search completion across systems
  - Data compilation
  - Approval workflow completion
- **Data Model Requirements**:
  - `dsr_responses` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `response_type`: ENUM('full', 'partial', 'denial', 'no_data_found')
    - `response_date`: TIMESTAMPTZ DEFAULT NOW()
    - `response_method`: ENUM('email', 'portal', 'mail', 'api')
    - `response_summary`: TEXT NOT NULL
    - `data_provided`: JSONB -- Summary of data provided
    - `exemptions_applied`: JSONB -- Legal exemptions used
    - `redactions_applied`: JSONB -- Information about redactions
    - `response_format`: ENUM('pdf', 'json', 'csv', 'xml', 'structured_package')
    - `delivery_status`: ENUM('pending', 'sent', 'delivered', 'failed')
    - `delivery_confirmation`: TEXT
    - `follow_up_required`: BOOLEAN DEFAULT false
    - `follow_up_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_data_provided CHECK (jsonb_typeof(data_provided) = 'object')
    - CONSTRAINT valid_exemptions CHECK (jsonb_typeof(exemptions_applied) = 'object')
    - CONSTRAINT valid_redactions CHECK (jsonb_typeof(redactions_applied) = 'object')
  
  - `dsr_request_tasks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `task_type`: ENUM('verify_identity', 'search_data', 'review_data', 'apply_redactions', 'prepare_response', 'delete_data', 'update_data', 'legal_review')
    - `title`: TEXT NOT NULL
    - `description`: TEXT
    - `assigned_to`: UUID REFERENCES users(id)
    - `status`: ENUM('pending', 'in_progress', 'completed', 'blocked', 'cancelled')
    - `priority`: priority_enum DEFAULT 'high'
    - `due_date`: TIMESTAMPTZ
    - `completed_date`: TIMESTAMPTZ
    - `blocked_reason`: TEXT
    - `completion_notes`: TEXT
    - `estimated_hours`: DECIMAL(5,2)
    - `actual_hours`: DECIMAL(5,2)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - INDEX idx_dsr_tasks_assignee (assigned_to, status) WHERE status != 'completed'
  
  - `dsr_fulfillment_actions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `request_id`: UUID REFERENCES dsr_requests(id) ON DELETE CASCADE
    - `action_type`: ENUM('data_exported', 'data_deleted', 'data_updated', 'processing_restricted', 'consent_updated', 'marketing_opt_out')
    - `action_timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `system_name`: TEXT NOT NULL
    - `record_count`: INTEGER
    - `action_details`: JSONB NOT NULL
    - `verification_method`: TEXT
    - `verified_by`: UUID REFERENCES users(id)
    - `verified_at`: TIMESTAMPTZ
    - `rollback_possible`: BOOLEAN DEFAULT false
    - `rollback_deadline`: TIMESTAMPTZ
    - `organization_id`: UUID REFERENCES organizations(id)
    - `performed_by`: UUID REFERENCES users(id)
    - CONSTRAINT valid_action_details CHECK (jsonb_typeof(action_details) = 'object')

#### Request Metrics and Compliance
- **Status**: Mandatory
- **Triggers**:
  - Request completion
  - SLA monitoring
  - Regulatory reporting
  - Performance analysis
- **Data Model Requirements**:
  - `dsr_metrics` table (materialized view updated regularly):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_date`: DATE NOT NULL
    - `organization_id`: UUID REFERENCES organizations(id)
    - `request_type`: dsr_request_type_enum
    - `total_requests`: INTEGER DEFAULT 0
    - `completed_on_time`: INTEGER DEFAULT 0
    - `completed_late`: INTEGER DEFAULT 0
    - `rejected_requests`: INTEGER DEFAULT 0
    - `average_completion_days`: DECIMAL(5,2)
    - `median_completion_days`: DECIMAL(5,2)
    - `pending_requests`: INTEGER DEFAULT 0
    - `by_regulatory_framework`: JSONB -- Breakdown by regulation
    - `by_channel`: JSONB -- Breakdown by request channel
    - `by_response_type`: JSONB -- Breakdown by response type
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(metric_date, organization_id, request_type)
  
  - `dsr_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `template_type`: ENUM('request_form', 'response_letter', 'denial_letter', 'verification_form', 'consent_form')
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'other')
    - `language`: TEXT DEFAULT 'en'
    - `subject_template`: TEXT
    - `body_template`: TEXT NOT NULL
    - `variables`: JSONB -- Required template variables
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_variables CHECK (jsonb_typeof(variables) = 'object')
  
  - `dsr_exemptions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `exemption_name`: TEXT NOT NULL
    - `exemption_type`: ENUM('legal_privilege', 'third_party_data', 'disproportionate_effort', 'public_interest', 'investigation', 'ip_rights')
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'other')
    - `description`: TEXT NOT NULL
    - `legal_basis`: TEXT
    - `requires_approval`: BOOLEAN DEFAULT true
    - `approver_role_id`: UUID REFERENCES roles(id)
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_dsr_requests_status_due ON dsr_requests (status, due_date) 
    WHERE deleted_at IS NULL AND status NOT IN ('completed', 'rejected', 'withdrawn');
CREATE INDEX idx_dsr_requests_org_status ON dsr_requests (organization_id, status) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_dsr_requests_number ON dsr_requests (request_number) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_dsr_data_sources_request ON dsr_data_sources (request_id, search_status);
CREATE INDEX idx_dsr_tasks_due ON dsr_request_tasks (due_date, status) 
    WHERE status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_dsr_fulfillment_verification ON dsr_fulfillment_actions (verified_at) 
    WHERE verified_at IS NULL;

-- GIN indexes for JSONB fields
CREATE INDEX idx_dsr_requests_specific_data ON dsr_requests USING GIN (specific_data_requested);
CREATE INDEX idx_dsr_responses_data ON dsr_responses USING GIN (data_provided);
CREATE INDEX idx_dsr_metrics_framework ON dsr_metrics USING GIN (by_regulatory_framework);
```

## Functions and Triggers

```sql
-- Function to calculate DSR due date based on regulation
CREATE OR REPLACE FUNCTION calculate_dsr_due_date(
    p_request_type dsr_request_type_enum,
    p_regulatory_framework dsr_regulatory_framework_enum,
    p_received_date TIMESTAMPTZ
) RETURNS TIMESTAMPTZ AS $$
DECLARE
    v_days_allowed INTEGER;
BEGIN
    -- Determine days allowed based on regulation and request type
    CASE p_regulatory_framework
        WHEN 'gdpr' THEN
            CASE p_request_type
                WHEN 'access' THEN v_days_allowed := 30;
                WHEN 'deletion' THEN v_days_allowed := 30;
                WHEN 'rectification' THEN v_days_allowed := 30;
                WHEN 'portability' THEN v_days_allowed := 30;
                ELSE v_days_allowed := 30;
            END CASE;
        WHEN 'ccpa' THEN
            CASE p_request_type
                WHEN 'access' THEN v_days_allowed := 45;
                WHEN 'deletion' THEN v_days_allowed := 45;
                ELSE v_days_allowed := 45;
            END CASE;
        ELSE
            v_days_allowed := 30; -- Default
    END CASE;
    
    -- Calculate due date (accounting for business days would be more complex)
    RETURN p_received_date + (v_days_allowed || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set due date on request creation
CREATE OR REPLACE FUNCTION set_dsr_due_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.due_date IS NULL THEN
        NEW.due_date := calculate_dsr_due_date(
            NEW.request_type,
            NEW.regulatory_framework,
            NEW.received_date
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_due_date_trigger
    BEFORE INSERT ON dsr_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_dsr_due_date();

-- Function to check DSR SLA compliance
CREATE OR REPLACE FUNCTION check_dsr_sla_compliance()
RETURNS TABLE (
    request_id UUID,
    request_number TEXT,
    days_until_due INTEGER,
    is_overdue BOOLEAN,
    business_days_remaining INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.request_number,
        EXTRACT(DAY FROM r.due_date - NOW())::INTEGER as days_until_due,
        r.due_date < NOW() as is_overdue,
        -- Simplified business days calculation
        EXTRACT(DAY FROM r.due_date - NOW())::INTEGER * 5 / 7 as business_days_remaining
    FROM dsr_requests r
    WHERE r.status NOT IN ('completed', 'rejected', 'withdrawn')
    AND r.deleted_at IS NULL
    ORDER BY r.due_date;
END;
$$ LANGUAGE plpgsql;

-- Function to create standard DSR tasks
CREATE OR REPLACE FUNCTION create_dsr_tasks(
    p_request_id UUID,
    p_request_type dsr_request_type_enum,
    p_organization_id UUID
) RETURNS VOID AS $$
BEGIN
    -- Create standard tasks based on request type
    CASE p_request_type
        WHEN 'access' THEN
            INSERT INTO dsr_request_tasks (request_id, task_type, title, priority, organization_id, created_by)
            VALUES 
                (p_request_id, 'verify_identity', 'Verify requestor identity', 'emergency', p_organization_id, NEW.created_by),
                (p_request_id, 'search_data', 'Search all data sources', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'review_data', 'Review collected data', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'apply_redactions', 'Apply necessary redactions', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'prepare_response', 'Prepare access response', 'high', p_organization_id, NEW.created_by);
                
        WHEN 'deletion' THEN
            INSERT INTO dsr_request_tasks (request_id, task_type, title, priority, organization_id, created_by)
            VALUES 
                (p_request_id, 'verify_identity', 'Verify requestor identity', 'emergency', p_organization_id, NEW.created_by),
                (p_request_id, 'search_data', 'Identify data for deletion', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'legal_review', 'Legal review for deletion', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'delete_data', 'Delete personal data', 'high', p_organization_id, NEW.created_by),
                (p_request_id, 'prepare_response', 'Prepare deletion confirmation', 'high', p_organization_id, NEW.created_by);
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create tasks on request creation
CREATE TRIGGER create_standard_tasks_trigger
    AFTER INSERT ON dsr_requests
    FOR EACH ROW
    EXECUTE FUNCTION create_dsr_tasks(NEW.id, NEW.request_type, NEW.organization_id);
```

## UI Integration

- **Primary Screens**:
  - **DSR Dashboard** for overview and metrics
  - **DSR Request Form** for intake and processing
  - **Record Editor** for detailed request management
  - **ListView** for request inventory and tracking
  - **Kanban Board** for task management
  - **Timeline View** for deadline visualization
  - **Document Manager** for request documents
  - **Response Builder** for creating responses
  - **Audit Trail Viewer** for compliance evidence

- **Integration Points**:
  - Public privacy portal for request submission
  - Email integration for request intake
  - Identity verification integration
  - Data discovery tools integration
  - Document generation for responses
  - Secure portal for response delivery
  - Analytics dashboard for metrics
  - Calendar integration for deadline management

## Compliance and Security Considerations

1. **Data Minimization**:
   - Automatic purging of completed request data after retention period
   - Redaction capabilities for sensitive information
   - Audit trail of all data access

2. **Security Requirements**:
   - Encryption of all personal data at rest
   - Secure communication channels for responses
   - Role-based access control for DSR processing
   - Activity logging for all DSR operations

3. **Regulatory Compliance**:
   - Configurable workflows per regulation
   - Template library for standard responses
   - Automated deadline tracking and alerts
   - Comprehensive audit trail for regulatory defense

4. **Integration Requirements**:
   - API endpoints for automated data discovery
   - Webhook support for system integration
   - Batch processing for high-volume requests
   - Export capabilities for regulatory reporting
  



## Screen Integration for All Workflows

The following section maps each workflow's database tables to the screens that interact with them, providing clear implementation guidance:

### 1. Risk Assessment Workflow

- **Primary Tables**: 
  - `risk_assessments`, `risks`, `risk_assets`, `risk_threats`, `risk_vulnerabilities`, `risk_treatment_plans`, `risk_treatments`, `risk_treatment_actions`, `risk_acceptances`
- **Screen Integration**:
  - **Risk Assessment Wizard** for guided risk assessment process
  - **Record Editor** for risk and treatment details
  - **ListView** for risk register and treatment plan management
  - **Dashboard** for risk visualization and metrics
  - **Relationship Mapper** for visualizing risk relationships and dependencies
  - **Kanban Board** for risk treatment tracking
  - **Document Editor** for risk assessment reports
  - **Timeline View** for risk treatment planning and milestone tracking

### 2. Multi-Standard Strategy Workflow

- **Primary Tables**: 
  - `frameworks`, `framework_versions`, `controls`, `control_categories`, `framework_control_assignments`, `control_mappings`, `statements_of_applicability`, `soa_control_inclusions`
- **Screen Integration**:
  - **Framework Manager** for framework administration
  - **Control Library** for centralized control management
  - **Record Editor** for framework and control details
  - **ListView** for framework comparison and control inventory
  - **Relationship Mapper** for visualizing cross-framework control mappings
  - **Document Editor** for framework documentation
  - **Tree View** for framework and control hierarchy visualization
  - **SoA Generator** for creating statements of applicability

### 3. Control Implementation Workflow

- **Primary Tables**: 
  - `control_implementations`, `control_implementation_tasks`, `control_test_cases`, `control_test_results`, `control_implementation_evidence`, `control_implementation_risks`
- **Screen Integration**:
  - **Record Editor** for control implementation details
  - **ListView** for control implementation inventory
  - **Kanban Board** for implementation task tracking
  - **Document Editor** for control documentation
  - **Dashboard** for control implementation status visualization
  - **Timeline View** for implementation milestone tracking
  - **Evidence Manager** for implementation evidence collection

### 4. Document Management Workflow

- **Primary Tables**: 
  - `file_storage_items`, `documents`, `document_versions`, `document_approvals`, `evidence_items`, `control_evidence_mapping`, `document_tags`, `document_tag_assignments`, `document_templates`, `document_relationships`, `document_references`, `document_dependencies`
- **Screen Integration**:
  - **Document Editor** for content creation and editing
  - **File Manager** for storage organization and browsing
  - **Record Editor** for document metadata management
  - **Approval Workflow Screen** for document approval processes
  - **Version History Viewer** for tracking document changes
  - **ListView** for document inventory management
  - **Relationship Mapper** for visualizing document relationships
  - **Tree View** for document hierarchy visualization

### 5. Incident Management Workflow

- **Primary Tables**: 
  - `incidents`, `incident_affected_assets`, `incident_investigation_actions`, `incident_evidence_items`, `sla_policies`, `sla_definitions`, `business_hours`, `sla_business_hours`, `incident_slas`, `sla_notifications`, `sla_escalations`, `sla_events`
- **Screen Integration**:
  - **Incident Dashboard** for incident overview and status
  - **Incident Response Form** for incident reporting and management
  - **Record Editor** for incident details
  - **ListView** for incident inventory
  - **Timeline View** for incident chronology visualization
  - **Kanban Board** for incident response task tracking
  - **Relationship Mapper** for visualizing incident impact
  - **SLA Configuration** for setting up response time requirements
  - **SLA Dashboard** for monitoring response time compliance

### 6. Supplier Relationship Management Workflow

- **Primary Tables**: 
  - `suppliers`, `supplier_assessments`, `supplier_services`, `supplier_contracts`
- **Screen Integration**:
  - **Supplier Directory** for supplier listing and management
  - **Record Editor** for supplier details
  - **ListView** for supplier inventory
  - **Assessment Wizard** for supplier assessment
  - **Dashboard** for supplier risk visualization
  - **Timeline View** for contract expiration tracking
  - **Document Editor** for contract management

### 7. Privacy Management Workflow

- **Primary Tables**: 
  - `privacy_impact_assessments`, `pia_sections`, `pia_questions`, `pia_answers`
- **Screen Integration**:
  - **PIA Wizard** for guided privacy impact assessment
  - **Record Editor** for PIA details
  - **ListView** for PIA inventory
  - **Document Editor** for PIA reports
  - **Dashboard** for privacy risk visualization
  - **Relationship Mapper** for data flow visualization

### 8. Approval Workflow and Change Management

- **Primary Tables**: 
  - `approval_workflows`, `approval_workflow_steps`, `approval_requests`, `approval_step_instances`, `approval_actions`, `change_requests`, `change_request_items`, `document_change_history`, `record_versions`, `record_changes`, `field_change_approvals`
- **Screen Integration**:
  - **Approval Dashboard** for approval request management
  - **Workflow Designer** for approval workflow configuration
  - **Record Editor** for change request details
  - **Approval History** for reviewing past approvals
  - **Change Request Form** for submitting change requests
  - **ListView** for approval request inventory
  - **Version Comparison** for comparing document or record versions

### 9. Navigation and User Interface Management

- **Primary Tables**: 
  - `navigation_menus`, `navigation_items`, `navigation_states`, `layout_configurations`, `user_interface_preferences`, `saved_views`
- **Screen Integration**:
  - **Navigation Editor** for menu configuration
  - **Layout Manager** for screen layout customization
  - **Settings Panel** for user preferences
  - **Theme Switcher** for visual theme management
  - **View Management** for saved view administration

### 10. Role-Based Access Control and User Management

- **Primary Tables**: 
  - `users`, `roles`, `user_role_assignments`, `permissions`, `role_permissions`, `access_policies`, `access_rules`, `access_policy_assignments`, `data_classification_levels`, `object_classifications`, `authentication_settings`, `user_sessions`, `login_attempts`, `mfa_enrollments`
- **Screen Integration**:
  - **User Management** for user administration
  - **Role Manager** for role configuration
  - **Permission Matrix** for permission assignment
  - **User Profile** for user details and settings
  - **Access Policy Manager** for access policy configuration
  - **Classification Manager** for data classification
  - **Security Settings** for authentication policy
  - **Session Management** for active session control
  - **Login History** for authentication audit

### 11. Tiered Audit Trail System

- **Primary Tables**: 
  - `critical_audit_trails`, `routine_audit_logs`
- **Screen Integration**:
  - **Audit Log Viewer** for browsing audit history
  - **Audit Search** for finding specific audit records
  - **Audit Dashboard** for audit metrics visualization
  - **Audit Report Generator** for creating audit reports
  - **Audit Export** for exporting audit data

This comprehensive mapping ensures that every database table is connected to the appropriate screens, providing clear guidance for implementation and maintaining traceability between the database schema and the user interface.
