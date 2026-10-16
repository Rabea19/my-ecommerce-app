// src/components/ProductAnalytics.jsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const categories = ["Mobiles", "Laptops", "Accessories", "Tablets"];
const COLORS = ["#4f46e5", "#facc15", "#14b8a6", "#f97316"];

export default function ProductAnalytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [stockData, setStockData] = useState([]);

  const fetchData = async () => {
    // ✅ Category Counts
    const catCounts = [];
    for (let cat of categories) {
      const { count, error } = await api
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("category", cat);
      catCounts.push({ name: cat, value: error ? 0 : count });
    }
    setCategoryData(catCounts);

    // ✅ Low Stock vs Normal
    const { count: lowStockCount } = await api
      .from("products")
      .select("*", { count: "exact", head: true })
      .lt("stock", 5);

    const { count: totalCount } = await api
      .from("products")
      .select("*", { count: "exact", head: true });

    setStockData([
      { name: "Low Stock", value: lowStockCount || 0 },
      { name: "In Stock", value: (totalCount || 0) - (lowStockCount || 0) },
    ]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Category Distribution */}
      <div className="bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="text-white font-bold mb-2">Products by Category</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Distribution */}
      <div className="bg-gray-800 p-4 rounded-xl shadow">
        <h3 className="text-white font-bold mb-2">Stock Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={stockData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#82ca9d"
              label
            >
              {stockData.map((entry, index) => (
                <Cell
                  key={`cell-stock-${index}`}
                  fill={index === 0 ? "#ef4444" : "#4ade80"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
