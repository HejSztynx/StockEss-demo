import { request } from "@/utils/api";
import { ParamValue } from "next/dist/server/request/params";

export interface Wallet {
  id: number;
  name: string;
  description: string;
  totalProfit: number;
}

export interface StockPosition {
  ticker: string;
  price: number;
  quantity: number;
  commission: number;
  date: string;
  walletId: string;
}

export const fetchWallets = () => request<Wallet[]>("/wallet/all");

export const addWallet = (body: any) => request<any>("/wallet/add",
  {
    method: "PUT",
    body
  }
);

export const deleteWallet = (id: ParamValue) => request<any>(`/wallet/delete?wallet_id=${id}`,
  {
    method: "DELETE"
  }
);

export const fetchCurrentPrices = () => request<any>('/stock-prices/current');

export const fetchPortfolioDetails = (id: ParamValue) => request<any>(`/wallet/entry/all?wallet_id=${id}`);

export const addStock = (body: any) => request<any>("/wallet/entry/add",
  {
    method: "PUT",
    body
  }
);

export const updateStock = (body: any) => request<any>("/wallet/entry/edit",
  {
    method: "POST",
    body
  }
);

export const sellStock = (body: any) => request<any>(`/wallet/entry/close`,
  {
    method: "POST",
    body
  }
);

export const deleteStock = (id: number) => request<any>(`/wallet/entry/delete?id=${id}`,
  {
    method: "DELETE",
  }
);