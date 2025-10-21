from flask import Blueprint, request, jsonify
from app.globals import raw_data

data_bp = Blueprint("data", __name__)

@data_bp.route("/getData", methods=["GET"])
def getData():
    ticker = request.args.get("ticker")

    if not ticker:
        return jsonify({"error": "Brak parametru 'ticker'"}), 404

    last_260_ohlc = raw_data[ticker][["Open", "High", "Low", "Close"]].tail(260)

    formatted_data = [
        {
            "date": date,
            "open": float(round(row["Open"], 2)),
            "high": float(round(row["High"], 2)),
            "low": float(round(row["Low"], 2)),
            "close": float(round(row["Close"], 2))
        }
        for date, row in last_260_ohlc.iterrows()
    ]

    return jsonify({
        "ohlc_history": formatted_data
    })


@data_bp.route("/getCurrentStockPrices", methods=["GET"])
def get_current_stock_prices():
    latest_close_prices = { 
        ticker: raw_data[ticker]["Close"].iloc[-1].round(2) 
        for ticker in raw_data.keys() 
    }

    return jsonify(latest_close_prices)


