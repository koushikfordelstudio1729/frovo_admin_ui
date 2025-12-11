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
import { useState, useMemo } from "react";
import { ClipboardCheck, Search, X } from "lucide-react";
import { Eye, Edit2, Trash2 } from "lucide-react";

const agentNames = [
  { label: "Ashwin", value: "ashwin" },
  { label: "Jaddu", value: "jaddu" },
  { label: "Kuldeep", value: "kuldeep" },
];

const machines = [
  { label: "VM-101", value: "vm101" },
  { label: "VM-214", value: "vm214" },
  { label: "VM-332", value: "vm332" },
  { label: "VM-457", value: "vm457" },
  { label: "VM-629", value: "vm629" },
];

const trackingTableColumns = [
  { label: "Machine ID", key: "machine_id" },
  { label: "Assigned Agent", key: "assigned_agent" },
  { label: "Check-In Status", key: "check_in_status" },
  { label: "Check-In Time", key: "check_in_time" },
  { label: "Actions", key: "actions" },
];

const trackingTableData = [
  {
    machine_id: "VM-101",
    assigned_agent: "Suresh",
    check_in_status: "completed",
    check_in_time: "10:15 AM",
  },
  {
    machine_id: "VM-214",
    assigned_agent: "Suresh",
    check_in_status: "Pending",
    check_in_time: "--",
  },
  {
    machine_id: "VM-332",
    assigned_agent: "Suresh",
    check_in_status: "Skipped",
    check_in_time: "--",
  },
  {
    machine_id: "VM-457",
    assigned_agent: "Suresh",
    check_in_status: "completed",
    check_in_time: "11:02 AM",
  },
  {
    machine_id: "VM-518",
    assigned_agent: "Suresh",
    check_in_status: "Pending",
    check_in_time: "--",
  },
  {
    machine_id: "VM-629",
    assigned_agent: "Suresh",
    check_in_status: "Skipped",
    check_in_time: "--",
  },
  {
    machine_id: "VM-740",
    assigned_agent: "Suresh",
    check_in_status: "completed",
    check_in_time: "12:18 PM",
  },
  {
    machine_id: "VM-852",
    assigned_agent: "Suresh",
    check_in_status: "Pending",
    check_in_time: "--",
  },
  {
    machine_id: "VM-963",
    assigned_agent: "Suresh",
    check_in_status: "Skipped",
    check_in_time: "--",
  },
  {
    machine_id: "VM-1045",
    assigned_agent: "Suresh",
    check_in_status: "completed",
    check_in_time: "01:05 PM",
  },
];

const Tracking = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [agent, setAgent] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const pageSize = 5;

  const totalPages = Math.ceil(trackingTableData.length / pageSize);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return trackingTableData.slice(start, start + pageSize);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderTrackingCell = (key: string, value: any) => {
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

    if (key === "actions") {
      return (
        <div className="flex items-center gap-3">
          <button className="text-green-500">
            <Eye size={18} />
          </button>
          <button className="text-blue-500">
            <Edit2 size={18} />
          </button>
          <button className="text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      );
    }

    return value;
  };

  const toggleMachine = (machine: string) => {
    setSelectedMachines(
      (prev) =>
        prev.includes(machine)
          ? prev.filter((m) => m !== machine) // remove
          : [...prev, machine] // add
    );
  };

  return (
    <div className="min-h-screen pt-12">
      <div className="grid grid-cols-3 gap-12">
        <StatCard title="Total Machines" count={14} icon={ClipboardCheck} />
        <StatCard title="Completed" count={12} icon={ClipboardCheck} />
        <StatCard title="Pending" count={2} icon={ClipboardCheck} />
      </div>
      <div className="mt-8 flex gap-8">
        <div>
          <Input
            label="Search"
            variant="search"
            labelClassName="text-xl"
            placeholder="Search..."
            startIcon={<Search size={18} />}
          />
        </div>
        <div>
          <Input
            label="Date"
            labelClassName="text-xl"
            inputClassName="py-2.5"
            variant="date"
            type="date"
          />
        </div>
      </div>
      <div className="mt-10 flex justify-between items-center">
        <Label className="text-xl">Route Progress Tables</Label>
        <Button
          className="rounded-lg"
          variant="primary"
          onClick={() => setOpenModal(true)}
        >
          Reassign Machine
        </Button>
      </div>

      <div className="mt-4">
        <Table
          columns={trackingTableColumns}
          data={pagedData}
          renderCell={renderTrackingCell}
        />
      </div>
      <div className="mt-2 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      {openModal && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center 
            bg-black/20 backdrop-blur-sm"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-white w-[450px] p-6 rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <Label className="text-xl">Reassign Route / Machine</Label>

              <button
                onClick={() => setOpenModal(false)}
                className=" text-black cursor-pointer"
              >
                <X />
              </button>
            </div>

            <div className="space-y-5">
              <div className="mt-6">
                <Select
                  label="Choose Agent"
                  placeholder="Select agent"
                  selectClassName="py-2 px-4"
                  value={agent}
                  onChange={setAgent}
                  options={agentNames}
                />
              </div>

              <div>
                <Label className="mb-2 block">Machines to Reassign</Label>

                <div className="border rounded-lg p-3 space-y-2 min-h-[90px]">
                  {/* Selected machines as tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedMachines.length > 0 ? (
                      selectedMachines.map((machine) => (
                        <span
                          key={machine}
                          className="text-gray-800 flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                        >
                          {machine}
                          <X
                            size={14}
                            className="ml-2 cursor-pointer"
                            onClick={() => toggleMachine(machine)}
                          />
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Select machines to reassign
                      </span>
                    )}
                  </div>

                  {/* Checkbox list */}
                  <div className="border-t pt-2">
                    {machines.map((m) => (
                      <label
                        key={m.value}
                        className="text-black flex items-center gap-2 cursor-pointer mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedMachines.includes(m.label)}
                          onChange={() => toggleMachine(m.label)}
                        />
                        <span>{m.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button className="rounded-lg" variant="primary">
                  Save Schedule
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
