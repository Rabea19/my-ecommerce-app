import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useProducts from "../hooks/useProducts";
import { addToCart } from "../store/cartSlice";
import { money, categoryName } from "../lib/catalog";
import ProductImage from "../components/ProductImage";
import ProductGrid from "../components/ProductGrid";
export default function ProductDetails() {
  const { id } = useParams();
  const state = useProducts();
  const product = state.products.find((p) => p.id === id);
  const dispatch = useDispatch();
  const [added, setAdded] = useState("");
  const quantity = useSelector(
    (s) => s.cart.items.find((i) => i.id === id)?.quantity || 0,
  );
  if (state.loading || state.error)
    return (
      <main className="wrap py-12">
        <ProductGrid {...state} />
      </main>
    );
  if (!product)
    return (
      <main className="wrap py-20">
        <h1 className="heading">Product not found</h1>
        <Link to="/collection" className="btn mt-6">
          Browse collection
        </Link>
      </main>
    );
  return (
    <main className="wrap py-10">
      <p className="mb-8 text-sm text-ink/60">
        <Link to="/collection">Collection</Link> / {product.name}
      </p>
      <div className="grid items-center gap-10 md:grid-cols-2">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="aspect-square w-full rounded-3xl bg-white object-contain p-10"
        />
        <div>
          <p className="eyebrow">{categoryName(product.category)}</p>
          <h1 className="heading mt-5">{product.name}</h1>
          <p className="my-6 text-2xl text-plum">{money(product.price)}</p>
          <p className="mb-8 whitespace-pre-line text-sm leading-7 text-ink/70">
            {product.description ||
              "Explore this piece from our " +
                categoryName(product.category) +
                " collection."}
          </p>
          <p className="mb-5 text-sm">
            {product.stock > 0
              ? `${product.stock} available`
              : "Currently out of stock"}
          </p>
          <button
            className="btn w-full"
            disabled={product.stock <= quantity}
            onClick={() => {
              dispatch(addToCart(product));
              setAdded(id);
            }}
          >
            {product.stock <= quantity ? "Stock limit reached" : "Add to bag"}
          </button>
          <p role="status" className="mt-4 text-sm text-plum">
            {added === id && (
              <>
                Added to your bag.{" "}
                <Link to="/cart" className="underline">
                  View bag
                </Link>
              </>
            )}
          </p>
          <div className="mt-8 border-t border-plum/10 pt-6 text-xs leading-6 text-ink/60">
            Prices shown in EGP. Final availability and prices are verified when
            your order is placed.
          </div>
        </div>
      </div>
      <section className="mt-16">
        <h2 className="mb-8 font-display text-3xl">More to discover</h2>
        <ProductGrid
          products={state.products
            .filter((p) => p.id !== id && p.category === product.category)
            .slice(0, 4)}
        />
      </section>
    </main>
  );
}
