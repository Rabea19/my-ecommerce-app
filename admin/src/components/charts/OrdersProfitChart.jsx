import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function OrdersProfitChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: orders, error } = await api
        .from("orders")
        .select("*")
        .eq("status", "completed");

      if (!error) {
        // تجميع البيانات حسب اليوم
        const grouped = {};

        orders.forEach((o) => {
          const date = new Date(o.created_at).toLocaleDateString();

          if (!grouped[date]) {
            grouped[date] = {
              profit: 0,
              orders: 0,
            };
          }

          grouped[date].profit += o.total_price;
          grouped[date].orders += 1;
        });

        const chartData = Object.keys(grouped).map((date) => ({
          date,
          profit: grouped[date].profit,
          orders: grouped[date].orders,
        }));

        setData(chartData);
      } else {
        console.log(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Completed Orders Revenue</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="profit" fill="#34d399" name="Profit" />
          <Bar dataKey="orders" fill="#60a5fa" name="Orders" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
