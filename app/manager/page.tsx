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
  
} from "recharts";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { supabase } from "@/lib/supabaseClient";

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
    const { data, error } = await supabase.from("orders").select("is_return");
    if (error) {
      console.error("Error fetching orders:", error.message);
      return;
    }
    let orders = 0,
      returns = 0;
    data.forEach((row: { is_return: boolean }) => {
      if (row.is_return) returns++;
      else orders++;
    });
    setOrderData([
      { type: "Orders", value: orders },
      { type: "Returns", value: returns },
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

  // ----------------- Run on load -----------------
  useEffect(() => {
    fetchEmployees();
    fetchOrders();
    fetchPOs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center p-2 border rounded hover:bg-gray-100 space-x-2"
          >
            <UserCircleIcon className="w-6 h-6 text-gray-700" />
            <span className="text-gray-700 font-medium">Account</span>
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow rounded z-50">
              <Link href="/login" className="block px-4 py-2 hover:bg-gray-100">
                Login
              </Link>
              <Link href="/register" className="block px-4 py-2 hover:bg-gray-100">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

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
        {/* Employees by Job Title */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">Employees by Job Title</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              {/*<XAxis type="number" />
              <YAxis dataKey="job_title" type="category" />*/}
              <Tooltip />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

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


