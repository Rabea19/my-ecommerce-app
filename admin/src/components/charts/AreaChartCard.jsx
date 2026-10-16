import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
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
          price: Number(p.price),
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
      <h3 className="font-semibold mb-2">Price & Stock Area Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid stroke="#555" strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            fill="#3b82f6"
          />
          <Area
            type="monotone"
            dataKey="stock"
            stroke="#10b981"
            fill="#10b981"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
