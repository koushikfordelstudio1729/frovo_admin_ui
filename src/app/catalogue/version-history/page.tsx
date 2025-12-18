"use client";

import { useState, JSX } from "react";
import { Search, Download, ChevronDown } from "lucide-react";
import { Input, Button, Label, Pagination } from "@/components";
import Table, { Column } from "@/components/name&table/Table";

type VersionRow = {
  id: number;
  skuId: string;
  productName: string;
  changedOn: string;
  changedBy: string;
  field: string;
  oldValue: string;
  newValue: string;
};

const initialVersions: VersionRow[] = [
  {
    id: 1,
    skuId: "SKU-001",
    productName: "Amul Toned Milk",
    changedOn: "12-12-2025, 3:45 PM",
    changedBy: "ABC(Admin)",
    field: "Price",
    oldValue: "₹40 /- (old price)",
    newValue: "₹50 /- (revised price)",
  },
  {
    id: 2,
    skuId: "SKU-002",
    productName: "Coca-Cola 1L",
    changedOn: "11-12-2025, 10:15 AM",
    changedBy: "John Doe(Manager)",
    field: "Unit Size",
    oldValue: "500 ml",
    newValue: "1 L",
  },
  {
    id: 3,
    skuId: "SKU-003",
    productName: "Lay's Classic Salted",
    changedOn: "10-12-2025, 6:05 PM",
    changedBy: "XYZ(Admin)",
    field: "Status",
    oldValue: "Inactive",
    newValue: "Active",
  },
  {
    id: 4,
    skuId: "SKU-004",
    productName: "Maggi 2-Minute Noodles",
    changedOn: "09-12-2025, 1:30 PM",
    changedBy: "Jane Smith(Super Admin)",
    field: "Storage Type",
    oldValue: "Ambient",
    newValue: "Refrigerated",
  },
  {
    id: 5,
    skuId: "SKU-005",
    productName: "Fortune Sunflower Oil",
    changedOn: "08-12-2025, 9:00 AM",
    changedBy: "ABC(Admin)",
    field: "MRP",
    oldValue: "₹60 /- incl. tax",
    newValue: "₹55 /- incl. tax",
  },
  {
    id: 6,
    skuId: "SKU-006",
    productName: "Tata Salt",
    changedOn: "07-12-2025, 4:20 PM",
    changedBy: "PQR(Machine Manager)",
    field: "Reorder Level",
    oldValue: "50 units",
    newValue: "80 units",
  },
  {
    id: 7,
    skuId: "SKU-007",
    productName: "Bournvita Health Drink",
    changedOn: "06-12-2025, 11:10 AM",
    changedBy: "LMN(Catalogue Manager)",
    field: "Category",
    oldValue: "Snacks",
    newValue: "Beverages",
  },
];

const columns: Column[] = [
  { key: "skuId", label: "SKU ID" },
  { key: "productName", label: "Product Name" },
  { key: "changedOn", label: "Changed on" },
  { key: "changedBy", label: "Changed By" },
  { key: "field", label: "Changed Fields" },
  { key: "oldValue", label: "Old Values" },
  { key: "newValue", label: "New Value" },
];

const VersionHistoryPage = () => {
  const [search, setSearch] = useState("");
  const [rows] = useState<VersionRow[]>(initialVersions);

  const filtered = rows.filter((row) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      row.changedBy.toLowerCase().includes(q) ||
      row.field.toLowerCase().includes(q);
    return matchesSearch;
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const tableData: Record<string, any>[] = pageData.map((r) => ({
    ...r,
  }));

  type RenderCellFn = (
    key: string,
    value: any,
    row?: Record<string, any>
  ) => JSX.Element;

  const renderCell: RenderCellFn = (_key, value) => value as JSX.Element;

  return (
    <div className="min-h-full pt-8 w-full overflow-x-auto">
      {/* top controls */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div className="flex gap-4 flex-wrap">
          <Input
            label="Search"
            placeholder="Search Categories"
            labelClassName="text-xl"
            variant="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<Search size={16} />}
          />
        </div>

        <Button className="rounded-lg flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
          <Download size={16} />
          Export CSV/PDF
          <ChevronDown size={16} />
        </Button>
      </div>

      {/* table section */}
      <div>
        <Label className="text-xl font-semibold mb-4 block">
          Version Table
        </Label>

        <div className="overflow-x-auto">
          <div className="min-w-[1100px]">
            <Table
              columns={columns}
              data={tableData}
              renderCell={renderCell}
              minTableWidth="1400px"
            />
          </div>
        </div>

        <div className="p-4 flex justify-end border-t">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(next) => {
              if (next < 1 || next > totalPages) return;
              setPage(next);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VersionHistoryPage;
