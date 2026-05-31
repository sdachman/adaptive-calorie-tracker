import { useState } from 'react'
import {useNavigate, Navigate} from 'react-router-dom'

function WeighIn({setTDEE, setRMR, setDailyTarget, userId}) {
    if (!localStorage.getItem("user_id")) {
        return <Navigate to = "/signup" />
    }
    
    const [weight, setWeight] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    

    const navigate = useNavigate()

    async function handleSubmit() {
        if (weight !== "") {
            setErrorMessage("")
            const response = await fetch('http://127.0.0.1:5000/api/weigh-in', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"new_weight": Number(weight), "user_id": Number(userId)})
            })
            const data = await response.json()
            setDailyTarget(data.new_daily_target)
            setRMR(data.new_rmr)
            setTDEE(data.new_tdee)
            navigate('/dashboard')
    
        }
        else {
            setErrorMessage("Please Enter a Weight!")
        }
    }

    return(
    <div>
        <div>
            <h1> Weigh In</h1>
        </div>

        <div>
        <label> Your Weight: </label>
        <input
            type = 'number'
            value = {weight}
            onChange = {(event) => setWeight(event.target.value)}/>
        </div>

        <div>
            <button onClick ={handleSubmit}>Log Weight</button>
        </div>

        <div>
            <p style ={{color:'red'}}>{errorMessage}</p>
        </div>

        <div><button onClick={ () => navigate('/dashboard')}>Back To Dashboard</button></div>



    </div>


    )
}


export default WeighIn