"use client";

import {
  BackHeader,
  Button,
  Input,
  Label,
  MultiSelect,
  Textarea,
  Toggle,
} from "@/components";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { areaAPI } from "@/services/areaAPI";
import type { UpdateAreaPayload, Area } from "@/types";

const machines = [
  { label: "VM-101", value: "VM-101" },
  { label: "VM-102", value: "VM-102" },
  { label: "VM-103", value: "VM-103" },
  { label: "VM-150", value: "VM-150" },
  { label: "VM-151", value: "VM-151" },
  { label: "VM-214", value: "VM-214" },
  { label: "VM-332", value: "VM-332" },
  { label: "VM-457", value: "VM-457" },
  { label: "VM-629", value: "VM-629" },
];

const EditArea = () => {
  const router = useRouter();
  const params = useParams();
  const areaId = params.id as string;

  const [areaName, setAreaName] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [areaDescription, setAreaDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch area data on mount
  useEffect(() => {
    const fetchArea = async () => {
      try {
        setIsFetching(true);
        const response = await areaAPI.getAreaById(areaId);

        if (response.success) {
          const area = response.data;
          setAreaName(area.area_name);
          setSelectedMachines(area.select_machine || []);
          setAreaDescription(area.area_description);
          setIsActive(area.status === "active");
          setLatitude(area.latitude?.toString() || "");
          setLongitude(area.longitude?.toString() || "");
          setAddress(area.address || "");
        }
      } catch (error: any) {
        console.error("Error fetching area:", error);
        alert(error?.response?.data?.message || "Failed to fetch area details");
        router.push("/route/area-definitions");
      } finally {
        setIsFetching(false);
      }
    };

    if (areaId) {
      fetchArea();
    }
  }, [areaId]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!areaName.trim()) {
        alert("Please enter area name");
        return;
      }

      if (selectedMachines.length === 0) {
        alert("Please select at least one machine");
        return;
      }

      if (!areaDescription.trim()) {
        alert("Please enter area description");
        return;
      }

      const payload: UpdateAreaPayload = {
        area_name: areaName,
        select_machine: selectedMachines,
        area_description: areaDescription,
        status: isActive ? "active" : "inactive",
      };

      // Add optional fields if provided
      if (latitude && !isNaN(parseFloat(latitude))) {
        payload.latitude = parseFloat(latitude);
      }
      if (longitude && !isNaN(parseFloat(longitude))) {
        payload.longitude = parseFloat(longitude);
      }
      if (address.trim()) {
        payload.address = address;
      }

      const response = await areaAPI.updateArea(areaId, payload);

      if (response.success) {
        alert(response.message || "Area updated successfully");
        router.push("/route/area-definitions");
      } else {
        alert("Failed to update area");
      }
    } catch (error: any) {
      console.error("Error updating area:", error);
      alert(error?.response?.data?.message || "Failed to update area");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-xl">Loading area details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <BackHeader title="Edit Area" />
      <div className="bg-white rounded-xl w-full">
        <div className="p-10 grid grid-cols-2 gap-8">
          <div>
            <Input
              label="Area Name"
              variant="orange"
              placeholder="Enter Area Name"
              className="w-full"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
            />

            <div className="mt-8">
              <MultiSelect
                label="Select Machines"
                placeholder="Select machines"
                selectClassName="py-4 px-4"
                variant="orange"
                value={selectedMachines}
                onChange={setSelectedMachines}
                options={machines}
              />
            </div>

            <div className="mt-8">
              <Input
                label="Latitude (Optional)"
                variant="orange"
                placeholder="Enter Latitude"
                className="w-full"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>

            <div className="mt-8">
              <Input
                label="Longitude (Optional)"
                variant="orange"
                placeholder="Enter Longitude"
                className="w-full"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <Textarea
              label="Area Description"
              variant="orange"
              placeholder="Enter Area Description"
              className="w-full"
              rows={7}
              value={areaDescription}
              onChange={(e) => setAreaDescription(e.target.value)}
            />

            <Textarea
              label="Address (Optional)"
              variant="orange"
              placeholder="Enter Address"
              className="w-full"
              rows={5}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <div className="mb-2">
              <Label>Status</Label>
            </div>
            <Toggle
              enabled={isActive}
              onChange={setIsActive}
              label="Active / Inactive"
            />
          </div>
        </div>
        <div className="flex justify-center gap-4 pb-12">
          <Button
            className="px-12 rounded-lg"
            variant="secondary"
            onClick={() => router.push("/route/area-definitions")}
          >
            Cancel
          </Button>
          <Button
            className="px-12 rounded-lg"
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditArea;
