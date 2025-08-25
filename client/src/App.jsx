import { Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { config } from './config/env';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import ProductForm from './pages/admin/ProductForm';
import CategoryList from './pages/admin/CategoryList';
import OrderList from './pages/admin/OrderList';
import UserList from './pages/admin/UserList';
import Analytics from './pages/admin/Analytics';
import DashboardLayout from './components/layouts/DashboardLayout';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

const App = () => {
  const paypalClientId = config.PAYPAL_CLIENT_ID;
  
  if (!paypalClientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">PayPal Configuration Error</h2>
          <p className="mt-2 text-gray-600">PayPal Client ID is not configured properly.</p>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={{ 
      "client-id": paypalClientId,
      currency: "USD",
      intent: "capture",
      components: "buttons"
    }}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrderHistory /></PrivateRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product/new" element={<ProductForm />} />
            <Route path="product/:id/edit" element={<ProductForm />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="users" element={<UserList />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
        <Toaster position="top-center" />
      </div>
    </PayPalScriptProvider>
  );
};

export default App;
