# Record Editor Screen Workflow

## Screen: `recordEditor.html`

### Overview
The Record Editor is a dynamic, template-driven interface for creating, viewing, editing, and managing individual records from any database table or content type. It adapts its form elements, validation rules, and available actions based on the content type being edited and the user's permissions. The system enforces approval workflows for significant changes, ensuring that sensitive operations like deletions require appropriate authorization. Like the ListView, the Record Editor is powered by configurable templates that determine its behavior and appearance for each content type.

### Dynamic Configuration Architecture

#### 1. Editor Template System
The Record Editor uses a template-based architecture where each form is defined by a JSON template stored in the database:

- **Template Structure**: JSON format defining all form aspects
- **Template Storage**: Stored in `record_editor_templates` table in Supabase
- **Template Hierarchy**:
  - **System Templates**: Core templates defined by administrators
  - **Default Templates**: One designated default template per content type
  - **Custom Templates**: Specialized variations for different contexts
- **Content Type Mapping**: Templates are mapped to specific content types
- **Template Versioning**: Full version history of template changes
- **Template Access Control**: Permission-based template usage rights

#### 2. Template Components
Each template contains comprehensive configuration for:

- **Metadata**: Title, description, related content type
- **Form Layout**: Sections, fields, layout rules
- **Field Definitions**: Input types, validation rules, help text
- **Relations**: Related records, lookup configurations
- **Conditional Logic**: Dynamic form behavior based on input
- **Actions**: Available buttons and their behaviors
- **Workflows**: Approval processes and state transitions
- **Permissions**: Required permissions for different operations
- **Custom Components**: UI component overrides and extensions

#### 3. URL-Based Configuration Loading
The editor is loaded based on URL parameters:
- Mode: `?mode=create` / `?mode=edit` / `?mode=view`
- Record ID: `?id=123` (for edit/view modes)
- Template Override: `?template=custom_risk_form`
- Context: `?context=approval` / `?context=review`

#### 4. Integration with Approval Workflows
The Record Editor integrates with the platform's approval workflow system:
- Changes can require approval based on content type and field sensitivity
- Approval states are tracked and displayed in the interface
- Changes are versioned and can be compared/reverted
- Notifications are sent to approvers automatically

### User-Triggered Actions

#### 1. Record Creation

- **Action**: Create new record
  - **Trigger**: Navigate to Record Editor with create mode
  - **Result**: Displays empty form for creating new record
  - **Process**:
    - Determines content type from URL parameters
    - Loads appropriate editor template
    - Initializes empty form with default values
    - Shows create-specific actions and instructions
  - **State Changes**:
    - Sets editor to create mode
    - Initializes form with defaults

- **Action**: Save new record
  - **Trigger**: Click "Save" or "Submit" button
  - **Result**: Creates new record in database
  - **Process**:
    - Validates all form inputs
    - Shows validation errors if any
    - Determines if approval is needed based on content type
    - If approval needed: Creates record in pending state
    - If no approval needed: Creates record in active state
    - Shows appropriate confirmation message
  - **State Changes**:
    - Creates new database record
    - Updates record list in background
    - May initiate approval workflow

- **Action**: Save draft
  - **Trigger**: Click "Save Draft" button
  - **Result**: Saves incomplete record as draft
  - **Process**:
    - Validates available form inputs (ignores required fields)
    - Saves record with draft status
    - Shows draft saved confirmation
  - **State Changes**:
    - Creates draft record
    - Updates drafts list

- **Action**: Cancel creation
  - **Trigger**: Click "Cancel" button
  - **Result**: Discards new record form
  - **Process**:
    - Confirms user intent if form has changes
    - Redirects to previous page or ListView
  - **State Changes**:
    - Discards unsaved changes
    - Navigates away from editor

#### 2. Record Editing

- **Action**: Edit existing record
  - **Trigger**: Navigate to Record Editor with edit mode and record ID
  - **Result**: Loads record data into editable form
  - **Process**:
    - Retrieves record data from database
    - Loads appropriate editor template
    - Populates form with record values
    - Shows edit-specific actions
    - Checks user permissions for specific fields
  - **State Changes**:
    - Sets editor to edit mode
    - Loads record data into form
    - Tracks original values for change detection

- **Action**: Save changes
  - **Trigger**: Click "Save Changes" button
  - **Result**: Updates record in database
  - **Process**:
    - Validates all form inputs
    - Determines which fields have changed
    - Determines if changes require approval
    - If approval needed: Creates change request
    - If no approval needed: Updates record directly
    - Shows appropriate confirmation message
  - **State Changes**:
    - Updates database record or creates change request
    - Updates record history
    - May initiate approval workflow

- **Action**: Discard changes
  - **Trigger**: Click "Discard Changes" button
  - **Result**: Reverts form to original values
  - **Process**:
    - Confirms user intent
    - Reloads form with original record data
  - **State Changes**:
    - Reverts form to original values
    - Clears change tracking

#### 3. Record Viewing

- **Action**: View record details
  - **Trigger**: Navigate to Record Editor with view mode and record ID
  - **Result**: Displays record in read-only format
  - **Process**:
    - Retrieves record data from database
    - Loads appropriate view template
    - Renders record in read-only format
    - Shows view-specific actions
  - **State Changes**:
    - Sets editor to view mode
    - Loads record data into view

- **Action**: Switch to edit mode
  - **Trigger**: Click "Edit" button in view mode
  - **Result**: Converts view to editable form
  - **Process**:
    - Checks user edit permissions
    - Changes interface to editable mode
    - Enables form controls
  - **State Changes**:
    - Switches from view to edit mode
    - Enables editing controls

- **Action**: Print record
  - **Trigger**: Click "Print" button in view mode
  - **Result**: Generates printer-friendly version
  - **Process**:
    - Formats record for printing
    - Opens browser print dialog
  - **State Changes**:
    - No persistent state change

#### 4. Attachment Management

- **Action**: Add attachment
  - **Trigger**: Click "Add Attachment" button
  - **Result**: Allows user to upload file attachment
  - **Process**:
    - Opens file selection dialog
    - Uploads selected file to storage
    - Creates attachment record linked to main record
    - Shows progress and confirmation
  - **State Changes**:
    - Adds attachment to record
    - Updates attachments list

- **Action**: View attachment
  - **Trigger**: Click on attachment in list
  - **Result**: Opens or downloads attachment
  - **Process**:
    - Retrieves attachment from storage
    - Opens in browser or downloads based on type
  - **State Changes**:
    - No persistent state change

- **Action**: Delete attachment
  - **Trigger**: Click "Delete" on attachment
  - **Result**: Removes attachment from record
  - **Process**:
    - Confirms deletion intent
    - Determines if approval needed
    - If approval needed: Marks for deletion pending approval
    - If no approval needed: Removes attachment
  - **State Changes**:
    - Removes or marks attachment for deletion
    - Updates attachments list

#### 5. Relationship Management

- **Action**: Add related record
  - **Trigger**: Click "Add Relationship" in relationships section
  - **Result**: Creates relationship to another record
  - **Process**:
    - Opens record search/selection interface
    - Allows selection of record to relate
    - Creates relationship record in database
  - **State Changes**:
    - Creates new relationship
    - Updates relationships list

- **Action**: View related record
  - **Trigger**: Click on related record in list
  - **Result**: Opens related record in new tab/window
  - **Process**:
    - Navigates to Record Editor for related record
  - **State Changes**:
    - No state change in current editor
    - Opens new editor instance

- **Action**: Remove relationship
  - **Trigger**: Click "Remove" on relationship
  - **Result**: Removes relationship between records
  - **Process**:
    - Confirms removal intent
    - Removes relationship record from database
  - **State Changes**:
    - Removes relationship
    - Updates relationships list

#### 6. Record Deletion

- **Action**: Request record deletion
  - **Trigger**: Click "Delete Record" button
  - **Result**: Initiates deletion process
  - **Process**:
    - Confirms deletion intent with warning
    - Checks if approval required for deletion
    - If approval required: Creates deletion request
    - If no approval required: Performs soft deletion
  - **State Changes**:
    - Creates deletion request or
    - Marks record as deleted (soft delete)
    - Updates record status

- **Action**: Cancel deletion request
  - **Trigger**: Click "Cancel Request" on pending deletion
  - **Result**: Cancels pending deletion request
  - **Process**:
    - Confirms cancellation intent
    - Removes deletion request
    - Restores record to previous state
  - **State Changes**:
    - Removes deletion request
    - Updates record status

#### 7. Workflow and Approval Actions

- **Action**: Submit for approval
  - **Trigger**: Click "Submit for Approval" button
  - **Result**: Sends record changes for approval
  - **Process**:
    - Validates all inputs
    - Creates approval request in system
    - Notifies appropriate approvers
    - Shows confirmation message
  - **State Changes**:
    - Creates approval request
    - Updates record status
    - Sends notifications

- **Action**: Approve changes
  - **Trigger**: Click "Approve" button (for approvers only)
  - **Result**: Approves pending changes
  - **Process**:
    - Validates approver permission
    - Records approval action with timestamp and user
    - If final approval: Applies changes to record
    - If multi-level approval: Updates approval status
  - **State Changes**:
    - Records approval
    - May apply changes to record
    - Updates approval status

- **Action**: Reject changes
  - **Trigger**: Click "Reject" button (for approvers only)
  - **Result**: Rejects pending changes
  - **Process**:
    - Validates approver permission
    - Prompts for rejection reason
    - Records rejection with reason, timestamp, and user
    - Updates approval request status
    - Notifies change requestor
  - **State Changes**:
    - Records rejection
    - Updates approval status
    - Sends notification

#### 8. History and Versioning

- **Action**: View history
  - **Trigger**: Click "History" tab
  - **Result**: Shows record change history
  - **Process**:
    - Retrieves record history from database
    - Displays chronological list of changes
    - Shows user, timestamp, and change details
  - **State Changes**:
    - Switches to history view
    - No persistent state change

- **Action**: Compare versions
  - **Trigger**: Select two versions, click "Compare"
  - **Result**: Shows side-by-side comparison
  - **Process**:
    - Retrieves both versions from database
    - Generates difference visualization
    - Highlights changes between versions
  - **State Changes**:
    - Shows comparison view
    - No persistent state change

- **Action**: Revert to previous version
  - **Trigger**: Select version, click "Revert to This Version"
  - **Result**: Reverts record to selected version
  - **Process**:
    - Confirms reversion intent
    - Checks if approval required
    - If approval required: Creates reversion request
    - If no approval required: Applies reversion
  - **State Changes**:
    - Creates reversion request or
    - Updates record to previous version
    - Adds reversion entry to history

#### 9. Custom Form Functionality

- **Action**: Dynamic field visibility
  - **Trigger**: Change value in controlling field
  - **Result**: Shows/hides dependent fields
  - **Process**:
    - Evaluates conditional display rules
    - Updates visibility of dependent fields
  - **State Changes**:
    - Updates field visibility
    - No persistent state change

- **Action**: Lookup field selection
  - **Trigger**: Click lookup button next to field
  - **Result**: Opens lookup dialog for reference data
  - **Process**:
    - Opens dialog with searchable reference data
    - Allows selection of reference value
    - Populates field with selected value
  - **State Changes**:
    - Updates field value
    - May update dependent fields

- **Action**: Generate field value
  - **Trigger**: Click "Generate" button next to field
  - **Result**: Auto-generates appropriate value
  - **Process**:
    - Runs generation logic specific to field type
    - Populates field with generated value
  - **State Changes**:
    - Updates field value

### System-Triggered Actions

#### 1. Editor Initialization
- **Trigger**: Page load of Record Editor
- **Process**:
  - Initializes interface with `LayoutManager.initializePage("recordEditor.html")`
  - Parses URL parameters for mode, record ID, and template
  - Determines content type from parameters or record
  - Loads appropriate editor template
  - Retrieves record data if in edit/view mode
  - Sets up form validation rules
  - Configures field interactions and dependencies
  - Initializes permission checks for current user
  - Establishes real-time database subscriptions

#### 2. Real-Time Data Synchronization
- **Trigger**: Database changes detected for current record
- **Process**:
  - Supabase real-time subscription detects changes to record
  - Compares incoming changes with current form state
  - For view mode: Updates display with changed data
  - For edit mode: 
    - If no local edits to same fields: Quietly updates fields
    - If conflict with local edits: Shows conflict resolution dialog
    - If record deleted: Shows notification and redirects
  - For related records: Updates relationship displays
  - Highlights changed fields with visual indicators
  - Shows notifications for significant changes
  - Maintains form focus and scroll position during updates

#### 3. Data Validation
- **Trigger**: Form submission or explicit validation request
- **Process**:
  - Validates all form inputs against rules
  - Checks required fields are completed
  - Verifies data types and formats
  - Validates against business rules
  - Shows validation errors inline
  - Prevents submission if validation fails

#### 4. Auto-Save
- **Trigger**: Timed interval or significant form changes
- **Process**:
  - Saves current form state to temporary storage
  - Does not create official record version
  - Provides recovery option if session interrupted
  - Shows subtle auto-save indicator
  - Records timestamp of last auto-save

#### 5. Approval Status Updates
- **Trigger**: Changes in approval status
- **Process**:
  - Monitors approval requests related to record
  - Updates approval status indicators in real-time
  - Shows notifications for status changes
  - Updates available actions based on status
  - Refreshes workflow visualization if shown

#### 6. Field Dependencies
- **Trigger**: Changes to fields with dependencies
- **Process**:
  - Evaluates field dependency rules
  - Updates dependent field values, options, or visibility
  - Triggers cascading updates for nested dependencies
  - Re-evaluates validation rules

### Error Handling
- **Validation Errors**: Highlights fields with validation issues
- **Permission Errors**: Shows appropriate messages for unauthorized actions
- **Concurrency Conflicts**: Detects and manages simultaneous edit attempts
- **Network Failures**: Preserves form state and offers retry options
- **Server Errors**: Shows user-friendly error messages with support options

### Data Persistence
- **Primary Storage**: Supabase Database
  - Records stored in content-specific tables
  - Record history stored in history tables
  - Attachments stored in Supabase Storage
  - Approval requests in workflow tables

- **Record Version Structure**:
  - **record_versions**: Stores all versions of records
    - record_id, content_type, version_number, data, created_by, created_at
  - **record_changes**: Tracks specific field changes
    - record_id, version_id, field_name, old_value, new_value

- **Approval Workflow Tables**:
  - **approval_requests**: Tracks approval requests
    - request_id, record_id, request_type, status, requestor, created_at
  - **approval_steps**: Defines approval workflow steps
    - request_id, step_number, approver_role, status, approver, approved_at
  - **approval_comments**: Stores approval/rejection comments
    - request_id, step_id, comment, created_by, created_at

- **Fallback Storage**: 
  - LocalStorage used for auto-save and draft state
  - Keys: `record_editor_autosave_${recordId}`, `record_editor_draft_${contentType}`
  - All local data syncs to database when connection is restored

### AI Integration Points
- **Smart Field Suggestions**: AI suggests appropriate values based on context
- **Validation Assistance**: Explains validation errors with suggestions
- **Form Completion Analysis**: Identifies incomplete or problematic sections
- **Relationship Suggestions**: Recommends related records to connect
- **Auto-Generate Text Fields**: Helps draft descriptions and comments
- **Historical Pattern Recognition**: Suggests values based on historical patterns
- **Workflow Optimization**: Suggests optimal approval paths
- **Field Dependencies**: Identifies potential dependencies between fields

### Chat Interface Integration
The omnipresent chat interface integrates with the Record Editor to provide:
- Contextual help about specific fields and sections
- Assistance with form completion and validation
- Guidance on required approvals and workflows
- Explanations of field relationships and dependencies
- Help with attachment management
- Information about record history and versioning

### Integration Dependencies
- **ListView**: Records created/edited here appear in ListView
- **Template Configurator**: Form templates created in dedicated configurator
- **Workflow Engine**: Approval processes defined in workflow engine
- **User Management**: Permissions and approver roles
- **File Manager**: Attachment storage and management
- **Notification System**: Approval notifications and status updates

### Future Enhancements
1. **Advanced Field Types**:
   - Rich text editor with formatting
   - Drawing/annotation fields
   - Signature capture
   - Embedded document viewer

2. **Collaboration Features**:
   - Real-time collaborative editing
   - Field-level comments and discussions
   - Tracked changes with attribution

3. **AI-Enhanced Data Entry**:
   - Predictive text completion
   - Content extraction from attachments
   - Context-aware value suggestions
   - Anomaly detection for unusual values

4. **Mobile Optimization**:
   - Responsive form layouts for mobile
   - Touch-friendly input controls
   - Camera integration for photo attachments
   - Offline editing with synchronization

5. **Integration Expansions**:
   - External data source connectors
   - Third-party approval systems
   - Electronic signature integration
   - Calendar/scheduling integration
