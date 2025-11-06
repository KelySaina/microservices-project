import React from "react";

const COLORS = [
  "#E57373", // red
  "#81C784", // green
  "#64B5F6", // blue
  "#FFD54F", // yellow
  "#BA68C8", // purple
  "#4DB6AC", // teal
  "#F06292", // pink
  "#A1887F", // brown
  "#90A4AE", // grey
  "#FF8A65", // orange
];

// Deterministically pick a color from COLORS array
function getColorFromId(id) {
  if (!id) return COLORS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function ProductCard({ product, onAddToCart }) {
  if (!product) return null;

  const color = getColorFromId(product.id);

  return (
    <div
      className="bg-white shadow rounded-xl overflow-hidden hover:shadow-lg transition p-4 flex flex-col"
      style={{
        borderTop: `6px solid ${color}`,
      }}
    >
      <div className="flex items-center gap-3 mt-3 mb-2">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: color }}
        >
          {product.name.charAt(0).toUpperCase()}
        </div>

        <div className="text-sm font-medium text-gray-600">
          <span
            className={`${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </span>
        </div>
      </div>

      <div className="flex-1">
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
