"use client";

import { RoleList } from "@/types/roles.types";
import React from "react";
import { Badge, Button, Pagination } from "@/components/common";
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
      return <Badge label={value} size="md" />;
    }

    if (key === "actions") {
      return (
        <div className="flex items-center gap-3">
          <Button
            title="View"
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
          >
            <Eye className="text-green-500 w-5 h-5" />
          </Button>
          <Button
            title="Delete"
            size="sm"
            className=" bg-transparent shadow-none hover:bg-gray-100"
          >
            <Trash2 className="text-red-500 w-5 h-5" />
          </Button>
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
