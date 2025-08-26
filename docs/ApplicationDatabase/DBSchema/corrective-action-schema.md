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