import { API_URL } from '@/Component/Config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FetchFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Rendering FetchFarmers');
    const fetchFarmers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/getFarmer`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        }); 
        if (!response.ok) {
          throw new Error('Failed to fetch farmers');
        }
        const data = await response.json();
        setFarmers(data);
        setFilteredFarmers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFarmers(farmers);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = farmers.filter(farmer => 
        (farmer.name && farmer.name.toLowerCase().includes(lowercasedSearch)) ||
        (farmer.displayname && farmer.displayname.toLowerCase().includes(lowercasedSearch)) ||
        (farmer.citizenno && farmer.citizenno.toString().includes(lowercasedSearch))
      );
      setFilteredFarmers(filtered);
    }
  }, [searchTerm, farmers]);

  const handleFarmerClick = (slug) => {
    navigate(`/admin/adfarmer/${slug}`); 
  };

  if (loading) return <div className="p-4 text-gray-600">Loading farmers...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-600">Farmers List</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search by name, farm, or ID..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFarmers.length > 0 ? (
          filteredFarmers.map((farmer) => (
            <div 
              key={farmer.id}
              onClick={() => handleFarmerClick(farmer.slug)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
            >
              <h3 className="font-medium text-green-700">{farmer.name}</h3>
              <div className="w-30 h-30 rounded-md">
                <img src={farmer.images} alt={farmer.name} className="w-full h-auto rounded-md" />
              </div>
              <p className='text-gray-700'>{farmer.displayname}</p>
              <p className='text-gray-700'>Citizen No: {farmer.citizenno}</p>
              <p className="text-gray-600">{farmer.location?.address}</p>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No farmers found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default FetchFarmers;