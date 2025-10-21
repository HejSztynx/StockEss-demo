"use client";

import { ApexOptions } from "apexcharts";

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StockLineChartProps {
  OHLCHistory: { date: string; open: number; high: number; low: number; close: number }[];
  patternMarkersMap: Record<string, { name: string, height: number; color: string, signal: string }[]>;
}

export default function StockLineChart({
  OHLCHistory,
  patternMarkersMap
}: StockLineChartProps) {
  const mockData = OHLCHistory.map(({ date, close }) => ({
    x: date,
    y: close
  }));

  const prices = OHLCHistory.map(d => d.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.3;

  const series = [
    {
      name: '',
      data: mockData
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: 'area',
      stacked: false,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    stroke: {
      width: 2
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
      hover: {
        size: 4
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    annotations: {
      points: Object.entries(patternMarkersMap).flatMap(([date, markers]) =>
        markers.map(({ height, color, signal }) => ({
          x: date,
          y: height,
          marker: {
            size: 5,
            fillColor: color,
            strokeColor: '#fff',
            radius: 1,
            shape: signal === 'bullish' ? 'circle' : 'diamond'

          },
          label: {
            text: '',
            style: {
              color: '#fff',
              background: color,
              fontSize: '10px'
            }
          }
        }))
      )
    },
    xaxis: {
      tickAmount: 6,
      type: 'category',
      labels: {
        rotate: 0
      },
      tooltip: {
        enabled: true
      }
    },
    yaxis: {
      max: maxPrice + padding,
      tooltip: {
        enabled: true
      }
    },
    tooltip: {
      shared: false,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const date = w.globals.categoryLabels[dataPointIndex];
        const price = series[seriesIndex][dataPointIndex];
        const patterns = patternMarkersMap[date];
        
        return `
          <div class="text-black text-xs p-2 rounded-md space-y-1 max-w-[200px]">
            <div class="font-medium">${price} PLN</div>
            ${patterns ? `
              <div class="pt-1 space-y-0.5">
                ${patterns.map(p => `
                  <div class="font-medium" style="color: ${p.color}">${p.name}</div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `;
      }
    }
  };

  return (
    <div className="w-full h-full pt-0 px-6 pb-6">
      <Chart options={options} series={series} type='area' height="100%"/>
    </div>
  );
}
