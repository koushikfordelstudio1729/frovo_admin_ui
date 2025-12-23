"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Edit, Trash2, Shield, Key, UserPlus, X, Eye } from "lucide-react";
import { Button, Badge, Pagination, Input } from "@/components/common";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  departments?: Array<{
    id: string;
    name: string;
  }>;
  roles?: Array<{
    id: string;
    name: string;
    key: string;
  }>;
  status: string;
  lastLogin?: string;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  key: string;
}

interface Department {
  id: string;
  name: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [addUserForm, setAddUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    departments: [] as string[],
    roles: [] as string[],
  });

  const [editUserForm, setEditUserForm] = useState({
    name: "",
    phone: "",
    departments: [] as string[],
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
  });

  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(new Set());

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    return "An unexpected error occurred";
  };

  const fetchUsers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get<{
        success: boolean;
        data: User[];
        pagination: { page: number; pages: number; total: number };
      }>(`${apiConfig.endpoints.users.list}?page=${page}&limit=10`);

      if (response.data.success) {
        setUsers(response.data.data);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchUsers(1);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get<{
        success: boolean;
        data: User[];
      }>(`${apiConfig.endpoints.users.search}?q=${encodeURIComponent(query)}`);

      if (response.data.success) {
        setUsers(response.data.data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error searching users:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: Role[];
      }>(`${apiConfig.endpoints.roles}?limit=100`);

      if (response.data.success) {
        setRoles(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: Department[];
      }>(`${apiConfig.endpoints.departments}?limit=100`);

      if (response.data.success) {
        setDepartments(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1);
    fetchRoles();
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Skip the initial render to avoid double fetch
    if (searchQuery === "" && currentPage === 1) {
      return;
    }

    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      } else {
        fetchUsers(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleAddUser = async () => {
    try {
      const response = await api.post(apiConfig.endpoints.users.create, addUserForm);

      if (response.data.success) {
        setSuccess("User created successfully");
        setShowAddModal(false);
        setAddUserForm({
          name: "",
          email: "",
          phone: "",
          password: "",
          departments: [],
          roles: [],
        });
        fetchUsers(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to create user");
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.put(
        apiConfig.endpoints.users.update(selectedUser.id),
        editUserForm
      );

      if (response.data.success) {
        setSuccess("User updated successfully");
        setShowEditModal(false);
        fetchUsers(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to update user");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.delete(apiConfig.endpoints.users.delete(selectedUser.id));

      if (response.data.success) {
        setSuccess("User deleted successfully");
        setShowDeleteModal(false);
        fetchUsers(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to delete user");
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      const response = await api.patch(apiConfig.endpoints.users.updateStatus(user.id), {
        status: newStatus,
      });

      if (response.data.success) {
        setSuccess(`User status updated to ${newStatus}`);
        fetchUsers(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to update status");
    }
  };

  const handleUpdatePassword = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.patch(
        apiConfig.endpoints.users.updatePassword(selectedUser.id),
        passwordForm
      );

      if (response.data.success) {
        setSuccess("Password updated successfully");
        setShowPasswordModal(false);
        setPasswordForm({ newPassword: "" });
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to update password");
    }
  };

  const handleAssignRoles = async () => {
    if (!selectedUser) return;

    try {
      const response = await api.post(
        apiConfig.endpoints.users.assignRoles(selectedUser.id),
        {
          roleIds: Array.from(selectedRoleIds),
        }
      );

      if (response.data.success) {
        setSuccess("Roles assigned successfully");
        setShowRoleModal(false);
        setSelectedRoleIds(new Set());
        fetchUsers(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to assign roles");
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditUserForm({
      name: user.name,
      phone: user.phone || "",
      departments: user.departments?.map((dept) => dept.id) || [],
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRoleIds(new Set(user.roles?.map((r) => r.id) || []));
    setShowRoleModal(true);
  };

  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  };

  const openViewModal = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex justify-between items-center">
          {success}
          <button onClick={() => setSuccess(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
          {error}
          <button onClick={() => setError(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <UserPlus size={20} />
            Add New User
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.phone || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.departments && user.departments.length > 0 ? (
                          user.departments.map((dept) => (
                            <Badge
                              key={dept.id}
                              label={dept.name}
                              size="sm"
                            />
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge
                              key={role.id}
                              label={role.name}
                              size="sm"
                              variant="active"
                            />
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <Badge
                          label={user.status}
                          size="md"
                          variant={user.status === "active" ? "active" : "inactive"}
                          showDot
                        />
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            user.status === "active" ? "bg-green-600" : "bg-gray-300"
                          }`}
                          title={`Toggle status (currently ${user.status})`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              user.status === "active" ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openViewModal(user)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="View details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit user"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openRoleModal(user)}
                          className="text-green-600 hover:text-green-800"
                          title="Manage roles"
                        >
                          <Shield size={18} />
                        </button>
                        <button
                          onClick={() => openPasswordModal(user)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Update password"
                        >
                          <Key size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <div className="flex items-center justify-end px-6 py-4 bg-gray-50 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchUsers(page)}
            />
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-5">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add New User</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Name *"
                variant="orange"
                value={addUserForm.name}
                onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                placeholder="Enter user name"
              />

              <Input
                label="Email *"
                variant="orange"
                type="email"
                value={addUserForm.email}
                onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                placeholder="Enter email address"
              />

              <Input
                label="Phone"
                variant="orange"
                value={addUserForm.phone}
                onChange={(e) => setAddUserForm({ ...addUserForm, phone: e.target.value })}
                placeholder="Enter phone number"
              />

              <Input
                label="Password *"
                variant="orange"
                type="password"
                value={addUserForm.password}
                onChange={(e) => setAddUserForm({ ...addUserForm, password: e.target.value })}
                placeholder="Enter password"
              />

              {/* Departments Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {departments.length === 0 ? (
                    <p className="text-sm text-gray-500">No departments available</p>
                  ) : (
                    departments.map((dept) => (
                      <div key={dept.id} className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id={`add-dept-${dept.id}`}
                          checked={addUserForm.departments.includes(dept.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAddUserForm({
                                ...addUserForm,
                                departments: [...addUserForm.departments, dept.id],
                              });
                            } else {
                              setAddUserForm({
                                ...addUserForm,
                                departments: addUserForm.departments.filter((d) => d !== dept.id),
                              });
                            }
                          }}
                          className="accent-blue-600 w-4 h-4 rounded"
                        />
                        <label htmlFor={`add-dept-${dept.id}`} className="text-sm text-gray-700">
                          {dept.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Roles Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {roles.length === 0 ? (
                    <p className="text-sm text-gray-500">No roles available</p>
                  ) : (
                    roles.map((role) => (
                      <div key={role.id} className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id={`add-role-${role.id}`}
                          checked={addUserForm.roles.includes(role.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAddUserForm({
                                ...addUserForm,
                                roles: [...addUserForm.roles, role.id],
                              });
                            } else {
                              setAddUserForm({
                                ...addUserForm,
                                roles: addUserForm.roles.filter((r) => r !== role.id),
                              });
                            }
                          }}
                          className="accent-blue-600 w-4 h-4 rounded"
                        />
                        <label htmlFor={`add-role-${role.id}`} className="text-sm text-gray-700">
                          {role.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="secondary" size="md" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleAddUser}>
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-5">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit User</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Name *"
                variant="orange"
                value={editUserForm.name}
                onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                placeholder="Enter user name"
              />

              <Input
                label="Phone"
                variant="orange"
                value={editUserForm.phone}
                onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                placeholder="Enter phone number"
              />

              {/* Departments Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departments</label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {departments.length === 0 ? (
                    <p className="text-sm text-gray-500">No departments available</p>
                  ) : (
                    departments.map((dept) => (
                      <div key={dept.id} className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id={`edit-dept-${dept.id}`}
                          checked={editUserForm.departments.includes(dept.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditUserForm({
                                ...editUserForm,
                                departments: [...editUserForm.departments, dept.id],
                              });
                            } else {
                              setEditUserForm({
                                ...editUserForm,
                                departments: editUserForm.departments.filter((d) => d !== dept.id),
                              });
                            }
                          }}
                          className="accent-blue-600 w-4 h-4 rounded"
                        />
                        <label htmlFor={`edit-dept-${dept.id}`} className="text-sm text-gray-700">
                          {dept.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="secondary" size="md" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleEditUser}>
                Update User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-5">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Delete User</h3>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="md" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete User
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Roles Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-5">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Manage Roles</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Assign roles to <strong>{selectedUser.name}</strong>
              </p>
              <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
                {roles.length === 0 ? (
                  <p className="text-sm text-gray-500">No roles available</p>
                ) : (
                  roles.map((role) => (
                    <div key={role.id} className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        id={`role-modal-${role.id}`}
                        checked={selectedRoleIds.has(role.id)}
                        onChange={() => {
                          const newSet = new Set(selectedRoleIds);
                          if (newSet.has(role.id)) {
                            newSet.delete(role.id);
                          } else {
                            newSet.add(role.id);
                          }
                          setSelectedRoleIds(newSet);
                        }}
                        className="accent-blue-600 w-4 h-4 rounded"
                      />
                      <label htmlFor={`role-modal-${role.id}`} className="text-sm text-gray-700">
                        {role.name}
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="md" onClick={() => setShowRoleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleAssignRoles}>
                Assign Roles
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Update Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-5">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Update Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Update password for <strong>{selectedUser.name}</strong>
              </p>
              <Input
                label="New Password *"
                variant="orange"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ newPassword: e.target.value })}
                placeholder="Enter new password"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="md" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View User Details Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-5 p-4">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">User Profile</h3>
                <p className="text-blue-100 text-sm mt-1">Complete user information</p>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* User Avatar & Name Section */}
                <div className="flex items-center gap-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h4>
                    <p className="text-gray-600 mt-1">{selectedUser.email}</p>
                    <div className="mt-2">
                      <Badge
                        label={selectedUser.status}
                        size="md"
                        variant={selectedUser.status === "active" ? "active" : "inactive"}
                        showDot
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600">📞</span>
                    </div>
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
                      <p className="text-gray-900 mt-1 font-medium">{selectedUser.email}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
                      <p className="text-gray-900 mt-1 font-medium">{selectedUser.phone || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600">🔐</span>
                    </div>
                    Account Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User ID</label>
                      <p className="text-gray-900 mt-1 font-mono text-xs break-all">{selectedUser.id}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created Date</label>
                      <p className="text-gray-900 mt-1 font-medium">
                        {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    {selectedUser.lastLogin && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Login</label>
                        <p className="text-gray-900 mt-1 font-medium">
                          {new Date(selectedUser.lastLogin).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Departments */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">🏢</span>
                    </div>
                    Departments
                  </h4>
                  {selectedUser.departments && selectedUser.departments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.departments.map((dept) => (
                        <div key={dept.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-4 py-2">
                          <p className="font-medium text-green-800">{dept.name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No departments assigned</p>
                  )}
                </div>

                {/* Roles */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600">👔</span>
                    </div>
                    Roles & Permissions
                  </h4>
                  {selectedUser.roles && selectedUser.roles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedUser.roles.map((role) => (
                        <div key={role.id} className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-bold text-orange-900">{role.name}</p>
                              <p className="text-xs text-orange-600 font-mono mt-1">{role.key}</p>
                            </div>
                            <div className="ml-2">
                              <Badge
                                label="Active"
                                size="sm"
                                variant="active"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No roles assigned</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button variant="primary" size="md" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
