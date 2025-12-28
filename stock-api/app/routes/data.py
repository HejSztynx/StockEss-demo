from flask import Blueprint, jsonify, request

from app.globals import raw_data
from app.services.retrain_service import parse_date

data_bp = Blueprint("data", __name__)


@data_bp.route("/getHistoricData", methods=["GET"])
def getHistoricData():
    ticker = request.args.get("ticker")
    last_known_str = request.args.get("last_known_date")

    if not ticker or not last_known_str:
        return jsonify(
            {"error": "Brakuje parametru 'ticker' lub 'last_known_date'"}
        ), 400

    last_ohlc = raw_data[ticker][["Open", "High", "Low", "Close"]]

    try:
        last_known_date = parse_date(last_known_str).strftime("%Y-%m-%d")
    except ValueError:
        return jsonify({"error": "Niepoprawny format daty. Użyj YYYY-mm-dd"}), 400

    last_ohlc = last_ohlc[last_ohlc.index > last_known_date]

    formatted_data = [
        {
            "date": date,
            "open": float(round(row["Open"], 2)),
            "high": float(round(row["High"], 2)),
            "low": float(round(row["Low"], 2)),
            "close": float(round(row["Close"], 2)),
        }
        for date, row in last_ohlc.iterrows()
    ]

    return jsonify({"ohlc_history": formatted_data})


@data_bp.route("/getCurrentStockPrices", methods=["GET"])
def get_current_stock_prices():
    latest_close_prices = {
        ticker: raw_data[ticker]["Close"].iloc[-1].round(2)
        for ticker in raw_data.keys()
    }

    return jsonify(latest_close_prices)
