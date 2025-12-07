"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge, Button, Label, Pagination, Table, Toggle } from "@/components";
import { Eye, Edit2 } from "lucide-react";

const vendorColumns = [
  { key: "vendor", label: "Vendor Name" },
  { key: "type", label: "Vendor Type" },
  { key: "category", label: "Vendory Category" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

const companyNameMap: Record<string, string> = {
  U12345MH2017PTC12345: "PepsiCo India Pvt Ltd",
  U98765DL2015PTC56789: "Coca-Cola Beverages Pvt Ltd",
  L12345DL1956PLC12345: "Nestle India Ltd",
  L12345WB1910PLC000123: "ITC Limited",
  U12345GJ2010PTC23456: "Amul Dairy Pvt Ltd",
  L12345MH1918PLC000122: "Britannia Industries Ltd",
  U12345MH1970PTC45678: "Parle Agro Pvt Ltd",
  U12345DL1985PTC67890: "Haldiram Snacks Pvt Ltd",
  U12345DL1974PTC78901: "Mother Dairy Fruit & Veg Pvt Ltd",
  U12345MH1969PTC89012: "Bisleri International Pvt Ltd",
};

const vendorDataMap: Record<string, any[]> = {
  U12345MH2017PTC12345: [
    {
      vendor: "Lays",
      type: "Snacks",
      category: "Chips / Beverages",
      status: "Active",
      enabled: true,
    },
    {
      vendor: "Kurkure",
      type: "Snacks",
      category: "Namkeen",
      status: "Active",
      enabled: true,
    },
  ],

  U98765DL2015PTC56789: [
    {
      vendor: "Coca-Cola",
      type: "Beverage",
      category: "Drinks",
      status: "Inactive",
      enabled: false,
    },
  ],

  L12345DL1956PLC12345: [
    {
      vendor: "Maggi",
      type: "Food",
      category: "Instant Noodles",
      status: "Under Review",
      enabled: false,
    },
  ],

  L12345WB1910PLC000123: [
    {
      vendor: "Ashirvaad",
      type: "Food",
      category: "Atta & Staples",
      status: "Active",
      enabled: true,
    },
  ],
};

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const ITEMS_PER_PAGE = 5;
  const companyName = companyNameMap[id as string] ?? id;

  const vendors = vendorDataMap[id as string] ?? [];
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return vendors.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, vendors]);

  const toggleStatus = (row: any) => {
    if (row.status === "Under Review") return;

    row.enabled = !row.enabled;
    row.status = row.enabled ? "Active" : "Inactive";
  };

  const getStatusVariant = (status: string) =>
    status === "Active"
      ? "active"
      : status === "Inactive"
      ? "machine"
      : "warning";

  const renderCell = (key: string, value: any, row: any) => {
    switch (key) {
      case "vendor":
        return (
          <span className="text-orange-500 cursor-pointer hover:underline">
            {value}
          </span>
        );

      case "status":
        return <Badge label={value} variant={getStatusVariant(value)} />;

      case "action":
        return (
          <div className="flex items-center gap-4">
            <Eye size={18} className="text-green-600 cursor-pointer" />
            <Edit2 size={18} className="text-purple-600 cursor-pointer" />
          </div>
        );

      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen pt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <Label className="text-2xl font-semibold">{companyName}</Label>
        <Button variant="primary" className="rounded-lg">
          + Add Brand
        </Button>
      </div>

      {/* Vendor Table */}
      <Table
        columns={vendorColumns}
        data={paginatedData}
        renderCell={renderCell}
      />

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
