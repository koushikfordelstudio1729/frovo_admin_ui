"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storageUtils } from "@/utils";
import type { User as AuthUser } from "@/types/auth.types";
import { getRedirectPathByUser } from "@/config/roleRouting.config";

interface RoleBasedProtectedRouteProps {
  children: React.ReactNode;
  requiredUIAccess: string; // e.g., "Admin Panel", "Vendor Portal", "Warehouse Portal"
  allowedRoles?: string[]; // Optional: specific system roles allowed (if not provided, uses all roles for the UI access)
}

/**
 * RoleBasedProtectedRoute Component
 *
 * Protects routes by checking both authentication and role-based access.
 * Redirects users to:
 * - Login page if not authenticated
 * - Their own dashboard if they try to access a portal they don't have access to
 *
 * @param requiredUIAccess - The UI access level required (e.g., "Admin Panel", "Vendor Portal")
 * @param allowedRoles - Optional array of specific system roles allowed
 * @param children - The protected content to render
 */
export default function RoleBasedProtectedRoute({
  children,
  requiredUIAccess,
  allowedRoles,
}: RoleBasedProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRole = () => {
      const token = storageUtils.getToken();
      const user = storageUtils.getUser<AuthUser>();

      // Check 1: Is user authenticated?
      if (!token || !user) {
        console.warn("No authentication token found. Redirecting to login.");
        router.push("/login");
        return;
      }

      // Check 2: Does user have roles?
      if (!user.roles || user.roles.length === 0) {
        console.error("User has no roles assigned. Redirecting to login.");
        router.push("/login");
        return;
      }

      // Check 3: Does user have the required UI access?
      const userRole = user.roles[0]; // Use primary role
      const hasRequiredAccess = userRole.uiAccess === requiredUIAccess;

      if (!hasRequiredAccess) {
        console.warn(
          `User does not have access to "${requiredUIAccess}". User has "${userRole.uiAccess}". Redirecting to their dashboard.`
        );
        const redirectPath = getRedirectPathByUser(user);
        router.push(redirectPath);
        return;
      }

      // Check 4: If specific roles are required, check if user has one of them
      if (allowedRoles && allowedRoles.length > 0) {
        const hasAllowedRole = allowedRoles.includes(userRole.systemRole);

        if (!hasAllowedRole) {
          console.warn(
            `User role "${userRole.systemRole}" is not in allowed roles: [${allowedRoles.join(", ")}]. Redirecting to their dashboard.`
          );
          const redirectPath = getRedirectPathByUser(user);
          router.push(redirectPath);
          return;
        }
      }

      // All checks passed - user is authorized
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuthAndRole();
  }, [router, requiredUIAccess, allowedRoles]);

  // Show loading while checking authentication and authorization
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Only render children if authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Helper function to create a protected route component for a specific portal
 * @param uiAccess - The UI access level for the portal
 * @returns A component that wraps children with role-based protection
 */
export const createPortalProtectedRoute = (uiAccess: string) => {
  return function PortalProtectedRoute({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <RoleBasedProtectedRoute requiredUIAccess={uiAccess}>
        {children}
      </RoleBasedProtectedRoute>
    );
  };
};

// Pre-configured protected route components for each portal
export const AdminProtectedRoute = createPortalProtectedRoute("Admin Panel");
export const VendorProtectedRoute = createPortalProtectedRoute("Vendor Portal");
export const WarehouseProtectedRoute =
  createPortalProtectedRoute("Warehouse Portal");
