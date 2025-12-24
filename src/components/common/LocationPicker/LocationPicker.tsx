"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Search, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number, address?: string) => void;
  className?: string;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition }: any) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Component to update map center
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  className = "",
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Default center (Bangalore, India)
  const defaultCenter: [number, number] = [12.9716, 77.5946];
  const center = position || defaultCenter;

  useEffect(() => {
    if (position) {
      onLocationChange(position[0], position[1]);
      // Reverse geocode to get address
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.display_name) {
            onLocationChange(position[0], position[1], data.display_name);
          }
        })
        .catch((err) => console.error("Reverse geocoding error:", err));
    }
  }, [position]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setPosition([lat, lng]);
    setSearchQuery(result.display_name);
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <label className="block text-xl font-medium mb-2 text-gray-900">
          Location
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Search for a location or click on the map to set coordinates
        </p>

        {/* Search Box */}
        <div className="relative">
          <div className="flex items-center border-2 border-orange-300 rounded-lg px-4 py-3 bg-white">
            <Search size={20} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search for a location..."
              className="flex-1 outline-none text-base text-gray-900 placeholder-gray-400"
            />
            {isSearching && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-30 w-full mt-2 bg-white border-2 border-orange-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 border-b border-gray-100 flex items-start gap-2"
                >
                  <MapPin size={16} className="text-orange-500 mt-1 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{result.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="border-2 border-orange-300 rounded-lg overflow-hidden">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          className="z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
          <ChangeView center={center} />
        </MapContainer>
      </div>

      {/* Selected Coordinates Display */}
      {position && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-blue-600" />
            <span className="font-medium text-blue-900">
              Latitude: {position[0].toFixed(6)}, Longitude: {position[1].toFixed(6)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
