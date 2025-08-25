import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config/env';
import { useSelector } from 'react-redux';
import {
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: { total: 0, growth: 0 },
    lowStock: { total: 0, growth: 0 },
    categories: { total: 0, growth: 0 },
    revenue: { total: 0, growth: 0 },
    orders: {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    totalCustomers: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      console.log('Auth check failed:', { token: !!token, user: !!user, role: user?.role });
      navigate('/login');
      return;
    }
    fetchStats();
  }, [token, user, navigate]);

  const fetchStats = async () => {
    try {
      console.log('Making request with token:', token);
      const { data } = await axios.get(`${config.API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStats(data);
    } catch (error) {
      console.error('Dashboard error:', error);
      console.log('Response details:', error.response?.data);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
      setError(error.response?.data?.message || 'Error fetching dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const stats_cards = [
    {
      name: 'Total Products',
      value: stats.products.total,
      icon: ShoppingBagIcon,
      color: 'from-blue-600 to-blue-400',
      change: `${stats.products.growth}%`,
      trend: parseFloat(stats.products.growth) >= 0 ? 'up' : 'down',
    },
    {
      name: 'Low Stock Items',
      value: stats.lowStock.total,
      icon: ExclamationCircleIcon,
      color: 'from-red-600 to-red-400',
      change: `${stats.lowStock.growth}%`,
      trend: parseFloat(stats.lowStock.growth) >= 0 ? 'up' : 'down',
    },
    {
      name: 'Categories',
      value: stats.categories.total,
      icon: ArrowTrendingUpIcon,
      color: 'from-green-600 to-green-400',
      change: `${stats.categories.growth}%`,
      trend: parseFloat(stats.categories.growth) >= 0 ? 'up' : 'down',
    },
    {
      name: 'Total Revenue',
      value: `₹${stats.revenue.total.toLocaleString('en-IN')}`,
      icon: CurrencyRupeeIcon,
      color: 'from-purple-600 to-purple-400',
      change: `${stats.revenue.growth}%`,
      trend: parseFloat(stats.revenue.growth) >= 0 ? 'up' : 'down',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats_cards.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden bg-white rounded-2xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
          >
            <div className={`absolute top-0 right-0 -mt-4 -mr-12 h-32 w-32 rounded-full bg-gradient-to-r ${stat.color} opacity-10`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex-shrink-0 p-3.5 rounded-full bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                {stat.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Orders Overview</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm font-medium text-indigo-600">Pending Orders</p>
                <p className="mt-2 text-2xl font-bold text-indigo-900">{stats.orders.pending}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-600">Delivered Orders</p>
                <p className="mt-2 text-2xl font-bold text-green-900">{stats.orders.delivered}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-600">Confirmed</p>
                <p className="mt-2 text-xl font-bold text-blue-900">{stats.orders.confirmed}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-600">Shipped</p>
                <p className="mt-2 text-xl font-bold text-yellow-900">{stats.orders.shipped}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-600">Cancelled</p>
                <p className="mt-2 text-xl font-bold text-red-900">{stats.orders.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Customer Overview</h2>
          </div>
          <div className="flex items-center justify-center h-[calc(100%-2rem)]">
            <div className="text-center">
              <UsersIcon className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
              <p className="mt-2 text-sm text-gray-600">Total Registered Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;