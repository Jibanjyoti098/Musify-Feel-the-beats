import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthUserContext';
import { isAdmin } from '../config/adminConfig';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin(user.email)) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-red-500 mb-4'>Access Denied</h1>
          <p className='text-gray-400 mb-6'>You don't have admin permissions.</p>
          <button 
            onClick={() => window.location.href = '/landing'}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg'
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;