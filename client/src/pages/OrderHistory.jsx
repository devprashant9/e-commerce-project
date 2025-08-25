import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { ShoppingBagIcon, TruckIcon } from '@heroicons/react/24/outline';
import { config } from '../config/env';
import { fetchUserOrders } from '../store/slices/orderSlice';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
     
      dispatch(fetchUserOrders());
    } else {
      console.log('No token available, skipping order fetch');
    }
  }, [dispatch, token]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

 

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    console.error('Showing error state:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading orders: {error}</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
   
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">No orders yet</h2>
          <p className="mt-2 text-gray-600">Start shopping to create your first order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Order History</h1>
      
      {/* Debug info */}
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <p>Total Orders: {orders.length}</p>
        <p>Order Statuses: {orders.map(order => order.status).join(', ')}</p>
      </div>

      <div className="space-y-8">
        {orders.map((order, index) => {
          
          return (
            <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Order placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Order ID: {order._id}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="space-y-4">
                  {order.items && order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center space-x-4 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-150"
                    >
                      <img
                        src={item.image.startsWith('http') ? item.image : `${config.API_URL}/uploads/${item.image}`}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                          e.target.onerror = null;
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Payment Method: {' '}
                        <span className="font-medium">
                          {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'PayPal'}
                        </span>
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Shipping Address:</p>
                        <p>{order.shippingAddress.fullName}</p>
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p>Phone: {order.shippingAddress.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">Total: ₹{order.totalAmount.toFixed(2)}</p>
                      {order.status === 'shipped' && (
                        <div className="mt-2 flex items-center justify-end text-sm text-green-600">
                          <TruckIcon className="h-5 w-5 mr-1" />
                          <span>Out for delivery</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory; 