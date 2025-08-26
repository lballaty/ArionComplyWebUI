-- ===========================================================================
-- CAG (Context-Augmented Generation) Database Schema Enhancement
-- Extends existing ArionComply schema with organizational intelligence tables
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. ORGANIZATIONAL PROFILES - Core context intelligence
-- ---------------------------------------------------------------------------

CREATE TABLE organizational_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Business Context Dimension
    business_context JSONB NOT NULL DEFAULT '{}'::JSONB,
    /*
    Structure:
    {
      "industry_primary": "technology|professional_services|manufacturing|retail|healthcare|financial_services|education|government|non_profit",
      "industry_secondary": "fintech|healthtech|edtech|ecommerce|b2b_saas|marketplace|consulting|accounting|legal|cybersecurity|martech|proptech|insurtech|automotive|food_production|electronics",
      "business_model": "b2b|b2c|b2b2c|marketplace|subscription|transaction|service|product|hybrid",
      "company_size": "1-10|11-50|51-200|201-500|501-1000|1000+",
      "revenue_stage": "pre_revenue|<1M|1M-10M|10M-50M|50M-100M|100M+",
      "growth_stage": "startup|early_growth|rapid_growth|mature|transformation|declining",
      "geographic_scope": "local|regional|national|international|global",
      "geographic_presence": {
        "countries": ["usa", "canada", "mexico", "uk", "germany", "france", "netherlands", "ireland", "australia", "singapore", "japan"],
        "us_states": ["california", "virginia", "colorado", "connecticut", "utah", "texas", "new_york", "illinois", "washington"],
        "eu_member_states": ["germany", "france", "netherlands", "ireland", "spain", "italy", "poland", "denmark", "sweden"],
        "regulatory_jurisdictions": ["gdpr_territory", "ccpa_scope", "pipeda_scope", "uk_gdpr_scope", "lgpd_scope"]
      },
      "customer_types": ["enterprise", "smb", "consumer", "government", "non_profit"],
      "revenue_model": "subscription|licensing|services|transaction_fees|advertising|product_sales|hybrid"
    }
    */
    
    -- Operational Context Dimension  
    operational_context JSONB NOT NULL DEFAULT '{}'::JSONB,
    /*
    Structure:
    {
      "primary_tech_stack": "aws|azure|gcp|hybrid_cloud|on_premise|multi_cloud",
      "development_maturity": "no_development|basic|intermediate|advanced|enterprise",
      "it_resources": "outsourced|part_time_person|dedicated_person|small_team|large_team|enterprise_it",
      "data_sensitivity": "public|internal|confidential|highly_sensitive|classified",
      "compliance_maturity": "none|basic|developing|mature|advanced",
      "change_velocity": "rapid|moderate|conservative|highly_controlled",
      "remote_work_model": "fully_remote|hybrid|primarily_onsite|location_dependent",
      "vendor_management": "minimal_vendors|selective|diverse_ecosystem|vendor_dependent",
      "business_continuity_needs": "basic|moderate|high|mission_critical",
      "integration_complexity": "simple|moderate|complex|highly_integrated"
    }
    */
    
    -- Decision-Making Structure Dimension
    decision_structure JSONB NOT NULL DEFAULT '{}'::JSONB,
    /*
    Structure:
    {
      "authority_model": "founder_led|executive_team|departmental|committee_based|matrix",
      "decision_speed": "immediate|days|weeks|months|quarters",
      "approval_complexity": "single_person|simple_chain|complex_matrix|board_required",
      "budget_authority_level": "department|executive|board|investor",
      "change_management_style": "informal|structured|formal_process|enterprise_framework",
      "risk_assessment_approach": "intuitive|basic_analysis|formal_process|comprehensive_framework"
    }
    */
    
    -- Cultural Characteristics Dimension
    cultural_characteristics JSONB NOT NULL DEFAULT '{}'::JSONB,
    /*
    Structure:
    {
      "risk_tolerance": "very_high|high|moderate|low|very_conservative",
      "innovation_appetite": "early_adopter|fast_follower|mainstream|conservative|laggard",
      "formality_preference": "very_informal|casual|professional|formal|highly_formal",
      "documentation_culture": "minimal|basic|comprehensive|exhaustive",
      "communication_style": "direct|collaborative|hierarchical|consensus_driven",
      "learning_preference": "self_directed|guided|hands_on|expert_led|peer_learning",
      "conflict_resolution": "direct_confrontation|collaborative|hierarchical|avoidance",
      "success_measurement_focus": "financial|operational|customer|innovation|compliance"
    }
    */
    
    -- Compliance-Specific Context Dimension
    compliance_profile JSONB NOT NULL DEFAULT '{}'::JSONB,
    /*
    Structure:
    {
      "current_certifications": ["iso27001", "iso27701", "soc2", "pci_dss", "hipaa", "gdpr", "eu_ai_act"],
      "compliance_experience_level": "none|basic|intermediate|advanced|expert",
      "compliance_drivers": ["legal_requirement", "customer_demand", "competitive_advantage", "risk_management", "investor_requirement"],
      "audit_frequency": "never|annual|bi_annual|quarterly|ongoing",
      "compliance_budget_approach": "minimal|adequate|generous|comprehensive",
      "previous_compliance_experience": "none|failed_attempts|basic_success|extensive_success|expert_level",
      "overwhelm_tolerance": "very_high|high|moderate|low|very_sensitive",
      "support_needs": "minimal|moderate|high_touch|expert_guidance|full_service",
      "implementation_preference": "diy|guided_self_service|consultant_led|fully_managed",
      "documentation_preference": "templates_only|guided_completion|collaborative_creation|expert_written"
    }
    */
    
    -- Derived Classifications
    archetype_classification TEXT,
    -- Primary archetypes: "b2b_saas_growth", "ecommerce_smb", "professional_services", 
    -- "manufacturing_digital", "fintech_regulated", "global_smb", "ai_adopting_smb"
    
    archetype_confidence DECIMAL(3,2) DEFAULT 0.50,
    -- Confidence in archetype classification (0.0-1.0)
    
    -- Behavioral Learning (Post-MVP)
    behavioral_profile JSONB NOT NULL DEFAULT '{}'::JSONB,
    /*
    Structure: (Collected over time through usage)
    {
      "usage_patterns": {},
      "implementation_success_rate": 0.85,
      "preferred_guidance_format": "structured_plan|conversational|templates|workflows",
      "feature_adoption_rate": {},
      "learning_velocity": "fast|moderate|slow",
      "evolution_trajectory": "systematic_maturation|rapid_adaptation|conservative_adoption"
    }
    */
    
    -- Metadata
    profiling_completeness DECIMAL(3,2) DEFAULT 0.00,
    -- Percentage of context dimensions completed (0.0-1.0)
    
    last_behavioral_update TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_confidence CHECK (archetype_confidence >= 0.0 AND archetype_confidence <= 1.0),
    CONSTRAINT valid_completeness CHECK (profiling_completeness >= 0.0 AND profiling_completeness <= 1.0)
);

-- ---------------------------------------------------------------------------
-- 2. COMPLIANCE OBLIGATIONS ASSESSMENT - Dynamic requirements tracking
-- ---------------------------------------------------------------------------

CREATE TABLE compliance_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Obligation Classification
    obligation_type TEXT NOT NULL,
    -- "mandatory_legal", "business_driven", "industry_best_practice", "emerging_requirement"
    
    standard_framework TEXT NOT NULL,
    -- "gdpr", "ccpa", "cpra", "cdpa", "cpa", "ctdpa", "ucpa", "eu_ai_act", "iso27001", "iso27701", "iso42001", "soc2", "pci_dss", "hipaa", "nist_cybersecurity", "uk_gdpr", "pipeda", "lgpd"
    
    -- Geographic Context
    applicable_jurisdictions JSONB NOT NULL DEFAULT '[]'::JSONB,
    /*
    Structure: Specific jurisdictions where this obligation applies
    {
      "countries": ["usa", "germany", "france"],
      "us_states": ["california", "virginia", "colorado"],
      "eu_member_states": ["germany", "france", "netherlands"],
      "regulatory_territories": ["gdpr_territory", "ccpa_scope"]
    }
    */
    
    -- Hierarchical Regulation Relationships
    parent_regulation TEXT,
    -- Links state/local regulations to federal/supranational frameworks
    -- e.g., "ccpa" is parent for California businesses, "gdpr" is parent for EU member states
    
    regulation_hierarchy_level TEXT DEFAULT 'primary',
    -- "supranational" (EU Directives), "federal" (US Federal), "state" (US States), "provincial" (Canadian), "local"
    
    -- Applicability Assessment
    applicability_reason TEXT NOT NULL,
    -- "california_residents", "eu_data_subjects", "virginia_consumers", "ai_systems_eu_market", "enterprise_sales_requirement", "payment_processing", "healthcare_data", etc.
    
    priority_level TEXT NOT NULL DEFAULT 'medium',
    -- "critical", "high", "medium", "low"
    
    implementation_timeline TEXT,
    -- With AI acceleration: "immediate", "2_weeks", "1_month", "2_months", "3_months", "6_months" (note: significantly reduced from traditional timelines)
    
    traditional_timeline TEXT,
    -- Traditional non-AI timeline for comparison: "6_months", "12_months", "18_months", "24_months"
    
    ai_acceleration_factor DECIMAL(3,2) DEFAULT 3.00,
    -- How much faster with ArionComply AI (e.g., 3.0 = 3x faster)
    
    -- Business Context
    business_justification TEXT,
    estimated_effort TEXT, -- "minimal", "low", "moderate", "high" (with AI assistance)
    traditional_effort TEXT, -- Traditional effort level for comparison
    estimated_cost_range TEXT, -- "minimal", "moderate", "significant", "major_investment"
    
    -- AI-Enhanced Implementation Support
    ai_automation_level TEXT DEFAULT 'high',
    -- "full_automation", "high", "moderate", "low" - how much ArionComply can automate
    
    ai_generated_artifacts JSONB DEFAULT '[]'::JSONB,
    /*
    Structure: What ArionComply can auto-generate
    {
      "documents": ["privacy_policy", "security_policy", "data_processing_records", "privacy_notices"],
      "assessments": ["risk_assessment", "dpia", "pia", "gap_analysis"],
      "workflows": ["incident_response", "dsar_handling", "breach_notification"],
      "monitoring": ["compliance_dashboards", "audit_preparation", "evidence_collection"]
    }
    */
    
    -- Dynamic Assessment Metadata
    assessment_confidence DECIMAL(3,2) DEFAULT 0.75,
    last_assessment_date TIMESTAMPTZ DEFAULT NOW(),
    assessment_method TEXT DEFAULT 'automated_profiling',
    -- "automated_profiling", "expert_review", "customer_input", "regulatory_update"
    
    -- Status Tracking
    implementation_status TEXT DEFAULT 'identified',
    -- "identified", "planned", "in_progress", "ai_generated", "human_reviewed", "completed", "deferred", "not_applicable"
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_confidence CHECK (assessment_confidence >= 0.0 AND assessment_confidence <= 1.0),
    CONSTRAINT valid_priority CHECK (priority_level IN ('critical', 'high', 'medium', 'low')),
    CONSTRAINT valid_status CHECK (implementation_status IN ('identified', 'planned', 'in_progress', 'ai_generated', 'human_reviewed', 'completed', 'deferred', 'not_applicable')),
    CONSTRAINT valid_acceleration CHECK (ai_acceleration_factor >= 1.0 AND ai_acceleration_factor <= 10.0)
);

-- ---------------------------------------------------------------------------
-- 3. CONTEXT APPLICATION RULES - CAG behavior engine
-- ---------------------------------------------------------------------------

CREATE TABLE context_application_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Rule Identification
    rule_name TEXT NOT NULL UNIQUE,
    rule_category TEXT NOT NULL,
    -- "document_customization", "guidance_adaptation", "workflow_sequencing", "communication_style", "learning_approach"
    
    -- Applicability Conditions (JSON query conditions)
    organizational_conditions JSONB NOT NULL,
    /*
    Structure: Conditions for when rule applies
    {
      "business_context": {
        "industry_secondary": ["fintech", "healthtech"],
        "company_size": ["11-50", "51-200"],
        "business_model": ["b2b", "b2b2c"]
      },
      "operational_context": {
        "primary_tech_stack": ["aws", "azure"],
        "compliance_maturity": ["basic", "developing"]
      },
      "cultural_characteristics": {
        "formality_preference": ["professional", "formal"],
        "support_needs": ["high_touch", "expert_guidance"]
      }
    }
    */
    
    -- Content/Behavior Modifications
    content_modifications JSONB NOT NULL,
    /*
    Structure: How to modify content/behavior when rule applies
    {
      "template_customizations": {
        "language_style": "professional_formal",
        "example_types": ["fintech_examples", "small_team_examples"],
        "complexity_level": "intermediate",
        "section_emphasis": ["financial_controls", "small_team_procedures"]
      },
      "guidance_adaptations": {
        "explanation_depth": "detailed",
        "terminology_level": "business_friendly",
        "step_granularity": "granular",
        "prerequisite_assumptions": ["limited_it_resources", "external_audit_requirement"]
      },
      "workflow_modifications": {
        "implementation_sequencing": ["basic_policies_first", "external_validation_early"],
        "approval_considerations": ["executive_sign_off_required"],
        "timeline_adjustments": ["extra_review_time", "phased_rollout"]
      }
    }
    */
    
    -- Scope and Priority
    framework_scope TEXT[] DEFAULT ARRAY[]::TEXT[],
    -- Which compliance frameworks this rule affects: ["iso27001", "gdpr", "soc2"]
    
    output_modes TEXT[] DEFAULT ARRAY[]::TEXT[],
    -- Which output types this rule affects: ["conversational", "document_template", "implementation_guide", "governance_tools"]
    
    rule_priority INTEGER DEFAULT 100,
    -- Lower numbers = higher priority for conflicting rules
    
    -- Rule Metadata
    rule_description TEXT,
    created_by TEXT DEFAULT 'system',
    active BOOLEAN DEFAULT true,
    testing_mode BOOLEAN DEFAULT false,
    
    -- Performance Tracking
    application_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_priority CHECK (rule_priority > 0),
    CONSTRAINT valid_success_rate CHECK (success_rate IS NULL OR (success_rate >= 0.0 AND success_rate <= 1.0))
);

-- ---------------------------------------------------------------------------
-- 4. ORGANIZATIONAL ARCHETYPE DEFINITIONS - Expert-curated patterns
-- ---------------------------------------------------------------------------

CREATE TABLE organizational_archetypes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Archetype Definition
    archetype_name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Characteristic Patterns (Template for matching)
    characteristic_patterns JSONB NOT NULL,
    /*
    Structure: Typical characteristics of this archetype
    {
      "business_context": {
        "industry_secondary": ["b2b_saas", "marketplace"],
        "company_size": ["51-200", "201-500"],
        "business_model": ["b2b", "subscription"],
        "growth_stage": ["rapid_growth", "mature"],
        "customer_types": ["enterprise", "smb"]
      },
      "operational_context": {
        "primary_tech_stack": ["aws", "azure", "gcp"],
        "development_maturity": ["intermediate", "advanced"],
        "compliance_maturity": ["developing", "mature"]
      },
      "typical_obligations": ["soc2", "iso27001", "gdpr"],
      "common_challenges": ["enterprise_sales_requirements", "multi_jurisdiction_operations"],
      "implementation_preferences": ["guided_self_service", "consultant_led"]
    }
    */
    
    -- Matching Criteria
    matching_rules JSONB NOT NULL,
    /*
    Structure: Rules for identifying this archetype
    {
      "required_conditions": {
        "business_context.industry_secondary": ["b2b_saas"],
        "business_context.company_size": ["51-200", "201-500"],
        "business_context.customer_types": {"contains": ["enterprise"]}
      },
      "weighted_indicators": {
        "operational_context.primary_tech_stack": {"aws": 0.8, "azure": 0.7, "gcp": 0.8},
        "compliance_profile.compliance_drivers": {"customer_demand": 0.9, "competitive_advantage": 0.7}
      },
      "minimum_confidence_threshold": 0.70
    }
    */
    
    -- Compliance Guidance Customizations
    compliance_customizations JSONB NOT NULL DEFAULT '{}'::JSONB,
    /*
    Structure: How to customize compliance guidance for this archetype
    {
      "priority_frameworks": ["soc2", "iso27001", "gdpr"],
      "implementation_sequence": ["basic_policies", "soc2_preparation", "iso27001_expansion"],
      "common_templates": ["saas_privacy_policy", "enterprise_security_policy", "vendor_management_procedures"],
      "typical_timeline": "6-12_months",
      "resource_requirements": "dedicated_person_plus_consultant",
      "success_patterns": ["phased_implementation", "external_audit_early", "customer_communication_proactive"]
    }
    */
    
    -- Learning and Evolution
    usage_frequency INTEGER DEFAULT 0,
    accuracy_feedback DECIMAL(3,2),
    
    -- Metadata
    expert_curated BOOLEAN DEFAULT true,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_accuracy CHECK (accuracy_feedback IS NULL OR (accuracy_feedback >= 0.0 AND accuracy_feedback <= 1.0))
);

-- ---------------------------------------------------------------------------
-- 5. CAG SESSION TRACKING - Enhanced AI observability for context
-- ---------------------------------------------------------------------------

CREATE TABLE cag_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Session Identification (extends existing ai_sessions pattern)
    session_id UUID NOT NULL, -- Links to existing ai_sessions
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    
    -- Context Application Tracking
    organizational_context_used JSONB NOT NULL,
    -- Snapshot of organizational context at time of interaction
    
    applied_rules TEXT[], -- Array of context_application_rules.rule_name that were applied
    archetype_used TEXT, -- organizational_archetypes.archetype_name if applied
    context_confidence DECIMAL(3,2),
    
    -- CAG-Specific Metrics
    context_relevance_score DECIMAL(3,2),
    -- How well organizational context matched the request (0.0-1.0)
    
    personalization_impact TEXT,
    -- "high", "medium", "low", "none" - how much context changed the output
    
    user_context_feedback JSONB,
    -- User feedback on relevance of contextualized response
    /*
    Structure:
    {
      "relevance_rating": 4, // 1-5 scale
      "context_accuracy": "accurate", // "accurate", "partially_accurate", "inaccurate"
      "usefulness": "very_helpful", // "very_helpful", "helpful", "somewhat_helpful", "not_helpful"
      "feedback_text": "The examples were perfect for our SaaS company"
    }
    */
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_context_confidence CHECK (context_confidence >= 0.0 AND context_confidence <= 1.0),
    CONSTRAINT valid_relevance_score CHECK (context_relevance_score >= 0.0 AND context_relevance_score <= 1.0)
);

-- ---------------------------------------------------------------------------
-- 6. INDEXES for Performance
-- ---------------------------------------------------------------------------

-- Organizational Profiles
CREATE INDEX idx_org_profiles_org_id ON organizational_profiles(org_id);
CREATE INDEX idx_org_profiles_archetype ON organizational_profiles(archetype_classification) WHERE archetype_classification IS NOT NULL;
CREATE INDEX idx_org_profiles_business_context ON organizational_profiles USING GIN (business_context);
CREATE INDEX idx_org_profiles_operational_context ON organizational_profiles USING GIN (operational_context);

-- Compliance Obligations  
CREATE INDEX idx_compliance_obligations_org_id ON compliance_obligations(org_id);
CREATE INDEX idx_compliance_obligations_framework ON compliance_obligations(standard_framework);
CREATE INDEX idx_compliance_obligations_priority ON compliance_obligations(priority_level, implementation_timeline);
CREATE INDEX idx_compliance_obligations_status ON compliance_obligations(implementation_status);

-- Context Application Rules
CREATE INDEX idx_context_rules_category ON context_application_rules(rule_category) WHERE active = true;
CREATE INDEX idx_context_rules_conditions ON context_application_rules USING GIN (organizational_conditions) WHERE active = true;
CREATE INDEX idx_context_rules_priority ON context_application_rules(rule_priority) WHERE active = true;

-- CAG Sessions
CREATE INDEX idx_cag_sessions_org_id ON cag_sessions(org_id);
CREATE INDEX idx_cag_sessions_session_id ON cag_sessions(session_id);
CREATE INDEX idx_cag_sessions_archetype ON cag_sessions(archetype_used) WHERE archetype_used IS NOT NULL;
CREATE INDEX idx_cag_sessions_created_at ON cag_sessions(created_at);

-- ---------------------------------------------------------------------------
-- 7. RLS POLICIES - Multi-tenant security
-- ---------------------------------------------------------------------------

-- Enable RLS on all new tables
ALTER TABLE organizational_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE context_application_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizational_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cag_sessions ENABLE ROW LEVEL SECURITY;

-- Organizational Profiles Policies
CREATE POLICY select_org_profiles ON organizational_profiles
  FOR SELECT USING (has_org_access(org_id));
CREATE POLICY insert_org_profiles ON organizational_profiles  
  FOR INSERT WITH CHECK (has_org_access(org_id));
CREATE POLICY update_org_profiles ON organizational_profiles
  FOR UPDATE USING (has_org_access(org_id));
CREATE POLICY delete_org_profiles ON organizational_profiles
  FOR DELETE USING (has_org_access(org_id));

-- Compliance Obligations Policies  
CREATE POLICY select_compliance_obligations ON compliance_obligations
  FOR SELECT USING (has_org_access(org_id));
CREATE POLICY insert_compliance_obligations ON compliance_obligations
  FOR INSERT WITH CHECK (has_org_access(org_id));
CREATE POLICY update_compliance_obligations ON compliance_obligations
  FOR UPDATE USING (has_org_access(org_id));
CREATE POLICY delete_compliance_obligations ON compliance_obligations
  FOR DELETE USING (has_org_access(org_id));

-- Context Application Rules (Global, but can be filtered by admin role)
CREATE POLICY select_context_rules ON context_application_rules
  FOR SELECT USING (true); -- Global read access
CREATE POLICY modify_context_rules ON context_application_rules
  FOR ALL USING ((current_setting('request.jwt.claims', true)::jsonb ->> 'is_admin')::boolean = true);

-- Organizational Archetypes (Global read, admin write)
CREATE POLICY select_archetypes ON organizational_archetypes
  FOR SELECT USING (true); -- Global read access
CREATE POLICY modify_archetypes ON organizational_archetypes  
  FOR ALL USING ((current_setting('request.jwt.claims', true)::jsonb ->> 'is_admin')::boolean = true);

-- CAG Sessions Policies
CREATE POLICY select_cag_sessions ON cag_sessions
  FOR SELECT USING (has_org_access(org_id));
CREATE POLICY insert_cag_sessions ON cag_sessions
  FOR INSERT WITH CHECK (has_org_access(org_id));

-- ---------------------------------------------------------------------------
-- 8. FUNCTIONS - CAG utility functions
-- ---------------------------------------------------------------------------

-- Function to calculate archetype matching score
CREATE OR REPLACE FUNCTION calculate_archetype_match_score(
    profile_context JSONB,
    archetype_patterns JSONB
) RETURNS DECIMAL(3,2) AS $$
DECLARE
    score DECIMAL(5,2) := 0.0;
    max_score DECIMAL(5,2) := 0.0;
    condition_key TEXT;
    condition_value JSONB;
    profile_value TEXT;
BEGIN
    -- Simplified matching logic (can be enhanced)
    -- Check required conditions first
    IF archetype_patterns ? 'required_conditions' THEN
        FOR condition_key IN SELECT jsonb_object_keys(archetype_patterns->'required_conditions')
        LOOP
            condition_value := archetype_patterns->'required_conditions'->condition_key;
            profile_value := profile_context #>> string_to_array(condition_key, '.');
            
            max_score := max_score + 1.0;
            
            IF condition_value ? profile_value THEN
                score := score + 1.0;
            END IF;
        END LOOP;
    END IF;
    
    -- Return normalized score
    IF max_score > 0 THEN
        RETURN LEAST(1.0, score / max_score);
    ELSE
        RETURN 0.0;
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to assess compliance obligations for an organization
CREATE OR REPLACE FUNCTION assess_compliance_obligations(target_org_id UUID) 
RETURNS TABLE (
    framework TEXT,
    obligation_type TEXT,
    priority TEXT,
    reason TEXT,
    applicable_jurisdictions JSONB,
    ai_timeline TEXT,
    traditional_timeline TEXT,
    acceleration_factor DECIMAL(3,2),
    confidence DECIMAL(3,2)
) AS $
DECLARE
    org_profile RECORD;
    industry_secondary TEXT;
    geographic_presence JSONB;
    business_model TEXT;
    customer_types TEXT[];
    countries TEXT[];
    us_states TEXT[];
    eu_states TEXT[];
BEGIN
    -- Get organizational profile
    SELECT * INTO org_profile FROM organizational_profiles WHERE org_id = target_org_id;
    
    IF org_profile IS NULL THEN
        RETURN;
    END IF;
    
    -- Extract key context variables
    industry_secondary := org_profile.business_context->>'industry_secondary';
    geographic_presence := org_profile.business_context->'geographic_presence';
    business_model := org_profile.business_context->>'business_model';
    customer_types := ARRAY(SELECT jsonb_array_elements_text(org_profile.business_context->'customer_types'));
    countries := ARRAY(SELECT jsonb_array_elements_text(geographic_presence->'countries'));
    us_states := ARRAY(SELECT jsonb_array_elements_text(geographic_presence->'us_states'));
    eu_states := ARRAY(SELECT jsonb_array_elements_text(geographic_presence->'eu_member_states'));
    
    -- GDPR Assessment (EU presence or EU data subjects)
    IF array_length(eu_states, 1) > 0 OR 'gdpr_territory' = ANY(ARRAY(SELECT jsonb_array_elements_text(geographic_presence->'regulatory_jurisdictions'))) THEN
        framework := 'gdpr';
        obligation_type := 'mandatory_legal';
        priority := 'critical';
        reason := 'eu_data_subjects_or_operations';
        applicable_jurisdictions := json_build_object(
            'regulatory_territories', ARRAY['gdpr_territory'],
            'eu_member_states', COALESCE(us_states, ARRAY[]::TEXT[])
        );
        ai_timeline := '1_month';
        traditional_timeline := '12_months';
        acceleration_factor := 12.0;
        confidence := 0.95;
        RETURN NEXT;
    END IF;
    
    -- US State Privacy Laws Assessment
    IF 'california' = ANY(us_states) OR 'ccpa_scope' = ANY(ARRAY(SELECT jsonb_array_elements_text(geographic_presence->'regulatory_jurisdictions'))) THEN
        framework := 'ccpa';
        obligation_type := 'mandatory_legal';
        priority := 'critical';
        reason := 'california_consumers_or_residents';
        applicable_jurisdictions := json_build_object(
            'countries', ARRAY['usa'],
            'us_states', ARRAY['california'],
            'regulatory_territories', ARRAY['ccpa_scope']
        );
        ai_timeline := '2_weeks';
        traditional_timeline := '6_months';
        acceleration_factor := 12.0;
        confidence := 0.95;
        RETURN NEXT;
    END IF;
    
    IF 'virginia' = ANY(us_states) THEN
        framework := 'cdpa';
        obligation_type := 'mandatory_legal';
        priority := 'high';
        reason := 'virginia_consumer_data_protection';
        applicable_jurisdictions := json_build_object(
            'countries', ARRAY['usa'],
            'us_states', ARRAY['virginia']
        );
        ai_timeline := '2_weeks';
        traditional_timeline := '4_months';
        acceleration_factor := 8.0;
        confidence := 0.90;
        RETURN NEXT;
    END IF;
    
    IF 'colorado' = ANY(us_states) THEN
        framework := 'cpa';
        obligation_type := 'mandatory_legal';
        priority := 'high';
        reason := 'colorado_privacy_act_compliance';
        applicable_jurisdictions := json_build_object(
            'countries', ARRAY['usa'],
            'us_states', ARRAY['colorado']
        );
        ai_timeline := '2_weeks';
        traditional_timeline := '4_months';
        acceleration_factor := 8.0;
        confidence := 0.90;
        RETURN NEXT;
    END IF;
    
    -- SOC 2 Assessment (B2B companies with enterprise customers)
    IF business_model IN ('b2b', 'b2b2c') AND 'enterprise' = ANY(customer_types) THEN
        framework := 'soc2';
        obligation_type := 'business_driven';
        priority := 'high';
        reason := 'enterprise_sales_requirement';
        applicable_jurisdictions := json_build_object(
            'business_requirement', true,
            'customer_driven', true
        );
        ai_timeline := '2_months';
        traditional_timeline := '12_months';
        acceleration_factor := 6.0;
        confidence := 0.85;
        RETURN NEXT;
    END IF;
    
    -- ISO 27001 Assessment
    IF industry_secondary IN ('b2b_saas', 'fintech', 'healthtech', 'consulting', 'professional_services') THEN
        framework := 'iso27001';
        obligation_type := 'business_driven';
        priority := CASE 
            WHEN industry_secondary IN ('fintech', 'healthtech') THEN 'critical'
            ELSE 'high'
        END;
        reason := 'competitive_advantage_and_customer_requirements';
        applicable_jurisdictions := json_build_object(
            'business_requirement', true,
            'global_standard', true
        );
        ai_timeline := '2_months';
        traditional_timeline := '18_months';
        acceleration_factor := 9.0;
        confidence := 0.80;
        RETURN NEXT;
    END IF;
    
    -- EU AI Act Assessment (AI systems + EU market)
    IF (array_length(eu_states, 1) > 0 OR 'gdpr_territory' = ANY(ARRAY(SELECT jsonb_array_elements_text(geographic_presence->'regulatory_jurisdictions')))) 
       AND industry_secondary IN ('b2b_saas', 'healthtech', 'fintech', 'ecommerce') THEN
        framework := 'eu_ai_act';
        obligation_type := 'mandatory_legal';
        priority := 'high';
        reason := 'ai_systems_eu_market';
        applicable_jurisdictions := json_build_object(
            'regulatory_territories', ARRAY['gdpr_territory'],
            'eu_member_states', COALESCE(eu_states, ARRAY[]::TEXT[])
        );
        ai_timeline := '1_month';
        traditional_timeline := '24_months';
        acceleration_factor := 24.0;
        confidence := 0.75;
        RETURN NEXT;
    END IF;
    
END;
$ LANGUAGE plpgsql STABLE;

-- ---------------------------------------------------------------------------
-- 9. INITIAL DATA - Core archetypes
-- ---------------------------------------------------------------------------

-- Insert primary organizational archetypes
INSERT INTO organizational_archetypes (archetype_name, display_name, description, characteristic_patterns, matching_rules, compliance_customizations) VALUES

('b2b_saas_growth', 'B2B SaaS Growth Company', 
 'Growing B2B SaaS company targeting enterprise customers, cloud-native, needing SOC 2 + ISO 27001 for sales - AI-accelerated implementation in 2-3 months vs traditional 12-18 months',
 '{
   "business_context": {
     "industry_secondary": ["b2b_saas", "marketplace"],
     "company_size": ["51-200", "201-500"],
     "business_model": ["b2b", "subscription"],
     "customer_types": ["enterprise", "smb"],
     "primary_tech_stack": ["aws", "azure", "gcp"],
     "geographic_presence": {
       "countries": ["usa", "uk", "germany", "france", "canada"],
       "regulatory_jurisdictions": ["gdpr_territory", "ccpa_scope"]
     }
   },
   "typical_obligations": ["soc2", "iso27001", "gdpr", "ccpa"],
   "common_challenges": ["enterprise_sales_requirements", "scalability", "multi_tenant_security"],
   "ai_acceleration_benefits": ["automated_policy_generation", "evidence_collection", "gap_analysis", "audit_preparation"]
 }',
 '{
   "required_conditions": {
     "business_context.industry_secondary": ["b2b_saas"],
     "business_context.business_model": ["b2b", "subscription"]
   },
   "weighted_indicators": {
     "business_context.customer_types": {"enterprise": 0.9},
     "operational_context.primary_tech_stack": {"aws": 0.8, "azure": 0.8, "gcp": 0.8}
   },
   "minimum_confidence_threshold": 0.70
 }',
 '{
   "priority_frameworks": ["soc2", "iso27001", "gdpr", "ccpa"],
   "ai_accelerated_sequence": ["automated_gap_assessment", "ai_generated_policies", "evidence_automation", "audit_preparation"],
   "ai_timeline": "2-3_months",
   "traditional_timeline": "12-18_months", 
   "acceleration_factor": 6.0,
   "resource_requirements": "1_dedicated_person_with_ai_platform",
   "traditional_resources": "dedicated_team_plus_consultant",
   "ai_automation_level": "high",
   "success_patterns": ["ai_guided_implementation", "automated_evidence_collection", "real_time_compliance_monitoring"]
 }'
),

('professional_services', 'Professional Services Firm',
 'Consulting, accounting, legal, or advisory firm handling client data - AI transforms traditional 12-24 month compliance projects into 3-4 month implementations',
 '{
   "business_context": {
     "industry_secondary": ["consulting", "accounting", "legal", "professional_services"],
     "company_size": ["15-150"],
     "business_model": ["service"],
     "customer_types": ["enterprise", "smb"],
     "geographic_presence": {
       "countries": ["usa", "uk", "canada", "australia"],
       "us_states": ["california", "new_york", "texas", "illinois"],
       "regulatory_jurisdictions": ["gdpr_territory", "ccpa_scope", "pipeda_scope"]
     }
   },
   "typical_obligations": ["iso27001", "gdpr", "ccpa", "industry_specific"],
   "common_challenges": ["client_data_protection", "limited_it_resources", "regulatory_complexity"],
   "ai_acceleration_benefits": ["client_data_mapping", "automated_policy_customization", "compliance_documentation", "training_automation"]
 }',
 '{
   "required_conditions": {
     "business_context.industry_secondary": ["consulting", "accounting", "legal", "professional_services"],
     "business_context.business_model": ["service"]
   },
   "minimum_confidence_threshold": 0.75
 }',
 '{
   "priority_frameworks": ["iso27001", "iso27701", "gdpr", "ccpa"],
   "ai_accelerated_sequence": ["client_data_discovery", "ai_risk_assessment", "automated_documentation", "compliance_monitoring"],
   "ai_timeline": "3-4_months",
   "traditional_timeline": "12-24_months",
   "acceleration_factor": 6.0,
   "resource_requirements": "part_time_person_with_ai_platform",
   "traditional_resources": "dedicated_person_plus_consultant",
   "ai_automation_level": "high",
   "success_patterns": ["ai_driven_client_data_mapping", "automated_compliance_documentation", "real_time_risk_monitoring"]
 }'
),

('ecommerce_smb', 'E-commerce SMB',
 'Consumer-facing e-commerce business with payment processing - AI reduces traditional 6-12 month compliance cycles to 3-6 weeks for core requirements',
 '{
   "business_context": {
     "industry_secondary": ["ecommerce", "retail"],
     "company_size": ["10-100"],
     "business_model": ["b2c", "product_sales"],
     "customer_types": ["consumer"],
     "geographic_presence": {
       "countries": ["usa", "canada", "uk"],
       "us_states": ["california", "virginia", "colorado", "connecticut"],
       "regulatory_jurisdictions": ["ccpa_scope", "cdpa_scope", "cpa_scope", "gdpr_territory"]
     }
   },
   "typical_obligations": ["pci_dss", "gdpr", "ccpa", "cdpa", "cpa", "iso27001"],
   "common_challenges": ["payment_security", "customer_data_privacy", "seasonal_scaling", "multi_state_compliance"],
   "ai_acceleration_benefits": ["automated_privacy_notices", "data_mapping", "breach_response_automation", "compliance_monitoring"]
 }',
 '{
   "required_conditions": {
     "business_context.industry_secondary": ["ecommerce", "retail"],
     "business_context.customer_types": ["consumer"]
   },
   "minimum_confidence_threshold": 0.70
 }',
 '{
   "priority_frameworks": ["pci_dss", "ccpa", "gdpr", "cdpa", "cpa"],
   "ai_accelerated_sequence": ["payment_security_assessment", "ai_privacy_documentation", "automated_compliance_monitoring"],
   "ai_timeline": "3-6_weeks",
   "traditional_timeline": "6-12_months",
   "acceleration_factor": 8.0,
   "resource_requirements": "part_time_person_with_ai_platform",
   "traditional_resources": "dedicated_person_plus_payment_specialist",
   "ai_automation_level": "very_high",
   "success_patterns": ["ai_generated_privacy_notices", "automated_data_subject_requests", "real_time_compliance_dashboards"]
 }'
);

-- ---------------------------------------------------------------------------
-- 10. SAMPLE CONTEXT APPLICATION RULES
-- ---------------------------------------------------------------------------

INSERT INTO context_application_rules (rule_name, rule_category, organizational_conditions, content_modifications, framework_scope, output_modes) VALUES

('fintech_enhanced_controls', 'document_customization',
 '{
   "business_context": {"industry_secondary": ["fintech"]},
   "operational_context": {"data_sensitivity": ["highly_sensitive", "confidential"]}
 }',
 '{
   "template_customizations": {
     "section_emphasis": ["financial_controls", "sox_compliance", "customer_due_diligence"],
     "example_types": ["financial_services_examples", "banking_procedures"],
     "complexity_level": "advanced",
     "additional_sections": ["financial_crime_prevention", "regulatory_reporting"]
   },
   "guidance_adaptations": {
     "terminology_level": "financial_regulatory",
     "compliance_cross_references": ["sox", "pci_dss", "ffiec"],
     "risk_focus": "financial_crimes_operational_risk"
   }
 }',
 ARRAY['iso27001', 'soc2', 'gdpr'],
 ARRAY['document_template', 'implementation_guide', 'governance_tools']
),

('small_team_simplification', 'guidance_adaptation',
 '{
   "business_context": {"company_size": ["1-10", "11-50"]},
   "operational_context": {"it_resources": ["part_time_person", "dedicated_person"]}
 }',
 '{
   "guidance_adaptations": {
     "explanation_depth": "practical_focused",
     "step_granularity": "actionable_steps",
     "terminology_level": "business_friendly",
     "prerequisite_assumptions": ["limited_it_resources", "external_consultant_likely"]
   },
   "template_customizations": {
     "complexity_level": "simplified",
     "example_types": ["small_team_examples", "resource_conscious_approaches"],
     "section_emphasis": ["essential_controls_only", "scalable_foundations"]
   }
 }',
 ARRAY['iso27001', 'gdpr', 'soc2'],
 ARRAY['conversational', 'document_template', 'implementation_guide']
),

('formal_communication_style', 'communication_style',
 '{
   "cultural_characteristics": {"formality_preference": ["formal", "highly_formal"]},
   "business_context": {"industry_primary": ["financial_services", "government", "healthcare"]}
 }',
 '{
   "guidance_adaptations": {
     "language_style": "formal_professional",
     "explanation_depth": "comprehensive",
     "documentation_level": "detailed",
     "approval_emphasis": "governance_focused"
   },
   "template_customizations": {
     "language_style": "formal_business",
     "section_structure": "hierarchical_detailed",
     "approval_workflows": "formal_sign_off_required"
   }
 }',
 ARRAY['iso27001', 'iso27701', 'soc2', 'gdpr'],
 ARRAY['conversational', 'document_template', 'governance_tools']
);

-- ---------------------------------------------------------------------------
-- Comments and Documentation
-- ---------------------------------------------------------------------------

COMMENT ON TABLE organizational_profiles IS 'Core organizational intelligence for CAG system - stores comprehensive context about each organization';
COMMENT ON TABLE compliance_obligations IS 'Dynamic assessment of applicable compliance requirements based on organizational profile';
COMMENT ON TABLE context_application_rules IS 'Rules engine for applying organizational context to modify AI guidance and document generation';
COMMENT ON TABLE organizational_archetypes IS 'Expert-curated patterns for classifying and understanding organizational types';
COMMENT ON TABLE cag_sessions IS 'Enhanced session tracking for context-augmented AI interactions';

COMMENT ON COLUMN organizational_profiles.business_context IS 'Industry, size, model, geography, customers - fundamental business characteristics';
COMMENT ON COLUMN organizational_profiles.operational_context IS 'Tech stack, IT maturity, change velocity - operational characteristics affecting implementation';
COMMENT ON COLUMN organizational_profiles.decision_structure IS 'Authority, speed, complexity - how decisions get made in the organization';
COMMENT ON COLUMN organizational_profiles.cultural_characteristics IS 'Risk tolerance, formality, communication style - cultural factors affecting approach';
COMMENT ON COLUMN organizational_profiles.compliance_profile IS 'Current state, experience, preferences, needs - compliance-specific context';
COMMENT ON COLUMN organizational_profiles.archetype_classification IS 'Primary organizational archetype classification (e.g., b2b_saas_growth)';
COMMENT ON COLUMN organizational_profiles.behavioral_profile IS 'Learned patterns from system usage over time';

-- End of CAG Database Schema Enhancement