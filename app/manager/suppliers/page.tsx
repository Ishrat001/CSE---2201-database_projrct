"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Supplier {
  supplier_id: number;
  supplier_name: string;
  phone: string;
  email: string;
  address: string;
  payment_term: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Supplier>({
    supplier_id: 0,
    supplier_name: "",
    phone: "",
    email: "",
    address: "",
    payment_term: "",
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("suppliers").select("*");
    if (error) console.error(error);
    else setSuppliers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const openModal = (supplier?: Supplier) => {
    if (supplier) setFormData(supplier); // Update
    else
      setFormData({
        supplier_id: 0,
        supplier_name: "",
        phone: "",
        email: "",
        address: "",
        payment_term: "",
      }); // Add
    setShowModal(true);
  };

  const deleteSupplier = async (id: number) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    const { error } = await supabase.from("suppliers").delete().eq("supplier_id", id);
    if (error) console.error(error);
    else fetchSuppliers();
  };

  const handleAddSave = async () => {
    if (formData.supplier_id === 0) {
      // Add new
      const { error } = await supabase.from("suppliers").insert([formData]);
      if (error) console.error(error);
    } else {
      // Update
      const { error } = await supabase
        .from("suppliers")
        .update({
          supplier_name: formData.supplier_name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          payment_term: formData.payment_term,
        })
        .eq("supplier_id", formData.supplier_id);
      if (error) console.error(error);
    }
    setShowModal(false);
    fetchSuppliers();
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Main Content */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Supplier Management
        </h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">All Suppliers</h2>
            <button
              onClick={() => openModal()}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium shadow-sm space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add New Supplier</span>
            </button>
          </div>

          {/* Suppliers Table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-2">Loading suppliers...</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-indigo-600">
                  <tr>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">ID</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Name</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Phone</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Email</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Address</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Payment Term</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s) => (
                    <tr key={s.supplier_id} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="border border-gray-300 p-3 text-gray-700 font-mono">{s.supplier_id}</td>
                      <td className="border border-gray-300 p-3 text-gray-800 font-medium">{s.supplier_name}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{s.phone}</td>
                      <td className="border border-gray-300 p-3 text-blue-600">{s.email}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{s.address}</td>
                      <td className="border border-gray-300 p-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          {s.payment_term}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openModal(s)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-sm shadow-sm flex items-center gap-1"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                            Update
                          </button>
                          <button
                            onClick={() => deleteSupplier(s.supplier_id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium text-sm shadow-sm flex items-center gap-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50">
            <div className="absolute inset-0 bg-black/50 pointer-events-auto"></div>
            <div className="bg-white p-6 rounded-2xl w-96 pointer-events-auto shadow-2xl z-50 border border-gray-300">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {formData.supplier_id === 0 ? "Add Supplier" : "Update Supplier"}
              </h2>

              <input
                type="text"
                name="supplier_name"
                placeholder="Supplier Name"
                value={formData.supplier_name}
                onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="text"
                name="payment_term"
                placeholder="Payment Term"
                value={formData.payment_term}
                onChange={(e) => setFormData({ ...formData, payment_term: e.target.value })}
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}