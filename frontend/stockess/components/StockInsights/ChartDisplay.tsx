import StockCandleStickChart from "./StockCandleStickChart";
import StockLineChart from "./StockLineChart";
import ChartSwitcher from "./ChartSwitcher";
import { Marker, OHLCChunk, TimeRange } from "./StockService";
import { Button } from "../ui/button";

export default function ChartDisplay({
  candleChart,
  setCandleChart,
  OHLCHistory,
  markersMap,
  setVisibleRange,
  timeRange,
  setTimeRange,
}: {
  candleChart: boolean;
  setCandleChart: (value: boolean) => void;
  OHLCHistory: OHLCChunk[];
  markersMap: Record<string, Marker[]>;
  setVisibleRange: (value: { min: string; max: string } | null) => void;
  timeRange: TimeRange;
  setTimeRange: (val: TimeRange) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full h-[50vh] flex">
        <ChartSwitcher candleChart={candleChart} setCandleChart={setCandleChart} />
        <div className="w-[90%]">
          {candleChart ? (
            <StockCandleStickChart OHLCHistory={OHLCHistory} markersMap={markersMap} setVisibleRange={setVisibleRange}/>
          ) : (
            <StockLineChart OHLCHistory={OHLCHistory} markersMap={markersMap} setVisibleRange={setVisibleRange}/>
          )}
        </div>
        <div className="w-[5%]" />
      </div>
      <div className="flex justify-end gap-2 mb-2">
        {['1M', '6M', '1Y', 'MAX'].map(range => (
          <Button
            key={range}
            size="sm"
            variant={timeRange === range ? 'default' : 'outline'}
            onClick={() => setTimeRange(range as '1M' | '6M' | '1Y' | 'MAX')}
          >
            {range}
          </Button>
        ))}
      </div>
    </div>

  );
}
