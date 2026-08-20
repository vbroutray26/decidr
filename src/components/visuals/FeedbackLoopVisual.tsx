import type { FeedbackLoopInputs } from "../../domain/types";

export function FeedbackLoopVisual({
  inputs,
  onChange,
}: {
  inputs: FeedbackLoopInputs;
  onChange: (patch: Partial<FeedbackLoopInputs>) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
        Feedback loop
      </span>

      <svg viewBox="0 0 320 160" style={{ width: "100%", height: "auto" }}>
        <rect x="20" y="20" width="120" height="50" rx="10" fill="var(--d-raised)" stroke="#3d3f45" />
        <rect x="180" y="90" width="120" height="50" rx="10" fill="var(--d-raised)" stroke="#3d3f45" />
        <path d="M140 50 C 200 50 240 60 260 88" fill="none" stroke="#3d3f45" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <path d="M180 112 C 120 112 80 100 62 74" fill="none" stroke="#3d3f45" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#8b8d90" />
          </marker>
        </defs>
        <text x="80" y="50" textAnchor="middle" fill="#ebebec" fontSize="11" fontWeight="600" fontFamily="Segoe UI">
          {inputs.nodeA.length > 20 ? `${inputs.nodeA.slice(0, 18)}…` : inputs.nodeA}
        </text>
        <text x="240" y="120" textAnchor="middle" fill="#ebebec" fontSize="11" fontWeight="600" fontFamily="Segoe UI">
          {inputs.nodeB.length > 20 ? `${inputs.nodeB.slice(0, 18)}…` : inputs.nodeB}
        </text>
        <text x="160" y="20" textAnchor="middle" fill="var(--orange-500)" fontSize="11" fontWeight="700" fontFamily="Segoe UI">
          {inputs.reinforcing ? "reinforcing (+)" : "balancing (−)"}
        </text>
      </svg>

      <div style={{ display: "flex", gap: 10 }}>
        <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, fontSize: 10, color: "var(--gray-300)" }}>
          First node
          <input
            value={inputs.nodeA}
            onChange={(e) => onChange({ nodeA: e.target.value })}
            style={{ background: "var(--d-raised)", border: "1px solid var(--gray-700)", borderRadius: 6, color: "var(--gray-50)", padding: "6px 8px", fontSize: 13 }}
          />
        </label>
        <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, fontSize: 10, color: "var(--gray-300)" }}>
          Feeds back into
          <input
            value={inputs.nodeB}
            onChange={(e) => onChange({ nodeB: e.target.value })}
            style={{ background: "var(--d-raised)", border: "1px solid var(--gray-700)", borderRadius: 6, color: "var(--gray-50)", padding: "6px 8px", fontSize: 13 }}
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onChange({ reinforcing: true })}
          style={loopBtnStyle(inputs.reinforcing)}
        >
          Reinforcing — it compounds
        </button>
        <button
          onClick={() => onChange({ reinforcing: false })}
          style={loopBtnStyle(!inputs.reinforcing)}
        >
          Balancing — it self-corrects
        </button>
      </div>

      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>
        {inputs.reinforcing
          ? "A reinforcing loop compounds — small effects here can snowball well past what the initial decision looked like."
          : "A balancing loop self-corrects — the system tends to pull back toward equilibrium on its own."}
      </span>
    </div>
  );
}

function loopBtnStyle(active: boolean): import("react").CSSProperties {
  return {
    flex: 1,
    padding: "9px 10px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    border: `1px solid ${active ? "var(--orange-500)" : "var(--gray-700)"}`,
    background: active ? "var(--orange-500)" : "transparent",
    color: active ? "var(--gray-950)" : "var(--gray-300)",
  };
}
