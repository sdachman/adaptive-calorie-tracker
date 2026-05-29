from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()



def create_app():
    app = Flask(__name__)
    CORS(app)  # lets your React frontend talk to this server

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tracker.db'
    db.init_app(app)

    from app import models
    from app.routes import main
    app.register_blueprint(main)

    with app.app_context():
        db.create_all()

    return app

