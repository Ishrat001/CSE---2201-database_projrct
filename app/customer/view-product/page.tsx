"use client";

import React from "react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  product_id: string; // primary key
  product_name: string;
  description: string;
  category: string;
  unit_price: number;
}

export default function ViewProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-700">Loading products...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mt-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
              <p className="text-gray-600 mt-2">Discover our amazing collection of products</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">No products available</h3>
              <p className="mt-2 text-gray-500">Check back later for new products.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div 
                  key={prod.product_id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h2 className="font-bold text-xl text-gray-800">{prod.product_name}</h2>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {prod.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">ID: {prod.product_id}</p>
                    <p className="text-gray-600 mt-3">{prod.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-2xl font-bold text-purple-600">TK{prod.unit_price}</span>
                      <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}