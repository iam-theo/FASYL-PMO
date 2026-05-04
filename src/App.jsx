import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './components/SignIn'
import MainBody from './components/MainBody'
import { useEffect, useState } from 'react'

function App() {

  const [user, setUser] = useState(null)

    // roles routing
  useEffect(() => {
      const storedUser = localStorage.getItem("user");

      if(storedUser) {
          setUser(JSON.parse(storedUser))
      }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<SignIn setUser={setUser} />} />
      <Route path="/app" element={user ? <MainBody user={user} setUser={setUser} /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default App