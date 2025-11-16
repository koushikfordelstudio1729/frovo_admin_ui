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

const data = [
  {
    vendorId: "#4232",
    vendorName: "Vendor@123",
    totalPOs: 232,
    onTime: "78%",
    delay: "34%",
    rejection: "2%",
  },
  {
    vendorId: "#5301",
    vendorName: "PackWell Ltd",
    totalPOs: 119,
    onTime: "91%",
    delay: "8%",
    rejection: "0.6%",
  },
  {
    vendorId: "#1840",
    vendorName: "FreshMart",
    totalPOs: 300,
    onTime: "85%",
    delay: "10%",
    rejection: "1.2%",
  },
  {
    vendorId: "#2259",
    vendorName: "Urban Juices",
    totalPOs: 74,
    onTime: "72%",
    delay: "21%",
    rejection: "3%",
  },
  {
    vendorId: "#9104",
    vendorName: "SnackNation",
    totalPOs: 198,
    onTime: "94%",
    delay: "3%",
    rejection: "0.5%",
  },
  {
    vendorId: "#3671",
    vendorName: "SweetTreats Inc.",
    totalPOs: 155,
    onTime: "88%",
    delay: "7%",
    rejection: "1.8%",
  },
];

export default function VendorPerformanceTable() {
  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Vendor Performance
      </div>
      <Table columns={columns} data={data} />
    </div>
  );
}
