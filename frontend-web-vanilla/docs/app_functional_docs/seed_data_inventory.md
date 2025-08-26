# ✅ seedData.js – Mock Data Initialization Inventory

**Purpose**: Utility script that creates mock data in localStorage for development and demo purposes  
**Type**: Data seeding utility with conditional initialization  
**Usage**: Automatically runs on DOMContentLoaded to populate empty localStorage  
**Scope**: Creates sample data for various application components

---

## 🔁 Automated Behaviors (on page load)

### 📊 Mock Data Creation Process

```yaml
- seedMockupData():
    trigger: DOMContentLoaded event (automatic)
    behavior: conditionally creates mock data only if not already present
    strategy: checks localStorage keys before creating data (prevents overwriting)

    data_categories_created:
      - Calendar Events: sample audit and training events
      - Kanban Tasks: sample compliance tasks with assignments
      - Workflow Definitions: sample workflow processes
      - Relationship Maps: sample system relationship data
      - Documents: sample policy documents
      - Forms: sample form definitions
      - Files: sample file structure data
      - Chart Metrics: sample metric data for dashboards
```

---

## 📋 Mock Data Definitions

### 📅 Calendar Events

```yaml
localStorage_key: "calendarEvents"
sample_data:
  - id: "event-1"
    title: "ISO 27001 External Audit"
    date: "2025-02-03"
    type: "audit"

  - id: "event-2"
    title: "AI Risk Assessment Review"
    date: "2025-02-05"
    type: "review"

  - id: "event-3"
    title: "Security Awareness Training"
    date: "2025-02-10"
    type: "training"

purpose: provides sample calendar data for calendarView.html
```

### 📋 Kanban Tasks

```yaml
localStorage_key: "kanbanTasks"
sample_data:
  - id: "TASK-001"
    title: "Update ISO 27001 Risk Assessment"
    status: "todo"
    assignee: "john"
    priority: "high"
    dueDate: "2025-02-15"

  - id: "TASK-002"
    title: "GDPR Data Mapping Review"
    status: "progress"
    assignee: "sarah"
    priority: "medium"
    dueDate: "2025-02-20"

purpose: provides sample task data for kanbanBoard.html
```

### 🔄 Workflow Definitions

```yaml
localStorage_key: "workflowDefinitions"
sample_data:
  - id: "WF-001"
    name: "Access Request Process"
    nodes: 5
    connections: 4

purpose: provides sample workflow data for workflowEngine.html and workflowList.html
```

### 🔗 Relationship Mapping

```yaml
localStorage_key: 'relationshipMap'
sample_data:
  nodes:
    - id: 'n1', label: 'System A'
    - id: 'n2', label: 'Database B'
  edges:
    - from: 'n1', to: 'n2', label: 'stores'

purpose: provides sample relationship data for relationshipMapper.html
```

### 📄 Documents

```yaml
localStorage_key: "documents"
sample_data:
  - id: "DOC-001"
    title: "Information Security Policy"
    content: "Sample policy text"

purpose: provides sample document data for documentEditor.html
```

### 📝 Forms

```yaml
localStorage_key: "forms"
sample_data:
  - id: "FORM-001"
    name: "Incident Report"
    fields: 5

purpose: provides sample form data for formBuilder.html
```

### 📁 Files

```yaml
localStorage_key: "files"
sample_data:
  - id: "FILE-001"
    name: "evidence.zip"
    path: "/Audits"
    type: "file"

purpose: provides sample file data for fileManager.html
```

### 📊 Chart Metrics

```yaml
localStorage_key: "chartMetrics"
sample_data:
  - id: "metric-1"
    label: "Open Risks"
    value: 12

  - id: "metric-2"
    label: "Closed Risks"
    value: 8

purpose: provides sample metrics data for chartView.html
```

---

## 🔧 Implementation Details

### 💾 Data Initialization Pattern

```yaml
conditional_creation_logic: if (!localStorage.getItem('keyName')) {
  // Create sample data only if key doesn't exist
  localStorage.setItem('keyName', JSON.stringify(data));
  }

benefits:
  - prevents overwriting existing user data
  - safe to run multiple times
  - supports development and demo scenarios
  - provides consistent sample data across sessions
```

### 🎯 Integration Points

```yaml
consumed_by:
  - calendarView.html: uses 'calendarEvents' for event display
  - kanbanBoard.html: uses 'kanbanTasks' for task management
  - workflowEngine.html: uses 'workflowDefinitions' for process management
  - relationshipMapper.html: uses 'relationshipMap' for system mapping
  - documentEditor.html: uses 'documents' for content management
  - formBuilder.html: uses 'forms' for form definitions
  - fileManager.html: uses 'files' for file system simulation
  - chartView.html: uses 'chartMetrics' for dashboard metrics

automatic_execution:
  - runs on every page load via DOMContentLoaded
  - checks and seeds data as needed
  - no user interaction required
```

---

## 🧪 Testing Considerations

### 🎯 Testing Scenarios

```yaml
1. Fresh Installation:
  - verify all mock data created on first page load
  - confirm localStorage keys populated with sample data
  - validate JSON structure integrity

2. Existing Data Preservation:
  - ensure existing localStorage data not overwritten
  - verify conditional creation logic works correctly
  - test with partial existing data scenarios

3. Data Quality:
  - validate sample data represents realistic compliance scenarios
  - ensure data structure matches expected formats for consuming components
  - verify all required fields present in sample data
```

### ⚠️ Dependencies

```yaml
- localStorage availability and functionality
- JSON serialization/deserialization support
- DOMContentLoaded event firing correctly
- consuming components expect these specific localStorage keys
```

---

## 📋 Status: **DEVELOPMENT UTILITY**

✅ **Useful**: Provides realistic sample data for development and demo  
🔄 **Safe**: Conditional creation prevents data overwrites  
📊 **Comprehensive**: Covers 8 major application components  
🎯 **Realistic**: Sample data reflects actual compliance scenarios  
⚡ **Automatic**: Runs without user intervention on page load

---
