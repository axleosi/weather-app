'use client';
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

interface WeatherData {
  current: any;
  hourly: any;
  daily: any;
}

interface Units {
  temperature: "celsius" | "fahrenheit";
  windspeed: "kmh" | "mph";
  precipitation: "mm" | "inch";
}

interface AppContextType {
  place: string;
  setPlace: React.Dispatch<React.SetStateAction<string>>;
  locationData: LocationData | null;
  weatherData: WeatherData | null;
  units: Units;
  setUnits: React.Dispatch<React.SetStateAction<Units>>;
  toggleUnits: () => void;
  fetchLocationData: (placeName: string) => Promise<void>;
  fetchWeatherData: (lat: number, lon: number, selectedUnits?: Units) => Promise<void>;
  loading: boolean;            
  submittedSearch: boolean;           
  setSubmittedSearch: React.Dispatch<React.SetStateAction<boolean>>; 
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [place, setPlace] = useState("");
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedSearch, setSubmittedSearch] = useState(false);

  // 🌡️ Default units
  const [units, setUnits] = useState<Units>({
    temperature: "celsius",
    windspeed: "kmh",
    precipitation: "mm",
  });

  const toggleUnits = () => {
    setUnits((prev) => ({
      temperature: prev.temperature === "celsius" ? "fahrenheit" : "celsius",
      windspeed: prev.windspeed === "kmh" ? "mph" : "kmh",
      precipitation: prev.precipitation === "mm" ? "inch" : "mm",
    }));
  };

  // 🔹 Step 1: Fetch location from name
  const fetchLocationData = async (placeName: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${placeName}`
      );

      if (res.data.results && res.data.results.length > 0) {
        const loc = res.data.results[0];
        const newLoc = {
          name: loc.name,
          latitude: loc.latitude,
          longitude: loc.longitude,
          country: loc.country,
        };
        setLocationData(newLoc);

        await fetchWeatherData(newLoc.latitude, newLoc.longitude, units);
      } else {
        setLocationData(null);
        setWeatherData(null);
      }
    } catch (err) {
      console.error("❌ Error fetching location:", err);
    }finally {
      setLoading(false); // stop loading
    }
  };

  // 🔹 Step 2: Fetch weather forecast with current units
  const fetchWeatherData = async (lat: number, lon: number, selectedUnits: Units = units) => {
    try {
      setLoading(true); // start loading
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=Africa/Lagos&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&temperature_unit=${selectedUnits.temperature}&windspeed_unit=${selectedUnits.windspeed}&precipitation_unit=${selectedUnits.precipitation}`;
      const res = await axios.get(url);
      setWeatherData({
        current: res.data.current_weather,
        hourly: res.data.hourly,
        daily: res.data.daily,
      });
    } catch (err) {
      console.error("❌ Error fetching weather:", err);
      setWeatherData(null);
    } finally {
      setLoading(false); // stop loading
    }
  };


  useEffect(() => {
    if (locationData) {
      fetchWeatherData(locationData.latitude, locationData.longitude, units);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  return (
    <AppContext.Provider
      value={{
        place,
        setPlace,
        locationData,
        toggleUnits,
        weatherData,
        units,
        setUnits,
        fetchLocationData,
        fetchWeatherData,
        loading,
        submittedSearch,
        setSubmittedSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};
