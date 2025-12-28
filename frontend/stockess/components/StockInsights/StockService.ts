import { request } from "../../utils/api";
import { Pattern } from "./PatternSelector";

// -------------- TYPES --------------
export type OHLC = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type OHLCChunk = {
  ohlc: OHLC;
  startDate: string;
};

export type TimeRange = "1M" | "6M" | "1Y" | "MAX";

export type PatternSignal = "bullish" | "bearish";

export interface PatternsResp {
  [pattern: string]: { date: string; signal: PatternSignal }[];
}

export interface Marker {
  name: string;
  height: number;
  color: string;
  shape: string | null;
}

export type PatternMarkersMap = Record<string, Marker[]>;

// -------------- API --------------
export const fetchStockHistory = (ticker: string) =>
  request<{ ohlc_history: OHLC[] }>(`/stock-prices?ticker=${ticker}`);

export const fetchCandlestickPatterns = (ticker: string) =>
  request<{ patterns: PatternsResp }>(
    `/candlestick-formations?ticker=${ticker}`,
  );

// -------------- HELPERS --------------
export function getLastSessions(history: OHLC[], days = 66): OHLC[] {
  return history.slice(-days);
}

export function downsampleOHLCVisible(
  data: OHLC[],
  targetPoints: number,
  startDate: string | null,
  endDate: string | null,
): OHLCChunk[] {
  let visibleData: OHLC[] = [];

  if (startDate && endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    visibleData = data.filter((d) => {
      const t = new Date(d.date).getTime();
      return t >= start && t <= end;
    });
  } else {
    visibleData = data;
  }

  const n = visibleData.length;
  if (n <= targetPoints) {
    return visibleData.map((ohlc) => {
      return {
        ohlc: ohlc,
        startDate: ohlc.date,
      };
    });
  }
  const chunkSize = n / targetPoints;
  const downsampled: OHLCChunk[] = [];

  for (let i = 0; i < targetPoints; i++) {
    const start = Math.floor(i * chunkSize);
    const end = Math.floor((i + 1) * chunkSize);
    const chunk = visibleData.slice(start, end);

    if (!chunk.length) continue;

    const open = chunk[0].open;
    const close = chunk[chunk.length - 1].close;
    const high = Math.max(...chunk.map((d) => d.high));
    const low = Math.min(...chunk.map((d) => d.low));
    const startDate = chunk[0].date;
    const endDate = chunk[chunk.length - 1].date;

    downsampled.push({
      ohlc: { open, high, low, close, date: endDate },
      startDate,
    });
  }

  return downsampled;
}

export function getMinMax(prices: OHLCChunk[]) {
  return {
    min: Math.min(...prices.map((d) => d.ohlc.low)),
    max: Math.max(...prices.map((d) => d.ohlc.high)),
  };
}

export function buildPatternMarkersMap(
  selectedPatterns: Pattern[],
  patternsOccurrences: PatternsResp,
  downsampled: OHLCChunk[],
): PatternMarkersMap {
  const { min, max } = getMinMax(downsampled);
  const padding = (max - min) * 0.03;

  const markers: PatternMarkersMap = {};

  selectedPatterns.forEach((pattern) => {
    const occurrences = patternsOccurrences[pattern.name] || [];
    const color = pattern.color;

    occurrences.forEach(({ date, signal }) => {
      const day = downsampled.find((d) => {
        const checkedDay = new Date(date).getTime();
        const start = new Date(d.startDate).getTime();
        const end = new Date(d.ohlc.date).getTime();
        return checkedDay >= start && checkedDay <= end;
      });
      if (!day) return;
      if (!markers[day.ohlc.date]) markers[day.ohlc.date] = [];

      const height = markers[day.ohlc.date].length + 1;
      markers[day.ohlc.date].push({
        name: pattern.name,
        height: day.ohlc.high + padding * height,
        color,
        shape: signal === "bullish" ? "circle" : "diamond",
      });
    });
  });

  return markers;
}
