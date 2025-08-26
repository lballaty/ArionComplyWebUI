-- Extension to existing compliance_tests table to support parameter testing
-- File path: testing/llm-comparison/database/extensions/001_add_parameter_support.sql
-- Phase 2: Database extensions (non-breaking additions)

-- Add parameter-related columns to existing table
-- Note: These are additions, not modifications to existing columns

ALTER TABLE compliance_tests 
ADD COLUMN IF NOT EXISTS parameter_set_name TEXT,
ADD COLUMN IF NOT EXISTS claude_parameters JSONB,
ADD COLUMN IF NOT EXISTS openai_parameters JSONB,
ADD COLUMN IF NOT EXISTS parameter_experiment_id UUID,
ADD COLUMN IF NOT EXISTS retrieval_context_hash TEXT,
ADD COLUMN IF NOT EXISTS context_length_tokens INTEGER;

-- Create indexes for parameter queries
CREATE INDEX IF NOT EXISTS idx_compliance_tests_parameter_set 
ON compliance_tests(parameter_set_name);

CREATE INDEX IF NOT EXISTS idx_compliance_tests_experiment 
ON compliance_tests(parameter_experiment_id);

-- Create table for parameter experiments (Phase 2)
CREATE TABLE IF NOT EXISTS parameter_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_name TEXT NOT NULL,
    base_query TEXT NOT NULL,
    provider_name TEXT NOT NULL,
    model_id TEXT NOT NULL,
    parameter_combinations JSONB[],
    results_summary JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for experiments
CREATE INDEX IF NOT EXISTS idx_parameter_experiments_model 
ON parameter_experiments(provider_name, model_id);

-- Comment on the extensions
COMMENT ON COLUMN compliance_tests.parameter_set_name IS 'Name of parameter set used for this test';
COMMENT ON COLUMN compliance_tests.claude_parameters IS 'Parameters used for Claude model';
COMMENT ON COLUMN compliance_tests.openai_parameters IS 'Parameters used for OpenAI model';
COMMENT ON COLUMN compliance_tests.parameter_experiment_id IS 'Links to parameter_experiments table if part of experiment';
COMMENT ON COLUMN compliance_tests.retrieval_context_hash IS 'Hash of retrieval context for reproducibility';
COMMENT ON COLUMN compliance_tests.context_length_tokens IS 'Length of context provided to models';

COMMENT ON TABLE parameter_experiments IS 'Tracks parameter optimization experiments';
