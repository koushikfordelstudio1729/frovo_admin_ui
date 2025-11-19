"use client";

import { Badge, Label, Pagination, StatCard, Table } from "@/components";
import { CheckCircle2, ClipboardList, Clock, XCircle } from "lucide-react";
import { useMemo, useState } from "react";

const poHistoryColumn = [
  { key: "po_number", label: "PO Number" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "warehouse", label: "Warehouse" },
  { key: "next_supply", label: "Next Supply" },
  { key: "qc_issue", label: "QC Issue" },
];

const poHistoryData = [
  {
    po_number: "PO_1232",
    date: "22-11-2025",
    status: "Approve",
    warehouse: "XYZ_Warehouse",
    next_supply: "23-11-2025",
    qc_issue: "-",
  },
  {
    po_number: "PO_1233",
    date: "21-11-2025",
    status: "Pending",
    warehouse: "ABC_Warehouse",
    next_supply: "24-11-2025",
    qc_issue: "Minor",
  },
  {
    po_number: "PO_1234",
    date: "20-11-2025",
    status: "Approve",
    warehouse: "XYZ_Warehouse",
    next_supply: "22-11-2025",
    qc_issue: "-",
  },
  {
    po_number: "PO_1235",
    date: "19-11-2025",
    status: "Rejected",
    warehouse: "DEF_Warehouse",
    next_supply: "23-11-2025",
    qc_issue: "Major",
  },
  {
    po_number: "PO_1236",
    date: "18-11-2025",
    status: "Approve",
    warehouse: "XYZ_Warehouse",
    next_supply: "20-11-2025",
    qc_issue: "-",
  },
  {
    po_number: "PO_1237",
    date: "17-11-2025",
    status: "Approve",
    warehouse: "GHI_Warehouse",
    next_supply: "19-11-2025",
    qc_issue: "-",
  },
  {
    po_number: "PO_1238",
    date: "16-11-2025",
    status: "Pending",
    warehouse: "ABC_Warehouse",
    next_supply: "21-11-2025",
    qc_issue: "Minor",
  },
  {
    po_number: "PO_1239",
    date: "15-11-2025",
    status: "Approve",
    warehouse: "XYZ_Warehouse",
    next_supply: "17-11-2025",
    qc_issue: "-",
  },
];

const ITEMS_PER_PAGE = 10;

const VendorHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(poHistoryData.length / ITEMS_PER_PAGE);

  const paginationData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return poHistoryData.slice(start, end);
  }, [currentPage]);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // Custom cell render
  const renderCell = (key: string, value: any) => {
    if (key === "status") {
      const variant =
        value === "Approve"
          ? "active"
          : value === "Rejected"
          ? "rejected"
          : value === "Pending"
          ? "warning"
          : "custom";
      return <Badge label={value} variant={variant} />;
    }
    return value;
  };

  return (
    <div className="min-h-screen pt-12">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total POs" count={50} icon={ClipboardList} />
        <StatCard title="Completed POs" count={47} icon={CheckCircle2} />
        <StatCard title="Pending POs" count={3} icon={Clock} />
        <StatCard
          title="Last Rejected Batch"
          count={"10/11/25"}
          icon={XCircle}
        />
      </div>
      <div className="mt-6">
        <Label className="text-xl font-semibold">PO History</Label>
      </div>
      <div className="mt-4">
        <Table
          columns={poHistoryColumn}
          data={paginationData}
          renderCell={renderCell}
        />
      </div>
      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default VendorHistory;
