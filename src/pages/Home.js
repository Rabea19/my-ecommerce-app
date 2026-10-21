import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";
import ProductImage from "../components/ProductImage";
import Icon from "../components/Icon";
import { categoryKey, categoryName } from "../lib/catalog";
export default function Home() {
  const state = useProducts();
  const categories = [
    ...new Set(state.products.map((p) => categoryKey(p.category))),
  ].filter(Boolean);
  const hero =
    state.products.find(
      (p) => categoryKey(p.category) === "furniture" && p.image,
    ) || state.products.find((p) => p.image);
  return (
    <main>
      <section className="wrap pt-7">
        <div className="grid overflow-hidden rounded-3xl bg-[#eee8f0] md:min-h-[470px] md:grid-cols-2">
          <div className="flex flex-col items-start justify-center p-8 sm:p-12 lg:p-16">
            <p className="eyebrow mb-6">
              Thoughtfully discovered. Beautifully yours.
            </p>
            <h1 className="font-display text-5xl leading-[1.08] tracking-tight sm:text-6xl">
              Little finds.
              <br />
              <span className="italic text-plum">Everyday joy.</span>
            </h1>
            <p className="mb-8 mt-6 max-w-sm text-sm leading-7 text-ink/70">
              Give your everyday a fresh perspective. Explore technology, home
              favourites and pieces with a personal touch.
            </p>
            <Link to="/collection" className="btn">
              Explore the collection <Icon name="arrow" />
            </Link>
          </div>
          <div className="relative flex min-h-72 items-center justify-center bg-[#e4dae8] p-10 sm:p-14">
            <div className="absolute inset-8 rounded-t-full border border-white/60" />
            <ProductImage
              src={hero?.image || "/images/Sofa.jpg"}
              alt={hero?.name || "Explore the home collection"}
              className="relative h-64 w-full rounded-2xl bg-white object-contain p-6 shadow-xl shadow-plum/10 md:h-80"
            />
            <span className="absolute bottom-6 right-6 rounded-full bg-white/95 px-5 py-3 text-xs text-plum">
              Make room for something lovely
            </span>
          </div>
        </div>
      </section>
      <section className="wrap">
        <div className="grid gap-6 border-b border-plum/10 py-8 sm:grid-cols-3">
          {[
            [
              "box",
              "One collection, many possibilities",
              "Technology, home and personal style",
            ],
            [
              "bag",
              "A seamless shopping journey",
              "Browse, save your bag and order",
            ],
            [
              "shield",
              "Your account, your orders",
              "Follow your purchases in one place",
            ],
          ].map(([icon, title, desc]) => (
            <div className="flex gap-4" key={title}>
              <span className="rounded-full bg-lilac p-3 text-plum">
                <Icon name={icon} />
              </span>
              <div>
                <h2 className="text-sm font-semibold">{title}</h2>
                <p className="mt-2 text-xs text-ink/60">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {categories.length > 0 && (
        <section className="wrap py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Find your inspiration</p>
              <h2 className="heading">Shop by collection</h2>
            </div>
            <Link
              to="/collection"
              className="hidden text-sm text-plum underline sm:block"
            >
              Explore all
            </Link>
          </div>
          <div className="flex gap-7 overflow-x-auto pb-4">
            {categories.map((key) => {
              const p = state.products.find(
                (p) => categoryKey(p.category) === key && p.image,
              );
              return (
                <Link
                  to={`/collection?category=${encodeURIComponent(key)}`}
                  key={key}
                  className="w-36 flex-shrink-0 text-center"
                >
                  <ProductImage
                    src={p?.image}
                    alt={categoryName(key)}
                    className="mb-4 aspect-square w-full rounded-full border border-plum/10 bg-white object-contain p-6"
                  />
                  <span className="text-sm">{categoryName(key)}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      <section className="wrap py-10">
        <div className="mb-9 flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow mb-3">The everyday edit</p>
            <h2 className="heading">Discover your next favourite</h2>
          </div>
          <Link
            to="/collection"
            className="shrink-0 text-sm text-plum underline"
          >
            View all
          </Link>
        </div>
        <ProductGrid {...state} products={state.products.slice(0, 8)} />
      </section>
      <section className="wrap mt-14">
        <div className="grid gap-8 rounded-3xl bg-plum p-9 text-white sm:p-14 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              A collection with character
            </p>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl">
              Something for your home.
              <br />
              <em>Something just for you.</em>
            </h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <p className="mb-6 text-sm leading-7 text-white/80">
              Discover furniture, everyday essentials and personal style. Your
              next favourite might be one click away.
            </p>
            <Link
              to="/collection"
              className="btn bg-white text-plum hover:bg-lilac"
            >
              Find your favourite <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
