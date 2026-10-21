// src/components/LowStockAlert.jsx
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { AlertCircle } from "lucide-react";

export default function LowStockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const fetchLowStock = async () => {
    const { data, error } = await api
      .from("products")
      .select("*")
      .lt("stock", 5); // أقل من 5

    if (!error) setLowStockProducts(data || []);
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  if (lowStockProducts.length === 0) return null;

  return (
    <div className="bg-red-600 bg-opacity-80 text-white p-4 rounded-xl shadow animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle size={20} />
        <h3 className="font-bold">Low Stock Alert</h3>
      </div>

      <ul className="list-disc list-inside space-y-1 text-sm">
        {lowStockProducts.map((p) => (
          <li key={p.id}>
            {p.name} - Stock: {p.stock}
          </li>
        ))}
      </ul>
    </div>
  );
}
