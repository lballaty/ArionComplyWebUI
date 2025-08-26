# Dashboard Screen Workflow

## Screen: `dashboard.html`

### Overview
The dashboard serves as the primary landing page for authenticated users, providing a comprehensive compliance overview with KPIs, risk visualization, and activity monitoring. It targets executives, compliance officers, and risk managers. The dashboard is designed to be configurable and dynamic based on customer choices or subscriptions, supporting multiple compliance standards, regulations, and laws.

### User-Triggered Actions

#### 1. Primary Action Buttons
- **Action**: Click "Start Compliance Assessment" button (or similar general-purpose label)
  - **Trigger**: `onclick="location.href='wizzard.html'"`
  - **Result**: Navigates to the multi-standard compliance assessment wizard
  - **State Changes**: Page navigation to wizzard.html (where user can select from multiple compliance frameworks)

- **Action**: Click "Create Risk" button
  - **Trigger**: `onclick="location.href='listView.html'"`
  - **Result**: Navigates to risk management interface
  - **State Changes**: Page navigation to listView.html

#### 2. Risk Heat Map Interactions
- **Action**: Click on risk cell in the heat map
  - **Trigger**: `onclick="showRiskDetails('RISK-ID')"` (38 different risk cells)
  - **Result**: Displays detailed information about the selected risk
  - **State Changes**: Shows notification or modal with risk details
  - **Examples**:
    - R-001: Unauthorized Data Access (Critical/High)
    - R-002: Cloud Infrastructure Vulnerability (High/High)
    - R-003: GDPR Documentation Gap (Very High/Medium)
    - R-007: Ransomware Attack Vulnerability (Very High/High)
    - R-012: Major Data Center Outage (High/Low)
    - R-015: Executive Email Compromise (Medium/Very High)
    - *Note: Risk examples should be framework-agnostic where possible, or dynamically displayed based on active compliance frameworks*

- **Action**: Hover over risk cell in heat map
  - **Trigger**: Mouse hover on `.risk-cell` elements
  - **Result**: Displays tooltip with risk summary information
  - **State Changes**: Shows tooltip overlay

#### 3. Donut Chart Interactions
- **Action**: Mouse enter donut segment
  - **Trigger**: `mouseenter` event on `.donut-segment`
  - **Result**: Highlights segment by increasing stroke width
  - **State Changes**: Changes segment styling (`strokeWidth` from 30 to 35)

- **Action**: Mouse leave donut segment
  - **Trigger**: `mouseleave` event on `.donut-segment`
  - **Result**: Returns segment to normal size
  - **State Changes**: Reverts segment styling (`strokeWidth` back to 30)

- **Action**: Click on donut segment
  - **Trigger**: Click event on `.donut-segment`
  - **Result**: Shows notification with risk type information
  - **State Changes**: Displays notification popup with risk type details

#### 4. Bar Chart Interactions
- **Action**: Click on bar in chart
  - **Trigger**: Click event on `.bar-value`
  - **Result**: Shows notification with bar label details
  - **State Changes**: Displays notification popup with related details

#### 5. Trend Line Interactions
- **Action**: Click on trend point
  - **Trigger**: Click event on `.trend-points`
  - **Result**: Shows notification with point coordinates
  - **State Changes**: Displays notification popup with data point details

#### 6. Metric Checkbox Interactions
- **Action**: Toggle metric checkbox
  - **Trigger**: `change` event on `.metric-checkbox`
  - **Result**: Shows notification about metric visibility toggled
  - **State Changes**: Displays notification and potentially updates chart visibility

#### 7. AI Chat Integration
- **Action**: Click chat trigger button
  - **Trigger**: `onclick="toggleChat()"`
  - **Result**: Opens AI assistant chat popup
  - **State Changes**: 
    - Toggles visibility of chat popup 
    - Loads chat interface in iframe with dashboard context

- **Action**: Close chat popup
  - **Trigger**: `onclick="toggleChat()"`
  - **Result**: Closes AI assistant chat popup
  - **State Changes**: Hides chat popup

#### 8. Navigation via Sidebar
- **Action**: Click sidebar menu items
  - **Trigger**: Click on sidebar navigation links
  - **Result**: Navigates to selected page
  - **State Changes**: Page navigation to selected destination

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - Initializes layout system: `LayoutManager.initializePage('dashboard.html')`
  - Applies full-app layout with sidebar and header
  - Sets AI chat context: `updateChatContext('Dashboard Overview')`
  - Displays static demo data in KPI cards, risk heat map, and activity timeline

#### 2. KPI Card Display
- **Trigger**: Page load
- **Process**: Displays key performance indicators (configurable based on selected standards/frameworks):
  - Compliance Score: 95% (green/success indicator)
  - Open Risks: 12 (orange/warning indicator)
  - Active Assessments: 8 (blue/primary indicator) - *Note: Generic term instead of "AI Systems"*
  - Overdue Actions: 3 (red/danger indicator)

#### 3. Risk Heat Map Visualization
- **Trigger**: Page load
- **Process**: 
  - Renders 5x5 grid showing Likelihood vs Impact
  - Populates 38 risk cells according to predefined positions
  - Applies color coding based on risk severity
  - Sets up tooltips for each risk cell

#### 4. Recent Activity Timeline
- **Trigger**: Page load
- **Process**:
  - Displays recent compliance and system activities
  - Shows activity items with title, detail, and timestamp

### Error Handling
- **Condition**: Missing dependency files
- **Result**: May result in layout or functionality issues
- **Mitigation**: Required dependency files are loaded in the correct order

### Data Persistence
- **Primary Storage**: Supabase Database
  - All dashboard data is primarily stored in database tables
  - Real-time synchronization ensures metrics and risk data consistency

- **Fallback Storage**: 
  - LocalStorage used only when offline or as temporary cache
  - Keys: `dashboard_preferences`, `dashboard_filters`
  - All local data syncs to database when connection is restored

- **Database Operations**:
  - **Dashboard Initialization**:
    - **Operation**: SELECT dashboard data, risk metrics, activities
    - **Tables**: `risks`, `compliance_metrics`, `activities`, `tasks`
    - **Description**: Retrieves current metrics, risk data, and recent activities for display
  
  - **Risk Cell Click**:
    - **Operation**: SELECT risk details
    - **Tables**: `risks`, `risk_details`, `risk_history`
    - **Description**: Retrieves detailed information about the selected risk
  
  - **Start Compliance Assessment**:
    - **Operation**: INSERT assessment session
    - **Tables**: `assessments`, `assessment_sessions`
    - **Description**: Creates new assessment record when user navigates to assessment wizard
  
  - **Create Risk**:
    - **Operation**: No immediate database operation (navigates to creation screen)
    - **Tables**: N/A
    - **Description**: Navigation only, database operations occur on list view

### AI Integration Points
- **Risk Analysis and Clustering**:
  - AI-powered analysis of risk patterns and relationships
  - Automatic clustering of related risks for more effective management

- **Metrics Interpretation**:
  - Intelligent insights on compliance metrics and trends
  - Predictive analytics for future compliance status

- **Activity Prioritization**:
  - Smart prioritization of recent activities based on urgency and impact
  - Personalized activity recommendations based on user role and focus

### Chat Interface Integration
- **Omnipresent Chat Access**:
  - Chat interface available via floating button on dashboard
  - Context-aware assistance based on visible dashboard elements

- **Chat-Triggered Actions**:
  - "Explain this risk" - Provides detailed analysis of selected risk
  - "Start compliance assessment" - Initiates framework selection
  - "Summarize recent activities" - Provides condensed activity report

### Integration Dependencies
- **Required files**: 
  - navigation-config.js: Navigation structure
  - sidebar-component.js: Sidebar implementation
  - layout-manager.js: Page layout management
  - scripts.js: General utilities
  - mystyles.css: Styling and CSS variables
