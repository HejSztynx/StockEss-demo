"use client";

import { useEffect, useState } from "react";
import { useCompanyContext } from "@/context/CompanyContext";
import { cn } from "@/lib/utils";
import { companyToTickerMap } from "@/constants/constants";
import { getProcessedReports, ReportType } from "./ReportsService";

export default function EarningsTab() {
  const { selectedCompany } = useCompanyContext();
  const [reportType, setReportType] = useState<ReportType>("balance_sheet");
  const [reportData, setReportData] = useState<Record<string, any>>({});
  const [years, setYears] = useState<string[]>([]);
  const ticker = selectedCompany && companyToTickerMap[selectedCompany]
    ? companyToTickerMap[selectedCompany]
    : null;

  useEffect(() => {
    if (!ticker) return;

    getProcessedReports(ticker, reportType)
      .then(({ data, years }) => {
        setReportData(data);
        setYears(years);
      })
      .catch((err) => console.error("Failed to fetch reports", err));
  }, [ticker, reportType]);

  const currentData = reportData[reportType] || {};

  const allMetrics = Array.from(
    new Set(
      Object.values(currentData).flatMap((entry) =>
        Object.keys(entry || {})
      )
    )
  );

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-center gap-2">
        {(["balance_sheet", "cashflow", "financials"] as ReportType[]).map((type) => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={cn(
              "px-3 py-1 rounded-md text-sm font-medium",
              reportType === type ? "bg-black text-white" : "bg-gray-200 text-gray-700"
            )}
          >
            {type.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div className="overflow-auto">
        <table className="min-w-full text-sm text-left border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-2">Parameter</th>
              {years.map((year) => (
                <th key={year} className="px-2 py-2 text-center">{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allMetrics.map((metric) => (
              <tr key={metric} className="border-t">
                <td className="px-2 py-2 font-medium">{metric}</td>
                {years.map((year) => {
                  const dateKey = `${year}-12-31`;
                  const value = currentData?.[dateKey]?.[metric];
                  return (
                    <td key={year} className="px-2 py-2 text-right">
                      {value === undefined || value === null || isNaN(value)
                        ? <span className="text-gray-400">–</span>
                        : value.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
