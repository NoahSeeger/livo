"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { TravelLocation, TravelStatus } from "@/types";
import WorldMap from "@/components/WorldMap";

export default function Travel() {
  const [locations, setLocations] = useState<TravelLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("travel_locations")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryClick = async (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleStatusChange = async (status: TravelStatus) => {
    if (!selectedCountry) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const existingLocation = locations.find(
        (loc) => loc.country_code === selectedCountry
      );

      if (existingLocation) {
        const { error } = await supabase
          .from("travel_locations")
          .update({ status })
          .eq("id", existingLocation.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("travel_locations").insert([
          {
            user_id: user.id,
            country_code: selectedCountry,
            status,
          },
        ]);

        if (error) throw error;
      }

      fetchLocations();
      setSelectedCountry(null);
    } catch (error) {
      console.error("Error updating location status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const visitedCountries = locations.filter((loc) => loc.status === "visited");
  const wantToVisitCountries = locations.filter(
    (loc) => loc.status === "want_to_visit"
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Travel Map</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">
              {visitedCountries.length} Visited
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">
              {wantToVisitCountries.length} Want to Visit
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <WorldMap
          visitedCountries={visitedCountries.map((loc) => loc.country_code)}
          wantToVisitCountries={wantToVisitCountries.map(
            (loc) => loc.country_code
          )}
          onCountryClick={handleCountryClick}
        />
      </div>

      {selectedCountry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              Update {selectedCountry}
            </h2>
            <div className="space-y-4">
              <button
                onClick={() => handleStatusChange("visited")}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Mark as Visited
              </button>
              <button
                onClick={() => handleStatusChange("want_to_visit")}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
              >
                Want to Visit
              </button>
              <button
                onClick={() => setSelectedCountry(null)}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
