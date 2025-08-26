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