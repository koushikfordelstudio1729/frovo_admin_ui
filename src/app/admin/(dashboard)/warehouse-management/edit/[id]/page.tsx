"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  BackHeader,
  Button,
  Input,
  Label,
  Select,
  SuccessDialog,
} from "@/components";
import { warehouseAPI } from "@/services/warehouseAPI";
import { api } from "@/services/api";
import type { UpdateWarehousePayload, Warehouse } from "@/types";

interface Manager {
  id: string;
  name: string;
  email: string;
}

export default function EditWarehousePage() {
  const router = useRouter();
  const params = useParams();
  const warehouseId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [formData, setFormData] = useState<UpdateWarehousePayload>({
    name: "",
    code: "",
    partner: "",
    location: "",
    capacity: 0,
    manager: "",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchWarehouse();
    fetchManagers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warehouseId]);

  const fetchWarehouse = async () => {
    try {
      setFetchLoading(true);
      const response = await warehouseAPI.getWarehouseById(warehouseId);
      if (response.data.success) {
        const warehouseData = response.data.data as unknown as Warehouse;
        setWarehouse(warehouseData);
        setFormData({
          name: warehouseData.name,
          code: warehouseData.code,
          partner: warehouseData.partner,
          location: warehouseData.location,
          capacity: warehouseData.capacity,
          manager: (warehouseData.manager as any)?._id || "",
          isActive: warehouseData.isActive,
        });
      }
    } catch (error) {
      console.error("Error fetching warehouse:", error);
      setErrors({ fetch: "Failed to load warehouse details" });
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await api.get("/users?page=1&limit=100");
      if (response.data.success) {
        const allUsers = response.data.data || [];
        const warehouseManagers = allUsers.filter((user: any) =>
          user.roles?.some(
            (role: any) =>
              role.key === "warehouse_manager_full" ||
              role.key === "warehouse_manager"
          )
        );
        setManagers(
          warehouseManagers.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleChange = (
    field: keyof UpdateWarehousePayload,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (formData.name && !formData.name.trim()) {
      nextErrors.name = "Warehouse name cannot be empty";
    }
    if (formData.code && !formData.code.trim()) {
      nextErrors.code = "Warehouse code cannot be empty";
    }
    if (formData.partner && !formData.partner.trim()) {
      nextErrors.partner = "Partner name cannot be empty";
    }
    if (formData.location && !formData.location.trim()) {
      nextErrors.location = "Location cannot be empty";
    }
    if (formData.capacity && formData.capacity <= 0) {
      nextErrors.capacity = "Capacity must be greater than 0";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await warehouseAPI.updateWarehouse(warehouseId, formData);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error updating warehouse:", error);
      setErrors({
        submit: "Failed to update warehouse. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => {
      handleSuccessClose();
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/admin/warehouse-management");
  };

  if (fetchLoading) {
    return (
      <div className="min-h-full bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">
          Loading warehouse details...
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-full bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-xl text-red-600">{errors.fetch}</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full bg-gray-50 p-4">
        {/* Header */}
        <BackHeader title="Edit Warehouse" />

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 ">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                {errors.submit}
              </div>
            )}

            {/* Name + Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Warehouse Name"
                placeholder="Enter warehouse name"
                variant="orange"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
                fullWidth
              />

              <Input
                label="Warehouse Code"
                placeholder="e.g., WH-MUM-001"
                variant="orange"
                value={formData.code || ""}
                onChange={(e) => handleChange("code", e.target.value)}
                error={errors.code}
                fullWidth
              />
            </div>

            {/* Partner */}
            <Input
              label="Partner"
              placeholder="Enter partner name"
              variant="orange"
              value={formData.partner || ""}
              onChange={(e) => handleChange("partner", e.target.value)}
              error={errors.partner}
              fullWidth
            />

            {/* Location */}
            <Input
              label="Location"
              placeholder="Enter full address"
              variant="orange"
              value={formData.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              error={errors.location}
              fullWidth
            />

            {/* Capacity + Manager */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Capacity"
                type="number"
                variant="orange"
                placeholder="Enter capacity"
                value={formData.capacity || ""}
                onChange={(e) =>
                  handleChange("capacity", parseInt(e.target.value) || 0)
                }
                error={errors.capacity}
                fullWidth
              />

              <div>
                <Select
                  label="Warehouse Manager"
                  value={formData.manager || ""}
                  onChange={(value) => handleChange("manager", value)}
                  options={managers.map((m) => ({
                    value: m.id,
                    label: `${m.name} - ${m.email}`,
                  }))}
                  placeholder="Select a manager"
                  fullWidth
                  variant="orange"
                  selectClassName={`px-3 py-4 text-sm ${
                    errors.manager ? "border-red-500" : ""
                  }`}
                />
                {errors.manager && (
                  <p className="mt-1 text-sm text-red-500">{errors.manager}</p>
                )}
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive ?? true}
                onChange={(e) => handleChange("isActive", e.target.checked)}
                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
              />
              <Label
                htmlFor="isActive"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Active
              </Label>
            </div>

            {/* Meta info */}
            {warehouse && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Created By:</span>
                    <p className="font-medium text-gray-900">
                      {warehouse.createdBy.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Created At:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(warehouse.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={loading}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                disabled={loading}
                className="rounded-lg"
              >
                Update Warehouse
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Success dialog */}
      <SuccessDialog
        open={showSuccess}
        title="Warehouse updated"
        message="The warehouse has been updated successfully."
        primaryText="Back to list"
        onClose={handleSuccessClose}
      />
    </>
  );
}
