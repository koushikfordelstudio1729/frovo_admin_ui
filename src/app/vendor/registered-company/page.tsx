"use client";

import { useState, useEffect, useMemo } from "react";
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
import { getCompanies } from "@/services/vendor";
import { toast } from "react-hot-toast";

interface CompanyRow {
  id: string;
  company: string;
  cin: string;
  gstin: string;
  vendors: string;
  status: string;
  enabled: boolean;
}

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

export default function CompanyList() {
  const router = useRouter();

  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await getCompanies(currentPage, ITEMS_PER_PAGE);
        const { data, pagination } = res.data;

        const mapped = data.map((c: any) => ({
          id: c._id,
          company: c.registered_company_name,
          cin: c.company_registration_number,
          gstin: c.gstin ?? "--",
          vendors: c.vendors_count ? `${c.vendors_count} Vendors` : "0 Vendors",
          status: "Active",
          enabled: true,
        }));

        setCompanies(mapped);
        setPagination({
          totalPages: pagination.totalPages,
          totalCount: pagination.totalCount,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage]);

  const filteredData = useMemo(() => {
    return companies.filter((item) => {
      const byStatus = statusFilter ? item.status === statusFilter : true;
      const bySearch = search
        ? item.company.toLowerCase().includes(search.toLowerCase())
        : true;
      return byStatus && bySearch;
    });
  }, [companies, search, statusFilter]);

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    const company = row as CompanyRow; 

    switch (key) {
      case "company":
        return (
          <span
            className="text-orange-500 font-medium cursor-pointer hover:underline"
            onClick={() =>
              router.push(`/vendor/registered-company/company/${company.id}`)
            }
          >
            {value}
          </span>
        );

      case "status":
        return <Badge label={value} variant="active" />;

      case "action":
        return (
          <div className="flex items-center gap-4">
            <Eye
              size={18}
              className="text-green-600 cursor-pointer"
              onClick={() =>
                router.push(`/vendor/registered-company/company/${company.id}`)
              }
            />
            <Edit2
              size={18}
              className="text-purple-600 cursor-pointer"
              onClick={() =>
                router.push(`/vendor/registered-company/edit/${company.id}`)
              }
            />
            <Toggle enabled={company.enabled} onChange={() => {}} />
          </div>
        );

      default:
        return value;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading Register Company...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Label className="text-2xl font-semibold">Company List</Label>
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
          label="Search Company"
          placeholder="Search by name"
          value={search}
          inputClassName="py-3 px-4"
          labelClassName="text-xl"
          onChange={(e) => setSearch(e.target.value)}
          variant="search"
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="Select Status"
          selectClassName="py-3 px-4"
        />
      </div>

      {/* Table */}
      <Table
        columns={companyColumns}
        data={filteredData}
        renderCell={renderCell}
      />

      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
