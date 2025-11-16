import Table from "@/components/name&table/Table";
import { Badge } from "../common";

const columns = [
  { key: "refillId", label: "Refill ID" },
  { key: "skuId", label: "SKU ID" },
  { key: "triggerDate", label: "Trigger Date" },
  { key: "completedDate", label: "Completed Date" },
  { key: "admin", label: "Admin" },
  { key: "status", label: "Status" },
];

const data = [
  {
    refillId: "#4232",
    skuId: "SNACKS-231",
    triggerDate: "22-10-2025",
    completedDate: "25-10-2025",
    admin: "Nithin",
    status: "Refilled",
  },
  {
    refillId: "#4233",
    skuId: "DRINKS-019",
    triggerDate: "20-10-2025",
    completedDate: "20-10-2025",
    admin: "Aarav",
    status: "Refilled",
  },
  {
    refillId: "#4234",
    skuId: "CANDY-002",
    triggerDate: "18-10-2025",
    completedDate: "21-10-2025",
    admin: "Sneha",
    status: "Pending",
  },
  {
    refillId: "#4235",
    skuId: "SNACKS-233",
    triggerDate: "21-10-2025",
    completedDate: "22-10-2025",
    admin: "Priya",
    status: "Refilled",
  },
  {
    refillId: "#4236",
    skuId: "CHOC-110",
    triggerDate: "23-10-2025",
    completedDate: "—",
    admin: "Dev",
    status: "Missed",
  },
  {
    refillId: "#4237",
    skuId: "JUICE-055",
    triggerDate: "24-10-2025",
    completedDate: "25-10-2025",
    admin: "Vikas",
    status: "Refilled",
  },
];

export default function RefillSummaryTable() {
  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Refill Summary
      </div>
      <Table
        columns={columns}
        data={data}
        renderCell={(key, value) =>
          key === "status" ? (
            <Badge
              label={value}
              variant={
                value === "Refilled"
                  ? "active"
                  : value === "Pending"
                  ? "pending"
                  : value === "Missed"
                  ? "rejected"
                  : "info"
              }
              size="md"
            />
          ) : (
            value
          )
        }
      />
    </div>
  );
}
