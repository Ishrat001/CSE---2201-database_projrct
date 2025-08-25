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
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Place Order</h2>

        <label className="block mb-2">Product ID</label>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2">Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2">Unit Price</label>
        <input
          type="number"
          value={unitPrice}
          onChange={(e) => setUnitPrice(Number(e.target.value))}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Online">Online</option>
        </select>

         <div className="flex justify-between">
          <button
            onClick={handlePlaceOrder}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
           
          >
            {loading ? "Placing..." : "Place Order"}
          </button>

          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
