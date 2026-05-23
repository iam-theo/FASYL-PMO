import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './components/auth/SignIn'
import MainBody from './components/layout/MainBody'
import { useEffect, useState } from 'react'
import { useNotification } from './components/NotificationContext'
import { FaCheckCircle, FaTimes, FaExclamationCircle } from "react-icons/fa"

function App() {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  })

  const { notification, setNotification } = useNotification();

  return (
    <>

      {/* ============ NOTIFICATION UI ============ */}
      {notification && (

          <div 
            className='bg-[#FFFFFF] shadow-[#1018280D] shadow-md rounded-lg p-4 flex items-start justify-between gap-4 fixed z-3000 top-0 mt-2  w-100 min-h-24.5 cursor-pointer right-0'>

            {
              notification.type === "success" 
                ? <FaCheckCircle className='text-[#D1FADF] text-2xl bg-[#1CA466] rounded-full border-2 border-[#1CA466]' /> 
                : notification.type === "error"
                ? <FaExclamationCircle className='text-[#e5969f] text-2xl bg-[#D20019] rounded-full border-2 border-[#D20019]' />
                : null
            }

            <div className='flex-1'>

              <p className='font-medium text-[14px]/[20px] text-[#090909] mb-1'>{notification.title}</p>
              <p className='font-normal text-[14px]/[20px] text-[#636363]'>{notification.message}</p>
              
            </div>

            <FaTimes onClick={() => setNotification(notification => !notification)} className='text-[#000000] bg-[#C6C6C6] text-xl rounded-md border-2' />

          </div>


      )}

      <Routes>

        <Route 
          path="/" 
          element={<SignIn setUser={setUser} />} 
        />

        <Route 
          path="/app" 
          element={
            user 
              ? <MainBody user={user} setUser={setUser} /> 
              : <Navigate to="/" />
          } 
        />

      </Routes>
    </>
  )
}

export default App