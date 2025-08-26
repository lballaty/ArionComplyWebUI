# ListView Template Configurator Workflow

## Screen: `templateConfigurator.html`

### Overview
The ListView Template Configurator is a specialized administrative interface that allows authorized users to create, modify, and manage ListView templates. This tool provides a visual interface for defining all aspects of a ListView template without requiring manual JSON editing. Templates created here can be used by the ListView to display and interact with any data in the system, with the configurator providing a comprehensive yet user-friendly way to customize the display and behavior of ListView screens.

The configurator enforces a hierarchical template structure with:
- **System Templates**: Core templates defined by administrators that establish foundational behavior
- **Default Templates**: One designated default template per content type that users see by default
- **User Templates**: User-created variations with restricted customization based on permissions

The system also enforces content-appropriate view restrictions, only allowing view modes that make sense for the data type being displayed (e.g., Kanban for workflow data, timeline for date-based data).

### User-Triggered Actions

#### 1. Template Management

- **Action**: Create new template
  - **Trigger**: Click "New Template" button
  - **Result**: Initiates template creation process
  - **Process**:
    - Selects template type:
      - System Template (admin only)
      - Default Template (admin/manager only)
      - User Template (all authorized users)
    - Selects content type to be displayed
    - Creates blank template record
    - Opens template editor with default settings
    - Guides user through configuration process
  - **State Changes**:
    - Creates new template in draft status
    - Sets editing mode to "create"

- **Action**: Edit existing template
  - **Trigger**: Select template from list, click "Edit"
  - **Result**: Opens template for editing
  - **Process**:
    - Checks user permission for template type
    - Loads template configuration from database
    - For User Templates: Shows only editable sections
    - For Default Templates: Requires higher permissions
    - For System Templates: Restricted to administrators
    - Populates editor interface with settings
  - **State Changes**:
    - Sets current template
    - Sets editing mode to "edit"
    - Loads template configuration

- **Action**: Clone template
  - **Trigger**: Select template from list, click "Clone"
  - **Result**: Creates a copy of selected template
  - **Process**:
    - Copies template configuration with new ID
    - Appends "(Copy)" to name
    - Opens in edit mode
  - **State Changes**:
    - Creates new template record
    - Sets editing mode to "edit"
    - Loads cloned configuration

- **Action**: Delete template
  - **Trigger**: Select template from list, click "Delete"
  - **Result**: Removes template after confirmation
  - **Process**:
    - Confirms deletion intent
    - Checks for template dependencies
    - Performs soft delete of template
  - **State Changes**:
    - Marks template as deleted
    - Updates template list

- **Action**: Export template
  - **Trigger**: Select template, click "Export"
  - **Result**: Downloads template configuration as JSON
  - **Process**:
    - Formats template configuration as JSON file
    - Triggers file download
  - **State Changes**:
    - No persistent state change

- **Action**: Import template
  - **Trigger**: Click "Import", select JSON file
  - **Result**: Creates new template from JSON
  - **Process**:
    - Validates JSON structure
    - Extracts template configuration
    - Creates new template or updates existing
  - **State Changes**:
    - Creates or updates template record
    - Updates template list

#### 2. General Configuration

- **Action**: Configure basic information
  - **Trigger**: Edit fields in "General" tab
  - **Result**: Updates template metadata
  - **Process**:
    - Captures template name, description, category
    - Sets display settings and icons
    - Updates database record
  - **State Changes**:
    - Updates template metadata
    - Marks template as modified

- **Action**: Configure data source
  - **Trigger**: Edit fields in "Data Source" tab
  - **Result**: Defines where template data comes from
  - **Process**:
    - Selects primary table or view
    - Defines join conditions for related tables
    - Sets query parameters and filters
    - Configures pagination settings
  - **State Changes**:
    - Updates data source configuration
    - Marks template as modified

- **Action**: Test data source
  - **Trigger**: Click "Test Query" button
  - **Result**: Validates and tests data source configuration
  - **Process**:
    - Constructs query based on configuration
    - Executes query against database
    - Shows sample results and performance metrics
  - **State Changes**:
    - No persistent state change
    - Shows test results in UI

#### 3. Column Configuration

- **Action**: Add column
  - **Trigger**: Click "Add Column" button
  - **Result**: Adds new column to template
  - **Process**:
    - Provides field selection interface
    - Allows configuration of display properties
    - Sets sorting and filtering capabilities
  - **State Changes**:
    - Adds column to configuration
    - Updates column list display

- **Action**: Edit column
  - **Trigger**: Select column, click "Edit"
  - **Result**: Opens column configuration panel
  - **Process**:
    - Shows all column settings
    - Allows modification of properties
    - Updates configuration on save
  - **State Changes**:
    - Updates column configuration
    - Refreshes column list display

- **Action**: Remove column
  - **Trigger**: Select column, click "Remove"
  - **Result**: Removes column from template
  - **Process**:
    - Confirms removal intent
    - Removes column from configuration
  - **State Changes**:
    - Updates column list
    - Marks template as modified

- **Action**: Reorder columns
  - **Trigger**: Drag and drop columns in list
  - **Result**: Changes column display order
  - **Process**:
    - Updates display order in configuration
    - Shows visual feedback during drag
  - **State Changes**:
    - Updates column order
    - Marks template as modified

- **Action**: Configure column formatting
  - **Trigger**: Edit formatting options in column settings
  - **Result**: Defines how column data is displayed
  - **Process**:
    - Sets data formatting rules
    - Configures conditional formatting
    - Defines display templates
  - **State Changes**:
    - Updates column formatting rules
    - Shows preview of formatting

#### 4. Filter Configuration

- **Action**: Add filter
  - **Trigger**: Click "Add Filter" button
  - **Result**: Adds new filter to template
  - **Process**:
    - Selects field to filter on
    - Configures filter type and options
    - Sets default values and visibility
  - **State Changes**:
    - Adds filter to configuration
    - Updates filter list display

- **Action**: Edit filter
  - **Trigger**: Select filter, click "Edit"
  - **Result**: Opens filter configuration panel
  - **Process**:
    - Shows all filter settings
    - Allows modification of properties
    - Updates configuration on save
  - **State Changes**:
    - Updates filter configuration
    - Refreshes filter list display

- **Action**: Remove filter
  - **Trigger**: Select filter, click "Remove"
  - **Result**: Removes filter from template
  - **Process**:
    - Confirms removal intent
    - Removes filter from configuration
  - **State Changes**:
    - Updates filter list
    - Marks template as modified

- **Action**: Configure filter dependencies
  - **Trigger**: Edit dependencies in filter settings
  - **Result**: Creates relationships between filters
  - **Process**:
    - Defines cascading filter relationships
    - Sets filter visibility conditions
    - Configures dynamic option loading
  - **State Changes**:
    - Updates filter dependency rules
    - Marks template as modified

#### 5. Action Configuration

- **Action**: Add action
  - **Trigger**: Click "Add Action" button
  - **Result**: Adds new action to template
  - **Process**:
    - Selects action type (standard or custom)
    - Configures action parameters
    - Sets visibility and permission requirements
  - **State Changes**:
    - Adds action to configuration
    - Updates action list display

- **Action**: Edit action
  - **Trigger**: Select action, click "Edit"
  - **Result**: Opens action configuration panel
  - **Process**:
    - Shows all action settings
    - Allows modification of properties
    - Updates configuration on save
  - **State Changes**:
    - Updates action configuration
    - Refreshes action list display

- **Action**: Remove action
  - **Trigger**: Select action, click "Remove"
  - **Result**: Removes action from template
  - **Process**:
    - Confirms removal intent
    - Removes action from configuration
  - **State Changes**:
    - Updates action list
    - Marks template as modified

- **Action**: Configure custom action
  - **Trigger**: Select "Custom" action type, configure
  - **Result**: Creates specialized action with custom behavior
  - **Process**:
    - Defines action parameters and behavior
    - Sets up UI components for action
    - Configures backend integration
  - **State Changes**:
    - Creates custom action definition
    - Updates action list

#### 6. View Configuration

- **Action**: Configure table view
  - **Trigger**: Edit settings in "Table View" tab
  - **Result**: Customizes table display settings
  - **Process**:
    - Sets pagination options
    - Configures row styling and interactions
    - Defines sorting behavior
  - **State Changes**:
    - Updates table view configuration
    - Marks template as modified

- **Action**: Configure grid view
  - **Trigger**: Edit settings in "Grid View" tab
  - **Result**: Customizes grid/card display settings
  - **Process**:
    - Defines card layout and content
    - Sets grid column configuration
    - Configures card interactions
    - Enables/disables grid view based on content appropriateness
  - **State Changes**:
    - Updates grid view configuration
    - Marks template as modified

- **Action**: Configure additional views
  - **Trigger**: Edit settings in "Additional Views" tab
  - **Result**: Sets up alternative view modes where appropriate
  - **Process**:
    - Shows only content-appropriate view options:
      - Kanban view: Only for task/workflow-based content
      - Timeline view: Only for date-based content
      - Map view: Only for location-based content
      - Chart view: Only for numeric data content
    - Configures view-specific settings
    - Maps data fields to view components
    - Shows explanation for unavailable views
  - **State Changes**:
    - Updates additional view configurations
    - Marks template as modified

#### 7. Permission Configuration

- **Action**: Configure view permissions
  - **Trigger**: Edit settings in "Permissions" tab
  - **Result**: Defines who can see and use the template
  - **Process**:
    - Selects roles with view access
    - Configures field-level visibility by role
    - Sets row-level security rules
  - **State Changes**:
    - Updates permission configuration
    - Marks template as modified

- **Action**: Configure edit permissions
  - **Trigger**: Edit edit permission settings
  - **Result**: Defines who can edit the template
  - **Process**:
    - Selects roles with edit access
    - Sets approval requirements for changes
    - Configures notification settings
  - **State Changes**:
    - Updates edit permission configuration
    - Marks template as modified

#### 8. Preview and Testing

- **Action**: Preview template
  - **Trigger**: Click "Preview" button
  - **Result**: Shows preview of template with sample data
  - **Process**:
    - Renders template with current configuration
    - Loads sample data based on data source
    - Simulates user interactions
  - **State Changes**:
    - No persistent state change
    - Opens preview panel/window

- **Action**: Test with real data
  - **Trigger**: Click "Test with Real Data" button
  - **Result**: Shows preview with actual database data
  - **Process**:
    - Executes actual database query
    - Renders template with real data
    - Limits record count for performance
  - **State Changes**:
    - No persistent state change
    - Opens preview with real data

#### 9. Template Publication

- **Action**: Save draft
  - **Trigger**: Click "Save Draft" button
  - **Result**: Saves current template state without publishing
  - **Process**:
    - Validates configuration
    - Saves to database as draft version
    - Updates last modified timestamp
  - **State Changes**:
    - Saves template as draft
    - Updates save status indicator

- **Action**: Publish template
  - **Trigger**: Click "Publish" button
  - **Result**: Makes template available for use
  - **Process**:
    - Validates configuration completeness
    - Creates new version in database
    - Updates template status to "Published"
  - **State Changes**:
    - Publishes template
    - Updates version history
    - Makes template available to ListView

- **Action**: Set as default
  - **Trigger**: Click "Set as Default" checkbox
  - **Result**: Makes this the default template for content type
  - **Process**:
    - Updates content type configuration
    - Removes default status from other templates of same type
    - Updates template status
  - **State Changes**:
    - Updates default template designation
    - Updates related content type settings

### System-Triggered Actions

#### 1. Template Configurator Initialization
- **Trigger**: Page load of Template Configurator
- **Process**:
  - Initializes interface with `LayoutManager.initializePage("templateConfigurator.html")`
  - Loads template list from database
  - Sets up editor interface components
  - Initializes permission checks for current user

#### 2. Template Editor Loading
- **Trigger**: Opening template for editing
- **Process**:
  - Loads complete template configuration from database
  - Populates all editor sections with configuration
  - Sets up validation rules for each section
  - Initializes interactive components

#### 3. Configuration Validation
- **Trigger**: Saving or publishing template
- **Process**:
  - Validates all configuration sections
  - Checks for required fields
  - Validates data source query
  - Ensures permission configuration is complete
  - Shows validation errors if found

#### 4. Template Versioning
- **Trigger**: Publishing template
- **Process**:
  - Creates new version record in database
  - Maintains complete version history
  - Associates metadata with version (author, timestamp, changes)
  - Updates template record with current version

### Error Handling
- **Validation Errors**: Highlights fields with validation issues
- **Query Errors**: Shows detailed error information for data source issues
- **Permission Errors**: Notifies if user lacks permission for certain operations
- **Dependency Conflicts**: Warns when template has dependencies preventing deletion
- **Import Errors**: Validates and shows detailed error for invalid imports

### Data Persistence
- **Primary Storage**: Supabase Database
  - Templates stored in `listview_templates` table
  - Template versions stored in `listview_template_versions`
  - Template permissions in `listview_template_permissions`
  - Template usage statistics in `listview_template_usage`

- **Database Operations**:
  - **Template Configurator Load**:
    - **Operation**: SELECT templates with permission filter
    - **Tables**: `listview_templates`
    - **Description**: Retrieves templates user has permission to edit
  
  - **Template Load**:
    - **Operation**: SELECT template configuration
    - **Tables**: `listview_templates`, `listview_template_versions`
    - **Description**: Loads complete template configuration
  
  - **Template Save**:
    - **Operation**: INSERT or UPDATE template
    - **Tables**: `listview_templates`
    - **Description**: Saves template changes as draft
  
  - **Template Publish**:
    - **Operation**: UPDATE template, INSERT template version
    - **Tables**: `listview_templates`, `listview_template_versions`
    - **Description**: Creates new published version
  
  - **Template Permission Update**:
    - **Operation**: INSERT or UPDATE permissions
    - **Tables**: `listview_template_permissions`
    - **Description**: Updates who can view/edit template

### AI Integration Points
- **Template Suggestions**: AI suggests improvements to template design
- **Field Mapping**: AI recommends appropriate field mappings based on data
- **Query Optimization**: Suggests query improvements for better performance
- **Filter Recommendations**: Recommends useful filter combinations
- **Layout Optimization**: Suggests layout improvements based on data characteristics
- **User Experience Analysis**: Analyzes template for usability issues
- **Permission Configuration**: Suggests appropriate permission settings

### Chat Interface Integration
The omnipresent chat interface integrates with the Template Configurator to provide:
- Guidance on template configuration best practices
- Troubleshooting assistance for template issues
- Suggestions for template improvements
- Help with specific configuration tasks
- Examples of similar templates for reference

### Integration Dependencies
- **User Management**: Role-based permissions for template editing
- **ListView**: Templates created here are used by the ListView
- **Database Explorer**: For selecting tables and fields for data sources
- **Permission System**: Integration for setting view/edit permissions

### Future Enhancements
1. **Template Analytics**:
   - Usage tracking and heat maps
   - Performance monitoring
   - User feedback collection

2. **Advanced Customization**:
   - Custom component integration
   - Script editor for advanced behaviors
   - Visual theme customization

3. **Collaboration Features**:
   - Multi-user editing with locking
   - Review and approval workflows
   - Comment and feedback system

4. **AI-Powered Design**:
   - Auto-template generation from data structure
   - Natural language template creation
   - User behavior analysis for optimization
