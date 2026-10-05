from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app)

    # Register blueprints
    from .routes.factcheck_routes import factcheck_bp
    from .routes.health_routes import health_bp

    app.register_blueprint(factcheck_bp, url_prefix='/api/fact-check')
    app.register_blueprint(health_bp, url_prefix='/api')

    return app
