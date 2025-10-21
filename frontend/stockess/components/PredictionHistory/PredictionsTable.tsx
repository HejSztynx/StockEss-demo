import { useCompanyContext } from "@/context/CompanyContext";

interface PredictionTableProps {
  filteredData: any[]
}

export default function PredictionsTable({filteredData} : PredictionTableProps) {
  const {
      selectedPredictionRange,
      selectedCompany
  } = useCompanyContext()

  return (
    <table className="min-w-full mt-4 text-sm text-center border border-gray-200 shadow-sm rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-2 py-2">Day</th>
          <th className="px-2 py-2">Price then</th>
          <th className="px-2 py-2">Predicted price</th>
          <th className="px-2 py-2">Real price</th>
          <th className="px-2 py-2">Surprise</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.length === 0 ? (
          <tr><td colSpan={5} className="py-4 text-gray-400">No prediction history available for {selectedCompany}</td></tr>
        ) : (
          filteredData.map((item, index) => {
            const prediction = item[`prediction${selectedPredictionRange}`];
            const real = item[`realPrice${selectedPredictionRange}`];
            const surprise = item[`surprise${selectedPredictionRange}`];

            return (
              <tr key={index} className="border-t">
                <td className="py-2">{item.date}</td>
                <td className="py-2">{item.pastPrice} PLN</td>
                <td className="py-2">{prediction} PLN</td>
                <td className="py-2">
                  {real !== null ? `${real} PLN` : <span className="text-gray-400">-</span>}
                </td>
                <td className="py-2">
                  {surprise !== null ? (
                    <span className={parseFloat(surprise) < 0 ? "text-red-500" : "text-green-600"}>
                      {parseFloat(surprise) > 0 ? "+" : ""}
                      {surprise}%
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}