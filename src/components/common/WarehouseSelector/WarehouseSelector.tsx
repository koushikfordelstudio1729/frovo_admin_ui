"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Building2 } from "lucide-react";
import { warehouseAPI } from "@/services/warehouseAPI";
import { storageUtils } from "@/utils";
import type { User as AuthUser } from "@/types/auth.types";

interface Warehouse {
  _id: string;
  name: string;
  code: string;
  location: string;
  isActive: boolean;
}

interface WarehouseSelectorProps {
  onWarehouseSelect?: (warehouse: Warehouse) => void;
}

export const WarehouseSelector: React.FC<WarehouseSelectorProps> = ({
  onWarehouseSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndFetchWarehouses = async () => {
      try {
        const user = storageUtils.getUser<AuthUser>();
        if (user && user.roles && user.roles.length > 0) {
          const userRole = user.roles[0];
          const isSuperAdminUser = userRole.systemRole === "super_admin";
          setIsSuperAdmin(isSuperAdminUser);

          if (isSuperAdminUser) {
            // Fetch warehouses for super admin
            const response = await warehouseAPI.getMyWarehouse();
            const apiResponse = response.data;

            if (apiResponse.success && apiResponse.data) {
              const warehouseList = apiResponse.data.warehouses || [];
              setWarehouses(warehouseList);

              // Check if there's a previously selected warehouse in localStorage
              const savedWarehouse = localStorage.getItem("selectedWarehouse");
              if (savedWarehouse) {
                const parsedWarehouse = JSON.parse(savedWarehouse);
                setSelectedWarehouse(parsedWarehouse);
              } else if (warehouseList.length > 0) {
                // Default to first warehouse
                setSelectedWarehouse(warehouseList[0]);
                localStorage.setItem(
                  "selectedWarehouse",
                  JSON.stringify(warehouseList[0])
                );
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchWarehouses();
  }, []);

  const handleWarehouseSelect = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsOpen(false);
    localStorage.setItem("selectedWarehouse", JSON.stringify(warehouse));
    if (onWarehouseSelect) {
      onWarehouseSelect(warehouse);
    }
    // Reload the page to update the warehouse context
    window.location.reload();
  };

  // Only show warehouse selector for super admin
  if (!isSuperAdmin || loading) {
    return null;
  }

  return (
    <div className="relative mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Warehouse
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 flex items-center justify-between hover:border-orange-400 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-orange-500" />
          <div className="text-left">
            <span className="block text-sm font-medium">
              {selectedWarehouse?.name || "Select Warehouse"}
            </span>
            {selectedWarehouse && (
              <span className="block text-xs text-gray-500">
                {selectedWarehouse.code}
              </span>
            )}
          </div>
        </div>
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
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-20 max-h-80 overflow-y-auto">
            {warehouses.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500">
                No warehouses available
              </div>
            ) : (
              warehouses.map((warehouse) => (
                <button
                  key={warehouse._id}
                  onClick={() => handleWarehouseSelect(warehouse)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedWarehouse?._id === warehouse._id
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{warehouse.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {warehouse.code} • {warehouse.location}
                      </div>
                    </div>
                    {warehouse.isActive && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WarehouseSelector;
