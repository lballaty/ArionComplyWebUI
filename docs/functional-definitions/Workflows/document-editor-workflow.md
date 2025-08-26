# Document Editor Screen Workflow

## Screen: `documentEditor.html`

### Overview
The Document Editor provides a rich text editing environment for creating and managing compliance-related documents. It allows users to create, edit, save, and organize various document types such as policies, procedures, and frameworks. The editor supports document versioning, templates, and various formatting capabilities.

### User-Triggered Actions

#### 1. Document List Management

- **Action**: View document list
  - **Trigger**: Automatic on page load
  - **Result**: Displays list of available documents
  - **Process**:
    - Retrieves documents from storage
    - Renders document list with metadata
    - Displays status indicators
  - **State Changes**:
    - Populates document list UI

- **Action**: Create new document
  - **Trigger**: Click "New Document" button or `Ctrl+N` keyboard shortcut
  - **Result**: Creates new document and opens in editor
  - **Process**:
    - Prompts for document title
    - Prompts for document category
    - Creates new document with default content
    - Opens document in editor
  - **State Changes**:
    - Adds new document to storage
    - Updates document list
    - Sets current document to new document

- **Action**: Open document
  - **Trigger**: Click "Edit" button on document item
  - **Result**: Opens selected document in editor
  - **Process**:
    - Retrieves document data
    - Populates editor fields with document content
    - Updates UI to reflect current document
  - **State Changes**:
    - Sets currentDocumentId
    - Updates editor content
    - Updates page title
    - Highlights document in list

- **Action**: Delete document
  - **Trigger**: Click "Delete" button on document item
  - **Result**: Removes document from system
  - **Process**:
    - Confirms deletion with user
    - Removes document from storage
    - Updates document list
  - **State Changes**:
    - Removes document from storage
    - Updates document list
    - Clears editor if current document was deleted

- **Action**: Duplicate document
  - **Trigger**: Click "Duplicate" button on document item
  - **Result**: Creates a copy of the document
  - **Process**:
    - Creates new document with same content
    - Adds "(Copy)" to title
    - Updates document list
  - **State Changes**:
    - Adds new document to storage
    - Updates document list

#### 2. Document Editing

- **Action**: Edit document content
  - **Trigger**: Type in content editor
  - **Result**: Updates document content
  - **Process**:
    - Content changes are captured in editor
    - Auto-save triggers after inactivity
  - **State Changes**:
    - Updates temporary document state
    - Eventually saves to storage

- **Action**: Edit document title
  - **Trigger**: Change text in title field
  - **Result**: Updates document title
  - **Process**:
    - Title changes are captured
    - Updates UI to reflect new title
  - **State Changes**:
    - Updates document title
    - Updates page title

- **Action**: Change document category
  - **Trigger**: Select option in category dropdown
  - **Result**: Updates document category
  - **Process**:
    - Category changes are captured
    - Updates document metadata
  - **State Changes**:
    - Updates document category

- **Action**: Change document version
  - **Trigger**: Change text in version field
  - **Result**: Updates document version
  - **Process**:
    - Version changes are captured
    - Updates document metadata
  - **State Changes**:
    - Updates document version

#### 3. Document Operations

- **Action**: Save document
  - **Trigger**: Click "Save" button or `Ctrl+S` keyboard shortcut
  - **Result**: Persists document changes
  - **Process**:
    - Collects data from all editor fields
    - Validates required fields
    - Saves document to storage
    - Updates last modified timestamp
  - **State Changes**:
    - Updates document in storage
    - Updates document list
    - Shows success notification

- **Action**: Preview document
  - **Trigger**: Click "Preview" button or `Ctrl+P` keyboard shortcut
  - **Result**: Shows formatted preview of document
  - **Process**:
    - Opens new window with formatted content
    - Applies basic styling for preview
  - **State Changes**:
    - Opens preview window

- **Action**: Export document
  - **Trigger**: Click "Export" button
  - **Result**: Downloads document as file
  - **Process**:
    - Creates blob with document content
    - Initiates file download
  - **State Changes**:
    - Triggers file download

#### 4. Template Management

- **Action**: Load template
  - **Trigger**: Select template from template dropdown
  - **Result**: Loads template content into editor
  - **Process**:
    - Retrieves template data
    - Populates editor with template content
    - Updates metadata fields
  - **State Changes**:
    - Updates editor content
    - Resets current document (creates new)

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - Initializes layout: `LayoutManager.initializePage("documentEditor.html")`
  - Loads document list: `loadDocumentList()`
  - Loads document templates: `loadDocumentTemplates()`
  - Sets up auto-save: `setupAutoSave()`
  - Sets chat context: `updateChatContext("Document Management")`

#### 2. Auto-Save Functionality
- **Trigger**: Inactivity after content changes (5 seconds)
- **Process**:
  - Automatically saves document changes
  - Updates last modified timestamp
  - Provides background saving without interrupting user
  - Logs auto-save to console
  - Does not show visual notification to avoid disruption

### Data Persistence
- **Primary Storage**: Supabase Database
  - All document data is primarily stored in database tables
  - Document content may be stored as rich text or markdown format
  - Real-time synchronization ensures document consistency

- **Fallback Storage**: 
  - LocalStorage used only when offline or as temporary cache
  - Keys: `documents`, `documentTemplates`, `document_editor_state`
  - All local data syncs to database when connection is restored

- **Database Operations**:
  - **Document Editor Screen Load**:
    - **Operation**: SELECT documents, SELECT document templates
    - **Tables**: `documents`, `document_templates`, `document_categories`
    - **Description**: Retrieves document list and available templates
  
  - **Create New Document**:
    - **Operation**: INSERT document record
    - **Tables**: `documents`, `document_versions`
    - **Description**: Creates new document with initial version
  
  - **Open Document**:
    - **Operation**: SELECT document by ID, SELECT document versions
    - **Tables**: `documents`, `document_versions`, `document_content`
    - **Description**: Retrieves document data for editing
  
  - **Save Document**:
    - **Operation**: INSERT document version record, UPDATE document record
    - **Tables**: `documents`, `document_versions`, `document_content`
    - **Description**: Creates new version and updates document metadata
  
  - **Delete Document**:
    - **Operation**: UPDATE document status (soft delete) or DELETE document record
    - **Tables**: `documents`, `document_versions`
    - **Description**: Marks document as deleted or removes completely
  
  - **Load Template**:
    - **Operation**: SELECT template by ID
    - **Tables**: `document_templates`
    - **Description**: Retrieves template data for document creation

### AI Integration Points
- **Content Generation**:
  - AI-powered generation of document sections and content
  - Smart completion for standard compliance documentation
  - Template recommendations based on document purpose

- **Content Analysis**:
  - Intelligent review of document content for compliance gaps
  - Identification of outdated or inconsistent information
  - Suggestions for improvements and clarifications

- **Cross-Reference Assistance**:
  - Automatic detection of relevant standards and requirements
  - Suggestions for proper cross-referencing of related policies
  - Identification of potential conflicts with existing documents

- **Metadata Enhancement**:
  - Smart tagging and categorization recommendations
  - Version management suggestions based on content changes
  - Integration with compliance framework requirements

### Chat Interface Integration
- **Omnipresent Chat Access**:
  - Chat interface available via floating button on document editor screen
  - Context-aware assistance based on current document content and type

- **Chat-Triggered Actions**:
  - "Help me write this policy" - Provides guidance on document structure and content
  - "Check this document for compliance" - Analyzes document against relevant frameworks
  - "Create a document template" - Guides through template creation process
  - "Generate section for ISO control" - Creates specific content for compliance requirements