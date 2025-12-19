"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Badge, Label, StatCard, BackHeader, Button } from "@/components";
import { getUserProfile } from "@/services/vendor";
import { authAPI } from "@/services/authAPI";
import { storageUtils } from "@/utils";
import { toast } from "react-hot-toast";
import { Vendor } from "@/types/vendor-data.types";
import {
  User,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  LogOut,
} from "lucide-react";

interface UserProfileData {
  user_info: {
    user_id: string;
    total_vendors_created: number;
  };
  statistics: {
    total_vendors: number;
    pending_vendors: number;
    verified_vendors: number;
    rejected_vendors: number;
    failed_vendors: number;
  };
  vendors: Vendor[];
}

export default function VendorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setProfileData(res.data.data);
    } catch (error: any) {
      console.error("Profile fetch error:", error);

      if (error.message === "Network Error") {
        toast.error(
          "Cannot connect to server. Please check if the backend is running on port 3000."
        );
      } else if (error.response?.status === 404) {
        toast.error(
          "Profile endpoint not found. Please verify the backend has implemented GET /api/vendors/profile/me"
        );
      } else {
        toast.error(
          error?.response?.data?.message || "Failed to load profile"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
      case "approved":
        return "active";
      case "pending":
      case "in-review":
        return "warning";
      case "rejected":
      case "failed":
        return "rejected";
      default:
        return "warning";
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low":
        return "active";
      case "medium":
        return "warning";
      case "high":
        return "rejected";
      default:
        return "warning";
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    setShowLogoutModal(false);
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout API error:", err);
      // even if API fails, logout locally
    } finally {
      storageUtils.clearAuthData(); // remove token / user from localstorage
      toast.success("Logged out successfully");
      router.push("/login");
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Failed to load profile data
        </p>
      </div>
    );
  }

  const { user_info, statistics, vendors } = profileData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <BackHeader title="My Profile" />
        <Button
          variant="secondary"
          className="rounded-lg flex items-center gap-2"
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          isLoading={isLoggingOut}
        >
          <LogOut size={20} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 mb-6 shadow-lg text-white">
        <div className="flex items-center gap-6">
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full">
            <User size={48} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-orange-100 mt-2 text-lg">
              User ID: {user_info.user_id}
            </p>
            <p className="text-orange-50 mt-1">
              You've created{" "}
              <span className="font-bold text-2xl">
                {user_info.total_vendors_created}
              </span>{" "}
              vendors
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-6">
        <Label className="text-xl font-semibold mb-4">
          Vendor Statistics
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          <StatCard
            title="Total Vendors"
            count={statistics.total_vendors.toString()}
            icon={TrendingUp}
          />
          <StatCard
            title="Verified"
            count={statistics.verified_vendors.toString()}
            icon={CheckCircle}
          />
          <StatCard
            title="Pending"
            count={statistics.pending_vendors.toString()}
            icon={Clock}
          />
          <StatCard
            title="Rejected"
            count={statistics.rejected_vendors.toString()}
            icon={XCircle}
          />
          <StatCard
            title="Failed"
            count={statistics.failed_vendors.toString()}
            icon={AlertCircle}
          />
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <Label className="text-xl font-semibold mb-4">Status Overview</Label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
            <p className="text-3xl font-bold text-green-600">
              {statistics.verified_vendors}
            </p>
            <p className="text-sm text-gray-600 mt-2">Verified</p>
            <p className="text-xs text-gray-500 mt-1">
              {statistics.total_vendors > 0
                ? Math.round(
                    (statistics.verified_vendors / statistics.total_vendors) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <p className="text-3xl font-bold text-yellow-600">
              {statistics.pending_vendors}
            </p>
            <p className="text-sm text-gray-600 mt-2">Pending</p>
            <p className="text-xs text-gray-500 mt-1">
              {statistics.total_vendors > 0
                ? Math.round(
                    (statistics.pending_vendors / statistics.total_vendors) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <p className="text-3xl font-bold text-red-600">
              {statistics.rejected_vendors}
            </p>
            <p className="text-sm text-gray-600 mt-2">Rejected</p>
            <p className="text-xs text-gray-500 mt-1">
              {statistics.total_vendors > 0
                ? Math.round(
                    (statistics.rejected_vendors / statistics.total_vendors) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <p className="text-3xl font-bold text-gray-600">
              {statistics.failed_vendors}
            </p>
            <p className="text-sm text-gray-600 mt-2">Failed</p>
            <p className="text-xs text-gray-500 mt-1">
              {statistics.total_vendors > 0
                ? Math.round(
                    (statistics.failed_vendors / statistics.total_vendors) * 100
                  )
                : 0}
              %
            </p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <p className="text-3xl font-bold text-blue-600">
              {statistics.total_vendors}
            </p>
            <p className="text-sm text-gray-600 mt-2">Total</p>
            <p className="text-xs text-gray-500 mt-1">100%</p>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Label className="text-xl font-semibold">
            My Created Vendors ({vendors.length})
          </Label>
        </div>

        {vendors.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No vendors created yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Start by creating your first vendor
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:shadow-md hover:border-orange-300 transition-all cursor-pointer"
                onClick={() =>
                  router.push(`/vendor/vendor-management/view/${vendor._id}`)
                }
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {vendor.vendor_name}
                    </h3>
                    <Badge
                      label={vendor.verification_status?.toUpperCase() || "PENDING"}
                      variant={getStatusBadgeVariant(
                        vendor.verification_status || "pending"
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>
                      <strong>ID:</strong> {vendor.vendor_id}
                    </span>
                    <span>
                      <strong>Category:</strong>{" "}
                      {vendor.vendor_category
                        ? vendor.vendor_category === "raw_materials"
                          ? "Raw Materials"
                          : vendor.vendor_category.charAt(0).toUpperCase() +
                            vendor.vendor_category.slice(1)
                        : "N/A"}
                    </span>
                    <span>
                      <strong>Email:</strong> {vendor.vendor_email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span>
                      Created: {new Date(vendor.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated: {new Date(vendor.updatedAt).toLocaleDateString()}
                    </span>
                    {vendor.verified_by && (
                      <span>
                        Verified by: {vendor.verified_by.name || "N/A"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    label={vendor.risk_rating?.toUpperCase() || "MEDIUM"}
                    variant={getRiskBadgeVariant(vendor.risk_rating || "medium")}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm Logout
              </h2>
              <p className="text-gray-600">
                Are you sure you want to logout? You will need to login again
                to access your account.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                variant="secondary"
                className="flex-1 rounded-lg"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 rounded-lg bg-red-500 hover:bg-red-600"
                onClick={confirmLogout}
                disabled={isLoggingOut}
                isLoading={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
