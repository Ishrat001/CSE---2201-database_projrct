"use client";

import { useState } from "react";
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
    if (!productId.trim()) {
      alert("Please enter a Product ID");
      return;
    }
    if (quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    if (unitPrice <= 0) {
      alert("Please enter a valid unit price");
      return;
    }

    setLoading(true);

    try {
      // Insert into orders
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            customer_id: customerId,
            payment_method: paymentMethod,
            status: "Pending",
            order_date: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert into order_details
      const { error: detailsError } = await supabase
        .from("order_details")
        .insert([
          {
            order_id: order.order_id,
            product_id: productId,
            quantity: quantity,
            unit_price: unitPrice,
          },
        ]);

      if (detailsError) throw detailsError;

      // Success notification with better styling
      setTimeout(() => {
        router.push("/customer/homepage");
      }, 1500);
      
    } catch (err: unknown) {
      if (err instanceof Error) alert("Error placing order: " + err.message);
      else alert("Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push("/customer/homepage");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mx-4 border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-indigo-700">
              Place New Order
            </h2>
            <p className="text-indigo-600 mt-2">Fill in the order details below</p>
          </div>
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Product ID */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              Product ID
            </label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter product identifier"
              className="w-full border-2  text-black border-gray-300 bg-white p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
            />
          </div>

          {/* Quantity & Unit Price Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full border-2  text-black border-gray-300 bg-white p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Unit Price (tk)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, Number(e.target.value)))}
                className="w-full border-2 border-gray-300  text-black bg-white p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
              />
            </div>
          </div>

          {/* Total Price Display */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-300">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Total Amount:</span>
              <span className="text-2xl font-bold text-gray-900">
                tk{(quantity * unitPrice).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border-2 border-gray-300 text-black bg-white p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm appearance-none cursor-pointer"
            >
              <option value="Cash" className="py-2">💵 Cash</option>
              <option value="Card" className="py-2">💳 Credit/Debit Card</option>
              <option value="Online" className="py-2">🌐 Online Payment</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-800 px-6 py-4 rounded-xl hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 shadow-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Place Order
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}