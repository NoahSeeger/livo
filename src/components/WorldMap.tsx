"use client";

import { useEffect, useRef } from "react";

interface WorldMapProps {
  visitedCountries: string[];
  wantToVisitCountries: string[];
  onCountryClick: (countryCode: string) => void;
}

export default function WorldMap({
  visitedCountries,
  wantToVisitCountries,
  onCountryClick,
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Reset all countries to default state
    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      path.style.fill = "#e5e7eb";
      path.style.stroke = "#9ca3af";
      path.style.strokeWidth = "0.5";
      path.style.cursor = "pointer";
      path.style.transition = "fill 0.3s ease";

      // Add click handler
      path.addEventListener("click", () => {
        const countryCode = path.id;
        if (countryCode) {
          onCountryClick(countryCode);
        }
      });
    });

    // Color visited countries
    visitedCountries.forEach((code) => {
      const path = svgRef.current?.querySelector(`#${code}`);
      if (path instanceof SVGPathElement) {
        path.style.fill = "#3b82f6"; // blue-500
      }
    });

    // Color want to visit countries
    wantToVisitCountries.forEach((code) => {
      const path = svgRef.current?.querySelector(`#${code}`);
      if (path instanceof SVGPathElement) {
        path.style.fill = "#eab308"; // yellow-500
      }
    });
  }, [visitedCountries, wantToVisitCountries, onCountryClick]);

  return (
    <div className="w-full overflow-auto">
      <svg
        ref={svgRef}
        viewBox="0 0 1000 500"
        className="w-full h-auto"
        style={{ maxHeight: "70vh" }}
      >
        {/* World map SVG paths will be loaded here */}
        {/* You can use a library like react-simple-maps or include the SVG paths directly */}
        <path
          id="US"
          d="M100,100 L200,100 L200,200 L100,200 Z"
          className="country"
        />
        {/* Add more country paths here */}
      </svg>
    </div>
  );
}
