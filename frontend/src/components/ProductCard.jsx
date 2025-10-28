import React from "react";

export default function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition p-4 flex flex-col">
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover rounded-lg"
        />
      )}
      <div className="flex-1 mt-3">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">
          {product.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-blue-600 font-bold">${product.price}</span>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
