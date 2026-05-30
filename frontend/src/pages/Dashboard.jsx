import { useState } from 'react'
import {useNavigate, Navigate} from 'react-router-dom'

function Dashboard({RMR, TDEE, userId, dailyTarget}){
    if (!userId) {
        return <Navigate to = "/" />
    }

    const [calsEaten, setCalsEaten] = useState("")
    const [calsBurned, setCalsBurned] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    

    const navigate = useNavigate()

    async function handleSubmit() {
        if (calsEaten !== "" && calsBurned !=="") {
            const response = await fetch('http://127.0.0.1:5000/api/log-day', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({"calories_eaten": Number(calsEaten), "calories_burned": Number(calsBurned), "user_id": Number(userId)})
        })
            const data = await response.json()
            setCalsEaten("")
            setCalsBurned("")
            console.log(data)
        } else {
            setErrorMessage("Please Fill All Fields!")
        }
    }
    



    return(
    <div>
        <div>
            <h1>Dashboard</h1>
        </div>

        <br/>
        <br/>



        <div>
            <h2> 
                Your Numbers:
            </h2>
        </div>

        <div>
            <p> 
            Current Resting Metabolic Rate: {RMR}
            </p>
        </div>
        
        <div>
            <p> 
            Current Total Daily Energy Expenditure: {TDEE}
            </p>
        </div>

        <div>
            <h4>
                Today's Calorie Target: {dailyTarget}
            </h4>
        </div>



        <br/>
        <br/>
        <br/>
        <br/>


        <div>
            <h2> Log Your Day </h2>
        </div>
        <div>
            {/* cals eaten input */}
            <label> Calories Eaten Today </label>
            <input
                type = "number"
                value = {calsEaten}
                onChange = {(event)=> setCalsEaten(event.target.value)}/>
        </div>
        <div>
            {/* cals eaten input */}
            <label> Calories Burned Today </label>
            <input
                type = "number"
                value = {calsBurned}
                onChange = {(event)=> setCalsBurned(event.target.value)}/>

        </div>
        <div><button onClick={handleSubmit}>Log Day</button></div>

        <div> <p style ={{color:'red'}}>{errorMessage}</p> </div>

        <br/>
        <br/>
        <div><button onClick={ () => navigate('/weigh-in')}>Log Your Weight</button></div>
    </div>
   )

}

export default Dashboard