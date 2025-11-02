"use client";

import React from "react";

export interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  renderCell?: (
    key: string,
    value: any,
    row?: Record<string, any>
  ) => React.ReactNode;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  renderCell,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-900 text-white">
            {columns.map((col, index) => (
              <th
                key={col.key}
                className="px-6 py-2 text-left text-xl font-medium relative"
              >
                <span className="block">{col.label}</span>
                {index < columns.length - 1 && (
                  <div className="absolute right-0 top-3 bottom-3 w-px bg-white"></div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={`border-b border-gray-200 transition-colors ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-gray-100`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-xl text-gray-900">
                  {renderCell
                    ? renderCell(col.key, row[col.key], row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
