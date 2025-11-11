import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import {
  getAllProducts,
  createProduct,
  updateProductStock,
} from "../../api/product";

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "" });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchProducts = async () => {
    const res = await getAllProducts();
    setProducts(res || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);



  const handleSave = async (e) => {
    e.preventDefault();
    const input = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };

    if (editing) {
      // Backend only allows stock update for existing products
      await updateProductStock(editing.id, input.stock);
    } else {
      await createProduct(input);
    }

    setForm({ name: "", price: "", description: "", stock: "" });
    setEditing(null);
    setShowModal(false);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await updateProductStock(id, 0);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
    });
    setShowModal(true);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Products</h2>
          <button
            onClick={() => { setEditing(null); setForm({ name: "", description: "", price: "", stock: "" }); setShowModal(true); }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>
        </div>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">${p.price}</td>
                <td className={`p-2 font-semibold ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}>{p.stock}</td>
                <td className="p-2">{p.description}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit Stock
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Set Stock 0
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && <p className="text-gray-500 mt-4">No products found.</p>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-xl font-semibold mb-4">
              {editing ? "Edit Product Stock" : "Add New Product"}
            </h3>
            <form onSubmit={handleSave} className="space-y-3">
              {!editing && (
                <>
                  <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-3 py-2 rounded w-full" required />
                  <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border px-3 py-2 rounded w-full" required />
                  <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border px-3 py-2 rounded w-full" rows="3" />
                </>
              )}
              <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border px-3 py-2 rounded w-full" required />
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" data-cy="submit-button" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{editing ? "Update" : "Add"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
