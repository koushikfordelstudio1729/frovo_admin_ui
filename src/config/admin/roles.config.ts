import { RoleStats, RoleType, RoleList } from "@/types/roles.types";

// Mock roles data
export const MOCK_ROLES: RoleList[] = [
  {
    id: 1,
    role: "Super Admin",
    description: "Full system access and control",
    scope: "Global",
    user: "Sankalp",
    lastModified: "22-10-2025",
  },
  {
    id: 2,
    role: "Ops Manager",
    description: "Manages operations and refills",
    scope: "Global",
    user: "Koushik",
    lastModified: "21-10-2025",
  },
  {
    id: 3,
    role: "Field Agent",
    description: "Executes refills and submits proof",
    scope: "Machine",
    user: "Jatin",
    lastModified: "20-10-2025",
  },
  {
    id: 4,
    role: "Technician",
    description: "Handles breakdowns and alerts",
    scope: "Machine",
    user: "Nithin",
    lastModified: "19-10-2025",
  },
  {
    id: 5,
    role: "Finance Manager",
    description: "Manages reconciliation and payouts",
    scope: "Global",
    user: "Sankalp",
    lastModified: "18-10-2025",
  },
  {
    id: 6,
    role: "Support Agent",
    description: "Handles refunds and escalations",
    scope: "Global",
    user: "Koushik",
    lastModified: "17-10-2025",
  },
  {
    id: 7,
    role: "Warehouse Manager",
    description: "Manages stock and logistics",
    scope: "Partner",
    user: "Jatin",
    lastModified: "16-10-2025",
  },
  {
    id: 8,
    role: "Auditor",
    description: "Read-only reporting access",
    scope: "Global",
    user: "Nithin",
    lastModified: "15-10-2025",
  },
  {
    id: 9,
    role: "Ops Manager",
    description: "Manages operations and refills",
    scope: "Partner",
    user: "Sankalp",
    lastModified: "14-10-2025",
  },
  {
    id: 10,
    role: "Field Agent",
    description: "Executes refills and submits proof",
    scope: "Global",
    user: "Koushik",
    lastModified: "13-10-2025",
  },
  {
    id: 11,
    role: "Technician",
    description: "Handles breakdowns and alerts",
    scope: "Partner",
    user: "Jatin",
    lastModified: "12-10-2025",
  },
];

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
