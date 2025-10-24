"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  function RoleSelection() {
    const roles = [
  { 
    name: "Customer", 
    color: "bg-sky-500 hover:bg-sky-400 shadow-lg shadow-sky-500/30", 
    path: "/customer/register" 
  },
  { 
    name: "Manager", 
    color: "bg-pink-500 hover:bg-pink-400 shadow-lg shadow-pink-500/30", 
    path: "/manager/register" 
  },
  { 
    name: "Employee", 
    color: "bg-purple-500 hover:bg-pluple-400 shadow-lg shadow-purple-500/30", 
    path: "/employee/register" 
  },
];

    return (
      <section className="py-20 bg-gradient-to-br from-gray-100 to-gray-100 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 text-gray-800"
          >
            Join Our Supply Chain Network
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Are you a Customer, Manager, or Employee? Select your role to get started.
          </motion.p>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            {roles.map((role) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`${role.color} text-white px-8 py-6 rounded-xl shadow-lg cursor-pointer text-lg font-semibold transition-all duration-300 hover:shadow-xl flex-1 max-w-xs`}
                onClick={() => router.push(role.path)}
              >
                {role.name}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-white text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section
        className="h-screen flex flex-col justify-center items-center text-center relative px-6"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/download.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-white"
          >
            Welcome to the SCM System
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="mb-8 text-xl max-w-2xl mx-auto text-gray-100"
          >
            Track suppliers, products, orders, and logistics efficiently with our comprehensive supply chain management platform.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10"
          >
            <div className="h-1 w-24 bg-blue-500 mx-auto mb-8 rounded-full"></div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-white text-4xl"
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Image Section 1 */}
      <section className="py-20 flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Suppliers & Products</h2>
          <p className="text-lg text-gray-600 mb-6">
            Manage suppliers and keep track of all product information with ease. Our platform provides real-time insights into your supply chain operations.
          </p>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg inline-block font-medium">
            Efficient Management
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.03 }}
          className="flex-1 flex justify-center items-center rounded-2xl overflow-hidden shadow-xl h-80"
        >
          <img
            src="/images/image1.jpeg"
            alt="Supply Chain"
            className="rounded-2xl h-80 w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </motion.div>
      </section>

      {/* Image Section 2 */}
      <section className="py-20 flex flex-col-reverse md:flex-row items-center gap-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.03 }}
          className="flex-1 flex justify-center items-center rounded-2xl overflow-hidden shadow-xl h-80"
        >
          <img
            src="/images/image2.jpeg"
            alt="Supply Chain"
            className="rounded-2xl h-80 w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="flex-1 text-center md:text-left"
        >
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Orders & Logistics</h2>
          <p className="text-lg text-gray-600 mb-6">
            Streamline order processing, shipments, and warehouse logistics. Our advanced tracking system ensures seamless operations from order to delivery.
          </p>
          <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg inline-block font-medium">
            Seamless Tracking
          </div>
        </motion.div>
      </section>

      {/* Role Selection Section */}
      <RoleSelection />

      {/* Supply Chain Images Section */}
      <section className="py-20 max-w-6xl mx-auto px-6 bg-gradient-to-b black">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4 text-center text-gray-800"
        >
          Supply Chain Overview
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto"
        >
          Explore our comprehensive supply chain management features designed to optimize your operations.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["/images/image3.jpeg", "/images/image4.jpeg", "/images/image2.jpeg"].map(
            (src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="rounded-2xl overflow-hidden shadow-lg h-60 transition-all duration-300 hover:shadow-xl"
              >
                <img
                  src={src}
                  alt={`Supply Chain ${idx + 1}`}
                  className="h-60 w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Footer with Developer Information */}
<footer className="bg-gradient-to-br from-gray-900 to-black text-white py-16 px-6">
  <div className="max-w-6xl mx-auto">
    {/* Main footer content */}
    <h3 className="text-center text-2xl font-bold mb-4">SCM System</h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto text-center">
        Streamlining your supply chain operations with cutting-edge technology and innovative solutions.
      </p>
    
    {/* Developer Section */}
    <div className="border-t border-gray-800 pt-12">
      <h4 className="text-xl font-bold text-center mb-8">Our Development Team</h4>
      <div className="flex flex-wrap justify-center gap-8">
        {/* Developer 1 */}
        <div className="text-center">
          <h5 className="font-semibold">Ishrat Jahan Mim</h5>
          <p className="text-gray-400 text-sm">Lead Developer</p>
          <p className="text-gray-400 text-sm">ishratcsedu29@gmail.com</p>

        </div>
        
        {/* Developer 2 */}
        <div className="text-center">
          <h5 className="font-semibold">Tabassum Kabir</h5>
          <p className="text-gray-400 text-sm">Frontend Specialist</p>
          <p className="text-gray-400 text-sm">sanzidaakter@gmail.com</p>
        </div>
      </div>
    </div>
    
    {/* Copyright */}
    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} SCM System. All rights reserved.</p>
    </div>
  </div>
</footer>
    </div>
  );
}