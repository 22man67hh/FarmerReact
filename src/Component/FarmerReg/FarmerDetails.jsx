import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../Config/api';
import LeafletMap from '../Admin/LeafletMap';
import { Button, Dialog, Input } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getPendingVehicle } from '../State/Booking/BookingSlice';

const FarmerDetails = () => {
  const { state } = useLocation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [location, setLocation] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const [cart, setCart] = useState([]);

  const { user } = useSelector((state) => state.auth);
  const { booking } = useSelector((state) => state.booking);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const jwt = localStorage.getItem('jwt');
  const { slug } = useParams();
  const [checkingBooking, setCheckingBooking] = useState(false);

  const [activeTab, setActiveTab] = useState('Animal_Product');
  const [vehiclePage, setVehiclePage] = useState(1);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPerPage = 3;
  const [bookingForm, setBookingForm] = useState({
    startDateTime: '',
    endDateTime: '',
    description: '',
    contactNum: ''
  });

  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          params: {
            userId: user?.id
          }
        });
        console.log(response.data)
        if (response.data) {
          setCart(response.data.items || []);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    if (user?.id && jwt) {
      fetchCartItems();
    }
  }, [user?.id, jwt]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now - tzOffset).toISOString().slice(0, 16);
  };

  const tabs = [
    'Animal_Product',
    'Dairy_Product',
    'Animals',
    'Vehicles',
    'Field_Product',
    'Other_products',
  ];

  const updateCartItem = async (productId, newQuantity) => {
    try {
const data=   await axios.post(
    `${API_URL}/api/cart/add`,
        null,
        {
          params: {
            userId: user?.id,
            productId: productId,
            quantity: newQuantity
          },
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        },
        console.log("ProductId",productId),
        console.log("Quantity",newQuantity),
      );
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update item quantity');
      throw error; 
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartItem(productId, newQuantity);
      
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.product?.id === productId);
        
        if (existingItem) {
          return prevCart.map(item =>
            item.product?.id === productId 
              ? { ...item, quantity: newQuantity } 
              : item
          );
        } else {
          let product;
          const productTypes = ['animal', 'Dairy_Product', 'field', 'Other_Product'];
          productTypes.forEach(type => {
            const products = farmer.sellProducts?.filter(p => p.type === type);
            const foundProduct = products?.find(p => p.id === productId);
            if (foundProduct) product = foundProduct;
          });
          
          if (product) {
            return [...prevCart, { product, quantity: newQuantity }];
          }
          return prevCart;
        }
      });
    } catch (error) {
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/cart/remove`, {
        params: {
          userId: user?.id,
          productId: productId
        },
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      
      setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.productPrice * item.quantity);
    }, 0);
  };

  const handleAddToCart = async (product) => {
    try {
      const quantity = 1; 
      await updateCartItem(product.id, quantity);
      
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.product.id === product.id);
        if (existingItem) {
          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevCart, { product, quantity }];
        }
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
    }
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (selectedCoords) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${selectedCoords.lat}&lon=${selectedCoords.lng}`
          );
          const data = await res.json();
          if (data?.display_name) {
            setLocation(data.display_name || "Address not found");
          }
        } catch (error) {
          setLocation("Could not fetch address");
          console.error("Error fetching address:", error);
        }
      }
    };

    fetchAddress();
  }, [selectedCoords]);

  const handleMapPositionSelect = (pos) => {
    setSelectedCoords(pos);
    setMapOpen(false);
  };

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/farmer/slug/${slug}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
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

  const validateWorkingHours = (dateTime) => {
    if (!selectedVehicle) return true;
    
    const time = new Date(dateTime).getHours();
    const startHour = parseInt(selectedVehicle.startWorkTime.split(':')[0]);
    const endHour = parseInt(selectedVehicle.endWorkTime.split(':')[0]);
    
    return time >= startHour && time <= endHour;
  };

  useEffect(() => {
    dispatch(getPendingVehicle({ userId: user?.id }));
  }, [dispatch]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!farmer) return <div className="p-6 text-center text-red-500">Farmer not found.</div>;

  const paginatedVehicles = farmer.vehicles?.slice(
    (vehiclePage - 1) * itemsPerPage,
    vehiclePage * itemsPerPage
  );
  
  const handleBookVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    const hasPendingBooking = booking?.some(b => 
      b.vehicle?.id === vehicle.id &&
      b.status === 'PENDING' &&
      b.user?.id === user.id
    );
    
    if (hasPendingBooking) {
      navigate('/booking', {
        state: {
          booking: booking.find(b => b.vehicle?.id === vehicle.id),
          vehicle
        }
      });
    } else {
      setIsBookingModalOpen(true);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const bookingData = {
        vehicleId: selectedVehicle.id,
        userId: user?.id,
        location: {
          latitude: selectedCoords?.lat || 0,
          longitude: selectedCoords?.lng || 0,
          address: location
        },
        startTime: bookingForm.startDateTime,
        endTime: bookingForm.endDateTime,
        task: bookingForm.description
      };

      const response = await axios.post(`${API_URL}/api/vehicles/book`, bookingData, {
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess("Booking Request Sented successfully wait for the response from farmer.Thank You");
      setIsBookingModalOpen(false);
      if (response.data) {
        navigate("/");
      }
    } catch (error) {
      console.error('Booking failed:', error);
      if (error.response) {
        alert(error.response.data.message || "Booking failed");
      } else {
        alert("Network error. Please try again.");
      }
    }
  };

  const filterProductByType = (type) =>
    farmer.sellProducts?.filter((product) => product.type === type);

  const renderProductCard = (product) => {
    const cartItem = cart.find(item => item.product?.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    return (
      <div key={product.id} className="p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <img
          src={product.image}
          alt={product.name}
          className="w-40 h-40 object-cover rounded mt-2"
          loading="lazy"
        />
        <p>Price: Rs. {product.price}</p>
        <p>Description: {product.description}</p>
        
        <div className="flex items-center mt-2">
          <button 
            onClick={() => handleQuantityChange(product.id, quantity - 1)}
            className="px-3 py-1 bg-gray-200 rounded-l"
            disabled={quantity <= 1}
          >
            -
          </button>
          <span className="px-4 py-1 bg-gray-100">{quantity}</span>
          <button 
            onClick={() => handleQuantityChange(product.id, quantity + 1)}
            className="px-3 py-1 bg-gray-200 rounded-r"
          >
            +
          </button>
        </div>
        
        <button
          onClick={() => handleAddToCart(product)}
          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
        >
          {quantity > 0 ? 'Update Cart' : 'Add to Cart'}
        </button>
      </div>
    );
  };

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

      {cart.length > 0 && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Your Cart</h3>
          {cart.map(item => (
            <div key={item.product?.id} className="flex justify-between items-center mb-2">
              <div>
                <span>{item.productName} ({item.productPrice}) (x{item.quantity})</span>
                <span className="ml-2">Rs. {item.productPrice * item.quantity}</span>
              </div>
              <button 
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between mt-3 pt-2 border-t">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">Rs. {calculateTotal()}</span>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
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
          filterProductByType('animal')?.map(renderProductCard)}

        {activeTab === 'Dairy_Product' &&
          filterProductByType('Dairy_Product')?.map(renderProductCard)}

        {activeTab === 'Field_Product' &&
          filterProductByType('field')?.map(renderProductCard)}

        {activeTab === 'Other_products' &&
          filterProductByType('Other_Product')?.map(renderProductCard)}

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
              {paginatedVehicles?.map((vehicle, index) => { 
                const isPending = booking?.some(
                  b => b.vehicle?.id === vehicle.id && b.status === 'PENDING'
                );
                return (
                  <div key={index} className="border rounded-xl p-4 shadow hover:shadow-lg transition">
                    <img
                      src={vehicle.images}
                      alt={vehicle.vehicleName}
                      className="w-40 h-40 object-cover rounded mb-2"
                      loading="lazy"
                    />
                    <h4 className="text-lg font-bold">{vehicle.vehicleName}</h4>
                    <p>Type: {vehicle.type}</p>
                    <p>Rate: {vehicle.rentalPrice} /hr</p>
                    <p>Available Time: {vehicle.startWorkTime} to {vehicle.endWorkTime}</p>
                    <button
                      onClick={() => handleBookVehicle(vehicle)}
                      className={`mt-2 px-4 py-1 text-white rounded ${
                        isPending ? 'bg-yellow-500' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isPending ? 'View Booking' : 'Book Vehicle'}
                    </button>
                  </div>
                );
              })}
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

      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Book {selectedVehicle?.type}</h3>
            
            <form onSubmit={handleBookingSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Farmer</label>
                <input 
                  type="text" 
                  value={farmer.name} 
                  className="w-full p-2 border rounded" 
                  readOnly 
                />
              </div>

              {selectedCoords && (
                <p className="text-sm text-gray-700">
                  Selected Coords: {selectedCoords.lat.toFixed(5)}, {selectedCoords.lng.toFixed(5)}
                </p>
              )}

              <Input
                placeholder="Selected address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button variant="outline" onClick={() => setMapOpen(true)}>Pick Location on Map</Button>
              <Dialog open={mapOpen} onClose={() => setMapOpen(false)} fullWidth maxWidth="md">
                <div className="p-4">
                  <LeafletMap
                    setSelectedPosition={handleMapPositionSelect}
                  />
                </div>
              </Dialog>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  name="startDateTime"
                  value={bookingForm.startDateTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min={getCurrentDateTime()}
                  required
                />
                {bookingForm.startDateTime && new Date(bookingForm.startDateTime) < new Date() && (
                  <p className="text-red-500 text-sm mt-1">Start time cannot be in the past</p>
                )}
                {bookingForm.startDateTime && !validateWorkingHours(bookingForm.startDateTime) && (
                  <p className="text-red-500 text-sm mt-1">
                    Vehicle is only available between {selectedVehicle.startWorkTime} and {selectedVehicle.endWorkTime}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="endDateTime"
                  value={bookingForm.endDateTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  min={bookingForm.startDateTime || getCurrentDateTime()}
                  required
                />
                {bookingForm.endDateTime && 
                new Date(bookingForm.endDateTime) <= new Date(bookingForm.startDateTime) && (
                  <p className="text-red-500 text-sm mt-1">End time must be after start time</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="contactNum"
                  value={bookingForm.contactNum}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Task Description</label>
                <textarea
                  name="description"
                  value={bookingForm.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
   
    </div>
  );
};

export default FarmerDetails;