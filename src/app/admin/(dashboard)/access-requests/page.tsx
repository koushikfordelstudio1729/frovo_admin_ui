"use client";

import { Pagination, Badge, Button } from "@/components/common";
import { useAccessRequests } from "@/hooks/useAccessRequests";
import { Column } from "@/components/name&table/Table";
import { TableName, Table } from "@/components";

export default function AccessRequestsApprovalsPage() {
  const { requests, currentPage, totalPages, handleSearch, handlePageChange } =
    useAccessRequests();

  const handleApprove = (requestId: string) => {
    console.log("Approve request:", requestId);
    // TODO: Add API call to approve request
  };

  const handleReject = (requestId: string) => {
    console.log("Reject request:", requestId);
    // TODO: Add API call to reject request
  };

  const columns: Column[] = [
    { key: "requester", label: "Requester" },
    { key: "permission", label: "Permission" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (key: string, value: any, row?: any) => {
    if (key === "status") {
      return <Badge size="md" label={value} />;
    }

    if (key === "actions") {
      return (
        <div className="flex gap-2">
          <Button
            variant="approve"
            size="sm"
            onClick={() => handleApprove(row.id)}
            className="rounded-sm"
          >
            Approve
          </Button>
          <Button
            variant="reject"
            size="sm"
            onClick={() => handleReject(row.id)}
            className="rounded-sm"
          >
            Reject
          </Button>
        </div>
      );
    }

    return value;
  };

  return (
    <div className="min-h-full bg-gray-50 p-8">
      <TableName
        title="Access Requests & Approvals"
        showSearch={false}
        buttonText="Request Access"
        buttonLink="/admin/request-access"
      />

      <Table columns={columns} data={requests} renderCell={renderCell} />

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
