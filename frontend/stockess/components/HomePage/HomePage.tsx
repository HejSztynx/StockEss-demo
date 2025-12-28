"use client";

import NavBar from "@/components/Common/NavBar";
import Sidebar from "@/components/Common/Sidebar";
import WelcomeScreen from "@/components/Common/WelcomeScreen";
import CompanyDetailsView from "@/components/Common/CompanyDetailsView";
import { CompanyContext } from "@/context/CompanyContext";
import { useHomePageService } from "./HomePageService";
import AuthModals from "../Auth/AuthModals";
import AuthGuard from "../Auth/AuthGuard";

const HomePage = () => {
  /* -------------------------------------------------- */
  /* ▸ 1. PAGE LOGIC (custom hook)                      */
  /* -------------------------------------------------- */
  const {
    /* data */
    selectedCompany,
    activeTab,
    ohlcHistory,
    predictionData,
    predictionPrices,
    currentPrice,
    minPrice,
    selectedPredictionRange,
    selectedMonth,
    selectedYear,
    /* handlers */
    setSelectedCompany,
    setActiveTab,
    setSelectedPredictionRange,
    setSelectedMonth,
    setSelectedYear,
    handleSelectCompany,
    setMinPrice,
  } = useHomePageService();

  /* -------------------------------------------------- */
  /* ▸ 2. RENDER                                        */
  /* -------------------------------------------------- */
  return (
    <>
      <AuthModals />

      <div className="flex flex-col h-screen">
        <NavBar />

        <div className="flex flex-1">
          <Sidebar
            selectedCompany={selectedCompany}
            setSelectedCompany={setSelectedCompany}
            onSelectCompany={handleSelectCompany}
          />

          <div className="flex-1 p-2 overflow-y-auto">
            {selectedCompany ? (
              <AuthGuard>
                <CompanyContext.Provider
                  value={{
                    selectedCompany,
                    currentPrice,
                    minPrice,
                    predictionPrices,
                    predictionData,
                    OHLCHistory: ohlcHistory,
                    selectedPredictionRange,
                    setSelectedPredictionRange,
                    selectedMonth,
                    setSelectedMonth,
                    selectedYear,
                    setSelectedYear,
                    setMinPrice,
                  }}
                >
                  <CompanyDetailsView
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                </CompanyContext.Provider>
              </AuthGuard>
            ) : (
              <WelcomeScreen />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
