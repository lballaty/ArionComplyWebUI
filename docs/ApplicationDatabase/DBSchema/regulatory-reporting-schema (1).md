# Regulatory Reporting and Breach Management - Database Schema

## Overview

This document defines the database schema for comprehensive regulatory reporting and breach management, including regulatory assessments, requirements tracking, breach notifications, and compliance reporting across the ArionComply platform. The design follows established database principles while supporting various regulatory frameworks and reporting obligations.

## Regulatory Reporting Workflow

### 1. Regulatory Requirements Management

#### Regulatory Framework Tracking
- **Status**: Core Feature
- **Triggers**:
  - New regulation adoption
  - Regulatory updates
  - Jurisdiction changes
  - Business expansion
  - Product/service changes affecting compliance
- **Approval Requirements**:
  - Legal review
  - Compliance officer approval
  - Business impact assessment
  - Implementation planning approval
- **Data Model Requirements**:
  - `regulatory_requirements` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `requirement_name`: TEXT NOT NULL
    - `description`: TEXT NOT NULL
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'hipaa', 'sox', 'pci_dss', 'iso27001', 'nist', 'other')
    - `jurisdiction`: TEXT NOT NULL -- Country/state/region
    - `requirement_type`: ENUM('reporting', 'notification', 'assessment', 'documentation', 'technical', 'administrative', 'physical')
    - `category`: TEXT -- Specific area (privacy, security, financial, etc.)
    - `legal_reference`: TEXT -- Section/article reference
    - `effective_date`: DATE NOT NULL
    - `sunset_date`: DATE -- If requirement expires
    - `reporting_frequency`: ENUM('incident_based', 'annual', 'quarterly', 'monthly', 'continuous', 'ad_hoc')
    - `reporting_deadline_days`: INTEGER -- Days to report after trigger
    - `notification_threshold`: JSONB -- Conditions triggering notification
    - `applicability_criteria`: JSONB -- When requirement applies
    - `penalties`: JSONB -- Non-compliance penalties
    - `guidance_url`: TEXT -- Link to official guidance
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_threshold CHECK (jsonb_typeof(notification_threshold) = 'object')
    - CONSTRAINT valid_criteria CHECK (jsonb_typeof(applicability_criteria) = 'object')
    - CONSTRAINT valid_penalties CHECK (jsonb_typeof(penalties) = 'object')
    - INDEX idx_regulatory_reqs_active (regulatory_framework, jurisdiction, is_active) WHERE deleted_at IS NULL
  
  - `regulatory_assessments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `assessment_name`: TEXT NOT NULL
    - `assessment_type`: ENUM('initial', 'periodic', 'change_driven', 'incident_driven')
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'hipaa', 'sox', 'pci_dss', 'iso27001', 'nist', 'other')
    - `assessment_period_start`: DATE NOT NULL
    - `assessment_period_end`: DATE NOT NULL
    - `status`: ENUM('planned', 'in_progress', 'completed', 'submitted', 'accepted', 'rejected')
    - `lead_assessor_id`: UUID REFERENCES users(id)
    - `assessment_team`: UUID[] -- Array of user IDs
    - `findings_summary`: TEXT
    - `gaps_identified`: INTEGER DEFAULT 0
    - `remediation_required`: BOOLEAN DEFAULT false
    - `overall_compliance_score`: DECIMAL(5,2)
    - `submission_date`: TIMESTAMPTZ
    - `regulator_feedback`: TEXT
    - `next_assessment_date`: DATE
    - `supporting_documents`: JSONB -- Links to evidence
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_supporting_docs CHECK (jsonb_typeof(supporting_documents) = 'object')
    - CONSTRAINT valid_dates CHECK (assessment_period_start <= assessment_period_end)

### 2. Regulatory Reporting

#### Report Generation and Submission
- **Status**: Core Feature
- **Triggers**:
  - Scheduled reporting periods
  - Incident occurrence
  - Regulatory request
  - Threshold breaches
  - Material changes
- **Data Model Requirements**:
  - `regulatory_reports` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `report_number`: TEXT UNIQUE NOT NULL -- Human-readable report ID
    - `report_name`: TEXT NOT NULL
    - `report_type`: ENUM('periodic', 'incident', 'breach', 'assessment', 'certification', 'ad_hoc')
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'hipaa', 'sox', 'pci_dss', 'iso27001', 'nist', 'other')
    - `requirement_id`: UUID REFERENCES regulatory_requirements(id)
    - `reporting_period_start`: DATE
    - `reporting_period_end`: DATE
    - `status`: ENUM('draft', 'in_review', 'approved', 'submitted', 'acknowledged', 'rejected', 'amended')
    - `submission_deadline`: TIMESTAMPTZ NOT NULL
    - `submission_date`: TIMESTAMPTZ
    - `submission_method`: ENUM('portal', 'email', 'api', 'mail', 'in_person')
    - `recipient_authority`: TEXT NOT NULL -- Regulatory body name
    - `recipient_contact`: TEXT
    - `report_content`: JSONB NOT NULL -- Structured report data
    - `attachments`: JSONB -- List of attached documents
    - `acknowledgment_received`: BOOLEAN DEFAULT false
    - `acknowledgment_date`: TIMESTAMPTZ
    - `acknowledgment_reference`: TEXT
    - `regulator_feedback`: TEXT
    - `amendments_required`: BOOLEAN DEFAULT false
    - `amendment_deadline`: TIMESTAMPTZ
    - `organization_id`: UUID REFERENCES organizations(id)
    - `prepared_by`: UUID REFERENCES users(id)
    - `approved_by`: UUID REFERENCES users(id)
    - `created_at`, `updated_at`: Timestamp fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_report_content CHECK (jsonb_typeof(report_content) = 'object')
    - CONSTRAINT valid_attachments CHECK (jsonb_typeof(attachments) = 'object')
    - INDEX idx_regulatory_reports_deadline (submission_deadline, status) WHERE deleted_at IS NULL

### 3. Data Breach Notification Management

#### Breach Incident Tracking
- **Status**: Core Feature
- **Triggers**:
  - Security incident detection
  - Data loss discovery
  - Unauthorized access detection
  - Third-party breach notification
  - System compromise
- **Data Model Requirements**:
  - `data_breach_incidents` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `incident_id`: UUID REFERENCES incidents(id) -- Link to main incident
    - `breach_type`: ENUM('unauthorized_access', 'data_loss', 'data_theft', 'accidental_disclosure', 'ransomware', 'system_compromise', 'third_party')
    - `discovery_date`: TIMESTAMPTZ NOT NULL
    - `incident_date`: TIMESTAMPTZ -- When breach actually occurred
    - `containment_date`: TIMESTAMPTZ
    - `data_categories_affected`: TEXT[] -- Types of personal data
    - `special_categories_involved`: BOOLEAN DEFAULT false -- Sensitive data under GDPR
    - `records_affected`: INTEGER
    - `individuals_affected`: INTEGER
    - `jurisdictions_affected`: TEXT[] -- Countries/states affected
    - `breach_severity`: ENUM('low', 'medium', 'high', 'critical')
    - `risk_to_individuals`: ENUM('unlikely', 'possible', 'likely', 'severe')
    - `cross_border_transfer`: BOOLEAN DEFAULT false
    - `encryption_status`: ENUM('encrypted', 'partially_encrypted', 'unencrypted', 'unknown')
    - `breach_description`: TEXT NOT NULL
    - `root_cause`: TEXT
    - `containment_measures`: TEXT
    - `notification_required`: BOOLEAN DEFAULT true
    - `notification_exemption_reason`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - INDEX idx_breach_incidents_notification (notification_required, discovery_date) WHERE notification_required = true
  
  - `breach_notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `breach_id`: UUID REFERENCES data_breach_incidents(id) ON DELETE CASCADE
    - `notification_type`: ENUM('authority', 'individual', 'public', 'partner', 'insurance')
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'hipaa', 'other')
    - `notification_status`: ENUM('pending', 'drafting', 'approved', 'sent', 'acknowledged', 'follow_up_required')
    - `recipient_type`: ENUM('data_protection_authority', 'individual', 'media', 'partner', 'other')
    - `recipient_name`: TEXT
    - `recipient_contact`: TEXT
    - `notification_deadline`: TIMESTAMPTZ NOT NULL -- Calculated based on regulation
    - `notification_sent_date`: TIMESTAMPTZ
    - `notification_method`: ENUM('email', 'portal', 'mail', 'phone', 'public_announcement')
    - `notification_content`: JSONB NOT NULL -- Structured notification data
    - `language`: TEXT DEFAULT 'en'
    - `acknowledgment_received`: BOOLEAN DEFAULT false
    - `acknowledgment_date`: TIMESTAMPTZ
    - `reference_number`: TEXT -- Authority reference
    - `follow_up_actions`: JSONB -- Required follow-up tasks
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_notification_content CHECK (jsonb_typeof(notification_content) = 'object')
    - CONSTRAINT valid_follow_up CHECK (jsonb_typeof(follow_up_actions) = 'object')
    - INDEX idx_breach_notifications_deadline (notification_deadline, notification_status)
    - UNIQUE(breach_id, notification_type, recipient_type, recipient_name)
  
  - `individual_notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `breach_notification_id`: UUID REFERENCES breach_notifications(id) ON DELETE CASCADE
    - `individual_id`: TEXT -- Internal ID or pseudonymized reference
    - `individual_email`: TEXT -- Encrypted/hashed
    - `individual_phone`: TEXT -- Encrypted/hashed
    - `notification_status`: ENUM('pending', 'sent', 'delivered', 'bounced', 'failed')
    - `sent_date`: TIMESTAMPTZ
    - `delivered_date`: TIMESTAMPTZ
    - `bounce_reason`: TEXT
    - `retry_count`: INTEGER DEFAULT 0
    - `opt_out_requested`: BOOLEAN DEFAULT false
    - `support_requested`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - INDEX idx_individual_notifications_status (breach_notification_id, notification_status)

### 4. Regulatory Compliance Reporting

#### Compliance Metrics and Dashboards
- **Status**: Enhancement
- **Triggers**:
  - Executive reporting needs
  - Board reporting
  - Regulatory inquiries
  - Audit preparation
- **Data Model Requirements**:
  - `regulatory_compliance_metrics` table (materialized view):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_date`: DATE NOT NULL
    - `regulatory_framework`: ENUM('gdpr', 'ccpa', 'lgpd', 'pipeda', 'hipaa', 'sox', 'pci_dss', 'iso27001', 'nist', 'other')
    - `organization_id`: UUID REFERENCES organizations(id)
    - `total_requirements`: INTEGER DEFAULT 0
    - `compliant_requirements`: INTEGER DEFAULT 0
    - `partial_compliance`: INTEGER DEFAULT 0
    - `non_compliant`: INTEGER DEFAULT 0
    - `compliance_percentage`: DECIMAL(5,2)
    - `open_findings`: INTEGER DEFAULT 0
    - `overdue_actions`: INTEGER DEFAULT 0
    - `reports_submitted`: INTEGER DEFAULT 0
    - `reports_pending`: INTEGER DEFAULT 0
    - `breaches_reported`: INTEGER DEFAULT 0
    - `average_notification_time_hours`: DECIMAL(5,2)
    - `by_category`: JSONB -- Breakdown by requirement category
    - `by_jurisdiction`: JSONB -- Breakdown by jurisdiction
    - `trend_data`: JSONB -- Historical comparison
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_by_category CHECK (jsonb_typeof(by_category) = 'object')
    - CONSTRAINT valid_by_jurisdiction CHECK (jsonb_typeof(by_jurisdiction) = 'object')
    - CONSTRAINT valid_trend_data CHECK (jsonb_typeof(trend_data) = 'object')
    - UNIQUE(metric_date, regulatory_framework, organization_id)

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_regulatory_requirements_active ON regulatory_requirements (regulatory_framework, is_active) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_regulatory_assessments_status ON regulatory_assessments (status, next_assessment_date) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_regulatory_reports_status ON regulatory_reports (status, submission_deadline) 
    WHERE deleted_at IS NULL AND status NOT IN ('submitted', 'acknowledged');
CREATE INDEX idx_breach_incidents_affected ON data_breach_incidents (notification_required, records_affected) 
    WHERE notification_required = true;
CREATE INDEX idx_breach_notifications_pending ON breach_notifications (notification_status, notification_deadline) 
    WHERE notification_status IN ('pending', 'drafting');

-- GIN indexes for JSONB and array fields
CREATE INDEX idx_requirements_threshold ON regulatory_requirements USING GIN (notification_threshold);
CREATE INDEX idx_assessments_docs ON regulatory_assessments USING GIN (supporting_documents);
CREATE INDEX idx_reports_content ON regulatory_reports USING GIN (report_content);
CREATE INDEX idx_breach_jurisdictions ON data_breach_incidents USING GIN (jurisdictions_affected);
CREATE INDEX idx_notifications_content ON breach_notifications USING GIN (notification_content);
```

## Functions and Triggers

```sql
-- Function to calculate breach notification deadline
CREATE OR REPLACE FUNCTION calculate_breach_notification_deadline(
    p_breach_id UUID,
    p_regulatory_framework TEXT,
    p_notification_type TEXT
) RETURNS TIMESTAMPTZ AS $
DECLARE
    v_discovery_date TIMESTAMPTZ;
    v_deadline_hours INTEGER;
    v_severity TEXT;
BEGIN
    -- Get breach details
    SELECT discovery_date, breach_severity 
    INTO v_discovery_date, v_severity
    FROM data_breach_incidents
    WHERE id = p_breach_id;
    
    -- Calculate deadline based on regulation and type
    CASE p_regulatory_framework
        WHEN 'gdpr' THEN
            CASE p_notification_type
                WHEN 'authority' THEN v_deadline_hours := 72;
                WHEN 'individual' THEN 
                    v_deadline_hours := CASE 
                        WHEN v_severity IN ('high', 'critical') THEN 72
                        ELSE NULL -- Without undue delay
                    END;
            END CASE;
        WHEN 'ccpa' THEN
            v_deadline_hours := NULL; -- Without unreasonable delay
        WHEN 'hipaa' THEN
            CASE p_notification_type
                WHEN 'authority' THEN v_deadline_hours := 60 * 24; -- 60 days
                WHEN 'individual' THEN v_deadline_hours := 60 * 24;
            END CASE;
        ELSE
            v_deadline_hours := 72; -- Default
    END CASE;
    
    IF v_deadline_hours IS NOT NULL THEN
        RETURN v_discovery_date + (v_deadline_hours || ' hours')::INTERVAL;
    ELSE
        RETURN v_discovery_date + INTERVAL '30 days'; -- Default reasonable time
    END IF;
END;
$ LANGUAGE plpgsql;

-- Function to generate report number
CREATE OR REPLACE FUNCTION generate_report_number(
    p_report_type TEXT,
    p_regulatory_framework TEXT,
    p_organization_id UUID
) RETURNS TEXT AS $
DECLARE
    v_prefix TEXT;
    v_year TEXT;
    v_sequence INTEGER;
BEGIN
    -- Create prefix
    v_prefix := UPPER(LEFT(p_regulatory_framework, 3)) || '-' || 
                UPPER(LEFT(p_report_type, 3));
    v_year := TO_CHAR(NOW(), 'YYYY');
    
    -- Get next sequence
    SELECT COALESCE(MAX(CAST(SUBSTRING(report_number FROM '[0-9]+) AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM regulatory_reports
    WHERE organization_id = p_organization_id
    AND report_number LIKE v_prefix || '-' || v_year || '-%';
    
    RETURN v_prefix || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 4, '0');
END;
$ LANGUAGE plpgsql;

-- Trigger to set report number
CREATE OR REPLACE FUNCTION set_report_number()
RETURNS TRIGGER AS $
BEGIN
    IF NEW.report_number IS NULL THEN
        NEW.report_number := generate_report_number(
            NEW.report_type::TEXT,
            NEW.regulatory_framework::TEXT,
            NEW.organization_id
        );
    END IF;
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER generate_report_number_trigger
    BEFORE INSERT ON regulatory_reports
    FOR EACH ROW
    EXECUTE FUNCTION set_report_number();

-- Function to check notification requirements
CREATE OR REPLACE FUNCTION check_breach_notification_requirements()
RETURNS TRIGGER AS $
DECLARE
    v_requirements RECORD;
    v_notification_required BOOLEAN := false;
BEGIN
    -- Check each applicable regulation
    FOR v_requirements IN 
        SELECT * FROM regulatory_requirements
        WHERE organization_id = NEW.organization_id
        AND requirement_type = 'notification'
        AND is_active = true
    LOOP
        -- Check if breach meets notification threshold
        IF v_requirements.notification_threshold IS NOT NULL THEN
            -- Simplified threshold check
            IF NEW.records_affected >= COALESCE(
                (v_requirements.notification_threshold->>'min_records')::INTEGER, 
                1
            ) THEN
                v_notification_required := true;
                
                -- Create notification record
                INSERT INTO breach_notifications (
                    breach_id,
                    notification_type,
                    regulatory_framework,
                    recipient_type,
                    notification_deadline,
                    notification_status,
                    organization_id,
                    created_by
                ) VALUES (
                    NEW.id,
                    'authority',
                    v_requirements.regulatory_framework,
                    'data_protection_authority',
                    calculate_breach_notification_deadline(
                        NEW.id, 
                        v_requirements.regulatory_framework::TEXT, 
                        'authority'
                    ),
                    'pending',
                    NEW.organization_id,
                    NEW.created_by
                );
            END IF;
        END IF;
    END LOOP;
    
    NEW.notification_required := v_notification_required;
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER check_breach_notifications_trigger
    BEFORE INSERT OR UPDATE ON data_breach_incidents
    FOR EACH ROW
    EXECUTE FUNCTION check_breach_notification_requirements();

-- Function to calculate compliance metrics
CREATE OR REPLACE FUNCTION refresh_regulatory_compliance_metrics()
RETURNS VOID AS $
BEGIN
    REFRESH MATERIALIZED VIEW regulatory_compliance_metrics;
END;
$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **Regulatory Dashboard** for compliance overview
  - **Requirements Manager** for tracking regulatory obligations
  - **Assessment Wizard** for regulatory assessments
  - **Report Builder** for regulatory reports
  - **Breach Response Center** for incident management
  - **Notification Manager** for breach notifications
  - **Individual Notification Portal** for data subject notifications
  - **Compliance Calendar** for deadlines and submissions
  - **Analytics Dashboard** for compliance metrics

- **Integration Points**:
  - Incident management system integration
  - Document management for evidence
  - Task management for remediation
  - Calendar integration for deadlines
  - Email/SMS gateways for notifications
  - Regulatory portals for submissions
  - Audit trail for all activities
  - Risk management for impact assessment

## Compliance and Operational Considerations

1. **Multi-Jurisdictional Support**:
   - Configurable requirements per jurisdiction
   - Automatic deadline calculation
   - Template library per regulation
   - Language localization for notifications

2. **Notification Management**:
   - Bulk notification capabilities
   - Template-based notifications
   - Multi-channel delivery
   - Delivery tracking and confirmation

3. **Audit Trail**:
   - Complete activity logging
   - Decision documentation
   - Communication history
   - Evidence preservation

4. **Integration Capabilities**:
   - Regulatory portal APIs
   - Secure file transfer
   - Digital signatures
   - Automated submissions