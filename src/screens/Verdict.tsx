import { useNavigate } from "react-router-dom";
import { ACCENT, backButtonStyle, ctaStyle, ghostStyle, uppercaseLabel } from "../theme";
import { MODELS, MODEL_ORDER } from "../data/decision";

export default function Verdict() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "22px 22px 34px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 640, margin: "0 auto" }} className="rise">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => navigate("/decision/results")} style={backButtonStyle} aria-label="Back to results">
          ←
        </button>
        <span style={uppercaseLabel}>Step 4 · Verdict</span>
      </div>

      <div style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.3, letterSpacing: "-.02em" }}>
        Four of five models lean the same way. Here's the honest version.
      </div>

      <div style={{ border: "1px solid var(--gray-700)", borderRadius: 14, padding: 18, background: "var(--d-surface-2)", display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: ACCENT }}>Where they converge</span>
        <span style={{ fontSize: 15, fontWeight: 350, lineHeight: 1.6, color: "var(--gray-50)" }}>
          Take the offer, but buy yourself information first: ask for a written start date four weeks out and use that window to get
          the promotion decision on paper. Expected value, opportunity cost and regret minimisation all favour the move; the
          reversibility read says the downside is recoverable within a year.
        </span>
      </div>

      <div
        style={{
          border: "1px solid var(--gray-800)",
          borderLeft: "2px solid var(--red-500)",
          borderRadius: 12,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: "var(--d-surface)",
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--red-300)" }}>Real tension</span>
        <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.6, color: "var(--gray-100)" }}>
          Loss aversion and second-order thinking disagree with the majority. If your partner's career can't move, the third-order
          cost lands outside the scorecard entirely — and no expected-value sum captures it. Don't let the number override that.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={uppercaseLabel}>Models used</span>
        {MODEL_ORDER.map((id) => (
          <div key={id} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--d-raised)" }}>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 400 }}>{MODELS[id].name}</span>
            <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)", textAlign: "right" }}>{MODELS[id].origin}</span>
          </div>
        ))}
      </div>

      <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.6, color: "var(--gray-300)" }}>
        It's still your call — I've only compressed the reasoning.
      </span>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => navigate("/decision/brief")} style={ctaStyle}>
          Save and make a brief
        </button>
        <button onClick={() => navigate("/decision/results")} style={ghostStyle}>
          Back to the models
        </button>
      </div>
    </div>
  );
}
