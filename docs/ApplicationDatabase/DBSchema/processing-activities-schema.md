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