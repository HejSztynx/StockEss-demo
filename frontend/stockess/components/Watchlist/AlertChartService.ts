import { request } from "@/utils/api";

export type TimeRange = '1M' | '6M' | '1Y' | 'MAX';
export interface AlertOccurrence {
  date: string;
  message: string;
}

export interface AlertResponse {
  occurrences: AlertOccurrence[];
}

export const fetchAlertOccurrences = async (
  alertId: number,
  ticker: string
): Promise<AlertResponse> => {
  return request<AlertResponse>(
    `/analysis/perform`,
    {
      method: "POST",
      body: {
        alertId,
        ticker,
      },
    }
  );
};
