"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Warehouses</h1>
      <button
        onClick={handleAdd}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add New Warehouse
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Capacity</th>
              <th className="p-2 border">Manager ID</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((wh) => (
              <tr key={wh.warehouse_id}>
                <td className="border p-2">{wh.warehouse_id}</td>
                <td className="border p-2">{wh.warehouse_name}</td>
                <td className="border p-2">{wh.address}</td>
                <td className="border p-2">{wh.capacity}</td>
                <td className="border p-2">{wh.manager_id}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(wh)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(wh.warehouse_id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Update Warehouse" : "Add Warehouse"}
            </h2>

            {isEditing && (
              <div className="mb-2">
                <label className="block text-sm font-medium">Warehouse ID</label>
                <input
                  type="text"
                  value={currentWarehouse.warehouse_id}
                  disabled
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>
            )}

            <div className="mb-2">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={currentWarehouse.warehouse_name || ""}
                onChange={(e) =>
                  setCurrentWarehouse({
                    ...currentWarehouse,
                    warehouse_name: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                value={currentWarehouse.address || ""}
                onChange={(e) =>
                  setCurrentWarehouse({
                    ...currentWarehouse,
                    address: e.target.value,
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium">Capacity</label>
              <input
                type="number"
                value={currentWarehouse.capacity || ""}
                onChange={(e) =>
                  setCurrentWarehouse({
                    ...currentWarehouse,
                    capacity: Number(e.target.value),
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Manager ID</label>
              <input
                type="number"
                value={currentWarehouse.manager_id || ""}
                onChange={(e) =>
                  setCurrentWarehouse({
                    ...currentWarehouse,
                    manager_id: Number(e.target.value),
                  })
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded"
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
