import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { addToCart } from '../store/slices/cartSlice';
import { showToast } from '../utils/toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const cartItems = useSelector((state) => state.cart.items || []);
  const itemInCart = cartItems?.find((item) => item?._id === product?._id);

  const handleAddToCart = () => {
    if (!product) return;

    setIsAdding(true);
    try {
      dispatch(addToCart({ ...product, quantity: 1 }));
      showToast.success('Added to cart!');
    } catch (error) {
      showToast.error('Failed to add to cart. Please try again.');
    } finally {
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  if (!product) return null;

  const getCategoryName = () => {
    if (!product.category) return 'Uncategorized';
    if (typeof product.category === 'string') return product.category;
    if (typeof product.category === 'object' && product.category.name) {
      return (
        product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)
      );
    }
    return 'Uncategorized';
  };

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="w-full h-48 overflow-hidden bg-gray-200">
        <img
          src={product.image || '/images/placeholder.jpg'}
          alt={product.name}
          className="h-full w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/images/placeholder.jpg';
            e.target.onerror = null;
          }}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold px-4 py-2 rounded-full bg-red-500">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {getCategoryName()}
          </span>
        </div>

        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-gray-900">₹{product.price?.toFixed(2)}</p>
          {product.stock > 0 && (
            <p className="text-sm text-gray-500">
              {product.stock < 10 ? (
                <span className="text-red-500">Only {product.stock} left</span>
              ) : (
                'In Stock'
              )}
            </p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAdding}
          className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${product.stock === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isAdding
                ? 'bg-green-500 text-white'
                : itemInCart
                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {product.stock === 0
            ? 'Out of Stock'
            : isAdding
              ? 'Added!'
              : itemInCart
                ? 'Add More'
                : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
