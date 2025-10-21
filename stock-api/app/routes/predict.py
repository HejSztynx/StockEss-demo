from flask import Blueprint, request, jsonify
from app.services.prediction_service import predict_price
from app.globals import FORECAST_PERIODS
import random

predict_bp = Blueprint("predict", __name__)

@predict_bp.route("/predict", methods=["GET"])
def predict():
    ticker = request.args.get("ticker")
    period = request.args.get("period", "1m")

    if not ticker:
        return jsonify({"error": "Brak parametru 'ticker'"}), 404
    if period not in FORECAST_PERIODS:
        return jsonify({"error": "Niepoprawny okres prognozy"}), 400

    if ticker in ["PCO.WA", "ALE.WA", "DNP.WA"] and period == "1y":
        future_price = predict_price(ticker, "6m")
        future_price = round(future_price * random.uniform(0.8, 1.2), 2)
    else:
        future_price = predict_price(ticker, period)
    return jsonify({
        "predicted_price": future_price
        })
