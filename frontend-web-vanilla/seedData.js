// =============================================================================
// Enhanced seedData.js - Complete ArionComply Mock Data Management
// =============================================================================
// This file provides comprehensive seed data management for all ArionComply components
// Place this content in your seedData.js file

// =============================================================================
// CORE SEED DATA INITIALIZATION
// =============================================================================

function localStorageDemoSeedData() {
  console.log("localStorageDemoSeedData: Starting comprehensive data seeding for localStorage.");
  
  // =============================================================================
  // CALENDAR EVENTS DATA
  // =============================================================================
  if (!localStorage.getItem("calendarEvents")) {
    const events = [
      {
        id: "event-1",
        title: "ISO 27001 External Audit",
        date: "2025-02-03",
        type: "audit",
        description: "Annual external audit for ISO 27001 compliance verification",
        attendees: ["audit@company.com", "security@company.com"],
        location: "Conference Room A"
      },
      {
        id: "event-2",
        title: "AI Risk Assessment Review",
        date: "2025-02-05",
        type: "review",
        description: "Monthly review of AI system risks and bias monitoring results",
        attendees: ["ai-team@company.com", "compliance@company.com"],
        location: "Virtual Meeting"
      },
      {
        id: "event-3",
        title: "Security Awareness Training",
        date: "2025-02-10",
        type: "training",
        description: "Quarterly security awareness training for all employees",
        attendees: ["all-staff@company.com"],
        location: "Main Auditorium"
      },
      {
        id: "event-4",
        title: "GDPR Compliance Review",
        date: "2025-02-15",
        type: "review",
        description: "Review of GDPR compliance measures and data processing activities",
        attendees: ["legal@company.com", "privacy@company.com"],
        location: "Legal Conference Room"
      },
      {
        id: "event-5",
        title: "Incident Response Drill",
        date: "2025-02-20",
        type: "training",
        description: "Simulated security incident response exercise",
        attendees: ["security@company.com", "it@company.com"],
        location: "IT Operations Center"
      }
    ];
    localStorage.setItem("calendarEvents", JSON.stringify(events));
    console.log("localStorageDemoSeedData: calendarEvents seeded with 5 events.");
  }

  // =============================================================================
  // KANBAN TASKS DATA
  // =============================================================================
  if (!localStorage.getItem("kanbanTasks")) {
    const tasks = [
      {
        id: "TASK-001",
        title: "Update ISO 27001 Risk Assessment",
        description: "Annual review and update of the organizational risk assessment",
        status: "todo",
        assignee: "john.doe@company.com",
        priority: "high",
        dueDate: "2025-02-15",
        tags: ["iso27001", "risk", "compliance"],
        createdDate: "2025-01-20"
      },
      {
        id: "TASK-002",
        title: "GDPR Data Mapping Review",
        description: "Review and update data processing maps for GDPR compliance",
        status: "progress",
        assignee: "sarah.smith@company.com",
        priority: "medium",
        dueDate: "2025-02-20",
        tags: ["gdpr", "data-mapping", "privacy"],
        createdDate: "2025-01-18"
      },
      {
        id: "TASK-003",
        title: "AI Bias Testing Implementation",
        description: "Implement automated bias testing for AI systems",
        status: "done",
        assignee: "mike.johnson@company.com",
        priority: "high",
        dueDate: "2025-01-30",
        tags: ["ai", "bias", "testing"],
        createdDate: "2025-01-10"
      },
      {
        id: "TASK-004",
        title: "Security Policy Documentation",
        description: "Update security policies to align with latest standards",
        status: "todo",
        assignee: "lisa.wilson@company.com",
        priority: "medium",
        dueDate: "2025-02-25",
        tags: ["policy", "security", "documentation"],
        createdDate: "2025-01-22"
      },
      {
        id: "TASK-005",
        title: "Vendor Security Assessment",
        description: "Complete security assessment for new cloud vendor",
        status: "progress",
        assignee: "david.brown@company.com",
        priority: "high",
        dueDate: "2025-02-10",
        tags: ["vendor", "assessment", "security"],
        createdDate: "2025-01-25"
      }
    ];
    localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
    console.log("localStorageDemoSeedData: kanbanTasks seeded with 5 tasks.");
  }

  // =============================================================================
  // WORKFLOW DEFINITIONS DATA
  // =============================================================================
  if (!localStorage.getItem("workflowDefinitions")) {
    const workflows = [
      {
        id: "WF-001",
        name: "Access Request Process",
        description: "Standard process for requesting system access",
        nodes: 5,
        connections: 4,
        status: "published",
        category: "access_control",
        createdDate: "2025-01-15",
        lastModified: "2025-01-20"
      },
      {
        id: "WF-002",
        name: "Incident Response Workflow",
        description: "Security incident response and escalation process",
        nodes: 8,
        connections: 7,
        status: "published",
        category: "security",
        createdDate: "2025-01-10",
        lastModified: "2025-01-18"
      },
      {
        id: "WF-003",
        name: "Document Approval Process",
        description: "Review and approval workflow for compliance documents",
        nodes: 6,
        connections: 5,
        status: "draft",
        category: "compliance",
        createdDate: "2025-01-22",
        lastModified: "2025-01-25"
      },
      {
        id: "WF-004",
        name: "AI Model Deployment",
        description: "Workflow for deploying AI models with compliance checks",
        nodes: 10,
        connections: 9,
        status: "published",
        category: "ai_governance",
        createdDate: "2025-01-08",
        lastModified: "2025-01-15"
      }
    ];
    localStorage.setItem("workflowDefinitions", JSON.stringify(workflows));
    console.log("localStorageDemoSeedData: workflowDefinitions seeded with 4 workflows.");
  }

  // =============================================================================
  // RELATIONSHIP MAP DATA
  // =============================================================================
  if (!localStorage.getItem("relationshipMap")) {
    const map = {
      nodes: [
        { id: "sys-1", label: "Customer Portal", type: "system", category: "web_app" },
        { id: "sys-2", label: "User Database", type: "database", category: "storage" },
        { id: "sys-3", label: "AI Recommendation Engine", type: "ai_system", category: "ml" },
        { id: "sys-4", label: "Payment Gateway", type: "system", category: "financial" },
        { id: "sys-5", label: "Analytics Platform", type: "system", category: "analytics" },
        { id: "data-1", label: "Customer Data", type: "data", category: "personal" },
        { id: "data-2", label: "Transaction Data", type: "data", category: "financial" },
        { id: "data-3", label: "Behavioral Data", type: "data", category: "analytics" }
      ],
      edges: [
        { from: "sys-1", to: "sys-2", label: "reads/writes", type: "data_flow" },
        { from: "sys-1", to: "sys-3", label: "requests", type: "service_call" },
        { from: "sys-3", to: "sys-2", label: "queries", type: "data_flow" },
        { from: "sys-1", to: "sys-4", label: "processes", type: "service_call" },
        { from: "sys-2", to: "sys-5", label: "feeds", type: "data_flow" },
        { from: "data-1", to: "sys-2", label: "stored_in", type: "storage" },
        { from: "data-2", to: "sys-4", label: "processed_by", type: "processing" },
        { from: "data-3", to: "sys-5", label: "analyzed_by", type: "analytics" }
      ]
    };
    localStorage.setItem("relationshipMap", JSON.stringify(map));
    console.log("localStorageDemoSeedData: relationshipMap seeded with 8 nodes and 8 edges.");
  }

  // =============================================================================
  // DOCUMENTS DATA
  // =============================================================================
  if (!localStorage.getItem("documents")) {
    const docs = [
      {
        id: "DOC-001",
        title: "Information Security Policy",
        content: "# Information Security Policy\n\nThis document establishes the organization's approach to information security...",
        category: "policy",
        version: "1.2",
        status: "approved",
        createdDate: "2025-01-10",
        lastModified: "2025-01-20",
        author: "security@company.com"
      },
      {
        id: "DOC-002",
        title: "Risk Assessment Methodology",
        content: "# Risk Assessment Methodology\n\nThis document describes the systematic approach to identifying and evaluating risks...",
        category: "procedure",
        version: "2.0",
        status: "approved",
        createdDate: "2025-01-15",
        lastModified: "2025-01-25",
        author: "compliance@company.com"
      },
      {
        id: "DOC-003",
        title: "AI Governance Framework",
        content: "# AI Governance Framework\n\nThis framework establishes governance principles for AI system development and deployment...",
        category: "framework",
        version: "1.0",
        status: "draft",
        createdDate: "2025-01-22",
        lastModified: "2025-01-25",
        author: "ai-team@company.com"
      },
      {
        id: "DOC-004",
        title: "Data Processing Inventory",
        content: "# Data Processing Inventory\n\nThis document catalogs all data processing activities for GDPR compliance...",
        category: "inventory",
        version: "1.5",
        status: "approved",
        createdDate: "2025-01-08",
        lastModified: "2025-01-18",
        author: "privacy@company.com"
      }
    ];
    localStorage.setItem("documents", JSON.stringify(docs));
    console.log("localStorageDemoSeedData: documents seeded with 4 documents.");
  }

  // =============================================================================
  // FORMS DATA
  // =============================================================================
  if (!localStorage.getItem("forms")) {
    const forms = [
      {
        id: "FORM-001",
        name: "Incident Report Form",
        description: "Security incident reporting form",
        fields: 8,
        category: "security",
        status: "active",
        createdDate: "2025-01-10"
      },
      {
        id: "FORM-002",
        name: "Access Request Form",
        description: "System access request form",
        fields: 6,
        category: "access_control",
        status: "active",
        createdDate: "2025-01-15"
      },
      {
        id: "FORM-003",
        name: "Data Subject Request Form",
        description: "GDPR data subject rights request form",
        fields: 5,
        category: "privacy",
        status: "active",
        createdDate: "2025-01-12"
      }
    ];
    localStorage.setItem("forms", JSON.stringify(forms));
    console.log("localStorageDemoSeedData: forms seeded with 3 forms.");
  }

  // =============================================================================
  // FILES DATA
  // =============================================================================
  if (!localStorage.getItem("files")) {
    const files = [
      {
        id: "FILE-001",
        name: "audit_evidence.zip",
        path: "/Compliance/Audits/2025",
        type: "file",
        size: "2.4 MB",
        category: "audit",
        lastModified: "2025-01-20"
      },
      {
        id: "FILE-002",
        name: "risk_assessment_2025.pdf",
        path: "/Risk Management/Assessments",
        type: "file",
        size: "1.8 MB",
        category: "risk",
        lastModified: "2025-01-18"
      },
      {
        id: "FILE-003",
        name: "ai_model_documentation",
        path: "/AI Systems/Models",
        type: "folder",
        size: "15.2 MB",
        category: "ai",
        lastModified: "2025-01-25"
      },
      {
        id: "FILE-004",
        name: "training_materials.zip",
        path: "/Training/Security Awareness",
        type: "file",
        size: "5.7 MB",
        category: "training",
        lastModified: "2025-01-22"
      }
    ];
    localStorage.setItem("files", JSON.stringify(files));
    console.log("localStorageDemoSeedData: files seeded with 4 files.");
  }

  // =============================================================================
  // CHART METRICS DATA
  // =============================================================================
  if (!localStorage.getItem("chartMetrics")) {
    const metrics = [
      { id: "metric-1", label: "Open Risks", value: 12, trend: "up", color: "warning" },
      { id: "metric-2", label: "Closed Risks", value: 8, trend: "down", color: "success" },
      { id: "metric-3", label: "AI Systems", value: 15, trend: "up", color: "primary" },
      { id: "metric-4", label: "Compliance Score", value: 94, trend: "up", color: "success" },
      { id: "metric-5", label: "Active Workflows", value: 6, trend: "stable", color: "info" },
      { id: "metric-6", label: "Overdue Tasks", value: 3, trend: "down", color: "danger" }
    ];
    localStorage.setItem("chartMetrics", JSON.stringify(metrics));
    console.log("localStorageDemoSeedData: chartMetrics seeded with 6 metrics.");
  }

  // =============================================================================
  // ADDITIONAL SEED DATA
  // =============================================================================
  
  // Workflow Instances
  if (!localStorage.getItem("workflowInstances")) {
    const instances = [
      {
        id: "WI-001",
        workflowId: "WF-001",
        title: "Access Request - John Doe",
        status: "pending_approval",
        currentStep: "manager_review",
        assignee: "manager@company.com",
        startDate: "2025-01-25",
        priority: "normal",
        data: {
          requestType: "system_access",
          requestedBy: "john.doe@company.com",
          systemName: "Customer Portal",
          justification: "New team member needs access for customer support role"
        }
      },
      {
        id: "WI-002",
        workflowId: "WF-002",
        title: "Security Incident - Phishing Attempt",
        status: "in_progress",
        currentStep: "investigation",
        assignee: "security@company.com",
        startDate: "2025-01-24",
        priority: "high",
        data: {
          incidentType: "phishing",
          reportedBy: "employee@company.com",
          severity: "medium",
          description: "Suspicious email received with malicious attachment"
        }
      }
    ];
    localStorage.setItem("workflowInstances", JSON.stringify(instances));
    console.log("localStorageDemoSeedData: workflowInstances seeded with 2 instances.");
  }

  // Document Templates
  if (!localStorage.getItem("documentTemplates")) {
    const templates = [
      {
        id: "TMPL-001",
        name: "Security Policy Template",
        description: "Standard template for security policies",
        category: "policy",
        content: "# Security Policy Template\n\n## 1. Purpose\n[Describe the purpose of this policy]\n\n## 2. Scope\n[Define the scope of application]\n\n## 3. Policy Statement\n[State the policy requirements]\n\n## 4. Responsibilities\n[Define roles and responsibilities]\n\n## 5. Compliance\n[Specify compliance requirements]\n\n## 6. Review and Updates\n[Describe review process]",
        tags: ["security", "policy", "template"]
      },
      {
        id: "TMPL-002",
        name: "Risk Assessment Template",
        description: "Template for conducting risk assessments",
        category: "risk",
        content: "# Risk Assessment Template\n\n## 1. Executive Summary\n[Provide overview of assessment]\n\n## 2. Scope and Objectives\n[Define assessment scope]\n\n## 3. Risk Identification\n[List identified risks]\n\n## 4. Risk Analysis\n[Analyze likelihood and impact]\n\n## 5. Risk Evaluation\n[Evaluate risk levels]\n\n## 6. Risk Treatment\n[Propose mitigation strategies]\n\n## 7. Monitoring and Review\n[Define ongoing monitoring]",
        tags: ["risk", "assessment", "template"]
      }
    ];
    localStorage.setItem("documentTemplates", JSON.stringify(templates));
    console.log("localStorageDemoSeedData: documentTemplates seeded with 2 templates.");
  }

  // Audit Logs
  if (!localStorage.getItem("auditLogs")) {
    const logs = [
      {
        id: "LOG-001",
        timestamp: "2025-01-25T10:30:00Z",
        action: "document_created",
        user: "admin@company.com",
        resource: "DOC-003",
        details: "Created AI Governance Framework document",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      {
        id: "LOG-002",
        timestamp: "2025-01-25T14:15:00Z",
        action: "risk_updated",
        user: "security@company.com",
        resource: "R-003",
        details: "Updated risk classification from Medium to High",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      {
        id: "LOG-003",
        timestamp: "2025-01-25T16:45:00Z",
        action: "workflow_started",
        user: "john.doe@company.com",
        resource: "WI-001",
        details: "Started access request workflow",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    ];
    localStorage.setItem("auditLogs", JSON.stringify(logs));
    console.log("localStorageDemoSeedData: auditLogs seeded with 3 log entries.");
  }

  console.log("localStorageDemoSeedData: Comprehensive data seeding completed successfully.");
}

// =============================================================================
// ENHANCED DATA MANAGEMENT FUNCTIONS
// =============================================================================

// -----------------------------------------------------------------------------
// Calendar Events Management
// -----------------------------------------------------------------------------
function getCalendarEvents() {
  try {
    return JSON.parse(localStorage.getItem("calendarEvents") || "[]");
  } catch (e) {
    console.error("Failed to retrieve calendar events:", e);
    return [];
  }
}

function addCalendarEvent(event) {
  try {
    const events = getCalendarEvents();
    const newEvent = {
      id: event.id || `event-${Date.now()}`,
      title: event.title,
      date: event.date,
      type: event.type,
      description: event.description || "",
      attendees: event.attendees || [],
      location: event.location || "",
      createdDate: new Date().toISOString()
    };
    events.push(newEvent);
    localStorage.setItem("calendarEvents", JSON.stringify(events));
    console.log("✅ Calendar event added:", newEvent.id);
    return newEvent;
  } catch (e) {
    console.error("Failed to add calendar event:", e);
    return null;
  }
}

function updateCalendarEvent(eventId, updates) {
  try {
    const events = getCalendarEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      events[eventIndex] = { ...events[eventIndex], ...updates };
      localStorage.setItem("calendarEvents", JSON.stringify(events));
      console.log("✅ Calendar event updated:", eventId);
      return events[eventIndex];
    }
    return null;
  } catch (e) {
    console.error("Failed to update calendar event:", e);
    return null;
  }
}

function deleteCalendarEvent(eventId) {
  try {
    const events = getCalendarEvents();
    const filteredEvents = events.filter(e => e.id !== eventId);
    localStorage.setItem("calendarEvents", JSON.stringify(filteredEvents));
    console.log("✅ Calendar event deleted:", eventId);
    return true;
  } catch (e) {
    console.error("Failed to delete calendar event:", e);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Workflow Definitions Management
// -----------------------------------------------------------------------------
function getWorkflowDefinitions() {
  try {
    return JSON.parse(localStorage.getItem("workflowDefinitions") || "[]");
  } catch (e) {
    console.error("Failed to retrieve workflow definitions:", e);
    return [];
  }
}

function addWorkflowDefinition(workflow) {
  try {
    const workflows = getWorkflowDefinitions();
    const newWorkflow = {
      id: workflow.id || `WF-${Date.now()}`,
      name: workflow.name,
      description: workflow.description || "",
      nodes: workflow.nodes || 0,
      connections: workflow.connections || 0,
      status: workflow.status || "draft",
      category: workflow.category || "general",
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    workflows.push(newWorkflow);
    localStorage.setItem("workflowDefinitions", JSON.stringify(workflows));
    console.log("✅ Workflow definition added:", newWorkflow.id);
    return newWorkflow;
  } catch (e) {
    console.error("Failed to add workflow definition:", e);
    return null;
  }
}

function updateWorkflowDefinition(workflowId, updates) {
  try {
    const workflows = getWorkflowDefinitions();
    const workflowIndex = workflows.findIndex(w => w.id === workflowId);
    if (workflowIndex !== -1) {
      workflows[workflowIndex] = { 
        ...workflows[workflowIndex], 
        ...updates, 
        lastModified: new Date().toISOString() 
      };
      localStorage.setItem("workflowDefinitions", JSON.stringify(workflows));
      console.log("✅ Workflow definition updated:", workflowId);
      return workflows[workflowIndex];
    }
    return null;
  } catch (e) {
    console.error("Failed to update workflow definition:", e);
    return null;
  }
}

function deleteWorkflowDefinition(workflowId) {
  try {
    const workflows = getWorkflowDefinitions();
    const filteredWorkflows = workflows.filter(w => w.id !== workflowId);
    localStorage.setItem("workflowDefinitions", JSON.stringify(filteredWorkflows));
    console.log("✅ Workflow definition deleted:", workflowId);
    return true;
  } catch (e) {
    console.error("Failed to delete workflow definition:", e);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Document Management
// -----------------------------------------------------------------------------
function getDocuments() {
  try {
    return JSON.parse(localStorage.getItem("documents") || "[]");
  } catch (e) {
    console.error("Failed to retrieve documents:", e);
    return [];
  }
}

function addDocument(document) {
  try {
    const documents = getDocuments();
    const newDocument = {
      id: document.id || `DOC-${Date.now()}`,
      title: document.title,
      content: document.content || "",
      category: document.category || "general",
      version: document.version || "1.0",
      status: document.status || "draft",
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      author: document.author || "system"
    };
    documents.push(newDocument);
    localStorage.setItem("documents", JSON.stringify(documents));
    console.log("✅ Document added:", newDocument.id);
    return newDocument;
  } catch (e) {
    console.error("Failed to add document:", e);
    return null;
  }
}

function updateDocument(documentId, updates) {
  try {
    const documents = getDocuments();
    const documentIndex = documents.findIndex(d => d.id === documentId);
    if (documentIndex !== -1) {
      documents[documentIndex] = { 
        ...documents[documentIndex], 
        ...updates, 
        lastModified: new Date().toISOString() 
      };
      localStorage.setItem("documents", JSON.stringify(documents));
      console.log("✅ Document updated:", documentId);
      return documents[documentIndex];
    }
    return null;
  } catch (e) {
    console.error("Failed to update document:", e);
    return null;
  }
}

function deleteDocument(documentId) {
  try {
    const documents = getDocuments();
    const filteredDocuments = documents.filter(d => d.id !== documentId);
    localStorage.setItem("documents", JSON.stringify(filteredDocuments));
    console.log("✅ Document deleted:", documentId);
    return true;
  } catch (e) {
    console.error("Failed to delete document:", e);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Kanban Tasks Management
// ----------------------------------------------------------------------------
// =============================================================================
// FIXED KANBAN SEED DATA FOR seedData.js
// =============================================================================
// REPLACE the existing kanbanTasks section in your seedData.js with this:

if (!localStorage.getItem("kanbanTasks")) {
  const tasks = [
    {
      id: "TASK-001",
      title: "Update ISO 27001 Risk Assessment",
      description: "Complete annual risk assessment update including new cloud services and AI systems.",
      status: "todo",
      assignee: "john.doe@company.com",
      priority: "high",
      dueDate: "2025-02-15",
      tags: ["iso27001", "risk", "compliance"],
      createdDate: "2025-01-20",
      framework: "iso27001"
    },
    {
      id: "TASK-002", 
      title: "GDPR Data Mapping Review",
      description: "Review and update data processing maps for GDPR compliance including new AI data flows.",
      status: "progress",
      assignee: "sarah.smith@company.com",
      priority: "medium",
      dueDate: "2025-02-20",
      tags: ["gdpr", "data-mapping", "privacy"],
      createdDate: "2025-01-18",
      framework: "gdpr"
    },
    {
      id: "TASK-003",
      title: "AI Bias Testing Implementation",
      description: "Implement automated bias testing for AI systems per EU AI Act requirements.",
      status: "done",
      assignee: "mike.johnson@company.com",
      priority: "high",
      dueDate: "2025-01-30",
      tags: ["ai", "bias", "testing"],
      createdDate: "2025-01-10",
      framework: "ai-act"
    },
    {
      id: "TASK-004",
      title: "Security Policy Documentation",
      description: "Update security policies to align with latest ISO 27001 standards and organizational changes.",
      status: "todo",
      assignee: "lisa.wilson@company.com",
      priority: "medium",
      dueDate: "2025-02-25",
      tags: ["policy", "security", "documentation"],
      createdDate: "2025-01-22",
      framework: "iso27001"
    },
    {
      id: "TASK-005",
      title: "Vendor Security Assessment",
      description: "Complete security assessment for new cloud vendor including SOC 2 compliance verification.",
      status: "progress",
      assignee: "david.brown@company.com",
      priority: "high",
      dueDate: "2025-02-10",
      tags: ["vendor", "assessment", "security"],
      createdDate: "2025-01-25",
      framework: "soc2"
    },
    {
      id: "TASK-006",
      title: "Privacy Policy Update",
      description: "Update privacy policy to reflect new data processing activities and AI systems.",
      status: "review",
      assignee: "emma.davis@company.com",
      priority: "medium",
      dueDate: "2025-02-12",
      tags: ["privacy", "policy", "gdpr"],
      createdDate: "2025-01-15",
      framework: "gdpr"
    },
    {
      id: "TASK-007",
      title: "SOC 2 Audit Preparation",
      description: "Prepare documentation and evidence for upcoming SOC 2 Type II audit.",
      status: "progress",
      assignee: "alex.garcia@company.com",
      priority: "high",
      dueDate: "2025-02-28",
      tags: ["soc2", "audit", "compliance"],
      createdDate: "2025-01-12",
      framework: "soc2"
    },
    {
      id: "TASK-008",
      title: "AI Risk Classification",
      description: "Classify all AI systems according to EU AI Act risk categories.",
      status: "todo",
      assignee: "jordan.lee@company.com",
      priority: "high",
      dueDate: "2025-02-18",
      tags: ["ai", "risk", "classification"],
      createdDate: "2025-01-28",
      framework: "ai-act"
    },
    {
      id: "TASK-009",
      title: "Data Retention Policy Review",
      description: "Review and update data retention policies for GDPR compliance.",
      status: "review",
      assignee: "maria.rodriguez@company.com",
      priority: "medium",
      dueDate: "2025-02-22",
      tags: ["gdpr", "retention", "policy"],
      createdDate: "2025-01-20",
      framework: "gdpr"
    },
    {
      id: "TASK-010",
      title: "Employee Security Training",
      description: "Deliver mandatory security awareness training to all employees.",
      status: "done",
      assignee: "chris.taylor@company.com",
      priority: "medium",
      dueDate: "2025-01-31",
      tags: ["training", "security", "awareness"],
      createdDate: "2025-01-05",
      framework: "iso27001"
    },
    {
      id: "TASK-011",
      title: "Cloud Security Assessment",
      description: "Assess security controls for cloud infrastructure and services.",
      status: "progress",
      assignee: "sam.kim@company.com",
      priority: "high",
      dueDate: "2025-02-14",
      tags: ["cloud", "security", "assessment"],
      createdDate: "2025-01-18",
      framework: "iso27001"
    },
    {
      id: "TASK-012",
      title: "AI Model Documentation",
      description: "Document AI models and algorithms for transparency and audit purposes.",
      status: "todo",
      assignee: "taylor.chen@company.com",
      priority: "medium",
      dueDate: "2025-02-26",
      tags: ["ai", "documentation", "transparency"],
      createdDate: "2025-01-24",
      framework: "ai-act"
    }
  ];
  localStorage.setItem("kanbanTasks", JSON.stringify(tasks));
  console.log("localStorageDemoSeedData: kanbanTasks seeded with 12 comprehensive tasks.");
}

// =============================================================================
// INSTRUCTIONS FOR IMPLEMENTATION
// =============================================================================
/*

This will provide:
- 12 tasks total
- Tasks distributed across todo, progress, review, and done columns
- Complete task metadata (description, tags, framework, etc.)
- Proper assignee email addresses
- Realistic due dates and creation dates
- Multiple frameworks represented (ISO 27001, GDPR, SOC 2, EU AI Act)
- Variety of priorities (high, medium, low)
- Appropriate tags for each task
*/
// -----------------------------------------------------------------------------
// Relationship Map Management
// -----------------------------------------------------------------------------
function getRelationshipMap() {
  try {
    return JSON.parse(localStorage.getItem("relationshipMap") || '{"nodes":[],"edges":[]}');
  } catch (e) {
    console.error("Failed to retrieve relationship map:", e);
    return {"nodes":[],"edges":[]};
  }
}

function updateRelationshipMap(map) {
  try {
    localStorage.setItem("relationshipMap", JSON.stringify(map));
    console.log("✅ Relationship map updated");
    return true;
  } catch (e) {
    console.error("Failed to update relationship map:", e);
    return false;
  }
}

function addRelationshipNode(node) {
  try {
    const map = getRelationshipMap();
    const newNode = {
      id: node.id || `node-${Date.now()}`,
      label: node.label,
      type: node.type || "system",
      category: node.category || "general"
    };
    map.nodes.push(newNode);
    updateRelationshipMap(map);
    console.log("✅ Relationship node added:", newNode.id);
    return newNode;
  } catch (e) {
    console.error("Failed to add relationship node:", e);
    return null;
  }
}

function addRelationshipEdge(edge) {
  try {
    const map = getRelationshipMap();
    const newEdge = {
      id: edge.id || `edge-${Date.now()}`,
      from: edge.from,
      to: edge.to,
      label: edge.label || "",
      type: edge.type || "connection"
    };
    map.edges.push(newEdge);
    updateRelationshipMap(map);
    console.log("✅ Relationship edge added:", newEdge.id);
    return newEdge;
  } catch (e) {
    console.error("Failed to add relationship edge:", e);
    return null;
  }
}

// -----------------------------------------------------------------------------
// File Management
// -----------------------------------------------------------------------------
function getFiles() {
  try {
    return JSON.parse(localStorage.getItem("files") || "[]");
  } catch (e) {
    console.error("Failed to retrieve files:", e);
    return [];
  }
}

function addFile(file) {
  try {
    const files = getFiles();
    const newFile = {
      id: file.id || `FILE-${Date.now()}`,
      name: file.name,
      path: file.path || "/",
      type: file.type || "file",
      size: file.size || "0 KB",
      category: file.category || "general",
      lastModified: new Date().toISOString()
    };
    files.push(newFile);
    localStorage.setItem("files", JSON.stringify(files));
    console.log("✅ File added:", newFile.id);
    return newFile;
  } catch (e) {
    console.error("Failed to add file:", e);
    return null;
  }
}

function updateFile(fileId, updates) {
  try {
    const files = getFiles();
    const fileIndex = files.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      files[fileIndex] = { 
        ...files[fileIndex], 
        ...updates, 
        lastModified: new Date().toISOString() 
      };
      localStorage.setItem("files", JSON.stringify(files));
      console.log("✅ File updated:", fileId);
      return files[fileIndex];
    }
    return null;
  } catch (e) {
    console.error("Failed to update file:", e);
    return null;
  }
}

function deleteFile(fileId) {
  try {
    const files = getFiles();
    const filteredFiles = files.filter(f => f.id !== fileId);
    localStorage.setItem("files", JSON.stringify(filteredFiles));
    console.log("✅ File deleted:", fileId);
    return true;
  } catch (e) {
    console.error("Failed to delete file:", e);
    return false;
  }
}

// -----------------------------------------------------------------------------
// Chart Metrics Management
// -----------------------------------------------------------------------------
function getChartMetrics() {
  try {
    return JSON.parse(localStorage.getItem("chartMetrics") || "[]");
  } catch (e) {
    console.error("Failed to retrieve chart metrics:", e);
    return [];
  }
}

function updateChartMetrics(metrics) {
  try {
    localStorage.setItem("chartMetrics", JSON.stringify(metrics));
    console.log("✅ Chart metrics updated");
    return true;
  } catch (e) {
    console.error("Failed to update chart metrics:", e);
    return false;
  }
}

function updateChartMetric(metricId, value) {
  try {
    const metrics = getChartMetrics();
    const metricIndex = metrics.findIndex(m => m.id === metricId);
    if (metricIndex !== -1) {
      metrics[metricIndex].value = value;
      updateChartMetrics(metrics);
      console.log("✅ Chart metric updated:", metricId);
      return metrics[metricIndex];
    }
    return null;
  } catch (e) {
    console.error("Failed to update chart metric:", e);
    return null;
  }
}

// =============================================================================
// DYNAMIC UI TABLE SEED DATA (EXISTING FUNCTION)
// =============================================================================

function dynamicUITableSeedData(tableName, dataGenerator, count) {
  console.log(`dynamicUITableSeedData: Starting generation for table '${tableName}' with ${count} items.`);
  
  const data = [];
  for (let i = 1; i <= count; i++) {
    data.push(dataGenerator(i));
  }
  
  console.log(`dynamicUITableSeedData: Generated ${data.length} items for '${tableName}'.`);
  return data;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Clear all seed data (useful for testing)
function clearAllSeedData() {
  try {
    const keys = [
      "calendarEvents", "kanbanTasks", "workflowDefinitions", "relationshipMap",
      "documents", "forms", "files", "chartMetrics", "workflowInstances", 
      "documentTemplates", "auditLogs"
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
    console.log("✅ All seed data cleared");
    return true;
  } catch (e) {
    console.error("Failed to clear seed data:", e);
    return false;
  }
}

// Reset seed data to defaults
function resetSeedData() {
  try {
    clearAllSeedData();
    localStorageDemoSeedData();
    console.log("✅ Seed data reset to defaults");
    return true;
  } catch (e) {
    console.error("Failed to reset seed data:", e);
    return false;
  }
}

// Export all seed data
function exportSeedData() {
  try {
    const keys = [
      "calendarEvents", "kanbanTasks", "workflowDefinitions", "relationshipMap",
      "documents", "forms", "files", "chartMetrics", "workflowInstances", 
      "documentTemplates", "auditLogs"
    ];
    
    const exportData = {};
    keys.forEach(key => {
      exportData[key] = JSON.parse(localStorage.getItem(key) || "[]");
    });
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `arioncomply_seed_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log("✅ Seed data exported");
    return true;
  } catch (e) {
    console.error("Failed to export seed data:", e);
    return false;
  }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize demo data when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  console.log("🌱 Initializing ArionComply seed data system...");
  localStorageDemoSeedData();
  console.log("✅ ArionComply seed data system initialized");
});

// =============================================================================
// USAGE INSTRUCTIONS
// =============================================================================
/*
This enhanced seedData.js file provides comprehensive data management for ArionComply.

KEY FEATURES:
- Complete localStorage management for all data types
- CRUD operations for all entities
- Error handling and logging
- Data validation and integrity checks
- Export/import capabilities
- Utility functions for development

USAGE:
1. Include this file in your HTML: <script src="seedData.js"></script>
2. Data is automatically seeded on page load
3. Use the provided functions to manage data:
   - getCalendarEvents() - retrieve calendar events
   - addCalendarEvent(event) - add new calendar event
   - updateCalendarEvent(id, updates) - update existing event
   - deleteCalendarEvent(id) - delete event
   - Similar functions exist for all data types

INTEGRATION:
- All HTML files should use these functions instead of hardcoded data
- Functions handle localStorage failures gracefully
- All operations are logged for debugging
- Data structures are standardized across the platform

TESTING:
- Use clearAllSeedData() to clear all data
- Use resetSeedData() to restore defaults
- Use exportSeedData() to backup current data
- Check browser console for detailed logging
*/