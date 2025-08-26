# Training & Vendor Management Mapping

This document extends the database-to-workflow mapping with a comprehensive model for training and awareness programs and vendor management. These capabilities enable organizations to effectively manage their human security layer and third-party relationships.

## Core Training & Awareness Workflows

### 1. Comprehensive Training Management

#### Training Program Management
- **Status**: Mandatory
- **Triggers**:
  - New security policies
  - Regulatory requirements
  - Identified knowledge gaps
  - Security incidents
  - Annual training planning
- **Approval Requirements**:
  - Training team approval of program approach
  - Department leadership validation of content
  - Compliance verification of regulatory alignment
  - Budget approval for resources
- **Artifacts & Implementation**:
  - Training policy
    - *Implementation*: Document with workflow-based approval and version control
  - Annual training plan
    - *Implementation*: Structured plan for training activities
  - Learning objectives framework
    - *Implementation*: Defined objectives for different roles and topics
- **Evidence & Implementation**:
  - Program documentation
    - *Implementation*: Comprehensive documentation of training programs
  - Effectiveness measurements
    - *Implementation*: Regular assessment of program effectiveness
  - Improvement tracking
    - *Implementation*: Management of program enhancements
- **Data Model Requirements**:
  - `training_programs` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `program_name`: Name of training program
    - `description`: Description of program
    - `program_type`: ENUM('security', 'privacy', 'compliance', 'technical', 'role_specific', 'awareness')
    - `scope`: ENUM('all_staff', 'department', 'role', 'individuals')
    - `target_audience`: JSON array of target roles/departments
    - `compliance_requirements`: JSON array of related compliance requirements
    - `frequency`: ENUM('one_time', 'annual', 'quarterly', 'monthly', 'upon_change')
    - `status`: ENUM('planning', 'active', 'under_review', 'deprecated')
    - `owner_id`: Foreign key to users (program owner)
    - `budget`: Allocated budget for program
    - `start_date`: Program start date
    - `end_date`: Program end date (if applicable)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `training_objectives` table:
    - `id`: Primary key
    - `program_id`: Foreign key to training_programs
    - `objective_name`: Name of learning objective
    - `description`: Description of objective
    - `knowledge_level`: ENUM('awareness', 'basic', 'intermediate', 'advanced', 'expert')
    - `priority`: ENUM('critical', 'high', 'medium', 'low')
    - `measurement_method`: Method to measure achievement
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `training_metrics` table:
    - `id`: Primary key
    - `program_id`: Foreign key to training_programs
    - `metric_name`: Name of metric
    - `description`: Description of metric
    - `calculation_method`: Method to calculate metric
    - `target_value`: Target value for metric
    - `current_value`: Current value of metric
    - `measurement_date`: Date of last measurement
    - `trend`: ENUM('improving', 'stable', 'declining', 'not_enough_data')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Program Manager for training administration
    - Objectives Matrix for objective tracking
    - Metrics Dashboard for performance visualization
    - Program Calendar for scheduling

#### Training Module Management
- **Status**: Mandatory
- **Triggers**:
  - New training program creation
  - Content updates required
  - Feedback on existing modules
  - New learning objectives
  - Technology changes
- **Approval Requirements**:
  - Training team approval of module design
  - Subject matter expert validation of content
  - Instructional design quality review
  - Legal review of sensitive content
- **Artifacts & Implementation**:
  - Module design standards
    - *Implementation*: Standardized approach for module design
  - Content development process
    - *Implementation*: Defined process for creating content
  - Quality assurance procedures
    - *Implementation*: Process for ensuring module quality
- **Evidence & Implementation**:
  - Module documentation
    - *Implementation*: Comprehensive documentation of modules
  - Review records
    - *Implementation*: Documentation of content reviews
  - Testing results
    - *Implementation*: Results of module testing
- **Data Model Requirements**:
  - `training_modules` table:
    - `id`: Primary key
    - `program_id`: Foreign key to training_programs
    - `module_name`: Name of module
    - `description`: Description of module content
    - `learning_objectives`: JSON array of covered objectives
    - `prerequisites`: JSON array of prerequisite modules
    - `estimated_duration`: Estimated time to complete (minutes)
    - `format`: ENUM('elearning', 'video', 'document', 'workshop', 'webinar', 'game', 'mixed')
    - `difficulty_level`: ENUM('basic', 'intermediate', 'advanced')
    - `version`: Current version
    - `status`: ENUM('draft', 'review', 'active', 'deprecated')
    - `content_path`: Path to module content
    - `assessment_id`: Foreign key to training_assessments (if applicable)
    - `last_content_update`: Date of last content update
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `training_module_sections` table:
    - `id`: Primary key
    - `module_id`: Foreign key to training_modules
    - `section_name`: Name of section
    - `sequence`: Sequence number in module
    - `content_type`: ENUM('text', 'video', 'audio', 'interactive', 'quiz', 'simulation')
    - `content_path`: Path to section content
    - `estimated_duration`: Estimated time to complete (minutes)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `training_module_reviews` table:
    - `id`: Primary key
    - `module_id`: Foreign key to training_modules
    - `review_type`: ENUM('content', 'technical', 'instructional_design', 'legal', 'accessibility')
    - `reviewer_id`: Foreign key to users
    - `review_date`: Date of review
    - `status`: ENUM('approved', 'changes_required', 'rejected')
    - `comments`: Review comments
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Module Editor for content creation
    - Module Library for organization
    - Review Workflow for approval process
    - Content Analytics for usage tracking

#### Training Assignment & Tracking
- **Status**: Mandatory
- **Triggers**:
  - New employee onboarding
  - Role changes
  - New training requirements
  - Regular compliance cycles
  - Training program updates
- **Approval Requirements**:
  - Manager approval of assignments
  - HR validation of employee groups
  - Department head approval for specialized training
  - Compliance verification of completion
- **Artifacts & Implementation**:
  - Assignment policy
    - *Implementation*: Rules for assigning training
  - Completion tracking system
    - *Implementation*: System for monitoring training progress
  - Reminder framework
    - *Implementation*: Automated reminders for pending training
- **Evidence & Implementation**:
  - Assignment records
    - *Implementation*: Documentation of all training assignments
  - Completion certificates
    - *Implementation*: Evidence of training completion
  - Compliance reporting
    - *Implementation*: Regular reporting on training compliance
- **Data Model Requirements**:
  - `training_assignments` table:
    - `id`: Primary key
    - `program_id`: Foreign key to training_programs (if applicable)
    - `module_id`: Foreign key to training_modules
    - `assignee_type`: ENUM('individual', 'department', 'role', 'organization')
    - `assignee_id`: ID of assignee (based on type)
    - `assigner_id`: Foreign key to users (person making assignment)
    - `assignment_date`: Date of assignment
    - `due_date`: Date assignment is due
    - `priority`: ENUM('critical', 'high', 'medium', 'low')
    - `is_mandatory`: Boolean indicating if mandatory
    - `status`: ENUM('assigned', 'in_progress', 'completed', 'overdue', 'exempted')
    - `exemption_reason`: Reason for exemption (if applicable)
    - `exemption_approved_by`: Foreign key to users (if applicable)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `training_progress` table:
    - `id`: Primary key
    - `assignment_id`: Foreign key to training_assignments
    - `user_id`: Foreign key to users
    - `start_date`: Date user started training
    - `last_access_date`: Date of last access
    - `completion_date`: Date of completion
    - `completion_status`: ENUM('not_started', 'in_progress', 'completed', 'failed')
    - `progress_percentage`: Percentage completed
    - `time_spent`: Total time spent (minutes)
    - `last_section_completed`: Last completed section
    - `completion_evidence`: Reference to completion evidence
    - `created_at`, `updated_at`: Audit fields
  
  - `training_reminders` table:
    - `id`: Primary key
    - `assignment_id`: Foreign key to training_assignments
    - `reminder_type`: ENUM('initial', 'reminder', 'escalation', 'overdue')
    - `recipient_id`: Foreign key to users
    - `scheduled_date`: Date reminder scheduled
    - `sent_date`: Date reminder sent
    - `channel`: ENUM('email', 'sms', 'app_notification', 'calendar')
    - `status`: ENUM('scheduled', 'sent', 'failed', 'cancelled')
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Assignment Manager for managing assignments
    - Progress Dashboard for tracking completion
    - Compliance Reports for status reporting
    - Reminder Configuration for alert setup

#### Training Assessments & Evidence
- **Status**: Mandatory
- **Triggers**:
  - Training completion
  - Knowledge verification needs
  - Regulatory evidence requirements
  - Effectiveness measurement
  - Certification requirements
- **Approval Requirements**:
  - Training team approval of assessment approach
  - Subject matter expert validation of questions
  - Compliance verification of evidence requirements
  - Certification authority approval
- **Artifacts & Implementation**:
  - Assessment methodology
    - *Implementation*: Standardized approach for assessments
  - Question bank
    - *Implementation*: Database of assessment questions
  - Evidence collection standards
    - *Implementation*: Requirements for training evidence
- **Evidence & Implementation**:
  - Assessment results
    - *Implementation*: Records of all assessment outcomes
  - Certification records
    - *Implementation*: Documentation of earned certifications
  - Evidence repository
    - *Implementation*: Secure storage of training evidence
- **Data Model Requirements**:
  - `training_assessments` table:
    - `id`: Primary key
    - `module_id`: Foreign key to training_modules
    - `assessment_name`: Name of assessment
    - `description`: Description of assessment
    - `assessment_type`: ENUM('quiz', 'test', 'practical', 'scenario', 'certification')
    - `passing_score`: Score required to pass
    - `time_limit`: Time limit in minutes (if applicable)
    - `randomize_questions`: Boolean indicating if questions are randomized
    - `attempts_allowed`: Number of attempts allowed
    - `show_answers`: Boolean indicating if answers are shown after completion
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `assessment_questions` table:
    - `id`: Primary key
    - `assessment_id`: Foreign key to training_assessments
    - `question_text`: Text of question
    - `question_type`: ENUM('multiple_choice', 'true_false', 'matching', 'fill_blank', 'short_answer', 'essay')
    - `difficulty`: ENUM('easy', 'medium', 'hard')
    - `points`: Points awarded for correct answer
    - `sequence`: Sequence number in assessment
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `assessment_answers` table:
    - `id`: Primary key
    - `question_id`: Foreign key to assessment_questions
    - `answer_text`: Text of answer
    - `is_correct`: Boolean indicating if answer is correct
    - `feedback`: Feedback for this answer
    - `sequence`: Sequence number of answer
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `training_evidence` table:
    - `id`: Primary key
    - `progress_id`: Foreign key to training_progress
    - `evidence_type`: ENUM('assessment_result', 'certificate', 'attendance_record', 'supervisor_attestation', 'practical_demonstration')
    - `description`: Description of evidence
    - `evidence_path`: Path to evidence file
    - `verification_method`: Method used to verify evidence
    - `verified_by`: Foreign key to users
    - `verification_date`: Date of verification
    - `expiration_date`: Date evidence expires (if applicable)
    - `created_at`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Assessment Builder for assessment creation
    - Evidence Manager for evidence administration
    - Results Dashboard for outcome visualization
    - Certification Tracker for credential management

### 2. Vendor Management Program

#### Vendor Risk Assessment
- **Status**: Mandatory
- **Triggers**:
  - New vendor engagement
  - Significant vendor changes
  - Regular reassessment cycles
  - Changes in risk tolerance
  - Regulatory requirements
- **Approval Requirements**:
  - Risk team approval of assessment methodology
  - Procurement validation of process integration
  - Legal review of questionnaires
  - Security approval of technical requirements
- **Artifacts & Implementation**:
  - Vendor risk assessment methodology
    - *Implementation*: Structured approach for assessing vendor risks
  - Risk tiering framework
    - *Implementation*: System for categorizing vendors by risk
  - Assessment questionnaire library
    - *Implementation*: Database of assessment questions by vendor type
- **Evidence & Implementation**:
  - Risk assessment documentation
    - *Implementation*: Comprehensive records of all vendor risk assessments
  - Due diligence evidence
    - *Implementation*: Documentation of vendor due diligence
  - Risk register integration
    - *Implementation*: Incorporation of vendor risks into enterprise risk register
- **Data Model Requirements**:
  - `vendors` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `vendor_name`: Name of vendor
    - `description`: Description of vendor services
    - `vendor_type`: ENUM('software', 'hardware', 'service', 'consulting', 'cloud', 'managed_service', 'other')
    - `criticality`: ENUM('critical', 'high', 'medium', 'low')
    - `risk_tier`: ENUM('tier1', 'tier2', 'tier3', 'tier4')
    - `risk_score`: Numerical risk score
    - `status`: ENUM('prospective', 'active', 'suspended', 'terminated')
    - `onboarding_date`: Date vendor was onboarded
    - `last_review_date`: Date of last review
    - `next_review_date`: Date of next scheduled review
    - `primary_contact`: Primary contact information
    - `contract_owner_id`: Foreign key to users (internal contract owner)
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `vendor_risk_assessments` table:
    - `id`: Primary key
    - `vendor_id`: Foreign key to vendors
    - `assessment_name`: Name of assessment
    - `assessment_type`: ENUM('initial', 'periodic', 'ad_hoc', 'post_incident')
    - `assessor_id`: Foreign key to users
    - `assessment_date`: Date of assessment
    - `risk_score`: Overall risk score
    - `risk_level`: ENUM('critical', 'high', 'medium', 'low')
    - `methodology`: Methodology used for assessment
    - `next_assessment_date`: Date of next assessment
    - `status`: ENUM('planned', 'in_progress', 'completed', 'cancelled')
    - `approval_status`: ENUM('pending', 'approved', 'rejected')
    - `approved_by`: Foreign key to users
    - `approval_date`: Date of approval
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `vendor_questionnaires` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `questionnaire_name`: Name of questionnaire
    - `description`: Description of questionnaire purpose
    - `vendor_types`: JSON array of applicable vendor types
    - `risk_tiers`: JSON array of applicable risk tiers
    - `version`: Questionnaire version
    - `status`: ENUM('draft', 'active', 'deprecated')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `vendor_questionnaire_sections` table:
    - `id`: Primary key
    - `questionnaire_id`: Foreign key to vendor_questionnaires
    - `section_name`: Name of section
    - `description`: Description of section
    - `sequence`: Sequence number in questionnaire
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Vendor Risk Manager for assessment administration
    - Questionnaire Builder for questionnaire design
    - Risk Scoring Engine for risk calculation
    - Vendor Dashboard for status visualization

#### Vendor Certification Management
- **Status**: Optional (Recommended)
- **Triggers**:
  - New vendor onboarding
  - Certification expiration
  - Compliance requirements
  - Vendor status changes
  - Security requirements updates
- **Approval Requirements**:
  - Compliance team validation of certification requirements
  - Procurement verification of vendor submissions
  - Legal review of certification validity
  - Security verification of technical certifications
- **Artifacts & Implementation**:
  - Certification requirements matrix
    - *Implementation*: Database of required certifications by vendor type
  - Validation methodology
    - *Implementation*: Process for validating vendor certifications
  - Expiration tracking system
    - *Implementation*: Automated tracking of certification expirations
- **Evidence & Implementation**:
  - Certification records
    - *Implementation*: Repository of vendor certification documentation
  - Validation documentation
    - *Implementation*: Evidence of certification validation
  - Compliance reporting
    - *Implementation*: Regular reporting on certification status
- **Data Model Requirements**:
  - `supplier_certifications` table:
    - `id`: Primary key
    - `vendor_id`: Foreign key to vendors
    - `certification_type`: ENUM('iso27001', 'soc2', 'pci_dss', 'hipaa', 'gdpr', 'ccpa', 'fedramp', 'hitrust', 'other')
    - `certification_name`: Specific certification name
    - `issuing_authority`: Authority issuing certification
    - `certification_date`: Date certification was issued
    - `expiration_date`: Date certification expires
    - `scope`: Description of certification scope
    - `status`: ENUM('valid', 'expired', 'revoked', 'pending_verification')
    - `evidence_path`: Path to certification evidence
    - `verified_by`: Foreign key to users
    - `verification_date`: Date of verification
    - `verification_method`: Method used for verification
    - `notes`: Additional notes
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `certification_requirements` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `vendor_type`: Vendor type requirement applies to
    - `risk_tier`: Risk tier requirement applies to
    - `data_classification`: Data classification requirement applies to
    - `certification_type`: Required certification type
    - `requirement_level`: ENUM('required', 'preferred', 'alternative')
    - `alternative_certifications`: JSON array of acceptable alternatives
    - `verification_frequency`: Frequency of verification
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `certification_exceptions` table:
    - `id`: Primary key
    - `vendor_id`: Foreign key to vendors
    - `requirement_id`: Foreign key to certification_requirements
    - `exception_reason`: Reason for exception
    - `alternative_measures`: Alternative measures implemented
    - `risk_assessment`: Assessment of risk from exception
    - `requested_by`: Foreign key to users
    - `approved_by`: Foreign key to users
    - `approval_date`: Date of approval
    - `expiration_date`: Date exception expires
    - `status`: ENUM('pending', 'approved', 'rejected', 'expired')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Certification Manager for certification tracking
    - Verification Workflow for validation process
    - Expiration Dashboard for monitoring deadlines
    - Exception Manager for handling exceptions

#### Vendor Requirements Management
- **Status**: Mandatory
- **Triggers**:
  - New vendor engagement
  - Contract negotiations
  - Security requirements changes
  - Regulatory updates
  - Vendor performance issues
- **Approval Requirements**:
  - Security team approval of security requirements
  - Legal validation of contractual language
  - Procurement verification of inclusion in contracts
  - Compliance confirmation of regulatory requirements
- **Artifacts & Implementation**:
  - Vendor requirements catalog
    - *Implementation*: Database of requirements by vendor type and risk
  - Contract clause library
    - *Implementation*: Standardized security and compliance clauses
  - Requirements traceability matrix
    - *Implementation*: Mapping of requirements to contracts and assessments
- **Evidence & Implementation**:
  - Requirements documentation
    - *Implementation*: Comprehensive documentation of vendor requirements
  - Contract review records
    - *Implementation*: Evidence of requirement inclusion in contracts
  - Compliance verification
    - *Implementation*: Validation of vendor compliance with requirements
- **Data Model Requirements**:
  - `supplier_requirements` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `requirement_name`: Name of requirement
    - `requirement_type`: ENUM('security', 'privacy', 'compliance', 'performance', 'operational', 'legal')
    - `description`: Detailed description of requirement
    - `applies_to_vendor_types`: JSON array of applicable vendor types
    - `applies_to_risk_tiers`: JSON array of applicable risk tiers
    - `requirement_level`: ENUM('mandatory', 'recommended', 'optional')
    - `regulatory_source`: Regulation requirement derives from (if applicable)
    - `version`: Requirement version
    - `status`: ENUM('draft', 'active', 'deprecated')
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `contract_clauses` table:
    - `id`: Primary key
    - `organization_id`: Foreign key to organizations
    - `requirement_id`: Foreign key to supplier_requirements
    - `clause_name`: Name of clause
    - `clause_text`: Text of clause
    - `clause_type`: ENUM('standard', 'negotiable', 'fallback')
    - `version`: Clause version
    - `legal_approved`: Boolean indicating if approved by legal
    - `approved_by`: Foreign key to users
    - `approval_date`: Date of approval
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `vendor_requirement_mappings` table:
    - `id`: Primary key
    - `vendor_id`: Foreign key to vendors
    - `requirement_id`: Foreign key to supplier_requirements
    - `contract_id`: Foreign key to contracts
    - `status`: ENUM('included', 'negotiated', 'waived', 'pending')
    - `actual_text`: Actual text used if negotiated
    - `waiver_reason`: Reason for waiver (if applicable)
    - `waiver_approved_by`: Foreign key to users (if applicable)
    - `compliance_status`: ENUM('compliant', 'non_compliant', 'partially_compliant', 'not_verified')
    - `last_verified`: Date of last compliance verification
    - `verification_method`: Method used for verification
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - Requirements Manager for requirement administration
    - Clause Library for contract clause management
    - Compliance Checker for requirement verification
    - Waiver Management for exception handling

#### Vendor Performance Monitoring
- **Status**: Optional (Recommended)
- **Triggers**:
  - New vendor relationship
  - SLA establishment
  - Performance issues
  - Regular review cycles
  - Contract renewals
- **Approval Requirements**:
  - Business owner approval of performance metrics
  - Procurement validation of monitoring approach
  - Legal review of SLA enforcement
  - Executive approval for critical vendors
- **Artifacts & Implementation**:
  - Performance monitoring methodology
    - *Implementation*: Structured approach for monitoring vendor performance
  - SLA definition framework
    - *Implementation*: System for defining and tracking SLAs
  - Performance metrics library
    - *Implementation*: Database of performance metrics by vendor type
- **Evidence & Implementation**:
  - Performance data collection
    - *Implementation*: Regular collection of performance metrics
  - SLA compliance tracking
    - *Implementation*: Monitoring of vendor compliance with SLAs
  - Performance reporting
    - *Implementation*: Regular reporting on vendor performance
- **Data Model Requirements**:
  - `vendor_slas` table:
    - `id`: Primary key
    - `vendor_id`: Foreign key to vendors
    - `contract_id`: Foreign key to contracts
    - `sla_name`: Name of SLA
    - `description`: Description of SLA
    - `sla_type`: ENUM('availability', 'performance', 'response_time', 'resolution_time', 'quality', 'security', 'other')
    - `metric`: Metric being measured
    - `target_value`: Target value for metric
    - `minimum_acceptable`: Minimum acceptable value
    - `measurement_period`: Period over which metric is measured
    - `measurement_method`: Method used to measure
    - `penalty_defined`: Boolean indicating if penalty defined
    - `penalty_description`: Description of penalty
    - `effective_date`: Date SLA becomes effective
    - `expiration_date`: Date SLA expires
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - `vendor_performance_records` table:
    - `id`: Primary key
    - `sla_id`: Foreign key to vendor_slas
    - `period_start`: Start of measurement period
    - `period_end`: End of measurement period
    - `actual_value`: Actual measured value
    - `status`: ENUM('met', 'not_met', 'partially_met')
    - `compliance_percentage`: Percentage of compliance
    - `issue_description`: Description of issues (if not met)
    - `remediation_plan`: Plan for remediation (if not met)
    - `penalty_applied`: Boolean indicating if penalty applied
    - `penalty_details`: Details of penalty application
    - `verified_by`: Foreign key to users
    - `verification_date`: Date of verification
    - `created_at`, `updated_at`: Audit fields
  
  - `vendor_reviews` table:
    - `id`: Primary key
    - `vendor_id`: Foreign key to vendors
    - `review_type`: ENUM('quarterly', 'biannual', 'annual', 'ad_hoc', 'pre_renewal')
    - `review_date`: Date of review
    - `reviewer_id`: Foreign key to users
    - `participants`: JSON array of participant information
    - `performance_summary`: Summary of performance
    - `risk_changes`: Description of risk changes
    - `issues_identified`: Issues identified during review
    - `action_items`: Action items from review
    - `recommendation`: ENUM('continue', 'improve', 'reduce', 'terminate')
    - `next_review_date`: Date of next scheduled review
    - `created_by`, `created_at`, `updated_by`, `updated_at`: Audit fields
  
  - **UI Integration**:
    - SLA Manager for SLA administration
    - Performance Dashboard for metrics visualization
    - Review Scheduler for planning reviews
    - Issue Tracker for managing performance issues

## Integration with Existing Workflows

The Training & Vendor Management model integrates with existing workflows as follows:

### 1. Compliance Management Workflow
- **Primary Tables**: 
  - `training_programs`, `training_evidence`, `supplier_certifications`
- **Screen Integration**:
  - **Compliance Dashboard** shows training compliance status
  - **Evidence Collection** leverages training evidence
  - **Control Implementation** links to vendor requirements
  - **Compliance Calendar** includes training deadlines

### 2. Risk Management Workflow
- **Primary Tables**: 
  - `vendor_risk_assessments`, `training_metrics`, `vendor_requirement_mappings`
- **Screen Integration**:
  - **Risk Register** includes vendor risks
  - **Risk Assessment** incorporates vendor assessments
  - **Risk Treatment** includes training programs
  - **Risk Dashboard** shows vendor risk profile

### 3. Human Resources Workflow
- **Primary Tables**: 
  - `training_assignments`, `training_progress`, `training_evidence`
- **Screen Integration**:
  - **Employee Onboarding** includes training assignments
  - **Performance Management** incorporates training completion
  - **Skills Matrix** reflects training achievements
  - **Compliance Records** includes training evidence

### 4. Procurement Workflow
- **Primary Tables**: 
  - `vendors`, `supplier_requirements`, `vendor_slas`
- **Screen Integration**:
  - **Vendor Selection** incorporates risk assessments
  - **Contract Management** includes security requirements
  - **Vendor Performance** shows SLA compliance
  - **Vendor Directory** displays certification status

## Cross-Workflow Dependencies

The data model supports these key cross-workflow dependencies:

1. **Training Programs → Policy Management**
   - New policies trigger training updates
   - Training effectiveness informs policy improvements

2. **Vendor Requirements → Control Implementation**
   - Controls map to vendor requirements
   - Vendor compliance affects control status

3. **Training Evidence → Compliance Reporting**
   - Training evidence supports compliance assertions
   - Compliance requirements drive training needs

4. **Vendor Risk → Enterprise Risk Management**
   - Vendor risks feed into enterprise risk register
   - Risk appetite affects vendor requirements

## Enhanced Implementation

To integrate this Training & Vendor Management model:

1. **Begin with Training Program Management**
   - Implement core training program tables
   - Create assignment mechanisms
   - Develop progress tracking

2. **Add Vendor Risk Assessment**
   - Implement vendor inventory
   - Create risk assessment framework
   - Build questionnaire system

3. **Implement Requirements Management**
   - Develop requirements catalog
   - Create contract clause library
   - Build compliance verification

4. **Enhance with Performance Monitoring**
   - Implement SLA framework
   - Create performance tracking
   - Build review processes