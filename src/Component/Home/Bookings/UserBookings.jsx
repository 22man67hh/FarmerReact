import { useState, useEffect } from 'react';
import { 
  AccessTime as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Warning as ExclamationCircleIcon,
  LocationOn as MapPinIcon,
  Phone as PhoneIcon,
  Person as UserIcon 
} from '@mui/icons-material';
import { API_URL } from '@/Component/Config/api';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/animal/getAnimalBookings`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch bookings');
        
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Your Bookings</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your animal booking applications and their current status
          </p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">You haven't made any booking applications yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium text-blue-600 truncate mr-3">
                        {booking.animalName}
                      </h2>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                      <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                        <ClockIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {formatDate(booking.visitTime)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                        <span className="text-gray-900 font-medium">${booking.priceOffered.toFixed(2)}</span>
                        <span className="ml-1">offered</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Farmer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start">
                      <UserIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-700">{booking.farmerName}</span>
                    </div>
                    <div className="flex items-start">
                      <PhoneIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-700">{booking.farmerPhone}</span>
                    </div>
                    <div className="flex items-start">
                      <MapPinIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="ml-2 text-sm text-gray-700">{booking.farmerAddress}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserBookings;