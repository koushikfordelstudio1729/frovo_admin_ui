export interface AdminMenuItem {
  label: string;
  href: string;
  icon: string;
}

export const adminNavigation: AdminMenuItem[] = [
  {
    label: "Roles & Permissions",
    href: "/admin/roles-permissions",
    icon: "shield",
  },
  {
    label: "Create / Edit Role",
    href: "/admin/create-role",
    icon: "squarePen",
  },
  {
    label: "Department Management",
    href: "/admin/department-management",
    icon: "building",
  },
  {
    label: "User Management",
    href: "/admin/users-management",
    icon: "users",
  },
  {
    label: "Permissions Management",
    href: "/admin/permissions-management",
    icon: "key",
  },
  {
    label: "Access Requests & Approvals",
    href: "/admin/access-requests",
    icon: "clipboard",
  },
  {
    label: "Audit Logs",
    href: "/admin/audit-logs",
    icon: "history",
  },
  {
    label: "Scoped Role Assignment",
    href: "/admin/special-roles",
    icon: "star",
  },
  {
    label: "User Profile",
    href: "/admin/profile",
    icon: "user",
  },
  {
    label: "Security Settings",
    href: "/admin/settings",
    icon: "settings",
  },
];
