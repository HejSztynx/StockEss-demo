from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from app.services.retrain_service import (
    parse_date, load_saved_updates, filter_saved_updates,
    generate_updates, update_and_save_data
)

updates_bp = Blueprint("updates", __name__)

@updates_bp.route("/newData", methods=["GET"])
def new_data():
    ticker = request.args.get("ticker")
    last_known_str = request.args.get("last_known_date")

    if not ticker or not last_known_str:
        return jsonify({"error": "Brakuje parametru 'ticker' lub 'last_known_date'"}), 400

    try:
        last_known_date = parse_date(last_known_str)
    except ValueError:
        return jsonify({"error": "Niepoprawny format daty. Użyj YYYY-mm-dd"}), 400

    today = datetime.today().date()
    start_date = last_known_date + timedelta(days=1)
    start_str = start_date.strftime("%Y-%m-%d")

    saved_data, file_path = load_saved_updates(ticker)
    filtered_new, filtered_old = [], []

    if saved_data:
        filtered_new, filtered_old = filter_saved_updates(saved_data, start_str)
        last_json_date = saved_data["newUpdates"][-1]["date"]
        if last_json_date >= (today - timedelta(days=1)).strftime("%Y-%m-%d"):
            return jsonify({"newUpdates": filtered_new, "oldUpdates": filtered_old})

    result = generate_updates(ticker, start_date, today, saved_data)
    if result == []:
        return jsonify({"newUpdates": filtered_new, "oldUpdates": filtered_old})
    
    new_entries, old_entries = result

    if new_entries:
        update_and_save_data(file_path, saved_data, new_entries, old_entries)

    combined_new = filtered_new + new_entries
    combined_old = filtered_old + old_entries

    return jsonify({"newUpdates": combined_new, "oldUpdates": combined_old})
