import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
export const money = (value) =>
  new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP" }).format(
    Number(value || 0),
  );
export const date = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
export function useRecords(table) {
  const [data, setData] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await api
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });
    setError(result.error?.message || "");
    if (!result.error) setData(result.data || []);
    setLoading(false);
  }, [table]);
  useEffect(() => {
    let active = true;
    api
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })
      .then((result) => {
        if (!active) return;
        setError(result.error?.message || "");
        if (!result.error) setData(result.data || []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [table]);
  return { data, loading, error, refresh };
}
