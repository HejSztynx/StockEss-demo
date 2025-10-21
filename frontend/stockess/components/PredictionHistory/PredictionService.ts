import { request } from "../../utils/api";

// -------------- API calls --------------
export const fetchPredictionHistory = (ticker: string) =>
    request<any[]>(`/prediction-history?ticker=${ticker}`);

export const fetchPrediction = (
  ticker: string,
  period: "1m" | "3m" | "6m" | "1y",
) =>
  request<{ predicted_price: number | null }>(
    `/stock-prices/predict?ticker=${ticker}&period=${period}`
);

// -------------- HELPERS --------------
export type PredictionRange = "1m" | "3m" | "6m" | "1y";

export function filterPredictionData(
  data: any[],
  month?: number | null,
  year?: number | null,
) {
  return data.filter((item) => {
    const date = new Date(item.date);
    const matchesMonth = month ? date.getMonth() + 1 === month : true;
    const matchesYear = year ? date.getFullYear() === year : true;
    return matchesMonth && matchesYear;
  });
}

export function calcAverageError(
  data: any[],
  range: PredictionRange,
): number | null {
  const errors = data
    .map((item) => item[`surprise${range}`] as number | null)
    .filter((e): e is number => e !== null)
    .map((e) => Math.abs(e));

  if (!errors.length) return null;

  const sum = errors.reduce((acc, val) => acc + val, 0);
  return sum / errors.length;
}