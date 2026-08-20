import type { CSSProperties, ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ACCENT, backButtonStyle, ctaStyle, screenStyle, uppercaseLabel } from "../theme";
import { DECISION_TYPE_LABEL, REVERSIBILITY_LABEL } from "../domain/structure";
import type { DecisionType, Reversibility, Stakes } from "../domain/types";
import { useDecision } from "../context/DecisionContext";

const DECISION_TYPES: DecisionType[] = [
  "binary",
  "multi-option",
  "resource-allocation",
  "timing",
  "risk",
  "negotiation",
  "values-conflict",
];
const REVERSIBILITIES: Reversibility[] = ["one-way", "two-way", "uncertain"];
const STAKES: Stakes[] = ["low", "medium", "high"];

export default function Classify() {
  const navigate = useNavigate();
  const { decision, updateDecision, matchNow } = useDecision();

  if (!decision) return <Navigate to="/decision/new" replace />;

  const rows: { key: string; label: string; content: ReactNode }[] = [
    {
      key: "type",
      label: "Type",
      content: (
        <select
          value={decision.decisionType}
          onChange={(e) => updateDecision({ decisionType: e.target.value as DecisionType })}
          style={selectStyle}
        >
          {DECISION_TYPES.map((t) => (
            <option key={t} value={t}>
              {DECISION_TYPE_LABEL[t]}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "reversibility",
      label: "Reversibility",
      content: (
        <select
          value={decision.reversibility}
          onChange={(e) => updateDecision({ reversibility: e.target.value as Reversibility })}
          style={selectStyle}
        >
          {REVERSIBILITIES.map((r) => (
            <option key={r} value={r}>
              {REVERSIBILITY_LABEL[r]}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "stakes",
      label: "Stakes",
      content: (
        <select value={decision.stakes} onChange={(e) => updateDecision({ stakes: e.target.value as Stakes })} style={selectStyle}>
          {STAKES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: "horizon",
      label: "Horizon",
      content: (
        <input value={decision.horizon} onChange={(e) => updateDecision({ horizon: e.target.value })} style={textInputStyle} />
      ),
    },
    {
      key: "tension",
      label: "Tension",
      content: <input value={decision.tension} onChange={(e) => updateDecision({ tension: e.target.value })} style={textInputStyle} />,
    },
  ];

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

      <div style={{ border: "1px solid var(--gray-700)", borderRadius: 14, background: "var(--d-surface)", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
          Named options
        </span>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, color: "var(--gray-300)" }}>Option A</span>
          <input value={decision.optionA} onChange={(e) => updateDecision({ optionA: e.target.value })} style={textInputStyle} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, color: "var(--gray-300)" }}>Option B</span>
          <input value={decision.optionB} onChange={(e) => updateDecision({ optionB: e.target.value })} style={textInputStyle} />
        </label>
      </div>

      <div style={{ border: "1px solid var(--d-hairline-2)", borderRadius: 14, background: "var(--d-surface)", overflow: "hidden" }}>
        {rows.map((row) => (
          <div
            key={row.key}
            style={{ padding: "14px 16px", borderBottom: "1px solid var(--d-hairline)", display: "flex", alignItems: "center", gap: 14 }}
          >
            <span style={{ width: 104, flex: "none", fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gray-300)" }}>
              {row.label}
            </span>
            <div style={{ flex: 1 }}>{row.content}</div>
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
          gap: 8,
          background: "var(--d-surface-2)",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.45 }}>
          This is a rule-based read of your text, not a guess dressed up as certainty — every field above is yours to correct, and
          the correction feeds the matching that follows.
        </span>
      </div>

      <div style={{ marginTop: "auto" }}>
        <button
          onClick={() => {
            matchNow();
            navigate("/decision/processing");
          }}
          style={ctaStyle}
        >
          Find the models
        </button>
      </div>
    </div>
  );
}

const selectStyle: CSSProperties = {
  width: "100%",
  background: "var(--d-raised)",
  border: "1px solid var(--gray-700)",
  borderRadius: 8,
  color: "var(--gray-50)",
  padding: "8px 10px",
  fontSize: 14,
  fontFamily: "inherit",
};

const textInputStyle: CSSProperties = {
  width: "100%",
  background: "var(--d-raised)",
  border: "1px solid var(--gray-700)",
  borderRadius: 8,
  color: "var(--gray-50)",
  padding: "8px 10px",
  fontSize: 14,
  fontFamily: "inherit",
};
