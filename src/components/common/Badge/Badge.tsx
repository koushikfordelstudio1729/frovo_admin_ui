"use client";

import React from "react";

interface BadgeProps {
  label: string;
  variant?: "global" | "machine" | "partner";
}

const variantStyles = {
  global: "bg-green-100 text-green-800",
  machine: "bg-blue-100 text-blue-800",
  partner: "bg-purple-100 text-purple-800",
};

export const Badge: React.FC<BadgeProps> = ({ label, variant }) => {
  // Auto-detect variant from label if not provided
  let detectedVariant: "global" | "machine" | "partner" = variant || "global";

  if (label.toLowerCase() === "global") {
    detectedVariant = "global";
  } else if (label.toLowerCase() === "machine") {
    detectedVariant = "machine";
  } else if (label.toLowerCase() === "partner") {
    detectedVariant = "partner";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantStyles[detectedVariant]} px-6 py-1 text-sm`}
    >
      {label}
    </span>
  );
};

export default Badge;
