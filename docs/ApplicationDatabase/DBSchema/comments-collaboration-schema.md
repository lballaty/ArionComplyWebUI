# Comments and Collaboration System - Database Schema

## Overview

This document defines the database schema for a comprehensive commenting and collaboration system that enables discussions, mentions, and collaborative work across all entity types in the ArionComply platform. The system supports threaded discussions, real-time collaboration, and activity tracking.

## Comments and Collaboration Workflow

### 1. Core Commenting System

#### Comment Management
- **Status**: Core Feature
- **Triggers**:
  - User adds comment to any record
  - Reply to existing comment
  - Mention of other users
  - Status change with comment
  - Review feedback
  - Collaborative discussions
- **Approval Requirements**:
  - None for general comments
  - Moderation for flagged content
  - Approval for official statements
- **Data Model Requirements**:
  - `comments` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL -- Table name (polymorphic justified by generic behavior)
    - `entity_id`: UUID NOT NULL -- ID of the record being commented on
    - `parent_comment_id`: UUID REFERENCES comments(id) ON DELETE CASCADE -- For threaded replies
    - `comment_text`: TEXT NOT NULL
    - `comment_type`: ENUM('general', 'question', 'answer', 'feedback', 'review', 'decision', 'note')
    - `status`: ENUM('active', 'edited', 'deleted', 'hidden', 'flagged')
    - `is_internal`: BOOLEAN DEFAULT false -- Internal vs external visibility
    - `is_pinned`: BOOLEAN DEFAULT false -- Pinned to top
    - `edit_count`: INTEGER DEFAULT 0
    - `last_edited_at`: TIMESTAMPTZ
    - `deleted_reason`: TEXT
    - `flagged_reason`: TEXT
    - `flagged_by`: UUID REFERENCES users(id)
    - `resolved`: BOOLEAN DEFAULT false -- For questions/issues
    - `resolved_by`: UUID REFERENCES users(id)
    - `resolved_at`: TIMESTAMPTZ
    - `sentiment`: ENUM('positive', 'neutral', 'negative') -- AI-analyzed or manual
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - `deleted_at`, `deleted_by`: Soft delete support
    - INDEX idx_comments_entity (entity_type, entity_id, status) WHERE deleted_at IS NULL
    - INDEX idx_comments_parent (parent_comment_id) WHERE deleted_at IS NULL
    - INDEX idx_comments_creator (created_by, created_at DESC) WHERE deleted_at IS NULL
  
  - `comment_threads` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL
    - `entity_id`: UUID NOT NULL
    - `thread_title`: TEXT
    - `thread_type`: ENUM('discussion', 'review', 'approval', 'issue', 'announcement')
    - `status`: ENUM('open', 'closed', 'locked', 'archived')
    - `priority`: priority_enum DEFAULT 'medium'
    - `participants`: UUID[] -- Array of user IDs in thread
    - `comment_count`: INTEGER DEFAULT 0
    - `last_activity_at`: TIMESTAMPTZ DEFAULT NOW()
    - `last_activity_by`: UUID REFERENCES users(id)
    - `is_pinned`: BOOLEAN DEFAULT false
    - `requires_resolution`: BOOLEAN DEFAULT false
    - `resolved_at`: TIMESTAMPTZ
    - `resolved_by`: UUID REFERENCES users(id)
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
    - UNIQUE(entity_type, entity_id, thread_title)
    - INDEX idx_threads_activity (last_activity_at DESC) WHERE status = 'open'
  
  - `comment_mentions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `comment_id`: UUID REFERENCES comments(id) ON DELETE CASCADE
    - `mentioned_user_id`: UUID REFERENCES users(id)
    - `mention_type`: ENUM('direct', 'team', 'role', 'everyone')
    - `mention_text`: TEXT -- The actual @mention text
    - `is_acknowledged`: BOOLEAN DEFAULT false
    - `acknowledged_at`: TIMESTAMPTZ
    - `notification_sent`: BOOLEAN DEFAULT false
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - UNIQUE(comment_id, mentioned_user_id)
    - INDEX idx_mentions_user (mentioned_user_id, is_acknowledged)
  
  - `comment_reactions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `comment_id`: UUID REFERENCES comments(id) ON DELETE CASCADE
    - `user_id`: UUID REFERENCES users(id)
    - `reaction_type`: ENUM('like', 'helpful', 'agree', 'disagree', 'question', 'important')
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_at`: TIMESTAMPTZ DEFAULT NOW()
    - UNIQUE(comment_id, user_id, reaction_type)
    - INDEX idx_reactions_comment (comment_id)

#### Collaborative Editing
- **Status**: Enhancement
- **Triggers**:
  - Multiple users editing
  - Real-time collaboration
  - Version conflicts
  - Edit history tracking
- **Data Model Requirements**:
  - `collaboration_sessions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL
    - `entity_id`: UUID NOT NULL
    - `session_type`: ENUM('viewing', 'editing', 'reviewing', 'approving')
    - `started_at`: TIMESTAMPTZ DEFAULT NOW()
    - `ended_at`: TIMESTAMPTZ
    - `is_active`: BOOLEAN DEFAULT true
    - `participants`: JSONB -- Array of participant info with join/leave times
    - `session_data`: JSONB -- Session-specific data
    - `organization_id`: UUID REFERENCES organizations(id)
    - `created_by`: UUID REFERENCES users(id)
    - CONSTRAINT valid_participants CHECK (jsonb_typeof(participants) = 'array')
    - CONSTRAINT valid_session_data CHECK (jsonb_typeof(session_data) = 'object')
    - INDEX idx_collab_active (entity_type, entity_id) WHERE is_active = true
  
  - `collaborative_edits` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `session_id`: UUID REFERENCES collaboration_sessions(id) ON DELETE CASCADE
    - `edit_sequence`: BIGINT NOT NULL -- Order of edits
    - `user_id`: UUID REFERENCES users(id)
    - `edit_type`: ENUM('insert', 'delete', 'format', 'comment', 'suggestion')
    - `field_name`: TEXT -- Which field was edited
    - `position`: INTEGER -- Character position in field
    - `content`: TEXT -- What was added/changed
    - `previous_content`: TEXT -- What was there before
    - `edit_metadata`: JSONB -- Additional edit information
    - `timestamp`: TIMESTAMPTZ DEFAULT NOW()
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_edit_metadata CHECK (jsonb_typeof(edit_metadata) = 'object')
    - UNIQUE(session_id, edit_sequence)
    - INDEX idx_edits_session_seq (session_id, edit_sequence)
  
  - `presence_tracking` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL
    - `entity_id`: UUID NOT NULL
    - `user_id`: UUID REFERENCES users(id)
    - `presence_type`: ENUM('viewing', 'editing', 'typing', 'idle')
    - `field_name`: TEXT -- Which field user is in
    - `cursor_position`: INTEGER -- Where their cursor is
    - `selection_start`: INTEGER -- Text selection start
    - `selection_end`: INTEGER -- Text selection end
    - `last_heartbeat`: TIMESTAMPTZ DEFAULT NOW()
    - `user_color`: TEXT -- Color for collaborative highlighting
    - `organization_id`: UUID REFERENCES organizations(id)
    - UNIQUE(entity_type, entity_id, user_id)
    - INDEX idx_presence_heartbeat (last_heartbeat) -- For cleanup

#### Discussion Analytics
- **Status**: Enhancement
- **Triggers**:
  - Reporting requirements
  - Engagement analysis
  - Sentiment tracking
  - Activity monitoring
- **Data Model Requirements**:
  - `comment_analytics` table (materialized view):
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `analytics_date`: DATE NOT NULL
    - `entity_type`: TEXT
    - `organization_id`: UUID REFERENCES organizations(id)
    - `total_comments`: INTEGER DEFAULT 0
    - `active_threads`: INTEGER DEFAULT 0
    - `unique_commenters`: INTEGER DEFAULT 0
    - `avg_response_time_hours`: DECIMAL(5,2)
    - `resolution_rate`: DECIMAL(5,2) -- Percentage of resolved threads
    - `sentiment_distribution`: JSONB -- Breakdown by sentiment
    - `top_contributors`: JSONB -- Most active users
    - `busiest_entities`: JSONB -- Most discussed records
    - `created_at`, `updated_at`: Timestamp fields
    - UNIQUE(analytics_date, entity_type, organization_id)
  
  - `record_discussions` table:
    - `id`: UUID PRIMARY KEY DEFAULT uuid_generate_v4()
    - `entity_type`: TEXT NOT NULL
    - `entity_id`: UUID NOT NULL
    - `discussion_summary`: TEXT -- AI-generated summary
    - `key_decisions`: TEXT[] -- Important decisions made
    - `action_items`: JSONB -- Extracted action items
    - `participants_count`: INTEGER DEFAULT 0
    - `comments_count`: INTEGER DEFAULT 0
    - `unresolved_count`: INTEGER DEFAULT 0
    - `last_updated`: TIMESTAMPTZ DEFAULT NOW()
    - `organization_id`: UUID REFERENCES organizations(id)
    - CONSTRAINT valid_action_items CHECK (jsonb_typeof(action_items) = 'object')
    - UNIQUE(entity_type, entity_id, organization_id)

## Indexes and Performance Optimization

```sql
-- Performance indexes for common queries
CREATE INDEX idx_comments_recent ON comments (created_at DESC) 
    WHERE deleted_at IS NULL AND status = 'active';
CREATE INDEX idx_comments_unresolved ON comments (entity_type, entity_id) 
    WHERE deleted_at IS NULL AND resolved = false;
CREATE INDEX idx_threads_open ON comment_threads (last_activity_at DESC) 
    WHERE status = 'open';
CREATE INDEX idx_mentions_pending ON comment_mentions (mentioned_user_id) 
    WHERE is_acknowledged = false;
CREATE INDEX idx_presence_active ON presence_tracking (entity_type, entity_id) 
    WHERE last_heartbeat > NOW() - INTERVAL '5 minutes';

-- GIN indexes for arrays and JSONB
CREATE INDEX idx_threads_participants ON comment_threads USING GIN (participants);
CREATE INDEX idx_collab_participants ON collaboration_sessions USING GIN (participants);
CREATE INDEX idx_analytics_sentiment ON comment_analytics USING GIN (sentiment_distribution);
CREATE INDEX idx_discussions_actions ON record_discussions USING GIN (action_items);
```

## Functions and Triggers

```sql
-- Function to update thread activity
CREATE OR REPLACE FUNCTION update_thread_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_thread_id UUID;
BEGIN
    -- Find or create thread
    SELECT id INTO v_thread_id
    FROM comment_threads
    WHERE entity_type = NEW.entity_type
    AND entity_id = NEW.entity_id
    AND status = 'open'
    LIMIT 1;
    
    IF v_thread_id IS NULL AND NEW.parent_comment_id IS NULL THEN
        -- Create new thread for top-level comment
        INSERT INTO comment_threads (
            entity_type,
            entity_id,
            thread_type,
            participants,
            comment_count,
            last_activity_by,
            organization_id,
            created_by
        ) VALUES (
            NEW.entity_type,
            NEW.entity_id,
            'discussion',
            ARRAY[NEW.created_by],
            1,
            NEW.created_by,
            NEW.organization_id,
            NEW.created_by
        ) RETURNING id INTO v_thread_id;
    ELSE
        -- Update existing thread
        UPDATE comment_threads
        SET comment_count = comment_count + 1,
            last_activity_at = NOW(),
            last_activity_by = NEW.created_by,
            participants = CASE 
                WHEN NEW.created_by = ANY(participants) THEN participants
                ELSE participants || NEW.created_by
            END
        WHERE (id = v_thread_id) OR 
              (entity_type = NEW.entity_type AND entity_id = NEW.entity_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_on_comment
    AFTER INSERT ON comments
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION update_thread_activity();

-- Function to extract mentions
CREATE OR REPLACE FUNCTION extract_comment_mentions()
RETURNS TRIGGER AS $$
DECLARE
    v_mention_pattern TEXT := '@[a-zA-Z0-9._-]+';
    v_mention TEXT;
    v_username TEXT;
    v_user_id UUID;
BEGIN
    -- Extract all @mentions from comment text
    FOR v_mention IN
        SELECT regexp_matches(NEW.comment_text, v_mention_pattern, 'g')
    LOOP
        v_username := substring(v_mention from 2); -- Remove @
        
        -- Find user by username
        SELECT id INTO v_user_id
        FROM users
        WHERE username = v_username
        AND organization_id = NEW.organization_id
        AND status = 'active';
        
        IF v_user_id IS NOT NULL THEN
            -- Create mention record
            INSERT INTO comment_mentions (
                comment_id,
                mentioned_user_id,
                mention_type,
                mention_text,
                organization_id
            ) VALUES (
                NEW.id,
                v_user_id,
                'direct',
                v_mention,
                NEW.organization_id
            ) ON CONFLICT (comment_id, mentioned_user_id) DO NOTHING;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER extract_mentions_trigger
    AFTER INSERT OR UPDATE OF comment_text ON comments
    FOR EACH ROW
    WHEN (NEW.status = 'active')
    EXECUTE FUNCTION extract_comment_mentions();

-- Function to summarize discussions
CREATE OR REPLACE FUNCTION summarize_entity_discussions(
    p_entity_type TEXT,
    p_entity_id UUID
) RETURNS VOID AS $$
DECLARE
    v_summary TEXT;
    v_decisions TEXT[];
    v_participants INTEGER;
    v_comments INTEGER;
    v_unresolved INTEGER;
BEGIN
    -- Count statistics
    SELECT 
        COUNT(DISTINCT created_by),
        COUNT(*),
        COUNT(*) FILTER (WHERE resolved = false AND comment_type IN ('question', 'issue'))
    INTO v_participants, v_comments, v_unresolved
    FROM comments
    WHERE entity_type = p_entity_type
    AND entity_id = p_entity_id
    AND deleted_at IS NULL;
    
    -- Extract decisions
    SELECT ARRAY_AGG(comment_text)
    INTO v_decisions
    FROM comments
    WHERE