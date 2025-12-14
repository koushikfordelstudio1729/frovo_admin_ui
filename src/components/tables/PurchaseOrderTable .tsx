import Table from "@/components/name&table/Table";
import { Badge } from "../common";

const columns = [
  { key: "poNumber", label: "PO Number" },
  { key: "vendor", label: "Vendor" },
  { key: "totalItems", label: "Total Items" },
  { key: "totalQty", label: "Total Qty" },
  { key: "poValue", label: "PO Value" },
  { key: "poRaisedDate", label: "PO Raised Date" },
  { key: "poStatus", label: "PO Status" },
];

interface PurchaseOrderTableProps {
  reportData?: any;
}

export default function PurchaseOrderTable({ reportData }: PurchaseOrderTableProps) {
  // Transform report data to table format
  const data = reportData?.purchaseOrders?.map((po: any) => {
    const totalQty = po.po_line_items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
    const poValue = po.po_line_items?.reduce((sum: number, item: any) => sum + (item.quantity * item.unit_price), 0) || 0;

    return {
      poNumber: po.po_number || 'N/A',
      vendor: po.vendor?.vendor_name || po.vendor_details?.vendor_name || 'N/A',
      totalItems: po.po_line_items?.length || 0,
      totalQty: totalQty,
      poValue: `₹${poValue.toLocaleString()}`,
      poRaisedDate: po.po_raised_date ? new Date(po.po_raised_date).toLocaleDateString() : 'N/A',
      poStatus: po.po_status || 'N/A',
    };
  }) || [];

  return (
    <div className="mt-8">
      <div className="text-lg text-gray-700 font-semibold mb-2">
        Purchase Orders
      </div>
      {data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No purchase orders found</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={data}
          renderCell={(key, value) =>
            key === "poStatus" ? (
              <Badge
                label={value.toUpperCase()}
                variant={
                  value === "approved" || value === "received"
                    ? "active"
                    : value === "pending"
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
      )}
    </div>
  );
}
