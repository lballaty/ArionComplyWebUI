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