import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#facc15", "#f87171", "#8b5cf6"];

export default function PieChartCard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: products, error } = await api
        .from("products")
        .select("*");
      if (!error) {
        const chartData = products.map((p) => ({
          name: p.name,
          value: Number(p.stock),
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
      <h3 className="font-semibold mb-2">Stock Pie Chart</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            fill="#3b82f6"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
