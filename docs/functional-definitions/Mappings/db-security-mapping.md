# Unified Security Model Mapping

This document extends the database-to-workflow mapping with a comprehensive unified security model that governs access to both database fields and documents through a consistent permission framework. The model is designed to leverage the existing application security context while providing granular control over all resources.

## Core Security Workflows

### 1. Unified Access Control Management

#### Unified Permission Framework
- **Status**: Mandatory
- **Triggers**:
  - Initial system setup
  - New resource types added to system
  - Changes to organizational structure
  - New roles or permission requirements
  - Security incidents related to access control
  - Regulatory changes affecting access requirements
- **Approval Requirements**:
  - Security manager approval of permission model
  - Data owner validation of access controls
  - Legal review of access control adequacy
  - Compliance verification against regulations
- **Artifacts & Implementation**:
  - Unified permission policy
    - *Implementation*: Document with workflow-based approval and version control
  - Permission mapping matrices
    - *Implementation*: Database tables mapping subjects to resources with appropriate access levels
  - Access level definitions
    - *Implementation*: Database reference tables defining standardized access levels across resource types
- **Evidence & Implementation**:
  - Permission audit records
    - *Implementation*: Comprehensive logs of permission changes with justification
  - Access control testing
    - *Implementation*: Automated testing of permission rules with validation reports
  - Permission review documentation
    - *Implementation*: Scheduled review workflows with database tracking of completion
- **Data Model Requirements**:
  - `resource_types` table:
    - `id`: Primary key
    - `type_name`: Name of resource type (e.g., 'database_field', 'document', 'function')
    - `description`: Description of resource type
    - `access_level_schema`: JSON defining valid access levels for this resource type
    - `created_at`, `updated_at`: Audit fields
  
  - `unified_permissions` table:
    - `id`: Primary key
    - `resource_type_id`: Foreign key to resource_types
    - `resource_id`: Identifier for specific resource (e.g., table.field, document UUID)
    - `subject_type`: ENUM('user', 'role', 'group')
    - `subject_id`: Identifier for permission subject
    - `access_level`: Permission level granted
    - `condition`: Optional JSON for conditional permissions
    - `expiration`: Optional expiration timestamp
    - `granted_by`: Foreign key to users
    - `justification`: Reason for granting permission
    - `created_at`, `updated_at`: Audit fields
    - UNIQUE(resource_type_id, resource_id, subject_type, subject_id)
  
  - `permission_inheritance` table:
    - `id`: Primary key
    - `parent_resource_type_id`: Foreign key to resource_types
    - `parent_resource_id`: Identifier for parent resource
    - `child_resource_type_id`: Foreign key to resource_types
    - `child_resource_id`: Identifier for child resource
    - `inheritance_type`: ENUM('full', 'read_only', 'custom')
    - `custom_rules`: JSON for custom inheritance rules if applicable
    - `created_at`, `updated_at`: Audit fields
    - UNIQUE(parent_resource_type_id, parent_resource_id, child_resource_type_id, child_resource_id)
  
  - **UI Integration**:
    - Record Editor for permission management
    - ListView for permission inventory
    - Permission Matrix screen for bulk operations
    - Dashboard for permission analytics

#### Permission Administration Workflow
- **Status**: Mandatory
- **Triggers**:
  - New user onboarding
  - Role changes
  - Project team formations
  - Resource access requests
  - Periodic access reviews
  - Offboarding processes
- **Approval Requirements**:
  - Resource owner approval for sensitive resources
  - Manager approval for role changes
  - Security review for elevated privileges
  - Compliance verification for regulated access
- **Artifacts & Implementation**:
  - Permission request forms
    - *Implementation*: Electronic forms populating permission request database
  - Approval workflows
    - *Implementation*: Multi-step approval processes with delegation capabilities
  - Bulk permission templates
    - *Implementation*: Predefined permission sets for common roles and functions
- **Evidence & Implementation**:
  - Request and approval records
    - *Implementation*: Database tracking of all requests with approval chain
  - Access certification reviews
    - *Implementation*: Periodic review workflows with attestation tracking
  - Privilege usage monitoring
    - *Implementation*: Analytics platform tracking permission utilization
- **Data Model Requirements**:
  - `permission_requests` table:
    - `id`: Primary key
    - `requester_id`: Foreign key to users
    - `subject_type`: ENUM('user', 'role', 'group')
    - `subject_id`: Identifier for permission subject
    - `resource_type_id`: Foreign key to resource_types
    - `resource_id`: Identifier for specific resource
    - `requested_access_level`: Requested permission level
    - `justification`: Business justification for request
    - `status`: ENUM('submitted', 'in_review', 'approved', 'denied', 'revoked')
    - `request_date`: Timestamp of request
    - `created_at`, `updated_at`: Audit fields
  
  - `permission_request_approvals` table:
    - `id`: Primary key
    - `request_id`: Foreign key to permission_requests
    - `approver_id`: Foreign key to users
    - `approval_step`: Sequence number for multi-step approvals
    - `decision`: ENUM('pending', 'approved', 'denied')
    - `comments`: Optional comments on decision
    - `decision_date`: Timestamp of decision
    - `created_at`, `updated_at`: Audit fields
  
  - `permission_templates` table:
    - `id`: Primary key
    - `template_name`: Name of template
    - `description`: Description of template
    - `subject_type`: ENUM('user', 'role', 'group')
    - `permission_set`: JSON array of permission definitions
    - `created_by`: Foreign key to users
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Permission Request Wizard for guided requests
    - Approval Dashboard for pending approvals
    - Template Builder for creating permission templates
    - Access Review screen for periodic certifications

### 2. Comprehensive Audit Logging

#### Security Event Logging
- **Status**: Mandatory
- **Triggers**:
  - Security-relevant system events
  - User authentication events
  - Permission changes
  - Resource access attempts
  - Security configuration changes
  - Sensitive data operations
- **Approval Requirements**:
  - Security manager approval of logging strategy
  - Legal review of privacy considerations
  - Compliance verification of log adequacy
  - IT validation of implementation approach
- **Artifacts & Implementation**:
  - Logging policy
    - *Implementation*: Document with workflow-based approval and version control
  - Event type catalog
    - *Implementation*: Database of security event types with severity and handling
  - Log retention rules
    - *Implementation*: Policy defining retention periods by event type
- **Evidence & Implementation**:
  - Security event logs
    - *Implementation*: Immutable log storage with tamper evidence
  - Log integrity verification
    - *Implementation*: Automated verification of log integrity with alerts
  - Log analysis reports
    - *Implementation*: Scheduled analysis with anomaly detection
- **Data Model Requirements**:
  - `audit_logs` table:
    - `id`: Primary key
    - `event_type`: Event category
    - `event_action`: Specific action taken
    - `resource_type_id`: Foreign key to resource_types
    - `resource_id`: Identifier for affected resource
    - `actor_id`: User or system initiating the action
    - `target_id`: User or entity being acted upon (if applicable)
    - `status`: ENUM('success', 'failure', 'warning', 'info')
    - `details`: JSON with event-specific details
    - `ip_address`: Source IP address
    - `user_agent`: Browser/client information
    - `session_id`: Session identifier
    - `timestamp`: Event timestamp with millisecond precision
    - `created_at`: Record creation timestamp
  
  - `audit_log_retention_rules` table:
    - `id`: Primary key
    - `event_type`: Event category
    - `retention_period`: Retention period in days
    - `archival_strategy`: ENUM('delete', 'archive', 'anonymize')
    - `compliance_requirement`: Reference to compliance requirement
    - `created_by`: Foreign key to users
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Security Event Dashboard for monitoring
    - Log Explorer for detailed analysis
    - Compliance Reports for audit evidence
    - Alert Configuration for security monitoring

#### Access Review and Certification
- **Status**: Mandatory
- **Triggers**:
  - Scheduled periodic reviews
  - Significant organizational changes
  - Post-incident reviews
  - Compliance requirements
  - Change in risk profile
  - System ownership changes
- **Approval Requirements**:
  - Security manager approval of review scope
  - Resource owner participation
  - Management sign-off on remediation
  - Compliance verification of process
- **Artifacts & Implementation**:
  - Access review procedure
    - *Implementation*: Workflow-enabled document with process steps
  - Certification templates
    - *Implementation*: Predefined review formats by resource type
  - Remediation tracking
    - *Implementation*: Task management system for identified issues
- **Evidence & Implementation**:
  - Review completion records
    - *Implementation*: Digital attestation with timestamp and signature
  - Access change logs
    - *Implementation*: Database tracking of changes resulting from reviews
  - Compliance reports
    - *Implementation*: Automated reporting on review completeness and findings
- **Data Model Requirements**:
  - `access_review_campaigns` table:
    - `id`: Primary key
    - `campaign_name`: Name of review campaign
    - `description`: Description of campaign
    - `scope`: JSON defining review scope (resource types, etc.)
    - `start_date`: Campaign start date
    - `end_date`: Campaign end date
    - `status`: ENUM('planned', 'in_progress', 'completed', 'cancelled')
    - `initiator_id`: Foreign key to users
    - `created_at`, `updated_at`: Audit fields
  
  - `access_review_tasks` table:
    - `id`: Primary key
    - `campaign_id`: Foreign key to access_review_campaigns
    - `reviewer_id`: Foreign key to users
    - `resource_type_id`: Foreign key to resource_types
    - `resource_id`: Identifier for resource to review
    - `subject_type`: ENUM('user', 'role', 'group')
    - `subject_id`: Identifier for subject to review
    - `current_access_level`: Current permission level
    - `decision`: ENUM('pending', 'maintain', 'modify', 'revoke')
    - `new_access_level`: Modified permission level if applicable
    - `justification`: Reason for decision
    - `status`: ENUM('assigned', 'in_progress', 'completed', 'escalated')
    - `due_date`: Task due date
    - `completion_date`: Task completion date
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Access Review Dashboard for campaign management
    - Reviewer Portal for completing review tasks
    - Remediation Tracker for following up on changes
    - Certification Reports for compliance evidence

### 3. Document Security Management

#### Document Classification and Handling
- **Status**: Mandatory
- **Triggers**:
  - Document creation
  - Document modification
  - Classification policy changes
  - New compliance requirements
  - Security incidents involving documents
  - Periodic classification reviews
- **Approval Requirements**:
  - Security manager approval of classification scheme
  - Information owner approval of document classification
  - Legal review of handling requirements
  - Compliance validation of controls
- **Artifacts & Implementation**:
  - Document classification policy
    - *Implementation*: Document with workflow-based approval and version control
  - Classification matrix
    - *Implementation*: Database of classification levels with handling requirements
  - Handling procedures
    - *Implementation*: Workflow-enabled documents with process steps by classification
- **Evidence & Implementation**:
  - Classification decisions
    - *Implementation*: Database records of classification with justification
  - Handling control implementation
    - *Implementation*: Technical controls enforcing handling requirements
  - Classification reviews
    - *Implementation*: Periodic review workflows with attestation
- **Data Model Requirements**:
  - `document_classifications` table:
    - `id`: Primary key
    - `classification_name`: Name of classification level
    - `description`: Description of classification level
    - `handling_requirements`: JSON object defining required controls
    - `marking_requirements`: Text labeling requirements
    - `default_access_level`: Default access level for documents with this classification
    - `created_by`: Foreign key to users
    - `created_at`, `updated_at`: Audit fields
  
  - `document_classification_mapping` table:
    - `id`: Primary key
    - `document_id`: Foreign key to documents
    - `classification_id`: Foreign key to document_classifications
    - `classified_by`: Foreign key to users
    - `classification_date`: Date of classification
    - `justification`: Reason for classification
    - `review_frequency`: ENUM('quarterly', 'biannual', 'annual', 'biennial')
    - `next_review_date`: Date for next classification review
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Document Editor with classification tools
    - Classification Wizard for guided classification
    - Handling Requirements View for document handling
    - Classification Reports for compliance reporting

#### Secure Document Collaboration
- **Status**: Mandatory
- **Triggers**:
  - Collaborative document editing needs
  - External sharing requirements
  - Sensitive document workflows
  - Cross-team document collaboration
  - Contractor/vendor document access
  - Client document collaboration
- **Approval Requirements**:
  - Document owner approval of collaboration
  - Security review of collaboration methods
  - Data owner approval for sensitive data
  - Compliance validation of controls
- **Artifacts & Implementation**:
  - Collaboration policy
    - *Implementation*: Document with workflow-based approval and version control
  - Sharing control matrix
    - *Implementation*: Database of sharing methods with security requirements
  - External collaboration agreements
    - *Implementation*: Template agreements for external collaboration
- **Evidence & Implementation**:
  - Collaboration authorization
    - *Implementation*: Database records of approved collaboration with scope
  - Access and activity monitoring
    - *Implementation*: Logs of all collaboration activities with analytics
  - External party compliance
    - *Implementation*: Tracking of agreement compliance and attestation
- **Data Model Requirements**:
  - `document_sharing` table:
    - `id`: Primary key
    - `document_id`: Foreign key to documents
    - `version_id`: Foreign key to document_versions (optional)
    - `sharing_type`: ENUM('internal', 'external', 'public')
    - `shared_by`: Foreign key to users
    - `sharing_date`: Date of sharing
    - `expiration_date`: Optional expiration date
    - `revocation_date`: Optional revocation date
    - `access_level`: Permission level granted
    - `sharing_method`: ENUM('direct', 'link', 'workspace', 'export')
    - `created_at`, `updated_at`: Audit fields
  
  - `document_sharing_recipients` table:
    - `id`: Primary key
    - `sharing_id`: Foreign key to document_sharing
    - `recipient_type`: ENUM('user', 'role', 'group', 'email', 'domain')
    - `recipient_id`: Identifier for recipient
    - `access_level`: Permission level granted to specific recipient
    - `notification_sent`: Boolean indicating if notification was sent
    - `acceptance_status`: ENUM('pending', 'accepted', 'declined')
    - `acceptance_date`: Date of acceptance if applicable
    - `created_at`, `updated_at`: Audit fields
  
  - `external_collaborators` table:
    - `id`: Primary key
    - `email`: Email address of collaborator
    - `name`: Name of collaborator
    - `organization`: Organization of collaborator
    - `status`: ENUM('invited', 'active', 'disabled')
    - `agreement_accepted`: Boolean indicating if agreement was accepted
    - `agreement_date`: Date of agreement acceptance
    - `last_access`: Date of last access
    - `created_by`: Foreign key to users
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Sharing Dialog for document sharing
    - Collaboration Workspace for team editing
    - External Collaborator Management screen
    - Activity Monitoring Dashboard for shared documents

## Integration with Existing Workflows

The Unified Security Model integrates with existing workflows as follows:

### 1. Document Management Workflow
- **Primary Tables**: 
  - `unified_permissions`, `audit_logs`, `document_classifications`, `document_sharing`
- **Screen Integration**:
  - **Document Editor** includes classification selection
  - **File Manager** displays documents based on permissions
  - **Permission Matrix** for managing document access
  - **Access Review Dashboard** for certifying appropriate access

### 2. User Management Workflow
- **Primary Tables**: 
  - `unified_permissions`, `permission_requests`, `permission_templates`
- **Screen Integration**:
  - **User Management** includes permission assignment
  - **Role Editor** for defining role-based permissions
  - **Permission Request Portal** for requesting access
  - **Access Certification** for reviewing granted permissions

### 3. Data Privacy Management Workflow
- **Primary Tables**: 
  - `unified_permissions`, `document_classifications`, `audit_logs`
- **Screen Integration**:
  - **PII Inventory** links to access controls
  - **Data Flow Mapping** includes permission requirements
  - **Privacy Impact Assessment** includes access control verification
  - **Data Subject Request** handling respects permission model

### 4. Compliance Management Workflow
- **Primary Tables**: 
  - `audit_logs`, `access_review_campaigns`, `document_classifications`
- **Screen Integration**:
  - **Compliance Dashboard** includes permission status
  - **Audit Evidence Collection** leverages security logs
  - **Control Implementation** tracks access control status
  - **Compliance Reporting** includes access review status

## Cross-Workflow Dependencies

The data model supports these key cross-workflow dependencies:

1. **User Management → Permission Management**
   - User and role definitions drive permission assignments
   - Changes to organizational structure trigger permission reviews

2. **Document Management → Access Control**
   - Document classification determines default access controls
   - Document lifecycle status affects available permissions

3. **Audit Logging → Compliance Reporting**
   - Security event logs provide evidence for compliance
   - Access review results feed into compliance status

4. **Data Classification → Permission Model**
   - Data sensitivity classification drives permission requirements
   - Classification changes trigger permission reviews

## Enhanced Unified Security Implementation

To integrate this unified security model:

1. **Begin with Permission Model**
   - Implement core permission tables first
   - Migrate existing role-based permissions to unified model
   - Create permission administration interfaces

2. **Enhance Document Security**
   - Implement document classification system
   - Link document access to unified permission model
   - Update document workflows to respect permissions

3. **Expand Audit Logging**
   - Implement comprehensive security event logging
   - Create log analysis and alerting capabilities
   - Develop compliance reporting from log data

4. **Implement Access Review Process**
   - Create access review campaigns framework
   - Develop reviewer interface for certifications
   - Implement remediation tracking for identified issues
