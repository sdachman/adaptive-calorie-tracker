
import { Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import { useState } from 'react'
import Dashboard from './pages/Dashboard'




function App() {
  const [userId, setUserId] = useState(null)
  const [dailyTarget, setDailyTarget] = useState(null)


  return (
    <Routes>
      <Route path ="/" element = {<Signup setUserId = {setUserId} setDailyTarget = {setDailyTarget}/>} />
      <Route path ="/dashboard" element = {<Dashboard userId = {userId} dailyTarget = {dailyTarget} />} />
    </Routes>

  )
}

export default App