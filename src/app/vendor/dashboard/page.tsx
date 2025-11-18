"use client";

import { Badge, Button, Label, Select, StatCard, Table } from "@/components";
import { ClipboardCheck, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { vendorData } from "@/config/vendor";

const nameOptions = [
  { label: "Vendor A", value: "vendor-a" },
  { label: "Vendor B", value: "vendor-b" },
  { label: "Vendor C", value: "vendor-c" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
];

const riskRatingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const contractTypeOptions = [
  { label: "Fixed Price", value: "fixed" },
  { label: "Time & Material", value: "time-material" },
  { label: "Retainer", value: "retainer" },
];

const vendorColumns = [
  { key: "vendorName", label: "Vendor Name" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "riskRating", label: "Risk Rating" },
  { key: "onTimePercentage", label: "On-Time%" },
  { key: "contractExpiry", label: "Contract Expiry" },
  { key: "action", label: "Action" },
];

const Dashboard = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [risk, setRisk] = useState("");
  const [contract, setContract] = useState("");

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    // Status Badge
    if (key === "status") {
      const variant = value.toLowerCase() as "active" | "inactive" | "pending";
      return <Badge label={value} variant={variant} />;
    }

    // Action Buttons
    if (key === "action") {
      if (!row) return null;

      return (
        <div className="flex items-center gap-2">
          <Button
            title="View"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
            onClick={() => console.log("View:", row)}
          >
            <Eye className="text-green-500 w-5 h-5" />
          </Button>
          <Button
            title="Edit"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
            onClick={() => router.push(`/vendor/dashboard/edit/${row.id}`)}
          >
            <Pencil className="text-blue-500 w-5 h-5" />
          </Button>
          <Button
            title="Delete"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
            onClick={() => console.log("Delete:", row)}
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
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Vendor" count="20" icon={ClipboardCheck} />
        <StatCard title="Pending Approval" count="12" icon={ClipboardCheck} />
        <StatCard
          title="Avg. On-Time Delivery"
          count="98%"
          icon={ClipboardCheck}
        />
        <StatCard
          title="Avg. Rejection Rate"
          count="2%"
          icon={ClipboardCheck}
        />
      </div>
      <div className="flex items-end w-4xl mt-6 gap-6">
        <Select
          label="Name"
          placeholder="Select Name"
          selectClassName="py-2 px-4"
          value={name}
          onChange={setName}
          options={nameOptions}
        />
        <Select
          label="Status"
          placeholder="Select Status"
          selectClassName="py-2 px-4"
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />
        <Select
          label="Risk Rating"
          placeholder="Select Risk"
          selectClassName="py-2 px-4"
          value={risk}
          onChange={setRisk}
          options={riskRatingOptions}
        />
        <Select
          label="Contract Type"
          placeholder="Select Contract"
          selectClassName="py-2 px-4"
          value={contract}
          onChange={setContract}
          options={contractTypeOptions}
        />
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <Label className="text-xl font-semibold">Vendor&apos;s</Label>
          <Button
            className="rounded-lg"
            variant="primary"
            onClick={() => router.push("/vendor/dashboard/add-vendor")}
          >
            <Plus size={18} className="mr-2" /> Add new vendor
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <Table
          columns={vendorColumns}
          data={vendorData}
          renderCell={renderCell}
        />
      </div>
    </div>
  );
};

export default Dashboard;
