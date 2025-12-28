import { useEffect, useState, useMemo } from "react";
import { fetchStockHistory } from "@/components/StockInsights/StockService";
import { fetchAlertOccurrences, AlertOccurrence, TimeRange } from "./AlertChartService";
import ChartDisplay from "@/components/StockInsights/ChartDisplay";
import { OHLC, downsampleOHLCVisible, OHLCChunk } from "@/components/StockInsights/StockService";
import { Button } from "../ui/button";

interface Props {
  alertId: number;
  companies: string[];
  onClose: () => void;
}

export default function AlertChartModal({ alertId, companies, onClose }: Props) {
  const [selectedCompany, setSelectedCompany] = useState(companies[0]);
  const [ohlcData, setOhlcData] = useState<OHLC[]>([]);
  const [occurrences, setOccurrences] = useState<AlertOccurrence[]>([]);
  const [loading, setLoading] = useState(false);
  const [candleChart, setCandleChart] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('MAX');
  const [visibleRange, setVisibleRange] = useState<{ min: string; max: string } | null>(null);

  useEffect(() => {
    if (!ohlcData.length) return;

    const lastDate = new Date(ohlcData[ohlcData.length - 1].date);
    let minDate: Date | null = null;

    switch (timeRange) {
      case "1M":
        minDate = new Date(lastDate);
        minDate.setMonth(minDate.getMonth() - 1);
        break;
      case "6M":
        minDate = new Date(lastDate);
        minDate.setMonth(minDate.getMonth() - 6);
        break;
      case "1Y":
        minDate = new Date(lastDate);
        minDate.setFullYear(minDate.getFullYear() - 1);
        break;
      case "MAX":
      default:
        minDate = null;
    }

    if (minDate) {
      const filtered = ohlcData.filter((d) => new Date(d.date) >= minDate);
      setVisibleRange({
        min: filtered[0]?.date ?? ohlcData[0].date,
        max: ohlcData[ohlcData.length - 1].date,
      });
    } else {
      setVisibleRange(null);
    }
  }, [timeRange, ohlcData]);

  const downsampled = useMemo(() => {
    return !visibleRange
      ? downsampleOHLCVisible(ohlcData, 132, null, null)
      : downsampleOHLCVisible(ohlcData, 132, visibleRange.min, visibleRange.max);
  }, [ohlcData, visibleRange]);

  const markersMap = useMemo(() => {
    const map: Record<string, { height: number; color: string; shape: string | null; name: string }[]> = {};
    const { min, max } = downsampled.length
      ? {
          min: Math.min(...downsampled.map((d) => d.ohlc.low)),
          max: Math.max(...downsampled.map((d) => d.ohlc.high)),
        }
      : { min: 0, max: 0 };
    const padding = (max - min) * 0.03;

    occurrences.forEach((occ, i) => {
      const match = downsampled.find((d) => {
        const t = new Date(occ.date).getTime();
        const start = new Date(d.startDate).getTime();
        const end = new Date(d.ohlc.date).getTime();
        return t >= start && t <= end;
      });

      if (!match) return;
      const date = match.ohlc.date;
      if (!map[date]) map[date] = [];
      const height = match.ohlc.high + padding * (map[date].length + 1);
      map[date].push({
        name: occ.date,
        height,
        color: "#ff0000",
        shape: "circle",
      });
    });

    return map;
  }, [occurrences, downsampled]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const ticker = selectedCompany;
        const [ohlcRes, alertRes] = await Promise.all([
          fetchStockHistory(ticker),
          fetchAlertOccurrences(alertId, ticker),
        ]);
        setOhlcData(ohlcRes.ohlc_history);
        setOccurrences(alertRes.occurrences);
      } catch (err) {
        console.error("Failed to load chart data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [selectedCompany]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-[90%] max-w-5xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Alert Chart</h2>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="company">Company:</label>
          <select
            id="company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {companies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="text-center text-gray-500">Loading chart...</div>
        ) : (
          <ChartDisplay
            candleChart={candleChart}
            setCandleChart={setCandleChart}
            OHLCHistory={downsampled}
            markersMap={markersMap}
            setVisibleRange={setVisibleRange}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        )}
      </div>
    </div>
  );
}
