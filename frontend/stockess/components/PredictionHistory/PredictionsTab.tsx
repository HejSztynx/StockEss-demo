import { useCompanyContext } from "@/context/CompanyContext";
import PredictionsTable from "@/components/PredictionHistory/PredictionsTable"
import PredictionRangeSelection from "./PredictionRangeSelection";
import PredictionDatesFilterSelection from "./PredictionDatesFilterSelection";
import { filterPredictionData, calcAverageError } from "./PredictionService";

export default function PredictionsTab() {
  const {
    predictionData,
    selectedPredictionRange,
    selectedMonth,
    selectedYear,
  } = useCompanyContext();

  const filteredData = filterPredictionData(predictionData, selectedMonth, selectedYear);
  const avgError = calcAverageError(filteredData, selectedPredictionRange)

  return (
    <div className="space-y-4">
      <PredictionRangeSelection/>
      <PredictionDatesFilterSelection/>

      <div className="text-sm text-center text-gray-600 mt-2">
        {avgError !== null ? (
          <>
          Average prediction error: <span className="font-semibold">{avgError!.toFixed(2)}%</span>
          </>
        ) : (
          <>
          Not enough data to calculate average error
          </>
        )}
      </div>

      <PredictionsTable filteredData={filteredData}/>
    </div>
  );
}
  