import { Navigate, useNavigate } from "react-router-dom";
import { backButtonStyle, ctaStyle, ghostStyle, uppercaseLabel } from "../theme";
import { decisionTitle, REVERSIBILITY_LABEL } from "../domain/structure";
import { synthesize } from "../domain/synthesize";
import { useDecision } from "../context/DecisionContext";

const TODAY = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date());

export default function Brief() {
  const navigate = useNavigate();
  const { decision, matched, leanFor, saveCurrentDecision } = useDecision();

  if (!decision || matched.length === 0) return <Navigate to="/decision/new" replace />;

  const entries = matched.map((m) => ({ matched: m, lean: leanFor(m.model.id) }));
  const synthesis = synthesize(decision, entries);

  const handleSave = () => {
    saveCurrentDecision();
    navigate("/history");
  };

  return (
    <div style={{ padding: "22px 22px 34px", display: "flex", flexDirection: "column", gap: 18, maxWidth: 640, margin: "0 auto" }} className="rise">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => navigate("/decision/verdict")} style={backButtonStyle} aria-label="Back to verdict">
          ←
        </button>
        <span style={uppercaseLabel}>Decision brief</span>
      </div>

      <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--gray-700)" }}>
        <div
          style={{
            height: 5,
            background: "linear-gradient(90deg,var(--orange-500),var(--red-500),var(--magenta-500),var(--purple-500),var(--blue-500))",
          }}
        />
        <div style={{ padding: "22px 20px", background: "var(--d-surface-2)", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={uppercaseLabel}>{TODAY}</span>
            <span style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.35, letterSpacing: "-.01em" }}>{decisionTitle(decision)}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>Leaning</span>
            <span style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.5, color: "var(--gray-50)" }}>{synthesis.leaning}</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {matched.map((m) => (
              <span
                key={m.model.id}
                style={{ padding: "6px 10px", border: "1px solid var(--gray-700)", borderRadius: 999, fontSize: 11, fontWeight: 400, color: "var(--gray-200)" }}
              >
                {m.model.name}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, paddingTop: 14, borderTop: "1px solid var(--d-hairline-2)", flexWrap: "wrap" }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 10, color: "var(--gray-300)" }}>Stakes</span>
              <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{decision.stakes}</span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 10, color: "var(--gray-300)" }}>Door</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{REVERSIBILITY_LABEL[decision.reversibility].split(" · ")[0]}</span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 10, color: "var(--gray-300)" }}>Horizon</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{decision.horizon}</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleSave} style={ctaStyle}>
          Save to history
        </button>
        <button style={ghostStyle}>Share</button>
      </div>
    </div>
  );
}
