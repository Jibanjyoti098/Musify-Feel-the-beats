import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthUserContext'
import M from "../assets/M.png"
import { FaUser } from 'react-icons/fa'

const NavBar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/home')
  }

  return (
    <div className='bg-black flex justify-between items-center h-[60px] w-full text-gray-400'>
      {/* //&Left nav */}
      <div className="pl-[30px] flex items-center w-[50%] gap-10">
        <Link to="/home">
          <img src={M} alt="" className='h-[50px] cursor-pointer hover:transition duration-300 transform hover:scale-105'/>
        </Link>
        <Link to="/home">
          <p className="cursor-pointer hover:text-white transition duration-100 transform hover:scale-105">Home</p>
        </Link>
        <input 
          type="search" 
          className="w-[500px] h-[40px] bg-gray-800 hover:bg-gray-700 rounded-3xl pl-[65px] cursor-pointer" 
          placeholder='Search albums, songs, artists, playlists'
        />
      </div>

      {/* //&Right nav */}
      <div className="flex w-[50%] gap-15 justify-end items-center pr-[30px]">
        <ul className="flex gap-5">
          <li className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer">Playlists</li>
          <li className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer">Liked</li>
          <li className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer">Downloads</li>
        </ul>
    
        <div className='flex items-center gap-5'>
          {user ? (
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full'>
                <FaUser className='text-blue-500' />
                <span className='text-white text-sm'>{user.displayName || user.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className='w-[100px] h-[40px] rounded-3xl bg-red-600 hover:bg-red-700 text-white transition duration-200 transform hover:scale-105 cursor-pointer'
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <ul className='flex gap-5'>
                <li className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer">Install App</li>
                <li 
                  onClick={() => navigate('/register')}
                  className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer"
                >
                  Sign up
                </li>
              </ul>
              <button 
                onClick={() => navigate('/login')}
                className='w-[100px] h-[40px] rounded-3xl bg-white text-black transition duration-200 transform hover:scale-105 cursor-pointer'
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBar