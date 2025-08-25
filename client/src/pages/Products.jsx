import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilter, clearFilters, resetError } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { ProductGridShimmer } from '../components/ui/Shimmer';
import { toast } from 'react-hot-toast';

const Products = () => {
    const dispatch = useDispatch();
    const { filteredItems, status, error } = useSelector((state) => state.products);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchProducts());
        }
    }, [dispatch, status]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            // Reset error after showing toast
            dispatch(resetError());
        }
    }, [error, dispatch]);

    const handleRetry = () => {
        dispatch(fetchProducts());
    };

    if (status === 'loading') {
        return (
            <div className="container mx-auto px-4 py-8">
                <ProductGridShimmer />
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-red-50 p-8 rounded-lg">
                    <h2 className="text-2xl font-semibold text-red-600 mb-4">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={handleRetry}
                        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (filteredItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-gray-50 p-8 rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Products Found</h2>
                    <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
                    <button
                        onClick={() => dispatch(clearFilters())}
                        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Products; 