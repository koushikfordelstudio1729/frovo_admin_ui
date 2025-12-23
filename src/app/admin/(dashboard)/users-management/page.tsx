"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Edit,
  Trash2,
  Shield,
  Key,
  UserPlus,
  X,
  Eye,
} from "lucide-react";
import {
  Button,
  Badge,
  Pagination,
  Input,
  BackHeader,
} from "@/components/common";
import { Table } from "@/components";
import type { Column } from "@/components";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import SuccessDialog from "@/components/common/SuccessDialog";
import Toggle from "@/components/common/Toggle";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  departments?: Array<{ id: string; name: string }>;
  roles?: Array<{ id: string; name: string; key: string }>;
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
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [successDialog, setSuccessDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    title: "",
    message: "",
  });

  // Confirm dialog state (shared)
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "primary" | "danger";
    onConfirm: (() => Promise<void>) | (() => void) | null;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmVariant: "primary",
    onConfirm: null,
  });

  const [confirmLoading, setConfirmLoading] = useState(false);

  const openConfirm = (config: Partial<typeof confirmConfig>) => {
    setConfirmConfig((prev) => ({
      ...prev,
      ...config,
      isOpen: true,
    }));
  };

  const closeConfirm = () =>
    setConfirmConfig((prev) => ({
      ...prev,
      isOpen: false,
      onConfirm: null,
    }));

  const showSuccessDialog = (title: string, message: string) => {
    setSuccessDialog({ open: true, title, message });
    setTimeout(() => {
      setSuccessDialog((prev) => ({ ...prev, open: false }));
    }, 2000);
  };

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

  const searchUsers = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        fetchUsers(1);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get<{
          success: boolean;
          data: User[];
        }>(
          `${apiConfig.endpoints.users.search}?q=${encodeURIComponent(query)}`
        );

        if (response.data.success) {
          setUsers(response.data.data);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers]
  );

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get<{
        success: boolean;
        data: Role[];
      }>(apiConfig.endpoints.roles);

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
      }>(apiConfig.endpoints.departments);

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
  }, [fetchUsers, fetchRoles, fetchDepartments]);

  useEffect(() => {
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
  }, [searchQuery, searchUsers, fetchUsers, currentPage]);

  // delete API
  const deleteUserApi = async (user: User) => {
    try {
      const response = await api.delete(
        apiConfig.endpoints.users.delete(user.id)
      );

      if (response.data.success) {
        setSuccess("User deleted successfully");
        showSuccessDialog("User deleted", "The user was deleted successfully.");
        fetchUsers(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to delete user");
    }
  };

  // status API
  const toggleStatusApi = async (user: User) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      const response = await api.patch(
        apiConfig.endpoints.users.updateStatus(user.id),
        { status: newStatus }
      );

      if (response.data.success) {
        setSuccess(`User status updated to ${newStatus}`);
        showSuccessDialog(
          "Status updated",
          `User status updated to ${newStatus}.`
        );
        fetchUsers(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to update status");
    }
  };

  const openDeleteConfirm = (user: User) => {
    setSelectedUser(user);
    openConfirm({
      title: "Delete User",
      message: (
        <>
          Are you sure you want to delete{" "}
          <strong className="text-red-600">{user.name}</strong>? This action
          cannot be undone.
        </>
      ),
      confirmText: "Delete",
      cancelText: "Cancel",
      confirmVariant: "danger",
      onConfirm: async () => {
        setConfirmLoading(true);
        await deleteUserApi(user);
        setConfirmLoading(false);
        closeConfirm();
      },
    });
  };

  const openStatusConfirm = (user: User, nextEnabled: boolean) => {
    const newStatus = nextEnabled ? "active" : "inactive";

    openConfirm({
      title: "Change User Status",
      message: (
        <>
          Are you sure you want to change status of <strong>{user.name}</strong>{" "}
          to <strong className="text-red-600">{newStatus}</strong>?
        </>
      ),
      confirmText: "Yes, change",
      cancelText: "Cancel",
      confirmVariant: "primary",
      onConfirm: async () => {
        setConfirmLoading(true);
        await toggleStatusApi(user);
        setConfirmLoading(false);
        closeConfirm();
      },
    });
  };

  const columns: Column[] = [
    { key: "name", label: "Name", minWidth: "150px" },
    { key: "email", label: "Email", minWidth: "200px" },
    { key: "phone", label: "Phone", minWidth: "120px" },
    { key: "departments", label: "Departments", minWidth: "180px" },
    { key: "roles", label: "Roles", minWidth: "180px" },
    { key: "status", label: "Status", minWidth: "150px" },
    { key: "actions", label: "Actions", minWidth: "220px" },
  ];

  const renderCell = (
    key: string,
    value: any,
    row?: Record<string, any>
  ): React.ReactNode => {
    const user = row as User | undefined;
    if (!user) return value;

    switch (key) {
      case "name":
        return <div className="font-medium text-gray-900">{user.name}</div>;
      case "email":
        return <div className="text-sm text-gray-600">{user.email}</div>;
      case "phone":
        return <div className="text-sm text-gray-600">{user.phone || "-"}</div>;
      case "departments":
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {user.departments && user.departments.length > 0 ? (
              user.departments.map((dept) => (
                <Badge key={dept.id} label={dept.name} size="sm" />
              ))
            ) : (
              <span className="text-sm text-gray-400">-</span>
            )}
          </div>
        );
      case "roles":
        return (
          <div className="flex flex-wrap gap-1 justify-center">
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
        );
      case "status":
        return (
          <div className="flex items-center gap-3 justify-center">
            <Badge
              label={user.status === "active" ? "Active" : "Inactive"}
              size="md"
              variant={user.status === "active" ? "active" : "inactive"}
              showDot
            />
          </div>
        );
      case "actions":
        return (
          <div className="flex gap-2 justify-center">
            {/* Status Toggle using shared Toggle */}
            <Toggle
              enabled={user.status === "active"}
              onChange={(nextEnabled) => openStatusConfirm(user, nextEnabled)}
            />

            <button
              onClick={() =>
                router.push(`/admin/users-management/${user.id}/view`)
              }
              className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
              title="View details"
            >
              <Eye size={20} />
            </button>
            <button
              onClick={() =>
                router.push(`/admin/users-management/${user.id}/edit`)
              }
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              title="Edit user"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() =>
                router.push(`/admin/users-management/${user.id}/roles`)
              }
              className="text-green-600 hover:text-green-800 cursor-pointer"
              title="Manage roles"
            >
              <Shield size={20} />
            </button>
            <button
              onClick={() =>
                router.push(`/admin/users-management/${user.id}/password`)
              }
              className="text-purple-600 hover:text-purple-800 cursor-pointer"
              title="Update password"
            >
              <Key size={20} />
            </button>
            <button
              onClick={() => openDeleteConfirm(user)}
              className="text-red-600 hover:text-red-800 cursor-pointer"
              title="Delete user"
            >
              <Trash2 size={20} />
            </button>
          </div>
        );
      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
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
      <div className="mb-4">
        <BackHeader title="User Management" />
      </div>

      {/* Search + Add */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-96">
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            startIcon={<Search size={20} />}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => router.push("/admin/users-management/create")}
          className="flex items-center gap-2 rounded-lg"
        >
          <UserPlus size={20} />
          Add New User
        </Button>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          Loading users...
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={users}
            renderCell={renderCell}
            alternateRowColors
            showSeparators
            enableHorizontalScroll
            minTableWidth="1400px"
          />

          {users.length > 0 && (
            <div className="flex items-center justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchUsers(page)}
              />
            </div>
          )}
        </>
      )}

      {/* Shared Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        confirmVariant={confirmConfig.confirmVariant}
        isLoading={confirmLoading}
        onCancel={() => {
          if (confirmLoading) return;
          closeConfirm();
        }}
        onConfirm={async () => {
          if (!confirmConfig.onConfirm || confirmLoading) return;
          await confirmConfig.onConfirm();
        }}
      />

      {/* Success Dialog */}
      <SuccessDialog
        open={successDialog.open}
        title={successDialog.title}
        message={successDialog.message}
        onClose={() => setSuccessDialog((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
