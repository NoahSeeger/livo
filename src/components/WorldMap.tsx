"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

type CountryStatus = "visited" | "bucket-list" | "none";

interface CountryData {
  name: string;
  status: CountryStatus;
  flag: string; // Add flag for rendering in list
}

export default function WorldMap({
  selectedCountries,
}: {
  selectedCountries: Record<string, CountryData>;
}) {
  const getCountryStyle = (geo: any) => {
    const countryName = geo.properties.name;
    const status = selectedCountries[countryName]?.status || "none";

    const baseStyle = {
      stroke: "#FED7AA", // Orange-100 for border
      strokeWidth: 0.5,
      outline: "none",
    };

    const statusStyles = {
      none: {
        fill: "#FFF7ED", // Using a warm, light orange (Tailwind orange-50) for unselected
        ...baseStyle,
      },
      visited: {
        fill: "#F97316", // Orange-500 for visited
        ...baseStyle,
      },
      "bucket-list": {
        fill: "#FDBA74", // Orange-300 for bucket list
        ...baseStyle,
      },
    };

    return statusStyles[status];
  };

  return (
    <div className="w-full aspect-[2/1]">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100, // Fixed scale
          center: [0, 0], // Centered
        }}
        width={800} // Fixed width for better rendering consistency
        height={400} // Fixed height
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryStyle = getCountryStyle(geo);
              return (
                <Geography
                  key={geo.rsmKey} // Use geo.rsmKey for unique keys provided by react-simple-maps
                  geography={geo}
                  // Apply fill and stroke directly as SVG attributes
                  fill={countryStyle.fill}
                  stroke={countryStyle.stroke}
                  strokeWidth={countryStyle.strokeWidth}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
