"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const router = useRouter();

  // Common states
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Employee register fields
  const [employeeName, setEmployeeName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [joinDate, setJoinDate] = useState(""); // yyyy-mm-dd

  // ---- Login ----
  const handleLogin = async () => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("❌ Login failed: " + error.message);
    } else {
      alert("✅ Login successful!");
      router.push("/employee/homepage"); // redirect page
    }
  };

  // ---- Register ----
  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("❌ Auth register failed: " + error.message);
      return;
    }

    const user = data.user;
    if (!user) {
      alert("❌ Register failed, user is null.");
      return;
    }

    // insert into Employees table
    const { error: insertError } = await supabase.from("employees").insert([
      {
        employee_id: user.id, // use auth id as PK
        name: employeeName,
        email: email,
        phone: phone,
        job_title: jobTitle,
        salary: salary ? Number(salary) : null,
        join_date: joinDate ? joinDate : new Date().toISOString().split("T")[0],
      },
    ]);

    if (insertError) {
      alert("❌ Failed to insert into Employees table: " + insertError.message);
      return;
    }

    alert("✅ Account created successfully!");
    setIsRegister(false); // back to login after register
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Background blur */}
      <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center blur-sm" />
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Modal Box */}
      <div className="relative flex items-center justify-center h-full">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {isRegister ? "Register" : "Login"}
          </h2>

          {isRegister ? (
            <>
              <input
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Employee Name"
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title"
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Salary"
                className="w-full border p-2 mb-2 rounded"
              />
              <input
                type="date"
                value={joinDate}
                onChange={(e) => setJoinDate(e.target.value)}
                placeholder="Join Date"
                className="w-full border p-2 mb-2 rounded"
              />
            </>
          ) : null}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border p-2 mb-2 rounded"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border p-2 mb-4 rounded"
          />

          <button
            onClick={isRegister ? handleRegister : handleLogin}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          <p className="mt-4 text-center text-sm">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsRegister(false)}
                  className="text-blue-600 underline"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsRegister(true)}
                  className="text-blue-600 underline"
                >
                  Register
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

