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
  const [isLoading, setIsLoading] = useState(false);
  
  // Employee register fields
  const [employeeName, setEmployeeName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [joinDate, setJoinDate] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      alert("❌ Login failed: " + error.message);
    } else {
      alert("✅ Login successful!");
      router.push("/employee/homepage");
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("❌ Auth register failed: " + error.message);
      setIsLoading(false);
      return;
    }

    const user = data.user;
    if (!user) {
      alert("❌ Register failed, user is null.");
      setIsLoading(false);
      return;
    }

    // Insert into Employees table
    const { error: insertError } = await supabase.from("employees").insert([
      {
        employee_id: user.id,
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
    } else {
      alert("✅ Account created successfully!");
      setIsRegister(false);
    }
    setIsLoading(false);
  };

  return (
    <div 
      className="h-screen flex flex-col justify-center items-center text-center relative px-6"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/download.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
      {/* Main Content Box - Directly on Background */}
      <div className="w-full max-w-md bg backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/30">
        
        {/* Header with Gradient Overlay */}
        <div 
          className="p-6 text-white relative bg-cover bg-center" 
        ></div>
          {/* Dark Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]"></div>
          
          {/* Header Content */}
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-center text-black ">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-black text-center text-sm mt-2">
              {isRegister ? "Join our team today" : "Sign in to your account"}
            </p>

        {/* Form Section */}
        <div className="p-6 space-y-4">
          {isRegister && (
            <div className="space-y-3 animate-fadeIn">
              <input
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Full Name"
                className="w-full border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-black"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-black"
              />
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job Title"
                className="w-full border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-black"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Salary"
                  className="border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-black"
                />
                <input
                  type="date"
                  value={joinDate}
                  onChange={(e) => setJoinDate(e.target.value)}
                  className="border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-black"
                />
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-black"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-black"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={isRegister ? handleRegister : handleLogin}
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              isRegister ? "Create Account" : "Sign In"
            )}
          </button>

          {/* Toggle Section */}
          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-black text-sm">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-black font-semibold duration-200 underline"
              >
                {isRegister ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>
          </div>
      </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}