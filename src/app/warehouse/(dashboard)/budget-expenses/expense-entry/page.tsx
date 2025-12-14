"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  Input,
  Select,
  Button,
  Label,
  Textarea,
  FileUpload,
} from "@/components";
import { useMyWarehouse, useVendors, useFieldAgents } from "@/hooks/warehouse";
import { warehouseAPI } from "@/services/warehouseAPI";
import { toast } from "react-hot-toast";

const categoryOptions = [
  { label: "Transport", value: "transport" },
  { label: "Supplies", value: "supplies" },
  { label: "Equipment", value: "equipment" },
  { label: "Staffing", value: "staffing" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Utilities", value: "utilities" },
  { label: "Other", value: "other" },
];

export default function ExpenseEntryForm() {
  const router = useRouter();
  const { warehouse, loading: warehouseLoading } = useMyWarehouse();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { fieldAgents, loading: fieldAgentsLoading } = useFieldAgents();

  const [billFile, setBillFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    expenseCategory: "",
    amount: "",
    vendor: "",
    date: "",
    assignedAgent: "",
    description: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.expenseCategory) {
      toast.error("Please select an expense category");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (!formData.vendor) {
      toast.error("Please select a vendor");
      return;
    }
    if (!formData.date) {
      toast.error("Please select a date");
      return;
    }
    if (!formData.assignedAgent) {
      toast.error("Please select an assigned agent");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!warehouse?._id) {
      toast.error("No warehouse selected");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        category: formData.expenseCategory,
        amount: parseFloat(formData.amount),
        vendor: formData.vendor,
        date: new Date(formData.date).toISOString(),
        description: formData.description,
        billUrl: billFile ? "https://example.com/bill123.pdf" : undefined, // In real app, upload file first
        assignedAgent: formData.assignedAgent,
        warehouseId: warehouse._id,
      };

      const response = await warehouseAPI.createExpense(payload);

      if (response.data.success) {
        toast.success("Expense created successfully");
        router.push("/warehouse/budget-expenses");
      } else {
        toast.error(response.data.message || "Failed to create expense");
      }
    } catch (error: any) {
      console.error("Error creating expense:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create expense";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (warehouseLoading || vendorsLoading || fieldAgentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            <strong>Error:</strong> No warehouse assigned to your account
          </p>
        </div>
      </div>
    );
  }

  const vendorOptions = vendors.map(v => ({
    label: v.vendor_name,
    value: v._id,
  }));

  const agentOptions = fieldAgents.map(a => ({
    label: a.name,
    value: a._id,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Expense Entry Form
        </h1>
      </div>

      {/* Warehouse Info Card */}
      <div className="bg-linear-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-900">Adding expense for:</p>
            <p className="text-lg font-bold text-orange-950">{warehouse.name}</p>
            <p className="text-xs text-orange-700">Code: {warehouse.code}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8">
        {/* Expense Category */}
        <div className="grid grid-cols-2 gap-10 mb-8">
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Expense Category *
            </Label>
            <Select
              id="expenseCategory"
              options={categoryOptions}
              value={formData.expenseCategory}
              placeholder="Select Category"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) =>
                setFormData({ ...formData, expenseCategory: val })
              }
            />
          </div>
          {/* Amount*/}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Amount *
            </Label>
            <Input
              type="number"
              variant="orange"
              value={formData.amount}
              placeholder="Enter Amount"
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-8">
          {/* Vendor */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Vendor *
            </Label>
            <Select
              id="vendor"
              options={vendorOptions}
              value={formData.vendor}
              placeholder="Select Vendor"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) => setFormData({ ...formData, vendor: val })}
            />
          </div>
          {/* Date */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Date *
            </Label>
            <Input
              type="date"
              variant="orange"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            {/* Assigned Agent */}
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Assigned Agent *
            </Label>
            <Select
              id="assignedAgent"
              options={agentOptions}
              value={formData.assignedAgent}
              placeholder="Select Agent"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) =>
                setFormData({ ...formData, assignedAgent: val })
              }
            />

            {/* Description  */}
            <div className="mt-8">
              <Label className="text-lg font-medium text-gray-700 mb-2 block">
                Description *
              </Label>
              <Textarea
                id="description"
                rows={4}
                variant="orange"
                value={formData.description}
                placeholder="Monthly stock transport cost"
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/*  Upload Bill */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Upload Bill (Optional)
            </Label>
            <FileUpload label="" file={billFile} onChange={setBillFile} />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="rounded-lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="rounded-lg"
            disabled={submitting}
          >
            {submitting ? "Adding Expense..." : "Add Expense"}
          </Button>
        </div>
      </form>
    </div>
  );
}
