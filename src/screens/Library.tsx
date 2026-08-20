import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { chipStyle } from "../theme";
import { MODELS } from "../domain/models";
import type { OriginDomain } from "../domain/types";

const DOMAINS: (OriginDomain | "All")[] = [
  "All",
  "psychology",
  "economics",
  "probability",
  "systems",
  "strategy",
  "philosophy",
  "structuring",
  "negotiation",
  "management",
  "personal",
];

export default function Library() {
  const [domain, setDomain] = useState<OriginDomain | "All">("All");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MODELS.filter((m) => domain === "All" || m.domain === domain).filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.oneLine.toLowerCase().includes(q) ||
        m.aliases.some((a) => a.toLowerCase().includes(q)) ||
        m.originator.toLowerCase().includes(q),
    );
  }, [domain, query]);

  return (
    <div style={{ padding: "26px 22px 34px", display: "flex", flexDirection: "column", gap: 18, maxWidth: 640, margin: "0 auto" }} className="rise">
      <span style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-.02em" }}>Library</span>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${MODELS.length} models…`}
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
        {DOMAINS.map((d) => (
          <button key={d} onClick={() => setDomain(d)} style={chipStyle(domain === d)}>
            {d === "All" ? "All" : d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)" }}>
        {results.length} model{results.length === 1 ? "" : "s"}
      </span>
      {results.map((m) => (
        <Link
          key={m.id}
          to={`/library/${m.id}`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: "13px 0",
            borderBottom: "1px solid var(--d-raised)",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, letterSpacing: "-.01em" }}>{m.name}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gray-300)" }}>{m.domain}</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>{m.oneLine}</span>
          <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)" }}>{m.originator}</span>
        </Link>
      ))}
      {results.length === 0 && <span style={{ fontSize: 13, fontWeight: 350, color: "var(--gray-300)" }}>No models match that search yet.</span>}
    </div>
  );
}
