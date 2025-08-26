# Comprehensive Notification System - Database Schema

## Overview

This document defines the database schema for a comprehensive notification system that supports multi-channel delivery, template management, rule-based triggers, and user preferences across the ArionComply platform. The design follows established database principles while providing flexibility for various notification scenarios.

## Notification Management Workflow

### 1. Core Notification System

#### Notification Creation and Delivery
- **Status**: Core Feature
- **Triggers**:
  - Task assignments and updates
  - Approval requests
  - Deadline reminders
  - Compliance alerts
  - System events
  - Security incidents
  - Audit findings
  - Policy updates
  - Training assignments
- **Approval Requirements**:
  - Template approval for organization-wide notifications
  - Security review for external notifications
  - Compliance review for regulatory notifications
- **Data Model Requirements**:
  - `notifications` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `notification_type_id`: UUID REFERENCES lookup_options(id) -- Dynamic notification types
    - `title`: TEXT NOT NULL
    - `message`: TEXT NOT NULL
    - `priority`: priority_enum DEFAULT 'medium'
    - `status`: ENUM('pending', 'sent', 'delivered', 'read', 'failed', 'cancelled')
    - `recipient_id`: UUID REFERENCES users(id)
    - `sender_id`: UUID REFERENCES users(id) -- NULL for system notifications
    - `scheduled_for`: TIMESTAMPTZ DEFAULT NOW()
    - `sent_at`: TIMESTAMPTZ
    - `delivered_at`: TIMESTAMPTZ
    - `read_at`: TIMESTAMPTZ
    - `expires_at`: TIMESTAMPTZ -- Optional expiration for time-sensitive notifications
    - `template_id`: UUID REFERENCES notification_templates(id)
    - `template_data`: JSONB -- Data used to populate template
    - `related_entity_type`: TEXT -- Entity this notification relates to
    - `related_entity_id`: UUID -- ID of related entity
    - `action_url`: TEXT -- Deep link to relevant screen/action
    - `action_required`: BOOLEAN DEFAULT false
    - `action_completed`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - CONSTRAINT valid_template_data CHECK (jsonb_typeof(template_data) = 'object')
    - CONSTRAINT valid_dates CHECK (scheduled_for <= COALESCE(expires_at, scheduled_for + INTERVAL '1 year'))
  
  - `notification_templates` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `template_name`: TEXT NOT NULL
    - `description`: TEXT
    - `template_type`: ENUM('system', 'compliance', 'security', 'administrative', 'custom')
    - `is_active`: BOOLEAN DEFAULT true
    - `subject_template`: TEXT NOT NULL -- Template for notification title
    - `body_template`: TEXT NOT NULL -- Template for notification content
    - `html_template`: TEXT -- Optional HTML version
    - `variables`: JSONB NOT NULL -- Required variables and their types
    - `default_priority`: priority_enum DEFAULT 'medium'
    - `default_expiry_hours`: INTEGER -- Default hours until expiration
    - `supported_channels`: TEXT[] DEFAULT ARRAY['in_app'] -- Array of supported delivery channels
    - `organization_id`: UUID REFERENCES organizations(id) -- NULL for system templates
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_variables CHECK (jsonb_typeof(variables) = 'object')
    - UNIQUE(template_name, organization_id)
  
  - `notification_channels` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `channel_name`: TEXT NOT NULL UNIQUE
    - `channel_type`: ENUM('in_app', 'email', 'sms', 'push', 'webhook', 'integration')
    - `is_enabled`: BOOLEAN DEFAULT true
    - `configuration`: JSONB NOT NULL -- Channel-specific configuration
    - `rate_limits`: JSONB -- Rate limiting configuration
    - `retry_policy`: JSONB -- Retry configuration for failed deliveries
    - `created_at`, `updated_at`: Timestamp fields
    - CONSTRAINT valid_configuration CHECK (jsonb_typeof(configuration) = 'object')
    - CONSTRAINT valid_rate_limits CHECK (jsonb_typeof(rate_limits) = 'object')
    - CONSTRAINT valid_retry_policy CHECK (jsonb_typeof(retry_policy) = 'object')
  
  - `notification_deliveries` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `notification_id`: UUID REFERENCES notifications(id) ON DELETE CASCADE
    - `channel_id`: UUID REFERENCES notification_channels(id)
    - `delivery_status`: ENUM('pending', 'sent', 'delivered', 'failed', 'bounced')
    - `attempt_count`: INTEGER DEFAULT 1
    - `sent_at`: TIMESTAMPTZ
    - `delivered_at`: TIMESTAMPTZ
    - `failed_at`: TIMESTAMPTZ
    - `failure_reason`: TEXT
    - `delivery_metadata`: JSONB -- Channel-specific delivery information
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_delivery_metadata CHECK (jsonb_typeof(delivery_metadata) = 'object')
    - UNIQUE(notification_id, channel_id)

#### Notification Rules and Automation
- **Status**: Core Feature
- **Triggers**:
  - Database events
  - Time-based triggers
  - Threshold breaches
  - Workflow state changes
  - External system events
- **Data Model Requirements**:
  - `notification_rules` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `rule_name`: TEXT NOT NULL
    - `description`: TEXT
    - `rule_type`: ENUM('event', 'scheduled', 'threshold', 'workflow', 'external')
    - `is_active`: BOOLEAN DEFAULT true
    - `trigger_conditions`: JSONB NOT NULL -- Conditions that trigger the rule
    - `template_id`: UUID REFERENCES notification_templates(id)
    - `recipient_rules`: JSONB NOT NULL -- Rules for determining recipients
    - `channel_preferences`: TEXT[] -- Preferred delivery channels
    - `priority_override`: priority_enum -- Override template priority
    - `cooldown_minutes`: INTEGER -- Minimum time between notifications
    - `max_notifications_per_day`: INTEGER -- Daily limit
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_trigger_conditions CHECK (jsonb_typeof(trigger_conditions) = 'object')
    - CONSTRAINT valid_recipient_rules CHECK (jsonb_typeof(recipient_rules) = 'object')
  
  - `notification_rule_executions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `rule_id`: UUID REFERENCES notification_rules(id) ON DELETE CASCADE
    - `execution_time`: TIMESTAMPTZ DEFAULT NOW()
    - `trigger_data`: JSONB -- Data that triggered the rule
    - `notifications_created`: INTEGER DEFAULT 0
    - `execution_status`: ENUM('success', 'partial', 'failed')
    - `error_details`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_trigger_data CHECK (jsonb_typeof(trigger_data) = 'object')

#### User Notification Preferences
- **Status**: Core Feature
- **Triggers**:
  - User preference updates
  - Role-based defaults
  - Organization policies
- **Data Model Requirements**:
  - `notification_preferences` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `notification_type_id`: UUID REFERENCES lookup_options(id) -- Specific notification type
    - `is_enabled`: BOOLEAN DEFAULT true
    - `channel_preferences`: TEXT[] -- Ordered list of preferred channels
    - `frequency`: ENUM('immediate', 'hourly', 'daily', 'weekly') DEFAULT 'immediate'
    - `quiet_hours_start`: TIME -- Start of do-not-disturb period
    - `quiet_hours_end`: TIME -- End of do-not-disturb period
    - `quiet_hours_timezone`: TEXT -- IANA timezone
    - `digest_enabled`: BOOLEAN DEFAULT false -- Batch notifications
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(user_id, notification_type_id)
  
  - `notification_subscriptions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `subscription_type`: ENUM('entity', 'event', 'report', 'digest')
    - `entity_type`: TEXT -- For entity subscriptions
    - `entity_id`: UUID -- For specific entity subscriptions
    - `event_pattern`: TEXT -- For event subscriptions
    - `is_active`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - INDEX idx_notification_subs_entity (entity_type, entity_id) WHERE subscription_type = 'entity'
  
  - `notification_digests` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `user_id`: UUID REFERENCES users(id) ON DELETE CASCADE
    - `digest_type`: ENUM('daily', 'weekly')
    - `scheduled_for`: TIMESTAMPTZ
    - `sent_at`: TIMESTAMPTZ
    - `notification_count`: INTEGER DEFAULT 0
    - `digest_content`: JSONB -- Aggregated notification data
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_digest_content CHECK (jsonb_typeof(digest_content) = 'object')

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_notifications_recipient_unread ON notifications (recipient_id, read_at) 
    WHERE deleted_at IS NULL AND read_at IS NULL;
CREATE INDEX idx_notifications_scheduled ON notifications (scheduled_for) 
    WHERE deleted_at IS NULL AND status = 'pending';
CREATE INDEX idx_notifications_entity ON notifications (related_entity_type, related_entity_id) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_notification_deliveries_pending ON notification_deliveries (delivery_status, sent_at) 
    WHERE delivery_status = 'pending';
CREATE INDEX idx_notification_rules_active ON notification_rules (is_active, rule_type) 
    WHERE is_active = true;
CREATE INDEX idx_notification_preferences_user ON notification_preferences (user_id, is_enabled);

-- GIN indexes for JSONB fields
CREATE INDEX idx_notification_templates_vars ON notification_templates USING GIN (variables);
CREATE INDEX idx_notification_rules_conditions ON notification_rules USING GIN (trigger_conditions);
CREATE INDEX idx_notification_rules_recipients ON notification_rules USING GIN (recipient_rules);
```

## Functions and Triggers

```sql
-- Function to create notifications from template
CREATE OR REPLACE FUNCTION create_notification_from_template(
    p_template_id UUID,
    p_recipient_id UUID,
    p_template_data JSONB,
    p_related_entity_type TEXT DEFAULT NULL,
    p_related_entity_id UUID DEFAULT NULL,
    p_sender_id UUID DEFAULT NULL,
    p_organization_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
    v_template RECORD;
    v_title TEXT;
    v_message TEXT;
BEGIN
    -- Get template
    SELECT * INTO v_template
    FROM notification_templates
    WHERE id = p_template_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found or inactive';
    END IF;
    
    -- Validate required variables
    IF NOT (v_template.variables <@ p_template_data) THEN
        RAISE EXCEPTION 'Missing required template variables';
    END IF;
    
    -- Render template (simplified - in practice would use proper template engine)
    v_title := v_template.subject_template;
    v_message := v_template.body_template;
    
    -- Simple variable replacement (in practice would be more sophisticated)
    FOR key, value IN SELECT * FROM jsonb_each_text(p_template_data) LOOP
        v_title := REPLACE(v_title, '{{' || key || '}}', value);
        v_message := REPLACE(v_message, '{{' || key || '}}', value);
    END LOOP;
    
    -- Create notification
    INSERT INTO notifications (
        template_id,
        title,
        message,
        priority,
        recipient_id,
        sender_id,
        template_data,
        related_entity_type,
        related_entity_id,
        organization_id,
        expires_at,
        created_by
    ) VALUES (
        p_template_id,
        v_title,
        v_message,
        v_template.default_priority,
        p_recipient_id,
        p_sender_id,
        p_template_data,
        p_related_entity_type,
        p_related_entity_id,
        p_organization_id,
        CASE 
            WHEN v_template.default_expiry_hours IS NOT NULL 
            THEN NOW() + (v_template.default_expiry_hours || ' hours')::INTERVAL 
            ELSE NULL 
        END,
        COALESCE(p_sender_id, p_recipient_id)
    ) RETURNING id INTO v_notification_id;
    
    -- Create delivery records for user's preferred channels
    INSERT INTO notification_deliveries (notification_id, channel_id, organization_id)
    SELECT 
        v_notification_id,
        nc.id,
        p_organization_id
    FROM notification_channels nc
    WHERE nc.channel_name = ANY(
        SELECT unnest(COALESCE(np.channel_preferences, ARRAY['in_app']))
        FROM notification_preferences np
        WHERE np.user_id = p_recipient_id
        AND np.notification_type_id = (
            SELECT id FROM lookup_options 
            WHERE list_name = 'notification_types' 
            AND value = v_template.template_type::TEXT
        )
    )
    AND nc.is_enabled = true;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to process notification rules
CREATE OR REPLACE FUNCTION process_notification_rule(
    p_rule_id UUID,
    p_trigger_data JSONB
) RETURNS INTEGER AS $$
DECLARE
    v_rule RECORD;
    v_recipients UUID[];
    v_notification_count INTEGER := 0;
    v_recipient_id UUID;
BEGIN
    -- Get rule
    SELECT * INTO v_rule
    FROM notification_rules
    WHERE id = p_rule_id
    AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Check cooldown period
    IF EXISTS (
        SELECT 1 FROM notification_rule_executions
        WHERE rule_id = p_rule_id
        AND execution_time > NOW() - (v_rule.cooldown_minutes || ' minutes')::INTERVAL
    ) THEN
        RETURN 0;
    END IF;
    
    -- Determine recipients based on rule (simplified)
    -- In practice, this would be much more sophisticated
    IF v_rule.recipient_rules->>'type' = 'role' THEN
        SELECT ARRAY_AGG(u.id)
        INTO v_recipients
        FROM users u
        JOIN user_role_assignments ura ON u.id = ura.user_id
        WHERE ura.role_id = (v_rule.recipient_rules->>'role_id')::UUID
        AND u.status = 'active';
    END IF;
    
    -- Create notifications for each recipient
    FOREACH v_recipient_id IN ARRAY v_recipients LOOP
        PERFORM create_notification_from_template(
            v_rule.template_id,
            v_recipient_id,
            p_trigger_data,
            v_rule.trigger_conditions->>'entity_type',
            (v_rule.trigger_conditions->>'entity_id')::UUID,
            NULL,
            v_rule.organization_id
        );
        v_notification_count := v_notification_count + 1;
    END LOOP;
    
    -- Log execution
    INSERT INTO notification_rule_executions (
        rule_id,
        trigger_data,
        notifications_created,
        execution_status,
        organization_id
    ) VALUES (
        p_rule_id,
        p_trigger_data,
        v_notification_count,
        'success',
        v_rule.organization_id
    );
    
    RETURN v_notification_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to mark notifications as read when accessed
CREATE OR REPLACE FUNCTION mark_notification_read()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.read_at IS NULL AND NEW.read_at IS NOT NULL THEN
        -- Update delivery status
        UPDATE notification_deliveries
        SET delivered_at = NOW(),
            delivery_status = 'delivered'
        WHERE notification_id = NEW.id
        AND delivery_status IN ('sent', 'pending');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notification_read_status
    AFTER UPDATE OF read_at ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION mark_notification_read();
```

## UI Integration

- **Primary Screens**:
  - **Notification Center** for viewing and managing all notifications
  - **Notification Preferences** in user settings
  - **Notification Templates** in admin panel
  - **Notification Rules** configuration screen
  - **Global notification bell/icon** in header with count badge

- **Integration Points**:
  - Real-time notifications via WebSocket
  - Push notifications for mobile apps
  - Email integration for external delivery
  - SMS gateway integration
  - Calendar integration for time-based notifications
  - Deep linking from notifications to relevant screens

## Migration and Integration Considerations

1. **Email Service Integration**:
   - Support for SendGrid, AWS SES, SMTP
   - Template synchronization with email service
   - Bounce and complaint handling

2. **Mobile Push Notifications**:
   - FCM (Firebase Cloud Messaging) for Android
   - APNs (Apple Push Notification service) for iOS
   - Token management and device registration

3. **Webhook Delivery**:
   - Configurable webhook endpoints
   - Retry logic with exponential backoff
   - Signature verification for security

4. **Rate Limiting**:
   - Per-user rate limits
   - Per-channel rate limits
   - Organization-wide limits
   - Burst allowances for critical notifications