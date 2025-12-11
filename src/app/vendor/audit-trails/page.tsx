"use client";

import { Input, Label, Select, Table, Pagination } from "@/components";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getAuditTrails } from "@/services/vendor";

interface AuditLog {
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  before_after_diff: { before: string; after: string };
}

const ITEMS_PER_PAGE = 8;

const selectActionOptions = [
  { label: "Vendor Created", value: "create" },
  { label: "Contract Updated", value: "update" },
  { label: "Quick Status Change", value: "quick_status_change" },
  { label: "Deleted Vendor", value: "delete" },
];

const auditTrailsColumn = [
  { key: "timestamp", label: "Timestamp" },
  { key: "actor", label: "Actor" },
  { key: "action", label: "Action" },
  { key: "target", label: "Target" },
  { key: "before_after_diff", label: "Before / After diff" },
];

const AuditTrails = () => {
  const [date, setDate] = useState("");
  const [action, setAction] = useState("");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchAuditData = useCallback(async () => {
    try {
      const res: any = await getAuditTrails();
      const audits = res?.data?.data?.audits || [];

      const formatted: AuditLog[] = audits.map((item: any) => ({
        timestamp: new Date(item.timestamp).toLocaleString(),
        actor: item?.user?.name || item?.user_email || "—",
        action: item.action || "—",
        target: item.target_vendor_name || item.target_vendor_id || "—",
        before_after_diff: {
          before:
            item.before_state?.verification_status ||
            item.before_state?.vendor_status_cycle ||
            "—",
          after:
            item.after_state?.verification_status ||
            item.after_state?.vendor_status_cycle ||
            "—",
        },
      }));

      setLogs(formatted);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditData();
  }, [fetchAuditData]);

  // Reset pagination when filters change
  useEffect(() => setCurrentPage(1), [date, action]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (action && log.action !== action) return false;
      if (date) {
        const logDate = new Date(log.timestamp).toLocaleDateString();
        const selectedDate = new Date(date).toLocaleDateString();
        if (logDate !== selectedDate) return false;
      }
      return true;
    });
  }, [logs, action, date]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const renderCell = (key: string, value: any) =>
    key === "before_after_diff" ? (
      <span>
        {value.before}
        <span className="mx-2 text-gray-400">→</span>
        {value.after}
      </span>
    ) : (
      value
    );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading audit logs...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12">
      {/* Filters */}
      <div className="grid grid-cols-6 gap-6">
        <div className="w-42">
          <Input
            label="Date"
            type="date"
            variant="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <Select
            label="Actions"
            options={selectActionOptions}
            value={action}
            selectClassName="py-1.5 px-2"
            onChange={setAction}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-8">
        <Label className="text-lg font-bold text-black">Audit Trails</Label>

        <div className="mt-4">
          <Table
            columns={auditTrailsColumn}
            data={paginatedData}
            renderCell={renderCell}
          />
        </div>

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
