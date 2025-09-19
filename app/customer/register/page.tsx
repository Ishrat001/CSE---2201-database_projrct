"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");

  // ---- Login ----
  const handleLogin = async () => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("❌ Login failed: " + error.message);
    } else {
      alert("✅ Login successful!");
      router.push("/customer/homepage");
    }
  };

  // ---- Register ----
  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("❌ Auth register failed: " + error.message);
      return;
    }

    const user = data.user;
    if (!user) {
      alert("❌ Register failed, user is null.");
      return;
    }

    // insert into Customers table
    const { error: insertError } = await supabase.from("customers").insert([
      {
        customer_id: user.id,
        customer_name: customerName,
        email: email,
        phone: phone,
        address: address,
        payment_terms: paymentTerms,
      },
    ]);

    if (insertError) {
      alert("❌ Failed to insert into Customers table: " + insertError.message);
      return;
    }

    alert("✅ Account created successfully!");
    setIsRegister(false); // back to login after register
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isRegister ? "Join our supply chain network" : "Sign in to continue"}
            </p>
          </div>

          {isRegister ? (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Business address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <input
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="Preferred payment terms"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            onClick={isRegister ? handleRegister : handleLogin}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300"
          >
            {isRegister ? "Create Account" : "Sign In"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-purple-600 font-semibold hover:text-purple-800 transition"
              >
                {isRegister ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}