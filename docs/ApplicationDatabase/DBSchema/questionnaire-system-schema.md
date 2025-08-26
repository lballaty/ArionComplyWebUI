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