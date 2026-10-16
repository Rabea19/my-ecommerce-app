import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data, error } = await api
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data);
    } else {
      alert(error.message);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { error } = await api
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (!error) fetchOrders();
    else alert(error.message);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Orders</h2>

      <div className="bg-gray-800 rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-gray-300 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Total Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                <td className="px-6 py-4">
                  <Link
                    to={`/orders/${order.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {order.id}
                  </Link>
                </td>
                <td className="px-6 py-4">${order.total_price}</td>
                <td className="px-6 py-4">
                  <select
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    className="bg-red-600 px-2 py-1 rounded text-white"
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        "Are you sure you want to delete this order?",
                      );
                      if (!confirmDelete) return;

                      const { error } = await api
                        .from("orders")
                        .delete()
                        .eq("id", order.id);

                      if (!error) fetchOrders();
                      else alert(error.message);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td className="px-6 py-4" colSpan="5">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
