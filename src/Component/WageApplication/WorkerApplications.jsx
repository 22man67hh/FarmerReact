import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../Config/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWagesProfile } from '../State/Wages/Wages';

const WorkerApplications = () => {
      const { user } = useSelector((state) => state.auth);

const { worker } = useSelector((state) => state.wage || {});
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(5);
  const navigate = useNavigate();
  const dispatch=useDispatch();


  console.log("user",user)
const jwt = localStorage.getItem("jwt");

useEffect(() => {
  if (!jwt) {
    navigate("/", { state: { message: "Please Login to access application" } });
    return; 
  }

  if (user?.id) {
    dispatch(getWagesProfile({ userId: user?.id }));
  }
}, [dispatch, jwt, user]);



useEffect(() => {
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(`${API_URL}/api/dailywages/my-wagesApplication`, {
        params: {
          workerId: worker?.id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(response.data);
      console.log(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };
  fetchApplications();
}, []);

  // Pagination logic
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = applications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(applications.length / applicationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusColor = (status) => {
    switch(status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Work Applications</h1>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {applications.length} Applications
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {currentApplications.length > 0 ? (
              currentApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {application.request?.farmer?.name.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{application.request?.taskType}</h3>
                          <p className="text-sm text-gray-500">
                            Farmer: {application.request?.farmer?.displayname} • {application.workRequest?.location?.address}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Applied on/Booked on {new Date(application.bookedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-4 flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                      <p className="mt-2 text-lg font-semibold text-gray-900">
                        NPR {application.request?.wageOffered}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(application.request?.workDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Your Message:</span> {application.message || 'No message provided'}
                    </p>
                  </div>
                  
                  {application.status === 'CONFIRMED' && (
                    <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            Your application has been approved! Contact the farmer at {application.request?.farmer?.phone || 'the provided number'} to arrange the work details.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't applied to any work requests yet.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/wages')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Browse Available Works
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {applications.length > applicationsPerPage && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstApplication + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastApplication, applications.length)}
                    </span>{' '}
                    of <span className="font-medium">{applications.length}</span> applications
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number
                            ? 'z-10 bg-green-50 border-green-500 text-green-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerApplications;