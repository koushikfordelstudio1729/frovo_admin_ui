"use client";

import { useState } from "react";
import { Badge, Button, Select, StatCard, Table } from "@/components";
import { expenseData } from "@/config/warehouse";
import { Cog, Plus } from "lucide-react";
import SimpleLineChart from "@/components/charts/SimpleLineChart";
import { useRouter } from "next/navigation";

const expenseColumns = [
  { key: "date", label: "Date" },
  { key: "category", label: "Category" },
  { key: "amount", label: "Amount" },
  { key: "vendor", label: "Vendor" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export const categoryOptions = [
  { label: "Staffing ", value: "staffing " },
  { label: "Supplies ", value: "supplies " },
  { label: "Equipment ", value: "equipment " },
  { label: "Transport ", value: "transport " },
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

export default function ExpenseTable() {
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  const handleEdit = (row: any) => {
    const queryParams = new URLSearchParams({
      id: row.id || "",
      date: row.date || "",
      category: row.category || "",
      amount: row.amount || "",
      vendor: row.vendor || "",
    }).toString();

    router.push(`/warehouse/budget-expenses/expense-edit?${queryParams}`);
  };

  const handleDelete = (row: any) => {
    console.log("Delete", row);
  };

  const renderExpenseCell = (
    key: string,
    value: any,
    row?: Record<string, any>
  ) => {
    if (key === "status") {
      return (
        <Badge
          variant={value === "Approve" ? "active" : "warning"}
          label={value}
          className="px-3 py-3 text-sm font-semibold rounded-full"
          size="md"
        />
      );
    }
    if (key === "actions") {
      return (
        <div className="flex items-center gap-2">
          <Button
            title="Edit"
            size="sm"
            className="bg-blue-500 text-white rounded-md px-4 py-1"
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            title="Delete"
            size="sm"
            className="bg-gray-800 text-white rounded-md px-4 py-1"
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
        </div>
      );
    }
    return value;
  };

  return (
    <div className="min-h-full pt-12">
      <div className="flex items-end w-full gap-6">
        {/* Category Filter*/}
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

        {/* Monthly View */}
        <div>
          <Select
            label="Monthly view"
            value={month}
            onChange={setMonth}
            options={months}
            placeholder="Select month"
            selectClassName="px-6 py-2 bg-white text-sm"
            iconSize={18}
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
      <div className=" flex flex-row gap-6 mt-6">
        <StatCard title="Total" count={"120"} icon={Cog} className="p-8 w-sm" />
        <StatCard
          title="Approved"
          count={"120"}
          icon={Cog}
          className="p-8 w-sm"
        />
        <StatCard
          title="Pending"
          count={"120"}
          icon={Cog}
          className="p-8 w-sm"
        />
      </div>
      {/* Stacked Bar Chart */}
      <div className="mt-6">
        <SimpleLineChart />
      </div>
      {/* Tables */}
      <div className="space-y-10 mt-8">
        {/* Dispatched order table */}
        <div className="mt-6">
          <Table
            columns={expenseColumns}
            data={expenseData}
            renderCell={renderExpenseCell}
          />
        </div>
      </div>
    </div>
  );
}
