import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { request } from "../lib/api";
import { clearCart } from "../store/cartSlice";
import { money } from "../lib/catalog";
import ProductImage from "../components/ProductImage";
export default function Checkout() {
  const items = useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const lock = useRef(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false);
  async function handleCheckout() {
    if (lock.current || !items.length) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const fingerprint = JSON.stringify({
        user: user.id,
        products: items.map(({ id, quantity }) => ({ id, quantity })),
      });
      let attempt;
      try {
        attempt = JSON.parse(sessionStorage.getItem("checkoutAttempt"));
      } catch {}
      if (!attempt || attempt.fingerprint !== fingerprint) {
        attempt = { fingerprint, key: crypto.randomUUID() };
        sessionStorage.setItem("checkoutAttempt", JSON.stringify(attempt));
      }
      await request("/orders", {
        method: "POST",
        headers: { "Idempotency-Key": attempt.key },
        body: JSON.stringify({
          products: items.map(({ id, quantity }) => ({ id, quantity })),
        }),
      });
      dispatch(clearCart());
      sessionStorage.removeItem("checkoutAttempt");
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <main className="wrap max-w-3xl py-12">
      <p className="eyebrow mb-3">Bag / Review / Confirmation</p>
      <h1 className="heading mb-8">
        {success ? "Thank you for your order." : "Review your order"}
      </h1>
      {success ? (
        <div className="panel" role="status">
          <h2 className="font-display text-2xl">
            Your order has been received.
          </h2>
          <p className="my-5 text-ink/60">
            You can follow its status from your orders page.
          </p>
          <Link to="/orders" className="btn">
            View my orders
          </Link>
        </div>
      ) : !items.length ? (
        <div className="panel">
          <p className="mb-5">Your bag is empty.</p>
          <Link to="/collection" className="btn">
            Explore collection
          </Link>
        </div>
      ) : (
        <div className="panel">
          <p className="mb-6 break-all text-sm text-ink/60">
            Ordering as {user?.email}
          </p>
          <ul className="divide-y divide-plum/10">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 py-4">
                <ProductImage
                  src={i.image}
                  alt={i.title || i.name}
                  className="h-16 w-16 rounded-lg object-contain"
                />
                <div className="flex-1">
                  <p>{i.title || i.name}</p>
                  <p className="mt-2 text-sm text-ink/60">
                    {i.quantity} × {money(i.price)}
                  </p>
                </div>
                <strong className="text-sm">
                  {money(i.quantity * i.price)}
                </strong>
              </li>
            ))}
          </ul>
          <div className="my-6 flex justify-between border-t border-plum/10 pt-6 text-xl">
            <span>Estimated total</span>
            <strong>
              {money(items.reduce((n, i) => n + i.quantity * i.price, 0))}
            </strong>
          </div>
          <p className="mb-6 text-sm leading-6 text-ink/60">
            Your order is submitted to the store for processing. Prices and
            stock are verified on confirmation. No online payment is collected
            here.
          </p>
          {error && (
            <p
              role="alert"
              className="mb-5 rounded-xl bg-red-50 p-4 text-red-800"
            >
              {error}{" "}
              <Link to="/cart" className="underline">
                Review your bag
              </Link>
            </p>
          )}
          <button
            className="btn w-full"
            disabled={busy}
            onClick={handleCheckout}
          >
            {busy ? "Placing your order…" : "Confirm order"}
          </button>
          <Link
            className="mt-5 block text-center text-sm text-plum underline"
            to="/cart"
          >
            Back to bag
          </Link>
        </div>
      )}
    </main>
  );
}
