from flask import Flask
from flask_sqlalchemy import SQLAlchemy
# from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///laundry.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    # CORS(app)

    # Initialize routes directly on app
    from app.routes import init_routes
    init_routes(app)

    with app.app_context():
        db.create_all()

    return app