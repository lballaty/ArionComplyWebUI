// layout-manager.js - Enhanced Complete Version
// Flexible layout management for different page types
// Integrates with navigation-config.js and sidebar-component.js

/* ==========================================================================
   LAYOUT MANAGER CLASS
   Main class responsible for managing page layouts and initialization
   ========================================================================== */

/**
 * LayoutManager handles different page layout configurations
 * and manages the initialization of headers, sidebars, and other UI components
 */
class LayoutManager {
  /**
   * Initializes the page layout based on the current page and options
   * @param {string} currentPage - Current page URL or pathname
   * @param {Object} options - Optional configuration parameters
   */
  static initializePage(currentPage = window.location.pathname, options = {}) {
    try {
      // Determine the appropriate layout type for this page
      const layoutType = this.getLayoutType(currentPage, options);

      // Add layout class to body for CSS targeting
      // Remove any existing layout classes first
      document.body.className = document.body.className.replace(
        /layout-\w+/g,
        "",
      );
      document.body.classList.add(`layout-${layoutType}`);

      // Apply the appropriate layout configuration
      switch (layoutType) {
        case LAYOUT_TYPES.STANDALONE:
          this.setupStandaloneLayout();
          break;

        case LAYOUT_TYPES.HEADER_ONLY:
          this.setupHeaderOnlyLayout(currentPage);
          break;

        case LAYOUT_TYPES.FULL_APP:
          this.setupFullAppLayout(currentPage);
          break;

        case LAYOUT_TYPES.EMBEDDED:
          this.setupEmbeddedLayout(currentPage);
          break;

        default:
          console.warn(
            `Unknown layout type: ${layoutType}, defaulting to full app`,
          );
          this.setupFullAppLayout(currentPage);
      }

      // Store current layout for reference by other functions
      this.currentLayout = layoutType;
      this.currentPage = currentPage;

      // Setup common functionality available in all layouts
      this.setupCommonFeatures();

      console.log(`Layout initialized: ${layoutType} for page: ${currentPage}`);
    } catch (error) {
      console.error("Error initializing page layout:", error);
      // Fallback to basic setup if initialization fails
      this.setupCommonFeatures();
    }
  }

  /**
   * Determines the appropriate layout type based on page and context
   * @param {string} currentPage - Current page URL or pathname
   * @param {Object} options - Optional configuration parameters
   * @returns {string} Layout type constant
   */
  static getLayoutType(currentPage, options) {
    try {
      // Check URL parameters first (highest priority)
      const urlParams = new URLSearchParams(window.location.search);

      // URL parameter overrides take precedence
      if (urlParams.get("embed") === "1") {
        return LAYOUT_TYPES.EMBEDDED;
      }

      if (urlParams.get("standalone") === "1") {
        return LAYOUT_TYPES.STANDALONE;
      }

      if (urlParams.get("header-only") === "1") {
        return LAYOUT_TYPES.HEADER_ONLY;
      }

      // Check manual override in options parameter
      if (
        options.layout &&
        Object.values(LAYOUT_TYPES).includes(options.layout)
      ) {
        return options.layout;
      }

      // Auto-detect based on context
      if (window !== window.top) {
        return LAYOUT_TYPES.EMBEDDED; // We're in an iframe
      }

      // Check if user is logged in (basic session check)
      const session = localStorage.getItem("arioncomply_session");
      if (!session || session !== "active") {
        // Extract just the filename for comparison
        const pageName = currentPage.split("/").pop().split("?")[0];

        // Allow certain pages to be viewed without login
        const publicPages = [
          "index.html",
          "help.html",
          "privacy.html",
          "terms.html",
        ];
        if (publicPages.includes(pageName)) {
          return LAYOUT_TYPES.STANDALONE;
        }
      }

      // Use configured default for this page
      const pageName = currentPage.split("/").pop().split("?")[0];
      return PAGE_LAYOUTS[pageName] || LAYOUT_TYPES.FULL_APP;
    } catch (error) {
      console.error("Error determining layout type:", error);
      return LAYOUT_TYPES.FULL_APP; // Safe fallback
    }
  }

  /**
   * Sets up standalone layout (no header, no sidebar)
   * Used for login pages, splash screens, etc.
   */
  static setupStandaloneLayout() {
    console.log("Setting up standalone layout");

    // Remove any existing header and sidebar components
    this.removeIfExists("#sidebar");
    this.removeIfExists("#sidebarBackdrop");
    this.removeIfExists(".header");

    // Adjust main content styling for full-width layout
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.style.marginLeft = "0";
      mainContent.style.width = "100%";
    }
  }

  /**
   * Sets up header-only layout (header but no sidebar)
   * Used for help pages, documentation, etc.
   */
  static setupHeaderOnlyLayout(currentPage) {
    console.log("Setting up header-only layout");

    // Inject header but remove sidebar
    this.injectHeader(currentPage);
    this.removeIfExists("#sidebar");
    this.removeIfExists("#sidebarBackdrop");

    // Adjust main content for no sidebar
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.style.marginLeft = "0";
    }
  }

  /**
   * Sets up full application layout (header and sidebar)
   * Used for main application pages
   */
  static setupFullAppLayout(currentPage) {
    console.log("Setting up full app layout");

    // Inject both header and sidebar
    this.injectHeader(currentPage);

    // Use the enhanced SidebarComponent if available
    if (typeof SidebarComponent !== "undefined") {
      SidebarComponent.injectSidebar(currentPage);
    } else {
      console.warn(
        "SidebarComponent not available, sidebar will not be displayed",
      );
    }

    // Ensure main content accounts for sidebar
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.style.marginLeft = ""; // Use CSS default
    }
  }

  /**
   * Sets up embedded layout (clean embedded view for iframes)
   * Used when the page is displayed within another application
   */
  static setupEmbeddedLayout(currentPage) {
    console.log("Setting up embedded layout");

    // Remove all navigation elements for clean embed
    this.removeIfExists("#sidebar");
    this.removeIfExists("#sidebarBackdrop");
    this.removeIfExists(".header");

    // Add embedded-specific styling
    document.body.classList.add("embedded-mode");

    // Remove any padding/margins for clean embed appearance
    const content = document.querySelector(".content, .main-content");
    if (content) {
      content.style.padding = "1rem";
      content.style.margin = "0";
    }
  }

  /**
   * Injects the header component into the page
   * @param {string} currentPage - Current page for breadcrumb generation
   */
  static injectHeader(currentPage) {
    try {
      // Only inject if header doesn't already exist
      if (document.querySelector(".header")) {
        this.updateHeaderContent(currentPage);
        return;
      }

      const headerHTML = this.generateHeaderHTML(currentPage);

      // Find the best location to inject the header
      const mainContent = document.querySelector(".main-content");
      const appContainer = document.querySelector(".app-container");

      if (mainContent) {
        mainContent.insertAdjacentHTML("afterbegin", headerHTML);
      } else if (appContainer) {
        appContainer.insertAdjacentHTML("afterbegin", headerHTML);
      } else {
        document.body.insertAdjacentHTML("afterbegin", headerHTML);
      }

      // Set up header event listeners
      this.setupHeaderEvents();
    } catch (error) {
      console.error("Error injecting header:", error);
    }
  }

  /**
   * Generates the header HTML structure
   * @param {string} currentPage - Current page for breadcrumb generation
   * @returns {string} HTML string for the header
   */
  static generateHeaderHTML(currentPage) {
    const breadcrumb = this.generateBreadcrumb(currentPage);

    return `
            <header class="header">
                <div class="header-left">
                    <button class="menu-toggle" onclick="toggleSidebar()" title="Toggle navigation menu">
                        <i class="fas fa-bars"></i>
                    </button>
                    <div class="breadcrumb">
                        <span id="breadcrumb-text">${breadcrumb}</span>
                    </div>
                </div>
                <div class="header-actions">
                    <div class="search-bar">
                        <i class="fas fa-search"></i>
                        <input type="text" placeholder="Search..." id="globalSearch" autocomplete="off">
                    </div>
                    <button class="notification-btn" onclick="showNotifications()" title="View notifications">
                        <i class="fas fa-bell"></i>
                        <span class="notification-badge" id="notificationCount">3</span>
                    </button>
                    <button class="user-menu" onclick="showUserMenu()" title="User menu">
                        <i class="fas fa-user-circle"></i>
                    </button>
                </div>
            </header>
        `;
  }

  /**
   * Updates existing header content without recreating the entire header
   * @param {string} currentPage - Current page for updated breadcrumb
   */
  static updateHeaderContent(currentPage) {
    const breadcrumb = this.generateBreadcrumb(currentPage);
    const breadcrumbElement = document.getElementById("breadcrumb-text");
    if (breadcrumbElement) {
      breadcrumbElement.textContent = breadcrumb;
    }
  }

  /**
   * Generates breadcrumb text based on current page and navigation structure
   * @param {string} currentPage - Current page URL or pathname
   * @returns {string} Formatted breadcrumb text
   */
  static generateBreadcrumb(currentPage) {
    try {
      const pageName = currentPage.split("/").pop().split("?")[0];

      // Try to find the page in navigation items
      if (typeof NAVIGATION_ITEMS !== "undefined") {
        const navItem = NAVIGATION_ITEMS.find((item) => {
          const itemPage = item.url.split("/").pop().split("?")[0];
          return itemPage === pageName;
        });

        if (navItem) {
          return `ArionComply > ${navItem.name}`;
        }
      }

      // Fallback breadcrumbs for common pages
      const breadcrumbs = {
        "index.html": "ArionComply > Welcome",
        "routing.html": "ArionComply > AppCenter",
        "dashboard.html": "ArionComply > Dashboard",
        "listView.html": "ArionComply > List View",
        "wizzard.html": "ArionComply > AI Risk Assessment",
        "wizard.html": "ArionComply > AI Risk Assessment",
        "chartView.html": "ArionComply > Analytics",
        "calendarView.html": "ArionComply > Calendar",
        "documentEditor.html": "ArionComply > Document Editor",
        "settingsPanel.html": "ArionComply > Settings",
      };

      return breadcrumbs[pageName] || "ArionComply";
    } catch (error) {
      console.error("Error generating breadcrumb:", error);
      return "ArionComply";
    }
  }

  /**
   * Sets up event listeners for header functionality
   */
  static setupHeaderEvents() {
    try {
      // Global search functionality
      const globalSearch = document.getElementById("globalSearch");
      if (globalSearch) {
        globalSearch.addEventListener("input", function () {
          // Implement global search across modules
          console.log("Global search:", this.value);

          // Show search results or redirect to search page
          if (this.value.trim().length > 2) {
            // In a real application, this would trigger search functionality
            console.log("Searching for:", this.value);
          }
        });

        // Clear search on Escape key
        globalSearch.addEventListener("keydown", function (event) {
          if (event.key === "Escape") {
            this.value = "";
            this.blur();
          }
        });
      }

      // Set up notification and user menu handlers if they don't exist
      if (!window.showNotifications) {
        window.showNotifications = function () {
          console.log("Show notifications panel");
          if (typeof showNotification === "function") {
            showNotification("Notifications feature coming soon", "info");
          }
        };
      }

      if (!window.showUserMenu) {
        window.showUserMenu = function () {
          console.log("Show user menu");
          if (typeof showNotification === "function") {
            showNotification("User menu feature coming soon", "info");
          }
        };
      }
    } catch (error) {
      console.error("Error setting up header events:", error);
    }
  }

  /**
   * Sets up common functionality available in all layouts
   */
  static setupCommonFeatures() {
    try {
      this.setupGlobalKeyboardShortcuts();
      this.setupResponsiveHandling();
      this.initializeUserSession();
    } catch (error) {
      console.error("Error setting up common features:", error);
    }
  }

  /**
   * Sets up global keyboard shortcuts for improved navigation
   */
  static setupGlobalKeyboardShortcuts() {
    // Remove existing listener to avoid duplicates
    if (this.keyboardHandler) {
      document.removeEventListener("keydown", this.keyboardHandler);
    }

    this.keyboardHandler = function (event) {
      try {
        // Ctrl/Cmd + K for global search
        if ((event.ctrlKey || event.metaKey) && event.key === "k") {
          event.preventDefault();
          const searchInput = document.getElementById("globalSearch");
          if (searchInput) {
            searchInput.focus();
            searchInput.select();
          }
        }

        // Ctrl/Cmd + H for AppCenter
        if ((event.ctrlKey || event.metaKey) && event.key === "h") {
          event.preventDefault();
          window.location.href = "routing.html";
        }

        // Escape key to close modals and popups
        if (event.key === "Escape") {
          // Close any open modals
          const activeModals = document.querySelectorAll(".modal.active");
          activeModals.forEach((modal) => {
            modal.classList.remove("active");
          });

          // Close sidebar if open
          if (typeof closeSidebar === "function") {
            closeSidebar();
          }

          // Close chat if open
          const chatPopup = document.getElementById("chatPopup");
          if (chatPopup && chatPopup.classList.contains("active")) {
            if (typeof toggleChat === "function") {
              toggleChat();
            }
          }
        }
      } catch (error) {
        console.error("Error in keyboard shortcut handler:", error);
      }
    };

    document.addEventListener("keydown", this.keyboardHandler);
  }

  /**
   * Sets up responsive behavior handlers
   */
  static setupResponsiveHandling() {
    // Remove existing listener to avoid duplicates
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }

    this.resizeHandler = function () {
      try {
        // Auto-close sidebar on mobile
        if (window.innerWidth <= 768) {
          if (typeof closeSidebar === "function") {
            closeSidebar();
          }
        }

        // Adjust chat popup size on very small screens
        const chatPopup = document.getElementById("chatPopup");
        if (chatPopup && window.innerWidth <= 480) {
          chatPopup.style.width = "calc(100vw - 2rem)";
          chatPopup.style.height = "calc(100vh - 4rem)";
        }
      } catch (error) {
        console.error("Error in resize handler:", error);
      }
    };

    window.addEventListener("resize", this.resizeHandler);
  }

  /**
   * Initializes and validates user session
   */
  static initializeUserSession() {
    try {
      // Check and initialize user session
      const userData = localStorage.getItem("arioncomply_user");
      const session = localStorage.getItem("arioncomply_session");

      // For demo purposes, set a default session if none exists
      if (!session) {
        // Only redirect if not on standalone pages and not embedded
        if (
          this.currentLayout !== LAYOUT_TYPES.STANDALONE &&
          this.currentLayout !== LAYOUT_TYPES.EMBEDDED
        ) {
          const currentFile = window.location.pathname.split("/").pop();
          const publicPages = ["index.html", "help.html"];

          if (!publicPages.includes(currentFile)) {
            // For demo, set a default session instead of redirecting
            localStorage.setItem("arioncomply_session", "active");
            localStorage.setItem(
              "arioncomply_user",
              JSON.stringify({
                id: "demo_user",
                name: "Demo User",
                role: "admin",
                email: "demo@arioncomply.com",
              }),
            );
            console.log("Demo session initialized");
          }
        }
      }
    } catch (error) {
      console.error("Error initializing user session:", error);
    }
  }

  /**
   * Utility function to remove elements if they exist
   * @param {string} selector - CSS selector for elements to remove
   */
  static removeIfExists(selector) {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => element.remove());
    } catch (error) {
      console.error(
        `Error removing elements with selector ${selector}:`,
        error,
      );
    }
  }

  /**
   * Dynamically switches layouts without page reload
   * @param {string} newLayoutType - The new layout type to apply
   */
  static switchLayout(newLayoutType) {
    try {
      this.initializePage(this.currentPage, { layout: newLayoutType });
    } catch (error) {
      console.error("Error switching layout:", error);
    }
  }

  /**
   * Gets information about the current layout state
   * @returns {Object} Layout information object
   */
  static getLayoutInfo() {
    return {
      currentLayout: this.currentLayout,
      currentPage: this.currentPage,
      hasHeader: !!document.querySelector(".header"),
      hasSidebar: !!document.querySelector(".sidebar"),
      sidebarOpen:
        document.querySelector(".sidebar")?.classList.contains("open") || false,
      isEmbedded: this.currentLayout === LAYOUT_TYPES.EMBEDDED,
      isStandalone: this.currentLayout === LAYOUT_TYPES.STANDALONE,
    };
  }
}

/* ==========================================================================
   SIDEBAR TOGGLE FUNCTIONS
   Global functions for sidebar control (required by onclick handlers)
   ========================================================================== */

/**
 * Toggles the sidebar visibility
 * This function is called by the hamburger menu button
 */
function toggleSidebar() {
  try {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");

    if (!sidebar) {
      console.warn("Sidebar element not found");
      return;
    }

    const isOpen = sidebar.classList.contains("open");

    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  } catch (error) {
    console.error("Error toggling sidebar:", error);
  }
}

/**
 * Opens the sidebar
 */
function openSidebar() {
  try {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");

    if (sidebar) {
      sidebar.classList.add("open");
    }

    if (backdrop) {
      backdrop.classList.add("active");
    }

    console.log("Sidebar opened");
  } catch (error) {
    console.error("Error opening sidebar:", error);
  }
}

/**
 * Closes the sidebar
 */
function closeSidebar() {
  try {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");

    if (sidebar) {
      sidebar.classList.remove("open");
    }

    if (backdrop) {
      backdrop.classList.remove("active");
    }

    console.log("Sidebar closed");
  } catch (error) {
    console.error("Error closing sidebar:", error);
  }
}

/**
 * Updates the breadcrumb text
 * @param {string} breadcrumbText - The new breadcrumb text to display
 */
function updateBreadcrumb(breadcrumbText) {
  try {
    const breadcrumbElement = document.getElementById("breadcrumb-text");
    if (breadcrumbElement) {
      breadcrumbElement.textContent = breadcrumbText;
    } else {
      console.warn("Breadcrumb element not found");
    }
  } catch (error) {
    console.error("Error updating breadcrumb:", error);
  }
}

/* ==========================================================================
   GLOBAL EXPORTS AND INITIALIZATION
   Export functions and set up global access
   ========================================================================== */

// Export functions to global scope for compatibility
if (typeof window !== "undefined") {
  window.LayoutManager = LayoutManager;
  window.toggleSidebar = toggleSidebar;
  window.openSidebar = openSidebar;
  window.closeSidebar = closeSidebar;
  window.updateBreadcrumb = updateBreadcrumb;
}

// Export for module use if in Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    LayoutManager,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    updateBreadcrumb,
  };
}

// Auto-initialize responsive behaviors when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  try {
    // Set up responsive behaviors
    if (LayoutManager.setupResponsiveHandling) {
      LayoutManager.setupResponsiveHandling();
    }

    // Set up keyboard shortcuts
    if (LayoutManager.setupGlobalKeyboardShortcuts) {
      LayoutManager.setupGlobalKeyboardShortcuts();
    }
  } catch (error) {
    console.error("Error in layout manager DOM ready handler:", error);
  }
});
