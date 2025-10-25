"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Order {
  id: string;
  customer_id: string;
  product_name: string;
  quantity: number;
  total_price: number;
  order_date: string;
}

export default function ViewOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const customerId = userData.user?.id;
      if (!customerId) return;

      // Fetch orders with joined order_details + products
      const { data, error } = await supabase
        .from("orders")
        .select(`
          order_id,
          customer_id,
          order_date,
          order_details (
            quantity,
            unit_price,
            products (
              product_name
            )
          )
        `)
        .eq("customer_id", customerId);

      if (error) {
        console.error("Error fetching orders:", error);
      } else if (data) {
        // Transform nested data into flat structure
        const formatted = data.flatMap(order =>
          order.order_details.map(detail => ({
            id: order.order_id,
            customer_id: order.customer_id,
            product_name: detail.products?.[0]?.product_name,
            quantity: detail.quantity,
            total_price: detail.quantity * detail.unit_price,
            order_date: order.order_date,
          }))
        );

        setOrders(formatted);
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading your orders...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mt-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Your Orders</h1>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No orders yet</h3>
              <p className="mt-2 text-gray-500">You haven&apos;t placed any orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-inner">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <th className="p-4 text-left rounded-tl-xl">Order ID</th>
                    <th className="p-4 text-left">Quantity</th>
                    <th className="p-4 text-left">Total Price</th>
                    <th className="p-4 text-left rounded-tr-xl">Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={`${order.id}-${index}`}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"} transition-colors hover:bg-blue-100`}
                    >
                      <td className="p-4 border-b border-gray-200 text-black" >{order.id}</td>
                      <td className="p-4 border-b border-gray-200 text-black">{order.quantity}</td>
                      <td className="p-4 border-b border-gray-200 font-semibold text-black">${order.total_price.toFixed(2)}</td>
                      <td className="p-4 border-b border-gray-200 text-black">{new Date(order.order_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
