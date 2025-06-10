"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Define the CountryStatus type
type CountryStatus = "visited" | "bucket-list" | "none";

// Define the CountryData interface
interface CountryData {
  name: string;
  status: CountryStatus;
  flag: string;
}

// Define the MapProjectionConfig interface
interface MapProjectionConfig {
  scale: number;
  center: [number, number];
}

interface GeoProperties {
  name: string;
}

interface Geo {
  properties: GeoProperties;
  rsmKey: string;
}

// URL for the TopoJSON map data
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

export default function WorldMap({
  selectedCountries,
  projectionConfig, // Receive projection config as a prop
}: {
  selectedCountries: Record<string, CountryData>;
  projectionConfig: MapProjectionConfig; // Type for the new prop
}) {
  const getCountryStyle = (geo: Geo) => {
    const countryName = geo.properties.name;
    const status = selectedCountries[countryName]?.status || "none";

    // Removed stroke and strokeWidth from baseStyle
    const baseStyle = {
      outline: "none",
    };

    const statusColors = {
      none: "#cdcfd0", // A light, subtle grey for unselected countries (Tailwind gray-100)
      visited: "#F97316", // Orange-500 for visited
      "bucket-list": "#FDBA74", // Orange-300 for bucket list
    };

    return {
      fill: statusColors[status],
      ...baseStyle,
    };
  };

  return (
    <div className="w-full aspect-[2/1] overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={projectionConfig} // Use the passed projection config
        width={800} // Fixed width for consistent map rendering
        height={400} // Fixed height
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: Geo[] }) =>
            geographies.map((geo: Geo) => {
              const countryStyle = getCountryStyle(geo);
              return (
                <Geography
                  key={geo.rsmKey} // Unique key for each geography element
                  geography={geo}
                  fill={countryStyle.fill}
                  // Removed stroke and strokeWidth here
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
