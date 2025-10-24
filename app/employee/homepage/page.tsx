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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-500 ease-in-out bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl w-80 z-50 border-r border-purple-500/20`}
      >
        <div className="flex justify-between items-center p-6 border-b border-purple-500/20">
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Navigation Menu
          </h2>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer text-purple-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <nav className="flex flex-col p-6 space-y-4">
          {[
            { name: "Inventory", icon: CubeIcon, path: "/employee/inventory" },
            { name: "Orders", icon: TruckIcon, path: "/employee/orders" },
            { name: "Products", icon: ChartBarIcon, path: "/employee/products" },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className="flex items-center space-x-3 text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group"
            >
              <item.icon className="h-5 w-5 text-purple-400 group-hover:text-purple-300" />
              <span className="text-white group-hover:text-purple-200 font-medium">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-800/80 backdrop-blur-xl border-b border-purple-500/20">
          <div className="flex justify-between items-center px-8 py-4">
            {/* Hamburger */}
            <Bars3Icon
              className="h-8 w-8 text-purple-400 cursor-pointer hover:text-white transition-colors hover:scale-110 transform duration-200"
              onClick={() => setSidebarOpen(true)}
            />

            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              SCM Employee Dashboard
            </h1>

            {/* Account */}
            <div className="relative">
              <UserCircleIcon
                className="h-12 w-12 text-purple-400 hover:text-white cursor-pointer transition-all duration-300 hover:scale-110"
                onClick={() => setAccountModalOpen(!accountModalOpen)}
              />
              {accountModalOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in duration-300">
                  <p className="text-white font-semibold mb-2">Account Info</p>
                  <p className="text-sm text-purple-300 mb-4">employee@example.com</p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-6 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-purple-900/80 to-slate-900/90 backdrop-blur-sm" />
          </div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight animate-in slide-in-from-bottom duration-1000">
              Welcome Back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Employee!</span>
            </h2>
            <p className="text-xl text-purple-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Track orders and warehouse inventory in real-time with our advanced supply chain management system
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {[
                { label: "Total Orders", value: stats.totalOrders, icon: TruckIcon, color: "from-blue-500 to-cyan-500" },
                { label: "Total Inventory", value: stats.totalInventory, icon: CubeIcon, color: "from-purple-500 to-pink-500" },
                { label: "Active Warehouses", value: stats.activeWarehouses, icon: ChartBarIcon, color: "from-green-500 to-teal-500" },
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-purple-300 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="relative px-6 pb-20 -mt-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders Pie Chart */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <TruckIcon className="h-6 w-6 text-purple-400 mr-3" />
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
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(192, 132, 252, 0.3)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      color: 'white'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Warehouse Bar Chart */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CubeIcon className="h-6 w-6 text-purple-400 mr-3" />
                Products by Warehouse
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={warehouseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid rgba(192, 132, 252, 0.3)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)',
                      color: 'white'
                    }} 
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    className="hover:scale-105 transition-transform"
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
      </div>
    </div>
  );
}