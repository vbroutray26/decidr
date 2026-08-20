import { Link } from "react-router-dom";
import { ctaStyle } from "../theme";
import { relativeTime } from "../store/history";
import { useDecision } from "../context/DecisionContext";

export default function History() {
  const { history } = useDecision();

  return (
    <div style={{ padding: "26px 22px 34px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 640, margin: "0 auto" }} className="rise">
      <span style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-.02em" }}>History</span>

      {history.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
          <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.6, color: "var(--gray-300)" }}>
            Nothing saved yet — walk a decision through to a brief and it'll show up here.
          </span>
          <Link to="/" style={{ ...ctaStyle, textDecoration: "none", display: "inline-block", width: "auto", padding: "14px 20px" }}>
            Start a decision
          </Link>
        </div>
      ) : (
        history.map((h) => (
          <div key={h.id} style={{ display: "flex", flexDirection: "column", gap: 9, paddingBottom: 16, borderBottom: "1px solid var(--d-hairline)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 400, lineHeight: 1.4 }}>{h.title}</span>
              <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)", whiteSpace: "nowrap" }}>{relativeTime(h.savedAt)}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {h.modelNames.slice(0, 3).map((m) => (
                <span key={m} style={{ padding: "4px 8px", border: "1px solid var(--gray-800)", borderRadius: 999, fontSize: 10, fontWeight: 400, color: "var(--gray-300)" }}>
                  {m}
                </span>
              ))}
              {h.modelNames.length > 3 && (
                <span style={{ padding: "4px 8px", border: "1px solid var(--gray-800)", borderRadius: 999, fontSize: 10, fontWeight: 400, color: "var(--gray-300)" }}>
                  +{h.modelNames.length - 3}
                </span>
              )}
            </div>
            <span style={{ fontSize: 12, fontWeight: 350, color: "var(--gray-300)" }}>{h.leaning}</span>
          </div>
        ))
      )}
    </div>
  );
}
