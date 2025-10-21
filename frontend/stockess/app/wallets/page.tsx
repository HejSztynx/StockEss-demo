"use client"

import NavBar from "@/components/Common/NavBar";
import AuthGuard from "@/components/Auth/AuthGuard";
import AuthModals from "@/components/Auth/AuthModals";
import WalletsInfo from "@/components/WalletsPage/WalletsInfo";

export default function WalletsPage() {

  return (
    <div className="flex flex-col h-screen">
      <AuthModals/>

      <NavBar />

      <AuthGuard>
        <WalletsInfo/>
      </AuthGuard>

    </div>
  );
}