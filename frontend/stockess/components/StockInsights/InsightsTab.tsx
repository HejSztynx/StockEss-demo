import { useCompanyContext } from "@/context/CompanyContext";
import { useEffect, useState, useMemo } from "react";
import { companyToTickerMap } from "@/constants/constants";
import {
  buildPatternMarkersMap,
  downsampleOHLCVisible,
  fetchCandlestickPatterns,
  PatternMarkersMap,
  TimeRange,
} from "./StockService";
import ChartDisplay from "./ChartDisplay";
import PatternSelector, { Pattern } from "./PatternSelector";
import PredictionBoxes from "./PredictionBoxes";

export default function InsightsTab({
  currentPrice,
}: {
  currentPrice: number | null;
}) {
  const { predictionPrices, OHLCHistory, selectedCompany, setMinPrice } =
    useCompanyContext();

  const [candleChart, setCandleChart] = useState<boolean>(false);
  const [availablePatterns, setAvailablePatterns] = useState<string[]>([]);
  const [patternsOccurrences, setPatternsOccurrences] = useState({});
  const [selectedPatterns, setSelectedPatterns] = useState<Pattern[]>([]);

  const [visibleRange, setVisibleRange] = useState<{
    min: string;
    max: string;
  } | null>(null);
  const MAX_POINTS = 132;

  const [timeRange, setTimeRange] = useState<TimeRange>("MAX");

  const downsampled = useMemo(() => {
    if (!visibleRange) setTimeRange("MAX");
    return !visibleRange
      ? downsampleOHLCVisible(OHLCHistory, MAX_POINTS, null, null)
      : downsampleOHLCVisible(
          OHLCHistory,
          MAX_POINTS,
          visibleRange.min,
          visibleRange.max,
        );
  }, [visibleRange, OHLCHistory]);

  useEffect(() => {
    if (!OHLCHistory.length) return;

    const lastDate = new Date(OHLCHistory[OHLCHistory.length - 1].date);
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
      const filtered = OHLCHistory.filter((d) => new Date(d.date) >= minDate);
      setVisibleRange({
        min: filtered[0]?.date ?? OHLCHistory[0].date,
        max: OHLCHistory[OHLCHistory.length - 1].date,
      });
      setMinPrice(filtered[0]?.close ?? OHLCHistory[0].close);
    } else {
      setMinPrice(OHLCHistory[0].close);
      setVisibleRange(null);
    }
  }, [timeRange]);

  const patternMarkersMap: PatternMarkersMap = useMemo(
    () =>
      buildPatternMarkersMap(
        selectedPatterns,
        patternsOccurrences,
        downsampled,
      ),
    [selectedPatterns, patternsOccurrences, downsampled],
  );

  useEffect(() => {
    setSelectedPatterns([]);
    setVisibleRange(null);
    setTimeRange("MAX");
    if (!selectedCompany) return;
    const ticker = companyToTickerMap[selectedCompany];

    fetchCandlestickPatterns(ticker)
      .then((data) => {
        const patterns = data.patterns;
        setAvailablePatterns(Object.keys(patterns));
        setPatternsOccurrences(patterns);
      })
      .catch((err) =>
        console.error("Failed to fetch candlestick patterns", err),
      );
  }, [selectedCompany]);

  return (
    <div className="space-y-[2%] mb-[4%]">
      <ChartDisplay
        candleChart={candleChart}
        setCandleChart={setCandleChart}
        OHLCHistory={downsampled}
        markersMap={patternMarkersMap}
        setVisibleRange={setVisibleRange}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
      <PatternSelector
        availablePatterns={availablePatterns}
        selectedPatterns={selectedPatterns}
        setSelectedPatterns={setSelectedPatterns}
      />
      <PredictionBoxes
        predictionPrices={predictionPrices}
        currentPrice={currentPrice}
      />
    </div>
  );
}
