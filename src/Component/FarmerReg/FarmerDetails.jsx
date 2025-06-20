import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { API_URL } from '../Config/api';

const FarmerDetails = () => {
  const { state } = useLocation();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const jwt = localStorage.getItem('jwt');
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState('Animal_Product');
  const [vehiclePage, setVehiclePage] = useState(1);
  const itemsPerPage = 3;

  const tabs = [
    'Animal_Product',
    'Dairy_Product',
    'Animals',
    'Vehicles',
    'Field_Product',
    'Other_products',
  ];

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/farmer/slug/${slug}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        console.log(res)
        setFarmer(res.data);
      } catch (error) {
        setError(error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (slug && jwt) {
      fetchFarmers();
    }
  }, [slug, jwt]);

  const handleAddToCart = (item) => {
    console.log('Add to Cart:', item);
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!farmer) return <div className="p-6 text-center text-red-500">Farmer not found.</div>;

  const paginatedVehicles = farmer.vehicles?.slice(
    (vehiclePage - 1) * itemsPerPage,
    vehiclePage * itemsPerPage
  );

  const filterProductByType = (type) =>
    farmer.sellProducts?.filter((product) => product.type === type);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-green-700">{farmer.displayname}</h2>
          <p>
            <strong>Owner:</strong> {farmer.name}
          </p>
          <p>
            <strong>Distance:</strong> {farmer.distanceKm} km
          </p>
          <p>
            <strong>Product Type:</strong> {farmer.productType}
          </p>
        </div>
        <img
          src={farmer.images}
          alt="Farmer"
          className="w-full md:w-60 rounded-xl mt-4 md:mt-0"
          loading="lazy"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b pb-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm sm:text-base px-3 py-1 rounded-t-lg ${
              activeTab === tab
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-green-200'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {activeTab === 'Animal_Product' &&
          filterProductByType('animal')?.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 object-cover rounded mt-2"
                loading="lazy"
              />
              <p>Price: Rs. {item.price}</p>
              <p>Description: {item.description}</p>
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-2 px-4 py-1 bg-blue-600 text-black rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}

        {activeTab === 'Dairy_Product' &&
          filterProductByType('Dairy_Product')?.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 object-cover rounded mt-2"
                loading="lazy"
              />
              <p>Price: Rs. {item.price}</p>
              <p>Description: {item.description}</p>
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-2 px-4 py-1 bg-blue-600 text-black rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}

        {activeTab === 'Field_Product' &&
          filterProductByType('field')?.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 object-cover rounded mt-2"
                loading="lazy"
              />
              <p>Price: Rs. {item.price}</p>
              <p>Description: {item.description}</p>
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-2 px-4 py-1 bg-blue-600 text-black rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}

        {activeTab === 'Other_products' &&
          filterProductByType('Other_Product')?.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <img
                src={item.image}
                alt={item.name}
                className="w-40 h-40 object-cover rounded mt-2"
                loading="lazy"
              />
              <p>Price: Rs. {item.price}</p>
              <p>Description: {item.description}</p>
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-2 px-4 py-1 bg-blue-600 text-black rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}

        {activeTab === 'Animals' &&
          farmer.sellAnimals?.map((animal, index) => (
            <div key={index} className="p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">{animal.animalName}</h3>
              <img
                src={animal.image}
                alt={animal.animalName}
                className="w-40 h-40 object-cover rounded mt-2"
                loading="lazy"
              />
              <p>Age: {animal.age} years</p>
              <p>Milk/Day: {animal.milkPerDay}</p>
              <p>Price: Rs. {animal.price}</p>
              <p>Description: {animal.description}</p>
              <p>Location: {animal.location?.address}</p>
              <button
                onClick={() => handleAddToCart(animal)}
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}

        {activeTab === 'Vehicles' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedVehicles?.map((vehicle, index) => (
                <div key={index} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
                  <img
                    src={vehicle.image}
                    alt={vehicle.vehicleName}
                    className="w-40 h-40 object-cover rounded mb-2"
                    loading="lazy"
                  />
                  <h4 className="text-lg font-bold">{vehicle.vehicleName}</h4>
                  <p>Type: {vehicle.type}</p>
                  <p>Rate: {vehicle.rate} /hr</p>
                  <button
                    onClick={() => handleAddToCart(vehicle)}
                    className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setVehiclePage((p) => Math.max(p - 1, 1))}
                disabled={vehiclePage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setVehiclePage((p) => p + 1)}
                disabled={vehiclePage * itemsPerPage >= farmer.vehicles?.length}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FarmerDetails;
