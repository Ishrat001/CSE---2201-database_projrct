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
    <div className="min-h-screen bg-white p-6">
      {/* Main Content */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Employee Management
        </h1>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">All Employees</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium shadow-sm space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Employee</span>
            </button>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200">
              {successMessage}
            </div>
          )}

          {/* Employee Table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600 mt-2">Loading employees...</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-indigo-600">
                  <tr>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">ID</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Name</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Email</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Phone</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Job Title</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Salary</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-left">Join Date</th>
                    <th className="border border-gray-300 p-3 text-white font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.employee_id} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="border border-gray-300 p-3 text-gray-700 font-mono">{emp.employee_id}</td>
                      <td className="border border-gray-300 p-3 text-gray-800 font-medium">{emp.name}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{emp.email}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{emp.phone}</td>
                      <td className="border border-gray-300 p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {emp.job_title}
                        </span>
                      </td>
                      <td className="border border-gray-300 p-3 text-green-600 font-semibold">${emp.salary}</td>
                      <td className="border border-gray-300 p-3 text-gray-600">{emp.join_date}</td>
                      <td className="border border-gray-300 p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(emp)}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium text-sm shadow-sm flex items-center gap-1"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(emp.employee_id)}
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

        {/* Add Employee Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50">
            <div className="absolute inset-0 bg-black/50 pointer-events-auto"></div>
            <div className="bg-white p-6 rounded-2xl w-96 pointer-events-auto shadow-2xl z-50 border border-gray-300">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Employee</h2>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="text"
                name="job_title"
                placeholder="Job Title"
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              />
              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: e.target.value })
                }
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

        {/* Update Modal */}
        {modalOpen && selectedEmployee && (
          <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50">
            <div className="absolute inset-0 bg-black/50 pointer-events-auto"></div>
            <div className="bg-white p-6 rounded-2xl w-96 pointer-events-auto shadow-2xl z-50 border border-gray-300">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Employee</h2>

              <input
                type="text"
                value={selectedEmployee.employee_id}
                disabled
                className="border border-gray-300 bg-gray-100 text-gray-600 p-3 mb-3 w-full rounded-lg cursor-not-allowed"
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
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="border border-gray-300 bg-white text-gray-800 p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalOpen(false)}
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