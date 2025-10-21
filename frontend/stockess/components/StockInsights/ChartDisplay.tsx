import StockCandleStickChart from "./StockCandleStickChart";
import StockLineChart from "./StockLineChart";
import ChartSwitcher from "./ChartSwitcher";

export default function ChartDisplay({
  candleChart,
  setCandleChart,
  OHLCHistory,
  patternMarkersMap,
}: {
  candleChart: boolean;
  setCandleChart: (value: boolean) => void;
  OHLCHistory: any[];
  patternMarkersMap: Record<string, { name: string; height: number; color: string }[]>;
}) {
  return (
    <div className="w-full h-[50vh] flex">
      <ChartSwitcher candleChart={candleChart} setCandleChart={setCandleChart} />
      <div className="w-[90%]">
        {candleChart ? (
          <StockCandleStickChart OHLCHistory={OHLCHistory} patternMarkersMap={patternMarkersMap} />
        ) : (
          <StockLineChart OHLCHistory={OHLCHistory} patternMarkersMap={patternMarkersMap} />
        )}
      </div>
      <div className="w-[5%]" />
    </div>
  );
}
