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
import { Eye, Edit2, Trash2, Upload, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getVendors, deleteVendor, updateVendor } from "@/services/vendor";
import { toast } from "react-hot-toast";
import {
  Vendor,
  VendorStatus,
  RiskRating,
  VerificationStatus,
  VendorCategory,
} from "@/types/vendor-data.types";

interface VendorRow {
  id: string;
  vendorId: string;
  vendorName: string;
  billingName: string;
  category: VendorCategory;
  contact: string;
  email: string;
  status: VendorStatus;
  verificationStatus: VerificationStatus;
  riskRating: RiskRating;
  enabled: boolean;
}

const vendorColumns = [
  { key: "vendorId", label: "Vendor ID" },
  { key: "vendorName", label: "Vendor Name" },
  { key: "category", label: "Category" },
  { key: "contact", label: "Contact" },
  { key: "email", label: "Email" },
  { key: "verificationStatus", label: "Verification" },
  { key: "riskRating", label: "Risk Rating" },
  { key: "action", label: "Action" },
];

const VERIFICATION_STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "In Review", value: "in-review" },
  { label: "Failed", value: "failed" },
  { label: "Rejected", value: "rejected" },
  { label: "Approved", value: "approved" },
];

const RISK_RATING_OPTIONS = [
  { label: "All", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const CATEGORY_OPTIONS = [
  { label: "All", value: "" },
  { label: "Consumables", value: "consumables" },
  { label: "Raw Materials", value: "raw_materials" },
  { label: "Packaging", value: "packaging" },
  { label: "Services", value: "services" },
];

export default function VendorList() {
  const router = useRouter();

  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [verificationFilter, setVerificationFilter] = useState("");
  const [riskRatingFilter, setRiskRatingFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });

  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    page: 1,
  });

  const ITEMS_PER_PAGE = 10;

  const fetchVendors = async () => {
    try {
      setLoading(true);

      const res = await getVendors({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search,
        verification_status: verificationFilter as any,
        risk_rating: riskRatingFilter as any,
        vendor_category: categoryFilter as any,
      });

      const { vendors: vendorData, total, pages } = res.data.data;

      const mapped = vendorData.map((v: Vendor) => ({
        id: v._id,
        vendorId: v.vendor_id,
        vendorName: v.vendor_name,
        billingName: v.vendor_billing_name,
        category: v.vendor_category,
        contact: v.contact_phone,
        email: v.vendor_email,
        status: v.vendor_status,
        verificationStatus: v.verification_status,
        riskRating: v.risk_rating,
        enabled: v.vendor_status === "active",
      }));

      setVendors(mapped);
      setPagination({
        totalPages: pages,
        totalCount: total,
        page: res.data.data.page,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, verificationFilter, riskRatingFilter, categoryFilter]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchVendors();
  };

  const handleToggleStatus = async (id: string, currentEnabled: boolean) => {
    try {
      const newStatus: VendorStatus = currentEnabled ? "inactive" : "active";
      await updateVendor(id, { vendor_status: newStatus });

      setVendors((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: newStatus, enabled: !currentEnabled } : v
        )
      );

      toast.success(
        `Vendor ${currentEnabled ? "deactivated" : "activated"} successfully`
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update vendor status"
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVendor(deleteDialog.id);
      toast.success("Vendor deleted successfully");
      setDeleteDialog({ open: false, id: "", name: "" });
      fetchVendors();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete vendor"
      );
    }
  };

  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    const vendor = row as VendorRow;

    switch (key) {
      case "vendorName":
        return (
          <span
            className="text-orange-500 font-medium cursor-pointer hover:underline"
            onClick={() =>
              router.push(`/vendor/vendor-management/view/${vendor.id}`)
            }
          >
            {value}
          </span>
        );

      case "category":
        if (!value) return <span className="text-sm text-gray-400">-</span>;
        const categoryLabel =
          value === "raw_materials"
            ? "Raw Materials"
            : value.charAt(0).toUpperCase() + value.slice(1);
        return (
          <Badge
            label={categoryLabel}
            variant={value === "consumables" ? "active" : "warning"}
          />
        );

      case "verificationStatus":
        if (!value) return <Badge label="PENDING" variant="warning" />;
        const verifyVariant =
          value === "verified" || value === "approved"
            ? "active"
            : value === "pending" || value === "in-review"
            ? "warning"
            : "rejected";
        return <Badge label={value.toUpperCase()} variant={verifyVariant} />;

      case "riskRating":
        if (!value) return <Badge label="MEDIUM" variant="warning" />;
        const riskVariant =
          value === "low" ? "active" : value === "medium" ? "warning" : "rejected";
        return <Badge label={value.toUpperCase()} variant={riskVariant} />;

      case "action":
        return (
          <div className="flex items-center gap-3">
            <Eye
              size={18}
              className="text-green-600 cursor-pointer hover:text-green-700"
              onClick={() =>
                router.push(`/vendor/vendor-management/view/${vendor.id}`)
              }
              title="View Details"
            />
            <Edit2
              size={18}
              className="text-purple-600 cursor-pointer hover:text-purple-700"
              onClick={() =>
                router.push(`/vendor/vendor-management/edit/${vendor.id}`)
              }
              title="Edit Vendor"
            />
            <Trash2
              size={18}
              className="text-red-600 cursor-pointer hover:text-red-700"
              onClick={() =>
                setDeleteDialog({
                  open: true,
                  id: vendor.id,
                  name: vendor.vendorName,
                })
              }
              title="Delete Vendor"
            />
            <Toggle
              enabled={vendor.enabled}
              onChange={() => handleToggleStatus(vendor.id, vendor.enabled)}
            />
          </div>
        );

      default:
        return value || "-";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Loading Vendors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 px-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Label className="text-2xl font-semibold">Vendor Management</Label>
          <p className="text-gray-500 text-sm mt-1">
            Total {pagination.totalCount} vendors registered
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="rounded-lg flex items-center gap-2"
            onClick={() => router.push("/vendor/vendor-management/bulk-verify")}
          >
            <CheckCircle size={18} />
            Bulk Verify
          </Button>
          <Button
            variant="secondary"
            className="rounded-lg flex items-center gap-2"
            onClick={() => router.push("/vendor/vendor-management/bulk-upload")}
          >
            <Upload size={18} />
            Bulk Upload
          </Button>
          <Button
            variant="primary"
            className="rounded-lg"
            onClick={() => router.push("/vendor/vendor-management/add")}
          >
            + Add Vendor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="flex gap-2">
          <Input
            label="Search Vendor"
            placeholder="Search by name or vendor ID"
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
          label="Verification Status"
          options={VERIFICATION_STATUS_OPTIONS}
          value={verificationFilter}
          onChange={(val) => {
            setVerificationFilter(val);
            setCurrentPage(1);
          }}
          placeholder="All Status"
          selectClassName="py-3 px-4"
        />

        <Select
          label="Risk Rating"
          options={RISK_RATING_OPTIONS}
          value={riskRatingFilter}
          onChange={(val) => {
            setRiskRatingFilter(val);
            setCurrentPage(1);
          }}
          placeholder="All Ratings"
          selectClassName="py-3 px-4"
        />

        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          value={categoryFilter}
          onChange={(val) => {
            setCategoryFilter(val);
            setCurrentPage(1);
          }}
          placeholder="All Categories"
          selectClassName="py-3 px-4"
        />
      </div>

      {/* Table */}
      {vendors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <p className="text-gray-500 text-lg">No vendors found</p>
        </div>
      ) : (
        <>
          <Table columns={vendorColumns} data={vendors} renderCell={renderCell} />

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-600">
              Showing page {pagination.page} of {pagination.totalPages}
            </p>
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
        title="Delete Vendor"
        message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: "", name: "" })}
      />
    </div>
  );
}
