import { useCompanyContext } from "@/context/CompanyContext";

export default function PredictionDatesFilterSelection() {
    const {
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear
    } = useCompanyContext();

    return (
        <div className="flex justify-center gap-4 text-sm">
            <select
                value={selectedMonth ?? ""}
                onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
                className="border rounded px-2 py-1"
            >
            <option value="">All months</option>
            {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                </option>
            ))}
            </select>

            <select
                value={selectedYear ?? ""}
                onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
                className="border rounded px-2 py-1"
            >
            <option value="">All years</option>
            {Array.from(
                { length: new Date().getFullYear() - 2024 + 1 },
                (_, i) => 2024 + i
            ).map((year) => (
                <option key={year} value={year}>{year}</option>
            ))}
            </select>
        </div>
    );
}