"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Suppliers</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
        onClick={() => openModal()}
      >
        Add New Supplier
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Payment Term</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.supplier_id}>
                <td className="border p-2">{s.supplier_id}</td>
                <td className="border p-2">{s.supplier_name}</td>
                <td className="border p-2">{s.phone}</td>
                <td className="border p-2">{s.email}</td>
                <td className="border p-2">{s.address}</td>
                <td className="border p-2">{s.payment_term}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => openModal(s)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => deleteSupplier(s.supplier_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg w-96 pointer-events-auto shadow-lg z-50">
            <h2 className="text-xl font-semibold mb-4">
              {formData.supplier_id === 0 ? "Add Supplier" : "Update Supplier"}
            </h2>

            <input
              type="text"
              name="supplier_name"
              placeholder="Supplier Name"
              value={formData.supplier_name}
              onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="text"
              name="payment_term"
              placeholder="Payment Term"
              value={formData.payment_term}
              onChange={(e) => setFormData({ ...formData, payment_term: e.target.value })}
              className="border p-2 mb-4 w-full"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSave}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
