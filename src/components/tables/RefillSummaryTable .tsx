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

interface RefillSummaryTableProps {
  reportData?: any;
}

export default function RefillSummaryTable({ reportData }: RefillSummaryTableProps) {
  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Refill Summary
      </div>
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Refill summary report coming soon</p>
        <p className="text-sm text-gray-400 mt-2">This feature is under development</p>
      </div>
    </div>
  );
}
