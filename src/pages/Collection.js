import { useSearchParams, Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import { filterProducts, categoryKey, categoryName } from "../lib/catalog";
export default function Collection() {
  const state = useProducts();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all",
    query = params.get("q") || "",
    sort = params.get("sort") || "featured",
    available = params.get("available") === "true";
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const categories = [
    ...new Set(state.products.map((p) => categoryKey(p.category))),
  ].filter(Boolean);
  const filtered = filterProducts(state.products, {
    query,
    category,
    sort,
    available,
  });
  return (
    <main className="wrap py-10">
      <p className="mb-8 text-xs text-ink/60">
        <Link to="/">Home</Link> / Collections
      </p>
      <p className="eyebrow mb-3">Considered choices, everyday</p>
      <h1 className="heading">
        {category === "all" ? "All collections" : categoryName(category)}
      </h1>
      <p className="mb-8 mt-4 text-sm text-ink/60">
        Find the pieces that feel like you.
      </p>
      <div className="mb-8 flex flex-wrap gap-2">
        {["all", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => update("category", c)}
            aria-pressed={category === c}
            className={category === c ? "btn" : "btn-outline bg-white"}
          >
            {c === "all" ? "All products" : categoryName(c)}
          </button>
        ))}
      </div>
      <div className="mb-9 grid items-end gap-4 rounded-2xl bg-lilac p-5 md:grid-cols-[1fr_auto_auto]">
        <label className="text-xs font-semibold">
          Search collection
          <input
            className="field mt-2"
            value={query}
            onChange={(e) => update("q", e.target.value)}
            placeholder="Name or category"
          />
        </label>
        <label className="text-xs font-semibold">
          Sort by
          <select
            className="field mt-2"
            value={sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </label>
        <label className="flex min-h-12 items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) =>
              update("available", e.target.checked ? "true" : "")
            }
            className="h-4 w-4 accent-plum"
          />
          In stock only
        </label>
      </div>
      <div className="mb-6 flex justify-between text-sm">
        <p aria-live="polite">
          {state.loading ? "Loading…" : `${filtered.length} products`}
        </p>
        {params.size > 0 && (
          <button onClick={() => setParams({})} className="text-plum underline">
            Clear filters
          </button>
        )}
      </div>
      <ProductGrid {...state} products={filtered} />
    </main>
  );
}
