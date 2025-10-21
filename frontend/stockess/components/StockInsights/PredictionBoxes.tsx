export default function PredictionBoxes({
  predictionPrices,
}: {
  predictionPrices: { m1: number | null; m3: number | null; m6: number | null; y1: number | null };
}) {
  const predictions = [
    { label: "Price expected for 1 month", price: predictionPrices.m1 },
    { label: "Price expected for 3 months", price: predictionPrices.m3 },
    { label: "Price expected for 6 months", price: predictionPrices.m6 },
    { label: "Price expected for 1 year", price: predictionPrices.y1 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {predictions.map(({ label, price }, idx) => (
        <div key={idx} className="rounded-2xl border shadow-sm p-4 bg-white">
          <h3 className="text-sm text-gray-500">{label}</h3>
          <p className="text-xl font-bold text-blue-600 mt-2">
            {price !== null ? `${price} PLN` : "Loading..."}
          </p>
        </div>
      ))}
    </div>
  );
}
