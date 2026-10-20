import { useEffect, useRef } from "react";

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#9779a3] mb-2">
          Market / Administration
        </p>
        <h1 className="page-title">{title}</h1>
        <p className="muted mt-2">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
export function State({ loading, error, empty, onRetry }) {
  return loading ? (
    <p role="status" className="panel muted">
      Loading…
    </p>
  ) : error ? (
    <div role="alert" className="panel text-red-700">
      {error}{" "}
      <button onClick={onRetry} className="btn-soft ml-2">
        Try again
      </button>
    </div>
  ) : empty ? (
    <div className="panel text-center py-12">
      <h2 className="text-lg">Nothing to show yet</h2>
      <p className="muted mt-2">Try another search or filter.</p>
    </div>
  ) : null;
}
export function Status({ value }) {
  return (
    <span
      className={`badge ${value === "completed" ? "bg-emerald-50 text-emerald-800" : value === "pending" ? "bg-amber-50 text-amber-800" : "bg-stone-100 text-stone-600"}`}
    >
      {value}
    </span>
  );
}
export function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      dialog.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      aria-label={title}
      className="m-auto w-[calc(100%-2rem)] max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl p-5 sm:p-7 text-[#302737]"
    >
      <div className="flex justify-between items-center gap-4 mb-5">
        <h2 className="text-2xl font-serif">{title}</h2>
        <button
          type="button"
          className="btn-soft"
          onClick={onClose}
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>
      {children}
    </dialog>
  );
}
