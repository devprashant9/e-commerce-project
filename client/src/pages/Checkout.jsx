import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { clearCart, updateItems, removeFromCart } from '../store/slices/cartSlice';
import { ShoppingBagIcon, CreditCardIcon, TruckIcon, UserIcon, PhoneIcon, MapPinIcon, EnvelopeIcon, BuildingOfficeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { showToast } from '../utils/toast';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { config } from '../config/env';

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddressChange = useCallback((e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const createOrder = useCallback(async (data, actions) => {
    try {
      // Validate address fields before creating PayPal order
      const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'pincode', 'phone'];
      const missingFields = requiredFields.filter(field => !address[field]);
      
      if (missingFields.length > 0) {
        showToast.error('Please fill in all required address fields');
        throw new Error('Please fill in all required address fields');
      }

      if (!token) {
        showToast.error('Please log in to continue');
        navigate('/login');
        throw new Error('Authentication required');
      }

      console.log('Creating PayPal order with data:', {
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalAmount
      });

      const response = await axios.post(
        `${config.API_URL}/payments/create-paypal-order`,
        { 
          items: items,
          totalAmount: totalAmount
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('PayPal order created successfully:', response.data);
      return response.data.id;
    } catch (error) {
      console.error('PayPal order creation error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      // Check for PayPal authentication errors
      if (error.response?.data?.error === 'invalid_client' || 
          error.response?.status === 401 ||
          error.message?.includes('Client Authentication failed')) {
        showToast.error('PayPal session expired. Please refresh the page and try again.');
        return;
      }

      showToast.error(error.response?.data?.message || error.message || 'Error creating PayPal order');
      throw error;
    }
  }, [token, totalAmount, items, address, navigate]);

  const onApprove = useCallback(async (data, actions) => {
    try {
        setLoading(true);
        console.log('Payment approved by user, capturing payment...', { orderID: data.orderID });

        // First capture the PayPal payment
        const captureResponse = await axios.post(
            `${config.API_URL}/payments/capture-paypal-payment`,
            { orderID: data.orderID },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (captureResponse.data) {
            console.log('Payment captured successfully, creating order...');

            // Then create the order in our database
            const orderResponse = await axios.post(
                `${config.API_URL}/orders`,
                {
                    items: items.map(item => ({
                        product: item._id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image
                    })),
                    shippingAddress: address,
                    totalAmount,
                    paymentMethod: 'paypal',
                    paymentId: data.orderID
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Order created successfully:', orderResponse.data);
            dispatch(clearCart());
            navigate('/orders');
            showToast.success('Payment successful! Order has been placed.');
        }
    } catch (error) {
        console.error('PayPal payment/order creation error:', error);
        
        // Check for PayPal session errors
        if (error.response?.data?.error === 'invalid_client' || 
            error.response?.status === 401 ||
            error.message?.includes('Client Authentication failed')) {
            showToast.error('PayPal session expired. Please refresh the page and try again.');
            return;
        }

        showToast.error(error.response?.data?.message || 'Error processing payment');
    } finally {
        setLoading(false);
    }
}, [token, address, items, totalAmount, dispatch, navigate]);

  const handleOrderCreation = useCallback(async (paymentMethod, paymentId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate address fields
      const requiredFields = ['fullName', 'addressLine1', 'city', 'state', 'pincode', 'phone'];
      const missingFields = requiredFields.filter(field => !address[field]);
      
      if (missingFields.length > 0) {
        throw new Error('Please fill in all required address fields');
      }

      // Validate phone number format
      if (!/^[0-9]{10}$/.test(address.phone)) {
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Validate pincode format
      if (!/^[0-9]{6}$/.test(address.pincode)) {
        throw new Error('Please enter a valid 6-digit pincode');
      }

      const orderItems = items.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }));

      await axios.post(
        `${config.API_URL}/orders`,
        {
          items: orderItems,
          shippingAddress: address,
          totalAmount,
          paymentMethod,
          paymentId
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      dispatch(clearCart());
      showToast.success('Order placed successfully! Thank you for shopping with us.');
      navigate('/orders');

    } catch (error) {
      console.error('Order creation error:', error);
      setError(error.message || 'Failed to create order');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [address, items, totalAmount, token, dispatch, navigate]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (paymentMethod === 'cod') {
      await handleOrderCreation('cod');
    }
  }, [paymentMethod, handleOrderCreation]);

  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    const updatedItems = items.map(item => 
      item._id === itemId ? { ...item, quantity: parseInt(newQuantity) } : item
    );
    dispatch(updateItems(updatedItems));
  }, [items, dispatch]);

  const handleRemoveItem = useCallback((itemId) => {
    dispatch(removeFromCart(itemId));
    showToast.success('Item removed from cart');
  }, [dispatch]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Add some items to your cart to proceed with checkout.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Address Form */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleAddressChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleAddressChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      required
                      pattern="[0-9]{6}"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      required
                      pattern="[0-9]{10}"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <label className="relative flex items-start cursor-pointer">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">PayPal</span>
                      <span className="block text-sm text-gray-500">Pay securely with PayPal</span>
                    </div>
                  </label>

                  <label className="relative flex items-start cursor-pointer">
                    <div className="flex items-center h-5">
                      <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3">
                      <span className="block text-sm font-medium text-gray-700">Cash on Delivery</span>
                      <span className="block text-sm text-gray-500">Pay when you receive your order</span>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === 'cod' && (
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 ease-in-out ${
                    loading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <TruckIcon className="w-5 h-5 mr-2" />
                      Place Order
                    </>
                  )}
                </button>
              )}

              {paymentMethod === 'paypal' && (
                <div className="mt-6">
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={(err) => {
                      console.error('PayPal Error:', err);
                      showToast.error('PayPal encountered an error. Please try again.');
                    }}
                    style={{ layout: 'horizontal', color: 'blue', shape: 'rect', label: 'pay' }}
                  />
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flow-root">
                <ul className="-my-6 divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item._id} className="py-6 flex space-x-6">
                      <img
                        src={item.image.startsWith('http') ? item.image : `${config.API_URL}/uploads/${item.image}`}
                        alt={item.name}
                        className="h-24 w-24 flex-none rounded-lg bg-gray-100 object-cover object-center"
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                          e.target.onerror = null;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <div className="mt-2 flex items-center space-x-4">
                          <div className="flex items-center">
                            <label htmlFor={`quantity-${item._id}`} className="sr-only">Quantity</label>
                            <select
                              id={`quantity-${item._id}`}
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                              className="rounded-md border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-150"
                            title="Remove item"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;