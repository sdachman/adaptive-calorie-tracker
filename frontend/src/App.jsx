
import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import WeighIn from './pages/WeighIn'




function App() {
  const [userId, setUserId] = useState(null)
  const [dailyTarget, setDailyTarget] = useState(null)
  const [RMR, setRMR] = useState(null)
  const [TDEE, setTDEE] = useState(null)


  return (
    <Routes>
      <Route path ="/" element = {<Signup setTDEE = {setTDEE} setRMR = {setRMR} setUserId = {setUserId} setDailyTarget = {setDailyTarget}/>} />
      <Route path ="/dashboard" element = {<Dashboard RMR = {RMR} TDEE = {TDEE} userId = {userId} dailyTarget = {dailyTarget} />} />
      <Route path ="/weigh-in" element = {<WeighIn setTDEE = {setTDEE} setRMR = {setRMR} setDailyTarget = {setDailyTarget} userId = {userId} />} />
    </Routes>

  )
}

export default App