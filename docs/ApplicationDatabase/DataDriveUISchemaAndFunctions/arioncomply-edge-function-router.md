# ArionComply Edge Function API Router

## Introduction

The Edge Function API Router is the central component of ArionComply's metadata-driven API architecture. It dynamically routes and processes API requests based on entity metadata, enabling consistent handling of CRUD operations, permissions, validation, and error responses across all entities.

## Architecture Overview

The Edge Function API Router is implemented as a Supabase Edge Function, which is a serverless function that runs close to the database for optimal performance. The router handles all API requests for ArionComply entities, eliminating the need for custom endpoint handlers for each entity.

## Request Flow

1. Client sends a request to the API endpoint
2. Edge Function Router receives the request
3. Router extracts request parameters
4. Router loads metadata for the requested entity
5. Router validates the request against metadata
6. Router checks permissions based on user role and metadata
7. Router routes the request to the appropriate handler
8. Handler processes the request
9. Router formats and returns the response

## Router Implementation

The main entry point for the Edge Function API Router is the `metadataApiRouter` function:

```javascript
// Location: arioncomply-v1/backend/edge-functions/metadata_api_router/index.js

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
```

## Request Validation

The router validates incoming requests against the metadata schema using the `validateRequest` function:

```javascript
// Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/validation.js

function validateRequest(method, action, id, data, metadata) {
  const errors = [];
  
  // Validate entity operation is enabled
  if (!metadata.api_config.enable_crud) {
    errors.push({
      field: 'entity',
      message: `CRUD operations are disabled for ${metadata.display_name}`
    });
  }
  
  // Validate endpoint and method are allowed
  if (method !== 'GET') {
    const endpoint = id
      ? metadata.api_config.endpoints.find(e => e.path === `/${metadata.table_name}/{id}`)
      : metadata.api_config.endpoints.find(e => e.path === `/${metadata.table_name}`);
    
    if (!endpoint) {
      errors.push({
        field: 'endpoint',
        message: `Endpoint not found for ${metadata.table_name}`
      });
    } else if (!endpoint.methods.includes(method)) {
      errors.push({
        field: 'method',
        message: `Method ${method} not allowed for endpoint ${endpoint.path}`
      });
    }
  }
  
  // Validate fields for POST/PUT/PATCH
  if ((method === 'POST' && !action) || method === 'PUT' || method === 'PATCH') {
    if (!data) {
      errors.push({
        field: 'data',
        message: 'Data is required for POST/PUT/PATCH requests'
      });
    } else {
      // Validate required fields
      metadata.schema_definition.fields.forEach(field => {
        if (field.required && method === 'POST' && !data[field.name] && !field.default) {
          errors.push({
            field: field.name,
            message: `${field.name} is required`
          });
        }
        
        // Validate field types and constraints
        if (data[field.name] !== undefined) {
          switch (field.type) {
            case 'text':
              if (field.min_length && data[field.name].length < field.min_length) {
                errors.push({
                  field: field.name,
                  message: `${field.name} must be at least ${field.min_length} characters`
                });
              }
              if (field.max_length && data[field.name].length > field.max_length) {
                errors.push({
                  field: field.name,
                  message: `${field.name} must be less than ${field.max_length} characters`
                });
              }
              break;
            case 'enum':
              if (field.enum_values && !field.enum_values.includes(data[field.name])) {
                errors.push({
                  field: field.name,
                  message: `${field.name} must be one of: ${field.enum_values.join(', ')}`
                });
              }
              break;
            // Additional type validations would go here
          }
        }
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

## Permission Checking

The router checks if the user has permission to perform the requested operation using the `checkPermissions` function:

```javascript
// Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/permissions.js

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
  
  return {
    allowed,
    restrictedFields: [...new Set(restrictedFields)],
    reason: allowed ? null : 'You do not have permission to perform this action'
  };
}
```

## Field Permission Application

The router applies field-level permissions to the response using the `applyFieldPermissions` function:

```javascript
// Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/permissions.js

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
```

## Request Tracing

The router logs request information for observability using the `logTrace` function:

```javascript
// Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/logging.js

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
```

## API Request Handler Pattern

The router delegates request processing to specialized handlers based on the HTTP method and request parameters. Each handler follows a similar pattern:

1. Determine which fields to select based on the request and permissions
2. Construct and execute the database query
3. Process the result, applying any necessary transformations
4. Return the formatted result

Here's the pseudocode for the request handler pattern:

```
FUNCTION handleRequest(entity, parameters, metadata, permissionResult, user, supabase):
  // 1. Determine fields to select
  fieldSelection = determineFieldSelection(parameters.fields, metadata, permissionResult)
  
  // 2. Construct and execute the query
  dbQuery = constructQuery(entity, parameters, fieldSelection, metadata)
  result = executeQuery(dbQuery, supabase)
  
  // 3. Process the result
  processedResult = processResult(result, metadata, user)
  
  // 4. Return the formatted result
  RETURN formatResult(processedResult)
```

## Dynamic Query Building

The router dynamically builds database queries based on the request parameters and metadata using utility functions:

### Field Selection

```javascript
// Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/query.js

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
```

### Filter Application

```javascript
// Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/query.js

function applyFilters(query, filters, metadata) {
  // Handle array of filter objects
  if (Array.isArray(filters)) {
    filters.forEach(filter => {
      query = applySingleFilter(query, filter, metadata);
    });
  } 
  // Handle single filter object
  else if (typeof filters === 'object') {
    Object.entries(filters).forEach(([field, value]) => {
      // Simple equality filter
      if (typeof value !== 'object') {
        query = query.eq(field, value);
      } 
      // Complex filter with operator
      else {
        const { operator, value: filterValue } = value;
        query = applyOperator(query, field, operator, filterValue);
      }
    });
  }
  
  return query;
}

function applySingleFilter(query, filter, metadata) {
  const { field, operator, value } = filter;
  
  // Validate field is filterable
  const fieldMetadata = metadata.schema_definition.fields.find(f => f.name === field);
  if (!fieldMetadata || !fieldMetadata.filterable) {
    // Field is not filterable, ignore the filter
    return query;
  }
  
  return applyOperator(query, field, operator, value);
}

function applyOperator(query, field, operator, value) {
  switch (operator) {
    case 'eq':
      return query.eq(field, value);
    case 'neq':
      return query.neq(field, value);
    case 'gt':
      return query.gt(field, value);
    case 'gte':
      return query.gte(field, value);
    case 'lt':
      return query.lt(field, value);
    case 'lte':
      return query.lte(field, value);
    case 'in':
      return query.in(field, Array.isArray(value) ? value : [value]);
    case 'contains':
      return query.ilike(field, `%${value}%`);
    case 'startsWith':
      return query.ilike(field, `${value}%`);
    case 'endsWith':
      return query.ilike(field, `%${value}`);
    case 'between':
      if (Array.isArray(value) && value.length === 2) {
        return query.gte(field, value[0]).lte(field, value[1]);
      }
      return query;
    case 'jsonContains':
      return query.containedBy(field, value);
    default:
      return query;
  }
}
```

### Sort Application

```javascript
// Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/query.js

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
```

## Hook Execution

The router executes hooks at various points in the request lifecycle using the `executeHooks` function:

```javascript
// Location: arioncomply-v1/backend/edge-functions/metadata_api_router/utils/hooks.js

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
```

## Frontend API Service

The frontend interacts with the Edge Function API Router using an API service. Here's a pseudocode representation of how the frontend might use the API:

```
CLASS ApiService:
    CONSTRUCTOR(baseUrl):
        this.baseUrl = baseUrl
        this.secureStorage = CREATE SecureStorage instance
    
    ASYNC FUNCTION getAuthToken():
        RETURN await secureStorage.read(key: 'auth_token')
    
    // Generic API request method
    ASYNC FUNCTION request(parameters):
        token = await getAuthToken()
        IF token IS NULL:
            THROW AuthenticationException
        
        IF parameters.id IS NOT NULL:
            url = '{baseUrl}/metadata_api_router/{parameters.entity}/{parameters.id}'
        ELSE:
            url = '{baseUrl}/metadata_api_router/{parameters.entity}'
        
        requestBody = {
            'entity': parameters.entity,
            'action': parameters.action,
            'id': parameters.id, // if provided
            'data': parameters.data, // if provided
            'filter': parameters.filter, // if provided
            'sort': parameters.sort, // if provided
            'page': parameters.page, // if provided
            'limit': parameters.limit, // if provided
            'fields': parameters.fields // if provided
        }
        
        response = await HTTP_REQUEST(
            url: url,
            method: parameters.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {token}'
            },
            body: JSON.ENCODE(requestBody)
        )
        
        responseData = JSON.DECODE(response.body)
        
        IF response.statusCode >= 400:
            THROW ApiException(
                error: responseData['error'] || 'Unknown error',
                message: responseData['message'] || 'An error occurred',
                validationErrors: responseData['validation_errors'],
                traceId: responseData['trace_id']
            )
        
        RETURN responseData['data']
    
    // CRUD operations
    ASYNC FUNCTION getById(entity, id, fields = NULL):
        RETURN await request({
            method: 'GET',
            entity: entity,
            id: id,
            fields: fields
        })
    
    ASYNC FUNCTION list(entity, parameters):
        RETURN await request({
            method: 'GET',
            entity: entity,
            filter: parameters.filter,
            sort: parameters.sort,
            page: parameters.page,
            limit: parameters.limit,
            fields: parameters.fields
        })
    
    ASYNC FUNCTION create(entity, data):
        RETURN await request({
            method: 'POST',
            entity: entity,
            data: data
        })
    
    ASYNC FUNCTION update(entity, id, data, patch = true):
        RETURN await request({
            method: patch ? 'PATCH' : 'PUT',
            entity: entity,
            id: id,
            data: data
        })
    
    ASYNC FUNCTION delete(entity, id):
        RETURN await request({
            method: 'DELETE',
            entity: entity,
            id: id
        })
    
    ASYNC FUNCTION search(entity, parameters):
        RETURN await request({
            method: 'POST',
            entity: entity,
            action: 'search',
            data: {
                query: parameters.query,
                filters: parameters.filters,
                sort: parameters.sort,
                page: parameters.page,
                limit: parameters.limit,
                fields: parameters.fields
            }
        })

CLASS ApiException:
    CONSTRUCTOR(error, message, validationErrors, traceId):
        this.error = error
        this.message = message
        this.validationErrors = validationErrors
        this.traceId = traceId
    
    FUNCTION toString():
        RETURN '{error}: {message} {traceId ? '(Trace ID: ' + traceId + ')' : ''}'
```

## Example API Usage

Here's how you might use the API service in the frontend:

```
// List policies
ASYNC FUNCTION listPolicies():
    TRY:
        policies = await apiService.list('policies', {
            filter: { status: 'published' },
            sort: { field: 'updated_at', direction: 'desc' },
            page: 1,
            limit: 10
        })
        
        RETURN policies
    CATCH error:
        DISPLAY_ERROR(error.message)
        RETURN []

// Get a policy by ID
ASYNC FUNCTION getPolicy(id):
    TRY:
        policy = await apiService.getById('policies', id)
        RETURN policy
    CATCH error:
        DISPLAY_ERROR(error.message)
        RETURN NULL

// Create a new policy
ASYNC FUNCTION createPolicy(data):
    TRY:
        policy = await apiService.create('policies', data)
        DISPLAY_SUCCESS('Policy created successfully')
        RETURN policy
    CATCH error:
        DISPLAY_ERROR(error.message)
        RETURN NULL

// Update a policy
ASYNC FUNCTION updatePolicy(id, data):
    TRY:
        policy = await apiService.update('policies', id, data)
        DISPLAY_SUCCESS('Policy updated successfully')
        RETURN policy
    CATCH error:
        DISPLAY_ERROR(error.message)
        RETURN NULL

// Delete a policy
ASYNC FUNCTION deletePolicy(id):
    TRY:
        await apiService.delete('policies', id)
        DISPLAY_SUCCESS('Policy deleted successfully')
        RETURN true
    CATCH error:
        DISPLAY_ERROR(error.message)
        RETURN false

// Search policies
ASYNC FUNCTION searchPolicies(query):
    TRY:
        policies = await apiService.search('policies', {
            query: query,
            page: 1,
            limit: 10
        })
        
        RETURN policies
    CATCH error:
        DISPLAY_ERROR(error.message)
        RETURN []
```

## Workflow Actions

The Edge Function API Router supports workflow actions, which are custom endpoints that trigger workflow transitions. Here's how you might implement a workflow action in the frontend:

```
// Submit a policy for review
ASYNC FUNCTION submitPolicyForReview(id):
    TRY:
        // Show confirmation dialog
        confirmed = await SHOW_CONFIRMATION_DIALOG(
            title: 'Submit for Review',
            message: 'Are you sure you want to submit this policy for review?',
            confirmButton: 'Submit',
            cancelButton: 'Cancel'
        )
        
        IF NOT confirmed:
            RETURN false
        
        // Call the API
        result = await apiService.request({
            method: 'POST',
            entity: 'policies',
            id: id,
            action: 'submit_for_review',
            data: {}
        })
        
        DISPLAY_SUCCESS('Policy submitted for review')
        RETURN true
    CATCH error:
        DISPLAY_ERROR(error.message)
        RETURN false
```

## Conclusion

The Edge Function API Router is the heart of ArionComply's metadata-driven architecture. By centralizing request handling, validation, permission checking, and response formatting, it ensures consistent behavior across all entities while enabling customization through metadata.

Key benefits of this approach include:

1. **Code Reuse**: The same router code handles all entities, reducing duplication
2. **Consistency**: Common patterns are applied uniformly across all entities
3. **Flexibility**: Entity behavior can be modified by updating metadata rather than code
4. **Maintainability**: Changes to one aspect (e.g., validation) can be made in one place
5. **Extensibility**: New functionality can be added to all entities by updating the router

The router's modular design makes it easy to extend with new features, such as additional filter operators, sorting options, or workflow actions. By leveraging Supabase Edge Functions, it provides a scalable and performant solution for ArionComply's API needs.