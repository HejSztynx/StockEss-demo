from flask import Blueprint, jsonify, request
from app.services.reports_service import get_reports_for_ticker

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/reports", methods=["GET"])
def get_financial_reports():
    ticker = request.args.get("ticker")

    if not ticker:
        return jsonify({"error": "Brak parametru 'ticker'"}), 404
    
    reports = get_reports_for_ticker(ticker)
    return jsonify(reports)