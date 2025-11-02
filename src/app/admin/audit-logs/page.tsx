"use client";

import { Column } from "@/components/name&table/Table";
import { TableName, Table, Pagination } from "@/components";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import React from "react";

export default function AuditLogsPage() {
  const { logs, currentPage, totalPages, handleSearch, handlePageChange } =
    useAuditLogs();

  const columns: Column[] = [
    { key: "timestamp", label: "Timestamp" },
    { key: "actor", label: "Actor" },
    { key: "action", label: "Action" },
    { key: "target", label: "Target" },
    { key: "beforeAfterDiff", label: "Before/After Diff" },
  ];

  const renderCell = (key: string, value: any) => {
    if (key === "target") {
      return (
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            value === "Pending"
              ? "bg-gray-400 text-gray-800"
              : value === "Approved"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {value}
        </span>
      );
    }
    if (key === "beforeAfterDiff") {
      return (
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-[#0B9F00] text-white text-sm rounded hover:bg-green-800 font-medium cursor-pointer">
            Approve
          </button>
          <button className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-red-700 font-medium cursor-pointer">
            Reject
          </button>
        </div>
      );
    }

    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <TableName
        title="Audit Trail"
        buttonText="Export Logs"
        buttonLink="/admin/export-logs"
        showSearch={false}
      />

      <Table
        columns={columns}
        data={logs}
        renderCell={renderCell}
        showSeparators={true}
        alternateRowColors={true}
      />

      <div className="flex items-center justify-end px-6 pt-2 bg-gray-50">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
