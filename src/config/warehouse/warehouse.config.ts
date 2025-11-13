export interface WarehouseMenuItem {
  label: string;
  href?: string;
  icon: string;
  children?: { label: string; href: string }[];
}

export const warehouseNavigation: WarehouseMenuItem[] = [
  { label: "Dashboard", href: "/warehouse/dashboard", icon: "layoutDashboard" },
  { label: "Inbound", href: "/warehouse/inbound", icon: "arrowUpRight" },
  {
    label: "Outbound",
    icon: "arrowDownLeft",
    children: [
      { label: "Dispatch Order", href: "/warehouse/outbound/dispatch-order" },
      {
        label: "QC Checklist Templates",
        href: "/warehouse/outbound/qc-checklist",
      },
      {
        label: "Rejection / Return",
        href: "/warehouse/outbound/rejection-return",
      },
      {
        label: "Field Agent Assignment",
        href: "/warehouse/outbound/field-agent",
      },
    ],
  },

  {
    label: "Inventory & Layout Management",
    href: "/warehouse/inventory",
    icon: "boxes",
  },
  {
    label: "Budget & Expense Management",
    icon: "wallet",
    children: [{ label: "Expense Table", href: "/warehouse/budget/expenses" }],
  },
  {
    label: "Reports & Analytics",
    href: "/warehouse/reports",
    icon: "barChart2",
  },

  { label: "User Profile", href: "/warehouse/user-profile", icon: "user" },
  {
    label: "Security Settings",
    href: "/warehouse/security-settings",
    icon: "settings",
  },
];
