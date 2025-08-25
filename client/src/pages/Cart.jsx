import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateItems, removeFromCart } from '../store/slices/cartSlice';
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleQuantityChange = (item, newQuantity) => {
    const updatedItems = items.map(i =>
      i._id === item._id ? { ...i, quantity: newQuantity } : i
    );
    dispatch(updateItems(updatedItems));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item._id} className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                        e.target.onerror = null;
                      }}
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                        <p className="text-base font-medium text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <select
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                            className="block w-20 py-2 pl-3 pr-8 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            {[...Array(10)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                        {item.quantity > item.stock && (
                          <p className="text-sm text-red-600">
                            Only {item.stock} units available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            </div>
            <div className="px-6 py-4">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>₹{totalAmount.toFixed(2)}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6">
                <Link
                  to="/checkout"
                  className={`block w-full py-3 px-4 rounded-md shadow-sm text-center text-white text-sm font-medium ${
                    items.some(item => item.quantity > item.stock)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  onClick={(e) => {
                    if (items.some(item => item.quantity > item.stock)) {
                      e.preventDefault();
                    }
                  }}
                >
                  {items.some(item => item.quantity > item.stock)
                    ? 'Some items exceed available stock'
                    : 'Proceed to Checkout'
                  }
                </Link>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 