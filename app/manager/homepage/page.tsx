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
  CartesianGrid
} from "recharts";
import { UserCircleIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";


// Pie chart colors
const PIE_COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28"];

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
    router.push("/"); // landing page
  }

  // ----------------- Run on load -----------------
  useEffect(() => {
    fetchEmployees();
    fetchOrders();
    fetchPOs();
    getUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* Left: Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-gray-200"
        >
          <Bars3Icon className="w-7 h-7 text-gray-700" />
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Manager !!!</h1>

        {/* Right: Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center p-2 border rounded hover:bg-gray-100 space-x-2"
          >
            <UserCircleIcon className="w-6 h-6 text-gray-700" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white shadow rounded z-50 p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Account Info</h4>
              {user ? (
                <>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">User ID: {user.id}</p>
                </>
              ) : (
                <p className="text-sm text-gray-600">Not logged in</p>
              )}
              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {sidebarOpen && (
  <div className="fixed top-0 left-0 h-full w-64 bg-black shadow-lg z-50 p-6 space-y-4">
    <h2 className="font-bold text-lg mb-4">Menu</h2>

    <button
      className="block text-left w-full hover:text-blue-600"
      onClick={() => {
        router.push("/manager/employees");
        setSidebarOpen(false);
      }}
    >
      Employees
    </button>

    <button
      className="block text-left w-full hover:text-blue-600"
      onClick={() => {
        router.push("/manager/warehouses");
        setSidebarOpen(false);
      }}
    >
      Warehouses
    </button>

    <button
      className="block text-left w-full hover:text-blue-600"
      onClick={() => {
        router.push("/manager/suppliers");
        setSidebarOpen(false);
      }}
    >
      Suppliers
    </button>

    <button
      className="absolute top-4 right-4 text-gray-600"
      onClick={() => setSidebarOpen(false)}
    >
      ✖
    </button>
  </div>
)}


      {/* Hero Card */}
      <div className="bg-white rounded-lg shadow mb-6 p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Welcome Manager 🚀
        </h2>
        <p className="text-gray-500 mt-1">
          Here’s a quick overview of employees, orders & purchase orders.
        </p>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Orders vs Returns */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Orders vs Returns</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderData}
                  dataKey="value"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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
        <div className="bg-white rounded-lg shadow p-4">
  <h3 className="font-semibold mb-2">Employees by Job Title</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={employeeData}>
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Bar dataKey="count" fill="#00C49F" />
    </BarChart>
  </ResponsiveContainer>
</div>

        {/* Purchase Order Status */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Purchase Order Status</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={poData}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
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
    </div>
  );
}
