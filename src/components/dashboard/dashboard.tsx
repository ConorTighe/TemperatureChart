import React from 'react';
import '../../App.css';
import useGeoLocation from '../../hooks/geo-location';
import { Select } from '@mantine/core';
import useMeteo from '../../hooks/meteo';
import 'chartjs-adapter-moment';
import GeoChart from '../chart/chart';
import { Loader } from '@mantine/core';
interface IDaysOptions {
  value: string,
  label: string,
}

function Dashbaord() {
  const { error } = useGeoLocation();
  const  { datasource, daysOfCapturedData, handleSelectedDays, isLoading, selectedDays } = useMeteo({ type: "temperature_2m_max" });
  // const  { datasource, daysOfCapturedData, handleSelectedDays, isLoading, selectedDays } = useMeteo({ type: "wave_height_max" });
  const options: IDaysOptions[] = Array.from(
      {length: Number(daysOfCapturedData)},(_, index)=> ({ value: (index + 1).toString(), label: (index + 1).toString() })
    )

    if(error) return (
        <span>Enable geo location</span>
    ) 

    return isLoading ? (
      <div className='loader'>
          <Loader />
      </div>
    ) : (
        <div className="chart">
          <Select
              className="dropdown"
              data={options}
              value={selectedDays}
              onChange={handleSelectedDays}
              label="Days displayed"
              placeholder="Select results to display"
            />
            <GeoChart
              selectedDays={selectedDays}
              handleSelectedDays={handleSelectedDays}
              datasource={datasource}
            />
        </div>
    )
}

export default Dashbaord;
