"use client";

import {
  Input,
  Label,
  StatCard,
  Badge,
  Table,
  Pagination,
  Button,
  Select,
} from "@/components";
import { useState, useEffect, useMemo } from "react";
import { ClipboardCheck, Search, X, CheckCircle, XCircle } from "lucide-react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { trackingAPI } from "@/services/trackingAPI";
import { routeAPI } from "@/services/routeAPI";
import {
  RouteProgressData,
  StatisticsData,
  CheckInStatus,
} from "@/types/tracking.types";
import { Route } from "@/types/route.types";
import { toast } from "react-hot-toast";

const Tracking = () => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal states
  const [openReassignModal, setOpenReassignModal] = useState(false);
  const [openCheckInModal, setOpenCheckInModal] = useState(false);

  // Filters
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today's date in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Data
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeProgress, setRouteProgress] = useState<RouteProgressData | null>(
    null
  );
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);

  // Reassign modal state
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedMachinesForReassign, setSelectedMachinesForReassign] = useState<
    string[]
  >([]);
  const [reassignReason, setReassignReason] = useState("");

  // Check-in modal state
  const [checkInMachine, setCheckInMachine] = useState<{
    machine_id: string;
    planned_sequence: string;
  } | null>(null);
  const [checkInStatus, setCheckInStatus] = useState<CheckInStatus>("completed");
  const [checkInNotes, setCheckInNotes] = useState("");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [reassigning, setReassigning] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  // Fetch routes on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await routeAPI.getAllRoutes();
        if (response.success && response.data) {
          setRoutes(response.data);
          // Auto-select first route
          if (response.data.length > 0) {
            setSelectedRoute(response.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
        toast.error("Failed to load routes");
      }
    };

    fetchRoutes();
  }, []);

  // Fetch statistics on mount
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatisticsLoading(true);
        const response = await trackingAPI.getStatistics();
        if (response.success) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
        toast.error("Failed to load statistics");
      } finally {
        setStatisticsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Fetch route progress when route or date changes
  useEffect(() => {
    if (!selectedRoute) return;

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await trackingAPI.getRouteProgress(
          selectedRoute,
          selectedDate
        );
        if (response.success) {
          setRouteProgress(response.data);
        }
      } catch (error) {
        console.error("Error fetching route progress:", error);
        toast.error("Failed to load route progress");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [selectedRoute, selectedDate]);

  // Filter and search
  const filteredData = useMemo(() => {
    if (!routeProgress) return [];

    let data = routeProgress.machine_progress;

    // Search filter
    if (searchQuery) {
      data = data.filter((item) =>
        item.machine_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return data;
  }, [routeProgress, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle check-in
  const handleCheckInClick = (machine: {
    machine_id: string;
    planned_sequence: string;
  }) => {
    setCheckInMachine(machine);
    setCheckInStatus("completed");
    setCheckInNotes("");
    setOpenCheckInModal(true);
  };

  const handleCheckInSubmit = async () => {
    if (!checkInMachine || !routeProgress) return;

    try {
      setCheckingIn(true);

      // Find the sequence number
      const sequenceIndex = routeProgress.machine_progress.findIndex(
        (m) => m.machine_id === checkInMachine.machine_id
      );

      await trackingAPI.checkIn({
        route_id: selectedRoute,
        machine_id: checkInMachine.machine_id,
        agent_id: agentFilter || "AGENT-001", // Default agent if no filter
        status: checkInStatus,
        planned_sequence: sequenceIndex + 1,
        actual_sequence: sequenceIndex + 1,
        notes: checkInNotes,
      });

      toast.success(`Machine ${checkInStatus} successfully`);
      setOpenCheckInModal(false);

      // Refresh data
      const response = await trackingAPI.getRouteProgress(
        selectedRoute,
        selectedDate,
        agentFilter || undefined
      );
      if (response.success) {
        setRouteProgress(response.data);
      }
    } catch (error: any) {
      console.error("Error checking in:", error);
      toast.error(error?.response?.data?.message || "Failed to check in");
    } finally {
      setCheckingIn(false);
    }
  };

  // Handle reassign
  const toggleMachineForReassign = (machine: string) => {
    setSelectedMachinesForReassign((prev) =>
      prev.includes(machine)
        ? prev.filter((m) => m !== machine)
        : [...prev, machine]
    );
  };

  const handleReassignSubmit = async () => {
    if (!selectedAgent || selectedMachinesForReassign.length === 0) {
      toast.error("Please select an agent and at least one machine");
      return;
    }

    try {
      setReassigning(true);
      await trackingAPI.reassignMachines({
        route_id: selectedRoute,
        machine_ids: selectedMachinesForReassign,
        original_agent_id: agentFilter || "AGENT-001",
        reassigned_agent_id: selectedAgent,
        reason: reassignReason,
      });

      toast.success("Machines reassigned successfully");
      setOpenReassignModal(false);
      setSelectedAgent("");
      setSelectedMachinesForReassign([]);
      setReassignReason("");

      // Refresh data
      const response = await trackingAPI.getRouteProgress(
        selectedRoute,
        selectedDate,
        agentFilter || undefined
      );
      if (response.success) {
        setRouteProgress(response.data);
      }
    } catch (error: any) {
      console.error("Error reassigning machines:", error);
      toast.error(error?.response?.data?.message || "Failed to reassign machines");
    } finally {
      setReassigning(false);
    }
  };

  const trackingTableColumns = [
    { label: "Machine ID", key: "machine_id" },
    { label: "Planned Sequence", key: "planned_sequence" },
    { label: "Check-In Status", key: "check_in_status" },
    { label: "Check-In Time", key: "check_in_time" },
    { label: "Actions", key: "actions" },
  ];

  const renderTrackingCell = (key: string, value: any, row: any) => {
    if (key === "check_in_status") {
      const normalized = value.toLowerCase();

      const variant =
        normalized === "completed"
          ? "active"
          : normalized === "skipped"
          ? "machine"
          : "warning";

      const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);

      return (
        <Badge
          label={label}
          variant={variant}
          size="md"
          showDot
          className="px-4 py-2 text-sm"
        />
      );
    }

    if (key === "check_in_time") {
      if (!value) return <span className="text-gray-400">--</span>;
      const date = new Date(value);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (key === "actions") {
      return (
        <div className="flex items-center gap-3">
          {row.check_in_status === "pending" && (
            <>
              <button
                className="text-green-500 hover:text-green-700"
                onClick={() =>
                  handleCheckInClick({
                    machine_id: row.machine_id,
                    planned_sequence: row.planned_sequence,
                  })
                }
                title="Check In"
              >
                <CheckCircle size={18} />
              </button>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  setCheckInMachine({
                    machine_id: row.machine_id,
                    planned_sequence: row.planned_sequence,
                  });
                  setCheckInStatus("skipped");
                  setCheckInNotes("");
                  setOpenCheckInModal(true);
                }}
                title="Skip"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
          {row.check_in_status !== "pending" && (
            <span className="text-gray-400 text-sm">No actions</span>
          )}
        </div>
      );
    }

    return value;
  };

  const routeOptions = routes.map((route) => ({
    label: route.route_name,
    value: route._id,
  }));

  // Get unique agents from route progress
  const agentOptions = useMemo(() => {
    // For now, using placeholder agents
    // In the future, this should come from an agents API
    return [
      { label: "All Agents", value: "" },
      { label: "Agent 001", value: "AGENT-001" },
      { label: "Agent 002", value: "AGENT-002" },
      { label: "Agent 003", value: "AGENT-003" },
    ];
  }, []);

  return (
    <div className="min-h-screen pt-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-12">
        <StatCard
          title="Total Machines"
          count={routeProgress?.summary.total_machines || 0}
          icon={ClipboardCheck}
          loading={loading}
        />
        <StatCard
          title="Completed"
          count={routeProgress?.summary.completed || 0}
          icon={ClipboardCheck}
          loading={loading}
        />
        <StatCard
          title="Pending"
          count={routeProgress?.summary.pending || 0}
          icon={ClipboardCheck}
          loading={loading}
        />
      </div>

      {/* Filters */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div>
          <Select
            label="Select Route"
            placeholder="Choose a route"
            selectClassName="py-2.5 px-4"
            labelClassName="text-xl"
            value={selectedRoute}
            onChange={setSelectedRoute}
            options={routeOptions}
          />
        </div>
        <div>
          <Input
            label="Date"
            labelClassName="text-xl"
            inputClassName="py-2.5"
            variant="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <Input
            label="Search"
            variant="search"
            labelClassName="text-xl"
            placeholder="Search machine..."
            startIcon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Route Info */}
      {routeProgress && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                {routeProgress.route_info.route_name}
              </h3>
              <p className="text-sm text-blue-700">
                {routeProgress.route_info.area_name.area_name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">
                Date:{" "}
                {new Date(routeProgress.route_info.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="mt-10 flex justify-between items-center">
        <Label className="text-xl">Route Progress Table</Label>
        <Button
          className="rounded-lg"
          variant="primary"
          onClick={() => setOpenReassignModal(true)}
          disabled={!selectedRoute || loading}
        >
          Reassign Machines
        </Button>
      </div>

      {/* Table */}
      <div className="mt-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading route progress...
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No data available. Please select a route.
          </div>
        ) : (
          <Table
            columns={trackingTableColumns}
            data={pagedData}
            renderCell={renderTrackingCell}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-2 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Check-In Modal */}
      {openCheckInModal && checkInMachine && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center
            bg-black/20 backdrop-blur-sm"
          onClick={() => setOpenCheckInModal(false)}
        >
          <div
            className="bg-white w-[450px] p-6 rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <Label className="text-xl">
                Check-In: {checkInMachine.machine_id}
              </Label>
              <button
                onClick={() => setOpenCheckInModal(false)}
                className="text-black cursor-pointer"
              >
                <X />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="mb-2 block">Status</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="checkInStatus"
                      checked={checkInStatus === "completed"}
                      onChange={() => setCheckInStatus("completed")}
                    />
                    <span>Completed</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="checkInStatus"
                      checked={checkInStatus === "skipped"}
                      onChange={() => setCheckInStatus("skipped")}
                    />
                    <span>Skipped</span>
                  </label>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Notes (Optional)</Label>
                <textarea
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none"
                  rows={3}
                  placeholder="Add any notes..."
                  value={checkInNotes}
                  onChange={(e) => setCheckInNotes(e.target.value)}
                />
              </div>

              <div className="mt-8 flex justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-lg px-6"
                  onClick={() => setOpenCheckInModal(false)}
                  disabled={checkingIn}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-lg px-6"
                  variant="primary"
                  onClick={handleCheckInSubmit}
                  disabled={checkingIn}
                >
                  {checkingIn ? "Saving..." : "Save Check-In"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {openReassignModal && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center
            bg-black/20 backdrop-blur-sm"
          onClick={() => setOpenReassignModal(false)}
        >
          <div
            className="bg-white w-[450px] p-6 rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <Label className="text-xl">Reassign Machines</Label>
              <button
                onClick={() => setOpenReassignModal(false)}
                className="text-black cursor-pointer"
              >
                <X />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <Select
                  label="Reassign to Agent"
                  placeholder="Select agent"
                  selectClassName="py-2 px-4"
                  value={selectedAgent}
                  onChange={setSelectedAgent}
                  options={agentOptions.filter((a) => a.value !== "")}
                />
              </div>

              <div>
                <Label className="mb-2 block">Machines to Reassign</Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-[200px] overflow-y-auto">
                  {filteredData.length > 0 ? (
                    filteredData.map((machine) => (
                      <label
                        key={machine.machine_id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMachinesForReassign.includes(
                            machine.machine_id
                          )}
                          onChange={() =>
                            toggleMachineForReassign(machine.machine_id)
                          }
                        />
                        <span>{machine.machine_id}</span>
                      </label>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No machines available
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Reason (Optional)</Label>
                <textarea
                  className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-orange-500 focus:outline-none"
                  rows={2}
                  placeholder="Reason for reassignment..."
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                />
              </div>

              <div className="mt-8 flex justify-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-lg px-6"
                  onClick={() => setOpenReassignModal(false)}
                  disabled={reassigning}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-lg px-6"
                  variant="primary"
                  onClick={handleReassignSubmit}
                  disabled={reassigning}
                >
                  {reassigning ? "Reassigning..." : "Reassign"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
