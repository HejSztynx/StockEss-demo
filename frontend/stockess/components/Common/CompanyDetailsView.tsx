import InsightsTab from "../StockInsights/InsightsTab";
import PredictionsTab from "../PredictionHistory/PredictionsTab";
import EarningsTab from "@/components/EarningsAndReports/EarningsTab";
import NewsTab from "@/components/StockNews/NewsTab";
import LoginScreen from "@/components/Auth/LoginScreen";
import TabsBar from "@/components/Common/TabsBar"

import { useCompanyContext } from "@/context/CompanyContext";

interface CompanyDetailsViewProps {
  activeTab: "insights" | "predictions" | "earnings" | "news";
  setActiveTab: (tab: "insights" | "predictions" | "earnings" | "news") => void;
  isLoggedIn: boolean;
}

export default function CompanyDetailsView({
  activeTab,
  setActiveTab,
  isLoggedIn
}: CompanyDetailsViewProps) {

  const {
    selectedCompany,
    currentPrice,
    oldestPrice
  } = useCompanyContext();

  const renderTabContent = () => {
    switch (activeTab) {
      case "insights":
        return (
          <InsightsTab/>
        );
      case "predictions":
        return (
          <PredictionsTab/>
        );
      case "earnings":
        return <EarningsTab />;
      case "news":
        return <NewsTab />;
      default:
        return null;
    }
  };

  const change = (currentPrice && oldestPrice ? ((currentPrice - oldestPrice) * 100 / oldestPrice).toFixed(2) : null);

  return (
    <>
      {isLoggedIn ? (
        <>
          <TabsBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
              
          <h2 className="text-xl font-bold mb-4 text-center">{selectedCompany}</h2>
          <div className="text-center mb-6">
            {change && currentPrice ? (
              <div className={`flex flex-col items-center ${parseFloat(change) >= 0 ? "text-green-600" : "text-red-600"}`}>
                <span className="text-2xl font-semibold">
                  {currentPrice.toFixed(2)} PLN
                </span>
                <span
                  className="text-sm font-medium"
                >
                  {parseFloat(change) >= 0 ? "+" : ""}
                  {change}%
                </span>
              </div>
            ) : (
              <p className="text-2xl text-gray-400 font-semibold">Loading...</p>
            )}
            <p className="text-sm text-gray-500">Current price</p>
          </div>
              
          <div className="flex items-center justify-center">
            <div className="w-[85%]">{renderTabContent()}</div>
          </div>
        </>
          ) : (
            <LoginScreen/>
          )}
    </>
  );
}