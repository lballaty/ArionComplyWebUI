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