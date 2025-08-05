import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { API_URL } from '../Config/api';
import { FormControl, MenuItem, Select } from '@mui/material';

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(20);
const [searchTerm, setSearchTerm] = useState('');
  const jwt = localStorage.getItem('jwt');
  const{farmer}=useSelector((state) => state.farmer);
  const navigate = useNavigate();
  const [hasFetched, setHasFetched] = useState(false);
  const [error,setError]=useState(null)

  const statusOptions = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ];
  const paymentOptions = ['CASH_IN_HAND', 'KHALTI'];

  const deliveryOptions = ['FARMER_DELIVERY', 'SELF_PICKUP'];
const farmerId = farmer?.id;
console.log("Farmer Id from Order "+farmerId);

useEffect(() => {
  if (!jwt || !farmerId) {
    navigate('/', { state: { message: 'Please login to access this page' } });
  }
}, [jwt, navigate]);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      
      const response = await axios.get(`${API_URL}/api/orders/farmer/${farmerId}`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      if (response.data && response.data.orders) {
        setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
      } else {
        setOrders([]);
      }
      
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error);
      
      toast.error(`Failed to fetch orders: ${error.response?.data?.message || error.message}`);
      setOrders([]);
    } finally {
      setLoading(false);
      setHasFetched(true);
    }
  };

  if (jwt && farmerId) {
    fetchOrders();
  } else {
    navigate('/', { state: { message: 'Please login to access this page' } });
  }
}, [jwt, farmerId, navigate]);

const filteredOrders = orders.filter(order => {
  const matchesSearch = 
    order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items?.some(item => 
      item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())||
  order.method?.toLowerCase().includes(searchTerm.toLowerCase());
  return matchesSearch;
});

const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);


  const handleStatusUpdate = async () => {
    try {
        const orderId = selectedOrder.id;
setLoading
      await axios.put(
        `${API_URL}/api/orders/${orderId}/status`,{},
        { 
            params:{
status:selectedStatus
            },
            headers: { Authorization: `Bearer ${jwt}` } }
      );
      setLoading(false);
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? { ...order, status: selectedStatus } : order
      ));
      toast.success('Order status updated successfully');
      setStatusModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

 const handlePaymentChange = async (orderId, newPaymentMethod) => {
    console.log('Changing to:', newPaymentMethod); // Debug log

    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/api/orders/${orderId}/method`,
        {},
        { 
          params: {
            paymentMethod:newPaymentMethod
          },
          headers: { Authorization: `Bearer ${jwt}` } 
        }
      );
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, method: newPaymentMethod } : order
      ));
      
      toast.success('Payment method updated successfully');
    } catch (error) {
      toast.error('Failed to update payment method');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeliveryTypeUpdate = async () => {
    try {
        setLoading
        const orderId = selectedOrder.id;
      await axios.put(
        `${API_URL}/api/orders/${orderId}/delivery`,
        { 
            params: {
                status:deliveryType
            },
            
            headers: { Authorization: `Bearer ${jwt}` } }
      );
      setLoading
      setOrders(orders.map(order => 
        order.id === selectedOrder.id ? { ...order, deliveryType: selectedDeliveryType } : order
      ));
      toast.success('Delivery type updated successfully');
      setDeliveryModalOpen(false);
    } catch (error) {
      toast.error('Failed to update delivery type');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryColor = (type) => {
    switch(type) {
      case 'FARMER_DELIVERY': return 'bg-indigo-100 text-indigo-800';
      case 'SELF_PICKUP': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
  if (hasFetched && (!orders || orders.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h1>
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Orders Found</h3>
          <p className="text-gray-500 mb-6">You don't have any orders yet. When you receive orders, they'll appear here.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Refresh Orders
          </button>
        </div>
      </div>
    );
  }
  if (error) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load orders. Please try again later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
  return (

    
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h1>
      <div className="relative w-64">
    <input
      type="text"
      placeholder="Search orders..."
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); 
      }}
    />
    <svg
      className="absolute right-3 top-3 h-5 w-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </div>
     <div className="text-sm text-gray-500 mb-4">
      Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredOrders.length)} of {filteredOrders.length} orders
    </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.user?.fullName}</div>
                    <div className="text-sm text-gray-500">{order.customer?.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.items?.length} items
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Details
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Rs. {order.total?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDeliveryColor(order.delievrType)}`}>
                      {order.delievrType?.replace(/_/g, ' ')}
                    </span>
                  </td>
  <td className="px-6 py-4 whitespace-nowrap">
  <FormControl fullWidth size="small">
    <Select
      value={order.method || ''}
      onChange={(e) => handlePaymentChange(order.id, e.target.value)}
      disabled={loading || ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status)}
      displayEmpty
      sx={{
        '& .MuiSelect-select': {
          cursor: (loading || ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status)) 
            ? 'not-allowed' 
            : 'pointer',
          padding: '8px 32px 8px 12px',
          opacity: ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status) ? 0.7 : 1
        }
      }}
    >
      <MenuItem value="" disabled>
        Select method
      </MenuItem>
      {paymentOptions.map((option) => (
        <MenuItem 
          key={option} 
          value={option}
          sx={{ 
            cursor: 'pointer',
            pointerEvents: ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status) 
              ? 'none' 
              : 'auto',
            opacity: ['OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status) 
              ? 0.5 
              : 1
          }}
        >
          {option.split('_').map(word => 
            word.charAt(0) + word.slice(1).toLowerCase()
          ).join(' ')}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.orderedAt).toLocaleDateString()}
                  </td>
                  <td className="px-7 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        
                        setSelectedOrder(order);
                        setStatusModalOpen(true);
                      }}
                      disabled={loading}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Update Status
                    </button>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setDeliveryModalOpen(true);
                      }}
                      className="text-green-600 hover:text-green-900"
                      disabled={loading}
                    >
                      Delivery Type
                    </button>

                     <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setDeliveryModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900 ml-2"
                    >
                      Delete Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-gray-800">Order #{selectedOrder.id}</h3>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Customer Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.user?.fullName}</p>
                    <p className="text-sm mt-1"><span className="font-medium">Phone:</span> {selectedOrder.user?.phone}</p>
                    <p className="text-sm mt-1"><span className="font-medium">Email:</span> {selectedOrder.user?.email || 'N/A'}</p>
                    <p className="text-sm mt-1"><span className="font-medium">Address:</span> {selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Order Summary</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm"><span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status?.replace(/_/g, ' ')}
                      </span>
                    </p>
                    <p className="text-sm mt-1"><span className="font-medium">Delivery:</span> 
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDeliveryColor(selectedOrder.deliveryType)}`}>
                        {selectedOrder.delievrType?.replace(/_/g, ' ')}
                      </span>
                    </p>
                    <p className="text-sm mt-1"><span className="font-medium">Date:</span> {new Date(selectedOrder.orderedAt).toLocaleString()}</p>
                    <p className="text-sm mt-1"><span className="font-medium">Total:</span> Rs. {selectedOrder.total?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-2">Order Items</h4>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items?.map(item => (
                        <tr key={item.id}>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full object-cover" src={item.product.image} alt={item.product.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                                <div className="text-sm text-gray-500">{item.product.category}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            Rs. {item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOrders.length > itemsPerPage && (
  <div className="flex justify-center mt-6">
    <nav className="inline-flex rounded-md shadow">
      <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${
            currentPage === page 
              ? 'bg-green-100 text-green-700' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  </div>
)}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setSelectedOrder(selectedOrder);
                    setStatusModalOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update Status
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(selectedOrder);
                    setDeliveryModalOpen(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Change Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Order Status</h3>
              
              <div className="space-y-4">
                {statusOptions.map(option => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`status-${option}`}
                      name="status"
                      type="radio"
                      checked={selectedStatus === option}
                      onChange={() => setSelectedStatus(option)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor={`status-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                      {option.replace(/_/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Type Modal */}
      {deliveryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update Delivery Type</h3>
              
              <div className="space-y-4">
                {deliveryOptions.map(option => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`delivery-${option}`}
                      name="delivery"
                      type="radio"
                      checked={selectedDeliveryType === option}
                      onChange={() => setSelectedDeliveryType(option)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor={`delivery-${option}`} className="ml-3 block text-sm font-medium text-gray-700">
                      {option.replace(/_/g, ' ')}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setDeliveryModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeliveryTypeUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Update Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;