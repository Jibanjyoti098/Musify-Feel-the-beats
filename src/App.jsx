import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthUserProvider } from '/src/context/AuthUserContext'
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'
import Admin from '/src/pages/Admin'
import CreateAlbum from './pages/CreateAlbum'
import AlbumDetails from './pages/AlbumDetails'
import ProtectedRoute from './components/ProtectedRoute'

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
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            <Route path="/admin/create-album" element={<ProtectedRoute><CreateAlbum /></ProtectedRoute>} />
            <Route path="/admin/album/:id" element={<ProtectedRoute><AlbumDetails /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthUserProvider>
  )
}

export default App