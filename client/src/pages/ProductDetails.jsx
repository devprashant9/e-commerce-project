import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../store/slices/cartSlice';
import { showToast } from '../utils/toast';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        showToast.error('Error fetching product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      showToast.error('Selected quantity exceeds available stock');
      return;
    }

    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      quantity
    }));

    showToast.success('Added to cart successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={product.image.startsWith('http') ? product.image : `${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
            alt={product.name}
            className="w-full h-full object-center object-cover"
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
              e.target.onerror = null;
            }}
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-lg text-gray-500">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-indigo-600">₹{product.price.toFixed(2)}</p>
            <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="block w-24 py-2 pl-3 pr-10 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center py-3 px-8 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-600">Category: {product.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 