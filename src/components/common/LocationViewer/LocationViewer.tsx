"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationViewerProps {
  latitude: number;
  longitude: number;
  areaName?: string;
  address?: string;
  className?: string;
}

export const LocationViewer: React.FC<LocationViewerProps> = ({
  latitude,
  longitude,
  areaName,
  address,
  className = "",
}) => {
  const position: [number, number] = [latitude, longitude];

  return (
    <div className={`${className}`}>
      <label className="block text-gray-500 text-sm font-medium mb-2">
        Location on Map
      </label>

      {/* Map */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "300px", width: "100%" }}
          scrollWheelZoom={false}
          className="z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-sm">
                <strong>{areaName || "Location"}</strong>
                {address && <p className="mt-1 text-gray-600">{address}</p>}
                <p className="mt-2 text-xs text-gray-500">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Coordinates Display */}
      <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-gray-600" />
          <span className="text-gray-700">
            Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LocationViewer;
