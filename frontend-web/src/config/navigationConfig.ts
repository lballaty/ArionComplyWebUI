// File path: arioncomply-v1/frontend-web/src/config/navigationConfig.ts

import { NavigationConfig, NavigationItem, ComplianceFramework, LayoutType } from '@/types/navigation';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: "LayoutDashboard",
    url: "/dashboard",
    description: "Main compliance dashboard with KPIs and metrics",
    category: "main"
  },
  {
    id: "assessments",
    name: "Assessments",
    icon: "ClipboardCheck",
    url: "/assessments",
    description: "Compliance framework assessments and evaluations",
    category: "compliance",
    subItems: [
      {
        id: "iso27001",
        name: "ISO/IEC 27001",
        icon: "Shield",
        url: "/assessments/iso27001",
        description: "Information Security Management System assessment"
      },
      {
        id: "iso27701",
        name: "ISO/IEC 27701",
        icon: "UserCheck",
        url: "/assessments/iso27701", 
        description: "Privacy Information Management System assessment"
      },
      {
        id: "gdpr",
        name: "GDPR",
        icon: "Globe",
        url: "/assessments/gdpr",
        description: "General Data Protection Regulation compliance"
      },
      {
        id: "nis2",
        name: "NIS2",
        icon: "Network",
        url: "/assessments/nis2",
        description: "Network and Information Systems Directive assessment"
      }
    ]
  },
  {
    id: "risk-management",
    name: "Risk Management",
    icon: "AlertTriangle",
    url: "/risks",
    description: "Risk assessment and management tools",
    category: "risk",
    subItems: [
      {
        id: "risk-register",
        name: "Risk Register",
        icon: "FileText",
        url: "/risks/register",
        description: "Comprehensive risk register and tracking"
      },
      {
        id: "risk-assessment",
        name: "Risk Assessment",
        icon: "TrendingUp",
        url: "/risks/assessment",
        description: "Risk analysis and evaluation tools"
      },
      {
        id: "treatment-plans",
        name: "Treatment Plans",
        icon: "Target",
        url: "/risks/treatment",
        description: "Risk treatment and mitigation strategies"
      }
    ]
  },
  {
    id: "policies",
    name: "Policies & Procedures",
    icon: "BookOpen",
    url: "/policies",
    description: "Policy management and documentation",
    category: "documentation",
    subItems: [
      {
        id: "policy-library",
        name: "Policy Library",
        icon: "Library",
        url: "/policies/library",
        description: "Centralized policy repository"
      },
      {
        id: "procedures",
        name: "Procedures",
        icon: "List",
        url: "/policies/procedures",
        description: "Standard operating procedures"
      },
      {
        id: "templates",
        name: "Templates",
        icon: "Copy",
        url: "/policies/templates",
        description: "Policy and procedure templates"
      }
    ]
  },
  {
    id: "audits",
    name: "Audits & Reviews",
    icon: "Search",
    url: "/audits",
    description: "Audit management and compliance reviews",
    category: "audit",
    subItems: [
      {
        id: "audit-schedule",
        name: "Audit Schedule",
        icon: "Calendar",
        url: "/audits/schedule",
        description: "Audit planning and scheduling"
      },
      {
        id: "findings",
        name: "Findings",
        icon: "AlertCircle",
        url: "/audits/findings",
        description: "Audit findings and corrective actions"
      },
      {
        id: "reports",
        name: "Reports",
        icon: "FileBarChart",
        url: "/audits/reports",
        description: "Audit reports and documentation"
      }
    ]
  },
  {
    id: "training",
    name: "Training & Awareness",
    icon: "GraduationCap",
    url: "/training",
    description: "Training programs and awareness campaigns",
    category: "training",
    subItems: [
      {
        id: "courses",
        name: "Training Courses",
        icon: "Play",
        url: "/training/courses",
        description: "Available training courses"
      },
      {
        id: "assignments",
        name: "Assignments",
        icon: "UserCheck",
        url: "/training/assignments",
        description: "Training assignments and tracking"
      },
      {
        id: "certificates",
        name: "Certificates",
        icon: "Award",
        url: "/training/certificates",
        description: "Training certificates and achievements"
      }
    ]
  },
  {
    id: "incidents",
    name: "Incident Management",
    icon: "Siren",
    url: "/incidents",
    description: "Security incident tracking and response",
    category: "security"
  },
  {
    id: "assets",
    name: "Asset Management",
    icon: "Package",
    url: "/assets",
    description: "IT asset inventory and management",
    category: "assets"
  },
  {
    id: "vendors",
    name: "Vendor Management",
    icon: "Users",
    url: "/vendors",
    description: "Third-party vendor risk assessment",
    category: "vendors"
  },
  {
    id: "reports",
    name: "Reports & Analytics",
    icon: "BarChart3",
    url: "/reports",
    description: "Compliance reporting and analytics",
    category: "reporting"
  },
  {
    id: "settings",
    name: "Settings",
    icon: "Settings",
    url: "/settings",
    description: "System configuration and preferences",
    category: "admin"
  },
  {
    id: "help",
    name: "Help & Support",
    icon: "HelpCircle",
    url: "/help",
    description: "Documentation and support resources",
    category: "support"
  }
];

export const COMPLIANCE_FRAMEWORKS: Record<string, ComplianceFramework> = {
  iso27001: {
    id: "iso27001",
    name: "ISO/IEC 27001:2022",
    shortName: "ISO 27001",
    description: "Information Security Management System",
    version: "2022",
    category: "Information Security",
    tags: ["security", "management", "isms", "iso"],
    assessmentUrl: "/assessments/iso27001",
    documentationUrl: "/help/frameworks/iso27001",
    isActive: true,
    lastUpdated: "2024-01-15"
  },
  iso27701: {
    id: "iso27701",
    name: "ISO/IEC 27701:2019",
    shortName: "ISO 27701",
    description: "Privacy Information Management System",
    version: "2019",
    category: "Privacy",
    tags: ["privacy", "management", "pims", "iso"],
    assessmentUrl: "/assessments/iso27701",
    documentationUrl: "/help/frameworks/iso27701",
    isActive: true,
    lastUpdated: "2024-01-15"
  },
  gdpr: {
    id: "gdpr",
    name: "General Data Protection Regulation",
    shortName: "GDPR",
    description: "EU Data Protection Regulation",
    version: "2018",
    category: "Data Protection",
    tags: ["privacy", "data protection", "eu", "regulation"],
    assessmentUrl: "/assessments/gdpr",
    documentationUrl: "/help/frameworks/gdpr",
    isActive: true,
    lastUpdated: "2024-01-15"
  },
  nis2: {
    id: "nis2",
    name: "Network and Information Systems Directive",
    shortName: "NIS2",
    description: "EU Cybersecurity Directive",
    version: "2022",
    category: "Cybersecurity",
    tags: ["cybersecurity", "eu", "directive", "critical infrastructure"],
    assessmentUrl: "/assessments/nis2",
    documentationUrl: "/help/frameworks/nis2",
    isActive: true,
    lastUpdated: "2024-01-15"
  }
};

export const PAGE_LAYOUTS = {
  "/": LayoutType.STANDALONE,
  "/login": LayoutType.STANDALONE,
  "/register": LayoutType.STANDALONE,
  "/dashboard": LayoutType.FULL_APP,
  "/assessments": LayoutType.FULL_APP,
  "/risks": LayoutType.FULL_APP,
  "/policies": LayoutType.FULL_APP,
  "/audits": LayoutType.FULL_APP,
  "/training": LayoutType.FULL_APP,
  "/incidents": LayoutType.FULL_APP,
  "/assets": LayoutType.FULL_APP,
  "/vendors": LayoutType.FULL_APP,
  "/reports": LayoutType.FULL_APP,
  "/settings": LayoutType.FULL_APP,
  "/help": LayoutType.HEADER_ONLY,
  "/chat": LayoutType.EMBEDDED
};

export const USER_ROLES = {
  admin: {
    id: "admin",
    name: "Administrator",
    permissions: ["all"],
    navigationItems: NAVIGATION_ITEMS.map(item => item.id)
  },
  manager: {
    id: "manager", 
    name: "Compliance Manager",
    permissions: ["read", "write", "manage"],
    navigationItems: NAVIGATION_ITEMS.filter(item => 
      !["settings"].includes(item.id)
    ).map(item => item.id)
  },
  auditor: {
    id: "auditor",
    name: "Internal Auditor", 
    permissions: ["read", "audit"],
    navigationItems: ["dashboard", "audits", "risk-management", "policies", "help"]
  },
  user: {
    id: "user",
    name: "End User",
    permissions: ["read"],
    navigationItems: ["dashboard", "policies", "training", "help"]
  }
};

export const navigationConfig: NavigationConfig = {
  navigationItems: NAVIGATION_ITEMS,
  pageLayouts: PAGE_LAYOUTS,
  complianceFrameworks: COMPLIANCE_FRAMEWORKS,
  userRoles: USER_ROLES,
  layoutTypes: LayoutType
};