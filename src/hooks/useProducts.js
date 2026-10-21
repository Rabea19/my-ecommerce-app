import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
export default function useProducts() {
  const [products, setProducts] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [version, setVersion] = useState(0);
  const retry = useCallback(() => setVersion((v) => v + 1), []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api
      .from("products")
      .select("*")
      .then(({ data, error }) => {
        if (active) {
          setProducts(data || []);
          setError(error?.message || "");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [version]);
  return { products, loading, error, retry };
}
