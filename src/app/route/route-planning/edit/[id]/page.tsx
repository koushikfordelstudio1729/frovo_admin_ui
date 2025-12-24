"use client";

import {
  BackHeader,
  Button,
  Input,
  Label,
  Radio,
  Select,
  Textarea,
} from "@/components";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { routeAPI } from "@/services/routeAPI";
import { areaAPI } from "@/services/areaAPI";
import { UpdateRoutePayload, FrequencyType, WeekDay, RouteData } from "@/types/route.types";
import { toast } from "react-hot-toast";
import MultiSelect from "@/components/common/MultiSelect/MultiSelect";

const WEEK_DAYS: WeekDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Dummy machines for testing
const DUMMY_MACHINES = [
  { value: "VM-401", label: "VM-401" },
  { value: "VM-402", label: "VM-402" },
  { value: "VM-403", label: "VM-403" },
  { value: "VM-404", label: "VM-404" },
  { value: "VM-405", label: "VM-405" },
  { value: "VM-406", label: "VM-406" },
  { value: "VM-407", label: "VM-407" },
  { value: "VM-408", label: "VM-408" },
];

const EditRoute = () => {
  const router = useRouter();
  const params = useParams();
  const routeId = params.id as string;

  // Form state
  const [routeName, setRouteName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>("daily");
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [customDates, setCustomDates] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [machineSequence, setMachineSequence] = useState<string[]>([]);

  // Options
  const [areaOptions, setAreaOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [availableMachines, setAvailableMachines] = useState<{ value: string; label: string }[]>(DUMMY_MACHINES);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [areasLoading, setAreasLoading] = useState(false);

  // Fetch existing route data
  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        setInitialLoading(true);
        const response = await routeAPI.getRouteById(routeId);

        if (response.success && response.data) {
          const route = response.data;

          setRouteName(route.route_name);
          setAreaId(route.area_name._id || route.area_name);
          setRouteDescription(route.route_description || "");

          // Merge selected_machine and machine_sequence to ensure all machines in sequence are selected
          const machinesFromSequence = route.machine_sequence || [];
          const machinesFromSelected = route.selected_machine || [];
          const allMachines = Array.from(new Set([...machinesFromSelected, ...machinesFromSequence]));

          setSelectedMachines(allMachines);
          setFrequencyType(route.frequency_type);
          setWeeklyDays(route.weekly_days || []);
          setNotes(route.notes || "");
          setMachineSequence(route.machine_sequence || []);

          // Handle custom dates
          if (route.custom_dates && route.custom_dates.length > 0) {
            const formattedDates = route.custom_dates.map((date: string) => {
              const d = new Date(date);
              return d.toISOString().split("T")[0];
            });
            setCustomDates(formattedDates);
          }
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        toast.error("Failed to load route data");
        router.push("/route/route-planning");
      } finally {
        setInitialLoading(false);
      }
    };

    if (routeId) {
      fetchRouteData();
    }
  }, [routeId]);

  // Fetch areas on mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setAreasLoading(true);
        const response = await areaAPI.getAllAreas(1, 100);
        if (response.success && response.data) {
          const options = response.data.map((area) => ({
            label: area.area_name,
            value: area._id,
          }));
          setAreaOptions(options);
        }
      } catch (error) {
        console.error("Error fetching areas:", error);
        toast.error("Failed to load areas");
      } finally {
        setAreasLoading(false);
      }
    };

    fetchAreas();
  }, []);

  // Fetch machines when area is selected
  useEffect(() => {
    const fetchAreaMachines = async () => {
      if (!areaId) {
        setAvailableMachines(DUMMY_MACHINES);
        return;
      }

      try {
        const response = await areaAPI.getAreaById(areaId);
        if (response.success && response.data) {
          const machines = response.data.select_machine || [];
          const machineArray = Array.isArray(machines) ? machines : [machines];
          const formattedMachines = machineArray.map(m => ({ value: m, label: m }));
          setAvailableMachines(formattedMachines);
        }
      } catch (error) {
        console.error("Error fetching area machines:", error);
        toast.error("Failed to load machines for selected area");
        setAvailableMachines(DUMMY_MACHINES);
      }
    };

    fetchAreaMachines();
  }, [areaId]);

  // Clear machine sequence when switching to custom frequency type
  useEffect(() => {
    if (frequencyType === "custom") {
      setMachineSequence([]);
    }
  }, [frequencyType]);

  // Handle custom date changes
  const handleCustomDateChange = (index: number, value: string) => {
    const newDates = [...customDates];
    newDates[index] = value;
    setCustomDates(newDates);
  };

  const addCustomDate = () => {
    setCustomDates([...customDates, ""]);
  };

  const removeCustomDate = (index: number) => {
    if (customDates.length > 1) {
      const newDates = customDates.filter((_, i) => i !== index);
      setCustomDates(newDates);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!routeName.trim()) {
      toast.error("Route name is required");
      return;
    }

    if (!routeDescription.trim()) {
      toast.error("Route description is required");
      return;
    }

    if (selectedMachines.length === 0) {
      toast.error("Please select at least one machine");
      return;
    }

    if (frequencyType === "weekly" && weeklyDays.length === 0) {
      toast.error("Please select at least one day for weekly route");
      return;
    }

    if (frequencyType === "custom") {
      const validDates = customDates.filter((date) => date.trim() !== "");
      if (validDates.length === 0) {
        toast.error("Please add at least one custom date");
        return;
      }
    }

    try {
      setLoading(true);

      // Base payload for all frequency types
      const payload: UpdateRoutePayload = {
        route_name: routeName,
        route_description: routeDescription,
        selected_machine: selectedMachines,
        frequency_type: frequencyType,
      };

      // Add notes if provided
      if (notes && notes.trim()) {
        payload.notes = notes;
      }

      // Add frequency-specific fields
      if (frequencyType === "daily") {
        // Daily: include machine_sequence
        payload.machine_sequence = machineSequence.length > 0 ? machineSequence : selectedMachines;
      } else if (frequencyType === "weekly") {
        // Weekly: include weekly_days and machine_sequence
        payload.weekly_days = weeklyDays;
        payload.machine_sequence = machineSequence.length > 0 ? machineSequence : selectedMachines;
      } else if (frequencyType === "custom") {
        // Custom: include custom_dates (NO machine_sequence)
        payload.custom_dates = customDates.filter((date) => date.trim() !== "");
      }

      const response = await routeAPI.updateRoute(routeId, payload);

      if (response.success) {
        toast.success("Route updated successfully");
        router.push("/route/route-planning");
      }
    } catch (error: any) {
      console.error("Error updating route:", error);
      toast.error(error?.response?.data?.message || "Failed to update route");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen pt-12 flex justify-center items-center">
        <div className="text-gray-500">Loading route data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-4">
      <BackHeader title="Edit Route" />
      <div className="bg-white rounded-xl w-full">
        <div className="p-10 grid grid-cols-2 gap-8">
          <div>
            <Input
              label="Route Name"
              variant="orange"
              placeholder="Enter Route Name"
              className="w-full"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />

            <div className="mt-8">
              <Select
                label="Choose Area"
                placeholder={areasLoading ? "Loading areas..." : "Select Area"}
                selectClassName="py-4 px-4"
                variant="orange"
                value={areaId}
                onChange={setAreaId}
                options={areaOptions}
                disabled={areasLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Current area will be maintained. Change only if necessary.
              </p>
            </div>

            <div className="mt-8">
              <Textarea
                label="Route Description"
                variant="orange"
                placeholder="Enter route description..."
                className="h-32 w-full"
                rows={4}
                value={routeDescription}
                onChange={(e) => setRouteDescription(e.target.value)}
              />
            </div>

            <div className="mt-8">
              <Label className="text-xl mb-2">Select Machines</Label>
              <MultiSelect
                options={availableMachines}
                value={selectedMachines}
                onChange={setSelectedMachines}
                placeholder={
                  availableMachines.length > 0
                    ? "Select machines"
                    : "No machines available"
                }
                disabled={availableMachines.length === 0}
              />
            </div>

            <div className="mt-10">
              <div>
                <Label className="text-xl">Frequency Type</Label>
              </div>
              <div className="my-4">
                <Radio
                  label="Daily"
                  value="daily"
                  selectedValue={frequencyType}
                  onChange={(value) => setFrequencyType(value as FrequencyType)}
                />
              </div>
              <div className="my-4">
                <Radio
                  label="Weekly"
                  value="weekly"
                  selectedValue={frequencyType}
                  onChange={(value) => setFrequencyType(value as FrequencyType)}
                />
              </div>
              <div className="my-4">
                <Radio
                  label="Custom Dates"
                  value="custom"
                  selectedValue={frequencyType}
                  onChange={(value) => setFrequencyType(value as FrequencyType)}
                />
              </div>
            </div>

            {/* Weekly Days Selection */}
            {frequencyType === "weekly" && (
              <div className="mt-6">
                <Label className="text-lg mb-2">Select Days</Label>
                <div className="grid grid-cols-2 gap-2">
                  {WEEK_DAYS.map((day) => (
                    <label
                      key={day}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={weeklyDays.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWeeklyDays([...weeklyDays, day]);
                          } else {
                            setWeeklyDays(weeklyDays.filter((d) => d !== day));
                          }
                        }}
                        className="w-4 h-4 text-orange-500"
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Dates Selection */}
            {frequencyType === "custom" && (
              <div className="mt-6">
                <Label className="text-lg mb-2">Custom Dates</Label>
                <div className="space-y-2">
                  {customDates.map((date, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="date"
                        variant="orange"
                        value={date}
                        onChange={(e) =>
                          handleCustomDateChange(index, e.target.value)
                        }
                        className="flex-1"
                      />
                      {customDates.length > 1 && (
                        <Button
                          variant="outline"
                          onClick={() => removeCustomDate(index)}
                          className="px-4"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addCustomDate}
                    className="w-full"
                  >
                    + Add Another Date
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <Textarea
              label="Optional Notes"
              variant="orange"
              placeholder="Enter Notes..."
              textareaClassName="h-40"
              rows={7}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {/* Machine Sequence - Only for Daily and Weekly routes */}
            {frequencyType !== "custom" && (
              <div>
                <Label className="text-xl mb-2">Machine Sequence (Optional)</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Drag to reorder machines, or leave empty to use selection order
                </p>
                <MultiSelect
                  options={availableMachines.filter(m => selectedMachines.includes(m.value))}
                  value={machineSequence}
                  onChange={setMachineSequence}
                  placeholder="Reorder selected machines"
                  disabled={selectedMachines.length === 0}
                />
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Label className="text-lg mb-3 text-gray-900">Summary</Label>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Route:</span>{" "}
                  <span className="text-gray-900">{routeName || "Not set"}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Area:</span>{" "}
                  <span className="text-gray-900">
                    {areaOptions.find((a) => a.value === areaId)?.label || "Not selected"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Machines:</span>{" "}
                  <span className="text-gray-900">{selectedMachines.length} selected</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Frequency:</span>{" "}
                  <span className="text-gray-900">
                    {frequencyType.charAt(0).toUpperCase() + frequencyType.slice(1)}
                  </span>
                </div>
                {frequencyType === "weekly" && (
                  <div>
                    <span className="font-semibold text-gray-700">Days:</span>{" "}
                    <span className="text-gray-900">{weeklyDays.join(", ") || "None selected"}</span>
                  </div>
                )}
                {frequencyType === "custom" && (
                  <div>
                    <span className="font-semibold text-gray-700">Dates:</span>{" "}
                    <span className="text-gray-900">{customDates.filter((d) => d).length} date(s)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 pb-8">
          <Button
            variant="outline"
            className="rounded-lg px-8"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="rounded-lg px-8"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Route"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditRoute;
