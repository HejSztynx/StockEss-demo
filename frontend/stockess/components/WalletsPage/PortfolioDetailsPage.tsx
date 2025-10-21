'use client';

import { useState, useEffect } from 'react';
import { useParams } from "next/navigation";
import NavBar from '../Common/NavBar';
import { StockModal } from './StockModal';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { StockEntry } from './StockEntry';
import { DeleteWalletModal } from './DeleteWalletModal';
import AuthGuard from '../Auth/AuthGuard';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { addStock, deleteStock, deleteWallet, fetchCurrentPrices, fetchPortfolioDetails, fetchWallets, sellStock, updateStock, Wallet } from './WalletService';

interface StockPosition {
  id: number;
  ticker: string;
  companyName: string;
  price: number;
  quantity: number;
  commission: number;
  date: string;
  is_open: boolean;
  sell_price?: number | null;
  sell_date?: string | null;
}

type StockFormValues = {
  id?: number;      // przy dodawaniu brak
  ticker: string;
  quantity: number;
  price: number;
  commission: number;
  date: string;     // yyyy-MM-dd (z <input type="date" />)
  is_open: boolean; // modal zawsze zwraca true
};


export default function PortfolioDetailsPage() {
  const { id } = useParams();
  const [positions, setPositions] = useState<StockPosition[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedStock, setEditedStock] = useState<StockPosition | undefined>();
  const [description, setDescription] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const refreshWallet = async () => {
      try {
        const data = await fetchWallets();
        const current = data.find(w => w.id === Number(id));

        if (current) {
          setWallet(current);
          setDescription(current.description);
        }
      } catch (error) {
        console.log('Error fetching wallet:', error);
      }
    };

    refreshPortfolioDetails();
    refreshWallet();
    refreshCurrentPrices();
  }, [id]);

  const refreshCurrentPrices = async () => {
    try {
      const data = await fetchCurrentPrices();
      setCurrentPrices(data.current_prices);
    } catch (error) {
      console.log("Error fetching current prices:", error);
    }
  };

  const refreshPortfolioDetails = async () => {
    try {
      const data = await fetchPortfolioDetails(id);
      const mappedPositions: StockPosition[] = data.map((entry: any) => ({
        id: entry.id,
        ticker: entry.company.id,
        companyName: entry.company.fullName,
        price: entry.buyPrice,
        quantity: entry.quantity,
        commission: entry.commission,
        date: entry.buyDate,
        is_open: entry.open,
        sell_price: entry.sellPrice,
        sell_date: entry.sellDate,
      }));

      setPositions(mappedPositions);
    } catch (error) {
      console.log('Error fetching wallet entries:', error);
      router.push("/wallets");
    }
  };

  const handleAddStock = async (stock: StockFormValues) => {
    try {
      await addStock(
        {
          walletId: id,
          data: {
            company: stock.ticker,                  // ← API przyjmuje ID spółki
            quantity: stock.quantity,
            buyPrice: stock.price,
            commission: stock.commission,
            buyDate: stock.date,                    // yyyy-MM-dd wystarczy
          },
        }
      );

      await refreshPortfolioDetails();
    } catch (err) {
      console.log(err);
      alert("Failed to add stock. Please try again later.");
    }
  };

  const handleUpdateStock = async (stock: StockFormValues) => {
    if (!stock.id) return;                         // bez id nie zaktualizujemy

    try {
      await updateStock(
        {
            id: stock.id,
            data: {
              company: stock.ticker,
              quantity: stock.quantity,
              buyPrice: stock.price,
              commission: stock.commission,
              buyDate: stock.date,
            },
          }
      );

      await refreshPortfolioDetails();
    } catch (err) {
      console.log(err);
      alert("Failed to update stock. Please try again later.");
    }
  };

  const handleDeleteWallet = async () => {
    try {
      await deleteWallet(id);
      router.push('/wallets');
    } catch (error) {
      console.log('Error deleting wallet:', error);
      alert('Failed to delete wallet. Please try again later.');
    }
  };

  const handleSellStock = async (position: StockPosition) => {
    if (!position.id) return;

    const sellPrice = currentPrices[position.ticker];
    const today = new Date().toISOString().split('T')[0];

    try {
      await sellStock(
        {
          id: position.id,
          sellPrice: sellPrice,
          sellDate: today
        }
      );

      await refreshPortfolioDetails();
    } catch (error) {
      console.log('Error closing stock position:', error);
      alert('Could not close position. Please try again later');
    }
  };

  const summary = positions.reduce(
    (acc, pos) => {
      const value = pos.price * pos.quantity;
      const totalCost = value + pos.commission;
      const currentPrice = currentPrices[pos.ticker];
      const currentValue = currentPrice * pos.quantity;
      const sellValue = (pos.sell_price || 0) * pos.quantity;

      const profit = pos.is_open
        ? currentValue - totalCost
        : sellValue - totalCost;

      acc.totalValue += totalCost;
      acc.totalCommission += pos.commission;
      acc.totalShares += pos.quantity;
      acc.totalProfit += profit;

      return acc;
    },
    {
      totalValue: 0,
      totalCommission: 0,
      totalShares: 0,
      totalProfit: 0,
    }
  );

  const taxRate = 0.19;
  const profitAfterTax =
    summary.totalProfit > 0
      ? summary.totalProfit * (1 - taxRate)
      : summary.totalProfit;


  const openPositions = positions.filter(pos => pos.is_open);
  const closedPositions = positions.filter(pos => !pos.is_open);

  const handleAddClick = () => {
    setEditedStock(undefined);           // brak initialValues ⇒ tryb „Add”
    setIsModalOpen(true);
  };

  const handleEditClick = (pos: StockPosition) => {
    setEditedStock(pos);                 // przekazujemy dane ⇒ „Edit”
    setIsModalOpen(true);
  };


  const handleSaveStock = async (values: StockFormValues) => {
    if (values.id) {
      await handleUpdateStock(values);   // tryb „Edit”
    } else {
      await handleAddStock(values);      // tryb „Add”
    }

    setIsModalOpen(false);               // zamknij modal po sukcesie
  };

  const handleDeleteStock = async (id: number) => {
    try {
      await deleteStock(id);

      await refreshPortfolioDetails();
    } catch (error) {
      console.log("Failed to delete stock:", error);
    }
  };



  return (
    <>
      <NavBar />

      <AuthGuard>
      <div className="p-4 text-center">
        <div className="relative mb-4">

          <div className="absolute left-0">
            <Button 
              onClick={() => router.push("/wallets")}
            >
              ← Go back to my wallets
            </Button>
          </div>

          <div className="absolute right-0">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Wallet
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-center">Wallet: {wallet?.name || "..."}</h1>
          {wallet?.description && <p className="mt-2 text-gray-600 text-sm">{wallet.description}</p>}

        </div>


        <Button onClick={handleAddClick} className="mb-4">
          Add stock
        </Button>

        <StockModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialValues={editedStock}
          onSubmit={handleSaveStock}
          onDelete={handleDeleteStock}
        />

        <DeleteWalletModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirm={handleDeleteWallet}
        />

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Open positions in the portfolio</h2>
          <div className="space-y-4">

            {openPositions.map((pos, index) => (
              <StockEntry key={index} position={pos} currentPrice={currentPrices[pos.ticker]} onSell={handleSellStock} onEdit={handleEditClick} />
            ))}

            <div className="border rounded-lg p-4 shadow-md bg-blue-50 text-left">
              <h3 className="text-lg font-bold mb-2">Investment Summary</h3>
              <p><strong>Total investment value (with commission):</strong> {summary.totalValue.toFixed(2)} zł</p>
              <p><strong>Total commission:</strong> {summary.totalCommission.toFixed(2)} zł</p>
              <p><strong>Total number of shares:</strong> {summary.totalShares}</p>
              <p>
                <strong>Profit:</strong>{' '}
                <span className={summary.totalProfit >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {summary.totalProfit.toFixed(2)} PLN
                </span>
              </p>
              <p>
                <strong>Profit after tax:</strong>{' '}
                <span className={profitAfterTax >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {profitAfterTax.toFixed(2)} PLN
                </span>
              </p>
            </div>

            <div className="mt-6">
              <Accordion type="single" collapsible>
                <AccordionItem value="closed-positions">
                  <AccordionTrigger className="text-left text-base font-medium bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md">
                    Closed positions in the portfolio ({closedPositions.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {closedPositions.length === 0 ? (
                        <p className="text-sm text-gray-500">There is no closed positions yet.</p>
                      ) : (
                        closedPositions.map((pos, index) => (
                          <div key={index} className="opacity-60">
                            <StockEntry key={index} position={pos} />
                          </div>
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>
        </div>
      </div>

      </AuthGuard>
    </>
  );
}
