"use client";

import type { RouteGuardProps } from "../../types";

interface AuthGuardProps extends RouteGuardProps {
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = null,
  redirectTo = "/login",
}) => {
  // Temporarily disabled for development without backend
  // Just render children directly
  return <>{children}</>;
};

export default AuthGuard;
