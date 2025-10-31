import React from 'react';
import { useAuth } from '../context/AuthUserContext';

const LandingPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className='text-white flex flex-col items-center justify-center h-[calc(100vh-60px)]'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold mb-4'>Welcome to Musify!</h1>
        <p className='text-2xl text-gray-400 mb-8'>Hello, {user?.displayName || user?.email}! 🎵</p>
        <button 
          onClick={logout}
          className='bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition duration-200 transform hover:scale-105'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default LandingPage;