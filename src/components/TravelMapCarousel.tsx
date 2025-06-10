"use client";

import WorldMap from "@/components/WorldMap";
import { useState, useMemo, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { MapPin, Heart } from "lucide-react";
import { CountryData } from "@/components/WorldMap";

interface TravelMapCarouselProps {
  selectedCountries: Record<string, CountryData>;
  handleCountryToggle: (countryName: string) => void;
  loading: boolean;
  error: string | null;
  continentData: ContinentDataMap;
  stats: {
    totalCountriesInList: number;
    visitedCount: number;
    bucketListCount: number;
    visitedPercentage: number;
  };
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

export default function TravelMapCarousel({
  selectedCountries,
  handleCountryToggle,
  loading,
  error,
  continentData,
  stats,
}: TravelMapCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [emblaRefStatsCards, emblaApiStatsCards] = useEmblaCarousel({
    loop: true,
  });

  const [currentMapViewIndex, setCurrentMapViewIndex] = useState(0);
  const [currentStatsCardIndex, setCurrentStatsCardIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentMapViewIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const onSelectStatsCard = useCallback(() => {
    if (!emblaApiStatsCards) return;
    setCurrentStatsCardIndex(emblaApiStatsCards.selectedScrollSnap());
  }, [emblaApiStatsCards]);

  useEffect(() => {
    if (!emblaApiStatsCards) return;
    onSelectStatsCard();
    emblaApiStatsCards.on("select", onSelectStatsCard);
    return () => {
      emblaApiStatsCards.off("select", onSelectStatsCard);
    };
  }, [emblaApiStatsCards, onSelectStatsCard]);

  interface CardProps {
    title: string;
    percentage: number;
    visitedCount: number;
    totalCount: number;
    bucketListCount?: number;
    showBucketList?: boolean;
  }

  const StatsCardContent: React.FC<CardProps> = useCallback(
    ({
      title,
      percentage,
      visitedCount,
      totalCount,
      bucketListCount,
      showBucketList = true,
    }) => {
      // Circular progress bar styling (for percentages)
      const calculateStrokeDasharray = () => {
        const radius = 20; // Matches inner circle radius
        const circumference = 2 * Math.PI * radius;
        return `${circumference} ${circumference}`;
      };

      const calculateStrokeDashoffset = (percentage: number) => {
        const radius = 20;
        const circumference = 2 * Math.PI * radius;
        return circumference - (percentage / 100) * circumference;
      };

      return (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-orange-100 p-6 w-full min-h-[200px]">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-orange-500">
                  {percentage}%
                </span>
                <p className="text-sm text-gray-600">
                  {title.includes("Countries")
                    ? "Countries"
                    : title.split(" ")[title.split(" ").length - 1]}
                </p>
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
                    strokeDasharray={calculateStrokeDasharray()}
                    strokeDashoffset={calculateStrokeDashoffset(percentage)}
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
                {visitedCount}
              </span>
              <p className="text-sm text-gray-600">of {totalCount}</p>
            </div>
          </div>
          {showBucketList && (
            <div className="mt-6 flex justify-between text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span>Visited: {visitedCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-orange-300" />
                <span>Bucket List: {bucketListCount}</span>
              </div>
            </div>
          )}
        </div>
      );
    },
    []
  );

  const slides = useMemo(() => {
    const slideItems = [];

    // 1. World card
    slideItems.push(
      <div key="world-stats">
        <StatsCardContent
          title="In Total World"
          percentage={stats.visitedPercentage}
          visitedCount={stats.visitedCount}
          totalCount={continentData.World.total}
          bucketListCount={stats.bucketListCount}
          showBucketList={true}
        />
      </div>
    );

    // 2. Continents card
    slideItems.push(
      <div key="continent-stats">
        <StatsCardContent
          title="Continents"
          percentage={
            continentData.Continents.total > 0
              ? Math.round(
                  (continentData.Continents.visited /
                    continentData.Continents.total) *
                    100
                )
              : 0
          }
          visitedCount={continentData.Continents.visited}
          totalCount={continentData.Continents.total}
          showBucketList={false}
        />
      </div>
    );

    // 3. Countries card
    slideItems.push(
      <div key="country-stats">
        <StatsCardContent
          title="Countries"
          percentage={stats.visitedPercentage}
          visitedCount={stats.visitedCount}
          totalCount={continentData.World.total}
          showBucketList={false}
        />
      </div>
    );

    // 4. Individual continent cards
    const orderedContinents = [
      "Africa",
      "Asia",
      "Europe",
      "North America",
      "South America",
      "Oceania",
      "Antarctica",
    ]; // Fixed order

    orderedContinents.forEach((continentName) => {
      const data = continentData[continentName] || {
        total: 0,
        visited: 0,
        bucketList: 0,
      }; // Default to zero if data not present
      const percentage =
        data.total > 0 ? Math.round((data.visited / data.total) * 100) : 0;
      slideItems.push(
        <div key={continentName}>
          <StatsCardContent
            title={continentName}
            percentage={percentage}
            visitedCount={data.visited}
            totalCount={data.total}
            bucketListCount={data.bucketList}
            showBucketList={true}
          />
        </div>
      );
    });

    return slideItems;
  }, [stats, continentData, StatsCardContent]);

  return (
    <>
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
                  onCountryClick={handleCountryToggle}
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
      <div
        className="max-w-xl mx-auto px-6 py-6 mt-6 overflow-hidden relative embla"
        ref={emblaRefStatsCards}
      >
        <div className="embla__container flex">
          {slides.map((slide, index) => (
            <div className="embla__slide flex-none w-full" key={index}>
              {slide}
            </div>
          ))}
        </div>

        {/* Carousel Dots for Stats Cards */}
        <div className="flex justify-center mt-4 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() =>
                emblaApiStatsCards && emblaApiStatsCards.scrollTo(index)
              }
              className={`w-2 h-2 rounded-full ${
                currentStatsCardIndex === index
                  ? "bg-orange-500"
                  : "bg-orange-200"
              } transition-colors`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
