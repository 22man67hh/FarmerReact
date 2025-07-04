import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Config/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FarmerWorkRequests = () => {
    const {farmer}=useSelector((state)=>state.farmer)
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(`${API_URL}/api/wages/registered/Work`, {
          params: {
            id: farmer?.id
          },
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
      const response = await axios.get(`${API_URL}/api/dailywages/workrequest/application`, 
      {
        params: {
          workId: requestId,
          farmerId: farmer?.id
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
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
      await axios.patch(`${API_URL}/api/dailywages/workrequest/${workId}/deactivate`, {}, {
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

const handleApplicationAction = async (applicationId, action) => {
  try {
    const jwt = localStorage.getItem("jwt");
console.log("app Id",applicationId)
    await axios.put(`${API_URL}/api/dailywages/approveWorkss`, null, {
      params: {
        workId: applicationId
      },
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });

    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, status: action.toUpperCase() } : app
    ));
  } catch (err) {
    setError(err.response?.data?.message || `Failed to ${action} application`);
  }
};


  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-green-800 mb-6">My Work Requests</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                      <div className="font-medium text-gray-900">{request.taskType}</div>
                      <div className="text-sm text-gray-500">{request.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.workDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      NPR{request.wageOffered}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${request.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {request.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeactivate(request.id);
                        }}
                        disabled={request.status !== 'ACTIVE'}
                        className={`mr-2 ${request.status === 'ACTIVE' ? 'text-yellow-600 hover:text-yellow-900' : 'text-gray-400 cursor-not-allowed'}`}
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
              <div className="text-center py-8 text-gray-500">No work requests found</div>
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
                        <h4 className="font-medium">{application.worker.name}</h4>
                        <p className="text-sm text-gray-500">{application.worker.email}</p>
                        <p className="text-sm mt-1">{application.message}</p>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${application.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
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
                            handleApplicationAction(application.id, 'approve');
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplicationAction(application.id, 'reject');
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
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
                <p><span className="font-semibold">Name:</span> {selectedApplication.worker.name}</p>
                <p><span className="font-semibold">Email:</span> {selectedApplication.worker.email}</p>
                <p><span className="font-semibold">Phone:</span> {selectedApplication.worker.contact || 'Not provided'}</p>
                <p><span className="font-semibold">Address:</span> {selectedApplication.worker.address || 'Not provided'}</p>
                <p><span className="font-semibold">Experience:</span> {selectedApplication.worker.experience || 'Not specified'}</p>
                <p><span className="font-semibold">Skills:</span> {selectedApplication.worker.skills || 'Not specified'}</p>
                <p><span className="font-semibold">Rate:</span> {selectedApplication.worker.rateperday || 'Not specified'}</p>
                <p><span className="font-semibold">Application Message:</span> {selectedApplication.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerWorkRequests;