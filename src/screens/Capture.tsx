import { useNavigate } from "react-router-dom";
import { backButtonStyle, ctaDisabledStyle, ctaStyle, screenStyle, uppercaseLabel } from "../theme";
import { PROMPTS } from "../data/decision";
import { useDecision } from "../context/DecisionContext";

export default function Capture() {
  const navigate = useNavigate();
  const { decisionText, setDecisionText } = useDecision();
  const canContinue = decisionText.trim().length > 0;

  return (
    <div style={{ ...screenStyle, minHeight: "100%" }} className="rise">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => navigate("/")} style={backButtonStyle} aria-label="Back to home">
          ←
        </button>
        <span style={uppercaseLabel}>Step 1 · Capture</span>
      </div>

      <div style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.35, letterSpacing: "-.01em", color: "var(--gray-50)" }}>
        In your own words — what are you deciding?
      </div>

      <textarea
        value={decisionText}
        onChange={(e) => setDecisionText(e.target.value)}
        placeholder="Should I take the job offer in Singapore, or stay and wait for my promotion?"
        rows={5}
        style={{
          border: "1px solid var(--gray-700)",
          borderRadius: 14,
          background: "var(--d-surface)",
          padding: 16,
          minHeight: 150,
          fontSize: 17,
          fontWeight: 350,
          lineHeight: 1.5,
          color: "var(--gray-50)",
          resize: "vertical",
          outline: "none",
          width: "100%",
        }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PROMPTS.map((p) => (
          <span
            key={p}
            style={{
              padding: "8px 12px",
              border: "1px solid var(--gray-800)",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 350,
              color: "var(--gray-300)",
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "14px 0 4px" }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            border: "1px solid var(--gray-700)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--d-surface)",
          }}
          title="Voice input arrives in v1.1"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#63656a" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
            <path d="M5 11a7 7 0 0 0 14 0" />
            <path d="M12 18v3" />
          </svg>
        </div>
        <span style={{ fontSize: 12, fontWeight: 350, color: "var(--gray-300)" }}>Hold to speak · v1.1</span>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          onClick={() => canContinue && navigate("/decision/classify")}
          disabled={!canContinue}
          style={canContinue ? ctaStyle : ctaDisabledStyle}
        >
          Continue
        </button>
        <span style={{ textAlign: "center", fontSize: 12, fontWeight: 350, color: "var(--gray-300)" }}>
          Nothing is saved until you say so.
        </span>
      </div>
    </div>
  );
}
