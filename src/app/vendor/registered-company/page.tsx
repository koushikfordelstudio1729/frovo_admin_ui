"use client";

import { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Input,
  Label,
  Pagination,
  Table,
  Toggle,
  Select,
  ConfirmDialog,
} from "@/components";
import { Eye, Edit2, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCompanies, deleteCompany, updateCompany } from "@/services/vendor";
import { toast } from "react-hot-toast";
import { VendorCompany, CompanyStatus, RiskRating } from "@/types/vendor.types";

interface CompanyRow {
  id: string;
  cin: string;
  company: string;
  gstin: string;
  vendors: string;
  status: CompanyStatus;
  riskRating: RiskRating;
  enabled: boolean;
}

const companyColumns = [
  { key: "company", label: "Company" },
  { key: "cin", label: "CIN" },
  { key: "gstin", label: "GSTIN" },
  { key: "vendors", label: "No. of Brands" },
  { key: "status", label: "Status" },
  { key: "riskRating", label: "Risk Rating" },
  { key: "action", label: "Action" },
];

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "createdAt-desc" },
  { label: "Oldest First", value: "createdAt-asc" },
  { label: "Name (A-Z)", value: "registered_company_name-asc" },
  { label: "Name (Z-A)", value: "registered_company_name-desc" },
];

export default function CompanyList() {
  const router = useRouter();

  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("createdAt-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    cin: string;
    name: string;
  }>({ open: false, cin: "", name: "" });

  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    cin: string;
    enabled: boolean;
    name: string;
  }>({
    open: false,
    cin: "",
    enabled: false,
    name: "",
  });

  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const ITEMS_PER_PAGE = 10;

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const [sortBy, sortOrder] = sortOption.split("-");

      const res = await getCompanies({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search,
        sortBy,
        sortOrder: sortOrder as "asc" | "desc",
      });

      const { data, pagination: paginationData } = res.data;

      let filteredData = data;
      if (statusFilter) {
        filteredData = data.filter(
          (c: VendorCompany) => c.company_status === statusFilter
        );
      }

      const mapped = filteredData.map((c: VendorCompany) => ({
        id: c._id,
        cin: c.cin,
        company: c.registered_company_name,
        gstin: c.gst_number || "--",
        vendors: c.vendorCount ? `${c.vendorCount} Vendors` : "0 Vendors",
        status: c.company_status,
        riskRating: c.risk_rating,
        enabled: c.company_status === "active",
      }));

      setCompanies(mapped);
      setPagination(paginationData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortOption]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCompanies();
  };

  const handleToggleStatus = async (cin: string, currentEnabled: boolean) => {
    try {
      const newStatus: CompanyStatus = currentEnabled ? "inactive" : "active";
      await updateCompany(cin, { company_status: newStatus });

      setCompanies((prev) =>
        prev.map((c) =>
          c.cin === cin
            ? { ...c, status: newStatus, enabled: !currentEnabled }
            : c
        )
      );

      toast.success(
        `Company ${currentEnabled ? "deactivated" : "activated"} successfully`
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update company status"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCompany(deleteDialog.cin);
      toast.success("Company deleted successfully");
      setDeleteDialog({ open: false, cin: "", name: "" });
      fetchCompanies();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete company");
    }
  };

  const handleAddVendor = (company: CompanyRow) => {
    const params = new URLSearchParams({
      cin: company.cin,
      companyName: company.company,
      gst: company.gstin !== "--" ? company.gstin : "",
    });
    router.push(`/vendor/vendor-onboard?tab=add&${params.toString()}`);
  };

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    const company = row as CompanyRow;

    switch (key) {
      case "company":
        return (
          <span
            className="text-orange-500 font-medium cursor-pointer hover:underline"
            onClick={() =>
              router.push(`/vendor/registered-company/company/${company.cin}`)
            }
          >
            {value}
          </span>
        );

      case "status":
        const statusVariant =
          value === "active"
            ? "active"
            : value === "inactive"
            ? "rejected"
            : "warning";

        const label =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return <Badge label={label} showDot variant={statusVariant} />;

      case "riskRating":
        const riskVariant =
          value === "low"
            ? "active"
            : value === "medium"
            ? "warning"
            : "rejected";

        const riskLabel =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return <Badge label={riskLabel} variant={riskVariant} />;

      case "action":
        return (
          <div className="flex items-center gap-3">
            <button title="Add Vendor" onClick={() => handleAddVendor(company)}>
              <UserPlus
                size={18}
                className="text-blue-600 cursor-pointer hover:text-blue-700"
              />
            </button>
            <button
              title="View Details"
              onClick={() =>
                router.push(`/vendor/registered-company/company/${company.cin}`)
              }
            >
              <Eye
                size={18}
                className="text-green-600 cursor-pointer hover:text-green-700"
              />
            </button>
            <button
              title="Edit Company"
              onClick={() =>
                router.push(`/vendor/registered-company/edit/${company.cin}`)
              }
            >
              <Edit2
                size={18}
                className="text-purple-600 cursor-pointer hover:text-purple-700"
              />
            </button>
            <button
              title="Delete Company"
              onClick={() =>
                setDeleteDialog({
                  open: true,
                  cin: company.cin,
                  name: company.company,
                })
              }
            >
              <Trash2
                size={18}
                className="text-red-600 cursor-pointer hover:text-red-700"
              />
            </button>
            <Toggle
              enabled={company.enabled}
              onChange={() =>
                setStatusDialog({
                  open: true,
                  cin: company.cin,
                  enabled: company.enabled,
                  name: company.company,
                })
              }
            />
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
          Loading Companies...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Label className="text-2xl font-semibold">Company List</Label>
          <p className="text-gray-500 text-sm mt-1">
            Total {pagination.totalCount} companies registered
          </p>
        </div>
        <Button
          variant="primary"
          className="rounded-lg"
          onClick={() => router.push("/vendor/registered-company/add-company")}
        >
          + Add Company
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="flex gap-2">
          <Input
            label="Search Company"
            placeholder="Search by name or CIN"
            value={search}
            inputClassName="py-3 px-4"
            labelClassName="text-xl"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            variant="search"
          />
          <Button
            variant="primary"
            className="mt-auto rounded-lg"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>

        <Select
          label="Status Filter"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          placeholder="All Status"
          selectClassName="py-3 px-4"
        />

        <Select
          label="Sort By"
          options={SORT_OPTIONS}
          value={sortOption}
          onChange={setSortOption}
          selectClassName="py-3 px-4"
        />
      </div>

      {/* Table */}
      {companies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No companies found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div className="min-w-[1500px]">
              <Table
                columns={companyColumns}
                data={companies}
                renderCell={renderCell}
              />
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        title="Delete Company"
        message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, cin: "", name: "" })}
      />
      <ConfirmDialog
        isOpen={statusDialog.open}
        title={statusDialog.enabled ? "Deactivate Company" : "Activate Company"}
        message={
          <>
            Are you sure you want to{" "}
            <span className="font-semibold">
              {statusDialog.enabled ? "deactivate" : "activate"}
            </span>{" "}
            "{statusDialog.name}"?
          </>
        }
        confirmText={statusDialog.enabled ? "Deactivate" : "Activate"}
        cancelText="Cancel"
        confirmVariant={statusDialog.enabled ? "danger" : "primary"}
        onConfirm={async () => {
          await handleToggleStatus(statusDialog.cin, statusDialog.enabled);
          setStatusDialog({ open: false, cin: "", enabled: false, name: "" });
        }}
        onCancel={() =>
          setStatusDialog({ open: false, cin: "", enabled: false, name: "" })
        }
      />
    </div>
  );
}
