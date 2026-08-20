import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ACCENT, backButtonStyle, chipStyle, ctaStyle, uppercaseLabel } from "../theme";
import { appliedText, misleadsText } from "../domain/apply";
import { DECISION_TYPE_LABEL } from "../domain/structure";
import { useDecision } from "../context/DecisionContext";
import { DecisionTreeVisual } from "../components/visuals/DecisionTreeVisual";
import { WeightedScorecard } from "../components/visuals/WeightedScorecard";
import { ConsequenceChainVisual } from "../components/visuals/ConsequenceChainVisual";
import { TwoByTwoMatrix } from "../components/visuals/TwoByTwoMatrix";
import { FeedbackLoopVisual } from "../components/visuals/FeedbackLoopVisual";
import { NarrativeVisual } from "../components/visuals/NarrativeVisual";

export default function Results() {
  const navigate = useNavigate();
  const { decision, matched, activeModelId, setActiveModelId, inputsByModelId, updateInputs, biasFlags, checkedBiases, toggleBias } =
    useDecision();

  useEffect(() => {
    if (!activeModelId && matched.length > 0) setActiveModelId(matched[0].model.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched]);

  if (!decision || matched.length === 0) {
    return <Navigate to="/" replace />;
  }

  const active = matched.find((m) => m.model.id === activeModelId) ?? matched[0];
  const model = active.model;
  const inputs = inputsByModelId[model.id] ?? {};
  const contradictionCount = matched.filter((m) => m.isContrarian).length;

  const renderVisual = () => {
    switch (model.visualTemplate) {
      case "decision-tree":
        return inputs.decisionTree ? (
          <DecisionTreeVisual
            optionA={decision.optionA}
            optionB={decision.optionB}
            inputs={inputs.decisionTree}
            onChange={(patch) => updateInputs(model.id, { decisionTree: { ...inputs.decisionTree!, ...patch } })}
          />
        ) : null;
      case "weighted-scorecard":
        return inputs.scorecard ? (
          <WeightedScorecard
            optionA={decision.optionA}
            optionB={decision.optionB}
            criteria={inputs.scorecard}
            onChange={(i, patch) => {
              const next = inputs.scorecard!.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
              updateInputs(model.id, { scorecard: next });
            }}
          />
        ) : null;
      case "two-by-two":
        return inputs.twoByTwo ? (
          <TwoByTwoMatrix
            modelId={model.id}
            optionA={decision.optionA}
            optionB={decision.optionB}
            inputs={inputs.twoByTwo}
            onChange={(patch) => updateInputs(model.id, { twoByTwo: { ...inputs.twoByTwo!, ...patch } })}
          />
        ) : null;
      case "consequence-chain":
        return inputs.chain ? (
          <ConsequenceChainVisual
            chain={inputs.chain}
            onChange={(i, patch) => {
              const next = inputs.chain!.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
              updateInputs(model.id, { chain: next });
            }}
          />
        ) : null;
      case "feedback-loop":
        return inputs.feedbackLoop ? (
          <FeedbackLoopVisual
            inputs={inputs.feedbackLoop}
            onChange={(patch) => updateInputs(model.id, { feedbackLoop: { ...inputs.feedbackLoop!, ...patch } })}
          />
        ) : null;
      default:
        return <NarrativeVisual model={model} />;
    }
  };

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
          {matched.length} model{matched.length === 1 ? "" : "s"} fit your decision.
          {contradictionCount > 0 ? " At least one of them disagrees — that's deliberate." : ""}
        </span>
        <span style={{ fontSize: 13, fontWeight: 350, color: "var(--gray-300)" }}>
          {DECISION_TYPE_LABEL[decision.decisionType]} · {decision.stakes} stakes
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 22px 4px" }}>
        {matched.map((m) => (
          <button key={m.model.id} onClick={() => setActiveModelId(m.model.id)} style={chipStyle(model.id === m.model.id)}>
            {m.model.name}
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
              <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)" }}>{model.originator}</span>
              {active.isContrarian && (
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--red-300)", border: "1px solid var(--red-800)", borderRadius: 4, padding: "2px 6px" }}>
                  here to disagree
                </span>
              )}
            </div>
            <span style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-.01em" }}>{model.name}</span>
            <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-200)" }}>{model.oneLine}</span>
          </div>

          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--d-hairline)", display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
              Why it's here
            </span>
            <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.55, color: "var(--gray-100)" }}>
              {model.whenToUse[model.whenToUse.length - 1] ?? model.oneLine}
            </span>
          </div>

          <div style={{ padding: 20, borderBottom: "1px solid var(--d-hairline)", background: "var(--d-canvas)" }}>{renderVisual()}</div>

          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
                Applied to your decision
              </span>
              <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.6, color: "var(--gray-100)" }}>{appliedText(model, decision)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 12, borderTop: "1px solid var(--d-hairline)" }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--orange-600)" }}>
                Where it misleads
              </span>
              <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.6, color: "var(--gray-300)" }}>{misleadsText(model)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 22px", display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={uppercaseLabel}>Bias flags</span>
        {biasFlags.map((b) => {
          const checked = !!checkedBiases[b.id];
          return (
            <button
              key={b.id}
              onClick={() => toggleBias(b.id)}
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
                <span style={{ fontSize: 13, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>{b.note(decision)}</span>
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
