from . import db
from datetime import date


class User(db.Model):
    # inherting db.Model
    __tablename__ = 'users'
    id = db.Column(db.Integer,primary_key=True)
    # db.Integerr means that the value in this column is an int and primary_key=true
    # means this column i shte unique identifier for each row and python will automatically increment for me
    weight = db.Column(db.Float)
    height = db.Column(db.Float)
    email = db.Column(db.String, nullable = False, unique = True)
    password_hash = db.Column(db.String,nullable = False)
    age = db.Column(db.Integer)
    sex = db.Column(db.String)
    activity_level = db.Column(db.String)
    weight_loss_pace = db.Column(db.String)
    deficit = db.Column(db.Float)
    rmr = db.Column(db.Float)
    daily_target = db.Column(db.Float)

class DailyLog(db.Model):
    __tablename__ = "daily_logs"
    id=db.Column(db.Integer, primary_key =True)
    calories_eaten = db.Column(db.Float)
    calories_burned = db.Column(db.Float)
    date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class WeighIn(db.Model):
    __tablename__ = "weigh_ins"
    id = db.Column(db.Integer,primary_key = True)
    new_weight = db.Column(db.Float)
    date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))





