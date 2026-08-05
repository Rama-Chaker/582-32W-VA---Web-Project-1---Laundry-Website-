from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Create database extension instance
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    # Basic setup
    app.config['SECRET_KEY'] = 'secret-key-123'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///laundry.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extension
    db.init_app(app)

    return app