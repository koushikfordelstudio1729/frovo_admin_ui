"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Shield, TrendingUp, Users, Key, User } from "lucide-react";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Input, Select, StatCard } from "@/components";

interface Permission {
  id: string;
  key: string;
  module: string;
  action: string;
  description: string;
  group: string;
  createdAt: string;
  updatedAt: string;
}

interface PermissionsResponse {
  success: boolean;
  message: string;
  data: {
    permissions: {
      [group: string]: Permission[];
    };
  };
}

interface PermissionStats {
  totalPermissions: number;
  totalGroups: number;
  mostUsedModule: string;
  recentlyAdded: number;
}

export default function PermissionsManagement() {
  const [permissions, setPermissions] = useState<{
    [group: string]: Permission[];
  }>({});
  const [filteredPermissions, setFilteredPermissions] = useState<{
    [group: string]: Permission[];
  }>({});
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PermissionStats | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    return "An unexpected error occurred";
  };

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const response = await api.get<PermissionsResponse>(
        apiConfig.endpoints.permissions.list
      );

      if (response.data.success) {
        const perms = response.data.data.permissions;
        setPermissions(perms);
        setFilteredPermissions(perms);

        const groups = Object.keys(perms);
        const totalPerms = groups.reduce(
          (acc, group) => acc + perms[group].length,
          0
        );

        const modules = Object.values(perms)
          .flat()
          .map((p) => p.module);

        const mostUsedModule =
          modules.length > 0
            ? modules
                .reduce(
                  (map, m) => map.set(m, (map.get(m) || 0) + 1),
                  new Map<string, number>()
                )
                .entries()
                .next().value?.[0] ?? "N/A"
            : "N/A";

        setStats({
          totalPermissions: totalPerms,
          totalGroups: groups.length,
          mostUsedModule,
          recentlyAdded: 0,
        });

        if (groups.length > 0 && !selectedGroup) {
          setSelectedGroup(groups[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching permissions:", getErrorMessage(err));
      setFetchError("Failed to load permissions data");
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  const searchPermissions = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setFilteredPermissions(permissions);
        return;
      }

      try {
        const response = await api.get<{
          success: boolean;
          data: Permission[];
        }>(
          `${apiConfig.endpoints.permissions.search}?q=${encodeURIComponent(
            query
          )}`
        );

        if (response.data.success) {
          const grouped: { [group: string]: Permission[] } = {};
          response.data.data.forEach((perm) => {
            if (!grouped[perm.group]) {
              grouped[perm.group] = [];
            }
            grouped[perm.group].push(perm);
          });
          setFilteredPermissions(grouped);
        }
      } catch (err) {
        console.error("Error searching permissions:", getErrorMessage(err));
      }
    },
    [permissions]
  );

  const fetchPermissionsByModule = useCallback(
    async (module: string) => {
      if (!module) {
        setFilteredPermissions(permissions);
        return;
      }

      try {
        const response = await api.get<{
          success: boolean;
          data: Permission[];
        }>(apiConfig.endpoints.permissions.byModule(module));

        if (response.data.success) {
          const grouped: { [group: string]: Permission[] } = {};
          response.data.data.forEach((perm) => {
            if (!grouped[perm.group]) {
              grouped[perm.group] = [];
            }
            grouped[perm.group].push(perm);
          });
          setFilteredPermissions(grouped);
        }
      } catch (err) {
        console.error(
          "Error fetching permissions by module:",
          getErrorMessage(err)
        );
      }
    },
    [permissions]
  );

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        searchPermissions(searchQuery);
      } else if (selectedModule) {
        fetchPermissionsByModule(selectedModule);
      } else {
        setFilteredPermissions(permissions);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [
    searchQuery,
    selectedModule,
    searchPermissions,
    fetchPermissionsByModule,
    permissions,
  ]);

  const groups = Object.keys(filteredPermissions);
  const allModules = Array.from(
    new Set(
      Object.values(permissions)
        .flat()
        .map((p) => p.module)
    )
  );

  // Prepare chart data
  const barChartData = Object.keys(permissions).map((group) => ({
    name: group,
    permissions: permissions[group].length,
  }));

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#8B5CF6",
    "#F59E0B",
    "#EF4444",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  const pieChartData = Object.keys(permissions).map((group) => ({
    name: group,
    value: permissions[group].length,
  }));

  const moduleOptions = [
    { value: "", label: "All Modules" },
    ...allModules.map((module) => ({
      value: module,
      label: module,
    })),
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-10 pt-6">
      {/* Page Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="bg-linear-to-r from-orange-500  to-orange-600 px-6 md:px-8 py-5">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Permissions Management
            </h1>
            <p className="text-sm text-orange-100 mt-1">
              Explore permission groups, modules, and actions across your
              system.
            </p>
          </div>

          <div className="px-6 md:px-8 py-6">
            {/* Error banner */}
            {fetchError && (
              <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
                {fetchError}
              </div>
            )}

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="Total Permission"
                  count={stats.totalPermissions}
                  icon={Shield}
                />

                <StatCard
                  title="Permission Groups"
                  count={stats.totalGroups}
                  icon={Users}
                />

                <StatCard
                  title="Modules"
                  count={allModules.length}
                  icon={Key}
                />

                <StatCard
                  title="Most Used Module"
                  count={stats.mostUsedModule}
                  icon={TrendingUp}
                />
              </div>
            )}

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search by key, action, description..."
                  startIcon={<Search size={20} />}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedModule("");
                  }}
                />
              </div>

              <Select
                value={selectedModule}
                variant="default"
                onChange={(value) => {
                  setSelectedModule(value);
                  setSearchQuery("");
                }}
                options={moduleOptions}
                placeholder="All Modules"
                fullWidth={false}
                selectClassName="px-4 py-3 min-w-[180px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Permissions per Group */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Permissions by Group
              </h2>
              <span className="text-xs text-gray-500">
                Total groups: {Object.keys(permissions).length}
              </span>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                Loading chart...
              </div>
            ) : barChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    angle={-30}
                    textAnchor="end"
                    height={70}
                    tick={{ fill: "#73727c", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#292525",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(244, 1, 1, 0.08)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="permissions"
                    fill="#FB923C"
                    radius={[8, 8, 0, 0]}
                    name="Permissions count"
                    
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie Chart - Permissions Distribution */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Permission Groups Distribution
              </h2>
            </div>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                Loading chart...
              </div>
            ) : pieChartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieChartData}
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
                    {pieChartData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Permissions Display */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Groups Sidebar */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Permission Groups
            </h2>
            <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading groups...
                </div>
              ) : groups.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No groups found
                </div>
              ) : (
                groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors text-sm cursor-pointer ${
                      selectedGroup === group
                        ? "bg-orange-500 text-white font-semibold shadow"
                        : "text-gray-700 hover:bg-orange-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{group}</span>
                      <span
                        className={`ml-2 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs ${
                          selectedGroup === group
                            ? "bg-white/20 text-orange-50"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {filteredPermissions[group]?.length || 0}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Permissions List */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedGroup || "Select a group"}
              </h2>
              {selectedGroup && (
                <span className="text-xs text-gray-500">
                  {filteredPermissions[selectedGroup]?.length || 0} permissions
                </span>
              )}
            </div>

            {selectedGroup && filteredPermissions[selectedGroup] ? (
              filteredPermissions[selectedGroup].length > 0 ? (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {filteredPermissions[selectedGroup].map((permission) => (
                    <div
                      key={permission.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:bg-orange-50/60 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                              {permission.key}
                            </h3>
                            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-semibold">
                              {permission.action}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {permission.description}
                          </p>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                            <span>
                              <span className="font-semibold">Module: </span>
                              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                                {permission.module}
                              </span>
                            </span>
                            <span>
                              <span className="font-semibold">Group: </span>
                              {permission.group}
                            </span>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <div className="w-10 h-10 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <Shield className="text-white" size={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 text-sm">
                  No permissions found for this group.
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-500 text-sm">
                Select a group on the left to view permissions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
