import ProductCard from "./ProductCard";
export default function ProductGrid({ products, loading, error, retry }) {
  if (loading)
    return (
      <div role="status" className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <span className="sr-only">Loading products</span>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-2xl bg-lilac motion-reduce:animate-none"
          />
        ))}
      </div>
    );
  if (error)
    return (
      <div role="alert" className="panel text-center">
        <p className="mb-5">We couldn't load the collection. {error}</p>
        <button className="btn-outline" onClick={retry}>
          Try again
        </button>
      </div>
    );
  if (!products.length)
    return (
      <p className="panel py-14 text-center">
        No products found. Try a different search or category.
      </p>
    );
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
