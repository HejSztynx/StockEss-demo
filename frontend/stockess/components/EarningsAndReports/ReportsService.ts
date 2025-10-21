import { request } from "@/utils/api";

export type ReportType = "balance_sheet" | "cashflow" | "financials";

function fetchReports(ticker: string): Promise<Record<string, any>> {
  return request(`/reports?ticker=${ticker}`);
}

export async function getProcessedReports(
    ticker: string, 
    reportType: ReportType
): Promise<{
    data: Record<string, any>; 
    years: string[];
}> {
    const rawData = await fetchReports(ticker);
    const selected = rawData?.[reportType] ?? {};

    const years = Object.keys(selected).map((d) => d.slice(0, 4));
    return {
        data: rawData,
        years,
    };
}