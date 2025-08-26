-- ============================================================================
-- Production Supabase Vector Database Schema + CAG Integration
-- Single Supabase instance with both application data and vector data
-- ============================================================================

-- ---------------------------------------------------------------------------
-- VECTOR DATABASE SCHEMA (Production)
-- ---------------------------------------------------------------------------

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgaudit";

-- ---------------------------------------------------------------------------
-- 1. DOCUMENTS - Source document metadata (EXPANDED FOR ALL CONTENT TYPES)
-- ---------------------------------------------------------------------------

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic document info
    title TEXT NOT NULL,
    file_name TEXT,
    source_url TEXT,
    sha256 TEXT UNIQUE, -- Content hash for deduplication
    
    -- Document classification (EXPANDED)
    source_type TEXT NOT NULL,
    -- 'iso27001', 'iso27701', 'gdpr', 'eu_ai_act', 'ccpa', 'policy_template', 'procedure_template', 
    -- 'qa_bank', 'conversation', 'document_summary', 'legal_text', 'regulatory_guide'
    
    document_type TEXT NOT NULL,
    -- 'standard', 'regulation', 'policy_template', 'procedure_template', 'qa_pair', 'conversation_log',
    -- 'document_summary', 'example', 'checklist', 'legal_analysis', 'implementation_guide'
    
    content_category TEXT,
    -- 'controls', 'requirements', 'implementation_guidance', 'examples', 'templates', 'faqs', 
    -- 'conversations', 'summaries', 'legal_analysis', 'user_interactions'
    
    -- Conversation/QA specific fields
    conversation_metadata JSONB DEFAULT '{}'::JSONB,
    /*
    Structure for conversations/QA content:
    {
      "conversation_type": "user_support|expert_consultation|community_discussion|training_session",
      "participant_roles": ["user", "expert", "ai_assistant"],
      "conversation_length": 15, // number of messages
      "resolution_status": "resolved|ongoing|escalated",
      "quality_score": 4.2, // 1-5 rating
      "expertise_level": "beginner|intermediate|expert",
      "question_categories": ["gdpr_compliance", "risk_assessment"],
      "answer_confidence": 0.85, // AI confidence score
      "human_verified": true, // Expert reviewed
      "reusability_score": 0.9 // How useful for other users
    }
    */
    
    -- Document summary specific fields
    summary_metadata JSONB DEFAULT '{}'::JSONB,
    /*
    Structure for document summaries:
    {
      "original_document_id": "uuid", // Reference to full document
      "summary_type": "executive|technical|compliance|key_points",
      "summary_length": "brief|standard|detailed",
      "key_topics": ["data_protection", "risk_management"],
      "action_items_count": 5,
      "compliance_relevance": ["iso27001", "gdpr"],
      "target_audience": "executives|practitioners|auditors"
    }
    */
    
    -- Language and version
    language TEXT DEFAULT 'en',
    version TEXT,
    
    -- Content metadata for CAG filtering (ENHANCED FOR ALL CONTENT TYPES)
    content_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    /*
    Structure: What types of organizations this content applies to
    {
      "industry_relevance": ["fintech", "healthcare", "b2b_saas", "professional_services", "ecommerce", "manufacturing", "general"],
      "company_size_applicability": ["small", "medium", "large", "all"],
      "geographic_scope": ["usa", "eu", "uk", "canada", "global"],
      "regulatory_jurisdictions": ["gdpr_territory", "ccpa_scope", "eu_ai_act_scope"],
      "complexity_level": "basic|intermediate|advanced",
      "frameworks": ["iso27001", "gdpr", "soc2", "ccpa", "eu_ai_act"],
      "business_model_relevance": ["b2b", "b2c", "b2b2c", "all"],
      "tech_stack_relevance": ["aws", "azure", "gcp", "on_premise", "hybrid", "all"],
      "ai_acceleration_level": "standard|high|very_high",
      "acceleration_factor": 6.0,
      
      // NEW: Content type specific metadata
      "content_freshness": "2024-12-15", // For conversations/Q&A currency
      "interaction_quality": "high|medium|low", // For user interactions
      "template_completeness": "draft|reviewed|production", // For templates
      "legal_authority": "primary|secondary|interpretation", // For legal content
      "user_experience_level": "beginner|intermediate|expert", // Target experience
      "conversational_context": ["onboarding", "implementation", "audit_prep", "incident_response"]
    }
    */
    
    -- Processing metadata
    processed_at TIMESTAMPTZ,
    total_chunks INTEGER DEFAULT 0,
    processing_status TEXT DEFAULT 'pending',
    -- 'pending', 'processing', 'completed', 'failed'
    
    -- Quality and usage metadata
    usage_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMPTZ,
    quality_rating DECIMAL(3,2), -- Average user rating 1-5
    expert_reviewed BOOLEAN DEFAULT FALSE,
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 2. VECTOR_CHUNKS - Chunked content with embeddings
-- ---------------------------------------------------------------------------

CREATE TABLE vector_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Document relationship
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL, -- Position within document
    
    -- Content
    content TEXT NOT NULL, -- The actual text chunk
    content_hash TEXT NOT NULL, -- Hash of content for deduplication
    token_count INTEGER,
    
    -- Hierarchical chunking support
    parent_chunk_id UUID REFERENCES vector_chunks(id), -- For hierarchical chunking
    chunk_level TEXT DEFAULT 'paragraph', -- 'document', 'section', 'paragraph', 'sentence'
    
    -- Vector embedding
    embedding VECTOR(1536), -- OpenAI ada-002 or similar
    embedding_model TEXT DEFAULT 'text-embedding-ada-002',
    
    -- CAG-specific metadata (inherited from document + chunk-specific)
    chunk_metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    /*
    Structure: Chunk-specific applicability (inherits from document but can override)
    {
      "industry_focus": ["fintech"], -- If this specific chunk is industry-specific
      "geographic_specificity": ["california", "eu"], -- If chunk has jurisdiction-specific content
      "company_size_focus": ["small"], -- If chunk specifically addresses small companies
      "complexity_override": "basic", -- Override document complexity for this chunk
      "ai_automation_keywords": ["automated", "ai_generated", "streamlined"], -- Keywords indicating AI acceleration
      "traditional_vs_ai_timeline": { -- Specific timeline comparisons mentioned in chunk
        "traditional_months": 12,
        "ai_weeks": 2,
        "acceleration_factor": 24
      }
    }
    */
    
    -- Search optimization
    search_keywords TSVECTOR, -- Full-text search support
    
    -- Quality metrics
    similarity_threshold FLOAT DEFAULT 0.7, -- Minimum similarity for retrieval
    
    -- Audit fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(document_id, chunk_index),
    UNIQUE(content_hash) -- Prevent duplicate chunks across documents
);

-- ---------------------------------------------------------------------------
-- 3. VECTOR SEARCH FUNCTIONS for CAG-aware retrieval
-- ---------------------------------------------------------------------------

-- Function to search vectors with organizational context filtering
CREATE OR REPLACE FUNCTION match_chunks_with_context(
    query_embedding VECTOR(1536),
    org_context JSONB DEFAULT '{}'::JSONB,
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    chunk_id UUID,
    document_id UUID,
    content TEXT,
    document_title TEXT,
    similarity FLOAT,
    content_metadata JSONB,
    chunk_metadata JSONB,
    context_relevance_score FLOAT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    user_industry TEXT;
    user_size TEXT;
    user_geography TEXT[];
    user_frameworks TEXT[];
BEGIN
    -- Extract organizational context
    user_industry := org_context->>'industry_secondary';
    user_size := CASE 
        WHEN org_context->'business_context'->>'company_size' IN ('1-10', '11-50') THEN 'small'
        WHEN org_context->'business_context'->>'company_size' IN ('51-200', '201-500') THEN 'medium'
        ELSE 'large'
    END;
    user_geography := ARRAY(SELECT jsonb_array_elements_text(org_context->'business_context'->'geographic_presence'->'countries'));
    user_frameworks := ARRAY(SELECT jsonb_array_elements_text(org_context->'applicable_frameworks'));

    RETURN QUERY
    SELECT 
        vc.id as chunk_id,
        vc.document_id,
        vc.content,
        d.title as document_title,
        (vc.embedding <=> query_embedding) as similarity,
        d.content_metadata,
        vc.chunk_metadata,
        -- Calculate context relevance score
        (
            CASE 
                WHEN user_industry = ANY(ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'industry_relevance'))) 
                THEN 0.3 ELSE 0.0 
            END +
            CASE 
                WHEN user_size = ANY(ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'company_size_applicability'))) 
                THEN 0.3 ELSE 0.0 
            END +
            CASE 
                WHEN user_geography && ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'geographic_scope'))
                OR 'global' = ANY(ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'geographic_scope')))
                THEN 0.2 ELSE 0.0 
            END +
            CASE 
                WHEN user_frameworks && ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'frameworks'))
                THEN 0.2 ELSE 0.0 
            END
        ) as context_relevance_score
    FROM vector_chunks vc
    JOIN documents d ON vc.document_id = d.id
    WHERE 
        (vc.embedding <=> query_embedding) < (1 - match_threshold)
        -- Context filtering
        AND (
            -- Industry relevance
            user_industry = ANY(ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'industry_relevance')))
            OR 'general' = ANY(ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'industry_relevance')))
            -- Company size relevance  
            OR user_size = ANY(ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'company_size_applicability')))
            OR 'all' = ANY(ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'company_size_applicability')))
            -- Geographic relevance
            OR user_geography && ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'geographic_scope'))
            OR 'global' = ANY(ARRAY(SELECT jsonb_array_elements_text(d.content_metadata->'geographic_scope')))
        )
    ORDER BY 
        -- Combine similarity and context relevance
        ((vc.embedding <=> query_embedding) * 0.7 + (1 - context_relevance_score) * 0.3)
    LIMIT match_count;
END;
$$;

-- Function for AI acceleration aware search
CREATE OR REPLACE FUNCTION match_chunks_ai_accelerated(
    query_embedding VECTOR(1536),
    org_context JSONB DEFAULT '{}'::JSONB,
    prioritize_ai_content BOOLEAN DEFAULT TRUE,
    match_count INT DEFAULT 10
)
RETURNS TABLE (
    chunk_id UUID,
    content TEXT,
    document_title TEXT,
    similarity FLOAT,
    ai_acceleration_level TEXT,
    acceleration_factor FLOAT,
    traditional_timeline TEXT,
    ai_timeline TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        vc.id as chunk_id,
        vc.content,
        d.title as document_title,
        (vc.embedding <=> query_embedding) as similarity,
        (d.content_metadata->>'ai_acceleration_level') as ai_acceleration_level,
        COALESCE((d.content_metadata->>'acceleration_factor')::FLOAT, 1.0) as acceleration_factor,
        COALESCE((vc.chunk_metadata->'traditional_vs_ai_timeline'->>'traditional_months'), 'varies') as traditional_timeline,
        COALESCE((vc.chunk_metadata->'traditional_vs_ai_timeline'->>'ai_weeks'), 'varies') as ai_timeline
    FROM vector_chunks vc
    JOIN documents d ON vc.document_id = d.id
    WHERE (vc.embedding <=> query_embedding) < 0.3
    ORDER BY 
        CASE 
            WHEN prioritize_ai_content THEN
                -- Boost AI-accelerated content
                (vc.embedding <=> query_embedding) * 0.6 + 
                (CASE WHEN d.content_metadata->>'ai_acceleration_level' = 'very_high' THEN 0.0
                      WHEN d.content_metadata->>'ai_acceleration_level' = 'high' THEN 0.1
                      ELSE 0.2 END) * 0.4
            ELSE 
                (vc.embedding <=> query_embedding)
        END
    LIMIT match_count;
END;
$$;

-- ---------------------------------------------------------------------------
-- 4. INDEXES for optimal performance
-- ---------------------------------------------------------------------------

-- Vector similarity indexes
CREATE INDEX ON vector_chunks USING hnsw (embedding vector_cosine_ops) WITH (m = 32, ef_construction = 128);
CREATE INDEX ON vector_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Document metadata indexes for CAG filtering
CREATE INDEX idx_documents_content_metadata ON documents USING GIN (content_metadata);
CREATE INDEX idx_vector_chunks_chunk_metadata ON vector_chunks USING GIN (chunk_metadata);

-- Content classification indexes
CREATE INDEX idx_documents_source_type ON documents(source_type);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_language ON documents(language);

-- Chunk relationship indexes
CREATE INDEX idx_vector_chunks_document_id ON vector_chunks(document_id);
CREATE INDEX idx_vector_chunks_parent_chunk ON vector_chunks(parent_chunk_id) WHERE parent_chunk_id IS NOT NULL;
CREATE INDEX idx_vector_chunks_chunk_level ON vector_chunks(chunk_level);

-- Full-text search index
CREATE INDEX idx_vector_chunks_search ON vector_chunks USING GIN (search_keywords);

-- Deduplication indexes
CREATE INDEX idx_documents_sha256 ON documents(sha256) WHERE sha256 IS NOT NULL;
CREATE INDEX idx_vector_chunks_content_hash ON vector_chunks(content_hash);

-- Performance indexes
CREATE INDEX idx_documents_processed_at ON documents(processed_at) WHERE processed_at IS NOT NULL;
CREATE INDEX idx_vector_chunks_similarity_threshold ON vector_chunks(similarity_threshold);

-- ---------------------------------------------------------------------------
-- 5. RLS POLICIES - Consistent with application database patterns
-- ---------------------------------------------------------------------------

-- Documents are generally readable by all users (public compliance content)
-- But can be scoped by organization if needed
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_chunks ENABLE ROW LEVEL SECURITY;

-- Public read access for compliance content (most content)
CREATE POLICY documents_public_read ON documents
    FOR SELECT USING (true);

CREATE POLICY vector_chunks_public_read ON vector_chunks  
    FOR SELECT USING (true);

-- Admin write access
CREATE POLICY documents_admin_write ON documents
    FOR ALL USING ((current_setting('request.jwt.claims', true)::jsonb ->> 'is_admin')::boolean = true);

CREATE POLICY vector_chunks_admin_write ON vector_chunks
    FOR ALL USING ((current_setting('request.jwt.claims', true)::jsonb ->> 'is_admin')::boolean = true);

-- Organization-specific content policies (for custom content if needed)
CREATE POLICY documents_org_specific ON documents
    FOR SELECT USING (
        content_metadata->>'org_specific' IS NULL 
        OR content_metadata->>'org_id' = (current_setting('request.jwt.claims', true)::jsonb ->> 'org_id')
    );

-- ---------------------------------------------------------------------------
-- 6. SAMPLE DATA for AI Acceleration Content (ALL CONTENT TYPES)
-- ---------------------------------------------------------------------------

-- Insert ISO 27001 standard document
INSERT INTO documents (
    title, 
    source_type, 
    document_type, 
    content_category,
    content_metadata,
    processing_status
) VALUES (
    'ISO 27001:2022 - Information Security Management',
    'iso27001',
    'standard', 
    'controls',
    '{
        "industry_relevance": ["general", "b2b_saas", "fintech", "healthcare", "professional_services"],
        "company_size_applicability": ["small", "medium", "large"],
        "geographic_scope": ["global"],
        "complexity_level": "intermediate",
        "frameworks": ["iso27001"],
        "business_model_relevance": ["b2b", "b2c", "b2b2c"],
        "ai_acceleration_level": "high",
        "acceleration_factor": 9.0
    }',
    'completed'
);

-- Insert GDPR implementation guide
INSERT INTO documents (
    title,
    source_type,
    document_type, 
    content_category,
    content_metadata,
    processing_status
) VALUES (
    'GDPR Implementation Guide for Small Businesses',
    'gdpr',
    'implementation_guide',
    'requirements',
    '{
        "industry_relevance": ["general"],
        "company_size_applicability": ["small", "medium"], 
        "geographic_scope": ["eu", "uk"],
        "regulatory_jurisdictions": ["gdpr_territory"],
        "complexity_level": "basic",
        "frameworks": ["gdpr", "iso27701"],
        "ai_acceleration_level": "very_high",
        "acceleration_factor": 15.0,
        "user_experience_level": "beginner",
        "template_completeness": "production"
    }',
    'completed'
);

-- Insert B2B SaaS policy template
INSERT INTO documents (
    title,
    source_type,
    document_type,
    content_category, 
    content_metadata,
    processing_status
) VALUES (
    'B2B SaaS Data Security Policy Template',
    'policy_template',
    'policy_template',
    'templates',
    '{
        "industry_relevance": ["b2b_saas", "fintech"],
        "company_size_applicability": ["medium", "large"],
        "geographic_scope": ["usa", "global"],
        "complexity_level": "intermediate",
        "frameworks": ["soc2", "iso27001"],
        "business_model_relevance": ["b2b"],
        "tech_stack_relevance": ["aws", "azure", "gcp"],
        "ai_acceleration_level": "very_high",
        "acceleration_factor": 24.0,
        "template_completeness": "production"
    }',
    'completed'
);

-- Insert expert Q&A conversation
INSERT INTO documents (
    title,
    source_type,
    document_type,
    content_category,
    conversation_metadata,
    content_metadata,
    processing_status,
    expert_reviewed,
    quality_rating
) VALUES (
    'GDPR Data Breach Notification Requirements - Expert Q&A',
    'qa_bank',
    'conversation_log',
    'conversations',
    '{
        "conversation_type": "expert_consultation",
        "participant_roles": ["user", "gdpr_expert", "ai_assistant"],
        "conversation_length": 8,
        "resolution_status": "resolved",
        "quality_score": 4.8,
        "expertise_level": "expert",
        "question_categories": ["gdpr_compliance", "breach_notification"],
        "answer_confidence": 0.95,
        "human_verified": true,
        "reusability_score": 0.92
    }',
    '{
        "industry_relevance": ["general"],
        "company_size_applicability": ["all"],
        "geographic_scope": ["eu", "uk"],
        "regulatory_jurisdictions": ["gdpr_territory"],
        "complexity_level": "intermediate",
        "frameworks": ["gdpr"],
        "ai_acceleration_level": "high",
        "acceleration_factor": 8.0,
        "content_freshness": "2024-12-15",
        "interaction_quality": "high",
        "user_experience_level": "intermediate",
        "conversational_context": ["incident_response", "compliance_verification"]
    }',
    'completed',
    TRUE,
    4.8
);

-- Insert document summary
INSERT INTO documents (
    title,
    source_type,
    document_type,
    content_category,
    summary_metadata,
    content_metadata,
    processing_status
) VALUES (
    'ISO 27001 Control Implementation - Executive Summary',
    'iso27001',
    'document_summary',
    'summaries',
    '{
        "original_document_id": null,
        "summary_type": "executive",
        "summary_length": "brief",
        "key_topics": ["control_implementation", "risk_management", "audit_readiness"],
        "action_items_count": 3,
        "compliance_relevance": ["iso27001"],
        "target_audience": "executives"
    }',
    '{
        "industry_relevance": ["general"],
        "company_size_applicability": ["medium", "large"],
        "geographic_scope": ["global"],
        "complexity_level": "basic",
        "frameworks": ["iso27001"],
        "ai_acceleration_level": "very_high",
        "acceleration_factor": 12.0,
        "user_experience_level": "beginner",
        "conversational_context": ["audit_prep", "executive_briefing"]
    }',
    'completed'
);

-- Insert user interaction/conversation
INSERT INTO documents (
    title,
    source_type,
    document_type,
    content_category,
    conversation_metadata,
    content_metadata,
    processing_status,
    quality_rating
) VALUES (
    'Small Business CCPA Implementation Discussion',
    'conversation',
    'conversation_log',
    'user_interactions',
    '{
        "conversation_type": "user_support",
        "participant_roles": ["user", "ai_assistant"],
        "conversation_length": 12,
        "resolution_status": "resolved",
        "quality_score": 4.2,
        "expertise_level": "beginner",
        "question_categories": ["ccpa_compliance", "small_business"],
        "answer_confidence": 0.78,
        "human_verified": false,
        "reusability_score": 0.85
    }',
    '{
        "industry_relevance": ["ecommerce", "b2b_saas"],
        "company_size_applicability": ["small"],
        "geographic_scope": ["usa"],
        "regulatory_jurisdictions": ["ccpa_scope"],
        "complexity_level": "basic",
        "frameworks": ["ccpa"],
        "ai_acceleration_level": "high",
        "acceleration_factor": 10.0,
        "content_freshness": "2024-12-10",
        "interaction_quality": "medium",
        "user_experience_level": "beginner",
        "conversational_context": ["onboarding", "implementation"]
    }',
    'completed',
    4.2
);

-- ---------------------------------------------------------------------------
-- 7. UTILITY FUNCTIONS
-- ---------------------------------------------------------------------------

-- Function to update search keywords when content changes
CREATE OR REPLACE FUNCTION update_search_keywords()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_keywords := to_tsvector('english', NEW.content);
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vector_chunks_search_update
    BEFORE INSERT OR UPDATE OF content ON vector_chunks
    FOR EACH ROW
    EXECUTE FUNCTION update_search_keywords();

-- Function to update document chunk count
CREATE OR REPLACE FUNCTION update_document_chunk_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE documents 
        SET total_chunks = total_chunks + 1, updated_at = NOW()
        WHERE id = NEW.document_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE documents 
        SET total_chunks = total_chunks - 1, updated_at = NOW()
        WHERE id = OLD.document_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER document_chunk_count_update
    AFTER INSERT OR DELETE ON vector_chunks
    FOR EACH ROW
    EXECUTE FUNCTION update_document_chunk_count();

-- ---------------------------------------------------------------------------
-- COMMENTS for documentation
-- ---------------------------------------------------------------------------

COMMENT ON TABLE documents IS 'Source documents and content metadata for RAG system with CAG filtering support';
COMMENT ON TABLE vector_chunks IS 'Chunked content with embeddings and organizational applicability metadata';

COMMENT ON COLUMN documents.content_metadata IS 'Metadata describing what types of organizations this content applies to - used for CAG filtering';
COMMENT ON COLUMN vector_chunks.chunk_metadata IS 'Chunk-specific metadata that can override or enhance document-level metadata';

COMMENT ON FUNCTION match_chunks_with_context IS 'CAG-aware vector similarity search that filters results based on organizational context';
COMMENT ON FUNCTION match_chunks_ai_accelerated IS 'Vector search that prioritizes AI-acceleration content and provides timeline comparisons';

-- End of Production Supabase Vector Database Schema