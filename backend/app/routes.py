from flask import Blueprint, request, jsonify
from app.algorithm import calculate_starting_calories, calculate_deficit

main = Blueprint("main", __name__)


@main.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()

    rmr, tdee, morning_target = calculate_starting_calories(
        weight_lbs=data["weight_lbs"],
        height_inches=data["height_inches"],
        age=data["age"],
        sex=data["sex"],
        activity_level=data["activity_level"],
        weight_loss_pace=data["weight_loss_pace"]
    )

    return jsonify({
        "rmr": rmr,
        "tdee": tdee,
        "morning_target": morning_target
    })

@main.route("/api/log-day", methods = ["POST"])
def log_day():
    data = request.get_json()
    cals_eaten = data["calories_eaten"]
    cals_burned = data["calories_burned"]

    return jsonify({"status": "ok"})

@main.route("/api/weigh-in", methods = ["POST"])
def weigh_in():
    data = request.get_json()
            