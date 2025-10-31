import React from 'react'
import Menu from './Menu'
import M from "../assets/M.png"
// import { NavLink } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className='bg-black flex justify-between items-center h-[60px] w-full text-gray-400'>
      {/* //&left nav  */}
      <div className="pl-[30px] flex items-center w-[50%] gap-10">
       <img src={M} alt="" className='h-[50px] cursor-pointer  hover:transition duration-300 transform hover:scale-105'/>
        <a href="/Home">
        <p className="cursor-pointer hover:text-white transition duration-100 transform hover:scale-105">Home</p>
        </a>
        <input type="search" className="w-[500px] h-[40px] bg-gray-800 hover:bg-gray-700  rounded-3xl pl-[65px] cursor-pointer " placeholder='Search albums, songs, artists, playlists'/>
      </div>
      {/* //&right nav  */}
      <div className="flex w-[50%] gap-15 justify-end items-center pr-[30px]">
        <ul className="flex gap-5">
          <li className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer">Playlists</li>
          <li className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer">Liked</li>
          <li className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer">Downloads</li>
        </ul>
    
    <div className='flex items-center gap-5'>
      <ul className='flex gap-5'>
      <li className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer">Install App</li>
      <li className="hover:text-white transition duration-100 transform hover:scale-105 cursor-pointer">Sign up</li>
    </ul>
    <button className=' w-[100px] h-[40px] rounded-3xl bg-white text-black transition duration-200 transform hover:scale-105 cursor-pointer'>
      Login
    </button>
  </div>
      </div>
    </div>
    
  )
}

export default NavBar
