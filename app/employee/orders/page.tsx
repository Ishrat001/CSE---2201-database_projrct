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
    <div className="min-h-screen bg-white p-6">
      {/* Main Content */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Order Management
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

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-2">Loading orders...</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-indigo-600">
                  <tr>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Order ID</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Order Date</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Required Date</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Shifted Date</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Status</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Payment Method</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Customer ID</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="border border-gray-300 p-3 text-gray-700 font-mono">{order.order_id}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{order.order_date}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{order.required_date}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{order.shifted_date}</td>
                      <td className="border border-gray-300 p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800 border border-green-200' :
                          order.status === 'Shifted' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3 text-gray-600">{order.payment_method}</td>
                      <td className="border border-gray-300 p-3 text-gray-700 font-mono">{order.customer_id}</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-sm"
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
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50">
            <div className="absolute inset-0 bg-black/50 pointer-events-auto"></div>
            <div className="bg-white p-6 rounded-2xl w-96 pointer-events-auto shadow-2xl z-50 border border-gray-300">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Update Order
              </h2>

              <input
                type="text"
                name="order_id"
                value={formData.order_id}
                readOnly
                className="border border-gray-300 bg-gray-100 text-gray-600 p-3 mb-3 w-full rounded-lg cursor-not-allowed"
              />
              <input
                type="date"
                name="required_date"
                value={formData.required_date}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                name="shifted_date"
                value={formData.shifted_date}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Pending" className="bg-white">Pending</option>
                <option value="Shifted" className="bg-white">Shifted</option>
                <option value="Delivered" className="bg-white">Delivered</option>
                <option value="Cancelled" className="bg-white">Cancelled</option>
              </select>

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