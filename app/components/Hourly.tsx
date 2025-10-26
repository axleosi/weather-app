'use client'
import { useAppContext } from '../context/AppContext'
import { useState } from 'react';

const Hourly = () => {
  const { weatherData } = useAppContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDay, setSelectedDay] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" })
  );

  if (!weatherData?.hourly) return null;

  const allDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const todayIndex = new Date().getDay();
  const reorderedDays = [...allDays.slice(todayIndex), ...allDays.slice(0, todayIndex)];

  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
    setShowDropdown(false);
  };

  const getWeatherIcon = (code: number) => {
    if ([0].includes(code)) return "/icon-sunny.webp";
    if ([1, 2].includes(code)) return "/icon-partly-cloudy.webp";
    if ([3].includes(code)) return "/icon-overcast.webp";
    if ([45, 48].includes(code)) return "/icon-fog.webp";
    if ([51, 53, 55, 56, 57].includes(code)) return "/icon-drizzle.webp";
    if ([61, 63, 65, 66, 67].includes(code)) return "/icon-rain.webp";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "/icon-snow.webp";
    if ([95, 96, 99].includes(code)) return "/icon-storm.webp";
    return "/icon-sunny.webp";
  };

  const today = new Date();
  const selectedIndex = allDays.indexOf(selectedDay);
  const dayDiff = (selectedIndex - todayIndex + 7) % 7;
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + dayDiff);
  const targetDateStr = targetDate.toISOString().slice(0, 10);

  const filteredHours = weatherData.hourly.time
    .map((time: string, i: number) => ({
      time,
      temp: weatherData.hourly.temperature_2m[i],
      code: weatherData.hourly.weathercode[i],
    }))
    .filter((h: { time: string }) => h.time.startsWith(targetDateStr));

  let displayHours: any[] = [];
  if (dayDiff === 0) {
    const now = new Date();
    const currentHourISO = now.toISOString().slice(0, 13);
    const currentIndex = filteredHours.findIndex((t: { time: string }) =>
      t.time.startsWith(currentHourISO)
    );
    displayHours = filteredHours.slice(currentIndex, currentIndex + 8);
  } else displayHours = filteredHours.slice(0, 8);

  return (
    <div className="relative w-full h-auto bg-[hsl(243,23%,24%)] rounded-xl p-4 flex flex-col gap-2 border-gray-700 border-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-gray-100 font-semibold text-sm sm:text-base">Hourly Forecast</h1>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="cursor-pointer flex gap-1 items-center bg-[hsl(243,23%,30%)] px-2 py-1 rounded"
          >
            <p className="text-gray-100 font-bold text-xs sm:text-sm">{selectedDay}</p>
            <img className="h-2.5" src="/icon-dropdown.svg" alt="" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 rounded-lg shadow-lg z-10 p-1 w-28 bg-[hsl(243,96%,9%)] border-gray-700 border-2">
              {reorderedDays
                .filter((day) => day !== selectedDay)
                .map((day) => (
                  <button
                    key={day}
                    className="w-full text-left text-gray-100 text-sm px-2 py-1 hover:bg-[hsl(243,23%,30%)] rounded"
                    onClick={() => handleSelectDay(day)}
                  >
                    {day}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Hourly Data */}
      <div
  className="flex flex-col gap-2 mt-1 max-h-[400px] overflow-y-auto
    [&::-webkit-scrollbar]:w-1.5
    [&::-webkit-scrollbar-track]:bg-transparent
    [&::-webkit-scrollbar-thumb]:bg-gray-500/40
    [&::-webkit-scrollbar-thumb]:rounded-full
    [&::-webkit-scrollbar-thumb]:hover:bg-gray-400/60
    scroll-smooth"
>
        {displayHours.length === 0 ? (
          <p className="text-gray-300 text-sm text-center py-4">No data available.</p>
        ) : (
          displayHours.map((hour, idx) => {
            const date = new Date(hour.time);
            let hourNum = date.getHours();
            const ampm = hourNum >= 12 ? "PM" : "AM";
            hourNum = hourNum % 12 || 12;
            const roundedTemp = Math.round(Number(hour.temp));

            return (
              <div
                key={idx}
                className="flex justify-between items-center bg-[hsl(243,23%,30%)] rounded-lg py-2.5 px-3"
              >
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-300">{`${hourNum} ${ampm}`}</p>
                  <img src={getWeatherIcon(hour.code)} alt="weather" className="h-4 sm:h-5" />
                </div>
                <p className="text-gray-100 font-semibold text-sm sm:text-base">
                  {roundedTemp}°
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Hourly;
