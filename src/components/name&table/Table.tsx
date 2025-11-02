"use client";

import React from "react";

export interface Column {
  key: string;
  label: string;
}

interface TableProps {
  columns: Column[];
  data: Record<string, any>[];
  renderCell?: (
    key: string,
    value: any,
    row?: Record<string, any>
  ) => React.ReactNode;
  alternateRowColors?: boolean;
  showSeparators?: boolean;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  renderCell,
  alternateRowColors = true,
  showSeparators = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-900 text-white">
            {columns.map((col, index) => (
              <th
                key={col.key}
                className="px-8 py-3 text-left text-[16px] font-medium relative"
              >
                <span className="block">{col.label}</span>
                {showSeparators && index < columns.length - 1 && (
                  <div className="absolute right-0 top-3 bottom-3 w-px bg-gray-100"></div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={`transition-colors ${
                alternateRowColors
                  ? idx % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                  : "bg-white"
              } hover:bg-gray-100`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 text-[16px] text-gray-900"
                >
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

export default Table;
