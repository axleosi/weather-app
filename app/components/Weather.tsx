'use client'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";
import { useAppContext } from "../context/AppContext"
import Skeleton from "./Skeleton";


const Weather = () => {
    const { locationData, weatherData, units } = useAppContext();
    if (!weatherData) {
    return (
      <div className="w-full h-full flex flex-col gap-3">
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
    );
  }

    const { hourly, daily } = weatherData;
    const feelsLike = Math.round(Number(hourly?.temperature_2m?.[0]));
    const humidity = Math.round(Number(hourly?.relativehumidity_2m?.[0]));
    const wind = Math.round(Number(hourly?.windspeed_10m?.[0]));
    const precipitation = Math.round(Number(hourly?.precipitation?.[0]));

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

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

    const currentTemp = Math.round(Number(weatherData?.current?.temperature));
    const weatherIcon = getWeatherIcon(weatherData?.current?.weathercode);

    const dailyForecast = daily?.time?.map((day: string, index: number) => {
        const d = new Date(day);
        const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
        return {
            weekday,
            max: Math.round(daily?.temperature_2m_max?.[index]),
            min: Math.round(daily?.temperature_2m_min?.[index]),
            code: daily?.weathercode?.[index],
        };
    });

    return (
        <div className="w-full h-full flex flex-col gap-3">
            {/* Top section */}
            <div
                className="h-[45%] min-h-[180px] rounded-xl bg-cover bg-center w-full flex flex-col sm:flex-row items-center  justify-between p-4 sm:p-6"
                style={{ backgroundImage: "url('/bg-today-large.svg')" }}
            >
                <div className="text-gray-100 text-center sm:text-left">
                    <h1 className="font-semibold text-lg sm:text-xl">{locationData?.name}, {locationData?.country}</h1>
                    <p className="text-sm sm:text-base">{formattedDate}</p>
                </div>
                <div className="flex items-center gap-4 sm:gap-8 mt-3 sm:mt-0">
                    <img className="h-10 sm:h-12" src={weatherIcon} alt="" />
                    <h1 className="font-bold text-4xl sm:text-5xl text-gray-100">{currentTemp}°</h1>
                </div>
            </div>

            {/* Weather stats */}
            <div className="flex flex-wrap justify-between gap-2">
                {[
                    { label: "Feels Like", value: `${feelsLike}°` },
                    { label: "Humidity", value: `${humidity}%` },
                    { label: "Wind", value: `${wind} ${units.windspeed === "kmh" ? "km/h" : "mph"}` },
                    { label: "Precipitation", value: `${precipitation} ${units.precipitation === "mm" ? "mm" : "in"}` },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="bg-[hsl(243,23%,24%)] border-gray-700 border-2 flex flex-col justify-center items-center w-[48%] sm:w-[23%] h-20 rounded-md p-2"
                    >
                        <p className="text-gray-100 text-xs sm:text-sm">{item.label}</p>
                        <p className="font-bold text-gray-100 text-sm sm:text-base">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* Daily Forecast */}
            <div className="mt-3 text-gray-100">
                <h1 className="text-sm sm:text-base font-semibold mb-2">7-Day Forecast</h1>
                <div
                    className="flex gap-2 overflow-x-auto pb-2
                               [&::-webkit-scrollbar]:h-1.5
                               [&::-webkit-scrollbar-track]:bg-transparent
                             [&::-webkit-scrollbar-thumb]:bg-gray-500/40
                               [&::-webkit-scrollbar-thumb]:rounded-full
                             [&::-webkit-scrollbar-thumb]:hover:bg-gray-400/60
                                scroll-smooth"
                >
                    {dailyForecast?.map((day: { weekday: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; code: number; max: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; min: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, i: Key | null | undefined) => (
                        <div
                            key={i}
                            className="flex flex-col justify-between items-center  py-3 w-full bg-[hsl(243,23%,24%)] border-gray-700 border-2 rounded-xl"
                        >
                            <p className="text-xs sm:text-sm font-medium">{day.weekday}</p>
                            <img src={getWeatherIcon(day.code)} alt="" className="h-6 sm:h-8 my-1" />
                            <div className="flex justify-between w-full px-3">
                                <p className="text-xs">{day.max}°</p>
                                <p className="text-xs text-gray-400">{day.min}°</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Weather;
