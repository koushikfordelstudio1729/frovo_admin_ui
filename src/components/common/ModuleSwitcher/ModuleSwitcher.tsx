"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { storageUtils } from "@/utils";
import type { User as AuthUser } from "@/types/auth.types";

export interface Module {
  name: string;
  path: string;
  label: string;
}

const AVAILABLE_MODULES: Module[] = [
  { name: "admin", path: "/admin/roles-permissions", label: "Admin Panel" },
  { name: "catalogue", path: "/catalogue/sku-master", label: "Catalogue" },
  { name: "vendor", path: "/vendor/dashboard", label: "Vendor Portal" },
  { name: "warehouse", path: "/warehouse/dashboard", label: "Warehouse" },
  { name: "route", path: "/route/area-definitions", label: "Area Management" },
];

interface ModuleSwitcherProps {
  currentModule: string;
}

export const ModuleSwitcher: React.FC<ModuleSwitcherProps> = ({
  currentModule,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const user = storageUtils.getUser<AuthUser>();
    if (user && user.roles && user.roles.length > 0) {
      const userRole = user.roles[0];
      setIsSuperAdmin(userRole.systemRole === "super_admin");
    }
  }, []);

  const current = AVAILABLE_MODULES.find((m) => m.name === currentModule);

  // Only show module switcher for super admin
  if (!isSuperAdmin) {
    return null;
  }

  const handleModuleChange = (module: Module) => {
    setIsOpen(false);
    if (module.name !== currentModule) {
      router.push(module.path);
    }
  };

  return (
    <div className="relative mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-orange-500 text-white rounded-lg px-4 py-3 flex items-center justify-between hover:bg-orange-600 transition-colors"
      >
        <span className="font-semibold text-sm">
          {current?.label || "Select Module"}
        </span>
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-20">
            {AVAILABLE_MODULES.map((module) => (
              <button
                key={module.name}
                onClick={() => handleModuleChange(module)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  module.name === currentModule
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {module.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ModuleSwitcher;
