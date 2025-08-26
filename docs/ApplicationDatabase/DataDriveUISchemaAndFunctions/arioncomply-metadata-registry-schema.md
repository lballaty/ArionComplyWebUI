# ArionComply Metadata Registry Schema

## Introduction

The Metadata Registry is the central repository for all entity definitions in the ArionComply system. It stores information about entity fields, API behaviors, UI rendering specifications, and access control rules. This document details the database schema for the Metadata Registry.

## Database Schema Overview

The Metadata Registry consists of several interrelated tables:

1. **metadata_registry**: The main table containing entity definitions
2. **metadata_versions**: Tracks changes to metadata over time
3. **field_metadata**: Stores detailed information about individual fields

## Main Registry Table

The `metadata_registry` table is the core of the Metadata Registry, containing the high-level definition of each entity in the system.

```sql
CREATE TABLE metadata_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    
    -- Core Schema Definition
    schema_definition JSONB NOT NULL,        -- Fields, types, constraints, validation
    
    -- API Configuration
    api_config JSONB NOT NULL,               -- Endpoints, methods, parameters, responses
    
    -- UI Configuration
    ui_config JSONB NOT NULL,                -- Forms, views, layouts, validations
    
    -- Access Control
    permission_rules JSONB NOT NULL,         -- Field-level and record-level access control
    
    -- Relationships and Dependencies
    relationship_map JSONB DEFAULT '{}',     -- Parent/child, references, dependencies
    
    -- Workflow Integration
    workflow_triggers JSONB DEFAULT '{}',    -- Events that trigger workflows
    workflow_states JSONB DEFAULT '{}',      -- Valid states and transitions
    
    -- Validation and Business Rules
    validation_rules JSONB DEFAULT '{}',     -- Complex validation beyond simple constraints
    business_rules JSONB DEFAULT '{}',       -- Derived fields, calculations, defaults
    
    -- Standard Compliance
    standard_mappings JSONB DEFAULT '{}',    -- How fields map to compliance standards
    
    -- Search and Reporting
    search_config JSONB DEFAULT '{}',        -- Searchable fields, index configurations
    reportable_fields JSONB DEFAULT '{}',    -- Fields available for reports
    
    -- Extensibility
    extension_points JSONB DEFAULT '{}',     -- Hook points for plugins and extensions
    custom_behaviors JSONB DEFAULT '{}',     -- Organization-specific customizations
    
    -- Event System
    event_producers JSONB DEFAULT '{}',      -- Events this entity generates
    event_consumers JSONB DEFAULT '{}',      -- Events this entity reacts to
    
    -- Lifecycle Management
    versioning_config JSONB DEFAULT '{}',    -- How versions are managed
    archival_rules JSONB DEFAULT '{}',       -- When/how records are archived
    
    -- Integration Configuration
    external_integrations JSONB DEFAULT '{}', -- External system mappings
    
    -- Documentation
    field_descriptions JSONB DEFAULT '{}',   -- Detailed field descriptions
    examples JSONB DEFAULT '{}',             -- Example values and usage
    
    -- Standard Fields
    is_active BOOLEAN DEFAULT true,
    is_system_table BOOLEAN DEFAULT false,
    is_extensible BOOLEAN DEFAULT true,
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    
    -- Constraints
    CONSTRAINT valid_schema_definition CHECK (jsonb_typeof(schema_definition) = 'object'),
    CONSTRAINT valid_api_config CHECK (jsonb_typeof(api_config) = 'object'),
    CONSTRAINT valid_ui_config CHECK (jsonb_typeof(ui_config) = 'object'),
    CONSTRAINT valid_permission_rules CHECK (jsonb_typeof(permission_rules) = 'object')
);
```

### Field Descriptions

#### Basic Information

- **id**: Unique identifier for the metadata entry
- **table_name**: Name of the database table for this entity
- **display_name**: Human-readable name for the entity
- **description**: Description of the entity's purpose

#### Core Schema Definition

- **schema_definition**: JSON object defining the entity's fields, types, constraints, and relationships

#### API Configuration

- **api_config**: JSON object defining the API behavior for this entity, including endpoints, methods, and parameters

#### UI Configuration

- **ui_config**: JSON object defining how the entity is rendered in the UI, including forms, views, and layouts

#### Access Control

- **permission_rules**: JSON object defining access control rules for this entity

#### Relationships and Dependencies

- **relationship_map**: JSON object defining relationships with other entities

#### Workflow Integration

- **workflow_triggers**: JSON object defining events that trigger workflows
- **workflow_states**: JSON object defining valid states and transitions for this entity

#### Validation and Business Rules

- **validation_rules**: JSON object defining complex validation rules
- **business_rules**: JSON object defining business logic, derived fields, and defaults

#### Standard Compliance

- **standard_mappings**: JSON object defining how this entity maps to compliance standards

#### Search and Reporting

- **search_config**: JSON object defining searchable fields and index configurations
- **reportable_fields**: JSON object defining fields available for reports

#### Extensibility

- **extension_points**: JSON object defining hook points for plugins and extensions
- **custom_behaviors**: JSON object defining organization-specific customizations

#### Event System

- **event_producers**: JSON object defining events this entity generates
- **event_consumers**: JSON object defining events this entity reacts to

#### Lifecycle Management

- **versioning_config**: JSON object defining how versions are managed
- **archival_rules**: JSON object defining when and how records are archived

#### Integration Configuration

- **external_integrations**: JSON object defining mappings to external systems

#### Documentation

- **field_descriptions**: JSON object providing detailed descriptions of fields
- **examples**: JSON object providing example values and usage

#### Standard Fields

- **is_active**: Whether this entity is active
- **is_system_table**: Whether this entity is a system table
- **is_extensible**: Whether this entity can be extended by organizations
- **organization_id**: Organization that owns this entity
- **created_by**: User who created this entity
- **created_at**: When this entity was created
- **updated_by**: User who last updated this entity
- **updated_at**: When this entity was last updated
- **version**: Current version number of this entity

## Metadata Versions Table

The `metadata_versions` table tracks changes to metadata over time, enabling versioning and audit capabilities.

```sql
CREATE TABLE metadata_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metadata_id UUID REFERENCES metadata_registry(id),
    version_number INTEGER NOT NULL,
    change_type ENUM('schema', 'api', 'ui', 'permissions', 'workflow', 'business_rules'),
    change_description TEXT,
    previous_value JSONB,
    new_value JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(metadata_id, version_number)
);
```

### Field Descriptions

- **id**: Unique identifier for the version entry
- **metadata_id**: Reference to the metadata entry this version belongs to
- **version_number**: Sequential version number
- **change_type**: Type of change (schema, API, UI, permissions, workflow, business rules)
- **change_description**: Description of the change
- **previous_value**: Previous JSON value before the change
- **new_value**: New JSON value after the change
- **created_by**: User who made the change
- **created_at**: When the change was made

## Field Metadata Table

The `field_metadata` table stores detailed information about individual fields, enabling fine-grained control over field behavior.

```sql
CREATE TABLE field_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metadata_id UUID REFERENCES metadata_registry(id),
    field_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    field_type TEXT NOT NULL,  -- string, number, boolean, date, enum, object, array
    is_required BOOLEAN DEFAULT false,
    is_unique BOOLEAN DEFAULT false,
    is_searchable BOOLEAN DEFAULT false,
    is_sortable BOOLEAN DEFAULT false,
    is_filterable BOOLEAN DEFAULT false,
    is_primary_key BOOLEAN DEFAULT false,
    is_foreign_key BOOLEAN DEFAULT false,
    is_system_field BOOLEAN DEFAULT false,
    is_sensitive BOOLEAN DEFAULT false,
    validation_rules JSONB DEFAULT '{}',
    ui_config JSONB DEFAULT '{}',
    permission_rules JSONB DEFAULT '{}',
    default_value JSONB,
    referenced_table TEXT,
    referenced_field TEXT,
    standard_mappings JSONB DEFAULT '{}',
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(metadata_id, field_name),
    CONSTRAINT valid_validation_rules CHECK (jsonb_typeof(validation_rules) = 'object'),
    CONSTRAINT valid_ui_config CHECK (jsonb_typeof(ui_config) = 'object'),
    CONSTRAINT valid_permission_rules CHECK (jsonb_typeof(permission_rules) = 'object')
);
```

### Field Descriptions

#### Basic Information

- **id**: Unique identifier for the field metadata entry
- **metadata_id**: Reference to the metadata entry this field belongs to
- **field_name**: Name of the field in the database
- **display_name**: Human-readable name for the field
- **description**: Description of the field's purpose
- **field_type**: Data type of the field (string, number, boolean, date, enum, object, array)

#### Field Properties

- **is_required**: Whether the field is required
- **is_unique**: Whether the field value must be unique
- **is_searchable**: Whether the field is included in search
- **is_sortable**: Whether the field can be sorted
- **is_filterable**: Whether the field can be filtered
- **is_primary_key**: Whether the field is the primary key
- **is_foreign_key**: Whether the field is a foreign key
- **is_system_field**: Whether the field is a system field
- **is_sensitive**: Whether the field contains sensitive data

#### Configuration

- **validation_rules**: JSON object defining validation rules for this field
- **ui_config**: JSON object defining how this field is rendered in the UI
- **permission_rules**: JSON object defining access control rules for this field
- **default_value**: Default value for this field
- **referenced_table**: If this field is a foreign key, the table it references
- **referenced_field**: If this field is a foreign key, the field it references
- **standard_mappings**: JSON object defining how this field maps to compliance standards

#### Standard Fields

- **organization_id**: Organization that owns this field
- **created_by**: User who created this field
- **created_at**: When this field was created
- **updated_by**: User who last updated this field
- **updated_at**: When this field was last updated

## Entity Creation Process

When creating a new entity in ArionComply, the following steps are typically followed:

1. **Define the entity schema**:
   - Identify the fields needed for the entity
   - Determine field types and constraints
   - Define relationships with other entities

2. **Create the metadata entry**:
   - Insert a new row in the `metadata_registry` table
   - Define the schema, API configuration, UI configuration, and permission rules

3. **Create field metadata**:
   - Insert rows in the `field_metadata` table for each field
   - Define field-specific behavior and constraints

4. **Create the actual database table**:
   - Create the table with the appropriate fields and constraints
   - Create indexes for performance optimization

5. **Configure workflows**:
   - Define workflow states and transitions
   - Configure triggers for workflow actions

6. **Map to compliance standards**:
   - Define how the entity maps to compliance requirements
   - Configure reporting and dashboard integration

## Example: Creating a New Entity

Here's an example of creating a new entity for managing policies:

```sql
-- Insert the metadata entry
INSERT INTO metadata_registry (
  table_name,
  display_name,
  description,
  schema_definition,
  api_config,
  ui_config,
  permission_rules,
  relationship_map,
  workflow_triggers,
  standard_mappings
) VALUES (
  'policies',
  'Policies',
  'Organizational policies and procedures',
  '{"fields": [...], "indexes": [...], "constraints": [...]}',
  '{"resource_name": "policies", "enable_crud": true, ...}',
  '{"list_view": {...}, "detail_view": {...}, ...}',
  '{"roles": {...}, "field_level_permissions": {...}, ...}',
  '{"parent_entities": ["policy_categories"], "child_entities": ["policy_versions", ...], ...}',
  '{"on_create": ["policy_created"], "on_update": ["policy_updated"], ...}',
  '{"iso27001": {"controls": ["A.5.1.1", "A.5.1.2"], ...}, ...}'
);

-- Insert field metadata for key fields
INSERT INTO field_metadata (
  metadata_id,
  field_name,
  display_name,
  description,
  field_type,
  is_required,
  is_searchable,
  is_sortable,
  is_filterable,
  validation_rules,
  ui_config
) VALUES (
  (SELECT id FROM metadata_registry WHERE table_name = 'policies'),
  'title',
  'Title',
  'Title of the policy',
  'text',
  true,
  true,
  true,
  true,
  '{"min_length": 3, "max_length": 255}',
  '{"control": "textField", "size": "large"}'
);

-- Create the actual database table
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  risk_level TEXT NOT NULL DEFAULT 'medium',
  effective_date DATE,
  content TEXT,
  owner_id UUID REFERENCES users(id),
  custom_fields JSONB DEFAULT '{}',
  version INTEGER DEFAULT 1,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID NOT NULL REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
);

-- Create indexes
CREATE INDEX idx_policies_title ON policies (title);
CREATE INDEX idx_policies_risk_level ON policies (risk_level, effective_date);
CREATE INDEX idx_policies_owner ON policies (owner_id);
CREATE INDEX idx_policies_custom_fields ON policies USING gin (custom_fields);
```

## Multi-tenant Considerations

ArionComply is a multi-tenant system, meaning that metadata and data are separated by organization. This is achieved through the following mechanisms:

1. **Organization ID**: All metadata and data tables include an `organization_id` field
2. **Row-Level Security**: Database policies enforce row-level security based on the `organization_id`
3. **Organization-specific Customizations**: The `custom_behaviors` JSON field allows for organization-specific customizations

## Versioning and Audit

Changes to metadata are tracked in the `metadata_versions` table, enabling:

1. **Historical Tracking**: View how metadata has changed over time
2. **Audit Compliance**: Satisfy audit requirements for change tracking
3. **Rollback Capability**: Roll back to previous versions if needed
4. **Change Analysis**: Analyze the impact of metadata changes

When a change is made to a metadata entry, a new row is added to the `metadata_versions` table with the previous and new values, along with information about who made the change and when.

## Conclusion

The Metadata Registry is the foundation of ArionComply's metadata-driven architecture. By centralizing entity definitions, the system can dynamically generate API endpoints, UI components, and business logic, enabling rapid development and consistent behavior across the application.