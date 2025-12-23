import Table from "@/components/name&table/Table";
import { Badge } from "../common";

const columns = [
  { key: "sku", label: "SKU" },
  { key: "productName", label: "Product Name" },
  { key: "batchId", label: "Batch ID" },
  { key: "currentQty", label: "Current Qty" },
  { key: "minStock", label: "Min Stock" },
  { key: "maxStock", label: "Max Stock" },
  { key: "status", label: "Status" },
  { key: "location", label: "Location" },
];

interface InventorySummaryTableProps {
  reportData?: any;
}

export default function InventorySummaryTable({
  reportData,
}: InventorySummaryTableProps) {
  // Transform report data to table format
  const data =
    reportData?.inventoryDetails?.map((item: any) => {
      return {
        sku: item.sku || "N/A",
        productName: item.productName || "N/A",
        batchId: item.batchId || "N/A",
        currentQty: item.quantity || 0,
        minStock: item.minStockLevel || 0,
        maxStock: item.maxStockLevel || 0,
        status: item.status || "N/A",
        location: item.location
          ? `${item.location.zone}-${item.location.aisle}-${item.location.rack}-${item.location.bin}`
          : "N/A",
      };
    }) || [];

  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Inventory Summary
      </div>
      {data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No inventory data found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1500px]">
            <Table
              columns={columns}
              data={data}
              renderCell={(key, value) =>
                key === "status" ? (
                  <Badge
                    label={value.toUpperCase()}
                    variant={
                      value === "active"
                        ? "active"
                        : value === "low_stock"
                        ? "warning"
                        : "inactive"
                    }
                    size="md"
                  />
                ) : (
                  value
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
