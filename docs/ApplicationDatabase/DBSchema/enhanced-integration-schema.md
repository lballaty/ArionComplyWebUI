# Enhanced Integration Management - Database Schema

## Overview

This document defines the enhanced database schema for comprehensive integration management that extends the basic integration tables to support field-level mappings, scheduling, templates, and advanced transformation capabilities across the ArionComply platform. The design follows established database principles while providing sophisticated integration orchestration.

## Enhanced Integration Management Workflow

### 1. Field-Level Mapping Management

#### Integration Field Mappings
- **Status**: Core Feature
- **Triggers**:
  - New integration setup
  - System field changes
  - Data model updates
  - Mapping optimization needs
  - Integration troubleshooting
- **Approval Requirements**:
  - Technical review of mappings
  - Data owner approval
  - Security validation
  - Testing sign-off
- **Data Model Requirements**:
  - `integration_mappings` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `config_id`: UUID REFERENCES integration_configs(id) ON DELETE CASCADE
    - `mapping_name`: TEXT NOT NULL
    - `mapping_type`: ENUM('field', 'object', 'array', 'custom')
    - `source_path`: TEXT NOT NULL -- JSONPath or field path in source
    - `target_path`: TEXT NOT NULL -- JSONPath or field path in target
    - `source_data_type`: TEXT -- Expected source data type
    - `target_data_type`: TEXT -- Expected target data type
    - `is_required`: BOOLEAN DEFAULT false
    - `default_value`: TEXT -- Default if source is null/missing
    - `transformation_rules`: JSONB -- Transformation logic
    - `validation_rules`: JSONB -- Pre/post transformation validation
    - `mapping_direction`: ENUM('inbound', 'outbound', 'bidirectional')
    - `is_active`: BOOLEAN DEFAULT true
    - `error_handling`: ENUM('fail', 'skip', 'default', 'null')
    - `mapping_notes`: TEXT
    - `test_coverage`: DECIMAL(5,2) -- Percentage of test coverage
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_transformation CHECK (jsonb_typeof(transformation_rules) = 'object')
    - CONSTRAINT valid_validation CHECK (jsonb_typeof(validation_rules) = 'object')
    - INDEX idx_integration_mappings_config (config_id, is_active)
  
  - `integration_mapping_tests` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `mapping_id`: UUID REFERENCES integration_mappings(id) ON DELETE CASCADE
    - `test_name`: TEXT NOT NULL
    - `test_type`: ENUM('unit', 'integration', 'edge_case', 'performance')
    - `input_data`: JSONB NOT NULL
    - `expected_output`: JSONB NOT NULL
    - `test_status`: ENUM('pending', 'passed', 'failed', 'skipped')
    - `actual_output`: JSONB
    - `execution_time_ms`: INTEGER
    - `error_message`: TEXT
    - `last_run`: TIMESTAMPTZ
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_input CHECK (jsonb_typeof(input_data) = 'object')
    - CONSTRAINT valid_expected CHECK (jsonb_typeof(expected_output) = 'object')
    - CONSTRAINT valid_actual CHECK (jsonb_typeof(actual_output) = 'object')

### 2. Integration Scheduling

#### Schedule Management
- **Status**: Core Feature
- **Triggers**:
  - Recurring data synchronization needs
  - Batch processing requirements
  - Time-based data collection
  - Compliance reporting schedules
- **Data Model Requirements**:
  - `integration_schedules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `config_id`: UUID REFERENCES integration_configs(id) ON DELETE CASCADE
    - `schedule_name`: TEXT NOT NULL
    - `schedule_type`: ENUM('cron', 'interval', 'fixed_time', 'event_based', 'manual')
    - `cron_expression`: TEXT -- For cron-based schedules
    - `interval_minutes`: INTEGER -- For interval-based
    - `fixed_times`: TIME[] -- For fixed daily times
    - `timezone`: TEXT DEFAULT 'UTC' -- IANA timezone
    - `is_active`: BOOLEAN DEFAULT true
    - `start_date`: DATE
    - `end_date`: DATE -- Optional end date
    - `next_run_time`: TIMESTAMPTZ
    - `last_run_time`: TIMESTAMPTZ
    - `retry_policy`: JSONB -- Retry configuration
    - `execution_timeout_seconds`: INTEGER DEFAULT 300
    - `concurrent_execution_allowed`: BOOLEAN DEFAULT false
    - `missed_execution_policy`: ENUM('run_once', 'run_all', 'skip')
    - `notification_on_failure`: BOOLEAN DEFAULT true
    - `notification_recipients`: UUID[] -- User IDs to notify
    - `execution_parameters`: JSONB -- Additional params for execution
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_retry_policy CHECK (jsonb_typeof(retry_policy) = 'object')
    - CONSTRAINT valid_exec_params CHECK (jsonb_typeof(execution_parameters) = 'object')
    - CONSTRAINT valid_schedule CHECK (
        (schedule_type = 'cron' AND cron_expression IS NOT NULL) OR
        (schedule_type = 'interval' AND interval_minutes IS NOT NULL) OR
        (schedule_type = 'fixed_time' AND fixed_times IS NOT NULL) OR
        (schedule_type IN ('event_based', 'manual'))
    )
    - INDEX idx_schedules_next_run (next_run_time, is_active) WHERE is_active = true
  
  - `integration_schedule_executions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `schedule_id`: UUID REFERENCES integration_schedules(id) ON DELETE CASCADE
    - `execution_id`: UUID REFERENCES integration_executions(id)
    - `scheduled_time`: TIMESTAMPTZ NOT NULL
    - `actual_start_time`: TIMESTAMPTZ
    - `actual_end_time`: TIMESTAMPTZ
    - `execution_status`: ENUM('scheduled', 'running', 'completed', 'failed', 'cancelled', 'skipped')
    - `records_processed`: INTEGER DEFAULT 0
    - `error_count`: INTEGER DEFAULT 0
    - `warning_count`: INTEGER DEFAULT 0
    - `execution_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - INDEX idx_schedule_executions_status (schedule_id, execution_status, scheduled_time DESC)

### 3. Integration Templates

#### Template Management
- **Status**: Enhancement
- **Triggers**:
  - Common integration patterns
  - Standardization needs
  - New system onboarding
  - Best practice implementation
- **Data Model Requirements**:
  - `integration_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `description`: TEXT
    - `integration_type`: TEXT NOT NULL -- Type of system/API
    - `template_category`: ENUM('compliance', 'security', 'hr', 'finance', 'operations', 'custom')
    - `version`: TEXT NOT NULL
    - `is_active`: BOOLEAN DEFAULT true
    - `is_certified`: BOOLEAN DEFAULT false -- Vendor-certified template
    - `certification_date`: DATE
    - `connection_template`: JSONB NOT NULL -- Connection config template
    - `mapping_templates`: JSONB NOT NULL -- Field mapping templates
    - `transformation_library`: JSONB -- Common transformations
    - `test_suite`: JSONB -- Template test cases
    - `documentation_url`: TEXT
    - `prerequisites`: TEXT[] -- Required setup steps
    - `supported_operations`: TEXT[] -- CRUD operations supported
    - `rate_limits`: JSONB -- API rate limit info
    - `organization_id`: UUID REFERENCES organizations(id) -- NULL for system templates
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_connection CHECK (jsonb_typeof(connection_template) = 'object')
    - CONSTRAINT valid_mappings CHECK (jsonb_typeof(mapping_templates) = 'object')
    - CONSTRAINT valid_transforms CHECK (jsonb_typeof(transformation_library) = 'object')
    - CONSTRAINT valid_tests CHECK (jsonb_typeof(test_suite) = 'object')
    - CONSTRAINT valid_rate_limits CHECK (jsonb_typeof(rate_limits) = 'object')
    - UNIQUE(template_name, version, organization_id)
  
  - `integration_template_instances` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_id`: UUID REFERENCES integration_templates(id)
    - `config_id`: UUID REFERENCES integration_configs(id)
    - `instance_name`: TEXT NOT NULL
    - `customizations`: JSONB -- Template overrides
    - `deployment_status`: ENUM('draft', 'testing', 'active', 'deprecated')
    - `deployed_date`: TIMESTAMPTZ
    - `deployed_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_customizations CHECK (jsonb_typeof(customizations) = 'object')

### 4. Advanced Integration Features

#### Transformation Pipeline
- **Status**: Enhancement
- **Triggers**:
  - Complex data transformations
  - Multi-step processing
  - Data enrichment needs
  - Format conversions
- **Data Model Requirements**:
  - `integration_transformations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `transformation_name`: TEXT NOT NULL
    - `description`: TEXT
    - `transformation_type`: ENUM('map', 'filter', 'aggregate', 'enrich', 'validate', 'custom')
    - `input_schema`: JSONB -- Expected input structure
    - `output_schema`: JSONB -- Expected output structure
    - `transformation_logic`: JSONB NOT NULL -- Transformation definition
    - `language`: ENUM('jmespath', 'jsonpath', 'javascript', 'python', 'sql')
    - `is_reusable`: BOOLEAN DEFAULT true
    - `performance_tier`: ENUM('lightweight', 'standard', 'heavy')
    - `timeout_seconds`: INTEGER DEFAULT 30
    - `error_output_schema`: JSONB -- Structure when transformation fails
    - `test_cases`: JSONB -- Built-in test cases
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_input_schema CHECK (jsonb_typeof(input_schema) = 'object')
    - CONSTRAINT valid_output_schema CHECK (jsonb_typeof(output_schema) = 'object')
    - CONSTRAINT valid_logic CHECK (jsonb_typeof(transformation_logic) = 'object')
    - CONSTRAINT valid_error_schema CHECK (jsonb_typeof(error_output_schema) = 'object')
    - CONSTRAINT valid_test_cases CHECK (jsonb_typeof(test_cases) = 'object')
  
  - `integration_pipeline_definitions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `pipeline_name`: TEXT NOT NULL
    - `description`: TEXT
    - `config_id`: UUID REFERENCES integration_configs(id)
    - `pipeline_type`: ENUM('linear', 'conditional', 'parallel', 'hybrid')
    - `pipeline_steps`: JSONB NOT NULL -- Ordered transformation steps
    - `error_handling_strategy`: ENUM('fail_fast', 'continue_on_error', 'dead_letter', 'retry')
    - `dead_letter_config`: JSONB -- Where to send failed records
    - `performance_config`: JSONB -- Batch size, parallelism, etc.
    - `monitoring_config`: JSONB -- What metrics to track
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_steps CHECK (jsonb_typeof(pipeline_steps) = 'object')
    - CONSTRAINT valid_dead_letter CHECK (jsonb_typeof(dead_letter_config) = 'object')
    - CONSTRAINT valid_performance CHECK (jsonb_typeof(performance_config) = 'object')
    - CONSTRAINT valid_monitoring CHECK (jsonb_typeof(monitoring_config) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_integration_mappings_active ON integration_mappings (config_id, is_active) 
    WHERE is_active = true;
CREATE INDEX idx_mapping_tests_status ON integration_mapping_tests (mapping_id, test_status);
CREATE INDEX idx_schedules_active_next ON integration_schedules (is_active, next_run_time) 
    WHERE is_active = true;
CREATE INDEX idx_schedule_executions_recent ON integration_schedule_executions (schedule_id, scheduled_time DESC);
CREATE INDEX idx_templates_active ON integration_templates (template_category, is_active) 
    WHERE is_active = true;
CREATE INDEX idx_transformations_reusable ON integration_transformations (transformation_type, is_reusable) 
    WHERE is_reusable = true;

-- GIN indexes for JSONB fields
CREATE INDEX idx_mappings_transformation ON integration_mappings USING GIN (transformation_rules);
CREATE INDEX idx_schedules_retry ON integration_schedules USING GIN (retry_policy);
CREATE INDEX idx_templates_mappings ON integration_templates USING GIN (mapping_templates);
CREATE INDEX idx_pipeline_steps ON integration_pipeline_definitions USING GIN (pipeline_steps);
```

## Functions and Triggers

```sql
-- Function to calculate next run time for schedules
CREATE OR REPLACE FUNCTION calculate_next_run_time()
RETURNS TRIGGER AS $$
DECLARE
    v_next_run TIMESTAMPTZ;
BEGIN
    CASE NEW.schedule_type
        WHEN 'interval' THEN
            v_next_run := COALESCE(NEW.last_run_time, NOW()) + 
                         (NEW.interval_minutes || ' minutes')::INTERVAL;
        WHEN 'fixed_time' THEN
            -- Find next fixed time after now
            WITH next_times AS (
                SELECT 
                    CURRENT_DATE + t + 
                    CASE 
                        WHEN CURRENT_DATE + t < NOW() 
                        THEN INTERVAL '1 day' 
                        ELSE INTERVAL '0 day' 
                    END as next_time
                FROM unnest(NEW.fixed_times) as t
            )
            SELECT MIN(next_time) INTO v_next_run FROM next_times;
        WHEN 'cron' THEN
            -- This would use a cron parser function
            -- Simplified for example
            v_next_run := NOW() + INTERVAL '1 hour';
        ELSE
            v_next_run := NULL;
    END CASE;
    
    NEW.next_run_time := v_next_run;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_next_run_time
    BEFORE INSERT OR UPDATE OF last_run_time, schedule_type, interval_minutes, fixed_times, cron_expression
    ON integration_schedules
    FOR EACH ROW
    EXECUTE FUNCTION calculate_next_run_time();

-- Function to validate field mappings
CREATE OR REPLACE FUNCTION validate_field_mapping()
RETURNS TRIGGER AS $$
DECLARE
    v_source_type TEXT;
    v_target_type TEXT;
BEGIN
    -- Get data types
    v_source_type := NEW.source_data_type;
    v_target_type := NEW.target_data_type;
    
    -- Check if transformation is needed
    IF v_source_type != v_target_type AND 
       NEW.transformation_rules IS NULL THEN
        RAISE WARNING 'Data type mismatch without transformation: % -> %', 
                      v_source_type, v_target_type;
    END IF;
    
    -- Validate transformation rules structure
    IF NEW.transformation_rules IS NOT NULL THEN
        IF NOT NEW.transformation_rules ? 'type' THEN
            RAISE EXCEPTION 'Transformation rules must include type';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_mapping_trigger
    BEFORE INSERT OR UPDATE ON integration_mappings
    FOR EACH ROW
    EXECUTE FUNCTION validate_field_mapping();

-- Function to create integration from template
CREATE OR REPLACE FUNCTION create_integration_from_template(
    p_template_id UUID,
    p_instance_name TEXT,
    p_customizations JSONB,
    p_organization_id UUID,
    p_created_by UUID
) RETURNS UUID AS $$
DECLARE
    v_template RECORD;
    v_config_id UUID;
    v_instance_id UUID;
BEGIN
    -- Get template
    SELECT * INTO v_template
    FROM integration_templates
    WHERE id = p_template_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found or inactive';
    END IF;
    
    -- Create integration config
    INSERT INTO integration_configs (
        integration_name,
        integration_type,
        connection_config,
        organization_id,
        created_by
    ) VALUES (
        p_instance_name,
        v_template.integration_type,
        v_template.connection_template || COALESCE(p_customizations->'connection', '{}'::jsonb),
        p_organization_id,
        p_created_by
    ) RETURNING id INTO v_config_id;
    
    -- Create template instance record
    INSERT INTO integration_template_instances (
        template_id,
        config_id,
        instance_name,
        customizations,
        deployment_status,
        deployed_by,
        organization_id
    ) VALUES (
        p_template_id,
        v_config_id,
        p_instance_name,
        p_customizations,
        'draft',
        p_created_by,
        p_organization_id
    ) RETURNING id INTO v_instance_id;
    
    -- Create default mappings from template
    INSERT INTO integration_mappings (
        config_id,
        mapping_name,
        source_path,
        target_path,
        transformation_rules,
        organization_id,
        created_by
    )
    SELECT 
        v_config_id,
        mapping->>'name',
        mapping->>'source_path',
        mapping->>'target_path',
        mapping->'transformation',
        p_organization_id,
        p_created_by
    FROM jsonb_array_elements(v_template.mapping_templates) as mapping;
    
    RETURN v_config_id;
END;
$$ LANGUAGE plpgsql;

-- Function to test pipeline execution
CREATE OR REPLACE FUNCTION test_integration_pipeline(
    p_pipeline_id UUID,
    p_test_data JSONB
) RETURNS JSONB AS $$
DECLARE
    v_pipeline RECORD;
    v_current_data JSONB;
    v_step JSONB;
    v_result JSONB;
BEGIN
    -- Get pipeline definition
    SELECT * INTO v_pipeline
    FROM integration_pipeline_definitions
    WHERE id = p_pipeline_id;
    
    v_current_data := p_test_data;
    v_result := jsonb_build_object('success', true, 'steps', '[]'::jsonb);
    
    -- Execute each step
    FOR v_step IN SELECT * FROM jsonb_array_elements(v_pipeline.pipeline_steps)
    LOOP
        -- This would execute actual transformation
        -- Simplified for example
        v_current_data := v_current_data || jsonb_build_object(
            'step_' || (v_step->>'order'), 
            'processed'
        );
        
        v_result := v_result || jsonb_build_object(
            'steps', v_result->'steps' || jsonb_build_array(
                jsonb_build_object(
                    'step', v_step->>'name',
                    'status', 'success',
                    'output_preview', v_current_data
                )
            )
        );
    END LOOP;
    
    v_result := v_result || jsonb_build_object('final_output', v_current_data);
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **Integration Hub** for managing all integrations
  - **Mapping Designer** for visual field mapping
  - **Schedule Manager** for integration scheduling
  - **Template Library** for browsing and deploying templates
  - **Transformation Builder** for creating data transformations
  - **Pipeline Designer** for visual pipeline creation
  - **Test Suite** for integration testing
  - **Monitoring Dashboard** for integration health

- **Integration Points**:
  - Visual mapping interface with drag-and-drop
  - Real-time transformation preview
  - Schedule visualization calendar
  - Template marketplace integration
  - Version control for configurations
  - Test automation framework
  - Performance monitoring
  - Error tracking and debugging

## Migration and Operational Considerations

1. **Template Management**:
   - Pre-built templates for common systems
   - Version control for template updates
   - Template certification process
   - Community template sharing

2. **Testing Framework**:
   - Automated test generation
   - Regression test suites
   - Performance benchmarking
   - Edge case detection

3. **Monitoring and Observability**:
   - Real-time execution monitoring
   - Performance metrics tracking
   - Error pattern analysis
   - SLA compliance monitoring

4. **Security Considerations**:
   - Credential encryption
   - API key rotation
   - Access control for integrations
   - Data masking in logs