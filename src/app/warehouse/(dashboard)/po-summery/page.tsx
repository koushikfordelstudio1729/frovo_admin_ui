"use client";

import { BackHeader, Badge, Button, Table } from "@/components";

const poSummaryColumns = [
  { label: "PO Number", key: "poNumber" },
  { label: "PO Status", key: "poStatus" },
  { label: "PO Raised Date", key: "poRaisedDate" },
  { label: "Vendor Name", key: "vendorName" },
  { label: "GRN Number", key: "grnNumber" },
  { label: "GRN Date", key: "grnDate" },
];

const poSummaryData = [
  {
    poNumber: "7483921",
    poStatus: "Approve",
    poRaisedDate: "20-11-2025",
    vendorName: "ABC Traders",
    grnNumber: "748392127112025",
    grnDate: "27-11-2025",
  },
  {
    poNumber: "7483921",
    poStatus: "Pending",
    poRaisedDate: "20-11-2025",
    vendorName: "FreshMart Pvt Ltd",
    grnNumber: "-",
    grnDate: "-",
  },
  {
    poNumber: "7483921",
    poStatus: "Approve",
    poRaisedDate: "20-11-2025",
    vendorName: "City Wholesale",
    grnNumber: "748392127112025",
    grnDate: "27-11-2025",
  },
  {
    poNumber: "7483921",
    poStatus: "Draft",
    poRaisedDate: "20-11-2025",
    vendorName: "Metro Suppliers",
    grnNumber: "-",
    grnDate: "-",
  },
  {
    poNumber: "7483921",
    poStatus: "Pending",
    poRaisedDate: "20-11-2025",
    vendorName: "Blueline Foods",
    grnNumber: "-",
    grnDate: "-",
  },
  {
    poNumber: "7483921",
    poStatus: "Approve",
    poRaisedDate: "20-11-2025",
    vendorName: "Frooti",
    grnNumber: "-",
    grnDate: "-",
  },
];

const PoSummery = () => {
  const renderStatusCell = (
    key: string,
    value: any,
    row?: Record<string, any>
  ) => {
    if (key === "poStatus") {
      const variantMap: Record<string, any> = {
        Approve: "approved",
        Pending: "orange",
        Draft: "inactive",
      };

      return (
        <Badge
          variant={variantMap[value] || "info"}
          label={value}
          size="md"
          showDot={true}
          className="px-3 py-1 text-sm rounded-full"
        />
      );
    }

    return value;
  };

  return (
    <div className="min-h-screen pt-4">
      <BackHeader title="PO Summery Table" />
      <div className="mt-12">
        <Table
          columns={poSummaryColumns}
          data={poSummaryData}
          renderCell={renderStatusCell}
        />
      </div>
      <div className="mt-8">
        <Button className="rounded-lg px-6" variant="primary">
          Raise Puchase Order
        </Button>
      </div>
    </div>
  );
};

export default PoSummery;
