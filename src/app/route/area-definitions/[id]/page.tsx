"use client";

import { BackHeader, Badge, Button, Label, LocationViewer } from "@/components";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { areaAPI } from "@/services/areaAPI";
import type { Area } from "@/types";
import { Edit2 } from "lucide-react";

const ViewArea = () => {
  const router = useRouter();
  const params = useParams();
  const areaId = params.id as string;

  const [area, setArea] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArea = async () => {
      try {
        setIsLoading(true);
        const response = await areaAPI.getAreaById(areaId);

        if (response.success) {
          setArea(response.data);
        }
      } catch (error: any) {
        console.error("Error fetching area:", error);
        alert(error?.response?.data?.message || "Failed to fetch area details");
        router.push("/route/area-definitions");
      } finally {
        setIsLoading(false);
      }
    };

    if (areaId) {
      fetchArea();
    }
  }, [areaId]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-xl">Loading area details...</div>
      </div>
    );
  }

  if (!area) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-xl">Area not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <BackHeader title="Area Details" />
        <Button
          className="px-6 h-11 rounded-lg"
          variant="primary"
          onClick={() => router.push(`/route/area-definitions/edit/${areaId}`)}
        >
          <Edit2 size={18} className="mr-2" />
          Edit Area
        </Button>
      </div>

      <div className="bg-white rounded-xl w-full p-10">
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <Label className="text-gray-500 text-sm font-medium">Area Name</Label>
              <div className="mt-2 text-lg font-semibold text-gray-900">{area.area_name}</div>
            </div>

            <div>
              <Label className="text-gray-500 text-sm font-medium">Status</Label>
              <div className="mt-2">
                <Badge
                  label={area.status === "active" ? "Active" : "Inactive"}
                  variant={area.status === "active" ? "active" : "inactive"}
                  size="md"
                  showDot
                  className="px-6 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-500 text-sm font-medium">Machines Assigned</Label>
              <div className="mt-2">
                {area.select_machine && area.select_machine.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {area.select_machine.map((machine, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
                      >
                        {machine}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">No machines assigned</div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-gray-500 text-sm font-medium">Total Machines</Label>
              <div className="mt-2 text-lg font-semibold text-gray-900">
                {area.total_machines || area.select_machine?.length || 0}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <Label className="text-gray-500 text-sm font-medium">Area Description</Label>
              <div className="mt-2 text-base text-gray-900 whitespace-pre-wrap">
                {area.area_description || "No description provided"}
              </div>
            </div>

            {area.address && (
              <div>
                <Label className="text-gray-500 text-sm font-medium">Address</Label>
                <div className="mt-2 text-base text-gray-900 whitespace-pre-wrap">
                  {area.address}
                </div>
              </div>
            )}

            <div>
              <Label className="text-gray-500 text-sm font-medium">Created At</Label>
              <div className="mt-2 text-base text-gray-900">
                {new Date(area.createdAt).toLocaleString()}
              </div>
            </div>

            <div>
              <Label className="text-gray-500 text-sm font-medium">Last Updated</Label>
              <div className="mt-2 text-base text-gray-900">
                {new Date(area.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Location Map - Full Width */}
        {area.latitude && area.longitude && (
          <div className="mt-8">
            <LocationViewer
              latitude={area.latitude}
              longitude={area.longitude}
              areaName={area.area_name}
              address={area.address}
            />
          </div>
        )}
        <div className="mt-10 flex justify-center">
          <Button
            className="px-12 rounded-lg"
            variant="secondary"
            onClick={() => router.push("/route/area-definitions")}
          >
            Back to List
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewArea;
