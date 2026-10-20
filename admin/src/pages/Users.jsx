import { useRecords, date } from "../lib/admin";
import { useState } from "react";
import { PageHeader, State } from "../components/AdminUI";
export default function Users() {
  const { data, loading, error, refresh } = useRecords("users");
  const [q, setQ] = useState("");
  const filtered = data.filter((u) =>
    `${u.name || ""} ${u.email}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        title="Your customers."
        subtitle="The people behind every order."
      />
      <div className="panel mb-6">
        <input
          className="field max-w-lg"
          aria-label="Search customers"
          placeholder="Search name or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <p className="muted mt-3">{filtered.length} accounts</p>
      </div>
      <State
        loading={loading}
        error={error}
        empty={!filtered.length}
        onRetry={refresh}
      />
      {!loading && !error && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((u) => (
            <article className="panel min-w-0" key={u.id}>
              <span className="badge bg-[#f4eef6] text-[#50345f]">
                {u.role || "customer"}
              </span>
              <h2 className="font-semibold text-lg mt-4">
                {u.name || "Customer"}
              </h2>
              <p className="muted break-all mt-1">{u.email}</p>
              <p className="muted text-xs border-t mt-5 pt-4">
                Joined {date(u.created_at)}
              </p>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
