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
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      <button
        className="mb-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
        <div className="mb-3 p-2 bg-green-100 text-green-800 rounded">{message}</div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-black-100">
            <tr>
              <th className="border p-2">Product ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => (
              <tr key={idx}>
                <td className="border p-2">{product.product_id}</td>
                <td className="border p-2">{product.product_name}</td>
                <td className="border p-2">{product.description}</td>
                <td className="border p-2">{product.category}</td>
                <td className="border p-2">{product.unit_price}</td>
                <td className="border p-2 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none">
          <div className="bg-white p-6 rounded-lg w-96 pointer-events-auto shadow-lg z-50">
            <h2 className="text-xl font-semibold mb-4">
              {isNew ? "Add Product" : "Update Product"}
            </h2>

            <input
              type="text"
              name="product_id"
              placeholder="Product ID"
              value={formData.product_id}
              onChange={handleChange}
              readOnly={!isNew}
              className={`border p-2 mb-3 w-full ${
                !isNew ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
            <input
              type="text"
              name="product_name"
              placeholder="Product Name"
              value={formData.product_name}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="number"
              name="unit_price"
              placeholder="Unit Price"
              value={formData.unit_price}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
