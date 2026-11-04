from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Configure CORS to accept requests from any origin (including Vercel, GitHub Pages, and localhost)
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        methods=["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
    )

    # Register blueprints
    from .routes.factcheck_routes import bp as factcheck_bp
    from .routes.health_routes import health_bp

    app.register_blueprint(factcheck_bp)
    app.register_blueprint(health_bp, url_prefix='/api')

    return app

