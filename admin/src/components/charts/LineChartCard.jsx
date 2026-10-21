import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AreaChartCard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: products, error } = await api
        .from("products")
        .select("*");
      if (!error) {
        const chartData = products.map((p) => ({
          name: p.name,
          stock: p.stock,
          price: p.price,
        }));
        setData(chartData);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Stock vs Price</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="stock"
            stroke="#34d399"
            fill="#34d39933"
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#60a5fa"
            fill="#60a5fa33"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
