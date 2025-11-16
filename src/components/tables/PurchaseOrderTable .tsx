import Table from "@/components/name&table/Table";
import { Badge } from "../common";

const columns = [
  { key: "poId", label: "PO ID" },
  { key: "vendor", label: "Vendor" },
  { key: "sku", label: "SKU" },
  { key: "orderedQty", label: "Ordered Qty" },
  { key: "approvedQty", label: "Approved Qty" },
  { key: "poValue", label: "PO Value" },
  { key: "expectedDelivery", label: "Expected Delivery" },
  { key: "poStatus", label: "PO Status" },
];

const data = [
  {
    poId: "#103",
    vendor: "Vendor_Name",
    sku: "SNACKS-133",
    orderedQty: 466,
    approvedQty: 460,
    poValue: 450,
    expectedDelivery: "20-10-2025",
    poStatus: "Active",
  },
  {
    poId: "#104",
    vendor: "ACME Corp",
    sku: "DRINKS-208",
    orderedQty: 320,
    approvedQty: 320,
    poValue: 290,
    expectedDelivery: "21-10-2025",
    poStatus: "Inactive",
  },
  {
    poId: "#105",
    vendor: "Fleetgo Logistics",
    sku: "CANDY-90",
    orderedQty: 220,
    approvedQty: 198,
    poValue: 175,
    expectedDelivery: "22-10-2025",
    poStatus: "Active",
  },
  {
    poId: "#106",
    vendor: "Snack Express",
    sku: "CHIPS-300",
    orderedQty: 111,
    approvedQty: 100,
    poValue: 105,
    expectedDelivery: "23-10-2025",
    poStatus: "Inactive",
  },
  {
    poId: "#107",
    vendor: "MegaVends",
    sku: "JUICE-45",
    orderedQty: 145,
    approvedQty: 142,
    poValue: 120,
    expectedDelivery: "20-10-2025",
    poStatus: "Active",
  },
  {
    poId: "#108",
    vendor: "Vendor_Name",
    sku: "SNACKS-100",
    orderedQty: 70,
    approvedQty: 70,
    poValue: 50,
    expectedDelivery: "19-10-2025",
    poStatus: "Inactive",
  },
];

export default function PurchaseOrderTable() {
  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Purchase Orders
      </div>
      <Table
        columns={columns}
        data={data}
        renderCell={(key, value) =>
          key === "poStatus" ? (
            <Badge
              label={value}
              variant={value === "Active" ? "active" : "inactive"}
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
