import { createContext, useContext } from "react";

interface CompanyContextProps {
    selectedCompany: string | null;
    currentPrice: number | null;
    oldestPrice: number | null;
    predictionPrices: {
        m1: number | null;
        m3: number | null;
        m6: number | null;
        y1: number | null;
    };
    predictionData: any[];
    OHLCHistory: { date: string; open: number; high: number; low: number; close: number }[];
    selectedPredictionRange: "1m" | "3m" | "6m" | "1y";
    setSelectedPredictionRange: (range: "1m" | "3m" | "6m" | "1y") => void;
    selectedMonth: number | null;
    setSelectedMonth: (month: number | null) => void;
    selectedYear: number | null;
    setSelectedYear: (year: number | null) => void;
}

export const CompanyContext = createContext<CompanyContextProps | undefined>(undefined);

export const useCompanyContext = () => {
    const context = useContext(CompanyContext);
    if (!context) throw new Error("useCompanyContext must be used within CompanyProvider");
    return context;
};
