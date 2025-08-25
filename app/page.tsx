"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  function RoleSelection() {
  
  const roles = [
    { name: "Customer", color: "bg-blue-500", path: "/customer/register" },
    { name: "Manager", color: "bg-red-500", path: "/manager" },
    { name: "Employee", color: "bg-green-500", path: "/employee/register" },
  ];

  return (
    <section className="py-20 bg-gray-100 text-center">
      <h2 className="text-3xl font-bold mb-6">
        Are you a Customer, manager, or Employee?
      </h2>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {roles.map((role) => (
          <motion.div
            key={role.name}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`${role.color} text-white px-6 py-6 rounded-xl shadow-lg cursor-pointer text-lg font-semibold transition-transform`}
            onClick={() => router.push(role.path)}
          >
            {role.name}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

  return (
    <div className="bg-gray-50 text-gray-900">
    {/* Hero Section */}
    <section
      className="h-screen flex flex-col justify-center items-center text-center relative px-6"
      style={{
        backgroundImage: "url('/images/image4.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
    {/* <div className="absolute inset-0 bg-black bg-opacity-50"></div> */}
    

    <div className="relative z-10">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-bold mb-4 text-white"
      >
        Welcome to the SCM System
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="mb-6 text-lg max-w-2xl mx-auto text-white"
      >
        Track suppliers, products, orders, and logistics efficiently.
      </motion.p>
    </div>
  </section>
        
      {/* Image Section 1 */}
      <section className="py-20 flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto px-6">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">Suppliers & Products</h2>
          <p className="text-lg text-gray-600">
            Manage suppliers and keep track of all product information with ease.
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-1 flex justify-center items-center bg-gray-200 rounded-2xl shadow-lg h-80"
        >
        <img
          src="/images/image1.jpeg"
          alt="Supply Chain"
          className="rounded-2xl shadow-lg h-80 w-full object-cover"
        />

        </motion.div>
      </section>

      {/* Image Section 2 */}
      <section className="py-20 flex flex-col-reverse md:flex-row items-center gap-10 max-w-6xl mx-auto px-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex-1 flex justify-center items-center bg-gray-200 rounded-2xl shadow-lg h-80"
        >
        <img
          src="/images/image2.jpeg"
          alt="Supply Chain"
          className="rounded-2xl shadow-lg h-80 w-full object-cover"
        />

        </motion.div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-4">Orders & Logistics</h2>
          <p className="text-lg text-gray-600">
            Streamline order processing, shipments, and warehouse logistics.
          </p>
        </div>
      </section>

           {/* Role Selection Section */}
          <RoleSelection />

      {/* Supply Chain Images Section */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Supply Chain Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["/images/image3.jpeg", "/images/image4.jpeg", "/images/image2.jpeg"].map(
          (src, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-200 rounded-2xl shadow-lg h-60 overflow-hidden"
          >
            <img
              src={src}
              alt={`Supply Chain ${idx + 1}`}
              className="h-60 w-full object-cover"
            />
          </motion.div>
        )
      )}
        </div>
      </section>
    </div>
  );
}