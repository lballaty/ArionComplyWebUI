# ArionComply Metadata JSON Schema Definitions

## Introduction

This document details the JSON schema structures used in ArionComply's metadata-driven architecture. These schemas define entity structure, API behavior, UI rendering, and permission rules, enabling the dynamic generation of APIs and UI components without custom code.

## Schema Definition Structure

The schema definition defines the entity's fields, types, constraints, and relationships. It's stored in the `schema_definition` field of the `metadata_registry` table.

### Structure Overview

```json
{
  "fields": [
    {
      "name": "field_name",
      "type": "data_type",
      "description": "Field description",
      "required": boolean,
      "primary_key": boolean,
      "unique": boolean,
      "default": "default_value",
      "min_length": number,
      "max_length": number,
      "enum_values": ["value1", "value2", ...],
      "references": {
        "table": "referenced_table",
        "field": "referenced_field",
        "on_delete": "CASCADE|SET NULL|..."
      },
      "searchable": boolean,
      "sortable": boolean,
      "filterable": boolean,
      "readonly": boolean,
      "system_field": boolean,
      "sensitive": boolean
    },
    // More fields...
  ],
  "indexes": [
    {
      "name": "index_name",
      "fields": ["field1", "field2", ...],
      "unique": boolean,
      "type": "btree|hash|gin|..."
    },
    // More indexes...
  ],
  "constraints": [
    {
      "name": "constraint_name",
      "check": "check_expression",
      "description": "Constraint description"
    },
    // More constraints...
  ]
}
```

### Field Properties

| Property       | Description                                                      | Example                      |
|----------------|------------------------------------------------------------------|------------------------------|
| name           | Field name in the database                                       | "title"                      |
| type           | Data type of the field                                           | "text", "uuid", "date"       |
| description    | Human-readable description                                       | "Title of the policy"        |
| required       | Whether the field is required                                    | true                         |
| primary_key    | Whether the field is the primary key                             | true (usually for "id")      |
| unique         | Whether the field value must be unique                           | true                         |
| default        | Default value for the field                                      | "draft", "uuid_generate_v4()"|
| min_length     | Minimum length for text fields                                   | 3                            |
| max_length     | Maximum length for text fields                                   | 255                          |
| enum_values    | Valid values for enum fields                                     | ["draft", "published", ...]  |
| references     | Foreign key reference details                                    | {"table": "users", ...}      |
| searchable     | Whether the field is included in search                          | true                         |
| sortable       | Whether the field can be sorted                                  | true                         |
| filterable     | Whether the field can be filtered                                | true                         |
| readonly       | Whether the field is read-only                                   | true                         |
| system_field   | Whether the field is a system field                              | true                         |
| sensitive      | Whether the field contains sensitive data                        | true                         |

### Index Properties

| Property | Description                                | Example                  |
|----------|--------------------------------------------|--------------------------|
| name     | Name of the index in the database          | "idx_policies_title"     |
| fields   | Fields included in the index               | ["title"]                |
| unique   | Whether the index enforces uniqueness      | false                    |
| type     | Type of index to create                    | "btree", "gin"           |

### Constraint Properties

| Property    | Description                             | Example                       |
|-------------|-----------------------------------------|-------------------------------|
| name        | Name of the constraint in the database  | "valid_custom_fields"         |
| check       | SQL expression for the check constraint | "jsonb_typeof(custom_fields) = 'object'" |
| description | Human-readable description              | "Ensures custom_fields is a valid JSON object" |

### Example Schema Definition

```json
{
  "fields": [
    {
      "name": "id",
      "type": "uuid",
      "primary_key": true,
      "default": "uuid_generate_v4()",
      "description": "Unique identifier",
      "searchable": false,
      "sortable": true,
      "filterable": true,
      "readonly": true,
      "system_field": true
    },
    {
      "name": "title",
      "type": "text",
      "required": true,
      "min_length": 3,
      "max_length": 255,
      "description": "Title of the policy",
      "searchable": true,
      "sortable": true,
      "filterable": true
    },
    {
      "name": "status",
      "type": "enum",
      "enum_values": ["draft", "in_review", "approved", "published", "archived"],
      "default": "draft",
      "description": "Current status of the policy",
      "searchable": true,
      "sortable": true,
      "filterable": true
    },
    {
      "name": "risk_level",
      "type": "enum",
      "enum_values": ["critical", "high", "medium", "low", "negligible"],
      "default": "medium",
      "description": "Risk level associated with this policy",
      "searchable": true,
      "sortable": true,
      "filterable": true
    },
    {
      "name": "effective_date",
      "type": "date",
      "description": "When the policy becomes effective",
      "searchable": false,
      "sortable": true,
      "filterable": true
    },
    {
      "name": "owner_id",
      "type": "uuid",
      "references": {
        "table": "users",
        "field": "id",
        "on_delete": "SET NULL"
      },
      "description": "User responsible for this policy",
      "searchable": false,
      "sortable": true,
      "filterable": true
    },
    {
      "name": "content",
      "type": "text",
      "description": "Main content of the policy document",
      "searchable": true,
      "sortable": false,
      "filterable": false
    },
    {
      "name": "custom_fields",
      "type": "jsonb",
      "description": "Organization-specific custom fields",
      "searchable": true,
      "sortable": false,
      "filterable": true,
      "default": "{}"
    },
    {
      "name": "version",
      "type": "integer",
      "default": 1,
      "description": "Current version number",
      "searchable": false,
      "sortable": true,
      "filterable": true,
      "readonly": true,
      "system_field": true
    },
    {
      "name": "organization_id",
      "type": "uuid",
      "references": {
        "table": "organizations",
        "field": "id",
        "on_delete": "CASCADE"
      },
      "required": true,
      "description": "Organization that owns this policy",
      "searchable": false,
      "sortable": false,
      "filterable": true,
      "system_field": true
    },
    {
      "name": "created_by",
      "type": "uuid",
      "references": {
        "table": "users",
        "field": "id",
        "on_delete": "SET NULL"
      },
      "required": true,
      "description": "User who created this policy",
      "searchable": false,
      "sortable": false,
      "filterable": true,
      "readonly": true,
      "system_field": true
    },
    {
      "name": "created_at",
      "type": "timestamptz",
      "default": "NOW()",
      "description": "When this policy was created",
      "searchable": false,
      "sortable": true,
      "filterable": true,
      "readonly": true,
      "system_field": true
    },
    {
      "name": "updated_by",
      "type": "uuid",
      "references": {
        "table": "users",
        "field": "id",
        "on_delete": "SET NULL"
      },
      "required": true,
      "description": "User who last updated this policy",
      "searchable": false,
      "sortable": false,
      "filterable": true,
      "readonly": true,
      "system_field": true
    },
    {
      "name": "updated_at",
      "type": "timestamptz",
      "default": "NOW()",
      "description": "When this policy was last updated",
      "searchable": false,
      "sortable": true,
      "filterable": true,
      "readonly": true,
      "system_field": true
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
      "name": "idx_policies_status",
      "fields": ["status"],
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
      "check": "jsonb_typeof(custom_fields) = 'object'",
      "description": "Ensures custom_fields is a valid JSON object"
    }
  ]
}
```

## API Configuration Structure

The API configuration defines how the entity behaves in the API, including available endpoints, methods, filters, and response formats. It's stored in the `api_config` field of the `metadata_registry` table.

### Structure Overview

```json
{
  "resource_name": "entity_name",
  "enable_crud": boolean,
  "batch_operations": boolean,
  "max_batch_size": number,
  "pagination": {
    "default_limit": number,
    "max_limit": number,
    "cursor_based": boolean
  },
  "endpoints": [
    {
      "path": "/path",
      "methods": ["GET", "POST", ...],
      "description": "Endpoint description",
      "rate_limit": {
        "requests": number,
        "period": "minute|hour|day"
      }
    },
    // More endpoints...
  ],
  "filters": [
    {
      "field": "field_name",
      "operators": ["eq", "contains", ...],
      "description": "Filter description"
    },
    // More filters...
  ],
  "sorting": [
    {
      "field": "field_name",
      "default": boolean,
      "direction": "asc|desc"
    },
    // More sorting options...
  ],
  "response_fields": {
    "default": ["field1", "field2", ...],
    "detailed": ["field1", "field2", ...],
    "minimal": ["field1", "field2", ...]
  },
  "hooks": {
    "before_create": ["hook1", "hook2", ...],
    "after_create": ["hook1", "hook2", ...],
    "before_update": ["hook1", "hook2", ...],
    "after_update": ["hook1", "hook2", ...],
    "before_delete": ["hook1", "hook2", ...],
    "after_delete": ["hook1", "hook2", ...],
    "after_status_change": ["hook1", "hook2", ...]
  },
  "rate_limits": {
    "default": {
      "requests": number,
      "period": "minute|hour|day"
    },
    "search": {
      "requests": number,
      "period": "minute|hour|day"
    }
  }
}
```

### Top-Level Properties

| Property         | Description                                      | Example                   |
|------------------|--------------------------------------------------|---------------------------|
| resource_name    | Name of the resource in the API                  | "policies"                |
| enable_crud      | Whether CRUD operations are enabled              | true                      |
| batch_operations | Whether batch operations are supported           | true                      |
| max_batch_size   | Maximum number of items in a batch operation     | 50                        |
| pagination       | Pagination configuration                         | {"default_limit": 25, ...}|
| endpoints        | Custom endpoints for this entity                 | [{"path": "/policies", ...}]|
| filters          | Available filters for this entity                | [{"field": "title", ...}] |
| sorting          | Available sorting options                        | [{"field": "title", ...}] |
| response_fields  | Field sets for different response types          | {"default": ["id", ...]}  |
| hooks            | Hooks to execute at different lifecycle stages   | {"before_create": [...]}  |
| rate_limits      | Rate limiting configuration                      | {"default": {...}}        |

### Endpoint Properties

| Property    | Description                             | Example                       |
|-------------|-----------------------------------------|-------------------------------|
| path        | URL path for the endpoint               | "/policies"                   |
| methods     | HTTP methods supported by the endpoint  | ["GET", "POST"]               |
| description | Human-readable description              | "List and create policies"    |
| rate_limit  | Rate limiting for this specific endpoint| {"requests": 100, "period": "minute"} |

### Filter Properties

| Property  | Description                             | Example                       |
|-----------|-----------------------------------------|-------------------------------|
| field     | Field to filter on                      | "title"                       |
| operators | Supported filter operators              | ["eq", "contains", "startsWith"] |
| description | Human-readable description            | "Filter by title"             |

### Sorting Properties

| Property  | Description                             | Example                       |
|-----------|-----------------------------------------|-------------------------------|
| field     | Field to sort on                        | "title"                       |
| default   | Whether this is the default sort        | false                         |
| direction | Default sort direction                  | "asc", "desc"                 |

### Example API Configuration

```json
{
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
      "description": "List and create policies",
      "rate_limit": {
        "requests": 100,
        "period": "minute"
      }
    },
    {
      "path": "/policies/{id}",
      "methods": ["GET", "PUT", "PATCH", "DELETE"],
      "description": "Get, update, or delete a specific policy"
    },
    {
      "path": "/policies/search",
      "methods": ["POST"],
      "description": "Advanced policy search",
      "rate_limit": {
        "requests": 20,
        "period": "minute"
      }
    },
    {
      "path": "/policies/{id}/versions",
      "methods": ["GET"],
      "description": "Get policy version history"
    },
    {
      "path": "/policies/{id}/submit_for_review",
      "methods": ["POST"],
      "description": "Submit policy for review",
      "workflow_action": true
    },
    {
      "path": "/policies/{id}/approve",
      "methods": ["POST"],
      "description": "Approve a policy",
      "workflow_action": true
    },
    {
      "path": "/policies/{id}/publish",
      "methods": ["POST"],
      "description": "Publish a policy",
      "workflow_action": true
    },
    {
      "path": "/policies/{id}/archive",
      "methods": ["POST"],
      "description": "Archive a policy",
      "workflow_action": true
    }
  ],
  "filters": [
    {
      "field": "title",
      "operators": ["eq", "contains", "startsWith"],
      "description": "Filter by title"
    },
    {
      "field": "status",
      "operators": ["eq", "in"],
      "description": "Filter by status"
    },
    {
      "field": "risk_level",
      "operators": ["eq", "in", "gt", "lt"],
      "description": "Filter by risk level"
    },
    {
      "field": "effective_date",
      "operators": ["eq", "gt", "lt", "between"],
      "description": "Filter by effective date"
    },
    {
      "field": "owner_id",
      "operators": ["eq", "in"],
      "description": "Filter by owner"
    },
    {
      "field": "custom_fields",
      "operators": ["jsonContains"],
      "description": "Filter by custom fields"
    }
  ],
  "sorting": [
    {"field": "title", "default": false},
    {"field": "effective_date", "default": true, "direction": "desc"},
    {"field": "risk_level", "default": false},
    {"field": "status", "default": false},
    {"field": "updated_at", "default": false}
  ],
  "response_fields": {
    "default": ["id", "title", "description", "status", "risk_level", "effective_date", "owner_id", "version", "updated_at"],
    "detailed": ["id", "title", "description", "status", "risk_level", "effective_date", "owner_id", "content", "custom_fields", "version", "created_by", "created_at", "updated_by", "updated_at"],
    "minimal": ["id", "title", "status"]
  },
  "hooks": {
    "before_create": ["validate_policy_title", "set_default_values", "sanitize_content"],
    "after_create": ["notify_policy_stakeholders", "log_policy_creation", "index_for_search"],
    "before_update": ["validate_policy_change", "check_version_conflict", "sanitize_content", "check_status_transition"],
    "after_update": ["create_version_if_content_changed", "notify_policy_change", "log_policy_update", "index_for_search"],
    "before_delete": ["check_policy_references", "verify_delete_permission"],
    "after_delete": ["notify_policy_deletion", "log_policy_deletion", "remove_from_search_index"],
    "after_status_change": ["handle_workflow_transition", "notify_status_change"]
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
}
```

## UI Configuration Structure

The UI configuration defines how the entity is displayed in the user interface, including form layouts, validations, and actions. It's stored in the `ui_config` field of the `metadata_registry` table.

### Structure Overview

```json
{
  "list_view": {
    "title": "View title",
    "description": "View description",
    "icon": "icon_name",
    "default_view": "table|cards|calendar",
    "alternative_views": ["table", "cards", "calendar"],
    "columns": [
      {
        "field": "field_name",
        "width": "percentage",
        "sortable": boolean,
        "primary": boolean,
        "render_as": "text|link|badge|date|user",
        "truncate": boolean,
        "colors": {
          "value1": "color1",
          "value2": "color2"
        }
      },
      // More columns...
    ],
    "actions": [
      {
        "name": "action_name",
        "label": "Action label",
        "icon": "icon_name",
        "primary": boolean,
        "permission": "permission_name",
        "location": "header|row",
        "confirmation": {
          "title": "Confirmation title",
          "message": "Confirmation message",
          "confirm_button": "Confirm button text",
          "cancel_button": "Cancel button text"
        }
      },
      // More actions...
    ],
    "filters": [
      {
        "field": "field_name",
        "label": "Filter label",
        "control": "select|dateRange|userSelect",
        "multi": boolean,
        "options": [
          {"value": "value1", "label": "Option 1"},
          {"value": "value2", "label": "Option 2"}
        ],
        "default": ["value1", "value2"]
      },
      // More filters...
    ],
    "search": {
      "enabled": boolean,
      "placeholder": "Search placeholder",
      "fields": ["field1", "field2"]
    },
    "batch_actions": [
      {
        "name": "action_name",
        "label": "Action label",
        "icon": "icon_name",
        "permission": "permission_name",
        "confirmation": {
          "title": "Confirmation title",
          "message": "Confirmation message",
          "confirm_button": "Confirm button text",
          "cancel_button": "Cancel button text"
        }
      },
      // More batch actions...
    ],
    "empty_state": {
      "title": "Empty state title",
      "message": "Empty state message",
      "action": {
        "label": "Action label",
        "icon": "icon_name",
        "permission": "permission_name"
      }
    }
  },
  "detail_view": {
    "title": "Detail title",
    "layout": "tabs|single",
    "actions": [
      {
        "name": "action_name",
        "label": "Action label",
        "icon": "icon_name",
        "permission": "permission_name",
        "primary": boolean,
        "conditions": [
          {"field": "field_name", "operator": "eq|in|not_in", "value": "value|[values]"}
        ],
        "workflow_action": boolean
      },
      // More actions...
    ],
    "sections": [
      {
        "id": "section_id",
        "label": "Section label",
        "icon": "icon_name",
        "fields": [
          {
            "field": "field_name",
            "size": "small|medium|large|full",
            "control": "textField|select|datePicker|richText|userSelect|documentEditor",
            "label": "Field label",
            "readonly": boolean|{
              "condition": {"field": "field_name", "operator": "eq|in|not_in", "value": "value|[values]"}
            }
          },
          // More fields...
        ]
      },
      // More sections...
    ],
    "related_entities": [
      {
        "entity": "entity_name",
        "label": "Related entity label",
        "relationship": "relationship_name",
        "filter": {"field": "field_name", "value": "{id}"}
      },
      // More related entities...
    ]
  },
  "create_view": {
    "title": "Create title",
    "layout": "tabs|single",
    "sections": [
      {
        "id": "section_id",
        "fields": [
          {
            "field": "field_name",
            "size": "small|medium|large|full",
            "required": boolean,
            "label": "Field label",
            "control": "textField|select|datePicker|richText|userSelect|documentEditor",
            "default": "default_value|{current_user}"
          },
          // More fields...
        ]
      },
      // More sections...
    ],
    "actions": [
      {
        "name": "action_name",
        "label": "Action label",
        "icon": "icon_name",
        "primary": boolean,
        "permission": "permission_name"
      },
      // More actions...
    ]
  },
  "edit_view": {
    "title": "Edit title",
    "layout": "tabs|single",
    "inherit_from": "detail_view",
    "readonly_condition": {
      "condition": {"field": "field_name", "operator": "eq|in|not_in", "value": "value|[values]"}
    },
    "actions": [
      {
        "name": "action_name",
        "label": "Action label",
        "icon": "icon_name",
        "primary": boolean,
        "permission": "permission_name"
      },
      // More actions...
    ]
  },
  "form_validation": {
    "field_name": [
      {
        "rule": "required|min|max|future_date",
        "value": "rule_value",
        "message": "Error message",
        "condition": {"field": "field_name", "operator": "eq|in|not_in", "value": "value|[values]"}
      },
      // More rules...
    ],
    // More field validations...
  }
}
```

### Example UI Configuration

```json
{
  "list_view": {
    "title": "Policies",
    "description": "Organizational policies and procedures",
    "icon": "policy",
    "default_view": "table",
    "alternative_views": ["cards", "calendar"],
    "columns": [
      {
        "field": "title",
        "width": "40%",
        "sortable": true,
        "primary": true,
        "render_as": "link",
        "truncate": true
      },
      {
        "field": "status",
        "width": "15%",
        "sortable": true,
        "render_as": "badge",
        "colors": {
          "draft": "gray",
          "in_review": "blue",
          "approved": "purple",
          "published": "green",
          "archived": "gray"
        }
      },
      {
        "field": "risk_level",
        "width": "15%",
        "sortable": true,
        "render_as": "badge",
        "colors": {
          "critical": "red",
          "high": "orange",
          "medium": "yellow",
          "low": "blue",
          "negligible": "green"
        }
      },
      {
        "field": "effective_date",
        "width": "15%",
        "sortable": true,
        "render_as": "date",
        "format": "MMM D, YYYY"
      },
      {
        "field": "owner_id",
        "width": "15%",
        "sortable": true,
        "render_as": "user",
        "label": "Owner"
      }
    ],
    "actions": [
      {
        "name": "create",
        "label": "Create Policy",
        "icon": "plus",
        "primary": true,
        "permission": "policy.create",
        "location": "header"
      },
      {
        "name": "edit",
        "label": "Edit",
        "icon": "edit",
        "permission": "policy.edit",
        "location": "row"
      },
      {
        "name": "delete",
        "label": "Delete",
        "icon": "trash",
        "permission": "policy.delete",
        "location": "row",
        "confirmation": {
          "title": "Delete Policy",
          "message": "Are you sure you want to delete this policy? This action cannot be undone.",
          "confirm_button": "Delete",
          "cancel_button": "Cancel"
        }
      }
    ],
    "filters": [
      {
        "field": "status",
        "label": "Status",
        "control": "select",
        "multi": true,
        "options": [
          {"value": "draft", "label": "Draft"},
          {"value": "in_review", "label": "In Review"},
          {"value": "approved", "label": "Approved"},
          {"value": "published", "label": "Published"},
          {"value": "archived", "label": "Archived"}
        ],
        "default": ["draft", "in_review", "approved", "published"]
      },
      {
        "field": "risk_level",
        "label": "Risk Level",
        "control": "select",
        "multi": true,
        "options": [
          {"value": "critical", "label": "Critical"},
          {"value": "high", "label": "High"},
          {"value": "medium", "label": "Medium"},
          {"value": "low", "label": "Low"},
          {"value": "negligible", "label": "Negligible"}
        ]
      },
      {
        "field": "owner_id",
        "label": "Owner",
        "control": "userSelect",
        "multi": true
      },
      {
        "field": "effective_date",
        "label": "Effective Date",
        "control": "dateRange"
      }
    ],
    "search": {
      "enabled": true,
      "placeholder": "Search policies...",
      "fields": ["title", "description", "content"]
    },
    "batch_actions": [
      {
        "name": "delete",
        "label": "Delete Selected",
        "icon": "trash",
        "permission": "policy.delete",
        "confirmation": {
          "title": "Delete Policies",
          "message": "Are you sure you want to delete the selected policies? This action cannot be undone.",
          "confirm_button": "Delete",
          "cancel_button": "Cancel"
        }
      },
      {
        "name": "export",
        "label": "Export Selected",
        "icon": "download",
        "permission": "policy.export"
      }
    ],
    "empty_state": {
      "title": "No Policies Found",
      "message": "There are no policies matching your criteria.",
      "action": {
        "label": "Create Policy",
        "icon": "plus",
        "permission": "policy.create"
      }
    }
  },
  "detail_view": {
    "title": "{title}",
    "layout": "tabs",
    "actions": [
      {
        "name": "edit",
        "label": "Edit Policy",
        "icon": "edit",
        "permission": "policy.edit",
        "primary": true,
        "conditions": [
          {"field": "status", "operator": "in", "value": ["draft", "in_review"]}
        ]
      },
      {
        "name": "submit_for_review",
        "label": "Submit for Review",
        "icon": "send",
        "permission": "policy.submit",
        "conditions": [
          {"field": "status", "operator": "eq", "value": "draft"}
        ],
        "workflow_action": true
      },
      {
        "name": "approve",
        "label": "Approve",
        "icon": "check",
        "permission": "policy.approve",
        "conditions": [
          {"field": "status", "operator": "eq", "value": "in_review"}
        ],
        "workflow_action": true
      },
      {
        "name": "publish",
        "label": "Publish",
        "icon": "globe",
        "permission": "policy.publish",
        "conditions": [
          {"field": "status", "operator": "eq", "value": "approved"}
        ],
        "workflow_action": true
      },
      {
        "name": "archive",
        "label": "Archive",
        "icon": "archive",
        "permission": "policy.archive",
        "conditions": [
          {"field": "status", "operator": "eq", "value": "published"}
        ],
        "workflow_action": true
      },
      {
        "name": "export",
        "label": "Export",
        "icon": "download",
        "permission": "policy.export"
      }
    ],
    "sections": [
      {
        "id": "overview",
        "label": "Overview",
        "icon": "info",
        "fields": [
          {
            "field": "title",
            "size": "large",
            "label": "Title",
            "readonly": {
              "condition": {"field": "status", "operator": "not_in", "value": ["draft"]}
            }
          },
          {
            "field": "description",
            "size": "large",
            "control": "richText",
            "label": "Description",
            "readonly": {
              "condition": {"field": "status", "operator": "not_in", "value": ["draft"]}
            }
          },
          {
            "field": "status",
            "size": "small",
            "control": "select",
            "label": "Status",
            "readonly": true,
            "options": [
              {"value": "draft", "label": "Draft"},
              {"value": "in_review", "label": "In Review"},
              {"value": "approved", "label": "Approved"},
              {"value": "published", "label": "Published"},
              {"value": "archived", "label": "Archived"}
            ],
            "render_as": "badge"
          },
          {
            "field": "risk_level",
            "size": "small",
            "control": "select",
            "label": "Risk Level",
            "readonly": {
              "condition": {"field": "status", "operator": "not_in", "value": ["draft"]}
            },
            "options": [
              {"value": "critical", "label": "Critical"},
              {"value": "high", "label": "High"},
              {"value": "medium", "label": "Medium"},
              {"value": "low", "label": "Low"},
              {"value": "negligible", "label": "Negligible"}
            ],
            "render_as": "badge"
          },
          {
            "field": "effective_date",
            "size": "small",
            "control": "datePicker",
            "label": "Effective Date",
            "readonly": {
              "condition": {"field": "status", "operator": "not_in", "value": ["draft"]}
            }
          },
          {
            "field": "owner_id",
            "size": "medium",
            "control": "userSelect",
            "label": "Owner",
            "readonly": {
              "condition": {"field": "status", "operator": "not_in", "value": ["draft"]}
            }
          }
        ]
      },
      {
        "id": "content",
        "label": "Policy Content",
        "icon": "document",
        "fields": [
          {
            "field": "content",
            "size": "full",
            "control": "documentEditor",
            "label": "Content",
            "readonly": {
              "condition": {"field": "status", "operator": "not_in", "value": ["draft"]}
            }
          }
        ]
      },
      {
        "id": "custom",
        "label": "Custom Fields",
        "icon": "settings",
        "fields": [
          {
            "field": "custom_fields",
            "size": "full",
            "control": "dynamicForm",
            "label": "Custom Fields",
            "readonly": {
              "condition": {"field": "status", "operator": "not_in", "value": ["draft"]}
            }
          }
        ]
      },
      {
        "id": "metadata",
        "label": "Metadata",
        "icon": "info",
        "fields": [
          {
            "field": "version",
            "size": "small",
            "label": "Version",
            "readonly": true
          },
          {
            "field": "created_by",
            "size": "medium",
            "control": "userReference",
            "label": "Created By",
            "readonly": true
          },
          {
            "field": "created_at",
            "size": "medium",
            "control": "dateTime",
            "label": "Created At",
            "readonly": true
          },
          {
            "field": "updated_by",
            "size": "medium",
            "control": "userReference",
            "label": "Updated By",
            "readonly": true
          },
          {
            "field": "updated_at",
            "size": "medium",
            "control": "dateTime",
            "label": "Updated At",
            "readonly": true
          }
        ]
      }
    ]
  },
  "create_view": {
    "title": "Create Policy",
    "layout": "single",
    "sections": [
      {
        "id": "main",
        "fields": [
          {
            "field": "title",
            "size": "large",
            "required": true,
            "label": "Title"
          },
          {
            "field": "description",
            "size": "large",
            "control": "richText",
            "label": "Description"
          },
          {
            "field": "status",
            "size": "small",
            "control": "select",
            "label": "Status",
            "default": "draft",
            "options": [
              {"value": "draft", "label": "Draft"}
            ],
            "readonly": true
          },
          {
            "field": "risk_level",
            "size": "small",
            "control": "select",
            "label": "Risk Level",
            "default": "medium",
            "options": [
              {"value": "critical", "label": "Critical"},
              {"value": "high", "label": "High"},
              {"value": "medium", "label": "Medium"},
              {"value": "low", "label": "Low"},
              {"value": "negligible", "label": "Negligible"}
            ]
          },
          {
            "field": "effective_date",
            "size": "small",
            "control": "datePicker",
            "label": "Effective Date"
          },
          {
            "field": "owner_id",
            "size": "medium",
            "control": "userSelect",
            "label": "Owner",
            "default": "{current_user}"
          }
        ]
      }
    ],
    "actions": [
      {
        "name": "save",
        "label": "Save",
        "icon": "save",
        "primary": true,
        "permission": "policy.create"
      },
      {
        "name": "save_and_continue",
        "label": "Save and Continue",
        "icon": "arrowRight",
        "permission": "policy.create"
      },
      {
        "name": "cancel",
        "label": "Cancel",
        "icon": "x",
        "navigate_to": "/policies"
      }
    ]
  },
  "edit_view": {
    "title": "Edit {title}",
    "layout": "tabs",
    "inherit_from": "detail_view",
    "readonly_condition": {
      "condition": {"field": "status", "operator": "not_in", "value": ["draft"]}
    },
    "actions": [
      {
        "name": "save",
        "label": "Save",
        "icon": "save",
        "primary": true,
        "permission": "policy.edit"
      },
      {
        "name": "cancel",
        "label": "Cancel",
        "icon": "x",
        "navigate_to": "/policies/{id}"
      }
    ]
  },
  "form_validation": {
    "title": [
      {
        "rule": "required",
        "message": "Title is required"
      },
      {
        "rule": "min",
        "value": 3,
        "message": "Title must be at least 3 characters"
      },
      {
        "rule": "max",
        "value": 255,
        "message": "Title must be less than 255 characters"
      }
    ],
    "effective_date": [
      {
        "rule": "future_date",
        "message": "Effective date must be in the future",
        "condition": {"field": "status", "operator": "eq", "value": "draft"}
      }
    ]
  }
}
```

## Permission Rules Structure

The permission rules define access control for different roles, including field-level restrictions and conditional access. It's stored in the `permission_rules` field of the `metadata_registry` table.

### Structure Overview

```json
{
  "roles": {
    "role_name": {
      "read": boolean,
      "create": boolean,
      "update": boolean,
      "delete": boolean,
      "field_restrictions": {
        "restricted_fields": ["field1", "field2", ...]
      }
    },
    // More roles...
  },
  "field_level_permissions": {
    "field_name": {
      "roles": {
        "role_name": {"read": boolean, "write": boolean},
        // More roles...
      }
    },
    // More fields...
  },
  "conditions": {
    "condition_name": {
      "field": "field_name",
      "operator": "eq|neq|in|not_in|gt|lt|contains",
      "value": "value|[value1, value2, ...]"
    },
    // More conditions...
  },
  "rule_sets": [
    {
      "name": "rule_set_name",
      "description": "Rule set description",
      "conditions": ["condition1", "condition2", ...],
      "permissions": {
        "read": boolean,
        "create": boolean,
        "update": boolean,
        "delete": boolean
      }
    },
    // More rule sets...
  ]
}
```

### Role Properties

| Property           | Description                                     | Example                  |
|--------------------|-------------------------------------------------|--------------------------|
| read               | Whether the role can read records               | true                     |
| create             | Whether the role can create records             | true                     |
| update             | Whether the role can update records             | true                     |
| delete             | Whether the role can delete records             | false                    |
| field_restrictions | Fields the role cannot access                   | {"restricted_fields": ["custom_fields"]} |

### Field-Level Permission Properties

| Property | Description                                     | Example                  |
|----------|-------------------------------------------------|--------------------------|
| roles    | Permissions for different roles                 | {"admin": {"read": true, "write": true}} |

### Condition Properties

| Property | Description                                     | Example                  |
|----------|-------------------------------------------------|--------------------------|
| field    | Field to check                                  | "owner_id"               |
| operator | Comparison operator                             | "eq", "in", "gt"         |
| value    | Value to compare against                        | "{current_user_id}" or ["draft", "in_review"] |

### Rule Set Properties

| Property     | Description                                     | Example                  |
|--------------|--------------------------------------------------|--------------------------|
| name         | Name of the rule set                             | "own_policies"          |
| description  | Description of the rule set                      | "Allow users to manage their own policies" |
| conditions   | Conditions that must be met                      | ["is_owner"]            |
| permissions  | Permissions granted if conditions are met        | {"read": true, "update": true} |

### Example Permission Rules

```json
{
  "roles": {
    "admin": {
      "read": true,
      "create": true,
      "update": true,
      "delete": true,
      "field_restrictions": {
        "restricted_fields": []
      }
    },
    "manager": {
      "read": true,
      "create": true,
      "update": true,
      "delete": false,
      "field_restrictions": {
        "restricted_fields": []
      }
    },
    "user": {
      "read": true,
      "create": false,
      "update": false,
      "delete": false,
      "field_restrictions": {
        "restricted_fields": ["custom_fields"]
      }
    },
    "auditor": {
      "read": true,
      "create": false,
      "update": false,
      "delete": false,
      "field_restrictions": {
        "restricted_fields": []
      }
    },
    "guest": {
      "read": false,
      "create": false,
      "update": false,
      "delete": false,
      "field_restrictions": {
        "restricted_fields": []
      }
    }
  },
  "field_level_permissions": {
    "custom_fields": {
      "roles": {
        "admin": {"read": true, "write": true},
        "manager": {"read": true, "write": true},
        "user": {"read": false, "write": false},
        "auditor": {"read": true, "write": false},
        "guest": {"read": false, "write": false}
      }
    },
    "content": {
      "roles": {
        "admin": {"read": true, "write": true},
        "manager": {"read": true, "write": true},
        "user": {"read": true, "write": false},
        "auditor": {"read": true, "write": false},
        "guest": {"read": false, "write": false}
      }
    }
  },
  "conditions": {
    "is_owner": {
      "field": "owner_id",
      "operator": "eq",
      "value": "{current_user_id}"
    },
    "is_published": {
      "field": "status",
      "operator": "eq",
      "value": "published"
    },
    "is_draft": {
      "field": "status",
      "operator": "eq",
      "value": "draft"
    },
    "is_editable": {
      "field": "status",
      "operator": "in",
      "value": ["draft", "in_review"]
    }
  },
  "rule_sets": [
    {
      "name": "own_policies",
      "description": "Allow users to manage their own policies",
      "conditions": ["is_owner", "is_draft"],
      "permissions": {
        "read": true,
        "create": false,
        "update": true,
        "delete": false
      }
    },
    {
      "name": "published_policies",
      "description": "Allow everyone to view published policies",
      "conditions": ["is_published"],
      "permissions": {
        "read": true,
        "create": false,
        "update": false,
        "delete": false
      }
    }
  ]
}
```

## Relationship Map Structure

The relationship map defines relationships between entities, including parent-child relationships and related entities. It's stored in the `relationship_map` field of the `metadata_registry` table.

### Structure Overview

```json
{
  "parent_entities": ["entity1", "entity2", ...],
  "child_entities": ["entity1", "entity2", ...],
  "related_entities": ["entity1", "entity2", ...],
  "relationships": [
    {
      "entity": "entity_name",
      "type": "one_to_one|one_to_many|many_to_many",
      "field": "field_name",
      "referenced_field": "referenced_field",
      "junction_table": "junction_table_name",
      "description": "Relationship description"
    },
    // More relationships...
  ]
}
```

### Example Relationship Map

```json
{
  "parent_entities": ["policy_categories"],
  "child_entities": ["policy_versions", "policy_attestations"],
  "related_entities": ["controls", "risks", "assets"],
  "relationships": [
    {
      "entity": "policy_categories",
      "type": "one_to_many",
      "field": "category_id",
      "referenced_field": "id",
      "description": "Category this policy belongs to"
    },
    {
      "entity": "policy_versions",
      "type": "one_to_many",
      "field": "policy_id",
      "referenced_field": "id",
      "description": "Version history for this policy"
    },
    {
      "entity": "policy_attestations",
      "type": "one_to_many",
      "field": "policy_id",
      "referenced_field": "id",
      "description": "User attestations for this policy"
    },
    {
      "entity": "controls",
      "type": "many_to_many",
      "junction_table": "policy_control_mappings",
      "field": "policy_id",
      "referenced_field": "control_id",
      "description": "Controls implemented by this policy"
    }
  ]
}
```

## Workflow Triggers Structure

The workflow triggers define events that trigger workflows. It's stored in the `workflow_triggers` field of the `metadata_registry` table.

### Structure Overview

```json
{
  "on_create": ["event1", "event2", ...],
  "on_update": ["event1", "event2", ...],
  "on_delete": ["event1", "event2", ...],
  "on_status_change": {
    "from_status": {
      "to_status": ["event1", "event2", ...]
    }
  },
  "events": {
    "event_name": {
      "description": "Event description",
      "notification_targets": ["role1", "role2", ...],
      "triggers_workflow": "workflow_name"
    }
  }
}
```

### Example Workflow Triggers

```json
{
  "on_create": ["policy_created"],
  "on_update": ["policy_updated"],
  "on_status_change": {
    "draft": {
      "in_review": ["policy_submitted_for_review"]
    },
    "in_review": {
      "approved": ["policy_approved"],
      "draft": ["policy_review_rejected"]
    },
    "approved": {
      "published": ["policy_published"]
    },
    "published": {
      "archived": ["policy_archived"]
    }
  },
  "on_delete": ["policy_deleted"],
  "events": {
    "policy_created": {
      "description": "A new policy was created",
      "notification_targets": ["policy_admins", "compliance_team"],
      "triggers_workflow": null
    },
    "policy_submitted_for_review": {
      "description": "A policy was submitted for review",
      "notification_targets": ["policy_approvers"],
      "triggers_workflow": "policy_review_workflow"
    },
    "policy_approved": {
      "description": "A policy was approved",
      "notification_targets": ["policy_owner", "compliance_team"],
      "triggers_workflow": null
    },
    "policy_review_rejected": {
      "description": "A policy review was rejected",
      "notification_targets": ["policy_owner"],
      "triggers_workflow": null
    },
    "policy_published": {
      "description": "A policy was published",
      "notification_targets": ["all_users"],
      "triggers_workflow": "policy_attestation_workflow"
    },
    "policy_archived": {
      "description": "A policy was archived",
      "notification_targets": ["policy_admins", "compliance_team"],
      "triggers_workflow": null
    },
    "policy_deleted": {
      "description": "A policy was deleted",
      "notification_targets": ["policy_admins", "compliance_team"],
      "triggers_workflow": null
    }
  }
}
```

## Standard Mappings Structure

The standard mappings define how an entity maps to compliance standards. It's stored in the `standard_mappings` field of the `metadata_registry` table.

### Structure Overview

```json
{
  "standard_name": {
    "controls": ["control1", "control2", ...],
    "implementation": "mandatory|recommended|optional",
    "references": {
      "section": "standard_section",
      "clauses": ["clause1", "clause2", ...]
    },
    "mapping_rationale": "Explanation of how this entity satisfies the standard"
  },
  // More standards...
}
```

### Example Standard Mappings

```json
{
  "iso27001": {
    "controls": ["A.5.1.1", "A.5.1.2"],
    "implementation": "mandatory",
    "references": {
      "section": "Information Security Policies",
      "clauses": ["5.1.1", "5.1.2"]
    },
    "mapping_rationale": "Policy management is a fundamental requirement for ISO 27001 compliance. This entity ensures that policies are properly documented, reviewed, approved, and communicated."
  },
  "gdpr": {
    "controls": ["Art.24", "Art.32"],
    "implementation": "mandatory",
    "references": {
      "section": "Security of Processing",
      "clauses": ["24", "32"]
    },
    "mapping_rationale": "GDPR requires organizations to implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk. This entity helps document and manage those measures."
  },
  "hipaa": {
    "controls": ["164.316(a)"],
    "implementation": "mandatory",
    "references": {
      "section": "Administrative Safeguards",
      "clauses": ["164.316(a)"]
    },
    "mapping_rationale": "HIPAA requires covered entities to implement policies and procedures to comply with the standards. This entity helps manage and document those policies."
  },
  "nist_csf": {
    "controls": ["ID.GV-1", "PR.IP-5"],
    "implementation": "recommended",
    "references": {
      "section": "Governance",
      "clauses": ["ID.GV-1", "PR.IP-5"]
    },
    "mapping_rationale": "The NIST Cybersecurity Framework recommends establishing and communicating policies for cybersecurity. This entity helps manage those policies."
  }
}
```

## Search Configuration Structure

The search configuration defines searchable fields and index configurations. It's stored in the `search_config` field of the `metadata_registry` table.

### Structure Overview

```json
{
  "searchable_fields": ["field1", "field2", ...],
  "full_text_search": {
    "enabled": boolean,
    "fields": ["field1", "field2", ...],
    "weights": {
      "field1": number,
      "field2": number
    }
  },
  "search_suggestions": {
    "enabled": boolean,
    "fields": ["field1", "field2", ...]
  },
  "filters": [
    {
      "field": "field_name",
      "display_name": "Display name",
      "filter_type": "select|range|date|multi_select",
      "options": ["option1", "option2", ...] // For select and multi_select
    },
    // More filters...
  ]
}
```

### Example Search Configuration

```json
{
  "searchable_fields": ["title", "description", "content", "custom_fields"],
  "full_text_search": {
    "enabled": true,
    "fields": ["title", "description", "content"],
    "weights": {
      "title": 10,
      "description": 5,
      "content": 1
    }
  },
  "search_suggestions": {
    "enabled": true,
    "fields": ["title"]
  },
  "filters": [
    {
      "field": "status",
      "display_name": "Status",
      "filter_type": "multi_select",
      "options": ["draft", "in_review", "approved", "published", "archived"]
    },
    {
      "field": "risk_level",
      "display_name": "Risk Level",
      "filter_type": "multi_select",
      "options": ["critical", "high", "medium", "low", "negligible"]
    },
    {
      "field": "effective_date",
      "display_name": "Effective Date",
      "filter_type": "date"
    },
    {
      "field": "owner_id",
      "display_name": "Owner",
      "filter_type": "select"
    }
  ]
}
```

## Business Rules Structure

The business rules define derived fields, calculations, and defaults. It's stored in the `business_rules` field of the `metadata_registry` table.

### Structure Overview

```json
{
  "derived_fields": [
    {
      "name": "field_name",
      "description": "Field description",
      "formula": "SQL expression or JavaScript function",
      "depends_on": ["field1", "field2", ...],
      "recalculate_on": ["create", "update"]
    },
    // More derived fields...
  ],
  "validations": [
    {
      "name": "validation_name",
      "description": "Validation description",
      "condition": "SQL expression or JavaScript function",
      "error_message": "Error message",
      "validate_on": ["create", "update"]
    },
    // More validations...
  ],
  "defaults": [
    {
      "field": "field_name",
      "value": "default_value|{current_user}|{current_date}|...",
      "description": "Default value description"
    },
    // More defaults...
  ],
  "calculations": [
    {
      "name": "calculation_name",
      "description": "Calculation description",
      "formula": "SQL expression or JavaScript function",
      "depends_on": ["field1", "field2", ...],
      "schedule": "on_change|daily|weekly|monthly"
    },
    // More calculations...
  ]
}
```

### Example Business Rules

```json
{
  "derived_fields": [
    {
      "name": "days_until_effective",
      "description": "Number of days until the policy becomes effective",
      "formula": "CASE WHEN effective_date IS NULL THEN NULL ELSE effective_date - CURRENT_DATE END",
      "depends_on": ["effective_date"],
      "recalculate_on": ["create", "update"]
    },
    {
      "name": "is_active",
      "description": "Whether the policy is currently active",
      "formula": "status = 'published' AND (effective_date IS NULL OR effective_date <= CURRENT_DATE)",
      "depends_on": ["status", "effective_date"],
      "recalculate_on": ["create", "update"]
    }
  ],
  "validations": [
    {
      "name": "effective_date_future",
      "description": "Effective date must be in the future for draft policies",
      "condition": "status != 'draft' OR effective_date IS NULL OR effective_date > CURRENT_DATE",
      "error_message": "Effective date must be in the future for draft policies",
      "validate_on": ["create", "update"]
    },
    {
      "name": "title_unique",
      "description": "Policy title must be unique within the organization",
      "condition": "NOT EXISTS (SELECT 1 FROM policies WHERE title = NEW.title AND id != NEW.id AND organization_id = NEW.organization_id)",
      "error_message": "A policy with this title already exists",
      "validate_on": ["create", "update"]
    }
  ],
  "defaults": [
    {
      "field": "status",
      "value": "draft",
      "description": "New policies start in draft status"
    },
    {
      "field": "risk_level",
      "value": "medium",
      "description": "Default risk level is medium"
    },
    {
      "field": "owner_id",
      "value": "{current_user}",
      "description": "Default owner is the current user"
    },
    {
      "field": "version",
      "value": 1,
      "description": "Initial version is 1"
    }
  ],
  "calculations": [
    {
      "name": "update_search_index",
      "description": "Update the search index when policy fields change",
      "formula": "UPDATE policy_search_index SET document = to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, '')) WHERE policy_id = NEW.id",
      "depends_on": ["title", "description", "content"],
      "schedule": "on_change"
    },
    {
      "name": "check_attestation_expiry",
      "description": "Check for expired attestations daily",
      "formula": "UPDATE policy_attestations SET attestation_status = 'expired' WHERE policy_id IN (SELECT id FROM policies WHERE status = 'published') AND attestation_status = 'attested' AND attestation_date < CURRENT_DATE - INTERVAL '1 year'",
      "depends_on": [],
      "schedule": "daily"
    }
  ]
}
```

## Conclusion

These JSON schemas form the foundation of ArionComply's metadata-driven architecture. By defining entities, API behavior, UI rendering, and permission rules in a structured format, the system can dynamically generate APIs and UI components without custom code.

Key benefits of this approach include:

1. **Consistency**: Common patterns are applied uniformly across all entities
2. **Flexibility**: Business rules and UI can be modified without code changes
3. **Extensibility**: New functionality can be added to all entities by updating the schemas
4. **Maintainability**: Changes to one aspect (e.g., validation) can be made in one place

The schemas are designed to be comprehensive, covering all aspects of entity behavior while allowing for customization to meet specific requirements. By centralizing these definitions, ArionComply ensures a consistent and maintainable system that can evolve with changing compliance needs.
  