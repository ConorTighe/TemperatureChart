import React from 'react';
import '../App.css';
import useChart from '../hooks/chart';
import { useLocation } from '../hooks/location';
import { Select } from '@mantine/core';

function Dashbaord() {
  const { error } = useLocation();
  const { isLoading, days, daysOptions, handleUpdateDays } = useChart();

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
              label="Days displayed"
              placeholder="Select results to display"
            />
            <canvas id='myChart' />
        </div>
    )
}

export default Dashbaord;
