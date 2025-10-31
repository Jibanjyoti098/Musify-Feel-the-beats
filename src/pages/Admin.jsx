import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthUserContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import axios from 'axios';
import { FaCompactDisc, FaMusic, FaUsers, FaTrash, FaEdit } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAlbums: 0,
    totalSongs: 0
  });
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const albumsRes = await axios.get('http://localhost:5000/albums');
      const songsRes = await axios.get('http://localhost:5000/songs');
      
      setAlbums(albumsRes.data);
      setStats({
        totalAlbums: albumsRes.data.length,
        totalSongs: songsRes.data.length
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (id) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      try {
        await axios.delete(`http://localhost:5000/albums/${id}`);
        toast.success('Album deleted successfully!');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete album!');
        console.error('Error deleting album:', error);
      }
    }
  };

  return (
    <div className='flex'>
      <Toaster position="top-center" reverseOrder={false} />
      <AdminSidebar />
      
      <div className='ml-64 w-full p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-4xl font-bold text-white mb-2'>Admin Dashboard</h1>
            <p className='text-gray-400'>Welcome back, {user?.displayName || user?.email}!</p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-blue-200 text-sm mb-1'>Total Albums</p>
                  <h3 className='text-4xl font-bold text-white'>{stats.totalAlbums}</h3>
                </div>
                <div className='bg-blue-500 bg-opacity-30 p-4 rounded-full'>
                  <FaCompactDisc size={32} className='text-white' />
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-purple-200 text-sm mb-1'>Total Songs</p>
                  <h3 className='text-4xl font-bold text-white'>{stats.totalSongs}</h3>
                </div>
                <div className='bg-purple-500 bg-opacity-30 p-4 rounded-full'>
                  <FaMusic size={32} className='text-white' />
                </div>
              </div>
            </div>

            <div className='bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-lg'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-green-200 text-sm mb-1'>Active Users</p>
                  <h3 className='text-4xl font-bold text-white'>1</h3>
                </div>
                <div className='bg-green-500 bg-opacity-30 p-4 rounded-full'>
                  <FaUsers size={32} className='text-white' />
                </div>
              </div>
            </div>
          </div>

          <div className='bg-gray-800 rounded-xl p-6 mb-8'>
            <h2 className='text-2xl font-bold text-white mb-4'>Quick Actions</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <button 
                onClick={() => navigate('/admin/create-album')}
                className='bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 text-left'
              >
                <FaCompactDisc className='inline mr-3' size={20} />
                Create New Album
              </button>
              <button 
                onClick={() => navigate('/admin/manage-songs')}
                className='bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-lg transition duration-200 transform hover:scale-105 text-left'
              >
                <FaMusic className='inline mr-3' size={20} />
                Manage Songs
              </button>
            </div>
          </div>

          <div className='bg-gray-800 rounded-xl p-6'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-white'>All Albums</h2>
              <span className='text-gray-400 text-sm'>{albums.length} albums</span>
            </div>

            {loading ? (
              <div className='text-center text-gray-400 py-8'>Loading albums...</div>
            ) : albums.length === 0 ? (
              <div className='text-center py-12'>
                <FaCompactDisc size={64} className='text-gray-600 mx-auto mb-4' />
                <p className='text-gray-400 text-lg mb-4'>No albums yet</p>
                <button 
                  onClick={() => navigate('/admin/create-album')}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200'
                >
                  Create Your First Album
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {albums.map((album) => (
                  <div 
                    key={album.id} 
                    className='bg-gray-700 rounded-lg overflow-hidden hover:transform hover:scale-105 transition duration-200'
                  >
                    <div className='relative h-48'>
                      <img 
                        src={album.image} 
                        alt={album.name}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='p-4'>
                      <h3 className='text-white font-bold text-lg mb-1 truncate'>{album.name}</h3>
                      <p className='text-gray-400 text-sm mb-3 truncate'>{album.artist}</p>
                      <div className='flex items-center justify-between'>
                        <span className='text-gray-500 text-xs'>
                          {album.songs?.length || 0} songs
                        </span>
                        <div className='flex gap-2'>
                          <button 
                            onClick={() => navigate(`/admin/album/${album.id}`)}
                            className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-200'
                          >
                            <FaEdit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAlbum(album.id)}
                            className='bg-red-600 hover:bg-red-700 text-white p-2 rounded transition duration-200'
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;