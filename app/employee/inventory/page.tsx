"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Inventory = {
  warehouse_id: string;
  product_id: string;
  quantity_on_hand: number;
  last_stock_update: string; // date string YYYY-MM-DD
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity_on_hand: "",
    last_stock_update: "",
  });
  const [message, setMessage] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  // Load data from Supabase
  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    const { data, error } = await supabase.from("inventory").select("*");
    if (error) {
      console.error(error.message);
    } else {
      setInventory(data as Inventory[]);
    }
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Save or Update
  async function handleSave() {
    const payload = {
      product_id: formData.product_id,
      warehouse_id: formData.warehouse_id,
      quantity_on_hand: Number(formData.quantity_on_hand),
      last_stock_update: formData.last_stock_update,
    };

    let error;
    if (isEdit) {
      // Update
      const res = await supabase
        .from("inventory")
        .update(payload)
        .eq("product_id", formData.product_id)
        .eq("warehouse_id", formData.warehouse_id);
      error = res.error;
    } else {
      // Insert
      const res = await supabase.from("inventory").insert([payload]);
      error = res.error;
    }

    if (error) {
      setMessage("❌ Failed to save: " + error.message);
    } else {
      setMessage(isEdit ? "✅ Inventory updated successfully" : "✅ Inventory added successfully");
      setShowModal(false);
      fetchInventory();
    }
  }

  async function handleDelete(product_id: string, warehouse_id: string) {
    if (!confirm("Are you sure you want to delete this inventory?")) return;

    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("product_id", product_id)
      .eq("warehouse_id", warehouse_id);

    if (error) {
      setMessage("❌ Failed to delete: " + error.message);
    } else {
      setMessage("✅ Inventory deleted successfully");
      fetchInventory();
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Main Content */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Inventory Management
        </h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes("❌") 
                ? "bg-red-100 text-red-800 border border-red-200" 
                : "bg-green-100 text-green-800 border border-green-200"
            }`}>
              {message}
            </div>
          )}

          <button
            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 font-semibold shadow-md"
            onClick={() => {
              setFormData({ product_id: "", warehouse_id: "", quantity_on_hand: "", last_stock_update: "" });
              setIsEdit(false);
              setShowModal(true);
            }}
          >
            Add New Inventory
          </button>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-2">Loading inventory...</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-indigo-600">
                  <tr>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Warehouse ID</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Product ID</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Quantity</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Last Stock Update</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="border border-gray-300 p-3 text-gray-700 font-mono">{item.warehouse_id}</td>
                      <td className="border border-gray-300 p-3 text-gray-700 font-mono">{item.product_id}</td>
                      <td className="border border-gray-300 p-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.quantity_on_hand > 50 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : item.quantity_on_hand > 10 
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {item.quantity_on_hand}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3 text-gray-600">{item.last_stock_update}</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-sm"
                            onClick={() => {
                              setFormData({
                                product_id: item.product_id,
                                warehouse_id: item.warehouse_id,
                                quantity_on_hand: item.quantity_on_hand.toString(),
                                last_stock_update: item.last_stock_update,
                              });
                              setIsEdit(true);
                              setShowModal(true);
                            }}
                          >
                            Update
                          </button>
                          <button
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium shadow-sm"
                            onClick={() => handleDelete(item.product_id, item.warehouse_id)}
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
                {isEdit ? "Update Inventory" : "Add Inventory"}
              </h2>

              <input
                type="text"
                name="product_id"
                placeholder="Product ID"
                value={formData.product_id}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="text"
                name="warehouse_id"
                placeholder="Warehouse ID"
                value={formData.warehouse_id}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="number"
                name="quantity_on_hand"
                placeholder="Quantity"
                value={formData.quantity_on_hand}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="date"
                name="last_stock_update"
                value={formData.last_stock_update}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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