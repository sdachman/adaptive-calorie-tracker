import { useState } from 'react'

function Dashboard({userId, dailyTarget}){
    const [calsEaten, setCalsEaten] = useState("")
    const [calsBurned, setCalsBurned] = useState("")

   
    async function handleSubmit() {
        const response = await fetch('http://127.0.0.1:5000/api/log-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({"calories_eaten": Number(calsEaten), "calories_burned": Number(calsBurned), "user_id": userId})
    })
        const data = await response.json()
        console.log(data)
    }



    return(
    <div>
        <div>
            <h1>Dashboard</h1>
        </div>

        <div>
            <p>
                Today's Calorie Target: {dailyTarget}
            </p>
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
    </div>
   )

}

export default Dashboard