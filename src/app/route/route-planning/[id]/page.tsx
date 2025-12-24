"use client";

import { BackHeader, Badge, Button, Label, LocationViewer } from "@/components";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { routeAPI } from "@/services/routeAPI";
import { openStreetMapAPI } from "@/services/openStreetMapAPI";
import { RouteData } from "@/types/route.types";
import { toast } from "react-hot-toast";
import { Edit2, Trash2, MapPin, Calendar, Package } from "lucide-react";

const RouteDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const routeId = params.id as string;

  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Route location (geocoded from route name)
  const [routeLocation, setRouteLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        setLoading(true);
        const response = await routeAPI.getRouteById(routeId);

        if (response.success) {
          setRoute(response.data);
        }
      } catch (error) {
        console.error("Error fetching route details:", error);
        toast.error("Failed to load route details");
        router.push("/route/route-planning");
      } finally {
        setLoading(false);
      }
    };

    if (routeId) {
      fetchRouteDetails();
    }
  }, [routeId]);

  // Geocode route name to get exact location
  useEffect(() => {
    const geocodeRouteName = async () => {
      if (!route) {
        console.log("No route data available");
        return;
      }

      console.log("Route data:", route);
      console.log("Area name:", route.area_name);

      // Check if area_name is an object (AreaInfo) and has coordinates
      const areaInfo = typeof route.area_name === 'object' ? route.area_name : null;

      console.log("Area info:", areaInfo);
      console.log("Latitude:", areaInfo?.latitude);
      console.log("Longitude:", areaInfo?.longitude);

      // First, set fallback to area location if coordinates exist
      if (areaInfo?.latitude && areaInfo?.longitude) {
        console.log("Setting area location:", areaInfo.latitude, areaInfo.longitude);
        setRouteLocation({
          latitude: areaInfo.latitude,
          longitude: areaInfo.longitude,
          name: areaInfo.area_name || "Area Location",
        });
      } else {
        console.log("No coordinates available for area");
      }

      // Check if route name looks like a real street (contains street keywords)
      const streetKeywords = ['road', 'street', 'avenue', 'lane', 'cross', 'main', 'circle', 'layout', 'sector', 'block'];
      const looksLikeStreet = route.route_name && streetKeywords.some(keyword =>
        route.route_name.toLowerCase().includes(keyword)
      );

      // Only try to geocode if route name looks like a real street
      if (looksLikeStreet && areaInfo?.area_name) {
        try {
          console.log("Route name looks like a street, geocoding:", route.route_name);
          // Search for the route/street coordinates
          let streets = await openStreetMapAPI.searchStreetByName(
            route.route_name,
            areaInfo.area_name
          );

          console.log("Geocoding results (with area context):", streets);

          // If no results, try searching with just the route name
          if (streets.length === 0) {
            console.log("No results with area context, trying without area...");
            streets = await openStreetMapAPI.searchStreetByName(route.route_name);
            console.log("Geocoding results (without area context):", streets);
          }

          if (streets.length > 0 && streets[0].coordinates) {
            // Update to exact route location
            console.log("Setting exact route location:", streets[0].coordinates);
            setRouteLocation({
              latitude: streets[0].coordinates[0],
              longitude: streets[0].coordinates[1],
              name: route.route_name,
            });
          } else {
            console.log("No geocoding results found, keeping area location");
          }
        } catch (error) {
          console.error("Error geocoding route name:", error);
          // Keep the area location fallback that was already set
        }
      } else {
        console.log("Route name appears to be custom (not a street name), using area location only");
      }
    };

    geocodeRouteName();
  }, [route]);

  const handleEdit = () => {
    router.push(`/route/route-planning/edit/${routeId}`);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      const response = await routeAPI.deleteRoute(routeId);

      if (response.success) {
        toast.success("Route deleted successfully");
        router.push("/route/route-planning");
      }
    } catch (error) {
      console.error("Error deleting route:", error);
      toast.error("Failed to delete route");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  const getFrequencyBadgeVariant = (frequency: string): "active" | "inactive" | "pending" => {
    if (frequency === "daily") return "active";
    if (frequency === "weekly") return "pending";
    return "inactive";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-12 flex justify-center items-center">
        <div className="text-gray-500">Loading route details...</div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="min-h-screen pt-12 flex justify-center items-center">
        <div className="text-gray-500">Route not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-4">
      <BackHeader title="Route Details" />

      <div className="bg-white rounded-xl w-full p-10">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{route.route_name}</h1>
            <p className="text-gray-600 mt-2">{route.route_description}</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-lg px-6 flex items-center gap-2"
              onClick={handleEdit}
            >
              <Edit2 size={18} />
              Edit
            </Button>
            <Button
              variant="outline"
              className="rounded-lg px-6 flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50"
              onClick={handleDeleteClick}
              disabled={deleting}
            >
              <Trash2 size={18} />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Area Information */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-orange-500" size={20} />
              <Label className="text-xl">Area Information</Label>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Area Name</span>
                <p className="text-lg font-semibold text-gray-900">
                  {route.area_name?.area_name || "N/A"}
                </p>
              </div>
              {route.area_name?.address && (
                <div>
                  <span className="text-sm text-gray-500">Address</span>
                  <p className="text-sm text-gray-700">{route.area_name.address}</p>
                </div>
              )}
              {route.area_name?.latitude && route.area_name?.longitude && (
                <div>
                  <span className="text-sm text-gray-500">Coordinates</span>
                  <p className="text-sm text-gray-700">
                    {route.area_name.latitude}, {route.area_name.longitude}
                  </p>
                </div>
              )}
              {route.area_name?.status && (
                <div>
                  <span className="text-sm text-gray-500">Area Status</span>
                  <div className="mt-1">
                    <Badge
                      label={route.area_name.status === "active" ? "Active" : "Inactive"}
                      variant={route.area_name.status === "active" ? "active" : "inactive"}
                      size="md"
                      showDot
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Frequency Information */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-orange-500" size={20} />
              <Label className="text-xl">Schedule</Label>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Frequency Type</span>
                <div className="mt-1">
                  <Badge
                    label={route.frequency_type.charAt(0).toUpperCase() + route.frequency_type.slice(1)}
                    variant={getFrequencyBadgeVariant(route.frequency_type)}
                    size="md"
                    showDot
                  />
                </div>
              </div>

              {route.frequency_type === "weekly" && route.weekly_days && (
                <div>
                  <span className="text-sm text-gray-500">Weekly Days</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {route.weekly_days.map((day, index) => (
                      <Badge
                        key={index}
                        label={day}
                        variant="pending"
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              )}

              {route.frequency_type === "custom" && route.custom_dates && (
                <div>
                  <span className="text-sm text-gray-500">Custom Dates</span>
                  <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {route.custom_dates.map((date, index) => (
                      <div key={index} className="text-sm bg-gray-50 px-3 py-1 rounded">
                        {formatDate(date)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Machines Section */}
        <div className="border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="text-orange-500" size={20} />
              <Label className="text-xl">Machines</Label>
            </div>
            <Badge
              label={`${route.machine_count || route.selected_machine.length} Machines`}
              variant="active"
              size="md"
            />
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-500 mb-2 block">Selected Machines</span>
              <div className="flex flex-wrap gap-2">
                {route.selected_machine.map((machine, index) => (
                  <div
                    key={index}
                    className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg font-medium"
                  >
                    {machine}
                  </div>
                ))}
              </div>
            </div>

            {route.machine_sequence && route.machine_sequence.length > 0 && (
              <div>
                <span className="text-sm text-gray-500 mb-2 block">Machine Sequence</span>
                <div className="flex flex-wrap gap-2">
                  {route.machine_sequence.map((machine, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                      <span className="text-xs bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      {machine}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Map */}
        {routeLocation ? (
          <div className="mb-8">
            <LocationViewer
              latitude={routeLocation.latitude}
              longitude={routeLocation.longitude}
              areaName={routeLocation.name}
              address={typeof route.area_name === 'object' ? route.area_name.address : undefined}
            />
          </div>
        ) : (
          typeof route.area_name === 'object' && (
            <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="text-gray-400" size={20} />
                <Label className="text-lg text-gray-600">Location</Label>
              </div>
              <p className="text-sm text-gray-500">
                No location coordinates available for this area. Please add coordinates to the area to see the map.
              </p>
            </div>
          )
        )}

        {/* Notes Section */}
        {route.notes && (
          <div className="border rounded-lg p-6 mb-8">
            <Label className="text-xl mb-3">Notes</Label>
            <p className="text-gray-700 whitespace-pre-wrap">{route.notes}</p>
          </div>
        )}

        {/* Metadata Section */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div>
              <span className="font-semibold">Created At:</span>{" "}
              {formatDate(route.createdAt)}
            </div>
            <div>
              <span className="font-semibold">Last Updated:</span>{" "}
              {formatDate(route.updatedAt)}
            </div>
            <div>
              <span className="font-semibold">Route ID:</span> {route._id}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)' }}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Route
                </h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this route? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    className="rounded-lg px-6"
                    onClick={handleDeleteCancel}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="rounded-lg px-6 bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteDetailPage;
