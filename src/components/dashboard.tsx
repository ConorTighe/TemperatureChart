import React from 'react';
import '../App.css';
import useChart from '../hooks/chart';
// import useGeolocation from "react-hook-geolocation";
import { useLocation } from '../hooks/location';
import { MultiSelect, Select } from '@mantine/core';

function Dashbaord() {
  const { latitude, longitude, error } = useLocation();

  const { isLoading, days, daysOptions, handleUpdateDays } = useChart({ lat: latitude, long: longitude });

    if(error) return (
        <span>Enable geo location</span>
    ) 

    return isLoading ? (
      <div>
          is loading...
      </div>
    ) : (
        <div className="chart">
          <Select
              className="dropdown"
              data={daysOptions}
              value={days}
              onChange={handleUpdateDays}
              label="Compounds"
              placeholder="Select results to display"
            />
            days: {days}
            <canvas id='myChart' />
        </div>
    )
}

export default Dashbaord;
