# Report Builder Screen Workflow

## Screen: `reportBuilder.html`

### Overview
The Report Builder provides a powerful interface for creating compliance reports and analytics. It allows users to select templates, configure data sources, customize report content, and generate reports in various formats. The builder supports a modular approach to report creation with customizable sections and export options.

### User-Triggered Actions

#### 1. Template Management

- **Action**: Select report template
  - **Trigger**: Click on template item `onclick="selectTemplate(this, 'templateId')"`
  - **Result**: Selects template for report generation
  - **Process**:
    - Updates selected template UI state
    - Sets selectedTemplate variable
    - Shows notification about selected template
  - **State Changes**:
    - Updates selected template in UI
    - Sets selectedTemplate variable

- **Action**: Load template
  - **Trigger**: Click "Load Template" button `onclick="loadTemplate()"`
  - **Result**: Loads template configuration into builder
  - **Process**:
    - Loads template data based on selectedTemplate
    - Populates report sections and configuration
    - Sets up data sources and filters
  - **State Changes**:
    - Updates report builder interface with template data
    - Shows notification

#### 2. Data Source Configuration

- **Action**: Toggle data source
  - **Trigger**: Click checkbox on data source item
  - **Result**: Includes/excludes data source from report
  - **Process**:
    - Updates data source inclusion state
    - May trigger data loading or refresh
  - **State Changes**:
    - Updates data source selection state

- **Action**: Configure framework filter
  - **Trigger**: Select option in framework dropdown
  - **Result**: Filters report data by compliance framework
  - **Process**:
    - Updates filter criteria
    - May trigger data refresh or visualization updates
  - **State Changes**:
    - Updates filter state

- **Action**: Configure risk level filter
  - **Trigger**: Select option in risk level dropdown
  - **Result**: Filters report data by risk level
  - **Process**:
    - Updates filter criteria
    - May trigger data refresh or visualization updates
  - **State Changes**:
    - Updates filter state

- **Action**: Set date range
  - **Trigger**: Select dates in date range inputs
  - **Result**: Filters report data by date range
  - **Process**:
    - Updates date range filter criteria
    - May trigger data refresh or visualization updates
  - **State Changes**:
    - Updates date filter state

#### 3. Report Content Management

- **Action**: Edit report title
  - **Trigger**: Change text in report title input
  - **Result**: Updates report title
  - **Process**:
    - Captures title text changes
    - Updates report metadata
  - **State Changes**:
    - Updates report title

- **Action**: Edit section title
  - **Trigger**: Change text in section title input
  - **Result**: Updates section title
  - **Process**:
    - Captures section title changes
    - Updates section metadata
  - **State Changes**:
    - Updates section title

- **Action**: Move section up
  - **Trigger**: Click up arrow button `onclick="moveSection(this, 'up')"`
  - **Result**: Moves section up in report structure
  - **Process**:
    - Finds previous sibling element
    - Repositions section before previous sibling
  - **State Changes**:
    - Updates section order in DOM
    - Shows notification

- **Action**: Move section down
  - **Trigger**: Click down arrow button `onclick="moveSection(this, 'down')"`
  - **Result**: Moves section down in report structure
  - **Process**:
    - Finds next sibling element
    - Repositions section after next sibling
  - **State Changes**:
    - Updates section order in DOM
    - Shows notification

- **Action**: Edit section
  - **Trigger**: Click edit button `onclick="editSection(this)"`
  - **Result**: Opens section editor
  - **Process**:
    - Opens editing interface for section content
    - Allows detailed configuration of section elements
  - **State Changes**:
    - Shows section editor interface
    - Shows notification

- **Action**: Delete section
  - **Trigger**: Click delete button `onclick="deleteSection(this)"`
  - **Result**: Removes section from report
  - **Process**:
    - Confirms deletion with user
    - Removes section from DOM
  - **State Changes**:
    - Removes section from report structure
    - Shows notification

- **Action**: Configure chart
  - **Trigger**: Click configure button `onclick="configureChart(this)"`
  - **Result**: Opens chart configuration interface
  - **Process**:
    - Opens chart settings interface
    - Allows customization of chart properties
  - **State Changes**:
    - Shows chart configuration interface
    - Shows notification

- **Action**: Add section
  - **Trigger**: Click "Add Section" button, then select type from menu
  - **Result**: Adds new section to report
  - **Process**:
    - Shows section type menu
    - Creates new section based on selected type
    - Adds section to report structure
  - **State Changes**:
    - Adds new section to report
    - Updates section menu visibility

#### 4. Report Generation and Export

- **Action**: Preview report
  - **Trigger**: Click "Preview" button `onclick="previewReport()"`
  - **Result**: Generates preview of report
  - **Process**:
    - Compiles report data and structure
    - Renders preview version of report
    - May open in new window or modal
  - **State Changes**:
    - Shows preview interface
    - Shows notification

- **Action**: Generate report
  - **Trigger**: Click "Generate Report" button `onclick="generateReport()"`
  - **Result**: Creates final report
  - **Process**:
    - Compiles all report sections and data
    - Processes data sources and filters
    - Creates final report output
    - Shows success notification after completion
  - **State Changes**:
    - Completes report generation
    - May update report status
    - Shows notification

- **Action**: Export report
  - **Trigger**: Click format option in export menu `onclick="exportReport('format')"`
  - **Result**: Exports report in selected format
  - **Process**:
    - Prepares report data for selected format
    - Creates appropriate file type (PDF, Excel, Word, PowerPoint)
    - Initiates download
  - **State Changes**:
    - Triggers file download process

- **Action**: Save report
  - **Trigger**: Click "Save" button `onclick="saveReport()"`
  - **Result**: Saves report configuration for later use
  - **Process**:
    - Collects all report configuration and content
    - Saves to storage
  - **State Changes**:
    - Persists report configuration
    - Shows notification

- **Action**: Share report
  - **Trigger**: Click "Share" button `onclick="shareReport()"`
  - **Result**: Opens sharing options for report
  - **Process**:
    - Opens sharing interface with various options
    - Prepares report for sharing
  - **State Changes**:
    - Shows sharing interface
    - Shows notification

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - Initializes layout: `LayoutManager.initializePage("reportBuilder.html")`
  - Sets up report builder interface
  - Sets chat context: `updateChatContext("Report Builder")`
  - Sets breadcrumb: `updateBreadcrumb("Reports > Report Builder")`
  - May load default template

#### 2. Template Loading
- **Trigger**: Template selection or load template action
- **Process**:
  - Loads template configuration and structure
  - Sets up report sections based on template
  - Configures data sources and filters

### Data Persistence
- **Primary Storage**: Supabase Database
  - All report configurations and templates are primarily stored in database tables
  - Generated reports may be stored as files or structured content
  - Real-time synchronization ensures consistency during collaborative editing

- **Fallback Storage**: 
  - LocalStorage used only when offline or as temporary cache
  - Keys: `report_templates`, `report_builder_state`, `saved_reports`
  - All local data syncs to database when connection is restored

- **Database Operations**:
  - **Report Builder Screen Load**:
    - **Operation**: SELECT report templates, SELECT data sources
    - **Tables**: `report_templates`, `data_sources`, `report_sections`
    - **Description**: Retrieves available templates and data source configurations
  
  - **Load Template**:
    - **Operation**: SELECT template by ID with sections
    - **Tables**: `report_templates`, `report_sections`, `report_section_types`
    - **Description**: Retrieves complete template structure for building
  
  - **Save Report**:
    - **Operation**: INSERT/UPDATE report record, INSERT/UPDATE report sections
    - **Tables**: `reports`, `report_sections`, `report_configurations`
    - **Description**: Saves report configuration and structure
  
  - **Generate Report**:
    - **Operation**: SELECT data from various sources, INSERT report result
    - **Tables**: Multiple data source tables, `reports`, `report_results`
    - **Description**: Retrieves data from configured sources and creates report result
  
  - **Export Report**:
    - **Operation**: SELECT report result, UPDATE export count
    - **Tables**: `reports`, `report_results`, `report_exports`
    - **Description**: Retrieves report data for export and logs export activity

### AI Integration Points
- **Report Structure Recommendations**:
  - AI-powered suggestions for report structure and content
  - Intelligent organization of sections based on audience and purpose
  - Smart filtering recommendations for relevant data

- **Data Visualization Assistance**:
  - Automatic chart type selection based on data characteristics
  - Smart data aggregation and presentation recommendations
  - Suggestions for effective visualization techniques

- **Content Generation**:
  - Automatic generation of executive summaries
  - Creation of analysis and interpretation sections
  - Development of recommendations based on report findings

- **Contextual Insights**:
  - Intelligent analysis of compliance data trends
  - Identification of key insights and potential issues
  - Suggestions for addressing compliance gaps

### Chat Interface Integration
- **Omnipresent Chat Access**:
  - Chat interface available via floating button on report builder screen
  - Context-aware assistance based on current report template and content

- **Chat-Triggered Actions**:
  - "Recommend report structure" - Provides suggestions for effective organization
  - "Generate executive summary" - Creates summary content based on report data
  - "Explain this chart" - Provides interpretation of data visualizations
  - "Suggest data sources" - Recommends relevant data for report content