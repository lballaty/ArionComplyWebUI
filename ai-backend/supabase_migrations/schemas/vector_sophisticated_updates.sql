-- ============================================================================
-- VECTOR DATABASE SCHEMA UPDATES for Sophisticated Reference Documents
-- File: docs/schemas/updates/vector_sophisticated_updates.sql
-- Apply AFTER your existing supabase_vector_schema_final.sql
-- ============================================================================

-- ---------------------------------------------------------------------------
-- UPDATE: vector_chunks table definition
-- Add these columns to existing vector_chunks table
-- ---------------------------------------------------------------------------

ALTER TABLE vector_chunks 
ADD COLUMN IF NOT EXISTS chunk_id TEXT,                    -- e.g., "ISO27001_ACCESS_CONTROL_POLICY_001"
ADD COLUMN IF NOT EXISTS concept_type TEXT,                -- 'requirement', 'guidance', 'implementation', 'validation'
ADD COLUMN IF NOT EXISTS complexity_level TEXT,            -- 'basic', 'intermediate', 'advanced'
ADD COLUMN IF NOT EXISTS subscription_tier TEXT,           -- 'starter', 'pro', 'enterprise'
ADD COLUMN IF NOT EXISTS domain TEXT,                      -- 'access_control', 'risk_management', 'incident_response'
ADD COLUMN IF NOT EXISTS framework_refs TEXT[],            -- ['ISO27001', 'GDPR', 'SOC2']
ADD COLUMN IF NOT EXISTS control_references TEXT[],        -- ['A.5.15.1', 'A.9.1.1']
ADD COLUMN IF NOT EXISTS ai_automation_level TEXT,         -- 'manual', 'semi_auto', 'full_auto'
ADD COLUMN IF NOT EXISTS educational_level TEXT;           -- 'foundation', 'understanding', 'implementation', 'validation'

-- ---------------------------------------------------------------------------
-- NEW INDEXES: Performance optimization for sophisticated chunks
-- ---------------------------------------------------------------------------

-- Sophisticated chunk metadata indexes
CREATE INDEX IF NOT EXISTS idx_chunks_chunk_id ON vector_chunks(chunk_id) WHERE chunk_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chunks_concept_type ON vector_chunks(concept_type) WHERE concept_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chunks_complexity ON vector_chunks(complexity_level) WHERE complexity_level IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chunks_subscription ON vector_chunks(subscription_tier) WHERE subscription_tier IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chunks_domain ON vector_chunks(domain) WHERE domain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chunks_frameworks ON vector_chunks USING GIN(framework_refs) WHERE framework_refs IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chunks_controls ON vector_chunks USING GIN(control_references) WHERE control_references IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chunks_automation ON vector_chunks(ai_automation_level) WHERE ai_automation_level IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chunks_education ON vector_chunks(educational_level) WHERE educational_level IS NOT NULL;

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_chunks_framework_complexity ON vector_chunks(complexity_level, subscription_tier) 
    WHERE complexity_level IS NOT NULL AND subscription_tier IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_chunks_domain_automation ON vector_chunks(domain, ai_automation_level) 
    WHERE domain IS NOT NULL AND ai_automation_level IS NOT NULL;

-- ---------------------------------------------------------------------------
-- NEW FUNCTIONS: Enhanced search with sophisticated chunk filtering
-- ---------------------------------------------------------------------------

-- Function for sophisticated chunk retrieval
CREATE OR REPLACE FUNCTION match_sophisticated_chunks(
    query_embedding VECTOR(1536),
    org_context JSONB DEFAULT '{}'::JSONB,
    complexity_filter TEXT DEFAULT NULL,
    subscription_level TEXT DEFAULT 'starter',
    domain_filter TEXT DEFAULT NULL,
    framework_filter TEXT[] DEFAULT NULL,
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    chunk_id TEXT,
    document_id UUID,
    content TEXT,
    document_title TEXT,
    similarity FLOAT,
    chunk_metadata JSONB,
    concept_type TEXT,
    complexity_level TEXT,
    domain TEXT,
    framework_refs TEXT[],
    ai_automation_level TEXT,
    context_relevance_score FLOAT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    tier_hierarchy INT;
BEGIN
    -- Convert subscription level to hierarchy for filtering
    tier_hierarchy := CASE subscription_level
        WHEN 'starter' THEN 1
        WHEN 'pro' THEN 2  
        WHEN 'enterprise' THEN 3
        ELSE 1
    END;

    RETURN QUERY
    SELECT 
        vc.chunk_id,
        vc.document_id,
        vc.content,
        d.title as document_title,
        (vc.embedding <=> query_embedding) as similarity,
        vc.chunk_metadata,
        vc.concept_type,
        vc.complexity_level,
        vc.domain,
        vc.framework_refs,
        vc.ai_automation_level,
        -- Enhanced context relevance calculation
        (
            CASE WHEN org_context->>'industry_secondary' = ANY(
                ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'industry_relevance'))
            ) THEN 0.3 ELSE 0.0 END +
            CASE WHEN ARRAY(SELECT jsonb_array_elements_text(org_context->'applicable_frameworks')) && vc.framework_refs
                THEN 0.4 ELSE 0.0 END +
            CASE WHEN vc.domain = domain_filter THEN 0.3 ELSE 0.0 END
        ) as context_relevance_score
    FROM vector_chunks vc
    JOIN documents d ON vc.document_id = d.id
    WHERE 
        -- Similarity threshold
        (vc.embedding <=> query_embedding) < (1 - match_threshold)
        -- Subscription tier filtering
        AND (
            vc.subscription_tier IS NULL 
            OR CASE vc.subscription_tier
                WHEN 'starter' THEN 1
                WHEN 'pro' THEN 2
                WHEN 'enterprise' THEN 3
                ELSE 1
            END <= tier_hierarchy
        )
        -- Complexity filtering
        AND (complexity_filter IS NULL OR vc.complexity_level = complexity_filter)
        -- Domain filtering
        AND (domain_filter IS NULL OR vc.domain = domain_filter)
        -- Framework filtering
        AND (framework_filter IS NULL OR vc.framework_refs && framework_filter)
    ORDER BY 
        -- Combine similarity, context relevance, and subscription priority
        (
            (vc.embedding <=> query_embedding) * 0.6 + 
            (1 - context_relevance_score) * 0.3 +
            CASE vc.subscription_tier 
                WHEN subscription_level THEN 0.0
                WHEN 'starter' THEN 0.1
                ELSE 0.05
            END
        ) ASC
    LIMIT match_count;
END;
$$;

-- ---------------------------------------------------------------------------
-- ENHANCED FUNCTION: Knowledge graph integration
-- ---------------------------------------------------------------------------

-- Function to get chunks with relationships for knowledge graph
CREATE OR REPLACE FUNCTION get_chunks_with_relationships(
    query_embedding VECTOR(1536),
    org_context JSONB DEFAULT '{}'::JSONB,
    include_relationships BOOLEAN DEFAULT true,
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    chunk_id TEXT,
    content TEXT,
    similarity FLOAT,
    chunk_metadata JSONB,
    concept_type TEXT,
    domain TEXT,
    framework_refs TEXT[],
    related_chunks JSONB  -- Contains relationship data
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH base_chunks AS (
        SELECT 
            vc.chunk_id,
            vc.content,
            (vc.embedding <=> query_embedding) as similarity,
            vc.chunk_metadata,
            vc.concept_type,
            vc.domain,
            vc.framework_refs
        FROM vector_chunks vc
        WHERE 
            vc.chunk_id IS NOT NULL
            AND (vc.embedding <=> query_embedding) < (1 - match_threshold)
        ORDER BY vc.embedding <=> query_embedding
        LIMIT match_count
    ),
    relationships_data AS (
        SELECT 
            bc.chunk_id,
            COALESCE(
                jsonb_agg(
                    jsonb_build_object(
                        'target_chunk_id', cr.target_chunk_id,
                        'relationship_type', cr.relationship_type,
                        'relationship_strength', cr.relationship_strength
                    )
                ) FILTER (WHERE cr.target_chunk_id IS NOT NULL),
                '[]'::jsonb
            ) as related_chunks
        FROM base_chunks bc
        LEFT JOIN chunk_relationships cr ON bc.chunk_id = cr.source_chunk_id
        WHERE include_relationships = true
        GROUP BY bc.chunk_id
    )
    SELECT 
        bc.chunk_id,
        bc.content,
        bc.similarity,
        bc.chunk_metadata,
        bc.concept_type,
        bc.domain,
        bc.framework_refs,
        COALESCE(rd.related_chunks, '[]'::jsonb) as related_chunks
    FROM base_chunks bc
    LEFT JOIN relationships_data rd ON bc.chunk_id = rd.chunk_id
    ORDER BY bc.similarity;
END;
$$;

-- ---------------------------------------------------------------------------
-- COMMENTS: Documentation for new fields and functions
-- ---------------------------------------------------------------------------

COMMENT ON COLUMN vector_chunks.chunk_id IS 'Unique identifier for sophisticated reference chunks (e.g., ISO27001_ACCESS_CONTROL_001)';
COMMENT ON COLUMN vector_chunks.concept_type IS 'Type of content: requirement, guidance, implementation, validation';
COMMENT ON COLUMN vector_chunks.complexity_level IS 'Complexity level: basic, intermediate, advanced for educational progression';
COMMENT ON COLUMN vector_chunks.subscription_tier IS 'Minimum subscription tier required to access this chunk';
COMMENT ON COLUMN vector_chunks.domain IS 'Compliance domain: access_control, risk_management, incident_response, etc.';
COMMENT ON COLUMN vector_chunks.framework_refs IS 'Array of compliance frameworks this chunk relates to';
COMMENT ON COLUMN vector_chunks.control_references IS 'Array of specific control references (e.g., A.5.15.1)';
COMMENT ON COLUMN vector_chunks.ai_automation_level IS 'Level of AI automation possible: manual, semi_auto, full_auto';
COMMENT ON COLUMN vector_chunks.educational_level IS 'Educational progression level for learning paths';

COMMENT ON FUNCTION match_sophisticated_chunks IS 'Enhanced vector search with sophisticated chunk filtering for subscription tiers, complexity, and organizational context';
COMMENT ON FUNCTION get_chunks_with_relationships IS 'Retrieve chunks with their knowledge graph relationships for comprehensive context';