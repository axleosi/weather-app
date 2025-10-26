'use client'
import { useAppContext } from "../context/AppContext";
import { useState, useRef, useEffect } from "react";

const Search = () => {
  const {
    place,
    setPlace,
    fetchLocationData,
    units,
    setUnits,
    locationData,
    fetchWeatherData,
    setSubmittedSearch
  } = useAppContext();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlace(e.target.value);
  };

  const handleClick = () => {
    fetchLocationData(place);
    setSubmittedSearch(true)
  };

  const handleUnitChange = (
    key: keyof typeof units,
    value: (typeof units)[keyof typeof units]
  ) => {
    setUnits((prev) => ({ ...prev, [key]: value }));


    if (locationData)
      fetchWeatherData(locationData.latitude, locationData.longitude, units);
  };

  const handleSystemSwitch = (system: "metric" | "imperial") => {
    const newUnits =
      system === "imperial"
        ? ({
          temperature: "fahrenheit",
          windspeed: "mph",
          precipitation: "inch",
        } as const)
        : ({
          temperature: "celsius",
          windspeed: "kmh",
          precipitation: "mm",
        } as const);

    setUnits(newUnits);
    setShowDropdown(false);

    if (locationData)
      fetchWeatherData(locationData.latitude, locationData.longitude, units);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);



  return (
    <div className="w-full min-h-[30%] flex flex-col gap-6 relative">
      {/* Top Row */}
      <div className="flex justify-between items-center">
        <img className="h-7 sm:h-8" src="/logo.svg" alt="logo" />

        {/* Units Button */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="cursor-pointer flex gap-1 items-center bg-[hsl(243,23%,30%)] px-2 py-1 rounded"
          >
            <img className="h-5" src="/icon-units.svg" alt="Units" />
            <p className="text-gray-100 font-bold text-xs sm:text-sm">Units</p>
            <img className="h-2.5" src="/icon-dropdown.svg" alt="dropdown" />
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-1 rounded-lg shadow-lg z-10 p-2 w-40 sm:w-44 bg-[hsl(243,96%,9%)] border border-gray-700"
            >
              {/* Switch Button */}
              <div className="text-left border-[hsl(243,23%,25%)] pt-2">
                <button
                  onClick={() =>
                    handleSystemSwitch(
                      units.temperature === "celsius" ? "imperial" : "metric"
                    )
                  }
                  className="w-full text-left text-xs sm:text-sm px-2 py-1 bg-[hsl(243,23%,30%)] rounded text-gray-200 hover:bg-[hsl(243,23%,25%)] flex justify-between items-center"
                >
                  {units.temperature === "celsius"
                    ? "Switch to Imperial"
                    : "Switch to Metric"}
                </button>
              </div>

              {/* Temperature Section */}
              <div className="mb-2 mt-2">
                <p className="text-[10px] sm:text-xs px-2 text-gray-400 mb-1">Temperature</p>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "Celsius (°C)", value: "celsius" },
                    { label: "Fahrenheit (°F)", value: "fahrenheit" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        handleUnitChange(
                          "temperature",
                          opt.value as "celsius" | "fahrenheit"
                        )
                      }
                      className={`w-full flex items-center justify-between text-left text-xs sm:text-sm px-2 py-1 rounded ${units.temperature === opt.value
                          ? "bg-[hsl(243,23%,30%)] text-white"
                          : "text-gray-300 hover:bg-[hsl(243,23%,25%)]"
                        }`}
                    >
                      {opt.label}
                      {units.temperature === opt.value && (
                        <img
                          src="/icon-checkmark.svg"
                          alt="checked"
                          className="h-3 ml-2"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="bg-[hsl(243,23%,25%)] h-0.5 border-none" />

              {/* Windspeed Section */}
              <div className="mb-2 mt-2">
                <p className="text-[10px] sm:text-xs px-2 text-gray-400 mb-1">Windspeed</p>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "km/h", value: "kmh" },
                    { label: "mph", value: "mph" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        handleUnitChange("windspeed", opt.value as "kmh" | "mph")
                      }
                      className={`w-full flex items-center justify-between text-left text-xs sm:text-sm px-2 py-1 rounded ${units.windspeed === opt.value
                          ? "bg-[hsl(243,23%,30%)] text-white"
                          : "text-gray-300 hover:bg-[hsl(243,23%,25%)]"
                        }`}
                    >
                      {opt.label}
                      {units.windspeed === opt.value && (
                        <img
                          src="/icon-checkmark.svg"
                          alt="checked"
                          className="h-3 ml-2"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="bg-[hsl(243,23%,25%)] h-0.5 border-none" />

              {/* Precipitation Section */}
              <div className="mt-2">
                <p className="text-[10px] sm:text-xs px-2 text-gray-400 mb-1">Precipitation</p>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "Millimeters (mm)", value: "mm" },
                    { label: "Inches (in)", value: "inch" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() =>
                        handleUnitChange(
                          "precipitation",
                          opt.value as "mm" | "inch"
                        )
                      }
                      className={`w-full flex items-center justify-between text-left text-xs sm:text-sm px-2 py-1 rounded ${units.precipitation === opt.value
                          ? "bg-[hsl(243,23%,30%)] text-white"
                          : "text-gray-300 hover:bg-[hsl(243,23%,25%)]"
                        }`}
                    >
                      {opt.label}
                      {units.precipitation === opt.value && (
                        <img
                          src="/icon-checkmark.svg"
                          alt="checked"
                          className="h-3 ml-2"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="flex flex-col items-center w-full sm:w-[80%] md:w-[65%] mx-auto gap-5">
        <h1 className="font-extrabold text-gray-100 text-2xl sm:text-3xl md:text-4xl text-center px-2">
          How's the sky looking today?
        </h1>

        <div className="flex flex-col sm:flex-row items-center w-full gap-3 sm:gap-2">
          <div className="relative w-full">
            <img
              src="/icon-search.svg"
              alt="Search"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            />
            <input
              type="text"
              onChange={handleChange}
              value={place}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleClick();
                }
              }}
              placeholder="Search for a place"
              className="w-full text-gray-300 bg-gray-100/30 placeholder-gray-100 rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={handleClick}
            className="w-full sm:w-auto py-2 px-6 rounded-md bg-blue-800 text-gray-100"
          >
            Search
          </button>
        </div>
      </div>
    </div>

  );
};

export default Search;