import talib
from datetime import datetime, timedelta
import pandas as pd
from app.globals import raw_data, candle_pattern_names

def detect_candlestick_formations(ticker):
    df = raw_data[ticker]
    df = df[["Open", "High", "Low", "Close"]]

    df.index = pd.to_datetime(df.index)

    one_year_ago = datetime.now() - timedelta(days=365)
    df = df[df.index > one_year_ago]

    open_ = df["Open"].values.astype(float).reshape(-1)
    high = df["High"].values.astype(float).reshape(-1)
    low = df["Low"].values.astype(float).reshape(-1)
    close = df["Close"].values.astype(float).reshape(-1)

    candle_names = talib.get_function_groups()["Pattern Recognition"]
    results = {}

    for pattern in candle_names:
        try:
            func = getattr(talib, pattern)
            pattern_result = func(open_, high, low, close)

            occurrences = []
            for i, val in enumerate(pattern_result):
                if val == 100:
                    signal = "bullish"
                elif val == -100:
                    signal = "bearish"
                else:
                    continue

                occurrences.append({
                    "date": df.index[i].strftime("%Y-%m-%d"),
                    "signal": signal
                })

            if occurrences:
                results[candle_pattern_names[pattern]] = occurrences
        except Exception as e:
            print(f"Error processing pattern {pattern}: {e}")
            continue

    return results