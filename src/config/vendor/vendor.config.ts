export interface VendorMenuItem {
  label: string;
  icon: string;
  href?: string;
  children?: { label: string; href: string }[];
}

export const vendorNavigation: VendorMenuItem[] = [
  {
    label: "Dashboard",
    icon: "layoutDashboard",
    href: "/vendor/dashboard",
  },
  {
    label: "Vendor Registration",
    icon: "userPlus",
    children: [
      { label: "Vendor Details", href: "/vendor/registration/details" },
      { label: "Financials", href: "/vendor/registration/financials" },
      { label: "Compliance", href: "/vendor/registration/compliance" },
      { label: "Status", href: "/vendor/registration/status" },
      { label: "Document Uploads", href: "/vendor/registration/documents" },
      { label: "Contract Details", href: "/vendor/registration/contract" },
      { label: "System Access", href: "/vendor/registration/system-access" },
    ],
  },
  {
    label: "Audit Trails",
    icon: "fileText",
    href: "/vendor/audit-trails",
  },
  {
    label: "Dashboard 2",
    icon: "barChart2",
    href: "/vendor/dashboard-2",
  },
  {
    label: "User Profile",
    icon: "user",
    href: "/vendor/profile",
  },
  {
    label: "Security Settings",
    icon: "shield",
    href: "/vendor/security",
  },
];
