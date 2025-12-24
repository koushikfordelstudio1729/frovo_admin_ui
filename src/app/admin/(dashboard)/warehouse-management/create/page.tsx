"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackHeader, Button, Input, Select, SuccessDialog } from "@/components";
import { warehouseAPI } from "@/services/warehouseAPI";
import { api } from "@/services/api";
import type { CreateWarehousePayload } from "@/types";

interface Manager {
  id: string;
  name: string;
  email: string;
}

export default function CreateWarehousePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [formData, setFormData] = useState<CreateWarehousePayload>({
    name: "",
    code: "",
    partner: "",
    location: "",
    capacity: 0,
    manager: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchManagers();
  }, []);

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
    field: keyof CreateWarehousePayload,
    value: string | number
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

    if (!formData.name.trim()) nextErrors.name = "Warehouse name is required";
    if (!formData.code.trim()) nextErrors.code = "Warehouse code is required";
    if (!formData.partner.trim())
      nextErrors.partner = "Partner name is required";
    if (!formData.location.trim()) nextErrors.location = "Location is required";
    if (!formData.capacity || formData.capacity <= 0)
      nextErrors.capacity = "Capacity must be greater than 0";
    if (!formData.manager) nextErrors.manager = "Manager is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await warehouseAPI.createWarehouse(formData);
      setShowSuccess(true); // show dialog instead of redirecting immediately
    } catch (error) {
      console.error("Error creating warehouse:", error);
      setErrors({
        submit: "Failed to create warehouse. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/admin/warehouse-management");
  };

  return (
    <>
      <div className="min-h-full bg-gray-50 p-4">
        {/* Header */}
        <BackHeader title="Create Warehouse" />

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
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
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
                required
                fullWidth
              />

              <Input
                label="Warehouse Code"
                placeholder="e.g., WH-MUM-001"
                variant="orange"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                error={errors.code}
                required
                fullWidth
              />
            </div>

            {/* Partner */}
            <Input
              label="Partner"
              placeholder="Enter partner name"
              variant="orange"
              value={formData.partner}
              onChange={(e) => handleChange("partner", e.target.value)}
              error={errors.partner}
              required
              fullWidth
            />

            {/* Location */}
            <Input
              label="Location"
              placeholder="Enter full address"
              variant="orange"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              error={errors.location}
              required
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
                required
                fullWidth
              />

              <div>
                <Select
                  label="Warehouse Manager"
                  value={formData.manager}
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
                Create Warehouse
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Success dialog */}
      <SuccessDialog
        open={showSuccess}
        title="Warehouse created"
        message="The warehouse has been created successfully."
        primaryText="Go to list"
        onClose={handleSuccessClose}
      />
    </>
  );
}
