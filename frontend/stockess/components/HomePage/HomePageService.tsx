"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchStockHistory } from "../StockInsights/StockService";
import { checkSession } from "../Auth/AuthService";
import {
  fetchPredictionHistory,
  fetchPrediction,
} from "../PredictionHistory/PredictionService";
import { companyToTickerMap } from "@/constants/constants";

type OHLC = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

export const useHomePageService = () => {
  /* -------------------------------------------------- */
  /* ▸ 1. GLOBAL                                        */
  /* -------------------------------------------------- */
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  /* -------------------------------------------------- */
  /* ▸ 2. LOCAL STATE                                   */
  /* -------------------------------------------------- */
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "insights" | "predictions" | "earnings" | "news"
  >("insights");

  const [ohlcHistory, setOhlcHistory] = useState<OHLC[]>([]);
  const [predictionData, setPredictionData] = useState<any[]>([]);

  const [predictionPrices, setPredictionPrices] = useState({
    m1: null as number | null,
    m3: null as number | null,
    m6: null as number | null,
    y1: null as number | null,
  });

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);

  const [selectedPredictionRange, setSelectedPredictionRange] = useState<
    "1m" | "3m" | "6m" | "1y"
  >("1m");

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    today.getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(
    today.getFullYear(),
  );

  /* -------------------------------------------------- */
  /* ▸ 3. EFFECTS                                       */
  /* -------------------------------------------------- */
  // is session still valid?
  useEffect(() => {
    checkSession();
  }, []);

  // update latest stock price
  useEffect(() => {
    if (!ohlcHistory.length) {
      setCurrentPrice(null);
      return;
    }
    setCurrentPrice(ohlcHistory.at(-1)!.close);
  }, [ohlcHistory]);

  /* -------------------------------------------------- */
  /* ▸ 4. HELPERY                                       */
  /* -------------------------------------------------- */
  const resetSelectedCompanyData = () => {
    setOhlcHistory([]);
    setPredictionData([]);
    setPredictionPrices({ m1: null, m3: null, m6: null, y1: null });
    setSelectedPredictionRange("1m");
    setSelectedMonth(today.getMonth() + 1);
    setSelectedYear(today.getFullYear());
  };

  /* -------------------------------------------------- */
  /* ▸ 5. HANDLERY                                      */
  /* -------------------------------------------------- */
  const handleSelectCompany = useCallback(
    async (company: string) => {
      setSelectedCompany(company);

      if (!isLoggedIn) return;

      resetSelectedCompanyData();
      setActiveTab("insights");

      const ticker = companyToTickerMap[company];
      if (!ticker) {
        console.error(`Brak tickera dla spółki: ${company}`);
        return;
      }

      try {
        const [historyData, predictionHistory, p1, p3, p6, p12] =
          await Promise.all([
            fetchStockHistory(ticker),
            fetchPredictionHistory(ticker),
            fetchPrediction(ticker, "1m"),
            fetchPrediction(ticker, "3m"),
            fetchPrediction(ticker, "6m"),
            fetchPrediction(ticker, "1y"),
          ]);

        setOhlcHistory(historyData.ohlc_history ?? []);
        setMinPrice(historyData.ohlc_history[0].close);
        setPredictionData(predictionHistory ?? []);
        setPredictionPrices({
          m1: p1.predicted_price ?? null,
          m3: p3.predicted_price ?? null,
          m6: p6.predicted_price ?? null,
          y1: p12.predicted_price ?? null,
        });
      } catch (err: any) {
        resetSelectedCompanyData();
      }
    },
    [isLoggedIn, setIsLoggedIn],
  );

  /* -------------------------------------------------- */
  /* ▸ 6. PUBLIC API                                    */
  /* -------------------------------------------------- */
  return {
    /* --- data --- */
    selectedCompany,
    activeTab,
    ohlcHistory,
    predictionData,
    predictionPrices,
    currentPrice,
    minPrice,
    selectedPredictionRange,
    selectedMonth,
    selectedYear,
    /* --- setters/handlers --- */
    setSelectedCompany,
    setCurrentPrice,
    setMinPrice,
    setActiveTab,
    setSelectedPredictionRange,
    setSelectedMonth,
    setSelectedYear,
    handleSelectCompany,
  };
};
