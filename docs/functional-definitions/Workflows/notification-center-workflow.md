#### 5. Chat Assistance

- **Action**: Open AI chat assistance
  - **Trigger**: Click chat trigger button (`onclick="toggleChat()"`)
  - **Result**: Opens context-aware AI chat interface
  - **Process**:
    - Toggles chat popup visibility
    - Loads chat interface with "Notifications" context
  - **State Changes**:
    - Shows/hides chat interface
    - Sets context parameters for chat# Notification Center Screen Workflow

## Screen: `notificationCenter.html`

### Overview
The Notification Center provides a centralized interface for managing system alerts, reminders, and notifications. It allows users to view, add, and manage notifications across the ArionComply platform. This screen serves as an important communication hub for compliance activities, alerts, and system updates.

### User-Triggered Actions

#### 1. Managing Notifications

- **Action**: Add notification
  - **Trigger**: `onclick="addNotificationFromInput()"`
  - **Result**: Creates new notification from input text
  - **Process**:
    - Gets text from input field
    - Validates non-empty input
    - Calls `addStoredNotification(text)`
    - Clears input field
    - Refreshes notification list display
  - **State Changes**:
    - Adds new notification to localStorage
    - Updates notification list in UI

- **Action**: Mark notification as read/unread
  - **Trigger**: Click on notification read status icon
  - **Result**: Toggles read/unread status of notification
  - **Process**:
    - Identifies notification by ID
    - Updates read status in localStorage
    - Updates UI to reflect changed status
  - **State Changes**:
    - Updates notification status in localStorage
    - Updates notification appearance in UI

- **Action**: Delete notification
  - **Trigger**: Click delete icon on notification
  - **Result**: Removes notification from system
  - **Process**:
    - Identifies notification by ID
    - Removes notification from localStorage
    - Updates notification list display
  - **State Changes**:
    - Removes notification from localStorage
    - Updates notification list in UI

- **Action**: Filter notifications
  - **Trigger**: Select filter option from dropdown/filters
  - **Result**: Shows filtered subset of notifications
  - **Process**:
    - Applies selected filter criteria (type, priority, date, status, source)
    - Updates notification list to show matching notifications
    - Updates active filter indicators
  - **State Changes**:
    - Updates visible notifications
    - Updates active filter indicators
    - Persists filter preferences in localStorage

#### 2. Bulk Actions

- **Action**: Mark all notifications as read
  - **Trigger**: Click "Mark All Read" button
  - **Result**: Sets all notifications to read status
  - **Process**:
    - Updates all notifications in localStorage to read status
    - Refreshes notification list display
  - **State Changes**:
    - Updates all notifications in localStorage
    - Updates notification list in UI

- **Action**: Clear all notifications
  - **Trigger**: Click "Clear All" button
  - **Result**: Removes all notifications
  - **Process**:
    - Confirms action with user
    - Clears notifications from localStorage
    - Refreshes notification list display
  - **State Changes**:
    - Removes all notifications from localStorage
    - Updates notification list to empty state

#### 3. Chat Assistance

- **Action**: Open AI chat assistance
  - **Trigger**: Click chat trigger button (`onclick="toggleChat()"`)
  - **Result**: Opens context-aware AI chat interface
  - **Process**:
    - Toggles chat popup visibility
    - Loads chat interface with "Notifications" context
  - **State Changes**:
    - Shows/hides chat interface
    - Sets context parameters for chat

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - Initializes layout: `LayoutManager.initializePage("notificationCenter.html")`
  - Sets chat context: `updateChatContext("Notifications")`
  - Updates breadcrumb: `updateBreadcrumb("Home > Notifications")`
  - Renders notification list: `renderNotificationList("notificationList")`

#### 2. Notification List Rendering
- **Trigger**: During initialization and after notification changes
- **Process**:
  - Retrieves notifications from localStorage
  - Sorts notifications by timestamp (newest first)
  - Filters notifications based on active filters
  - Creates HTML elements for each notification
  - Applies appropriate styling for read/unread status
  - Applies appropriate styling for notification type and priority
  - Adds action links for actionable notifications
  - Attaches event handlers for interactions

#### 3. Auto-update of Notification Status
- **Trigger**: System events generating notifications
- **Process**:
  - Other system components can call `addStoredNotification()`
  - Notification list periodically checks for updates
  - New notifications appear in real-time
  - Notification count badge updates

### Error Handling
- **Empty Input**: Prevents adding empty notifications
- **Storage Errors**: Catches and logs localStorage errors
- **Missing Container**: Handles case where notification list container is not found

### Data Persistence
- **Primary Storage**: Supabase Database
  - All notification data is primarily stored in database tables
  - Real-time synchronization ensures timely delivery of notifications

- **Fallback Storage**: 
  - LocalStorage used only when offline or as temporary cache
  - Keys: `notification_read_status`, `notification_filters`
  - All local data syncs to database when connection is restored

- **Database Operations**:
  - **Notification Center Screen Load**:
    - **Operation**: SELECT notifications for user
    - **Tables**: `notifications`, `user_notifications`
    - **Description**: Retrieves all notifications for the current user
  
  - **Add Notification**:
    - **Operation**: INSERT notification record, INSERT user_notification record
    - **Tables**: `notifications`, `user_notifications`
    - **Description**: Creates new notification and associates with user(s)
  
  - **Mark Notification as Read/Unread**:
    - **Operation**: UPDATE user_notification read status
    - **Tables**: `user_notifications`
    - **Description**: Updates read status for specific notification
  
  - **Delete Notification**:
    - **Operation**: DELETE user_notification record or UPDATE visibility
    - **Tables**: `user_notifications`
    - **Description**: Removes notification from user view or hides it
  
  - **Mark All as Read**:
    - **Operation**: UPDATE multiple user_notification records
    - **Tables**: `user_notifications`
    - **Description**: Sets all notifications to read status
  
  - **Clear All Notifications**:
    - **Operation**: DELETE multiple user_notification records or UPDATE visibility
    - **Tables**: `user_notifications`
    - **Description**: Removes all notifications from user view
  
  - **Navigate to Related Screen**:
    - **Operation**: SELECT related record, UPDATE notification read status
    - **Tables**: Varies based on notification type (tasks, events, files, etc.)
    - **Description**: Retrieves related content and marks notification as read

### AI Integration Points
- **Notification Prioritization**:
  - AI-powered analysis of notification importance and urgency
  - Intelligent grouping and categorization of related notifications

- **Action Recommendations**:
  - Smart suggestions for actions based on notification content
  - Contextual guidance for handling different notification types

- **Notification Summary**:
  - Intelligent summarization of multiple notifications
  - Identification of patterns and trends across notifications

- **Predictive Notification Management**:
  - Anticipatory suggestions for notification management
  - Smart filtering recommendations based on user behavior

### Chat Interface Integration
- **Omnipresent Chat Access**:
  - Chat interface available via floating button on notification center screen
  - Context-aware assistance based on notification content and status

- **Chat-Triggered Actions**:
  - "Summarize my notifications" - Provides concise overview of pending notifications
  - "Prioritize notifications" - Suggests handling order based on importance
  - "Handle this notification" - Guides through appropriate response process
  - "Schedule a reminder" - Creates time-based follow-up for important notifications

### Integration Dependencies
- **Required files**:
  - navigation-config.js: Navigation structure
  - sidebar-component.js: Sidebar implementation
  - layout-manager.js: Page layout management
  - scripts.js: Contains `addStoredNotification()` and notification utilities
  - seedData.js: Sample notification data
