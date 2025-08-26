// listView-content-config.js
// Content type configurations for the dynamic listView.html page
// Defines all supported content types, their metadata, and UI configurations

/* ==========================================================================
   FILE OVERVIEW AND USAGE
   ========================================================================== */

/**
 * WHAT THIS FILE DOES:
 * This file contains all the configuration data for different content types
 * that can be displayed in the listView.html page. It acts as a central
 * configuration hub that defines how each content type should be presented.
 * 
 * WHEN TO USE THIS FILE:
 * - When adding new content types to the listView.html page
 * - When modifying labels, filters, or actions for existing content types
 * - When other pages need similar content type configurations
 * 
 * HOW TO USE THIS FILE:
 * 1. Include this file before listView-logic.js in your HTML
 * 2. Use getContentTypeConfig(typeId) to get configuration for a specific type
 * 3. Use getAllContentTypes() to get list of all available types
 * 4. Use executeBulkAction(actionName, items) to execute bulk operations
 * 
 * FILE DEPENDENCIES:
 * - This file depends on: Nothing (standalone configuration)
 * - Files that depend on this: listView-logic.js, potentially other list pages
 * 
 * ADDING NEW CONTENT TYPES:
 * 1. Add a new entry to LISTVIEW_CONTENT_TYPES object
 * 2. Add corresponding data generator to generateRowData function
 * 3. Add bulk action handler to BULK_ACTION_HANDLERS if needed
 * 
 * EXAMPLE USAGE:
 * ```javascript
 * // Get configuration for a specific content type
 * const config = getContentTypeConfig('risks');
 * 
 * // Generate sample data for a content type
 * const rowData = generateRowData('risks', 1, ['Owner1'], ['Active']);
 * 
 * // Execute a bulk action
 * executeBulkAction('bulkRiskAssessment', ['R-001', 'R-002']);
 * ```
 */

/* ==========================================================================
   CONTENT TYPE CONFIGURATIONS
   Defines all supported content types for the listView.html page
   ========================================================================== */

/**
 * LISTVIEW_CONTENT_TYPES Object Structure:
 * Each content type configuration includes:
 * 
 * @property {string} title - Main page title (e.g., "Risk Register")
 * @property {string} subtitle - Page subtitle/description
 * @property {string} listTitle - Title for the list/table section
 * @property {string} addButtonText - Text for the "Add" button
 * @property {string} addButtonAction - JavaScript code to execute when "Add" is clicked
 * @property {string} bulkPrimaryText - Text for the primary bulk action button
 * @property {string} bulkPrimaryAction - Function name for bulk action handler
 * @property {string} chatContext - Context string for AI chat integration
 * @property {string} breadcrumb - Breadcrumb navigation string
 * @property {string} category - Category for grouping (governance, monitoring, people)
 * @property {Array} filters - Array of filter configurations
 * @property {Array} headers - Array of table column headers
 * 
 * FILTER CONFIGURATION:
 * Each filter object includes:
 * - id: HTML element ID for the filter dropdown
 * - label: Display label for the filter
 * - options: Array of available filter options (first option = "All")
 * 
 * USAGE EXAMPLE:
 * ```javascript
 * const riskConfig = LISTVIEW_CONTENT_TYPES.risks;
 * console.log(riskConfig.title); // "Risk Register"
 * console.log(riskConfig.filters[0].options); // ["All Levels", "Low", "Medium", ...]
 * ```
 */
const LISTVIEW_CONTENT_TYPES = {
  // AI Governance Module
  ai_systems: {
    title: "AI System Inventory",
    subtitle: "AI Governance & EU AI Act Compliance",
    listTitle: "AI Systems Registry",
    addButtonText: "Add AI System",
    addButtonAction: "location.href='wizard.html?framework=eu_ai_act'",
    bulkPrimaryText: "Bulk AI Assessment",
    bulkPrimaryAction: "bulkAIAssessment",
    chatContext: "AI Governance",
    breadcrumb: "AI Governance > System Inventory",
    category: "governance",
    filters: [
      { id: "riskFilter", label: "Risk Level", options: ["All Levels", "Low", "Medium", "High", "Unacceptable"] },
      { id: "classificationFilter", label: "Classification", options: ["All Classifications", "General AI", "High-Risk AI", "Prohibited AI"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Development", "Testing", "Operational", "Decommissioned"] },
      { id: "ownerFilter", label: "Owner", options: ["All Owners", "John Smith", "Sarah Johnson", "AI Team"] }
    ],
    headers: ["System Name", "Classification", "Risk Level", "Owner", "Status", "Last Assessment", "Actions"]
  },

  // Risk Management Module
  risks: {
    title: "Risk Register",
    subtitle: "Unified Risk Management",
    listTitle: "Risk Register",
    addButtonText: "Add Risk",
    addButtonAction: "location.href='wizard.html?framework=risk_assessment'",
    bulkPrimaryText: "Bulk Risk Assessment",
    bulkPrimaryAction: "bulkRiskAssessment",
    chatContext: "Risk Management",
    breadcrumb: "Risk Management > Risk Register",
    category: "governance",
    filters: [
      { id: "levelFilter", label: "Risk Level", options: ["All Levels", "Low", "Medium", "High", "Critical"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Open", "In Progress", "Closed", "Accepted"] },
      { id: "ownerFilter", label: "Owner", options: ["All Owners", "John Smith", "Sarah Johnson", "Risk Team"] },
      { id: "categoryFilter", label: "Category", options: ["All Categories", "Operational", "Financial", "Strategic", "Compliance"] }
    ],
    headers: ["Risk ID", "Description", "Level", "Owner", "Status", "Next Review", "Actions"]
  },

  // Asset Management Module
  assets: {
    title: "Asset Inventory",
    subtitle: "Asset Register & Classification",
    listTitle: "Asset Inventory",
    addButtonText: "Add Asset",
    addButtonAction: "location.href='wizard.html?framework=asset_classification'",
    bulkPrimaryText: "Bulk Asset Classification",
    bulkPrimaryAction: "bulkAssetClassification",
    chatContext: "Asset Management",
    breadcrumb: "Assets > Asset Inventory",
    category: "governance",
    filters: [
      { id: "typeFilter", label: "Asset Type", options: ["All Types", "Information Asset", "IT System", "Facility", "Personnel"] },
      { id: "classificationFilter", label: "Classification", options: ["All Classifications", "Public", "Internal", "Confidential", "Restricted"] },
      { id: "ownerFilter", label: "Owner", options: ["All Owners", "IT Team", "Data Team", "Finance Dept", "HR Team"] },
      { id: "locationFilter", label: "Location", options: ["All Locations", "Cloud", "On-Premise", "Hybrid"] }
    ],
    headers: ["Asset ID", "Name", "Type", "Classification", "Owner", "Location", "Actions"]
  },

  controls: {
    title: "Security Controls",
    subtitle: "Security Controls & Safeguards",
    listTitle: "Security Controls",
    addButtonText: "Add Control",
    addButtonAction: "location.href='wizard.html?framework=security_control'",
    bulkPrimaryText: "Bulk Control Assessment",
    bulkPrimaryAction: "bulkControlAssessment",
    chatContext: "Asset Management",
    breadcrumb: "Assets > Security Controls",
    category: "governance",
    filters: [
      { id: "typeFilter", label: "Control Type", options: ["All Types", "Preventive", "Detective", "Corrective", "Compensating"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Implemented", "In Progress", "Planned", "Not Implemented"] },
      { id: "effectivenessFilter", label: "Effectiveness", options: ["All Levels", "High", "Medium", "Low", "Unknown"] },
      { id: "frameworkFilter", label: "Framework", options: ["All Frameworks", "ISO 27001", "NIST", "SOC 2", "GDPR"] }
    ],
    headers: ["Control ID", "Description", "Type", "Status", "Effectiveness", "Owner", "Actions"]
  },

  // Policy Management Module
  policies: {
    title: "Policy Library",
    subtitle: "Policy Management & Documentation",
    listTitle: "Policy Library",
    addButtonText: "Create Policy",
    addButtonAction: "location.href='documentEditor.html?type=policy'",
    bulkPrimaryText: "Bulk Review",
    bulkPrimaryAction: "bulkPolicyReview",
    chatContext: "Policy Management",
    breadcrumb: "Policy Management > Policy Library",
    category: "governance",
    filters: [
      { id: "typeFilter", label: "Policy Type", options: ["All Types", "Security", "Privacy", "HR", "Finance", "Operational"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Draft", "Under Review", "Approved", "Archived"] },
      { id: "ownerFilter", label: "Owner", options: ["All Owners", "Legal Team", "HR Team", "IT Team", "Compliance Team"] }
    ],
    headers: ["Policy ID", "Title", "Type", "Status", "Owner", "Last Updated", "Actions"]
  },

  approvals: {
    title: "Approval Workflow",
    subtitle: "Document Approval & Review Process",
    listTitle: "Approval Workflow",
    addButtonText: "Create Approval",
    addButtonAction: "location.href='wizard.html?framework=approval_workflow'",
    bulkPrimaryText: "Bulk Approve",
    bulkPrimaryAction: "bulkApprovalProcess",
    chatContext: "Policy Management",
    breadcrumb: "Policy Management > Approval Workflow",
    category: "governance",
    filters: [
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Pending", "Under Review", "Approved", "Rejected"] },
      { id: "typeFilter", label: "Document Type", options: ["All Types", "Policy", "Procedure", "Form", "Report"] },
      { id: "approverFilter", label: "Approver", options: ["All Approvers", "Management", "Legal Team", "Compliance Team"] }
    ],
    headers: ["Request ID", "Document", "Type", "Status", "Approver", "Submitted Date", "Actions"]
  },

  // Vendor Management Module
  vendors: {
    title: "Vendor Register",
    subtitle: "Third-Party Risk Management",
    listTitle: "Vendor Register",
    addButtonText: "Add Vendor",
    addButtonAction: "location.href='wizard.html?framework=vendor_assessment'",
    bulkPrimaryText: "Bulk Assessment",
    bulkPrimaryAction: "bulkVendorAssessment",
    chatContext: "Vendor Management",
    breadcrumb: "Vendor Management > Vendor Register",
    category: "governance",
    filters: [
      { id: "riskFilter", label: "Risk Level", options: ["All Levels", "Low", "Medium", "High", "Critical"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Active", "Under Review", "Suspended", "Terminated"] },
      { id: "categoryFilter", label: "Category", options: ["All Categories", "IT Services", "Cloud Provider", "Consultant", "Supplier"] }
    ],
    headers: ["Vendor ID", "Name", "Category", "Risk Level", "Status", "Last Assessment", "Actions"]
  },

  vendor_assessments: {
    title: "Vendor Security Assessments",
    subtitle: "Vendor Security & Compliance Assessments",
    listTitle: "Vendor Security Assessments",
    addButtonText: "New Assessment",
    addButtonAction: "location.href='wizard.html?framework=vendor_security_assessment'",
    bulkPrimaryText: "Bulk Process",
    bulkPrimaryAction: "bulkVendorAssessmentProcess",
    chatContext: "Vendor Management",
    breadcrumb: "Vendor Management > Security Assessments",
    category: "governance",
    filters: [
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Scheduled", "In Progress", "Completed", "Overdue"] },
      { id: "typeFilter", label: "Assessment Type", options: ["All Types", "Initial", "Annual", "Ad-hoc", "Renewal"] },
      { id: "riskFilter", label: "Risk Rating", options: ["All Ratings", "Low", "Medium", "High", "Critical"] }
    ],
    headers: ["Assessment ID", "Vendor", "Type", "Status", "Risk Rating", "Due Date", "Actions"]
  },

  contracts: {
    title: "Contracts & DPAs",
    subtitle: "Vendor Contracts & Data Processing Agreements",
    listTitle: "Contracts & DPAs",
    addButtonText: "Add Contract",
    addButtonAction: "location.href='wizard.html?framework=contract_dpa'",
    bulkPrimaryText: "Bulk Review",
    bulkPrimaryAction: "bulkContractReview",
    chatContext: "Vendor Management",
    breadcrumb: "Vendor Management > Contracts & DPAs",
    category: "governance",
    filters: [
      { id: "typeFilter", label: "Contract Type", options: ["All Types", "Service Agreement", "DPA", "SLA", "NDA"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Active", "Expired", "Under Review", "Terminated"] },
      { id: "renewalFilter", label: "Renewal Status", options: ["All Statuses", "Due Soon", "Overdue", "Renewed", "N/A"] }
    ],
    headers: ["Contract ID", "Vendor", "Type", "Status", "Expiry Date", "Renewal Status", "Actions"]
  },

  // Incident Management Module
  incidents: {
    title: "Incident Register",
    subtitle: "Security Incident Management",
    listTitle: "Incident Register",
    addButtonText: "Report Incident",
    addButtonAction: "location.href='wizard.html?framework=incident_response'",
    bulkPrimaryText: "Bulk Process",
    bulkPrimaryAction: "bulkIncidentProcess",
    chatContext: "Incident Management",
    breadcrumb: "Incident Management > Incident Register",
    category: "monitoring",
    filters: [
      { id: "severityFilter", label: "Severity", options: ["All Severities", "Low", "Medium", "High", "Critical"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Open", "In Progress", "Resolved", "Closed"] },
      { id: "typeFilter", label: "Type", options: ["All Types", "Data Breach", "Security Incident", "System Outage", "Compliance Issue"] }
    ],
    headers: ["Incident ID", "Description", "Severity", "Status", "Assigned To", "Created Date", "Actions"]
  },

  breaches: {
    title: "Breach Notifications",
    subtitle: "Data Breach Notification & Reporting",
    listTitle: "Breach Notifications",
    addButtonText: "Report Breach",
    addButtonAction: "location.href='wizard.html?framework=breach_notification'",
    bulkPrimaryText: "Bulk Process",
    bulkPrimaryAction: "bulkBreachProcess",
    chatContext: "Incident Management",
    breadcrumb: "Incident Management > Breach Notifications",
    category: "monitoring",
    filters: [
      { id: "severityFilter", label: "Severity", options: ["All Severities", "Low", "Medium", "High", "Critical"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Reported", "Under Investigation", "Resolved", "Closed"] },
      { id: "typeFilter", label: "Type", options: ["All Types", "Personal Data", "Financial", "Confidential", "System"] }
    ],
    headers: ["Breach ID", "Description", "Severity", "Status", "Notification Date", "Affected Records", "Actions"]
  },

  response_plans: {
    title: "Response Plans",
    subtitle: "Incident Response Procedures & Playbooks",
    listTitle: "Response Plans",
    addButtonText: "Create Plan",
    addButtonAction: "location.href='wizard.html?framework=response_plan'",
    bulkPrimaryText: "Bulk Review",
    bulkPrimaryAction: "bulkResponsePlanReview",
    chatContext: "Incident Management",
    breadcrumb: "Incident Management > Response Plans",
    category: "monitoring",
    filters: [
      { id: "typeFilter", label: "Type", options: ["All Types", "Security Incident", "Data Breach", "System Outage", "Natural Disaster"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Active", "Under Review", "Draft", "Archived"] },
      { id: "lastReviewFilter", label: "Last Review", options: ["All Periods", "Within 6 Months", "Within 1 Year", "Over 1 Year"] }
    ],
    headers: ["Plan ID", "Title", "Type", "Status", "Last Review", "Next Review", "Actions"]
  },

  // Audit Management Module
  findings: {
    title: "Findings & Actions",
    subtitle: "Audit Findings & Corrective Actions",
    listTitle: "Audit Findings",
    addButtonText: "Add Finding",
    addButtonAction: "location.href='wizard.html?framework=audit_finding'",
    bulkPrimaryText: "Bulk Process",
    bulkPrimaryAction: "bulkFindingsProcess",
    chatContext: "Audit Management",
    breadcrumb: "Audits & Reviews > Findings & Actions",
    category: "monitoring",
    filters: [
      { id: "severityFilter", label: "Severity", options: ["All Severities", "Low", "Medium", "High", "Critical"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Open", "In Progress", "Closed", "Verified"] },
      { id: "auditFilter", label: "Audit Type", options: ["All Types", "Internal", "External", "Compliance", "Security"] }
    ],
    headers: ["Finding ID", "Description", "Severity", "Status", "Assigned To", "Due Date", "Actions"]
  },

  // Training & Awareness Module
  training: {
    title: "Training Catalog",
    subtitle: "Available Training Courses & Materials",
    listTitle: "Training Catalog",
    addButtonText: "Add Course",
    addButtonAction: "location.href='wizard.html?framework=training_course'",
    bulkPrimaryText: "Bulk Assign",
    bulkPrimaryAction: "bulkTrainingAssign",
    chatContext: "Training & Awareness",
    breadcrumb: "Training & Awareness > Training Catalog",
    category: "people",
    filters: [
      { id: "categoryFilter", label: "Category", options: ["All Categories", "Security", "Privacy", "Compliance", "Technical"] },
      { id: "typeFilter", label: "Type", options: ["All Types", "Online", "In-Person", "Video", "Document"] },
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Active", "Draft", "Archived"] }
    ],
    headers: ["Course ID", "Title", "Category", "Type", "Duration", "Status", "Actions"]
  },

  training_records: {
    title: "Training Records",
    subtitle: "Employee Training Completion & Certificates",
    listTitle: "Training Records",
    addButtonText: "Add Record",
    addButtonAction: "location.href='wizard.html?framework=training_record'",
    bulkPrimaryText: "Bulk Update",
    bulkPrimaryAction: "bulkTrainingUpdate",
    chatContext: "Training & Awareness",
    breadcrumb: "Training & Awareness > Training Records",
    category: "people",
    filters: [
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Completed", "In Progress", "Overdue", "Not Started"] },
      { id: "employeeFilter", label: "Employee", options: ["All Employees", "John Smith", "Sarah Johnson", "Mike Wilson"] },
      { id: "courseFilter", label: "Course", options: ["All Courses", "Security Awareness", "GDPR Training", "ISO 27001"] }
    ],
    headers: ["Record ID", "Employee", "Course", "Status", "Completion Date", "Certificate", "Actions"]
  },

  campaigns: {
    title: "Awareness Campaigns",
    subtitle: "Security & Compliance Awareness Initiatives",
    listTitle: "Awareness Campaigns",
    addButtonText: "Create Campaign",
    addButtonAction: "location.href='wizard.html?framework=awareness_campaign'",
    bulkPrimaryText: "Bulk Launch",
    bulkPrimaryAction: "bulkCampaignLaunch",
    chatContext: "Training & Awareness",
    breadcrumb: "Training & Awareness > Awareness Campaigns",
    category: "people",
    filters: [
      { id: "statusFilter", label: "Status", options: ["All Statuses", "Planning", "Active", "Completed", "Paused"] },
      { id: "typeFilter", label: "Type", options: ["All Types", "Email", "Poster", "Workshop", "Quiz"] },
      { id: "topicFilter", label: "Topic", options: ["All Topics", "Phishing", "Password Security", "Data Protection"] }
    ],
    headers: ["Campaign ID", "Title", "Type", "Status", "Start Date", "Reach", "Actions"]
  }
};

/* ==========================================================================
   DATA GENERATION UTILITIES
   Functions to generate appropriate sample data for each content type
   ========================================================================== */

/* ==========================================================================
   DATA GENERATION UTILITIES
   Functions to generate appropriate sample data for each content type
   ========================================================================== */

/**
 * GENERATEROWDATA FUNCTION:
 * Generates sample row data based on content type for testing and demonstration
 * 
 * @param {string} type - Content type identifier (e.g., 'risks', 'assets')
 * @param {number} index - Row index for unique IDs and variation
 * @param {Array} owners - Array of possible owners/assignees
 * @param {Array} statuses - Array of possible status values
 * @returns {Object} Row data object with properties matching the content type
 * 
 * HOW IT WORKS:
 * 1. Creates a unique ID using type prefix and padded index
 * 2. Generates a sample date based on the index
 * 3. Uses the dataGenerators object to create type-specific data
 * 4. Returns an object with properties that match the table headers
 * 
 * ADDING NEW CONTENT TYPES:
 * To add a new content type, add an entry to the dataGenerators object:
 * ```javascript
 * new_type: () => ({
 *   id: id,
 *   name: `New Item ${index}`,
 *   property: values[index % values.length],
 *   // ... other properties
 * })
 * ```
 * 
 * USAGE EXAMPLE:
 * ```javascript
 * const riskData = generateRowData('risks', 5, ['John', 'Jane'], ['Open', 'Closed']);
 * // Returns: { id: 'RI-005', description: 'Risk Item 5', level: 'Medium', ... }
 * ```
 */
function generateRowData(type, index, owners, statuses) {
  const id = `${type.toUpperCase().substring(0, 2)}-${String(index).padStart(3, "0")}`;
  const date = `2024-12-${String((index % 28) + 1).padStart(2, "0")}`;
  
  // Content type specific data generation
  const dataGenerators = {
    ai_systems: () => ({
      id: id,
      name: `AI System ${index}`,
      classification: ["General AI", "High-Risk AI", "Prohibited AI"][index % 3],
      risk: ["Low", "Medium", "High", "Unacceptable"][index % 4],
      owner: owners[index % owners.length],
      status: ["Development", "Testing", "Operational", "Decommissioned"][index % 4],
      lastAssessment: date
    }),
    
    risks: () => ({
      id: id,
      description: `Risk Item ${index}`,
      level: ["Low", "Medium", "High", "Critical"][index % 4],
      owner: owners[index % owners.length],
      status: ["Open", "In Progress", "Closed", "Accepted"][index % 4],
      nextReview: date
    }),
    
    assets: () => ({
      id: id,
      name: `Asset ${index}`,
      type: ["Information Asset", "IT System", "Facility"][index % 3],
      classification: ["Public", "Internal", "Confidential", "Restricted"][index % 4],
      owner: owners[index % owners.length],
      location: ["Cloud", "On-Premise", "Hybrid"][index % 3]
    }),
    
    controls: () => ({
      id: id,
      description: `Security Control ${index}`,
      type: ["Preventive", "Detective", "Corrective", "Compensating"][index % 4],
      status: ["Implemented", "In Progress", "Planned", "Not Implemented"][index % 4],
      effectiveness: ["High", "Medium", "Low", "Unknown"][index % 4],
      owner: owners[index % owners.length]
    }),
    
    policies: () => ({
      id: id,
      title: `Policy ${index}`,
      type: ["Security", "Privacy", "HR", "Finance", "Operational"][index % 5],
      status: ["Draft", "Under Review", "Approved", "Archived"][index % 4],
      owner: owners[index % owners.length],
      lastUpdated: date
    }),
    
    approvals: () => ({
      id: id,
      document: `Document ${index}`,
      type: ["Policy", "Procedure", "Form", "Report"][index % 4],
      status: ["Pending", "Under Review", "Approved", "Rejected"][index % 4],
      approver: owners[index % owners.length],
      submittedDate: date
    }),
    
    vendors: () => ({
      id: id,
      name: `Vendor ${index}`,
      category: ["IT Services", "Cloud Provider", "Consultant", "Supplier"][index % 4],
      risk: ["Low", "Medium", "High", "Critical"][index % 4],
      status: ["Active", "Under Review", "Suspended", "Terminated"][index % 4],
      lastAssessment: date
    }),
    
    vendor_assessments: () => ({
      id: id,
      vendor: `Vendor ${index}`,
      type: ["Initial", "Annual", "Ad-hoc", "Renewal"][index % 4],
      status: ["Scheduled", "In Progress", "Completed", "Overdue"][index % 4],
      riskRating: ["Low", "Medium", "High", "Critical"][index % 4],
      dueDate: date
    }),
    
    contracts: () => ({
      id: id,
      vendor: `Vendor ${index}`,
      type: ["Service Agreement", "DPA", "SLA", "NDA"][index % 4],
      status: ["Active", "Expired", "Under Review", "Terminated"][index % 4],
      expiryDate: date,
      renewalStatus: ["Due Soon", "Overdue", "Renewed", "N/A"][index % 4]
    }),
    
    incidents: () => ({
      id: id,
      description: `Incident ${index}`,
      severity: ["Low", "Medium", "High", "Critical"][index % 4],
      status: ["Open", "In Progress", "Resolved", "Closed"][index % 4],
      assignedTo: owners[index % owners.length],
      createdDate: date
    }),
    
    breaches: () => ({
      id: id,
      description: `Breach ${index}`,
      severity: ["Low", "Medium", "High", "Critical"][index % 4],
      status: ["Reported", "Under Investigation", "Resolved", "Closed"][index % 4],
      notificationDate: date,
      affectedRecords: Math.floor(Math.random() * 10000) + 1
    }),
    
    response_plans: () => ({
      id: id,
      title: `Response Plan ${index}`,
      type: ["Security Incident", "Data Breach", "System Outage", "Natural Disaster"][index % 4],
      status: ["Active", "Under Review", "Draft", "Archived"][index % 4],
      lastReview: date,
      nextReview: date
    }),
    
    findings: () => ({
      id: id,
      description: `Finding ${index}`,
      severity: ["Low", "Medium", "High", "Critical"][index % 4],
      status: ["Open", "In Progress", "Closed", "Verified"][index % 4],
      assignedTo: owners[index % owners.length],
      dueDate: date
    }),
    
    training: () => ({
      id: id,
      title: `Training Course ${index}`,
      category: ["Security", "Privacy", "Compliance", "Technical"][index % 4],
      type: ["Online", "In-Person", "Video", "Document"][index % 4],
      duration: `${Math.floor(Math.random() * 8) + 1} hours`,
      status: ["Active", "Draft", "Archived"][index % 3]
    }),
    
    training_records: () => ({
      id: id,
      employee: owners[index % owners.length],
      course: `Training Course ${index}`,
      status: ["Completed", "In Progress", "Overdue", "Not Started"][index % 4],
      completionDate: date,
      certificate: ["Yes", "No", "Pending"][index % 3]
    }),
    
    campaigns: () => ({
      id: id,
      title: `Campaign ${index}`,
      type: ["Email", "Poster", "Workshop", "Quiz"][index % 4],
      status: ["Planning", "Active", "Completed", "Paused"][index % 4],
      startDate: date,
      reach: Math.floor(Math.random() * 1000) + 100
    })
  };
  
  // Return generated data or default fallback
  return dataGenerators[type] ? dataGenerators[type]() : {
    id: id,
    name: `Item ${index}`,
    type: "General",
    status: statuses[index % statuses.length],
    owner: owners[index % owners.length],
    created: date
  };
}

/* ==========================================================================
   BULK ACTION HANDLERS
   Functions to handle bulk operations for each content type
   ========================================================================== */

/* ==========================================================================
   BULK ACTION HANDLERS
   Functions to handle bulk operations for each content type
   ========================================================================== */

/**
 * BULK_ACTION_HANDLERS Object:
 * Contains functions that handle bulk operations for different content types
 * 
 * FUNCTION SIGNATURE:
 * Each handler function receives:
 * @param {Array} selectedItems - Array of selected item IDs
 * 
 * WHAT THESE FUNCTIONS DO:
 * - Display user feedback via showNotification()
 * - Log actions to console for debugging
 * - In a real implementation, would make API calls or perform actual operations
 * 
 * ADDING NEW BULK ACTIONS:
 * 1. Add a new function to this object with a descriptive name
 * 2. Reference the function name in the content type's bulkPrimaryAction
 * 3. Implement the actual business logic (API calls, etc.)
 * 
 * USAGE EXAMPLE:
 * ```javascript
 * // This is called automatically when user clicks bulk action button
 * BULK_ACTION_HANDLERS.bulkRiskAssessment(['R-001', 'R-002']);
 * ```
 * 
 * INTEGRATION WITH CONTENT TYPES:
 * Each content type's bulkPrimaryAction should match a function name here:
 * ```javascript
 * risks: {
 *   bulkPrimaryAction: "bulkRiskAssessment",  // Must match function name below
 *   // ... other config
 * }
 * ```
 */
const BULK_ACTION_HANDLERS = {
  // AI Governance
  bulkAIAssessment: (selectedItems) => {
    showNotification(`Starting AI assessment for ${selectedItems.length} systems`, "info");
    console.log("Bulk AI Assessment for:", selectedItems);
  },
  
  // Risk Management
  bulkRiskAssessment: (selectedItems) => {
    showNotification(`Starting risk assessment for ${selectedItems.length} risks`, "info");
    console.log("Bulk Risk Assessment for:", selectedItems);
  },
  
  // Asset Management
  bulkAssetClassification: (selectedItems) => {
    showNotification(`Starting asset classification for ${selectedItems.length} assets`, "info");
    console.log("Bulk Asset Classification for:", selectedItems);
  },
  
  bulkControlAssessment: (selectedItems) => {
    showNotification(`Starting control assessment for ${selectedItems.length} controls`, "info");
    console.log("Bulk Control Assessment for:", selectedItems);
  },
  
  // Policy Management
  bulkPolicyReview: (selectedItems) => {
    showNotification(`Starting policy review for ${selectedItems.length} policies`, "info");
    console.log("Bulk Policy Review for:", selectedItems);
  },
  
  bulkApprovalProcess: (selectedItems) => {
    showNotification(`Processing ${selectedItems.length} approval requests`, "info");
    console.log("Bulk Approval Process for:", selectedItems);
  },
  
  // Vendor Management
  bulkVendorAssessment: (selectedItems) => {
    showNotification(`Starting vendor assessment for ${selectedItems.length} vendors`, "info");
    console.log("Bulk Vendor Assessment for:", selectedItems);
  },
  
  bulkVendorAssessmentProcess: (selectedItems) => {
    showNotification(`Processing ${selectedItems.length} vendor assessments`, "info");
    console.log("Bulk Vendor Assessment Process for:", selectedItems);
  },
  
  bulkContractReview: (selectedItems) => {
    showNotification(`Starting contract review for ${selectedItems.length} contracts`, "info");
    console.log("Bulk Contract Review for:", selectedItems);
  },
  
  // Incident Management
  bulkIncidentProcess: (selectedItems) => {
    showNotification(`Processing ${selectedItems.length} incidents`, "info");
    console.log("Bulk Incident Processing for:", selectedItems);
  },
  
  bulkBreachProcess: (selectedItems) => {
    showNotification(`Processing ${selectedItems.length} breach notifications`, "info");
    console.log("Bulk Breach Processing for:", selectedItems);
  },
  
  bulkResponsePlanReview: (selectedItems) => {
    showNotification(`Reviewing ${selectedItems.length} response plans`, "info");
    console.log("Bulk Response Plan Review for:", selectedItems);
  },
  
  // Audit Management
  bulkFindingsProcess: (selectedItems) => {
    showNotification(`Processing ${selectedItems.length} findings`, "info");
    console.log("Bulk Findings Processing for:", selectedItems);
  },
  
  // Training & Awareness
  bulkTrainingAssign: (selectedItems) => {
    showNotification(`Assigning ${selectedItems.length} training courses`, "info");
    console.log("Bulk Training Assignment for:", selectedItems);
  },
  
  bulkTrainingUpdate: (selectedItems) => {
    showNotification(`Updating ${selectedItems.length} training records`, "info");
    console.log("Bulk Training Update for:", selectedItems);
  },
  
  bulkCampaignLaunch: (selectedItems) => {
    showNotification(`Launching ${selectedItems.length} awareness campaigns`, "info");
    console.log("Bulk Campaign Launch for:", selectedItems);
  }
};

/* ==========================================================================
   UTILITY FUNCTIONS
   Helper functions for content type operations
   ========================================================================== */

/* ==========================================================================
   UTILITY FUNCTIONS
   Helper functions for content type operations
   ========================================================================== */

/**
 * UTILITY FUNCTIONS OVERVIEW:
 * These functions provide a clean API for interacting with content type configurations
 * They are used by listView-logic.js and can be used by other pages that need
 * similar functionality.
 * 
 * MAIN FUNCTIONS:
 * - getContentTypeConfig(typeId): Get configuration for a specific content type
 * - getAllContentTypes(): Get list of all available content type IDs
 * - getContentTypesByCategory(category): Get content types by category
 * - executeBulkAction(actionName, items): Execute a bulk action handler
 * 
 * ERROR HANDLING:
 * All functions include proper error handling and return null/empty arrays
 * when requested content types or actions don't exist.
 */

/**
 * Gets content type configuration by type ID
 * 
 * @param {string} typeId - Content type identifier (e.g., 'risks', 'assets')
 * @returns {Object|null} Content type configuration object or null if not found
 * 
 * USAGE:
 * ```javascript
 * const config = getContentTypeConfig('risks');
 * if (config) {
 *   console.log(config.title); // "Risk Register"
 *   console.log(config.filters); // Array of filter configurations
 * }
 * ```
 */
function getContentTypeConfig(typeId) {
  return LISTVIEW_CONTENT_TYPES[typeId] || null;
}

/**
 * Gets all available content types
 * 
 * @returns {Array} Array of content type IDs
 * 
 * USAGE:
 * ```javascript
 * const allTypes = getAllContentTypes();
 * console.log(allTypes); // ['ai_systems', 'risks', 'assets', ...]
 * 
 * // Use to validate if a type exists
 * if (allTypes.includes('risks')) {
 *   // Process risks content type
 * }
 * ```
 */
function getAllContentTypes() {
  return Object.keys(LISTVIEW_CONTENT_TYPES);
}

/**
 * Gets content types by category
 * 
 * @param {string} category - Category name ('governance', 'monitoring', 'people')
 * @returns {Array} Array of content type configurations with typeId added
 * 
 * USAGE:
 * ```javascript
 * const governanceTypes = getContentTypesByCategory('governance');
 * governanceTypes.forEach(type => {
 *   console.log(`${type.typeId}: ${type.title}`);
 * });
 * // Output: 'risks: Risk Register', 'assets: Asset Inventory', etc.
 * ```
 */
function getContentTypesByCategory(category) {
  return Object.entries(LISTVIEW_CONTENT_TYPES)
    .filter(([_, config]) => config.category === category)
    .map(([typeId, config]) => ({ ...config, typeId }));
}

/**
 * Executes a bulk action handler
 * 
 * @param {string} actionName - Name of the bulk action function
 * @param {Array} selectedItems - Array of selected item IDs
 * 
 * USAGE:
 * ```javascript
 * const selectedItems = ['R-001', 'R-002', 'R-003'];
 * executeBulkAction('bulkRiskAssessment', selectedItems);
 * // This will call BULK_ACTION_HANDLERS.bulkRiskAssessment(selectedItems)
 * ```
 * 
 * ERROR HANDLING:
 * - If actionName doesn't exist, logs warning and shows error notification
 * - If selectedItems is empty, the individual handler should validate this
 * - All bulk action handlers should include proper error handling
 */
function executeBulkAction(actionName, selectedItems) {
  const handler = BULK_ACTION_HANDLERS[actionName];
  if (handler) {
    handler(selectedItems);
  } else {
    console.warn(`Unknown bulk action: ${actionName}`);
    showNotification(`Unknown bulk action: ${actionName}`, "error");
  }
}

/* ==========================================================================
   GLOBAL EXPORTS
   Export configurations and functions for use by other modules
   ========================================================================== */

/**
 * EXPORTS OVERVIEW:
 * This section exports all the configurations and functions so they can be
 * used by other JavaScript files in the application.
 * 
 * BROWSER ENVIRONMENT:
 * All exports are attached to the window object for global access:
 * - window.LISTVIEW_CONTENT_TYPES
 * - window.generateRowData
 * - window.getContentTypeConfig
 * - etc.
 * 
 * NODE.JS ENVIRONMENT:
 * All exports are available through module.exports for server-side use
 * 
 * USAGE IN OTHER FILES:
 * ```javascript
 * // In listView-logic.js or other files:
 * const config = getContentTypeConfig('risks');
 * const allTypes = getAllContentTypes();
 * executeBulkAction('bulkRiskAssessment', selectedItems);
 * ```
 * 
 * DEBUGGING:
 * All exported functions and objects are available in the browser console:
 * ```javascript
 * // In browser console:
 * console.log(window.LISTVIEW_CONTENT_TYPES);
 * console.log(window.getAllContentTypes());
 * ```
 */

// Export for browser environment
if (typeof window !== "undefined") {
  window.LISTVIEW_CONTENT_TYPES = LISTVIEW_CONTENT_TYPES;
  window.BULK_ACTION_HANDLERS = BULK_ACTION_HANDLERS;
  window.generateRowData = generateRowData;
  window.getContentTypeConfig = getContentTypeConfig;
  window.getAllContentTypes = getAllContentTypes;
  window.getContentTypesByCategory = getContentTypesByCategory;
  window.executeBulkAction = executeBulkAction;
}

// Export for Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LISTVIEW_CONTENT_TYPES,
    BULK_ACTION_HANDLERS,
    generateRowData,
    getContentTypeConfig,
    getAllContentTypes,
    getContentTypesByCategory,
    executeBulkAction
  };
}

console.log("📋 ListView Content Configuration loaded successfully");
console.log(`   - ${Object.keys(LISTVIEW_CONTENT_TYPES).length} content types configured`);
console.log(`   - ${Object.keys(BULK_ACTION_HANDLERS).length} bulk action handlers available`);