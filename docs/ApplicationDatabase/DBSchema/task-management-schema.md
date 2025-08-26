# Generic Task Management System - Database Schema

## Overview

This document defines the database schema for a comprehensive task management system that supports cross-entity task creation, assignment, tracking, and completion across all ArionComply workflows. The design follows established database principles while providing flexibility for tasks related to any entity type in the system.

## Task Management Workflow

### 1. Core Task Management

#### Task Creation and Assignment
- **Status**: Core Feature
- **Triggers**:
  - Control implementation requirements
  - Risk treatment actions
  - Audit findings requiring action
  - Document review assignments
  - Privacy request fulfillment
  - Incident response activities
  - Any workflow requiring tracked activities
- **Approval Requirements**:
  - Task creation by authorized users
  - Assignment acceptance by assignees (optional)
  - Completion approval by task owners
  - Escalation approval for overdue tasks
- **Data Model Requirements**:
  - `tasks` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `title`: TEXT NOT NULL
    - `description`: TEXT
    - `task_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic task types
    - `priority`: priority_enum DEFAULT 'medium'
    - `status`: ENUM('draft', 'assigned', 'accepted', 'in_progress', 'pending_review', 'completed', 'cancelled', 'overdue')
    - `due_date`: TIMESTAMPTZ
    - `start_date`: TIMESTAMPTZ
    - `completed_date`: TIMESTAMPTZ
    - `estimated_hours`: DECIMAL(5,2)
    - `actual_hours`: DECIMAL(5,2)
    - `completion_percentage`: INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
    - `assignee_id`: UUID REFERENCES users(id)
    - `assigned_by_id`: UUID REFERENCES users(id)
    - `approver_id`: UUID REFERENCES users(id) -- For tasks requiring approval
    - `parent_task_id`: UUID REFERENCES tasks(id) -- For subtasks
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - `custom_fields`: JSONB DEFAULT '{}'
    - `ai_metadata`: JSONB DEFAULT '{"generated_by_ai": false}'
    - CONSTRAINT valid_custom_fields CHECK (jsonb_typeof(custom_fields) = 'object')
    - CONSTRAINT valid_ai_metadata CHECK (jsonb_typeof(ai_metadata) = 'object')
    - CONSTRAINT valid_dates CHECK (start_date IS NULL OR due_date IS NULL OR start_date <= due_date)
    - CONSTRAINT valid_completion CHECK (completed_date IS NULL OR status IN ('completed', 'cancelled'))
  
  - `task_entity_links` table (polymorphic relationship - justified by truly generic behavior):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `entity_type`: TEXT NOT NULL -- 'risk', 'control', 'incident', etc.
    - `entity_id`: UUID NOT NULL
    - `link_type`: ENUM('related_to', 'implements', 'resolves', 'reviews', 'creates')
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - UNIQUE(task_id, entity_type, entity_id)
    - INDEX idx_task_entity_lookup (entity_type, entity_id) -- For finding tasks by entity
  
  - `task_dependencies` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `predecessor_task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `successor_task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `dependency_type`: ENUM('finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish')
    - `lag_days`: INTEGER DEFAULT 0 -- Days between dependent tasks
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - UNIQUE(predecessor_task_id, successor_task_id)
    - CONSTRAINT no_self_dependency CHECK (predecessor_task_id != successor_task_id)
  
  - `task_assignments_history` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `assigned_to_id`: UUID REFERENCES users(id)
    - `assigned_by_id`: UUID REFERENCES users(id)
    - `assignment_date`: TIMESTAMPTZ DEFAULT NOW()
    - `unassignment_date`: TIMESTAMPTZ
    - `assignment_reason`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
  
  - `task_comments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `comment_text`: TEXT NOT NULL
    - `is_internal`: BOOLEAN DEFAULT false -- Internal notes vs. shared comments
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
  
  - `task_attachments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `file_name`: TEXT NOT NULL
    - `file_path`: TEXT NOT NULL
    - `file_size`: BIGINT
    - `mime_type`: TEXT
    - `description`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support

#### Task Notifications and Escalations
- **Status**: Core Feature
- **Triggers**:
  - Task assignment
  - Due date approaching
  - Task overdue
  - Status changes
  - Comment additions
  - Completion approval needed
- **Data Model Requirements**:
  - `task_notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `notification_type`: ENUM('assignment', 'due_soon', 'overdue', 'status_change', 'comment', 'approval_needed', 'completed', 'escalated')
    - `recipient_id`: UUID REFERENCES users(id)
    - `sent_at`: TIMESTAMPTZ DEFAULT NOW()
    - `read_at`: TIMESTAMPTZ
    - `notification_data`: JSONB -- Additional context for the notification
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_notification_data CHECK (jsonb_typeof(notification_data) = 'object')
  
  - `task_escalations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `escalation_level`: INTEGER DEFAULT 1
    - `escalated_to_id`: UUID REFERENCES users(id)
    - `escalation_reason`: TEXT
    - `escalated_at`: TIMESTAMPTZ DEFAULT NOW()
    - `resolved_at`: TIMESTAMPTZ
    - `resolution_notes`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`: UUID REFERENCES users(id)

#### Task Templates
- **Status**: Enhancement
- **Triggers**:
  - Recurring compliance activities
  - Standard operating procedures
  - Common task patterns
- **Data Model Requirements**:
  - `task_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `description`: TEXT
    - `template_type_id`: UUID REFERENCES lookup_options(id)
    - `is_active`: BOOLEAN DEFAULT true
    - `task_data`: JSONB NOT NULL -- Template task structure
    - `default_assignments`: JSONB -- Default assignment rules
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_task_data CHECK (jsonb_typeof(task_data) = 'object')
    - CONSTRAINT valid_default_assignments CHECK (jsonb_typeof(default_assignments) = 'object')
  
  - `task_recurrence_patterns` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `task_id`: UUID REFERENCES tasks(id) ON DELETE CASCADE
    - `template_id`: UUID REFERENCES task_templates(id)
    - `pattern_type`: ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'custom')
    - `pattern_config`: JSONB NOT NULL -- Recurrence configuration
    - `next_occurrence`: DATE
    - `end_date`: DATE -- Optional end date for recurrence
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_pattern_config CHECK (jsonb_typeof(pattern_config) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_tasks_assignee_status ON tasks (assignee_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due_date ON tasks (due_date) WHERE deleted_at IS NULL AND status NOT IN ('completed', 'cancelled');
CREATE INDEX idx_tasks_org_status ON tasks (organization_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_task_entity_by_entity ON task_entity_links (entity_type, entity_id);
CREATE INDEX idx_task_notifications_unread ON task_notifications (recipient_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_task_dependencies_successor ON task_dependencies (successor_task_id);

-- GIN indexes for JSONB fields
CREATE INDEX idx_tasks_custom_fields ON tasks USING GIN (custom_fields);
CREATE INDEX idx_task_templates_data ON task_templates USING GIN (task_data);
```

## Functions and Triggers

```sql
-- Function to check circular dependencies
CREATE OR REPLACE FUNCTION check_circular_dependency()
RETURNS TRIGGER AS $$
DECLARE
    has_circular BOOLEAN;
BEGIN
    WITH RECURSIVE dep_chain AS (
        SELECT successor_task_id, predecessor_task_id
        FROM task_dependencies
        WHERE predecessor_task_id = NEW.successor_task_id
        
        UNION ALL
        
        SELECT td.successor_task_id, td.predecessor_task_id
        FROM task_dependencies td
        JOIN dep_chain dc ON td.predecessor_task_id = dc.successor_task_id
    )
    SELECT EXISTS (
        SELECT 1 FROM dep_chain 
        WHERE successor_task_id = NEW.predecessor_task_id
    ) INTO has_circular;
    
    IF has_circular THEN
        RAISE EXCEPTION 'Circular dependency detected';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_circular_dependencies
    BEFORE INSERT OR UPDATE ON task_dependencies
    FOR EACH ROW
    EXECUTE FUNCTION check_circular_dependency();

-- Function to update parent task completion percentage
CREATE OR REPLACE FUNCTION update_parent_task_completion()
RETURNS TRIGGER AS $$
DECLARE
    avg_completion DECIMAL;
BEGIN
    IF NEW.parent_task_id IS NOT NULL THEN
        SELECT AVG(completion_percentage)
        INTO avg_completion
        FROM tasks
        WHERE parent_task_id = NEW.parent_task_id
        AND deleted_at IS NULL;
        
        UPDATE tasks
        SET completion_percentage = COALESCE(avg_completion, 0),
            updated_at = NOW()
        WHERE id = NEW.parent_task_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_parent_completion
    AFTER INSERT OR UPDATE OF completion_percentage ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_parent_task_completion();

-- Function to create task from template
CREATE OR REPLACE FUNCTION create_task_from_template(
    p_template_id UUID,
    p_created_by UUID,
    p_organization_id UUID,
    p_custom_data JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    v_task_id UUID;
    v_template RECORD;
BEGIN
    SELECT * INTO v_template
    FROM task_templates
    WHERE id = p_template_id
    AND organization_id = p_organization_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found or inactive';
    END IF;
    
    -- Create task from template data
    INSERT INTO tasks (
        title,
        description,
        task_type_id,
        priority,
        estimated_hours,
        organization_id,
        created_by,
        custom_fields
    )
    SELECT 
        COALESCE(p_custom_data->>'title', v_template.task_data->>'title'),
        COALESCE(p_custom_data->>'description', v_template.task_data->>'description'),
        (v_template.task_data->>'task_type_id')::UUID,
        COALESCE((p_custom_data->>'priority')::priority_enum, (v_template.task_data->>'priority')::priority_enum),
        (v_template.task_data->>'estimated_hours')::DECIMAL,
        p_organization_id,
        p_created_by,
        v_template.task_data->'custom_fields' || p_custom_data->'custom_fields'
    RETURNING id INTO v_task_id;
    
    RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;
```

## UI Integration

- **Primary Screens**:
  - **Task Dashboard** for personal task management and overview
  - **Record Editor** for detailed task creation and editing
  - **ListView** for task inventory and bulk management
  - **Kanban Board** for visual task status management
  - **Calendar View** for deadline and schedule visualization
  - **Timeline/Gantt View** for project and dependency visualization
  - **Planning Hub** for integrated planning across all views

- **Integration Points**:
  - Tasks can be created from any entity screen (controls, risks, incidents, etc.)
  - Task status updates reflect in parent entity screens
  - Notification center shows task-related alerts
  - Dashboard widgets for task metrics and deadlines
  - Mobile app support for field task updates

## Migration Considerations

For organizations migrating from existing task systems:

1. **Data Import Support**:
   - Bulk import functionality for existing tasks
   - Mapping templates for common task management systems
   - Validation and conflict resolution during import

2. **Gradual Adoption**:
   - Ability to run parallel with existing systems
   - Selective migration by department or workflow
   - Historical task data preservation

3. **Integration APIs**:
   - RESTful APIs for third-party task system integration
   - Webhook support for real-time synchronization
   - Export capabilities for reporting tools