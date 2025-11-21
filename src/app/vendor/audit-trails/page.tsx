"use client";

import { Input, Label, Select, Table, Pagination } from "@/components";
import { useState, useMemo } from "react";

const selectActorOptions = [
  { label: "Yatish", value: "yatish" },
  { label: "Nithin", value: "nithin" },
  { label: "Koushik", value: "koushik" },
  { label: "Jatin", value: "jatin" },
];

const selectActionOptions = [
  { label: "Vendor Created", value: "vendor_created" },
  { label: "Contract Updated", value: "contract_updated" },
];

const auditTrailsColumn = [
  { key: "timestamp", label: "Timestamp" },
  { key: "actor", label: "Actor" },
  { key: "action", label: "Action" },
  { key: "target", label: "Target" },
  { key: "before_after_diff", label: "Before / After diff" },
];

const activityLogData = [
  {
    timestamp: "Nov 18, 3:45 PM",
    actor: "Ramesh Kumar",
    action: "Vendor Created",
    target: "ABC Suppliers Pvt Ltd",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
  {
    timestamp: "Nov 18, 11:20 AM",
    actor: "Priya Sharma",
    action: "Vendor Updated",
    target: "XYZ Logistics Inc",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
  {
    timestamp: "Nov 17, 5:30 PM",
    actor: "Anil Verma",
    action: "Vendor Approved",
    target: "Delhi Foods Corporation",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
  {
    timestamp: "Nov 17, 2:15 PM",
    actor: "Sneha Patel",
    action: "Document Uploaded",
    target: "Mumbai Packaging Co",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
  {
    timestamp: "Nov 16, 9:00 AM",
    actor: "Vikram Singh",
    action: "Vendor Rejected",
    target: "Chennai Services Ltd",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
  {
    timestamp: "Nov 15, 4:50 PM",
    actor: "Kavita Reddy",
    action: "Contract Updated",
    target: "Bangalore Beverages",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
  {
    timestamp: "Nov 15, 1:30 PM",
    actor: "Rohit Gupta",
    action: "Vendor Created",
    target: "Pune Snacks Distributors",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
  {
    timestamp: "Nov 14, 10:45 AM",
    actor: "Meera Joshi",
    action: "Payment Method Changed",
    target: "Hyderabad Maintenance",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
  {
    timestamp: "Nov 13, 3:20 PM",
    actor: "Suresh Yadav",
    action: "Vendor Deleted",
    target: "Kolkata Trading Co",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
  {
    timestamp: "Nov 12, 11:00 AM",
    actor: "Anjali Desai",
    action: "Portal Access Enabled",
    target: "Ahmedabad Consumables",
    before_after_diff: { before: "Verification", after: "Verified" },
  },
];

const ITEMS_PER_PAGE = 8;

const AuditTrails = () => {
  const [date, setDate] = useState("");
  const [actor, setActor] = useState("");
  const [action, setAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(activityLogData.length / ITEMS_PER_PAGE);

  // Get current page data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return activityLogData.slice(startIndex, endIndex);
  }, [currentPage]);

  // Custom cell renderer for before/after diff
  const renderCell = (key: string, value: any) => {
    if (key === "before_after_diff" && value && typeof value === "object") {
      return (
        <span>
          {value.before}
          <span className="mx-2 text-gray-400">→</span>
          {value.after}
        </span>
      );
    }
    return value;
  };

  return (
    <div className="min-h-screen pt-12">
      {/* Filter Section */}
      <div className="flex items-end w-xl gap-6">
        <Input
          id="filter-date"
          inputClassName="border-2"
          label="Date"
          variant="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Select
          label="Actor"
          placeholder="Select actor"
          selectClassName="px-6 py-2 bg-white text-sm"
          options={selectActorOptions}
          value={actor}
          onChange={setActor}
        />
        <Select
          label="Actions"
          placeholder="Select actions"
          selectClassName="px-6 py-2 bg-white text-sm"
          options={selectActionOptions}
          value={action}
          onChange={setAction}
        />
      </div>

      {/* Table Section */}
      <div className="mt-8">
        <Label className="text-lg font-bold text-black">
          Audit Trails: XYZ Vendor
        </Label>
        <div className="mt-4">
          <Table
            columns={auditTrailsColumn}
            data={paginatedData}
            renderCell={renderCell}
          />
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AuditTrails;
