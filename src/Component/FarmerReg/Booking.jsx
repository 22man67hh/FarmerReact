import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getPendingVehicle } from '../State/Booking/BookingSlice';

const Booking = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { booking: initialBooking, vehicle } = state || {};
  const { user } = useSelector((state) => state.auth);
  const { bookings, isLoading } = useSelector((state) => state.booking);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (user?.id) {
      dispatch(
        getPendingVehicle({
          userId: user.id,
          bookingStatus: statusFilter === 'PENDING' ? null : statusFilter,
        })
      );
    }
  }, [dispatch, user?.id, statusFilter]);

  if (!initialBooking && (!bookings || bookings.length === 0)) {
    return <div className="p-6 text-center">No booking information found</div>;
  }

  const currentBooking =
    (bookings || []).find((b) => b.id === initialBooking?.id) || initialBooking;

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'ACCEPTED':
        return 'text-green-600';
      case 'COMPLETED':
        return 'text-blue-600';
      case 'CANCELLED':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Booking Details</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Filter Bookings</h3>
        <div className="flex flex-wrap gap-4">
          {['ALL', 'PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED'].map((status) => (
            <label key={status} className="flex items-center space-x-2">
              <input
                type="radio"
                name="bookingStatus"
                value={status}
                checked={statusFilter === status}
                onChange={() => setStatusFilter(status)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-700">
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Current Booking Card */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold">
              {vehicle?.type || currentBooking?.vehicle?.type || 'Unknown Vehicle'}
            </h3>
            <p>
              Status:
              <span className={`ml-2 ${getStatusClass(currentBooking?.status)}`}>
                {currentBooking?.status || 'N/A'}
              </span>
            </p>
            <p>
              Start Time:{' '}
              {currentBooking?.startTime
                ? new Date(currentBooking.startTime).toLocaleString()
                : 'N/A'}
            </p>
            <p>
              End Time:{' '}
              {currentBooking?.endTime
                ? new Date(currentBooking.endTime).toLocaleString()
                : 'N/A'}
            </p>
            <p>Task: {currentBooking?.task || 'N/A'}</p>
          </div>

          {/* Booking List */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {statusFilter === 'ALL'
                ? 'All'
                : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1).toLowerCase()}{' '}
              Bookings
            </h3>
            <div className="space-y-4">
              {(bookings || [])
                .filter((b) => statusFilter === 'ALL' || b.status === statusFilter)
                .map((booking) => (
                  <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{booking.vehicle?.type || 'Unknown'}</p>
                        <p className={`text-sm ${getStatusClass(booking.status)}`}>
                          {booking.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {booking.startTime
                            ? new Date(booking.startTime).toLocaleDateString()
                            : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          to{' '}
                          {booking.endTime
                            ? new Date(booking.endTime).toLocaleDateString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {booking.task && (
                      <p className="mt-2 text-sm text-gray-700">{booking.task}</p>
                    )}
                    <button className='flex ring px-3 py-4 rounded-2xl mt-3 text-red-800'>Cancel Booking</button>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Booking;
