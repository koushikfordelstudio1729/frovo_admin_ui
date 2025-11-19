"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Shield, TrendingUp, Users, Key } from "lucide-react";
import { api } from "@/services/api";
import { apiConfig } from "@/config";
import { AxiosError } from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
  const [permissions, setPermissions] = useState<{ [group: string]: Permission[] }>({});
  const [filteredPermissions, setFilteredPermissions] = useState<{ [group: string]: Permission[] }>({});
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PermissionStats | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    return "An unexpected error occurred";
  };

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<PermissionsResponse>(apiConfig.endpoints.permissions);

      if (response.data.success) {
        setPermissions(response.data.data.permissions);
        setFilteredPermissions(response.data.data.permissions);

        // Calculate stats
        const groups = Object.keys(response.data.data.permissions);
        const totalPerms = groups.reduce((acc, group) => acc + response.data.data.permissions[group].length, 0);

        setStats({
          totalPermissions: totalPerms,
          totalGroups: groups.length,
          mostUsedModule: groups[0] || "N/A",
          recentlyAdded: 0,
        });

        // Set first group as selected by default
        if (groups.length > 0 && !selectedGroup) {
          setSelectedGroup(groups[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching permissions:", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  const searchPermissions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setFilteredPermissions(permissions);
      return;
    }

    try {
      const response = await api.get<{
        success: boolean;
        data: Permission[];
      }>(`${apiConfig.endpoints.permissions}/search?q=${encodeURIComponent(query)}`);

      if (response.data.success) {
        // Group the search results
        const grouped: { [group: string]: Permission[] } = {};
        response.data.data.forEach(perm => {
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
  }, [permissions]);

  const fetchPermissionsByModule = useCallback(async (module: string) => {
    if (!module) {
      setFilteredPermissions(permissions);
      return;
    }

    try {
      const response = await api.get<{
        success: boolean;
        data: Permission[];
      }>(`${apiConfig.endpoints.permissions}/module/${module}`);

      if (response.data.success) {
        const grouped: { [group: string]: Permission[] } = {};
        response.data.data.forEach(perm => {
          if (!grouped[perm.group]) {
            grouped[perm.group] = [];
          }
          grouped[perm.group].push(perm);
        });
        setFilteredPermissions(grouped);
      }
    } catch (err) {
      console.error("Error fetching permissions by module:", getErrorMessage(err));
    }
  }, [permissions]);

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
  }, [searchQuery, selectedModule, searchPermissions, fetchPermissionsByModule, permissions]);

  const groups = Object.keys(filteredPermissions);
  const allModules = Array.from(new Set(
    Object.values(permissions).flat().map(p => p.module)
  ));

  // Prepare chart data
  const barChartData = Object.keys(permissions).map(group => ({
    name: group,
    permissions: permissions[group].length,
  }));

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#84CC16'];

  const pieChartData = Object.keys(permissions).map(group => ({
    name: group,
    value: permissions[group].length,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Permissions Management</h1>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Permissions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPermissions}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Permission Groups</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalGroups}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Key className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Modules</p>
                  <p className="text-2xl font-bold text-gray-900">{allModules.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Most Used</p>
                  <p className="text-lg font-bold text-gray-900">{stats.mostUsedModule}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search permissions..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedModule("");
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          <select
            value={selectedModule}
            onChange={(e) => {
              setSelectedModule(e.target.value);
              setSearchQuery("");
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          >
            <option value="">All Modules</option>
            {allModules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart - Permissions per Group */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Permissions Distribution by Group</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
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
                dataKey="permissions"
                fill="#3B82F6"
                radius={[8, 8, 0, 0]}
                name="Permissions Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Permissions Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Permission Groups Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
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

      {/* Permissions Display */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Groups Sidebar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Groups</h2>
          <div className="space-y-1">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No groups found</div>
            ) : (
              groups.map((group) => (
                <button
                  key={group}
                  onClick={() => setSelectedGroup(group)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedGroup === group
                      ? "bg-blue-600 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{group}</span>
                    <span className={`text-sm ${selectedGroup === group ? "text-blue-200" : "text-gray-500"}`}>
                      {filteredPermissions[group]?.length || 0}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Permissions List */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedGroup || "Select a Group"}
          </h2>

          {selectedGroup && filteredPermissions[selectedGroup] ? (
            <div className="space-y-3">
              {filteredPermissions[selectedGroup].map((permission) => (
                <div
                  key={permission.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{permission.key}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {permission.action}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{permission.description}</p>
                      <div className="flex gap-3 text-sm">
                        <span className="text-gray-500">
                          <strong>Module:</strong> <span className="font-mono bg-gray-100 px-2 py-1 rounded">{permission.module}</span>
                        </span>
                        <span className="text-gray-500">
                          <strong>Group:</strong> {permission.group}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                        <Shield className="text-white" size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select a group to view permissions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
