from flask import Blueprint, jsonify
from app.globals import tickers

tickers_bp = Blueprint("tickers", __name__)

@tickers_bp.route("/tickers", methods=["GET"])
def get_tickers():
    return jsonify(tickers)
