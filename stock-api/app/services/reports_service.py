import yfinance as yf
import numpy as np

def get_reports_for_ticker(ticker: str) -> dict:
    spolka = yf.Ticker(ticker)

    try:
        # Pobierz dane
        raport = spolka.financials
        bilans = spolka.balance_sheet
        przeplywy = spolka.cashflow

        # Zamień kolumny na stringi (ważne do serializacji i .loc)
        if not raport.empty:
            raport.columns = raport.columns.strftime("%Y-%m-%d")
            raport = raport.replace({np.nan: None})
        if not bilans.empty:
            bilans.columns = bilans.columns.strftime("%Y-%m-%d")
            bilans = bilans.replace({np.nan: None})
        if not przeplywy.empty:
            przeplywy.columns = przeplywy.columns.strftime("%Y-%m-%d")
            przeplywy = przeplywy.replace({np.nan: None})

        return {
            "ticker": ticker,
            "financials": raport.to_dict() if not raport.empty else {},
            "balance_sheet": bilans.to_dict() if not bilans.empty else {},
            "cashflow": przeplywy.to_dict() if not przeplywy.empty else {}
        }

    except Exception as e:
        return {"error": str(e), "ticker": ticker}
