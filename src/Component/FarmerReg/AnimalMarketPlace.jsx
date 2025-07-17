import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaShoppingCart, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPenFancy } from 'react-icons/fa';
import { API_URL } from '../Config/api';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AnimalMarketplace = () => {
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const { user, jwt } = useSelector((state) => state.auth);
  const [animals, setAnimals] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [isOfferTime, setIsOfferTime] = useState(false);
  const {farmer}= useSelector((state) => state.farmer);
  const navigate = useNavigate();
  const [offerData, setOfferData] = useState({
    visitTime: '',
    priceOffered: '',
    specialRequests: ''
  });

  useEffect(() => {
    const currentHour = new Date().getHours();
    setIsOfferTime(currentHour >= 7 && currentHour < 20);
  }, []);

  if (!user) {
    return <Navigate to="/" state={{ message: "Please login to access the marketplace." }} replace />;
  }

useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/animalBookings/animal/market`, {
          headers: {
            Authorization: `Bearer ${jwt}`  
          }
        });
        setAnimals(response.data);
        console.log('Fetched wishlist:', response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchAnimals();
  }, [jwt]);


  const handleSubmitOffer = async () => {
    if (!offerData.visitTime || !offerData.priceOffered) {
      alert('Please fill in all required fields');
      return;
    }

    const minPrice = selectedAnimal.price * 0.10;
    const maxPrice = selectedAnimal.price * 1.12;
    const offeredPrice = parseFloat(offerData.priceOffered);

    if (offeredPrice < minPrice || offeredPrice > maxPrice) {
      alert(`Offer price must be between $${minPrice.toFixed(2)} and $${maxPrice.toFixed(2)}`);
      return;
    }

    const selectedTime = new Date(offerData.visitTime);
    const hours = selectedTime.getHours();
    
    if (hours < 8 || hours >= 17) {
      alert('Visits are only allowed between 8 AM and 5 PM');
      return;
    }

    try {
      const bookingData = {
        animalId: selectedAnimal.id,
        userId: user?.id,
        visitTime: offerData.visitTime,
        priceOffered: offeredPrice,
        specialRequests: offerData.specialRequests
      };

      console.log('Submitting offer:', bookingData);
      await axios.post(`${API_URL}/api/animalBookings`, bookingData, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      
      alert('Offer submitted successfully!');
      setShowOfferModal(false);
    } catch (error) {
    console.error('Error submitting offer:', error);
  
  const errorMessage = error.response?.data?.message 
    || error.response?.data?.error 
    || error.message 
    || 'Failed to submit offer. Please try again.';
  
  alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {['all', 'cow', 'buffalo'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full capitalize ${activeTab === tab ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Animal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {animals.map((animal) => (
            <div 
              key={animal.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedAnimal(animal)}
            >
              <div className="relative">
                <img 
                  src={animal?.image} 
                  alt={animal?.name}
                  className="w-full h-48 object-cover"
                />
                {/* <button 
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(animal.id);
                  }}
                >
                  {wishlist.includes(animal.id) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-400" />
                  )}
                </button> */}
                <div className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm">
                  ${animal.price}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{animal?.animalName}</h3>
                <p className="text-gray-600 text-sm mb-2">{animal?.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="mr-1" />
                  <span>{animal?.location.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Animal Detail Modal */}
      {selectedAnimal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow z-10"
                onClick={() => setSelectedAnimal(null)}
              >
                &times;
              </button>
              
              {/* Gallery */}
              <div className="h-64 bg-gray-200 relative">
                {selectedAnimal.video ? (
                  <iframe
                    src={selectedAnimal?.video}
                    className="w-full h-full object-cover"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img 
                    src={selectedAnimal?.image} 
                    alt={selectedAnimal.animalName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAnimal?.animalName}</h2>
                    <p className="text-gray-600">{selectedAnimal.breed}</p>
                  </div>
                  <span className="text-xl font-bold text-green-600">${selectedAnimal.price}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Details</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Age:</span>
                        <span>{selectedAnimal.age}</span>
                      </li>
                         <li className="flex justify-between">
                        <span className="text-gray-600">Produce Milk:</span>
                        <span>{selectedAnimal.produceMilk ? (<p className='text-green-500'>True</p>):(<p className='text-red-300'>No</p>)}</span>
                      </li>

                      
                         <li className="flex justify-between">
                        <span className="text-gray-600"> Milk Per Day :</span>
                         <span>{selectedAnimal.milkPerDay} /Ltr</span>

                      </li>

                         <li className="flex justify-between">
                        <span className="text-gray-600"> Calves :</span>
                         <span>{selectedAnimal.calves}</span>

                      </li>
                      {/* <li className="flex justify-between">
                        <span className="text-gray-600">Health Status:</span>
                        <span className="text-green-600">Vaccinated</span>
                      </li> */}
                      <li className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {selectedAnimal.location.address}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Farmer Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{selectedAnimal.farmer?.name}</p>
                      <div className="flex items-center mt-1 mb-3">
                      <label htmlFor="">Points: </label>
                        <span className="ml-1 text-sm text-gray-600">{selectedAnimal.farmer.rankPoints}</span>
                      </div>
                      <div className="space-y-2">
                        <a href={`tel:${selectedAnimal.farmer.contact}`} className="flex items-center text-blue-600">
                          <FaPhone className="mr-2" />
                          {selectedAnimal.farmer.contactNumber}
                        </a>
                        <button className="flex items-center text-green-600"
                                    onClick={() => navigate(`/messages/${farmer.id}`)}

                        >
                          <FaEnvelope className="mr-2" />
                          Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedAnimal.description}</p>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition flex items-center justify-center 
                      ${isOfferTime ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    onClick={() => {
                      const now = new Date();
                      const currentHour = now.getHours();
                      
                      if (currentHour >= 7 && currentHour < 20) {
                        const defaultTime = new Date();
                        
                        if (currentHour >= 17) {
                          defaultTime.setDate(defaultTime.getDate() + 1);
                          defaultTime.setHours(8, 0, 0, 0);
                        } else {
                          const minHour = Math.max(now.getHours() + 1, 8);
                          defaultTime.setHours(minHour, 0, 0, 0);
                        }
                        
                        setOfferData({
                          visitTime: defaultTime.toISOString().slice(0, 16),
                          priceOffered: selectedAnimal.price,
                          specialRequests: ''
                        });
                        setShowOfferModal(true);
                      } else {
                        const nextAvailable = currentHour < 7 
                          ? `7 AM today` 
                          : `7 AM tomorrow`;
                        alert(`Offers can only be made between 7 AM - 8 PM. Next available at ${nextAvailable}`);
                      }
                    }}
                  >
                    <FaPenFancy className="mr-2" />
                    {isOfferTime ? 'Make an Offer' : 'Offers (7AM-8PM)'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offer Modal */}
      {showOfferModal && selectedAnimal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Make an Offer for {selectedAnimal.name}</h3>
              <button 
                onClick={() => setShowOfferModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mt-1 mb-3">
                  Available: Today to {(() => {
                    const maxDate = new Date();
                    maxDate.setDate(maxDate.getDate() + 3);
                    return maxDate.toLocaleDateString();
                  })()} | 8 AM - 5 PM only
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proposed Visit Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded-md"
                  value={offerData.visitTime}
                  onChange={(e) => {
                    const selectedDateTime = new Date(e.target.value);
                    const hours = selectedDateTime.getHours();
                    
                    if (hours < 8 || hours >= 17) {
                      alert('Visits are only allowed between 8 AM and 5 PM');
                      return;
                    }
                    
                    setOfferData({...offerData, visitTime: e.target.value});
                  }}
                  min={(() => {
                    const minDate = new Date();
                    if (minDate.getHours() >= 17) {
                      minDate.setDate(minDate.getDate() + 1);
                      minDate.setHours(8, 0, 0, 0);
                    } else {
                      const minHour = Math.max(minDate.getHours() + 1, 8);
                      minDate.setHours(minHour, 0, 0, 0);
                    }
                    return minDate.toISOString().slice(0, 16);
                  })()}
                  max={(() => {
                    const maxDate = new Date();
                    maxDate.setDate(maxDate.getDate() + 3); 
                    maxDate.setHours(17, 0, 0, 0);
                    return maxDate.toISOString().slice(0, 16);
                  })()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Offer Price (NPR{selectedAnimal.price * 0.10} - NPR{selectedAnimal.price * 1.12})
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md"
                  value={offerData.priceOffered}
                  onChange={(e) => setOfferData({...offerData, priceOffered: e.target.value})}
                  min={selectedAnimal.price * 0.10}
                  max={selectedAnimal.price * 1.12}
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be between 10% and 12% of the listed price
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows="3"
                  value={offerData.specialRequests}
                  onChange={(e) => setOfferData({...offerData, specialRequests: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitOffer}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Submit Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalMarketplace;