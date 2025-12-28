"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useWatchlistContext } from "@/context/WatchlistContext";
import { Alert, Condition, ConditionType, ConditionValueType, createAlert, OHLCType, updateAlert } from "./WatchlistService";
import { companyToTickerMap, conditionTypeDescriptions } from "@/constants/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface CreateAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAlertModal({ open, onOpenChange}: CreateAlertModalProps) {
  const currentFormattedDate = () =>  new Date().toISOString().split("T")[0];

  const [name, setName] = useState("");
  const [date, setDate] = useState<string>(currentFormattedDate());
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [active, setActive] = useState<boolean>(true);
  const [once, setOnce] = useState<boolean>(false);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {
    editedAlert,
    refreshAlerts,
    setEditedAlert,
    setSelectedAlert,
  } = useWatchlistContext();

  const fillAlertFieldsWithData = (alert: Alert | null) => {
    if (alert == null) return;

    setName(alert.name);
    setDate(alert.startDate);
    setSelectedCompanies(alert.companies);
    setConditions(alert.conditions);
    setActive(alert.active);
    setOnce(alert.once);
  };

  useEffect(() => {
    setMessage(null);
    resetFields();
    setIsEdit(editedAlert != null);
    fillAlertFieldsWithData(editedAlert);
  }, [open]);

  const [tempConditionType, setTempConditionType] = useState<ConditionType | null>(null);
  const [tempValue, setTempValue] = useState<number>(0);
  const [tempPeriod, setTempPeriod] = useState<number>(1);
  const [tempValueType, setTempValueType] = useState<ConditionValueType>("PERCENTAGE");
  const [tempOHLC, setTempOHLC] = useState<OHLCType | null>(null);

  const validate = (validations: any) => {
    for (let { valid, message } of validations) {
      if (!valid) {
        setIsSuccess(false);
        setMessage(message);
        return false;
      }
    }
    return true;
  };

  const validateFields = () => {
    const validations = [
      { valid: !!name.trim(), message: "Name cannot be empty" },
      { valid: selectedCompanies.length > 0, message: "You must select at least one company" },
      { valid: conditions.length > 0, message: "You must add at least one condition" },
    ];

    return validate(validations);
  };

  const validateConditionFields = () => {
    const validations = [
      { valid: tempConditionType != null, message: "You must define condition type" },
      { valid: tempValue > 0, message: "Value must be higher than 0" },
      { valid: tempOHLC != null, message: "You must define OHLC type" },
    ];

    return validate(validations);
  };

  const resetTempConditionFields = () => {
    setTempConditionType(null);
    setTempPeriod(1);
    setTempValue(0);
    setTempValueType("PERCENTAGE");
    setTempOHLC(null);
  };

  const resetFields = () => {
    setName("");
    setDate(currentFormattedDate());
    setSelectedCompanies([]);
    setConditions([]);
    resetTempConditionFields();
    setOnce(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    const alert: Alert = {
      id: null,
      name,
      createdAt: null,
      startDate: date,
      companies: selectedCompanies,
      notifications: [],
      conditions,
      active,
      once,
    };

    if (editedAlert != null) {
      alert.id = editedAlert.id;
      alert.createdAt = editedAlert.createdAt;
    }

    try {
      const res = isEdit
        ? await updateAlert(alert)
        : await createAlert(alert);

      if (isEdit) setSelectedAlert(alert);
      refreshAlerts();
      resetFields();
      setIsSuccess(true);
      setMessage(res.message);
      
      setTimeout(() => {
        setMessage(null);
        onOpenChange(false);
        setIsEdit(false);
        setEditedAlert(null);
      }, 1000);
      
    } catch (err: any) {
      console.log(err.message);
      setIsSuccess(false);
      setMessage(err.message);
    }
  };

  const handleSelectCompany = (companyName: string) => {
    const ticker = companyToTickerMap[companyName];
    if (ticker && !selectedCompanies.includes(ticker)) {
      setSelectedCompanies(prev => [...prev, ticker]);
    }
  };

  const addCondition = () => {
    if (!validateConditionFields()) return;

    setMessage(null);
    const newCondition: Condition = {
      id: null,
      conditionType: tempConditionType!,
      period: tempPeriod,
      value: tempValue,
      valueType: tempValueType,
      ohlcType: tempOHLC!
    };
    setConditions(prev => [...prev, newCondition]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Alert</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />

          <div className="flex flex-col gap-2">
            <Label htmlFor="date">Date</Label>
            <div className="flex flex-row gap-10">
              <div className="flex flex-col gap-2">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-fit"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="once"
                checked={once}
                onCheckedChange={(checked) => setOnce(!!checked)}
              />
              <Label htmlFor="once" className="cursor-pointer">
                Trigger only once
              </Label>
            </div>
            </div>
            
          </div>

          <div className="flex flex-col gap-2">
            <Label>Select Companies</Label>
            
            <div className="flex flex-row gap-10">
              <Select onValueChange={handleSelectCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a company"/>
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(companyToTickerMap).map(companyName => (
                    <SelectItem key={companyName} value={companyName}>
                      {companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allTickers = Object.values(companyToTickerMap);
                  const areAllSelected = allTickers.every(t => selectedCompanies.includes(t));

                  if (areAllSelected) {
                    setSelectedCompanies([]);
                  } else {
                    setSelectedCompanies(allTickers);
                  }
                }}
              >
                {Object.values(companyToTickerMap).every(t => selectedCompanies.includes(t))
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCompanies.map(ticker => (
                <div
                  key={ticker}
                  className="flex items-center gap-2 px-2 py-1 bg-gray-200 rounded-md text-sm"
                >
                  <span>{ticker}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 text-gray-500 hover:text-red-600"
                    onClick={() =>
                      setSelectedCompanies(prev => prev.filter(t => t !== ticker))
                    }
                    title="Remove company"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Condition</Label>
            <Select onValueChange={val => setTempConditionType(val as ConditionType)}>
              <SelectTrigger>
                <SelectValue placeholder="Condition type" />
              </SelectTrigger>
              <SelectContent>
                <TooltipProvider>
                  {["rise", "fall", "more", "less", "threshold"].map(type => {
                    const upper = type.toUpperCase();
                    return (
                      <Tooltip key={upper}>
                        <TooltipTrigger asChild className="bg-gray-50">
                          <SelectItem value={upper}>{type}</SelectItem>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs text-sm bg-gray-50 border border-gray-200 text-gray-700 rounded-lg shadow-sm p-2">
                          {conditionTypeDescriptions[upper] || "No description available"}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
            </SelectContent>

            </Select>

            {(tempConditionType === "RISE" || tempConditionType === "FALL") && (
              <div className="flex gap-2 items-center">
                <Label className="whitespace-nowrap">Value:</Label>
                <Input
                  type="number"
                  min={0}
                  value={tempValue}
                  onChange={e => setTempValue(Math.max(0, Number(e.target.value)))}
                  className="w-20"
                />
                <Label className="whitespace-nowrap">Period:</Label>
                <Input
                  type="number"
                  min={1}
                  value={tempPeriod}
                  onChange={e => setTempPeriod(Math.max(1, Number(e.target.value)))}
                  className="w-20"
                />
              </div>
            )}

            {!(tempConditionType === "RISE" || tempConditionType === "FALL") && (
              <div className="flex gap-2 items-center">
                <Label className="whitespace-nowrap">Value:</Label>
                <Input
                  type="number"
                  min={0}
                  value={tempValue}
                  onChange={e => setTempValue(Math.max(0, Number(e.target.value)))}
                  className="w-20"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Label>Value Type</Label>
              <RadioGroup value={tempValueType} onValueChange={val => setTempValueType(val.toUpperCase() as ConditionValueType)} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PERCENTAGE" id="percentage" />
                  <Label htmlFor="percentage">Percentage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ABSOLUTE" id="absolute" />
                  <Label htmlFor="absolute">PLN</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex gap-2">
              <Label>OHLC Type</Label>
              <Select onValueChange={val => setTempOHLC(val as OHLCType)}>
                <SelectTrigger>
                  <SelectValue placeholder="OHLC Type" />
                </SelectTrigger>
                <SelectContent>
                  {["open","high","low","close"].map(type => (
                    <SelectItem key={type} value={type.toUpperCase()}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addCondition} variant="outline">Add Condition</Button>
          </div>

          <div>
            <Label>Added Conditions</Label>
            <div className="flex flex-col gap-1 mt-2 max-h-48 overflow-y-auto border border-gray-200 p-2 rounded-md">
              {conditions.map((cond, idx) => (
                <div key={idx} className="flex gap-2 justify-between items-center bg-gray-100 px-2 py-1 rounded-md text-sm">
                  <span>
                    {cond.conditionType} {cond.period ? `(${cond.period})` : ""} {cond.value} {cond.valueType} [{cond.ohlcType}]
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => setConditions(prev => prev.filter((_, i) => i !== idx))}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>


          <p className={`${isSuccess ? "text-green-600" : "text-red-500"} text-center self-center`}>
            {message || "\u00A0"}
          </p>
          <Button onClick={handleSubmit}>{isEdit ? "Save Changes" : "Save Alert"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
