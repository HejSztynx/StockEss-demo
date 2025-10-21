import { request } from "../../utils/api";
import { Pattern } from "./PatternSelector";

// -------------- TYPES --------------
export type OHLC = { 
  date: string; 
  open: number; 
  high: number; 
  low: number; 
  close: number 
};

export type PatternSignal = "bullish" | "bearish";

export interface PatternsResp {
  [pattern: string]: { date: string; signal: PatternSignal }[];
}

export interface Marker {
  name: string;
  height: number;
  color: string;
  signal: string;
}

export type PatternMarkersMap = Record<string, Marker[]>;

// -------------- API --------------
export const fetchStockHistory = (ticker: string) =>
  request<{ ohlc_history: OHLC[] }>(`/stock-prices?ticker=${ticker}`);

export const fetchCandlestickPatterns = (ticker: string) =>
  request<{patterns: PatternsResp}>(`/candlestick-formations?ticker=${ticker}`);

// -------------- HELPERS --------------
export function getLastSessions(history: OHLC[], days = 66): OHLC[] {
  return history.slice(-days)
}

export function getMinMax(prices: OHLC[]) {
  return {
    min: Math.min(...prices.map((d) => d.low)),
    max: Math.max(...prices.map((d) => d.high)),
  };
}

export function buildPatternMarkersMap(
  selectedPatterns: Pattern[],
  patternsOccurrences: PatternsResp,
  lastMonth: OHLC[],
): PatternMarkersMap {
  const { min, max } = getMinMax(lastMonth);
  const padding = (max - min) * 0.03;

  const markers: PatternMarkersMap = {};

  selectedPatterns.forEach((pattern) => {
    const patternName = typeof pattern === "string" ? pattern : pattern.name;
    const occurrences = patternsOccurrences[patternName] || [];
    const color = pattern.color;

    occurrences.forEach(({ date, signal }) => {
      const day = lastMonth.find((d) => d.date === date);
      if (!day) return;
      if (!markers[date]) markers[date] = [];

      const height = markers[date].length + 1;
      markers[date].push({
        name: patternName,
        height: day.high + padding * height,
        color,
        signal,
      });
    });
  });

  return markers;
}