"use client";

import {
  BackHeader,
  Button,
  Input,
  Label,
  LocationPicker,
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
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const handleLocationChange = (lat: number, lng: number, addr?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    if (addr) {
      setAddress(addr);
    }
  };

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
          setLatitude(area.latitude);
          setLongitude(area.longitude);
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
      if (latitude !== undefined) {
        payload.latitude = latitude;
      }
      if (longitude !== undefined) {
        payload.longitude = longitude;
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
    <div className="min-h-screen p-6">
      <BackHeader title="Edit Area" />

      <div className="bg-white rounded-xl w-full shadow-sm">
        {/* Basic Information Section */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Area Name"
              variant="orange"
              placeholder="Enter Area Name"
              className="w-full"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
            />

            <div>
              <Label className="block text-xl font-medium mb-2 text-gray-900">
                Status
              </Label>
              <div className="mt-3">
                <Toggle
                  enabled={isActive}
                  onChange={setIsActive}
                  label="Active / Inactive"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Textarea
              label="Area Description"
              variant="orange"
              placeholder="Enter Area Description"
              className="w-full"
              rows={4}
              value={areaDescription}
              onChange={(e) => setAreaDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Machine Assignment Section */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Machine Assignment</h2>
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

        {/* Location Section */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Location Details</h2>
          <div className="space-y-6">
            <LocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationChange={handleLocationChange}
            />

            <Textarea
              label="Address"
              variant="orange"
              placeholder="Address will be auto-filled from map or you can edit"
              className="w-full"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 flex justify-center gap-4">
          <Button
            className="px-8 rounded-lg"
            variant="secondary"
            onClick={() => router.push("/route/area-definitions")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="px-12 rounded-lg"
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Area"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditArea;
