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