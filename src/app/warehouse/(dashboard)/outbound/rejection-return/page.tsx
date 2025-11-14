"use client";

import { Badge, Button, Label, Pagination, Table } from "@/components";
import useReturnQueue from "@/hooks/warehouse/useReturnQueue";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const columns = [
  { key: "batchId", label: "Batch ID" },
  { key: "sku", label: "SKU" },
  { key: "reason", label: "Reason" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Action" },
];

export default function RejectionReturnQueuePage() {
  const router = useRouter();
  const {
    rows,
    currentPage,
    totalPages,
    handlePageChange,
    // handleSearch, handleFilterChange, filters -- add if you have search/filter UI
  } = useReturnQueue();

  return (
    <div className="min-h-full bg-gray-50 p-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 my-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Rejection / Return Queue
        </h1>
      </div>

      <Table
        columns={columns}
        data={rows}
        renderCell={(key, value, row) => {
          if (key === "status") {
            const badgeVariant =
              value?.toLowerCase() === "pending"
                ? "pending"
                : value?.toLowerCase() === "returned"
                ? "inactive"
                : "info";
            return <Badge label={value} variant={badgeVariant} size="md" />;
          }
          if (key === "actions") {
            return (
              <div className="flex gap-2">
                <Button
                  className="rounded-sm"
                  variant="approve"
                  size="sm"
                  onClick={() => {
                    /* Approve logic */
                  }}
                >
                  Approve
                </Button>
                <Button
                  className="rounded-sm"
                  variant="reject"
                  size="sm"
                  onClick={() => {
                    /* Repack logic */
                  }}
                >
                  Repack
                </Button>
              </div>
            );
          }
          return value;
        }}
      />

      <div className="flex justify-end mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
