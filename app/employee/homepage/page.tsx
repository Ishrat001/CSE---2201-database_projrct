"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon, Bars3Icon, XMarkIcon, ChartBarIcon, CubeIcon, TruckIcon } from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/lib/supabaseClient";

type OrderRow = { status: string | null };
type OrderSlice = { status: string; value: number };
type WarehouseBar = { name: string; value: number };

type InventoryJoinRow = {
  warehouses?: {
    warehouse_name?: string;
  };
  quantity_on_hand?: number | string;
};

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"];

export default function EmployeeLandingPage() {
  const router = useRouter();

  const [orderData, setOrderData] = useState<OrderSlice[]>([]);
  const [warehouseData, setWarehouseData] = useState<WarehouseBar[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalInventory: 0,
    activeWarehouses: 0
  });

  // ----------------- Fetch Orders -----------------
  async function fetchOrders() {
    const { data, error } = await supabase.from("orders").select("status");
    if (error) {
      console.error("Error fetching order data:", error.message);
      setOrderData([]);
      return;
    }

    const counts: Record<string, number> = {
      Pending: 0,
      Shipped: 0,
      Delivered: 0,
    };

    (data as OrderRow[]).forEach((row) => {
      const key = (row.status ?? "Unknown").toString();
      if (counts[key] === undefined) counts[key] = 0;
      counts[key]++;
    });

    const slices: OrderSlice[] = Object.entries(counts).map(([status, value]) => ({
      status,
      value,
    }));
    setOrderData(slices);
    setStats(prev => ({ ...prev, totalOrders: data.length }));
  }

  // ----------------- Fetch Warehouses -----------------
  async function fetchWarehouses() {
    const { data, error } = await supabase
      .from("inventory")
      .select("quantity_on_hand, warehouses!inner(warehouse_name)");

    if (error) {
      console.error("Error fetching warehouse data:", error.message);
      setWarehouseData([]);
      return;
    }

    const totals: Record<string, number> = {};

    (data as InventoryJoinRow[]).forEach((row) => {
      const name = row.warehouses?.warehouse_name ?? "Unknown";
      totals[name] = (totals[name] || 0) + Number(row.quantity_on_hand || 0);
    });

    const bars: WarehouseBar[] = Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));
    setWarehouseData(bars);
    setStats(prev => ({ 
      ...prev, 
      totalInventory: data.reduce((sum, item) => sum + Number(item.quantity_on_hand || 0), 0),
      activeWarehouses: bars.length
    }));
  }

  // ----------------- Run on page load -----------------
  useEffect(() => {
    fetchOrders();
    fetchWarehouses();
  }, []);

  // ----------------- Logout -----------------
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-gradient-to-b from-black to-balck shadow-xl w-64 z-50`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Navigation Menu</h2>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer text-white"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <nav className="flex flex-col p-4 space-y-3 mt-4">
          {[
            { name: "Inventory", icon: CubeIcon, path: "/employee/inventory" },
            { name: "Orders", icon: TruckIcon, path: "/employee/orders" },
            { name: "Products", icon: ChartBarIcon, path: "/employee/products" },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className="flex items-center space-x-3 text-left px-4 py-3 text-white hover:bg-gray-800 rounded-lg transition-all duration-200 group"
            >
              <item.icon className="h-5 w-5 text-white group-hover:text-purple-300" />
              <span className="text-white group-hover:text-purple-200 font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-40">
          {/* Hamburger */}
          <Bars3Icon
            className="h-8 w-8 text-indigo-600 cursor-pointer hover:text-purple-600 transition-colors"
            onClick={() => setSidebarOpen(true)}
          />

          <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SCM Employee Dashboard
          </h1>

          {/* Account */}
          <div className="relative">
            <button
              onClick={() => setAccountModalOpen(!accountModalOpen)}
              className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors group"
            >
              <UserCircleIcon className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Account</span>
            </button>
            
            {accountModalOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl p-5 z-50 border border-gray-200">
                <h3 className="font-bold text-lg mb-3 text-gray-800 border-b pb-2">Account Information</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium text-gray-600">Email:</span> 
                    <span className="text-gray-800">ishratcsedu29@gmail.com</span>
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <span className="font-medium text-gray-600">Role:</span> 
                    <span className="text-gray-800">Employee</span>
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
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://i.pinimg.com/736x/0e/1a/14/0e1a1429bfd893aa8fb7eb978fb448dc.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-5xl font-bold text-white mb-5">
              Welcome Back!!!
            </h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Track orders and warehouse inventory in real-time with our advanced supply chain management system
            </p>
            <button
              onClick={() => router.push("/employee/orders")}
              className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              View Orders
            </button>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Total Orders", value: stats.totalOrders, icon: TruckIcon, color: "from-blue-500 to-cyan-500" },
              { label: "Total Inventory", value: stats.totalInventory, icon: CubeIcon, color: "from-purple-500 to-pink-500" },
              { label: "Active Warehouses", value: stats.activeWarehouses, icon: ChartBarIcon, color: "from-green-500 to-teal-500" },
            ].map((stat, index) => (
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
            {/* Orders Pie Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TruckIcon className="h-6 w-6 text-indigo-600 mr-3" />
                Orders by Status
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={orderData}
                    dataKey="value"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    labelLine={false}
                  >
                    {orderData.map((_, i) => (
                      <Cell 
                        key={i} 
                        fill={COLORS[i % COLORS.length]} 
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      color: 'black'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Warehouse Bar Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <CubeIcon className="h-6 w-6 text-indigo-600 mr-3" />
                Products by Warehouse
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={warehouseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      color: 'black'
                    }} 
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                  >
                    {warehouseData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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