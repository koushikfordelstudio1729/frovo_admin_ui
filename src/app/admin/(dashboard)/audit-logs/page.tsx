"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Download,
  Activity,
  Users,
  FileText,
  TrendingUp,
  Eye,
  Calendar,
  X,
} from "lucide-react";
import {
  Button,
  Badge,
  Pagination,
  Input,
  BackHeader,
  StatCard,
  Select,
} from "@/components/common";
import { Table } from "@/components";
import type { Column } from "@/components";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Actor {
  name: string;
  email: string;
  id: string;
}

interface Target {
  type: string;
  id: string;
}

interface Metadata {
  method: string;
  url: string;
  statusCode: number;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actor: Actor;
  action: string;
  module: string;
  target: Target;
  ipAddress: string;
  userAgent: string;
  metadata: Metadata;
}

interface AuditLogsResponse {
  success: boolean;
  message: string;
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface AuditStats {
  totalLogs: number;
  logsByModule: Record<string, number>;
  logsByAction: Record<string, number>;
  logsByActor: Record<string, number>;
  recentActivity: AuditLog[];
}

interface StatsResponse {
  success: boolean;
  message: string;
  data: AuditStats;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "json">("csv");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    return "An unexpected error occurred";
  };

  const exportOptions = [
    { value: "csv", label: "CSV" },
    { value: "json", label: "JSON" },
  ];

  const fetchLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get<AuditLogsResponse>(
        `${apiConfig.endpoints.auditLogs}?page=${page}&limit=10`
      );

      if (response.data.success) {
        setLogs(response.data.data);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      console.error("Error fetching audit logs:", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await api.get<StatsResponse>(
        `${apiConfig.endpoints.auditLogs}/stats`
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", getErrorMessage(err));
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        format: exportFormat,
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate }),
      });

      const response = await api.get(
        `${apiConfig.endpoints.auditLogs}/export?${params.toString()}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: exportFormat === "csv" ? "text/csv" : "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString()}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting logs:", getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchLogs(1);
    fetchStats();
  }, [fetchLogs, fetchStats]);

  const getActionBadge = (action: string) => {
    const variants: {
      [key: string]: "active" | "rejected" | "warning" | "delete";
    } = {
      approve: "active",
      reject: "rejected",
      update: "warning",
      delete: "delete",
    };
    return (
      <Badge
        showDot
        label={action}
        size="md"
        variant={variants[action] || "pending"}
      />
    );
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns: Column[] = [
    { key: "timestamp", label: "Timestamp", minWidth: "180px" },
    { key: "actor", label: "Actor", minWidth: "200px" },
    { key: "action", label: "Action", minWidth: "120px" },
    { key: "module", label: "Module", minWidth: "150px" },
    { key: "target", label: "Target", minWidth: "150px" },
    { key: "ipAddress", label: "IP Address", minWidth: "140px" },
    { key: "actions", label: "Actions", minWidth: "100px" },
  ];

  // Render custom cells
  const renderCell = (
    key: string,
    value: any,
    row?: Record<string, any>
  ): React.ReactNode => {
    const log = row as AuditLog | undefined;
    if (!log) return value;

    switch (key) {
      case "timestamp":
        return (
          <div className="text-sm text-gray-900 font-medium">
            {new Date(log.timestamp).toLocaleString()}
          </div>
        );

      case "actor":
        return (
          <div>
            <div className="font-medium text-gray-900">{log.actor.name}</div>
            <div className="text-sm text-gray-500">{log.actor.email}</div>
          </div>
        );

      case "action":
        return getActionBadge(log.action);

      case "module":
        return <Badge label={log.module} size="sm" variant="active" />;

      case "target":
        return <div className="text-sm text-gray-600">{log.target.type}</div>;

      case "ipAddress":
        return (
          <div className="text-sm text-gray-600 font-mono">{log.ipAddress}</div>
        );

      case "actions":
        return (
          <div className="flex justify-center">
            <button
              onClick={() => {
                setSelectedLog(log);
                setShowDetailsModal(true);
              }}
              className="text-indigo-600 hover:text-indigo-800"
              title="View details"
            >
              <Eye size={18} />
            </button>
          </div>
        );

      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4 pb-12">
      {/* Header */}
      <div className="mb-6">
        <BackHeader title="Audit Trail" />
        <p className="text-gray-600 mt-2">
          Monitor and track all system activities
        </p>
      </div>

      {/* Stats Dashboard */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Logs */}
          <StatCard
            title="Total Logs"
            count={stats.totalLogs.toLocaleString()}
            icon={TrendingUp}
          />

          {/* Modules */}
          <StatCard
            title="Activity Modules"
            count={Object.keys(stats.logsByModule).length}
            icon={FileText}
          />

          {/* Actions */}
          <StatCard
            title="Action Type"
            count={Object.keys(stats.logsByActor).length}
            icon={Activity}
          />

          {/* Actors */}
          <StatCard
            title="Active Users"
            count={Object.keys(stats.logsByActor).length}
            icon={Users}
          />
        </div>
      )}

      {/* Charts Section */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart - Actions Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-500 rounded"></div>
              Actions Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(stats.logsByAction).map(
                  ([action, count]) => ({
                    name: action.charAt(0).toUpperCase() + action.slice(1),
                    count: count,
                  })
                )}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#292525",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#FB923C"
                  radius={[8, 8, 0, 0]}
                  name="Actions Count"
                  activeBar={{ fill: "#FDBA74" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Module Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded"></div>
              Module Activity Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(stats.logsByModule).map(
                    ([module, count]) => ({
                      name: module,
                      value: count,
                    })
                  )}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(stats.logsByModule).map((_entry, index) => {
                    const COLORS = [
                      "#3bcd4c",
                      "#F59E0B",
                      "#3B82F6",
                      "#8B5CF6",
                      "#EF4444",
                      "#EC4899",
                      "#06B6D4",
                      "#84CC16",
                    ];
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters and Export */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex-1">
            <Input
              label="Search"
              labelClassName="text-xl"
              placeholder="Search by actor, action, or module..."
              value={searchQuery}
              startIcon={<Search size={20} />}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div className="flex gap-4">
            <div>
              <Input
                label="Start Date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                label="End Date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Export */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <div className="flex gap-2">
              <Select
                value={exportFormat}
                onChange={(value) => setExportFormat(value as "csv" | "json")}
                options={exportOptions}
                variant="default"
                fullWidth={false}
                selectClassName="px-4 py-3"
                placeholder={undefined}
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleExport}
                className="flex items-center gap-2 rounded-lg"
              >
                <Download size={18} />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          Loading audit logs...
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={filteredLogs}
            renderCell={renderCell}
            alternateRowColors={true}
            showSeparators={true}
            enableHorizontalScroll={true}
            minTableWidth="1400px"
          />

          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="flex items-center justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchLogs(page)}
              />
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-linear-to-r from-orange-500 to-orange-600 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Audit Log Details
                  </h3>
                  <p className="text-orange-100 text-sm">
                    Log ID: {selectedLog.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-opacity-20 rounded-lg p-2 transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Timestamp */}
                <div className="bg-linear-to-r from-orange-50 rounded-xl p-5 border-2 border-orange-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-orange-600" size={24} />
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        Timestamp
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(selectedLog.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actor Information */}
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <Users size={20} className="text-orange-600" />
                    Actor Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Name
                      </label>
                      <p className="font-semibold text-gray-900 text-lg mt-1">
                        {selectedLog.actor.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Email
                      </label>
                      <p className="text-gray-700 mt-1">
                        {selectedLog.actor.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Action
                    </label>
                    <p className="text-xl font-bold text-green-700 mt-2 capitalize">
                      {selectedLog.action}
                    </p>
                  </div>
                  <div className="bg-linear-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Module
                    </label>
                    <p className="text-xl font-bold text-purple-700 mt-2">
                      {selectedLog.module}
                    </p>
                  </div>
                </div>

                {/* Target */}
                <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    Target
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Type
                      </label>
                      <p className="font-semibold text-gray-900 mt-1">
                        {selectedLog.target.type}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        ID
                      </label>
                      <p className="text-gray-700 font-mono text-sm mt-1 break-all">
                        {selectedLog.target.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Network Information */}
                <div className="bg-linear-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">
                    Network Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        IP Address
                      </label>
                      <p className="font-mono text-gray-900 mt-1 text-lg">
                        {selectedLog.ipAddress}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        User Agent
                      </label>
                      <p className="text-sm text-gray-700 mt-1 break-all bg-white p-3 rounded border border-orange-200">
                        {selectedLog.userAgent}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">
                    Request Metadata
                  </h4>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Method
                        </label>
                        <p className="font-mono font-bold text-gray-900 mt-1">
                          {selectedLog.metadata.method}
                        </p>
                      </div>
                      <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          URL
                        </label>
                        <p className="font-mono text-sm text-gray-700 mt-1 break-all">
                          {selectedLog.metadata.url}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Status Code
                      </label>
                      <p
                        className={`font-bold text-2xl mt-1 ${
                          selectedLog.metadata.statusCode >= 200 &&
                          selectedLog.metadata.statusCode < 300
                            ? "text-green-600"
                            : selectedLog.metadata.statusCode >= 400
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {selectedLog.metadata.statusCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
