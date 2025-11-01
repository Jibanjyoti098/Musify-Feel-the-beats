import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaImage, FaCompactDisc, FaUser, FaUpload } from 'react-icons/fa';

const CreateAlbum = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    artist: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const cloudName = 'daeladls4';
    const uploadPreset = 'musify_images';

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Please select an album cover image!');
      return;
    }

    setUploading(true);

    try {
      const imageUrl = await uploadImageToCloudinary(formData.image);

      const albumData = {
        name: formData.name,
        artist: formData.artist,
        image: imageUrl,
        songs: []
      };

      await axios.post('http://localhost:5000/albums', albumData);

      toast.success('Album created successfully!');
      
      setTimeout(() => {
        navigate('/admin');
      }, 2000);

    } catch (error) {
      setUploading(false);
      toast.error('Failed to create album. Please try again!');
      console.error('Error creating album:', error);
    }
  };

  return (
    <div className='flex'>
      <Toaster position="top-center" reverseOrder={false} />
      <AdminSidebar />
      
      <div className='ml-64 w-full p-8'>
        <div className='max-w-3xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-white mb-2'>Create New Album</h1>
            <p className='text-gray-400'>Add a new album to your music library</p>
          </div>

          <form onSubmit={handleSubmit} className='bg-gray-800 rounded-xl p-8 space-y-6'>
            
            <div>
              <label className='text-gray-300 text-sm mb-2 block'>Album Name</label>
              <div className='relative'>
                <FaCompactDisc className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter album name'
                />
              </div>
            </div>

            <div>
              <label className='text-gray-300 text-sm mb-2 block'>Artist Name</label>
              <div className='relative'>
                <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  name='artist'
                  value={formData.artist}
                  onChange={handleChange}
                  required
                  className='w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter artist name'
                />
              </div>
            </div>

            <div>
              <label className='text-gray-300 text-sm mb-2 block'>Album Cover Image</label>
              <div className='flex items-center gap-6'>
                <div className='flex-1'>
                  <label className='flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 px-4 rounded-lg cursor-pointer transition duration-200'>
                    <FaUpload className='mr-2' />
                    <span>{formData.image ? 'Change Image' : 'Upload Image'}</span>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageChange}
                      className='hidden'
                    />
                  </label>
                </div>
                
                {imagePreview && (
                  <div className='w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-600'>
                    <img 
                      src={imagePreview} 
                      alt='Preview' 
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}
              </div>
            </div>

            <div className='flex gap-4 pt-4'>
              <button
                type='submit'
                disabled={uploading}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 transform hover:scale-105 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? 'Creating Album...' : 'Create Album'}
              </button>
              
              <button
                type='button'
                onClick={() => navigate('/admin')}
                className='flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition duration-200'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbum;