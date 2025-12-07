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
    label: "Vendor Onboard",
    icon: "userPlus",
    href: "/vendor/vendor-onboard",
  },
  {
    label: "Registered Company",
    icon: "barChart2",
    href: "/vendor/registered-company",
  },
  {
    label: "Audit Trails",
    icon: "fileText",
    href: "/vendor/audit-trails",
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
