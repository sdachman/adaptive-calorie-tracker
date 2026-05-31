from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

load_dotenv()


db = SQLAlchemy()

auth = JWTManager()

def create_app():
    app = Flask(__name__)
    CORS(app)  # lets your React frontend talk to this server

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tracker.db'
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    db.init_app(app)
    auth.init_app(app)


    from app import models
    from app.routes import main
    app.register_blueprint(main)

    with app.app_context():
        db.create_all()

    return app

