"use client"
import { useEffect, useRef, useState } from "react";
import { Chart, ChartTypeRegistry } from "chart.js/auto";
import ForcastAPI from "../api/Forcast";
import 'chartjs-adapter-moment';
import { LineWithErrorBarsChart, LineWithErrorBarsController, PointWithErrorBar } from 'chartjs-chart-error-bars';
import { useLocation } from '../hooks/location';

interface IDaysOptions {
    value: string,
    label: string,
}

export default function useChart() {
    const myChart = useRef<Chart>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [days, setDays] = useState<string>();
    const [daysOptions, setDaysOptions] = useState<IDaysOptions[]>([]);
    const { latitude, longitude } = useLocation();

    Chart.register(LineWithErrorBarsChart, LineWithErrorBarsController, PointWithErrorBar);

    const getStandardDeviation = (data: number[]) => {
 
        const mean = data.reduce((acc, curr) => {
            return acc + curr
        }, 0) / data.length;
    
        const calc = data.map((k) => {
            return (k - mean) ** 2
        });
     
        const sum = calc.reduce((acc, curr) => acc + curr, 0);
     
        // Returning the standard deviation
        return Math.sqrt(sum / calc.length)
    }

    const handleUpdateDays = (newDays: string) => {
        setDays(newDays);
    }

    const handleSetupDaysConfig = (totalDays: number) => {
        setDays(totalDays.toString());
        const options = Array.from({length: totalDays},(_, index)=> ({ value: (index + 1).toString(), label: (index + 1).toString() }))
        setDaysOptions(options);
    }
     
    useEffect(() => {
        const canvas = document.getElementById('myChart') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');

        const createChart = async () => {  

            if (!ctx || !latitude || !longitude) return;
            const { data } = await ForcastAPI.getMovingAvgTemp({ lat: latitude, long: longitude })

            if (myChart.current) myChart.current.destroy();
            if (!data) return;

            const totalDaysToDisplay: number = data.daily.temperature_2m_max.length
            if(!days || !daysOptions) handleSetupDaysConfig(totalDaysToDisplay);

            const temperaturesToDisplay = data.daily.temperature_2m_max.slice(0, days);

            const temperatureChartData = temperaturesToDisplay.map((point: number, i: number) => {
                return {
                    y: point,
                    x: data.daily.time[i],
                    yMax: getStandardDeviation(data.daily.temperature_2m_max) * 1.96,
                }
            })

            const datasets = [{
                label: 'Daily Tempature',
                data: temperatureChartData,
                fill: false,
                borderColor: '#F47174',
                tension: 0.1
              }]
            
            myChart.current = new Chart(ctx, {
                type: LineWithErrorBarsChart.id as keyof ChartTypeRegistry,
                data: {
                    labels: data.daily.time.slice(0, days).map((el: string )=> el),
                    datasets,
                },
                options: {
                    layout: {
                        padding: 20,
                    },
                    scales: {
                        xAxis: {
                          type: 'time',
                        }
                      }
                }
            });

        }

        createChart();
        setLoading(false);

    }, [setLoading, days, daysOptions, latitude, longitude])

    return { isLoading, days, daysOptions, handleUpdateDays }

}
