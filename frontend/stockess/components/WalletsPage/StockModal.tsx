"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { companyToTickerMap } from "@/constants/constants";

export interface StockFormValues {
  id?: number;            // ↳ przy edycji możemy przekazać id,
  ticker: string;         //    ale przy dodawaniu nie jest wymagane
  quantity: number;
  price: number;
  commission: number;
  date: string;
  is_open: boolean;       // zawsze true przy dodawaniu
}

interface StockModalProps {
  /** true = okno widoczne */
  open: boolean;
  /** zamknij modal (true → false) */
  onOpenChange: (open: boolean) => void;
  /** dane początkowe; brak = tryb 'Add' */
  initialValues?: StockFormValues;
  /** wywoływane po naciśnięciu “Save” */
  onSubmit: (values: StockFormValues) => void;
  onDelete?: (id: number) => void;
}

export const StockModal = ({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  onDelete,
}: StockModalProps) => {
  /* --------- 1. stan formularza ---------- */
  const [form, setForm] = useState<StockFormValues>({
    ticker: "",
    quantity: 0,
    price: 0,
    commission: 0,
    date: "",
    is_open: true,
  });

  /* --------- 2. wypełnianie przy edycji ---------- */
  useEffect(() => {
    if (open && initialValues) {
      setForm(initialValues);              // tryb “Edycja”
    } else if (open) {
      setForm({
        ticker: "",
        quantity: 0,
        price: 0,
        commission: 0,
        date: "",
        is_open: true,
      });                                   // tryb “Add”
    }
  }, [open, initialValues]);

  /* --------- 3. obsługa zmian pól ---------- */
  const handleChange = (key: keyof StockFormValues, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* --------- 4. zapis ---------- */
  const handleSave = () => {
    onSubmit(form);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (form.id != null && onDelete) {
      onDelete(form.id);
      onOpenChange(false);
    }
  };

  const isEdit = Boolean(initialValues);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Stock" : "Add New Stock"}</DialogTitle>
        </DialogHeader>

        {/* ------- formularz ------- */}
        <div className="flex flex-col gap-4">
          <Label htmlFor="ticker">Company</Label>
          <select
            id="ticker"
            value={form.ticker}
            onChange={(e) => handleChange("ticker", e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">Select a company</option>
            {Object.entries(companyToTickerMap).map(([companyName, ticker]) => (
              <option key={ticker} value={ticker}>
                {companyName}
              </option>
            ))}
          </select>

          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={form.quantity}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
          />

          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
          />

          <Label htmlFor="commission">Commission</Label>
          <Input
            id="commission"
            type="number"
            value={form.commission}
            onChange={(e) => handleChange("commission", Number(e.target.value))}
          />

          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />

          <Button onClick={handleSave}>Save</Button>

          {isEdit && form.id != null && onDelete && (
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
