export interface WarehouseMenuItem {
  label: string;
  href: string;
  icon: string;
}

export const warehouseNavigation: WarehouseMenuItem[] = [
  { label: "Dashboard", href: "/warehouse/dashboard", icon: "layoutDashboard" },
  { label: "Inbound", href: "/warehouse/inbound", icon: "arrowDownLeft" },
  { label: "Outbound", href: "/warehouse/outbound", icon: "arrowUpRight" },

  {
    label: "Inventory & Layout Management",
    href: "/warehouse/inventory",
    icon: "boxes",
  },
  {
    label: "Budget & Expense Management",
    href: "/warehouse/budget",
    icon: "wallet",
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
