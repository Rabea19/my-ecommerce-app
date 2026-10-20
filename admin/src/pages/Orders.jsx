import { useRecords, money, date } from "../lib/admin";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { PageHeader, State, Status } from "../components/AdminUI";
export default function Orders() {
  const { data, loading, error, refresh } = useRecords("orders");
  const [q, setQ] = useState(""),
    [filter, setFilter] = useState("all"),
    [busy, setBusy] = useState(false);
  const filtered = data.filter(
    (o) =>
      o.id.toLowerCase().includes(q.toLowerCase()) &&
      (filter === "all" || o.status === filter),
  );
  async function update(o, status) {
    setBusy(true);
    const { error } = await api
      .from("orders")
      .update({ status })
      .eq("id", o.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Order status updated");
      await refresh();
    }
    setBusy(false);
  }
  async function remove(o) {
    if (!window.confirm("Delete this order from the list?")) return;
    setBusy(true);
    const { error } = await api.from("orders").delete().eq("id", o.id);
    if (error) toast.error(error.message);
    else await refresh();
    setBusy(false);
  }
  const controls = (o) => (
    <div className="flex flex-wrap gap-2">
      <select
        aria-label={"Status for " + o.id}
        className="field !w-auto"
        value={o.status}
        disabled={busy || o.status !== "pending"}
        onChange={(e) => update(o, e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="canceled">Canceled</option>
      </select>
      <button
        className="btn-soft text-red-700"
        disabled={busy || o.status === "pending"}
        onClick={() => remove(o)}
      >
        Delete
      </button>
    </div>
  );
  return (
    <>
      <PageHeader
        title="Orders"
        subtitle="Follow each order from the first click to completion."
      >
        <button className="btn-soft" disabled={loading} onClick={refresh}>
          Refresh orders
        </button>
      </PageHeader>
      <div className="panel mb-6 flex flex-wrap gap-3">
        <input
          className="field flex-1 min-w-[150px]"
          aria-label="Search orders"
          placeholder="Search order ID…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="field sm:w-48"
          aria-label="Filter order status"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
        <p className="muted w-full">
          {filtered.length} orders · Completed and canceled orders are final.
          Cancel pending orders before deleting.
        </p>
      </div>
      <State
        loading={loading}
        error={error}
        empty={!filtered.length}
        onRetry={refresh}
      />
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="hidden md:block panel !p-0 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link
                        className="font-semibold text-[#50345f]"
                        to={"/orders/" + o.id}
                      >
                        {o.id}
                      </Link>
                    </td>
                    <td>{date(o.created_at)}</td>
                    <td>{money(o.total_price)}</td>
                    <td>
                      <Status value={o.status} />
                    </td>
                    <td>{controls(o)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="md:hidden space-y-4">
            {filtered.map((o) => (
              <article className="panel" key={o.id}>
                <div className="flex justify-between gap-2">
                  <Status value={o.status} />
                  <span className="muted text-xs">{date(o.created_at)}</span>
                </div>
                <Link
                  className="block break-all font-semibold text-[#50345f] my-4"
                  to={"/orders/" + o.id}
                >
                  {o.id}
                </Link>
                <p className="text-lg mb-4">{money(o.total_price)}</p>
                {controls(o)}
              </article>
            ))}
          </div>
        </>
      )}
    </>
  );
}
