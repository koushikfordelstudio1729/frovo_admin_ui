"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  X,
  User,
  Calendar,
} from "lucide-react";
import {
  Button,
  Badge,
  Pagination,
  Input,
  Textarea,
  BackHeader,
} from "@/components/common";
import { Table } from "@/components";
import type { Column } from "@/components";
import { api } from "@/services/api";
import { apiConfig } from "@/config/admin";
import { AxiosError } from "axios";

interface Requester {
  name: string;
  email: string;
  id: string;
}

interface RequestedRole {
  name: string;
  key: string;
  id: string;
}

interface AccessRequest {
  id: string;
  requester: Requester;
  requestedRole?: RequestedRole;
  requestedPermissions: string[];
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  approver?: Requester;
  isExpired: boolean;
}

interface AccessRequestsResponse {
  success: boolean;
  message: string;
  data: AccessRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(
    null
  );

  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({
    requestedPermissions: [] as string[],
    reason: "",
    urgency: "medium",
  });

  const [approveForm, setApproveForm] = useState({
    comment: "",
    duration: 7,
  });

  const [rejectForm, setRejectForm] = useState({
    comment: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [availablePermissions] = useState([
    "users:view",
    "users:create",
    "users:edit",
    "users:delete",
    "roles:view",
    "roles:create",
    "roles:edit",
    "roles:delete",
    "departments:view",
    "departments:create",
    "departments:edit",
    "departments:delete",
  ]);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      return error.response?.data?.message || error.message;
    }
    return "An unexpected error occurred";
  };

  const fetchRequests = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get<AccessRequestsResponse>(
        `${apiConfig.endpoints.accessRequests}?page=${page}&limit=10`
      );

      if (response.data.success) {
        setRequests(response.data.data);
        setCurrentPage(response.data.pagination.page);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      console.error("Error fetching access requests:", getErrorMessage(err));
      setError("Failed to fetch access requests");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRequestById = async (id: string) => {
    try {
      const response = await api.get<{
        success: boolean;
        data: AccessRequest;
      }>(`${apiConfig.endpoints.accessRequests}/${id}`);

      if (response.data.success) {
        setSelectedRequest(response.data.data);
        setShowViewModal(true);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCreateRequest = async () => {
    if (createForm.requestedPermissions.length === 0) {
      setError("Please select at least one permission");
      return;
    }

    if (!createForm.reason.trim()) {
      setError("Please provide a reason for the request");
      return;
    }

    try {
      const response = await api.post(
        apiConfig.endpoints.accessRequests,
        createForm
      );

      if (response.data.success) {
        setSuccess("Access request created successfully");
        setShowCreateModal(false);
        setCreateForm({
          requestedPermissions: [],
          reason: "",
          urgency: "medium",
        });
        fetchRequests(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      const response = await api.put(
        `${apiConfig.endpoints.accessRequests}/${selectedRequest.id}/approve`,
        {
          status: "approved",
          comment: approveForm.comment,
          duration: approveForm.duration,
        }
      );

      if (response.data.success) {
        setSuccess("Access request approved successfully");
        setShowApproveModal(false);
        setApproveForm({ comment: "", duration: 7 });
        fetchRequests(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      const response = await api.put(
        `${apiConfig.endpoints.accessRequests}/${selectedRequest.id}/reject`,
        {
          status: "rejected",
          comment: rejectForm.comment,
        }
      );

      if (response.data.success) {
        setSuccess("Access request rejected");
        setShowRejectModal(false);
        setRejectForm({ comment: "" });
        fetchRequests(currentPage);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchRequests(1);
  }, [fetchRequests]);

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "active" | "inactive" | "pending" } = {
      approved: "active",
      rejected: "inactive",
      pending: "pending",
    };
    return (
      <Badge
        label={status}
        size="md"
        variant={variants[status] || "pending"}
        showDot
      />
    );
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.requester.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns
  const columns: Column[] = [
    { key: "requester", label: "Requester", minWidth: "200px" },
    { key: "requestedAccess", label: "Requested Access", minWidth: "250px" },
    { key: "reason", label: "Reason", minWidth: "200px" },
    { key: "status", label: "Status", minWidth: "120px" },
    { key: "created", label: "Created", minWidth: "150px" },
    { key: "actions", label: "Actions", minWidth: "200px" },
  ];

  // Render custom cells
  const renderCell = (
    key: string,
    value: any,
    row?: Record<string, any>
  ): React.ReactNode => {
    const request = row as AccessRequest | undefined;
    if (!request) return value;

    switch (key) {
      case "requester":
        return (
          <div>
            <div className="font-medium text-gray-900">
              {request.requester.name}
            </div>
            <div className="text-sm text-gray-500">
              {request.requester.email}
            </div>
          </div>
        );

      case "requestedAccess":
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {request.requestedRole ? (
              <Badge
                label={`Role: ${request.requestedRole.name}`}
                size="sm"
                variant="active"
              />
            ) : (
              <>
                {request.requestedPermissions.slice(0, 2).map((perm, idx) => (
                  <Badge key={idx} label={perm} size="sm" variant="pending" />
                ))}
                {request.requestedPermissions.length > 2 && (
                  <Badge
                    label={`+${request.requestedPermissions.length - 2} more`}
                    size="sm"
                    variant="inactive"
                  />
                )}
              </>
            )}
          </div>
        );

      case "reason":
        return (
          <div className="text-sm text-gray-600 max-w-xs truncate">
            {request.reason}
          </div>
        );

      case "status":
        return getStatusBadge(request.status);

      case "created":
        return (
          <div className="text-sm text-gray-500">
            {new Date(request.createdAt).toLocaleDateString()}
          </div>
        );

      case "actions":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => fetchRequestById(request.id)}
              className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
              title="View details"
            >
              <Eye size={18} />
            </button>
            {request.status === "pending" && (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowApproveModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowRejectModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        );

      default:
        return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4">
      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex justify-between items-center">
          {success}
          <button onClick={() => setSuccess(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
          {error}
          <button onClick={() => setError(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <BackHeader title="Access Requests & Approvals" />
      </div>

      {/* Search Bar & Actions */}
      <div className="flex justify-between items-center mb-4">
        <div className="w-96">
          <Input
            placeholder="Search by requester name, email, or status..."
            value={searchQuery}
            startIcon={<Search size={20} />}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg"
        >
          <Plus size={20} />
          Request Access
        </Button>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
          Loading requests...
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={filteredRequests}
            renderCell={renderCell}
            alternateRowColors={true}
            showSeparators={true}
            enableHorizontalScroll={true}
            minTableWidth="1400px"
          />

          {/* Pagination */}
          {filteredRequests.length > 0 && (
            <div className="flex items-center justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchRequests(page)}
              />
            </div>
          )}
        </>
      )}

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm bg-opacity-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Request Access
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Permissions Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Permissions *
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                  {availablePermissions.map((perm) => (
                    <div key={perm} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id={`perm-${perm}`}
                        checked={createForm.requestedPermissions.includes(perm)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCreateForm({
                              ...createForm,
                              requestedPermissions: [
                                ...createForm.requestedPermissions,
                                perm,
                              ],
                            });
                          } else {
                            setCreateForm({
                              ...createForm,
                              requestedPermissions:
                                createForm.requestedPermissions.filter(
                                  (p) => p !== perm
                                ),
                            });
                          }
                        }}
                        className="accent-orange-600 w-4 h-4 rounded"
                      />
                      <label
                        htmlFor={`perm-${perm}`}
                        className="text-sm text-gray-700 font-mono"
                      >
                        {perm}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reason */}
              <Textarea
                label="Reason *"
                variant="orange"
                value={createForm.reason}
                onChange={(e) =>
                  setCreateForm({ ...createForm, reason: e.target.value })
                }
                rows={4}
                placeholder="Explain why you need this access..."
              />

              {/* Urgency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <select
                  value={createForm.urgency}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, urgency: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="secondary"
                size="md"
                className="rounded-lg"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="rounded-lg"
                onClick={handleCreateRequest}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-linear-to-r from-orange-500 to-orange-600 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Access Request Details
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Request ID: {selectedRequest.id}
                  </p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-white hover:bg-opacity-20 rounded-lg p-2 transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Status Banner */}
                <div
                  className={`p-5 rounded-xl border-2 ${
                    selectedRequest.status === "approved"
                      ? "bg-green-50 border-green-300"
                      : selectedRequest.status === "rejected"
                      ? "bg-red-50 border-red-300"
                      : "bg-yellow-50 border-yellow-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedRequest.status === "approved" && (
                      <CheckCircle className="text-green-600" size={28} />
                    )}
                    {selectedRequest.status === "rejected" && (
                      <XCircle className="text-red-600" size={28} />
                    )}
                    {selectedRequest.status === "pending" && (
                      <Clock className="text-yellow-600" size={28} />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        Status
                      </p>
                      <p
                        className={`text-xl font-bold capitalize ${
                          selectedRequest.status === "approved"
                            ? "text-green-700"
                            : selectedRequest.status === "rejected"
                            ? "text-red-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {selectedRequest.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Requester Info */}
                  <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <User size={20} className="text-gray-600" />
                      Requester Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Name
                        </label>
                        <p className="font-semibold text-gray-900 text-lg mt-1">
                          {selectedRequest.requester.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Email
                        </label>
                        <p className="text-gray-700 mt-1">
                          {selectedRequest.requester.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                      <Calendar size={20} className="text-orange-600" />
                      Timeline
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Created
                        </label>
                        <p className="text-gray-900 mt-1 font-medium">
                          {new Date(selectedRequest.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {selectedRequest.approvedAt && (
                        <div>
                          <label className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                            Approved
                          </label>
                          <p className="text-gray-900 mt-1 font-medium">
                            {new Date(
                              selectedRequest.approvedAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {selectedRequest.rejectedAt && (
                        <div>
                          <label className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                            Rejected
                          </label>
                          <p className="text-gray-900 mt-1 font-medium">
                            {new Date(
                              selectedRequest.rejectedAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Requested Access */}
                <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">
                    Requested Access
                  </h4>
                  {selectedRequest.requestedRole ? (
                    <div className="bg-linear-to-r from-orange-100 to-blue-50 border-l-4 border-orange-600 rounded-lg p-4">
                      <p className="font-bold text-orange-900 text-lg mb-1">
                        Role: {selectedRequest.requestedRole.name}
                      </p>
                      <p className="text-sm text-orange-700 font-mono bg-orange-50 inline-block px-3 py-1 rounded">
                        {selectedRequest.requestedRole.key}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.requestedPermissions.map((perm, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-semibold shadow-sm"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reason */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3 text-lg">
                    Reason for Request
                  </h4>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {selectedRequest.reason}
                  </p>
                </div>

                {/* Approver Info */}
                {selectedRequest.approver && (
                  <div
                    className={`rounded-xl p-6 border-2 ${
                      selectedRequest.status === "approved"
                        ? "bg-linear-to-br from-green-50 to-green-100 border-green-200"
                        : "bg-linear-to-br from-red-50 to-red-100 border-red-200"
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 mb-4 text-lg">
                      {selectedRequest.status === "approved"
                        ? "Approved By"
                        : "Rejected By"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Name
                        </label>
                        <p className="font-semibold text-gray-900 text-lg mt-1">
                          {selectedRequest.approver.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Email
                        </label>
                        <p className="text-gray-700 mt-1">
                          {selectedRequest.approver.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="md"
                className="rounded-lg"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Approve Request
              </h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                Approve access request from{" "}
                <strong>{selectedRequest.requester.name}</strong>?
              </p>

              <Textarea
                label="Comment (Optional)"
                variant="orange"
                value={approveForm.comment}
                onChange={(e) =>
                  setApproveForm({ ...approveForm, comment: e.target.value })
                }
                rows={3}
                placeholder="Add any comments..."
              />

              <Input
                label="Duration (days)"
                variant="orange"
                type="number"
                value={approveForm.duration.toString()}
                onChange={(e) =>
                  setApproveForm({
                    ...approveForm,
                    duration: parseInt(e.target.value) || 7,
                  })
                }
              />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowApproveModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Reject Request
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700">
                Reject access request from{" "}
                <strong>{selectedRequest.requester.name}</strong>?
              </p>

              <Textarea
                label="Comment (Optional)"
                variant="orange"
                value={rejectForm.comment}
                onChange={(e) =>
                  setRejectForm({ ...rejectForm, comment: e.target.value })
                }
                rows={3}
                placeholder="Explain reason for rejection..."
              />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
