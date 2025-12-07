"use client";

import { Badge, Button, Input, Label, Pagination, Table } from "@/components";
import { Eye, Edit2, Trash2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const routeTableColumns = [
  { label: "Route Name", key: "route_name" },
  { label: "Area", key: "area" },
  { label: "Machines in Sequence", key: "machine_sequence" },
  { label: "Visit Frequency", key: "visit_frequency" },
  { label: "Actions", key: "actions" },
];

const routeTableData = [
  {
    route_name: "Route 12 – IT Park Cluster",
    area: "HSR Layout",
    machine_sequence: "14 Machines",
    visit_frequency: "Daily",
  },
  {
    route_name: "Route 12 – IT Park Cluster",
    area: "HSR Layout",
    machine_sequence: "14 Machines",
    visit_frequency: "Weekly",
  },
  {
    route_name: "Route 12 – IT Park Cluster",
    area: "HSR Layout",
    machine_sequence: "14 Machines",
    visit_frequency: "10 Days",
  },
  {
    route_name: "Route 12 – IT Park Cluster",
    area: "HSR Layout",
    machine_sequence: "14 Machines",
    visit_frequency: "Weekly",
  },
  {
    route_name: "Route 12 – IT Park Cluster",
    area: "HSR Layout",
    machine_sequence: "14 Machines",
    visit_frequency: "10 Days",
  },
  {
    route_name: "Route 12 – IT Park Cluster",
    area: "HSR Layout",
    machine_sequence: "14 Machines",
    visit_frequency: "Weekly",
  },
  {
    route_name: "Route 12 – IT Park Cluster",
    area: "HSR Layout",
    machine_sequence: "14 Machines",
    visit_frequency: "10 Days",
  },
];

const renderAreaCell = (key: string, value: any, row?: Record<string, any>) => {
  if (key === "status") {
    const status = (row?.status as string) || "";
    const variant = status === "active" ? "active" : "inactive";

    return (
      <Badge
        label={status === "active" ? "Active" : "Inactive"}
        variant={variant}
        size="md"
        showDot
        className="px-6 py-2 text-sm"
      />
    );
  }

  if (key === "actions") {
    return (
      <div className="flex items-center gap-3">
        <button className="text-green-500" type="button">
          <Eye size={18} />
        </button>
        <button className="text-blue-500" type="button">
          <Edit2 size={18} />
        </button>
        <button className="text-red-500" type="button">
          <Trash2 size={18} />
        </button>
      </div>
    );
  }

  return value;
};

const RoutePlanning = () => {
  const router = useRouter();
  const Create_Route = "/route/route-planning/create-route";
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.max(1, Math.ceil(routeTableData.length / pageSize));

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return routeTableData.slice(start, start + pageSize);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen pt-12">
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-end gap-4">
          <div>
            <Input
              label="Search"
              variant="search"
              labelClassName="text-xl"
              placeholder="Search..."
              startIcon={<Search size={18} />}
            />
          </div>
        </div>

        <Button
          className="px-8 h-11 rounded-lg shrink-0"
          variant="primary"
          onClick={() => router.push(Create_Route)}
        >
          + Add Route
        </Button>
      </div>

      <div className="mt-10">
        <Label className="text-xl">Route Listing</Label>
      </div>

      <div className="mt-4">
        <Table
          columns={routeTableColumns}
          data={pagedData}
          renderCell={renderAreaCell}
        />
      </div>
      <div className="mt-2 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default RoutePlanning;
