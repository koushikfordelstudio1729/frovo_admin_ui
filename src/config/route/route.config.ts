export interface RouteManagementMenuItem {
  label: string;
  icon: string;
  href?: string;
  // children?: { label: string; href: string }[];
}

export const routeManagementNavigation: RouteManagementMenuItem[] = [
  {
    label: "Area Definitions",
    icon: "layoutDashboard",
    href: "/route/area-definitions",
  },
  {
    label: "Route Planning",
    icon: "userPlus",
    href: "/route/route-planning",
  },
  {
    label: "Tracking",
    icon: "fileText",
    href: "/route/tracking",
  },
];
