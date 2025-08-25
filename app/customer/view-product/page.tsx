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

  if (loading) return <p className="p-6">Loading products...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div key={prod.product_id} className="border p-4 rounded shadow">
            <h2 className="font-bold text-lg">{prod.product_name}</h2>
            <p className="text-sm text-gray-500">ID: {prod.product_id}</p>
            <p className="text-sm text-gray-600">{prod.description}</p>
            <p className="mt-2 font-semibold">Category: {prod.category}</p>
            <p className="mt-1 font-semibold">Price: ${prod.unit_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}