# Core Assets Management - Database Schema

## Overview

This document defines the database schema for managing information assets, which is foundational to risk management, compliance, and security programs. The system supports comprehensive asset inventory, classification, ownership, dependencies, and lifecycle management.

## Asset Management Workflow

### 1. Core Asset Management

#### Asset Inventory and Classification
- **Status**: Mandatory for Risk Management
- **Triggers**:
  - New system deployment
  - Infrastructure changes
  - Business process changes
  - Acquisition or merger
  - Regular inventory updates
  - Compliance requirements
- **Approval Requirements**:
  - Asset owner assignment
  - Classification approval
  - Critical asset designation
  - Decommissioning approval
- **Data Model Requirements**:
  - `assets` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_number`: TEXT UNIQUE NOT NULL -- Human-readable asset ID
    - `asset_name`: TEXT NOT NULL
    - `description`: TEXT
    - `asset_type`: ENUM('application', 'database', 'server', 'network_device', 'endpoint', 'cloud_service', 'data_store', 'physical', 'process', 'intangible')
    - `asset_subtype`: TEXT -- More specific categorization
    - `status`: ENUM('planned', 'active', 'inactive', 'decommissioning', 'decommissioned', 'archived')
    - `lifecycle_stage`: ENUM('planning', 'acquisition', 'deployment', 'operation', 'maintenance', 'disposal')
    - `criticality`: risk_level_enum DEFAULT 'medium'
    - `business_value`: ENUM('essential', 'high', 'medium', 'low', 'minimal')
    - `owner_id`: UUID REFERENCES users(id)
    - `custodian_id`: UUID REFERENCES users(id) -- Technical custodian
    - `department_id`: UUID REFERENCES lookup_options(id)
    - `location`: TEXT -- Physical or logical location
    - `environment`: ENUM('production', 'staging', 'development', 'test', 'dr', 'backup')
    - `deployment_date`: DATE
    - `last_review_date`: DATE
    - `next_review_date`: DATE
    - `decommission_date`: DATE
    - `purchase_date`: DATE
    - `purchase_cost`: DECIMAL(12,2)
    - `current_value`: DECIMAL(12,2)
    - `license_info`: JSONB -- License details if applicable
    - `technical_details`: JSONB -- Technical specifications
    - `tags`: TEXT[] -- Flexible tagging
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_license_info CHECK (jsonb_typeof(license_info) = 'object')
    - CONSTRAINT valid_technical_details CHECK (jsonb_typeof(technical_details) = 'object')
    - INDEX idx_assets_status (organization_id, status) WHERE deleted_at IS NULL
    - INDEX idx_assets_owner (owner_id, status) WHERE deleted_at IS NULL
  
  - `asset_classifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `classification_type`: ENUM('confidentiality', 'integrity', 'availability', 'privacy', 'regulatory')
    - `classification_level`: ENUM('public', 'internal', 'confidential', 'restricted', 'secret')
    - `classification_reason`: TEXT
    - `classified_by`: UUID REFERENCES users(id)
    - `classification_date`: DATE DEFAULT CURRENT_DATE
    - `review_date`: DATE
    - `declassification_date`: DATE -- When classification expires
    - `handling_requirements`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(asset_id, classification_type)
  
  - `asset_dependencies` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `dependent_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE -- Asset that depends
    - `dependency_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE -- Asset being depended on
    - `dependency_type`: ENUM('requires', 'uses', 'connects_to', 'stores_data_in', 'authenticates_with', 'backed_up_by')
    - `dependency_criticality`: ENUM('critical', 'important', 'standard', 'minimal')
    - `description`: TEXT
    - `is_single_point_of_failure`: BOOLEAN DEFAULT false
    - `has_failover`: BOOLEAN DEFAULT false
    - `failover_details`: TEXT
    - `validated_date`: DATE
    - `validated_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(dependent_asset_id, dependency_asset_id, dependency_type)
    - CONSTRAINT no_self_dependency CHECK (dependent_asset_id != dependency_asset_id)
    - INDEX idx_asset_deps_dependent (dependent_asset_id)
    - INDEX idx_asset_deps_dependency (dependency_asset_id)

#### Asset Components and Relationships
- **Status**: Core Feature
- **Triggers**:
  - Asset decomposition
  - System integration
  - Data flow mapping
  - Network topology changes
- **Data Model Requirements**:
  - `asset_components` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `parent_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `component_name`: TEXT NOT NULL
    - `component_type`: TEXT
    - `component_version`: TEXT
    - `is_critical`: BOOLEAN DEFAULT false
    - `vendor`: TEXT
    - `license_required`: BOOLEAN DEFAULT false
    - `end_of_support_date`: DATE
    - `configuration`: JSONB -- Component-specific config
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_configuration CHECK (jsonb_typeof(configuration) = 'object')
  
  - `asset_data_flows` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `source_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `destination_asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `data_type`: TEXT NOT NULL -- Type of data flowing
    - `data_classification`: ENUM('public', 'internal', 'confidential', 'restricted', 'secret')
    - `flow_direction`: ENUM('unidirectional', 'bidirectional')
    - `protocol`: TEXT -- Communication protocol
    - `port`: INTEGER -- Network port if applicable
    - `encryption_in_transit`: BOOLEAN DEFAULT false
    - `encryption_method`: TEXT
    - `frequency`: ENUM('real_time', 'batch', 'on_demand', 'scheduled')
    - `volume_estimate`: TEXT -- Estimated data volume
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(source_asset_id, destination_asset_id, data_type)
  
  - `asset_access_permissions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `permission_type`: ENUM('read', 'write', 'execute', 'delete', 'admin', 'custom')
    - `grantee_type`: ENUM('user', 'role', 'group', 'service', 'external')
    - `grantee_id`: UUID -- ID of user/role/group
    - `grantee_name`: TEXT -- For external or service accounts
    - `access_level`: TEXT -- Specific access level details
    - `granted_date`: DATE DEFAULT CURRENT_DATE
    - `granted_by`: UUID REFERENCES users(id)
    - `expiry_date`: DATE
    - `last_reviewed`: DATE
    - `is_privileged`: BOOLEAN DEFAULT false
    - `justification`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields

#### Asset Lifecycle Management
- **Status**: Core Feature
- **Triggers**:
  - Lifecycle stage transitions
  - Maintenance schedules
  - End-of-life planning
  - Disposal requirements
- **Data Model Requirements**:
  - `asset_lifecycle_events` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `event_type`: ENUM('created', 'deployed', 'updated', 'maintained', 'moved', 'reconfigured', 'incident', 'decommissioned')
    - `event_date`: TIMESTAMPTZ DEFAULT NOW()
    - `event_description`: TEXT NOT NULL
    - `previous_state`: JSONB -- State before event
    - `new_state`: JSONB -- State after event
    - `performed_by`: UUID REFERENCES users(id)
    - `approved_by`: UUID REFERENCES users(id)
    - `change_reference`: TEXT -- Change ticket/request number
    - `impact`: ENUM('none', 'minimal', 'moderate', 'significant', 'critical')
    - `downtime_minutes`: INTEGER
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - CONSTRAINT valid_previous_state CHECK (jsonb_typeof(previous_state) = 'object')
    - CONSTRAINT valid_new_state CHECK (jsonb_typeof(new_state) = 'object')
    - INDEX idx_lifecycle_events_asset (asset_id, event_date DESC)
  
  - `asset_maintenance_schedules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `maintenance_type`: ENUM('preventive', 'corrective', 'predictive', 'condition_based')
    - `schedule_name`: TEXT NOT NULL
    - `frequency`: ENUM('daily', 'weekly', 'monthly', 'quarterly', 'semi_annual', 'annual', 'as_needed')
    - `last_maintenance_date`: DATE
    - `next_maintenance_date`: DATE NOT NULL
    - `maintenance_window_hours`: INTEGER DEFAULT 4
    - `requires_downtime`: BOOLEAN DEFAULT true
    - `maintenance_procedure`: TEXT
    - `assigned_team`: TEXT
    - `estimated_cost`: DECIMAL(10,2)
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - INDEX idx_maintenance_next_date (next_maintenance_date, is_active)
  
  - `asset_disposal_records` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `disposal_date`: DATE DEFAULT CURRENT_DATE
    - `disposal_method`: ENUM('recycled', 'destroyed', 'donated', 'sold', 'returned', 'transferred')
    - `disposal_reason`: TEXT NOT NULL
    - `data_sanitization_method`: TEXT
    - `data_sanitization_verified`: BOOLEAN DEFAULT false
    - `verified_by`: UUID REFERENCES users(id)
    - `verification_date`: DATE
    - `disposal_certificate`: TEXT -- Reference to certificate
    - `disposal_vendor`: TEXT
    - `proceeds`: DECIMAL(10,2) -- If sold
    - `environmental_compliance`: BOOLEAN DEFAULT true
    - `final_approval_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields

#### Asset Monitoring and Metrics
- **Status**: Enhancement
- **Triggers**:
  - Performance monitoring
  - Availability tracking
  - Utilization analysis
  - Cost optimization
- **Data Model Requirements**:
  - `asset_metrics` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `asset_id`: UUID REFERENCES assets(id) ON DELETE CASCADE
    - `metric_date`: DATE DEFAULT CURRENT_DATE
    - `availability_percentage`: DECIMAL(5,2)
    - `utilization_percentage`: DECIMAL(5,2)
    - `performance_score`: DECIMAL(5,2)
    - `incident_count`: INTEGER DEFAULT 0
    - `change_count`: INTEGER DEFAULT 0
    - `cost_to_date`: DECIMAL(12,2)
    - `compliance_score`: DECIMAL(5,2)
    - `risk_score`: DECIMAL(5,2)
    - `custom_metrics`: JSONB -- Additional metrics
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - CONSTRAINT valid_custom_metrics CHECK (jsonb_typeof(custom_metrics) = 'object')
    - UNIQUE(asset_id, metric_date)

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_assets_criticality ON assets (criticality, status) 
    WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_assets_environment ON assets (environment, asset_type) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_review ON assets (next_review_date) 
    WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_classifications_level ON asset_classifications (classification_level, asset_id);
CREATE INDEX idx_dependencies_spof ON asset_dependencies (is_single_point_of_failure) 
    WHERE is_single_point_of_failure = true;
CREATE INDEX idx_data_flows_classification ON asset_data_flows (data_classification) 
    WHERE is_active = true;

-- GIN indexes for JSONB and array fields
CREATE INDEX idx_assets_tags ON assets USING GIN (tags);
CREATE INDEX idx_assets_technical ON assets USING GIN (technical_details);
CREATE INDEX idx_components_config ON asset_components USING GIN (configuration);
CREATE INDEX idx_lifecycle_states ON asset_lifecycle_events USING GIN (previous_state, new_state);
```

## Functions and Triggers

```sql
-- Function to generate asset number
CREATE OR REPLACE FUNCTION generate_asset_number(
    p_organization_id UUID,
    p_asset_type asset_type_enum
) RETURNS TEXT AS $$
DECLARE
    v_org_code TEXT;
    v_type_code TEXT;
    v_year TEXT;
    v_sequence INTEGER;
BEGIN
    -- Get organization code
    SELECT UPPER(LEFT(name, 3)) INTO v_org_code
    FROM organizations WHERE id = p_organization_id;
    
    -- Determine type code
    v_type_code := CASE p_asset_type
        WHEN 'application' THEN 'APP'
        WHEN 'database' THEN 'DB'
        WHEN 'server' THEN 'SRV'
        WHEN 'network_device' THEN 'NET'
        WHEN 'endpoint' THEN 'END'
        WHEN 'cloud_service' THEN 'CLD'
        WHEN 'data_store' THEN 'DAT'
        WHEN 'physical' THEN 'PHY'
        WHEN 'process' THEN 'PRC'
        WHEN 'intangible' THEN 'INT'
    END;
    
    -- Get current year
    v_year := TO_CHAR(NOW(), 'YY');
    
    -- Get next sequence
    SELECT COALESCE(MAX(CAST(SUBSTRING(asset_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO v_sequence
    FROM assets
    WHERE organization_id = p_organization_id
    AND asset_number LIKE v_org_code || '-' || v_type_code || '-' || v_year || '-%';
    
    RETURN v_org_code || '-' || v_type_code || '-' || v_year || '-' || LPAD(v_sequence::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to set asset number
CREATE OR REPLACE FUNCTION set_asset_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.asset_number IS NULL THEN
        NEW.asset_number := generate_asset_number(NEW.organization_id, NEW.asset_type);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_asset_number_trigger
    BEFORE INSERT ON assets
    FOR EACH ROW
    EXECUTE FUNCTION set_asset_number();

-- Function to check circular dependencies
CREATE OR REPLACE FUNCTION check_circular_asset_dependency()
RETURNS TRIGGER AS $$
DECLARE
    has_circular BOOLEAN;
BEGIN
    WITH RECURSIVE dep_chain AS (
        SELECT dependency_asset_id, dependent_asset_id
        FROM asset_dependencies
        WHERE dependent_asset_id = NEW.dependency_asset_id
        
        UNION ALL
        
        SELECT ad.dependency_asset_id, ad.dependent_asset_id
        FROM asset_dependencies ad
        JOIN dep_chain dc ON ad.dependent_asset_id = dc.dependency_asset_id
    )
    SELECT EXISTS (
        SELECT 1 FROM dep_chain 
        WHERE dependency_asset_id = NEW.dependent_asset_id
    ) INTO has_circular;
    
    IF has_circular THEN
        RAISE EXCEPTION 'Circular dependency detected between assets';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_circular_asset_dependencies
    BEFORE INSERT OR UPDATE ON asset_dependencies
    FOR EACH ROW
    EXECUTE FUNCTION check_circular_asset_dependency();

-- Function to calculate asset risk score
CREATE OR REPLACE FUNCTION calculate_asset_risk_score(
    p_asset_id UUID
) RETURNS DECIMAL AS $$
DECLARE
    v_criticality_score INTEGER;
    v_classification_score INTEGER;
    v_dependency_score INTEGER;
    v_vulnerability_score INTEGER;
    v_total_score DECIMAL;
BEGIN
    -- Get criticality score (1-5)
    SELECT CASE criticality
        WHEN 'critical' THEN 5
        WHEN 'high' THEN 4
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 2
        WHEN 'negligible' THEN 1
    END INTO v_criticality_score
    FROM assets WHERE id = p_asset_id;
    
    -- Get highest classification score (1-5)
    SELECT COALESCE(MAX(CASE classification_level
        WHEN 'secret' THEN 5
        WHEN 'restricted' THEN 4
        WHEN 'confidential' THEN 3
        WHEN 'internal' THEN 2
        WHEN 'public' THEN 1
    END), 1) INTO v_classification_score
    FROM asset_classifications
    WHERE asset_id = p_asset_id;
    
    -- Get dependency score based on SPOF
    SELECT CASE 
        WHEN COUNT(*) FILTER (WHERE is_single_point_of_failure = true) > 0 THEN 5
        WHEN COUNT(*) FILTER (WHERE dependency_criticality = 'critical') > 0 THEN 4
        WHEN COUNT(*) > 5 THEN 3
        WHEN COUNT(*) > 0 THEN 2
        ELSE 1
    END INTO v_dependency_score
    FROM asset_dependencies
    WHERE dependent_asset_id = p_asset_id;
    
    -- Get vulnerability score (would integrate with vulnerability data)
    v_vulnerability_score := 3; -- Placeholder
    
    -- Calculate weighted average
    v_total_score := (
        v_criticality_score * 0.35 +
        v_classification_score * 0.30 +
        v_dependency_score * 0.20 +
        v_vulnerability_score * 0.15
    );
    
    RETURN ROUND(v_total_score * 20, 2); -- Convert to 0-100 scale
END;
$$ LANGUAGE plpgsql;

-- Function to log lifecycle events
CREATE OR REPLACE FUNCTION log_asset_lifecycle_event()
RETURNS TRIGGER AS $$
BEGIN
    -- Log status changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO asset_lifecycle_events (
            asset_id,
            event_type,
            event_description,
            previous_state,
            new_state,
            performed_by,
            organization_id
        ) VALUES (
            NEW.id,
            CASE 
                WHEN NEW.status = 'decommissioned' THEN 'decommissioned'
                WHEN NEW.status = 'active' AND OLD.status = 'planned' THEN 'deployed'
                ELSE 'updated'
            END,
            'Asset status changed from ' || OLD.status || ' to ' || NEW.status,
            jsonb_build_object('status', OLD.status),
            jsonb_build_object('status', NEW.status),
            NEW.updated_by,
            NEW.organization_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER asset_lifecycle_logging_trigger
    AFTER UPDATE ON assets
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION log_asset_lifecycle_event();
```

## UI Integration

- **Primary Screens**:
  - **Asset Inventory** for comprehensive asset listing
  - **Asset Dashboard** for metrics and overview
  - **Asset Form** for detailed asset management
  - **Classification Wizard** for asset classification
  - **Dependency Mapper** for visualizing relationships
  - **Data Flow Diagram** for data flow visualization
  - **Lifecycle Timeline** for asset history
  - **Maintenance Calendar** for scheduled maintenance
  - **Disposal Tracker** for decommissioning

- **Integration Points**:
  - Risk management for asset risks
  - Vulnerability management integration
  - Incident management for asset incidents
  - Change management for asset changes
  - CMDB integration for configuration
  - Cost management for TCO tracking
  - Compliance mapping for requirements
  - Business continuity for critical assets

## Asset Management Features

1. **Discovery and Inventory**:
   - Automated discovery integration
   - Manual asset registration
   - Bulk import capabilities
   - Regular inventory reconciliation

2. **Relationship Mapping**:
   - Visual dependency mapping
   - Impact analysis tools
   - Critical path identification
   - Single point of failure detection

3. **Lifecycle Management**:
   - Automated lifecycle transitions
   - Maintenance scheduling
   - End-of-life planning
   - Disposal compliance

4. **Integration Capabilities**:
   - CMDB synchronization
   - Vulnerability scanner integration
   - Monitoring tool integration
   - Financial system integration