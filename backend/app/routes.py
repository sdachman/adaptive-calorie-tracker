from flask import Blueprint, request, jsonify
from app.algorithm import calculate_starting_calories, calculate_deficit, adjust_rmr, calculate_daily_target, calculate_activity_multiplier
from app.models import User, DailyLog, WeighIn
from datetime import date
from . import db

main = Blueprint("main", __name__)


@main.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    weight_lbs=data["weight_lbs"]
    height_inches=data["height_inches"]
    age=data["age"]
    sex=data["sex"]
    activity_level=data["activity_level"]
    weight_loss_pace=data["weight_loss_pace"]

    rmr, tdee, morning_target = calculate_starting_calories(
        weight_lbs,
        height_inches,
        age,
        sex,
        activity_level,
        weight_loss_pace
    )

    deficit = calculate_deficit(weight_loss_pace)
    ## create a new user object to store their data
    new_user = User(weight = weight_lbs, height=height_inches, age = age, sex=sex,
                activity_level = activity_level, weight_loss_pace = weight_loss_pace,
                rmr = rmr, daily_target = morning_target, deficit = deficit)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({
        "user_id": new_user.id,
        "rmr": rmr,
        "tdee": tdee,
        "morning_target": morning_target

    })

@main.route("/api/log-day", methods = ["POST"])
def log_day():
    data = request.get_json()
    cals_eaten = data["calories_eaten"]
    cals_burned = data["calories_burned"]
    user_id = data['user_id']

    log = DailyLog(calories_eaten = cals_eaten,
                   calories_burned = cals_burned,
                   date = date.today(), user_id = user_id)
    db.session.add(log)
    db.session.commit()

    return jsonify({"status": "ok"})



@main.route("/api/weigh-in", methods = ["POST"])
def weigh_in():
    data = request.get_json()
    new_weight = data["new_weight"]
    user_id = data["user_id"]
    user = User.query.get(user_id)
    
    last_weigh_in = WeighIn.query.filter_by(user_id=user_id).order_by(WeighIn.date.desc()).first()


    Weigh_in = WeighIn(new_weight = new_weight, date = date.today(), user_id = user_id)
    db.session.add(Weigh_in)
    db.session.commit()

    if last_weigh_in is None:
        logs = DailyLog.query.filter(DailyLog.user_id == user_id).all()
    else:
        logs = DailyLog.query.filter(
            DailyLog.user_id == user_id,
            DailyLog.date >= last_weigh_in.date
        ).all()


    daily_logs = [
        {
            "calories_eaten": log.calories_eaten,
            "calories_burned": log.calories_burned
        }
        for log in logs
    ]

    new_rmr = adjust_rmr(user.rmr,user.weight, new_weight, daily_logs)
    activity_multiplier = calculate_activity_multiplier(user.activity_level)
    new_tdee = round(new_rmr*activity_multiplier)
    user.weight = new_weight
    user.rmr=new_rmr
    user.daily_target = calculate_daily_target(user.rmr, user.activity_level, user.deficit)
    db.session.commit()
    return jsonify({"new_rmr": new_rmr, "new_daily_target": user.daily_target, "new_tdee": new_tdee})


@main.route("/api/logs/<user_id>", methods = ["GET"])
def get_logs(user_id):
    logs = DailyLog.query.filter(DailyLog.user_id == user_id).all()

    daily_logs = [
        {
            "date":log.date.strftime("%Y-%m-%d"),
            "calories_eaten": log.calories_eaten,
            "calories_burned": log.calories_burned
        }
        for log in logs
    ]

    return jsonify(daily_logs)


            