from flask import Blueprint, request, jsonify
from app.services.formation_service import detect_candlestick_formations

formations_bp = Blueprint("formations", __name__)

@formations_bp.route("/getFormations", methods=["GET"])
def get_formations():
    ticker = request.args.get("ticker")

    if not ticker:
        return jsonify({"error": "Missing 'ticker' parameter"}), 400

    try:
        result = detect_candlestick_formations(ticker)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
