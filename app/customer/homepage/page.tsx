"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js"; // 🔹 import User type

export default function CustomerLandingPage() {
  const router = useRouter();

  // Stats states
  const [productCount, setProductCount] = useState(0);
  const [supplierCount, setSupplierCount] = useState(0);
  const [varietyCount] = useState(35);
  const [counts, setCounts] = useState([0, 0, 0]);

  // User / UI states
  const [user, setUser] = useState<User | null>(null); // 🔹 type fix
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login"); // not logged in → redirect to login page
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
    { label: "Total Products", value: productCount, img: "/images/product1.jpeg" },
    { label: "Varieties Available", value: varietyCount, img: "/images/product2.jpeg" },
    { label: "Suppliers Connected", value: supplierCount, img: "/images/product3.jpeg" },
  ];

  // Count-up animation
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
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex">

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-white shadow-lg w-64 z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <nav className="flex flex-col p-4 space-y-3">
          <button
            onClick={() => router.push("/customer/place-order")}
            className="text-left px-3 py-2 hover:bg-gray-100 rounded"
          >
            Place Order
          </button>
          <button
            onClick={() => router.push("/customer/view-orders")}
            className="text-left px-3 py-2 hover:bg-gray-100 rounded"
          >
            View Orders
          </button>
          <button
            onClick={() => router.push("/customer/view-product")}
            className="text-left px-3 py-2 hover:bg-gray-100 rounded"
          >
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
              className="h-8 w-8 text-gray-700 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
             />

          <h1 className="text-2xl font-bold text-gray-800">SCM Customer</h1>

          {/* Account Button */}
          <button
            onClick={() => setShowAccountModal(!showAccountModal)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <UserCircleIcon className="h-8 w-8" />
            <span>Account</span>
          </button>
      </header>

      {/* Account Modal */}
      {showAccountModal && (
        <div className="absolute top-16 right-6 bg-white rounded-lg shadow-lg p-4 w-64 z-50">
          <h3 className="font-bold mb-2">Account Info</h3>
          <p className="text-sm">
            <b>Email:</b> {user?.email}
          </p>
          <p className="text-sm">
            <b>ID:</b> {user?.id}
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white w-full py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* Hero / Stats Section */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-24 px-6"
        style={{
          backgroundImage: "url('/images/hero-bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-white mb-4">Welcome, Customer!</h2>
          <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
            Explore our wide range of products and suppliers. Everything you need, in one place.
          </p>
        </div>
      </section>

      {/* Staggered Stats with Images */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        {statsData.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: idx * 0.5 }}
            className="flex flex-col md:flex-row items-center gap-6 md:gap-12 bg-blue-100 rounded-2xl shadow-lg p-6 md:p-10"
          >
            <img
              src={stat.img}
              alt={stat.label}
              className="w-full md:w-1/3 h-48 object-cover rounded-xl shadow-md"
            />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-4xl font-bold text-blue-900 mb-2">{counts[idx]}</h3>
              <p className="text-xl text-blue-800">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Featured Products Section */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">
          Featured Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredImages.map((src, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-200 rounded-2xl shadow-lg h-64 overflow-hidden"
            >
              <img
                src={src}
                alt={`Featured ${idx + 1}`}
                className="h-64 w-full object-cover rounded-2xl"
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
    </div>
  );
}
