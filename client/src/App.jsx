import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
//import { Route } from 'react-router-dom'
import {Toaster} from "react-hot-toast"
import { AuthContext } from '../context/AuthContext.jsx'
import {useContext} from 'react'

const App = () => {
  const {authUser} = useContext(AuthContext)
  return (
    <div className="app-bg">
      <Toaster
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#f0f0f0',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.85rem',
            fontWeight: 500,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#000' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#000' },
          },
        }}
      />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
        <Route path='/login' element={ !authUser ? <LoginPage /> : <Navigate to="/" />}/>
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

export default App
