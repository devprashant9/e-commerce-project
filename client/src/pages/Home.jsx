import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilter, clearFilters } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import Pagination from '../components/Pagination';

// Ensure we have a valid API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Home = () => {
  const dispatch = useDispatch();
  const { filteredItems, status, error, filters } = useSelector((state) => state.products);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({}));
    fetchCategories();
  }, []); // Only fetch on mount

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const { data } = await axios.get(`${API_URL}/categories`);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    // Fetch products when category changes
    if (filters.category !== 'all') {
      dispatch(fetchProducts({ category: filters.category }));
    } else {
      dispatch(fetchProducts({}));
    }
  }, [filters.category, dispatch]);

  const handleSearch = (e) => {
    dispatch(setFilter({ search: e.target.value }));
  };

  const handleCategoryChange = (category) => {
    dispatch(setFilter({ category }));
  };

  const handlePriceChange = (type, value) => {
    const newRange = { ...priceRange, [type]: value };
    setPriceRange(newRange);
    dispatch(setFilter({ priceRange: newRange }));
    // Fetch products with price range
    dispatch(fetchProducts({
      category: filters.category !== 'all' ? filters.category : undefined,
      minPrice: newRange.min,
      maxPrice: newRange.max
    }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-8">
        <div className="w-full sm:w-96 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <FunnelIcon className="h-5 w-5 mr-2" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.category === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {loadingCategories ? (
                  <div className="ml-2 inline-block">
                    <div className="animate-pulse h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => handleCategoryChange(category.name)}
                      className={`px-3 py-1 rounded-full text-sm ml-2 ${
                        filters.category === category.name
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {category.name.charAt(0).toUpperCase() +
                        category.name.slice(1)}
                    </button>
                  ))
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Price Range</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    handlePriceChange("min", Number(e.target.value))
                  }
                  placeholder="Min"
                  className="w-24 px-2 py-1 border border-gray-300 rounded"
                />
                <span>to</span>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    handlePriceChange("max", Number(e.target.value))
                  }
                  placeholder="Max"
                  className="w-24 px-2 py-1 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              dispatch(clearFilters());
              setPriceRange({ min: 0, max: 1000 });
              dispatch(fetchProducts({}));
            }}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(filteredItems.products || filteredItems).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* No Results */}
      {(!filteredItems.products && filteredItems.length === 0) ||
        (filteredItems.products && filteredItems.products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">
              No products found matching your criteria
            </p>
          </div>
        ))}

      <Pagination />
    </div>
  );
};

export default Home; 