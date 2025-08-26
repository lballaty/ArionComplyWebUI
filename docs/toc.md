# ArionComply Project Document Table of Contents

## 1. Core Documentation

### 1.1 Architecture & Structure
- **arioncomply-v1/docs/README.md** - Brief project directory reference pointing to Architecture.md
- **arioncomply-v1/docs/Architecture.md** - Technical architecture overview and design principles
- **arioncomply-v1/docs/DataModelingSupabase.md** - Data modeling specifications for Supabase implementation
- **arioncomply-v1/docs/FunctionalNonFunctionalReq.md** - Functional and non-functional requirements
- **arioncomply-v1/docs/Detailed-Plan.md** - Implementation timeline, repository mapping, and milestones

### 1.2 User & Operations Manuals
- **arioncomply-v1/docs/InputDocs/ArionComplyManual/enhanced_user_manual.md** - Comprehensive customer user manual with platform features, navigation, and workflows
- **arioncomply-v1/docs/InputDocs/ArionComplyManual/vendor_operations_manual.md** - Internal operations manual for ArionComply staff with administrative procedures (INTERNAL USE ONLY)

## 2. Functional Definitions

### 2.1 Workflows
- **arioncomply-v1/docs/functional-definitions/README.md** - Overview of functional specifications with directory structure explanation
- **arioncomply-v1/docs/functional-definitions/Workflows/document-editor-workflow.md** - Rich text editing environment for creating/managing compliance documents with version control
- **arioncomply-v1/docs/functional-definitions/Workflows/file-manager-workflow.md** - Document management system with organization, version control, sharing capabilities
- **arioncomply-v1/docs/functional-definitions/Workflows/listview-workflow.md** - Universal data management interface with dynamic template-based configuration
- **arioncomply-v1/docs/functional-definitions/Workflows/integrated-planning-workflow.md** - Project management and planning features with visualization options
- **arioncomply-v1/docs/functional-definitions/Workflows/screens-list.md** - Comprehensive list of all UI screens in the system

### 2.2 Schemas & Integration
- **arioncomply-v1/docs/functional-definitions/schemas/README.md** - Overview of data structure and framework specifications
- **arioncomply-v1/docs/functional-definitions/Mappings/db-workflow-mapping.md** - Database to workflow mappings and integration details
- **arioncomply-v1/docs/functional-definitions/integration/README.md** - System integration patterns and hybrid architecture definitions
- **arioncomply-v1/docs/API/arioncomply-metadata-api.js** - Metadata-driven API architecture documentation

## 3. Application Database

### 3.1 Database Design
- **arioncomply-v1/docs/ApplicationDatabase/application_schema_design.md** - Database schema definitions for workflows with table structures
- **arioncomply-v1/docs/ApplicationDatabase/database_schema_design_principles.md** - Design principles for database structures including multi-tenant architecture and RLS implementation

## 4. Input Documents

### 4.1 ArionComply Manual
- **arioncomply-v1/docs/InputDocs/ArionComplyManual/enhanced_user_manual.md** - Detailed user manual with platform features and screen-by-screen navigation
- **arioncomply-v1/docs/InputDocs/ArionComplyManual/vendor_operations_manual.md** - Internal operations manual for vendor administration and customer management

### 4.2 Questions & Answers
- **arioncomply-v1/docs/InputDocs/QuestionsAnswers/split_qas/** - Directory containing structured Q&A documents covering compliance standards
- **arioncomply-v1/docs/InputDocs/QuestionsAnswers/split_qas/clean_files.py** - Utility script for cleaning trailer lines from Q&A files

### 4.3 Metadata & Content Structure
- **arioncomply-v1/docs/InputDocs/JSONRefactored/qa_batch_001_010.md** - Batch of Q&A files refactored to JSON format with validation summary
- **arioncomply-v1/docs/InputDocs/arion_comply_metadata_authoring_guide_v_2_json_generalized.md** - Guide for content authoring with metadata schema and templates
- **arioncomply-v1/docs/InputDocs/cloud_security_consulting_master.md** - Reference material for cloud security frameworks and standards

## 5. Core Platform Screens

### 5.1 Main User Interfaces
- **Document Editor** (`documentEditor.html`) - Rich text editing for compliance documents with templates and versioning
- **File Manager** (`fileManager.html`) - Hierarchical document storage with version control and sharing capabilities
- **ListView** (`listView.html`) - Configurable database viewer with template-based architecture for any content type
- **Dashboard** (`dashboard.html`) - Central monitoring and visualization interface with compliance metrics
- **Assessment Wizard** (`wizzard.html`) - Guided compliance assessments with intelligent question branching
- **User Management** (`userManagement.html`) - Organization user and role administration with permission management

### 5.2 Workflow Management Suite
- **Workflow List** (`workflowList.html`) - Overview of active and completed workflows with status tracking
- **Workflow Engine** (`workflowEngine.html`) - Visual workflow builder with drag-and-drop interface
- **Workflow Preview** (`workflowPreview.html`) - Workflow testing and simulation environment
- **Workflow Step Editor** (`workflowStepEdit.html`) - Detailed step configuration for workflow processes

### 5.3 Visualization & Collaboration
- **Search Interface** (`searchInterface.html`) - Comprehensive content discovery with advanced filtering
- **Notification Center** (`notificationCenter.html`) - Centralized communication management for workflow notifications
- **Chat Interface** (`chatInterface.html`) - AI-powered assistant for compliance guidance
- **Relationship Mapper** (`relationshipMapper.html`) - Visual representation of entity relationships
- **Timeline View** (`timelineView.html`) - Sequential visualization for projects and events
- **Tree View** (`treeView.html`) - Hierarchical visualization for nested structures
- **Kanban Board** (`kanbanBoard.html`) - Status-based visualization for workflow management

## 6. Database Structure

### 6.1 Document Management Tables
- `documents` - Core document metadata with versioning, workflow status, and content formats
- `document_versions` - Version history with change tracking and approval status
- `document_relationships` - Mapping of relationships between documents (references, implements, etc.)
- `document_approvals` - Approval workflow records with signature tracking
- `document_distributions` - Distribution tracking with audience and acknowledgment requirements
- `document_templates` - Templates for different document types with standard content
- `document_reviews` - Scheduled and ad-hoc review records with outcomes
- `file_storage_items` - Physical storage for files with metadata and categorization

### 6.2 Organization & Access Control
- `organizations` - Multi-tenant organization profiles with configuration settings
- `users` - User accounts with authentication and profile information
- `roles` - Role definitions with permission bundles
- `permissions` - Granular permission settings for system functions

### 6.3 Compliance Framework Tables
- `control_frameworks` - Standard framework definitions (ISO, GDPR, etc.)
- `controls` - Individual control definitions from frameworks
- `control_implementations` - Organization-specific implementation details
- `control_implementation_tasks` - Tasks for implementing controls
- `control_test_cases` - Test procedures for verifying control effectiveness
- `control_test_results` - Results from control testing activities
- `control_implementation_evidence` - Evidence supporting control implementation
- `soa_control_mappings` - Statement of Applicability control mappings
- `statements_of_applicability` - Formal SoA records for compliance frameworks

### 6.4 Risk Management Tables
- `risk_assessments` - Formal risk assessment records with methodology
- `risks` - Risk register entries with analysis and evaluation
- `risk_treatment_plans` - Structured plans for addressing risks
- `risk_treatments` - Specific treatment actions and methods
- `risk_treatment_actions` - Individual actions for implementing treatments
- `risk_acceptances` - Formal risk acceptance records with authorization

### 6.5 Incident & Operations Tables
- `incidents` - Security and privacy incident records
- `incident_affected_assets` - Assets affected by incidents
- `incident_investigation_actions` - Investigation activities and findings
- `incident_evidence_items` - Evidence collected during incident response
- `sla_policies` - Service Level Agreement policy definitions
- `incident_slas` - Incident-specific SLA parameters and tracking
- `integration_mappings` - Field-level mappings for external system integration
- `integration_mapping_tests` - Test cases for integration mapping validation

## 7. Architecture & Integration

### 7.1 AI & Machine Learning Features
- Document generation with AI-assisted content creation
- Content analysis with automatic classification and indexing
- Smart compliance recommendations based on context
- Natural language query processing for search
- Semantic understanding of compliance requirements
- Context-aware assistance in chat interface

### 7.2 Hybrid Architecture Components
- Local LLM compute services for prose stitching
- Cloud-based data storage and routing
- PostgreSQL full-text search with BM25 ranking
- Multi-index approach for different content types
- Edge functions for request handling and orchestration
- Browser-based service worker for offline capabilities

### 7.3 External System Integration
- LMS integration for training delivery and tracking
- Calendar synchronization for scheduled activities
- Email notification system integration
- Document management system connections
- Mobile application synchronization
- Third-party authentication providers
- API-based external service connections
