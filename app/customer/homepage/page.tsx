"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";

export default function CustomerLandingPage() {
  const router = useRouter();

  // Stats states
  const [productCount, setProductCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [varietyCount] = useState(35);
  const [counts, setCounts] = useState([0, 0, 0]);

  // User / UI states
  const [user, setUser] = useState<User | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };
    getUser();
  }, [router]);

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowAccountModal(false);
    router.push("/login");
  };

  // Fetch counts from Supabase
  useEffect(() => {
    const fetchCounts = async () => {
      // Products count
      const { count: products, error: productError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      if (productError) console.error(productError);
      setProductCount(products ?? 0);

      // Suppliers count
      const { count: suppliers, error: supplierError } = await supabase
        .from("suppliers")
        .select("*", { count: "exact", head: true });
      if (supplierError) console.error(supplierError);
      setSupplierCount(suppliers ?? 0);
    };
    fetchCounts();
  }, []);

  const statsData = [
    { label: "Total Products", value: productCount, img: "/images/image7.jpeg" },
    { label: "Varieties Available", value: varietyCount, img: "/images/image6.jpeg" },
    { label: "Suppliers Connected", value: supplierCount, img: "/images/image4.jpeg" },
  ];

  // Count-up animation - RESTORED ORIGINAL FUNCTIONALITY
  useEffect(() => {
    statsData.forEach((stat, idx) => {
      let current = 0;
      const duration = 2000;
      const intervalTime = 20;
      const increment = stat.value / (duration / intervalTime);

      setTimeout(() => {
        const interval = setInterval(() => {
          current += increment;
          if (current >= stat.value) {
            current = stat.value;
            clearInterval(interval);
          }
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[idx] = Math.floor(current);
            return newCounts;
          });
        }, intervalTime);
      }, idx * 500);
    });
  }, [productCount, supplierCount, varietyCount]);

  const featuredImages = [
    "/images/product1.jpeg",
    "/images/product2.jpeg",
    "/images/product3.jpeg",
    "/images/product4.jpeg",
    "/images/product5.jpeg",
    "/images/product6.jpeg",
    "/images/product7.jpeg",
    "/images/product8.jpeg",
    "/images/product9.jpeg",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-gradient-to-b from-black to-balck shadow-xl w-64 z-50`}
      >
        <div className="flex justify-between items-center p-5 border-b border-indigo-700">
          <h2 className="text-xl font-bold text-white">Navigation</h2>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer text-white"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <nav className="flex flex-col p-4 space-y-3 mt-4">
          <button
            onClick={() => router.push("/customer/place-order")}
            className="text-left px-4 py-3 text-white hover:bg-indigo-700 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Place Order
          </button>
          <button
            onClick={() => router.push("/customer/view-orders")}
            className="text-left px-4 py-3 text-white hover:bg-indigo-700 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View Orders
          </button>
          <button
            onClick={() => router.push("/customer/view-product")}
            className="text-left px-4 py-3 text-white hover:bg-indigo-700 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16" />
            </svg>
            View Products
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-40">
          {/* Sidebar Button */}
          <Bars3Icon 
            className="h-8 w-8 text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors"
            onClick={() => setSidebarOpen(true)}
          />

          <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SCM Customer Portal
          </h1>

          {/* Account Button */}
          <button
            onClick={() => setShowAccountModal(!showAccountModal)}
            className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors group"
          >
            <div className="relative">
              <UserCircleIcon className="h-8 w-8 group-hover:scale-110 transition-transform" />
              {showAccountModal && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></span>
              )}
            </div>
            <span className="font-medium">Account</span>
          </button>
        </header>

        {/* Account Modal */}
        {showAccountModal && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-16 right-6 bg-white rounded-xl shadow-xl p-5 w-72 z-50 border border-gray-200"
          >
            <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">Account Information</h3>
            <div className="space-y-2 mb-4">
              <p className="text-sm flex items-center gap-2">
                <span className="font-medium text-gray-600">Email:</span> 
                <span className="text-gray-800">{user?.email}</span>
              </p>
              <p className="text-sm flex items-center gap-2">
                <span className="font-medium text-gray-600">ID:</span> 
                <span className="text-gray-800 font-mono text-xs">{user?.id.slice(0, 8)}...</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2.5 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
            >
              Logout
            </button>
          </motion.div>
        )}

        {/* Hero Section */}
        <section
          className="relative flex flex-col items-center justify-center text-center py-24 px-6"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/customerhero.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="relative z-10 max-w-3xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl font-bold text-white mb-5"
            >
              Welcome to Your Dashboard!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl text-gray-100 mb-8"
            >
              Discover our extensive product catalog and connect with trusted suppliers. Everything you need for your business, in one place.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              onClick={() => router.push("/customer/view-product")}
              className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Explore Products
            </motion.button>
          </div>
        </section>

        {/* Stats Section - RESTORED ORIGINAL LAYOUT WITH COUNT ANIMATION */}
        <section className="max-w-6xl mx-auto px-6 py-20 space-y-12">
          {statsData.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.5 }}
              className="flex flex-col md:flex-row items-center gap-6 md:gap-12 bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-100"
            >
              <img
                src={stat.img}
                alt={stat.label}
                className="w-full md:w-1/3 h-48 object-cover rounded-xl shadow-md"
              />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-4xl font-bold text-indigo-700 mb-2">{counts[idx]}</h3>
                <p className="text-xl text-gray-800 font-medium">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-center text-gray-800 mb-4"
            >
              Featured Products
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto"
            >
              Discover our most popular products loved by customers worldwide
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredImages.map((src, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className="h-60 overflow-hidden">
                    <img
                      src={src}
                      alt={`Featured ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">Product {idx + 1}</h4>
                    <p className="text-gray-600 text-sm">High-quality materials with exceptional durability</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <button 
                onClick={() => router.push("/customer/view-product")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                View All Products
              </button>
            </motion.div>
          </div>
        </section>
        {/* Footer */}
          <footer className="bg-gray-900 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Supply Chain Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}