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
      {
        label: "Vendor Details",
        href: "/vendor/vendor-registration/vendor-details",
      },
      {
        label: "Financials & Compliance",
        href: "/vendor/vendor-registration/financials-compliance",
      },
      {
        label: "Status",
        href: "/vendor/vendor-registration/status",
      },
      {
        label: "Document Uploads & Contract Details",
        href: "/vendor/vendor-registration/documents-contract",
      },

      {
        label: "System Access",
        href: "/vendor/vendor-registration/system-access",
      },
    ],
  },
  {
    label: "Audit Trails",
    icon: "fileText",
    href: "/vendor/audit-trails",
  },
  {
    label: "History",
    icon: "barChart2",
    href: "/vendor/history",
  },
  {
    label: "User Profile",
    icon: "user",
    href: "/vendor/user-profile",
  },
  {
    label: "Security Settings",
    icon: "shield",
    href: "/vendor/security-security",
  },
];
