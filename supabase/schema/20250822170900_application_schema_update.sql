-- This migration script creates the complete, enhanced database schema
-- based on the "Improved Database Schema and Workflow Mapping" document.

-- Note: This assumes that core tables like 'users', 'organizations',
-- 'assets', 'threats', 'vulnerabilities', and 'controls' already exist.

-- =================================================================================
-- ENUM Types
-- =================================================================================

-- Risk Assessment Enums
CREATE TYPE risk_category_enum AS ENUM (
    'strategic',
    'operational',
    'financial',
    'compliance',
    'reputational',
    'technical'
);

CREATE TYPE risk_status_enum AS ENUM (
    'identified',
    'analyzed',
    'evaluated',
    'treated',
    'accepted',
    'closed'
);

CREATE TYPE risk_treatment_type_enum AS ENUM (
    'mitigate',
    'transfer',
    'avoid',
    'accept'
);

-- Control Implementation Enums
CREATE TYPE implementation_status_enum AS ENUM (
    'not_implemented',
    'partially_implemented',
    'implemented',
    'not_applicable',
    'planned'
);

CREATE TYPE evidence_type_enum AS ENUM (
    'document',
    'screenshot',
    'log',
    'test_result',
    'certification',
    'attestation',
    'other'
);

CREATE TYPE test_result_enum AS ENUM (
    'pass',
    'fail',
    'partial',
    'inconclusive'
);

-- Document Management Enums
CREATE TYPE document_type_enum AS ENUM (
    'policy',
    'procedure',
    'standard',
    'guideline',
    'form',
    'record',
    'evidence',
    'report'
);

CREATE TYPE document_status_enum AS ENUM (
    'draft',
    'review',
    'approved',
    'published',
    'deprecated',
    'archived'
);

CREATE TYPE content_format_enum AS ENUM (
    'markdown',
    'html',
    'text',
    'json'
);

CREATE TYPE relationship_type_enum AS ENUM (
    'references',
    'replaces',
    'implements',
    'supports',
    'related'
);

CREATE TYPE approval_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected',
    'deferred'
);

CREATE TYPE workflow_status_enum AS ENUM (
    'not_started',
    'in_progress',
    'completed',
    'cancelled'
);

-- Multi-Standard Strategy Enums
CREATE TYPE framework_type_enum AS ENUM (
    'security',
    'privacy',
    'regulatory',
    'industry',
    'internal'
);

CREATE TYPE soa_status_enum AS ENUM (
    'draft',
    'active',
    'archived'
);

CREATE TYPE mapping_type_enum AS ENUM (
    'equivalent',
    'partial',
    'related',
    'primary',
    'supporting',
    'compensating'
);

CREATE TYPE mapping_strength_enum AS ENUM (
    'strong',
    'medium',
    'weak'
);

-- UI Management Enums
CREATE TYPE list_content_type_enum AS ENUM (
    'risk',
    'control',
    'document',
    'supplier',
    'task'
);

-- Audit and Tracking Enums
CREATE TYPE action_type_enum AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'SOFT_DELETE',
    'RESTORE',
    'STATUS_CHANGE',
    'APPROVAL',
    'VIEW',
    'EXPORT',
    'IMPORT'
);

-- Incident Management Enums
CREATE TYPE sla_status_enum AS ENUM (
    'pending',
    'met',
    'breached'
);

CREATE TYPE sla_event_type_enum AS ENUM (
    'created',
    'responded',
    'resolved',
    'paused',
    'resumed',
    'breached',
    'escalated',
    'recalculated'
);

CREATE TYPE notification_type_enum AS ENUM (
    'approaching_response',
    'approaching_resolution',
    'approaching_escalation',
    'breached_response',
    'breached_resolution'
);

CREATE TYPE trigger_type_enum AS ENUM (
    'response_overdue',
    'resolution_overdue',
    'approaching_response',
    'approaching_resolution'
);

-- Supplier Management Enums
CREATE TYPE record_status_enum AS ENUM (
    'active',
    'inactive',
    'pending',
    'archived'
);

CREATE TYPE assessment_type_enum AS ENUM (
    'initial',
    'periodic',
    'incident_response',
    'contract_renewal'
);

CREATE TYPE contract_type_enum AS ENUM (
    'service',
    'product',
    'consulting',
    'support',
    'other'
);

-- Corrective Action Enums
CREATE TYPE remediation_source_enum AS ENUM (
    'risk_assessment',
    'audit_finding',
    'compliance_gap',
    'control_failure',
    'vulnerability',
    'incident'
);

CREATE TYPE remediation_category_enum AS ENUM (
    'preventive',
    'detective',
    'corrective',
    'recovery',
    'compensating'
);

CREATE TYPE remediation_scope_enum AS ENUM (
    'immediate',
    'short_term',
    'long_term',
    'systemic'
);

CREATE TYPE plan_status_enum AS ENUM (
    'draft',
    'pending_approval',
    'approved',
    'in_progress',
    'implemented',
    'verified',
    'closed',
    'cancelled'
);

-- DSR Management Enums
CREATE TYPE request_type_enum AS ENUM (
    'access',
    'deletion',
    'rectification',
    'portability',
    'objection',
    'restriction',
    'automated_decision_review'
);

CREATE TYPE dsr_status_enum AS ENUM (
    'received',
    'verifying_identity',
    'in_progress',
    'pending_approval',
    'approved',
    'completed',
    'rejected',
    'withdrawn'
);

CREATE TYPE channel_enum AS ENUM (
    'portal',
    'email',
    'phone',
    'letter',
    'in_person',
    'third_party'
);

CREATE TYPE requestor_type_enum AS ENUM (
    'data_subject',
    'authorized_agent',
    'parent_guardian',
    'legal_representative'
);

CREATE TYPE response_method_enum AS ENUM (
    'email',
    'portal',
    'mail',
    'phone'
);

-- Training Management Enums
CREATE TYPE activity_type_enum AS ENUM (
    'enrolled',
    'started',
    'completed',
    'passed_quiz',
    'failed_quiz',
    'viewed_content',
    'downloaded_document'
);

-- General Enums
CREATE TYPE priority_enum AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- =================================================================================
-- Core Schema Improvements - Tables
-- =================================================================================

-- Risk Assessment Workflow
CREATE TABLE public.risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID,
    risk_name TEXT,
    description TEXT,
    risk_owner_id UUID REFERENCES public.users(id),
    risk_category risk_category_enum,
    inherent_impact INTEGER,
    inherent_likelihood INTEGER,
    inherent_risk_level INTEGER,
    residual_impact INTEGER,
    residual_likelihood INTEGER,
    residual_risk_level INTEGER,
    status risk_status_enum,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES public.users(id),
    version INTEGER DEFAULT 1,
    custom_fields JSONB DEFAULT '{}',
    ai_metadata JSONB DEFAULT '{"generated_by_ai": false}',
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object'),
    CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
);

CREATE TABLE public.risk_assets (
    risk_id UUID REFERENCES public.risks(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES public.assets(id) ON DELETE RESTRICT,
    PRIMARY KEY (risk_id, asset_id),
    impact_level TEXT,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.risk_threats (
    risk_id UUID REFERENCES public.risks(id) ON DELETE CASCADE,
    threat_id UUID REFERENCES public.threats(id) ON DELETE RESTRICT,
    PRIMARY KEY (risk_id, threat_id),
    relevance_score INTEGER,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.risk_vulnerabilities (
    risk_id UUID REFERENCES public.risks(id) ON DELETE CASCADE,
    vulnerability_id UUID REFERENCES public.vulnerabilities(id) ON DELETE RESTRICT,
    PRIMARY KEY (risk_id, vulnerability_id),
    exploitation_ease TEXT,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.risk_treatment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_name TEXT,
    description TEXT,
    plan_owner_id UUID REFERENCES public.users(id),
    status approval_status_enum,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.risk_treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_id UUID REFERENCES public.risks(id),
    plan_id UUID REFERENCES public.risk_treatment_plans(id),
    treatment_type risk_treatment_type_enum,
    treatment_description TEXT,
    target_risk_level INTEGER,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.risk_treatment_control_mappings (
    treatment_id UUID REFERENCES public.risk_treatments(id) ON DELETE CASCADE,
    control_id UUID REFERENCES public.controls(id) ON DELETE RESTRICT,
    mapping_type mapping_type_enum,
    PRIMARY KEY (treatment_id, control_id),
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Control Implementation Workflow
CREATE TABLE public.control_implementations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    control_id UUID REFERENCES public.controls(id),
    organization_id UUID REFERENCES public.organizations(id),
    implementation_status implementation_status_enum,
    implementation_description TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES public.users(id),
    version INTEGER DEFAULT 1,
    custom_fields JSONB DEFAULT '{}',
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
);

CREATE TABLE public.control_implementation_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    implementation_id UUID REFERENCES public.control_implementations(id),
    evidence_type evidence_type_enum,
    evidence_title TEXT,
    evidence_description TEXT,
    file_path TEXT,
    verification_status approval_status_enum,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.control_implementation_risks (
    implementation_id UUID REFERENCES public.control_implementations(id) ON DELETE CASCADE,
    risk_id UUID REFERENCES public.risks(id) ON DELETE RESTRICT,
    effectiveness_rating_id UUID REFERENCES public.lookup_options(id),
    PRIMARY KEY (implementation_id, risk_id),
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.control_test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    implementation_id UUID REFERENCES public.control_implementations(id),
    test_name TEXT,
    test_description TEXT,
    test_procedure TEXT,
    expected_result TEXT,
    test_frequency TEXT,
    next_test_date TIMESTAMPTZ,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.control_test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES public.control_test_cases(id),
    test_date TIMESTAMPTZ,
    tester_id UUID REFERENCES public.users(id),
    test_result test_result_enum,
    actual_result TEXT,
    notes TEXT,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.control_test_evidence (
    test_result_id UUID REFERENCES public.control_test_results(id) ON DELETE CASCADE,
    evidence_id UUID REFERENCES public.control_implementation_evidence(id) ON DELETE RESTRICT,
    PRIMARY KEY (test_result_id, evidence_id),
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document Management Workflow
CREATE TABLE public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    description TEXT,
    document_type document_type_enum,
    status document_status_enum,
    content TEXT,
    content_format content_format_enum,
    parent_document_id UUID REFERENCES public.documents(id),
    current_version_id UUID,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES public.users(id),
    version INTEGER DEFAULT 1,
    custom_fields JSONB DEFAULT '{}',
    ai_metadata JSONB DEFAULT '{"generated_by_ai": false}',
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object'),
    CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
);

CREATE TABLE public.document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.documents(id),
    version_number INTEGER,
    content TEXT,
    content_format content_format_enum,
    change_summary TEXT,
    status document_status_enum,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(document_id, version_number)
);

CREATE TABLE public.document_relationships (
    source_document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    target_document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    relationship_type relationship_type_enum,
    PRIMARY KEY (source_document_id, target_document_id, relationship_type),
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.document_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_version_id UUID REFERENCES public.document_versions(id),
    approver_id UUID REFERENCES public.users(id),
    approval_status approval_status_enum,
    comments TEXT,
    approval_date TIMESTAMPTZ,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.document_approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES public.documents(id),
    workflow_name TEXT,
    current_step INTEGER,
    status workflow_status_enum,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.document_approval_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES public.document_approval_workflows(id),
    step_number INTEGER,
    step_name TEXT,
    approver_role_id UUID REFERENCES public.roles(id),
    approver_id UUID REFERENCES public.users(id),
    status approval_status_enum,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Multi-Standard Strategy Workflow
CREATE TABLE public.control_frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    version TEXT,
    description TEXT,
    publisher TEXT,
    type framework_type_enum,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.framework_controls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    framework_id UUID REFERENCES public.control_frameworks(id),
    control_id TEXT,
    title TEXT,
    description TEXT,
    parent_id UUID REFERENCES public.framework_controls(id),
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.statements_of_applicability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    framework_id UUID REFERENCES public.control_frameworks(id),
    version TEXT,
    effective_date TIMESTAMPTZ,
    status soa_status_enum,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.soa_control_inclusions (
    soa_id UUID REFERENCES public.statements_of_applicability(id),
    control_id UUID REFERENCES public.framework_controls(id),
    is_applicable BOOLEAN,
    justification TEXT,
    PRIMARY KEY (soa_id, control_id),
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.framework_control_mappings (
    source_control_id UUID REFERENCES public.framework_controls(id),
    target_control_id UUID REFERENCES public.framework_controls(id),
    mapping_type mapping_type_enum,
    mapping_strength mapping_strength_enum,
    mapping_notes TEXT,
    PRIMARY KEY (source_control_id, target_control_id),
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- UI Management Improvements
CREATE TABLE public.listview_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    description TEXT,
    content_type list_content_type_enum,
    is_default BOOLEAN DEFAULT false,
    is_system BOOLEAN DEFAULT false,
    display_config JSONB,
    filter_config JSONB,
    permission_config JSONB,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_display_config CHECK (jsonb_typeof(display_config) = 'object'),
    CONSTRAINT valid_filter_config CHECK (jsonb_typeof(filter_config) = 'object')
);

CREATE TABLE public.listview_template_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES public.listview_templates(id),
    version_number INTEGER,
    template_config JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(template_id, version_number)
);

CREATE TABLE public.listview_user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    content_type list_content_type_enum,
    template_id UUID REFERENCES public.listview_templates(id),
    filter_state JSONB,
    column_config JSONB,
    sort_config JSONB,
    organization_id UUID REFERENCES public.organizations(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, content_type)
);

-- Audit and Tracking Improvements
CREATE TABLE public.critical_audit_trails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT,
    entity_id UUID,
    action_type action_type_enum,
    organization_id UUID REFERENCES public.organizations(id),
    performed_by UUID REFERENCES public.users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    previous_values JSONB,
    new_values JSONB,
    context JSONB,
    CONSTRAINT valid_previous_values CHECK (jsonb_typeof(previous_values) = 'object'),
    CONSTRAINT valid_new_values CHECK (jsonb_typeof(new_values) = 'object'),
    CONSTRAINT valid_context CHECK (jsonb_typeof(context) = 'object')
) PARTITION BY RANGE (performed_at);

-- Partition for the current month. Future partitions will be created automatically.
CREATE TABLE public.critical_audit_trails_y2025m08 PARTITION OF public.critical_audit_trails
    FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');

CREATE TABLE public.routine_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT,
    entity_id UUID,
    action_type action_type_enum,
    organization_id UUID REFERENCES public.organizations(id),
    performed_by UUID REFERENCES public.users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    summary TEXT,
    details JSONB
);

-- Incident Management Workflow
CREATE TABLE public.sla_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    effective_date TIMESTAMPTZ DEFAULT NOW(),
    expiration_date TIMESTAMPTZ,
    version INTEGER DEFAULT 1,
    is_default BOOLEAN DEFAULT false,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.sla_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES public.sla_policies(id),
    incident_type_id UUID REFERENCES public.lookup_options(id),
    severity TEXT,
    priority priority_enum,
    response_time_minutes INTEGER,
    resolution_time_minutes INTEGER,
    escalation_time_minutes INTEGER,
    business_hours_only BOOLEAN DEFAULT false,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(policy_id, incident_type_id, severity, priority)
);

CREATE TABLE public.business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    monday_start TIME,
    monday_end TIME,
    tuesday_start TIME,
    tuesday_end TIME,
    wednesday_start TIME,
    wednesday_end TIME,
    thursday_start TIME,
    thursday_end TIME,
    friday_start TIME,
    friday_end TIME,
    saturday_start TIME,
    saturday_end TIME,
    sunday_start TIME,
    sunday_end TIME,
    timezone TEXT NOT NULL,
    holidays JSONB,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_holidays CHECK (jsonb_typeof(holidays) = 'array')
);

CREATE TABLE public.sla_business_hours (
    sla_policy_id UUID REFERENCES public.sla_policies(id) ON DELETE CASCADE,
    business_hours_id UUID REFERENCES public.business_hours(id) ON DELETE RESTRICT,
    PRIMARY KEY (sla_policy_id, business_hours_id),
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.incident_slas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES public.incidents(id),
    sla_definition_id UUID REFERENCES public.sla_definitions(id),
    response_deadline TIMESTAMPTZ,
    resolution_deadline TIMESTAMPTZ,
    escalation_deadline TIMESTAMPTZ,
    response_actual TIMESTAMPTZ,
    resolution_actual TIMESTAMPTZ,
    response_status sla_status_enum,
    resolution_status sla_status_enum,
    paused_at TIMESTAMPTZ,
    pause_reason TEXT,
    total_pause_minutes INTEGER DEFAULT 0,
    actuals_history JSONB DEFAULT '[]',
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_actuals_history CHECK (jsonb_typeof(actuals_history) = 'array')
);

CREATE TABLE public.sla_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sla_policy_id UUID REFERENCES public.sla_policies(id),
    notification_type notification_type_enum,
    threshold_minutes INTEGER,
    notification_template_id UUID REFERENCES public.notification_templates(id),
    recipient_roles JSONB,
    recipient_users JSONB,
    is_active BOOLEAN DEFAULT true,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_recipient_roles CHECK (jsonb_typeof(recipient_roles) = 'array'),
    CONSTRAINT valid_recipient_users CHECK (jsonb_typeof(recipient_users) = 'array')
);

CREATE TABLE public.sla_escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sla_policy_id UUID REFERENCES public.sla_policies(id),
    escalation_level INTEGER,
    trigger_type trigger_type_enum,
    threshold_minutes INTEGER,
    escalation_roles JSONB,
    escalation_users JSONB,
    notification_template_id UUID REFERENCES public.notification_templates(id),
    is_active BOOLEAN DEFAULT true,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_escalation_roles CHECK (jsonb_typeof(escalation_roles) = 'array'),
    CONSTRAINT valid_escalation_users CHECK (jsonb_typeof(escalation_users) = 'array')
);

CREATE TABLE public.sla_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_sla_id UUID REFERENCES public.incident_slas(id),
    event_type sla_event_type_enum,
    event_time TIMESTAMPTZ DEFAULT NOW(),
    event_user_id UUID REFERENCES public.users(id),
    details TEXT,
    old_values JSONB,
    new_values JSONB,
    organization_id UUID REFERENCES public.organizations(id),
    CONSTRAINT valid_old_values CHECK (jsonb_typeof(old_values) = 'object'),
    CONSTRAINT valid_new_values CHECK (jsonb_typeof(new_values) = 'object')
);

-- Supplier Relationship Management Workflow
CREATE TYPE criticality_enum AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TABLE public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id),
    supplier_name TEXT,
    supplier_type_id UUID REFERENCES public.lookup_options(id),
    description TEXT,
    status record_status_enum DEFAULT 'active',
    criticality criticality_enum,
    data_access_level TEXT, -- Placeholder, assuming a pre-existing ENUM or type
    contract_expiry_date DATE,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES public.users(id),
    version INTEGER DEFAULT 1,
    custom_fields JSONB DEFAULT '{}',
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
);

CREATE TABLE public.supplier_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES public.suppliers(id),
    assessment_type assessment_type_enum,
    assessment_date DATE,
    assessor_id UUID REFERENCES public.users(id),
    status approval_status_enum,
    risk_level TEXT, -- Placeholder, assuming a pre-existing ENUM or type
    next_assessment_date DATE,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.supplier_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES public.suppliers(id),
    service_name TEXT,
    service_description TEXT,
    criticality criticality_enum,
    data_involved JSONB,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.supplier_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES public.suppliers(id),
    contract_name TEXT,
    contract_type contract_type_enum,
    start_date DATE,
    end_date DATE,
    renewal_type TEXT, -- Placeholder
    security_requirements TEXT,
    data_protection_requirements TEXT,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Corrective Action Management
CREATE TABLE public.corrective_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_name TEXT,
    description TEXT,
    remediation_owner_id UUID REFERENCES public.users(id),
    remediation_source remediation_source_enum,
    source_id UUID NOT NULL,
    remediation_category remediation_category_enum,
    remediation_scope remediation_scope_enum,
    plan_status plan_status_enum DEFAULT 'draft',
    priority priority_enum,
    business_justification TEXT,
    risk_if_not_implemented TEXT,
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    estimated_effort_hours INTEGER,
    actual_effort_hours INTEGER,
    target_completion_date DATE,
    actual_completion_date DATE,
    closed_by UUID REFERENCES public.users(id),
    closure_notes TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurring_schedule TEXT,
    is_preventative BOOLEAN DEFAULT false,
    is_effective BOOLEAN,
    effectiveness_notes TEXT,
    effectiveness_check_date DATE,
    related_risks JSONB,
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES public.users(id),
    version INTEGER DEFAULT 1,
    custom_fields JSONB DEFAULT '{}',
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object'),
    CONSTRAINT valid_related_risks CHECK (jsonb_typeof(related_risks) = 'array')
);

-- DSR Management Workflow
CREATE TABLE public.dsr_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_number TEXT UNIQUE NOT NULL,
    request_type request_type_enum,
    status dsr_status_enum,
    priority priority_enum,
    channel channel_enum,
    received_date TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    completed_date TIMESTAMPTZ,
    regulatory_framework TEXT, -- Placeholder
    requestor_type requestor_type_enum,
    data_subject_id UUID,
    requestor_name TEXT,
    requestor_email TEXT,
    requestor_phone TEXT,
    requestor_address TEXT,
    preferred_language TEXT DEFAULT 'en',
    preferred_response_method response_method_enum,
    request_details TEXT NOT NULL,
    specific_data_requested JSONB,
    verification_status TEXT, -- Placeholder
    verification_method TEXT, -- Placeholder
    organization_id UUID REFERENCES public.organizations(id),
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES public.users(id),
    version INTEGER DEFAULT 1,
    custom_fields JSONB DEFAULT '{}',
    CONSTRAINT valid_specific_data_requested CHECK (jsonb_typeof(specific_data_requested) = 'array'),
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
);

-- Training Management Workflow
CREATE TABLE public.training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_name TEXT,
    description TEXT,
    program_type TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    organization_id UUID REFERENCES public.organizations(id)
);

CREATE TABLE public.training_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES public.training_programs(id),
    module_name TEXT,
    description TEXT,
    module_type TEXT,
    content_link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    organization_id UUID REFERENCES public.organizations(id)
);

CREATE TABLE public.training_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    program_id UUID REFERENCES public.training_programs(id),
    assigned_by UUID REFERENCES public.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    status TEXT DEFAULT 'assigned',
    organization_id UUID REFERENCES public.organizations(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, program_id)
);

CREATE TABLE public.training_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES public.training_assignments(id),
    module_id UUID REFERENCES public.training_modules(id),
    activity_type activity_type_enum,
    activity_time TIMESTAMPTZ DEFAULT NOW(),
    organization_id UUID REFERENCES public.organizations(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Access Control
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- =================================================================================
-- Functions and Triggers
-- =================================================================================

-- Function to create new partition for critical_audit_trails table
CREATE OR REPLACE FUNCTION public.create_audit_partitions()
RETURNS TRIGGER AS $$
DECLARE
    partition_name TEXT;
    start_date TEXT;
    end_date TEXT;
BEGIN
    -- Determine the partition name based on the month and year of the new record
    partition_name := 'critical_audit_trails_y' || EXTRACT(YEAR FROM NEW.performed_at) || 'm' || LPAD(EXTRACT(MONTH FROM NEW.performed_at)::TEXT, 2, '0');
    
    -- Check if the partition exists. If not, create it.
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = partition_name) THEN
        start_date := TO_CHAR(date_trunc('month', NEW.performed_at), 'YYYY-MM-DD');
        end_date := TO_CHAR(date_trunc('month', NEW.performed_at) + INTERVAL '1 month', 'YYYY-MM-DD');
        
        EXECUTE 'CREATE TABLE public.' || quote_ident(partition_name) || ' PARTITION OF public.critical_audit_trails FOR VALUES FROM (''' || start_date || ''') TO (''' || end_date || ''')';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create a new partition before an insert into critical_audit_trails
CREATE TRIGGER trigger_create_audit_partitions
BEFORE INSERT ON public.critical_audit_trails
FOR EACH ROW EXECUTE FUNCTION public.create_audit_partitions();

-- Function to update training assignment completion percentage
CREATE OR REPLACE FUNCTION public.update_assignment_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_total_modules INTEGER;
    v_completed_modules INTEGER;
    v_percentage DECIMAL(5,2);
BEGIN
    SELECT COUNT(*) INTO v_total_modules FROM public.training_modules WHERE program_id = (SELECT program_id FROM public.training_assignments WHERE id = NEW.assignment_id);
    SELECT COUNT(DISTINCT module_id) INTO v_completed_modules FROM public.training_activities WHERE assignment_id = NEW.assignment_id AND activity_type = 'completed';

    v_percentage := CASE WHEN v_total_modules > 0 THEN (v_completed_modules * 100.0 / v_total_modules) ELSE 0 END;
    
    UPDATE public.training_assignments SET completion_percentage = v_percentage, updated_at = NOW() WHERE id = NEW.assignment_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update completion percentage after training activity
CREATE TRIGGER update_completion_percentage_trigger
AFTER INSERT ON public.training_activities
FOR EACH ROW
WHEN (NEW.activity_type = 'completed')
EXECUTE FUNCTION public.update_assignment_completion();