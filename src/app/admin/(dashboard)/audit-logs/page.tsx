"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Download, Activity, Users, FileText, TrendingUp, Eye, Calendar } from "lucide-react";
import { Button, Badge, Pagination } from "@/components/common";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    const variants: { [key: string]: "active" | "inactive" | "pending" } = {
      create: "active",
      update: "pending",
      delete: "inactive",
    };
    return <Badge label={action} size="sm" variant={variants[action] || "pending"} />;
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Trail</h1>
        <p className="text-gray-600">Monitor and track all system activities</p>
      </div>

      {/* Stats Dashboard */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Logs */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Activity className="text-blue-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalLogs}</h3>
            <p className="text-gray-600 text-sm mt-1">Total Logs</p>
          </div>

          {/* Modules */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {Object.keys(stats.logsByModule).length}
            </h3>
            <p className="text-gray-600 text-sm mt-1">Active Modules</p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="text-green-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {Object.keys(stats.logsByAction).length}
            </h3>
            <p className="text-gray-600 text-sm mt-1">Action Types</p>
          </div>

          {/* Actors */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Users className="text-orange-600" size={24} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {Object.keys(stats.logsByActor).length}
            </h3>
            <p className="text-gray-600 text-sm mt-1">Active Users</p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart - Actions Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Actions Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(stats.logsByAction).map(([action, count]) => ({
                  name: action.charAt(0).toUpperCase() + action.slice(1),
                  count: count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#3B82F6"
                  radius={[8, 8, 0, 0]}
                  name="Actions Count"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Module Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Module Activity Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={Object.entries(stats.logsByModule).map(([module, count]) => ({
                    name: module,
                    value: count,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(stats.logsByModule).map((_entry, index) => {
                    const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];
                    return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Filters and Export */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by actor, action, or module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* Export */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <div className="flex gap-2">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as "csv" | "json")}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
              <Button variant="primary" size="md" onClick={handleExport} className="flex items-center gap-2">
                <Download size={18} />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No audit logs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{log.actor.name}</div>
                        <div className="text-sm text-gray-500">{log.actor.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge label={log.module} size="sm" variant="active" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {log.target.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredLogs.length > 0 && (
          <div className="flex items-center justify-end px-6 py-4 bg-gray-50 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchLogs(page)}
            />
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Audit Log Details</h3>
                  <p className="text-blue-100 text-sm">Log ID: {selectedLog.id}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Timestamp */}
                <div className="bg-blue-50 rounded-xl p-5 border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-blue-600" size={24} />
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Timestamp</p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(selectedLog.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actor Information */}
                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <Users size={20} className="text-blue-600" />
                    Actor Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</label>
                      <p className="font-semibold text-gray-900 text-lg mt-1">{selectedLog.actor.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
                      <p className="text-gray-700 mt-1">{selectedLog.actor.email}</p>
                    </div>
                  </div>
                </div>

                {/* Action Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</label>
                    <p className="text-xl font-bold text-gray-900 mt-2 capitalize">{selectedLog.action}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Module</label>
                    <p className="text-xl font-bold text-gray-900 mt-2">{selectedLog.module}</p>
                  </div>
                </div>

                {/* Target */}
                <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">Target</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</label>
                      <p className="font-semibold text-gray-900 mt-1">{selectedLog.target.type}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</label>
                      <p className="text-gray-700 font-mono text-sm mt-1">{selectedLog.target.id}</p>
                    </div>
                  </div>
                </div>

                {/* Network Information */}
                <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Network Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">IP Address</label>
                      <p className="font-mono text-gray-900 mt-1">{selectedLog.ipAddress}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User Agent</label>
                      <p className="text-sm text-gray-700 mt-1 break-all">{selectedLog.userAgent}</p>
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Request Metadata</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Method</label>
                      <p className="font-mono font-bold text-gray-900 mt-1">{selectedLog.metadata.method}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">URL</label>
                      <p className="font-mono text-sm text-gray-700 mt-1 break-all">{selectedLog.metadata.url}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status Code</label>
                      <p className={`font-bold mt-1 ${
                        selectedLog.metadata.statusCode >= 200 && selectedLog.metadata.statusCode < 300
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {selectedLog.metadata.statusCode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button variant="secondary" size="md" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
