import { useState } from 'react'
import {useNavigate} from 'react-router-dom'





function Signup({ setRMR, setTDEE, setUserId, setDailyTarget }) {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [age, setAge] = useState("")
  const [sex, setSex] = useState("male")
  const [activityLevel, setActivityLevel] = useState("sedentary")
  const [weightLossPace, setWeightLossPace] = useState("1.0")


  
  const navigate = useNavigate()




  async function handleSubmit() {
    const response = await fetch('http://127.0.0.1:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({"weight_lbs": Number(weight), "age": Number(age), "sex": sex, "height_inches": Number(height), 'activity_level': activityLevel, "weight_loss_pace": weightLossPace})
  })



    const data = await response.json()
    setUserId(data.user_id)
    setDailyTarget(data.morning_target)
    setRMR(data.rmr)
    setTDEE(data.tdee)
    navigate('/dashboard')

    
  }


  return (
  
  
  <div>

    <div>
      <h1>Adaptive Calorie Tracker</h1>
      <label>Weight (lbs)</label>
      <input
        type ="number"
        value ={weight}
        onChange = {(event) => setWeight(event.target.value)}/>
      <p>{weight}</p>

      {/* height input */}
      <label> Height (in) </label>
      <input
        type = "number"
        value = {height}
        onChange = {(event)=> setHeight(event.target.value)}/>
      <p>{height}</p>

      {/* age input */}
      <label> Age </label>
      <input
        type = "number"
        value = {age}
        onChange = {(event)=> setAge(event.target.value)}/>
      <p>{age}</p>

    </div>

    <div>
      {/* sex dropdown */}

      <select value = {sex} onChange = {(event) => setSex(event.target.value)}>
        <option value ="male">male</option>
        <option value ="female">female</option>
      </select>

    </div>

    <div>
      {/* activity level dropdown */}

      <select value = {activityLevel} onChange = {(event) => setActivityLevel(event.target.value)}>
        <option value ="sedentary">sedentary: little or no exercise </option>
        <option value ="light">light: exercise 1-3 times/week </option>
        <option value ="moderate">moderate: exercise 4-5 times/week </option>
        <option value ="active">active: daily exercise or intense exercise 3-4 times/week </option>
        <option value ="very_active">very active: intense exercise 6-7 times/week </option>
      </select>
    </div>
    
    <div>
      {/* weigh loss pace dropdown */}

      <select value = {weightLossPace} onChange = {(event) => setWeightLossPace(event.target.value)}>
        <option value ="0.5">0.5 lbs/week</option>
        <option value ="1.0">1.0 lbs/week </option>
        <option value ="1.5">1.5 lbs/week </option>
        <option value ="2.0">2.0 lbs/week </option>
      </select>
    </div>

    <div>
      <button onClick={handleSubmit}>Create Account</button>
    </div>





    



  </div>
  )
}

export default Signup