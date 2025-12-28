from flask import Blueprint, jsonify, request
import json
import urllib.request

news_bp = Blueprint("news", __name__)
API_KEY = "271c9d4da3e7ea9af7cbc63361d09e32"

@news_bp.route("/news", methods=["GET"])
def get_news():
    companyName = request.args.get("company")
    encoded_company = urllib.parse.quote(companyName)
    url = f"https://gnews.io/api/v4/search?q={encoded_company}&lang=en&apikey={API_KEY}"

    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode("utf-8"))
        articles = data["articles"]

    print(articles)
    return jsonify(articles)