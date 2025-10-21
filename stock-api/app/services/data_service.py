from datetime import datetime
import yfinance as yf


START_DATE = "2010-01-01"
END_DATE = datetime.today().strftime("%Y-%m-%d")

def get_data(tickers, start_date=START_DATE, end_date=END_DATE):
    stock_data = {}
    for ticker in tickers:
        data = yf.Ticker(ticker).history(start=start_date, end=end_date)
        data = data[data['Volume'] != 0]
        data.index = data.index.strftime("%Y-%m-%d")
        stock_data[ticker] = data
    return stock_data