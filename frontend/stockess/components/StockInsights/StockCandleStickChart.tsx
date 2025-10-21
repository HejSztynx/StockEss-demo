"use client";

import { ApexOptions } from "apexcharts";

import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface StockCandleStickChartProps {
  OHLCHistory: { date: string; open: number; high: number; low: number; close: number }[];
  patternMarkersMap: Record<string, { name: string, height: number; color: string, signal: string }[]>;
}


export default function StockCandleStickChart({
  OHLCHistory,
  patternMarkersMap
}: StockCandleStickChartProps) {
  const mockData = OHLCHistory.map(({ date, open, high, low, close }) => ({
    x: date,
    y: [open, high, low, close]
  }));

  const series = [
    {
      data: mockData
    }
  ];

  const minPrice = Math.min(...OHLCHistory.map(d => d.low));
  const maxPrice = Math.max(...OHLCHistory.map(d => d.high));
  const padding = (maxPrice - minPrice) * 0.3;
  
  const options: ApexOptions = {
    chart: {
      type: 'candlestick',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
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
            radius: 2,
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
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const date = w.globals.categoryLabels[dataPointIndex];
        const ohlc = w.config.series[seriesIndex].data[dataPointIndex].y;
        const patterns = patternMarkersMap[date];

        const [open, high, low, close] = ohlc;

        return `
          <div class="text-black text-xs p-2 rounded-md space-y-1 max-w-[200px]">
            <div class="font-medium">O: ${open} PLN</div>
            <div class="font-medium">H: ${high} PLN</div>
            <div class="font-medium">L: ${low} PLN</div>
            <div class="font-medium">C: ${close} PLN</div>
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
      <Chart options={options} series={series} type='candlestick' height="100%"/>
    </div>
  );
}
