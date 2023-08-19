"use client"
import { useEffect, useRef, useState } from "react";
import { Chart, ChartTypeRegistry } from "chart.js/auto";
import ForcastAPI from "../api/Forcast";
import 'chartjs-adapter-moment';
import { LineWithErrorBarsChart, LineWithErrorBarsController, PointWithErrorBar } from 'chartjs-chart-error-bars';

// register controller in chart.js and ensure the defaults are set
interface IGetMovingAvgTemp {
    lat?: number;
    long?: number;
}

interface IDaysOptions {
    value: string,
    label: string,
}

export default function useChart({ lat, long }: IGetMovingAvgTemp) {
    const myChart = useRef<Chart>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [days, setDays] = useState<string>();
    const [daysOptions, setDaysOptions] = useState<IDaysOptions[]>([]);

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
     
    useEffect(() => {
        const canvas = document.getElementById('myChart') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');

        const createChart = async () => {  

            if (!ctx || !lat || !long) return;
            const { data } = await ForcastAPI.getMovingAvgTemp({ lat, long })

            if (myChart.current) myChart.current.destroy();
            if (!data) return;

            if(!days || !daysOptions){
                setDays(data.daily.temperature_2m_max.length);
                const options = Array.from({length: data.daily.temperature_2m_max.length},(_, index)=> ({ value: (index + 1).toString(), label: (index + 1).toString() }))
                setDaysOptions(options);
            } 

            const tempByDays = data.daily.temperature_2m_max.slice(0, days);

            const temperature = tempByDays.map((point: number, i: number) => {
                return {
                    y: point,
                    x: data.daily.time[i],
                    yMax: getStandardDeviation(data.daily.temperature_2m_max) * 1.96,
                }
            })

            const datasets = [{
                label: 'Daily Tempature',
                data: temperature,
                yMin: 1.96,
                yMax: 2.96,
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

    }, [lat, long, setLoading, days, daysOptions])

    return { isLoading, days, daysOptions, handleUpdateDays }

}
