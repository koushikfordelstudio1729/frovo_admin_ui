"use client";

import { useState, useEffect } from "react";
import { BackHeader, Label, Badge, Pagination } from "@/components";
import { useRouter, useParams } from "next/navigation";
import { getCompanyAuditTrail, getCompanyByCIN } from "@/services/vendor";
import { toast } from "react-hot-toast";
import { VendorCompany } from "@/types/vendor.types";
import { Clock, User, FileText } from "lucide-react";

interface AuditRecord {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  user_email: string;
  user_role: string;
  action: string;
  action_description: string;
  target_type: string;
  target_company?: {
    _id: string;
    registered_company_name: string;
    cin: string;
  };
  target_company_name?: string;
  target_company_cin?: string;
  before_state?: any;
  after_state?: any;
  changed_fields: string[];
  ip_address: string;
  user_agent: string;
  timestamp: string;
  createdAt: string;
}

export default function CompanyAuditTrailPage() {
  const router = useRouter();
  const params = useParams();
  const companyId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<VendorCompany | null>(null);
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    page: 1,
  });
  const [expandedAudit, setExpandedAudit] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    if (companyId) {
      loadCompany();
      loadAuditTrail();
    }
  }, [companyId, currentPage]);

  const loadCompany = async () => {
    try {
      // Assuming companyId is the CIN
      const res = await getCompanyByCIN(companyId);
      setCompany(res.data.data);
    } catch (error) {
      console.error("Failed to load company details", error);
    }
  };

  const loadAuditTrail = async () => {
    try {
      setLoading(true);
      const res = await getCompanyAuditTrail(companyId, currentPage, ITEMS_PER_PAGE);
      setAudits(res.data.data.audits);
      setPagination({
        totalPages: res.data.data.pages,
        totalCount: res.data.data.total,
        page: res.data.data.page,
      });
    } catch (error) {
      toast.error("Failed to load audit trail");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    switch (action.toLowerCase()) {
      case "create":
        return "active";
      case "update":
        return "warning";
      case "delete":
        return "rejected";
      default:
        return "warning";
    }
  };

  const toggleExpand = (auditId: string) => {
    setExpandedAudit(expandedAudit === auditId ? null : auditId);
  };

  if (loading && !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">
          Loading Audit Trail...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackHeader title="Company Audit Trail" />

      <div className="bg-white rounded-xl p-8 space-y-8">
        {/* Company Info */}
        {company && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {company.registered_company_name}
                </h2>
                <p className="text-gray-600 mt-1">{company.legal_entity_structure}</p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>CIN:</strong> {company.cin}
                </p>
              </div>
              <Badge
                label={company.company_status?.toUpperCase() || "ACTIVE"}
                variant={
                  company.company_status === "active" ? "active" : "rejected"
                }
              />
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="flex justify-between items-center">
          <div>
            <Label className="text-xl font-semibold">
              Audit Trail History ({pagination.totalCount})
            </Label>
            <p className="text-gray-500 text-sm mt-1">
              Complete history of all changes and actions
            </p>
          </div>
        </div>

        {/* Audit Records */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading audit records...</p>
          </div>
        ) : audits.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No audit records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {audits.map((audit) => (
              <div
                key={audit._id}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Audit Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(audit._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          label={audit.action.toUpperCase()}
                          variant={getActionBadge(audit.action)}
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          {audit.action_description}
                        </span>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User size={16} />
                          <span>
                            {audit.user?.name || audit.user_email} (
                            {audit.user_role})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>
                            {new Date(audit.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {audit.changed_fields.length > 0 && (
                          <div className="flex items-center gap-2">
                            <FileText size={16} />
                            <span>
                              {audit.changed_fields.length} field(s) changed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-gray-400 text-sm">
                      {expandedAudit === audit._id ? "▼" : "▶"}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedAudit === audit._id && (
                  <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid grid-cols-2 gap-6 mt-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          User Details
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Name:</strong>{" "}
                            {audit.user?.name || "N/A"}
                          </p>
                          <p>
                            <strong>Email:</strong> {audit.user_email}
                          </p>
                          <p>
                            <strong>Role:</strong> {audit.user_role}
                          </p>
                          <p>
                            <strong>IP Address:</strong> {audit.ip_address}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Action Details
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Action:</strong> {audit.action}
                          </p>
                          <p>
                            <strong>Target Type:</strong> {audit.target_type}
                          </p>
                          {audit.target_company_name && (
                            <p>
                              <strong>Company:</strong>{" "}
                              {audit.target_company_name}
                            </p>
                          )}
                          {audit.target_company_cin && (
                            <p>
                              <strong>CIN:</strong> {audit.target_company_cin}
                            </p>
                          )}
                          <p>
                            <strong>Timestamp:</strong>{" "}
                            {new Date(audit.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {audit.changed_fields.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Changed Fields
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {audit.changed_fields.map((field, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {audit.before_state && audit.after_state && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Before
                          </p>
                          <pre className="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto max-h-64">
                            {JSON.stringify(audit.before_state, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            After
                          </p>
                          <pre className="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto max-h-64">
                            {JSON.stringify(audit.after_state, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {audit.user_agent && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          User Agent
                        </p>
                        <p className="text-xs text-gray-600 font-mono">
                          {audit.user_agent}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}
