import { LineChartIcon, CandlestickChartIcon } from "lucide-react";

export default function ChartSwitcher({
  candleChart,
  setCandleChart,
}: {
  candleChart: boolean;
  setCandleChart: (value: boolean) => void;
}) {
  return (
    <div className="w-[5%] flex flex-col justify-top mt-20 p-2 gap-5 items-center">
      <LineChartIcon
        onClick={() => setCandleChart(false)}
        className={`w-6 h-6 cursor-pointer transition-colors ${!candleChart ? "text-green-500" : "text-gray-500"}`}
      />
      <CandlestickChartIcon
        onClick={() => setCandleChart(true)}
        className={`w-6 h-6 cursor-pointer transition-colors ${candleChart ? "text-green-500" : "text-gray-500"}`}
      />
    </div>
  );
}
