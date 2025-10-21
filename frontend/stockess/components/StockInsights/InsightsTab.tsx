import { useCompanyContext } from "@/context/CompanyContext";
import { useEffect, useState, useMemo } from "react";
import { companyToTickerMap } from "@/constants/constants"
import { buildPatternMarkersMap, fetchCandlestickPatterns, getLastSessions, PatternMarkersMap } from "./StockService";
import ChartDisplay from "./ChartDisplay"
import PatternSelector, { Pattern } from "./PatternSelector";
import PredictionBoxes from "./PredictionBoxes";

export default function InsightsTab() {
  const { predictionPrices, OHLCHistory, selectedCompany } = useCompanyContext();

  const [candleChart, setCandleChart] = useState<boolean>(false);
  const [availablePatterns, setAvailablePatterns] = useState<string[]>([]);
  const [patternsOccurrences, setPatternsOccurrences] = useState({});
  const [selectedPatterns, setSelectedPatterns] = useState<Pattern[]>([]);

  const lastMonth = useMemo(() => getLastSessions(OHLCHistory, 66), [OHLCHistory]);

  const patternMarkersMap: PatternMarkersMap = useMemo(
    () =>
      buildPatternMarkersMap(
        selectedPatterns,
        patternsOccurrences,
        lastMonth,
      ),
    [selectedPatterns, patternsOccurrences, lastMonth],
  );

  useEffect(() => {
    if (!selectedCompany) return;
    const ticker = companyToTickerMap[selectedCompany];

    fetchCandlestickPatterns(ticker)
      .then((data) => {
        const patterns = data.patterns;
        setAvailablePatterns(Object.keys(patterns));
        setPatternsOccurrences(patterns);
        setSelectedPatterns([]);
      })
      .catch((err) => console.error("Failed to fetch candlestick patterns", err));
  }, [selectedCompany]);

  return (
    <div className="space-y-[2%] mb-[4%]">
      <ChartDisplay
        candleChart={candleChart}
        setCandleChart={setCandleChart}
        OHLCHistory={lastMonth}
        patternMarkersMap={patternMarkersMap}
      />
      <PatternSelector
        availablePatterns={availablePatterns}
        selectedPatterns={selectedPatterns}
        setSelectedPatterns={setSelectedPatterns}
      />
      <PredictionBoxes predictionPrices={predictionPrices} />
    </div>
  );
}
