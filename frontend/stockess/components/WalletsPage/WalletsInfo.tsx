"use client"

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddWalletModal } from "@/components/WalletsPage/AddWalletModal";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { addWallet, fetchWallets, Wallet } from "./WalletService";

export default function WalletsInfo() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter(); 

  const refreshWallets = async () => {
    const data = await fetchWallets();
    setWallets(data);
  }

  useEffect(() => {
    refreshWallets();
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  const handleNavigate = (id: string) => {
    router.push(`/wallets/${id}`);
  };

  const handleAddWallet = async (wallet: { name: string; description: string }) => {
    try {
      await addWallet(wallet);
      refreshWallets();
      setIsModalOpen(false)

    } catch (error) {
      console.error("Error adding wallet:", error);
    }
  };


  return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4 text-center">Wallets</h1>

        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="mb-4">
          Add Wallet
        </Button>

        <AddWalletModal
          open={isModalOpen}
          onOpenChange={handleOpenChange}
          onAddWallet={handleAddWallet}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <Card
              key={wallet.id}
              className="cursor-pointer hover:shadow-lg"
              onClick={() => handleNavigate(wallet.id.toString())}
            >
              <CardContent className="p-4 h-48 flex flex-col justify-between">
                <h2 className="text-lg font-semibold">{wallet.name}</h2>
                <h2
                className={`text-lg font-semibold ${
                  wallet.totalProfit > 0
                    ? "text-green-600"
                    : wallet.totalProfit < 0
                    ? "text-red-600"
                    : "text-gray-700"
                }`}
              >
                Profit/Loss: {wallet.totalProfit.toFixed(2)} PLN
              </h2>
                <p className="text-sm text-gray-500 line-clamp-3">{wallet.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}