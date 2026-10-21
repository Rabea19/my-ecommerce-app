import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function BarChartCard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: products, error } = await api
        .from("products")
        .select("*");
      if (!error) {
        const chartData = products.map((p) => ({
          name: p.name,
          stock: Number(p.stock),
        }));
        setData(chartData);
      } else {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="font-semibold mb-2">Stock Bar Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid stroke="#555" strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="stock" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
