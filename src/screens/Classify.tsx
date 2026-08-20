import { useNavigate } from "react-router-dom";
import { ACCENT, backButtonStyle, ctaStyle, screenStyle, uppercaseLabel } from "../theme";
import { CLASSIFICATION } from "../data/decision";
import { useDecision } from "../context/DecisionContext";

const PROMOTION_OPTIONS = ["Confirmed in writing", "Verbally implied", "My assumption"];

export default function Classify() {
  const navigate = useNavigate();
  const { promotionStatus, setPromotionStatus } = useDecision();

  return (
    <div style={{ ...screenStyle, minHeight: "100%" }} className="rise">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => navigate("/decision/new")} style={backButtonStyle} aria-label="Back to capture">
          ←
        </button>
        <span style={uppercaseLabel}>Step 2 · Classification</span>
      </div>

      <div style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.35, letterSpacing: "-.01em" }}>
        Here's how I'm reading your decision. Correct me if I'm off.
      </div>

      <div style={{ border: "1px solid var(--d-hairline-2)", borderRadius: 14, background: "var(--d-surface)", overflow: "hidden" }}>
        {CLASSIFICATION.map((c) => (
          <div
            key={c.k}
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--d-hairline)",
              display: "flex",
              alignItems: "baseline",
              gap: 14,
            }}
          >
            <span style={{ width: 104, flex: "none", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gray-300)" }}>
              {c.k}
            </span>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 400, lineHeight: 1.4, color: "var(--gray-50)" }}>{c.v}</span>
            <button
              style={{ background: "none", border: "none", padding: 0, fontFamily: "inherit", cursor: "pointer", fontSize: 12, fontWeight: 350, color: ACCENT }}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          border: "1px solid var(--gray-700)",
          borderLeft: `2px solid ${ACCENT}`,
          borderRadius: 12,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          background: "var(--d-surface-2)",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.45 }}>
          One thing I'm missing: is the promotion confirmed, or is it your expectation?
        </span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PROMOTION_OPTIONS.map((opt) => {
            const active = promotionStatus ? promotionStatus === opt : opt === PROMOTION_OPTIONS[0];
            return (
              <button
                key={opt}
                onClick={() => setPromotionStatus(opt)}
                style={{
                  padding: "9px 14px",
                  borderRadius: 999,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  background: active ? "var(--gray-800)" : "transparent",
                  border: active ? "none" : "1px solid var(--gray-700)",
                  color: active ? "var(--gray-50)" : "var(--gray-300)",
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: "auto" }}>
        <button onClick={() => navigate("/decision/processing")} style={ctaStyle}>
          Find the models
        </button>
      </div>
    </div>
  );
}
