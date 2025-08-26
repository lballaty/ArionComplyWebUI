# Post-Incident Enhancement - Database Schema

## Overview

This document defines the enhanced database schema for comprehensive post-incident management that extends the basic incident tables to support incident timelines, communications tracking, lessons learned, and remediation planning across the ArionComply platform. The design follows established database principles while providing advanced incident lifecycle management.

## Post-Incident Management Workflow

### 1. Incident Timeline Management

#### Detailed Incident Timeline Tracking
- **Status**: Core Feature
- **Triggers**:
  - Incident events occurring
  - Status changes
  - Response actions taken
  - Milestone achievements
  - External communications
- **Approval Requirements**:
  - Timeline accuracy verification
  - Event sequence validation
  - Management review for significant events
- **Data Model Requirements**:
  - `incident_timelines` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `incident_id`: UUID REFERENCES incidents(id) ON DELETE CASCADE
    - `event_timestamp`: TIMESTAMPTZ NOT NULL
    - `event_type`: ENUM('detection', 'escalation', 'containment', 'eradication', 'recovery', 'communication', 'decision', 'milestone', 'external_event')
    - `event_category`: ENUM('technical', 'management', 'communication', 'legal', 'operational')
    - `event_title`: TEXT NOT NULL
    - `event_description`: TEXT NOT NULL
    - `event_severity`: ENUM('info', 'low', 'medium', 'high', 'critical')
    - `actors_involved`: UUID[] -- User IDs involved in event
    - `systems_affected`: TEXT[] -- Systems/assets involved
    - `actions_taken`: TEXT[] -- List of actions
    - `decisions_made`: JSONB -- Structured decision data
    - `evidence_references`: JSONB -- Links to supporting evidence
    - `external_parties`: TEXT[] -- External parties involved
    - `event_duration_minutes`: INTEGER -- For events with duration
    - `is_key_event`: BOOLEAN DEFAULT false -- Highlight important events
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_decisions CHECK (jsonb_typeof(decisions_made) = 'object')
    - CONSTRAINT valid_evidence CHECK (jsonb_typeof(evidence_references) = 'object')
    - INDEX idx_incident_timelines_incident (incident_id, event_timestamp)
    - INDEX idx_incident_timelines_key (incident_id, is_key_event) WHERE is_key_event = true
  
  - `incident_timeline_attachments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `timeline_event_id`: UUID REFERENCES incident_timelines(id) ON DELETE CASCADE
    - `attachment_type`: ENUM('screenshot', 'log', 'email', 'document', 'recording', 'other')
    - `file_name`: TEXT NOT NULL
    - `file_path`: TEXT NOT NULL
    - `file_size`: BIGINT
    - `mime_type`: TEXT
    - `description`: TEXT
    - `is_sensitive`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields

### 2. Incident Communications Management

#### Communication Tracking and Coordination
- **Status**: Core Feature
- **Triggers**:
  - Internal communications
  - External notifications
  - Stakeholder updates
  - Media communications
  - Regulatory communications
- **Data Model Requirements**:
  - `incident_communications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `incident_id`: UUID REFERENCES incidents(id) ON DELETE CASCADE
    - `communication_type`: ENUM('internal_update', 'stakeholder_notification', 'customer_notification', 'media_statement', 'regulatory_notification', 'partner_notification')
    - `communication_method`: ENUM('email', 'phone', 'meeting', 'portal', 'press_release', 'social_media', 'other')
    - `direction`: ENUM('outbound', 'inbound')
    - `sender_id`: UUID REFERENCES users(id) -- For outbound
    - `sender_name`: TEXT -- For inbound external
    - `recipients`: JSONB NOT NULL -- List of recipients
    - `subject`: TEXT NOT NULL
    - `content`: TEXT NOT NULL
    - `communication_timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `is_template_based`: BOOLEAN DEFAULT false
    - `template_id`: UUID -- Reference to communication template
    - `approval_status`: ENUM('draft', 'pending_approval', 'approved', 'sent', 'cancelled')
    - `approved_by`: UUID REFERENCES users(id)
    - `approval_timestamp`: TIMESTAMPTZ
    - `delivery_status`: JSONB -- Delivery confirmation details
    - `follow_up_required`: BOOLEAN DEFAULT false
    - `follow_up_date`: DATE
    - `sensitivity_level`: ENUM('public', 'internal', 'confidential', 'restricted')
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_recipients CHECK (jsonb_typeof(recipients) = 'object')
    - CONSTRAINT valid_delivery CHECK (jsonb_typeof(delivery_status) = 'object')
    - INDEX idx_incident_communications_incident (incident_id, communication_timestamp)
    - INDEX idx_incident_communications_approval (approval_status) WHERE approval_status = 'pending_approval'
  
  - `incident_communication_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `template_type`: ENUM('initial_notification', 'status_update', 'resolution_notice', 'post_mortem', 'regulatory', 'media')
    - `subject_template`: TEXT NOT NULL
    - `content_template`: TEXT NOT NULL
    - `variables`: JSONB NOT NULL -- Required template variables
    - `approval_required`: BOOLEAN DEFAULT true
    - `minimum_approval_level`: TEXT -- Role required for approval
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_variables CHECK (jsonb_typeof(variables) = 'object')

### 3. Post-Incident Review Process

#### Comprehensive Post-Mortem Management
- **Status**: Core Feature
- **Triggers**:
  - Incident closure
  - Significant incident occurrence
  - Regulatory requirements
  - Management request
  - Periodic review cycles
- **Data Model Requirements**:
  - `post_incident_reviews` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `incident_id`: UUID REFERENCES incidents(id) ON DELETE CASCADE
    - `review_name`: TEXT NOT NULL
    - `review_type`: ENUM('immediate', 'comprehensive', 'executive', 'technical', 'regulatory')
    - `review_status`: ENUM('scheduled', 'in_progress', 'draft', 'review', 'approved', 'published')
    - `scheduled_date`: DATE
    - `conducted_date`: DATE
    - `facilitator_id`: UUID REFERENCES users(id)
    - `participants`: UUID[] -- Array of participant user IDs
    - `review_objectives`: TEXT[]
    - `incident_summary`: TEXT NOT NULL
    - `timeline_analysis`: TEXT
    - `what_went_well`: TEXT[]
    - `what_went_wrong`: TEXT[]
    - `root_causes`: JSONB -- Structured root cause analysis
    - `contributing_factors`: TEXT[]
    - `impact_analysis`: JSONB -- Detailed impact assessment
    - `recommendations`: JSONB -- Structured recommendations
    - `action_items`: JSONB -- Specific action items identified
    - `review_notes`: TEXT
    - `executive_summary`: TEXT
    - `report_document_id`: UUID -- Link to formal report
    - `is_blameless`: BOOLEAN DEFAULT true -- Blameless post-mortem approach
    - `publish_internally`: BOOLEAN DEFAULT false
    - `publish_externally`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_root_causes CHECK (jsonb_typeof(root_causes) = 'object')
    - CONSTRAINT valid_impact CHECK (jsonb_typeof(impact_analysis) = 'object')
    - CONSTRAINT valid_recommendations CHECK (jsonb_typeof(recommendations) = 'object')
    - CONSTRAINT valid_action_items CHECK (jsonb_typeof(action_items) = 'object')
  
  - `lessons_learned` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `source_type`: ENUM('incident', 'audit', 'assessment', 'exercise', 'external')
    - `source_id`: UUID -- ID of source record
    - `review_id`: UUID REFERENCES post_incident_reviews(id)
    - `lesson_title`: TEXT NOT NULL
    - `lesson_description`: TEXT NOT NULL
    - `lesson_category`: ENUM('process', 'technology', 'people', 'communication', 'training', 'policy')
    - `severity`: ENUM('minor', 'moderate', 'significant', 'critical')
    - `applicability`: ENUM('team', 'department', 'organization', 'industry')
    - `affected_areas`: TEXT[] -- Areas/departments affected
    - `prevention_measures`: TEXT[] -- How to prevent recurrence
    - `detection_improvements`: TEXT[] -- How to detect earlier
    - `response_improvements`: TEXT[] -- How to respond better
    - `implementation_status`: ENUM('identified', 'planned', 'in_progress', 'implemented', 'verified')
    - `implementation_owner`: UUID REFERENCES users(id)
    - `implementation_deadline`: DATE
    - `verification_method`: TEXT
    - `is_recurring_issue`: BOOLEAN DEFAULT false
    - `previous_occurrences`: JSONB -- Links to similar incidents
    - `tags`: TEXT[] -- For categorization and search
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_previous CHECK (jsonb_typeof(previous_occurrences) = 'object')
    - INDEX idx_lessons_learned_status (implementation_status, implementation_deadline)
    - INDEX idx_lessons_learned_category (lesson_category, severity)

### 4. Remediation Planning and Tracking

#### Structured Remediation Management
- **Status**: Core Feature
- **Triggers**:
  - Post-incident review completion
  - Root cause identification
  - Vulnerability discovery
  - Control gaps identification
  - Regulatory requirements
- **Data Model Requirements**:
  - `remediation_plans` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_name`: TEXT NOT NULL
    - `plan_type`: ENUM('incident', 'vulnerability', 'control_gap', 'process_improvement', 'comprehensive')
    - `source_incident_id`: UUID REFERENCES incidents(id)
    - `review_id`: UUID REFERENCES post_incident_reviews(id)
    - `plan_status`: ENUM('draft', 'approved', 'in_progress', 'completed', 'cancelled', 'on_hold')
    - `priority`: priority_enum DEFAULT 'high'
    - `plan_owner_id`: UUID REFERENCES users(id)
    - `stakeholders`: UUID[] -- Array of stakeholder user IDs
    - `objectives`: TEXT[] NOT NULL
    - `scope`: TEXT NOT NULL
    - `constraints`: TEXT[] -- Budget, time, resource constraints
    - `dependencies`: JSONB -- Other plans or projects
    - `success_criteria`: TEXT[] NOT NULL
    - `risk_assessment`: JSONB -- Risks to implementation
    - `budget_estimate`: DECIMAL(10,2)
    - `resource_requirements`: JSONB
    - `planned_start_date`: DATE
    - `planned_end_date`: DATE
    - `actual_start_date`: DATE
    - `actual_end_date`: DATE
    - `completion_percentage`: INTEGER DEFAULT 0
    - `approval_date`: DATE
    - `approved_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_dependencies CHECK (jsonb_typeof(dependencies) = 'object')
    - CONSTRAINT valid_risk CHECK (jsonb_typeof(risk_assessment) = 'object')
    - CONSTRAINT valid_resources CHECK (jsonb_typeof(resource_requirements) = 'object')
    - CONSTRAINT valid_dates CHECK (planned_start_date <= planned_end_date)
    - INDEX idx_remediation_plans_status (plan_status, priority)
  
  - `remediation_tasks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `plan_id`: UUID REFERENCES remediation_plans(id) ON DELETE CASCADE
    - `task_title`: TEXT NOT NULL
    - `task_description`: TEXT
    - `task_type`: ENUM('technical', 'procedural', 'training', 'policy', 'communication', 'testing')
    - `priority`: priority_enum DEFAULT 'medium'
    - `status`: ENUM('not_started', 'in_progress', 'blocked', 'completed', 'cancelled', 'deferred')
    - `assigned_to`: UUID REFERENCES users(id)
    - `assigned_team`: TEXT
    - `estimated_hours`: DECIMAL(5,2)
    - `actual_hours`: DECIMAL(5,2)
    - `due_date`: DATE
    - `completed_date`: DATE
    - `dependencies`: UUID[] -- Other tasks that must complete first
    - `blockers`: TEXT[] -- Current blockers
    - `completion_evidence`: JSONB -- Links to evidence
    - `verification_required`: BOOLEAN DEFAULT true
    - `verified_by`: UUID REFERENCES users(id)
    - `verification_date`: DATE
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_evidence CHECK (jsonb_typeof(completion_evidence) = 'object')
    - INDEX idx_remediation_tasks_assignee (assigned_to, status)
    - INDEX idx_remediation_tasks_due (due_date, status) WHERE status NOT IN ('completed', 'cancelled')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_timelines_incident_chrono ON incident_timelines (incident_id, event_timestamp DESC);
CREATE INDEX idx_timelines_severity ON incident_timelines (incident_id, event_severity) 
    WHERE event_severity IN ('high', 'critical');
CREATE INDEX idx_communications_followup ON incident_communications (follow_up_date, follow_up_required) 
    WHERE follow_up_required = true;
CREATE INDEX idx_reviews_status ON post_incident_reviews (review_status, scheduled_date) 
    WHERE review_status NOT IN ('approved', 'published');
CREATE INDEX idx_lessons_implementation ON lessons_learned (implementation_status, implementation_deadline) 
    WHERE implementation_status NOT IN ('implemented', 'verified');
CREATE INDEX idx_remediation_active ON remediation_plans (plan_status, priority) 
    WHERE plan_status IN ('approved', 'in_progress');

-- GIN indexes for JSONB and array fields
CREATE INDEX idx_timelines_decisions ON incident_timelines USING GIN (decisions_made);
CREATE INDEX idx_communications_recipients ON incident_communications USING GIN (recipients);
CREATE INDEX idx_reviews_recommendations ON post_incident_reviews USING GIN (recommendations);
CREATE INDEX idx_lessons_tags ON lessons_learned USING GIN (tags);
CREATE INDEX idx_remediation_deps ON remediation_plans USING GIN (dependencies);
```

## Functions and Triggers

```sql
-- Function to create timeline event
CREATE OR REPLACE FUNCTION create_timeline_event(
    p_incident_id UUID,
    p_event_type TEXT,
    p_event_title TEXT,
    p_event_description TEXT,
    p_severity TEXT DEFAULT 'info',
    p_actors UUID[] DEFAULT NULL,
    p_systems TEXT[] DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_event_id UUID;
BEGIN
    INSERT INTO incident_timelines (
        incident_id,
        event_timestamp,
        event_type,
        event_title,
        event_description,
        event_severity,
        actors_involved,
        systems_affected,
        organization_id,
        created_by
    ) VALUES (
        p_incident_id,
        NOW(),
        p_event_type::incident_timeline_event_type,
        p_event_title,
        p_event_description,
        p_severity::incident_timeline_severity,
        p_actors,
        p_systems,
        (SELECT organization_id FROM incidents WHERE id = p_incident_id),
        (SELECT updated_by FROM incidents WHERE id = p_incident_id)
    ) RETURNING id INTO v_event_id;
    
    RETURN v_event_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to log incident status changes in timeline
CREATE OR REPLACE FUNCTION log_incident_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        PERFORM create_timeline_event(
            NEW.id,
            'milestone',
            'Status changed to ' || NEW.status,
            'Incident status changed from ' || OLD.status || ' to ' || NEW.status,
            CASE 
                WHEN NEW.status IN ('contained', 'resolved') THEN 'medium'
                WHEN NEW.status = 'closed' THEN 'high'
                ELSE 'info'
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER incident_status_timeline_trigger
    AFTER UPDATE OF status ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION log_incident_status_change();

-- Function to calculate remediation progress
CREATE OR REPLACE FUNCTION calculate_remediation_progress()
RETURNS TRIGGER AS $$
DECLARE
    v_total_tasks INTEGER;
    v_completed_tasks INTEGER;
    v_progress INTEGER;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'completed')
    INTO v_total_tasks, v_completed_tasks
    FROM remediation_tasks
    WHERE plan_id = COALESCE(NEW.plan_id, OLD.plan_id);
    
    IF v_total_tasks > 0 THEN
        v_progress := (v_completed_tasks * 100 / v_total_tasks);
        
        UPDATE remediation_plans
        SET completion_percentage = v_progress,
            plan_status = CASE 
                WHEN v_progress = 100 THEN 'completed'
                WHEN v_progress > 0 AND plan_status = 'approved' THEN 'in_progress'
                ELSE plan_status
            END,
            updated_at = NOW()
        WHERE id = COALESCE(NEW.plan_id, OLD.plan_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_remediation_progress_trigger
    AFTER INSERT OR UPDATE OF status OR DELETE ON remediation_tasks
    FOR EACH ROW
    EXECUTE FUNCTION calculate_remediation_progress();

-- Function to identify recurring issues
CREATE OR REPLACE FUNCTION check_recurring_issues()
RETURNS TRIGGER AS $$
DECLARE
    v_similar_count INTEGER;
    v_previous_incidents JSONB := '[]'::jsonb;
BEGIN
    -- Look for similar lessons in the past
    SELECT COUNT(*), jsonb_agg(
        jsonb_build_object(
            'lesson_id', id,
            'source_id', source_id,
            'date', created_at
        )
    ) INTO v_similar_count, v_previous_incidents
    FROM lessons_learned
    WHERE organization_id = NEW.organization_id
    AND lesson_category = NEW.lesson_category
    AND id != NEW.id
    AND (
        similarity(lesson_title, NEW.lesson_title) > 0.6 OR
        similarity(lesson_description, NEW.lesson_description) > 0.5
    );
    
    IF v_similar_count > 0 THEN
        NEW.is_recurring_issue := true;
        NEW.previous_occurrences := v_previous_incidents;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_recurring_issues_trigger
    BEFORE INSERT OR UPDATE ON lessons_learned
    FOR EACH ROW
    EXECUTE FUNCTION check_recurring_issues();

-- Function to create post-incident review reminder
CREATE OR REPLACE FUNCTION schedule_post_incident_review()
RETURNS TRIGGER AS $$
DECLARE
    v_review_deadline DATE;
BEGIN
    -- Schedule review based on incident severity
    IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
        v_review_deadline := CASE NEW.severity
            WHEN 'critical' THEN CURRENT_DATE + INTERVAL '3 days'
            WHEN 'high' THEN CURRENT_DATE + INTERVAL '7 days'
            WHEN 'medium' THEN CURRENT_DATE + INTERVAL '14 days'
            ELSE CURRENT_DATE + INTERVAL '30 days'
        END;
        
        -- Create review record
        INSERT INTO post_incident_reviews (
            incident_id,
            review_name,
            review_type,
            review_status,
            scheduled_date,
            organization_id,
            created_by
        ) VALUES (
            NEW.id,
            'Post-Incident Review: ' || NEW.incident_name,
            CASE NEW.severity
                WHEN 'critical' THEN 'comprehensive'
                WHEN 'high' THEN 'comprehensive'
                ELSE 'technical'
            END,
            'scheduled',
            v_review_deadline,
            NEW.organization_id,
            NEW.updated_by
        ) ON CONFLICT DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER schedule_review_trigger
    AFTER UPDATE OF status ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION schedule_post_incident_review();
```

## UI Integration

- **Primary Screens**:
  - **Incident Timeline View** for chronological event visualization
  - **Communication Center** for managing incident communications
  - **Post-Mortem Wizard** for conducting reviews
  - **Lessons Learned Repository** for knowledge management
  - **Remediation Planner** for planning improvements
  - **Task Tracker** for remediation execution
  - **Analytics Dashboard** for incident trends
  - **Report Generator** for post-incident reports

- **Integration Points**:
  - Main incident management system
  - Task management for remediation tasks
  - Document management for reports
  - Communication system for notifications
  - Calendar for review scheduling
  - Analytics for trend analysis
  - Knowledge base for lessons learned
  - Training system for improvement implementation

## Operational and Quality Considerations

1. **Blameless Culture**:
   - Focus on system improvements
   - No individual blame assignment
   - Constructive analysis approach
   - Learning-oriented reviews

2. **Knowledge Management**:
   - Searchable lessons learned
   - Pattern recognition
   - Cross-incident analysis
   - Best practice development

3. **Continuous Improvement**:
   - Measurable remediation outcomes
   - Effectiveness tracking
   - Trend analysis
   - Proactive risk reduction

4. **Communication Excellence**:
   - Template-based consistency
   - Multi-stakeholder coordination
   - Approval workflows
   - Delivery confirmation