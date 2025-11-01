import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaMusic, FaUpload, FaTrash, FaArrowLeft, FaImage } from 'react-icons/fa';

const AlbumDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [songForm, setSongForm] = useState({
    title: '',
    duration: '',
    audioFile: null,
    thumbnail: null
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  const fetchAlbum = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/albums/${id}`);
      setAlbum(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching album:', error);
      toast.error('Failed to load album!');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSongForm({
      ...songForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setSongForm({ ...songForm, audioFile: file });
      } else {
        toast.error('Please select an audio file!');
      }
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSongForm({ ...songForm, thumbnail: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file!');
      }
    }
  };

  const uploadToCloudinary = async (file, resourceType = 'image') => {
    const cloudName = 'daeladls4';
    const uploadPreset = resourceType === 'image' ? 'musify_images' : 'musify_audio';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    if (resourceType === 'audio') {
      formData.append('resource_type', 'video');
    }

    try {
      const endpoint = resourceType === 'image' 
        ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        : `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
        
      const response = await axios.post(endpoint, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleAddSong = async (e) => {
    e.preventDefault();

    if (!songForm.audioFile) {
      toast.error('Please select an audio file!');
      return;
    }

    setUploading(true);

    try {
      toast.loading('Uploading audio file...');
      const audioUrl = await uploadToCloudinary(songForm.audioFile, 'audio');

      let thumbnailUrl = album.image;
      
      if (songForm.thumbnail) {
        toast.loading('Uploading thumbnail...');
        thumbnailUrl = await uploadToCloudinary(songForm.thumbnail, 'image');
      }

      const newSong = {
        id: Date.now().toString(),
        title: songForm.title,
        duration: songForm.duration,
        audioUrl: audioUrl,
        thumbnail: thumbnailUrl,
        albumId: id,
        artist: album.artist,
        albumName: album.name
      };

      const updatedSongs = [...(album.songs || []), newSong];
      
      await axios.patch(`http://localhost:5000/albums/${id}`, {
        songs: updatedSongs
      });

      await axios.post('http://localhost:5000/songs', newSong);

      toast.dismiss();
      toast.success('Song added successfully!');
      setSongForm({ title: '', duration: '', audioFile: null, thumbnail: null });
      setThumbnailPreview(null);
      fetchAlbum();
      setUploading(false);

    } catch (error) {
      toast.dismiss();
      setUploading(false);
      toast.error('Failed to add song!');
      console.error('Error adding song:', error);
    }
  };

  const handleDeleteSong = async (songId) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        const updatedSongs = album.songs.filter(song => song.id !== songId);
        
        await axios.patch(`http://localhost:5000/albums/${id}`, {
          songs: updatedSongs
        });

        await axios.delete(`http://localhost:5000/songs/${songId}`);

        toast.success('Song deleted successfully!');
        fetchAlbum();
      } catch (error) {
        toast.error('Failed to delete song!');
        console.error('Error deleting song:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className='flex'>
        <AdminSidebar />
        <div className='ml-64 w-full flex items-center justify-center h-screen'>
          <div className='text-white text-xl'>Loading album...</div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className='flex'>
        <AdminSidebar />
        <div className='ml-64 w-full flex items-center justify-center h-screen'>
          <div className='text-white text-xl'>Album not found!</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <Toaster position="top-center" reverseOrder={false} />
      <AdminSidebar />
      
      <div className='ml-64 w-full p-8'>
        <div className='max-w-6xl mx-auto'>
          <button
            onClick={() => navigate('/admin')}
            className='flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition duration-200'
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          <div className='bg-gray-800 rounded-xl p-6 mb-8'>
            <div className='flex items-start gap-6'>
              <img 
                src={album.image} 
                alt={album.name}
                className='w-48 h-48 object-cover rounded-lg'
              />
              <div className='flex-1'>
                <h1 className='text-4xl font-bold text-white mb-2'>{album.name}</h1>
                <p className='text-xl text-gray-400 mb-4'>{album.artist}</p>
                <div className='flex items-center gap-4 text-sm text-gray-500'>
                  <span>{album.songs?.length || 0} songs</span>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <div className='bg-gray-800 rounded-xl p-6'>
              <h2 className='text-2xl font-bold text-white mb-6'>Add New Song</h2>
              
              <form onSubmit={handleAddSong} className='space-y-4'>
                <div>
                  <label className='text-gray-300 text-sm mb-2 block'>Song Title</label>
                  <input
                    type='text'
                    name='title'
                    value={songForm.title}
                    onChange={handleInputChange}
                    required
                    className='w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter song title'
                  />
                </div>

                <div>
                  <label className='text-gray-300 text-sm mb-2 block'>Duration (e.g., 3:45)</label>
                  <input
                    type='text'
                    name='duration'
                    value={songForm.duration}
                    onChange={handleInputChange}
                    required
                    pattern='[0-9]+:[0-5][0-9]'
                    className='w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='MM:SS'
                  />
                </div>

                <div>
                  <label className='text-gray-300 text-sm mb-2 block'>Song Thumbnail (Optional)</label>
                  <div className='flex items-center gap-4'>
                    <label className='flex-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 px-4 rounded-lg cursor-pointer transition duration-200'>
                      <FaImage className='mr-2' />
                      <span>{songForm.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}</span>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleThumbnailChange}
                        className='hidden'
                      />
                    </label>
                    {thumbnailPreview && (
                      <div className='w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-600'>
                        <img 
                          src={thumbnailPreview} 
                          alt='Preview' 
                          className='w-full h-full object-cover'
                        />
                      </div>
                    )}
                  </div>
                  <p className='text-gray-500 text-xs mt-1'>If not provided, album cover will be used</p>
                </div>

                <div>
                  <label className='text-gray-300 text-sm mb-2 block'>Audio File</label>
                  <label className='flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-3 px-4 rounded-lg cursor-pointer transition duration-200'>
                    <FaUpload className='mr-2' />
                    <span>{songForm.audioFile ? songForm.audioFile.name : 'Upload Audio'}</span>
                    <input
                      type='file'
                      accept='audio/*'
                      onChange={handleAudioFileChange}
                      className='hidden'
                    />
                  </label>
                </div>

                <button
                  type='submit'
                  disabled={uploading}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? 'Adding Song...' : 'Add Song'}
                </button>
              </form>
            </div>

            <div className='bg-gray-800 rounded-xl p-6'>
              <h2 className='text-2xl font-bold text-white mb-6'>Songs List</h2>
              
              {(!album.songs || album.songs.length === 0) ? (
                <div className='text-center py-12'>
                  <FaMusic size={48} className='text-gray-600 mx-auto mb-4' />
                  <p className='text-gray-400'>No songs yet. Add your first song!</p>
                </div>
              ) : (
                <div className='space-y-3'>
                  {album.songs.map((song, index) => (
                    <div 
                      key={song.id}
                      className='bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition duration-200'
                    >
                      <div className='flex items-center gap-4 flex-1'>
                        <span className='text-gray-400 font-bold'>{index + 1}</span>
                        {song.thumbnail && (
                          <img 
                            src={song.thumbnail} 
                            alt={song.title}
                            className='w-12 h-12 object-cover rounded'
                          />
                        )}
                        <div className='flex-1'>
                          <h3 className='text-white font-semibold'>{song.title}</h3>
                          <p className='text-gray-400 text-sm'>{song.duration}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className='bg-red-600 hover:bg-red-700 text-white p-2 rounded transition duration-200'
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetails;