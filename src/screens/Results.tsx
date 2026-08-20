import { useNavigate } from "react-router-dom";
import { ACCENT, backButtonStyle, chipStyle, ctaStyle, uppercaseLabel } from "../theme";
import { BIAS_FLAGS, MODELS, MODEL_ORDER } from "../data/decision";
import { useDecision } from "../context/DecisionContext";
import { DecisionTreeVisual } from "../components/visuals/DecisionTreeVisual";
import { WeightedScorecard } from "../components/visuals/WeightedScorecard";
import { ConsequenceChainVisual } from "../components/visuals/ConsequenceChainVisual";
import { TwoByTwoMatrix } from "../components/visuals/TwoByTwoMatrix";
import { ValueCurveVisual } from "../components/visuals/ValueCurveVisual";

const VISUALS: Record<string, () => JSX.Element> = {
  m1: DecisionTreeVisual,
  m2: WeightedScorecard,
  m3: ConsequenceChainVisual,
  m4: TwoByTwoMatrix,
  m5: ValueCurveVisual,
};

export default function Results() {
  const navigate = useNavigate();
  const { activeModel, setActiveModel, checkedBiases, toggleBias } = useDecision();
  const model = MODELS[activeModel];
  const Visual = VISUALS[activeModel];

  return (
    <div style={{ padding: "22px 0 34px", display: "flex", flexDirection: "column", gap: 18, maxWidth: 640, margin: "0 auto" }} className="rise">
      <div style={{ padding: "0 22px", display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => navigate("/decision/classify")} style={backButtonStyle} aria-label="Back to classification">
          ←
        </button>
        <span style={uppercaseLabel}>Step 3 · Results</span>
      </div>

      <div style={{ padding: "0 22px", display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.35, letterSpacing: "-.01em" }}>
          Five models fit your decision. Two of them disagree — that's deliberate.
        </span>
        <span style={{ fontSize: 13, fontWeight: 350, color: "var(--gray-300)" }}>Binary choice · high stakes · mostly reversible</span>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 22px 4px" }}>
        {MODEL_ORDER.map((id) => (
          <button key={id} onClick={() => setActiveModel(id)} style={chipStyle(activeModel === id)}>
            {MODELS[id].short}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 22px" }}>
        <div style={{ border: "1px solid var(--d-hairline-2)", borderRadius: 16, background: "var(--d-surface)", overflow: "hidden" }}>
          <div style={{ padding: "20px 20px 16px", display: "flex", flexDirection: "column", gap: 8, borderBottom: "1px solid var(--d-hairline)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: 4,
                  background: "var(--gray-800)",
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--gray-200)",
                }}
              >
                {model.domain}
              </span>
              <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)" }}>{model.origin}</span>
            </div>
            <span style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-.01em" }}>{model.name}</span>
            <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-200)" }}>{model.def}</span>
          </div>

          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--d-hairline)", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
              Why it's here
            </span>
            <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.55, color: "var(--gray-100)" }}>{model.why}</span>
          </div>

          <div style={{ padding: 20, borderBottom: "1px solid var(--d-hairline)", background: "var(--d-canvas)" }}>
            <Visual />
          </div>

          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
                Applied to your decision
              </span>
              <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.6, color: "var(--gray-100)" }}>{model.applied}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 12, borderTop: "1px solid var(--d-hairline)" }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--orange-600)" }}>
                Where it misleads
              </span>
              <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.6, color: "var(--gray-300)" }}>{model.misleads}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 22px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <span style={uppercaseLabel}>Bias flags</span>
        </div>
        {BIAS_FLAGS.map((b) => {
          const checked = !!checkedBiases[b.name];
          return (
            <button
              key={b.name}
              onClick={() => toggleBias(b.name)}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: "12px 0",
                borderBottom: "1px solid var(--d-raised)",
                background: "none",
                border: "none",
                borderBottomStyle: "solid",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  flex: "none",
                  border: `1px solid ${checked ? ACCENT : "var(--d-border-hover)"}`,
                  background: checked ? ACCENT : "transparent",
                  borderRadius: 4,
                  marginTop: 2,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-50)" }}>{b.name}</span>
                <span style={{ fontSize: 13, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>{b.note}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: "6px 22px 0" }}>
        <button onClick={() => navigate("/decision/verdict")} style={ctaStyle}>
          See where they converge
        </button>
      </div>
    </div>
  );
}
