import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMusic, FaCompactDisc, FaHome } from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className='w-64 bg-gray-900 h-[calc(100vh-60px)] fixed left-0 top-[60px] border-r border-gray-800'>
      <div className='p-6'>
        <h2 className='text-2xl font-bold text-white mb-8'>Admin Panel</h2>
        
        <nav className='space-y-3'>
          <Link 
            to='/admin'
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
              isActive('/admin') 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FaHome size={20} />
            <span className='font-medium'>Dashboard</span>
          </Link>

          <Link 
            to='/admin/create-album'
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
              isActive('/admin/create-album') 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FaCompactDisc size={20} />
            <span className='font-medium'>Create Album</span>
          </Link>

          <Link 
            to='/admin/manage-songs'
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
              isActive('/admin/manage-songs') 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <FaMusic size={20} />
            <span className='font-medium'>Manage Songs</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;