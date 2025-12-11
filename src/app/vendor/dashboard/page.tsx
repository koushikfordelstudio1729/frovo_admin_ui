"use client";

import {
  Badge,
  Button,
  Select,
  StatCard,
  Table,
  Pagination,
  Input,
} from "@/components";
import { ClipboardCheck, Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVendorDashboard } from "@/services/vendor";
import { toast } from "react-hot-toast";

const statusOptions = [
  { label: "Verified", value: "verified" },
  { label: "Pending", value: "pending" },
  { label: "Rejected", value: "rejected" },
];

const riskRatingOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const vendorColumns = [
  { key: "vendorName", label: "Vendor Name" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "riskRating", label: "Risk Rating" },
  { key: "contractExpiry", label: "Contract Expiry" },
  { key: "action", label: "Action" },
];

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [risk, setRisk] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    rejected: 0,
  });

  const [vendors, setVendors] = useState<any[]>([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getVendorDashboard();
        const data = res?.data?.data;

        setStats({
          total: data.total_vendors,
          pending: data.pending_approvals,
          active: data.active_vendors,
          rejected: data.rejected_vendors,
        });

        setVendors(
          (data.vendors || []).map((v: any) => ({
            id: v._id,
            vendorName: v.vendor_name,
            category: v.vendor_category,
            status: v.verification_status,
            riskRating: v.risk_rating,
            contractExpiry: new Date(
              v.contract_expiry_date
            ).toLocaleDateString(),
          }))
        );
      } catch (err) {
        toast.error("Unable to fetch dashboard details");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Reset pagination when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [status, risk, search]);

  // Filter + Search vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const statusMatch = status ? v.status === status : true;
      const riskMatch = risk ? v.riskRating === risk : true;
      const searchMatch = search
        ? v.vendorName.toLowerCase().includes(search.toLowerCase())
        : true;

      return statusMatch && riskMatch && searchMatch;
    });
  }, [vendors, status, risk, search]);

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredVendors.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredVendors, currentPage]);

  // Cell rendering
  const renderCell = (key: string, value: any, row?: Record<string, any>) => {
    if (key === "status") {
      const map: Record<string, "approved" | "warning" | "rejected"> = {
        verified: "approved",
        pending: "warning",
        rejected: "rejected",
      };
      return (
        <Badge
          label={value.charAt(0).toUpperCase() + value.slice(1)}
          variant={map[value] || "warning"}
        />
      );
    }

    if (key === "action") {
      if (!row) return null;

      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
            onClick={() => router.push(`/vendor/details/${row.id}`)}
          >
            <Eye className="text-green-500 w-5 h-5" />
          </Button>

          <Button
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
            onClick={() => router.push(`/vendor/dashboard/edit/${row.id}`)}
          >
            <Pencil className="text-blue-500 w-5 h-5" />
          </Button>

          <Button
            size="sm"
            className="bg-transparent shadow-none hover:bg-gray-100"
            onClick={() => console.log("Delete:", row.id)}
          >
            <Trash2 className="text-red-500 w-5 h-5" />
          </Button>
        </div>
      );
    }

    return value;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Vendor"
          count={stats.total}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Pending Approval"
          count={stats.pending}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Active Vendors"
          count={stats.active}
          icon={ClipboardCheck}
        />
        <StatCard
          title="Rejected Vendors"
          count={stats.rejected}
          icon={ClipboardCheck}
        />
      </div>

      {/* Filters */}
      <div className="flex items-end w-4xl mt-6 gap-6">
        <Input
          label="Search"
          placeholder="Search Company"
          inputClassName="py-2"
          labelClassName="text-xl"
          variant="search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Status"
          value={status}
          onChange={setStatus}
          options={statusOptions}
          selectClassName="py-2 px-4"
        />
        <Select
          label="Risk Rating"
          value={risk}
          onChange={setRisk}
          options={riskRatingOptions}
          selectClassName="py-2 px-4"
        />
      </div>

      {/* Table */}
      <div className="mt-6">
        <Table
          columns={vendorColumns}
          data={paginatedData}
          renderCell={renderCell}
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Dashboard;
