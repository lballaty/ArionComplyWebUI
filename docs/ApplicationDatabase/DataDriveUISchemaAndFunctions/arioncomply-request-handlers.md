# ArionComply Request Handlers and Utility Functions

## Introduction

This document details the request handlers and utility functions used in ArionComply's metadata-driven API architecture. These components process API requests based on entity metadata, enabling consistent handling of CRUD operations, permissions, validation, and error responses across all entities.

## Request Handlers

The Edge Function API Router delegates request processing to specialized handlers based on the HTTP method and request parameters. Each handler follows a similar pattern but is optimized for its specific operation.

### GET by ID Handler

The `handleGetById` handler retrieves a specific entity record by its ID.

```
FUNCTION handleGetById(entity, id, fields, metadata, permissionResult, supabase):
  // Determine which fields to select
  fieldSelection = determineFieldSelection(fields, metadata, permissionResult)
  
  // Execute the query
  result = supabase.from(entity).select(fieldSelection).eq('id', id).maybeSingle()
  
  IF result.error:
    THROW Error('Database error: ' + result.error.message)
  
  IF result.data IS NULL:
    RETURN {
      status: 404,
      error: 'record_not_found',
      message: metadata.display_name + ' with ID ' + id + ' not found'
    }
  
  // Execute any post-read hooks
  processedData = executeHooks('after_read', result.data, metadata, supabase)
  
  RETURN processedData
```

### List Handler

The `handleList` handler retrieves a list of entity records with filtering, sorting, and pagination.

```
FUNCTION handleList(entity, filter, sort, page, limit, fields, metadata, permissionResult, supabase):
  // Determine which fields to select
  fieldSelection = determineFieldSelection(fields, metadata, permissionResult)
  
  // Start building the query
  query = supabase.from(entity).select(fieldSelection, { count: 'exact' })
  
  // Apply filters
  IF filter:
    query = applyFilters(query, filter, metadata)
  
  // Apply sorting
  IF sort:
    query = applySorting(query, sort, metadata)
  ELSE IF metadata.api_config.sorting:
    // Apply default sorting from metadata
    defaultSort = FIND sorting option WHERE default = true
    IF defaultSort:
      query = query.order(defaultSort.field, { ascending: defaultSort.direction === 'asc' })
  
  // Apply pagination
  pageSize = limit OR metadata.api_config.pagination?.default_limit OR 25
  maxPageSize = metadata.api_config.pagination?.max_limit OR 100
  actualLimit = MIN(pageSize, maxPageSize)
  
  query = query.limit(actualLimit)
  
  IF page:
    offset = (page - 1) * actualLimit
    query = query.range(offset, offset + actualLimit - 1)
  
  // Execute the query
  result = AWAIT query
  
  IF result.error:
    THROW Error('Database error: ' + result.error.message)
  
  // Execute any post-read hooks for each record
  processedData = []
  FOR EACH record IN result.data:
    processedRecord = AWAIT executeHooks('after_read', record, metadata, supabase)
    ADD processedRecord TO processedData
  
  RETURN {
    records: processedData,
    total: result.count,
    page: page OR 1,
    page_size: actualLimit,
    pages: CEILING(result.count / actualLimit)
  }
```

### Create Handler

The `handleCreate` handler creates a new entity record.

```
FUNCTION handleCreate(entity, data, metadata, permissionResult, user, supabase):
  // Apply default values from metadata
  dataWithDefaults = applyDefaultValues(data, metadata)
  
  // Execute before-create hooks
  processedData = AWAIT executeHooks('before_create', dataWithDefaults, metadata, supabase, user)
  
  // Add audit fields
  processedData.created_by = user.id
  processedData.updated_by = user.id
  processedData.organization_id = user.organization_id
  
  // Execute the query
  result = AWAIT supabase.from(entity).insert(processedData).select().single()
  
  IF result.error:
    THROW Error('Database error: ' + result.error.message)
  
  // Execute after-create hooks
  finalData = AWAIT executeHooks('after_create', result.data, metadata, supabase, user)
  
  RETURN {
    status: 201,
    ...finalData
  }
```

### Update Handler

The `handleUpdate` handler updates an existing entity record.

```
FUNCTION handleUpdate(entity, id, data, isPatch, metadata, permissionResult, user, supabase):
  // Get the current record for before/after comparison
  result = AWAIT supabase.from(entity).select('*').eq('id', id).single()
  
  IF result.error:
    THROW Error('Database error: ' + result.error.message)
  
  IF result.data IS NULL:
    RETURN {
      status: 404,
      error: 'record_not_found',
      message: metadata.display_name + ' with ID ' + id + ' not found'
    }
  
  // Merge with current data if this is a PATCH request
  updateData = isPatch
    ? { ...result.data, ...data }
    : data
  
  // Execute before-update hooks
  processedData = AWAIT executeHooks('before_update', updateData, metadata, supabase, user, result.data)
  
  // Add audit fields
  processedData.updated_by = user.id
  processedData.updated_at = new Date().toISOString()
  
  // Execute the query
  result = AWAIT supabase.from(entity).update(processedData).eq('id', id).select().single()
  
  IF result.error:
    THROW Error('Database error: ' + result.error.message)
  
  // Execute after-update hooks
  finalData = AWAIT executeHooks('after_update', result.data, metadata, supabase, user, result.data)
  
  RETURN finalData
```

### Delete Handler

The `handleDelete` handler deletes an entity record.

```
FUNCTION handleDelete(entity, id, metadata, permissionResult, user, supabase):
  // Get the current record for hooks and validation
  result = AWAIT supabase.from(entity).select('*').eq('id', id).single()
  
  IF result.error:
    THROW Error('Database error: ' + result.error.message)
  
  IF result.data IS NULL:
    RETURN {
      status: 404,
      error: 'record_not_found',
      message: metadata.display_name + ' with ID ' + id + ' not found'
    }
  
  // Execute before-delete hooks
  AWAIT executeHooks('before_delete', result.data, metadata, supabase, user)
  
  // Execute the query
  deleteResult = AWAIT supabase.from(entity).delete().eq('id', id)
  
  IF deleteResult.error:
    THROW Error('Database error: ' + deleteResult.error.message)
  
  // Execute after-delete hooks
  AWAIT executeHooks('after_delete', result.data, metadata, supabase, user)
  
  RETURN {
    status: 200,
    message: metadata.display_name + ' with ID ' + id + ' has been deleted'
  }
```

### Search Handler

The `handleSearch` handler performs text search across entity records.

```
FUNCTION handleSearch(entity, searchParams, metadata, permissionResult, supabase):
  // Extract search parameters
  query = searchParams.query
  filters = searchParams.filters
  sort = searchParams.sort
  page = searchParams.page
  limit = searchParams.limit
  fields = searchParams.fields
  
  // Determine which fields to select
  fieldSelection = determineFieldSelection(fields, metadata, permissionResult)
  
  // Start building the query
  dbQuery = supabase.from(entity).select(fieldSelection, { count: 'exact' })
  
  // Apply text search if provided
  IF query:
    // Get searchable fields from metadata
    searchableFields = []
    FOR EACH field IN metadata.schema_definition.fields:
      IF field.searchable:
        ADD field.name TO searchableFields
    
    IF searchableFields.length > 0:
      // Construct text search column list
      searchColumns = JOIN searchableFields WITH ' || '
      dbQuery = dbQuery.textSearch(searchColumns, query)
  
  // Apply filters
  IF filters:
    dbQuery = applyFilters(dbQuery, filters, metadata)
  
  // Apply sorting
  IF sort:
    dbQuery = applySorting(dbQuery, sort, metadata)
  
  // Apply pagination
  pageSize = limit OR metadata.api_config.pagination?.default_limit OR 25
  maxPageSize = metadata.api_config.pagination?.max_limit OR 100
  actualLimit = MIN(pageSize, maxPageSize)
  
  dbQuery = dbQuery.limit(actualLimit)
  
  IF page:
    offset = (page - 1) * actualLimit
    dbQuery = dbQuery.range(offset, offset + actualLimit - 1)
  
  // Execute the query
  result = AWAIT dbQuery
  
  IF result.error:
    THROW Error('Database error: ' + result.error.message)
  
  // Execute any post-read hooks for each record
  processedData = []
  FOR EACH record IN result.data:
    processedRecord = AWAIT executeHooks('after_read', record, metadata, supabase)
    ADD processedRecord TO processedData
  
  RETURN {
    records: processedData,
    total: result.count,
    page: page OR 1,
    page_size: actualLimit,
    pages: CEILING(result.count / actualLimit)
  }
```

## Utility Functions

### Field Selection

The `determineFieldSelection` function determines which fields to select based on the request and permissions.

```
FUNCTION determineFieldSelection(fields, metadata, permissionResult):
  IF fields AND fields.length > 0:
    // User requested specific fields
    fieldsToSelect = fields
  ELSE:
    // Default to all non-excluded fields
    fieldsToSelect = []
    FOR EACH field IN metadata.schema_definition.fields:
      IF NOT field.exclude_from_select:
        ADD field.name TO fieldsToSelect
  
  // Remove restricted fields
  FOR EACH restrictedField IN permissionResult.restrictedFields:
    REMOVE restrictedField FROM fieldsToSelect
  
  // Convert to comma-separated string for Supabase
  RETURN JOIN fieldsToSelect WITH ','
```

### Filter Application

The `applyFilters` function applies filters to the query based on the request parameters.

```
FUNCTION applyFilters(query, filters, metadata):
  IF typeof filters === 'string':
    // Parse JSON string
    TRY:
      parsedFilters = JSON.parse(filters)
    CATCH:
      THROW Error('Invalid filter format')
  ELSE:
    parsedFilters = filters
  
  // Apply each filter
  FOR EACH filter IN parsedFilters:
    field = filter.field
    operator = filter.operator OR 'eq'
    value = filter.value
    
    // Validate field exists in metadata
    fieldDef = FIND field IN metadata.schema_definition.fields WHERE name = field
    IF NOT fieldDef:
      CONTINUE  // Skip this filter
    
    // Apply the filter based on operator
    SWITCH operator:
      CASE 'eq':
        query = query.eq(field, value)
        BREAK
      CASE 'neq':
        query = query.neq(field, value)
        BREAK
      CASE 'gt':
        query = query.gt(field, value)
        BREAK
      CASE 'gte':
        query = query.gte(field, value)
        BREAK
      CASE 'lt':
        query = query.lt(field, value)
        BREAK
      CASE 'lte':
        query = query.lte(field, value)
        BREAK
      CASE 'in':
        IF Array.isArray(value):
          query = query.in(field, value)
        BREAK
      CASE 'contains':
        query = query.ilike(field, '%' + value + '%')
        BREAK
      CASE 'startsWith':
        query = query.ilike(field, value + '%')
        BREAK
      CASE 'endsWith':
        query = query.ilike(field, '%' + value)
        BREAK
      CASE 'between':
        IF Array.isArray(value) AND value.length === 2:
          query = query.gte(field, value[0]).lte(field, value[1])
        BREAK
      CASE 'jsonContains':
        query = query.containedBy(field, value)
        BREAK
    END SWITCH
  END FOR
  
  RETURN query
```

### Sort Application

The `applySorting` function applies sorting to the query based on the request parameters.

```
FUNCTION applySorting(query, sort, metadata):
  IF Array.isArray(sort):
    // Multiple sort fields
    FOR EACH sortItem IN sort:
      IF typeof sortItem === 'object':
        field = sortItem.field
        direction = sortItem.direction
        IF field:
          query = query.order(field, { ascending: direction === 'asc' })
      ELSE IF typeof sortItem === 'string':
        // Simple string field (default ascending)
        query = query.order(sortItem, { ascending: true })
  ELSE IF typeof sort === 'object':
    // Single sort object
    field = sort.field
    direction = sort.direction
    IF field:
      query = query.order(field, { ascending: direction === 'asc' })
  ELSE IF typeof sort === 'string':
    // Simple string field (default ascending)
    query = query.order(sort, { ascending: true })
  
  RETURN query
```

### Default Value Application

The `applyDefaultValues` function applies default values from metadata to the data.

```
FUNCTION applyDefaultValues(data, metadata):
  result = { ...data }
  
  // Apply default values from metadata
  FOR EACH field IN metadata.schema_definition.fields:
    IF field.default_value !== undefined AND result[field.name] === undefined:
      // Apply default value
      IF field.default_value === '{current_timestamp}':
        result[field.name] = new Date().toISOString()
      ELSE IF field.default_value === '{current_user_id}':
        // This is handled separately with user context
        CONTINUE
      ELSE:
        result[field.name] = field.default_value
  
  RETURN result
```

### Request Validation

The `validateRequest` function validates the request data against the metadata schema.

```
FUNCTION validateRequest(data, metadata, isUpdate):
  errors = []
  
  // Validate required fields
  FOR EACH field IN metadata.schema_definition.fields:
    // Skip validation for updates if field not provided
    IF isUpdate AND data[field.name] === undefined:
      CONTINUE
    
    // Check required fields
    IF field.required AND data[field.name] === undefined:
      errors.push({
        field: field.name,
        message: field.name + ' is required'
      })
    
    // Skip further validation if value not provided
    IF data[field.name] === undefined:
      CONTINUE
    
    // Validate field based on type
    SWITCH field.type:
      CASE 'string':
        IF field.min_length AND data[field.name].length < field.min_length:
          errors.push({
            field: field.name,
            message: field.name + ' must be at least ' + field.min_length + ' characters'
          })
        
        IF field.max_length AND data[field.name].length > field.max_length:
          errors.push({
            field: field.name,
            message: field.name + ' must be at most ' + field.max_length + ' characters'
          })
        
        IF field.pattern AND NOT new RegExp(field.pattern).test(data[field.name]):
          errors.push({
            field: field.name,
            message: field.name + ' must match pattern ' + field.pattern
          })
        BREAK
      
      CASE 'number':
        IF field.min AND data[field.name] < field.min:
          errors.push({
            field: field.name,
            message: field.name + ' must be at least ' + field.min
          })
        
        IF field.max AND data[field.name] > field.max:
          errors.push({
            field: field.name,
            message: field.name + ' must be at most ' + field.max
          })
        BREAK
      
      CASE 'enum':
        IF field.enum_values AND NOT field.enum_values.includes(data[field.name]):
          errors.push({
            field: field.name,
            message: field.name + ' must be one of: ' + field.enum_values.join(', ')
          })
        BREAK
    END SWITCH
  END FOR
  
  RETURN {
    valid: errors.length === 0,
    errors: errors
  }
```

### Permission Checking

The `checkPermissions` function checks if the user has permission to perform the requested operation.

```
FUNCTION checkPermissions(user, method, action, id, metadata):
  // Get user roles
  userRoles = user.roles OR []
  
  // Default to no access
  allowed = false
  restrictedFields = []
  
  // Check role-based permissions
  FOR EACH role IN userRoles:
    rolePermissions = metadata.permission_rules.roles[role]
    
    IF NOT rolePermissions:
      CONTINUE
    
    // Check operation permission
    SWITCH method:
      CASE 'GET':
        allowed = allowed OR rolePermissions.read
        BREAK
      CASE 'POST':
        IF action === 'search':
          allowed = allowed OR rolePermissions.read
        ELSE:
          allowed = allowed OR rolePermissions.create
        BREAK
      CASE 'PUT':
      CASE 'PATCH':
        allowed = allowed OR rolePermissions.update
        BREAK
      CASE 'DELETE':
        allowed = allowed OR rolePermissions.delete
        BREAK
    END SWITCH
    
    // Collect restricted fields
    IF rolePermissions.field_restrictions AND rolePermissions.field_restrictions.restricted_fields:
      restrictedFields = [
        ...restrictedFields,
        ...rolePermissions.field_restrictions.restricted_fields
      ]
    
  END FOR
  
  // If not allowed by basic role permissions, check rule sets
  IF NOT allowed AND metadata.permission_rules.rule_sets:
    FOR EACH ruleSet IN metadata.permission_rules.rule_sets:
      // Apply rule set
      conditionsMatch = true
      
      // For rule sets that don't involve checking current record values
      FOR EACH conditionName IN ruleSet.conditions:
        condition = metadata.permission_rules.conditions[conditionName]
        
        IF condition.value === '{current_user_id}' AND condition.operator === 'eq':
          // Special handling for user-related conditions
          conditionsMatch = conditionsMatch AND (user.id === condition.value)
        // More conditions would be handled here
      END FOR
      
      IF conditionsMatch:
        // Check operation permission in rule set
        SWITCH method:
          CASE 'GET':
            allowed = allowed OR ruleSet.permissions.read
            BREAK
          CASE 'POST':
            IF action === 'search':
              allowed = allowed OR ruleSet.permissions.read
            ELSE:
              allowed = allowed OR ruleSet.permissions.create
            BREAK
          CASE 'PUT':
          CASE 'PATCH':
            allowed = allowed OR ruleSet.permissions.update
            BREAK
          CASE 'DELETE':
            allowed = allowed OR ruleSet.permissions.delete
            BREAK
        END SWITCH
      END IF
    END FOR
  END IF
  
  RETURN {
    allowed: allowed,
    restrictedFields: UNIQUE(restrictedFields),
    reason: allowed ? null : 'You do not have permission to perform this action'
  }
```

### Field Permission Application

The `applyFieldPermissions` function applies field-level permissions to the response.

```
FUNCTION applyFieldPermissions(result, user, metadata, permissionResult):
  IF NOT result OR typeof result !== 'object':
    RETURN result
  
  IF Array.isArray(result):
    RETURN MAP result WITH item => applyFieldPermissions(item, user, metadata, permissionResult)
  
  IF result.records AND Array.isArray(result.records):
    RETURN {
      ...result,
      records: MAP result.records WITH record => applyFieldPermissions(record, user, metadata, permissionResult)
    }
  
  // Remove restricted fields
  filteredResult = { ...result }
  
  FOR EACH field IN permissionResult.restrictedFields:
    IF field IN filteredResult:
      DELETE filteredResult[field]
  
  // Apply field-level permissions
  IF metadata.permission_rules.field_level_permissions:
    userRoles = user.roles OR []
    
    // Check each field with field-level permissions
    FOR EACH [field, permissions] IN metadata.permission_rules.field_level_permissions:
      canRead = false
      
      // Check if any user role has read permission
      FOR EACH role IN userRoles:
        IF permissions.roles[role] AND permissions.roles[role].read:
          canRead = true
          BREAK
      
      IF NOT canRead AND field IN filteredResult:
        DELETE filteredResult[field]
    END FOR
  END IF
  
  RETURN filteredResult
```

### Hook Execution

The `executeHooks` function executes hooks at various points in the request lifecycle.

```
FUNCTION executeHooks(hookType, data, metadata, supabase, user, oldData):
  result = { ...data }
  
  // Get hooks for this operation
  hooks = metadata.api_config.hooks?.[hookType] OR []
  
  FOR EACH hookName IN hooks:
    // Execute the hook
    TRY:
      // In a real implementation, hooks would be defined in a separate module
      // and imported dynamically or registered in a hooks registry
      
      // For demonstration purposes, we'll just simulate some common hooks
      SWITCH hookName:
        CASE 'validate_policy_title':
          // Example validation hook
          IF result.title AND result.title.length < 3:
            THROW Error('Policy title must be at least 3 characters')
          BREAK
          
        CASE 'set_default_values':
          // Example default values hook
          IF NOT result.status:
            result.status = 'draft'
          BREAK
          
        CASE 'notify_policy_stakeholders':
          // Example notification hook
          // In a real implementation, this would send notifications
          LOG('Notifying stakeholders about policy ' + result.id)
          BREAK
          
        CASE 'log_policy_creation':
        CASE 'log_policy_update':
        CASE 'log_policy_deletion':
          // Example audit logging hook
          AWAIT supabase
            .from('audit_logs')
            .insert({
              entity_type: metadata.table_name,
              entity_id: result.id,
              action_type: hookType.replace('after_', '').toUpperCase(),
              user_id: user.id,
              previous_values: oldData ? JSON.stringify(oldData) : null,
              new_values: JSON.stringify(result),
              organization_id: user.organization_id
            })
          BREAK
      END SWITCH
    CATCH error:
      THROW Error('Hook error (' + hookName + '): ' + error.message)
    END TRY
  END FOR
  
  RETURN result
```

## Request Tracing

The `logTrace` function logs request information for observability.

```
FUNCTION logTrace(supabase, traceData):
  TRY:
    AWAIT supabase
      .from('request_traces')
      .insert({
        ...traceData,
        timestamp: traceData.timestamp OR new Date().toISOString()
      })
  CATCH error:
    LOG_ERROR('Error logging trace:', error)
    // Non-blocking - continue even if logging fails
  END TRY
```

## LLM Integration Utilities

The following utilities enable integration with Language Learning Models (LLMs) for AI-assisted functionality.

### Process Natural Language Query

The `processNaturalLanguageQuery` function converts natural language queries into structured filters.

```
FUNCTION processNaturalLanguageQuery(query, entity, metadata, llmService):
  // Prepare prompt for the LLM
  prompt = 'Convert the following natural language query into a structured filter for the entity "' + 
           entity + '" with the following fields: '
  
  // Add field information
  FOR EACH field IN metadata.schema_definition.fields:
    prompt += field.name + ' (' + field.type + '): ' + (field.description OR '') + '\n'
  
  // Add the query
  prompt += '\nQuery: "' + query + '"\n'
  prompt += '\nOutput a JSON object with "filters" array containing field, operator, and value for each filter.'
  
  // Call LLM service
  llmResponse = AWAIT llmService.complete(prompt, {
    max_tokens: 500,
    temperature: 0.2
  })
  
  // Parse LLM response
  TRY:
    // Extract JSON from response
    jsonMatch = EXTRACT_JSON_FROM_TEXT(llmResponse)
    IF NOT jsonMatch:
      THROW Error('No valid JSON found in LLM response')
    
    filters = JSON.parse(jsonMatch)
    
    // Validate filters against metadata
    FOR EACH filter IN filters.filters:
      // Ensure field exists
      fieldDef = FIND field IN metadata.schema_definition.fields WHERE name = filter.field
      IF NOT fieldDef:
        THROW Error('Field "' + filter.field + '" not found in entity schema')
      
      // Validate operator
      validOperators = ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'contains', 'startsWith', 'endsWith', 'between']
      IF NOT validOperators.includes(filter.operator):
        filter.operator = 'eq'  // Default to equals if invalid
    
    RETURN filters
  CATCH error:
    THROW Error('Failed to process natural language query: ' + error.message)
  END TRY
```

### Generate Summary

The `generateSummary` function generates summaries of entity records using an LLM.

```
FUNCTION generateSummary(record, metadata, llmService):
  // Prepare prompt for the LLM
  prompt = 'Generate a concise summary of the following ' + metadata.display_name + ':\n\n'
  
  // Add record data, focusing on important fields
  FOR EACH field IN metadata.schema_definition.fields:
    IF field.important_for_summary AND record[field.name] !== undefined:
      prompt += field.display_name + ': ' + record[field.name] + '\n'
  
  // Call LLM service
  summary = AWAIT llmService.complete(prompt, {
    max_tokens: 150,
    temperature: 0.5
  })
  
  RETURN summary.trim()
```

### Suggest Related Entities

The `suggestRelatedEntities` function suggests related entities based on the current record.

```
FUNCTION suggestRelatedEntities(record, entity, metadata, supabase, llmService):
  // Get relationship information from metadata
  relationships = metadata.relationships OR []
  
  suggestions = []
  
  FOR EACH relationship IN relationships:
    IF relationship.source_entity === entity:
      // This entity is the source of the relationship
      targetMetadata = AWAIT getMetadata(relationship.target_entity, supabase)
      
      // Get the related records
      relatedRecords = AWAIT supabase
        .from(relationship.target_entity)
        .select('id, ' + (targetMetadata.summary_fields OR 'id'))
        .limit(5)
      
      IF relatedRecords.data AND relatedRecords.data.length > 0:
        suggestions.push({
          relationship_type: relationship.type,
          entity_type: relationship.target_entity,
          entity_display_name: targetMetadata.display_name,
          records: relatedRecords.data
        })
    END IF
  END FOR
  
  // Use LLM to suggest additional related entities based on content similarity
  prompt = 'Based on this ' + metadata.display_name + ' with the following properties:\n\n'
  
  // Add record data
  FOR EACH field IN metadata.schema_definition.fields:
    IF field.important_for_context AND record[field.name] !== undefined:
      prompt += field.display_name + ': ' + record[field.name] + '\n'
  
  prompt += '\nSuggest other types of entities from the following list that might be related:\n'
  
  // Get all entity types
  entities = AWAIT supabase.from('metadata_registry').select('entity_name, display_name')
  
  FOR EACH entityInfo IN entities.data:
    IF entityInfo.entity_name !== entity:
      prompt += '- ' + entityInfo.display_name + '\n'
  
  // Call LLM service
  llmSuggestions = AWAIT llmService.complete(prompt, {
    max_tokens: 200,
    temperature: 0.7
  })
  
  // Parse LLM suggestions (implementation would depend on LLM response format)
  
  RETURN suggestions
```

## Frontend API Service Integration

The frontend interacts with the Edge Function API Router using an API service. The following pseudocode demonstrates how to integrate with the API from a frontend application.

```
CLASS MetadataApiService:
  CONSTRUCTOR(baseUrl, supabaseClient):
    this.baseUrl = baseUrl
    this.supabaseClient = supabaseClient
    this.metadataCache = {}  // Cache for metadata
  
  // Get entity metadata
  ASYNC FUNCTION getMetadata(entity):
    IF this.metadataCache[entity]:
      RETURN this.metadataCache[entity]
    
    response = AWAIT this.supabaseClient.functions.invoke('metadata_api_router', {
      body: {
        action: 'get_metadata',
        entity: entity
      }
    })
    
    IF response.error:
      THROW Error('Failed to get metadata: ' + response.error.message)
    
    this.metadataCache[entity] = response.data
    RETURN response.data
  
  // Create a record
  ASYNC FUNCTION create(entity, data):
    response = AWAIT this.supabaseClient.functions.invoke('metadata_api_router', {
      body: {
        action: 'create',
        entity: entity,
        data: data
      }
    })
    
    IF response.error:
      THROW Error('Failed to create record: ' + response.error.message)
    
    RETURN response.data
  
  // Get a record by ID
  ASYNC FUNCTION getById(entity, id, fields):
    response = AWAIT this.supabaseClient.functions.invoke('metadata_api_router', {
      body: {
        action: 'get',
        entity: entity,
        id: id,
        fields: fields
      }
    })
    
    IF response.error:
      THROW Error('Failed to get record: ' + response.error.message)
    
    RETURN response.data
  
  // List records
  ASYNC FUNCTION list(entity, params):
    response = AWAIT this.supabaseClient.functions.invoke('metadata_api_router', {
      body: {
        action: 'list',
        entity: entity,
        ...params
      }
    })
    
    IF response.error:
      THROW Error('Failed to list records: ' + response.error.message)
    
    RETURN response.data
  
  // Update a record
  ASYNC FUNCTION update(entity, id, data, isPatch):
    response = AWAIT this.supabaseClient.functions.invoke('metadata_api_router', {
      body: {
        action: 'update',
        entity: entity,
        id: id,
        data: data,
        is_patch: isPatch
      }
    })
    
    IF response.error:
      THROW Error('Failed to update record: ' + response.error.message)
    
    RETURN response.data
  
  // Delete a record
  ASYNC FUNCTION delete(entity, id):
    response = AWAIT this.supabaseClient.functions.invoke('metadata_api_router', {
      body: {
        action: 'delete',
        entity: entity,
        id: id
      }
    })
    
    IF response.error:
      THROW Error('Failed to delete record: ' + response.error.message)
    
    RETURN response.data
  
  // Search records
  ASYNC FUNCTION search(entity, searchParams):
    response = AWAIT this.supabaseClient.functions.invoke('metadata_api_router', {
      body: {
        action: 'search',
        entity: entity,
        search_params: searchParams
      }
    })
    
    IF response.error:
      THROW Error('Failed to search records: ' + response.error.message)
    
    RETURN response.data
  
  // Process natural language query
  ASYNC FUNCTION naturalLanguageQuery(entity, query):
    response = AWAIT this.supabaseClient.functions.invoke('metadata_api_router', {
      body: {
        action: 'natural_language_query',
        entity: entity,
        query: query
      }
    })
    
    IF response.error:
      THROW Error('Failed to process natural language query: ' + response.error.message)
    
    RETURN response.data
END CLASS
```

## Example Implementation

### Policy Review Workflow Example

This example demonstrates how the request handlers and utility functions work together to implement a policy review workflow.

```
// When a user submits a policy for review
ASYNC FUNCTION submitPolicyForReview(policyId, user, supabase):
  // Get policy metadata
  metadata = AWAIT getMetadata('policies', supabase)
  
  // Check if user has permission to update the policy
  permissionResult = checkPermissions(user, 'PATCH', null, policyId, metadata)
  
  IF NOT permissionResult.allowed:
    THROW Error(permissionResult.reason)
  
  // Update the policy status
  updateData = {
    status: 'in_review',
    review_requested_at: new Date().toISOString(),
    review_requested_by: user.id
  }
  
  // Handle the update
  result = AWAIT handleUpdate('policies', policyId, updateData, true, metadata, permissionResult, user, supabase)
  
  // The after_update hooks defined in metadata will:
  // 1. Log the status change in the audit log
  // 2. Notify reviewers via the notification system
  // 3. Create a review task in the tasks table
  
  RETURN result
```

### Natural Language Search Example

This example demonstrates how to implement natural language search using the search handler and LLM integration.

```
// When a user enters a natural language search query
ASYNC FUNCTION handleNaturalLanguageSearch(entity, query, user, supabase, llmService):
  // Get entity metadata
  metadata = AWAIT getMetadata(entity, supabase)
  
  // Check if user has permission to read the entity
  permissionResult = checkPermissions(user, 'GET', null, null, metadata)
  
  IF NOT permissionResult.allowed:
    THROW Error(permissionResult.reason)
  
  // Convert natural language query to structured filters
  filters = AWAIT processNaturalLanguageQuery(query, entity, metadata, llmService)
  
  // Prepare search parameters
  searchParams = {
    filters: filters.filters,
    page: 1,
    limit: 25
  }
  
  // Execute the search
  result = AWAIT handleSearch(entity, searchParams, metadata, permissionResult, supabase)
  
  RETURN result
```

## Security Considerations

### Input Validation

All input from clients must be validated against the schema defined in the metadata:

1. Field names must exist in the entity schema
2. Field values must match the expected types
3. Field values must meet any constraints (min/max length, patterns, etc.)
4. Required fields must be provided for create operations

### Permission Enforcement

Permissions are enforced at multiple levels:

1. Operation-level permissions (create, read, update, delete)
2. Field-level permissions (restrict access to sensitive fields)
3. Record-level permissions (ownership, organizational boundaries)
4. Condition-based permissions (record state, user attributes)

### SQL Injection Prevention

The Supabase client library provides parameterized queries that prevent SQL injection:

1. Never concatenate user input directly into SQL strings
2. Use the provided query building methods (eq, neq, gt, etc.)
3. For advanced queries, use the Postgres RLS policies defined in the database

### Rate Limiting

To prevent abuse, implement rate limiting at the Edge Function level:

1. Track request counts per user/IP in a Redis cache or similar
2. Return 429 Too Many Requests when limits are exceeded
3. Use exponential backoff for persistent offenders

## Performance Optimization

### Query Optimization

Optimize database queries for performance:

1. Select only required fields
2. Use appropriate indexes on frequently queried fields
3. Limit result sets with pagination
4. Use caching for repeated queries

### Metadata Caching

Cache metadata to reduce database queries:

1. Use in-memory cache for frequently accessed metadata
2. Invalidate cache when metadata is updated
3. Use a distributed cache for multi-instance deployments

### Batch Operations

Support batch operations to reduce HTTP requests:

1. Implement batch create/update/delete handlers
2. Process batches in a single database transaction when possible
3. Return partial results if some operations fail

## Testing Strategy

### Unit Testing

Test individual functions in isolation:

1. Test handlers with mock database responses
2. Test utility functions with various inputs
3. Test permission checks with different user roles

### Integration Testing

Test the interaction between components:

1. Test the complete request-response cycle
2. Test database operations with a test database
3. Test permissions with different user scenarios

### End-to-End Testing

Test the complete system:

1. Test API endpoints with real HTTP requests
2. Test frontend-backend integration
3. Test workflows spanning multiple API calls

## Conclusion

The request handlers and utility functions in ArionComply's metadata-driven API architecture provide a flexible and maintainable way to implement complex business logic. By centralizing the logic in these components and driving behavior through metadata, the system can adapt to changing requirements without code changes.

Key benefits include:

1. Consistent handling of CRUD operations across all entities
2. Centralized permission enforcement
3. Flexible validation rules
4. Extensible hook system for custom business logic
5. Unified error handling and response formatting

These components work together to create a robust API that can evolve with the business while maintaining security, performance, and user experience.
