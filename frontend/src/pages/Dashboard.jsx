import { useState } from 'react'
import {useNavigate, Navigate} from 'react-router-dom'
import { useEffect } from 'react'

function Dashboard({signupDate, handleLogout, RMR, TDEE, userId, dailyTarget}){
    if (!localStorage.getItem("user_id")) {
        return <Navigate to = "/" />
    }

    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const [userLogs, setUserLogs] = useState([])
    const [weighInLogs, setWeighInLogs] = useState([])
    const [nextCalibration, setNextCalibration] = useState("")

    

    async function fetchLogs(){
        const response = await fetch(`http://127.0.0.1:5000/api/logs/${localStorage.getItem("user_id")}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        }    
        )
        const data = await response.json()
        if (response.ok){
            setUserLogs(data)
        } else {
            console.log("fetchLogs error:", data)
        }
    }

    async function fetchWeighIns(){
        const response = await fetch(`http://127.0.0.1:5000/api/weigh-in-log/${localStorage.getItem("user_id")}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }   
        }
        )
        const data = await response.json()
        if (response.ok){
            setWeighInLogs(data.weigh_in_logs)
            setNextCalibration(data.next_calibration)
        } else{
            console.log("fetchWeighIn Error:", data)
        }

    }



    useEffect(()=> {
        fetchLogs()
        fetchWeighIns()
    }, [])




    


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
       


        <div>
            <h2>Log Your Food</h2>
        </div>

        <div><button onClick={ () => navigate('/food-log')}>Log Your Day</button> </div>
       

        <div> <p style ={{color:'red'}}>{errorMessage}</p> </div>

        <br/>

        <div> <h4>Days Until Next Calibration: {nextCalibration}</h4> </div>
        
        <div><button onClick={ () => navigate('/weigh-in')}>Log Your Weight</button></div>


        <br/>


        {/* both tables */}
        <div style = {{display: 'flex', gap: '40px', justifyContent: 'space-between', paddingRight: '40px', paddingLeft: '40px'}}>
        {/* log table */}
        <div style = {{textAlign: "left"}}>
            <h3>Daily Logs</h3>
            <table border ="1">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Calories Eaten</th>
                        <th>Calories Burned</th>
                    </tr>
                </thead>
                <tbody>
                    {userLogs.map((log, index) => (
                        <tr key ={index}>
                            <td>{log.date}</td>
                            <td>{log.calories_eaten}</td>
                            <td>{log.calories_burned}</td>
                        </tr>
                    ))}
                </tbody>
            </table>




        </div>
        {/* log table */}


        {/* weigh in table */}         
        <div style = {{ textAlign: "left" }}> 
            <h3>Weigh In Logs</h3>
            <table border = "1">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {weighInLogs.map((log, index) => (
                        <tr key = {index}>
                            <td>{log.date}</td> {/* the brackets allow you to put in a javascript vairable into html otherwise it would treat it as just plain text */}
                            <td>{log.weight} lbs </td>
                        </tr>
                
                    ))}
                </tbody>
            </table>



        </div>
        {/* weigh in table */}    
        </div>
        {/* both table */}
        
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        <div>
            <button onClick={handleLogout}>Log Out</button>
         </div>
        
    </div>
   )

}

export default Dashboard