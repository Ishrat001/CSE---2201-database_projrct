"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Product = {
  product_id: string;
  product_name: string;
  description: string;
  category: string;
  unit_price: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(false); // New product or update
  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    description: "",
    category: "",
    unit_price: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error(error.message);
    } else {
      setProducts(data as Product[]);
    }
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    if (isNew) {
      // Insert new product
      const { error } = await supabase.from("products").insert([
        {
          product_id: formData.product_id,
          product_name: formData.product_name,
          description: formData.description,
          category: formData.category,
          unit_price: Number(formData.unit_price),
        },
      ]);
      if (error) {
        setMessage("❌ Failed to add product: " + error.message);
        return;
      }
      setMessage("✅ Product added successfully");
    } else {
      // Update existing
      const { error } = await supabase
        .from("products")
        .update({
          product_name: formData.product_name,
          description: formData.description,
          category: formData.category,
          unit_price: Number(formData.unit_price),
        })
        .eq("product_id", formData.product_id);
      if (error) {
        setMessage("❌ Failed to update product: " + error.message);
        return;
      }
      setMessage("✅ Product updated successfully");
    }

    setShowModal(false);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("product_id", id);
    if (error) {
      setMessage("❌ Failed to delete product: " + error.message);
    } else {
      setMessage("✅ Product deleted successfully");
      fetchProducts();
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Main Content */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Product Management
        </h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg mb-6">
          <button
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold shadow-md"
            onClick={() => {
              setFormData({
                product_id: "",
                product_name: "",
                description: "",
                category: "",
                unit_price: "",
              });
              setIsNew(true);
              setShowModal(true);
            }}
          >
            Add New Product
          </button>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes("❌") 
                ? "bg-red-100 text-red-800 border border-red-200" 
                : "bg-green-100 text-green-800 border border-green-200"
            }`}>
              {message}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-2">Loading products...</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-indigo-600">
                  <tr>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Product ID</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Name</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Description</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Category</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Unit Price</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, idx) => (
                    <tr key={idx} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="border border-gray-300 p-3 text-gray-700 font-mono">{product.product_id}</td>
                      <td className="border border-gray-300 p-3 text-gray-800 font-medium">{product.product_name}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{product.description}</td>
                      <td className="border border-gray-300 p-3 text-blue-600 font-medium">{product.category}</td>
                      <td className="border border-gray-300 p-3 text-green-600 font-semibold">${product.unit_price}</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-sm"
                            onClick={() => {
                              setFormData({
                                product_id: product.product_id,
                                product_name: product.product_name,
                                description: product.description,
                                category: product.category,
                                unit_price: product.unit_price.toString(),
                              });
                              setIsNew(false);
                              setShowModal(true);
                            }}
                          >
                            Update
                          </button>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium shadow-sm"
                            onClick={() => handleDelete(product.product_id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50">
            <div className="absolute inset-0 bg-black/50 pointer-events-auto"></div>
            <div className="bg-white p-6 rounded-2xl w-96 pointer-events-auto shadow-2xl z-50 border border-gray-300">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {isNew ? "Add Product" : "Update Product"}
              </h2>

              <input
                type="text"
                name="product_id"
                placeholder="Product ID"
                value={formData.product_id}
                onChange={handleChange}
                readOnly={!isNew}
                className={`border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 ${
                  !isNew ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <input
                type="text"
                name="product_name"
                placeholder="Product Name"
                value={formData.product_name}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="number"
                name="unit_price"
                placeholder="Unit Price"
                value={formData.unit_price}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}