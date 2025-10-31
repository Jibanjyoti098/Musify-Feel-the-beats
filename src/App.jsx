import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthUserProvider } from '/src/context/AuthUserContext'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <AuthUserProvider>
      <Router>
        <div className="min-h-screen">
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/landing" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthUserProvider>
  )
}

export default App