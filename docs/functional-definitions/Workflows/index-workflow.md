# Index/Login/Registration Screen Workflow

## Screen: `index.html`

### Overview
The index page serves as the entry point to the ArionComply application, providing authentication functionality (login and registration) and a demo access option.

### User-Triggered Actions

#### 1. Authentication Tab Switching
- **Action**: Click "Sign In" tab
  - **Trigger**: `onclick="switchAuthMode('login')"`
  - **Result**: Displays login form, hides registration form
  - **State Changes**: 
    - Sets active tab to "Sign In"
    - Updates page title and subtitle
    - Shows login form, hides registration form

- **Action**: Click "Sign Up" tab
  - **Trigger**: `onclick="switchAuthMode('register')"`
  - **Result**: Displays registration form, hides login form
  - **State Changes**:
    - Sets active tab to "Sign Up" 
    - Updates page title and subtitle
    - Shows registration form, hides login form

#### 2. Login Form Submission
- **Action**: Submit login form
  - **Trigger**: Form submit event
  - **Validation**:
    - Email field is required and must be valid email format
    - Password field is required
  - **Process**:
    - Checks if user exists in localStorage
    - If user not found, shows error message
    - If user found, creates session and redirects to routing.html
  - **State Changes**:
    - Sets `arioncomply_user` in localStorage
    - Sets `arioncomply_session` to "active" in localStorage
    - Redirects to routing.html

#### 3. Registration Form Submission
- **Action**: Submit registration form
  - **Trigger**: Form submit event
  - **Validation**:
    - Full Name field is required
    - Email field is required and must be valid email format
    - Company Name field is required
    - Password field is required and must be at least 6 characters
    - Terms of Service checkbox must be checked
  - **Process**:
    - Checks if user already exists in localStorage
    - If user exists, shows error message
    - If user doesn't exist, creates new user record
    - Assigns role (admin for first user, user for subsequent registrations)
  - **State Changes**:
    - Saves new user to `arioncomply_users` array in localStorage
    - Sets `arioncomply_user` in localStorage
    - Sets `arioncomply_session` to "active" in localStorage
    - Redirects to routing.html

#### 4. "Remember Me" Option
- **Action**: Toggle "Remember me for 30 days" checkbox
  - **Trigger**: Checkbox toggle
  - **Result**: Sets flag for extended session (implementation pending)
  - **State Changes**: None currently implemented

#### 5. Demo Access
- **Action**: Click "Launch Demo Environment" button
  - **Trigger**: `onclick="quickDemo()"`
  - **Process**: Bypasses normal login flow, creates demo session
  - **State Changes**:
    - Sets `arioncomply_session` to "demo" in localStorage
    - May populate localStorage with sample data
    - Redirects to routing.html with demo context

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - Initializes the page with login form visible
  - Prepopulates demo credentials for convenience

#### 2. Login/Registration Form Transition
- **Trigger**: Tab switch
- **Process**:
  - Animates between login and registration forms
  - Updates header text and subtitle based on selected mode

### Error Handling

#### 1. Login Errors
- **Condition**: User not found
- **Result**: Displays alert "User not found. Please register."

#### 2. Registration Errors
- **Condition**: User already exists
- **Result**: Displays alert "User already exists. Please sign in."

#### 3. Form Validation Errors
- **Condition**: Invalid or missing required fields
- **Result**: Prevents form submission and displays appropriate error messages

### Data Persistence
- **Primary Storage**: Supabase Database
  - All user data is primarily stored in database tables
  - Real-time synchronization ensures data consistency

- **Fallback Storage**: 
  - LocalStorage used only when offline or as temporary cache
  - Keys: `arioncomply_user`, `arioncomply_session`
  - All local data syncs to database when connection is restored

- **Database Operations**:
  - **Registration Form Submission**:
    - **Operation**: INSERT new user record
    - **Tables**: `users`, `user_profiles`
    - **Description**: Creates new user account and associated profile
  
  - **Login Form Submission**:
    - **Operation**: SELECT user record, UPDATE last login timestamp
    - **Tables**: `users`, `login_history`
    - **Description**: Verifies user credentials and logs login activity

  - **Demo Access**:
    - **Operation**: INSERT demo session record
    - **Tables**: `sessions`, `demo_accesses`
    - **Description**: Tracks demo usage and creates temporary session

### AI Integration Points
- **Registration Validation**:
  - AI-powered validation of user information
  - Detection of potentially fraudulent registrations

- **Intelligent Demo Customization**:
  - Customizes demo environment based on inferred user needs
  - Tracks user interactions to improve future demos

### Chat Interface Integration
- **Omnipresent Chat Access**:
  - Chat interface available via floating button on all screens
  - Context-aware assistance based on login/registration process

- **Chat-Triggered Actions**:
  - "Help me register" - Guides through registration process
  - "Start demo" - Initiates demo mode
  - "Troubleshoot login" - Assists with login issues
