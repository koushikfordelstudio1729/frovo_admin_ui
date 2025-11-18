"use client";
import { useState } from "react";
import { Button, Input, Label, Select, StatCard, Table } from "@/components";
import StackedBarChart from "@/components/charts/StackedBarChart";
import {
  categoryOptions,
  partnerOptions,
  warehouseOptions,
  dispatchedOrderData,
  lowStockData,
} from "@/config/warehouse";
import {
  ClipboardCheck,
  TriangleAlert,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

const statCards = [
  {
    id: "inbound",
    name: "Inbound",
    count: 120,
    icon: "clipboard-check",
  },
  {
    id: "outbound",
    name: "Outbound",
    count: 80,
    icon: "shield-alert",
  },
  {
    id: "pending-qc",
    name: "Pending QC",
    count: 53,
    icon: "clock",
  },
];

const chartData = [
  { name: "Mon", pending: 40, refill: 15 },
  { name: "Tue", pending: 60, refill: 20 },
  { name: "Wed", pending: 55, refill: 20 },
  { name: "Thu", pending: 55, refill: 20 },
  { name: "Fri", pending: 40, refill: 20 },
  { name: "Sat", pending: 65, refill: 30 },
  { name: "Sun", pending: 65, refill: 35 },
];

const dispatchedOrderColumns = [
  { key: "dispatchId", label: "Dispatch Id" },
  { key: "vendor", label: "Vendor" },
  { key: "productSku", label: "Product SKU" },
  { key: "quantity", label: "Quantity" },
  { key: "agent", label: "Agent Assigned" },
  { key: "actions", label: "Actions" },
];

const lowStockColumns = [
  { key: "itemId", label: "Item ID" },
  { key: "itemName", label: "Item Name" },
  { key: "category", label: "Category" },
  { key: "currentStock", label: "Current Stock" },
  { key: "lastRestocked", label: "Last Restocked" },
  { key: "warehouseZone", label: "Warehouse Zone" },
];

export default function Dashboard() {
  const [date, setDate] = useState("2025-01-18");
  const [category, setCategory] = useState("");
  const [partner, setPartner] = useState("");
  const [warehouse, setWarehouse] = useState("");

  const handleView = (row: any) => {
    console.log("View", row);
  };
  const handleEdit = (row: any) => {
    console.log("Edit", row);
  };
  const handleDelete = (row: any) => {
    console.log("Delete", row);
  };

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    if (key === "actions") {
      return (
        <div className="flex items-center">
          <Button
            title="View"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
            onClick={() => handleView(row)}
          >
            <Eye className="text-green-500 w-5 h-5" />
          </Button>
          <Button
            title="Edit"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
            onClick={() => handleEdit(row)}
          >
            <Pencil className="text-blue-500 w-5 h-5" />
          </Button>
          <Button
            title="Delete"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
            onClick={() => handleDelete(row)}
          >
            <Trash2 className="text-red-500 w-5 h-5" />
          </Button>
        </div>
      );
    }
    return value;
  };

  return (
    <div className="min-h-full pt-12">
      <div className="flex items-end w-full gap-6">
        {/* Select Date */}
        <div>
          <Input
            id="filter-date"
            label="Select date"
            variant="date"
            type="date"
            className="flex flex-col"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Category */}
        <div>
          <Select
            label="Category"
            id="filter-category"
            value={category}
            options={categoryOptions}
            selectClassName="px-6 py-2 bg-white text-sm"
            onChange={(val) => setCategory(val)}
          />
        </div>

        {/* Partner */}
        <div>
          <Select
            label="Partner"
            id="filter-partner"
            selectClassName="px-6 py-2 bg-white text-sm"
            options={partnerOptions}
            value={partner}
            onChange={(val) => setPartner(val)}
          />
        </div>
        <div className="flex-1" />

        {/* All / Partner */}
        <div>
          <Select
            label="All / Partner"
            id="filter-warehouse"
            selectClassName="px-6 py-2 bg-white text-sm"
            options={warehouseOptions}
            value={warehouse}
            onChange={(val) => setWarehouse(val)}
          />
        </div>
      </div>
      <Label className="inline-flex items-center bg-[#FD4949] text-white text-sm rounded-lg px-4 py-3 shadow-sm mt-6 select-none cursor-default">
        <TriangleAlert className="w-5 h-5 mr-2" />3 Batches Pending QC
      </Label>
      <div className=" flex flex-row gap-6 mt-6">
        <StatCard
          title="Inbound"
          count={120}
          icon={ClipboardCheck}
          className="p-8 w-sm"
        />
        <StatCard
          title="Outbound"
          count={120}
          icon={ClipboardCheck}
          className="p-8 w-sm"
        />
        <StatCard
          title="Pendin QC"
          count={120}
          icon={ClipboardCheck}
          className="p-8 w-sm"
        />
      </div>
      {/* Stacked Bar Chart */}
      <div className="mt-6">
        <StackedBarChart data={chartData} />
      </div>
      {/* Tables */}
      <div className="space-y-10 mt-8">
        {/* Dispatched order table */}
        <Label className="text-lg font-bold">Dispatched order</Label>
        <div className="mt-6">
          <Table
            columns={dispatchedOrderColumns}
            data={dispatchedOrderData}
            renderCell={renderCell}
          />
        </div>
        {/* Low Stock Items table */}
        <Label className="text-lg font-bold">Low Stock Items</Label>
        <div className="mt-6">
          <Table columns={lowStockColumns} data={lowStockData} />
        </div>
      </div>
    </div>
  );
}
