import { useState } from 'react'
import {useNavigate, Navigate} from 'react-router-dom'

function Login({getData}){
    if (localStorage.getItem("user_id") != null){
        return <Navigate to = "/dashboard" />
    }
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const navigate = useNavigate()

    async function handleSubmit() {
        if (email!=="" && password!==""){
            const response = await fetch('http://127.0.0.1:5000/api/login',{
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({"email": email, "password": password})

            })
            const data = await response.json()
            if (response.ok) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("user_id", data.user_id)
                getData(data.user_id)
                navigate('/dashboard')

            } else{
                setErrorMessage(data.error)
            }


        } else{
            setErrorMessage("Please Fill Out All Fields")
        }


    }

    return (
        <div>
            <h1> Sign in</h1>
            <div>
                <label>Email:</label>
                <input 
                type = "email"
                value = {email}
                onChange = {(event)=> setEmail(event.target.value)}/>
            </div>
            <div>
                <label> Password: </label>
                <input 
                type = "password"
                value = {password}
                onChange = {(event)=> setPassword(event.target.value)}/>
            </div>
      
            <div>
            <button onClick={handleSubmit}>Login</button>
            </div>
            
            <div> <p style ={{color:'red'}}>{errorMessage}</p> </div>

             <div><button onClick={ () => navigate('/signup')}>Don't have an account? Create one here</button></div>

        </div>


    )





}

export default Login