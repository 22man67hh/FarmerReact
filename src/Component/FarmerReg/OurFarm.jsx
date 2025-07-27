import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFarmers } from '../State/Farmer/FarmerSlie';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';

const OurFarm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { farmers = [], farmer } = useSelector((state) => state.farmer || { farmers: [] });
  const { user } = useSelector((state) => state.auth || {}); 
  const jwt = localStorage.getItem('jwt');
  const farm = farmer || {};

  useEffect(() => {
    dispatch(fetchFarmers());
  }, [dispatch]);

  console.log(farm)
  if (!Array.isArray(farmers)) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-green-100 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-green-100 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-green-100 rounded"></div>
              <div className="h-4 bg-green-100 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const productTypeMap = {
    'Dairy_Product': 'Dairy Products',
    'Field_Product': 'Field Products',
    'Animal_waste': 'Animal Waste',
    'Other_Product': 'Other Products',
    'Animal_Product': 'Animal Products'
  };

  return (
    <div className="mt-9 px-5 md:px-8 py-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Discover Local Farms
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore fresh produce and sustainable farming practices from our community of local farmers
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {farmers.map((farmer) => (
          <div 
            key={farmer.id}
            className="relative group"
            onClick={() => navigate(`/farmer/${slugify(farmer.displayname, { lower: true })}`, { state: { farmer } })}
          >
            <Card className="h-full flex flex-col shadow-lg rounded-2xl overflow-hidden transition-all duration-300 transform group-hover:-translate-y-2 group-hover:shadow-xl">
              {farm?.id === farmer.id && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                  Your Farm
                </div>
              )}
              
              <div className="relative overflow-hidden h-56">
                <img
                  src={farmer.images || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'}
                  alt={farmer.displayname}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              <CardContent className="p-5 flex-grow flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {farmer.displayname}
                    {user?.id === farmer.id && (
                      <span className="ml-2 text-green-500 text-sm">★ Verified</span>
                    )}
                  </h3>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {farmer.distanceKm} km
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3">
        
                  <span className="font-medium">Owner:</span> {farmer.name}
                </p>
                
                <div className="mt-auto">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">Products:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                       {farmer?.productType?.toString()?.replace(/_/g, ' ') || 'No product type specified'}

                    </div>
                  </div>
                  
                  <button 
                    className="w-full mt-3 bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/farmer/${slugify(farmer.displayname, { lower: true })}`, { state: { farmer } });
                    }}
                  >
                    Visit Farm
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      {farmers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Farms Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">We couldn't find any farms in your area. Check back later or expand your search range.</p>
        </div>
      )}
    </div>
  );
};

export default OurFarm;