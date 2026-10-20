import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../store/cartSlice";
import ProductImage from "../components/ProductImage";
import { money } from "../lib/catalog";
export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const dispatch = useDispatch();
  const total = items.reduce((n, i) => n + i.price * i.quantity, 0);
  return (
    <main className="wrap py-12">
      <p className="eyebrow mb-3">Your next favourites</p>
      <h1 className="heading mb-9">
        Shopping bag{" "}
        <span className="text-plum/50">
          ({items.reduce((n, i) => n + i.quantity, 0)})
        </span>
      </h1>
      {!items.length ? (
        <div className="panel py-16 text-center">
          <h2 className="font-display text-3xl">
            A little room for something lovely.
          </h2>
          <p className="my-5 text-ink/60">
            Your shopping bag is currently empty.
          </p>
          <Link to="/collection" className="btn">
            Explore the collection
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="divide-y divide-plum/10">
            {items.map((i) => (
              <article
                key={i.id}
                className="flex gap-4 py-6 first:pt-0 sm:gap-6"
              >
                <Link to={`/product/${i.id}`} className="shrink-0">
                  <ProductImage
                    src={i.image}
                    alt={i.title || i.name}
                    className="h-24 w-24 rounded-xl bg-white object-contain p-3 sm:h-32 sm:w-32"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${i.id}`} className="font-medium">
                    {i.title || i.name}
                  </Link>
                  <p className="my-3 text-sm text-ink/60">{money(i.price)}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-plum/20 bg-white">
                      <button
                        className="h-11 w-11"
                        aria-label={`Decrease ${i.title || i.name} quantity`}
                        onClick={() => dispatch(decreaseQuantity(i.id))}
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center" aria-live="polite">
                        {i.quantity}
                      </span>
                      <button
                        className="h-11 w-11"
                        aria-label={`Increase ${i.title || i.name} quantity`}
                        disabled={
                          i.stock !== undefined && i.quantity >= i.stock
                        }
                        onClick={() => dispatch(increaseQuantity(i.id))}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="text-xs text-plum underline"
                      onClick={() => dispatch(removeFromCart(i.id))}
                    >
                      Remove
                    </button>
                    <strong className="text-sm">
                      {money(i.price * i.quantity)}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="panel">
            <h2 className="font-display text-2xl">Order summary</h2>
            <div className="my-6 flex justify-between border-y border-plum/10 py-6">
              <span>Subtotal</span>
              <strong>{money(total)}</strong>
            </div>
            <p className="mb-6 text-xs leading-6 text-ink/60">
              Final prices and stock are confirmed by the store when you place
              your order.
            </p>
            <Link to="/checkout" className="btn w-full">
              Continue to checkout →
            </Link>
            <Link
              to="/collection"
              className="mt-5 block text-center text-sm text-plum underline"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
