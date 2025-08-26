/**
 * ARIONCOMPLY METADATA-DRIVEN API ARCHITECTURE
 * ============================================
 * 
 * This document provides a comprehensive overview of ArionComply's metadata-driven API 
 * architecture, which enables dynamic API endpoint generation, UI rendering, and 
 * business logic application based on centralized metadata definitions.
 * 
 * ARCHITECTURE OVERVIEW:
 * --------------------
 * The metadata-driven API architecture consists of several key components:
 *
 * 1. Metadata Registry: Central repository of all entity definitions and configurations
 * 2. Edge Function Router: Dynamically routes and processes API requests based on metadata
 * 3. Query Builder: Constructs SQL queries based on metadata and request parameters
 * 4. Permission Enforcer: Applies access control rules based on metadata and user context
 * 5. Response Formatter: Formats responses according to metadata specifications
 * 6. Event System: Triggers workflows and actions based on metadata-defined events
 * 7. UI Generator: Dynamically renders UI components based on metadata
 */

// ===================================================================
// PART 1: METADATA REGISTRY SCHEMA
// ===================================================================

/**
 * The Metadata Registry is the central database schema that defines
 * all entities, their fields, relationships, API behavior, UI rendering,
 * and access control rules.
 * 
 * SQL Schema:
 */

/*
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

-- Additional tracking tables for metadata changes
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

-- Table for field-level metadata
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
*/

// ===================================================================
// PART 2: METADATA JSON SCHEMAS
// ===================================================================

/**
 * Schema Definition Structure
 * ---------------------------
 * This structure defines the fields, types, constraints, and relationships
 * for an entity.
 */
const schemaDefinitionExample = {
  "fields": [
    {
      "name": "id",
      "type": "uuid",
      "primary_key": true,
      "default": "uuid_generate_v4()",
      "description": "Unique identifier"
    },
    {
      "name": "title",
      "type": "text",
      "required": true,
      "min_length": 3,
      "max_length": 255,
      "description": "Title of the policy"
    },
    {
      "name": "risk_level",
      "type": "enum",
      "enum_values": ["critical", "high", "medium", "low", "negligible"],
      "default": "medium",
      "description": "Risk level associated with this policy"
    },
    {
      "name": "effective_date",
      "type": "date",
      "description": "When the policy becomes effective"
    },
    {
      "name": "owner_id",
      "type": "uuid",
      "references": {
        "table": "users",
        "field": "id",
        "on_delete": "SET NULL"
      },
      "description": "User responsible for this policy"
    },
    {
      "name": "custom_fields",
      "type": "jsonb",
      "description": "Organization-specific custom fields"
    }
  ],
  "indexes": [
    {
      "name": "idx_policies_title",
      "fields": ["title"],
      "unique": false
    },
    {
      "name": "idx_policies_risk_level",
      "fields": ["risk_level", "effective_date"],
      "unique": false
    },
    {
      "name": "idx_policies_owner",
      "fields": ["owner_id"],
      "unique": false
    },
    {
      "name": "idx_policies_custom_fields",
      "fields": ["custom_fields"],
      "type": "gin"
    }
  ],
  "constraints": [
    {
      "name": "valid_custom_fields",
      "check": "jsonb_typeof(custom_fields) = 'object'"
    }
  ]
};

/**
 * API Configuration Structure
 * ---------------------------
 * This structure defines the API behavior, endpoints, methods, and filters
 * for an entity.
 */
const apiConfigExample = {
  "resource_name": "policies",
  "enable_crud": true,
  "batch_operations": true,
  "max_batch_size": 50,
  "pagination": {
    "default_limit": 25,
    "max_limit": 100,
    "cursor_based": true
  },
  "endpoints": [
    {
      "path": "/policies",
      "methods": ["GET", "POST"],
      "description": "List and create policies"
    },
    {
      "path": "/policies/{id}",
      "methods": ["GET", "PUT", "PATCH", "DELETE"],
      "description": "Get, update, or delete a specific policy"
    },
    {
      "path": "/policies/search",
      "methods": ["POST"],
      "description": "Advanced policy search"
    },
    {
      "path": "/policies/{id}/versions",
      "methods": ["GET"],
      "description": "Get policy version history"
    },
    {
      "path": "/policies/{id}/related",
      "methods": ["GET"],
      "description": "Get related entities"
    }
  ],
  "filters": [
    {
      "field": "title",
      "operators": ["eq", "contains", "startsWith"]
    },
    {
      "field": "risk_level",
      "operators": ["eq", "in", "gt", "lt"]
    },
    {
      "field": "effective_date",
      "operators": ["eq", "gt", "lt", "between"]
    },
    {
      "field": "owner_id",
      "operators": ["eq", "in"]
    },
    {
      "field": "status",
      "operators": ["eq", "in"]
    },
    {
      "field": "custom_fields",
      "operators": ["jsonContains"]
    }
  ],
  "sorting": [
    {"field": "title", "default": false},
    {"field": "effective_date", "default": true, "direction": "desc"},
    {"field": "risk_level", "default": false},
    {"field": "created_at", "default": false}
  ],
  "response_fields": {
    "default": ["id", "title", "status", "risk_level", "effective_date", "owner_id", "created_at", "updated_at"],
    "detailed": ["id", "title", "description", "status", "risk_level", "effective_date", "owner_id", "content", "version", "custom_fields", "created_by", "created_at", "updated_by", "updated_at"],
    "minimal": ["id", "title", "status"]
  },
  "hooks": {
    "before_create": ["validate_policy_title", "set_default_values"],
    "after_create": ["notify_policy_stakeholders", "log_policy_creation"],
    "before_update": ["validate_policy_change", "check_version_conflict"],
    "after_update": ["notify_policy_change", "log_policy_update"],
    "before_delete": ["check_policy_references", "verify_delete_permission"],
    "after_delete": ["notify_policy_deletion", "log_policy_deletion"]
  },
  "rate_limits": {
    "default": {
      "requests": 100,
      "period": "minute"
    },
    "search": {
      "requests": 20,
      "period": "minute"
    }
  }
};

/**
 * UI Configuration Structure
 * --------------------------
 * This structure defines how the entity is displayed in the UI,
 * including form layouts, validations, and actions.
 */
const uiConfigExample = {
  "list_view": {
    "default_columns": [
      {"field": "title", "width": "30%"},
      {"field": "status", "width": "10%", "formatter": "statusBadge"},
      {"field": "risk_level", "width": "10%", "formatter": "riskLevelBadge"},
      {"field": "effective_date", "width": "15%", "formatter": "date"},
      {"field": "owner_id", "width": "20%", "formatter": "userReference"},
      {"field": "updated_at", "width": "15%", "formatter": "relativeDate"}
    ],
    "actions": [
      {"name": "view", "icon": "eye", "permission": "policy.view"},
      {"name": "edit", "icon": "edit", "permission": "policy.edit"},
      {"name": "delete", "icon": "trash", "permission": "policy.delete"},
      {"name": "duplicate", "icon": "copy", "permission": "policy.create"}
    ],
    "batch_actions": [
      {"name": "delete", "icon": "trash", "permission": "policy.delete"},
      {"name": "export", "icon": "download", "permission": "policy.export"},
      {"name": "change_status", "icon": "status", "permission": "policy.edit"}
    ],
    "filters": [
      {"field": "title", "type": "text", "placeholder": "Search by title..."},
      {"field": "status", "type": "select", "options": "lookup:record_status_enum"},
      {"field": "risk_level", "type": "select", "options": "lookup:risk_level_enum"},
      {"field": "owner_id", "type": "userSelect"},
      {"field": "effective_date", "type": "dateRange"}
    ],
    "default_sort": {"field": "updated_at", "direction": "desc"}
  },
  "detail_view": {
    "layout": "tabs",
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "fields": [
          {"field": "title", "size": "large"},
          {"field": "description", "size": "large", "control": "richText"},
          {"field": "status", "size": "small", "control": "select"},
          {"field": "risk_level", "size": "small", "control": "select"},
          {"field": "effective_date", "size": "small", "control": "datePicker"},
          {"field": "owner_id", "size": "medium", "control": "userSelect"}
        ]
      },
      {
        "id": "content",
        "label": "Policy Content",
        "fields": [
          {"field": "content", "size": "full", "control": "documentEditor"}
        ]
      },
      {
        "id": "metadata",
        "label": "Metadata",
        "fields": [
          {"field": "version", "size": "small", "readOnly": true},
          {"field": "created_by", "size": "medium", "control": "userReference", "readOnly": true},
          {"field": "created_at", "size": "medium", "control": "dateTime", "readOnly": true},
          {"field": "updated_by", "size": "medium", "control": "userReference", "readOnly": true},
          {"field": "updated_at", "size": "medium", "control": "dateTime", "readOnly": true}
        ]
      },
      {
        "id": "custom",
        "label": "Custom Fields",
        "fields": [
          {"field": "custom_fields", "size": "full", "control": "dynamicForm"}
        ]
      }
    ],
    "related_entities": [
      {
        "entity": "controls",
        "label": "Related Controls",
        "relationship": "policy_control_mappings",
        "filter": {"field": "policy_id", "value": "{id}"}
      },
      {
        "entity": "documents",
        "label": "Supporting Documents",
        "relationship": "document_relationships",
        "filter": {"field": "source_document_id", "value": "{id}"}
      }
    ],
    "actions": [
      {"name": "edit", "label": "Edit Policy", "icon": "edit", "permission": "policy.edit"},
      {"name": "archive", "label": "Archive", "icon": "archive", "permission": "policy.archive"},
      {"name": "export", "label": "Export", "icon": "download", "permission": "policy.export"},
      {"name": "history", "label": "View History", "icon": "history", "permission": "policy.view"}
    ]
  },
  "create_view": {
    "layout": "single",
    "sections": [
      {
        "id": "main",
        "fields": [
          {"field": "title", "size": "large", "required": true},
          {"field": "description", "size": "large", "control": "richText"},
          {"field": "status", "size": "small", "control": "select", "default": "draft"},
          {"field": "risk_level", "size": "small", "control": "select", "default": "medium"},
          {"field": "effective_date", "size": "small", "control": "datePicker"},
          {"field": "owner_id", "size": "medium", "control": "userSelect", "default": "{current_user}"}
        ]
      }
    ],
    "actions": [
      {"name": "save", "label": "Save", "icon": "save", "primary": true},
      {"name": "save_and_new", "label": "Save and New", "icon": "plus"},
      {"name": "cancel", "label": "Cancel", "icon": "x"}
    ]
  },
  "edit_view": {
    "layout": "tabs",
    "inherit_from": "detail_view",
    "actions": [
      {"name": "save", "label": "Save", "icon": "save", "primary": true},
      {"name": "cancel", "label": "Cancel", "icon": "x"}
    ]
  },
  "form_validation": {
    "title": [
      {"rule": "required", "message": "Title is required"},
      {"rule": "min", "value": 3, "message": "Title must be at least 3 characters"},
      {"rule": "max", "value": 255, "message": "Title must be less than 255 characters"}
    ],
    "effective_date": [
      {"rule": "future", "message": "Effective date must be in the future"}
    ]
  }
};

/**
 * Permission Rules Structure
 * --------------------------
 * This structure defines access control rules for different roles,
 * including field-level restrictions.
 */
const permissionRulesExample = {
  "roles": {
    "admin": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true,
      "field_restrictions": {}
    },
    "policy_manager": {
      "create": true,
      "read": true,
      "update": true,
      "delete": false,
      "field_restrictions": {}
    },
    "policy_viewer": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false,
      "field_restrictions": {
        "restricted_fields": ["custom_fields"]
      }
    },
    "standard_user": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false,
      "field_restrictions": {
        "restricted_fields": ["custom_fields", "content"]
      }
    }
  },
  "conditions": {
    "is_owner": {
      "field": "owner_id",
      "operator": "eq",
      "value": "{current_user_id}"
    },
    "is_department_member": {
      "field": "owner_id",
      "operator": "in",
      "value": "{current_user_department_members}"
    },
    "is_draft": {
      "field": "status",
      "operator": "eq",
      "value": "draft"
    }
  },
  "rule_sets": [
    {
      "name": "owners_can_edit_drafts",
      "description": "Policy owners can edit their own draft policies",
      "conditions": ["is_owner", "is_draft"],
      "permissions": {
        "update": true
      }
    },
    {
      "name": "department_view",
      "description": "Users can view policies owned by their department",
      "conditions": ["is_department_member"],
      "permissions": {
        "read": true
      }
    }
  ],
  "field_level_permissions": {
    "custom_fields": {
      "roles": {
        "admin": {"read": true, "write": true},
        "policy_manager": {"read": true, "write": true},
        "policy_viewer": {"read": false, "write": false},
        "standard_user": {"read": false, "write": false}
      }
    },
    "content": {
      "roles": {
        "admin": {"read": true, "write": true},
        "policy_manager": {"read": true, "write": true},
        "policy_viewer": {"read": true, "write": false},
        "standard_user": {"read": false, "write": false}
      }
    }
  }
};

// ===================================================================
// PART 3: EDGE FUNCTION ROUTER IMPLEMENTATION
// ===================================================================

/**
 * Edge Function Router Implementation
 * -----------------------------------
 * This is the main entry point for the metadata-driven API.
 * It dynamically routes requests based on the action and metadata.
 */

/**
 * Main entry point for the Supabase Edge Function.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/index.js
 */
async function metadataApiRouter(req, res) {
  try {
    // Initialize Supabase client
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Extract request details
    const { entity, action, id, data, filter, sort, page, limit, fields } = req.body;
    const method = req.method;
    
    // Get user context from JWT
    const token = req.headers.authorization?.split('Bearer ')[1];
    const { data: { user } } = await supabase.auth.getUser(token);
    
    // Log the request for tracing
    const traceId = crypto.randomUUID();
    await logTrace(supabase, {
      trace_id: traceId,
      user_id: user.id,
      entity,
      action,
      method,
      timestamp: new Date().toISOString()
    });
    
    // Load entity metadata
    const { data: metadata, error: metadataError } = await supabase
      .from('metadata_registry')
      .select('*')
      .eq('table_name', entity)
      .single();
    
    if (metadataError || !metadata) {
      await logTrace(supabase, {
        trace_id: traceId,
        status: 'error',
        error: 'entity_not_found',
        details: `Entity not found: ${entity}`
      });
      
      return res.status(404).json({
        error: 'entity_not_found',
        message: `Entity "${entity}" not found`,
        trace_id: traceId
      });
    }
    
    // Validate the request against the metadata schema
    const validationResult = validateRequest(method, action, id, data, metadata);
    if (!validationResult.valid) {
      await logTrace(supabase, {
        trace_id: traceId,
        status: 'error',
        error: 'validation_failed',
        details: validationResult.errors
      });
      
      return res.status(400).json({
        error: 'validation_failed',
        message: 'Request validation failed',
        validation_errors: validationResult.errors,
        trace_id: traceId
      });
    }
    
    // Check permissions based on metadata
    const permissionResult = checkPermissions(user, method, action, id, metadata);
    if (!permissionResult.allowed) {
      await logTrace(supabase, {
        trace_id: traceId,
        status: 'error',
        error: 'permission_denied',
        details: permissionResult.reason
      });
      
      return res.status(403).json({
        error: 'permission_denied',
        message: permissionResult.reason,
        trace_id: traceId
      });
    }
    
    // Execute the request based on method and action
    let result;
    switch (method) {
      case 'GET':
        if (id) {
          result = await handleGetById(entity, id, fields, metadata, permissionResult, supabase);
        } else {
          result = await handleList(entity, filter, sort, page, limit, fields, metadata, permissionResult, supabase);
        }
        break;
        
      case 'POST':
        if (action === 'search') {
          result = await handleSearch(entity, data, metadata, permissionResult, supabase);
        } else {
          result = await handleCreate(entity, data, metadata, permissionResult, user, supabase);
        }
        break;
        
      case 'PUT':
      case 'PATCH':
        result = await handleUpdate(entity, id, data, method === 'PATCH', metadata, permissionResult, user, supabase);
        break;
        
      case 'DELETE':
        result = await handleDelete(entity, id, metadata, permissionResult, user, supabase);
        break;
        
      default:
        return res.status(405).json({
          error: 'method_not_allowed',
          message: `Method ${method} not allowed for entity ${entity}`,
          trace_id: traceId
        });
    }
    
    // Apply field-level permissions to the response
    const filteredResult = applyFieldPermissions(result, user, metadata, permissionResult);
    
    // Log successful request
    await logTrace(supabase, {
      trace_id: traceId,
      status: 'success',
      details: `Successfully processed ${method} request for ${entity}`
    });
    
    // Return the result
    return res.status(result.status || 200).json({
      data: filteredResult,
      trace_id: traceId
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return res.status(500).json({
      error: 'internal_server_error',
      message: 'An internal server error occurred',
      trace_id: error.traceId || crypto.randomUUID()
    });
  }
}

// ===================================================================
// PART 4: HANDLER IMPLEMENTATIONS
// ===================================================================

/**
 * Handle GET request for a specific entity record.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/handlers/get.js
 */
async function handleGetById(entity, id, fields, metadata, permissionResult, supabase) {
  // Determine which fields to select
  const fieldSelection = determineFieldSelection(fields, metadata, permissionResult);
  
  // Execute the query
  const { data, error } = await supabase
    .from(entity)
    .select(fieldSelection)
    .eq('id', id)
    .maybeSingle();
  
  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }
  
  if (!data) {
    return {
      status: 404,
      error: 'record_not_found',
      message: `${metadata.display_name} with ID ${id} not found`
    };
  }
  
  // Execute any post-read hooks
  const processedData = await executeHooks('after_read', data, metadata, supabase);
  
  return processedData;
}

/**
 * Handle GET request for listing entity records.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/handlers/list.js
 */
async function handleList(entity, filter, sort, page, limit, fields, metadata, permissionResult, supabase) {
  // Determine which fields to select
  const fieldSelection = determineFieldSelection(fields, metadata, permissionResult);
  
  // Start building the query
  let query = supabase.from(entity).select(fieldSelection, { count: 'exact' });
  
  // Apply filters
  if (filter) {
    query = applyFilters(query, filter, metadata);
  }
  
  // Apply sorting
  if (sort) {
    query = applySorting(query, sort, metadata);
  } else if (metadata.api_config.sorting) {
    // Apply default sorting from metadata
    const defaultSort = metadata.api_config.sorting.find(s => s.default);
    if (defaultSort) {
      query = query.order(defaultSort.field, { ascending: defaultSort.direction === 'asc' });
    }
  }
  
  // Apply pagination
  const pageSize = limit || metadata.api_config.pagination?.default_limit || 25;
  const maxPageSize = metadata.api_config.pagination?.max_limit || 100;
  const actualLimit = Math.min(pageSize, maxPageSize);
  
  query = query.limit(actualLimit);
  
  if (page) {
    const offset = (page - 1) * actualLimit;
    query = query.range(offset, offset + actualLimit - 1);
  }
  
  // Execute the query
  const { data, error, count } = await query;
  
  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }
  
  // Execute any post-read hooks for each record
  const processedData = await Promise.all(
    data.map(record => executeHooks('after_read', record, metadata, supabase))
  );
  
  return {
    records: processedData,
    total: count,
    page: page || 1,
    page_size: actualLimit,
    pages: Math.ceil(count / actualLimit)
  };
}

/**
 * Handle POST request for creating a new entity record.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/handlers/create.js
 */
async function handleCreate(entity, data, metadata, permissionResult, user, supabase) {
  // Apply default values from metadata
  const dataWithDefaults = applyDefaultValues(data, metadata);
  
  // Execute before-create hooks
  const processedData = await executeHooks('before_create', dataWithDefaults, metadata, supabase, user);
  
  // Add audit fields
  processedData.created_by = user.id;
  processedData.updated_by = user.id;
  processedData.organization_id = user.organization_id;
  
  // Execute the query
  const { data: createdData, error } = await supabase
    .from(entity)
    .insert(processedData)
    .select()
    .single();
  
  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }
  
  // Execute after-create hooks
  const finalData = await executeHooks('after_create', createdData, metadata, supabase, user);
  
  return {
    status: 201,
    ...finalData
  };
}

/**
 * Handle PUT/PATCH request for updating an entity record.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/handlers/update.js
 */
async function handleUpdate(entity, id, data, isPatch, metadata, permissionResult, user, supabase) {
  // Get the current record
  const { data: currentRecord, error: getError } = await supabase
    .from(entity)
    .select('*')
    .eq('id', id)
    .single();
  
  if (getError) {
    throw new Error(`Database error: ${getError.message}`);
  }
  
  if (!currentRecord) {
    return {
      status: 404,
      error: 'record_not_found',
      message: `${metadata.display_name} with ID ${id} not found`
    };
  }
  
  // For PATCH, merge with current data; for PUT, replace
  const updateData = isPatch
    ? { ...currentRecord, ...data }
    : data;
  
  // Execute before-update hooks
  const processedData = await executeHooks('before_update', updateData, metadata, supabase, user, currentRecord);
  
  // Add audit fields
  processedData.updated_by = user.id;
  processedData.updated_at = new Date().toISOString();
  
  // Execute the query
  const { data: updatedData, error: updateError } = await supabase
    .from(entity)
    .update(processedData)
    .eq('id', id)
    .select()
    .single();
  
  if (updateError) {
    throw new Error(`Database error: ${updateError.message}`);
  }
  
  // Execute after-update hooks
  const finalData = await executeHooks('after_update', updatedData, metadata, supabase, user, currentRecord);
  
  return finalData;
}

/**
 * Handle DELETE request for deleting an entity record.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/handlers/delete.js
 */
async function handleDelete(entity, id, metadata, permissionResult, user, supabase) {
  // Get the current record
  const { data: currentRecord, error: getError } = await supabase
    .from(entity)
    .select('*')
    .eq('id', id)
    .single();
  
  if (getError) {
    throw new Error(`Database error: ${getError.message}`);
  }
  
  if (!currentRecord) {
    return {
      status: 404,
      error: 'record_not_found',
      message: `${metadata.display_name} with ID ${id} not found`
    };
  }
  
  // Execute before-delete hooks
  await executeHooks('before_delete', currentRecord, metadata, supabase, user);
  
  // Check if this is a soft-delete entity
  if (metadata.schema_definition.fields.some(f => f.name === 'deleted_at')) {
    // Soft delete
    const { error: updateError } = await supabase
      .from(entity)
      .update({
        deleted_at: new Date().toISOString(),
        deleted_by: user.id,
        updated_at: new Date().toISOString(),
        updated_by: user.id
      })
      .eq('id', id);
    
    if (updateError) {
      throw new Error(`Database error: ${updateError.message}`);
    }
  } else {
    // Hard delete
    const { error: deleteError } = await supabase
      .from(entity)
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      throw new Error(`Database error: ${deleteError.message}`);
    }
  }
  
  // Execute after-delete hooks
  await executeHooks('after_delete', currentRecord, metadata, supabase, user);
  
  return {
    status: 200,
    message: `${metadata.display_name} deleted successfully`
  };
}

/**
 * Handle POST request for searching entity records.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/handlers/search.js
 */
async function handleSearch(entity, searchParams, metadata, permissionResult, supabase) {
  const { query, filters, sort, page, limit, fields } = searchParams;
  
  // Determine which fields to select
  const fieldSelection = determineFieldSelection(fields, metadata, permissionResult);
  
  // Start building the query
  let dbQuery = supabase.from(entity).select(fieldSelection, { count: 'exact' });
  
  // Apply text search if provided
  if (query) {
    // Get searchable fields from metadata
    const searchableFields = metadata.schema_definition.fields
      .filter(f => f.searchable)
      .map(f => f.name);
    
    if (searchableFields.length > 0) {
      // Construct text search column list
      const searchColumns = searchableFields.join(' || ');
      dbQuery = dbQuery.textSearch(searchColumns, query);
    }
  }
  
  // Apply filters
  if (filters) {
    dbQuery = applyFilters(dbQuery, filters, metadata);
  }
  
  // Apply sorting
  if (sort) {
    dbQuery = applySorting(dbQuery, sort, metadata);
  }
  
  // Apply pagination
  const pageSize = limit || metadata.api_config.pagination?.default_limit || 25;
  const maxPageSize = metadata.api_config.pagination?.max_limit || 100;
  const actualLimit = Math.min(pageSize, maxPageSize);
  
  dbQuery = dbQuery.limit(actualLimit);
  
  if (page) {
    const offset = (page - 1) * actualLimit;
    dbQuery = dbQuery.range(offset, offset + actualLimit - 1);
  }
  
  // Execute the query
  const { data, error, count } = await dbQuery;
  
  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }
  
  // Execute any post-read hooks for each record
  const processedData = await Promise.all(
    data.map(record => executeHooks('after_read', record, metadata, supabase))
  );
  
  return {
    records: processedData,
    total: count,
    page: page || 1,
    page_size: actualLimit,
    pages: Math.ceil(count / actualLimit)
  };
}

// ===================================================================
// PART 5: UTILITY FUNCTIONS
// ===================================================================

/**
 * Validate request against metadata schema.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/validation.js
 */
function validateRequest(method, action, id, data, metadata) {
  const errors = [];
  
  // For create/update operations, validate the request data
  if ((method === 'POST' && action !== 'search') || method === 'PUT' || method === 'PATCH') {
    if (!data) {
      return {
        valid: false,
        errors: [{ field: 'data', message: 'Request data is required' }]
      };
    }
    
    // Validate required fields for POST and PUT (not for PATCH)
    if (method !== 'PATCH') {
      metadata.schema_definition.fields.forEach(field => {
        if (field.required && !data[field.name] && !field.default) {
          errors.push({
            field: field.name,
            message: `${field.name} is required`
          });
        }
      });
    }
    
    // Validate field types
    Object.entries(data).forEach(([fieldName, fieldValue]) => {
      const fieldDef = metadata.schema_definition.fields.find(f => f.name === fieldName);
      
      if (!fieldDef) {
        errors.push({
          field: fieldName,
          message: `Unknown field: ${fieldName}`
        });
        return;
      }
      
      // Type validation
      switch (fieldDef.type) {
        case 'string':
        case 'text':
          if (fieldValue !== null && typeof fieldValue !== 'string') {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be a string`
            });
          }
          
          if (fieldDef.min_length && fieldValue && fieldValue.length < fieldDef.min_length) {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be at least ${fieldDef.min_length} characters`
            });
          }
          
          if (fieldDef.max_length && fieldValue && fieldValue.length > fieldDef.max_length) {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be at most ${fieldDef.max_length} characters`
            });
          }
          break;
          
        case 'number':
        case 'integer':
          if (fieldValue !== null && typeof fieldValue !== 'number') {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be a number`
            });
          }
          
          if (fieldDef.min !== undefined && fieldValue < fieldDef.min) {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be at least ${fieldDef.min}`
            });
          }
          
          if (fieldDef.max !== undefined && fieldValue > fieldDef.max) {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be at most ${fieldDef.max}`
            });
          }
          break;
          
        case 'boolean':
          if (fieldValue !== null && typeof fieldValue !== 'boolean') {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be a boolean`
            });
          }
          break;
          
        case 'date':
        case 'timestamp':
          if (fieldValue !== null && !(new Date(fieldValue)).getTime()) {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be a valid date`
            });
          }
          break;
          
        case 'enum':
          if (fieldValue !== null && !fieldDef.enum_values.includes(fieldValue)) {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be one of: ${fieldDef.enum_values.join(', ')}`
            });
          }
          break;
          
        case 'jsonb':
        case 'json':
          // Basic check - more complex validation would use JSON schema
          if (fieldValue !== null && typeof fieldValue !== 'object') {
            errors.push({
              field: fieldName,
              message: `${fieldName} must be a valid JSON object`
            });
          }
          break;
      }
    });
  }
  
  // For GET, PUT, PATCH, DELETE with ID, validate the ID
  if ((method === 'GET' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') && id) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      errors.push({
        field: 'id',
        message: 'Invalid ID format'
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Check permissions based on metadata.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/permissions.js
 */
function checkPermissions(user, method, action, id, metadata) {
  // Get user roles
  const userRoles = user.roles || [];
  
  // Default to no access
  let allowed = false;
  let restrictedFields = [];
  
  // Check role-based permissions
  for (const role of userRoles) {
    const rolePermissions = metadata.permission_rules.roles[role];
    
    if (!rolePermissions) {
      continue;
    }
    
    // Check operation permission
    switch (method) {
      case 'GET':
        allowed = allowed || rolePermissions.read;
        break;
      case 'POST':
        if (action === 'search') {
          allowed = allowed || rolePermissions.read;
        } else {
          allowed = allowed || rolePermissions.create;
        }
        break;
      case 'PUT':
      case 'PATCH':
        allowed = allowed || rolePermissions.update;
        break;
      case 'DELETE':
        allowed = allowed || rolePermissions.delete;
        break;
    }
    
    // Collect restricted fields
    if (rolePermissions.field_restrictions && rolePermissions.field_restrictions.restricted_fields) {
      restrictedFields = [
        ...restrictedFields,
        ...rolePermissions.field_restrictions.restricted_fields
      ];
    }
  }
  
  // If not allowed by basic role permissions, check rule sets
  if (!allowed && metadata.permission_rules.rule_sets) {
    for (const ruleSet of metadata.permission_rules.rule_sets) {
      // For update/delete operations, we need to check against the current record
      // For simplicity, this is delegated to the handlers
      if (method === 'GET' || method === 'POST' || !id) {
        // Apply rule set
        let conditionsMatch = true;
        
        // For rule sets that don't involve checking current record values
        for (const conditionName of ruleSet.conditions) {
          const condition = metadata.permission_rules.conditions[conditionName];
          
          if (condition.value === '{current_user_id}' && condition.operator === 'eq') {
            // Special handling for user-related conditions
            conditionsMatch = conditionsMatch && (user.id === condition.value);
          }
          // More conditions would be handled here
        }
        
        if (conditionsMatch) {
          // Check operation permission in rule set
          switch (method) {
            case 'GET':
              allowed = allowed || ruleSet.permissions.read;
              break;
            case 'POST':
              if (action === 'search') {
                allowed = allowed || ruleSet.permissions.read;
              } else {
                allowed = allowed || ruleSet.permissions.create;
              }
              break;
            case 'PUT':
            case 'PATCH':
              allowed = allowed || ruleSet.permissions.update;
              break;
            case 'DELETE':
              allowed = allowed || ruleSet.permissions.delete;
              break;
          }
        }
      }
    }
  }
  
  return {
    allowed,
    restrictedFields: [...new Set(restrictedFields)],
    reason: allowed ? null : 'You do not have permission to perform this action'
  };
}

/**
 * Apply field permissions to the response.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/permissions.js
 */
function applyFieldPermissions(result, user, metadata, permissionResult) {
  if (!result || typeof result !== 'object') {
    return result;
  }
  
  if (Array.isArray(result)) {
    return result.map(item => applyFieldPermissions(item, user, metadata, permissionResult));
  }
  
  if (result.records && Array.isArray(result.records)) {
    return {
      ...result,
      records: result.records.map(record => applyFieldPermissions(record, user, metadata, permissionResult))
    };
  }
  
  // Remove restricted fields
  const filteredResult = { ...result };
  
  for (const field of permissionResult.restrictedFields) {
    if (field in filteredResult) {
      delete filteredResult[field];
    }
  }
  
  // Apply field-level permissions
  if (metadata.permission_rules.field_level_permissions) {
    const userRoles = user.roles || [];
    
    // Check each field with field-level permissions
    Object.entries(metadata.permission_rules.field_level_permissions).forEach(([field, permissions]) => {
      let canRead = false;
      
      // Check if any user role has read permission
      for (const role of userRoles) {
        if (permissions.roles[role] && permissions.roles[role].read) {
          canRead = true;
          break;
        }
      }
      
      if (!canRead && field in filteredResult) {
        delete filteredResult[field];
      }
    });
  }
  
  return filteredResult;
}

/**
 * Determine fields to select based on request and permissions.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/query.js
 */
function determineFieldSelection(requestedFields, metadata, permissionResult) {
  // Get field lists from metadata
  let fields;
  
  if (requestedFields) {
    // Use requested fields
    fields = requestedFields;
  } else if (metadata.api_config.response_fields) {
    // Use default fields from metadata
    fields = metadata.api_config.response_fields.default;
  } else {
    // Use all fields
    fields = metadata.schema_definition.fields.map(f => f.name);
  }
  
  // Remove restricted fields
  fields = fields.filter(field => !permissionResult.restrictedFields.includes(field));
  
  // Always include id
  if (!fields.includes('id')) {
    fields.unshift('id');
  }
  
  return fields.join(', ');
}

/**
 * Apply filters to the query.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/query.js
 */
function applyFilters(query, filters, metadata) {
  Object.entries(filters).forEach(([field, filter]) => {
    // Check if field exists and is filterable
    const fieldDef = metadata.schema_definition.fields.find(f => f.name === field);
    if (!fieldDef) return;
    
    // Get allowed operators for this field
    const allowedOperators = metadata.api_config.filters
      .find(f => f.field === field)?.operators || ['eq'];
    
    if (typeof filter === 'object') {
      // Complex filter with operator
      Object.entries(filter).forEach(([operator, value]) => {
        if (!allowedOperators.includes(operator)) return;
        
        switch (operator) {
          case 'eq':
            query = query.eq(field, value);
            break;
          case 'neq':
            query = query.neq(field, value);
            break;
          case 'gt':
            query = query.gt(field, value);
            break;
          case 'gte':
            query = query.gte(field, value);
            break;
          case 'lt':
            query = query.lt(field, value);
            break;
          case 'lte':
            query = query.lte(field, value);
            break;
          case 'in':
            query = query.in(field, value);
            break;
          case 'contains':
            query = query.ilike(field, `%${value}%`);
            break;
          case 'startsWith':
            query = query.ilike(field, `${value}%`);
            break;
          case 'endsWith':
            query = query.ilike(field, `%${value}`);
            break;
          case 'between':
            if (Array.isArray(value) && value.length === 2) {
              query = query.gte(field, value[0]).lte(field, value[1]);
            }
            break;
          case 'jsonContains':
            if (fieldDef.type === 'jsonb' || fieldDef.type === 'json') {
              query = query.contains(field, value);
            }
            break;
        }
      });
    } else {
      // Simple equality filter
      query = query.eq(field, filter);
    }
  });
  
  return query;
}

/**
 * Apply sorting to the query.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/query.js
 */
function applySorting(query, sort, metadata) {
  if (Array.isArray(sort)) {
    // Multiple sort fields
    sort.forEach(sortItem => {
      if (typeof sortItem === 'object') {
        const { field, direction } = sortItem;
        if (field) {
          query = query.order(field, { ascending: direction === 'asc' });
        }
      } else if (typeof sortItem === 'string') {
        // Simple string field (default ascending)
        query = query.order(sortItem, { ascending: true });
      }
    });
  } else if (typeof sort === 'object') {
    // Single sort object
    const { field, direction } = sort;
    if (field) {
      query = query.order(field, { ascending: direction === 'asc' });
    }
  } else if (typeof sort === 'string') {
    // Simple string field (default ascending)
    query = query.order(sort, { ascending: true });
  }
  
  return query;
}

/**
 * Apply default values to data.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/data.js
 */
function applyDefaultValues(data, metadata) {
  const result = { ...data };
  
  metadata.schema_definition.fields.forEach(field => {
    if (field.default !== undefined && result[field.name] === undefined) {
      // Special case for current user
      if (field.default === '{current_user}' && field.name === 'owner_id') {
        result[field.name] = user.id;
      } else {
        result[field.name] = field.default;
      }
    }
  });
  
  return result;
}

/**
 * Execute hooks for an operation.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/hooks.js
 */
async function executeHooks(hookType, data, metadata, supabase, user, oldData) {
  let result = { ...data };
  
  // Get hooks for this operation
  const hooks = metadata.api_config.hooks?.[hookType] || [];
  
  for (const hookName of hooks) {
    // Execute the hook
    try {
      // In a real implementation, hooks would be defined in a separate module
      // and imported dynamically or registered in a hooks registry
      
      // For demonstration purposes, we'll just simulate some common hooks
      switch (hookName) {
        case 'validate_policy_title':
          // Example validation hook
          if (result.title && result.title.length < 3) {
            throw new Error('Policy title must be at least 3 characters');
          }
          break;
          
        case 'set_default_values':
          // Example default values hook
          if (!result.status) {
            result.status = 'draft';
          }
          break;
          
        case 'notify_policy_stakeholders':
          // Example notification hook
          // In a real implementation, this would send notifications
          console.log(`Notifying stakeholders about policy ${result.id}`);
          break;
          
        case 'log_policy_creation':
        case 'log_policy_update':
        case 'log_policy_deletion':
          // Example audit logging hook
          await supabase
            .from('audit_logs')
            .insert({
              entity_type: metadata.table_name,
              entity_id: result.id,
              action_type: hookType.replace('after_', '').toUpperCase(),
              user_id: user.id,
              previous_values: oldData ? JSON.stringify(oldData) : null,
              new_values: JSON.stringify(result),
              organization_id: user.organization_id
            });
          break;
      }
    } catch (error) {
      throw new Error(`Hook error (${hookName}): ${error.message}`);
    }
  }
  
  return result;
}

/**
 * Log trace information for observability.
 * Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/logging.js
 */
async function logTrace(supabase, traceData) {
  try {
    await supabase
      .from('request_traces')
      .insert({
        ...traceData,
        timestamp: traceData.timestamp || new Date().toISOString()
      });
  } catch (error) {
    console.error('Error logging trace:', error);
    // Non-blocking - continue even if logging fails
  }
}

// ===================================================================
// PART 6: FLUTTER FRONTEND INTEGRATION
// ===================================================================

/**
 * Flutter Frontend API Service
 * ----------------------------
 * This is a Dart class that provides methods for interacting with the
 * metadata-driven API from the Flutter frontend.
 * 
 * Location: arioncomply-v1/frontend-flutter/lib/services/api_service.dart
 * 
 * Example Dart code:
 */

/*
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl;
  final FlutterSecureStorage secureStorage = FlutterSecureStorage();
  
  ApiService({required this.baseUrl});
  
  Future<String?> get authToken async {
    return await secureStorage.read(key: 'auth_token');
  }
  
  // Generic API request method
  Future<Map<String, dynamic>> request({
    required String method,
    required String entity,
    String? id,
    String? action,
    Map<String, dynamic>? data,
    Map<String, dynamic>? filter,
    dynamic sort,
    int? page,
    int? limit,
    List<String>? fields,
  }) async {
    final token = await authToken;
    if (token == null) {
      throw Exception('Authentication required');
    }
    
    final url = id != null
      ? '$baseUrl/metadata_api_router/$entity/$id'
      : '$baseUrl/metadata_api_router/$entity';
    
    final body = {
      'entity': entity,
      'action': action,
      if (id != null) 'id': id,
      if (data != null) 'data': data,
      if (filter != null) 'filter': filter,
      if (sort != null) 'sort': sort,
      if (page != null) 'page': page,
      if (limit != null) 'limit': limit,
      if (fields != null) 'fields': fields,
    };
    
    final response = await http.request(
      url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(body),
    );
    
    final responseData = jsonDecode(response.body);
    
    if (response.statusCode >= 400) {
      throw ApiException(
        responseData['error'] ?? 'Unknown error',
        responseData['message'] ?? 'An error occurred',
        responseData['validation_errors'],
        responseData['trace_id'],
      );
    }
    
    return responseData['data'];
  }
  
  // CRUD operations
  Future<Map<String, dynamic>> getById(String entity, String id, {List<String>? fields}) async {
    return await request(
      method: 'GET',
      entity: entity,
      id: id,
      fields: fields,
    );
  }
  
  Future<Map<String, dynamic>> list(
    String entity, {
    Map<String, dynamic>? filter,
    dynamic sort,
    int? page,
    int? limit,
    List<String>? fields,
  }) async {
    return await request(
      method: 'GET',
      entity: entity,
      filter: filter,
      sort: sort,
      page: page,
      limit: limit,
      fields: fields,
    );
  }
  
  Future<Map<String, dynamic>> create(String entity, Map<String, dynamic> data) async {
    return await request(
      method: 'POST',
      entity: entity,
      data: data,
    );
  }
  
  Future<Map<String, dynamic>> update(String entity, String id, Map<String, dynamic> data, {bool patch = true}) async {
    return await request(
      method: patch ? 'PATCH' : 'PUT',
      entity: entity,
      id: id,
      data: data,
    );
  }
  
  Future<Map<String, dynamic>> delete(String entity, String id) async {
    return await request(
      method: 'DELETE',
      entity: entity,
      id: id,
    );
  }
  
  Future<Map<String, dynamic>> search(
    String entity, {
    String? query,
    Map<String, dynamic>? filters,
    dynamic sort,
    int? page,
    int? limit,
    List<String>? fields,
  }) async {
    return await request(
      method: 'POST',
      entity: entity,
      action: 'search',
      data: {
        'query': query,
        'filters': filters,
        'sort': sort,
        'page': page,
        'limit': limit,
        'fields': fields,
      },
    );
  }
}

class ApiException implements Exception {
  final String error;
  final String message;
  final List<Map<String, dynamic>>? validationErrors;
  final String? traceId;
  
  ApiException(this.error, this.message, this.validationErrors, this.traceId);
  
  @override
  String toString() {
    return '$error: $message${traceId != null ? ' (Trace ID: $traceId)' : ''}';
  }
}
*/

// ===================================================================
// PART 7: EXAMPLE IMPLEMENTATION
// ===================================================================

/**
 * Example: Adding a Policy Entity to Metadata Registry
 * ---------------------------------------------------
 * This is an example of how to add a new entity to the metadata registry.
 */

const policyEntityExample = `
-- Add policy entity to metadata registry
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
  standard_mappings,
  is_active,
  is_system_table,
  organization_id,
  created_by
) VALUES (
  'policies',
  'Policies',
  'Organizational policies and procedures',
  '${JSON.stringify(schemaDefinitionExample)}',
  '${JSON.stringify(apiConfigExample)}',
  '${JSON.stringify(uiConfigExample)}',
  '${JSON.stringify(permissionRules