import { useCart } from "../components/CartContext";
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/product";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  // Fetch all products
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        const all = res || [];
        setProducts(all);
        setFilteredProducts(all);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = [...products];

    if (search.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (minPrice !== "") {
      filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== "") {
      filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(filtered);
  }, [search, minPrice, maxPrice, products]);

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading products...</div>;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6">
      {/* 🛒 Enhanced Cart Section */}
      {cart.length > 0 && (
        <div className="mb-8 bg-white shadow-lg rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            🛍️ Your Cart
          </h2>

          <ul className="divide-y divide-gray-100">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-3 hover:bg-gray-50 transition rounded-lg px-2"
              >
                <div className="flex items-center gap-3">
                  {/* 🧃 Product image placeholder */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm font-bold">
                    {item.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.name} × {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
                <span className="text-gray-700 font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          {/* 💰 Total and Checkout */}
          <div className="flex items-center justify-between mt-5 border-t pt-4">
            <div className="text-lg font-bold text-gray-800">
              Total:{" "}
              <span className="text-green-600">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => navigate("/orders")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium px-5 py-2.5 rounded-lg shadow"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-60"
        />

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded px-3 py-2 w-28"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border rounded px-3 py-2 w-28"
          />
        </div>

        <button
          onClick={() => {
            setSearch("");
            setMinPrice("");
            setMaxPrice("");
            setFilteredProducts(products);
          }}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm"
        >
          Reset
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                unavailable: product.stock === 0,
              }}
              onAddToCart={() => addToCart(product)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
