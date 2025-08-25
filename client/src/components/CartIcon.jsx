import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import { useState, useEffect, useRef, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from '@headlessui/react';

const CartIcon = () => {
  const cart = useSelector((state) => state.cart || {});
  const { items = [], totalQuantity = 0, totalAmount = 0 } = cart;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingBagIcon className="h-6 w-6" />
        {totalQuantity > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-xs font-medium text-white shadow-md transform transition-transform duration-200 group-hover:scale-110">
            {totalQuantity}
          </span>
        )}
      </button>

      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute right-0 mt-3 w-screen max-w-sm px-2 sm:px-0">
          <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 backdrop-blur-lg">
            <div className="relative bg-white/80">
              {Array.isArray(items) && items.length > 0 ? (
                <>
                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50/80 transition-colors duration-150"
                      >
                        <div className="relative group">
                          <img
                            src={item.image && typeof item.image === 'string' && item.image.startsWith('http') 
                              ? item.image 
                              : item.image 
                                ? `${import.meta.env.VITE_API_URL}/uploads/${item.image}`
                                : '/images/placeholder.jpg'}
                            alt={item.name}
                            className="h-16 w-16 rounded-xl object-cover transform transition-transform duration-200 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = '/images/placeholder.jpg';
                              e.target.onerror = null;
                            }}
                          />
                          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 group-hover:ring-black/20 transition-all duration-200"></div>
                        </div>
                        <div className="flex flex-1 flex-col min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Qty: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-0.5">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200/80 bg-gray-50/80 p-4">
                    <div className="flex items-center justify-between text-base font-medium text-gray-900">
                      <p>Total</p>
                      <p className="font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{totalAmount}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <Link
                      to="/checkout"
                      onClick={() => setIsOpen(false)}
                      className="mt-4 block w-full rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-3 text-center text-sm font-medium text-white shadow-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Checkout
                    </Link>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100/80 flex items-center justify-center">
                    <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start adding some items to your cart!
                  </p>
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-purple-600 transition-colors duration-200"
                  >
                    Continue Shopping
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default CartIcon;
