import { RoleStats, RoleType } from "@/types/roles.types";

// Predefined roles with their stats
export const PREDEFINED_ROLES: RoleType[] = [
  "Super Admin",
  "Ops Manager",
  "Field Agent",
  "Technician",
  "Finance Manager",
  "Support Agent",
  "Warehouse Manager",
  "Auditor",
];

// Stats data for dashboard cards
export const ROLE_STATS: RoleStats[] = [
  { id: "1", name: "Ops Manager", count: 30, icon: "shield" },
  { id: "2", name: "Field Agent", count: 12, icon: "briefcase" },
  { id: "3", name: "Technician", count: 18, icon: "wrench" },
  { id: "4", name: "Finance Manager", count: 22, icon: "dollar-sign" },
  { id: "5", name: "Support Agent", count: 23, icon: "headphones" },
  { id: "6", name: "Warehouse Manager", count: 19, icon: "warehouse" },
  { id: "7", name: "Auditor", count: 10, icon: "clipboard-check" },
  { id: "8", name: "System Admin", count: 3, icon: "shield-alert" },
];

// Pagination defaults
export const ROLES_PAGINATION = {
  ITEMS_PER_PAGE: 9,
  DEFAULT_PAGE: 1,
} as const;
