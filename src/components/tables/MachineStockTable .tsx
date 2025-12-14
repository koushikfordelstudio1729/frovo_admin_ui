import React from "react";
import Table from "@/components/name&table/Table";

const columns = [
  { key: "machineId", label: "Machine ID" },
  { key: "location", label: "Location" },
  { key: "totalSlots", label: "Total Slots" },
  { key: "lowSlots", label: "Low Stock Slots" },
  { key: "emptySlots", label: "Empty Slots" },
  { key: "lastSync", label: "Last Sync" },
];

interface MachineStockTableProps {
  reportData?: any;
}

export default function MachineStockTable({ reportData }: MachineStockTableProps) {
  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Machine Stock
      </div>
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Machine stock report coming soon</p>
        <p className="text-sm text-gray-400 mt-2">This feature is under development</p>
      </div>
    </div>
  );
}
