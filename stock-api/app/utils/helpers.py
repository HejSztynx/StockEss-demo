import json

from flask import jsonify

from app.globals import FORECAST_PERIODS
from app.models.model_loader import load_trained_models


def get_saved_json_file(ticker):
    folder = "new_data"
    filename = f"{folder}/{ticker}_new_data.json"
    try:
        with open(filename, "r", encoding="utf-8") as f:
            return jsonify(json.load(f))
    except FileNotFoundError:
        return jsonify({"error": "Plik nie znaleziony"}), 404


from app.globals import raw_data


def get_predictions_for_date(ticker, target_date):
    df_raw = raw_data[ticker]
    df_raw_cut = df_raw.loc[:target_date]

    predictions = {}

    global models
    models = load_trained_models()

    for label, steps in FORECAST_PERIODS.items():
        try:
            predictions[f"prediction{label}"] = 0.0
            print(predictions[f"prediction{label}"])
        except Exception as e:
            predictions[f"prediction{label}"] = None

    if predictions.get("prediction1y") is None:
        shorter_preds = [
            predictions.get("prediction1m"),
            predictions.get("prediction3m"),
            predictions.get("prediction6m"),
        ]

        if shorter_preds:
            predictions["prediction1y"] = round(
                sum(shorter_preds) / len(shorter_preds), 2
            )

    return predictions


def get_data_slice(ticker, start, end):
    return raw_data[ticker][
        (raw_data[ticker].index >= start) & (raw_data[ticker].index <= end)
    ].copy()


def is_retrain_needed(ticker: str, newDate: str):
    return False
