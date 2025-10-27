'use client'
import Search from "./components/Search";
import Main from "./components/Main";
import { useAppContext } from "./context/AppContext";
import Skeleton from "./components/Skeleton";

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
        <div className="w-full h-full flex flex-col gap-3">
          <p className="mt-3 text-2xl font-extrabold text-gray-100 text-center">Data loading. Please wait.</p>
            <Skeleton className="h-[180px] w-full" /> {/* top section */}
            <div className="flex flex-wrap justify-between gap-2">
              <Skeleton className="h-20 w-[48%] sm:w-[23%]" />
              <Skeleton className="h-20 w-[48%] sm:w-[23%]" />
              <Skeleton className="h-20 w-[48%] sm:w-[23%]" />
              <Skeleton className="h-20 w-[48%] sm:w-[23%]" />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-20 shrink-0" />
              ))}
            </div>
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
