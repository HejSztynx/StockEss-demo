"use client"

import AuthGuard from "@/components/Auth/AuthGuard";
import AuthModals from "@/components/Auth/AuthModals";
import NavBar from "@/components/Common/NavBar";
import AlertList from "@/components/Watchlist/AlertList";
import WatchListInfo from "@/components/Watchlist/WatchListInfo";
import { WatchlistContextProvider } from "@/context/WatchlistContext";

export default function WatchlistPage() {

  return (
    <div className="flex flex-col h-screen">
      <AuthModals/>

      <NavBar />

      <AuthGuard>

      <WatchlistContextProvider>
        <div className="flex flex-1">
          <AlertList/>
          <WatchListInfo/>
        </div>

      </WatchlistContextProvider>

      </AuthGuard>

    </div>
  );
}