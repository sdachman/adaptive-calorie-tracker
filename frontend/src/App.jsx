
import { Routes, Route, useNavigate } from 'react-router-dom'
import Signup from './pages/Signup'
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import WeighIn from './pages/WeighIn'





function App() {
  const [userId, setUserId] = useState(null)
  const [dailyTarget, setDailyTarget] = useState(null)
  const [RMR, setRMR] = useState(null)
  const [TDEE, setTDEE] = useState(null)
  const navigate = useNavigate()

  async function getData(user_id){
    const response = await fetch(`http://127.0.0.1:5000/api/user/${user_id}`)
    const data = await response.json()
    setUserId(user_id)
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


  return (
    <Routes>
      <Route path ="/" element = {<Signup setTDEE = {setTDEE} setRMR = {setRMR} setUserId = {setUserId} setDailyTarget = {setDailyTarget}/>} />
      <Route path ="/dashboard" element = {<Dashboard RMR = {RMR} TDEE = {TDEE} userId = {userId} dailyTarget = {dailyTarget} />} />
      <Route path ="/weigh-in" element = {<WeighIn setTDEE = {setTDEE} setRMR = {setRMR} setDailyTarget = {setDailyTarget} userId = {userId} />} />
    </Routes>

  )
}

export default App