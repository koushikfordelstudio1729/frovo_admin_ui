"use client";

import { useState, useMemo } from "react";
import {
  Badge,
  Button,
  Input,
  Label,
  Pagination,
  Table,
  Toggle,
  Select,
} from "@/components";
import { Eye, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

const companyColumns = [
  { key: "company", label: "Company" },
  { key: "cin", label: "CIN / Registration No" },
  { key: "gstin", label: "GSTIN" },
  { key: "vendors", label: "No. of Vendors" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Under Review", value: "Under Review" },
];

const initialData = [
  {
    company: "PepsiCo India Pvt Ltd",
    cin: "U12345MH2017PTC12345",
    gstin: "27ABCDE1234F1Z2",
    vendors: "3 Vendors",
    status: "Active",
    enabled: true,
  },
  {
    company: "Coca-Cola Beverages Pvt Ltd",
    cin: "U98765DL2015PTC56789",
    gstin: "07AAACC2345L1Z5",
    vendors: "5 Vendors",
    status: "Inactive",
    enabled: false,
  },
  {
    company: "Nestle India Ltd",
    cin: "L12345DL1956PLC12345",
    gstin: "06AACCN1234K1Z7",
    vendors: "4 Vendors",
    status: "Under Review",
    enabled: false,
  },
  {
    company: "ITC Limited",
    cin: "L12345WB1910PLC000123",
    gstin: "19AAACI1234J1Z9",
    vendors: "6 Vendors",
    status: "Active",
    enabled: true,
  },
  {
    company: "Amul Dairy Pvt Ltd",
    cin: "U12345GJ2010PTC23456",
    gstin: "24AAACA4567B1Z3",
    vendors: "2 Vendors",
    status: "Active",
    enabled: true,
  },
  {
    company: "Britannia Industries Ltd",
    cin: "L12345MH1918PLC000122",
    gstin: "27AAACB7890C1Z6",
    vendors: "7 Vendors",
    status: "Inactive",
    enabled: false,
  },
  {
    company: "Parle Agro Pvt Ltd",
    cin: "U12345MH1970PTC45678",
    gstin: "27AAPCP1234Q1Z8",
    vendors: "4 Vendors",
    status: "Active",
    enabled: true,
  },
  {
    company: "Haldiram Snacks Pvt Ltd",
    cin: "U12345DL1985PTC67890",
    gstin: "07AAACH5678D1Z2",
    vendors: "3 Vendors",
    status: "Under Review",
    enabled: false,
  },
  {
    company: "Mother Dairy Fruit & Veg Pvt Ltd",
    cin: "U12345DL1974PTC78901",
    gstin: "07AAACM5678E1Z4",
    vendors: "5 Vendors",
    status: "Active",
    enabled: true,
  },
  {
    company: "Bisleri International Pvt Ltd",
    cin: "U12345MH1969PTC89012",
    gstin: "27AABCB8901F1Z5",
    vendors: "2 Vendors",
    status: "Inactive",
    enabled: false,
  },
];

export default function CompanyList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState(initialData);
  const router = useRouter();

  const ITEMS_PER_PAGE = 8;

  const filteredData = useMemo(() => {
    if (!statusFilter) return data;
    return data.filter((item) => item.status === statusFilter);
  }, [statusFilter, data]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredData]);

  const toggleStatus = (row: any) => {
    if (row.status === "Under Review") return;

    setData((prev) =>
      prev.map((item) =>
        item === row
          ? {
              ...item,
              status: row.status === "Active" ? "Inactive" : "Active",
              enabled: !row.enabled,
            }
          : item
      )
    );
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "active";
      case "Inactive":
        return "machine";
      case "Under Review":
        return "warning";
      default:
        return "custom";
    }
  };

  const renderCell = (key: string, value: any, row: any) => {
    switch (key) {
      case "company":
        return (
          <span
            className="text-orange-500 font-medium cursor-pointer hover:underline"
            onClick={() =>
              router.push(`/vendor/registered-company/company/${row.cin}`)
            }
          >
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
            <Toggle
              enabled={row.enabled}
              disabled={row.status === "Under Review"}
              onChange={() => toggleStatus(row)}
            />
          </div>
        );

      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen pt-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Label className="text-2xl font-semibold">Company List Table</Label>
        <Button
          variant="primary"
          className="rounded-lg"
          onClick={() => router.push("/vendor/registered-company/add-company")}
        >
          + Add Company
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-6 mb-6 w-[70%]">
        <Input
          label="Search"
          placeholder="Search Company"
          labelClassName="text-xl"
          inputClassName="py-3"
          variant="search"
        />

        <Select
          label="Status"
          options={STATUS_OPTIONS}
          placeholder="Select Status"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          selectClassName="py-3 px-4"
        />
      </div>

      {/* Table */}
      <Table
        columns={companyColumns}
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
