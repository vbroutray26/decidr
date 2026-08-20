import { ACCENT } from "../../theme";
import { CONSEQUENCE_CHAIN } from "../../data/decision";

export function ConsequenceChainVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
        Consequence chain · take the offer
      </span>
      {CONSEQUENCE_CHAIN.map((c) => (
        <div key={c.order} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ width: 22, flex: "none", fontSize: 10, fontWeight: 600, color: ACCENT, paddingTop: 12 }}>{c.order}</span>
          <div
            style={{
              flex: 1,
              border: "1px solid var(--gray-800)",
              borderRadius: 10,
              padding: "12px 14px",
              background: "var(--d-surface)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-50)" }}>{c.head}</span>
            <span style={{ fontSize: 13, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>{c.body}</span>
          </div>
        </div>
      ))}
      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>
        Most people stop at the first order. The cost of this decision sits in the third.
      </span>
    </div>
  );
}
