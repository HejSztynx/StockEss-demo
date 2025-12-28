from flask import Flask

from .models.model_loader import load_trained_models
from .services.data_service import get_data


def create_app():
    app = Flask(__name__)

    # Load models and data
    from app import globals

    globals.models = load_trained_models()
    globals.raw_data = get_data(globals.tickers)

    # Register Blueprints
    from .routes.data import data_bp
    from .routes.formation import formations_bp
    from .routes.news import news_bp
    from .routes.ping import ping_bp
    from .routes.predict import predict_bp
    from .routes.reports import reports_bp
    from .routes.tickers import tickers_bp
    from .routes.updates import updates_bp

    app.register_blueprint(tickers_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(data_bp)
    app.register_blueprint(updates_bp)
    app.register_blueprint(formations_bp)
    app.register_blueprint(ping_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(news_bp)

    return app
