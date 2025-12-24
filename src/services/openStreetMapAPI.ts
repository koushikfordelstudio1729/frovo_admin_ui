// OpenStreetMap service for fetching streets and routes

interface StreetData {
  name: string;
  type: string;
  coordinates?: [number, number];
}

export const openStreetMapAPI = {
  /**
   * Fetch streets within a radius of given coordinates
   * Uses Overpass API (free, no API key needed)
   */
  getStreetsNearLocation: async (
    latitude: number,
    longitude: number,
    radiusMeters: number = 2000 // Default 2km radius
  ): Promise<StreetData[]> => {
    try {
      // Overpass API query to get all roads/streets within radius
      const query = `
        [out:json];
        (
          way["highway"]["name"](around:${radiusMeters},${latitude},${longitude});
        );
        out body;
        >;
        out skel qt;
      `;

      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch streets from OpenStreetMap");
      }

      const data = await response.json();

      // Extract unique street names
      const streets: StreetData[] = [];
      const seenNames = new Set<string>();

      data.elements?.forEach((element: any) => {
        if (element.tags?.name && !seenNames.has(element.tags.name)) {
          seenNames.add(element.tags.name);
          streets.push({
            name: element.tags.name,
            type: element.tags.highway || "road",
            coordinates: element.lat && element.lon ? [element.lat, element.lon] : undefined,
          });
        }
      });

      // Sort alphabetically
      streets.sort((a, b) => a.name.localeCompare(b.name));

      return streets;
    } catch (error) {
      console.error("Error fetching streets from OpenStreetMap:", error);
      return [];
    }
  },

  /**
   * Search streets by name using Nominatim
   * Alternative method for searching specific street names
   */
  searchStreetByName: async (
    streetName: string,
    city?: string,
    country: string = "India"
  ): Promise<StreetData[]> => {
    try {
      const searchQuery = city
        ? `${streetName}, ${city}, ${country}`
        : `${streetName}, ${country}`;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(searchQuery)}` +
          `&format=json` +
          `&addressdetails=1` +
          `&limit=10`,
        {
          headers: {
            "User-Agent": "Frovo-Admin-App",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to search street");
      }

      const data = await response.json();

      const streets: StreetData[] = data.map((item: any) => ({
        name: item.display_name.split(",")[0],
        type: item.type || "road",
        coordinates: [parseFloat(item.lat), parseFloat(item.lon)],
      }));

      return streets;
    } catch (error) {
      console.error("Error searching street:", error);
      return [];
    }
  },
};
