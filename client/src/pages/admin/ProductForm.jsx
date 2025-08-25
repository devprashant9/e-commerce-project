import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  ArrowLeftIcon,
  PhotoIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

// Ensure we have a valid API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    unit: 'piece',
    image: null
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id, token, navigate]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(data);
      if (!id && data.length > 0) {
        setFormData(prev => ({ ...prev, category: data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Error fetching categories');
    }
  };

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category._id,
        stock: data.stock,
        unit: data.unit || 'piece',
        image: null
      });
      setImagePreview(data.image);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.message || 'Error fetching product');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Clear validation error when field is changed
    setValidationErrors(prev => ({ ...prev, [name]: null }));
    
    if (name === 'image' && files) {
      const file = files[0];
      if (file && file.type.startsWith('image/')) {
        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        setValidationErrors(prev => ({ ...prev, image: 'Please upload a valid image file' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name || formData.name.length < 3) {
      errors.name = 'Name must be at least 3 characters long';
    }
    if (!formData.description || formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    if (!formData.category) {
      errors.category = 'Please select a category';
    }
    if (!formData.stock || Number(formData.stock) < 0) {
      errors.stock = 'Stock must be 0 or greater';
    }
    if (!id && !formData.image) {
      errors.image = 'Please upload a product image';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!validateForm()) {
        throw new Error('Please fix the validation errors');
      }

      // Validate token
      if (!token) {
        navigate('/login');
        throw new Error('Please log in to continue');
      }

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          data.append(key, value);
        } else if (value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      const response = id
        ? await axios.put(`${API_URL}/products/${id}`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
        : await axios.post(`${API_URL}/products`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });

      navigate('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <div className="flex items-center">
            <Link
              to="/admin/products"
              className="mr-4 text-gray-500 hover:text-gray-700 transition-colors duration-150"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
          <p className="mt-2 text-sm text-gray-700">
            {id ? 'Update product details' : 'Create a new product in your store'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
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
          )}

          <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    validationErrors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter product description"
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (₹)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    validationErrors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
                {validationErrors.price && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.price}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                Stock
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    validationErrors.stock ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="0"
                />
                {validationErrors.stock && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.stock}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    validationErrors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </option>
                  ))}
                </select>
                {validationErrors.category && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <div className="mt-1">
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    validationErrors.unit ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="piece">Piece</option>
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="l">Liter (l)</option>
                  <option value="ml">Milliliter (ml)</option>
                  <option value="pack">Pack</option>
                </select>
                {validationErrors.unit && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.unit}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Product Image
              </label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                validationErrors.image ? 'border-red-300' : 'border-gray-300'
              }`}>
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="sr-only"
                        required={!id}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  {validationErrors.image && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.image}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Link
              to="/admin/products"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : id ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 