/**
 * Role-Based Routing Configuration
 *
 * This file centralizes all role-to-route mappings for the application.
 * Add new roles here to easily extend the routing system.
 */

export interface RoleRouteConfig {
  systemRole: string;
  uiAccess: string;
  defaultRoute: string;
  description?: string;
}

/**
 * Role routing configuration
 * Each entry maps a system role to its default landing page
 */
export const ROLE_ROUTES: Record<string, RoleRouteConfig> = {
  // Super Admin - Full system access
  super_admin: {
    systemRole: "super_admin",
    uiAccess: "Admin Panel",
    defaultRoute: "/admin/roles-permissions",
    description: "Full system access with all permissions",
  },

  // Admin - Administrative access
  admin: {
    systemRole: "admin",
    uiAccess: "Admin Panel",
    defaultRoute: "/admin/dashboard",
    description: "Administrative access to admin panel",
  },

  // Vendor Admin - Vendor management
  vendor_admin: {
    systemRole: "vendor_admin",
    uiAccess: "Admin Panel",
    defaultRoute: "/vendor/registered-company",
    description: "Vendor management with full control over vendor lifecycle",
  },

  // Vendor - Vendor portal access
  vendor: {
    systemRole: "vendor",
    uiAccess: "Vendor Portal",
    defaultRoute: "/vendor/registered-company",
    description: "Vendor portal access",
  },

  // Warehouse Admin - Warehouse management
  warehouse_admin: {
    systemRole: "warehouse_admin",
    uiAccess: "Warehouse Portal",
    defaultRoute: "/warehouse/dashboard",
    description: "Warehouse management with full control",
  },

  // Warehouse Staff - Warehouse operations
  warehouse_staff: {
    systemRole: "warehouse_staff",
    uiAccess: "Warehouse Portal",
    defaultRoute: "/warehouse/dashboard",
    description: "Warehouse staff with limited permissions",
  },

  // Warehouse - General warehouse access
  warehouse: {
    systemRole: "warehouse",
    uiAccess: "Warehouse Portal",
    defaultRoute: "/warehouse/dashboard",
    description: "General warehouse access",
  },

  // Warehouse Manager Full - Full warehouse operations access
  warehouse_manager_full: {
    systemRole: "warehouse_manager_full",
    uiAccess: "Warehouse Portal",
    defaultRoute: "/warehouse/dashboard",
    description: "Warehouse operations with full access - can manage POs, create GRNs, and manage inventory",
  },

  // Warehouse Manager - Standard warehouse manager
  warehouse_manager: {
    systemRole: "warehouse_manager",
    uiAccess: "Warehouse Portal",
    defaultRoute: "/warehouse/dashboard",
    description: "Warehouse operations with partner-level access",
  },

  // Operations Manager - Operations and planogram management
  ops_manager: {
    systemRole: "ops_manager",
    uiAccess: "Admin Panel",
    defaultRoute: "/catalogue/sku-master",
    description: "Operations management with partner-level access - handles machines, planogram, and refills",
  },

  // Custom Operations Manager role
  operations_manager: {
    systemRole: "operations_manager",
    uiAccess: "Admin Panel",
    defaultRoute: "/catalogue/sku-master",
    description: "Custom operations manager role - handles machines and operations",
  },

  // Route Manager - Route and area management
  route_manager: {
    systemRole: "route_manager",
    uiAccess: "Route Portal",
    defaultRoute: "/route/area-definitions",
    description: "Route management - handles area definitions, route planning, and tracking",
  },

  // Area Manager - Area management
  area_manager: {
    systemRole: "area_manager",
    uiAccess: "Route Portal",
    defaultRoute: "/route/area-definitions",
    description: "Area management - handles area definitions and route assignments",
  },
};

/**
 * UI Access to base path mapping
 * Maps the uiAccess field to the base path for that portal
 */
export const UI_ACCESS_BASE_PATHS: Record<string, string> = {
  "Admin Panel": "/admin",
  "Vendor Portal": "/vendor",
  "Warehouse Portal": "/warehouse",
  "Route Portal": "/route",
};

/**
 * Default fallback route if no role matches
 */
export const DEFAULT_FALLBACK_ROUTE = "/admin/dashboard";

/**
 * Get redirect path based on user's system role
 * @param systemRole - The system role key from user.roles[0].systemRole
 * @returns The redirect path for the role
 */
export const getRedirectPathByRole = (systemRole: string): string => {
  const roleConfig = ROLE_ROUTES[systemRole];

  if (roleConfig) {
    return roleConfig.defaultRoute;
  }

  // Fallback to default route if role not found
  console.warn(`Role '${systemRole}' not found in routing configuration. Using default fallback.`);
  return DEFAULT_FALLBACK_ROUTE;
};

/**
 * Get redirect path based on user object (with roles array)
 * Uses the first role's systemRole for routing
 * @param user - User object with roles array
 * @returns The redirect path for the user
 */
export const getRedirectPathByUser = (user: {
  roles?: Array<{ systemRole?: string; key?: string }>;
}): string => {
  if (!user.roles || user.roles.length === 0) {
    console.warn("User has no roles. Using default fallback route.");
    return DEFAULT_FALLBACK_ROUTE;
  }

  // Try to get systemRole first (for system roles), fallback to key (for custom roles)
  const primaryRole = user.roles[0].systemRole || user.roles[0].key;

  if (!primaryRole) {
    console.warn("User role has no systemRole or key property. Using default fallback route.");
    return DEFAULT_FALLBACK_ROUTE;
  }

  return getRedirectPathByRole(primaryRole);
};

/**
 * Get all available system roles
 * @returns Array of all configured system roles
 */
export const getAllSystemRoles = (): string[] => {
  return Object.keys(ROLE_ROUTES);
};

/**
 * Check if a role exists in configuration
 * @param systemRole - The system role to check
 * @returns True if role exists in configuration
 */
export const isValidRole = (systemRole: string): boolean => {
  return systemRole in ROLE_ROUTES;
};

/**
 * Get role configuration by system role
 * @param systemRole - The system role key
 * @returns Role configuration or undefined
 */
export const getRoleConfig = (systemRole: string): RoleRouteConfig | undefined => {
  return ROLE_ROUTES[systemRole];
};

/**
 * Get all roles by UI access level
 * @param uiAccess - The UI access level (e.g., "Admin Panel", "Warehouse Portal")
 * @returns Array of roles that have access to this UI
 */
export const getRolesByUIAccess = (uiAccess: string): RoleRouteConfig[] => {
  return Object.values(ROLE_ROUTES).filter(
    (config) => config.uiAccess === uiAccess
  );
};

/**
 * EXAMPLE: How to add a new role
 *
 * 1. Add a new entry to ROLE_ROUTES:
 *
 *    route_manager: {
 *      systemRole: "route_manager",
 *      uiAccess: "Route Portal",
 *      defaultRoute: "/route/dashboard",
 *      description: "Route management and planning",
 *    },
 *
 * 2. If it's a new UI portal, add to UI_ACCESS_BASE_PATHS:
 *
 *    "Route Portal": "/route",
 *
 * 3. That's it! The system will automatically handle routing for the new role.
 */
