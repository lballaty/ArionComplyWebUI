# ListView Screen Workflow

## Screen: `listView.html`

### Overview
The ListView screen serves as a universal, dynamic data management interface that can display and manipulate virtually any table or data collection in the system. It functions as a configurable "database viewer" that adapts its interface, filters, actions, and display based on the content type being accessed. This component is designed to be highly reusable, eliminating the need for separate screens for each data type while maintaining context-specific functionality. All access and actions are subject to the user's role-based permissions, ensuring appropriate data access control.

### Dynamic Configuration Architecture

#### 1. Template-Based Configuration System
The ListView uses a template-based architecture where each view is defined by a JSON template stored in the database:

- **Template Structure**: JSON format defining all aspects of the view
- **Template Storage**: Stored in `listview_templates` table in Supabase
- **Template Hierarchy**:
  - **System Templates**: Core templates defined by administrators
  - **Default Templates**: One designated default template per content type
  - **User Templates**: User-created variations with restricted customization
- **Template Inheritance**: User templates inherit from default templates with limited override capabilities
- **Content-Specific View Restrictions**: Available view modes are restricted based on content type appropriateness
- **Template Versioning**: Full version history of template changes
- **Template Access Control**: Permission-based template modification rights

#### 2. Template Components
Each template contains comprehensive configuration for:

- **Metadata**: Title, subtitle, list title, breadcrumb path
- **Data Source**: Primary table, join conditions, view or stored procedure
- **Display Settings**: Column definitions, formatting rules, conditional styling
- **Actions**: Available actions (CRUD operations plus custom actions)
- **Filters**: Available filters with type, options, and defaults
- **Permissions**: Required permissions mapped to roles
- **Chat Context**: Context parameters for AI assistance
- **Related Screens**: Navigation mappings to related screens
- **Custom Components**: UI component overrides and extensions
- **Layout Options**: Available view modes with content-appropriate restrictions
  - Example: Kanban view only enabled for workflow-based content types
  - Example: Timeline view only for date-based content
  - Example: Grid view disabled for relationship-heavy content

#### 3. Content Type Configuration
Content types are now defined by templates, with template IDs mapped to content type identifiers:

- **Template Mapping**: `content_type → template_id` mapping in database
- **Template Discovery**: Automatic registration of new templates
- **Template Override**: Organization-specific template customizations

#### 4. URL-Based Content Loading
Content is loaded based on URL parameters:
- Primary: `?type=risks` (specific content type)
- Template Override: `?template=custom_risk_view` (specific template)
- Optional: `?view=grid` (display mode)
- Optional: `?filter=status:active,priority:high` (pre-applied filters)
- Optional: `?q=searchterm` (pre-applied search term)

#### 5. Database Integration
The ListView connects directly to Supabase tables based on template configuration:
- Dynamic query building based on template definition
- Permission-based field visibility and action availability
- Query optimization based on template settings

### User-Triggered Actions

#### 1. Navigation and Content Selection

- **Action**: Navigate to ListView with specific content type
  - **Trigger**: URL navigation (`listView.html?type=risks`), sidebar menu, or chat command (`/risks`)
  - **Result**: Loads appropriate template and content type with specific configuration
  - **Process**:
    - Parses URL parameters to determine content type and template
    - Loads template from database (falls back to default if not specified)
    - Validates user permission for the template
    - Loads data according to template definition
    - Renders interface with template-defined elements
  - **State Changes**:
    - Updates all UI elements based on template
    - Sets appropriate chat context
    - Updates breadcrumb navigation

- **Action**: Switch between templates for same content
  - **Trigger**: Select different template from template dropdown
  - **Result**: Changes display configuration while maintaining content type
  - **Process**:
    - Validates user permission for the template
    - Updates URL parameter (`?template=`)
    - Loads new template configuration
    - Preserves applicable filter/search state if possible
  - **State Changes**:
    - Updates UI according to new template
    - Maintains current data context

- **Action**: Switch between content types
  - **Trigger**: Select different content type from dropdown or navigation
  - **Result**: Changes displayed data and template
  - **Process**:
    - Validates user permission for the new content type
    - Updates URL parameter (`?type=`)
    - Loads appropriate template for content type
    - Loads new data according to template
  - **State Changes**:
    - Updates all UI elements and displayed data
    - Updates chat context for new content type

#### 2. Viewing and Display Options

- **Action**: Switch view mode (Table/Grid)
  - **Trigger**: Click view toggle button
  - **Result**: Changes display mode between table and grid layouts
  - **Process**:
    - Toggles between view modes without reloading data
    - Updates URL parameter (`?view=`)
    - Applies appropriate formatting for selected view
  - **State Changes**:
    - Updates display mode in UI
    - Persists preference for future visits

- **Action**: Adjust displayed columns
  - **Trigger**: Click "Columns" button, select/deselect columns
  - **Result**: Shows/hides selected columns in table view
  - **Process**:
    - Applies column visibility settings
    - Persists preferences to user settings
  - **State Changes**:
    - Updates visible columns in table
    - Persists column preferences

- **Action**: Sort data
  - **Trigger**: Click column header or sort dropdown
  - **Result**: Reorders displayed data based on selected column and direction
  - **Process**:
    - Applies sort order to data
    - Updates URL parameters (`?sort=column:direction`)
    - Maintains sort state during filter changes
  - **State Changes**:
    - Updates display order
    - Updates sort indicators

#### 3. Filtering and Searching

- **Action**: Toggle filter panel
  - **Trigger**: Click filter button
  - **Result**: Shows/hides filter panel
  - **Process**:
    - Toggles filter panel visibility
  - **State Changes**:
    - Updates filter panel visibility state

- **Action**: Apply filters
  - **Trigger**: Select filter options, click "Apply Filters"
  - **Result**: Filters data based on selected criteria
  - **Process**:
    - Constructs database query based on filter selections
    - Updates URL parameters with filter state
    - Executes query against appropriate tables
    - Updates displayed data
  - **State Changes**:
    - Updates filtered data display
    - Updates filter state indicators
    - Updates item count

- **Action**: Search data
  - **Trigger**: Type in search box, press Enter
  - **Result**: Filters data based on search term
  - **Process**:
    - Executes search across relevant fields
    - Combines with existing filters
    - Updates URL with search parameter
  - **State Changes**:
    - Updates displayed data
    - Updates search state indicator

- **Action**: Clear filters
  - **Trigger**: Click "Clear All" button
  - **Result**: Removes all applied filters
  - **Process**:
    - Resets all filter controls to default state
    - Executes unfiltered query (subject to permissions)
    - Updates URL by removing filter parameters
  - **State Changes**:
    - Updates filter controls to default state
    - Updates displayed data to show all permitted records

- **Action**: Save filter preset
  - **Trigger**: Apply filters, click "Save Preset"
  - **Result**: Saves current filter configuration for future use
  - **Process**:
    - Captures current filter state
    - Prompts for preset name
    - Saves to user preferences in database
  - **State Changes**:
    - Adds preset to saved presets list
    - Shows confirmation notification

- **Action**: Apply filter preset
  - **Trigger**: Select saved preset from dropdown
  - **Result**: Applies saved filter configuration
  - **Process**:
    - Loads preset configuration
    - Applies filters to current view
    - Updates URL parameters
  - **State Changes**:
    - Updates filter controls to match preset
    - Updates displayed data

#### 4. Item Selection and Bulk Actions

- **Action**: Select individual item
  - **Trigger**: Click checkbox on row
  - **Result**: Selects/deselects item for bulk actions
  - **Process**:
    - Toggles selection state for item
    - Updates item in selectedItems collection
    - Shows/hides bulk action panel based on selection count
  - **State Changes**:
    - Updates item selection state
    - Updates selected item count
    - Shows/hides bulk action panel

- **Action**: Select all items
  - **Trigger**: Click "Select All" checkbox in header
  - **Result**: Selects/deselects all visible items
  - **Process**:
    - Toggles selection state for all visible items
    - Updates selectedItems collection
    - Shows/hides bulk action panel
  - **State Changes**:
    - Updates all item selection states
    - Updates selected item count
    - Shows/hides bulk action panel

- **Action**: Perform bulk action
  - **Trigger**: Select items, click bulk action button
  - **Result**: Performs action on all selected items
  - **Process**:
    - Validates user has permission for action
    - Executes bulk action on selected items
    - Provides progress indicator for large operations
    - Shows confirmation on completion
  - **State Changes**:
    - Updates affected items
    - Refreshes data display after completion
    - Clears selection after action

#### 5. Item-Specific Actions

- **Action**: View item details
  - **Trigger**: Click item name or "View" action
  - **Result**: Opens detailed view of selected item
  - **Process**:
    - Navigates to detail view or opens detail panel
    - Loads complete item data
  - **State Changes**:
    - Opens detail view or panel

- **Action**: Edit item
  - **Trigger**: Click "Edit" action for item
  - **Result**: Opens edit interface for selected item
  - **Process**:
    - Validates user has edit permission
    - Navigates to appropriate edit screen with item ID
    - Or opens edit panel/modal within current view
  - **State Changes**:
    - Navigates to edit screen or opens edit panel

- **Action**: Delete item
  - **Trigger**: Click "Delete" action for item
  - **Result**: Removes item after confirmation
  - **Process**:
    - Validates user has delete permission
    - Shows confirmation dialog
    - Performs soft delete in database
    - Updates UI to remove item
  - **State Changes**:
    - Removes item from display
    - Updates item count

- **Action**: Custom item actions
  - **Trigger**: Click content-specific action button (e.g., "Assess", "Approve")
  - **Result**: Performs content-specific action on item
  - **Process**:
    - Executes custom action defined in content configuration
    - May navigate to another screen or update item state
  - **State Changes**:
    - Depends on specific action

#### 6. Data Export and Reporting

- **Action**: Export data
  - **Trigger**: Click "Export" button
  - **Result**: Exports displayed data in selected format
  - **Process**:
    - Prompts for export format (CSV, Excel, PDF)
    - Generates export file with current filters applied
    - Triggers download
  - **State Changes**:
    - Creates and downloads export file

- **Action**: Generate report
  - **Trigger**: Click "Generate Report" button
  - **Result**: Creates formatted report from current data
  - **Process**:
    - Navigates to report builder with current data context
    - Or generates quick report in selected format
  - **State Changes**:
    - Navigates to report builder or downloads report

#### 7. Natural Language and Chat Integration

- **Action**: Use natural language to filter or find data
  - **Trigger**: Type query in chat (e.g., "Show me high-risk items created last month")
  - **Result**: Applies appropriate filters based on natural language query
  - **Process**:
    - AI processes natural language to identify filter intent
    - Translates to appropriate filter parameters
    - Applies filters to current view
  - **State Changes**:
    - Updates applied filters
    - Updates displayed data

- **Action**: Navigate via slash command
  - **Trigger**: Type slash command in chat (e.g., `/risks` or `/assets`)
  - **Result**: Navigates to appropriate ListView with specified content type
  - **Process**:
    - Parses command to identify content type
    - Navigates to ListView with appropriate parameters
  - **State Changes**:
    - Navigation to new URL
    - ListView loads with specified content type

- **Action**: Request contextual help
  - **Trigger**: Ask question about current data in chat
  - **Result**: Receives contextual assistance about current content type
  - **Process**:
    - AI uses current content type context to provide relevant help
    - May suggest filters, actions, or explain data fields
  - **State Changes**:
    - No direct UI state change
    - Chat responds with contextual assistance

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: URL navigation to ListView
- **Process**:
  - Initializes layout with `LayoutManager.initializePage("listView.html")`
  - Parses URL parameters for content type, view, filters
  - Loads content configuration based on type
  - Validates user permissions for content type
  - Loads and renders appropriate data
  - Sets up event listeners and UI state
  - Initializes chat context with content type
  - Applies any URL-defined filters, sort, or search

#### 2. Permission-Based UI Adaptation
- **Trigger**: During initialization and content type changes
- **Process**:
  - Retrieves user role and permissions from user context
  - Compares with required permissions for content type
  - Shows/hides actions based on permissions
  - Filters viewable fields and items based on permissions
  - Displays appropriate messaging for permission limitations

#### 3. Auto-Refresh and Real-Time Updates
- **Trigger**: Database changes or timed intervals
- **Process**:
  - Listens for relevant database changes via Supabase subscriptions
  - Updates affected items in real-time
  - Shows notification for significant changes
  - Periodically refreshes data for currency

#### 4. State Persistence
- **Trigger**: User changes view configuration or filters
- **Process**:
  - Updates URL parameters to reflect current state
  - Saves user preferences to database
  - Ensures browser back/forward navigation works with state
  - Maintains state between page refreshes

### Error Handling
- **Invalid Content Type**: Shows error with available content types list
- **Permission Denied**: Shows appropriate message explaining access limitation
- **Data Loading Failures**: Shows error notification with retry option
- **Empty Results**: Shows meaningful empty state with suggested actions
- **Action Failures**: Shows error notification with details and recovery options
- **Network Issues**: Implements offline support with data synchronization on reconnection

### Data Persistence
- **Primary Storage**: Supabase Database
  - All content data stored in appropriate tables
  - Templates stored in `listview_templates` table
  - Template version history in `listview_template_versions`
  - User preferences stored in `user_listview_preferences`
  - Filter presets stored in `listview_filter_presets`
  - Custom fields stored in `listview_custom_fields`

- **Template Database Structure**:
  - **listview_templates**: Master template records
    - id, name, description, content_type, is_default, created_by, created_at, updated_at, version, status
  - **listview_template_versions**:
    - template_id, version, json_data, changes, created_by, created_at
  - **listview_template_permissions**:
    - template_id, role_id, can_view, can_edit, can_delete, can_share
  - **listview_custom_fields**:
    - template_id, field_name, field_type, options, validation, display_order

- **Fallback Storage**: 
  - LocalStorage used only for temporary state and offline operation
  - Keys: `listview_state_${templateId}`, `listview_filters_${templateId}`
  - All local data syncs to database when connection is restored

- **Database Operations**:
  - **ListView Screen Load**:
    - **Operation**: SELECT template, SELECT data with template-defined query
    - **Tables**: `listview_templates`, content-specific tables
    - **Description**: Retrieves template configuration and data with permission filters
  
  - **Template Load**:
    - **Operation**: SELECT template configuration
    - **Tables**: `listview_templates`, `listview_template_versions`
    - **Description**: Loads the appropriate template version
  
  - **Filter Application**:
    - **Operation**: SELECT with WHERE clauses based on template-defined filters
    - **Tables**: Content-specific tables defined in template
    - **Description**: Filters data based on user-selected criteria and template settings
  
  - **Item Creation/Edit**:
    - **Operation**: INSERT or UPDATE on content-specific tables
    - **Tables**: Tables defined in template
    - **Description**: Creates or modifies records with permission validation
  
  - **Template Save**:
    - **Operation**: INSERT or UPDATE template, INSERT template version
    - **Tables**: `listview_templates`, `listview_template_versions`
    - **Description**: Creates or updates template with version history

### AI Integration Points
- **Context-Aware Assistance**: Chat understands current content type context
- **Filter Translation**: Converts natural language queries to structured filters
- **Data Insights**: Provides insights about patterns in displayed data
- **Action Suggestions**: Recommends relevant actions based on data state
- **Permission-Aware Guidance**: Only suggests actions user has permission to perform
- **Query Formulation Help**: Assists with creating complex filter combinations
- **Similar Items Finding**: Helps locate similar records across the database
- **Command Shortcuts**: Recognizes slash commands for quick navigation and filtering
- **Data Visualization Suggestions**: Recommends appropriate visualization based on data
- **Export Format Recommendations**: Suggests optimal export format based on data and use case

### Chat Interface Integration
The omnipresent chat interface integrates with the ListView to provide:
- Contextual help about the current content type
- Natural language filtering capabilities
- Command shortcuts for quick navigation and actions
- Data insights and pattern recognition
- Suggested actions based on current data state
- Explanations of data fields and relationships
- Quick export and report generation
- Permission-aware guidance that respects user role

### Integration Dependencies
- **Navigation System**: Templates are registered for navigation menu items
- **User Management**: Role-based permissions control access to templates and content
- **Editor Screens**: Templates define the appropriate editor screen for each content type
- **Wizard Screens**: "Add" actions defined in templates may initiate specific wizards
- **Report Builder**: Export actions may utilize the report builder with template context
- **Dashboard**: ListView templates may be referenced by dashboard components
- **Search System**: Global search may direct users to specific ListView templates
- **Template Configurator**: Special admin screen for creating and modifying templates

### Role-Based Access Control
The ListView implements comprehensive role-based access control with template-specific permissions:

- **Content Type Access**: Users can only see content types they have permission to access
- **Template Access**: User access to templates is controlled by permission settings
- **Template Customization**: Ability to create and modify templates is role-restricted:
  - **Administrators**: Can create/edit System Templates, Default Templates, and User Templates
  - **Managers**: Can create/edit Default Templates (for assigned areas) and User Templates
  - **Power Users**: Can create/edit User Templates with limited customization options
  - **Standard Users**: Can use templates and save personal filter presets only
- **Field-Level Security**: Sensitive fields are hidden based on user permissions
- **Action Permissions**: Actions (edit, delete, export) are shown/hidden based on permissions
- **Row-Level Security**: Data queries include permission filters to limit visible records
- **Context-Specific Permissions**: Some actions may be permitted in certain contexts only
- **Audit Logging**: All data access and actions are logged for compliance

### Enhanced Navigation Features

#### URL-Based Navigation
The system supports both traditional and semantic URL patterns:
- Traditional: `listView.html?type=risks&filter=status:active`
- Semantic: `/risks?filter=status:active` (with appropriate routing)

#### Natural Language Navigation
Users can navigate and filter using natural language in the chat:
- "Show me all high-risk items created last month"
- "Find assets owned by the IT department"
- "List all documents pending approval"

#### Slash Commands
Quick navigation using slash commands in chat:
- `/risks` - Navigate to risk register
- `/assets filter:department:IT` - Show IT department assets
- `/policies status:draft` - Show draft policies

#### Cross-Reference Navigation
Intelligent navigation between related content:
- From an asset to related risks
- From a policy to related controls
- From a vendor to related contracts

### ListView Enhancement Roadmap
Future enhancements to consider:

1. **Advanced Visualization Options**:
   - Toggle between table, grid, Kanban, and timeline views
   - Embedded charts and graphs of filtered data
   - Hierarchical data visualization for nested structures

2. **Enhanced Filtering Capabilities**:
   - Saved filter presets with sharing options
   - Filter templates for common scenarios
   - Visual filter builder for complex queries

3. **Collaborative Features**:
   - Shared views with collaborative filtering
   - Comment threads on specific items
   - Real-time collaboration indicators

4. **AI-Enhanced Data Management**:
   - Anomaly detection in data sets
   - Pattern recognition and insights
   - Predictive filtering suggestions

5. **Mobile Optimization**:
   - Touch-optimized interfaces for all actions
   - Mobile-specific view configurations
   - Offline capability with synchronization

6. **Template Marketplace**:
   - Community sharing of templates
   - Rating and review system
   - Template categories and tags
   - Import/export functionality

7. **Custom Field Management**:
   - User-defined fields for any content type
   - Custom field types and validation
   - Formula fields and calculated values

8. **Advanced Security Features**:
   - Data masking for sensitive fields
   - Audit logging of all data access
   - Fine-grained permission controls

9. **Integration Expansion**:
   - Third-party data source connectors
   - API endpoints for template data
   - Embeddable views for external applications
