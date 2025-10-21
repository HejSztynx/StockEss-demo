import { tabs } from "@/constants/constants"

import { cn } from "@/lib/utils";

interface TabsBarProps {
  activeTab: "insights" | "predictions" | "earnings" | "news";
  setActiveTab: (tab: "insights" | "predictions" | "earnings" | "news") => void;
}

export default function TabsBar({ activeTab, setActiveTab }: TabsBarProps) {
    return (
        <div className="mb-4 border-b border-gray-200">
            <div className="flex">
                {tabs.map(({ key, label }) => (
                <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                    "flex-1 px-4 py-2 text-sm font-medium transition-colors text-center",
                    activeTab === key
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-blue-500"
                )}
                >
                    {label}
                    </button>
                ))}
            </div>
        </div>
    )
}