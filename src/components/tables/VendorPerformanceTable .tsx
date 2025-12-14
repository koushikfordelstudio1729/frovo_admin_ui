import React from "react";
import Table from "@/components/name&table/Table";

const columns = [
  { key: "vendorId", label: "Vendor ID" },
  { key: "vendorName", label: "Vendor Name" },
  { key: "totalPOs", label: "Total POs" },
  { key: "onTime", label: "On-Time" },
  { key: "delay", label: "Delay" },
  { key: "rejection", label: "Rejection" },
];

interface VendorPerformanceTableProps {
  reportData?: any;
}

export default function VendorPerformanceTable({ reportData }: VendorPerformanceTableProps) {
  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Vendor Performance
      </div>
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Vendor performance report coming soon</p>
        <p className="text-sm text-gray-400 mt-2">This feature is under development</p>
      </div>
    </div>
  );
}
