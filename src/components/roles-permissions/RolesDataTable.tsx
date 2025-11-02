"use client";

import { RoleList } from "@/types/roles.types";
import React from "react";
import Badge from "../common/Badge";
import { Eye, Trash2 } from "lucide-react";
import { Pagination } from "../common";

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
  totalItems,
  onPageChange,
}) => {
  //const itemsPerPage = 9;
  //const startIndex = (currentPage - 1) * itemsPerPage;
  return (
    <div className="bg-white rounded-lg">
      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="px-6 py-2 text-left text-xl font-medium relative">
              <span className="block">Role</span>
              <div className="absolute right-0 top-3 bottom-3 w-px bg-white"></div>
            </th>
            <th className="px-6 py-2 text-left text-xl font-medium relative">
              <span className="block">Description</span>
              <div className="absolute right-0 top-3 bottom-3 w-px bg-white"></div>
            </th>
            <th className="px-6 py-2 text-left text-xl font-medium relative">
              <span className="block">Scope</span>
              <div className="absolute right-0 top-3 bottom-3 w-px bg-white"></div>
            </th>
            <th className="px-6 py-2 text-left text-xl font-medium relative">
              <span className="block">Users</span>
              <div className="absolute right-0 top-3 bottom-3 w-px bg-white"></div>
            </th>
            <th className="px-6 py-2 text-left text-xl font-medium relative">
              <span className="block">Last Modification</span>
              <div className="absolute right-0 top-3 bottom-3 w-px bg-white"></div>
            </th>
            <th className="px-6 py-2 text-left text-xl font-medium">Action</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role, index) => (
            <tr
              key={role.id}
              className={`border-b border-gray-200 transition-colors ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100`}
            >
              <td className="px-6 py-4 text-[18px] font-medium text-gray-900">
                {role.role}
              </td>
              <td className="px-6 py-4 text-[18px] font-medium text-gray-900">
                {role.description}
              </td>
              <td className="px-6 py-4 text-[18px]">
                <Badge label={role.scope} />
              </td>
              <td className="px-6 py-4 text-[18px] text-gray-900 font-medium">
                {role.user}
              </td>
              <td className="px-10 py-4 text-[18px] text-gray-900 font-medium">
                {role.lastModified}
              </td>
              <td className="px-6 py-4 text-sm flex items-center gap-3">
                <button className="text-blue-500 hover:text-blue-700 transition-colors">
                  <Eye size={18} />
                </button>
                <button className="text-red-500 hover:text-red-700 transition-colors">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-end px-6 py-8 bg-gray-50">
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
