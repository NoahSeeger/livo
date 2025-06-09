"use client";

import WorldMap from "@/components/WorldMap";
import { useState, useMemo } from "react";
import { Search, MapPin, Heart, Plane, Plus, ChevronRight } from "lucide-react";

// Utility function to get flag emoji (expanded for more coverage)
const getCountryFlag = (countryName: string): string => {
  const flags: Record<string, string> = {
    Afghanistan: "🇦🇫",
    Albania: "🇦🇱",
    Algeria: "🇩🇿",
    Andorra: "🇦🇩",
    Angola: "🇦🇴",
    "Antigua and Barbuda": "🇦🇬",
    Argentina: "🇦🇷",
    Armenia: "🇦🇲",
    Australia: "🇦🇺",
    Austria: "🇦🇹",
    Azerbaijan: "🇦🇿",
    Bahamas: "🇧🇸",
    Bahrain: "🇧🇭",
    Bangladesh: "🇧🇩",
    Barbados: "🇧🇧",
    Belarus: "🇧🇾",
    Belgium: "🇧🇪",
    Belize: "🇧🇿",
    Benin: "🇧🇯",
    Bhutan: "🇧🇹",
    Bolivia: "🇧🇴",
    "Bosnia and Herzegovina": "🇧🇦",
    Botswana: "🇧🇼",
    Brazil: "🇧🇷",
    Brunei: "🇧🇳",
    Bulgaria: "🇧🇬",
    "Burkina Faso": "🇧🇫",
    Burundi: "🇧🇮",
    "Cabo Verde": "🇨🇻",
    Cambodia: "🇰🇭",
    Cameroon: "🇨🇲",
    Canada: "🇨🇦",
    "Central African Republic": "🇨🇫",
    Chad: "🇹🇩",
    Chile: "🇨🇱",
    China: "🇨🇳",
    Colombia: "🇨🇴",
    Comoros: "🇰🇲",
    Congo: "🇨🇬",
    "Costa Rica": "🇨🇷",
    Croatia: "🇭🇷",
    Cuba: "🇨🇺",
    Cyprus: "🇨🇾",
    "Czech Republic": "🇨🇿",
    Denmark: "🇩🇰",
    Djibouti: "🇩🇯",
    Dominica: "🇩🇲",
    "Dominican Republic": "🇩🇴",
    Ecuador: "🇪🇨",
    Egypt: "🇪🇬",
    "El Salvador": "🇸🇻",
    "Equatorial Guinea": "🇬🇶",
    Eritrea: "🇪🇷",
    Estonia: "🇪🇪",
    Eswatini: "🇸🇿",
    Ethiopia: "🇪🇹",
    Fiji: "🇫🇯",
    Finland: "🇫🇮",
    France: "🇫🇷",
    Gabon: "🇬🇦",
    Gambia: "🇬🇲",
    Georgia: "🇬🇪",
    Germany: "🇩🇪",
    Ghana: "🇬🇭",
    Greece: "🇬🇷",
    Grenada: "🇬🇩",
    Guatemala: "🇬🇹",
    Guinea: "🇬🇳",
    "Guinea-Bissau": "🇬🇼",
    Guyana: "🇬🇾",
    Haiti: "🇭🇹",
    Honduras: "🇭🇳",
    Hungary: "🇭🇺",
    Iceland: "🇮🇸",
    India: "🇮🇳",
    Indonesia: "🇮🇩",
    Iran: "🇮🇷",
    Iraq: "🇮🇶",
    Ireland: "🇮🇪",
    Israel: "🇮🇱",
    Italy: "🇮🇹",
    Jamaica: "🇯🇲",
    Japan: "🇯🇵",
    Jordan: "🇯🇴",
    Kazakhstan: "🇰🇿",
    Kenya: "🇰🇪",
    Kiribati: "🇰🇮",
    Kuwait: "🇰🇼",
    Kyrgyzstan: "🇰🇬",
    Laos: "🇱🇦",
    Latvia: "🇱🇻",
    Lebanon: "🇱🇧",
    Lesotho: "🇱🇸",
    Liberia: "🇱🇷",
    Libya: "🇱🇾",
    Liechtenstein: "🇱🇮",
    Lithuania: "🇱🇹",
    Luxembourg: "🇱🇺",
    Madagascar: "🇲🇬",
    Malawi: "🇲🇼",
    Malaysia: "🇲🇾",
    Maldives: "🇲🇻",
    Mali: "🇲🇱",
    Malta: "🇲🇹",
    "Marshall Islands": "🇲🇭",
    Mauritania: "🇲🇷",
    Mauritius: "🇲🇺",
    Mexico: "🇲🇽",
    Micronesia: "🇫🇲",
    Moldova: "🇲🇩",
    Monaco: "🇲🇨",
    Mongolia: "🇲🇳",
    Montenegro: "🇲🇪",
    Morocco: "🇲🇦",
    Mozambique: "🇲🇿",
    Myanmar: "🇲🇲",
    Namibia: "🇳🇦",
    Nauru: "🇳🇷",
    Nepal: "🇳🇵",
    Netherlands: "🇳🇱",
    "New Zealand": "🇳🇿",
    Nicaragua: "🇳🇮",
    Niger: "🇳🇪",
    Nigeria: "🇳🇬",
    "North Korea": "🇰🇵",
    "North Macedonia": "🇲🇰",
    Norway: "🇳🇴",
    Oman: "🇴🇲",
    Pakistan: "🇵🇰",
    Palau: "🇵🇼",
    Palestine: "🇵🇸",
    Panama: "🇵🇦",
    "Papua New Guinea": "🇵🇬",
    Paraguay: "🇵🇾",
    Peru: "🇵🇪",
    Philippines: "🇵🇭",
    Poland: "🇵🇱",
    Portugal: "🇵🇹",
    Qatar: "🇶🇦",
    Romania: "🇷🇴",
    Russia: "🇷🇺",
    Rwanda: "🇷🇼",
    "Saint Kitts and Nevis": "🇰🇳",
    "Saint Lucia": "🇱🇨",
    "Saint Vincent and the Grenadines": "🇻🇨",
    Samoa: "🇼🇸",
    "San Marino": "🇸🇲",
    "Sao Tome and Principe": "🇸🇹",
    "Saudi Arabia": "🇸🇦",
    Senegal: "🇸🇳",
    Serbia: "🇷🇸",
    Seychelles: "🇸🇨",
    "Sierra Leone": "🇸🇱",
    Singapore: "🇸🇬",
    Slovakia: "🇸🇰",
    Slovenia: "🇸🇮",
    "Solomon Islands": "🇸🇧",
    Somalia: "🇸🇴",
    "South Africa": "🇿🇦",
    "South Korea": "🇰🇷",
    "South Sudan": "🇸🇸",
    Spain: "🇪🇸",
    "Sri Lanka": "🇱🇰",
    Sudan: "🇸🇩",
    Suriname: "🇸🇷",
    Sweden: "🇸🇪",
    Switzerland: "🇨🇭",
    Syria: "🇸🇾",
    Taiwan: "🇹🇼",
    Tajikistan: "🇹🇯",
    Tanzania: "🇹🇿",
    Thailand: "🇹🇭",
    "Timor-Leste": "🇹🇱",
    Togo: "🇹🇬",
    Tonga: "🇹🇴",
    "Trinidad and Tobago": "🇹🇹",
    Tunisia: "🇹🇳",
    Turkey: "🇹🇷",
    Turkmenistan: "🇹🇲",
    Tuvalu: "🇹🇻",
    Uganda: "🇺🇬",
    Ukraine: "🇺🇦",
    "United Arab Emirates": "🇦🇪",
    "United Kingdom": "🇬🇧",
    "United States": "🇺🇸",
    Uruguay: "🇺🇾",
    Uzbekistan: "🇺🇿",
    Vanuatu: "🇻🇺",
    "Vatican City": "🇻🇦",
    Venezuela: "🇻🇪",
    Vietnam: "🇻🇳",
    Yemen: "🇾🇪",
    Zambia: "🇿🇲",
    Zimbabwe: "🇿🇼",
  };
  return flags[countryName] || "🏳️"; // Default to white flag
};

type CountryStatus = "visited" | "bucket-list" | "none";

interface CountryData {
  name: string;
  status: CountryStatus;
  flag: string;
}

export default function TravelPage() {
  const [selectedCountries, setSelectedCountries] = useState<
    Record<string, CountryData>
  >({});
  const [searchQuery, setSearchQuery] = useState("");

  // Comprehensive list of countries to ensure unique keys
  const allCountries = useMemo(() => {
    // This array should ideally come from a static JSON file or API for robustness
    const countries = [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ];
    // Ensure uniqueness if the source list might have duplicates, though this manual list is unique.
    const uniqueCountries = Array.from(new Set(countries));

    return uniqueCountries.map((name) => ({
      name,
      status: selectedCountries[name]?.status || "none",
      flag: getCountryFlag(name),
    }));
  }, [selectedCountries]); // Re-calculate when selectedCountries changes

  // Calculate statistics
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

  const handleCountryToggle = (countryName: string) => {
    setSelectedCountries((prev) => {
      const currentStatus = prev[countryName]?.status || "none";
      const newStatus =
        currentStatus === "none"
          ? "visited"
          : currentStatus === "visited"
          ? "bucket-list"
          : "none";

      return {
        ...prev,
        [countryName]: {
          name: countryName,
          status: newStatus,
          flag: getCountryFlag(countryName),
        },
      };
    });
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
  }, [allCountries, searchQuery, selectedCountries]); // Dependency on selectedCountries for sorting by status

  // Circular progress bar styling (for percentages)
  const calculateStrokeDasharray = (percentage: number) => {
    const radius = 20; // Matches inner circle radius
    const circumference = 2 * Math.PI * radius;
    return `${circumference} ${circumference}`; // Full circumference and then another for offset
  };

  const calculateStrokeDashoffset = (percentage: number) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    return circumference - (percentage / 100) * circumference;
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-sans text-gray-800 pb-20">
      {/* Header with "been" inspired style */}
      <div className="pt-10 pb-4 px-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-4xl font-light text-orange-500">livo</span>
          <div className="flex gap-4">
            <button className="p-2 rounded-full bg-white border border-orange-100 text-orange-600 hover:bg-orange-50 transition-colors">
              <Plane className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full bg-white border border-orange-100 text-orange-600 hover:bg-orange-50 transition-colors">
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Your World Map</h1>
      </div>

      {/* Map Section - Seamless & Static */}
      <div className="mx-auto bg-white overflow-hidden">
        <WorldMap selectedCountries={selectedCountries} />
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
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country.name} // Use country name as key, now guaranteed unique by useMemo
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
              No countries found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
