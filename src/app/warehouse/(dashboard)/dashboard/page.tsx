"use client";
import { useState, useEffect } from "react";
import { Button, Input, Label, Select, StatCard, Table } from "@/components";
import StackedBarChart from "@/components/charts/StackedBarChart";
import { useMyWarehouse, useDashboard } from "@/hooks/warehouse";
import {
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
  TrendingUp,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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

  // Fetch dashboard data with filters
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch } = useDashboard();

  // Refetch when filters change
  useEffect(() => {
    const params: any = {};
    if (date) params.date = date;
    if (category) params.category = category;
    if (partner) params.partner = partner;

    // Only refetch if at least one filter is set, or on initial load
    if (Object.keys(params).length > 0) {
      refetch(params);
    }
  }, [date, category, partner, refetch]);

  // Transform chart data from API response
  const chartData = dashboardData?.pendingVsRefill?.days?.map((day, index) => ({
    name: day,
    pending: dashboardData.pendingVsRefill.pendingPercentages[index] || 0,
    refill: dashboardData.pendingVsRefill.refillPercentages[index] || 0,
  })) || [];

  // Category options from API
  const categoryOptions = dashboardData?.filters?.categories?.map(cat => ({
    value: cat,
    label: cat,
  })) || [];

  // Partner options from API
  const partnerOptions = dashboardData?.filters?.partners?.map(partner => ({
    value: partner,
    label: partner,
  })) || [];

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

      {/* Filters */}
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
      </div>

      {/* Alerts */}
      {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
        <div className="mt-6 space-y-3">
          {dashboardData.alerts.map((alert, index) => (
            <Label
              key={index}
              className="inline-flex items-center bg-[#FD4949] text-white text-sm rounded-lg px-4 py-3 shadow-sm select-none cursor-default"
            >
              <TriangleAlert className="w-5 h-5 mr-2" />
              {alert.message}
            </Label>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      {dashboardLoading ? (
        <div className="flex flex-row gap-6 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-8 w-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : dashboardError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
          <p className="text-red-600 text-sm">
            <strong>Error loading dashboard data:</strong> {dashboardError}
          </p>
        </div>
      ) : dashboardData?.kpis ? (
        <div className="flex flex-row gap-6 mt-6">
          <StatCard
            title="Inbound"
            count={dashboardData.kpis.inbound.toString()}
            icon={ArrowBigDown}
            className="p-8 w-sm"
          />
          <StatCard
            title="Outbound"
            count={dashboardData.kpis.outbound.toString()}
            icon={ArrowBigUp}
            className="p-8 w-sm"
          />
          <StatCard
            title="Pending QC"
            count={dashboardData.kpis.pendingQC.toString()}
            icon={ClipboardClock}
            className="p-8 w-sm"
          />
          <StatCard
            title="Today's Dispatches"
            count={dashboardData.kpis.todayDispatches.toString()}
            icon={TrendingUp}
            className="p-8 w-sm"
          />
        </div>
      ) : null}

      {/* Stacked Bar Chart */}
      {chartData.length > 0 && (
        <div className="mt-6">
          <StackedBarChart data={chartData} />
        </div>
      )}

      {/* Recent Activities */}
      {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {dashboardData.recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg"
              >
                <div className={`p-2 rounded-full ${
                  activity.type === 'inbound' ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {activity.type === 'inbound' ? (
                    <ArrowBigDown className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowBigUp className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-gray-500">By: {activity.user}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
