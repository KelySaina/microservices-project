import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
} from "../../api/product";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
  name: "",
  description: "",
  price: "", // will convert to float
  stock: "", // new
});


  const fetchProducts = async () => {
    const res = await getAllProducts();
    setProducts(res.products || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    // Convert price to float and stock to integer
    const input = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };

    await createProduct(input);
    setForm({ name: "", price: "", description: "", stock: "" });
    fetchProducts();
  };


  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Products</h2>

        <form
          onSubmit={handleCreate}
          className="bg-white p-4 shadow rounded mb-6 flex space-x-3"
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border px-3 py-2 rounded w-1/4"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border px-3 py-2 rounded w-1/4"
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border px-3 py-2 rounded flex-1"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="border px-3 py-2 rounded w-1/4"
          />

          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Add
          </button>
        </form>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
