import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import CartIcon from './CartIcon';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, ShoppingBagIcon, ClipboardDocumentListIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 shadow-md">
                <span className="text-lg font-bold text-white">B</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                BlinkIt
              </span>
            </Link>
          </div>

          {/* Right side navigation */}
          <div className="flex items-center space-x-6">
            <CartIcon />
            
            {/* User Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform duration-200 hover:scale-105">
                <span className="sr-only">Open user menu</span>
                {user?.name ? (
                  <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md">
                    <span className="text-sm font-medium">
                      {user.name[0].toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <UserCircleIcon className="h-9 w-9 text-gray-400 hover:text-gray-600 transition-colors" />
                )}
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                  {user ? (
                    <>
                      <div className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/orders"
                              className={`${
                                active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700'
                              } flex items-center px-4 py-2 text-sm transition-colors duration-150`}
                            >
                              <ClipboardDocumentListIcon className="mr-3 h-5 w-5" />
                              My Orders
                            </Link>
                          )}
                        </Menu.Item>

                        {user.role === 'admin' && (
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/admin"
                                className={`${
                                  active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700'
                                } flex items-center px-4 py-2 text-sm transition-colors duration-150`}
                              >
                                <Cog6ToothIcon className="mr-3 h-5 w-5" />
                                Admin Dashboard
                              </Link>
                            )}
                          </Menu.Item>
                        )}
                      </div>

                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </>
                  ) : (
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/login"
                            className={`${
                              active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700'
                            } flex items-center px-4 py-2 text-sm transition-colors duration-150`}
                          >
                            Sign in
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/register"
                            className={`${
                              active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700'
                            } flex items-center px-4 py-2 text-sm transition-colors duration-150`}
                          >
                            Create account
                          </Link>
                        )}
                      </Menu.Item>
                    </div>
                  )}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 