import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return; 
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);  

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      toast.success('Account created successfully! Redirecting to login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already registered!');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Invalid email address!');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak!');
      } else {
        toast.error('Registration failed. Please try again!');
      }
      console.error('Registration error:', error);
    }
  };

  return (
    <div className='min-h-[calc(100vh-60px)] flex items-center justify-center px-4'>
      <Toaster position="top-center" reverseOrder={false} />

      <div className='bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md'>
        
        <div className='text-center mb-8'>
          <h2 className='text-4xl font-bold text-white mb-2'>Create Account</h2>
          <p className='text-gray-400'>Join Musify and feel the beats</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5'>
          
          <div>
            <label className='text-gray-300 text-sm mb-2 block'>Full Name</label>
            <div className='relative'>
              <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                className='w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Enter your name'
              />
            </div>
          </div>

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
                placeholder='Create a password'
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

          <div>
            <label className='text-gray-300 text-sm mb-2 block'>Confirm Password</label>
            <div className='relative'>
              <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className='w-full bg-gray-700 text-white pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Confirm your password'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none'
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className='text-center mt-6'>
          <p className='text-gray-400'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-500 hover:text-blue-400 font-semibold'>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;