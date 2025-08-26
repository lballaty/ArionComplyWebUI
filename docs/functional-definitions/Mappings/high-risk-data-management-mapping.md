# High-Risk Data Management Mapping

This document extends the database-to-workflow mapping with a comprehensive model for high-risk data management, including sensitive data classification, supply chain risk, and physical access controls. These capabilities enable organizations to meet the stringent requirements of government contracts and high-risk data handling scenarios.

## Core High-Risk Data Management Workflows

### 1. Sensitive Data Classification

#### Data Classification Framework
- **Status**: Mandatory
- **Triggers**:
  - Initial security program establishment
  - New data types acquisition
  - Regulatory changes
  - Security policy updates
  - Risk assessment findings
- **Approval Requirements**:
  - Data governance committee approval of classification scheme
  - Legal review of classification definitions
  - Security validation of protection requirements
  - Executive sign-off on framework
- **Artifacts & Implementation**:
  - Data classification policy
    - *Implementation*: Document with workflow-based approval and version control
  - Classification level definitions
    - *Implementation*: Detailed definitions of each classification level
  - Handling requirements matrix
    - *Implementation*: Protection requirements by classification level
- **Evidence & Implementation**:
  - Policy approval records
    - *Implementation*: Documentation of policy approval
  - Classification training
    - *Implementation*: Training materials and completion records
  - Awareness verification
    - *Implementation*: Testing of staff understanding
- **Data Model Requirements**:
  - `data_classification_labels` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `label_name`: Name of classification label
    - `short_name`: Abbreviated name/code
    - `description`: Detailed description of classification level
    - `sensitivity_level`: Numeric value representing sensitivity (higher = more sensitive)
    - `color_code`: Color code for visual identification
    - `marking_requirements`: Required markings for this classification
    - `default_access_restriction`: Default access control model
    - `is_active`: Boolean indicating if label is active
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `data_classification_criteria` table:
    - `id`: Primary key
    - `label_id`: Foreign key to data_classification_labels
    - `criterion_name`: Name of classification criterion
    - `description`: Description of criterion
    - `examples`: Examples of data meeting criterion
    - `regulatory_references`: References to relevant regulations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `data_handling_requirements` table:
    - `id`: Primary key
    - `label_id`: Foreign key to data_classification_labels
    - `requirement_category`: ENUM('storage', 'transmission', 'processing', 'sharing', 'disposal', 'access', 'encryption', 'labeling')
    - `requirement_name`: Name of handling requirement
    - `description`: Detailed description of requirement
    - `implementation_guidance`: Guidance for implementing requirement
    - `verification_method`: Method for verifying compliance
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Classification Manager for framework administration
    - Criteria Editor for defining classification criteria
    - Requirements Matrix for handling requirements
    - Classification Guide for user reference

#### Data Identification & Labeling
- **Status**: Mandatory
- **Triggers**:
  - New data acquisition
  - Data creation
  - Classification framework updates
  - Regular reclassification reviews
  - Data usage changes
- **Approval Requirements**:
  - Data owner approval of classification
  - Security review for high-sensitivity data
  - Privacy officer validation for personal data
  - Governance committee review for exceptions
- **Artifacts & Implementation**:
  - Classification process
    - *Implementation*: Defined workflow for classifying data
  - Labeling standards
    - *Implementation*: Standardized formats for data labels
  - Automated discovery tools
    - *Implementation*: Tools for detecting sensitive data
- **Evidence & Implementation**:
  - Classification decisions
    - *Implementation*: Documentation of classification determinations
  - Data inventories
    - *Implementation*: Comprehensive inventories with classification
  - Labeling verification
    - *Implementation*: Audits of labeling accuracy
- **Data Model Requirements**:
  - `classified_data_assets` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `asset_type`: ENUM('database', 'file_share', 'document', 'application', 'api', 'backup', 'dataset', 'repository')
    - `asset_name`: Name of data asset
    - `asset_identifier`: Unique identifier for asset
    - `description`: Description of data asset
    - `location`: Location of data asset
    - `owner_id`: Foreign key to users (data owner)
    - `custodian_id`: Foreign key to users (data custodian)
    - `classification_id`: Foreign key to data_classification_labels
    - `classification_date`: Date of classification
    - `classifier_id`: Foreign key to users (person who classified)
    - `classification_justification`: Justification for classification
    - `review_frequency`: ENUM('quarterly', 'biannual', 'annual', 'biennial')
    - `next_review_date`: Date for next classification review
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `classification_exceptions` table:
    - `id`: Primary key
    - `asset_id`: Foreign key to classified_data_assets
    - `exception_type`: ENUM('handling', 'access', 'labeling', 'encryption', 'retention')
    - `description`: Description of exception
    - `justification`: Business justification
    - `risk_assessment`: Assessment of associated risk
    - `mitigation_measures`: Measures to mitigate risk
    - `requested_by`: Foreign key to users
    - `approved_by`: Foreign key to users
    - `approval_date`: Date of approval
    - `expiration_date`: Date exception expires
    - `status`: ENUM('pending', 'approved', 'denied', 'expired')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `data_discovery_scans` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `scan_name`: Name of discovery scan
    - `scan_scope`: Description of scan scope
    - `scan_method`: ENUM('automated', 'manual', 'hybrid')
    - `scan_tool`: Tool used for scan
    - `start_time`: Scan start time
    - `end_time`: Scan end time
    - `status`: ENUM('scheduled', 'in_progress', 'completed', 'failed', 'cancelled')
    - `findings_summary`: Summary of findings
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Classification Wizard for guided classification
    - Data Asset Explorer for inventory management
    - Discovery Dashboard for scan results
    - Exception Manager for handling exceptions

#### Controlled Unclassified Information (CUI) Management
- **Status**: Optional (Required for government contracts)
- **Triggers**:
  - Government contract requirements
  - CUI receipt from government
  - CUI creation or processing
  - Regulatory obligations
  - Third-party assessments
- **Approval Requirements**:
  - CUI program manager approval of handling procedures
  - Legal validation of compliance approach
  - Security verification of protection measures
  - Contract manager sign-off on CUI registry
- **Artifacts & Implementation**:
  - CUI program
    - *Implementation*: Documented program for CUI management
  - CUI category mapping
    - *Implementation*: Mapping of data to CUI categories
  - CUI handling procedures
    - *Implementation*: Detailed procedures for CUI handling
- **Evidence & Implementation**:
  - CUI registry
    - *Implementation*: Complete inventory of all CUI
  - Handling controls verification
    - *Implementation*: Validation of CUI protection measures
  - Compliance assessments
    - *Implementation*: Regular assessment of CUI program compliance
- **Data Model Requirements**:
  - `cui_categories` table:
    - `id`: Primary key
    - `category_id`: Official CUI category identifier
    - `category_name`: Name of CUI category
    - `description`: Description of category
    - `authority`: Authority that established category
    - `marking_requirements`: Required markings
    - `handling_requirements`: Required handling procedures
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `cui_assets` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `asset_id`: Foreign key to classified_data_assets
    - `cui_category_id`: Foreign key to cui_categories
    - `subcategory`: CUI subcategory (if applicable)
    - `source`: Source of CUI
    - `receipt_date`: Date CUI was received (if applicable)
    - `creation_date`: Date CUI was created (if applicable)
    - `contract_number`: Associated contract number (if applicable)
    - `authorized_holders`: JSON array of authorized personnel
    - `status`: ENUM('active', 'archived', 'transferred', 'destroyed')
    - `disposition_date`: Date of disposition (if applicable)
    - `disposition_method`: Method of disposition (if applicable)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `cui_flow_records` table:
    - `id`: Primary key
    - `cui_asset_id`: Foreign key to cui_assets
    - `flow_type`: ENUM('receipt', 'creation', 'access', 'transmission', 'reproduction', 'disposition')
    - `flow_date`: Date of flow event
    - `source`: Source of CUI (for receipt)
    - `destination`: Destination of CUI (for transmission)
    - `authorized_by`: Foreign key to users
    - `method`: Method used for flow
    - `security_measures`: Security measures applied
    - `created_by`, `created_at`: Audit fields
  
  - **UI Integration**:
    - CUI Registry for inventory management
    - Category Explorer for CUI classification
    - Flow Tracker for CUI movement
    - Compliance Dashboard for program status

### 2. Supply Chain Risk Management

#### Supply Chain Entity Management
- **Status**: Optional (Recommended)
- **Triggers**:
  - Supply chain security initiatives
  - Critical supplier identification
  - Risk assessment findings
  - Regulatory requirements
  - Security incidents
- **Approval Requirements**:
  - Supply chain security team approval of entity framework
  - Procurement validation of supplier information
  - Security verification of risk ratings
  - Executive approval for critical entities
- **Artifacts & Implementation**:
  - Supply chain security policy
    - *Implementation*: Document with workflow-based approval and version control
  - Entity criticality framework
    - *Implementation*: System for determining entity criticality
  - Supply chain mapping methodology
    - *Implementation*: Approach for mapping supply chain relationships
- **Evidence & Implementation**:
  - Entity inventory
    - *Implementation*: Comprehensive inventory of supply chain entities
  - Relationship mapping
    - *Implementation*: Documentation of entity relationships
  - Risk assessments
    - *Implementation*: Entity-specific risk assessments
- **Data Model Requirements**:
  - `supply_chain_entities` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `entity_name`: Name of supply chain entity
    - `entity_type`: ENUM('manufacturer', 'distributor', 'service_provider', 'integrator', 'supplier', 'subcontractor', 'logistics')
    - `description`: Description of entity role in supply chain
    - `criticality`: ENUM('critical', 'high', 'medium', 'low')
    - `tier`: Supply chain tier level
    - `country_of_origin`: Country where entity is based
    - `manufacturing_countries`: Countries where manufacturing occurs
    - `verification_status`: ENUM('verified', 'partially_verified', 'unverified')
    - `verification_date`: Date of verification
    - `verification_method`: Method used for verification
    - `status`: ENUM('active', 'suspended', 'terminated')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `supply_chain_relationships` table:
    - `id`: Primary key
    - `upstream_entity_id`: Foreign key to supply_chain_entities
    - `downstream_entity_id`: Foreign key to supply_chain_entities
    - `relationship_type`: ENUM('direct_supplier', 'subcontractor', 'service_provider', 'logistics_provider', 'technology_provider')
    - `description`: Description of relationship
    - `products_services`: JSON array of involved products/services
    - `verification_status`: ENUM('verified', 'partially_verified', 'unverified')
    - `verification_date`: Date of verification
    - `verification_method`: Method used for verification
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `supply_chain_products` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `product_name`: Name of product
    - `description`: Description of product
    - `type`: ENUM('hardware', 'software', 'firmware', 'component', 'service', 'solution')
    - `manufacturer_id`: Foreign key to supply_chain_entities
    - `supplier_id`: Foreign key to supply_chain_entities
    - `version`: Current version/model
    - `criticality`: ENUM('critical', 'high', 'medium', 'low')
    - `origin_country`: Country of origin
    - `acquired_through`: Acquisition channel
    - `verification_status`: ENUM('verified', 'partially_verified', 'unverified')
    - `verification_date`: Date of verification
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Supply Chain Explorer for entity management
    - Relationship Mapper for visualization
    - Product Registry for product tracking
    - Verification Dashboard for status monitoring

#### Supply Chain Risk Assessment
- **Status**: Optional (Recommended)
- **Triggers**:
  - New supply chain entity
  - Product acquisition
  - Threat intelligence updates
  - Regular reassessment cycles
  - Geopolitical changes
- **Approval Requirements**:
  - Supply chain security team approval of assessment methodology
  - Risk team validation of assessment approach
  - Security verification of risk ratings
  - Procurement acceptance of findings
- **Artifacts & Implementation**:
  - Supply chain risk assessment methodology
    - *Implementation*: Structured approach for assessing supply chain risks
  - Threat model library
    - *Implementation*: Database of supply chain threat models
  - Risk rating criteria
    - *Implementation*: Standardized criteria for risk rating
- **Evidence & Implementation**:
  - Risk assessment documentation
    - *Implementation*: Comprehensive documentation of assessments
  - Mitigation plans
    - *Implementation*: Plans for addressing identified risks
  - Continuous monitoring
    - *Implementation*: Ongoing monitoring of supply chain risks
- **Data Model Requirements**:
  - `supply_chain_risk_assessments` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `entity_id`: Foreign key to supply_chain_entities (if entity-specific)
    - `product_id`: Foreign key to supply_chain_products (if product-specific)
    - `assessment_name`: Name of assessment
    - `assessment_type`: ENUM('entity', 'product', 'relationship', 'general')
    - `assessor_id`: Foreign key to users
    - `assessment_date`: Date of assessment
    - `methodology`: Methodology used for assessment
    - `overall_risk_level`: ENUM('critical', 'high', 'medium', 'low')
    - `next_assessment_date`: Date of next scheduled assessment
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `supply_chain_threats` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `threat_name`: Name of threat
    - `description`: Description of threat
    - `threat_type`: ENUM('tampering', 'counterfeiting', 'theft', 'malicious_code', 'quality', 'delivery', 'geopolitical')
    - `threat_actor`: Type of threat actor
    - `likelihood`: ENUM('very_high', 'high', 'medium', 'low', 'very_low')
    - `information_sources`: Sources of threat information
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `supply_chain_risks` table:
    - `id`: Primary key
    - `assessment_id`: Foreign key to supply_chain_risk_assessments
    - `threat_id`: Foreign key to supply_chain_threats
    - `risk_name`: Name of risk
    - `description`: Description of risk
    - `vulnerability`: Description of vulnerability
    - `likelihood`: ENUM('very_high', 'high', 'medium', 'low', 'very_low')
    - `impact`: ENUM('critical', 'high', 'medium', 'low')
    - `risk_level`: ENUM('critical', 'high', 'medium', 'low')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `supply_chain_mitigations` table:
    - `id`: Primary key
    - `risk_id`: Foreign key to supply_chain_risks
    - `mitigation_name`: Name of mitigation
    - `description`: Description of mitigation
    - `control_type`: ENUM('technical', 'operational', 'contractual', 'verification', 'alternative_sourcing')
    - `implementation_status`: ENUM('planned', 'in_progress', 'implemented', 'verified', 'ineffective')
    - `responsible_id`: Foreign key to users
    - `target_date`: Target implementation date
    - `implementation_date`: Actual implementation date
    - `verification_method`: Method for verifying effectiveness
    - `residual_risk_level`: Risk level after mitigation
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Risk Assessment Wizard for guided assessments
    - Threat Library for threat management
    - Risk Register for risk tracking
    - Mitigation Tracker for control implementation

#### Secure Hardware Acquisition
- **Status**: Optional (Required for high-security environments)
- **Triggers**:
  - Hardware procurement needs
  - Critical system implementation
  - Hardware refresh cycles
  - Security policy requirements
  - Regulatory obligations
- **Approval Requirements**:
  - Security team approval of acquisition standards
  - Procurement validation of vendor verification
  - Technical team verification of specifications
  - Budget approval for secure hardware
- **Artifacts & Implementation**:
  - Secure hardware standards
    - *Implementation*: Documented standards for hardware security
  - Vendor verification process
    - *Implementation*: Process for verifying hardware vendors
  - Chain of custody procedures
    - *Implementation*: Procedures for maintaining chain of custody
- **Evidence & Implementation**:
  - Acquisition documentation
    - *Implementation*: Records of secure hardware acquisition
  - Verification evidence
    - *Implementation*: Documentation of hardware verification
  - Chain of custody records
    - *Implementation*: Tracking of hardware from acquisition to deployment
- **Data Model Requirements**:
  - `secure_hardware_standards` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `standard_name`: Name of hardware security standard
    - `description`: Description of standard
    - `hardware_type`: Type of hardware standard applies to
    - `security_requirements`: JSON array of security requirements
    - `verification_requirements`: Requirements for verification
    - `version`: Standard version
    - `status`: ENUM('draft', 'active', 'deprecated')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `secure_hardware_acquisitions` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `product_id`: Foreign key to supply_chain_products
    - `acquisition_date`: Date of acquisition
    - `acquisition_method`: Method of acquisition
    - `quantity`: Quantity acquired
    - `purchase_order`: Purchase order reference
    - `approved_source`: Boolean indicating if from approved source
    - `verification_status`: ENUM('pending', 'verified', 'failed', 'waived')
    - `verification_date`: Date of verification
    - `verification_method`: Method used for verification
    - `verified_by`: Foreign key to users
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `hardware_chain_of_custody` table:
    - `id`: Primary key
    - `acquisition_id`: Foreign key to secure_hardware_acquisitions
    - `asset_tag`: Asset tag identifier
    - `serial_number`: Serial number
    - `status`: ENUM('in_transit', 'received', 'in_storage', 'in_testing', 'deployed', 'decommissioned')
    - `location`: Current location
    - `custodian_id`: Foreign key to users (current custodian)
    - `transfer_date`: Date of last transfer
    - `transfer_from`: Previous custodian
    - `transfer_to`: New custodian
    - `transfer_reason`: Reason for transfer
    - `tamper_evidence_check`: Boolean indicating if tamper evidence checked
    - `tamper_evidence_status`: ENUM('intact', 'compromised', 'uncertain')
    - `notes`: Additional notes
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Hardware Standards Manager for standards administration
    - Acquisition Tracker for procurement tracking
    - Chain of Custody Tracker for custody management
    - Verification Dashboard for status monitoring

### 3. Physical Access Controls

#### Physical Security Zones
- **Status**: Mandatory
- **Triggers**:
  - New facility acquisition
  - Security policy updates
  - Risk assessment findings
  - Regulatory requirements
  - Security incidents
- **Approval Requirements**:
  - Physical security team approval of zone definitions
  - Facility management validation of implementations
  - Security verification of control effectiveness
  - Executive approval for high-security zones
- **Artifacts & Implementation**:
  - Physical security policy
    - *Implementation*: Document with workflow-based approval and version control
  - Zone classification framework
    - *Implementation*: Structured approach for defining security zones
  - Security control standards
    - *Implementation*: Standards for controls by zone type
- **Evidence & Implementation**:
  - Zone documentation
    - *Implementation*: Comprehensive documentation of security zones
  - Control implementation
    - *Implementation*: Records of security control implementation
  - Effectiveness testing
    - *Implementation*: Regular testing of physical security controls
- **Data Model Requirements**:
  - `physical_security_zones` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `zone_name`: Name of security zone
    - `zone_type`: ENUM('public', 'reception', 'general_work', 'restricted', 'secure', 'high_security')
    - `description`: Description of zone
    - `facility_id`: Foreign key to facilities
    - `floor`: Floor number/identifier
    - `area_description`: Description of physical area
    - `security_level`: ENUM('minimal', 'basic', 'enhanced', 'high', 'maximum')
    - `controlled_by`: Department responsible for zone
    - `risk_assessment_id`: Foreign key to risk assessment
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `zone_boundaries` table:
    - `id`: Primary key
    - `zone_id`: Foreign key to physical_security_zones
    - `boundary_type`: ENUM('wall', 'door', 'window', 'fence', 'gate', 'virtual')
    - `description`: Description of boundary
    - `adjacent_zone_id`: Foreign key to adjacent physical_security_zones
    - `security_rating`: Security rating of boundary
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `physical_security_standards` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `standard_name`: Name of physical security standard
    - `zone_type`: Zone type standard applies to
    - `control_category`: ENUM('perimeter', 'entry', 'monitoring', 'environmental', 'emergency')
    - `description`: Description of standard
    - `requirements`: JSON array of specific requirements
    - `verification_method`: Method for verifying compliance
    - `version`: Standard version
    - `status`: ENUM('draft', 'active', 'deprecated')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Zone Manager for zone administration
    - Facility Map for zone visualization
    - Standards Library for standards management
    - Compliance Dashboard for status monitoring

#### Physical Access Control Systems
- **Status**: Mandatory
- **Triggers**:
  - New facility implementation
  - Security system upgrades
  - Risk assessment findings
  - Regulatory requirements
  - Technology advancements
- **Approval Requirements**:
  - Physical security team approval of system design
  - IT security validation of technical implementation
  - Facility management acceptance of installation
  - Privacy review of personal data handling
- **Artifacts & Implementation**:
  - Access control system design
    - *Implementation*: Technical design for access control systems
  - Technical standards
    - *Implementation*: Standards for system components and configuration
  - Implementation procedures
    - *Implementation*: Procedures for deploying access control systems
- **Evidence & Implementation**:
  - System documentation
    - *Implementation*: Comprehensive documentation of access control systems
  - Configuration verification
    - *Implementation*: Validation of system configuration
  - Performance testing
    - *Implementation*: Regular testing of system effectiveness
- **Data Model Requirements**:
  - `physical_access_controls` table:
    - `id`: Primary key
    - `zone_id`: Foreign key to physical_security_zones
    - `control_name`: Name of access control
    - `control_type`: ENUM('card_reader', 'biometric', 'guard', 'turnstile', 'mantrap', 'lock', 'barrier')
    - `description`: Description of control
    - `location`: Specific location of control
    - `manufacturer`: Manufacturer of control
    - `model`: Model of control
    - `installation_date`: Date of installation
    - `last_maintenance`: Date of last maintenance
    - `maintenance_frequency`: Maintenance frequency
    - `next_maintenance`: Date of next maintenance
    - `status`: ENUM('operational', 'maintenance', 'degraded', 'failed')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `access_control_systems` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `system_name`: Name of access control system
    - `description`: Description of system
    - `system_type`: ENUM('electronic', 'biometric', 'manual', 'hybrid')
    - `vendor`: System vendor
    - `version`: System version
    - `installation_date`: Date of installation
    - `administrator_id`: Foreign key to users (system administrator)
    - `technical_contact_id`: Foreign key to users (technical contact)
    - `status`: ENUM('operational', 'maintenance', 'upgrade', 'deprecated')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `physical_access_logs` table:
    - `id`: Primary key
    - `control_id`: Foreign key to physical_access_controls
    - `access_time`: Time of access event
    - `event_type`: ENUM('granted', 'denied', 'tailgating', 'forced', 'held_open', 'alarm')
    - `credential_id`: Identifier of credential used
    - `user_id`: Foreign key to users (if identified)
    - `direction`: ENUM('in', 'out', 'unknown')
    - `notes`: Additional notes
    - `created_at`: Audit field
  
  - **UI Integration**:
    - Access Control Manager for system administration
    - Control Point Explorer for control point management
    - System Dashboard for status monitoring
    - Access Log Explorer for log analysis

#### Physical Access Authorization
- **Status**: Mandatory
- **Triggers**:
  - New employee onboarding
  - Role changes
  - Contractor engagement
  - Visitor management
  - Access requirement changes
- **Approval Requirements**:
  - Manager approval of access requests
  - Security team validation of access needs
  - Zone owner authorization for restricted areas
  - Executive approval for high-security areas
- **Artifacts & Implementation**:
  - Access authorization policy
    - *Implementation*: Document with workflow-based approval and version control
  - Role-based access templates
    - *Implementation*: Predefined access templates by role
  - Authorization workflow
    - *Implementation*: Process for approving access requests
- **Evidence & Implementation**:
  - Authorization records
    - *Implementation*: Documentation of access authorizations
  - Regular access reviews
    - *Implementation*: Periodic reviews of access rights
  - Revocation tracking
    - *Implementation*: Monitoring of access revocations
- **Data Model Requirements**:
  - `physical_access_authorizations` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `subject_type`: ENUM('employee', 'contractor', 'vendor', 'visitor', 'group')
    - `subject_id`: ID of subject (based on type)
    - `zone_id`: Foreign key to physical_security_zones
    - `access_level`: ENUM('no_escort', 'with_escort', 'emergency_only')
    - `time_restrictions`: JSON object defining time restrictions
    - `reason`: Reason for access
    - `requested_by`: Foreign key to users
    - `request_date`: Date of request
    - `approved_by`: Foreign key to users
    - `approval_date`: Date of approval
    - `start_date`: Date access becomes effective
    - `end_date`: Date access expires
    - `status`: ENUM('pending', 'approved', 'denied', 'revoked', 'expired')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `access_credentials` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `credential_type`: ENUM('card', 'fob', 'biometric', 'pin', 'key', 'mobile')
    - `credential_identifier`: Unique identifier for credential
    - `issued_to`: Foreign key to users
    - `issue_date`: Date credential was issued
    - `activation_date`: Date credential was activated
    - `expiration_date`: Date credential expires
    - `status`: ENUM('active', 'inactive', 'lost', 'stolen', 'damaged', 'returned')
    - `issued_by`: Foreign key to users
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `credential_access_mappings` table:
    - `id`: Primary key
    - `credential_id`: Foreign key to access_credentials
    - `authorization_id`: Foreign key to physical_access_authorizations
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Access Request Portal for requesting access
    - Authorization Manager for approval workflow
    - Credential Manager for credential administration
    - Access Review Dashboard for periodic reviews

#### Visitor Management
- **Status**: Mandatory
- **Triggers**:
  - Visitor hosting needs
  - Contractor management
  - Special event planning
  - Security policy requirements
  - Facility access control
- **Approval Requirements**:
  - Host approval of visitor requests
  - Security team validation for sensitive areas
  - Facility management acceptance of procedures
  - Legal review of visitor agreements
- **Artifacts & Implementation**:
  - Visitor management policy
    - *Implementation*: Document with workflow-based approval and version control
  - Visitor procedures
    - *Implementation*: Detailed procedures for visitor handling
  - Visitor agreement templates
    - *Implementation*: Standardized agreements for visitors
- **Evidence & Implementation**:
  - Visitor records
    - *Implementation*: Comprehensive documentation of all visitors
  - Escort logs
    - *Implementation*: Records of visitor escort activities
  - Visitor badge management
    - *Implementation*: Tracking of visitor badge issuance and return
- **Data Model Requirements**:
  - `visitor_management` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `visitor_name`: Name of visitor
    - `visitor_company`: Visitor's company
    - `visitor_email`: Visitor's email
    - `visitor_phone`: Visitor's phone
    - `visit_purpose`: Purpose of visit
    - `visit_type`: ENUM('business', 'vendor', 'interview', 'audit', 'social', 'other')
    - `host_id`: Foreign key to users (visit host)
    - `visit_date`: Date of visit
    - `arrival_time`: Time of arrival
    - `departure_time`: Time of departure
    - `areas_accessed`: JSON array of accessed areas
    - `visitor_agreement_signed`: Boolean indicating if agreement signed
    - `status`: ENUM('scheduled', 'checked_in', 'checked_out', 'cancelled')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `visitor_screening` table:
    - `id`: Primary key
    - `visitor_id`: Foreign key to visitor_management
    - `screening_type`: ENUM('id_verification', 'background_check', 'security_check', 'watch_list')
    - `screening_status`: ENUM('pending', 'completed', 'failed', 'waived')
    - `screening_date`: Date of screening
    - `screening_result`: Result of screening
    - `performed_by`: Foreign key to users
    - `notes`: Additional notes
    - `created_at`, `updated_at`: Audit fields
  
  - `visitor_badges` table:
    - `id`: Primary key
    - `visitor_id`: Foreign key to visitor_management
    - `badge_number`: Badge identifier
    - `badge_type`: ENUM('visitor', 'contractor', 'temporary_employee', 'escort_required')
    - `issue_time`: Time badge was issued
    - `return_time`: Time badge was returned
    - `issued_by`: Foreign key to users
    - `returned_to`: Foreign key to users
    - `status`: ENUM('issued', 'active', 'returned', 'lost')
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Visitor Request Portal for scheduling visits
    - Check-in Kiosk for visitor registration
    - Host Dashboard for visit management
    - Visitor Log for visitor tracking

## Integration with Existing Workflows

The High-Risk Data Management model integrates with existing workflows as follows:

### 1. Data Privacy Management Workflow
- **Primary Tables**: 
  - `data_classification_labels`, `classified_data_assets`, `cui_assets`
- **Screen Integration**:
  - **Data Inventory** incorporates classification information
  - **Privacy Impact Assessment** uses data classification
  - **Data Subject Requests** prioritizes by classification
  - **Data Flow Mapping** shows classification levels

### 2. Security Control Implementation Workflow
- **Primary Tables**: 
  - `physical_access_controls`, `data_handling_requirements`, `supply_chain_mitigations`
- **Screen Integration**:
  - **Control Inventory** includes physical and supply chain controls
  - **Control Testing** verifies control implementation
  - **Control Gap Analysis** identifies missing controls
  - **Control Dashboard** shows control status

### 3. Risk Management Workflow
- **Primary Tables**: 
  - `supply_chain_risks`, `physical_security_zones`, `classified_data_assets`
- **Screen Integration**:
  - **Risk Register** includes supply chain and physical security risks
  - **Risk Assessment** incorporates classification impact
  - **Risk Treatment** includes security control implementation
  - **Risk Dashboard** shows risk status

### 4. Asset Management Workflow
- **Primary Tables**: 
  - `secure_hardware_acquisitions`, `supply_chain_products`, `access_credentials`
- **Screen Integration**:
  - **Asset Inventory** includes hardware security information
  - **Asset Classification** incorporates data classification
  - **Asset Lifecycle** manages secure hardware lifecycle
  - **Asset Security** shows security status

## Cross-Workflow Dependencies

The data model supports these key cross-workflow dependencies:

1. **Data Classification → Access Control**
   - Classification levels determine access requirements
   - Access controls enforce classification policies

2. **Supply Chain Security → Asset Management**
   - Supply chain verification feeds into asset inventory
   - Asset security status reflects supply chain risk

3. **Physical Security → Personnel Security**
   - Physical access authorizations link to HR processes
   - Personnel clearances affect physical access rights

4. **CUI Management → Compliance Reporting**
   - CUI inventory supports compliance reporting
   - Compliance requirements drive CUI controls

## Enhanced Implementation

To integrate this High-Risk Data Management model:

1. **Begin with Data Classification**
   - Implement classification framework
   - Create asset labeling process
   - Develop handling requirements

2. **Add Physical Security**
   - Implement security zone framework
   - Create access control system
   - Build authorization workflow

3. **Implement Supply Chain Security**
   - Develop entity management
   - Create risk assessment process
   - Build secure acquisition procedures

4. **Enhance with CUI Management**
   - Implement CUI program
   - Create CUI registry
   - Develop handling procedures