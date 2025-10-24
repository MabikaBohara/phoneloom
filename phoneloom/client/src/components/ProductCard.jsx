import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getImageUrl = (image) => {
        // If it's a Cloudinary URL, use it directly
        if (image && (image.startsWith('http') || image.startsWith('https'))) {
            return image;
        }
        // If it's a local upload path, construct the URL
        if (image && image.startsWith('uploads/')) {
            return `http://localhost:5000/${image}`;
        }
        // Default placeholder
        return image || 'https://via.placeholder.com/300x300?text=No+Image';
    };

    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            <div className="relative">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={getImageUrl(product.image)}
                        alt={product.model}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                    />
                </Link>
                {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Out of Stock
                    </div>
                )}
            </div>
            
            <div className="p-4">
                <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {product.model}
                    </h3>
                    <p className="text-sm text-gray-600">{product.brand}</p>
                </div>

                <div className="flex items-center mb-2">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700 ml-1">
                            {product.rating ? product.rating.toFixed(1) : '0.0'}
                        </span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                        ({product.stock} in stock)
                    </span>
                </div>

                <div className="mb-3">
                    <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                    </span>
                </div>

                <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                        {product.colors && product.colors.slice(0, 3).map((color, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                                {color}
                            </span>
                        ))}
                        {product.colors && product.colors.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                +{product.colors.length - 3} more
                            </span>
                        )}
                    </div>
                </div>

                <div className="mb-3">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Storage:</span> {product.storage && product.storage.join(', ')}
                    </div>
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">RAM:</span> {product.ramSize && product.ramSize.join(', ')}
                    </div>
                </div>

                <div className="flex space-x-2">
                    <Link
                        to={`/product/${product._id}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                    >
                        View Details
                    </Link>
                    <button
                        disabled={product.stock === 0}
                        className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                            product.stock === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                        <ShoppingCart className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
