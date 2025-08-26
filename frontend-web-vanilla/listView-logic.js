// listView-logic.js
// Page logic and interactions for the dynamic listView.html page
// Handles initialization, user interactions, and data management

/* ==========================================================================
   FILE OVERVIEW AND USAGE
   ========================================================================== */

/**
 * WHAT THIS FILE DOES:
 * This file contains all the business logic and user interaction handlers
 * for the listView.html page. It transforms the static HTML into a dynamic,
 * interactive interface by reading URL parameters and applying appropriate
 * configurations from listView-content-config.js.
 * 
 * WHEN TO USE THIS FILE:
 * - When you need to modify how the listView page behaves
 * - When adding new user interactions (filtering, sorting, etc.)
 * - When changing how data is displayed or rendered
 * - When implementing new features like search or pagination
 * 
 * HOW THIS FILE WORKS:
 * 1. Reads ?type= parameter from URL (e.g., ?type=risks)
 * 2. Gets configuration from listView-content-config.js
 * 3. Updates all page elements with appropriate labels and settings
 * 4. Generates sample data and renders it in the table
 * 5. Handles all user interactions (clicks, filters, etc.)
 * 
 * FILE DEPENDENCIES:
 * REQUIRED FILES (must be loaded before this file):
 * - listView-content-config.js: Content type configurations
 * - seedData.js: Data generation utilities
 * - scripts.js: Common utility functions (showNotification, etc.)
 * - navigation-config.js: Navigation configuration
 * - layout-manager.js: Layout management
 * 
 * OPTIONAL FILES:
 * - sidebar-component.js: Sidebar functionality
 * 
 * MAIN FUNCTIONS:
 * - initializeContent(): Main initialization function
 * - renderTable(): Renders data in table format
 * - applyFilters(): Applies user-selected filters
 * - handleAddAction(): Handles "Add" button clicks
 * - handleBulkPrimaryAction(): Handles bulk actions
 * 
 * GLOBAL VARIABLES:
 * - currentContentType: Current content type ID (e.g., 'risks')
 * - currentContentConfig: Current content type configuration object
 * - tableData: All loaded data
 * - filteredData: Currently filtered/displayed data
 * - currentView: Current display mode ('table' or 'grid')
 * 
 * DEBUGGING:
 * Use debugListView() function in browser console to see current state
 * 
 * EXAMPLE USAGE:
 * This file is automatically loaded by listView.html and initializes
 * when the DOM is ready. No manual initialization required.
 */

/* ==========================================================================
   GLOBAL VARIABLES
   Page state and configuration variables
   ========================================================================== */

/**
 * GLOBAL VARIABLES EXPLANATION:
 * These variables maintain the current state of the listView page
 * and are used throughout the file to coordinate different functions.
 * 
 * STATE VARIABLES:
 * - currentView: Tracks whether user is viewing 'table' or 'grid' layout
 * - selectedRows: Set of currently selected row IDs
 * - currentContentType: Current content type ID from URL parameter
 * - currentContentConfig: Configuration object for current content type
 * 
 * DATA VARIABLES:
 * - tableData: Master array containing all loaded data
 * - filteredData: Subset of tableData after applying filters
 * 
 * REFERENCE DATA:
 * - owners: Sample owner names for generating test data
 * - statuses: Sample status values for generating test data
 * 
 * USAGE:
 * These variables are accessed and modified by various functions
 * throughout the file. Always check if they're initialized before use.
 */

let currentView = "table";
let selectedRows = new Set();
let currentContentType = "";
let currentContentConfig = null;
let tableData = [];
let filteredData = [];

// Common data arrays for generating sample data
const owners = [
  "John Smith", "Sarah Johnson", "AI Team", "Data Team", 
  "Finance Dept", "HR Team", "Marketing Dept", "IT Team"
];

const statuses = [
  "Active", "In Progress", "Under Review", "Completed", "Closed"
];

/* ==========================================================================
   INITIALIZATION FUNCTIONS
   Functions to initialize the page and load content
   ========================================================================== */

/* ==========================================================================
   INITIALIZATION FUNCTIONS
   Functions to initialize the page and load content
   ========================================================================== */

/**
 * INITIALIZATION PROCESS:
 * The page initialization follows this sequence:
 * 1. DOM loads → DOMContentLoaded event fires
 * 2. initializeContent() is called
 * 3. URL parameter is read (?type=risks)
 * 4. Configuration is loaded from listView-content-config.js
 * 5. All page elements are updated with appropriate labels
 * 6. Sample data is generated and rendered
 * 7. Event listeners are set up
 * 
 * ERROR HANDLING:
 * - Unknown content types show error message and list available types
 * - Missing dependencies are caught and logged
 * - Failed initialization falls back to basic functionality
 * 
 * CUSTOMIZATION:
 * To modify the initialization process:
 * 1. Edit initializeContent() for main logic changes
 * 2. Edit updatePageElements() for UI updates
 * 3. Edit loadAndRenderData() for data handling changes
 */

/**
 * Initialize content based on URL parameter
 * 
 * This is the main entry point for page setup. It:
 * 1. Reads the ?type= parameter from the URL
 * 2. Gets the appropriate configuration from listView-content-config.js
 * 3. Updates all page elements with the correct labels and settings
 * 4. Loads and renders the appropriate data
 * 
 * URL PARAMETER EXAMPLES:
 * - listView.html?type=risks → Shows Risk Register
 * - listView.html?type=assets → Shows Asset Inventory
 * - listView.html?type=ai_systems → Shows AI System Inventory
 * 
 * ERROR HANDLING:
 * - If no ?type= parameter, defaults to 'ai_systems'
 * - If unknown type, shows error and available types
 * - If configuration loading fails, shows error notification
 */
function initializeContent() {
  try {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type") || "ai_systems";
    
    console.log(`listView.html: Initializing content for type '${type}'`);
    
    // Get content configuration from external config file
    const config = getContentTypeConfig(type);
    if (!config) {
      console.error(`Unknown content type: ${type}`);
      showNotification(`Unknown content type: ${type}`, "error");
      handleUnknownContentType(type);
      return;
    }

    // Store current configuration
    currentContentType = type;
    currentContentConfig = config;
    
    // Update all page elements
    updatePageElements(config);
    
    // Load and render data
    loadAndRenderData(type, config);
    
    console.log(`listView.html: Content initialized for ${config.title}`);
    
  } catch (error) {
    console.error("Error initializing content:", error);
    showNotification("Error loading content", "error");
  }
}

/**
 * Handle unknown content types gracefully
 * @param {string} type - The unknown content type
 */
function handleUnknownContentType(type) {
  document.querySelector(".page-title").textContent = "Unknown Content Type";
  document.querySelector(".page-subtitle").textContent = `Content type '${type}' is not configured`;
  document.getElementById("list-title").textContent = "Configuration Error";
  
  // Show available content types
  const availableTypes = getAllContentTypes();
  console.log("Available content types:", availableTypes);
  
  showNotification(`Available types: ${availableTypes.join(", ")}`, "info");
}

/**
 * Update all page elements with configuration data
 * @param {Object} config - Content type configuration
 */
function updatePageElements(config) {
  // Update page headers
  updatePageHeaders(config);
  
  // Update filters
  updateFilters(config);
  
  // Update action buttons
  updateActionButtons(config);
  
  // Update chat context
  updateChatContext(config.chatContext);
  
  // Update breadcrumb
  updateBreadcrumb(config.breadcrumb);
}

/**
 * Update page header elements
 * @param {Object} config - Content type configuration
 */
function updatePageHeaders(config) {
  document.querySelector(".page-title").textContent = config.title;
  document.querySelector(".page-subtitle").textContent = config.subtitle;
  document.getElementById("list-title").textContent = config.listTitle;
  document.title = `ArionComply - ${config.title}`;
}

/**
 * Update filter panel with dynamic filters
 * @param {Object} config - Content type configuration
 */
function updateFilters(config) {
  const filterGrid = document.getElementById("filter-grid");
  filterGrid.innerHTML = "";
  
  config.filters.forEach(filter => {
    const filterDiv = document.createElement("div");
    filterDiv.className = "form-group";
    filterDiv.innerHTML = `
      <label class="form-label">${filter.label}</label>
      <select class="form-select" id="${filter.id}">
        ${filter.options.map(option => `<option value="${option}">${option}</option>`).join("")}
      </select>
    `;
    filterGrid.appendChild(filterDiv);
  });
}

/**
 * Update action buttons with configuration
 * @param {Object} config - Content type configuration
 */
function updateActionButtons(config) {
  document.getElementById("add-button-text").textContent = config.addButtonText;
  document.getElementById("bulk-primary-text").textContent = config.bulkPrimaryText;
  
  // Store actions for later use
  window.currentAddAction = config.addButtonAction;
  window.currentBulkAction = config.bulkPrimaryAction;
}

/**
 * Update chat context
 * @param {string} context - Chat context string
 */
function updateChatContext(context) {
  const chatIframe = document.getElementById("chat-iframe");
  if (chatIframe) {
    chatIframe.src = `chatInterface.html?context=${encodeURIComponent(context)}&embed=1`;
  }
}

/**
 * Update breadcrumb navigation
 * @param {string} breadcrumb - Breadcrumb string
 */
function updateBreadcrumb(breadcrumb) {
  // This would integrate with the layout manager's breadcrumb system
  if (window.LayoutManager && window.LayoutManager.updateBreadcrumb) {
    window.LayoutManager.updateBreadcrumb(breadcrumb);
  }
}

/* ==========================================================================
   DATA LOADING AND RENDERING
   Functions to load and display data in the table
   ========================================================================== */

/* ==========================================================================
   DATA LOADING AND RENDERING
   Functions to load and display data in the table
   ========================================================================== */

/**
 * DATA FLOW OVERVIEW:
 * 1. loadAndRenderData() is called with content type and config
 * 2. Sample data is generated using generateRowData() from config file
 * 3. Table headers are updated based on configuration
 * 4. Data is rendered in the table using renderTable()
 * 5. Item count is updated in the UI
 * 
 * DATA STRUCTURE:
 * - tableData: Master array containing all data objects
 * - filteredData: Copy of tableData after applying filters
 * - Each data object has properties matching the table headers
 * 
 * RENDERING MODES:
 * - Table view: Traditional table with rows and columns
 * - Grid view: Card-based layout for better mobile experience
 * 
 * CUSTOMIZATION:
 * - Modify formatTableCell() to change how data is displayed
 * - Modify renderTable() to change table structure
 * - Modify renderGridView() to change card layout
 */

/**
 * Load and render data for the current content type
 * 
 * This function:
 * 1. Generates sample data using the configuration
 * 2. Updates table headers to match the content type
 * 3. Renders the data in the current view mode
 * 4. Updates the item count display
 * 
 * @param {string} type - Content type identifier (e.g., 'risks')
 * @param {Object} config - Content type configuration object
 * 
 * DATA GENERATION:
 * Uses dynamicUITableSeedData() from seedData.js and generateRowData()
 * from listView-content-config.js to create realistic sample data
 * 
 * PERFORMANCE:
 * Currently generates 25 sample rows. For production, this would
 * typically load data from an API endpoint.
 */
function loadAndRenderData(type, config) {
  console.log(`Loading data for ${type}`);
  
  // Generate sample data using the external function
  tableData = dynamicUITableSeedData(
    `${type}Table`,
    (i) => generateRowData(type, i, owners, statuses),
    25
  );
  
  // Store filtered data reference
  filteredData = [...tableData];
  
  // Update table headers
  updateTableHeaders(config.headers);
  
  // Render the data
  renderTable(filteredData);
  
  // Update item count
  updateItemCount(filteredData.length);
}

/**
 * Update table headers based on configuration
 * @param {Array} headers - Array of header strings
 */
function updateTableHeaders(headers) {
  const thead = document.getElementById("list-head");
  thead.innerHTML = `
    <tr>
      <th><input type="checkbox" id="selectAll" onchange="toggleSelectAll()"></th>
      ${headers.map(header => `<th>${header}</th>`).join("")}
    </tr>
  `;
}

/**
 * Render data in the table
 * @param {Array} data - Array of data objects to render
 */
function renderTable(data) {
  const tbody = document.getElementById("list-tbody");
  tbody.innerHTML = "";

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.setAttribute("onclick", "selectRow(this)");
    
    // Generate table cells
    let cells = `<td><input type="checkbox" class="row-checkbox" data-item-id="${item.id}"></td>`;
    
    // Add data cells (skip the first property which is usually the ID)
    Object.entries(item).forEach(([key, value]) => {
      cells += formatTableCell(key, value);
    });
    
    // Add actions cell
    cells += `<td>
      <button class="btn btn-sm btn-secondary" onclick="editItem('${item.id}')">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">
        <i class="fas fa-trash"></i>
      </button>
    </td>`;
    
    row.innerHTML = cells;
    tbody.appendChild(row);
  });
}

/**
 * Format a table cell based on its content
 * @param {string} key - Property key
 * @param {*} value - Property value
 * @returns {string} Formatted HTML cell
 */
function formatTableCell(key, value) {
  // Handle different types of values
  if (typeof value === "string") {
    // Handle status/level badges
    if (["level", "risk", "severity", "status"].some(keyword => key.toLowerCase().includes(keyword))) {
      const badgeClass = getBadgeClass(value);
      return `<td><span class="badge ${badgeClass}">${value}</span></td>`;
    }
    
    // Handle dates
    if (key.toLowerCase().includes("date") || key.toLowerCase().includes("review")) {
      return `<td><span class="text-muted">${value}</span></td>`;
    }
    
    // Handle IDs (make them bold)
    if (key.toLowerCase().includes("id")) {
      return `<td><strong>${value}</strong></td>`;
    }
  }
  
  // Default formatting
  return `<td>${value}</td>`;
}

/**
 * Get appropriate badge class for a value
 * @param {string} value - Value to get badge class for
 * @returns {string} CSS class name
 */
function getBadgeClass(value) {
  const lowerValue = value.toLowerCase();
  
  if (["high", "critical", "unacceptable", "overdue"].includes(lowerValue)) {
    return "badge-danger";
  }
  if (["medium", "warning"].includes(lowerValue)) {
    return "badge-warning";
  }
  if (["low", "completed", "operational", "active"].includes(lowerValue)) {
    return "badge-success";
  }
  if (["info", "testing", "in progress"].includes(lowerValue)) {
    return "badge-info";
  }
  
  return "badge-secondary";
}

/**
 * Update item count display
 * @param {number} count - Number of items
 */
function updateItemCount(count) {
  document.getElementById("item-count").textContent = count;
}

/* ==========================================================================
   USER INTERACTION HANDLERS
   Functions to handle user interactions with the page
   ========================================================================== */

/* ==========================================================================
   USER INTERACTION HANDLERS
   Functions to handle user interactions with the page
   ========================================================================== */

/**
 * USER INTERACTION OVERVIEW:
 * This section handles all user interactions including:
 * - Button clicks (Add, Export, Bulk Actions)
 * - Table row selection and bulk selection
 * - View mode switching (Table ↔ Grid)
 * - Filter panel toggling
 * - Individual item actions (Edit, Delete)
 * 
 * INTERACTION FLOW:
 * 1. User performs action (click, select, etc.)
 * 2. Event handler function is called
 * 3. Function validates input and updates state
 * 4. UI is updated to reflect changes
 * 5. User feedback is provided via notifications
 * 
 * STATE MANAGEMENT:
 * - selectedRows Set tracks which items are selected
 * - currentView tracks table vs grid mode
 * - Bulk actions panel shows/hides based on selection
 * 
 * CUSTOMIZATION:
 * - Add new interaction handlers by creating new functions
 * - Modify existing handlers to change behavior
 * - Add event listeners in setupEventListeners()
 */

/**
 * Handle add button action
 * 
 * Executes the add action defined in the content type configuration.
 * The action is typically a navigation to a wizard or form page.
 * 
 * CONFIGURATION:
 * Each content type defines its addButtonAction in the config:
 * ```javascript
 * addButtonAction: "location.href='wizard.html?framework=risk_assessment'"
 * ```
 * 
 * ERROR HANDLING:
 * - If no action is defined, silently fails
 * - If action execution fails, shows error notification
 * - All actions are wrapped in try-catch for safety
 */
function handleAddAction() {
  if (window.currentAddAction) {
    try {
      eval(window.currentAddAction);
    } catch (error) {
      console.error("Error executing add action:", error);
      showNotification("Error executing add action", "error");
    }
  }
}

/**
 * Handle bulk primary action
 */
function handleBulkPrimaryAction() {
  if (window.currentBulkAction) {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      showNotification("Please select items first", "warning");
      return;
    }
    
    try {
      executeBulkAction(window.currentBulkAction, selectedItems);
    } catch (error) {
      console.error("Error executing bulk action:", error);
      showNotification("Error executing bulk action", "error");
    }
  }
}

/**
 * Toggle between table and grid view
 */
function toggleView() {
  const tableView = document.getElementById("table-view");
  const gridView = document.getElementById("grid-view");
  const toggleText = document.getElementById("view-toggle-text");
  
  if (currentView === "table") {
    tableView.style.display = "none";
    gridView.style.display = "block";
    toggleText.textContent = "Table View";
    currentView = "grid";
    renderGridView(filteredData);
  } else {
    tableView.style.display = "block";
    gridView.style.display = "none";
    toggleText.textContent = "Grid View";
    currentView = "table";
  }
}

/**
 * Render data in grid view
 * @param {Array} data - Array of data objects to render
 */
function renderGridView(data) {
  const gridContainer = document.getElementById("grid-container");
  gridContainer.innerHTML = "";
  
  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <input type="checkbox" class="row-checkbox" data-item-id="${item.id}">
        <h4>${item.name || item.title || item.id}</h4>
      </div>
      <div class="card-body">
        ${Object.entries(item).slice(1).map(([key, value]) => 
          `<p><strong>${key}:</strong> ${value}</p>`
        ).join("")}
      </div>
      <div class="card-actions">
        <button class="btn btn-sm btn-secondary" onclick="editItem('${item.id}')">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem('${item.id}')">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;
    gridContainer.appendChild(card);
  });
}

/**
 * Select a table row
 * @param {HTMLElement} row - Table row element
 */
function selectRow(row) {
  const checkbox = row.querySelector(".row-checkbox");
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    updateSelectedRows();
  }
}

/**
 * Toggle select all checkbox
 */
function toggleSelectAll() {
  const selectAll = document.getElementById("selectAll");
  const checkboxes = document.querySelectorAll(".row-checkbox");
  
  checkboxes.forEach(checkbox => {
    checkbox.checked = selectAll.checked;
  });
  
  updateSelectedRows();
}

/**
 * Update selected rows counter and bulk actions visibility
 */
function updateSelectedRows() {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  const bulkActions = document.getElementById("bulk-actions");
  const selectedCount = document.getElementById("selected-count");
  
  if (checkboxes.length > 0) {
    bulkActions.style.display = "block";
    selectedCount.textContent = `${checkboxes.length} items selected`;
  } else {
    bulkActions.style.display = "none";
  }
}

/**
 * Get array of selected item IDs
 * @returns {Array} Array of selected item IDs
 */
function getSelectedItems() {
  const checkboxes = document.querySelectorAll(".row-checkbox:checked");
  return Array.from(checkboxes).map(checkbox => checkbox.dataset.itemId);
}

/* ==========================================================================
   FILTER AND SEARCH FUNCTIONS
   Functions to handle filtering and searching data
   ========================================================================== */

/* ==========================================================================
   FILTER AND SEARCH FUNCTIONS
   Functions to handle filtering and searching data
   ========================================================================== */

/**
 * FILTERING SYSTEM OVERVIEW:
 * The filtering system allows users to narrow down displayed data:
 * 1. Filters are defined in content type configuration
 * 2. Filter dropdowns are dynamically generated
 * 3. When applied, filters create a subset of the original data
 * 4. Table is re-rendered with filtered results
 * 
 * FILTER TYPES:
 * - Dropdown filters: Select from predefined options
 * - Text filters: Type to search (future enhancement)
 * - Date range filters: Select date ranges (future enhancement)
 * 
 * FILTER LOGIC:
 * - Filters are applied in sequence (AND logic)
 * - "All" options mean no filtering for that criteria
 * - Filtering preserves original data in tableData
 * - Results are stored in filteredData array
 * 
 * PERFORMANCE:
 * - Filtering is done client-side for demo purposes
 * - Production implementation would use server-side filtering
 * - Large datasets should implement pagination
 */

/**
 * Apply filters to the data
 * 
 * This function:
 * 1. Starts with complete dataset (tableData)
 * 2. Applies each filter in sequence
 * 3. Updates the display with filtered results
 * 4. Shows user feedback about filter results
 * 
 * FILTER APPLICATION:
 * - Reads current value from each filter dropdown
 * - Skips filters set to "All" (first option)
 * - Uses simple string matching for filtering
 * - Can be enhanced with more sophisticated matching
 * 
 * UI UPDATES:
 * - Re-renders table with filtered data
 * - Updates item count display
 * - Shows notification with result count
 */
function applyFilters() {
  if (!currentContentConfig) return;
  
  let filtered = [...tableData];
  
  // Apply each filter
  currentContentConfig.filters.forEach(filter => {
    const filterElement = document.getElementById(filter.id);
    if (filterElement && filterElement.value !== filter.options[0]) {
      const filterValue = filterElement.value;
      filtered = filtered.filter(item => {
        // Simple filtering logic - can be enhanced based on needs
        return Object.values(item).some(value => 
          value.toString().toLowerCase().includes(filterValue.toLowerCase())
        );
      });
    }
  });
  
  filteredData = filtered;
  renderTable(filteredData);
  updateItemCount(filteredData.length);
  
  showNotification(`Filters applied - ${filteredData.length} items shown`, "info");
}

/**
 * Clear all filters
 */
function clearFilters() {
  // Reset all filter dropdowns
  document.querySelectorAll(".form-select").forEach(select => {
    select.selectedIndex = 0;
  });
  
  // Reset filtered data
  filteredData = [...tableData];
  renderTable(filteredData);
  updateItemCount(filteredData.length);
  
  showNotification("Filters cleared", "info");
}

/* ==========================================================================
   EXPORT AND BULK ACTIONS
   Functions to handle data export and bulk operations
   ========================================================================== */

/* ==========================================================================
   EXPORT AND BULK ACTIONS
   Functions to handle data export and bulk operations
   ========================================================================== */

/**
 * EXPORT SYSTEM OVERVIEW:
 * The export system allows users to download data as CSV files:
 * - Export all data: Downloads complete filtered dataset
 * - Export selected: Downloads only selected items
 * - CSV format: Compatible with Excel and other tools
 * 
 * BULK ACTIONS OVERVIEW:
 * Bulk actions allow users to perform operations on multiple items:
 * - Select items using checkboxes
 * - Choose from content-type-specific bulk actions
 * - Execute actions on all selected items at once
 * 
 * BULK ACTION TYPES:
 * - Processing actions: Bulk assessment, review, etc.
 * - Data actions: Export, delete, update, etc.
 * - Workflow actions: Approve, reject, assign, etc.
 * 
 * INTEGRATION:
 * - Bulk actions are defined in listView-content-config.js
 * - Each content type has its own set of available actions
 * - Actions can be customized per content type
 */

/**
 * Export data to CSV
 * 
 * This function:
 * 1. Checks if there's data to export
 * 2. Converts the data to CSV format
 * 3. Creates a downloadable file
 * 4. Triggers browser download
 * 
 * CSV FORMAT:
 * - First row contains column headers
 * - Subsequent rows contain data
 * - Commas are escaped with quotes
 * - File is named based on content type
 * 
 * BROWSER COMPATIBILITY:
 * - Uses Blob API for file creation
 * - Uses download attribute for filename
 * - Fallback handling for older browsers
 */
function exportData() {
  if (!filteredData.length) {
    showNotification("No data to export", "warning");
    return;
  }
  
  const csvContent = convertToCSV(filteredData);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${currentContentType}_export.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  showNotification("Data exported successfully", "success");
}

/**
 * Export selected items to CSV
 */
function bulkExport() {
  const selectedItems = getSelectedItems();
  if (selectedItems.length === 0) {
    showNotification("Please select items first", "warning");
    return;
  }
  
  const selectedData = filteredData.filter(item => selectedItems.includes(item.id));
  const csvContent = convertToCSV(selectedData);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${currentContentType}_selected_export.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  showNotification(`Exported ${selectedItems.length} selected items`, "success");
}

/**
 * Convert data array to CSV format
 * @param {Array} data - Array of data objects
 * @returns {string} CSV formatted string
 */
function convertToCSV(data) {
  if (!data.length) return "";
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];
  
  data.forEach(item => {
    const values = headers.map(header => {
      const value = item[header];
      return typeof value === "string" && value.includes(",") 
        ? `"${value}"` 
        : value;
    });
    csvRows.push(values.join(","));
  });
  
  return csvRows.join("\n");
}

/**
 * Delete selected items
 */
function bulkDelete() {
  const selectedItems = getSelectedItems();
  if (selectedItems.length === 0) {
    showNotification("Please select items first", "warning");
    return;
  }
  
  if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
    // Remove from data arrays
    tableData = tableData.filter(item => !selectedItems.includes(item.id));
    filteredData = filteredData.filter(item => !selectedItems.includes(item.id));
    
    // Re-render table
    renderTable(filteredData);
    updateItemCount(filteredData.length);
    updateSelectedRows();
    
    showNotification(`Deleted ${selectedItems.length} items`, "success");
  }
}

/* ==========================================================================
   ITEM ACTIONS
   Functions to handle individual item actions
   ========================================================================== */

/**
 * Edit an item
 * @param {string} id - Item ID
 */
function editItem(id) {
  showNotification(`Editing item ${id}`, "info");
  // This would typically open a modal or navigate to an edit page
  console.log(`Edit item: ${id}`);
}

/**
 * Delete an item
 * @param {string} id - Item ID
 */
function deleteItem(id) {
  if (confirm(`Are you sure you want to delete item ${id}?`)) {
    // Remove from data arrays
    tableData = tableData.filter(item => item.id !== id);
    filteredData = filteredData.filter(item => item.id !== id);
    
    // Re-render table
    renderTable(filteredData);
    updateItemCount(filteredData.length);
    
    showNotification(`Deleted item ${id}`, "success");
  }
}

/* ==========================================================================
   UTILITY FUNCTIONS
   Helper functions for various operations
   ========================================================================== */

/**
 * Toggle filter panel visibility
 * @param {string} filterId - Filter panel ID
 */
function toggleFilter(filterId) {
  const filterPanel = document.getElementById(filterId);
  if (filterPanel) {
    filterPanel.style.display = filterPanel.style.display === "none" ? "block" : "none";
  }
}

/* ==========================================================================
   INITIALIZATION
   Initialize the page when DOM is loaded
   ========================================================================== */

/* ==========================================================================
   INITIALIZATION
   Initialize the page when DOM is loaded
   ========================================================================== */

/**
 * PAGE INITIALIZATION OVERVIEW:
 * The page initialization happens in this sequence:
 * 1. DOM loads completely
 * 2. DOMContentLoaded event fires
 * 3. Layout manager initializes page layout
 * 4. Content initialization reads URL and loads config
 * 5. Event listeners are set up
 * 6. Page is ready for user interaction
 * 
 * ERROR HANDLING:
 * - All initialization steps are wrapped in try-catch
 * - Errors are logged and user is notified
 * - Page falls back to basic functionality on errors
 * 
 * DEPENDENCIES:
 * - layout-manager.js: Must be loaded for layout initialization
 * - listView-content-config.js: Must be loaded for content config
 * - All other dependencies are optional but recommended
 * 
 * DEBUGGING:
 * - Console logs track initialization progress
 * - debugListView() function available for runtime debugging
 * - All major steps log their completion
 */

/**
 * Initialize the page when DOM is loaded
 * 
 * This is the main entry point that runs when the page loads.
 * It coordinates all the initialization steps and handles errors.
 * 
 * INITIALIZATION STEPS:
 * 1. Layout Manager: Sets up page layout (sidebar, header, etc.)
 * 2. Content Initialization: Reads URL and applies configuration
 * 3. Event Listeners: Sets up additional event handlers
 * 4. Ready State: Page is ready for user interaction
 * 
 * ERROR RECOVERY:
 * - If layout manager fails, continues with content initialization
 * - If content initialization fails, shows error to user
 * - If event listeners fail, basic functionality still works
 */
document.addEventListener("DOMContentLoaded", function() {
  console.log("listView.html: DOM loaded, initializing page...");
  
  try {
    // Initialize layout first
    if (window.LayoutManager) {
      window.LayoutManager.initializePage("listView.html");
    }
    
    // Then initialize content
    initializeContent();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log("listView.html: Page initialization complete");
    
  } catch (error) {
    console.error("Error during page initialization:", error);
    showNotification("Error initializing page", "error");
  }
});

/**
 * Setup additional event listeners
 * 
 * This function sets up event listeners that aren't handled by
 * inline onclick handlers in the HTML.
 * 
 * EVENT LISTENERS:
 * - Window resize: Updates grid view layout
 * - Keyboard shortcuts: Escape to close filter panel
 * - Form changes: Auto-apply filters (optional)
 * 
 * CUSTOMIZATION:
 * Add new event listeners here for:
 * - Keyboard shortcuts
 * - Mouse events
 * - Form interactions
 * - Custom behaviors
 */
function setupEventListeners() {
  // Handle window resize for responsive behavior
  window.addEventListener('resize', function() {
    if (currentView === "grid") {
      renderGridView(filteredData);
    }
  });
  
  // Handle escape key to close filter panel
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const filterPanel = document.getElementById('list-filter');
      if (filterPanel && filterPanel.style.display === 'block') {
        filterPanel.style.display = 'none';
      }
    }
  });
  
  // Auto-apply filters on change (optional)
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('form-select')) {
      // Optional: Auto-apply filters when dropdowns change
      // applyFilters();
    }
  });
}

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    // Refresh data when page becomes visible (optional)
    console.log("Page became visible, consider refreshing data");
  }
});

/* ==========================================================================
   ERROR HANDLING
   Global error handlers and fallback functions
   ========================================================================== */

/* ==========================================================================
   ERROR HANDLING
   Global error handlers and fallback functions
   ========================================================================== */

/**
 * ERROR HANDLING STRATEGY:
 * This section provides global error handling to catch and manage
 * unexpected errors that might occur during page operation.
 * 
 * ERROR TYPES HANDLED:
 * - JavaScript runtime errors
 * - Unhandled promise rejections
 * - Network failures (future enhancement)
 * - Configuration errors
 * 
 * ERROR RESPONSES:
 * - Log detailed error information to console
 * - Show user-friendly error messages
 * - Attempt to maintain basic functionality
 * - Provide recovery options where possible
 * 
 * DEBUGGING:
 * - All errors are logged with context information
 * - Error messages include suggestions for resolution
 * - Console logs help track error sources
 */

/**
 * Global error handler for unhandled errors
 * 
 * Catches JavaScript errors that aren't handled elsewhere
 * and provides user feedback without breaking the page.
 */
window.addEventListener('error', function(e) {
  console.error('Unhandled error:', e.error);
  showNotification('An unexpected error occurred', 'error');
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
  showNotification('An unexpected error occurred', 'error');
});

/* ==========================================================================
   DEBUGGING AND DEVELOPMENT
   Functions to help with debugging and development
   ========================================================================== */

/* ==========================================================================
   DEBUGGING AND DEVELOPMENT
   Functions to help with debugging and development
   ========================================================================== */

/**
 * DEBUGGING TOOLS:
 * This section provides tools for developers to debug and understand
 * the current state of the listView page.
 * 
 * AVAILABLE TOOLS:
 * - debugPageState(): Logs complete page state to console
 * - debugListView(): Alias for debugPageState() (available globally)
 * - Console access to all global variables
 * - Browser developer tools integration
 * 
 * USAGE:
 * Open browser console and run:
 * ```javascript
 * debugListView();              // Shows complete page state
 * console.log(tableData);       // Shows all loaded data
 * console.log(currentContentConfig); // Shows current configuration
 * ```
 * 
 * DEVELOPMENT WORKFLOW:
 * 1. Make changes to code
 * 2. Refresh page
 * 3. Use debugListView() to verify state
 * 4. Check console for any errors
 * 5. Test user interactions
 */

/**
 * Debug function to log current page state
 * 
 * This function dumps all important state information to the console
 * to help developers understand what's happening on the page.
 * 
 * INFORMATION LOGGED:
 * - Current content type and configuration
 * - Data array lengths and sample data
 * - User interaction state (selected items, current view)
 * - Filter and display settings
 * 
 * USAGE:
 * Call from browser console: debugListView()
 */
function debugPageState() {
  console.log("=== ListView Debug Info ===");
  console.log("Current Content Type:", currentContentType);
  console.log("Current View:", currentView);
  console.log("Table Data Length:", tableData.length);
  console.log("Filtered Data Length:", filteredData.length);
  console.log("Selected Items:", getSelectedItems());
  console.log("Current Config:", currentContentConfig);
  console.log("=== End Debug Info ===");
}

/**
 * Expose debug function globally for console access
 */
if (typeof window !== "undefined") {
  window.debugListView = debugPageState;
}

console.log("📋 ListView Logic loaded successfully");