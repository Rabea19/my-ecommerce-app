import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { addToCart } from "../store/cartSlice";
import { money, categoryName } from "../lib/catalog";
import ProductImage from "./ProductImage";
import Icon from "./Icon";
export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const quantity = useSelector(
    (s) => s.cart.items.find((i) => i.id === product.id)?.quantity || 0,
  );
  const unavailable = product.stock <= quantity;
  return (
    <article className="group flex h-full flex-col">
      <Link
        to={`/product/${product.id}`}
        className="relative block overflow-hidden rounded-2xl bg-white"
      >
        <ProductImage
          src={product.image}
          alt={product.name || product.title}
          loading="lazy"
          className="aspect-square w-full object-contain p-7 transition duration-500 group-hover:scale-105"
        />
        {product.stock <= 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-cream px-3 py-1 text-xs">
            Sold out
          </span>
        )}
      </Link>
      <p className="mt-5 text-[10px] uppercase tracking-[0.15em] text-plum">
        {categoryName(product.category)}
      </p>
      <h3 className="mb-2 mt-2 text-base font-medium">
        <Link to={`/product/${product.id}`}>
          {product.name || product.title}
        </Link>
      </h3>
      <p className="mb-4 text-sm font-semibold">{money(product.price)}</p>
      <button
        className="btn-outline mt-auto w-full bg-white"
        disabled={unavailable}
        onClick={() => {
          dispatch(addToCart(product));
          setAdded(true);
        }}
      >
        <Icon name={added ? "check" : "bag"} />
        {unavailable
          ? product.stock <= 0
            ? "Out of stock"
            : "Stock limit reached"
          : added
            ? "Add another"
            : "Add to bag"}
      </button>
      <span className="sr-only" role="status">
        {added ? `${product.name} added to your bag` : ""}
      </span>
    </article>
  );
}
