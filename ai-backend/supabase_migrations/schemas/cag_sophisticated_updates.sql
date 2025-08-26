-- ============================================================================
-- CAG DATABASE SCHEMA UPDATES for Sophisticated Reference Documents
-- File: docs/schemas/updates/cag_sophisticated_updates.sql
-- Apply AFTER your existing cag_database_schema.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- NEW TABLE: chunk_relationships - Cross-reference relationships between chunks
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS chunk_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationship definition
    source_chunk_id TEXT NOT NULL,      -- e.g., "ISO27001_ACCESS_CONTROL_001"
    target_chunk_id TEXT NOT NULL,      -- e.g., "GDPR_ARTICLE_32_001"
    relationship_type TEXT NOT NULL,    -- 'requires', 'enables', 'maps_to', 'implements', 'supports'
    
    -- Relationship metadata
    relationship_strength FLOAT DEFAULT 1.0,    -- 0.0-1.0 for weighted relationships
    relationship_context JSONB DEFAULT '{}'::JSONB,
    /*
    Structure:
    {
      "frameworks": ["iso27001", "gdpr"],           -- Which frameworks this relationship spans
      "dependency_type": "mandatory|recommended|optional",
      "implementation_order": "prerequisite|parallel|subsequent",
      "business_impact": "critical|important|supportive",
      "automation_relevance": "high|medium|low"
    }
    */
    
    -- Organizational applicability
    org_applicability JSONB DEFAULT '{}'::JSONB,
    /*
    Structure: When this relationship applies
    {
      "company_sizes": ["small", "medium", "large"],
      "industries": ["fintech", "healthcare", "general"],
      "maturity_levels": ["basic", "intermediate", "advanced"],
      "geographic_scope": ["usa", "eu", "global"]
    }
    */
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    
    -- Constraints
    UNIQUE(source_chunk_id, target_chunk_id, relationship_type),
    CHECK (source_chunk_id != target_chunk_id),
    CHECK (relationship_strength >= 0.0 AND relationship_strength <= 1.0)
);

-- ---------------------------------------------------------------------------
-- NEW TABLE: learning_pathways - Educational progression tracking
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS learning_pathways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Pathway definition
    pathway_name TEXT NOT NULL,          -- e.g., "ISO 27001 Beginner to Expert"
    framework TEXT NOT NULL,             -- 'iso27001', 'gdpr', 'cross_framework'
    target_audience TEXT NOT NULL,       -- 'beginners', 'practitioners', 'experts', 'executives'
    
    -- Pathway structure
    chunk_sequence JSONB NOT NULL,       -- Ordered array of chunk_ids with metadata
    /*
    Structure:
    {
      "stages": [
        {
          "stage_name": "Foundation Understanding",
          "stage_order": 1,
          "chunks": [
            {
              "chunk_id": "ISO27001_OVERVIEW_001",
              "order": 1,
              "required": true,
              "estimated_time_minutes": 15
            }
          ]
        }
      ]
    }
    */
    
    -- Organizational customization
    org_customization_rules JSONB DEFAULT '{}'::JSONB,
    /*
    Structure: How to customize pathway by organization
    {
      "company_size_adaptations": {
        "small": {"skip_chunks": ["complex_governance"], "add_chunks": ["simple_implementation"]},
        "large": {"emphasis_chunks": ["enterprise_controls"], "skip_chunks": ["startup_guidance"]}
      },
      "industry_adaptations": {
        "fintech": {"add_chunks": ["financial_specific"], "emphasis": ["sox_compliance"]},
        "healthcare": {"add_chunks": ["hipaa_integration"], "emphasis": ["privacy_controls"]}
      }
    }
    */
    
    -- Pathway metadata
    estimated_duration_hours INTEGER,
    difficulty_level TEXT,               -- 'beginner', 'intermediate', 'advanced', 'expert'
    prerequisites TEXT[],                -- Array of prerequisite pathway IDs or chunk IDs
    subscription_requirement TEXT DEFAULT 'starter',
    
    -- Status and tracking
    is_active BOOLEAN DEFAULT true,
    version TEXT DEFAULT '1.0',
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

-- ---------------------------------------------------------------------------
-- NEW TABLE: organizational_chunk_preferences - Track org-specific chunk usage
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS organizational_chunk_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Organization reference
    org_id UUID NOT NULL,               -- Links to main organizations table
    
    -- Chunk preferences
    chunk_id TEXT NOT NULL,
    preference_type TEXT NOT NULL,      -- 'preferred', 'excluded', 'customized', 'priority'
    preference_value JSONB DEFAULT '{}'::JSONB,
    /*
    Structure:
    {
      "priority_score": 1.5,            -- Multiplier for relevance scoring
      "custom_content": "...",           -- Organization-specific content variations
      "exclusion_reason": "not_applicable|too_complex|regulatory_mismatch",
      "last_used": "2025-01-15T10:30:00Z",
      "usage_frequency": 15,             -- Number of times referenced
      "user_feedback": "very_helpful|helpful|not_helpful"
    }
    */
    
    -- Context
    applied_contexts JSONB DEFAULT '{}'::JSONB,
    /*
    When this preference applies:
    {
      "query_types": ["policy_generation", "assessment", "training"],
      "user_roles": ["admin", "compliance_officer", "employee"],
      "scenarios": ["audit_prep", "incident_response", "onboarding"]
    }
    */
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_applied_at TIMESTAMPTZ,
    
    -- Constraints
    UNIQUE(org_id, chunk_id, preference_type)
);

-- ---------------------------------------------------------------------------
-- INDEXES: Performance optimization for relationship queries
-- ---------------------------------------------------------------------------

-- Chunk relationships indexes
CREATE INDEX IF NOT EXISTS idx_chunk_relationships_source ON chunk_relationships(source_chunk_id);
CREATE INDEX IF NOT EXISTS idx_chunk_relationships_target ON chunk_relationships(target_chunk_id);
CREATE INDEX IF NOT EXISTS idx_chunk_relationships_type ON chunk_relationships(relationship_type);
CREATE INDEX IF NOT EXISTS idx_chunk_relationships_strength ON chunk_relationships(relationship_strength) WHERE relationship_strength > 0.5;
CREATE INDEX IF NOT EXISTS idx_chunk_relationships_context ON chunk_relationships USING GIN(relationship_context);

-- Learning pathways indexes  
CREATE INDEX IF NOT EXISTS idx_learning_pathways_framework ON learning_pathways(framework);
CREATE INDEX IF NOT EXISTS idx_learning_pathways_audience ON learning_pathways(target_audience);
CREATE INDEX IF NOT EXISTS idx_learning_pathways_difficulty ON learning_pathways(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_learning_pathways_active ON learning_pathways(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_learning_pathways_sequence ON learning_pathways USING GIN(chunk_sequence);

-- Organizational preferences indexes
CREATE INDEX IF NOT EXISTS idx_org_chunk_prefs_org ON organizational_chunk_preferences(org_id);
CREATE INDEX IF NOT EXISTS idx_org_chunk_prefs_chunk ON organizational_chunk_preferences(chunk_id);
CREATE INDEX IF NOT EXISTS idx_org_chunk_prefs_type ON organizational_chunk_preferences(preference_type);
CREATE INDEX IF NOT EXISTS idx_org_chunk_prefs_value ON organizational_chunk_preferences USING GIN(preference_value);

-- ---------------------------------------------------------------------------
-- UTILITY FUNCTIONS: Enhanced relationship traversal
-- ---------------------------------------------------------------------------

-- Function to get related chunks
CREATE OR REPLACE FUNCTION get_related_chunks(
    source_chunk_id TEXT,
    relationship_types TEXT[] DEFAULT ARRAY['requires', 'enables', 'maps_to'],
    max_depth INTEGER DEFAULT 2,
    org_context JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE (
    chunk_id TEXT,
    relationship_type TEXT,
    relationship_strength FLOAT,
    depth_level INTEGER
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE chunk_traversal AS (
        -- Base case: direct relationships
        SELECT 
            cr.target_chunk_id as chunk_id,
            cr.relationship_type,
            cr.relationship_strength,
            1 as depth_level
        FROM chunk_relationships cr
        WHERE 
            cr.source_chunk_id = get_related_chunks.source_chunk_id
            AND cr.relationship_type = ANY(relationship_types)
            AND (
                org_context = '{}'::JSONB 
                OR cr.org_applicability ? 'company_sizes'
                OR cr.org_applicability = '{}'::JSONB
            )
        
        UNION ALL
        
        -- Recursive case: follow relationships
        SELECT 
            cr.target_chunk_id,
            cr.relationship_type,
            cr.relationship_strength * ct.relationship_strength,
            ct.depth_level + 1
        FROM chunk_relationships cr
        JOIN chunk_traversal ct ON cr.source_chunk_id = ct.chunk_id
        WHERE 
            ct.depth_level < max_depth
            AND cr.relationship_type = ANY(relationship_types)
    )
    SELECT DISTINCT * FROM chunk_traversal
    ORDER BY depth_level, relationship_strength DESC;
END;
$$;

-- ---------------------------------------------------------------------------
-- COMMENTS: Documentation
-- ---------------------------------------------------------------------------

COMMENT ON TABLE chunk_relationships IS 'Cross-reference relationships between sophisticated compliance chunks for educational progression and framework mapping';
COMMENT ON TABLE learning_pathways IS 'Structured educational pathways through compliance content with organizational customization';
COMMENT ON TABLE organizational_chunk_preferences IS 'Organization-specific preferences and customizations for chunk usage and relevance';

COMMENT ON FUNCTION get_related_chunks IS 'Traverse chunk relationships to find connected content for educational progression and cross-framework analysis';