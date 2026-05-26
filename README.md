# adaptive-calorie-tracker
A calorie and weight management app that personalizes your metabolism over time


# Adaptive Calorie Tracker

A calorie and weight management app that personalizes your metabolism over time instead of relying on static formulas that don't account for individual differences.

---

## The Core Idea

Most calorie tracking apps calculate your calorie target once using a standard formula and never change it. This app treats that initial estimate as a rough guess and uses your real world weigh-in data to slowly correct it over time. The longer you use it, the more accurate it gets.

---

## How It Works

### Signup (one time)
- User inputs: weight, height, age, sex, goal weight, activity level, weight loss pace
- App calculates RMR using the Mifflin-St Jeor equation
- App calculates TDEE = RMR x activity multiplier
- App calculates daily deficit based on chosen pace
- Morning target = TDEE - deficit
- First weigh-in scheduled for day 14

### Daily (Phase 1)
- User sees their morning target when they open the app
- End of day user logs calories eaten and calories burned
- Data is stored for the weigh-in adjustment

### Day 14 (first weigh-in)
- User inputs their weight
- App compares expected vs actual weight change over 14 days
- First RMR adjustment is made
- TDEE recalculated from new RMR
- New morning target = new TDEE - deficit
- App switches to 7 day weigh-in cycle going forward

### Every 7 days after that
- User weighs in
- App looks back at 7 days of logs
- Adjusts RMR based on expected vs actual weight change
- New morning target takes effect immediately

---

## The Adaptive Algorithm

Every weigh-in the app runs this comparison:

- Expected weight change = (calories eaten - daily targets) summed over the period / 3500
- Actual weight change = end weight - start weight
- Gap = actual change - expected change
- If gap is negative (losing less than expected) → RMR was overestimated → bring it down
- If gap is positive (losing more than expected) → RMR was underestimated → bring it up
- New RMR = current RMR adjusted by a small learning rate to avoid overcorrecting

---

## Phases

### Phase 1 (current) — Manual
- Manual calorie intake logging (user inputs a single number)
- Manual calorie burn logging (user inputs a single number)
- Manual weigh-ins every 7 days after the first 14 day baseline period

### Phase 2 — Wearable Integration
- Apple Watch and Garmin integration
- Live updating morning target throughout the day as activity is recorded
- Morning starts at RMR - deficit, updates toward full TDEE as day progresses

### Phase 3 — Food Logging
- MyFitnessPal API integration
- Users can search and log individual foods instead of inputting a total number

### Phase 4 — Full Native Food Logging
- Barcode scanning
- AI photo recognition for meal logging
- Native food database

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | Python + Flask |
| Database | SQLite (PostgreSQL later) |
| Hosting | Render (coming soon) |

---

## Project Status

Currently in development. Phase 1 in progress.


---

## Why This App Is Different

Every mainstream calorie tracking app has the same fundamental flaw: they calculate 
your calorie target once using a standard formula and never meaningfully correct it. 
When you follow the app perfectly and still don't lose weight, they have no answer. 
You blame yourself. The target was just wrong.

This app is built on a different philosophy:

**We admit we don't know your metabolism on day one. Then we actually figure it out.**

### The Problems We Solve

**Static targets that never adapt**
Apps like MyFitnessPal set your calorie target using the same formula for everyone 
and leave it there forever. Your actual metabolism depends on muscle mass, body 
composition, hormones, and dozens of other individual factors no formula can capture. 
Our target starts as an estimate and gets more accurate every single week.

**The underreporting problem**
Research shows people underreport their calorie intake by 20-40% on average. Every 
other app silently fails when this happens — the math stops working and the user 
gets blamed. Our app never argues with your logs. If the scale shows you are losing 
less than expected, we adjust the target down automatically. The feedback loop 
compensates for underreporting without ever accusing you of lying.



### Our Core Belief
The best calorie tracker is not the one with the biggest food database or the most 
integrations. It is the one whose targets are actually correct for your specific 
body. Everything we build is in service of that number getting more accurate over 
time.