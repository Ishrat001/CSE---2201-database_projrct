"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";
import { UserCircleIcon, Bars3Icon, XMarkIcon, UsersIcon, BuildingStorefrontIcon, TruckIcon } from "@heroicons/react/24/outline";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

// Pie chart colors
const PIE_COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#8884D8", "#82CA9D"];

// Type definitions
type Employee = { job_title: string; count: number };
type OrderSlice = { type: string; value: number };
type PurchaseOrder = { status: string; value: number };

export default function ManagerDashboard() {
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [orderData, setOrderData] = useState<OrderSlice[]>([]);
  const [poData, setPoData] = useState<PurchaseOrder[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  // ----------------- Fetch Employees by Job Title -----------------
  async function fetchEmployees() {
    const { data, error } = await supabase.from("employees").select("job_title");
    if (error) {
      console.error("Error fetching employees:", error.message);
      return;
    }
    const counts: Record<string, number> = {};
    data.forEach((row: { job_title: string }) => {
      const jt = row.job_title || "Unknown";
      counts[jt] = (counts[jt] || 0) + 1;
    });
    const formatted = Object.entries(counts).map(([job_title, count]) => ({
      job_title,
      count,
    }));
    setEmployeeData(formatted);
  }

  // ----------------- Fetch Orders vs Returns -----------------
  async function fetchOrders() {
    const { count: orderCount, error: orderErr } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    const { count: returnCount, error: returnErr } = await supabase
      .from("returns")
      .select("*", { count: "exact", head: true });

    if (orderErr) console.error(orderErr.message);
    if (returnErr) console.error(returnErr.message);

    setOrderData([
      { type: "Orders", value: orderCount || 0 },
      { type: "Returns", value: returnCount || 0 },
    ]);
  }

  // ----------------- Fetch Purchase Orders by Status -----------------
  async function fetchPOs() {
    const { data, error } = await supabase.from("purchase_orders").select("status");
    if (error) {
      console.error("Error fetching POs:", error.message);
      return;
    }
    const counts: Record<string, number> = {};
    data.forEach((row: { status: string }) => {
      const s = row.status || "Unknown";
      counts[s] = (counts[s] || 0) + 1;
    });
    const formatted = Object.entries(counts).map(([status, value]) => ({
      status,
      value,
    }));
    setPoData(formatted);
  }

  // ----------------- Get logged in user -----------------
  async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (!error) setUser(data.user);
  }

  // ----------------- Logout -----------------
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  // ----------------- Run on load -----------------
  useEffect(() => {
    fetchEmployees();
    fetchOrders();
    fetchPOs();
    getUser();
  }, []);

  const statsData = [
    { 
      label: "Total Employees", 
      value: employeeData.reduce((sum, item) => sum + item.count, 0), 
      icon: UsersIcon, 
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      label: "Total Orders", 
      value: orderData.find(item => item.type === "Orders")?.value || 0, 
      icon: TruckIcon, 
      color: "from-purple-500 to-pink-500" 
    },
    { 
      label: "Active Warehouses", 
      value: 8, // You can fetch this from your database
      icon: BuildingStorefrontIcon, 
      color: "from-green-500 to-teal-500" 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-gradient-to-b from-black to-balck shadow-xl w-64 z-50`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Manager Menu</h2>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer text-white"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <nav className="flex flex-col p-4 space-y-3 mt-4">
          <button
            onClick={() => router.push("/manager/employees")}
            className="text-left px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <UsersIcon className="h-5 w-5" />
            Employees
          </button>
          <button
            onClick={() => router.push("/manager/warehouses")}
            className="text-left px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <BuildingStorefrontIcon className="h-5 w-5" />
            Warehouses
          </button>
          <button
            onClick={() => router.push("/manager/suppliers")}
            className="text-left px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <TruckIcon className="h-5 w-5" />
            Suppliers
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
            Manager Dashboard
          </h1>

          {/* Account Button */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors group"
            >
              <UserCircleIcon className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Account</span>
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl p-5 z-50 border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">Account Information</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium text-gray-600">Email:</span> 
                    <span className="text-gray-800">{user?.email}</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium text-gray-600">Role:</span> 
                    <span className="text-gray-800">Manager</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium text-gray-600">User ID:</span> 
                    <span className="text-gray-800 font-mono text-xs">{user?.id.slice(0, 8)}...</span>
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2.5 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section with Fixed Background */}
        <section
          className="relative flex flex-col items-center justify-center text-center py-24 px-6"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://i.pinimg.com/736x/d4/40/ed/d440ed0c3ae933581ee6264489993549.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-5xl font-bold text-white mb-5">
              Welcome !!!
            </h2>
            <p className="text-xl text-gray-100 mb-8">
              Monitor your team performance, track orders, and manage operations efficiently.
            </p>
            <button
              onClick={() => router.push("/manager/employees")}
              className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Manage Team
            </button>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 hover:scale-105 group"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-lg text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders vs Returns */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TruckIcon className="h-6 w-6 text-indigo-600 mr-3" />
                Orders vs Returns
              </h3>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderData}
                      dataKey="value"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {orderData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Employees by Job Title */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <UsersIcon className="h-6 w-6 text-indigo-600 mr-3" />
                Employees by Job Title
              </h3>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employeeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00C49F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Purchase Order Status */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 group lg:col-span-2">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <BuildingStorefrontIcon className="h-6 w-6 text-indigo-600 mr-3" />
                Purchase Order Status
              </h3>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={poData}
                      dataKey="value"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {poData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
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