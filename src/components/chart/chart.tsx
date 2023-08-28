import React from 'react';
import '../../App.css';
import { useEffect, useRef } from "react";
import { Chart,  } from "chart.js/auto";
import 'chartjs-adapter-moment';

interface IGeoChartProps {
    datasource: any | null;
    selectedDays?: string;
    handleSelectedDays: (totalDays: string) => void;
}

function GeoChart({ datasource, handleSelectedDays, selectedDays }: IGeoChartProps) {
    const myChart = useRef<Chart>();

    useEffect(() => {
        const canvas = document.getElementById('myChart') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');
        
        const createChart = () => {  
            if (!datasource || !ctx) return;

            if (myChart.current) myChart.current.destroy();

            myChart.current = new Chart(ctx, {
                type: "line",
                data: {
                    labels: datasource[0].data.slice(0, selectedDays).map(({ x }: { x: string }) => x),
                    datasets: datasource,
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
    }, [selectedDays, handleSelectedDays, datasource])

    return <canvas id='myChart' />
}

export default GeoChart;
