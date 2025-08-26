# File Manager Screen Workflow

## Screen: `fileManager.html`

### Overview
The File Manager provides a comprehensive document management system with file organization, version control, and sharing capabilities. It features a folder tree navigation, file browsing with multiple view options, and file operations. This screen serves as the central repository for compliance documentation, evidence, and other files related to the compliance management process.

### User-Triggered Actions

#### 1. Navigation and Browsing

- **Action**: Toggle folder in tree view
  - **Trigger**: `onclick="toggleFolder(this)"`
  - **Result**: Expands or collapses folder in the tree navigation
  - **Process**:
    - Toggles visibility of folder contents
    - Changes chevron icon direction
  - **State Changes**:
    - Updates folder expand/collapse state in UI

- **Action**: Navigate to folder
  - **Trigger**: Click on folder in file browser or breadcrumb
  - **Result**: Changes current directory view
  - **Process**:
    - Calls `navigateTo(path)`
    - Updates current path
    - Refreshes file browser content
    - Updates breadcrumb navigation
  - **State Changes**:
    - Updates currentPath variable
    - Updates file browser display
    - Updates breadcrumb navigation

- **Action**: Navigate to parent directory
  - **Trigger**: Click parent directory item
  - **Result**: Navigates up one level in directory structure
  - **Process**:
    - Calculates parent path
    - Calls `navigateTo(parentPath)`
  - **State Changes**:
    - Updates currentPath variable
    - Updates file browser display
    - Updates breadcrumb navigation

- **Action**: Switch view mode (grid/list)
  - **Trigger**: `onclick="switchView('grid')"` or `onclick="switchView('list')"`
  - **Result**: Changes file browser display mode
  - **Process**:
    - Updates active button state
    - Changes file browser container class
  - **State Changes**:
    - Updates view mode in UI
    - May persist preference in localStorage

#### 2. File Operations

- **Action**: Upload file
  - **Trigger**: `onclick="uploadFile()"` or drop on upload zone
  - **Result**: Adds new file to system
  - **Process**:
    - Opens file picker or handles dropped files
    - Creates file object with metadata
    - Adds file to localStorage
    - Refreshes file browser
  - **State Changes**:
    - Adds new file to localStorage
    - Updates file browser display

- **Action**: Download file
  - **Trigger**: `onclick="downloadFile(id)"`
  - **Result**: Simulates file download
  - **Process**:
    - Finds file by ID
    - Shows notification for demo purposes (actual download would happen in production)
  - **State Changes**:
    - Shows notification

- **Action**: Share file
  - **Trigger**: `onclick="shareFile(id)"`
  - **Result**: Opens sharing options for file
  - **Process**:
    - Finds file by ID
    - Shows sharing dialog or notification
  - **State Changes**:
    - Shows sharing dialog or notification

- **Action**: Delete file
  - **Trigger**: `onclick="deleteFile(id)"`
  - **Result**: Removes file from system
  - **Process**:
    - Confirms deletion with user
    - Removes file from localStorage
    - Refreshes file browser
  - **State Changes**:
    - Removes file from localStorage
    - Updates file browser display

#### 3. Folder Operations

- **Action**: Create new folder
  - **Trigger**: `onclick="createFolder()"`
  - **Result**: Creates new folder in current location
  - **Process**:
    - Prompts for folder name
    - Creates folder object
    - Adds folder to localStorage
    - Refreshes file browser and tree
  - **State Changes**:
    - Adds new folder to localStorage
    - Updates file browser and tree display

- **Action**: Sync files
  - **Trigger**: `onclick="syncFiles()"`
  - **Result**: Simulates synchronization with external system
  - **Process**:
    - Shows syncing animation/notification
    - May refresh file list after "sync"
  - **State Changes**:
    - Shows notification
    - May update file list

#### 4. Search and Filtering

- **Action**: Search files
  - **Trigger**: `oninput="searchFiles(this.value)"`
  - **Result**: Filters files based on search term
  - **Process**:
    - Filters files by name containing search term
    - Updates file browser display with filtered results
  - **State Changes**:
    - Updates visible files in browser
    - May highlight matching terms

- **Action**: Sort files
  - **Trigger**: `onchange="sortFiles(this.value)"`
  - **Result**: Reorders files based on selected criteria
  - **Process**:
    - Sorts files by name, date, size, or type
    - Updates file browser display with sorted files
  - **State Changes**:
    - Updates file display order

#### 5. File Selection and Details

- **Action**: Select file
  - **Trigger**: `onclick="selectFile(id)"`
  - **Result**: Shows file details in sidebar
  - **Process**:
    - Finds file by ID
    - Updates file details panel with information
    - Highlights selected file in browser
  - **State Changes**:
    - Updates selected file in UI
    - Shows file details in panel

### System-Triggered Actions

#### 1. Page Initialization
- **Trigger**: DOMContentLoaded event
- **Process**:
  - Initializes layout: `LayoutManager.initializePage("fileManager.html")`
  - Loads file structure: `loadFileStructure()`
  - Sets up event listeners: `setupFileManagerInteractions()`
  - Sets chat context: `updateChatContext("File Management")`

#### 2. File Structure Loading
- **Trigger**: During initialization
- **Process**:
  - Retrieves files from localStorage: `getFiles()`
  - Creates default files if none exist: `createDefaultFiles()`
  - Renders file tree: `renderFileTree(files)`
  - Renders file grid/list: `renderFileGrid(files)`
  - Updates breadcrumb: `updateBreadcrumb(currentPath)`
  - Updates file count: `updateFileCount(files.length)`

#### 3. File Drop Handling
- **Trigger**: File drop on upload zone
- **Process**:
  - Prevents default browser behavior
  - Extracts files from drop event
  - Processes each dropped file
  - Updates file structure
  - Refreshes display

### Error Handling
- **File Not Found**: Shows error notification when attempting to access non-existent file
- **Upload Failures**: Displays error message for simulated upload failures
- **Permission Errors**: Simulates permission check and shows appropriate errors
- **Storage Quota Exceeded**: Warns when localStorage is nearing capacity

### Data Persistence
- **Storage Mechanism**: LocalStorage
- **Files Key**: "files"
- **Data Structure**:
  - Array of file objects
  - Each file has:
    - id: Unique identifier
    - name: File name
    - path: File path/location
    - type: File type (file/folder)
    - size: File size
    - lastModified: Modification timestamp
    - category: File category (for color coding)
    - permissions: Access permissions

### Integration Dependencies
- **Required files**:
  - navigation-config.js: Navigation structure
  - sidebar-component.js: Sidebar implementation
  - layout-manager.js: Page layout management
  - scripts.js: Common utilities
  - seedData.js: Sample file data
