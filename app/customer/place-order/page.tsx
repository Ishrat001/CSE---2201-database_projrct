"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PlaceOrderModal({ customerId }: { customerId: string }) {
  const router = useRouter();

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // 1️⃣ Insert into orders
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            payment_method: paymentMethod,
            status: "Pending", // default
            customer_id: customerId, // from session/prop
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2️⃣ Insert into order_details
      const { error: detailsError } = await supabase.from("order_details").insert([
        {
          product_id: productId,
          order_id: order.order_id, // FK from created order
          quantity: quantity,
          unit_price: unitPrice,
        },
      ]);

      if (detailsError) throw detailsError;

  alert("Order placed successfully ✅");
  router.push("/customer/homepage"); // back to landing page

} catch (err: unknown) {
  if (err instanceof Error) {
    alert("Error placing order: " + err.message);
  } else {
    alert("Unknown error occurred");
  }
} finally {
  setLoading(false);
}
  };
  const handleCancel = () => {
    router.push("/customer/homepage"); // cancel → back to landing page
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 z-50">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Place Order</h2>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              style={{ color: 'black' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border border-gray-300 p-3 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              style={{ color: 'black' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit Price ($)</label>
            <input
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(Number(e.target.value))}
              className="w-full border border-gray-300 p-3 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              style={{ color: 'black' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
              style={{ color: 'black' }}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Online">Online</option>
            </select>
          </div>
        </div>

         <div className="flex justify-between mt-8">
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Placing Order...
              </>
            ) : "Place Order"}
          </button>

          <button
            onClick={handleCancel}
            className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 px-6 py-3 rounded-xl hover:from-gray-300 hover:to-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all shadow-sm"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}