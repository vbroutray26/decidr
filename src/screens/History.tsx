import { ACCENT } from "../theme";
import { HISTORY } from "../data/decision";

export default function History() {
  return (
    <div style={{ padding: "26px 22px 34px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 640, margin: "0 auto" }} className="rise">
      <span style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-.02em" }}>History</span>
      {HISTORY.map((h) => (
        <div key={h.title} style={{ display: "flex", flexDirection: "column", gap: 9, paddingBottom: 16, borderBottom: "1px solid var(--d-hairline)" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 400, lineHeight: 1.4 }}>{h.title}</span>
            <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)", whiteSpace: "nowrap" }}>{h.when}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {h.models.map((m) => (
              <span key={m} style={{ padding: "4px 8px", border: "1px solid var(--gray-800)", borderRadius: 999, fontSize: 10, fontWeight: 400, color: "var(--gray-300)" }}>
                {m}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 12, fontWeight: h.logged ? 350 : 600, color: h.logged ? "var(--gray-300)" : ACCENT }}>{h.outcome}</span>
        </div>
      ))}
    </div>
  );
}
