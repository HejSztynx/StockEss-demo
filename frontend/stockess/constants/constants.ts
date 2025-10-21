export const address = "http://localhost:8080";

export const tabs = [
    {
      key: "insights",
      label: "Stock Insights"
    },
    {
      key: "predictions",
      label: "Prediction History"
    },
    {
      key: "earnings",
      label: "Earnings & Reports"
    },
    {
      key: "news",
      label: "Stock News"
    }
  ] as const;

export const companyToTickerMap: { [key: string]: string } = {
    "CD Projekt": "CDR.WA",
    "PGE": "PGE.WA",
    "PKN Orlen": "PKN.WA",
    "Kruk": "KRU.WA",
    "KGHM": "KGH.WA",
    "PZU": "PZU.WA",
    "PKO BP": "PKO.WA",
    "Pekao": "PEO.WA",
    "mBank": "MBK.WA",
    "Santander": "SPL.WA",
    "Alior Bank": "ALR.WA",
    "Orange": "OPL.WA",
    "Allegro": "ALE.WA",
    "Dino": "DNP.WA",
    "JSW": "JSW.WA",
    "Kety": "KTY.WA",
    "Budimex": "BDX.WA",
    "CCC": "CCC.WA",
    "LPP": "LPP.WA",
    "Pepco": "PCO.WA",
  };

export const wig20Companies = [
  "CD Projekt", "PGE", "PKN Orlen", "Kruk", "KGHM", "PZU", "PKO BP", "Pekao", "mBank", "Santander",
  "Alior Bank", "Orange", "Allegro", "Dino", "JSW", "Kety", "Budimex", "CCC", "LPP", "Pepco"
];

export const conditionTypeDescriptions: Record<string, string> = {
  RISE: "Trigger when the price rises by a given % or value within a specified period.",
  FALL: "Trigger when the price falls by a given % or value within a specified period.",
  MORE: "Trigger when the price is higher than the specified threshold.",
  LESS: "Trigger when the price is lower than the specified threshold.",
  THRESHOLD: "Trigger when the price crosses a specific threshold (up or down)."
};

export const COLOR_PALETTE = [
  "#EF4444",
  "#22C55E",
  "#3B82F6",
  "#f3a319ff",
  "#8B5CF6",
  "#634020ff",
  "#a7a192ff",
  "#d35192ff"
];