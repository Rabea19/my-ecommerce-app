import { useRecords, money, date } from "../lib/admin";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShoppingBag,
  Package,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader, State, Status } from "../components/AdminUI";
export default function Dashboard() {
  const orders = useRecords("orders"),
    products = useRecords("products"),
    users = useRecords("users");
  const loading = orders.loading || products.loading || users.loading,
    error = orders.error || products.error || users.error;
  const refresh = () => {
    orders.refresh();
    products.refresh();
    users.refresh();
  };
  const completed = orders.data.filter((o) => o.status === "completed"),
    low = products.data.filter((p) => p.stock < 5);
  const stats = [
    [
      "Completed revenue",
      money(completed.reduce((a, o) => a + Number(o.total_price), 0)),
      Wallet,
      "From completed orders only",
    ],
    [
      "Orders",
      orders.data.length,
      ShoppingBag,
      `${orders.data.filter((o) => o.status === "pending").length} awaiting action`,
    ],
    [
      "Products",
      products.data.length,
      Package,
      `${low.length} with fewer than 5 units`,
    ],
    [
      "Customers",
      users.data.filter((u) => u.role !== "admin").length,
      Users,
      "Registered customer accounts",
    ],
  ];
  return (
    <>
      <PageHeader
        title="A little overview."
        subtitle="A clear view of your store, all in one place."
      >
        <button className="btn-soft" onClick={refresh} disabled={loading}>
          Refresh overview
        </button>
      </PageHeader>
      <State loading={loading} error={error} onRetry={refresh} />
      {!loading && !error && (
        <>
          <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
            {stats.map(([label, value, Icon, note]) => (
              <div className="panel" key={label}>
                <div className="flex justify-between gap-2 muted">
                  <span>{label}</span>
                  <Icon size={19} className="text-[#9779a3]" />
                </div>
                <p className="text-2xl font-semibold mt-5 break-words">
                  {value}
                </p>
                <p className="muted text-xs mt-3">{note}</p>
              </div>
            ))}
          </section>
          <section className="grid xl:grid-cols-[1.6fr_1fr] gap-6">
            <div className="panel">
              <div className="flex justify-between gap-3 mb-6">
                <h2 className="text-xl font-serif">Recent orders</h2>
                <Link className="text-sm text-[#50345f]" to="/orders">
                  View all ↗
                </Link>
              </div>
              {orders.data.slice(0, 6).map((o) => (
                <Link
                  key={o.id}
                  to={"/orders/" + o.id}
                  className="flex flex-wrap justify-between gap-3 py-4 border-t border-[#eee8ef]"
                >
                  <div>
                    <p className="text-sm font-semibold">#{o.id.slice(-8)}</p>
                    <p className="muted text-xs mt-1">{date(o.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm mb-1">{money(o.total_price)}</p>
                    <Status value={o.status} />
                  </div>
                </Link>
              ))}
              {!orders.data.length && (
                <p className="muted py-8">
                  Your first orders will appear here.
                </p>
              )}
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#50345f] text-white p-6">
                <p className="text-xs uppercase tracking-widest text-[#dac9e3]">
                  The everyday edit
                </p>
                <h2 className="font-serif text-3xl mt-4 mb-3">
                  Make room for
                  <br />
                  something new.
                </h2>
                <p className="text-sm text-[#e0d3e6]">
                  Keep your collection fresh and your stock up to date.
                </p>
                <Link to="/products" className="btn-soft mt-6">
                  Manage products <ArrowUpRight size={17} />
                </Link>
              </div>
              <div className="panel">
                <h2 className="text-xl font-serif mb-4">
                  Stock needs attention
                </h2>
                {low.slice(0, 5).map((p) => (
                  <Link
                    to={"/products?q=" + encodeURIComponent(p.name)}
                    key={p.id}
                    className="flex justify-between gap-3 border-t py-3 text-sm"
                  >
                    <span className="break-words min-w-0">{p.name}</span>
                    <span className="text-amber-800 whitespace-nowrap">
                      {p.stock} left
                    </span>
                  </Link>
                ))}
                {!low.length && (
                  <p className="muted">
                    All products have at least 5 units in stock.
                  </p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
