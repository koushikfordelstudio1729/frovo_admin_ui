"use client";

import { useState, useEffect } from "react";
import { Badge, Button, Select, StatCard, Table, ConfirmDialog } from "@/components";
import { DollarSign, Plus, TrendingUp, Clock } from "lucide-react";
import SimpleLineChart from "@/components/charts/SimpleLineChart";
import { useRouter } from "next/navigation";
import { useMyWarehouse } from "@/hooks/warehouse";
import { warehouseAPI } from "@/services/warehouseAPI";
import { toast } from "react-hot-toast";

const expenseColumns = [
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount" },
  { key: "vendor", label: "Vendor" },
  { key: "status", label: "Status" },
  { key: "paymentStatus", label: "Payment" },
  { key: "actions", label: "Actions" },
];

export const categoryOptions = [
  { label: "All", value: "" },
  { label: "Transport", value: "transport" },
  { label: "Supplies", value: "supplies" },
  { label: "Equipment", value: "equipment" },
  { label: "Staffing", value: "staffing" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Utilities", value: "utilities" },
  { label: "Other", value: "other" },
];

const statusFilterOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

const months = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
];

export default function BudgetExpensesPage() {
  const router = useRouter();
  const { warehouse, loading: warehouseLoading } = useMyWarehouse();

  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<any>(null);

  // Fetch expenses and summary
  useEffect(() => {
    if (!warehouse?._id) return;

    const fetchExpensesData = async () => {
      try {
        setLoading(true);

        // Fetch expenses with filters
        const expensesResponse = await warehouseAPI.getExpenses(warehouse._id, {
          category: category || undefined,
          status: statusFilter || undefined,
        });

        // Fetch summary
        const summaryResponse = await warehouseAPI.getExpenseSummary(warehouse._id);

        if (expensesResponse.data.success) {
          setExpenses(expensesResponse.data.data);
        }

        if (summaryResponse.data.success) {
          setSummary(summaryResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        toast.error("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpensesData();
  }, [warehouse?._id, category, statusFilter]);

  const handleEdit = (row: any) => {
    router.push(`/warehouse/budget-expenses/expense-edit?id=${row._id}`);
  };

  const handleDeleteClick = (row: any) => {
    setExpenseToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;

    try {
      setDeleting(expenseToDelete._id);
      const response = await warehouseAPI.deleteExpense(expenseToDelete._id);

      if (response.data.success) {
        toast.success("Expense deleted successfully");
        // Refresh expenses list
        setExpenses((prev) => prev.filter((exp) => exp._id !== expenseToDelete._id));
        setDeleteDialogOpen(false);
        setExpenseToDelete(null);
      } else {
        toast.error(response.data.message || "Failed to delete expense");
      }
    } catch (error: any) {
      console.error("Error deleting expense:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete expense";
      toast.error(errorMessage);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  const handleStatusChange = async (expenseId: string, newStatus: string) => {
    try {
      setUpdatingStatus(expenseId);
      const response = await warehouseAPI.updateExpenseStatus(expenseId, { status: newStatus });

      if (response.data.success) {
        toast.success("Status updated successfully");
        // Update the expense in the list
        setExpenses((prev) =>
          prev.map((exp) =>
            exp._id === expenseId ? { ...exp, status: newStatus } : exp
          )
        );
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handlePaymentStatusChange = async (expenseId: string, newPaymentStatus: string) => {
    try {
      setUpdatingPaymentStatus(expenseId);
      const response = await warehouseAPI.updateExpensePaymentStatus(expenseId, { paymentStatus: newPaymentStatus });

      if (response.data.success) {
        toast.success("Payment status updated successfully");
        // Update the expense in the list
        setExpenses((prev) =>
          prev.map((exp) =>
            exp._id === expenseId ? { ...exp, paymentStatus: newPaymentStatus } : exp
          )
        );
      } else {
        toast.error(response.data.message || "Failed to update payment status");
      }
    } catch (error: any) {
      console.error("Error updating payment status:", error);
      toast.error(error?.response?.data?.message || "Failed to update payment status");
    } finally {
      setUpdatingPaymentStatus(null);
    }
  };

  const renderExpenseCell = (
    key: string,
    value: any,
    row?: Record<string, any>
  ) => {
    if (key === "date") {
      return new Date(value).toLocaleDateString();
    }

    if (key === "category") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (key === "amount") {
      return `₹${value.toLocaleString()}`;
    }

    if (key === "vendor") {
      return row?.vendor?.vendor_name || "N/A";
    }

    if (key === "status") {
      const statusOptions = [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Rejected", value: "rejected" },
      ];

      return (
        <div className="min-w-[130px]">
          <Select
            id={`status-${row?._id}`}
            options={statusOptions}
            value={value}
            selectClassName={`py-1 px-2 text-sm rounded-md border-2 ${
              value === "approved"
                ? "border-green-500 bg-green-50 text-green-700"
                : value === "pending"
                ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                : "border-red-500 bg-red-50 text-red-700"
            } ${updatingStatus === row?._id ? "opacity-50 cursor-wait" : ""}`}
            onChange={(val) => handleStatusChange(row?._id, val)}
            disabled={updatingStatus === row?._id}
          />
        </div>
      );
    }

    if (key === "paymentStatus") {
      const paymentStatusOptions = [
        { label: "Unpaid", value: "unpaid" },
        { label: "Paid", value: "paid" },
        { label: "Partially Paid", value: "partially_paid" },
      ];

      return (
        <div className="min-w-[150px]">
          <Select
            id={`payment-status-${row?._id}`}
            options={paymentStatusOptions}
            value={value}
            selectClassName={`py-1 px-2 text-sm rounded-md border-2 ${
              value === "paid"
                ? "border-green-500 bg-green-50 text-green-700"
                : value === "partially_paid"
                ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                : "border-gray-500 bg-gray-50 text-gray-700"
            } ${updatingPaymentStatus === row?._id ? "opacity-50 cursor-wait" : ""}`}
            onChange={(val) => handlePaymentStatusChange(row?._id, val)}
            disabled={updatingPaymentStatus === row?._id}
          />
        </div>
      );
    }

    if (key === "actions") {
      return (
        <div className="flex items-center gap-2">
          <Button
            title="Edit"
            size="sm"
            variant="edit"
            className="text-white rounded-md px-4 py-1"
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            title="Delete"
            size="sm"
            variant="reject"
            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-1"
            onClick={() => handleDeleteClick(row)}
          >
            Delete
          </Button>
        </div>
      );
    }

    return value;
  };

  if (warehouseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading warehouse...</p>
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

  return (
    <div className="min-h-screen pt-12 bg-gray-50 p-6">
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
            <p className="text-sm font-medium text-orange-900">Managing expenses for:</p>
            <p className="text-lg font-bold text-orange-950">{warehouse.name}</p>
            <p className="text-xs text-orange-700">Code: {warehouse.code}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end w-full gap-6">
        {/* Category Filter */}
        <div>
          <Select
            label="Category Filter"
            id="filter-category"
            value={category}
            options={categoryOptions}
            selectClassName="px-6 py-2 bg-white text-sm"
            onChange={(val) => setCategory(val)}
          />
        </div>

        {/* Status Filter */}
        <div>
          <Select
            label="Status Filter"
            id="filter-status"
            value={statusFilter}
            options={statusFilterOptions}
            selectClassName="px-6 py-2 bg-white text-sm"
            onChange={(val) => setStatusFilter(val)}
          />
        </div>

        <div className="flex-1" />

        {/* Add Expense */}
        <div>
          <Button
            className="px-6 rounded-sm"
            variant="primary"
            onClick={() =>
              router.push("/warehouse/budget-expenses/expense-entry")
            }
          >
            <Plus size={18} className="mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="flex flex-row gap-6 mt-6">
        <StatCard
          title="Total Expenses"
          count={summary ? `₹${summary.total.toLocaleString()}` : "₹0"}
          icon={DollarSign}
          className="p-8 w-sm"
        />
        <StatCard
          title="Approved"
          count={summary ? `₹${summary.approved.toLocaleString()}` : "₹0"}
          icon={TrendingUp}
          className="p-8 w-sm"
        />
        <StatCard
          title="Pending"
          count={summary ? `₹${summary.pending.toLocaleString()}` : "₹0"}
          icon={Clock}
          className="p-8 w-sm"
        />
      </div>

      {/* Stacked Bar Chart */}
      <div className="mt-6">
        <SimpleLineChart />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mt-6 text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading expenses...</p>
        </div>
      )}

      {/* Expenses Table */}
      {!loading && (
        <div className="space-y-10 mt-8">
          <div className="mt-6">
            {expenses.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No expenses found</p>
              </div>
            ) : (
              <Table
                columns={expenseColumns}
                data={expenses}
                renderCell={renderExpenseCell}
              />
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Expense"
        message={`Are you sure you want to delete this expense (${expenseToDelete?.category})? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={deleting !== null}
      />
    </div>
  );
}
