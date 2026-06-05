import { useState } from 'react'
import {useNavigate, Navigate} from 'react-router-dom'
import { useEffect } from 'react'

function FoodLog({dailyTarget}) {
    if (!localStorage.getItem("user_id")) {
        return <Navigate to = "/" />
    }

    const [foodLogs, setFoodLogs] = useState([])
    const [calsBurned, setCalsBurned] = useState("")
    const [logDate, setLogDate] = useState("")
    const [foodCals, setFoodCals] = useState("")
    const [foodProtein, setFoodProtein] = useState("")
    const [foodName, setFoodName] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")



    function handleAddFood(){
        const newItem = {name:foodName, cals:Number(foodCals), protein:Number(foodProtein)}
        setFoodLogs([...foodLogs, newItem])
        setFoodCals("")
        setFoodProtein("")
        setFoodName("")
        setShowModal(false)
        
    }

    async function handleLogDay(){
        if(logDate!=="" && calsBurned!=="" && foodLogs.length!==0){
            
        
        const response = await fetch(`http://127.0.0.1:5000/api/log-day/${localStorage.getItem("user_id")}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({"foodLogs": foodLogs, "cals_buned": Number(calsBurned),"log_date": logDate})
        }    
        )
        const data = await response.json()
        
        }else {
            setErrorMessage("Please Fill All Fields")
        }
    }


    return (
        <div>
            <div>
                <h1>Food Logs</h1>
            </div>
            <br/>

            <div>
                <p>
                    Calories Left: {dailyTarget - foodLogs.reduce((sum, item) => sum + item.cals, 0)}
                </p>
            </div>
            <div>
                {showModal && (
                    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <div style={{background: 'white', margin: '100px auto', padding: '20px', width: '300px'}}>
                            <div>
                                <input
                                type = "text"
                                value = {foodName}
                                onChange = {(event)=> setFoodName(event.target.value)}/>
                            </div>
                            <div>
                                <input
                                type = "number"
                                value = {foodCals}
                                onChange = {(event)=> setFoodCals(event.target.value)}/>                                
                            </div>

                            <div>
                                <input
                                type = "number"
                                value = {foodProtein}
                                onChange = {(event)=> setFoodProtein(event.target.value)}/>                                
                            </div>
                            
                            <div>
                            <button onClick={handleAddFood}>Done</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            <div> 
                <button onClick={() => setShowModal(true)}>Log Food</button>
            </div>














        </div>



    )



}