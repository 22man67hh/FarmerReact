import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Config/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const FarmerAnimalRequest = () => {
    const {farmer}=useSelector((state)=>state.farmer)
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if (!farmer) {
      navigate('/account/login');
    }
  }, [farmer, navigate]  
  )
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(`${API_URL}/api/animal/animals/requests`, {
      
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        });
        console.log(response.data)
        setRequests(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [farmer?.id]); 

  const fetchApplications = async (requestId) => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(`${API_URL}/api/animalBookings/animal/booking`, 
      {
        params: {
          animalId: requestId,
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      setApplications(response.data);
      console.log(response.data)
      setSelectedRequest(requestId);
      setSelectedApplication(null); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    }
  };
        console.log(selectedApplication)


  const handleDeactivate = async (workId) => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.patch(`${API_URL}/deactive/animal`, {}, {
        params:{
          sellAnimalId: workId

        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.map(req => 
        req.id === workId ? { ...req, isActive: false } : req
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate request');
    }
  };

  const handleDelete = async (workId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`${API_URL}/api/dailywages/workrequest/${workId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(req => req.id !== workId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete request');
    }
  };

const handleApplicationAction = async (bookingId, action) => {
  try {
    const jwt = localStorage.getItem("jwt");
    const status = action.toUpperCase(); 

    await axios.put(`${API_URL}/api/animalBookings/approve/sellanimal`, null, {
      params: {
        bookingId: bookingId,
        status: status
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
    toast.success(`Booking ${action} successfully!`);
    setSelectedApplication(null);
  } catch (err) {
    setError(err.response?.data?.message || `Failed to ${action} booking`);
  }
};


  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Active Animals</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Requests List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-y-auto max-h-64 ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calves</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Milk Per Day</th>


                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr 
                    key={request.id} 
                    className={`hover:bg-gray-50 cursor-pointer ${selectedRequest === request.id ? 'bg-blue-50' : ''}`}
                    onClick={() => fetchApplications(request.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{request.animalName}</div>
                      {/* <div className="text-sm text-gray-500">{request.location}</div> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
{request.calves ? request.calves : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.description}
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.location?.address.split(',').slice(2, 4).join(', ') || 'N/A'}
                    </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
{request?.price}                    </td>
     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
{request?.milkPerDay} /Ltr                   </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.available ? (                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        bg-green-100 text-green-800">
                        Active
                      </span>) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        bg-red-100 text-red-800">
                        Inactive
                      </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeactivate(request.id);
                        }}
                        disabled={request.approve }
                        className={`mr-2 ${request.status ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 cursor-not-allowed'}`}
                      >
                        Deactivate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(request.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && (
              <div className="text-center py-8 text-gray-500">No Animal Booking found</div>
            )}
          </div>
        </div>

        {/* Applications Panel */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedRequest ? 'Applications' : 'Select a request to view applications'}
            </h3>
          </div>
          
          {selectedRequest ? (
            applications.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {applications.map((application) => (
                  <div 
                    key={application.id} 
                    className={`p-4 cursor-pointer ${selectedApplication?.id === application.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedApplication(application)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{application?.bookername}</h4>
               <span className={
  application?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
  application?.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
  application?.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
  'bg-gray-100 text-gray-800' 
}>
  {application?.status}
</span>
                        <p className="text-sm text-gray-500">{application?.email}</p>
                        <p className="text-sm mt-1">{application?.priceOffered}</p>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${application.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                          application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'}`}>
                        {application.status}
                      </span>
                    </div>
                    {application.status === 'PENDING' && (
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplicationAction(application.bookingId, 'accepted');
                            // console.log(application.bookingId)
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          disabled={application.status !== 'PENDING'}
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplicationAction(application.bookingId, 'rejected');
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          disabled={application.status !== 'PENDING'}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No applications for this request</div>
            )
          ) : (
            <div className="text-center py-8 text-gray-500">Select a request to view applications</div>
          )}

          {/* Worker Details Section */}
          {selectedApplication && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <h4 className="font-bold text-lg mb-3">Worker Details</h4>
              <div className="space-y-2">
                <p><span className="font-semibold">Name:</span> {selectedApplication?.bookername}</p>
                <p><span className="font-semibold">Email:</span> {selectedApplication?.email}</p>
                <p><span className="font-semibold">Phone:</span> {selectedApplication?.contact || 'Not provided'}</p>
                <p><span className="font-semibold">Address:</span> {selectedApplication?.worker?.address || 'Not provided'}</p>
                <p><span className="font-semibold">Price Offered:</span> {selectedApplication?.priceOffered || 'Not specified'}</p>
                <p><span className="font-semibold">Special Message:</span> {selectedApplication?.specialMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerAnimalRequest;