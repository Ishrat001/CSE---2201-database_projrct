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
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      {message && (
        <div className="mb-3 p-2 bg-green-100 text-green-800 rounded">{message}</div>
      )}

      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => {
          setFormData({ product_id: "", warehouse_id: "", quantity_on_hand: "", last_stock_update: "" });
          setIsEdit(false);
          setShowModal(true);
        }}
      >
        Add New Product
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-black-100">
            <tr>
              <th className="border p-2">Warehouse ID</th>
              <th className="border p-2">Product ID</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Last Stock Update</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-2">{item.warehouse_id}</td>
                <td className="border p-2">{item.product_id}</td>
                <td className="border p-2">{item.quantity_on_hand}</td>
                <td className="border p-2">{item.last_stock_update}</td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
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
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(item.product_id, item.warehouse_id)}
                  >
                    Delete
                  </button>
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
            <h2 className="text-xl font-semibold mb-4">{isEdit ? "Update Inventory" : "Add Inventory"}</h2>

            <input
              type="text"
              name="product_id"
              placeholder="Product ID"
              value={formData.product_id}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="text"
              name="warehouse_id"
              placeholder="Warehouse ID"
              value={formData.warehouse_id}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="number"
              name="quantity_on_hand"
              placeholder="Quantity"
              value={formData.quantity_on_hand}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="date"
              name="last_stock_update"
              value={formData.last_stock_update}
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
