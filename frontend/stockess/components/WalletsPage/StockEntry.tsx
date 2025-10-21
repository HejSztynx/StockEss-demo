import React from "react";
import { Button } from "@/components/ui/button";

interface StockPosition {
  id: number
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

interface Props {
  position: StockPosition;
  currentPrice?: number;
  onSell?: (position: StockPosition) => void;
  onEdit?: (position: StockPosition) => void;
}

export const StockEntry: React.FC<Props> = ({ position, currentPrice, onSell, onEdit }) => {
  const buyValue = position.price * position.quantity + position.commission;
  const currentValue = (position.is_open
    ? (currentPrice || 0) * position.quantity
    : (position.sell_price || 0) * position.quantity);
  const profit = currentValue - buyValue;

  const gridClass = position.is_open
    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4";

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className={`${gridClass} gap-4 text-center`}>
        <div>
          <p className="text-xs text-gray-500">Position name</p>
          <p className="font-semibold">{position.companyName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Average purchase price</p>
          <p className="font-semibold">{position.price.toFixed(2)} PLN</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Number of shares</p>
          <p className="font-semibold">{position.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Commission</p>
          <p className="font-semibold">{position.commission.toFixed(2)} PLN</p>
        </div>

        {position.is_open && (
          <div>
            <div className="flex flex-col items-center gap-2 mt-1">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(position)}>
                Edit
              </Button>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500">Purchase date</p>
          <p className="font-semibold">{position.date}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Value</p>
          <p className="font-semibold">{buyValue.toFixed(2)} PLN</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Profit</p>
          <p className={`font-semibold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {profit.toFixed(2)} PLN
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Sale date</p>
          <p className="font-semibold">{position.sell_date || "-"}</p>
        </div>

        {position.is_open && (
          <div>
            <div className="flex flex-col items-center gap-2 mt-1">
              <Button variant="default" size="sm" onClick={() => onSell?.(position)}>
                Sell
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

