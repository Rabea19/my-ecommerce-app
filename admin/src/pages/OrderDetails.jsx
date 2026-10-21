import { useRecords, money, date } from "../lib/admin";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { PageHeader, State, Status } from "../components/AdminUI";
export default function OrderDetails() {
  const { id } = useParams(),
    navigate = useNavigate();
  const { data, loading, error, refresh } = useRecords("orders");
  const [busy, setBusy] = useState(false);
  const order = data.find((o) => o.id === id);
  async function update(status) {
    setBusy(true);
    const { error } = await api.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Order updated");
      await refresh();
    }
    setBusy(false);
  }
  async function remove() {
    if (!window.confirm("Delete this order?")) return;
    setBusy(true);
    const { error } = await api.from("orders").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      setBusy(false);
    } else navigate("/orders");
  }
  return (
    <>
      <PageHeader title="Order details" subtitle="Every item, every detail.">
        <Link className="btn-soft" to="/orders">
          Back to Orders
        </Link>
      </PageHeader>
      <State loading={loading} error={error} onRetry={refresh} />
      {!loading && !error && !order && (
        <p className="panel">Order not found.</p>
      )}
      {!loading && !error && order && (
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
          <section className="panel">
            <h2 className="font-serif text-xl mb-5">Items in this order</h2>
            {order.products.map((p, i) => (
              <div key={i} className="flex gap-4 border-t py-5">
                {p.image && (
                  <img
                    src={p.image}
                    alt=""
                    className="w-14 h-14 rounded-lg object-contain shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="muted mt-1">{p.category}</p>
                  <p className="text-sm mt-2">
                    {p.quantity} × {money(p.price)}
                  </p>
                </div>
              </div>
            ))}
          </section>
          <section className="panel h-fit">
            <Status value={order.status} />
            <p className="break-all text-sm mt-5">{order.id}</p>
            <p className="muted mt-2">Placed {date(order.created_at)}</p>
            <p className="text-2xl font-semibold my-6">
              {money(order.total_price)}
            </p>
            <label className="text-sm">
              Order status
              <select
                className="field mt-2"
                value={order.status}
                disabled={busy || order.status !== "pending"}
                onChange={(e) => update(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
              </select>
            </label>
            <p className="muted text-xs my-4">
              Completed and canceled orders are final. Canceling restores the
              stock.
            </p>
            <button
              className="btn-soft text-red-700"
              disabled={busy || order.status === "pending"}
              onClick={remove}
            >
              Delete Order
            </button>
          </section>
        </div>
      )}
    </>
  );
}
