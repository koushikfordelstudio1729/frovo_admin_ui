import Table from "@/components/name&table/Table";
import { Badge } from "../common";

const columns = [
  { key: "skuId", label: "SKU ID" },
  { key: "productName", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "currentQty", label: "Current Qty" },
  { key: "threshold", label: "Threshold" },
  { key: "stockStatus", label: "Stock Status" },
  { key: "lastUpdated", label: "Last Updated" },
];

const data = [
  {
    skuId: "SNACKS-12",
    productName: "Lays Onion",
    category: "Snacks",
    currentQty: 466,
    threshold: "High",
    stockStatus: "Active",
    lastUpdated: "20-10-2025, 11:06AM",
  },
  {
    skuId: "DRINKS-03",
    productName: "Diet Coke",
    category: "Beverages",
    currentQty: 122,
    threshold: "Low",
    stockStatus: "Inactive",
    lastUpdated: "20-10-2025, 11:09AM",
  },
  {
    skuId: "CANDY-29",
    productName: "Mentos Mint",
    category: "Candy",
    currentQty: 380,
    threshold: "High",
    stockStatus: "Active",
    lastUpdated: "21-10-2025, 09:28AM",
  },
  {
    skuId: "SNACKS-88",
    productName: "Uncle Chips",
    category: "Snacks",
    currentQty: 90,
    threshold: "Critical",
    stockStatus: "Inactive",
    lastUpdated: "18-10-2025, 06:11PM",
  },
  {
    skuId: "JUICE-17",
    productName: "Tropicana Orange",
    category: "Beverages",
    currentQty: 311,
    threshold: "High",
    stockStatus: "Active",
    lastUpdated: "19-10-2025, 10:01AM",
  },
  {
    skuId: "CHOC-034",
    productName: "5 Star",
    category: "Chocolate",
    currentQty: 157,
    threshold: "Medium",
    stockStatus: "Active",
    lastUpdated: "20-10-2025, 07:55AM",
  },
];

export default function InventorySummaryTable() {
  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Inventory Summary Table
      </div>
      <Table
        columns={columns}
        data={data}
        renderCell={(key, value) =>
          key === "stockStatus" ? (
            <Badge
              label={value}
              variant={value === "Active" ? "active" : "warning"}
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
