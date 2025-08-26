// navigation-config.js - Enhanced Complete Version
// Navigation configuration with integrated framework support
// Provides menu structure, page layouts, and framework metadata for the compliance platform

/* ==========================================================================
   FRAMEWORK LAYOUT CONFIGURATION
   Defines which layout each page should use
   ========================================================================== */

/**
 * Layout types available in the application
 * These correspond to different UI configurations in layout-manager.js
 */
const LAYOUT_TYPES = {
  FULL_APP: "full-app", // Complete application with sidebar and header
  HEADER_ONLY: "header-only", // Header but no sidebar
  STANDALONE: "standalone", // No header or sidebar (login, splash pages)
  EMBEDDED: "embedded", // Clean embedded view for iframes
};

/**
 * Page layout mappings
 * Defines which layout type each page should use by default
 */
const PAGE_LAYOUTS = {

  // Main application pages - full app layout with sidebar and header
  "routing.html": LAYOUT_TYPES.FULL_APP,
  "dashboard.html": LAYOUT_TYPES.FULL_APP,
  "listView.html": LAYOUT_TYPES.FULL_APP,
  "chartView.html": LAYOUT_TYPES.FULL_APP,
  "calendarView.html": LAYOUT_TYPES.FULL_APP,
  "documentEditor.html": LAYOUT_TYPES.FULL_APP,
  "settingsPanel.html": LAYOUT_TYPES.FULL_APP,

  // Assessment and wizard pages - full app layout for comprehensive experience
  "wizard.html": LAYOUT_TYPES.FULL_APP,
  "wizzard.html": LAYOUT_TYPES.FULL_APP, // Legacy spelling support

  // Chat interface - can be full app or embedded depending on context
  "chatInterface.html": LAYOUT_TYPES.FULL_APP,

  // Help and documentation pages - header only for clean reading
  "help.html": LAYOUT_TYPES.HEADER_ONLY,
  "privacy.html": LAYOUT_TYPES.HEADER_ONLY,
  "terms.html": LAYOUT_TYPES.HEADER_ONLY,

  // Authentication and landing pages - standalone layout
  "index.html": LAYOUT_TYPES.STANDALONE,
  "login.html": LAYOUT_TYPES.STANDALONE,
  "register.html": LAYOUT_TYPES.STANDALONE,
  // Workflow builder pages
  "workflowList.html": LAYOUT_TYPES.FULL_APP,
  "workflowEngine.html": LAYOUT_TYPES.FULL_APP,
  "workflowPreview.html": LAYOUT_TYPES.FULL_APP,

};

/* ==========================================================================
   NAVIGATION MENU STRUCTURE
   Defines the main navigation menu items and their organization
   ========================================================================== */

/**
 * Main navigation items for the application sidebar
 * Each item defines icon, text, URL, and optional sub-items
 */
const NAVIGATION_ITEMS = [
  {
    id: "appcenter",
    name: "AppCenter",
    icon: "fas fa-th-large",
    url: "routing.html",
    description: "Main application dashboard and module access",
    category: "main",
  },
  {
    id: "dashboard",
    name: "Dashboard",
    icon: "fas fa-chart-line",
    url: "dashboard.html",
    description: "Overview of compliance status and key metrics",
    category: "main",
  },
  {
    id: "assessments",
    name: "Assessments",
    icon: "fas fa-clipboard-check",
    url: "#",
    description: "Compliance framework assessments and wizards",
    category: "assessments",
    subItems: [
      {
        id: "eu-ai-act",
        name: "EU AI Act Assessment",
        icon: "fas fa-robot",
        url: "wizard.html?framework=eu_ai_act",
        description: "AI system risk assessment and classification",
        framework: "eu_ai_act",
      },
      {
        id: "iso-27001",
        name: "ISO 27001 Assessment",
        icon: "fas fa-shield-alt",
        url: "wizard.html?framework=iso_27001",
        description: "Information security management system evaluation",
        framework: "iso_27001",
      },
      {
        id: "iso-42001",
        name: "ISO 42001 AI Management",
        icon: "fas fa-brain",
        url: "wizard.html?framework=iso_42001",
        description: "AI management system assessment",
        framework: "iso_42001",
      },
      {
        id: "gdpr",
        name: "GDPR & Privacy",
        icon: "fas fa-user-shield",
        url: "wizard.html?framework=gdpr",
        description: "Data protection and privacy compliance",
        framework: "gdpr",
      },
      {
        id: "iso-27701",
        name: "ISO 27701 Privacy",
        icon: "fas fa-lock",
        url: "wizard.html?framework=iso_27701",
        description: "Privacy information management system",
        framework: "iso_27701",
      },
      {
        id: "cloud-security",
        name: "Cloud Security",
        icon: "fas fa-cloud",
        url: "wizard.html?framework=cloud_security",
        description: "ISO 27017/27018 cloud security assessment",
        framework: "cloud_security",
      },
    ],
  },
  {
    id: "risk-management",
    name: "Risk Management",
    icon: "fas fa-exclamation-triangle",
    url: "#",
    description: "Risk identification, assessment, and mitigation",
    category: "governance",
    subItems: [
      {
        id: "risk-register",
        name: "Risk Register",
        icon: "fas fa-list-alt",
        url: "listView.html?type=risks",
        description: "Comprehensive risk register and tracking",
      },
      {
        id: "risk-heatmap",
        name: "Risk Heat Map",
        icon: "fas fa-fire",
        url: "chartView.html?type=risk_heatmap",
        description: "Visual risk analysis and prioritization",
      },
      {
        id: "risk-reports",
        name: "Risk Reports",
        icon: "fas fa-file-alt",
        url: "chartView.html?type=risk_reports",
        description: "Risk assessment reports and analytics",
      },
    ],
  },
  {
    id: "ai-governance",
    name: "AI Governance",
    icon: "fas fa-robot",
    url: "#",
    description: "AI system inventory and governance",
    category: "governance",
    subItems: [
      {
        id: "ai-inventory",
        name: "AI System Inventory",
        icon: "fas fa-microchip",
        url: "listView.html?type=ai_systems",
        description: "Comprehensive AI system catalog and classification",
      },
      {
        id: "ai-risk-assessment",
        name: "AI Risk Assessment",
        icon: "fas fa-search",
        url: "wizard.html?framework=eu_ai_act",
        description: "EU AI Act compliance and risk evaluation",
      },
      {
        id: "ai-monitoring",
        name: "AI Monitoring",
        icon: "fas fa-chart-bar",
        url: "chartView.html?type=ai_monitoring",
        description: "AI system performance and compliance monitoring",
      },
    ],
  },
  {
    id: "policies",
    name: "Policy Management",
    icon: "fas fa-book",
    url: "#",
    description: "Policy library and document management",
    category: "governance",
    subItems: [
      {
        id: "policy-library",
        name: "Policy Library",
        icon: "fas fa-folder-open",
        url: "listView.html?type=policies",
        description: "Centralized policy repository",
      },
      {
        id: "document-editor",
        name: "Document Editor",
        icon: "fas fa-edit",
        url: "documentEditor.html",
        description: "Create and edit compliance documents",
      },
      {
        id: "approval-workflow",
        name: "Approval Workflow",
        icon: "fas fa-route",
        url: "listView.html?type=approvals",
        description: "Document approval and review process",
      },
    ],
  },
  {
    id: "audits",
    name: "Audits & Reviews",
    icon: "fas fa-search-plus",
    url: "#",
    description: "Audit management and compliance reviews",
    category: "monitoring",
    subItems: [
      {
        id: "audit-schedule",
        name: "Audit Schedule",
        icon: "fas fa-calendar-alt",
        url: "calendarView.html?type=audits",
        description: "Audit planning and scheduling",
      },
      {
        id: "findings",
        name: "Findings & Actions",
        icon: "fas fa-tasks",
        url: "listView.html?type=findings",
        description: "Audit findings and corrective actions",
      },
      {
        id: "compliance-reports",
        name: "Compliance Reports",
        icon: "fas fa-chart-pie",
        url: "chartView.html?type=compliance",
        description: "Compliance status and trend reports",
      },
    ],
  },
  {
    id: "training",
    name: "Training & Awareness",
    icon: "fas fa-graduation-cap",
    url: "#",
    description: "Training programs and awareness campaigns",
    category: "people",
    subItems: [
      {
        id: "training-catalog",
        name: "Training Catalog",
        icon: "fas fa-book-open",
        url: "listView.html?type=training",
        description: "Available training courses and materials",
      },
      {
        id: "training-records",
        name: "Training Records",
        icon: "fas fa-certificate",
        url: "listView.html?type=training_records",
        description: "Employee training completion and certificates",
      },
      {
        id: "awareness-campaigns",
        name: "Awareness Campaigns",
        icon: "fas fa-bullhorn",
        url: "listView.html?type=campaigns",
        description: "Security and compliance awareness initiatives",
      },
    ],
  },
  {
    id: "incidents",
    name: "Incident Management",
    icon: "fas fa-exclamation-circle",
    url: "#",
    description: "Security incident tracking and response",
    category: "monitoring",
    subItems: [
      {
        id: "incident-register",
        name: "Incident Register",
        icon: "fas fa-clipboard-list",
        url: "listView.html?type=incidents",
        description: "Security incident tracking and management",
      },
      {
        id: "breach-notifications",
        name: "Breach Notifications",
        icon: "fas fa-bell",
        url: "listView.html?type=breaches",
        description: "Data breach notification and reporting",
      },
      {
        id: "response-plans",
        name: "Response Plans",
        icon: "fas fa-sitemap",
        url: "listView.html?type=response_plans",
        description: "Incident response procedures and playbooks",
      },
    ],
  },
  {
    id: "vendors",
    name: "Vendor Management",
    icon: "fas fa-handshake",
    url: "#",
    description: "Third-party risk and vendor assessments",
    category: "governance",
    subItems: [
      {
        id: "vendor-register",
        name: "Vendor Register",
        icon: "fas fa-building",
        url: "listView.html?type=vendors",
        description: "Third-party vendor registry and information",
      },
      {
        id: "vendor-assessments",
        name: "Security Assessments",
        icon: "fas fa-clipboard-check",
        url: "listView.html?type=vendor_assessments",
        description: "Vendor security and compliance assessments",
      },
      {
        id: "contracts",
        name: "Contracts & DPAs",
        icon: "fas fa-file-contract",
        url: "listView.html?type=contracts",
        description: "Vendor contracts and data processing agreements",
      },
    ],
  },
  {
    id: "assets",
    name: "Asset Management",
    icon: "fas fa-server",
    url: "#",
    description: "Information asset inventory and classification",
    category: "governance",
    subItems: [
      {
        id: "asset-inventory",
        name: "Asset Inventory",
        icon: "fas fa-list",
        url: "listView.html?type=assets",
        description: "Information asset register and classification",
      },
      {
        id: "data-flows",
        name: "Data Flow Mapping",
        icon: "fas fa-project-diagram",
        url: "chartView.html?type=data_flows",
        description: "Data processing flow visualization",
      },
      {
        id: "asset-controls",
        name: "Security Controls",
        icon: "fas fa-shield-check",
        url: "listView.html?type=controls",
        description: "Security controls and safeguards",
      },
    ],
  },
  {
    id: "workflows",
    name: "Workflow Builder",
    icon: "fas fa-diagram-project",
    url: "#",
    description: "Create and manage workflows",
    category: "automation",
    subItems: [
      {
        id: "workflow-list",
        name: "Workflow List",
        icon: "fas fa-list",
        url: "workflowList.html",
        description: "View existing workflows",
      },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    icon: "fas fa-cog",
    url: "settingsPanel.html",
    description: "Application settings and configuration",
    category: "admin",
  },
  {
    id: "help",
    name: "Help & Support",
    icon: "fas fa-question-circle",
    url: "help.html",
    description: "Documentation and support resources",
    category: "support",
  },
];

/* ==========================================================================
   COMPLIANCE FRAMEWORK INTEGRATION
   Enhanced framework definitions with comprehensive metadata
   ========================================================================== */

/**
 * Comprehensive framework configurations with question mappings
 * This integrates with the wizard system and provides complete metadata
 */
const COMPLIANCE_FRAMEWORKS = {
  eu_ai_act: {
    id: "eu_ai_act",
    name: "EU AI Act Compliance",
    shortName: "EU AI Act",
    version: "2024.1",
    description:
      "European Union Artificial Intelligence Act compliance assessment",
    category: "AI Governance",
    icon: "fas fa-robot",
    color: "#3b82f6",

    // Assessment metadata
    estimatedTime: "30-45 minutes",
    questionCount: 42,
    stepCount: 10,
    difficultyLevel: "Intermediate",

    // JSON integration
    jsonKey: "EU AI ACT Onboarding Questionaire",

    // Navigation and URLs
    assessmentUrl: "wizard.html?framework=eu_ai_act",
    documentationUrl: "help.html#eu-ai-act",

    // Framework-specific configuration
    riskCategories: ["Prohibited", "High-Risk", "Limited-Risk", "Minimal-Risk"],
    complianceDate: "2026-08-01",
    regulatoryBody: "European Commission",

    // Chat context for AI assistant
    chatContext: "EU AI Act Assessment",

    // Step definitions (will be populated from question data)
    steps: [],

    // Tags for filtering and search
    tags: [
      "AI",
      "European Union",
      "Risk Assessment",
      "Machine Learning",
      "Automation",
    ],
  },

  iso_27001: {
    id: "iso_27001",
    name: "ISO 27001 Information Security",
    shortName: "ISO 27001",
    version: "2022",
    description:
      "Information Security Management System based on ISO/IEC 27001:2022",
    category: "Information Security",
    icon: "fas fa-shield-alt",
    color: "#10b981",

    estimatedTime: "45-60 minutes",
    questionCount: 78,
    stepCount: 14,
    difficultyLevel: "Advanced",

    jsonKey: "ISO 27001 Questionaire",
    assessmentUrl: "wizard.html?framework=iso_27001",
    documentationUrl: "help.html#iso-27001",

    riskCategories: ["Critical", "High", "Medium", "Low"],
    complianceDate: "Ongoing",
    regulatoryBody: "ISO/IEC",

    chatContext: "ISO 27001 Assessment",
    steps: [],

    tags: [
      "Information Security",
      "ISMS",
      "Risk Management",
      "Certification",
      "ISO",
    ],
  },

  iso_42001: {
    id: "iso_42001",
    name: "ISO 42001 AI Management",
    shortName: "ISO 42001",
    version: "2023",
    description:
      "Artificial Intelligence Management System based on ISO/IEC 42001:2023",
    category: "AI Governance",
    icon: "fas fa-brain",
    color: "#8b5cf6",

    estimatedTime: "25-35 minutes",
    questionCount: 36,
    stepCount: 10,
    difficultyLevel: "Intermediate",

    jsonKey: "ISO 42001 2023 AI Management Onboarding Questionaire",
    assessmentUrl: "wizard.html?framework=iso_42001",
    documentationUrl: "help.html#iso-42001",

    riskCategories: ["Critical", "High", "Medium", "Low"],
    complianceDate: "Ongoing",
    regulatoryBody: "ISO/IEC",

    chatContext: "ISO 42001 AI Management Assessment",
    steps: [],

    tags: [
      "AI Management",
      "ISO",
      "Artificial Intelligence",
      "Governance",
      "Risk Management",
    ],
  },

  gdpr: {
    id: "gdpr",
    name: "GDPR & Privacy Compliance",
    shortName: "GDPR",
    version: "2018",
    description:
      "General Data Protection Regulation compliance with Microsoft DPR integration",
    category: "Data Protection",
    icon: "fas fa-user-shield",
    color: "#f59e0b",

    estimatedTime: "50-70 minutes",
    questionCount: 89,
    stepCount: 8,
    difficultyLevel: "Advanced",

    jsonKey: "GDPR and MSFT DPR Onboarding Questionaire",
    assessmentUrl: "wizard.html?framework=gdpr",
    documentationUrl: "help.html#gdpr",

    riskCategories: ["Very High", "High", "Medium", "Low"],
    complianceDate: "2018-05-25",
    regulatoryBody: "European Data Protection Board",

    chatContext: "GDPR Privacy Assessment",
    steps: [],

    tags: [
      "GDPR",
      "Data Protection",
      "Privacy",
      "European Union",
      "Personal Data",
    ],
  },

  iso_27701: {
    id: "iso_27701",
    name: "ISO 27701 Privacy Management",
    shortName: "ISO 27701",
    version: "2019",
    description:
      "Privacy Information Management System based on ISO/IEC 27701:2019",
    category: "Privacy Management",
    icon: "fas fa-lock",
    color: "#06b6d4",

    estimatedTime: "35-45 minutes",
    questionCount: 52,
    stepCount: 13,
    difficultyLevel: "Advanced",

    jsonKey: "ISO 27701 Onboarding Questionaire",
    assessmentUrl: "wizard.html?framework=iso_27701",
    documentationUrl: "help.html#iso-27701",

    riskCategories: ["Critical", "High", "Medium", "Low"],
    complianceDate: "Ongoing",
    regulatoryBody: "ISO/IEC",

    chatContext: "ISO 27701 Privacy Assessment",
    steps: [],

    tags: [
      "Privacy Management",
      "PIMS",
      "ISO",
      "Data Protection",
      "Information Security",
    ],
  },

  cloud_security: {
    id: "cloud_security",
    name: "Cloud Security (ISO 27017/27018)",
    shortName: "Cloud Security",
    version: "2015/2019",
    description: "Cloud security and privacy based on ISO/IEC 27017 and 27018",
    category: "Cloud Security",
    icon: "fas fa-cloud",
    color: "#84cc16",

    estimatedTime: "20-30 minutes",
    questionCount: 29,
    stepCount: 7,
    difficultyLevel: "Intermediate",

    jsonKey: "ISO 27017 and 27018 Cloud Security and Privacy Questionaire",
    assessmentUrl: "wizard.html?framework=cloud_security",
    documentationUrl: "help.html#cloud-security",

    riskCategories: ["Critical", "High", "Medium", "Low"],
    complianceDate: "Ongoing",
    regulatoryBody: "ISO/IEC",

    chatContext: "Cloud Security Assessment",
    steps: [],

    tags: [
      "Cloud Security",
      "ISO 27017",
      "ISO 27018",
      "Cloud Computing",
      "Privacy",
    ],
  },
};

/* ==========================================================================
   APPLICATION CONFIGURATION
   General application settings and metadata
   ========================================================================== */

/**
 * Application-wide configuration and metadata
 */
const APP_CONFIG = {
  name: "ArionComply",
  version: "2.1.0",
  description: "Comprehensive Compliance and Risk Management Platform",

  // Branding
  logo: "assets/logo.png",
  favicon: "assets/favicon.ico",
  primaryColor: "#3b82f6",

  // Features
  features: {
    aiAssistant: true,
    voiceAvatar: true,
    multiFramework: true,
    realTimeChat: true,
    documentGeneration: true,
    riskAnalytics: true,
  },

  // Integration endpoints
  endpoints: {
    api: "/api/v1",
    chat: "/api/chat",
    documents: "/api/documents",
    analytics: "/api/analytics",
  },

  // Default settings
  defaults: {
    theme: "light",
    language: "en",
    dateFormat: "YYYY-MM-DD",
    timeZone: "UTC",
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
  },
};

/* ==========================================================================
   UTILITY FUNCTIONS
   Helper functions for navigation and framework management
   ========================================================================== */

/**
 * Gets navigation item by ID
 * @param {string} itemId - The navigation item ID
 * @returns {Object|null} Navigation item object or null if not found
 */
function getNavigationItem(itemId) {
  return NAVIGATION_ITEMS.find((item) => item.id === itemId) || null;
}

/**
 * Gets all navigation items in a specific category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of navigation items in the category
 */
function getNavigationItemsByCategory(category) {
  return NAVIGATION_ITEMS.filter((item) => item.category === category);
}

/**
 * Gets framework configuration by ID
 * @param {string} frameworkId - The framework ID
 * @returns {Object|null} Framework configuration or null if not found
 */
function getFrameworkConfig(frameworkId) {
  return COMPLIANCE_FRAMEWORKS[frameworkId] || null;
}

/**
 * Gets all available frameworks
 * @returns {Array} Array of all framework configurations
 */
function getAllFrameworks() {
  return Object.values(COMPLIANCE_FRAMEWORKS);
}

/**
 * Gets frameworks by category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of frameworks in the category
 */
function getFrameworksByCategory(category) {
  return Object.values(COMPLIANCE_FRAMEWORKS).filter(
    (framework) => framework.category === category,
  );
}

/**
 * Searches frameworks by tags
 * @param {string|Array} searchTags - Tag or array of tags to search for
 * @returns {Array} Array of matching frameworks
 */
function searchFrameworksByTags(searchTags) {
  const tags = Array.isArray(searchTags) ? searchTags : [searchTags];
  return Object.values(COMPLIANCE_FRAMEWORKS).filter(
    (framework) =>
      framework.tags &&
      framework.tags.some((tag) =>
        tags.some((searchTag) =>
          tag.toLowerCase().includes(searchTag.toLowerCase()),
        ),
      ),
  );
}

// Configure layout for each page
/**
 * User role-based navigation filtering
 * Controls which navigation items are visible based on user roles
 */
const ROLE_NAVIGATION = {
  admin: NAVIGATION_ITEMS,
  manager: NAVIGATION_ITEMS.filter((item) => item.id !== "prototypes"),
  auditor: NAVIGATION_ITEMS.filter((item) =>
    ["dashboard", "audits", "risk-management", "policies", "help"].includes(
      item.id,
    ),
  ),
  user: NAVIGATION_ITEMS.filter((item) =>
    ["dashboard", "policies", "training", "help"].includes(item.id),
  ),
};

/**
 * Gets the appropriate layout for a page
 * @param {string} pageName - The page name or URL
 * @returns {string} Layout type constant
 */
function getPageLayout(pageName) {
  // Extract filename from full path
  const fileName = pageName.split("/").pop().split("?")[0];
  return PAGE_LAYOUTS[fileName] || LAYOUT_TYPES.FULL_APP;
}

/**
 * Generates navigation URL with framework parameter
 * @param {string} baseUrl - Base URL for navigation
 * @param {string} frameworkId - Framework ID to append
 * @returns {string} Complete URL with framework parameter
 */
function getFrameworkAssessmentUrl(baseUrl, frameworkId) {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}framework=${frameworkId}`;
}

/* ==========================================================================
   GLOBAL EXPORTS
   Export configurations and utility functions for use by other modules
   ========================================================================== */

// Export constants and configurations for global access
if (typeof window !== "undefined") {
  // Global exports for browser environment
  window.LAYOUT_TYPES = LAYOUT_TYPES;
  window.PAGE_LAYOUTS = PAGE_LAYOUTS;
  window.NAVIGATION_ITEMS = NAVIGATION_ITEMS;
  window.COMPLIANCE_FRAMEWORKS = COMPLIANCE_FRAMEWORKS;
  window.APP_CONFIG = APP_CONFIG;

  // Utility functions
  window.getNavigationItem = getNavigationItem;
  window.getNavigationItemsByCategory = getNavigationItemsByCategory;
  window.getFrameworkConfig = getFrameworkConfig;
  window.getAllFrameworks = getAllFrameworks;
  window.getFrameworksByCategory = getFrameworksByCategory;
  window.searchFrameworksByTags = searchFrameworksByTags;
  window.getPageLayout = getPageLayout;
  window.getFrameworkAssessmentUrl = getFrameworkAssessmentUrl;
}

// Export for Node.js module environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LAYOUT_TYPES,
    PAGE_LAYOUTS,
    NAVIGATION_ITEMS,
    COMPLIANCE_FRAMEWORKS,
    APP_CONFIG,
    getNavigationItem,
    getNavigationItemsByCategory,
    getFrameworkConfig,
    getAllFrameworks,
    getFrameworksByCategory,
    searchFrameworksByTags,
    getPageLayout,
    getFrameworkAssessmentUrl,
  };
}

console.log("🧭 Enhanced Navigation Configuration loaded successfully");
