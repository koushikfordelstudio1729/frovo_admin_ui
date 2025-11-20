"use client";

import { Column } from "@/components/name&table/Table";
import { TableName, Table, Pagination, Badge, Button } from "@/components";
import { useAuditLogs } from "@/hooks/admin/useAuditLogs";

export default function AuditLogsPage() {
  const { logs, currentPage, totalPages, handleSearch, handlePageChange } =
    useAuditLogs();

  const handleApprove = (logId: string) => {
    console.log("Approve log:", logId);
    // TODO: Add API call
  };

  const handleReject = (logId: string) => {
    console.log("Reject log:", logId);
    // TODO: Add API call
  };

  const columns: Column[] = [
    { key: "timestamp", label: "Timestamp" },
    { key: "actor", label: "Actor" },
    { key: "action", label: "Action" },
    { key: "target", label: "Target" },
    { key: "beforeAfterDiff", label: "Before/After Diff" },
  ];

  const renderCell = (key: string, value: any, row?: any) => {
    // Render plain text for action column
    if (key === "action") {
      return <span className="text-gray-700">{value}</span>;
    }

    if (key === "target") {
      return <Badge size="md" label={value} />;
    }

    // Render action buttons for beforeAfterDiff column
    if (key === "beforeAfterDiff") {
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
