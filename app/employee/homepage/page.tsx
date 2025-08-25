"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircleIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function EmployeeLandingPage() {
  const router = useRouter();

  const [orderData, setOrderData] = useState<OrderSlice[]>([]);
  const [warehouseData, setWarehouseData] = useState<WarehouseBar[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

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
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-white shadow-lg w-64 z-50`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Menu</h2>
          <XMarkIcon
            className="h-6 w-6 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <nav className="flex flex-col p-4 space-y-3">
          <button
            onClick={() => router.push("/inventory")}
            className="text-left px-3 py-2 hover:bg-gray-100 rounded"
          >
            Inventory
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="text-left px-3 py-2 hover:bg-gray-100 rounded"
          >
            Orders
          </button>
          <button
            onClick={() => router.push("/products")}
            className="text-left px-3 py-2 hover:bg-gray-100 rounded"
          >
            Products
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md sticky top-0 z-40">
          {/* Hamburger */}
          <Bars3Icon
            className="h-8 w-8 text-gray-700 cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />

          <h1 className="text-2xl font-bold text-gray-800">SCM Employee Dashboard</h1>

          {/* Account */}
          <div className="relative">
            <UserCircleIcon
              className="h-10 w-10 text-gray-700 hover:text-gray-900 cursor-pointer"
              onClick={() => setAccountModalOpen(!accountModalOpen)}
            />
            {accountModalOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg p-4">
                <p className="text-gray-800 font-medium mb-2">Account Info</p>
                {/* ekhane supabase theke user email/username ene dekhano jabe */}
                <p className="text-sm text-gray-600 mb-3">employee@example.com</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Hero */}
        <section
          className="relative flex flex-col items-center justify-center text-center py-24 px-6"
          style={{
            backgroundImage: "url('/images/hero-bg.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative z-10">
            <h2 className="text-5xl font-bold text-white mb-4">Welcome, Employee!</h2>
            <p className="text-lg text-white mb-8 max-w-2xl mx-auto">
              Track orders and warehouse inventory in real-time.
            </p>
          </div>
        </section>

        {/* Charts */}
        <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Orders Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Orders by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderData}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {orderData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Warehouse Bar Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Products by Warehouse</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={warehouseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
