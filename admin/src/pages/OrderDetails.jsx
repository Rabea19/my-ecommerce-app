import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    const { data, error } = await api
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setOrder(data);
      setStatus(data.status);
    } else alert(error.message);

    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    const { error } = await api
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setStatus(newStatus);
      setTimeout(() => setUpdating(false), 400);
    } else {
      alert(error.message);
      alert("Failed to update status");
      setUpdating(false);
    }
  };

  const deleteOrder = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?",
    );
    if (!confirmDelete) return;

    const { error } = await api.from("orders").delete().eq("id", id);

    if (!error) {
      alert("Order deleted!");
      navigate("/orders");
    } else {
      alert(error.message);
      alert("Failed to delete order");
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="p-6 text-white">
        Order not found
        <button
          className="ml-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition transform hover:scale-105"
          onClick={() => navigate("/orders")}
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 animate-slide-in">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 transition-transform duration-500 ease-in-out">
        <p>
          <span className="font-semibold">Order ID:</span> {order.id}
        </p>

        <p>
          <span className="font-semibold">Status:</span>{" "}
          <div className="relative inline-block">
            <select
              value={status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updating}
              className={`bg-gray-700 text-white px-3 py-1 rounded transition-all duration-300 ease-in-out ${
                updating ? "opacity-50 animate-fade" : "opacity-100"
              }`}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="canceled">Cancelled</option>
            </select>
            {updating && (
              <div className="absolute top-0 left-0 w-full h-full bg-yellow-400 bg-opacity-30 rounded pointer-events-none animate-pulse"></div>
            )}
          </div>
        </p>

        <p>
          <span className="font-semibold">Total Price:</span> $
          {order.total_price}
        </p>

        <h3 className="text-xl font-semibold mt-4">Products:</h3>
        <ul className="space-y-3">
          {order.products.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-4 bg-gray-700 p-3 rounded-lg transform transition duration-300 hover:scale-105 hover:bg-gray-600"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded transition-transform duration-300 hover:scale-110"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">{item.title}</p>
                <p>Category: {item.category}</p>
                <p>
                  Quantity: {item.quantity} x ${item.price}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate("/orders")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition transform hover:scale-105"
          >
            Back to Orders
          </button>

          <button
            onClick={deleteOrder}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition transform hover:scale-105"
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  );
}
