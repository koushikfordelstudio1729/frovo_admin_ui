"use client";
import { useState } from "react";
import { Button, Input, Label, Select, StatCard, Table } from "@/components";
import StackedBarChart from "@/components/charts/StackedBarChart";
import { useMyWarehouse } from "@/hooks/warehouse";
import {
  categoryOptions,
  partnerOptions,
  warehouseOptions,
  dispatchedOrderData,
  lowStockData,
} from "@/config/warehouse";
import {
  TriangleAlert,
  Eye,
  Pencil,
  Trash2,
  ArrowBigDown,
  ArrowBigUp,
  ClipboardClock,
  Warehouse as WarehouseIcon,
  MapPin,
  User,
  Package,
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
  const { warehouse: myWarehouse, loading: warehouseLoading, error: warehouseError } = useMyWarehouse();
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [partner, setPartner] = useState("");
  const [warehouse, setWarehouse] = useState("");

  // Debug: Log warehouse data
  console.log('Dashboard - Warehouse data:', { myWarehouse, warehouseLoading, warehouseError });

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
    <div className="min-h-screen pt-12">
      {/* Warehouse Information Header */}
      {warehouseLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ) : warehouseError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-sm">
            <strong>Error loading warehouse:</strong> {warehouseError}
          </p>
        </div>
      ) : myWarehouse ? (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <WarehouseIcon className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">{myWarehouse.name}</h1>
                  <p className="text-blue-100 text-sm">Code: {myWarehouse.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-xs text-blue-200">Location</p>
                    <p className="text-sm font-medium">{myWarehouse.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-xs text-blue-200">Capacity</p>
                    <p className="text-sm font-medium">{myWarehouse.capacity.toLocaleString()} units</p>
                  </div>
                </div>

                {myWarehouse.manager && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-200" />
                    <div>
                      <p className="text-xs text-blue-200">Manager</p>
                      <p className="text-sm font-medium">{myWarehouse.manager.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                myWarehouse.isActive
                  ? 'bg-green-400 text-green-900'
                  : 'bg-red-400 text-red-900'
              }`}>
                {myWarehouse.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      ) : null}

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
          count={"120"}
          icon={ArrowBigDown}
          className="p-8 w-sm"
        />
        <StatCard
          title="Outbound"
          count={"80"}
          icon={ArrowBigUp}
          className="p-8 w-sm"
        />
        <StatCard
          title="Pending QC"
          count={"53"}
          icon={ClipboardClock}
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
