'use client'
import Search from "./components/Search";
import Main from "./components/Main";
import { useAppContext } from "./context/AppContext";

export default function Home() {
  const { place, locationData, weatherData, submittedSearch, loading } = useAppContext();

  const showPlaceholder = !submittedSearch;
  const showNoResults = submittedSearch && !loading && !locationData && !weatherData;
  const showLoading = submittedSearch && loading;

  return (
    <div className="h-fit bg-[hsl(243,96%,9%)] w-full px-10 md:px-30 py-4 flex flex-col gap-3">
      <div className="h-fit"><Search /></div>

      {showPlaceholder && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-300 text-2xl font-extrabold animate-fadeIn">
            Search a location to begin.
          </p>
        </div>
      )}

      {showLoading && (
        <div className="flex flex-col justify-center items-center h-40 gap-2">
          <p className="text-gray-300 text-xl font-semibold animate-pulse">
            Loading weather data...
          </p>
          {/* Optional: Skeleton silhouettes for Weather & Hourly */}
          <div className="w-full h-48 bg-gray-700/30 rounded-xl animate-pulse"></div>
        </div>
      )}

      {showNoResults && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-300 text-2xl font-extrabold animate-fadeIn">
            No search results found. Try another location.
          </p>
        </div>
      )}

      {!showPlaceholder && !showNoResults && !showLoading && <Main />}
    </div>
  );
}
