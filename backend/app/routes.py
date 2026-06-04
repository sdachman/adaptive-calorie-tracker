from flask import Blueprint, request, jsonify
from app.algorithm import calculate_starting_calories, calculate_deficit, adjust_rmr, calculate_daily_target, calculate_activity_multiplier, get_tdee
from app.models import User, DailyLog, WeighIn
from datetime import date, datetime, timedelta
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

main = Blueprint("main", __name__)


@main.route("/api/signup", methods=["POST"])
def signup():

    
    data = request.get_json()
    weight_lbs=data["weight_lbs"]
    height_inches=data["height_inches"]
    age=data["age"]
    sex=data["sex"]
    email = data["email"]
    password = data["password"]
    activity_level=data["activity_level"]
    weight_loss_pace=data["weight_loss_pace"]

    user_data=User.query.filter_by(email=email).first()
    if (user_data is not None): return jsonify({"error": "An account with this email already exists"}), 409
    


    password_hash = generate_password_hash(password, method ='pbkdf2:sha256')



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
    new_user = User(weight = weight_lbs, height=height_inches, signup_date = date.today(), email = email, password_hash = password_hash, age = age, sex=sex,
                activity_level = activity_level, weight_loss_pace = weight_loss_pace,
                rmr = rmr, daily_target = morning_target, deficit = deficit)
    db.session.add(new_user)
    db.session.commit()
    token = create_access_token(identity=str(new_user.id))
    return jsonify({
        "user_id": new_user.id,
        "rmr": rmr,
        "tdee": tdee,
        "morning_target": morning_target,
        "token": token

    })


@main.route("/api/log-day", methods = ["POST"])
@jwt_required()
def log_day():
    data = request.get_json()
    cals_eaten = data["calories_eaten"]
    cals_burned = data["calories_burned"]
    user_id = data['user_id']
    log_date = datetime.strptime(data["log_date"], '%Y-%m-%d').date()
    current_user_id = get_jwt_identity()
    if (current_user_id != str(user_id)): return jsonify({"error": "forbidden, you don't have permission"}), 403

    if log_date > date.today():
        return jsonify({"error": "cannot log a future date"}), 400
    
    duplicateCheck=DailyLog.query.filter(DailyLog.user_id == user_id, 
                          DailyLog.date >= log_date,
                          DailyLog.date < log_date + timedelta(days=1)).first()

    if (duplicateCheck != None):
        return jsonify({"error": "must delete existing log first"}), 400
    


    log = DailyLog(calories_eaten = cals_eaten,
                   calories_burned = cals_burned,
                   date = log_date, user_id = user_id)
    db.session.add(log)
    db.session.commit()

    return jsonify({"status": "ok"})



@main.route("/api/weigh-in", methods = ["POST"])
@jwt_required()
def weigh_in():
    data = request.get_json()
    new_weight = data["new_weight"]
    user_id = data["user_id"]
    user = User.query.get(user_id)
    current_user_id = get_jwt_identity()
    if (current_user_id != str(user_id)): return jsonify({"error": "forbidden, you don't have permission"}), 403
    
    last_weigh_in = WeighIn.query.filter(WeighIn.user_id == user_id, WeighIn.recalc == True).order_by(WeighIn.date.desc()).first()

    if (last_weigh_in is None): 
        reference_date= user.signup_date.date()
        required_days = 14
    else: 
        reference_date = last_weigh_in.date.date()
        required_days = 7
    
    # if (date.today()- reference_date).days < required_days:
    #     return jsonify({"error": "not eligible yet"}), 400

    adjust = True if (date.today()- reference_date).days >= required_days else False


    Weigh_in = WeighIn(new_weight = new_weight, date = date.today(), recalc = adjust, user_id = user_id)
    db.session.add(Weigh_in)
    db.session.commit()


    if (adjust):

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
        return jsonify({"recalculated": True,"new_rmr": new_rmr, "new_daily_target": user.daily_target, "new_tdee": new_tdee})
    else:
        return jsonify({"recalculated": False})



@main.route("/api/logs/<user_id>", methods = ["GET"])
@jwt_required()
def get_logs(user_id):
    logs = DailyLog.query.filter(DailyLog.user_id == user_id).all()
    current_user_id = get_jwt_identity()
    if (current_user_id != str(user_id)): return jsonify({"error": "forbidden, you don't have permission"}), 403

    daily_logs = [
        {
            "date":log.date.strftime("%Y-%m-%d"),
            "calories_eaten": log.calories_eaten,
            "calories_burned": log.calories_burned
        }
        for log in logs
    ]

    return jsonify(daily_logs)


@main.route("/api/user/<user_id>", methods = ["GET"])
@jwt_required()
def get_user(user_id):
    data = User.query.get(user_id)
    if (data is None): return jsonify({"error": "user not found"}), 404
    current_user_id = get_jwt_identity()
    if (current_user_id != str(user_id)): return jsonify({"error": "forbidden, you don't have permission"}), 403
    tdee = get_tdee(data.rmr, data.activity_level)
    userData = {
        "weight": data.weight,
        "height": data.height,
        "age": data.age,
        "sex": data.sex,
        "signup_date": data.signup_date.strftime("%Y-%m-%d"),
        "activity_level": data.activity_level,
        "weight_loss_pace": data.weight_loss_pace,
        "deficit": data.deficit,
        "rmr": data.rmr,
        "daily_target": data.daily_target,
        "tdee": tdee
    }
    return jsonify(userData)


@main.route("/api/login", methods = ["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    user_data=User.query.filter_by(email=email).first()
    if (user_data is None): return jsonify({"error": "user not found"}), 404
    if ( not (check_password_hash(user_data.password_hash, password))): return jsonify({"error": "incorrect password" }), 401
    token = create_access_token(identity=str(user_data.id))
    return jsonify({"token":token, "user_id": user_data.id})




@main.route("/api/weigh-in-log/<user_id>", methods = ["GET"])
@jwt_required()
def get_weighIn(user_id): #user_id is the <user_id>
    logs=WeighIn.query.filter(WeighIn.user_id == user_id).all()
    current_user_id = get_jwt_identity() # this token comes from the fetch call when we do authorization: bearer thing
    if (current_user_id != user_id): return jsonify({"error": "forbidden, you do not hav permission"}), 403

    weigh_in_logs = [
        {
            "date": log.date.strftime("%Y-%m-%d"),
            "weight": log.new_weight
        }
        for log in logs
    ]

    return jsonify(weigh_in_logs)



