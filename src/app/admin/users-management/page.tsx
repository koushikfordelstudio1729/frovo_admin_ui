"use client";

import { Table, TableName } from "@/components";
import { Pagination, Badge } from "@/components/common";
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
        <Badge
          label={value}
          variant={value === "Active" ? "active" : "inactive"}
          showDot={value === "Active"}
        />
      );
    }
    return value;
  };

  const handleAddUser = (formData: any) => {
    console.log("New user added:", formData);
    setIsModalOpen(false);
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

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
}
