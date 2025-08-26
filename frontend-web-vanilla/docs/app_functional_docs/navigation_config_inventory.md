# ✅ navigation-config.js – Configuration Foundation Inventory

**Purpose**: Central configuration hub providing navigation structure, page layouts, and compliance framework metadata  
**Type**: Static configuration file (no user interactions)  
**Dependencies**: Required by scripts.js, layout-manager.js, wizard-engine.js, and most HTML pages  
**Critical Role**: Defines app structure and framework integration points

---

## 🏗️ Configuration Data Structures

### 📐 Layout Configuration

```yaml
LAYOUT_TYPES:
  - FULL_APP: "full-app" # Complete UI with sidebar + header
  - HEADER_ONLY: "header-only" # Header but no sidebar
  - STANDALONE: "standalone" # No header/sidebar (auth pages)
  - EMBEDDED: "embedded" # Clean embedded view for iframes

PAGE_LAYOUTS: # Maps each HTML file to its layout type
  main_app_pages:
    - routing.html → FULL_APP
    - dashboard.html → FULL_APP
    - listView.html → FULL_APP
    - chartView.html → FULL_APP
    - calendarView.html → FULL_APP
    - documentEditor.html → FULL_APP
    - settingsPanel.html → FULL_APP

  wizard_pages:
    - wizard.html → FULL_APP
    - wizzard.html → FULL_APP # Legacy spelling support

  chat_interface:
    - chatInterface.html → FULL_APP # Can be embedded based on context

  documentation_pages:
    - help.html → HEADER_ONLY
    - privacy.html → HEADER_ONLY
    - terms.html → HEADER_ONLY

  auth_pages:
    - index.html → STANDALONE
    - login.html → STANDALONE
    - register.html → STANDALONE

  workflow_pages:
    - workflowList.html → FULL_APP
    - workflowEngine.html → FULL_APP
    - workflowPreview.html → FULL_APP
```

### 🧭 Navigation Menu Structure

```yaml
NAVIGATION_ITEMS: # Hierarchical menu structure with 13 main categories

  main_navigation:
    - appcenter: routing.html (Main dashboard and module access)
    - dashboard: dashboard.html (Compliance metrics overview)

  assessments: # 🎯 CRITICAL - Framework integration point
    parent: "#" (dropdown menu)
    sub_items:
      - eu-ai-act: wizard.html?framework=eu_ai_act
      - iso-27001: wizard.html?framework=iso_27001
      - iso-42001: wizard.html?framework=iso_42001
      - gdpr: wizard.html?framework=gdpr
      - iso-27701: wizard.html?framework=iso_27701
      - cloud-security: wizard.html?framework=cloud_security

  governance_category:
    - risk-management: (Risk register, heat map, reports)
    - ai-governance: (AI inventory, risk assessment, monitoring)
    - policies: (Policy library, document editor, approval workflow)
    - vendors: (Vendor register, assessments, contracts)
    - assets: (Asset inventory, data flows, security controls)

  monitoring_category:
    - audits: (Audit schedule, findings, compliance reports)
    - incidents: (Incident register, breach notifications, response plans)

  people_category:
    - training: (Training catalog, records, awareness campaigns)

  automation_category:
    - workflows: (Workflow builder and management)

  admin_category:
    - settings: settingsPanel.html
    - help: help.html
```

### 🎯 Compliance Framework Definitions

```yaml
COMPLIANCE_FRAMEWORKS: # 🎯 CRITICAL - Used by wizard system
  eu_ai_act:
    metadata:
      name: "EU AI Act Compliance"
      shortName: "EU AI Act"
      version: "2024.1"
      category: "AI Governance"
      icon: "fas fa-robot"
      color: "#3b82f6"

    assessment_config:
      estimatedTime: "30-45 minutes"
      questionCount: 42
      stepCount: 10
      difficultyLevel: "Intermediate"
      jsonKey: "EU AI ACT Onboarding Questionaire" # ⭐ Links to JSON data

    navigation:
      assessmentUrl: "wizard.html?framework=eu_ai_act"
      documentationUrl: "help.html#eu-ai-act"
      chatContext: "EU AI Act Assessment" # ⭐ Used by chat system

    compliance_data:
      riskCategories:
        ["Prohibited", "High-Risk", "Limited-Risk", "Minimal-Risk"]
      complianceDate: "2026-08-01"
      regulatoryBody: "European Commission"
      tags: ["AI", "European Union", "Risk Assessment", "Machine Learning"]

  iso_27001:
    metadata:
      name: "ISO 27001 Information Security"
      shortName: "ISO 27001"
      version: "2022"
      category: "Information Security"
      icon: "fas fa-shield-alt"
      color: "#10b981"

    assessment_config:
      estimatedTime: "45-60 minutes"
      questionCount: 78
      stepCount: 14
      difficultyLevel: "Advanced"
      jsonKey: "ISO 27001 Questionaire"

    navigation:
      assessmentUrl: "wizard.html?framework=iso_27001"
      chatContext: "ISO 27001 Assessment"

    compliance_data:
      riskCategories: ["Critical", "High", "Medium", "Low"]
      complianceDate: "Ongoing"
      regulatoryBody: "ISO/IEC"

  iso_42001:
    metadata:
      name: "ISO 42001 AI Management"
      shortName: "ISO 42001"
      version: "2023"
      category: "AI Governance"
      icon: "fas fa-brain"
      color: "#8b5cf6"

    assessment_config:
      estimatedTime: "25-35 minutes"
      questionCount: 36
      stepCount: 10
      jsonKey: "ISO 42001 2023 AI Management Onboarding Questionaire"

  gdpr:
    metadata:
      name: "GDPR & Privacy Compliance"
      shortName: "GDPR"
      version: "2018"
      category: "Data Protection"
      icon: "fas fa-user-shield"
      color: "#f59e0b"

    assessment_config:
      estimatedTime: "50-70 minutes"
      questionCount: 89
      stepCount: 8
      difficultyLevel: "Advanced"
      jsonKey: "GDPR and MSFT DPR Onboarding Questionaire"

    compliance_data:
      riskCategories: ["Very High", "High", "Medium", "Low"]
      complianceDate: "2018-05-25"
      regulatoryBody: "European Data Protection Board"

  iso_27701:
    metadata:
      name: "ISO 27701 Privacy Management"
      shortName: "ISO 27701"
      version: "2019"
      category: "Privacy Management"
      icon: "fas fa-lock"
      color: "#06b6d4"

    assessment_config:
      estimatedTime: "35-45 minutes"
      questionCount: 52
      stepCount: 13
      difficultyLevel: "Advanced"
      jsonKey: "ISO 27701 Onboarding Questionaire"

  cloud_security:
    metadata:
      name: "Cloud Security (ISO 27017/27018)"
      shortName: "Cloud Security"
      version: "2015/2019"
      category: "Cloud Security"
      icon: "fas fa-cloud"
      color: "#84cc16"

    assessment_config:
      estimatedTime: "20-30 minutes"
      questionCount: 29
      stepCount: 7
      difficultyLevel: "Intermediate"
      jsonKey: "ISO 27017 and 27018 Cloud Security and Privacy Questionaire"
```

### ⚙️ Application Configuration

```yaml
APP_CONFIG:
  application:
    name: "ArionComply"
    version: "2.1.0"
    description: "Comprehensive Compliance and Risk Management Platform"

  branding:
    logo: "assets/logo.png"
    favicon: "assets/favicon.ico"
    primaryColor: "#3b82f6"

  features:
    aiAssistant: true
    voiceAvatar: true
    multiFramework: true
    realTimeChat: true
    documentGeneration: true
    riskAnalytics: true

  endpoints:
    api: "/api/v1"
    chat: "/api/chat"
    documents: "/api/documents"
    analytics: "/api/analytics"

  defaults:
    theme: "light"
    language: "en"
    dateFormat: "YYYY-MM-DD"
    timeZone: "UTC"
    autoSave: true
    autoSaveInterval: 30000 # 30 seconds
```

---

## 🔧 Utility Functions (Exported to Window)

### 🧭 Navigation Functions

```yaml
- getNavigationItem(itemId):
    purpose: finds navigation item by ID
    returns: navigation object or null
    example: getNavigationItem('dashboard') → dashboard nav item

- getNavigationItemsByCategory(category):
    purpose: filters navigation items by category
    categories: main, assessments, governance, monitoring, people, admin
    returns: array of navigation items

- getPageLayout(pageName):
    purpose: determines layout type for a page
    input: "dashboard.html" or full path
    returns: LAYOUT_TYPES constant (FULL_APP, HEADER_ONLY, etc.)
```

### 🎯 Framework Functions

```yaml
- getFrameworkConfig(frameworkId):
    purpose: retrieves complete framework configuration
    input: 'eu_ai_act', 'iso_27001', etc.
    returns: framework object with metadata, assessment config, navigation
    ⭐ CRITICAL: Used by wizard system for initialization

- getAllFrameworks():
    purpose: gets all available frameworks
    returns: array of all framework configurations

- getFrameworksByCategory(category):
    purpose: filters frameworks by category
    categories: "AI Governance", "Information Security", "Data Protection"
    returns: array of matching frameworks

- searchFrameworksByTags(searchTags):
    purpose: finds frameworks by tag matching
    input: string or array of tags
    example: searchFrameworksByTags(['AI', 'Privacy'])
    returns: array of matching frameworks

- getFrameworkAssessmentUrl(baseUrl, frameworkId):
    purpose: generates complete assessment URL with framework parameter
    example: getFrameworkAssessmentUrl('wizard.html', 'eu_ai_act')
    returns: "wizard.html?framework=eu_ai_act"
```

---

## 🔗 Global Exports & Integration Points

### 📤 Window Object Exports

```yaml
# Configuration Objects ⭐ CRITICAL
- window.LAYOUT_TYPES
- window.PAGE_LAYOUTS
- window.NAVIGATION_ITEMS
- window.COMPLIANCE_FRAMEWORKS ⭐ Used by scripts.js wizard functions
- window.APP_CONFIG

# Utility Functions
- window.getNavigationItem
- window.getNavigationItemsByCategory
- window.getFrameworkConfig ⭐ Used by wizard-engine.js
- window.getAllFrameworks
- window.getFrameworksByCategory
- window.searchFrameworksByTags
- window.getPageLayout ⭐ Used by layout-manager.js
- window.getFrameworkAssessmentUrl
```

### 🔄 Integration Dependencies

```yaml
consumed_by:
  - scripts.js:
      uses: COMPLIANCE_FRAMEWORKS for wizard context
      functions: updateChatContextFromWizard(), restoreSavedWizardState()

  - layout-manager.js:
      uses: PAGE_LAYOUTS, LAYOUT_TYPES
      functions: LayoutManager.initializePage()

  - wizard-engine.js:
      uses: COMPLIANCE_FRAMEWORKS for initialization
      functions: framework selection and step navigation

  - routing.html:
      uses: NAVIGATION_ITEMS for module cards
      functions: module filtering and navigation

  - Various HTML pages:
      use: getPageLayout() for layout determination
      use: framework URLs for navigation links
```

---

## 🎯 Critical Framework Integration Points

### 📋 JSON Key Mapping

```yaml
# ⭐ CRITICAL: Links framework configs to question data files
jsonKey_mappings:
  - "EU AI ACT Onboarding Questionaire" → eu_ai_act framework
  - "ISO 27001 Questionaire" → iso_27001 framework
  - "ISO 42001 2023 AI Management Onboarding Questionaire" → iso_42001 framework
  - "GDPR and MSFT DPR Onboarding Questionaire" → gdpr framework
  - "ISO 27701 Onboarding Questionaire" → iso_27701 framework
  - "ISO 27017 and 27018 Cloud Security and Privacy Questionaire" → cloud_security framework

# These keys must match exactly with onboarding_questions.json structure
```

### 🎨 Framework Visual Configuration

```yaml
framework_styling:
  - EU AI Act: blue (#3b82f6), robot icon
  - ISO 27001: green (#10b981), shield icon
  - ISO 42001: purple (#8b5cf6), brain icon
  - GDPR: amber (#f59e0b), user-shield icon
  - ISO 27701: cyan (#06b6d4), lock icon
  - Cloud Security: lime (#84cc16), cloud icon
```

---

## 🧪 Testing Considerations

### 🎯 High Priority Tests

```yaml
1. Framework Configuration Integrity:
  - All framework IDs match between COMPLIANCE_FRAMEWORKS and navigation
  - All jsonKey values exist in onboarding_questions.json
  - Assessment URLs are properly formatted

2. Navigation Structure Validation:
  - All navigation URLs point to existing files
  - Sub-item framework references are valid
  - Category filtering works correctly

3. Layout Mapping:
  - All HTML files have defined page layouts
  - Layout types are valid constants
  - getPageLayout() handles edge cases (paths, query params)

4. Global Export Verification:
  - All configuration objects properly exported to window
  - Utility functions work with edge cases (null inputs, missing data)
  - Framework search and filtering functions return correct results
```

### ⚠️ Integration Dependencies to Test

```yaml
- Must test WITH wizard-engine.js (framework initialization)
- Must test WITH layout-manager.js (page layout application)
- Must test WITH scripts.js (COMPLIANCE_FRAMEWORKS usage)
- Must test WITH onboarding_questions.json (jsonKey matching)
- Must test navigation URL validity (all linked pages exist)
```

---

## 🏷️ Role-Based Navigation Support

```yaml
ROLE_NAVIGATION: # Controls menu visibility by user role
  - admin: full access to all navigation items
  - manager: excludes 'prototypes' section
  - auditor: limited to dashboard, audits, risk-management, policies, help
  - user: basic access to dashboard, policies, training, help
```

---

## 📋 Status: **CONFIGURATION FOUNDATION**

✅ **Critical**: Required by most application modules  
⭐ **Core Integration**: Defines framework metadata used throughout app  
🔄 **Testing Priority**: HIGH - Configuration errors can break navigation and wizard system  
📊 **Stability**: HIGH - Static configuration, changes should be rare

---
