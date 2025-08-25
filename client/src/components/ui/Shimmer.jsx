import React from 'react';

const Shimmer = ({ width = '100%', height = '20px', className = '' }) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded-md ${className}`}
            style={{ width, height }}
        />
    );
};

export const ProductCardShimmer = () => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <Shimmer height="200px" className="mb-4" />
            <Shimmer width="70%" className="mb-2" />
            <Shimmer width="40%" className="mb-4" />
            <Shimmer width="30%" className="mb-2" />
            <div className="flex justify-between items-center mt-4">
                <Shimmer width="25%" height="30px" />
                <Shimmer width="25%" height="30px" />
            </div>
        </div>
    );
};

export const ProductGridShimmer = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array(count).fill(0).map((_, index) => (
                <ProductCardShimmer key={index} />
            ))}
        </div>
    );
};

export const CartItemShimmer = () => {
    return (
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
            <Shimmer width="100px" height="100px" className="rounded-md" />
            <div className="flex-1">
                <Shimmer width="60%" className="mb-2" />
                <Shimmer width="30%" className="mb-2" />
                <div className="flex justify-between items-center mt-4">
                    <Shimmer width="20%" height="30px" />
                    <Shimmer width="30%" height="30px" />
                </div>
            </div>
        </div>
    );
};

export const CartShimmer = ({ count = 3 }) => {
    return (
        <div className="space-y-4">
            {Array(count).fill(0).map((_, index) => (
                <CartItemShimmer key={index} />
            ))}
        </div>
    );
};

export default Shimmer; 