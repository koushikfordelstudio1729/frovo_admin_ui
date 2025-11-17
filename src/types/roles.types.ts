export interface RoleList {
  id: string;
  role: string;
  description: string;
  scope: string;
  user: string;
  lastModified: string;
}

// Stats card
export interface RoleStats {
  id: string;
  name: string;
  count: number;
  icon: string;
}

// Predefined roles
export type RoleType =
  | "Super Admin"
  | "Ops Manager"
  | "Field Agent"
  | "Technician"
  | "Finance Manager"
  | "Support Agent"
  | "Warehouse Manager"
  | "Auditor";

// Role filters
export interface RoleFilters {
  search: string;
  scope?: "Global" | "Partner" | "Machine";
  roleType?: "System" | "Custom";
  status?: "Active" | "Inactive";
}
