import React from 'react'
import Hourly from './Hourly'
import Weather from './Weather'

const Main = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-3 h-auto lg:h-[70%]">
      <div className="w-full lg:w-[70%]">
        <Weather />
      </div>
      <div className="w-full lg:w-[30%]">
        <Hourly />
      </div>
    </div>
  );
};

export default Main