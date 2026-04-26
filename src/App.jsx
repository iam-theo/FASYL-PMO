import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignIn from './components/SignIn'
import MainBody from './components/MainBody'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/app" element={<MainBody />} />
    </Routes>
  )
}

export default App