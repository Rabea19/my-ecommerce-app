// src/components/CategoryStats.jsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";

const categories = ["Mobiles", "Laptops", "Accessories", "Tablets"];

export default function CategoryStats() {
  const [counts, setCounts] = useState({});

  const fetchCounts = async () => {
    const newCounts = {};
    for (let cat of categories) {
      const { count, error } = await api
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category", cat);
      if (!error) newCounts[cat] = count;
      else newCounts[cat] = 0;
    }
    setCounts(newCounts);
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {categories.map((cat) => (
        <div
          key={cat}
          className="bg-gray-800 p-4 rounded-xl shadow hover:scale-105 transition"
        >
          <h3 className="text-gray-400 text-sm">{cat}</h3>
          <p className="text-2xl font-bold">{counts[cat] ?? 0}</p>
          <p className="text-xs text-gray-500">Products</p>
        </div>
      ))}
    </div>
  );
}
