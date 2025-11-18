"use client";

import { useState } from "react";
import { Button, Select, Input, Label } from "@/components";
import {
  Archive,
  ShoppingCart,
  Timer,
  Truck,
  Tags,
  Box,
  Calendar,
  ThumbsUp,
  BarChart,
  ChevronDown,
} from "lucide-react";
import StatCard from "@/components/common/StatCard";
import InventorySummaryTable from "@/components/tables/InventorySummaryTable ";
import PurchaseOrderTable from "@/components/tables/PurchaseOrderTable ";
import VendorPerformanceTable from "@/components/tables/VendorPerformanceTable ";
import MachineStockTable from "@/components/tables/MachineStockTable ";
import RefillSummaryTable from "@/components/tables/RefillSummaryTable ";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const vendorOptions = [
  { value: "xyz", label: "XYZ" },
  { value: "acme", label: "Acme Corp" },
  { value: "fleetgo", label: "Fleetgo Logistics" },
];

const reportTypeOptions = [
  { label: "Inventory Turnover", value: "inventory_turnover" },
  { label: " QC Summary", value: " qc_summary" },
  { label: " Efficiency", value: " efficiency" },
];

const dataOptions = [
  { label: "Inventory summary", value: "inventory_summary" },
  { label: "Purchase order", value: "purchase_order" },
  { label: "Vendor performance", value: "vendor_performance" },
  { label: "Machine stock", value: "machine_stock" },
  { label: "Refill summary", value: "refill_summary" },
];

export default function InventorySummaryPage() {
  const [dataType, setDataType] = useState("inventory_summary");
  const [reportType, setReportType] = useState("");
  const [date, setDate] = useState("");
  const [skuCategory, setSkuCategory] = useState("");
  const [vendor, setVendor] = useState("");
  const [status, setStatus] = useState("");

  const metrics = [
    { title: "Total SKUs", count: 112, icon: Archive },
    { title: "Total PO's", count: 45, icon: ShoppingCart },
    { title: "Pending", count: 32, icon: Timer },
    { title: "Stock-Out SKUs", count: 68, icon: Truck },
    { title: "Pending POs", count: 12, icon: Timer },
    { title: "Completed Refills", count: 77, icon: ThumbsUp },
    { title: "Total Stock Value", count: 142, icon: Tags },
    { title: "Low Stock Items", count: 30, icon: Box },
    { title: "Near-Expiry SKUs", count: 12, icon: Calendar },
    { title: "Stock Accuracy", count: "89%", icon: BarChart },
  ];

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="flex items-start justify-between my-4">
        {/* Select data */}
        <div>
          <Label className="block text-base text-black font-medium mb-2">
            Select data
          </Label>
          <Select
            id="data"
            variant="default"
            value={dataType}
            options={dataOptions}
            selectClassName="py-3 px-4 text-sm bg-white"
            onChange={setDataType}
          />
        </div>
        {/* Export csv */}
        <Button variant="primary" className="rounded-lg flex gap-2 px-6">
          Export csv <ChevronDown size={18} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-6 mt-3">
        {/* Report Type */}
        <div>
          <Label className="block text-base text-black font-medium mb-2">
            Report Type
          </Label>
          <Select
            id="reportType"
            variant="default"
            value={reportType}
            options={reportTypeOptions}
            selectClassName="py-3 px-4 pr-20 text-sm bg-white"
            onChange={setReportType}
          />
        </div>
        {/* Generated On */}
        <div>
          <Label className="block text-base text-black font-medium mb-2">
            Generated On
          </Label>
          <Input
            id="filter-date"
            variant="date"
            type="date"
            inputClassName="py-3 px-10"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        {/* SKU / Category(opt) */}
        <div>
          <Label className="block text-base text-black font-medium mb-2">
            SKU / Category(opt)
          </Label>
          <Input
            id="skuCategory"
            type="text"
            variant="date"
            inputClassName="py-3"
            value={skuCategory}
            onChange={(e) => setSkuCategory(e.target.value)}
          />
        </div>
        {/* Vendor*/}
        <div>
          <Label className="block text-base text-black font-medium mb-2">
            Vendor
          </Label>
          <Select
            id="vendor"
            value={vendor}
            options={vendorOptions}
            selectClassName="py-3 px-4 pr-20 text-sm bg-white"
            onChange={setVendor}
          />
        </div>
        {/* Status */}
        <div>
          <Label className="block text-base text-black font-medium mb-2">
            Status
          </Label>
          <Select
            id="status"
            value={status}
            options={statusOptions}
            selectClassName="py-3 px-4 pr-20 text-sm bg-white"
            onChange={setStatus}
          />
        </div>
      </div>
      {/* Stat Cards */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatCard
          className="rounded-b-none"
          title="Total SKUs"
          count={"112"}
          icon={Archive}
        />
        <StatCard
          className="rounded-b-none"
          title="Total PO's"
          count={"45"}
          icon={ShoppingCart}
        />
        <StatCard
          className="rounded-b-none"
          title="Pending"
          count={"32"}
          icon={Timer}
        />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <StatCard
          className="rounded-t-none"
          title="Stock-Out SKUs"
          count={"68"}
          icon={Truck}
        />
        <StatCard
          className="rounded-t-none"
          title="Pending POs"
          count={"12"}
          icon={Timer}
        />
        <StatCard
          className="rounded-t-none"
          title="Completed Refills"
          count={"77"}
          icon={ThumbsUp}
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Stock Value" count={"142"} icon={Tags} />
        <StatCard title="Low Stock Items" count={"30"} icon={Box} />
        <StatCard title="Near-Expiry SKUs" count={"12"} icon={Calendar} />
        <StatCard title="Stock Accuracy" count={"89"} icon={BarChart} />
      </div>
      {/* Conditional rendor tables */}
      <div className="mt-8">
        {dataType === "inventory_summary" && <InventorySummaryTable />}
        {dataType === "purchase_order" && <PurchaseOrderTable />}
        {dataType === "vendor_performance" && <VendorPerformanceTable />}
        {dataType === "machine_stock" && <MachineStockTable />}
        {dataType === "refill_summary" && <RefillSummaryTable />}
      </div>
    </div>
  );
}
