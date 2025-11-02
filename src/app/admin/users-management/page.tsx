"use client";

import { UserDataTable, UserTableHeader } from "@/components";
import { Pagination } from "@/components/common";
import { Column } from "@/components/user-management/UserTable";
import { useUsers } from "@/hooks/useUsers";

export default function UserManagementPage() {
  const { users, currentPage, totalPages, handleSearch, handlePageChange } =
    useUsers();

  const columns: Column[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "lastLogin", label: "Last Login" },
  ];

  const renderCell = (key: string, value: any) => {
    if (key === "status") {
      return (
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            value === "Active"
              ? "bg-[#79EE52] text-green-800"
              : "bg-[#6B6B6B] text-gray-200"
          }`}
        >
          {value === "Active" && "● "} {value}
        </span>
      );
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <UserTableHeader
        title="User Management"
        searchPlaceholder="Search user"
        searchValue=""
        onSearchChange={handleSearch}
        buttonText="Add new user"
        buttonLink="/admin/create-user"
      />

      <UserDataTable columns={columns} data={users} renderCell={renderCell} />

      <div className="flex items-center justify-end px-6 py-8 bg-gray-50">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
