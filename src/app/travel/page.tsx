"use client";

import WorldMap from "@/components/WorldMap";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Search, MapPin, Heart, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import {
  getCurrentUserId,
  getTravelExperiences,
  upsertTravelExperience,
  deleteTravelExperience,
} from "@/lib/travelDb"; // Import Supabase functions

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
            Don't show again
          </button>
        </div>
      </div>
    </div>
  );
};

// Removed getCountryFlag utility function as flag is directly from API

type CountryStatus = "visited" | "bucket-list" | "none";

interface CountryData {
  name: string;
  status: CountryStatus;
  flag: string;
  cca2: string; // Add cca2 for database interaction
}

// Define different map views for the carousel
const mapViews = [
  // Adjusted center and scale for "World" to effectively remove Antarctica
  {
    name: "World",
    projectionConfig: { scale: 120, center: [0, 10] as [number, number] },
  },
  {
    name: "Europe",
    projectionConfig: { scale: 400, center: [15, 50] as [number, number] },
  },
  {
    name: "Americas",
    projectionConfig: { scale: 150, center: [-80, 0] as [number, number] },
  },
  {
    name: "Asia",
    projectionConfig: { scale: 200, center: [90, 20] as [number, number] },
  },
];

export default function TravelPage() {
  const [userId, setUserId] = useState<string | null>(null); // State to hold the current user ID
  const [selectedCountries, setSelectedCountries] = useState<
    Record<string, CountryData>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMapViewIndex, setCurrentMapViewIndex] = useState(0); // State for carousel index
  const [fetchedCountries, setFetchedCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Embla Carousel Hook
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  // Update currentMapViewIndex when Embla slide changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentMapViewIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setCurrentMapViewIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(); // Set initial index
    emblaApi.on("select", onSelect); // Listen for slide changes
    return () => {
      emblaApi.off("select", onSelect); // Clean up event listener
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);

      // Check local storage for hint preference
      const hintDisabled = localStorage.getItem("travelHintDisabled");
      if (!hintDisabled) {
        setShowHint(true);
      }

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
          fetch("https://restcountries.com/v3.1/all?fields=name,flag,cca2"),
          getTravelExperiences(currentUserId), // 3. Fetch user's saved experiences
        ]);

        if (!countriesResponse.ok) {
          throw new Error(`HTTP error! status: ${countriesResponse.status}`);
        }
        const countriesData = await countriesResponse.json();

        const initialSelectedCountries: Record<string, CountryData> = {};

        // Transform and merge country data with user experiences
        const transformedCountries: CountryData[] = countriesData.map(
          (country: any) => {
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
            };
            initialSelectedCountries[commonName] = countryDataItem;
            return countryDataItem;
          }
        );

        // Ensure unique countries by name in the fetched list
        const uniqueTransformedData = Array.from(
          new Set(transformedCountries.map((c) => c.name))
        )
          .map((name) => transformedCountries.find((c) => c.name === name)!)
          .filter(Boolean);

        setFetchedCountries(uniqueTransformedData);
        setSelectedCountries(initialSelectedCountries); // Set initial selected countries based on DB
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []); // Empty dependency array means this runs once on mount

  const allCountries = useMemo(() => {
    if (fetchedCountries.length > 0) {
      return fetchedCountries.map((fc) => ({
        ...fc,
        status: selectedCountries[fc.name]?.status || "none", // Ensure local state reflects status
      }));
    }
    return []; // Return empty if not loaded
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
    } catch (dbError: any) {
      console.error("Failed to update database:", dbError);
      // Revert UI change if DB update fails
      setSelectedCountries((prev) => ({
        ...prev,
        [countryName]: { ...country, status: currentStatus }, // Revert to old status
      }));
      alert("Failed to save changes. Please try again.");
    }
  };

  const filteredCountries = useMemo(() => {
    return allCountries
      .filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by status first: Visited, then Bucket List, then None
        const statusOrder = { visited: 1, "bucket-list": 2, none: 3 };
        const statusA = selectedCountries[a.name]?.status || "none";
        const statusB = selectedCountries[b.name]?.status || "none";

        if (statusOrder[statusA] !== statusOrder[statusB]) {
          return statusOrder[statusA] - statusOrder[statusB];
        }
        // Then alphabetically by name
        return a.name.localeCompare(b.name);
      });
  }, [allCountries, searchQuery, selectedCountries]);

  // Circular progress bar styling (for percentages)
  const calculateStrokeDasharray = (percentage: number) => {
    const radius = 20; // Matches inner circle radius
    const circumference = 2 * Math.PI * radius;
    return `${circumference} ${circumference}`;
  };

  const calculateStrokeDashoffset = (percentage: number) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    return circumference - (percentage / 100) * circumference;
  };

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

      {/* Map Section - Seamless & Static with Embla Carousel */}
      <div
        className="mx-auto bg-white overflow-hidden relative embla"
        ref={emblaRef}
      >
        <div className="embla__container flex">
          {mapViews.map((view, index) => (
            <div className="embla__slide flex-none w-full" key={index}>
              {loading ? (
                <div className="w-full aspect-[2/1] flex items-center justify-center text-gray-600">
                  Loading map data...
                </div>
              ) : error ? (
                <div className="w-full aspect-[2/1] flex items-center justify-center text-red-500">
                  Error loading map: {error}
                </div>
              ) : (
                <WorldMap
                  selectedCountries={selectedCountries}
                  projectionConfig={view.projectionConfig}
                />
              )}
            </div>
          ))}
        </div>

        {/* Carousel Dots - now driven by Embla API */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {mapViews.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className={`w-2 h-2 rounded-full ${
                currentMapViewIndex === index
                  ? "bg-orange-500"
                  : "bg-orange-200"
              } transition-colors`}
            />
          ))}
        </div>
      </div>

      {/* Stats Summary Card */}
      <div className="max-w-xl mx-auto px-6 py-6 mt-6 bg-white rounded-2xl shadow-sm border-2 border-orange-100">
        <h2 className="text-xl font-semibold mb-4">In Total</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <span className="text-4xl font-bold text-orange-500">
                {stats.visitedPercentage}%
              </span>
              <p className="text-sm text-gray-600">World</p>
            </div>
            {/* Circular progress bar */}
            <div className="relative w-14 h-14">
              <svg className="w-full h-full" viewBox="0 0 44 44">
                {/* Background circle */}
                <circle
                  className="text-orange-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="20"
                  cx="22"
                  cy="22"
                />
                {/* Progress circle */}
                <circle
                  className="text-orange-500"
                  strokeWidth="4"
                  strokeDasharray={calculateStrokeDasharray(
                    stats.visitedPercentage
                  )}
                  strokeDashoffset={calculateStrokeDashoffset(
                    stats.visitedPercentage
                  )}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="20"
                  cx="22"
                  cy="22"
                  transform="rotate(-90 22 22)"
                />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <span className="text-4xl font-bold text-orange-500">
              {stats.visitedCount}
            </span>
            <p className="text-sm text-gray-600">Countries</p>
          </div>
        </div>
        <div className="mt-6 flex justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-500" />
            <span>Visited: {stats.visitedCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-orange-300" />
            <span>Bucket List: {stats.bucketListCount}</span>
          </div>
        </div>
      </div>

      {/* Countries List */}
      <div className="max-w-xl mx-auto px-6 mt-8 bg-white rounded-2xl shadow-sm border-2 border-orange-100 pb-6">
        <div className="flex items-center justify-between py-4 border-b border-orange-100">
          <h2 className="text-xl font-semibold">My Countries</h2>
          <div className="flex items-center text-orange-500 font-medium">
            <span>{stats.visitedCount}</span>
            <ChevronRight className="h-4 w-4 ml-1" />
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
