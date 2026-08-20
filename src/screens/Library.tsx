import { useMemo, useState } from "react";
import { chipStyle } from "../theme";
import { LIBRARY, LIBRARY_DOMAINS } from "../data/decision";

export default function Library() {
  const [domain, setDomain] = useState("All");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return LIBRARY.filter((l) => domain === "All" || l.domain === domain).filter(
      (l) => !q || l.name.toLowerCase().includes(q) || l.def.toLowerCase().includes(q),
    );
  }, [domain, query]);

  return (
    <div style={{ padding: "26px 22px 34px", display: "flex", flexDirection: "column", gap: 18, maxWidth: 640, margin: "0 auto" }} className="rise">
      <span style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-.02em" }}>Library</span>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search 164 models…"
        style={{
          border: "1px solid var(--gray-700)",
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: 14,
          fontWeight: 350,
          color: "var(--gray-50)",
          background: "var(--d-surface)",
          outline: "none",
        }}
      />
      <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4 }}>
        {LIBRARY_DOMAINS.map((d) => (
          <button key={d} onClick={() => setDomain(d)} style={chipStyle(domain === d)}>
            {d}
          </button>
        ))}
      </div>
      {results.map((l) => (
        <div key={l.name} style={{ display: "flex", flexDirection: "column", gap: 4, padding: "13px 0", borderBottom: "1px solid var(--d-raised)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, letterSpacing: "-.01em" }}>{l.name}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gray-300)" }}>{l.domain}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>{l.def}</span>
          <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)" }}>{l.origin}</span>
        </div>
      ))}
      {results.length === 0 && (
        <span style={{ fontSize: 13, fontWeight: 350, color: "var(--gray-300)" }}>No models match that search yet.</span>
      )}
    </div>
  );
}
