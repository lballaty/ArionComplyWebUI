# ArionComply Database Schema Design Principles

*Version 1.0 - Initial Release*  
*Last Updated: August 22, 2025*

## Overview

This document establishes the architectural principles and design patterns for the ArionComply database schema. These principles guide the creation and evolution of our hybrid relational/JSONB data model, ensuring consistency, performance, and flexibility while supporting our AI-driven compliance platform architecture.

## Core Architectural Philosophy

### 1. Hybrid Relational & JSONB Model

We adopt a **moderate hybrid approach** that balances data integrity with flexibility:

**Use Relational Structures For:**
- Core compliance entities (organizations, users, policies, controls, frameworks)
- Critical audit trails and compliance relationships
- Data requiring strict referential integrity
- Frequently queried relationships and joins
- Regulatory data with fixed structures

**Use JSONB For:**
- User-configurable custom fields (both org-specific and framework-specific)
- Dynamic metadata and configuration settings
- Integration configurations and transformation rules
- AI processing metadata (LLM interaction context, retrieval signals)
- Variable content structures (notification templates, assessment questionnaires)
- Framework-specific extensions and variations

### 2. Explicit Relationships Over Polymorphic Associations

**Principle:** Maintain database-level referential integrity through explicit foreign key relationships. Polymorphic relationships should only be used when explicit alternatives are truly impractical.

### When Polymorphic Relationships Are Justified

**Polymorphic relationships are acceptable ONLY when ALL of the following are true:**

1. **Truly Generic Behavior**: The relationship represents genuinely generic functionality (like comments, attachments, or audit logs) that applies uniformly across many diverse entity types
2. **Unbounded Entity Set**: The number of related entity types is unbounded or changes frequently at runtime
3. **Identical Interface**: All related entities expose identical interfaces/behaviors for the relationship
4. **Performance Acceptable**: Query performance impact is acceptable for the use case

**Example of justified polymorphic use:**
```sql
-- Audit logs can apply to ANY entity in the system
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL, -- 'policy', 'control', 'risk', etc.
    entity_id UUID NOT NULL,
    action_type VARCHAR(100),
    -- ... other fields
);

-- This is justified because:
-- 1. Auditing is truly generic across all entities
-- 2. New auditable entities are added frequently
-- 3. All entities have identical audit behavior
-- 4. Query performance is acceptable for audit use cases
```

### Explicit Alternatives to Consider First

**Before choosing polymorphic, evaluate these patterns:**

#### 1. **Multiple Explicit Foreign Keys (Preferred)**
```sql
-- Instead of polymorphic "attachments" table
-- BAD: Polymorphic approach
CREATE TABLE attachments_bad (
    id UUID PRIMARY KEY,
    entity_type VARCHAR(50), -- 'policy', 'incident', 'control'
    entity_id UUID,         -- No referential integrity!
    file_path TEXT
);

-- GOOD: Explicit foreign keys
CREATE TABLE attachments_good (
    id UUID PRIMARY KEY,
    policy_id UUID REFERENCES policies(id),
    incident_id UUID REFERENCES incidents(id),
    control_id UUID REFERENCES controls(id),
    file_path TEXT,
    
    -- Ensure exactly one parent is specified
    CHECK (
        (policy_id IS NOT NULL)::int + 
        (incident_id IS NOT NULL)::int + 
        (control_id IS NOT NULL)::int = 1
    )
);

-- Benefits: Database referential integrity, better query performance, clearer schema
```

#### 2. **Junction Tables for Known Relationships**
```sql
-- Instead of polymorphic "entity_tags"
-- GOOD: Explicit junction tables
CREATE TABLE policy_tags (
    policy_id UUID REFERENCES policies(id),
    tag_id UUID REFERENCES tags(id),
    PRIMARY KEY (policy_id, tag_id)
);

CREATE TABLE incident_tags (
    incident_id UUID REFERENCES incidents(id), 
    tag_id UUID REFERENCES tags(id),
    PRIMARY KEY (incident_id, tag_id)
);

-- Benefits: Optimal performance, referential integrity, clear relationships
```

#### 3. **Inheritance/Table-per-Type Pattern**
```sql
-- Instead of polymorphic "assessments" 
-- GOOD: Inheritance pattern
CREATE TABLE assessments (
    id UUID PRIMARY KEY,
    assessment_name VARCHAR(255),
    -- Common fields
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY REFERENCES assessments(id),
    risk_methodology VARCHAR(100),
    -- Risk-specific fields
);

CREATE TABLE privacy_assessments (
    id UUID PRIMARY KEY REFERENCES assessments(id), 
    pia_template_id UUID,
    -- Privacy-specific fields
);

-- Benefits: Type safety, specific validation, clear domain separation
```

#### 4. **JSONB for Flexible Metadata (Our Hybrid Approach)**
```sql
-- Use JSONB for variable content while maintaining explicit relationships
CREATE TABLE control_implementations (
    id UUID PRIMARY KEY,
    control_id UUID REFERENCES controls(id), -- Explicit relationship
    policy_id UUID REFERENCES policies(id),  -- Explicit relationship
    
    -- Flexible implementation details
    implementation_details JSONB, -- Variable content here, not relationships
    
    status implementation_status_enum
);

-- Benefits: Flexibility where needed, explicit relationships for integrity
```

### Performance Impact Analysis

**Polymorphic relationships impose several performance penalties:**

1. **No Database-Level Optimization**: Query planner cannot optimize joins effectively
2. **Full Table Scans**: Often require scanning entire polymorphic table to find related records
3. **No Referential Integrity**: Orphaned records and data inconsistency issues
4. **Complex Query Logic**: Application must handle type checking and casting

**Example performance comparison:**
```sql
-- Polymorphic query (SLOW)
SELECT p.*, a.file_path 
FROM policies p
JOIN attachments_bad a ON a.entity_type = 'policy' AND a.entity_id = p.id;

-- Explicit query (FAST) 
SELECT p.*, a.file_path
FROM policies p  
JOIN attachments_good a ON a.policy_id = p.id; -- Direct foreign key join
```

### Implementation Guidelines

**When you encounter a potential polymorphic relationship:**

1. **Question the Need**: Can this be solved with explicit relationships?
2. **Count the Types**: If you can enumerate the entity types, use explicit FKs
3. **Analyze Behavior**: Do all entities really behave identically for this relationship?
4. **Performance Test**: If polymorphic is chosen, benchmark against alternatives
5. **Document Justification**: Explicitly document why polymorphic was chosen

**Code review checklist:**
- [ ] Are all related entity types truly unlimited/unbounded?
- [ ] Do all entities have identical behavior for this relationship? 
- [ ] Would explicit foreign keys create excessive maintenance burden?
- [ ] Is query performance acceptable with expected data volumes?
- [ ] Is the polymorphic relationship properly indexed?

**Remember:** Explicit relationships with JSONB flexible content (our hybrid approach) can often provide both performance and flexibility without polymorphic complexity.

### 3. Asynchronous & Decoupled Integrations

**Principle:** Separate integration configuration from execution, supporting both synchronous and asynchronous processing patterns.

**Integration Patterns:**
- **Synchronous:** Quick operations (connection tests, small data pulls) ≤ 1.5s
- **Asynchronous:** Bulk operations (framework imports, compliance scans) with job queuing
- **Mixed:** User-initiated actions sync, bulk processing async

## Standardized ENUM Types vs. Lookup Tables

**Strategic approach balancing performance with flexibility:**

### Design Decision Framework

**Explicit criteria for choosing between ENUMs and lookup tables:**

**Use ENUMs for:**
- **Core, non-evolving concepts** that are architecturally stable
- **System-level statuses** that rarely change
- **Performance-critical** frequently queried fields
- **Cross-organizational** standard concepts

**Use Lookup Tables for:**
- **Dynamic, customer-facing lists** that evolve frequently
- **Domain-specific, regulatory concepts** that vary by jurisdiction  
- **User-configurable options** that organizations customize
- **Integration-driven** values from external systems

### Core ENUMs (Keep - Stable and Performance Critical)
```sql
-- These are unlikely to change and provide excellent performance/integrity
CREATE TYPE record_status_enum AS ENUM (
    'active', 'inactive', 'draft', 'archived', 'deprecated', 'suspended'
);

CREATE TYPE approval_status_enum AS ENUM (
    'pending', 'in_review', 'approved', 'rejected', 'expired', 'withdrawn'
);

CREATE TYPE priority_enum AS ENUM (
    'emergency', 'critical', 'high', 'medium', 'low'
);

CREATE TYPE risk_level_enum AS ENUM (
    'critical', 'high', 'medium', 'low', 'negligible'
);

CREATE TYPE audit_level_enum AS ENUM (
    'full_snapshot', 'metadata_only', 'delta_only', 'reference_only'
);
```

### Dynamic Lookup Tables (Use for Evolving Domains)
```sql
-- Flexible lookup system for rapidly changing or domain-specific values
CREATE TABLE lookup_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_name TEXT NOT NULL, -- e.g., 'incident_types', 'verification_methods'
    value TEXT NOT NULL,     -- Internal key value
    label TEXT NOT NULL,     -- Display label
    description TEXT,        -- Detailed description
    display_order INTEGER,   -- For UI ordering
    is_active BOOLEAN DEFAULT true,
    effective_date DATE,     -- When option becomes available
    deprecated_date DATE,    -- When option is phased out
    
    -- Multi-tenant support
    organization_id UUID REFERENCES organizations(id), -- NULL for system-wide options
    
    -- Standard audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(list_name, value, organization_id)
);

-- Index for efficient lookups
CREATE INDEX idx_lookup_options_list_active ON lookup_options (list_name, is_active)
WHERE is_active = true;
```

**Usage pattern for evolving domains:**
```sql
-- Instead of rigid incident_type_enum, use flexible lookup
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_name TEXT NOT NULL,
    incident_type_id UUID REFERENCES lookup_options(id), -- Dynamic types
    severity risk_level_enum, -- Stable enum
    priority priority_enum,   -- Stable enum
    status record_status_enum DEFAULT 'active', -- Stable enum
    -- ... other fields
);
```

## AI Metadata JSON Schema

**Enhanced structure for `ai_metadata` JSONB field with stricter validation:**

```json
{
  "$schema": "https://json-schema.org/draft/07/schema#",
  "title": "AI Metadata Schema",
  "type": "object",
  "properties": {
    "generated_by_ai": {
      "type": "boolean",
      "description": "Indicates if content was generated by AI"
    },
    "llm_interaction_id": {
      "type": "string",
      "format": "uuid",
      "description": "Reference to LLM interaction that generated content"
    },
    "source_record_id": {
      "type": "string", 
      "format": "uuid",
      "description": "ID of source record that triggered AI interaction"
    },
    "source_table": {
      "type": "string",
      "description": "Table name of source record"
    },
    "confidence_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "AI confidence in generated content (0-1)"
    },
    "model_version": {
      "type": "string",
      "description": "Version of AI model used"
    },
    "generation_timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "When content was generated"
    },
    "human_reviewed": {
      "type": "boolean",
      "description": "Whether content has been human-reviewed"
    },
    "review_timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "When content was last reviewed"
    },
    "reviewed_by": {
      "type": "string",
      "format": "uuid",
      "description": "User ID who reviewed the content"
    },
    "modification_history": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "timestamp": {"type": "string", "format": "date-time"},
          "modified_by": {"type": "string", "format": "uuid"},
          "modification_type": {"type": "string", "enum": ["ai_generated", "human_edited", "human_approved"]},
          "changes_summary": {"type": "string"}
        },
        "required": ["timestamp", "modified_by", "modification_type"]
      }
    },
    "retrieval_context": {
      "type": "object",
      "description": "Standardized context used for AI retrieval/generation",
      "properties": {
        "query": {"type": "string"},
        "evidence_cards_used": {
          "type": "array", 
          "items": {"type": "string", "format": "uuid"}
        },
        "confidence_signals": {
          "type": "object",
          "properties": {
            "relevance_score": {"type": "number", "minimum": 0, "maximum": 1},
            "source_authority": {"type": "number", "minimum": 0, "maximum": 1},
            "freshness_score": {"type": "number", "minimum": 0, "maximum": 1}
          }
        },
        "graph_paths": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "path": {"type": "array", "items": {"type": "string"}},
              "weight": {"type": "number"}
            }
          }
        }
      }
    }
  },
  "required": ["generated_by_ai"],
  "allOf": [
    {
      "if": {
        "properties": {"generated_by_ai": {"const": true}}
      },
      "then": {
        "required": ["llm_interaction_id", "generation_timestamp", "model_version"]
      }
    }
  ],
  "additionalProperties": false
}
```

**Implementation example:**
```sql
-- Constraint to validate ai_metadata structure
ALTER TABLE policies ADD CONSTRAINT valid_ai_metadata 
CHECK (
    ai_metadata @> '{"generated_by_ai": false}'::jsonb OR 
    ai_metadata @> '{"generated_by_ai": true}'::jsonb
);

-- Index for querying AI-generated content
CREATE INDEX idx_ai_generated_content ON policies 
USING GIN ((ai_metadata->'generated_by_ai')) 
WHERE (ai_metadata->>'generated_by_ai')::boolean = true;
```

### 1. Table Naming Conventions

```sql
-- Core entity tables (singular)
organizations
users
policies
controls
frameworks

-- Relationship/junction tables (descriptive)
policy_control_mappings
user_role_assignments
framework_versions

-- Configuration tables (plural with context)
integration_configs
notification_templates
custom_field_definitions

-- Processing/audit tables (descriptive action)
integration_executions
audit_traces
change_approvals
```

### 2. Standard Column Patterns

**All tables must include:**
```sql
-- Primary key (UUID for distributed system benefits)
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

-- Organization scoping (multi-tenant)
organization_id UUID REFERENCES organizations(id),

-- Audit trail (mandatory with time zone support)
created_by UUID REFERENCES users(id),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_by UUID REFERENCES users(id),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

**Additional common patterns:**
```sql
-- Status tracking with ENUM for data integrity
status record_status_enum DEFAULT 'active',

-- Soft delete support with time zone awareness
deleted_at TIMESTAMPTZ,
deleted_by UUID REFERENCES users(id),

-- Version control
version INTEGER DEFAULT 1,

-- AI integration metadata (structured schema - see AI Metadata section)
ai_metadata JSONB DEFAULT '{"generated_by_ai": false}'::jsonb
```

### 3. JSONB Usage Patterns

**Configuration Pattern with integration payload snapshots:**
```sql
-- Integration configurations
connection_config JSONB NOT NULL,
field_mappings JSONB,
transformation_rules JSONB,

-- With supporting indexes
CREATE INDEX idx_integration_type 
ON integration_configs USING GIN ((connection_config->'type'));

-- Integration executions with full payload audit trail
CREATE TABLE integration_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_id UUID REFERENCES integration_configs(id),
    execution_start TIMESTAMPTZ DEFAULT NOW(),
    execution_end TIMESTAMPTZ,
    status execution_status_enum DEFAULT 'scheduled',
    records_processed INTEGER DEFAULT 0,
    
    -- Full request/response for debugging and audit (your excellent suggestion)
    request_payload JSONB,
    response_payload JSONB,
    
    -- Execution details and errors
    execution_details JSONB,
    error_details JSONB,
    
    organization_id UUID REFERENCES organizations(id)
);
```

**Custom Fields Pattern:**
```sql
-- Framework-specific extensions
framework_extensions JSONB DEFAULT '{}',
custom_fields JSONB DEFAULT '{}',

-- With validation constraints
CONSTRAINT valid_custom_fields 
CHECK (jsonb_typeof(custom_fields) = 'object')
```

**AI Processing Pattern:**
```sql
-- LLM interaction context
llm_context JSONB,
retrieval_metadata JSONB,
confidence_signals JSONB,

-- Performance-optimized for retrieval pipeline
CREATE INDEX idx_confidence_score 
ON evidence_cards USING GIN ((retrieval_metadata->'confidence'));
```

## Framework Evolution Strategy

### 1. Framework Versioning

**Support multiple framework versions simultaneously:**
```sql
CREATE TABLE framework_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    framework_id UUID REFERENCES frameworks(id),
    version_number VARCHAR(20) NOT NULL,
    effective_date DATE,
    deprecated_date DATE,
    
    -- Framework-specific schema and migration rules
    version_schema JSONB,
    migration_rules JSONB,
    
    -- Standard audit fields
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Cross-Framework Mapping and Versioning

**Comprehensive system for managing equivalency mappings between frameworks**

### 1. Framework Mapping Tables

```sql
-- Cross-framework control mappings with versioning
CREATE TABLE cross_framework_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source framework control
    source_framework_version_id UUID REFERENCES framework_versions(id),
    source_control_id UUID REFERENCES controls(id),
    
    -- Target framework control  
    target_framework_version_id UUID REFERENCES framework_versions(id),
    target_control_id UUID REFERENCES controls(id),
    
    -- Relationship metadata
    relationship_type ENUM('equivalent', 'overlaps', 'partially_covers', 'extends', 'superseded_by'),
    coverage_percentage DECIMAL(5,2), -- How much of source is covered by target
    mapping_confidence ENUM('high', 'medium', 'low'), -- Confidence in mapping accuracy
    
    -- Versioning for mappings themselves
    version_number VARCHAR(20) NOT NULL,
    effective_date DATE,
    superseded_date DATE,
    
    -- Mapping metadata
    mapping_notes TEXT,
    validation_evidence TEXT[], -- References to validation sources
    created_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    review_date DATE,
    
    -- Standard audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate mappings for same version
    UNIQUE(source_framework_version_id, source_control_id, target_framework_version_id, target_control_id, version_number)
);

-- Mapping evolution history
CREATE TABLE mapping_change_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mapping_id UUID REFERENCES cross_framework_mappings(id),
    
    -- What changed
    change_type ENUM('created', 'relationship_updated', 'coverage_changed', 'superseded', 'validated'),
    previous_values JSONB,
    new_values JSONB,
    change_reason TEXT,
    
    -- Change metadata
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    approval_required BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approval_date DATE
);
```

### 2. Framework Evolution Management

```sql
-- Framework migration tracking
CREATE TABLE framework_migrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source and target versions
    from_framework_version_id UUID REFERENCES framework_versions(id),
    to_framework_version_id UUID REFERENCES framework_versions(id),
    
    -- Migration metadata
    migration_name VARCHAR(255),
    migration_type ENUM('major_update', 'minor_update', 'correction', 'harmonization'),
    migration_status ENUM('planned', 'in_progress', 'testing', 'completed', 'rolled_back'),
    
    -- Migration rules and scripts
    migration_rules JSONB, -- Structured migration instructions
    rollback_rules JSONB,  -- How to undo the migration
    
    -- Control mapping changes
    controls_added UUID[], -- New controls in target version
    controls_removed UUID[], -- Controls removed from source
    controls_modified JSONB, -- Modified control mappings
    
    -- Impact assessment
    organizations_affected INTEGER,
    estimated_effort_hours INTEGER,
    migration_deadline DATE,
    
    -- Execution tracking
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    executed_by UUID REFERENCES users(id),
    
    -- Standard fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track organization-specific migration progress
CREATE TABLE organization_migration_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    migration_id UUID REFERENCES framework_migrations(id),
    
    -- Progress tracking
    migration_status ENUM('not_started', 'planning', 'executing', 'testing', 'completed', 'deferred'),
    progress_percentage DECIMAL(5,2),
    
    -- Organization-specific considerations
    custom_mapping_rules JSONB, -- Org-specific mapping overrides
    migration_notes TEXT,
    risk_assessment TEXT,
    
    -- Timeline
    planned_start_date DATE,
    actual_start_date DATE,
    planned_completion_date DATE,
    actual_completion_date DATE,
    
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(organization_id, migration_id)
);
```

### 3. Mapping Validation and Quality

```sql
-- Mapping validation rules
CREATE TABLE mapping_validation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Rule definition
    rule_name VARCHAR(255),
    rule_description TEXT,
    validation_query TEXT, -- SQL query to validate mappings
    
    -- Rule metadata
    rule_severity ENUM('error', 'warning', 'info'),
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mapping validation results
CREATE TABLE mapping_validation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mapping_id UUID REFERENCES cross_framework_mappings(id),
    validation_rule_id UUID REFERENCES mapping_validation_rules(id),
    
    -- Validation outcome
    validation_status ENUM('pass', 'fail', 'warning'),
    validation_message TEXT,
    validation_data JSONB, -- Additional validation details
    
    -- Resolution tracking
    resolution_status ENUM('open', 'acknowledged', 'resolved', 'accepted_risk'),
    resolution_notes TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    
    validated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Compliance Time Travel

**Query mappings as they existed at any point in time:**
```sql
-- Function to get effective mappings at a specific date
CREATE OR REPLACE FUNCTION get_mappings_at_date(
    source_framework_id UUID,
    target_framework_id UUID,
    as_of_date DATE
) RETURNS TABLE (
    mapping_id UUID,
    source_control_id UUID,
    target_control_id UUID,
    relationship_type TEXT,
    coverage_percentage DECIMAL
) AS $
BEGIN
    RETURN QUERY
    SELECT 
        cfm.id,
        cfm.source_control_id,
        cfm.target_control_id,
        cfm.relationship_type::TEXT,
        cfm.coverage_percentage
    FROM cross_framework_mappings cfm
    JOIN framework_versions fv_source ON cfm.source_framework_version_id = fv_source.id
    JOIN framework_versions fv_target ON cfm.target_framework_version_id = fv_target.id
    WHERE fv_source.framework_id = source_framework_id
    AND fv_target.framework_id = target_framework_id
    AND cfm.effective_date <= as_of_date
    AND (cfm.superseded_date IS NULL OR cfm.superseded_date > as_of_date);
END;
$ LANGUAGE plpgsql;
```

## Soft Delete and Recovery Patterns

### 1. Universal Soft Delete with RLS Protection

**Pattern for all critical entities:**
```sql
-- Soft delete columns with time zone awareness
deleted_at TIMESTAMPTZ,
deleted_by UUID REFERENCES users(id),
deletion_reason TEXT,

-- Recovery tracking
recovery_deadline TIMESTAMPTZ,
approved_for_hard_delete BOOLEAN DEFAULT FALSE,
hard_delete_scheduled_at TIMESTAMPTZ
```

**CRITICAL: Prevent Query Drift with Row-Level Security**

To eliminate the risk of developers forgetting `WHERE deleted_at IS NULL` clauses, implement RLS policies that automatically filter deleted records:

```sql
-- Enable RLS on all tables with soft delete
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- Default policy: Hide deleted records from normal operations
CREATE POLICY "hide_deleted_records" ON policies
    FOR ALL
    USING (deleted_at IS NULL);

-- Admin policy: Allow system administrators to see deleted records
CREATE POLICY "admin_see_deleted_records" ON policies
    FOR ALL
    TO admin_role
    USING (true);

-- Recovery policy: Allow authorized users to access deleted records for recovery
CREATE POLICY "recovery_access_deleted_records" ON policies
    FOR SELECT
    TO recovery_role
    USING (
        deleted_at IS NOT NULL 
        AND recovery_deadline > NOW()
        AND approved_for_hard_delete = FALSE
    );

-- Audit policy: Allow auditors to see all records including deleted
CREATE POLICY "audit_access_all_records" ON policies
    FOR SELECT
    TO auditor_role
    USING (true);
```

**Role-based access for soft delete management:**
```sql
-- Create specialized roles for soft delete management
CREATE ROLE standard_user;
CREATE ROLE recovery_specialist;
CREATE ROLE system_administrator;
CREATE ROLE compliance_auditor;

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON policies TO standard_user;
GRANT ALL ON policies TO recovery_specialist;
GRANT ALL ON policies TO system_administrator;
GRANT SELECT ON policies TO compliance_auditor;
```

**Implementation pattern for all soft-deletable tables:**
```sql
-- Template for implementing soft delete with RLS
CREATE OR REPLACE FUNCTION setup_soft_delete_rls(table_name TEXT)
RETURNS VOID AS $
BEGIN
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    
    -- Create default policy to hide deleted records
    EXECUTE format('
        CREATE POLICY "hide_deleted_%I" ON %I
        FOR ALL
        USING (deleted_at IS NULL)', 
        table_name, table_name);
    
    -- Create admin policy for full access
    EXECUTE format('
        CREATE POLICY "admin_access_%I" ON %I
        FOR ALL
        TO system_administrator
        USING (true)', 
        table_name, table_name);
    
    -- Create recovery policy
    EXECUTE format('
        CREATE POLICY "recovery_access_%I" ON %I
        FOR SELECT
        TO recovery_specialist
        USING (
            deleted_at IS NOT NULL 
            AND recovery_deadline > NOW()
            AND approved_for_hard_delete = FALSE
        )', 
        table_name, table_name);
        
    -- Create audit policy
    EXECUTE format('
        CREATE POLICY "audit_access_%I" ON %I
        FOR SELECT
        TO compliance_auditor
        USING (true)', 
        table_name, table_name);
END;
$ LANGUAGE plpgsql;

-- Apply to all compliance tables
SELECT setup_soft_delete_rls('policies');
SELECT setup_soft_delete_rls('controls');
SELECT setup_soft_delete_rls('risks');
-- ... apply to all critical tables
```

**Benefits of RLS approach:**
- **Zero query drift risk**: Deleted records automatically filtered
- **Role-based access**: Different user types see appropriate data
- **Compliance-ready**: Auditors can access all records when needed
- **Recovery workflow**: Specialized roles for data recovery processes
- **Performance**: Database-level filtering is highly optimized

### 2. Comprehensive Deletion Audit

**Central deletion tracking:**
```sql
CREATE TABLE deletion_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    
    -- Complete record snapshot
    deleted_data JSONB NOT NULL,
    deletion_metadata JSONB,
    
    -- Deletion workflow
    deletion_reason TEXT,
    deleted_by UUID REFERENCES users(id),
    deleted_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Recovery management
    recovery_deadline TIMESTAMPTZ,
    recovered_at TIMESTAMPTZ,
    recovered_by UUID REFERENCES users(id),
    
    -- Hard delete approval
    approved_for_hard_delete BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approval_date TIMESTAMPTZ,
    hard_delete_scheduled_at TIMESTAMPTZ
);
```

## Multi-Tenant Security with Row-Level Security

**MANDATORY: Explicit RLS policies for all tables to ensure tenant isolation**

### 1. Core RLS Implementation

**Every table must implement organization-scoped RLS:**
```sql
-- Template for multi-tenant RLS setup
CREATE OR REPLACE FUNCTION setup_tenant_isolation(table_name TEXT)
RETURNS VOID AS $
BEGIN
    -- Enable RLS
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
    
    -- Core tenant isolation policy
    EXECUTE format('
        CREATE POLICY "tenant_isolation_%I" ON %I
        FOR ALL
        USING (
            organization_id = current_setting(''app.current_organization_id'')::UUID
        )', 
        table_name, table_name);
    
    -- System administrator bypass (for platform management)
    EXECUTE format('
        CREATE POLICY "system_admin_bypass_%I" ON %I
        FOR ALL
        TO system_administrator
        USING (true)', 
        table_name, table_name);
    
    -- Compliance auditor read access (cross-tenant for audit purposes)
    EXECUTE format('
        CREATE POLICY "audit_read_access_%I" ON %I
        FOR SELECT
        TO compliance_auditor
        USING (true)', 
        table_name, table_name);
END;
$ LANGUAGE plpgsql;
```

### 2. Shared Reference Data Handling

**Framework for handling shared standards and reference data:**
```sql
-- Shared reference data policy (e.g., ISO frameworks, regulatory standards)
CREATE POLICY "shared_reference_data" ON regulatory_frameworks
    FOR SELECT
    USING (
        organization_id IS NULL OR -- System-wide standards
        organization_id = current_setting('app.current_organization_id')::UUID -- Org-specific
    );

-- Organization-specific data policy  
CREATE POLICY "org_specific_data" ON regulatory_frameworks
    FOR INSERT, UPDATE, DELETE
    USING (
        organization_id = current_setting('app.current_organization_id')::UUID
    );
```

### 3. Edge Function Integration

**Setting tenant context in edge functions:**
```javascript
// Example edge function with tenant context
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    // Extract organization from JWT or request
    const organizationId = req.user.organization_id
    
    // Set tenant context for RLS
    await supabase.rpc('set_config', {
        setting_name: 'app.current_organization_id',
        setting_value: organizationId,
        is_local: true
    })
    
    // All subsequent queries are automatically tenant-scoped
    const { data } = await supabase
        .from('policies')
        .select('*') // Automatically filtered to organization
    
    return res.json(data)
}
```

### 4. Row-Level Encryption for Sensitive Data

**Additional security layer for highly sensitive compliance data:**
```sql
-- Example using PostgreSQL's pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypted sensitive fields
ALTER TABLE incidents ADD COLUMN encrypted_details BYTEA;

-- Encryption/decryption functions
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS BYTEA AS $
BEGIN
    RETURN pgp_sym_encrypt(data, current_setting('app.encryption_key'));
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data BYTEA)
RETURNS TEXT AS $
BEGIN
    RETURN pgp_sym_decrypt(encrypted_data, current_setting('app.encryption_key'));
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Enhanced AI Integration Architecture

**Optimized for deterministic retrieval with comprehensive audit trails**

### 1. Consolidated AI Metadata Management

**Centralized confidence scoring to prevent duplication:**
```sql
-- Keep primary AI metadata in llm_interactions table
-- Reference from other tables to maintain single source of truth

-- Enhanced LLM interactions with comprehensive context
CREATE TABLE llm_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID,
    interaction_type VARCHAR(50),
    
    -- Source traceability (consolidated approach)
    source_record_id UUID,
    source_table VARCHAR(100),
    
    -- AI processing metadata
    model_version TEXT,
    processing_time_ms INTEGER,
    confidence_score DECIMAL(3,2), -- PRIMARY confidence score location
    
    -- Context and processing
    input_context JSONB,
    output_metadata JSONB,
    processing_signals JSONB,
    
    -- Full payload for audit and debugging
    request_payload JSONB,
    response_payload JSONB,
    
    -- Human oversight
    human_reviewed BOOLEAN DEFAULT FALSE,
    reviewed_by UUID REFERENCES users(id),
    review_timestamp TIMESTAMPTZ,
    review_notes TEXT,
    
    -- Standard fields
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Simplified AI metadata in content tables (reference-based)
-- Use this pattern in policies, controls, etc.
ai_metadata JSONB DEFAULT '{
    "generated_by_ai": false,
    "llm_interaction_id": null,
    "last_ai_update": null
}'::jsonb
```

### 2. Edge Function Optimization

**Optimize for edge function performance with materialized views:**
```sql
-- Pre-computed view for evidence card retrieval (updated via refresh strategy)
CREATE MATERIALIZED VIEW evidence_cards_optimized AS
SELECT 
    ec.id,
    ec.title,
    ec.card_type,
    ec.confidence_score,
    ec.retrieval_metadata->'signals' as key_signals,
    ec.organization_id,
    ec.created_at,
    -- Join AI interaction data for complete context
    li.model_version,
    li.processing_signals,
    li.human_reviewed
FROM evidence_cards ec
LEFT JOIN llm_interactions li ON (ec.ai_metadata->>'llm_interaction_id')::UUID = li.id
WHERE ec.deleted_at IS NULL
AND ec.status = 'active';

-- Refresh strategy for real-time compliance needs
CREATE OR REPLACE FUNCTION refresh_evidence_cards_optimized()
RETURNS VOID AS $
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY evidence_cards_optimized;
END;
$ LANGUAGE plpgsql;

-- Event-driven refresh for critical updates
CREATE OR REPLACE FUNCTION trigger_evidence_refresh()
RETURNS TRIGGER AS $
BEGIN
    -- Refresh immediately for critical changes, queue for routine changes
    IF TG_TABLE_NAME = 'evidence_cards' AND (
        OLD.confidence_score IS DISTINCT FROM NEW.confidence_score OR
        OLD.status IS DISTINCT FROM NEW.status
    ) THEN
        PERFORM refresh_evidence_cards_optimized();
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Apply to critical tables
CREATE TRIGGER evidence_cards_refresh_trigger
    AFTER UPDATE ON evidence_cards
    FOR EACH ROW
    EXECUTE FUNCTION trigger_evidence_refresh();
```

### 3. Advanced JSONB Validation

**Database-level JSON Schema validation with PostgreSQL extensions:**
```sql
-- Install JSON Schema validation extension (if available)
-- CREATE EXTENSION IF NOT EXISTS json_schema;

-- Enhanced validation with comprehensive schema checking
CREATE OR REPLACE FUNCTION validate_ai_metadata_comprehensive()
RETURNS TRIGGER AS $
DECLARE
    schema_valid BOOLEAN;
BEGIN
    -- Basic structure validation
    IF NOT jsonb_typeof(NEW.ai_metadata) = 'object' THEN
        RAISE EXCEPTION 'ai_metadata must be a valid JSON object';
    END IF;
    
    -- Required fields validation
    IF NEW.ai_metadata->>'generated_by_ai' = 'true' THEN
        IF NOT (
            NEW.ai_metadata ? 'llm_interaction_id' AND
            NEW.ai_metadata ? 'last_ai_update'
        ) THEN
            RAISE EXCEPTION 'AI-generated content requires llm_interaction_id and last_ai_update';
        END IF;
        
        -- Validate llm_interaction_id exists
        IF NOT EXISTS (
            SELECT 1 FROM llm_interactions 
            WHERE id = (NEW.ai_metadata->>'llm_interaction_id')::UUID
        ) THEN
            RAISE EXCEPTION 'llm_interaction_id must reference valid interaction';
        END IF;
    END IF;
    
    -- Validate timestamp format
    IF NEW.ai_metadata ? 'last_ai_update' THEN
        BEGIN
            PERFORM (NEW.ai_metadata->>'last_ai_update')::TIMESTAMPTZ;
        EXCEPTION WHEN OTHERS THEN
            RAISE EXCEPTION 'last_ai_update must be valid timestamp';
        END;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Apply comprehensive validation to all AI-enabled tables
CREATE TRIGGER validate_policies_ai_metadata
    BEFORE INSERT OR UPDATE ON policies
    FOR EACH ROW
    EXECUTE FUNCTION validate_ai_metadata_comprehensive();
```

### 4. Integration with Retrieval Pipeline

**Support for ArionComply's deterministic retrieval architecture:**
```sql
-- Retrieval context optimization
CREATE TABLE retrieval_contexts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Query context
    original_query TEXT,
    processed_query TEXT,
    query_intent ENUM('factual', 'procedural', 'comparative', 'analytical'),
    
    -- Evidence retrieval
    evidence_cards_used UUID[], -- Array of evidence card IDs
    retrieval_method ENUM('bm25', 'e_pmi', 'graph_probe', 'hybrid'),
    confidence_bands JSONB, -- Confidence band information
    
    -- Graph traversal data
    graph_paths JSONB, -- Serialized graph paths used
    relationship_weights JSONB, -- Edge weights in graph traversal
    
    -- Performance metrics
    retrieval_time_ms INTEGER,
    total_processing_time_ms INTEGER,
    
    -- Results metadata
    result_count INTEGER,
    fallback_triggered BOOLEAN DEFAULT FALSE,
    fallback_method VARCHAR(50),
    
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link retrieval contexts to LLM interactions
ALTER TABLE llm_interactions 
ADD COLUMN retrieval_context_id UUID REFERENCES retrieval_contexts(id);
```

## Performance Considerations

### 1. JSONB Indexing Strategy

```sql
-- Improved naming convention: include table name for clarity
CREATE INDEX idx_integration_configs_type ON integration_configs 
USING GIN ((connection_config->'type'));

CREATE INDEX idx_policies_custom_fields_search ON policies 
USING GIN (custom_fields);

-- Advanced JSONB indexing for specific query patterns
CREATE INDEX idx_policies_custom_fields_path_ops ON policies
USING GIN (custom_fields jsonb_path_ops);

-- Use jsonb_path_ops for containment queries (@>, ?, ?&, ?|)
-- Use standard GIN for full-text and existence queries

-- Partial indexes for active records with improved naming
CREATE INDEX idx_integration_configs_active_only ON integration_configs (id) 
WHERE status = 'active' AND deleted_at IS NULL;

-- Example of both index types for different query patterns
CREATE INDEX idx_llm_interactions_context_gin ON llm_interactions
USING GIN (input_context); -- For full JSON queries

CREATE INDEX idx_llm_interactions_context_path_ops ON llm_interactions  
USING GIN (input_context jsonb_path_ops); -- For containment queries
```

### 2. Query Optimization Patterns

**Optimize for common compliance queries:**
```sql
-- Materialized views for complex reporting
CREATE MATERIALIZED VIEW compliance_status_summary AS
SELECT 
    organization_id,
    framework_id,
    COUNT(*) as total_controls,
    COUNT(*) FILTER (WHERE implementation_status = 'implemented') as implemented_controls,
    AVG(confidence_score) as avg_confidence
FROM control_implementations 
WHERE deleted_at IS NULL
GROUP BY organization_id, framework_id;

-- Refresh strategy for real-time needs
CREATE INDEX ON compliance_status_summary (organization_id, framework_id);
```

## Validation and Constraints

### 1. JSONB Schema Validation

**Enhanced validation approach with external schema support:**
```sql
-- Basic constraint for configuration validation
ALTER TABLE integration_configs 
ADD CONSTRAINT valid_connection_config 
CHECK (
    connection_config ? 'type' AND 
    connection_config ? 'endpoint'
);

-- Enhanced AI metadata validation with conditional requirements
ALTER TABLE policies ADD CONSTRAINT valid_ai_metadata_structure 
CHECK (jsonb_typeof(ai_metadata) = 'object');

-- Consider external JSON Schema validation for complex schemas
-- Example using hypothetical json_schema_validate function:
-- ALTER TABLE policies ADD CONSTRAINT valid_ai_metadata_schema
-- CHECK (json_schema_validate(ai_metadata, 'ai_metadata_schema_v1'));

-- For production systems, implement server-side JSON Schema validation
-- using triggers or application-level validation before database insert
```

**Recommended external schema validation approach:**
```sql
-- Function to validate AI metadata against full JSON schema
CREATE OR REPLACE FUNCTION validate_ai_metadata()
RETURNS TRIGGER AS $
BEGIN
    -- Call external validation service or use JSON schema library
    -- This would integrate with your edge functions for validation
    IF NEW.ai_metadata->>'generated_by_ai' = 'true' THEN
        IF NOT (
            NEW.ai_metadata ? 'llm_interaction_id' AND
            NEW.ai_metadata ? 'generation_timestamp' AND
            NEW.ai_metadata ? 'model_version'
        ) THEN
            RAISE EXCEPTION 'AI-generated content requires llm_interaction_id, generation_timestamp, and model_version';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Apply trigger to tables with AI metadata
CREATE TRIGGER validate_ai_metadata_trigger
    BEFORE INSERT OR UPDATE ON policies
    FOR EACH ROW
    EXECUTE FUNCTION validate_ai_metadata();
```

### 2. Business Logic Constraints

**Enforce compliance business rules:**
```sql
-- Framework version consistency
ALTER TABLE controls 
ADD CONSTRAINT valid_framework_version 
CHECK (
    framework_version_id IS NULL OR 
    EXISTS (
        SELECT 1 FROM framework_versions fv 
        WHERE fv.id = framework_version_id 
        AND fv.framework_id = framework_id
    )
);
```

## Migration and Evolution Strategy

### 1. Schema Evolution

**Principles for schema changes:**
- All migrations must be backward compatible
- JSONB field additions/changes don't require migrations
- New relational fields must have defaults or be nullable
- Breaking changes require version-gated feature flags

### 2. Data Migration Patterns

**Framework updates with UUID support:**
```sql
-- Example migration for framework version updates
INSERT INTO framework_versions (framework_id, version_number, version_schema)
SELECT id, '2025.1', 
       jsonb_build_object(
           'schema_version', '1.0',
           'new_controls', array_to_json(ARRAY['A.5.37', 'A.8.35']),
           'deprecated_controls', array_to_json(ARRAY['A.18.1.4']),
           'migration_mapping', jsonb_build_object(
               'A.18.1.4', 'A.5.37'
           )
       )
FROM frameworks WHERE name = 'ISO 27001';
```

## Implementation Guidelines

### 1. Development Workflow

**Schema change process:**
1. Update this design principles document
2. Create migration scripts following patterns
3. Update API documentation
4. Test performance with realistic data volumes
5. Validate with compliance requirements

### 2. Code Integration

**Edge function patterns with UUID support:**
```javascript
// Example integration with schema patterns
const getEvidenceCards = async (query, orgId) => {
  // Leverage JSONB indexes for performance with UUID
  const { data, error } = await supabase
    .from('evidence_cards')
    .select('id, title, confidence_score, retrieval_metadata')
    .eq('organization_id', orgId)
    .is('deleted_at', null)
    .contains('retrieval_metadata', { signals: { relevant: true } })
    .order('confidence_score', { ascending: false })
    .limit(10);
    
  return data;
};

// AI metadata integration
const updateWithAIMetadata = async (table, recordId, aiInteractionId) => {
  const aiMetadata = {
    generated_by_ai: true,
    llm_interaction_id: aiInteractionId,
    generation_timestamp: new Date().toISOString(),
    confidence_score: 0.85
  };
  
  await supabase
    .from(table)
    .update({ 
      ai_metadata: aiMetadata,
      updated_at: new Date().toISOString()
    })
    .eq('id', recordId);
};
```

## Compliance and Audit Requirements

### 1. Regulatory Alignment

**Support for multiple compliance frameworks:**
- All changes must maintain audit trails
- Data retention policies enforced at schema level
- Cross-border data handling considerations
- Right to be forgotten implementation

### 2. Audit Trail Requirements

## Tiered Audit Trail Architecture

**Scalable approach balancing comprehensive auditing with storage efficiency**

### 1. Audit Trail Tiers

**Critical Changes (Full Snapshot):**
```sql
-- Comprehensive audit for compliance-critical changes
CREATE TABLE critical_audit_trails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trace_id UUID, -- Links related actions
    
    -- What happened
    action_type VARCHAR(100),
    entity_table VARCHAR(100),
    entity_id UUID,
    
    -- Complete state snapshots for compliance
    before_state JSONB,
    after_state JSONB,
    change_delta JSONB, -- Computed differences
    
    -- Who and when (with time zone support)
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    session_id UUID,
    
    -- Compliance metadata
    compliance_relevant BOOLEAN DEFAULT TRUE,
    retention_until DATE,
    regulatory_impact TEXT[], -- Which regulations are affected
    
    organization_id UUID REFERENCES organizations(id)
) PARTITION BY RANGE (performed_at);

-- Create partitions for efficient querying and archival
CREATE TABLE critical_audit_trails_2025_q3 PARTITION OF critical_audit_trails
FOR VALUES FROM ('2025-07-01') TO ('2025-10-01');

CREATE TABLE critical_audit_trails_2025_q4 PARTITION OF critical_audit_trails
FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');
```

**Routine Changes (Lightweight):**
```sql
-- Lightweight audit for routine operations
CREATE TABLE routine_audit_trails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trace_id UUID,
    
    -- Basic change information
    action_type VARCHAR(100),
    entity_table VARCHAR(100), 
    entity_id UUID,
    
    -- Key field changes only (not full snapshots)
    changed_fields JSONB, -- {'field_name': {'old': value, 'new': value}}
    
    -- Standard metadata
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    organization_id UUID REFERENCES organizations(id)
) PARTITION BY RANGE (performed_at);
```

### 2. Audit Tier Classification

**Function to determine audit tier:**
```sql
CREATE OR REPLACE FUNCTION determine_audit_tier(
    table_name TEXT, 
    action_type TEXT,
    changed_fields TEXT[]
) RETURNS TEXT AS $
BEGIN
    -- Critical tier for compliance-sensitive tables and actions
    IF table_name IN ('policies', 'controls', 'risk_assessments', 'incidents', 'frameworks') THEN
        RETURN 'critical';
    END IF;
    
    -- Critical tier for sensitive field changes
    IF array_overlap(changed_fields, ARRAY['status', 'approval_status', 'implementation_status']) THEN
        RETURN 'critical';  
    END IF;
    
    -- Critical tier for deletion actions
    IF action_type IN ('DELETE', 'SOFT_DELETE') THEN
        RETURN 'critical';
    END IF;
    
    -- Everything else is routine
    RETURN 'routine';
END;
$ LANGUAGE plpgsql;
```

### 3. Data Lifecycle Management

**Automated archival and retention:**
```sql
-- Archive old audit data to cold storage
CREATE OR REPLACE FUNCTION archive_old_audit_data()
RETURNS VOID AS $
DECLARE
    cutoff_date DATE := CURRENT_DATE - INTERVAL '3 years';
    partition_name TEXT;
BEGIN
    -- Move old partitions to archive schema
    FOR partition_name IN 
        SELECT schemaname || '.' || tablename 
        FROM pg_tables 
        WHERE tablename LIKE 'critical_audit_trails_%'
        AND tablename < format('critical_audit_trails_%s', to_char(cutoff_date, 'YYYY_Q'))
    LOOP
        EXECUTE format('ALTER TABLE %s SET SCHEMA archive', partition_name);
    END LOOP;
END;
$ LANGUAGE plpgsql;

-- Schedule archival (would be called by pg_cron or external scheduler)
-- SELECT cron.schedule('archive-audit-data', '0 2 1 * *', 'SELECT archive_old_audit_data();');
```

### 4. Partition Management

**Automatic partition creation:**
```sql
CREATE OR REPLACE FUNCTION create_audit_partitions(start_date DATE, end_date DATE)
RETURNS VOID AS $
DECLARE
    partition_date DATE := start_date;
    partition_name TEXT;
    next_date DATE;
BEGIN
    WHILE partition_date < end_date LOOP
        -- Create quarterly partitions
        next_date := partition_date + INTERVAL '3 months';
        partition_name := format('critical_audit_trails_%s_q%s', 
                                EXTRACT(year FROM partition_date),
                                EXTRACT(quarter FROM partition_date));
        
        EXECUTE format('CREATE TABLE %I PARTITION OF critical_audit_trails 
                       FOR VALUES FROM (%L) TO (%L)',
                       partition_name, partition_date, next_date);
                       
        -- Create indexes on new partition
        EXECUTE format('CREATE INDEX idx_%I_org_time ON %I (organization_id, performed_at)',
                       partition_name, partition_name);
                       
        partition_date := next_date;
    END LOOP;
END;
$ LANGUAGE plpgsql;
```

## Conclusion

These design principles ensure our database schema supports:

- **Rapid compliance feature development** through strategic JSONB usage
- **Strong data integrity** for audit and regulatory requirements  
- **High performance** for our AI-driven retrieval architecture
- **Flexible evolution** as regulations and frameworks change
- **Multi-jurisdictional compliance** across different legal systems

All schema changes must align with these principles and support our core mission of providing an intelligent, auditable, and flexible compliance management platform.

---

*This document should be updated whenever architectural decisions affect database design patterns. All team members contributing to schema changes must review and follow these principles.*