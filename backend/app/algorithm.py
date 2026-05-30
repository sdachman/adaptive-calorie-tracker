
def calculate_starting_calories(weight_lbs, height_inches,age,sex,activity_level, weight_loss_pace):
    """
    calculate an initial calorie target using the Mifflin-St Jeor equation.
    This is just our starting estimate -- the algorithm will adjust over time
    """
    #convert to metric (the formula requires it)
    weight_kg = weight_lbs * 0.453592
    height_cm = height_inches * 2.54

    #mifflin-stJeor RMR formula
    if sex == "male":
        rmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) + 5
    else:
        rmr = (10 * weight_kg) + (6.25 * height_cm) - (5 * age) - 161


    deficit_map = {
        "0.5": 250,
        "1.0": 500,
        "1.5": 750,
        "2.0": 1000
    }

    deficit = calculate_deficit(weight_loss_pace)

    #Activity multipliers
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }

    multiplier = activity_multipliers.get(activity_level, 1.2)
    tdee = rmr * multiplier
    morning_target = tdee - deficit
    return round(rmr), round(tdee), round(morning_target)

def adjust_rmr(current_rmr, start_weight, end_weight, daily_logs):
    """
    Adjusts RMR based on expected vs actual weight change over the weigh-in period.

    daily_logs: a list of dicts, one per day, each with:
        - 'calories_eaten': int
        - 'calories_burned': int  (exercise only, not baseline)

    Returns: new_rmr (int), new_tdee (int)
    """
     
    LEARNING_RATE = 0.2  # will change later. decides how much we change rmr. lower means slower
    CALS_PER_POUND = 3500
    #calculate expected weight change
    total_calorie_gap = sum(
        day["calories_eaten"] - current_rmr - day["calories_burned"] for day in daily_logs
    )
    expected_weight_change = total_calorie_gap / CALS_PER_POUND
    actual_weight_change = end_weight - start_weight
    weight_gap = expected_weight_change - actual_weight_change
    
    gap_in_calories = weight_gap * CALS_PER_POUND
    rmr_adjustment = gap_in_calories * LEARNING_RATE
    new_rmr = current_rmr + rmr_adjustment
    return round(new_rmr)

def calculate_activity_multiplier(activity_level):
        activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
        multiplier = activity_multipliers.get(activity_level, 1.2)
        return multiplier


def calculate_daily_target(current_rmr, activity_level, deficit):
    multiplier = calculate_activity_multiplier(activity_level)
    tdee = current_rmr * multiplier
    daily_target = tdee - deficit
    return round(daily_target)


def calculate_deficit(weight_loss_pace):
    deficit_map = {
        "0.5": 250,
        "1.0": 500,
        "1.5": 750,
        "2.0": 1000
    }
    return deficit_map.get(weight_loss_pace, 500)







