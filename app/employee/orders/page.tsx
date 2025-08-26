"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Order = {
  order_id: string;
  order_date: string;
  required_date: string;
  shifted_date: string;
  status: string;
  payment_method: string;
  customer_id: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    order_id: "",
    required_date: "",
    shifted_date: "",
    status: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("*");
    if (error) {
      console.error(error.message);
    } else {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    const { error } = await supabase
      .from("orders")
      .update({
        required_date: formData.required_date,
        shifted_date: formData.shifted_date,
        status: formData.status,
      })
      .eq("order_id", formData.order_id);

    if (error) {
      setMessage("❌ Failed to update order: " + error.message);
    } else {
      setMessage("✅ Order updated successfully");
      setShowModal(false);
      fetchOrders();
    }
  }

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      {message && (
        <div className="mb-3 p-2 bg-green-100 text-green-800 rounded">{message}</div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-black-100">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Order Date</th>
              <th className="border p-2">Required Date</th>
              <th className="border p-2">Shifted Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Payment Method</th>
              <th className="border p-2">Customer ID</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td className="border p-2">{order.order_id}</td>
                <td className="border p-2">{order.order_date}</td>
                <td className="border p-2">{order.required_date}</td>
                <td className="border p-2">{order.shifted_date}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">{order.payment_method}</td>
                <td className="border p-2">{order.customer_id}</td>
                <td className="border p-2 text-center">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      setFormData({
                        order_id: order.order_id,
                        required_date: order.required_date,
                        shifted_date: order.shifted_date,
                        status: order.status,
                      });
                      setShowModal(true);
                    }}
                  >
                    Update
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
            <h2 className="text-xl font-semibold mb-4">Update Order</h2>

            <input
              type="text"
              name="order_id"
              value={formData.order_id}
              readOnly
              className="border p-2 mb-3 w-full bg-gray-100 cursor-not-allowed"
            />
            <input
              type="date"
              name="required_date"
              value={formData.required_date}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="date"
              name="shifted_date"
              value={formData.shifted_date}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 mb-4 w-full"
            >
              <option value="Pending">Pending</option>
              <option value="Shifted">Shifted</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

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
