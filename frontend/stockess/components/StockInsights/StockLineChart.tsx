"use client";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useApexZoomEvents } from "./UseApexZoomEvents";
import { Marker, OHLCChunk } from "./StockService";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StockLineChartProps {
  OHLCHistory: OHLCChunk[];
  markersMap: Record<string, Marker[]>;
  setVisibleRange: (value: { min: string; max: string } | null) => void;
}

export default function StockLineChart({
  OHLCHistory,
  markersMap,
  setVisibleRange,
}: StockLineChartProps) {
  const isResettingZoom = useRef(false);
  const zoomEvents = useApexZoomEvents({ isResettingZoom, setVisibleRange });

  const priceData = OHLCHistory.map(({ ohlc }) => ({
    x: ohlc.date,
    y: ohlc.close,
  }));

  const prices = OHLCHistory.map((d) => d.ohlc.close);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.3;

  const series = [
    {
      name: "",
      data: priceData,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      zoom: {
        type: "x",
        enabled: true,
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
    stroke: {
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      hover: {
        size: 4,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
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
            radius: 1,
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
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const date = w.globals.categoryLabels[dataPointIndex];
        const price = series[seriesIndex][dataPointIndex];
        const patterns = markersMap[date];

        return `
          <div class="text-black text-xs p-2 rounded-md space-y-1 max-w-[200px]">
            <div class="font-medium">${price} PLN</div>
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
      <Chart options={options} series={series} type="area" height="100%" />
    </div>
  );
}
