import { useCart } from "../components/CartContext";
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/product";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const { addToCart, cart } = useCart();

  // Fetch all products
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        const all = res || [];
        // Filter out products with 0 stock
        const available = all.filter((p) => p.stock > 0);
        setProducts(available);
        setFilteredProducts(available);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter products by name and price range
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
    return <div className="text-center mt-10">Loading products...</div>;

  return (
    <div className="p-6">
      {/* Cart Section */}
      {cart.length > 0 && (
        <div className="mb-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-2">Cart</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between mb-1">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
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
