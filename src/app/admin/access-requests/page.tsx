"use client";

import { Pagination } from "@/components/common";
import { useAccessRequests } from "@/hooks/useAccessRequests";
import { Column } from "@/components/name&table/Table";
import { TableName, Table } from "@/components";

export default function AccessRequestsApprovalsPage() {
  const { requests, currentPage, totalPages, handleSearch, handlePageChange } =
    useAccessRequests();

  const columns: Column[] = [
    { key: "requester", label: "Requester" },
    { key: "permission", label: "Permission" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (key: string, value: any, row?: any) => {
    if (key === "status") {
      return (
        <span
          className={`px-3 py-2 rounded-full text-xs font-medium ${
            value === "Pending"
              ? "bg-gray-400 text-white"
              : value === "Approved"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {value}
        </span>
      );
    }

    if (key === "actions") {
      return (
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-green-500 text-white text-xs rounded hover:bg-green-600 font-medium cursor-pointer">
            Approve
          </button>
          <button className="px-3 py-2 bg-gray-600 text-white text-xs rounded hover:bg-red-700 font-medium cursor-pointer">
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
        title="Access Requests & Approvals"
        showSearch={false}
        buttonText="Request Access"
        buttonLink="/admin/request-access"
      />

      <Table columns={columns} data={requests} renderCell={renderCell} />

      <div className="flex items-center justify-end px-6 pt-6 bg-gray-50">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
