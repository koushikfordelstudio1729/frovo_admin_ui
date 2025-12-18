export interface CatalogueMenuItem {
  label: string;
  icon: string;
  href?: string;
  children?: { label: string; href: string }[];
}

export const catalogueNavigation: CatalogueMenuItem[] = [
  {
    label: "Category Management",
    icon: "layoutDashboard",
    href: "/catalogue/category-management",
  },
  {
    label: "SKU Master",
    icon: "fileText",
    href: "/catalogue/sku-master",
  },
  {
    label: "Version History",
    icon: "barChart2",
    href: "/catalogue/version-history",
  },
  {
    label: "User Profile",
    icon: "user",
    href: "/catalogue/user-profile",
  },
  {
    label: "Security Settings",
    icon: "shield",
    href: "/catalogue/security-security",
  },
];
