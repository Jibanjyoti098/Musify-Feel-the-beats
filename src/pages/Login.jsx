import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      toast.success('Login successful! Redirecting...');

      setTimeout(() => {
        navigate('/landing');
      }, 1500);

    } catch (error) {
      setLoading(false);
      
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email!');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect password!');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address!');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid email or password!');
      } else {
        toast.error('Login failed. Please try again!');
      }
      console.error('Login error:', error);
    }
  };

  return (
    <div className='min-h-[calc(100vh-60px)] flex items-center justify-center px-4'>
      <Toaster position="top-center" reverseOrder={false} />

      <div className='bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md'>
        
        <div className='text-center mb-8'>
          <h2 className='text-4xl font-bold text-white mb-2'>Welcome Back</h2>
          <p className='text-gray-400'>Login to continue your musical journey</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          
          <div>
            <label className='text-gray-300 text-sm mb-2 block'>Email Address</label>
            <div className='relative'>
              <FaEnvelope className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your email'
              />
            </div>
          </div>

          <div>
            <label className='text-gray-300 text-sm mb-2 block'>Password</label>
            <div className='relative'>
              <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                className='w-full bg-gray-700 text-white pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your password'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none'
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className='text-center mt-6'>
          <p className='text-gray-400'>
            Don't have an account?{' '}
            <Link to='/register' className='text-blue-500 hover:text-blue-400 font-semibold'>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;