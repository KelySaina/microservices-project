import { useCart } from "../components/CartContext";
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/product";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.products || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return <div className="text-center mt-10">Loading products...</div>;

  return (
    <div className="p-6">
      {cart.length > 0 && (
        <div className="mb-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-2">Cart</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between mb-1">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
}
