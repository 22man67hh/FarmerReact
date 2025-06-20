import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '@/Component/Config/api';
import axios from 'axios';

const FarmerDeta = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Animal_Product');
  const [activeSubTab, setActiveSubTab] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processing, setProcessing] = useState(false);
   const [chatModalOpen, setChatModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const tabs = [
    { name: 'Animal_Product', label: 'Animal Products' },
    { name: 'Dairy_Product', label: 'Dairy Products' },
    { name: 'Field_Product', label: 'Field Products' },
    { name: 'Other_products', label: 'Other Products' },
    { 
      name: 'Animals', 
      label: 'Animals',
      type: 'animals' 
    },
    { 
      name: 'Vehicles', 
      label: 'Vehicles',
      type: 'vehicles' 
    },
    {
      name: 'Applications',
      label: 'Applications',
      subcategories: [
        { name: 'Animals', type: 'pendingAnimals' },
        { name: 'Vehicles', type: 'pendingVehicles' }
      ]
    }
  ];

  useEffect(() => {
    const fetchFarmerDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/adgetFarmer/${slug}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        setFarmer(response.data);
        console.log(response.data)
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerDetails();
  }, [slug]);

 const handleSendMessage = async () => {
    try {
      setProcessing(true);
      await axios.post(
        `${API_URL}/api/admin/send-message`,
        {
          farmerId: farmer.id,
          message: message,
          applicationId: selectedApp?.id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        }
      );
      setChatModalOpen(false);
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setProcessing(false);
    }
  };

 const handleApproveReject = async (status) => {
    try {
      setProcessing(true);
      const endpoint=activeSubTab=='Animals'
      ?  `${API_URL}/api/admin/updateAnimals/${selectedApp.id}` : `${API_URL}/api/admin/updateVehicle/${selectedApp.id}`;

      await axios.put(
        endpoint,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        }
      );

        const updatedFarmer = { ...farmer };
      const appType = activeSubTab === 'Animals' ? 'pendingAnimals' : 'pendingVehicles';
      updatedFarmer[appType] = updatedFarmer[appType].filter(app => app.id !== selectedApp.id);
      
      setFarmer(updatedFarmer);
      setSelectedApp(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setProcessing(false);
    }
  };

  

  const renderProducts = (products) => {
    if (!products || products.length === 0) {
      return <p className="text-gray-500 p-4">No items available</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {products.map((item, index) => (
          <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
              )}
              <h4 className="font-medium text-lg">{item.name || item.type}</h4>
              {item.price && (
                <p className="text-green-600 mt-1">Rs. {item.price}</p>
              )}
              {/* {item.quantity && (
                <p className="text-gray-600 text-sm mt-1">Available: {item.quantity}</p>
              )} */}
              {item.model && (
                <p className="text-gray-600 text-sm">Model: {item.model}</p>
              )}
              {item.registration && (
                <p className="text-gray-600 text-sm">Reg: {item.registration}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

const renderApplicationDetailModal = () => {
    if (!selectedApp) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">
                {selectedApp.animalName || selectedApp.vehicleType} Application
              </h3>
           <button 
                onClick={() => {
                  setSelectedApp(null);
                  setChatModalOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Application Details</h4>
                <div className="space-y-2">
                  <DetailItem label="Type" value={activeSubTab} />
                  <DetailItem label="Applied On" value={new Date(selectedApp.appDate).toLocaleDateString()} />
                  <DetailItem label="Status" value={selectedApp.status} />
                  {selectedApp.price && (
                    <DetailItem label="Amount" value={`Rs. ${selectedApp.price}`} />
                  )}
                  {selectedApp.animalName && (
                    <DetailItem label="Animal Name" value={selectedApp.animalName} />
                  )}
                  {selectedApp.gender && (
                    <DetailItem label="Gender" value={selectedApp.gender}/>
                  )}
                  {selectedApp.calves && (
                    <DetailItem label="Calves" value={selectedApp.calves} />
                  )}
                  {selectedApp.produceMilk && (
                    <DetailItem label="Produce Milk" value={selectedApp.produceMilk} />
                  )}
                  {selectedApp.milkPerDay && (
                    <DetailItem label="Milk Per Day" value={selectedApp.milkPerDay} />
                  )}
                  {selectedApp.model && (
                    <DetailItem label="Model" value={selectedApp.model} />
                  )}
                  {selectedApp.type && (
                    <DetailItem label="Name" value={selectedApp.type} />
                  )}
                  {selectedApp.registration && (
                    <DetailItem label="Reg No" value={selectedApp.registration} />
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Additional Information</h4>
                {selectedApp.images && (
                  <img 
                    src={selectedApp.images} 
                    alt="Application" 
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                {selectedApp.image && (
                  <img 
                    src={selectedApp.image} 
                    alt="Application" 
                    className="w-40 h-40 object-cover rounded-md mb-3"
                  />
                )}
                {selectedApp.description && (
                  <p className="text-gray-700">{selectedApp.description}</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-3">Admin Actions</h4>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handleApproveReject('Approved')}
                  disabled={processing}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-300 flex-1"
                >
                  {processing ? 'Processing...' : 'Approve Application'}
                </button>
                <button
                  onClick={() => handleApproveReject('Rejected')}
                  disabled={processing}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300 flex-1"
                >
                  {processing ? 'Processing...' : 'Reject Application'}
                </button>
              <button
  onClick={() => navigate(`/messages/${farmer.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-1"
                >
                  Chat With Farmer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

const renderChatModal = () => {
    if (!chatModalOpen || !selectedApp) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">
                Message to {farmer.name}
              </h3>
              <button 
                onClick={() => setChatModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Message:</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg p-3"
                rows="4"
                placeholder={`Regarding ${selectedApp.animalName || selectedApp.vehicleType} application...`}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setChatModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
  onClick={() => navigate(`/messages/${farmer.id}`)}
                disabled={!message || processing}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              >
                {processing ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const renderApplications = (applications) => {
    if (!applications || applications.length === 0) {
      return <p className="text-gray-500 p-4">No applications available</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {applications.map((app, index) => (
          <div 
            key={index} 
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedApp(app)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{app.animalName || app.vehicleType}</h4>
                <p className="text-sm text-gray-600">
                  Applied: {new Date(app.applicationDate).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {app.status}
              </span>
            </div>
            
            {app.images && (
              <img 
                src={app.images} 
                alt="Application" 
                className="w-full h-32 object-cover rounded-md mt-3"
              />
            )}
            
            <div className="mt-3 flex justify-between items-center">
              {app.price && (
                <span className="text-green-600 font-medium">Rs. {app.price}</span>
              )}
              <button 
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedApp(app);
                }}
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };


  const renderTabContent = () => {
    if (!farmer) return null;

    // Handle application sub-tabs
    if (activeTab === 'Applications') {
      const apps = activeSubTab === 'Animals' 
        ? farmer.pendingAnimals || []
        : farmer.pendingVehicles || [];
      
      return renderApplications(apps);
    }

    switch (activeTab) {
      case 'Animal_Product':
        return renderProducts(
          farmer.sellProducts?.filter(p => p.type === "Animal_Product")
        );
      case 'Dairy_Product':
        return renderProducts(
          farmer.sellProducts?.filter(p => p.type === "Dairy_Product")
        );
      case 'Field_Product':
        return renderProducts(
          farmer.sellProducts?.filter(p => p.type === "Field_Product")
        );
      case 'Other_products':
        return renderProducts(
          farmer.sellProducts?.filter(p => p.type === "Other_products")
        );
      case 'Animals':
        return renderProducts(farmer.sellAnimals || []);
      case 'Vehicles':
        return renderProducts(farmer.vehicles || []);
      default:
        return (
          <div className="p-4">
            <p>Select a category to view content</p>
          </div>
        );
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg mx-4 my-6">
      Error: {error}
    </div>
  );

  if (!farmer) return (
    <div className="p-4 text-gray-600 text-center">
      Farmer not found
    </div>
  );

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Farmers List
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-green-600 p-4 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{farmer.name}</h1>
              <p className="text-green-100">{farmer.displayname}</p>
            </div>
            <div className="mt-2 md:mt-0 flex space-x-2">
              <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm">
                Rating: {farmer.rankPoints || 0}
              </span>
              {farmer.verified && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 p-4 md:p-6">
          <div className="md:col-span-1">
            <img 
              src={farmer.images} 
              alt={farmer.name} 
              className="w-full h-auto rounded-lg border border-gray-200"
            />
            <div className="mt-4 space-y-2">
              <DetailItem label="Member Since" value={new Date(farmer.register).toLocaleDateString()} />
              <DetailItem label="Contact" value={farmer.phone} />
              <DetailItem label="Email" value={farmer.email} />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem label="Citizen Number" value={farmer.citizenno} />
              <DetailItem label="House No" value={farmer.houseno} />
              <DetailItem label="Facebook" value={farmer.facebook} />
              <DetailItem label="Address" value={farmer.loction?.address} fullWidth />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <div key={tab.name} className="relative flex-shrink-0">
                <button
                  onClick={() => {
                    setActiveTab(tab.name);
                    setActiveSubTab(tab.subcategories?.[0]?.name || null);
                  }}
                  className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.name
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>

                {tab.subcategories && activeTab === tab.name && (
                  <div className="absolute left-0 right-0 flex justify-center space-x-2 mt-1 bg-white px-2 py-1">
                    {tab.subcategories.map((sub) => (
                      <button
                        key={sub.name}
                        onClick={() => setActiveSubTab(sub.name)}
                        className={`px-3 py-1 rounded-full text-xs ${
                          activeSubTab === sub.name
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

{renderApplicationDetailModal()}
 {renderChatModal()}
        <div className="p-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => navigate(`/messages/${farmer.id}`)}
          >
            Send Message
          </button>
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            onClick={() => navigate(`/farmer/${slug}/edit`)} 
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? 'col-span-2' : ''}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-gray-800 break-words">
      {value || <span className="text-gray-400">Not provided</span>}
    </p>
  </div>
);

export default FarmerDeta;