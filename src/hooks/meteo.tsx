import { useEffect, useState } from "react";
import { ChartDataset } from "chart.js/auto";
import OpenMeteo from "../api/Forcast";
import 'chartjs-adapter-moment';
import useGeoLocation from './geo-location';

interface IMeteoConfigProps {
    type: "temperature_2m_max" | "wave_height_max";
}

interface IMeteo {
    datasource: any | null;
    daysOfCapturedData?: string;
    selectedDays?: string;
    handleSelectedDays: (totalDays: string) => void;
    isLoading: boolean;
}


export default function useMeteo({ type }: IMeteoConfigProps): IMeteo {
    const [datasource, setDatasource] = useState<ChartDataset>();
    const [daysOfCapturedData, setDaysOfCapturedData] = useState<string>();
    const [selectedDays, setSelectedDays] = useState<string>();
    const [isLoading, setLoading] = useState<boolean>(true)
    const { latitude, longitude } = useGeoLocation();

    const datasourceFactory = async () => {
        if(type === "temperature_2m_max") return handleTemperatureData()
        if(type === "wave_height_max") return handleWaveData()

        return null;
    }

    const handleSelectedDays = (totalDays: string) => {
        setSelectedDays(totalDays);
    }

    const handleSetupDaysConfig = (totalDays: string) => {
        setSelectedDays(totalDays);
        setDaysOfCapturedData(totalDays);
    }

    const handleTemperatureData = async (): Promise<ChartDataset<any, any> |null> => {
        if (!latitude || !longitude) return;
        const data = await OpenMeteo.getMovingAvgTemp({ lat: latitude, long: longitude })

        if (!data) return null;

        if(!daysOfCapturedData) handleSetupDaysConfig(data.daily.temperature_2m_max.length);

        const temperaturesMax = data.daily.temperature_2m_max.slice(0, selectedDays);
        const temperaturesMin = data.daily.temperature_2m_min.slice(0, selectedDays);

        const temperatureMaxChartData = temperaturesMax.map((point: number, i: number) => {
            return {
                y: point,
                x: data.daily.time[i],
            }
        })

        const temperatureMinChartData = temperaturesMin.map((point: number, i: number) => {
            return {
                y: point,
                x: data.daily.time[i],
            }
        })

        return [{
            label: 'Daily Max Tempature',
            data: [...temperatureMaxChartData],
            fill: false,
            borderColor: '#F47174',
            tension: 0.1
        }, {
            label: 'Daily Min Tempature',
            data: [...temperatureMinChartData],
            fill: false,
            borderColor: '#a83242',
            tension: 0.1
        }]

    }

    const handleWaveData = async (): Promise<ChartDataset<any, any> |null> => {
        if (!latitude || !longitude) return;
        const data = await OpenMeteo.getMovingAvgWaveHeight({ lat: latitude, long: longitude })

        if (!data) return null;

        if(!daysOfCapturedData) handleSetupDaysConfig(data.daily.wave_height_max.length);

        const wavesToDisplay = data.daily.wave_height_max.slice(0, selectedDays);
        const swellWavesToDisplay = data.daily.swell_wave_height_max.slice(0, selectedDays);

        const wavesChartData = wavesToDisplay.map((point: number, i: number) => {
            return {
                y: point,
                x: data.daily.time[i],
            }
        })

        const swellWavesChartData = swellWavesToDisplay.map((point: number, i: number) => {
            return {
                y: point,
                x: data.daily.time[i],
            }
        })

        return [{
            label: 'Max wave height',
            data: wavesChartData,
            fill: false,
            borderColor: '#F47174',
            tension: 0.1
        },
        {
            label: 'Swell max wave height',
            data: swellWavesChartData,
            fill: false,
            borderColor: '#a83242',
            tension: 0.1
        },
    ]

    }

    useEffect(() => {
        setLoading(true);

        const createDatasource = async () => {  
            const datasource: ChartDataset<any, any> | null = await datasourceFactory() 
            setDatasource(datasource)
        }

        createDatasource();
        if(datasource) setLoading(false);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latitude, longitude, selectedDays])

    return { datasource, daysOfCapturedData, selectedDays, handleSelectedDays, isLoading }

}
