

## 1. New Tables for Standards Management

Based on the existing `control_frameworks`, `framework_controls`, and `framework_control_mappings` tables in the KB:

```sql
-- Core standards registry - aligns with existing patterns
CREATE TABLE standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    standard_code TEXT NOT NULL,
    standard_name TEXT NOT NULL,
    version TEXT NOT NULL,
    description TEXT,
    category ENUM('security', 'privacy', 'compliance', 'industry', 'internal'),
    publisher TEXT,
    effective_date DATE,
    is_active BOOLEAN DEFAULT true,
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    custom_fields JSONB DEFAULT '{}',
    UNIQUE(standard_code, version, organization_id),
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
);

-- Standard requirements - compatible with existing framework_controls
CREATE TABLE standard_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    standard_id UUID REFERENCES standards(id) ON DELETE CASCADE,
    requirement_code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    parent_id UUID REFERENCES standard_requirements(id),
    requirement_type ENUM('control', 'clause', 'article', 'requirement', 'principle'),
    implementation_guidance TEXT,
    verification_criteria TEXT,
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    custom_fields JSONB DEFAULT '{}',
    UNIQUE(standard_id, requirement_code, organization_id),
    CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
);

-- Cross-standard mappings - enhances framework_control_mappings
CREATE TABLE standard_requirement_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_requirement_id UUID REFERENCES standard_requirements(id),
    target_requirement_id UUID REFERENCES standard_requirements(id),
    mapping_type ENUM('equivalent', 'partial', 'related'),
    mapping_strength ENUM('strong', 'medium', 'weak'),
    mapping_notes TEXT,
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY(source_requirement_id, target_requirement_id),
    CONSTRAINT no_self_mapping CHECK (source_requirement_id != target_requirement_id)
);

-- Entity-standard mappings - new table for flexible entity-to-requirement mapping
CREATE TABLE entity_standard_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    requirement_id UUID REFERENCES standard_requirements(id),
    mapping_type ENUM('implements', 'addresses', 'references', 'evidence_for'),
    implementation_status ENUM('not_implemented', 'partially_implemented', 'implemented', 'not_applicable'),
    implementation_notes TEXT,
    implementation_score DECIMAL(5,2),
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id, requirement_id, organization_id)
);
```

## 2. Link with Existing Statement of Applicability Tables

The KB already includes `statements_of_applicability` and `soa_control_inclusions` tables, but they need to be connected with our new standards schema:

```sql
-- Add link to standard_requirements in soa_control_inclusions
ALTER TABLE soa_control_inclusions
ADD COLUMN requirement_id UUID REFERENCES standard_requirements(id);

-- Create index for efficient lookups
CREATE INDEX idx_soa_control_inclusions_requirement ON soa_control_inclusions(requirement_id);
```

## 3. Modifications to Control Implementation Tables

The existing `control_implementations` table should be linked to our standard requirements:

```sql
-- Modify control_implementations table to link with standard_requirements
ALTER TABLE control_implementations
ADD COLUMN requirement_id UUID REFERENCES standard_requirements(id);

-- Create index for efficient lookups
CREATE INDEX idx_control_implementations_requirement ON control_implementations(requirement_id);
```

## 4. Risk Management Integration

The existing `risks` and `risk_treatments` tables should be linked to standards:

```sql
-- Modify risks table
ALTER TABLE risks
ADD COLUMN standard_metadata JSONB DEFAULT '{}',
ADD CONSTRAINT valid_standard_metadata CHECK (jsonb_typeof(standard_metadata) = 'object');

-- Create index for efficient lookups
CREATE INDEX idx_risks_standard_metadata ON risks USING GIN (standard_metadata);

-- Modify risk_treatments table
ALTER TABLE risk_treatments
ADD COLUMN requirement_id UUID REFERENCES standard_requirements(id);

-- Create index for efficient lookups
CREATE INDEX idx_risk_treatments_requirement ON risk_treatments(requirement_id);
```

## 5. Document Management Integration

The existing `documents` table should be linked to standards:

```sql
-- Modify documents table to reference standards
ALTER TABLE documents
ADD COLUMN applicable_standards JSONB DEFAULT '[]',
ADD CONSTRAINT valid_applicable_standards CHECK (jsonb_typeof(applicable_standards) = 'array');

-- Create index for efficient lookups
CREATE INDEX idx_documents_applicable_standards ON documents USING GIN (applicable_standards);
```

## 6. Audit Management Integration

The existing `audit_engagements` and related tables should be linked to standards:

```sql
-- Modify audit_engagements table
ALTER TABLE audit_engagements
ADD COLUMN standard_id UUID REFERENCES standards(id);

-- Create index for efficient lookups
CREATE INDEX idx_audit_engagements_standard ON audit_engagements(standard_id);

-- Modify audit_checklist_items table
ALTER TABLE audit_checklist_items
ADD COLUMN requirement_id UUID REFERENCES standard_requirements(id);

-- Create index for efficient lookups
CREATE INDEX idx_audit_checklist_items_requirement ON audit_checklist_items(requirement_id);
```

## 7. Extension Registry for Platform Extensibility

This is a new addition for platform extensibility:

```sql
-- Extension registry for platform extensibility
CREATE TABLE extension_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    extension_name TEXT NOT NULL,
    version TEXT NOT NULL,
    description TEXT,
    publisher TEXT,
    tables_affected JSONB NOT NULL,
    schema_extensions JSONB NOT NULL,
    api_extensions JSONB NOT NULL,
    ui_extensions JSONB NOT NULL,
    permission_extensions JSONB NOT NULL,
    dependencies JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(extension_name, version, organization_id)
);

CREATE INDEX idx_extension_registry_extension ON extension_registry(extension_name, version);
CREATE INDEX idx_extension_registry_publisher ON extension_registry(publisher);
CREATE INDEX idx_extension_registry_tables ON extension_registry USING GIN (tables_affected);
```

These modifications are now adding the necessary capabilities for:

1. Multi-standard support
2. Flexible entity-to-standard mapping
3. Data-driven API configuration
4. Platform extensibility

The approach minimizes schema changes to existing tables while ensuring good performance through appropriate indexes and structures.