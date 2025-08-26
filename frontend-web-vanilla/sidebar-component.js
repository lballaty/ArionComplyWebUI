// sidebar-component.js
// Dynamic sidebar generation and management

class SidebarComponent {
  static generateSidebar(currentPage, userRole = "admin") {
    const navigationItems = this.getNavigationForRole(userRole);
    const menuItems = this.generateMenuItems(navigationItems, currentPage);

    return `
            <nav class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <div class="logo">
                        <i class="fas fa-shield-alt"></i>
                        <span style="margin-left: 0.5rem;">ArionComply</span>
                    </div>
                </div>
                <ul class="nav-menu">
                    ${menuItems}
                </ul>
            </nav>
        `;
  }

  static generateMenuItems(navigationItems, currentPage) {
    return navigationItems
      .map((item) => {
        const hasSub = item.subItems && item.subItems.length > 0;
        const isActive = this.isCurrentPage(item.url, currentPage);
        const activeClass = isActive ? "active" : "";
        const subMenu = hasSub
          ? this.generateSubMenu(item.subItems, currentPage)
          : "";
        const toggleAttr = hasSub ? 'data-toggle="submenu"' : "";

        return `
                <li class="nav-item${hasSub ? " has-sub" : ""}">
                    <a href="${hasSub ? "#" : item.url}" class="nav-link ${activeClass}"
                       title="${item.description}" data-shortcut="${item.shortcut}" ${toggleAttr}>
                        <i class="${item.icon}"></i>
                        <span>${item.name}</span>
                    </a>
                    ${subMenu}
                </li>
            `;
      })
      .join("");
  }

  static generateSubMenu(subItems, currentPage) {
    const items = subItems
      .map((sub) => {
        const isActive = this.isCurrentPage(sub.url, currentPage);
        const activeClass = isActive ? "active" : "";
        return `
                <li class="nav-item">
                    <a href="${sub.url}" class="nav-link ${activeClass}" title="${sub.description || ""}">
                        <i class="${sub.icon}"></i>
                        <span>${sub.name}</span>
                    </a>
                </li>
            `;
      })
      .join("");

    return `<ul class="sub-menu">${items}</ul>`;
  }

  static getNavigationForRole(userRole) {
    // Get user role from localStorage or default to admin
    const userData = localStorage.getItem("arioncomply_user");
    let role = userRole;

    if (userData) {
      try {
        const user = JSON.parse(userData);
        role = user.role || "admin";
      } catch (e) {
        console.warn("Could not parse user data, using default role");
      }
    }

    return ROLE_NAVIGATION[role] || NAVIGATION_ITEMS;
  }

  static isCurrentPage(itemUrl, currentPage) {
    // Extract filename from current page
    const currentFile = currentPage.split("/").pop().split("?")[0];
    const itemFile = itemUrl.split("/").pop().split("?")[0];

    // Handle special cases
    if (itemUrl.includes("listView.html")) {
      const urlParams = new URLSearchParams(window.location.search);
      const currentType = urlParams.get("type");
      const itemType = new URLSearchParams(itemUrl.split("?")[1] || "").get(
        "type",
      );

      return currentFile === "listView.html" && currentType === itemType;
    }

    return currentFile === itemFile;
  }

  static injectSidebar(currentPage, targetSelector = "body") {
    const sidebarHTML = this.generateSidebar(currentPage);
    const sidebarBackdrop =
      '<div class="sidebar-backdrop" id="sidebarBackdrop" onclick="closeSidebar()"></div>';

    // Remove existing sidebar and backdrop
    const existingSidebar = document.getElementById("sidebar");
    const existingBackdrop = document.getElementById("sidebarBackdrop");

    if (existingSidebar) existingSidebar.remove();
    if (existingBackdrop) existingBackdrop.remove();

    // Insert new sidebar and backdrop
    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      targetElement.insertAdjacentHTML(
        "afterbegin",
        sidebarBackdrop + sidebarHTML,
      );
      this.setupSidebarEvents();
    } else {
      console.error("Target element not found for sidebar injection");
    }
  }

  static setupSidebarEvents() {
    // Ensure sidebar toggle functionality works
    this.attachToggleEvents();
    this.setupKeyboardShortcuts();
    this.setupAccessibility();
  }

  static attachToggleEvents() {
    // These functions need to be available globally for onclick handlers
    if (!window.toggleSidebar) {
      window.toggleSidebar = function () {
        const sidebar = document.getElementById("sidebar");
        const backdrop = document.getElementById("sidebarBackdrop");
        if (sidebar && backdrop) {
          sidebar.classList.toggle("open");
          backdrop.classList.toggle("active");
        }
      };
    }

    if (!window.closeSidebar) {
      window.closeSidebar = function () {
        const sidebar = document.getElementById("sidebar");
        const backdrop = document.getElementById("sidebarBackdrop");
        if (sidebar && backdrop) {
          sidebar.classList.remove("open");
          backdrop.classList.remove("active");
        }
      };
    }

    // Toggle submenus
    const subToggles = document.querySelectorAll('[data-toggle="submenu"]');
    subToggles.forEach((toggle) => {
      toggle.addEventListener("click", function (event) {
        event.preventDefault();
        const parent = this.parentElement;
        if (parent) {
          parent.classList.toggle("open");
        }
      });
    });
  }

  static setupKeyboardShortcuts() {
    // Remove existing keyboard listener to avoid duplicates
    document.removeEventListener("keydown", this.keyboardHandler);

    // Add keyboard shortcuts
    this.keyboardHandler = function (event) {
      if (event.altKey) {
        const shortcuts = {
          h: "routing.html",
          d: "dashboard.html",
          a: "listView.html?type=ai",
          r: "listView.html?type=risks",
          c: "calendarView.html",
          p: "documentEditor.html",
          g: "wizzard.html",
          s: "listView.html?type=assets",
          b: "chartView.html",
          t: "settingsPanel.html",
          i: "chatInterface.html",
          l: "prototypeIndex.html",
        };

        const key = event.key.toLowerCase();
        if (shortcuts[key]) {
          event.preventDefault();
          window.location.href = shortcuts[key];
        }
      }

      // ESC to close sidebar
      if (event.key === "Escape") {
        window.closeSidebar();
      }
    };

    document.addEventListener("keydown", this.keyboardHandler);
  }

  static setupAccessibility() {
    // Add ARIA attributes for accessibility
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      sidebar.setAttribute("role", "navigation");
      sidebar.setAttribute("aria-label", "Main navigation");

      // Add keyboard navigation support
      const navLinks = sidebar.querySelectorAll(".nav-link");
      navLinks.forEach((link, index) => {
        link.setAttribute("tabindex", "0");

        link.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this.click();
          }
        });
      });
    }
  }

  static updateActiveState(currentPage) {
    // Update active state without regenerating entire sidebar
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      link.classList.remove("active");

      const linkUrl = link.getAttribute("href");
      if (this.isCurrentPage(linkUrl, currentPage)) {
        link.classList.add("active");
      }
    });
  }

  static addCustomMenuItem(item, position = -1) {
    // Dynamically add menu items (for plugins, etc.)
    const customItem = {
      id: item.id || "custom_" + Date.now(),
      name: item.name,
      icon: item.icon || "fas fa-link",
      url: item.url,
      description: item.description || "",
      shortcut: item.shortcut || "",
    };

    if (position === -1) {
      NAVIGATION_ITEMS.push(customItem);
    } else {
      NAVIGATION_ITEMS.splice(position, 0, customItem);
    }

    // Regenerate sidebar if it exists
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      this.injectSidebar(window.location.pathname);
    }
  }
}

// Export for module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = SidebarComponent;
}
