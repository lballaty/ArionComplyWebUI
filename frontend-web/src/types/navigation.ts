// File path: arioncomply-v1/frontend-web/src/types/navigation.ts

export interface NavigationItem {
  id: string;
  name: string;
  icon: string;
  url: string;
  description?: string;
  category?: string;
  subItems?: NavigationItem[];
  external?: boolean;
  searchTags?: string[];
}

export interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  description: string;
  version: string;
  category: string;
  tags: string[];
  assessmentUrl: string;
  documentationUrl?: string;
  isActive: boolean;
  lastUpdated: string;
}

export enum LayoutType {
  FULL_APP = "full-app",
  HEADER_ONLY = "header-only", 
  STANDALONE = "standalone",
  EMBEDDED = "embedded"
}

export interface PageLayout {
  [pageName: string]: LayoutType;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
  navigationItems: string[];
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export interface NavigationConfig {
  navigationItems: NavigationItem[];
  pageLayouts: PageLayout;
  complianceFrameworks: Record<string, ComplianceFramework>;
  userRoles: Record<string, UserRole>;
  layoutTypes: typeof LayoutType;
}