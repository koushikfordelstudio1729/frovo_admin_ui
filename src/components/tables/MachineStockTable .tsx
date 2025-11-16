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

const data = [
  {
    machineId: "#4232",
    location: "Navi Mumbai, MH",
    totalSlots: 40,
    lowSlots: 13,
    emptySlots: 3,
    lastSync: "5 mins ago",
  },
  {
    machineId: "#3701",
    location: "Andheri East, MH",
    totalSlots: 32,
    lowSlots: 5,
    emptySlots: 6,
    lastSync: "1 min ago",
  },
  {
    machineId: "#1542",
    location: "Pune Station, MH",
    totalSlots: 50,
    lowSlots: 17,
    emptySlots: 1,
    lastSync: "10 mins ago",
  },
  {
    machineId: "#2888",
    location: "Borivali West, MH",
    totalSlots: 48,
    lowSlots: 9,
    emptySlots: 4,
    lastSync: "2 mins ago",
  },
  {
    machineId: "#6207",
    location: "Bandra Kurla, MH",
    totalSlots: 44,
    lowSlots: 12,
    emptySlots: 2,
    lastSync: "7 mins ago",
  },
  {
    machineId: "#4190",
    location: "Vashi, Navi Mumbai",
    totalSlots: 36,
    lowSlots: 8,
    emptySlots: 0,
    lastSync: "4 mins ago",
  },
];

export default function MachineStockTable() {
  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Machine Stock
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
}
