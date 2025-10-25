"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Warehouse {
  warehouse_id: number;
  warehouse_name: string;
  address: string;
  capacity: number;
  manager_id: number;
}

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentWarehouse, setCurrentWarehouse] = useState<Partial<Warehouse>>(
    {}
  );

  // Fetch warehouses from Supabase
  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("warehouses").select("*");
    if (error) {
      console.error("Error fetching warehouses:", error.message);
    } else {
      setWarehouses(data as Warehouse[]);
    }
    setLoading(false);
  };

  // Open modal for edit
  const handleEdit = (warehouse: Warehouse) => {
    setIsEditing(true);
    setCurrentWarehouse(warehouse);
    setShowModal(true);
  };

  // Open modal for add
  const handleAdd = () => {
    setIsEditing(false);
    setCurrentWarehouse({});
    setShowModal(true);
  };

  // Save changes
  const handleSave = async () => {
    if (isEditing) {
      const { error } = await supabase
        .from("warehouses")
        .update({
          warehouse_name: currentWarehouse.warehouse_name,
          address: currentWarehouse.address,
          capacity: currentWarehouse.capacity,
          manager_id: currentWarehouse.manager_id,
        })
        .eq("warehouse_id", currentWarehouse.warehouse_id);

      if (error) {
        alert("Error updating warehouse: " + error.message);
      } else {
        alert("Warehouse information updated successfully!");
        fetchWarehouses();
      }
    } else {
      const { error } = await supabase.from("warehouses").insert([
        {
          warehouse_name: currentWarehouse.warehouse_name,
          address: currentWarehouse.address,
          capacity: currentWarehouse.capacity,
          manager_id: currentWarehouse.manager_id,
        },
      ]);

      if (error) {
        alert("Error adding warehouse: " + error.message);
      } else {
        alert("New warehouse added successfully!");
        fetchWarehouses();
      }
    }
    setShowModal(false);
  };

  // Delete warehouse
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this warehouse?")) {
      const { error } = await supabase
        .from("warehouses")
        .delete()
        .eq("warehouse_id", id);

      if (error) {
        alert("Error deleting warehouse: " + error.message);
      } else {
        alert("Warehouse deleted successfully!");
        fetchWarehouses();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Main Content */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Warehouse Management
        </h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">All Warehouses</h2>
            <button
              onClick={handleAdd}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium shadow-sm space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add New Warehouse</span>
            </button>
          </div>

          {/* Warehouse Table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-2">Loading warehouses...</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-indigo-600">
                  <tr>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">ID</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Name</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Address</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Capacity</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Manager ID</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((wh) => (
                    <tr key={wh.warehouse_id} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="border border-gray-300 p-3 text-gray-700 font-mono">{wh.warehouse_id}</td>
                      <td className="border border-gray-300 p-3 text-gray-800 font-medium">{wh.warehouse_name}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{wh.address}</td>
                      <td className="border border-gray-300 p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {wh.capacity} units
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3 text-gray-700 font-mono">{wh.manager_id}</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(wh)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-sm shadow-sm flex items-center gap-1"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(wh.warehouse_id)}
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
                {isEditing ? "Update Warehouse" : "Add Warehouse"}
              </h2>

              {isEditing && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse ID</label>
                  <input
                    type="text"
                    value={currentWarehouse.warehouse_id}
                    disabled
                    className="w-full border border-gray-300 bg-gray-100 text-gray-600 p-3 rounded-lg cursor-not-allowed"
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={currentWarehouse.warehouse_name || ""}
                  onChange={(e) =>
                    setCurrentWarehouse({
                      ...currentWarehouse,
                      warehouse_name: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 bg-white text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter warehouse name"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={currentWarehouse.address || ""}
                  onChange={(e) =>
                    setCurrentWarehouse({
                      ...currentWarehouse,
                      address: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 bg-white text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter warehouse address"
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={currentWarehouse.capacity || ""}
                  onChange={(e) =>
                    setCurrentWarehouse({
                      ...currentWarehouse,
                      capacity: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 bg-white text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter capacity"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Manager ID</label>
                <input
                  type="number"
                  value={currentWarehouse.manager_id || ""}
                  onChange={(e) =>
                    setCurrentWarehouse({
                      ...currentWarehouse,
                      manager_id: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 bg-white text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter manager ID"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
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