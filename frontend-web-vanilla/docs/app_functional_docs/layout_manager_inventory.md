# ✅ layout-manager.js – UI Foundation & Layout System Inventory

**Purpose**: Central UI layout management system controlling page structure, headers, sidebars, and responsive behavior  
**Type**: Class-based system with global utility functions  
**Dependencies**: Requires navigation-config.js, optional sidebar-component.js  
**Critical Role**: Controls entire UI structure for all pages based on layout type

---

## 🔁 Automated Behaviors (on load or initialization)

### 🏗️ Layout Initialization Process

```yaml
- LayoutManager.initializePage(currentPage, options):
    trigger: called by scripts.js or individual pages
    process:
      1. determine layout type via getLayoutType()
      2. remove existing layout classes from document.body
      3. add new layout class: layout-standalone, layout-header-only, layout-full-app, layout-embedded
      4. apply layout-specific setup (header injection, sidebar management)
      5. setup common features (keyboard shortcuts, responsive handling, user session)

    layout_determination_priority:
      1. URL parameters (?embed=1, ?standalone=1, ?header-only=1)
      2. options.layout parameter override
      3. iframe detection (auto-embedded if window !== window.top)
      4. session check (standalone for logged-out public pages)
      5. PAGE_LAYOUTS configuration from navigation-config.js

- DOMContentLoaded_behaviors:
    auto_setup:
      - LayoutManager.setupResponsiveHandling() → window resize listener
      - LayoutManager.setupGlobalKeyboardShortcuts() → document keydown listener
    prevents: duplicate event listeners by removing existing before adding new
```

### 📐 Layout Type Implementations

```yaml
- setupStandaloneLayout():
    purpose: authentication pages, splash screens
    actions:
      - removes #sidebar, #sidebarBackdrop, .header elements
      - sets main-content marginLeft: 0, width: 100%

- setupHeaderOnlyLayout():
    purpose: help pages, documentation
    actions:
      - injects header via injectHeader()
      - removes sidebar elements
      - sets main-content marginLeft: 0

- setupFullAppLayout():
    purpose: main application pages
    actions:
      - injects header via injectHeader()
      - calls SidebarComponent.injectSidebar() if available
      - maintains default CSS margins for sidebar space

- setupEmbeddedLayout():
    purpose: iframe embedding in external applications
    actions:
      - removes all navigation elements
      - adds 'embedded-mode' class to document.body
      - sets content padding: 1rem, margin: 0
```

---

## 🧑‍💻 User-Triggered Actions

### 🍔 Sidebar Control Functions

```yaml
- toggleSidebar():
    trigger: onclick from hamburger menu button in header
    behavior:
      - checks #sidebar .open class state
      - calls openSidebar() or closeSidebar() accordingly

- openSidebar():
    actions:
      - adds .open class to #sidebar
      - adds .active class to #sidebarBackdrop
      - logs "Sidebar opened"

- closeSidebar():
    actions:
      - removes .open class from #sidebar
      - removes .active class from #sidebarBackdrop
      - logs "Sidebar closed"
    triggers:
      - direct function call
      - Escape key press
      - window resize below 768px (mobile)
```

### ⌨️ Global Keyboard Shortcuts

```yaml
- Ctrl/Cmd + K:
    action: focuses and selects global search input (#globalSearch)
    prevents: default browser behavior

- Ctrl/Cmd + H:
    action: navigates to routing.html (AppCenter)
    prevents: default browser behavior

- Escape key:
    actions:
      - closes active modals (.modal.active)
      - calls closeSidebar() if available
      - closes chat popup if open (#chatPopup.active)
```

### 🔍 Header Interaction Functions

```yaml
- globalSearch input:
    trigger: 'input' event on #globalSearch
    behavior:
      - logs search query
      - triggers search for queries > 2 characters
      - clears on Escape key press

- showNotifications():
    trigger: onclick from notification button
    fallback: shows "Notifications feature coming soon" if not implemented

- showUserMenu():
    trigger: onclick from user menu button
    fallback: shows "User menu feature coming soon" if not implemented

- updateBreadcrumb(breadcrumbText):
    trigger: called by other functions to update navigation context
    target: #breadcrumb-text element
```

---

## 🏗️ Layout System Core Components

### 📋 Header Generation & Management

```yaml
- injectHeader(currentPage):
    conditions:
      - only injects if .header doesn't already exist
      - calls updateHeaderContent() if header exists
    injection_targets:
      1. .main-content (preferred)
      2. .app-container (fallback)
      3. document.body (last resort)

- generateHeaderHTML(currentPage):
    structure:
      header.header:
        - .header-left:
            - .menu-toggle button (hamburger menu)
            - .breadcrumb > #breadcrumb-text
        - .header-actions:
            - .search-bar > #globalSearch input
            - .notification-btn > #notificationCount badge
            - .user-menu button

- generateBreadcrumb(currentPage):
    priority:
      1. finds page in NAVIGATION_ITEMS from navigation-config.js
      2. fallback hardcoded breadcrumbs for common pages
      3. default: "ArionComply"
    format: "ArionComply > [Page Name]"
```

### 🔄 Responsive & Session Management

```yaml
- setupResponsiveHandling():
    window_resize_behaviors:
      - auto-closes sidebar when width <= 768px (mobile)
      - adjusts chat popup size when width <= 480px
    prevents: duplicate listeners by removing existing before adding

- initializeUserSession():
    session_check:
      - validates localStorage['arioncomply_session'] === 'active'
      - validates localStorage['arioncomply_user'] exists
    demo_fallback:
      - creates default demo session if none exists
      - only for non-standalone, non-embedded layouts
      - skips for public pages: index.html, help.html
    demo_user_data:
      id: "demo_user"
      name: "Demo User"
      role: "admin"
      email: "demo@arioncomply.com"
```

---

## 🔗 Integration Dependencies

### 📤 Required from navigation-config.js

```yaml
- LAYOUT_TYPES constants:
    - LAYOUT_TYPES.STANDALONE
    - LAYOUT_TYPES.HEADER_ONLY
    - LAYOUT_TYPES.FULL_APP
    - LAYOUT_TYPES.EMBEDDED

- PAGE_LAYOUTS object:
    maps: filename → layout type
    example: 'dashboard.html' → LAYOUT_TYPES.FULL_APP

- NAVIGATION_ITEMS array:
    used_by: generateBreadcrumb() to find page titles
    fallback: hardcoded breadcrumbs if NAVIGATION_ITEMS unavailable
```

### 📥 Optional Integrations

```yaml
- SidebarComponent.injectSidebar():
    condition: if typeof SidebarComponent !== 'undefined'
    fallback: warns "SidebarComponent not available" if missing
    purpose: injects sidebar for FULL_APP layout

- Global functions from scripts.js:
    - showNotification(): for user feedback
    - toggleChat(): for Escape key handling
    functions: created as fallbacks if not available
```

### 🔧 Utility Dependencies

```yaml
- localStorage keys:
    - "arioncomply_session": session validity check
    - "arioncomply_user": user data for session management

- URL parameters:
    - ?embed=1 → forces EMBEDDED layout
    - ?standalone=1 → forces STANDALONE layout
    - ?header-only=1 → forces HEADER_ONLY layout

- Window context:
    - window !== window.top → auto-detects iframe embedding
```

---

## 📤 Global Exports & Functions

### 🌐 Window Object Exports

```yaml
# Class Export ⭐ CRITICAL
- window.LayoutManager: complete LayoutManager class

# Global Control Functions ⭐ REQUIRED by onclick handlers
- window.toggleSidebar: hamburger menu functionality
- window.openSidebar: programmatic sidebar opening
- window.closeSidebar: programmatic sidebar closing
- window.updateBreadcrumb: navigation context updates

# Auto-created Functions (if not available)
- window.showNotifications: notification panel (fallback)
- window.showUserMenu: user menu dropdown (fallback)
```

### 🏷️ LayoutManager Static Methods

```yaml
# Core Layout Functions
- LayoutManager.initializePage(currentPage, options) ⭐ CRITICAL
- LayoutManager.getLayoutType(currentPage, options)
- LayoutManager.switchLayout(newLayoutType)
- LayoutManager.getLayoutInfo() → returns current layout state

# Layout Setup Functions
- LayoutManager.setupStandaloneLayout()
- LayoutManager.setupHeaderOnlyLayout(currentPage)
- LayoutManager.setupFullAppLayout(currentPage)
- LayoutManager.setupEmbeddedLayout(currentPage)

# Component Management
- LayoutManager.injectHeader(currentPage)
- LayoutManager.generateHeaderHTML(currentPage)
- LayoutManager.updateHeaderContent(currentPage)
- LayoutManager.generateBreadcrumb(currentPage)

# Feature Setup
- LayoutManager.setupCommonFeatures()
- LayoutManager.setupGlobalKeyboardShortcuts()
- LayoutManager.setupResponsiveHandling()
- LayoutManager.initializeUserSession()

# Utilities
- LayoutManager.removeIfExists(selector)
```

---

## 🎯 Critical Integration Points

### 🔄 Called BY (Consumers)

```yaml
- scripts.js:
    function: initializePageLayout() calls LayoutManager.initializePage()
    fallback: makeChatDraggable() if LayoutManager not available

- Individual HTML pages:
    usage: can call LayoutManager.initializePage() directly
    options: can override layout type via options parameter

- Header onclick handlers:
    requires: toggleSidebar(), showNotifications(), showUserMenu()
```

### 📞 Calls TO (Dependencies)

```yaml
- navigation-config.js:
    uses: LAYOUT_TYPES, PAGE_LAYOUTS, NAVIGATION_ITEMS
    required: must be loaded before layout-manager.js

- sidebar-component.js:
    calls: SidebarComponent.injectSidebar() if available
    optional: graceful fallback if not loaded

- scripts.js functions:
    calls: showNotification(), toggleChat() if available
    optional: creates fallback functions if missing
```

---

## 🧪 Critical Testing Scenarios

### 🎯 High Priority Layout Tests

```yaml
1. Layout Type Determination:
  - URL parameters override (?embed=1, ?standalone=1)
  - iframe detection (window !== window.top)
  - session-based routing (logged out → standalone for public pages)
  - PAGE_LAYOUTS configuration mapping

2. Header Injection:
  - header injection into different container types
  - breadcrumb generation with/without NAVIGATION_ITEMS
  - header event listener setup and functionality
  - global search input behavior

3. Sidebar Integration:
  - SidebarComponent integration (when available)
  - sidebar toggle functionality (open/close states)
  - responsive behavior (auto-close on mobile)
  - backdrop interaction

4. Session Management:
  - demo session creation for non-authenticated users
  - public page access without session
  - session validation and fallback behavior
```

### ⚠️ Integration Dependency Tests

```yaml
- Must test WITH navigation-config.js loaded (layout types, page mappings)
- Must test WITH and WITHOUT sidebar-component.js (graceful fallback)
- Must test WITH and WITHOUT scripts.js functions (fallback creation)
- Must test URL parameter overrides (?embed=1, etc.)
- Must test iframe embedding detection
- Must test responsive breakpoints (768px, 480px)
- Must test keyboard shortcuts (Ctrl+K, Ctrl+H, Escape)
```

### 🔍 Edge Cases & Error Handling

```yaml
- Missing DOM elements (#sidebar, .main-content, etc.)
- Invalid layout type parameters
- Missing navigation-config.js constants
- Multiple initialization calls (prevent duplicate listeners)
- Window resize handling during layout switches
- Session validation with corrupted localStorage data
```

---

## 📋 Layout State Management

### 🏷️ CSS Classes Applied to document.body

```yaml
- layout-standalone: no header, no sidebar
- layout-header-only: header present, no sidebar
- layout-full-app: header and sidebar present
- layout-embedded: clean embedded view
- embedded-mode: additional styling for iframe embedding
```

### 📊 Layout Information API

```yaml
LayoutManager.getLayoutInfo() returns:
  currentLayout: active layout type
  currentPage: current page path
  hasHeader: boolean - header element present
  hasSidebar: boolean - sidebar element present
  sidebarOpen: boolean - sidebar open state
  isEmbedded: boolean - embedded layout active
  isStandalone: boolean - standalone layout active
```

---

## 📋 Status: **UI FOUNDATION SYSTEM**

✅ **Critical**: Controls entire application UI structure  
⭐ **Core Dependency**: Required by scripts.js and most HTML pages  
🔄 **Testing Priority**: HIGHEST - Layout errors affect entire user experience  
🏗️ **Architecture**: Class-based system with global utility functions  
📱 **Responsive**: Built-in mobile and responsive behavior handling

---
