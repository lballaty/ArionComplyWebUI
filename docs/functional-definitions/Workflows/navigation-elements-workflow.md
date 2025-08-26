# Navigation Elements Workflow

## Components: `header`, `sidebar`, `breadcrumbs`, `global-navigation`

### Overview
The navigation elements of the ArionComply platform provide the primary means for users to move between different screens and access various functionalities. This includes the header with global controls, the sidebar for main navigation, breadcrumbs for context awareness, and other global navigation components. These elements are present across most screens and follow a consistent pattern managed by the LayoutManager system. The platform emphasizes flexibility in navigation, allowing users to move through the system via traditional UI elements, keyboard shortcuts, or natural language commands through the chat interface in both text and audio modes.

### Navigation Architecture

#### Layout Types
The platform supports four distinct layout types that determine which navigation elements are displayed:

1. **FULL_APP**: Complete UI with sidebar + header + main content (default for most application screens)
2. **HEADER_ONLY**: Header present, no sidebar (used for documentation and policy pages)
3. **STANDALONE**: No header/sidebar (used for authentication pages, splash screens)
4. **EMBEDDED**: Clean embedded view for iframes (used for embedded components)

#### Component Structure
The navigation elements are organized into the following structure:
```
<div class="app-container">
  <nav class="sidebar"> <!-- Managed by SidebarComponent --> </nav>
  <div class="sidebar-backdrop"> <!-- Mobile overlay --> </div>
  <main class="main-content">
    <header class="header"> <!-- Managed by LayoutManager --> </header>
    <div class="content"> <!-- Page-specific content --> </div>
  </main>
  <button class="chat-trigger"> <!-- Omnipresent chat button --> </button>
</div>
```

### User-Triggered Actions

#### 1. Header Navigation

- **Action**: Toggle sidebar
  - **Trigger**: Click hamburger menu button `onclick="toggleSidebar()"`
  - **Result**: Opens or closes the sidebar navigation
  - **Process**:
    - Calls `toggleSidebar()` which checks current state
    - Adds/removes `.open` class to `#sidebar`
    - Adds/removes `.active` class to `#sidebarBackdrop`
  - **State Changes**:
    - Updates sidebar visibility

- **Action**: Global search
  - **Trigger**: Type in global search box (`#globalSearch input`)
  - **Result**: Searches across the application
  - **Process**:
    - Captures input value when typing
    - Performs search for queries longer than 2 characters
    - Displays search results dropdown
  - **State Changes**:
    - Updates search results display

- **Action**: Natural language search
  - **Trigger**: Type natural language query in global search (e.g., "Show me high risk items")
  - **Result**: AI interprets query and displays relevant results
  - **Process**:
    - AI processes natural language to identify search intent
    - Translates to structured query parameters
    - Returns semantically relevant results
  - **State Changes**:
    - Displays intelligent search results

- **Action**: View notifications
  - **Trigger**: Click notification bell `onclick="showNotifications()"`
  - **Result**: Shows notification dropdown/panel
  - **Process**:
    - Calls `showNotifications()`
    - Fetches recent notifications
    - Displays notification dropdown
  - **State Changes**:
    - Updates notification panel visibility
    - May mark notifications as viewed

- **Action**: Access user menu
  - **Trigger**: Click user avatar/icon `onclick="showUserMenu()"`
  - **Result**: Displays user menu dropdown
  - **Process**:
    - Calls `showUserMenu()`
    - Displays user options dropdown
  - **State Changes**:
    - Updates user menu visibility

- **Action**: Use keyboard shortcut
  - **Trigger**: Keyboard combinations (e.g., Ctrl/Cmd+K)
  - **Result**: Activates corresponding feature
  - **Process**:
    - Keyboard event handler processes key combination
    - Calls appropriate function based on shortcut
  - **State Changes**:
    - Depends on the specific shortcut

#### 2. Sidebar Navigation

- **Action**: Navigate to screen
  - **Trigger**: Click sidebar menu item
  - **Result**: Navigates to selected screen
  - **Process**:
    - Browser navigates to href URL
    - New page is loaded with proper layout
  - **State Changes**:
    - Page change
    - Active menu item updates on new page

- **Action**: Toggle submenu
  - **Trigger**: Click menu item with submenu `data-toggle="submenu"`
  - **Result**: Expands/collapses submenu section
  - **Process**:
    - Prevents default link behavior
    - Toggles submenu visibility
    - Rotates chevron indicator
  - **State Changes**:
    - Submenu expansion state
    - Parent menu item active state

- **Action**: Use Alt+key shortcut
  - **Trigger**: Alt+key combination (e.g., Alt+D for Dashboard)
  - **Result**: Navigates directly to the corresponding page
  - **Process**:
    - Keyboard event handler detects Alt+key
    - Matches to menu item shortcuts
    - Navigates to associated URL
  - **State Changes**:
    - Page navigation

- **Action**: Close sidebar (mobile)
  - **Trigger**: Click backdrop overlay or swipe gesture
  - **Result**: Closes sidebar on mobile devices
  - **Process**:
    - Calls `closeSidebar()`
    - Removes `.open` class from sidebar
    - Removes `.active` class from backdrop
  - **State Changes**:
    - Sidebar visibility state

#### 3. Breadcrumb Navigation

- **Action**: Navigate via breadcrumb
  - **Trigger**: Click breadcrumb segment
  - **Result**: Navigates to the selected level
  - **Process**:
    - Browser navigates to associated URL
  - **State Changes**:
    - Page navigation

- **Action**: View current location
  - **Trigger**: Viewing breadcrumb display
  - **Result**: User understands current location in navigation hierarchy
  - **Process**:
    - Displays "ArionComply > [Section] > [Page]" format
  - **State Changes**:
    - No state change (display only)

#### 4. Omnipresent Chat Access

- **Action**: Toggle chat interface
  - **Trigger**: Click floating chat button `onclick="toggleChat()"`
  - **Result**: Opens or closes the chat popup
  - **Process**:
    - Calls `toggleChat()`
    - Toggles `.active` class on `#chatPopup`
    - Loads chat iframe with context parameter
  - **State Changes**:
    - Chat popup visibility
    - Updates chat context based on current screen

#### 5. Natural Language Navigation via Chat

- **Action**: Navigate using text commands
  - **Trigger**: Type navigation request in chat (e.g., "Go to the dashboard" or "Take me to risk assessment")
  - **Result**: AI understands intent and navigates to requested screen
  - **Process**:
    - AI processes natural language to identify navigation intent
    - Extracts target destination from request
    - Maps informal language to formal screen destinations
    - Executes navigation to appropriate URL
  - **State Changes**:
    - Page navigation
    - Chat interaction history updated

- **Action**: Navigate using slash commands
  - **Trigger**: Type slash command in chat (e.g., "/dashboard" or "/risk" or "/settings")
  - **Result**: System instantly navigates to the specified screen
  - **Process**:
    - Chat interface recognizes slash command syntax
    - Parses command to identify target screen
    - Auto-completes options as user types for discoverability
    - Maps shortened command to full screen URL
    - Executes navigation immediately
  - **State Changes**:
    - Immediate page navigation
    - Command added to navigation history
    - Recent commands cached for auto-suggestion

- **Action**: Navigate using fuzzy matching
  - **Trigger**: Type partial screen name with slash (e.g., "/dash" for dashboard or "/wiz" for wizard)
  - **Result**: System intelligently matches partial input to appropriate screen
  - **Process**:
    - Performs fuzzy matching against available screens
    - Shows potential matches if ambiguous
    - Navigates directly if confidence is high
    - Learns from user selection patterns
  - **State Changes**:
    - Page navigation
    - Learning algorithm updates user preferences

- **Action**: Navigate using voice commands
  - **Trigger**: Click microphone button and speak navigation request
  - **Result**: Voice command is processed and system navigates to requested screen
  - **Process**:
    - Voice input is captured and converted to text
    - Text is processed to identify navigation intent
    - Navigation is executed to appropriate destination
    - Audio confirmation provided if audio mode enabled
  - **State Changes**:
    - Page navigation
    - Chat interaction history updated
    - Audio mode state maintained

- **Action**: Request specific functionality
  - **Trigger**: Ask for feature by function rather than location (e.g., "I need to create a new risk assessment")
  - **Result**: AI understands functional intent and navigates to appropriate tool
  - **Process**:
    - AI identifies functional intent rather than explicit navigation
    - Maps function to appropriate tool/screen
    - May ask clarifying questions if intent is ambiguous
    - Navigates to appropriate location with context parameters if needed
  - **State Changes**:
    - Page navigation with appropriate parameters
    - Chat interaction history updated with functional context

- **Action**: Context-aware navigation assistance
  - **Trigger**: Ask about related functionality or next steps
  - **Result**: AI suggests relevant navigation options based on current context
  - **Process**:
    - AI analyzes current screen context and user history
    - Identifies relevant next actions or related screens
    - Offers navigation suggestions with explanations
    - Provides direct navigation links in chat response
  - **State Changes**:
    - Potential page navigation if suggestion is accepted
    - Enhanced user understanding of navigation options

### System-Triggered Actions

#### 1. Layout Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - `LayoutManager.initializePage(currentPage)` is called
  - Determines appropriate layout type based on:
    - URL parameters (?embed=1, ?standalone=1)
    - PAGE_LAYOUTS configuration in navigation-config.js
    - iframe detection (window !== window.top)
  - Calls appropriate setup function:
    - `setupStandaloneLayout()`
    - `setupHeaderOnlyLayout(currentPage)`
    - `setupFullAppLayout(currentPage)`
    - `setupEmbeddedLayout(currentPage)`
  - For full app layout:
    - Injects header via `injectHeader(currentPage)`
    - Injects sidebar via `SidebarComponent.injectSidebar(currentPage)`
  - Sets up event listeners and keyboard shortcuts

#### 2. Responsive Layout Adjustment
- **Trigger**: Window resize event
- **Process**:
  - Checks window width
  - For mobile (width <= 768px):
    - Auto-closes sidebar if open
    - Adjusts header elements for compact display
  - For small mobile (width <= 480px):
    - Adjusts chat popup size and position
  - Updates layout elements for current screen size

#### 3. Session Validation
- **Trigger**: During layout initialization
- **Process**:
  - Checks for active user session in localStorage
  - For public pages (index.html, login.html, etc.):
    - Allows access without session
  - For application pages:
    - If no session exists, creates demo session
    - Stores user data with default role (admin)
  - Initializes user context for layout and navigation

#### 4. Navigation State Updates
- **Trigger**: After page load and navigation
- **Process**:
  - Updates active state in sidebar based on current URL
  - Generates breadcrumb based on navigation structure
  - Updates page title and metadata

### Error Handling
- **Missing Configuration**: Falls back to default layout if PAGE_LAYOUTS entry missing
- **Layout Injection Failures**: Graceful fallbacks for missing DOM elements
- **Invalid User Role**: Defaults to 'admin' role if role not found or invalid
- **Navigation Errors**: Error logging and fallback to dashboard navigation
- **Missing Dependencies**: Checks for required components and creates fallbacks if needed

### Data Persistence
- **Primary Storage**: Supabase Database
  - User sessions and roles stored in database
  - Navigation preferences and recent pages stored for each user
  - Slash command history and preferences stored per user

- **Fallback Storage**: 
  - LocalStorage used for session management and user data
  - Keys: `arioncomply_session`, `arioncomply_user`, `sidebar_state`, `slash_command_history`
  - Temporary navigation preferences stored locally

- **Database Operations**:
  - **Login/Session Start**:
    - **Operation**: SELECT user profile, UPDATE session log
    - **Tables**: `users`, `sessions`, `user_roles`
    - **Description**: Retrieves user data and role permissions for navigation
  
  - **Navigation Analytics**:
    - **Operation**: INSERT navigation event
    - **Tables**: `user_activity`, `page_views`
    - **Description**: Tracks navigation patterns and screen usage

### AI Integration Points
- **Context-Aware Assistance**: Chat interface receives current screen context
- **Navigation Suggestions**: AI suggests relevant screens based on user activity
- **Search Enhancement**: AI-powered global search with natural language understanding
- **Permission-Aware Navigation**: Intelligently shows/hides navigation options based on permissions
- **User Journey Optimization**: AI analyzes navigation patterns to suggest workflow improvements
- **Natural Language Navigation**: Enables navigation through conversational commands in text or voice
- **Intent Recognition**: Understands navigation intent even when expressed indirectly
- **Multimodal Interaction**: Supports both text and voice inputs for navigation commands
- **Contextual Response**: Provides audio or text responses based on user's chosen interaction mode
- **Navigation Shortcuts**: Creates shortcuts to frequently accessed screens through conversation
- **Task-Based Navigation**: Takes users to the right screen based on what they want to accomplish rather than requiring knowledge of the UI structure
- **Slash Command System**: Provides direct navigation through /slash commands with auto-completion
- **Command Learning**: Adapts to user's navigation patterns to improve shortcut suggestions
- **Fuzzy Matching**: Intelligently maps partial inputs to appropriate navigation targets

### Role-Based Navigation Control
The navigation system implements role-based access control for menu items:

- **Administrator**:
  - Full access to all navigation items and sections
  - Can access system configuration options
  - Can view admin-only sections like user management

- **Manager**:
  - Access to most sections except system configuration
  - Limited access to certain admin functions
  - No access to prototype or development sections

- **Auditor**:
  - Focused access to compliance-related sections
  - Read-only access to dashboards and reports
  - Limited sidebar navigation options

- **Standard User**:
  - Basic access to assigned workflows and tasks
  - Restricted navigation based on permissions
  - Simplified sidebar with fewer options

### Integration Dependencies
- **Navigation Configuration**: navigation-config.js defines menu structure and page layouts
- **Sidebar Component**: sidebar-component.js manages sidebar generation and interaction
- **Layout Manager**: layout-manager.js orchestrates the overall navigation structure
- **User Management**: User roles and permissions affect available navigation options
- **Notification Center**: Integrates with notification count and display in header
