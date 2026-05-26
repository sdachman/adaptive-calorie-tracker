from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    CORS(app)  # lets your React frontend talk to this server

    db.init_app(app)

    from app.routes import main
    app.register_blueprint(main)

    return app

db = SQLAlchemy()
