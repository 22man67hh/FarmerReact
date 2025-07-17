import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFarmers } from '../State/Farmer/FarmerSlie';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import slugify from 'slugify';

const FarmCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { farmers = [] ,farmer} = useSelector((state) => state.farmer || { farmers: [] });
  const { user } = useSelector((state) => state.auth || {}); 
  const jwt = localStorage.getItem('jwt');
const farm=farmer?.farmer || {};

  useEffect(() => {
  
      dispatch(fetchFarmers());
    
  }, [dispatch]);

  if (!Array.isArray(farmers)) {
    return <div>Loading farmers data...</div>;
  }

const productTypeMap = {
  'Dairy_Product': 'Dairy Products',
  'Field_Product': 'Field Products',
  'Animal_waste': 'Animal Waste',
  'Other_Product': 'Other Products',
  'Animal_Product': 'Animal Products'
};


  return (
    <div className="mt-9 px-5 md:px-8 py-6">
      <h2 className="text-2xl font-bold border-b-2 border-green-500 inline-block pb-1 mb-6">
        Our Farmers Farm
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-6">
        {farmers.map((farmer) => (
          <Card
            key={farmer.id}
            className={`shadow-md rounded-xl hover:shadow-xl transition duration-300 cursor-pointer relative 
              ${farm?.id === farmer?.id ? 'border-2 border-green-500' : ''}`}
            onClick={() => navigate(`/farmer/${slugify(farmer.displayname, { lower: true })}`, { state: { farmer } })}
          >
            {farm?.id === farmer.id && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Your Farm
              </div>
            )}

            <img
              src={farmer.images}
              alt={farmer.displayname}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold text-green-600">
                {farmer.displayname}
                {user?.id === farmer.id && (
                  <span className="ml-2 text-xs text-green-500">★</span>
                )}
              </h3>
              <p className="text-sm text-gray-700">
                <strong>Owner:</strong> {farmer.name}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Distance:</strong> {farmer.distanceKm} km
              </p>
             <p className="mt-2 bg-gray-100 rounded text-sm">
    <strong>Product Available:</strong>
  {farmer?.productType?.toString()?.replace(/_/g, ' ') || 'No product type specified'}
</p> 
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FarmCard;