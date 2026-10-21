import { useRecords, money } from "../lib/admin";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Package, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { api, uploadImage } from "../lib/api";
import { PageHeader, State, Modal } from "../components/AdminUI";
const blank = {
  name: "",
  price: "",
  stock: "",
  category: "Mobiles",
  image: "",
};
export default function Products({ catalog = false }) {
  const { data, loading, error, refresh } = useRecords("products");
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [category, setCategory] = useState("All"),
    [form, setForm] = useState(null),
    [file, setFile] = useState(null),
    [busy, setBusy] = useState(false);
  const [saveError, setSaveError] = useState("");
  const categories = [
    ...new Set([
      "Mobiles",
      "Laptops",
      "Accessories",
      "Tablets",
      ...data.map((p) => p.category).filter(Boolean),
    ]),
  ];
  useEffect(() => {
    if (params.get("new") === "1") {
      setForm({ ...blank });
      const next = new URLSearchParams(params); next.delete("new");
      setParams(next, { replace: true });
    } else if (params.get("edit") && !loading) {
      const product = data.find(p => p.id === params.get("edit"));
      if (product) setForm({ ...product });
      const next = new URLSearchParams(params); next.delete("edit");
      setParams(next, { replace: true });
    }
  }, [params, setParams, data, loading]);
  const lowOnly = params.get("stock") === "low";
  const filtered = data.filter(
    (p) =>
      (!lowOnly || p.stock < 5) &&
      (category === "All" || p.category === category) &&
      p.name.toLowerCase().includes(q.toLowerCase()),
  );
  const edit = (p) => {
    setSaveError("");
    setFile(null);
    setForm({ ...p });
  };
  async function save(e) {
    e.preventDefault();
    if (busy) return;
    setSaveError("");
    setBusy(true);
    try {
      const image = file ? (await uploadImage(file)).url : form.image;
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        image,
      };
      const result = form.id
        ? await api.from("products").update(payload).eq("id", form.id)
        : await api.from("products").insert([payload]);
      if (result.error) throw result.error;
      toast.success(form.id ? "Product updated" : "Product added");
      setForm(null);
      await refresh();
    } catch (e) {
      setSaveError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(p) {
    if (!window.confirm(`Delete ${p.name}?`)) return;
    setBusy(true);
    const { error } = await api.from("products").delete().eq("id", p.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Product deleted");
      await refresh();
    }
    setBusy(false);
  }
  const actions = (p) => (
    <div className="flex flex-wrap gap-2">
      <button
        className="btn-soft"
        disabled={busy}
        onClick={() => edit(p)}
        aria-label={"Edit " + p.name}
      >
        Edit
      </button>
      <button
        className="btn-soft text-red-700"
        disabled={busy}
        onClick={() => remove(p)}
        aria-label={"Delete " + p.name}
      >
        Delete
      </button>
    </div>
  );
  return (
    <>
      <PageHeader
        title={catalog ? "The collection." : "Products"}
        subtitle="Curate your collection and keep every detail up to date."
      >
        <button className="btn" onClick={() => edit(blank)}>
          <Plus size={18} />
          Add Product
        </button>
      </PageHeader>
      <div className="panel flex flex-wrap gap-3 mb-6">
        <input
          aria-label="Filter products"
          placeholder="Search by product name…"
          className="field flex-1 min-w-[160px]"
          value={q}
          onChange={(e) =>
            setParams(previous => {
              const next = new URLSearchParams(previous);
              if (e.target.value) next.set("q", e.target.value); else next.delete("q");
              return next;
            }, { replace: true })
          }
        />
        <select
          className="field sm:w-48"
          aria-label="Filter category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <p className="muted w-full">
          {filtered.length} products · Prices in EGP
        </p>
      </div>
      {lowOnly && <div className="flex items-center gap-3 mb-4"><span className="muted">Showing low stock only</span><button className="btn-soft" onClick={() => setParams(previous => { const next = new URLSearchParams(previous); next.delete("stock"); return next; })}>Show all stock</button></div>}
      <State
        loading={loading}
        error={error}
        empty={!filtered.length}
        onRetry={refresh}
      />
      {!loading && !error && filtered.length > 0 && (
        <>
          <div
            className={
              catalog ? "hidden" : "hidden md:block panel !p-0 overflow-x-auto"
            }
          >
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-contain bg-[#faf9f6]"
                          />
                        ) : (
                          <Package size={25} />
                        )}
                        <span className="font-semibold">{p.name}</span>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>{money(p.price)}</td>
                    <td>
                      <span
                        className={`badge ${p.stock < 5 ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}
                      >
                        {p.stock} available
                      </span>
                    </td>
                    <td>{actions(p)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className={`grid gap-4 ${catalog ? "sm:grid-cols-2 xl:grid-cols-3" : "md:hidden"}`}
          >
            {filtered.map((p) => (
              <article key={p.id} className="panel min-w-0">
                {catalog && (
                  <div className="h-40 bg-[#faf9f6] rounded-xl mb-4 flex items-center justify-center">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full max-w-full object-contain"
                      />
                    ) : (
                      <Package size={40} className="text-[#a286ad]" />
                    )}
                  </div>
                )}
                <p className="muted text-xs uppercase tracking-wider">
                  {p.category}
                </p>
                <h2 className="font-semibold text-lg mt-2">{p.name}</h2>
                <p className="my-3">
                  {money(p.price)}{" "}
                  <span className="muted">· {p.stock} in stock</span>
                </p>
                {actions(p)}
              </article>
            ))}
          </div>
        </>
      )}
      {form && (
        <Modal
          title={form.id ? "Edit Product" : "Add Product"}
          onClose={() => {
            if (!busy) setForm(null);
          }}
        >
          <form onSubmit={save} className="space-y-4">
            {saveError && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-800"
              >
                {saveError}
              </p>
            )}
            {[
              ["name", "Product name", "text"],
              ["price", "Price (EGP)", "number"],
              ["stock", "Stock", "number"],
            ].map(([key, label, type]) => (
              <label className="block text-sm" key={key}>
                {label}
                <input
                  autoFocus={key === "name"}
                  className="field mt-2"
                  required
                  type={type}
                  min={type === "number" ? 0 : undefined}
                  step={
                    key === "price" ? ".01" : key === "stock" ? "1" : undefined
                  }
                  maxLength={key === "name" ? 200 : undefined}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="block text-sm">
              Category
              <select
                className="field mt-2"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              Product image
              <input
                className="field mt-2"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <p className="muted text-xs">
              PNG, JPEG or WebP, up to 2 MB. Leave empty to keep the current
              image.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn" disabled={busy}>
                {busy
                  ? "Saving…"
                  : form.id
                    ? "Update Product"
                    : "Create Product"}
              </button>
              <button
                type="button"
                className="btn-soft"
                disabled={busy}
                onClick={() => setForm(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
