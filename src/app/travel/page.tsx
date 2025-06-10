"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Heart } from "lucide-react";
import dynamic from "next/dynamic";
import {
  getCurrentUserId,
  getTravelExperiences,
  upsertTravelExperience,
  deleteTravelExperience,
} from "@/lib/travelDb"; // Import Supabase functions
import { CountryData, CountryStatus } from "@/components/WorldMap"; // Import CountryData and CountryStatus

interface TravelHintPopupProps {
  onClose: () => void;
  onDisableShowAgain: () => void;
}

const TravelHintPopup: React.FC<TravelHintPopupProps> = ({
  onClose,
  onDisableShowAgain,
}) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-auto text-center border-2 border-orange-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          How to use the map
        </h3>
        <p className="text-base text-gray-600 mb-6 leading-relaxed flex flex-col items-start text-left mx-auto max-w-fit">
          <span>
            <strong className="text-orange-600">Tap 1.</strong> Visited
          </span>
          <span>
            <strong className="text-orange-600">Tap 2.</strong> Want to Visit
          </span>
          <span>
            <strong className="text-gray-500">Tap 3.</strong> Remove it
          </span>
        </p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={onClose}
            className="w-full px-5 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-lg"
          >
            Got it!
          </button>
          <button
            onClick={onDisableShowAgain}
            className="w-full px-5 py-3 rounded-xl border-2 border-orange-100 text-orange-600 font-medium hover:bg-orange-50 transition-colors"
          >
            Don&apos;t show again
          </button>
        </div>
      </div>
    </div>
  );
};

// Removed getCountryFlag utility function as flag is directly from API

interface RestCountry {
  name: { common: string };
  flag: string;
  cca2: string;
  continents: string[];
  unMember: boolean;
}

interface ContinentStats {
  total: number;
  visited: number;
  bucketList: number;
}

interface ContinentDataMap extends Record<string, ContinentStats> {
  World: ContinentStats;
  Continents: ContinentStats;
  Countries: ContinentStats;
}

const DynamicTravelMapCarousel = dynamic(
  () => import("@/components/TravelMapCarousel"),
  { ssr: false }
);

export default function TravelPage() {
  const [userId, setUserId] = useState<string | null>(null); // State to hold the current user ID
  const [selectedCountries, setSelectedCountries] = useState<
    Record<string, CountryData>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedCountries, setFetchedCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Check local storage for hint preference in a separate effect
    if (typeof window !== "undefined") {
      const hintDisabled = localStorage.getItem("travelHintDisabled");
      if (!hintDisabled) {
        setShowHint(true);
      }
    }
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);

      // 1. Get User ID
      const currentUserId = await getCurrentUserId();
      if (!currentUserId) {
        setError(
          "User not authenticated. Please sign in to track your travels."
        );
        setLoading(false);
        return;
      }
      setUserId(currentUserId);

      try {
        // 2. Fetch all countries from restcountries.com
        const [countriesResponse, userExperiences] = await Promise.all([
          fetch(
            "https://restcountries.com/v3.1/all?fields=name,flag,cca2,continents,unMember"
          ),
          getTravelExperiences(currentUserId), // 3. Fetch user's saved experiences
        ]);

        if (!countriesResponse.ok) {
          throw new Error(`HTTP error! status: ${countriesResponse.status}`);
        }
        const countriesData = await countriesResponse.json();

        const initialSelectedCountries: Record<string, CountryData> = {};

        // Transform and merge country data with user experiences
        const transformedCountries: CountryData[] = countriesData
          .filter((country: RestCountry) => country.unMember) // Filter for UN member countries
          .map((country: RestCountry) => {
            const commonName = country.name.common;
            const userExperience = userExperiences.find(
              (exp) => exp.country_code === country.cca2
            );

            let status: CountryStatus = "none";
            if (userExperience) {
              status = userExperience.visited ? "visited" : "bucket-list";
            }

            const countryDataItem: CountryData = {
              name: commonName,
              status: status,
              flag: country.flag,
              cca2: country.cca2,
              continents: country.continents, // Add continents to CountryData
            };
            initialSelectedCountries[commonName] = countryDataItem;
            return countryDataItem;
          });

        // Ensure unique countries by name in the fetched list
        const uniqueTransformedData = Array.from(
          new Set(transformedCountries.map((c) => c.name))
        )
          .map((name) => transformedCountries.find((c) => c.name === name)!)
          .filter(Boolean);

        setFetchedCountries(uniqueTransformedData);
        setSelectedCountries(initialSelectedCountries); // Set initial selected countries based on DB
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [userId]); // Add userId to dependency array

  const allCountries = useMemo(() => {
    if (fetchedCountries.length > 0) {
      return fetchedCountries.map((fc) => ({
        ...fc,
        status: selectedCountries[fc.name]?.status || "none", // Ensure local state reflects status
      }));
    }
    return [];
  }, [fetchedCountries, selectedCountries]);

  const continentData = useMemo((): ContinentDataMap => {
    const data: Record<
      string,
      { total: number; visited: number; bucketList: number }
    > = {};
    const allContinents = new Set<string>();

    fetchedCountries.forEach((country) => {
      if (country.continents && country.continents.length > 0) {
        const continentName = country.continents[0]; // Assuming one continent per country for simplicity
        allContinents.add(continentName);

        if (!data[continentName]) {
          data[continentName] = { total: 0, visited: 0, bucketList: 0 };
        }
        data[continentName].total++;

        if (selectedCountries[country.name]?.status === "visited") {
          data[continentName].visited++;
        } else if (selectedCountries[country.name]?.status === "bucket-list") {
          data[continentName].bucketList++;
        }
      }
    });

    const visitedContinentsCount = Array.from(allContinents).filter(
      (continentName) => data[continentName].visited > 0
    ).length;

    return {
      World: {
        total: 195, // Explicitly set to 195 for UN members + observers
        visited: Object.values(selectedCountries).filter(
          (c) => c.status === "visited"
        ).length,
        bucketList: Object.values(selectedCountries).filter(
          (c) => c.status === "bucket-list"
        ).length,
      },
      Continents: {
        total: allContinents.size,
        visited: visitedContinentsCount,
        bucketList: 0, // Not applicable for continents summary
      },
      Countries: {
        total: 195, // Explicitly set to 195 for UN members + observers
        visited: Object.values(selectedCountries).filter(
          (c) => c.status === "visited"
        ).length,
        bucketList: Object.values(selectedCountries).filter(
          (c) => c.status === "bucket-list"
        ).length,
      },
      ...data,
    };
  }, [fetchedCountries, selectedCountries]);

  const stats = useMemo(() => {
    const totalCountriesInList = allCountries.length;
    const visitedCount = Object.values(selectedCountries).filter(
      (c) => c.status === "visited"
    ).length;
    const visitedPercentage =
      totalCountriesInList > 0
        ? Math.round((visitedCount / totalCountriesInList) * 100)
        : 0;
    const bucketListCount = Object.values(selectedCountries).filter(
      (c) => c.status === "bucket-list"
    ).length;

    return {
      totalCountriesInList,
      visitedCount,
      bucketListCount,
      visitedPercentage,
    };
  }, [selectedCountries, allCountries]);

  const handleCountryToggle = async (countryName: string) => {
    if (!userId) {
      alert("Please sign in to save your progress!"); // User feedback if not authenticated
      return;
    }

    const country = allCountries.find((c) => c.name === countryName);
    if (!country) return;

    // Calculate the new status outside the setState callback
    const currentStatus = selectedCountries[countryName]?.status || "none";
    let newStatus: CountryStatus = "none";

    if (currentStatus === "none") {
      newStatus = "visited";
    } else if (currentStatus === "visited") {
      newStatus = "bucket-list";
    } else {
      // currentStatus === "bucket-list"
      newStatus = "none";
    }

    // Update UI
    setSelectedCountries((prev) => ({
      ...prev,
      [countryName]: {
        ...country, // Keep other country data (flag, cca2)
        status: newStatus,
      },
    }));

    // --- Save to Database ---
    try {
      if (newStatus === "none") {
        await deleteTravelExperience(userId, country.cca2);
      } else {
        await upsertTravelExperience(userId, country.cca2, newStatus);
      }
    } catch (dbError: unknown) {
      console.error("Failed to update database:", dbError);
      setError(
        dbError instanceof Error
          ? dbError.message
          : "An unknown error occurred while saving."
      );
      // Revert UI change if DB update fails
      setSelectedCountries((prev) => ({
        ...prev,
        [countryName]: { ...country, status: currentStatus }, // Revert to old status
      }));
      alert("Failed to save changes. Please try again.");
    }
  };

  const filteredCountries = useMemo(() => {
    if (!searchQuery) {
      return allCountries;
    }
    return allCountries.filter((country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCountries, searchQuery]);

  const handleCloseHint = () => {
    setShowHint(false);
  };

  const handleDisableHint = () => {
    localStorage.setItem("travelHintDisabled", "true");
    setShowHint(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans text-gray-800 pb-20">
      {/* Header with "been" inspired style */}
      <div className="pt-10 pb-4 px-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-4xl font-light text-orange-500">livo</span>
          {/* Removed Plane and Plus buttons - as per user request */}
        </div>
        {/* Removed "Your World Map" text - as per user request */}
      </div>

      <DynamicTravelMapCarousel
        selectedCountries={selectedCountries}
        handleCountryToggle={handleCountryToggle}
        loading={loading}
        error={error}
        continentData={continentData}
        stats={stats}
      />

      {/* Countries List */}
      <div className="max-w-xl mx-auto px-6 mt-8 bg-white rounded-2xl shadow-sm border-2 border-orange-100 pb-6">
        <div className="flex items-center justify-between py-4 border-b border-orange-100">
          <h2 className="text-xl font-semibold">My Countries</h2>
          <div className="flex items-center text-orange-500 font-medium">
            <span>{stats.visitedCount}</span>
          </div>
        </div>

        <div className="relative my-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search countries..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-orange-100 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-gray-800"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
        </div>

        <div className="h-[400px] overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-600 py-10">
              Loading countries...
            </p>
          ) : error ? (
            <p className="text-center text-red-500 py-10">
              Failed to load countries: {error}
            </p>
          ) : filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country.name}
                onClick={() => handleCountryToggle(country.name)}
                className={`w-full text-left p-3 my-1 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  selectedCountries[country.name]?.status === "visited"
                    ? "border-orange-500 bg-orange-50"
                    : selectedCountries[country.name]?.status === "bucket-list"
                    ? "border-orange-300 bg-orange-50/50"
                    : "border-transparent hover:bg-orange-50"
                }`}
              >
                <span className="text-2xl">{country.flag}</span>
                <span className="text-gray-800 font-medium">
                  {country.name}
                </span>
                {selectedCountries[country.name]?.status === "visited" && (
                  <MapPin className="ml-auto h-5 w-5 text-orange-500" />
                )}
                {selectedCountries[country.name]?.status === "bucket-list" && (
                  <Heart className="ml-auto h-5 w-5 text-orange-300" />
                )}
              </button>
            ))
          ) : (
            <p className="text-center text-gray-600 py-10">
              No countries found matching your search.
            </p>
          )}
        </div>
      </div>

      {showHint && (
        <TravelHintPopup
          onClose={handleCloseHint}
          onDisableShowAgain={handleDisableHint}
        />
      )}
    </div>
  );
}
