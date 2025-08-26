# ✅ sidebar-component.js – Dynamic Sidebar System Inventory

**Purpose**: Class-based system for generating and managing the application sidebar navigation  
**Type**: Static class with dynamic HTML generation and event handling  
**Dependencies**: Requires navigation-config.js (NAVIGATION_ITEMS, ROLE_NAVIGATION)  
**Integration**: Called by layout-manager.js for FULL_APP layouts

---

## 🔁 Automated Behaviors (on injection and initialization)

### 🏗️ Sidebar Generation & Injection Process

```yaml
- SidebarComponent.injectSidebar(currentPage, targetSelector):
    trigger: called by layout-manager.js during setupFullAppLayout()
    process:
      1. calls generateSidebar(currentPage) to create HTML
      2. removes existing #sidebar and #sidebarBackdrop elements
      3. injects new sidebar + backdrop into target element (default: body)
      4. calls setupSidebarEvents() to initialize interactivity

    html_structure_generated:
      - nav#sidebar.sidebar (main sidebar container)
      - div#sidebarBackdrop.sidebar-backdrop (mobile backdrop)
      - ul.nav-menu (navigation menu container)
      - li.nav-item (menu items with optional .has-sub class)
      - ul.sub-menu (dropdown submenus)

- generateSidebar(currentPage, userRole):
    role_determination:
      1. checks localStorage['arioncomply_user'] for user role
      2. uses ROLE_NAVIGATION[role] from navigation-config.js
      3. falls back to NAVIGATION_ITEMS if role not found
      4. defaults to 'admin' role if parsing fails

    calls: generateMenuItems() to create navigation structure
```

### 🎯 Event Setup & Initialization

```yaml
- setupSidebarEvents():
    auto_calls:
      - attachToggleEvents() → sidebar open/close functionality
      - setupKeyboardShortcuts() → Alt+key navigation shortcuts
      - setupAccessibility() → ARIA attributes and keyboard navigation

    prevents_duplicates:
      - removes existing keyboard event listeners before adding new ones
      - checks for existing global functions before creating
```

---

## 🧑‍💻 User-Triggered Actions

### 🍔 Sidebar Toggle Functions

```yaml
- window.toggleSidebar():
    created_by: attachToggleEvents() if not already available
    behavior:
      - toggles .open class on #sidebar
      - toggles .active class on #sidebarBackdrop

- window.closeSidebar():
    created_by: attachToggleEvents() if not already available
    behavior:
      - removes .open class from #sidebar
      - removes .active class from #sidebarBackdrop
    triggers:
      - backdrop click (onclick="closeSidebar()")
      - Escape key press
      - layout-manager.js responsive behavior (mobile)
```

### 📂 Submenu Navigation

```yaml
- submenu_toggle:
    trigger: click on nav-link with data-toggle="submenu"
    behavior:
      - prevents default link behavior (event.preventDefault())
      - toggles .open class on parent .nav-item
      - shows/hides .sub-menu dropdown

    applied_to:
      - assessments menu (6 framework sub-items)
      - risk-management menu (3 sub-items)
      - ai-governance menu (3 sub-items)
      - policies menu (3 sub-items)
      - audits menu (3 sub-items)
      - training menu (3 sub-items)
      - incidents menu (3 sub-items)
      - vendors menu (3 sub-items)
      - assets menu (3 sub-items)
      - workflows menu (1 sub-item)
```

### ⌨️ Keyboard Shortcuts (Alt + Key)

```yaml
- Alt + H: routing.html (AppCenter)
- Alt + D: dashboard.html (Dashboard)
- Alt + A: listView.html?type=ai (AI Systems)
- Alt + R: listView.html?type=risks (Risk Management)
- Alt + C: calendarView.html (Calendar)
- Alt + P: documentEditor.html (Policy Editor)
- Alt + G: wizzard.html (Assessment Wizard)
- Alt + S: listView.html?type=assets (Asset Management)
- Alt + B: chartView.html (Analytics)
- Alt + T: settingsPanel.html (Settings)
- Alt + I: chatInterface.html (AI Assistant)
- Alt + L: prototypeIndex.html (Prototypes)
- Escape: closeSidebar() (Close sidebar)
```

### ♿ Accessibility Features

```yaml
- setupAccessibility():
    aria_attributes:
      - role="navigation" on #sidebar
      - aria-label="Main navigation" on #sidebar
      - tabindex="0" on all .nav-link elements

    keyboard_navigation:
      - Enter key: activates nav-link (calls click())
      - Space key: activates nav-link (calls click())
      - prevents default behavior for Enter/Space
```

---

## 🎯 Dynamic Menu Generation System

### 📋 Menu Item Structure

```yaml
- generateMenuItems(navigationItems, currentPage):
    processes: NAVIGATION_ITEMS array from navigation-config.js
    generates: HTML structure for each menu item

    menu_item_properties:
      - item.id: unique identifier
      - item.name: display text
      - item.icon: Font Awesome icon class
      - item.url: navigation URL
      - item.description: tooltip text
      - item.category: grouping category
      - item.subItems: array of sub-menu items (optional)

    active_state_detection:
      - calls isCurrentPage(item.url, currentPage)
      - adds .active class to current page nav-link
      - handles special cases (listView.html with type parameters)

- generateSubMenu(subItems, currentPage):
    creates: ul.sub-menu with nested li.nav-item elements
    applies: same active state detection as main menu items
```

### 🔍 Current Page Detection Logic

```yaml
- isCurrentPage(itemUrl, currentPage):
    comparison_method:
      1. extracts filename from both URLs (removes path and query params)
      2. handles special case: listView.html with type parameters
      3. compares extracted filenames for exact match

    special_handling:
      - listView.html URLs: compares both filename AND type parameter
      - example: listView.html?type=ai vs listView.html?type=risks
      - uses URLSearchParams to parse query parameters

    returns: boolean indicating if item URL matches current page
```

### 👥 Role-Based Navigation

```yaml
- getNavigationForRole(userRole):
    user_role_sources: 1. userRole parameter (if provided)
      2. localStorage['arioncomply_user'].role (parsed from JSON)
      3. defaults to 'admin' if parsing fails

    role_filtering:
      - uses ROLE_NAVIGATION[role] from navigation-config.js
      - falls back to full NAVIGATION_ITEMS if role not found

    role_permissions:
      - admin: full access to all navigation items
      - manager: excludes 'prototypes' section
      - auditor: limited to dashboard, audits, risk-management, policies, help
      - user: basic access to dashboard, policies, training, help
```

---

## 🔗 Integration Dependencies

### 📥 Required from navigation-config.js

```yaml
- NAVIGATION_ITEMS array: ⭐ CRITICAL
    structure: array of navigation item objects
    properties: id, name, icon, url, description, category, subItems
    used_by: generateMenuItems() to create menu structure

- ROLE_NAVIGATION object: ⭐ CRITICAL
    structure: role_name → filtered NAVIGATION_ITEMS array
    roles: admin, manager, auditor, user
    used_by: getNavigationForRole() for menu filtering

- Must be loaded before sidebar-component.js
```

### 📤 Provides to layout-manager.js

```yaml
- SidebarComponent.injectSidebar(currentPage, targetSelector):
    called_by: LayoutManager.setupFullAppLayout()
    purpose: injects complete sidebar into page
    optional: layout-manager.js gracefully handles if not available
```

### 🔧 Creates Global Functions

```yaml
- window.toggleSidebar: ⭐ REQUIRED by hamburger menu onclick
- window.closeSidebar: ⭐ REQUIRED by backdrop onclick and Escape key
- automatically created if not already available
- prevents conflicts with existing implementations
```

---

## 🛠️ Dynamic Sidebar Management Functions

### 🔄 State Management

```yaml
- updateActiveState(currentPage):
    purpose: updates active menu item without full sidebar regeneration
    process: 1. removes .active class from all .nav-link elements
      2. applies .active class to current page nav-link
      3. uses isCurrentPage() logic for detection

    performance: more efficient than full sidebar regeneration
    use_case: for single-page applications or dynamic page updates
```

### 🔌 Dynamic Menu Extension

```yaml
- addCustomMenuItem(item, position):
    purpose: dynamically add menu items (plugins, custom features)
    parameters:
      - item: object with id, name, icon, url, description, shortcut
      - position: insertion position (-1 for end, number for specific index)

    behavior:
      - adds item to NAVIGATION_ITEMS array
      - regenerates sidebar if already exists
      - auto-generates ID if not provided

    use_case: plugin system, runtime menu customization
```

---

## 🌐 Global Exports & Integration Points

### 📤 Module Exports

```yaml
# Class Export
- SidebarComponent: complete class with all static methods
- module.exports = SidebarComponent (for Node.js environments)

# Global Functions Created (if not available)
- window.toggleSidebar: sidebar toggle functionality
- window.closeSidebar: sidebar close functionality
- window.keyboardHandler: keyboard shortcut handling
```

### 🔄 Integration Flow

```yaml
1. layout-manager.js calls SidebarComponent.injectSidebar()
2. SidebarComponent.generateSidebar() creates HTML structure
3. Uses NAVIGATION_ITEMS + ROLE_NAVIGATION from navigation-config.js
4. Injects HTML into DOM and sets up event listeners
5. Creates global functions required by onclick handlers
6. Sets up keyboard shortcuts and accessibility features
```

---

## 🧪 Critical Testing Scenarios

### 🎯 High Priority Tests

```yaml
1. Sidebar Generation:
  - HTML structure generation with correct classes and IDs
  - Role-based navigation filtering (admin, manager, auditor, user)
  - Active state detection for current page
  - Submenu generation for items with subItems

2. Event Handling:
  - Sidebar toggle functionality (open/close states)
  - Submenu toggle functionality (prevent default, toggle classes)
  - Keyboard shortcuts (Alt+key combinations)
  - Accessibility features (Enter/Space key navigation)

3. Integration Points:
  - Called by layout-manager.js during full app layout setup
  - Graceful handling when navigation-config.js not available
  - Global function creation without conflicts

4. Dynamic Features:
  - updateActiveState() without full regeneration
  - addCustomMenuItem() with array manipulation and regeneration
  - Multiple injection calls (cleanup existing elements)
```

### ⚠️ Integration Dependency Tests

```yaml
- Must test WITH navigation-config.js loaded (NAVIGATION_ITEMS, ROLE_NAVIGATION)
- Must test WITH layout-manager.js calling injectSidebar()
- Must test role-based filtering with different user roles
- Must test current page detection with various URL formats
- Must test keyboard shortcuts don't conflict with other handlers
- Must test accessibility features with screen readers
```

### 🔍 Edge Cases & Error Handling

```yaml
- Missing navigation-config.js (NAVIGATION_ITEMS undefined)
- Corrupted user data in localStorage
- Invalid role values (fallback to admin)
- listView.html with missing or invalid type parameters
- Multiple sidebar injection calls (cleanup existing)
- Keyboard handler conflicts (remove existing before adding)
- Missing DOM elements during injection (target element not found)
```

---

## 🏗️ Sidebar HTML Structure Generated

### 📐 Complete Structure

```html
<div
  class="sidebar-backdrop"
  id="sidebarBackdrop"
  onclick="closeSidebar()"
></div>
<nav
  class="sidebar"
  id="sidebar"
  role="navigation"
  aria-label="Main navigation"
>
  <div class="sidebar-header">
    <div class="logo">
      <i class="fas fa-shield-alt"></i>
      <span>ArionComply</span>
    </div>
  </div>
  <ul class="nav-menu">
    <li class="nav-item">
      <a
        href="routing.html"
        class="nav-link active"
        title="Main application dashboard"
      >
        <i class="fas fa-th-large"></i>
        <span>AppCenter</span>
      </a>
    </li>
    <li class="nav-item has-sub">
      <a
        href="#"
        class="nav-link"
        data-toggle="submenu"
        title="Compliance framework assessments"
      >
        <i class="fas fa-clipboard-check"></i>
        <span>Assessments</span>
      </a>
      <ul class="sub-menu">
        <li class="nav-item">
          <a href="wizard.html?framework=eu_ai_act" class="nav-link">
            <i class="fas fa-robot"></i>
            <span>EU AI Act Assessment</span>
          </a>
        </li>
        <!-- Additional submenu items... -->
      </ul>
    </li>
    <!-- Additional menu items... -->
  </ul>
</nav>
```

---

## 📋 Status: **DYNAMIC SIDEBAR SYSTEM**

✅ **Critical**: Provides main navigation for all full-app layouts  
⭐ **Integration**: Optional dependency for layout-manager.js  
🔄 **Testing Priority**: HIGH - Navigation errors impact user experience  
🏗️ **Architecture**: Class-based with dynamic HTML generation  
♿ **Accessibility**: Built-in ARIA attributes and keyboard navigation  
🎯 **Role-Based**: Supports multi-role navigation filtering

---
