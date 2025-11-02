"use client";

import { Table, TableName } from "@/components";
import { Pagination } from "@/components/common";
import AddUserModal from "@/components/modals/AddUserModal";
import { Column } from "@/components/name&table/Table";
import { useUsers } from "@/hooks/useUsers";
import { useState } from "react";

export default function UserManagementPage() {
  const { users, currentPage, totalPages, handleSearch, handlePageChange } =
    useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddUser = (formData: any) => {
    console.log("New user added:", formData);
    setIsModalOpen(false);
    // Add API call here to save user
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-8">
      <TableName
        title="User Management"
        searchPlaceholder="Search user"
        searchValue=""
        onSearchChange={handleSearch}
        buttonText="Add new user"
        buttonLink="#"
        onButtonClick={() => setIsModalOpen(true)}
      />

      <Table columns={columns} data={users} renderCell={renderCell} />

      <div className="flex items-center justify-end px-6 pt-6 bg-gray-50">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {/* Add User Modal */}
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
}
