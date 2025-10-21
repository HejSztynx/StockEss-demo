from app.utils.helpers import get_data_slice, is_retrain_needed, get_predictions_for_date
from app.globals import processed_data, SEQUENCE_LENGTHS_FOR_PERIODS, FORECAST_PERIODS, RETRAINING_RATE, PERIODS
from datetime import datetime, timedelta
import os
import json
import pandas as pd

def parse_date(date_str):
    return datetime.strptime(date_str, "%Y-%m-%d").date()

def load_saved_updates(ticker):
    file_path = f"models/new_data/{ticker}_new_data.json"
    if not os.path.exists(file_path):
        return None, file_path

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data, file_path

def filter_saved_updates(saved_data, start_str):
    new_updates = [entry for entry in saved_data["newUpdates"] if entry["date"] >= start_str]

    if (len(new_updates) == 0):
        old_updates = []
    else:
        old_updates = saved_data.get("oldUpdates", [])[-len(new_updates):]

    return new_updates, old_updates

def generate_updates(ticker, start_date, today, saved_data):
    dynamic_start_date = start_date.strftime("%Y-%m-%d")
    if saved_data and saved_data["newUpdates"]:
        last_json_date = saved_data["newUpdates"][-1]["date"]
        if last_json_date >= today.strftime("%Y-%m-%d"):
            return []  # No need to generate new data
        dynamic_start_date = (datetime.strptime(last_json_date, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")

    df_new = get_data_slice(ticker, dynamic_start_date, today.strftime("%Y-%m-%d"))
    df_hist = get_data_slice(ticker, "2010-01-01", today.strftime("%Y-%m-%d"))

    print(df_new)
    print(df_hist)

    if df_new.empty:
        return []

    df_new.reset_index(inplace=True)
    df_hist.reset_index(inplace=True)

    hist_dates = df_hist["Date"].tolist()

    new_entries = []
    old_entries = []

    for _, row in df_new.iterrows():
        date_str = row["Date"]
        price = round(row["Close"], 2)
        print("new ", date_str)

        if is_retrain_needed(ticker, date_str):
            for period in PERIODS:
                idx = hist_dates.index(date_str)
                selected_data = processed_data[ticker][period][idx - SEQUENCE_LENGTHS_FOR_PERIODS[period] - FORECAST_PERIODS[period] - RETRAINING_RATE - 1:idx]

        preds = get_predictions_for_date(ticker, date_str)
        new_entries.append({"date": date_str, "price": price, **preds})

        idx = hist_dates.index(date_str)
        print("old ", date_str)
        old_entries.append({
            "oldDate1m": hist_dates[idx - 22],
            "oldDate3m": hist_dates[idx - 66],
            "oldDate6m": hist_dates[idx - 132],
            "oldDate1y": hist_dates[idx - 260],
            "realPrice": price
        })

    return new_entries, old_entries

def update_and_save_data(file_path, saved_data, new_entries, old_entries):
    if saved_data is None:
        saved_data = {}
    if new_entries is None:
        new_entries = []
    if old_entries is None:
        old_entries = []
    if "newUpdates" not in saved_data:
        saved_data["newUpdates"] = []
    if "oldUpdates" not in saved_data:
        saved_data["oldUpdates"] = []

    saved_data["newUpdates"].extend(new_entries)
    saved_data["oldUpdates"].extend(old_entries)
    
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(saved_data, f, ensure_ascii=False, indent=4)
