import { cn } from "@/lib/utils";
import { useCompanyContext } from "@/context/CompanyContext";

export default function PredictionRangeSelection() {
    const {
        selectedPredictionRange,
        setSelectedPredictionRange
    } = useCompanyContext();

    return (
        <div className="flex justify-center gap-2">
            {["1m", "3m", "6m", "1y"].map(range => (
                <button
                key={range}
                onClick={() => setSelectedPredictionRange(range as any)}
                className={cn(
                    "px-3 py-1 rounded-md text-sm font-medium",
                    selectedPredictionRange === range ? "bg-black text-white" : "bg-gray-200 text-gray-700"
                )}
                >
                {range.toUpperCase()}
                </button>
            ))}
        </div>
    );
}