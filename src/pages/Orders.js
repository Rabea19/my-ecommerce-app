import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../lib/api";
import { money } from "../lib/catalog";
export default function Orders() {
  const [orders, setOrders] = useState([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [version, setVersion] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    request("/orders")
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [version]);
  return (
    <main className="wrap max-w-4xl py-12">
      <p className="eyebrow mb-3">Your market</p>
      <h1 className="heading mb-8">My orders</h1>
      <button
        className="btn-outline mb-6"
        disabled={loading}
        onClick={() => setVersion((v) => v + 1)}
      >
        Refresh status
      </button>
      {loading ? (
        <p role="status">Loading your orders…</p>
      ) : error ? (
        <p role="alert" className="panel text-red-700">
          {error}
        </p>
      ) : !orders.length ? (
        <div className="panel">
          <p className="mb-5">Your story starts with your first find.</p>
          <Link className="btn" to="/collection">
            Explore the collection
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="panel">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h2 className="font-medium">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </h2>
                  <p className="mt-2 text-xs text-ink/60">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="h-fit rounded-full bg-lilac px-4 py-2 text-xs capitalize text-plum">
                  {order.status}
                </span>
              </div>
              <ul className="my-6 space-y-3 border-y border-plum/10 py-5">
                {order.products.map((p) => (
                  <li key={p.id} className="flex justify-between gap-4 text-sm">
                    <span>
                      {p.title} × {p.quantity}
                    </span>
                    <span>{money(p.price * p.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-right font-semibold">
                Total {money(order.total_price)}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
