"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const paymentStatusOptions = [
  { label: "Unpaid", value: "unpaid" },
  { label: "Paid", value: "paid" },
  { label: "Partially Paid", value: "partially_paid" },
];

export default function ExpenseEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expenseId = searchParams.get("id");
  const { warehouse, loading: warehouseLoading } = useMyWarehouse();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { fieldAgents, loading: fieldAgentsLoading } = useFieldAgents();

  const [billFile, setBillFile] = useState<File | null>(null);
  const [existingBillUrl, setExistingBillUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    expenseCategory: "",
    amount: "",
    vendor: "",
    date: "",
    assignedAgent: "",
    description: "",
    status: "",
    paymentStatus: "",
  });

  // Fetch expense data
  useEffect(() => {
    const fetchData = async () => {
      if (!expenseId) {
        toast.error("No expense ID provided");
        router.push("/warehouse/budget-expenses");
        return;
      }

      try {
        setLoading(true);

        // Fetch expense by ID
        const expenseResponse = await warehouseAPI.getExpenseById(expenseId);
        if (expenseResponse.data.success) {
          const expense = expenseResponse.data.data;
          setFormData({
            expenseCategory: expense.category || "",
            amount: expense.amount?.toString() || "",
            vendor: expense.vendor?._id || expense.vendor || "",
            date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : "",
            assignedAgent: expense.assignedAgent?._id || expense.assignedAgent || "",
            description: expense.description || "",
            status: expense.status || "pending",
            paymentStatus: expense.paymentStatus || "unpaid",
          });

          // Set existing bill URL if available
          if (expense.billUrl) {
            setExistingBillUrl(expense.billUrl);
          }
        } else {
          toast.error("Failed to load expense");
          router.push("/warehouse/budget-expenses");
          return;
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load expense data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [expenseId, router]);

  // Handle status update separately
  const handleStatusChange = async (newStatus: string) => {
    if (!expenseId) return;

    try {
      const response = await warehouseAPI.updateExpenseStatus(expenseId, { status: newStatus });
      if (response.data.success) {
        setFormData({ ...formData, status: newStatus });
        toast.success("Status updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  // Handle payment status update separately
  const handlePaymentStatusChange = async (newPaymentStatus: string) => {
    if (!expenseId) return;

    try {
      const response = await warehouseAPI.updateExpensePaymentStatus(expenseId, { paymentStatus: newPaymentStatus });
      if (response.data.success) {
        setFormData({ ...formData, paymentStatus: newPaymentStatus });
        toast.success("Payment status updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update payment status");
      }
    } catch (error: any) {
      console.error("Error updating payment status:", error);
      toast.error(error?.response?.data?.message || "Failed to update payment status");
    }
  };

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
    if (!expenseId) {
      toast.error("No expense ID provided");
      return;
    }

    try {
      setSubmitting(true);

      // Only update basic expense details (not status or payment status)
      const payload = {
        category: formData.expenseCategory,
        amount: parseFloat(formData.amount),
        vendor: formData.vendor,
        date: new Date(formData.date).toISOString(),
        description: formData.description,
        assignedAgent: formData.assignedAgent,
        warehouseId: warehouse._id,
      };

      const response = await warehouseAPI.updateExpense(expenseId, payload);

      if (response.data.success) {
        // Upload bill if file is selected
        if (billFile) {
          try {
            const uploadResponse = await warehouseAPI.uploadExpenseBill(expenseId, billFile);
            if (uploadResponse.data.success) {
              toast.success("Expense updated and bill uploaded successfully");
            } else {
              toast.success("Expense updated but bill upload failed");
            }
          } catch (uploadError: any) {
            console.error("Error uploading bill:", uploadError);
            toast.success("Expense updated but bill upload failed");
          }
        } else {
          toast.success("Expense updated successfully");
        }

        router.push("/warehouse/budget-expenses");
      } else {
        toast.error(response.data.message || "Failed to update expense");
      }
    } catch (error: any) {
      console.error("Error updating expense:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update expense";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (warehouseLoading || loading || vendorsLoading || fieldAgentsLoading) {
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
          Edit Expense
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
            <p className="text-sm font-medium text-orange-900">Editing expense for:</p>
            <p className="text-lg font-bold text-orange-950">{warehouse.name}</p>
            <p className="text-xs text-orange-700">Code: {warehouse.code}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8">
        {/* Expense Category & Amount */}
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

        {/* Vendor & Date */}
        <div className="grid grid-cols-2 gap-10 mb-8">
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

        {/* Assigned Agent & Status */}
        <div className="grid grid-cols-2 gap-10 mb-8">
          <div>
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
          </div>
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Status *
            </Label>
            <Select
              id="status"
              options={statusOptions}
              value={formData.status}
              placeholder="Select Status"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) => handleStatusChange(val)}
            />
          </div>
        </div>

        {/* Payment Status & Description */}
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Payment Status *
            </Label>
            <Select
              id="paymentStatus"
              options={paymentStatusOptions}
              value={formData.paymentStatus}
              placeholder="Select Payment Status"
              selectClassName="py-4 px-4 border-2 border-orange-300"
              onChange={(val) => handlePaymentStatusChange(val)}
            />

            {/* Upload Bill */}
            <div className="mt-8">
              <Label className="text-lg font-medium text-gray-700 mb-2 block">
                Upload Bill (Optional)
              </Label>
              <FileUpload
                label=""
                file={billFile}
                onChange={setBillFile}
                existingFileUrl={existingBillUrl}
                existingFileName="Bill Document"
                onRemoveExisting={() => setExistingBillUrl("")}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="text-lg font-medium text-gray-700 mb-2 block">
              Description *
            </Label>
            <Textarea
              id="description"
              rows={8}
              variant="orange"
              value={formData.description}
              placeholder="Monthly stock transport cost"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
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
            {submitting ? "Updating Expense..." : "Update Expense"}
          </Button>
        </div>
      </form>
    </div>
  );
}
