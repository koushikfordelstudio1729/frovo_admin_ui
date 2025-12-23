"use client";

import React from "react";

type BadgeVariant =
  | "global"
  | "machine"
  | "partner"
  | "active"
  | "inactive"
  | "pending"
  | "approved"
  | "rejected"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "orange"
  | "delete"
  | "custom";

type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  showDot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  global: "bg-green-400 text-green-900",
  machine: "bg-blue-300 text-blue-900",
  partner: "bg-purple-300 text-purple-900",
  active: "bg-[#79EE52] text-green-800",
  inactive: "bg-[#6B6B6B] text-gray-200",
  pending: "bg-gray-400 text-gray-800",
  approved: "bg-green-500 text-white",
  rejected: "bg-red-500 text-white",
  success: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  warning: "bg-yellow-400 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
  orange: "bg-orange-500 text-white",
  delete: "bg-red-700 text-white",
  custom: "",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-3 py-1 text-xs",
  md: "px-6 py-2 text-sm",
  lg: "px-8 py-4 text-base",
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant,
  size = "md",
  icon,
  showDot = false,
  className = "",
}) => {
  // Auto-detect variant from label if not provided
  const detectedVariant: BadgeVariant = variant || detectVariant(label);

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium ${variantStyles[detectedVariant]} ${sizeStyles[size]} ${className}`}
    >
      {showDot && <span className="w-2 h-2 rounded-full bg-current" />}
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </span>
  );
};

// Auto-detect variant helper function
function detectVariant(label: string): BadgeVariant {
  const lower = label.toLowerCase();

  // Scope detection
  if (lower === "global") return "global";
  if (lower === "machine") return "machine";
  if (lower === "partner") return "partner";

  // Status detection
  if (lower === "active") return "active";
  if (lower === "inactive") return "inactive";

  // Request status detection
  if (lower === "pending") return "pending";
  if (lower === "approved") return "approved";
  if (lower === "rejected") return "rejected";

  // Default
  return "info";
}

export default Badge;
