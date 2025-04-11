from flask import Flask
from .extensions import db
from .routes import register_routes
import os

def create_app():
    app = Flask(__name__)

    # Load config
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', 'False') == 'True'

    # Initialize extensions
    db.init_app(app)

    # Register Blueprints / Routes
    register_routes(app)

    return app
