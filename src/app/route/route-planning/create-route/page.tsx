"use client";

import {
  BackHeader,
  Button,
  Input,
  Label,
  Radio,
  Select,
  Textarea,
  SearchableSelect,
  LocationViewer,
} from "@/components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { routeAPI } from "@/services/routeAPI";
import { areaAPI } from "@/services/areaAPI";
import { openStreetMapAPI } from "@/services/openStreetMapAPI";
import { CreateRoutePayload, FrequencyType, WeekDay } from "@/types/route.types";
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

const CreateRoute = () => {
  const router = useRouter();

  // Form state
  const [routeName, setRouteName] = useState("");
  const [selectedRouteOption, setSelectedRouteOption] = useState("");
  const [customRouteName, setCustomRouteName] = useState("");
  const [areaId, setAreaId] = useState("");
  const [streetName, setStreetName] = useState("");
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
  const [streetOptions, setStreetOptions] = useState<{ value: string; label: string }[]>([]);

  // Selected area location data
  const [selectedAreaLocation, setSelectedAreaLocation] = useState<{
    latitude: number;
    longitude: number;
    areaName: string;
    address?: string;
  } | null>(null);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [areasLoading, setAreasLoading] = useState(false);
  const [streetsLoading, setStreetsLoading] = useState(false);

  // Error states
  const [areaDataError, setAreaDataError] = useState(false);
  const [streetsError, setStreetsError] = useState(false);

  // Fetch areas on mount
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setAreasLoading(true);
        const response = await areaAPI.getAllAreas(1, 100); // Get all areas
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

  // Fetch streets for selected area
  const fetchStreets = async (latitude: number, longitude: number) => {
    try {
      setStreetsLoading(true);
      setStreetsError(false);
      const streets = await openStreetMapAPI.getStreetsNearLocation(
        latitude,
        longitude,
        2000 // 2km radius
      );
      const formattedStreets = streets.map(s => ({ value: s.name, label: s.name }));
      // Add "Custom" option at the top
      formattedStreets.unshift({ value: "custom", label: "Custom (Type your own)" });
      setStreetOptions(formattedStreets);
    } catch (streetError) {
      console.error("Error fetching streets:", streetError);
      toast.error("Failed to load route suggestions");
      // If streets fail, show custom option and set error
      setStreetOptions([{ value: "custom", label: "Custom (Type your own)" }]);
      setStreetsError(true);
    } finally {
      setStreetsLoading(false);
    }
  };

  // Fetch machines and streets when area is selected
  const fetchAreaMachines = async () => {
    if (!areaId) {
      setAvailableMachines(DUMMY_MACHINES);
      setStreetOptions([]);
      setStreetName("");
      setSelectedAreaLocation(null);
      setAreaDataError(false);
      setStreetsError(false);
      return;
    }

    try {
      setAreaDataError(false);
      const response = await areaAPI.getAreaById(areaId);
      if (response.success && response.data) {
        const machines = response.data.select_machine || [];
        const machineArray = Array.isArray(machines) ? machines : [machines];
        const formattedMachines = machineArray.map(m => ({ value: m, label: m }));
        setAvailableMachines(formattedMachines);

        // Store location data if coordinates exist
        if (response.data.latitude && response.data.longitude) {
          setSelectedAreaLocation({
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            areaName: response.data.area_name,
            address: response.data.address,
          });

          // Fetch streets if area has coordinates
          await fetchStreets(response.data.latitude, response.data.longitude);
        } else {
          // If no coordinates, clear location and just show custom option
          setSelectedAreaLocation(null);
          setStreetOptions([{ value: "custom", label: "Custom (Type your own)" }]);
          setStreetsError(false);
        }
      }
    } catch (error) {
      console.error("Error fetching area data:", error);
      toast.error("Failed to load area data");
      setAvailableMachines(DUMMY_MACHINES);
      setSelectedAreaLocation(null);
      setStreetOptions([]);
      setStreetsLoading(false);
      setStreetsError(false);
      setAreaDataError(true);
    }
  };

  useEffect(() => {
    fetchAreaMachines();
  }, [areaId]);

  // Clear machine sequence when switching to custom frequency type
  useEffect(() => {
    if (frequencyType === "custom") {
      setMachineSequence([]);
    }
  }, [frequencyType]);

  // Update route name based on selection
  useEffect(() => {
    if (selectedRouteOption === "custom") {
      setRouteName(customRouteName);
    } else if (selectedRouteOption) {
      setRouteName(selectedRouteOption);
    }
  }, [selectedRouteOption, customRouteName]);

  // Update map location when route name is selected
  useEffect(() => {
    const updateMapLocation = async () => {
      // Only geocode if we have a selected route option that's not custom
      // and we have base area location data
      if (!selectedRouteOption || selectedRouteOption === "custom" || !selectedAreaLocation) {
        return;
      }

      // Check if route name looks like a real street
      const streetKeywords = ['road', 'street', 'avenue', 'lane', 'cross', 'main', 'circle', 'layout', 'sector', 'block'];
      const looksLikeStreet = streetKeywords.some(keyword =>
        selectedRouteOption.toLowerCase().includes(keyword)
      );

      if (!looksLikeStreet) {
        console.log("Route name appears to be custom, skipping geocoding:", selectedRouteOption);
        return;
      }

      try {
        // Get the area name for better geocoding context
        const areaName = areaOptions.find(a => a.value === areaId)?.label;

        console.log("Geocoding street:", selectedRouteOption);
        // Search for the street coordinates
        const streets = await openStreetMapAPI.searchStreetByName(
          selectedRouteOption,
          areaName
        );

        if (streets.length > 0 && streets[0].coordinates) {
          console.log("Found street coordinates:", streets[0].coordinates);
          // Update location to the selected street
          setSelectedAreaLocation({
            latitude: streets[0].coordinates[0],
            longitude: streets[0].coordinates[1],
            areaName: selectedRouteOption,
            address: selectedAreaLocation.address,
          });
        } else {
          console.log("No coordinates found for street, keeping area location");
        }
      } catch (error) {
        console.error("Error geocoding street:", error);
        // Keep the original area location if geocoding fails
      }
    };

    updateMapLocation();
  }, [selectedRouteOption, areaId]);

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

    if (!areaId) {
      toast.error("Please select an area");
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
      const payload: CreateRoutePayload = {
        route_name: routeName,
        area_name: areaId,
        route_description: routeDescription,
        selected_machine: selectedMachines,
        frequency_type: frequencyType,
      };

      // Add street name if provided
      if (streetName && streetName.trim()) {
        payload.street_name = streetName;
      }

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

      const response = await routeAPI.createRoute(payload);

      if (response.success) {
        toast.success("Route created successfully");
        router.push("/route/route-planning");
      }
    } catch (error: any) {
      console.error("Error creating route:", error);
      toast.error(error?.response?.data?.message || "Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-4">
      <BackHeader title="Create Route" />
      <div className="bg-white rounded-xl w-full">
        <div className="p-10 grid grid-cols-2 gap-8">
          <div>
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

            {/* Error message with retry button */}
            {areaId && areaDataError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-red-800">Failed to load area data</p>
                    <p className="text-xs text-red-600 mt-1">
                      There was an error loading machines and routes for this area.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="ml-4 text-red-600 border-red-300 hover:bg-red-100 px-4 py-2"
                    onClick={fetchAreaMachines}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {areaId && !areaDataError && (
              <>
                <div className="mt-8">
                  <SearchableSelect
                    label="Route Name"
                    variant="orange"
                    placeholder={
                      streetsLoading
                        ? "Loading routes..."
                        : "Search and select route..."
                    }
                    options={streetOptions}
                    value={selectedRouteOption}
                    onChange={setSelectedRouteOption}
                    helperText={
                      streetOptions.length > 1
                        ? `Found ${streetOptions.length - 1} route suggestions. Select one or choose "Custom" to type your own.`
                        : 'Choose "Custom" to type your own route name.'
                    }
                  />
                </div>

                {/* Streets error with retry button */}
                {streetsError && selectedAreaLocation && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-yellow-800">Failed to load route suggestions</p>
                        <p className="text-xs text-yellow-600 mt-1">
                          Unable to fetch route names from map. You can still use custom route name.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="ml-4 text-yellow-600 border-yellow-300 hover:bg-yellow-100 px-4 py-2"
                        onClick={() => fetchStreets(selectedAreaLocation.latitude, selectedAreaLocation.longitude)}
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                )}

                {selectedRouteOption === "custom" && (
                  <div className="mt-8">
                    <Input
                      label="Custom Route Name"
                      variant="orange"
                      placeholder="Enter your custom route name"
                      className="w-full"
                      value={customRouteName}
                      onChange={(e) => setCustomRouteName(e.target.value)}
                    />
                  </div>
                )}
              </>
            )}

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
                      <span className="text-sm text-gray-900">{day}</span>
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

            {/* Location Map */}
            {selectedAreaLocation && (
              <LocationViewer
                latitude={selectedAreaLocation.latitude}
                longitude={selectedAreaLocation.longitude}
                areaName={selectedAreaLocation.areaName}
                address={selectedAreaLocation.address}
              />
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
            {loading ? "Creating..." : "Create Route"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoute;
