"use client";

import {
  Badge,
  Button,
  Input,
  Label,
  Pagination,
  Select,
  Table,
} from "@/components";
import { Eye, Edit2, Trash2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const areaTableColumns = [
  { label: "Area Name", key: "area_name" },
  { label: "Area Manager", key: "area_manager" },
  { label: "Machines Assigned", key: "machines_assigned" },
  { label: "Status", key: "status" },
  { label: "Actions", key: "actions" },
];

const areaTableData = [
  {
    area_name: "HSR Layout - Sector 2",
    area_manager: "Rohit Sharma",
    machines_assigned: 3,
    status: "active",
  },
  {
    area_name: "HSR Layout - Sector 2",
    area_manager: "Abhishek Sharma",
    machines_assigned: 3,
    status: "inactive",
  },
  {
    area_name: "HSR Layout - Sector 2",
    area_manager: "Rohit Sharma",
    machines_assigned: 3,
    status: "active",
  },
  {
    area_name: "HSR Layout - Sector 2",
    area_manager: "Abhishek Sharma",
    machines_assigned: 3,
    status: "inactive",
  },
  {
    area_name: "HSR Layout - Sector 2",
    area_manager: "Rohit Sharma",
    machines_assigned: 3,
    status: "active",
  },
  {
    area_name: "HSR Layout - Sector 2",
    area_manager: "Abhishek Sharma",
    machines_assigned: 3,
    status: "inactive",
  },
  {
    area_name: "HSR Layout - Sector 2",
    area_manager: "Rohit Sharma",
    machines_assigned: 3,
    status: "active",
  },
  {
    area_name: "HSR Layout - Sector 2",
    area_manager: "Abhishek Sharma",
    machines_assigned: 3,
    status: "inactive",
  },
];

// separate render function
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

const AreaDefinitions = () => {
  const router = useRouter();
  const Create_Area = "/route/area-definitions/create-area";
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(areaTableData.length / pageSize));

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return areaTableData.slice(start, start + pageSize);
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

          <div>
            <Select
              label="Status"
              placeholder="Select status"
              selectClassName="py-2 px-4"
              value={status}
              onChange={setStatus}
              options={statusOptions}
            />
          </div>
        </div>

        <Button
          className="px-8 h-11 rounded-lg shrink-0"
          variant="primary"
          onClick={() => router.push(Create_Area)}
        >
          + Add Area
        </Button>
      </div>

      <div className="mt-10">
        <Label className="text-xl">Area Table</Label>
      </div>

      <div className="mt-4">
        <Table
          columns={areaTableColumns}
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

export default AreaDefinitions;
