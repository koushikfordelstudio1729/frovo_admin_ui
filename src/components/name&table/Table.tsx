"use client";

import React from "react";

export interface Column {
  key: string;
  label: string;
  className?: string;
  minWidth?: string;
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
  enableHorizontalScroll?: boolean;
  minTableWidth?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  renderCell,
  alternateRowColors = true,
  showSeparators = true,
  enableHorizontalScroll = true,
  minTableWidth = "1200px",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Horizontal scroll wrapper */}
      <div
        className={enableHorizontalScroll ? "overflow-x-auto" : ""}
        style={{
          // Add smooth scrolling
          scrollbarWidth: "thin",
          scrollbarColor: "#f97316 #f3f4f6",
        }}
      >
        <table
          className="w-full"
          style={{
            minWidth: enableHorizontalScroll ? minTableWidth : "auto",
          }}
        >
          <thead>
            <tr className="bg-gray-900 text-white">
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  className={`px-8 py-3 text-center text-md font-medium relative ${
                    col.className || ""
                  }`}
                  style={{
                    minWidth: col.minWidth || "auto",
                  }}
                >
                  {col.label}
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
                    className={`px-6 py-4 text-center text-[16px] text-gray-900 ${
                      col.className || ""
                    }`}
                    style={{
                      minWidth: col.minWidth || "auto",
                    }}
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

      {/* Optional: Empty state */}
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default Table;
