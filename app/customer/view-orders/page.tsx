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

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customerId);

      if (error) {
        console.error(error);
      } else {
        setOrders(data as Order[]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="p-6">Loading your orders...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Total Price</th>
              <th className="border p-2">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.product_name}</td>
                <td className="border p-2">{order.quantity}</td>
                <td className="border p-2">${order.total_price}</td>
                <td className="border p-2">{order.order_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
