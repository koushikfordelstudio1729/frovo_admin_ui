"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, Input, Label } from "@/components";
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

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      // Fetch all users and filter for warehouse managers
      const response = await api.get("/users?page=1&limit=100");
      console.log("Users API response:", response.data);

      if (response.data.success) {
        // Filter users who have warehouse_manager_full role
        const allUsers = response.data.data || [];
        const warehouseManagers = allUsers.filter((user: any) =>
          user.roles?.some((role: any) =>
            role.key === "warehouse_manager_full" || role.key === "warehouse_manager"
          )
        );
        console.log("Filtered warehouse managers:", warehouseManagers);
        setManagers(warehouseManagers);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const handleChange = (field: keyof CreateWarehousePayload, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Warehouse name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Warehouse code is required";
    }

    if (!formData.partner.trim()) {
      newErrors.partner = "Partner name is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0";
    }

    if (!formData.manager) {
      newErrors.manager = "Manager is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      console.log("Form data being sent:", formData);
      await warehouseAPI.createWarehouse(formData);
      router.push("/admin/warehouse-management");
    } catch (error) {
      console.error("Error creating warehouse:", error);
      setErrors({ submit: "Failed to create warehouse. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-gray-700 hover:text-gray-900 p-1"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Warehouse</h1>
          <p className="text-gray-600 mt-2">Add a new warehouse to the system</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Warehouse Name"
              placeholder="Enter warehouse name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              required
              fullWidth
            />

            <Input
              label="Warehouse Code"
              placeholder="e.g., WH-MUM-001"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              error={errors.code}
              required
              fullWidth
            />
          </div>

          <Input
            label="Partner"
            placeholder="Enter partner name"
            value={formData.partner}
            onChange={(e) => handleChange("partner", e.target.value)}
            error={errors.partner}
            required
            fullWidth
          />

          <Input
            label="Location"
            placeholder="Enter full address"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            error={errors.location}
            required
            fullWidth
          />

          <Input
            label="Capacity"
            type="number"
            placeholder="Enter capacity"
            value={formData.capacity || ""}
            onChange={(e) => handleChange("capacity", parseInt(e.target.value) || 0)}
            error={errors.capacity}
            required
            fullWidth
          />

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Warehouse Manager <span className="text-red-500">*</span>
            </Label>
            <select
              value={formData.manager}
              onChange={(e) => handleChange("manager", e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.manager ? "border-red-500" : "border-gray-300"
              }`}
              required
            >
              <option value="">Select a manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name} - {manager.email}
                </option>
              ))}
            </select>
            {errors.manager && (
              <p className="mt-1 text-sm text-red-500">{errors.manager}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
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
  );
}
