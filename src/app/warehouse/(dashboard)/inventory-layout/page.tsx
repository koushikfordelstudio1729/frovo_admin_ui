"use client";
import { Button, Label, Table, Badge, Pagination } from "@/components";
import { FileArchiveIcon, ArrowDownToLine } from "lucide-react";
import { useInventoryLayout } from "@/hooks/warehouse/useInventoryLayout";
import AgeRangeSelect from "@/components/common/age-range-select/AgeRangeSelect";
import { useState } from "react";
import { useRouter } from "next/navigation";

const batchColumns = [
  { key: "batchId", label: "Batch ID" },
  { key: "sku", label: "SKU" },
  { key: "quantity", label: "Quantity" },
  { key: "age", label: "Age" },
  { key: "expiry", label: "Expiry" },
  { key: "actions", label: "Actions" },
];

const quarantineColumns = [
  { key: "sku", label: "SKU" },
  { key: "qty", label: "Qty" },
  { key: "expiry", label: "Expiry" },
];

export default function InventoryLayoutPage() {
  const router = useRouter();
  const [ageRange, setAgeRange] = useState(">60");
  const {
    rows,
    currentPage,
    totalPages,
    handlePageChange,
    filters,
    handleFilterChange,
    expirySoon,
    quarantineData,
  } = useInventoryLayout();

  const handleArchive = (row: any) => {
    console.log("Archive:", row);
  };

  const renderBatchCell = (key: string, value: any, row: any) => {
    if (key === "age") {
      if (value <= 15)
        return <Badge label={`${value} Days`} variant="rejected" size="md" />;
      if (value > 15 && value <= 45)
        return <Badge label={`${value} Days`} variant="warning" size="md" />;
      return <Badge label={`${value} Days`} variant="approved" size="md" />;
    }

    if (key === "actions") {
      return (
        <div className="flex gap-2">
          <Button
            className="px-4 py-2 rounded-3xl"
            size="sm"
            variant="edit"
            onClick={() =>
              router.push(
                `/warehouse/inventory-layout/batch/${row.batchId}/edit`
              )
            }
          >
            Edit
          </Button>
          <Button
            className="px-4 py-2 rounded-3xl"
            size="sm"
            variant="secondary"
            onClick={() => handleArchive(row)}
          >
            Archive
          </Button>
        </div>
      );
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Label className="text-xl font-semibold">Stock Ageing</Label>
        <div className="flex gap-4 items-center mt-2">
          <Button
            className="rounded-lg"
            variant="outline"
            size="md"
            onClick={() => router.push("/warehouse/inventory-layout/archive")}
          >
            <FileArchiveIcon size={18} />
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="rounded-lg whitespace-nowrap"
          >
            Export Layout
          </Button>

          <Button
            variant="primary"
            size="md"
            className="rounded-lg whitespace-nowrap"
          >
            <ArrowDownToLine size={18} className="mr-2" />
            CSV Upload
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Label className="text-sm font-medium">Age Range</Label>
        <AgeRangeSelect
          value={ageRange}
          onChange={setAgeRange}
          className="w-48"
        />
      </div>

      <Table columns={batchColumns} data={rows} renderCell={renderBatchCell} />

      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="w-lg flex gap-6 mt-10">
        <div className="bg-white rounded-xl p-4 flex-1 mb-6">
          <Label className="text-lg font-semibold">Expiry Alerts</Label>
          <div className="bg-[#FDAEAE] p-4 my-2 mb-4 rounded-lg flex flex-col gap-2">
            {expirySoon ? (
              <>
                <Label className="font-semibold text-red-600">
                  Expiry Soon
                </Label>
                <Label className="font-semibold text-red-600">
                  <span className="text-black">{expirySoon.sku} </span> expires
                  in 10 days
                </Label>
              </>
            ) : (
              <Label className="font-semibold text-red-600">
                No expiry soon alerts.
              </Label>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-lg font-semibold">Quarantine Table</Label>
            <Table columns={quarantineColumns} data={quarantineData} />
          </div>
        </div>
      </div>
    </div>
  );
}
