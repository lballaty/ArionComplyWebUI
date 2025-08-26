# Metrics and Analytics Infrastructure - Database Schema

## Overview

This document defines the database schema for a comprehensive metrics and analytics infrastructure that provides a unified framework for defining, calculating, storing, and visualizing performance metrics across all domains in the ArionComply platform. The design follows established database principles while supporting flexible metric definitions and efficient aggregation.

## Metrics and Analytics Workflow

### 1. Metric Definition and Configuration

#### Metric Registry Management
- **Status**: Core Feature
- **Triggers**:
  - New KPI requirements
  - Dashboard creation
  - Reporting needs
  - Performance monitoring requirements
  - Compliance metrics definition
- **Approval Requirements**:
  - Metric owner approval
  - Calculation methodology validation
  - Data source verification
  - Business alignment confirmation
- **Data Model Requirements**:
  - `metric_definitions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_name`: TEXT NOT NULL
    - `display_name`: TEXT NOT NULL
    - `description`: TEXT
    - `metric_category`: ENUM('compliance', 'risk', 'security', 'operational', 'financial', 'quality', 'performance')
    - `metric_type`: ENUM('count', 'percentage', 'average', 'sum', 'ratio', 'duration', 'trend', 'score')
    - `unit_of_measure`: TEXT -- %, count, days, hours, currency, etc.
    - `calculation_method`: ENUM('sql', 'function', 'aggregation', 'external', 'manual')
    - `calculation_formula`: TEXT -- SQL or formula definition
    - `data_sources`: JSONB NOT NULL -- Tables/views used
    - `parameters`: JSONB -- Configurable parameters
    - `aggregation_levels`: TEXT[] -- org, dept, team, user, etc.
    - `time_windows`: TEXT[] -- daily, weekly, monthly, quarterly, annual
    - `target_value`: DECIMAL(15,4) -- Target/benchmark
    - `threshold_config`: JSONB -- Alert thresholds
    - `direction`: ENUM('higher_better', 'lower_better', 'target_range')
    - `refresh_frequency`: ENUM('real_time', 'hourly', 'daily', 'weekly', 'monthly', 'on_demand')
    - `retention_days`: INTEGER DEFAULT 730 -- How long to keep history
    - `is_active`: BOOLEAN DEFAULT true
    - `is_public`: BOOLEAN DEFAULT false -- Visible to all users
    - `owner_id`: UUID REFERENCES users(id)
    - `tags`: TEXT[] -- For categorization
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_data_sources CHECK (jsonb_typeof(data_sources) = 'object')
    - CONSTRAINT valid_parameters CHECK (jsonb_typeof(parameters) = 'object')
    - CONSTRAINT valid_thresholds CHECK (jsonb_typeof(threshold_config) = 'object')
    - UNIQUE(metric_name, organization_id)
    - INDEX idx_metric_definitions_active (organization_id, is_active, metric_category)
  
  - `metric_relationships` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `parent_metric_id`: UUID REFERENCES metric_definitions(id) ON DELETE CASCADE
    - `child_metric_id`: UUID REFERENCES metric_definitions(id) ON DELETE CASCADE
    - `relationship_type`: ENUM('derives_from', 'contributes_to', 'correlates_with', 'depends_on')
    - `weight`: DECIMAL(5,4) DEFAULT 1.0 -- For weighted relationships
    - `lag_periods`: INTEGER DEFAULT 0 -- Time lag between metrics
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(parent_metric_id, child_metric_id)
    - CONSTRAINT no_self_relationship CHECK (parent_metric_id != child_metric_id)

### 2. Metric Calculation and Storage

#### Calculated Metric Values
- **Status**: Core Feature
- **Triggers**:
  - Scheduled calculations
  - Data changes
  - Manual refresh
  - Real-time updates
- **Data Model Requirements**:
  - `metric_calculations` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `metric_id`: UUID REFERENCES metric_definitions(id) ON DELETE CASCADE
    - `calculation_timestamp`: TIMESTAMPTZ NOT NULL
    - `period_start`: TIMESTAMPTZ NOT NULL
    - `period_end`: TIMESTAMPTZ NOT NULL
    - `aggregation_level`: TEXT NOT NULL -- org, dept, team, etc.
    - `aggregation_id`: UUID -- ID of org unit, team, etc.
    - `metric_value`: DECIMAL(15,4) NOT NULL
    - `previous_value`: DECIMAL(15,4) -- For trend calculation
    - `change_percentage`: DECIMAL(5,2) -- Period-over-period change
    - `target_value`: DECIMAL(15,4) -- Target at time of calculation
    - `variance_from_target`: DECIMAL(15,4)
    - `percentile_rank`: INTEGER -- Rank within peer group
    - `calculation_status`: ENUM('success', 'warning', 'error')
    - `calculation_notes`: TEXT -- Warnings or errors
    - `data_quality_score`: DECIMAL(3,2) -- 0-1 quality indicator
    - `sample_size`: INTEGER -- Records used in calculation
    - `confidence_interval`: NUMRANGE -- Statistical confidence
    - `dimensions`: JSONB -- Additional dimensional data
    - `metadata`: JSONB -- Calculation metadata
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - CONSTRAINT valid_dimensions CHECK (jsonb_typeof(dimensions) = 'object')
    - CONSTRAINT valid_metadata CHECK (jsonb_typeof(metadata) = 'object')
    - CONSTRAINT valid_period CHECK (period_start <= period_end)
    - INDEX idx_metric_calculations_lookup (metric_id, period_end DESC, aggregation_level, aggregation_id)
    - INDEX idx_metric_calculations_recent (calculation_timestamp DESC)
    - UNIQUE(metric_id, period_start, period_end, aggregation_level, aggregation_id)
  
  - `metric_snapshots` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `snapshot_date`: DATE NOT NULL
    - `snapshot_type`: ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annual')
    - `metric_id`: UUID REFERENCES metric_definitions(id) ON DELETE CASCADE
    - `aggregation_level`: TEXT NOT NULL
    - `aggregation_id`: UUID
    - `metric_value`: DECIMAL(15,4) NOT NULL
    - `min_value`: DECIMAL(15,4)
    - `max_value`: DECIMAL(15,4)
    - `avg_value`: DECIMAL(15,4)
    - `std_deviation`: DECIMAL(15,4)
    - `sample_count`: INTEGER
    - `percentile_25`: DECIMAL(15,4)
    - `percentile_50`: DECIMAL(15,4) -- Median
    - `percentile_75`: DECIMAL(15,4)
    - `percentile_95`: DECIMAL(15,4)
    - `trend`: ENUM('improving', 'stable', 'declining')
    - `year_over_year_change`: DECIMAL(5,2)
    - `quarter_over_quarter_change`: DECIMAL(5,2)
    - `month_over_month_change`: DECIMAL(5,2)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - UNIQUE(snapshot_date, snapshot_type, metric_id, aggregation_level, aggregation_id)
    - INDEX idx_metric_snapshots_date (metric_id, snapshot_date DESC)

### 3. Analytics Dashboards

#### Dashboard Configuration
- **Status**: Core Feature
- **Triggers**:
  - Dashboard creation
  - Widget addition
  - Layout changes
  - Sharing requirements
- **Data Model Requirements**:
  - `analytics_dashboards` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `dashboard_name`: TEXT NOT NULL
    - `description`: TEXT
    - `dashboard_type`: ENUM('executive', 'operational', 'compliance', 'risk', 'custom')
    - `is_default`: BOOLEAN DEFAULT false
    - `is_public`: BOOLEAN DEFAULT false
    - `layout_config`: JSONB NOT NULL -- Grid layout configuration
    - `refresh_interval_seconds`: INTEGER -- Auto-refresh interval
    - `filters_config`: JSONB -- Available filters
    - `theme`: TEXT DEFAULT 'light'
    - `tags`: TEXT[]
    - `owner_id`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - `version`: INTEGER DEFAULT 1
    - CONSTRAINT valid_layout CHECK (jsonb_typeof(layout_config) = 'object')
    - CONSTRAINT valid_filters CHECK (jsonb_typeof(filters_config) = 'object')
    - UNIQUE(dashboard_name, owner_id, organization_id)
  
  - `dashboard_widgets` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `dashboard_id`: UUID REFERENCES analytics_dashboards(id) ON DELETE CASCADE
    - `widget_name`: TEXT NOT NULL
    - `widget_type`: ENUM('metric_card', 'line_chart', 'bar_chart', 'pie_chart', 'table', 'heatmap', 'gauge', 'map', 'text', 'image')
    - `position`: JSONB NOT NULL -- Grid position {x, y, w, h}
    - `metric_ids`: UUID[] -- Metrics displayed in widget
    - `visualization_config`: JSONB NOT NULL -- Chart options, colors, etc.
    - `data_config`: JSONB -- Data source and filters
    - `interaction_config`: JSONB -- Click actions, drill-down
    - `refresh_interval_override`: INTEGER -- Override dashboard refresh
    - `is_visible`: BOOLEAN DEFAULT true
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_position CHECK (jsonb_typeof(position) = 'object')
    - CONSTRAINT valid_viz_config CHECK (jsonb_typeof(visualization_config) = 'object')
    - CONSTRAINT valid_data_config CHECK (jsonb_typeof(data_config) = 'object')
    - CONSTRAINT valid_interaction CHECK (jsonb_typeof(interaction_config) = 'object')
    - INDEX idx_dashboard_widgets_dashboard (dashboard_id, is_visible)
  
  - `dashboard_sharing` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `dashboard_id`: UUID REFERENCES analytics_dashboards(id) ON DELETE CASCADE
    - `shared_with_type`: ENUM('user', 'role', 'department', 'everyone')
    - `shared_with_id`: UUID -- User/role/dept ID
    - `permission_level`: ENUM('view', 'edit', 'admin')
    - `shared_by`: UUID REFERENCES users(id)
    - `shared_at`: TIMESTAMPTZ DEFAULT NOW()
    - `expires_at`: TIMESTAMPTZ -- Optional expiration
    - `organization_id`: UUID REFERENCES organizations(id)
    - UNIQUE(dashboard_id, shared_with_type, shared_with_id)

### 4. Metric Alerts and Monitoring

#### Alert Configuration
- **Status**: Enhancement
- **Triggers**:
  - Threshold breaches
  - Trend changes
  - Anomaly detection
  - Target variance
- **Data Model Requirements**:
  - `metric_alerts` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `alert_name`: TEXT NOT NULL
    - `metric_id`: UUID REFERENCES metric_definitions(id) ON DELETE CASCADE
    - `alert_type`: ENUM('threshold', 'trend', 'anomaly', 'target_variance', 'data_quality')
    - `condition_config`: JSONB NOT NULL -- Alert condition details
    - `severity`: ENUM('info', 'warning', 'critical')
    - `is_active`: BOOLEAN DEFAULT true
    - `check_frequency_minutes`: INTEGER DEFAULT 60
    - `cooldown_minutes`: INTEGER DEFAULT 60 -- Prevent alert spam
    - `notification_channels`: TEXT[] -- email, sms, webhook, etc.
    - `recipient_users`: UUID[] -- User IDs to notify
    - `recipient_roles`: UUID[] -- Role IDs to notify
    - `escalation_config`: JSONB -- Escalation rules
    - `auto_resolve`: BOOLEAN DEFAULT true
    - `last_triggered`: TIMESTAMPTZ
    - `trigger_count`: INTEGER DEFAULT 0
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - CONSTRAINT valid_condition CHECK (jsonb_typeof(condition_config) = 'object')
    - CONSTRAINT valid_escalation CHECK (jsonb_typeof(escalation_config) = 'object')
    - INDEX idx_metric_alerts_active (metric_id, is_active)
  
  - `metric_alert_history` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `alert_id`: UUID REFERENCES metric_alerts(id) ON DELETE CASCADE
    - `triggered_at`: TIMESTAMPTZ DEFAULT NOW()
    - `metric_value`: DECIMAL(15,4)
    - `threshold_value`: DECIMAL(15,4)
    - `condition_details`: JSONB -- What triggered the alert
    - `severity_at_trigger`: ENUM('info', 'warning', 'critical')
    - `notifications_sent`: INTEGER DEFAULT 0
    - `acknowledged_by`: UUID REFERENCES users(id)
    - `acknowledged_at`: TIMESTAMPTZ
    - `resolution_notes`: TEXT
    - `auto_resolved`: BOOLEAN DEFAULT false
    - `resolved_at`: TIMESTAMPTZ
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_condition_details CHECK (jsonb_typeof(condition_details) = 'object')
    - INDEX idx_alert_history_recent (alert_id, triggered_at DESC)
    - INDEX idx_alert_history_unack (acknowledged_at) WHERE acknowledged_at IS NULL

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_metric_definitions_category ON metric_definitions (metric_category, is_active) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_metric_calculations_period ON metric_calculations (metric_id, period_start, period_end);
CREATE INDEX idx_metric_snapshots_trend ON metric_snapshots (metric_id, trend) 
    WHERE trend IN ('improving', 'declining');
CREATE INDEX idx_dashboards_owner ON analytics_dashboards (owner_id, is_public) 
    WHERE deleted_at IS NULL;
CREATE INDEX idx_dashboard_sharing_user ON dashboard_sharing (