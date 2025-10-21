"use client";

import NavBar from "@/components/Common/NavBar";
import Sidebar from "@/components/Common/Sidebar";
import WelcomeScreen from "@/components/Common/WelcomeScreen";
import CompanyDetailsView from "@/components/Common/CompanyDetailsView";
import { CompanyContext } from "@/context/CompanyContext";
import { useAuth } from "@/context/AuthContext";
import { useHomePageService } from "./HomePageService";
import AuthModals from "../Auth/AuthModals";

const HomePage = () => {
  /* -------------------------------------------------- */
  /* ▸ 1. AUTH CONTEXT                                  */
  /* -------------------------------------------------- */
  const {
    isLoggedIn,
  } = useAuth();

  /* -------------------------------------------------- */
  /* ▸ 2. PAGE LOGIC (custom hook)                      */
  /* -------------------------------------------------- */
  const {
    /* data */
    selectedCompany,
    activeTab,
    ohlcHistory,
    predictionData,
    predictionPrices,
    currentPrice,
    oldestPrice,
    selectedPredictionRange,
    selectedMonth,
    selectedYear,
    /* handlers */
    setActiveTab,
    setSelectedPredictionRange,
    setSelectedMonth,
    setSelectedYear,
    handleSelectCompany,
  } = useHomePageService();

  /* -------------------------------------------------- */
  /* ▸ 3. RENDER                                        */
  /* -------------------------------------------------- */
  return (
    <>
      <AuthModals/>

      <div className="flex flex-col h-screen">
        <NavBar />

        <div className="flex flex-1">
          <Sidebar
            selectedCompany={selectedCompany}
            onSelectCompany={handleSelectCompany}
          />

          <div className="flex-1 p-2 overflow-y-auto">
            {selectedCompany ? (
              <CompanyContext.Provider
                value={{
                  selectedCompany,
                  currentPrice,
                  oldestPrice,
                  predictionPrices,
                  predictionData,
                  OHLCHistory: ohlcHistory,
                  selectedPredictionRange,
                  setSelectedPredictionRange,
                  selectedMonth,
                  setSelectedMonth,
                  selectedYear,
                  setSelectedYear,
                }}
              >
                <CompanyDetailsView
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  isLoggedIn={isLoggedIn}
                />
              </CompanyContext.Provider>
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
