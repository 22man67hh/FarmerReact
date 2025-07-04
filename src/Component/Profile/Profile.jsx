import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useState } from 'react';
import pp from '@/Component/asset/about.jpg';
import im from '@/image/3267-124850.gif';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoggedInFarmer } from '../State/Farmer/FarmerSlie';
import { getWagesProfile } from '../State/Wages/Wages';
import { toast } from 'react-toastify';

const Profile = () => {
  const location=useLocation();
  const message=location?.state?.message;
  const dispatch = useDispatch();
  const { farmer } = useSelector((state) => state.farmer);
  const {user}=useSelector((state)=>state.auth);
const [checkingWages,setCheckingWages]=useState(false)
  const [vehicles, setVehicles] = useState([]);
  const [products, setProducts] = useState([]);
  const [wages, setWages] = useState([]);
  const [activeTab, setActiveTab] = useState('vehicles');
const navigate=useNavigate();
  const jwt = localStorage.getItem('jwt');
const userId=user?.id;  

useEffect(()=>{
  if(message){
    toast.info(message)
  }
},[message])

  if (!jwt) {
    return <Navigate to="/" state={{ message: 'Please login to continue' }} />;
  }

  useEffect(() => {
    if (!farmer) {
      dispatch(fetchLoggedInFarmer());
    }
  }, [dispatch, farmer]);

  useEffect(() => {
    if (!jwt || !userId) return;

    const fetchTabData = async () => {
      try {
        let response, data;

        if (activeTab === 'vehicles' && vehicles.length === 0) {
          response = await fetch(`/api/vehicles/user/${userId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          });
          data = await response.json();
          setVehicles(data);
        }

        if (activeTab === 'products' && products.length === 0) {
          response = await fetch(`/api/products/user/${userId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          });
          data = await response.json();
          setProducts(data);
        }

        if (activeTab === 'wages' && wages.length === 0) {
          response = await fetch(`/api/wages/user/${userId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
          });
          data = await response.json();
          setWages(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTabData();
  }, [activeTab, jwt, userId, vehicles.length, products.length, wages.length]);


const handleWorkerProfileCheck = async (worker) => {
  setCheckingWages(true);
  try {
    const result = await dispatch(getWagesProfile(userId)).unwrap();
    if (result) {
      navigate("/workerProfile",{state:result});
    } else {
      navigate("/createWork");
    }
    console.log(result);
    console.log(result.length);
  } catch (error) {
    console.error("Error fetching wages profile:", error);
    navigate("/createWork");
  } finally {
    setCheckingWages(false);
  }
};

// console.log(user)
  return (
    <>
      <div className="mt-6 max-w-full flex flex-col md:flex-row gap-x-20 items-start px-4">
        <div>
          <img src={im} alt="Banner" className="w-52 h-52 md:w-80 md:h-80" />
        </div>
        <Card className="w-full md:w-2/3">
          <CardContent className="py-6">
            <h3 className="text-center font-bold">Hello {farmer?.name   || 'Loading...' }  ({ (user?.role.replace("ROLE_",""))})</h3>
<span>
  <button
    onClick={handleWorkerProfileCheck}
    disabled={checkingWages}
    className="text-blue-600 hover:underline disabled:opacity-50"
  >
    {checkingWages ? "Checking..." : "Worker Profile"}
  </button> (Register Worker)
</span>
            {farmer && (
              <div className="flex flex-col md:flex-row items-center gap-6 mt-6">
                <img
                  src={farmer?.images}
                  alt="Profile"
                  className="w-36 h-36 rounded-full border border-green-400 object-cover"
                />
                <div className="space-y-2 w-full">
                  <p>
                    <span className="font-semibold">Name:</span> {farmer.name}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span> {farmer.address || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Citizen No:</span> {farmer.citizenno || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {farmer.phone || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">House No:</span> {farmer.houseno || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Registration Date:</span> {farmer.register || 'N/A'}
                  </p>
                </div>
                <div className="space-y-2 w-full">
                  <p>
                    <span className="font-semibold">Facebook:</span> {farmer.facebook}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {farmer.email || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Points:</span> {farmer.rankPoints || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">ProductsType:</span> {farmer.productType || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">House No:</span> {farmer.houseno || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Total Revenue:</span> {farmer.product?.totalRevenue || 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 max-w-full flex flex-col gap-x-20 items-start px-4">
        <Card className="w-full items-center justify-center">
          <CardContent className="p-4">
            <nav>
              <ul className="flex space-x-28 mb-5">
                {['vehicles', 'products', 'wages'].map((tab) => (
                  <li key={tab}>
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`font-bold ${
                        activeTab === tab ? 'text-green-600 underline' : 'text-gray-600'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <hr className="mb-4" />

            {activeTab === 'vehicles' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Your Vehicles</h2>
                {vehicles.length === 0 ? (
                  <p>No vehicles found.</p>
                ) : (
                  <ul className="list-disc ml-6">
                    {vehicles.map((vehicle, idx) => (
                      <li key={idx}>
                        {vehicle.model} - {vehicle.plateNumber}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Your Products</h2>
                {products.length === 0 ? (
                  <p>No products found.</p>
                ) : (
                  <ul className="list-disc ml-6">
                    {products.map((product, idx) => (
                      <li key={idx}>
                        {product.name} - {product.price} Rs
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'wages' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Your Wages</h2>
                {wages.length === 0 ? (
                  <p>No wages found.</p>
                ) : (
                  <ul className="list-disc ml-6">
                    {wages.map((wage, idx) => (
                      <li key={idx}>
                        {wage.date} - {wage.amount} Rs
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Profile;
