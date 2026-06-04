
import { Routes, Route, useNavigate } from 'react-router-dom'
import Signup from './pages/Signup'
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import WeighIn from './pages/WeighIn'
import Login from './pages/Login'





function App() {
  const [userId, setUserId] = useState(null)
  const [dailyTarget, setDailyTarget] = useState(null)
  const [RMR, setRMR] = useState(null)
  const [TDEE, setTDEE] = useState(null)
  const [signupDate, setSignupDate] = useState(null)
  const navigate = useNavigate()

  async function getData(user_id){
    const response = await fetch(`http://127.0.0.1:5000/api/user/${user_id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }

    )
    const data = await response.json()
    setUserId(user_id)
    setSignupDate(data.signup_date)
    setRMR(data.rmr)
    setTDEE(data.tdee)
    setDailyTarget(data.daily_target)
  }
    
  
  useEffect(()=> {
    let user_id = localStorage.getItem("user_id")
    if (user_id != null){
      getData(user_id)
      navigate('/dashboard')
    } 
  }, [])


  function handleLogout(){
    localStorage.removeItem("user_id")
    localStorage.removeItem("token")
    setUserId(null)
    setDailyTarget(null)
    setRMR(null)
    setTDEE(null)
    navigate('/')

  }


  return (
    <Routes>
      <Route path = "/" element = {<Login getData = {getData}/>}/>
      <Route path ="/signup" element = {<Signup setSignupDate = {setSignupDate} getData = {getData} />} />
      <Route path ="/dashboard" element = {<Dashboard signupDate = {signupDate} handleLogout = {handleLogout} RMR = {RMR} TDEE = {TDEE} userId = {userId} dailyTarget = {dailyTarget} />} />
      <Route path ="/weigh-in" element = {<WeighIn setTDEE = {setTDEE} setRMR = {setRMR} setDailyTarget = {setDailyTarget} userId = {userId} />} />
      
    </Routes>

  )
}

export default App