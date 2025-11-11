"use client";

import { RoleList } from "@/types/roles.types";
import React from "react";
import { Badge, Pagination } from "@/components/common";
import { Eye, Trash2 } from "lucide-react";
import { Column } from "@/components/name&table/Table";
import { Table } from "@/components";

interface RoleDataTableProps {
  roles: RoleList[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const RolesDataTable: React.FC<RoleDataTableProps> = ({
  roles,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const columns: Column[] = [
    { key: "role", label: "Role" },
    { key: "description", label: "Description" },
    { key: "scope", label: "Scope" },
    { key: "user", label: "Users" },
    { key: "lastModified", label: "Last Modification" },
    { key: "actions", label: "Action" },
  ];

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    if (key === "scope") {
      return <Badge label={value} size="lg" />;
    }

    if (key === "actions") {
      return (
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-blue-500 hover:text-blue-700 transition-colors"
            aria-label="View details"
          >
            <Eye size={18} />
          </button>
          <button
            type="button"
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      );
    }

    return value;
  };

  return (
    <div className="bg-white rounded-lg">
      <Table
        columns={columns}
        data={roles}
        renderCell={renderCell}
        showSeparators={true}
        alternateRowColors={true}
      />

      <div className="flex items-center justify-end px-6 pt-8 bg-gray-50">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default RolesDataTable;
