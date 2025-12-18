"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Label, StatCard, BackHeader } from "@/components";
import { getCompanyWithVendors } from "@/services/vendor";
import { toast } from "react-hot-toast";
import { CompanyWithVendorsResponse } from "@/types/vendor.types";
import { Building2, Users, AlertCircle, CheckCircle } from "lucide-react";

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const cin = params.cin as string;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CompanyWithVendorsResponse["data"] | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const res = await getCompanyWithVendors(cin);
        setData(res.data.data);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load company details");
        router.push("/vendor/registered-company");
      } finally {
        setLoading(false);
      }
    };

    if (cin) {
      fetchCompanyDetails();
    }
  }, [cin, router]);

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "active";
      case "medium":
        return "warning";
      case "high":
        return "rejected";
      default:
        return "machine";
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
        return "machine";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Loading company details...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Company not found</p>
      </div>
    );
  }

  const { company, statistics, recent_vendors } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title={company.registered_company_name} />

      {/* Company Overview Card */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <Label className="text-sm text-gray-600">CIN</Label>
            <p className="text-lg font-semibold mt-1 text-gray-900">{company.cin}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Legal Entity</Label>
            <p className="text-lg font-semibold mt-1 text-gray-900">{company.legal_entity_structure}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Company Status</Label>
            <div className="mt-1">
              <Badge
                label={company.company_status.toUpperCase()}
                variant={company.company_status === "active" ? "active" : "rejected"}
              />
            </div>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Risk Rating</Label>
            <div className="mt-1">
              <Badge
                label={company.risk_rating.toUpperCase()}
                variant={getRiskBadgeVariant(company.risk_rating)}
              />
            </div>
          </div>
          <div>
            <Label className="text-sm text-gray-600">GST Number</Label>
            <p className="text-lg font-semibold mt-1 text-gray-900">{company.gst_number || "N/A"}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Date of Incorporation</Label>
            <p className="text-lg font-semibold mt-1 text-gray-900">
              {new Date(company.date_of_incorporation).toLocaleDateString()}
            </p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Website</Label>
            <a
              href={company.corporate_website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold mt-1 text-orange-500 hover:underline block truncate"
            >
              {company.corporate_website}
            </a>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Email</Label>
            <p className="text-lg font-semibold mt-1 text-gray-900 truncate">{company.office_email}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Label className="text-sm text-gray-600">Registered Office Address</Label>
          <p className="text-base mt-1 text-gray-900">{company.company_address}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Director / Authorized Signatory</Label>
            <p className="text-lg font-semibold mt-1 text-gray-900">{company.directory_signature_name}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-600">DIN</Label>
            <p className="text-lg font-semibold mt-1 text-gray-900">{company.din}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Vendors"
          count={statistics.total_vendors.toString()}
          icon={Users}
        />
        <StatCard
          title="Verified Vendors"
          count={`${statistics.status_percentages.verified}%`}
          icon={CheckCircle}
        />
        <StatCard
          title="Pending Verification"
          count={`${statistics.status_percentages.pending}%`}
          icon={AlertCircle}
        />
        <StatCard
          title="Categories"
          count={statistics.category_count.toString()}
          icon={Building2}
        />
      </div>

      {/* Vendor Status Breakdown */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <Label className="text-xl font-semibold mb-4">Vendor Status Breakdown</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{statistics.by_status.verified}</p>
            <p className="text-sm text-gray-600 mt-1">Verified</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{statistics.by_status.pending}</p>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{statistics.by_status["in-review"]}</p>
            <p className="text-sm text-gray-600 mt-1">In Review</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{statistics.by_status.approved}</p>
            <p className="text-sm text-gray-600 mt-1">Approved</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{statistics.by_status.rejected}</p>
            <p className="text-sm text-gray-600 mt-1">Rejected</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{statistics.by_status.failed}</p>
            <p className="text-sm text-gray-600 mt-1">Failed</p>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <Label className="text-xl font-semibold mb-4">Risk Distribution</Label>
        <div className="grid grid-cols-3 gap-4">
          {statistics.by_risk.low && (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{statistics.by_risk.low.count}</p>
              <p className="text-sm text-gray-600 mt-1">
                Low Risk ({statistics.by_risk.low.percentage}%)
              </p>
            </div>
          )}
          {statistics.by_risk.medium && (
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {statistics.by_risk.medium.count}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Medium Risk ({statistics.by_risk.medium.percentage}%)
              </p>
            </div>
          )}
          {statistics.by_risk.high && (
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{statistics.by_risk.high.count}</p>
              <p className="text-sm text-gray-600 mt-1">
                High Risk ({statistics.by_risk.high.percentage}%)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top Categories */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <Label className="text-xl font-semibold mb-4">Top Vendor Categories</Label>
        <div className="space-y-3">
          {statistics.top_categories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-orange-500">#{idx + 1}</span>
                <span className="font-medium capitalize text-gray-900">{cat.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-900">{cat.count} vendors</span>
                <Badge label={`${cat.percentage}%`} variant="active" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Vendors */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Label className="text-xl font-semibold">Recent Vendors</Label>
          <Button
            variant="primary"
            className="rounded-lg"
            onClick={() => router.push("/vendor/dashboard")}
          >
            View All Vendors
          </Button>
        </div>

        {recent_vendors.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No vendors registered yet</p>
        ) : (
          <div className="space-y-3">
            {recent_vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-lg text-gray-900">{vendor.vendor_name}</p>
                  <p className="text-sm text-gray-600">
                    {vendor.vendor_id} • {vendor.vendor_category}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created by {vendor.createdBy.name} ({vendor.createdBy.email})
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge
                      label={vendor.verification_status.toUpperCase()}
                      variant={getStatusBadgeVariant(vendor.verification_status)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    label={vendor.risk_rating.toUpperCase()}
                    variant={getRiskBadgeVariant(vendor.risk_rating)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
