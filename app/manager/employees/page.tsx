"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

type Employee = {
  employee_id: string;
  email: string;
  phone: string;
  job_title: string;
  salary: number;
  name: string;
  join_date: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  // modals
  const [showModal, setShowModal] = useState(false); // Add Employee Modal
  const [modalOpen, setModalOpen] = useState(false); // Update Employee Modal

  // form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    job_title: "",
    salary: "",
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");

  // ----------------- Fetch Employees -----------------
  async function fetchEmployees() {
    setLoading(true);
    const { data, error } = await supabase.from("employees").select("*");
    if (error) {
      console.error("Error fetching employees:", error.message);
      setLoading(false);
      return;
    }
    setEmployees(data as Employee[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ----------------- Add Employee -----------------
  const handleAddSave = async () => {
    const { error } = await supabase.from("employees").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        job_title: formData.job_title,
        salary: parseFloat(formData.salary),
      },
    ]);
    if (error) {
      console.error(error.message);
      return;
    }
    fetchEmployees();
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", job_title: "", salary: "" });
  };

  // ----------------- Save Updated Employee -----------------
  const handleSave = async () => {
    if (!selectedEmployee) return;

    const { error } = await supabase
      .from("employees")
      .update({
        phone: selectedEmployee.phone,
        job_title: selectedEmployee.job_title,
        salary: selectedEmployee.salary,
      })
      .eq("employee_id", selectedEmployee.employee_id);

    if (error) {
      console.error(error.message);
      return;
    }

    setSuccessMessage("Employee information updated successfully!");
    setModalOpen(false);
    fetchEmployees();
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ----------------- Delete Employee -----------------
  const handleDelete = async (employee_id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirm) return;

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("employee_id", employee_id);
    if (error) {
      console.error(error.message);
      return;
    }
    fetchEmployees();
  };

  // ----------------- Edit Employee -----------------
  const handleEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Employees</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
          {successMessage}
        </div>
      )}

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Join Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-black">
            {employees.map((emp) => (
              <tr key={emp.employee_id}>
                <td className="px-6 py-4">{emp.employee_id}</td>
                <td className="px-6 py-4">{emp.name}</td>
                <td className="px-6 py-4">{emp.email}</td>
                <td className="px-6 py-4">{emp.phone}</td>
                <td className="px-6 py-4">{emp.job_title}</td>
                <td className="px-6 py-4">{emp.salary}</td>
                <td className="px-6 py-4">{emp.join_date}</td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilSquareIcon className="w-5 h-5 inline" /> Update
                  </button>
                  <button
                    onClick={() => handleDelete(emp.employee_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5 inline" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-4">Loading...</p>}
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none">
          <div className="bg-white p-6 rounded-lg w-96 pointer-events-auto shadow-lg z-50">
            <h2 className="text-xl font-semibold mb-4">Add Employee</h2>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="border p-2 mb-3 w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border p-2 mb-3 w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="border p-2 mb-3 w-full"
            />
            <input
              type="text"
              name="job_title"
              placeholder="Job Title"
              value={formData.job_title}
              onChange={(e) =>
                setFormData({ ...formData, job_title: e.target.value })
              }
              className="border p-2 mb-3 w-full"
            />
            <input
              type="number"
              name="salary"
              placeholder="Salary"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
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

      {/* Update Modal */}
      {modalOpen && selectedEmployee && (
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none">
          <div className="bg-white p-6 rounded-lg w-96 pointer-events-auto shadow-lg z-50">
            <h2 className="text-xl font-semibold mb-4">Update Employee</h2>

            <input
              type="text"
              value={selectedEmployee.employee_id}
              disabled
              className="border p-2 mb-3 w-full bg-gray-100"
            />

            <input
              type="text"
              placeholder="Phone"
              value={selectedEmployee.phone}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  phone: e.target.value,
                })
              }
              className="border p-2 mb-3 w-full"
            />

            <input
              type="text"
              placeholder="Job Title"
              value={selectedEmployee.job_title}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  job_title: e.target.value,
                })
              }
              className="border p-2 mb-3 w-full"
            />

            <input
              type="number"
              placeholder="Salary"
              value={selectedEmployee.salary}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  salary: parseFloat(e.target.value),
                })
              }
              className="border p-2 mb-4 w-full"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
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
