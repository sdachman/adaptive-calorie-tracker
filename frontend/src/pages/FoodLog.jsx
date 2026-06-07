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
    const navigate = useNavigate()



    async function handleAddFood(){
        setErrorMessage("")
        if (foodCals!=="" && foodName!== "" && logDate!== ""){
            const newItem = {name:foodName, calories:Number(foodCals), protein:Number(foodProtein)}
            const user_id = localStorage.getItem("user_id")
            const response = await fetch(`http://127.0.0.1:5000/api/add-food`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({"logDate":logDate, "user_id": Number(user_id), "name": newItem.name, "calories": Number(newItem.calories), "protein": foodProtein !== "" ? Number(foodProtein) : null })
            }
            )
            const data = await response.json()
            if (response.ok){
                setFoodLogs([...foodLogs, newItem])
                setFoodCals("")
                setFoodProtein("")
                setFoodName("")
                setShowModal(false)
            }else {
                setErrorMessage(data.error)
            }

        } else {
            if (logDate == ""){
                setErrorMessage("Please Select a Date")
            }else{
                setErrorMessage("Please Fill All Fields")
            }
            
        }
        
        
    }

    async function fetchFoodItems(date){
        const user_id = localStorage.getItem("user_id")
        const response = await fetch(`http://127.0.0.1:5000/api/foods/${user_id}/${date}`,{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
        }    
        )
        const data = await response.json()
        if (response.ok){
            setFoodLogs(data)
        } else {
            setErrorMessage(data.error)
        }
    }

    async function handleLogDay(){
        setErrorMessage("")
        if (logDate!=="" && calsBurned!=="" && foodLogs.length!==0){
            const user_id = localStorage.getItem("user_id")
            const response = await fetch(`http://127.0.0.1:5000/api/log-day`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({"user_id": Number(user_id), "cals_burned": Number(calsBurned),"log_date": logDate})
            }    
            )
            const data = await response.json()
            if (response.ok) {
                setCalsBurned("")
                setLogDate("")
                setFoodLogs([])
                navigate('/dashboard')
            } else {
                setErrorMessage(data.error)
            }
        } else if (foodLogs.length == 0){ setErrorMessage("Please Log a Food")}
        
        else if (calsBurned=="") { setErrorMessage("Please Input Calories Burned")}

        else {
            setErrorMessage("Please Fill All Fields")
        }


    }

    function handleKeyDown(event){
        if (event.key == "Escape") {
            setShowModal(false)
        }
    }

    function setup() {
        window.addEventListener("keydown", handleKeyDown) // this means whenever user presses any key, call handleKeyDown. inside handleKeyDown we check if that key was escpae specifically. 
        return () => window.removeEventListener("keydown", handleKeyDown) // if you return anything in the function you pass into use effect it must be another funciton and react will call it when the component gets removed 
    }


    useEffect(setup, [])


    return (
        <div>
            <div>
                <h1>Food Logs</h1>
            </div>
            
            <div>
                <label style = {{fontSize: '20px', color: 'white'}}>Date: </label>
                <input
                    type="date"
                    value={logDate}
                    onChange={ async (event) => {
                        setLogDate(event.target.value)
                        await fetchFoodItems(event.target.value)
                    }}
                />
            </div>


            <br/>
            
            <br/>

            <div>
                <h2 style = {{fontWeight: 'bold'}}>
                    Calories Left: {dailyTarget - foodLogs.reduce((sum, item) => sum + item.calories, 0)}
                </h2>
            </div>

            <br/>
            

            <div>
                <h2> Log a Food </h2>
                {showModal && (
                    <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                        <div style={{background: 'white', margin: '100px auto', padding: '20px', width: '300px'}}>
                            <div>
                                <label>Name:</label>
                                <input
                                type = "text"
                                value = {foodName}
                                onChange = {(event)=> setFoodName(event.target.value)}/>
                            </div>
                            <div>
                                <label>Calories:</label>
                                <input
                                type = "number"
                                value = {foodCals}
                                onChange = {(event)=> setFoodCals(event.target.value)}/>                                
                            </div>

                            <div>
                                <label>Protein:</label>
                                <input
                                type = "number"
                                value = {foodProtein}
                                onChange = {(event)=> setFoodProtein(event.target.value)}/>                                
                            </div>
                            
                            <div>
                            <button onClick={handleAddFood}>Add Food</button>
                            </div>
                            <div>
                            <button onClick={()=> setShowModal(false)}>Exit</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


            <div> 
                <button onClick={() => setShowModal(true)}>Log Food</button>
            </div>

                
            
            
            
            <br/>

            <div>
                <h3 style ={{color:'white'}}>Submit Your Day</h3>
            </div>

            
            

            <div>
                <label>Calories Burned: </label>
                <input
                type = "number"
                value = {calsBurned}
                onChange = {(event)=> setCalsBurned(event.target.value)}/>                                
            </div>

            <br/>

            <div>
                <button onClick={handleLogDay}>Submit</button>
            </div>



            <div> <p style ={{color:'red'}}>{errorMessage}</p> </div>

            <br/>
            <br/>

            {/* log table */}
            <div style={{textAlign: 'center'}}>
                <h3>Food Logs</h3>
                <table style = {{margin: '0 auto'}} border ="1">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Calories</th>
                            <th>Protein</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodLogs.map((food, index) => (
                            <tr key ={index}>
                                <td>{food.name}</td>
                                <td>{food.calories}</td>
                                <td>{food.protein ?? 0}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><b>Total</b></td>
                            <td>{foodLogs.reduce((sum, item) => sum + item.calories, 0)}</td>
                            <td>{foodLogs.reduce((sum, item) => sum + (item.protein ?? 0), 0)}</td>
                        </tr>
                    </tfoot>

                </table>

            </div>
            {/* food table */}

            

            <br/>
            <br/>
            <br/>
            <br/>

                

            <div>
                <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>



            





        </div>



    )



}
export default FoodLog 