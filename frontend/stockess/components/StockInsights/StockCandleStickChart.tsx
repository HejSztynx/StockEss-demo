"use client";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useApexZoomEvents } from "./UseApexZoomEvents";
import { Marker, OHLCChunk } from "./StockService";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StockCandleStickChartProps {
  OHLCHistory: OHLCChunk[];
  markersMap: Record<string, Marker[]>;
  setVisibleRange: (value: { min: string; max: string } | null) => void;
}

export default function StockCandleStickChart({
  OHLCHistory,
  markersMap,
  setVisibleRange,
}: StockCandleStickChartProps) {
  const isResettingZoom = useRef(false);
  const zoomEvents = useApexZoomEvents({ isResettingZoom, setVisibleRange });

  const priceData = OHLCHistory.map(({ ohlc }) => ({
    x: ohlc.date,
    y: [ohlc.open, ohlc.high, ohlc.low, ohlc.close],
  }));

  const series = [
    {
      data: priceData,
    },
  ];

  const minPrice = Math.min(...OHLCHistory.map((d) => d.ohlc.low));
  const maxPrice = Math.max(...OHLCHistory.map((d) => d.ohlc.high));
  const padding = (maxPrice - minPrice) * 0.3;

  const options: ApexOptions = {
    chart: {
      type: "candlestick",
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
        allowMouseWheelZoom: false,
      },
      events: zoomEvents,
      toolbar: {
        autoSelected: "zoom",
        show: true,
        tools: {
          zoom: true,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: true,
        },
      },
    },
    annotations: {
      points: Object.entries(markersMap).flatMap(([date, markers]) =>
        markers.map(({ height, color, shape }) => ({
          x: date,
          y: height,
          marker: {
            size: 5,
            fillColor: color,
            strokeColor: "#fff",
            radius: 2,
            shape: shape ? shape : "circle",
          },
          label: {
            text: "",
            style: {
              color: "#fff",
              background: color,
              fontSize: "10px",
            },
          },
        })),
      ),
    },
    xaxis: {
      tickAmount: 6,
      type: "category",
      labels: {
        rotate: 0,
      },
      tooltip: {
        enabled: true,
      },
    },
    yaxis: {
      max: maxPrice + padding,
      tooltip: {
        enabled: true,
      },
    },
    tooltip: {
      shared: false,
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const date = w.globals.categoryLabels[dataPointIndex];
        const ohlc = w.config.series[seriesIndex].data[dataPointIndex].y;
        const patterns = markersMap[date];

        const [open, high, low, close] = ohlc;

        return `
          <div class="text-black text-xs p-2 rounded-md space-y-1 max-w-[200px]">
            <div class="font-medium">O: ${open} PLN</div>
            <div class="font-medium">H: ${high} PLN</div>
            <div class="font-medium">L: ${low} PLN</div>
            <div class="font-medium">C: ${close} PLN</div>
            ${
              patterns
                ? `
              <div class="pt-1 space-y-0.5">
                ${patterns
                  .map(
                    (p) => `
                  <div class="font-medium" style="color: ${p.color}">${p.name}</div>
                `,
                  )
                  .join("")}
              </div>
            `
                : ""
            }
          </div>
        `;
      },
    },
  };

  return (
    <div className="w-full h-full pt-0 px-6 pb-6">
      <Chart
        options={options}
        series={series}
        type="candlestick"
        height="100%"
      />
    </div>
  );
}
