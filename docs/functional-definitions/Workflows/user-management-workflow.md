#### 4. Role-Based Access Control Management

- **Action**: View role permissions
  - **Trigger**: Click on "Manage Permissions" button (for administrators only)
  - **Result**: Opens permissions management dialog/panel
  - **Process**:
    - Retrieves role permissions configuration from localStorage
    - Displays matrix of roles and permissions
  - **State Changes**: Opens permissions management interface

- **Action**: Modify role permissions
  - **Trigger**: Toggle permission checkboxes in permissions management interface
  - **Result**: Updates permission settings for roles
  - **Process**:
    - Updates role-permission mappings in memory
    - Saves changes to localStorage
  - **State Changes**:
    - Updates permissions configuration in localStorage

- **Action**: Create custom role
  - **Trigger**: Click "Create Role" button in permissions management
  - **Result**: Creates new custom role with specified permissions
  - **Process**:
    - Captures role name and description
    - Sets initial permissions based on selections
    - Adds role to available roles list
    - Saves to localStorage
  - **State Changes**:
    - Adds new role to system
    - Updates roles dropdown in user form
    - Updates permissions configuration# User Management Screen Workflow

## Screen: `userManagement.html`

### Overview
The User Management screen provides an interface for managing companies and users within the ArionComply platform. It features a two-tab system allowing administrators to manage company records and user accounts, including role assignments. This screen is primarily intended for administrators and managers to handle organization structure and user access. The system implements role-based access control (RBAC) to ensure appropriate permissions management across the platform.

### User-Triggered Actions

#### 1. Tab Navigation
- **Action**: Switch between Companies and Users tabs
  - **Trigger**: `onclick="showSection('companies')"` or `onclick="showSection('users')"`
  - **Result**: Changes active tab and displays corresponding content section
  - **Process**:
    - Removes 'active' class from all nav items and sections
    - Adds 'active' class to clicked nav item and corresponding section
  - **State Changes**:
    - Updates UI to show selected tab content
    - Preserves form data in non-active tab

#### 2. Company Management

- **Action**: View company list
  - **Trigger**: Automatic on page load or tab switch to Companies
  - **Result**: Displays table of all companies
  - **Process**: 
    - Calls `loadCompanies()` to retrieve companies from localStorage
    - Renders company data in table format
  - **State Changes**: Populates company table with current data

- **Action**: Add new company
  - **Trigger**: Submit company form
  - **Result**: Creates new company record
  - **Process**:
    - Captures company name from form
    - Generates unique company ID
    - Adds new company to array in localStorage
    - Resets form
    - Refreshes company table
  - **State Changes**:
    - Adds new company to localStorage
    - Updates company table in UI

- **Action**: Delete company
  - **Trigger**: `onclick="removeCompany(id)"`
  - **Result**: Removes company record
  - **Process**:
    - Displays confirmation dialog
    - If confirmed, calls `deleteCompany(id)`
    - Refreshes company table
  - **State Changes**:
    - Removes company from localStorage
    - Updates company table in UI

#### 3. User Management

- **Action**: View user list
  - **Trigger**: Automatic when Users tab is active
  - **Result**: Displays table of all users
  - **Process**: 
    - Calls `loadUsers()` to retrieve users from localStorage
    - Renders user data in table format with role and company information
    - Filters displayed users based on current user's role (admins see all users, managers see only users in their company)
  - **State Changes**: Populates user table with current data

- **Action**: Add new user
  - **Trigger**: Submit user form
  - **Result**: Creates new user record
  - **Process**:
    - Captures user name, email, role, and company from form
    - Validates role assignment based on current user's permissions (e.g., only admins can create other admins)
    - Generates unique user ID
    - Adds new user to array in localStorage
    - Resets form
    - Refreshes user table
  - **State Changes**:
    - Adds new user to localStorage
    - Updates user table in UI

- **Action**: Edit user role
  - **Trigger**: Click on role field/dropdown for a user
  - **Result**: Changes user's role in the system
  - **Process**:
    - Validates if current user has permission to modify roles
    - Updates user role in localStorage
    - Refreshes user table
  - **State Changes**:
    - Updates user's role in localStorage
    - Updates user table in UI

- **Action**: Delete user
  - **Trigger**: `onclick="removeUser(id)"`
  - **Result**: Removes user record
  - **Process**:
    - Validates if current user has permission to delete the user
    - Displays confirmation dialog
    - If confirmed, calls `deleteUser(id)`
    - Refreshes user table
  - **State Changes**:
    - Removes user from localStorage
    - Updates user table in UI

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - Initializes layout system: `LayoutManager.initializePage("userManagement.html")`
  - Checks user permissions (restricts access to managers and administrators)
  - Loads initial data: `loadCompanies()` and `loadUsers()`
  - Sets up event listeners for forms and tabs

#### 2. Data Loading Functions
- **loadCompanies()**:
  - Retrieves company data from localStorage
  - Generates table rows for each company
  - Includes action buttons for each company

- **loadUsers()**:
  - Retrieves user data from localStorage
  - Retrieves company data to map company IDs to names
  - Generates table rows for each user with formatted data
  - Includes action buttons for each user

#### 3. Permission Checking
- **Trigger**: During page initialization and during user actions
- **Process**:
  - Retrieves current user from localStorage
  - Checks if user role is authorized for requested action
  - For admins: Full access to all functions
  - For managers: Limited to managing users within their own company, cannot create/modify admin users
  - For auditors/users: Read-only access or no access depending on configuration
  - If unauthorized for specific action, disables or hides UI elements
  - For unauthorized page access, redirects to dashboard with error message

### Error Handling
- **Unauthorized Access**: Redirects non-admin/manager users to dashboard
- **Unauthorized Actions**: Disables UI elements and shows permission error messages
- **Form Validation**: Requires name and email fields to be filled
- **Role Validation**: Validates role assignment permissions based on current user's role
- **Storage Errors**: Catches and logs localStorage errors

### Data Persistence
- **Primary Storage**: Supabase Database
  - All user and company data is primarily stored in database tables
  - Real-time synchronization ensures data consistency across clients

- **Fallback Storage**: 
  - LocalStorage used only when offline or as temporary cache
  - Keys: `user_form_state`, `company_form_state`
  - All local data syncs to database when connection is restored

- **Database Operations**:
  - **User Management Screen Load**:
    - **Operation**: SELECT users, companies, roles, permissions
    - **Tables**: `users`, `companies`, `roles`, `role_permissions`, `user_company_assignments`
    - **Description**: Retrieves all users, companies, role definitions, and permission mappings
  
  - **Add Company**:
    - **Operation**: INSERT company record
    - **Tables**: `companies`
    - **Description**: Creates new company record with provided information
  
  - **Delete Company**:
    - **Operation**: UPDATE company record (soft delete), or DELETE company record
    - **Tables**: `companies`, `user_company_assignments`
    - **Description**: Marks company as inactive or removes it, updates user assignments
  
  - **Add User**:
    - **Operation**: INSERT user record, INSERT user_company_assignment
    - **Tables**: `users`, `user_profiles`, `user_company_assignments`
    - **Description**: Creates new user and associates with selected company
  
  - **Edit User Role**:
    - **Operation**: UPDATE user record
    - **Tables**: `users`, `user_roles`
    - **Description**: Updates role assignment for user
  
  - **Delete User**:
    - **Operation**: UPDATE user record (soft delete), or DELETE user record
    - **Tables**: `users`, `user_company_assignments`
    - **Description**: Marks user as inactive or removes user record completely
  
  - **Modify Role Permissions**:
    - **Operation**: UPDATE role_permissions records
    - **Tables**: `roles`, `permissions`, `role_permissions`
    - **Description**: Updates permission mappings for specific roles
  
  - **Create Custom Role**:
    - **Operation**: INSERT role record, INSERT role_permission records
    - **Tables**: `roles`, `role_permissions`
    - **Description**: Creates new role with specified permissions

### AI Integration Points
- **Role Permission Recommendations**:
  - AI-powered recommendations for appropriate permissions based on role description
  - Intelligent suggestions for role configurations based on best practices

- **User Access Pattern Analysis**:
  - Smart detection of unusual access patterns or permission misalignments
  - Recommendations for role optimizations based on usage patterns

- **Compliance-Aware Role Configuration**:
  - Automatic alignment of roles with compliance requirements from active frameworks
  - Identification of potential segregation of duties issues

### Chat Interface Integration
- **Omnipresent Chat Access**:
  - Chat interface available via floating button on user management screens
  - Context-aware assistance based on current tab and operations

- **Chat-Triggered Actions**:
  - "Create new user" - Guides through user creation process
  - "Modify permissions for role" - Assists with permission configuration
  - "Explain role permissions" - Provides detailed explanation of role capabilities

### Integration Dependencies
- **Required files**:
  - navigation-config.js: Navigation structure
  - sidebar-component.js: Sidebar implementation
  - layout-manager.js: Page layout management
  - scripts.js: Common utilities for localStorage operations
