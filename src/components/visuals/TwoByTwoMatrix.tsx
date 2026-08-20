export function TwoByTwoMatrix() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
        2×2 · regret at 80 vs reversibility
      </span>
      <div style={{ position: "relative", padding: "0 0 22px 26px" }}>
        <div style={{ position: "relative", height: 210, borderLeft: "1px solid var(--gray-700)", borderBottom: "1px solid var(--gray-700)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: "1px dashed var(--d-hairline-2)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", borderLeft: "1px dashed var(--d-hairline-2)" }} />
          <div style={{ position: "absolute", left: "64%", top: "22%", transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <span style={{ width: 13, height: 13, borderRadius: "50%", background: "var(--orange-500)", boxShadow: "0 0 0 5px rgba(255,164,60,.14)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-50)", whiteSpace: "nowrap" }}>Singapore</span>
          </div>
          <div style={{ position: "absolute", left: "26%", top: "70%", transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <span style={{ width: 13, height: 13, borderRadius: "50%", background: "var(--gray-300)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-300)", whiteSpace: "nowrap" }}>Stay</span>
          </div>
          <span
            style={{
              position: "absolute",
              left: -24,
              top: -4,
              fontSize: 10,
              color: "var(--gray-300)",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            high regret
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 6, fontSize: 10, color: "var(--gray-300)" }}>
          <span>one-way door</span>
          <span>two-way door</span>
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>
        Singapore sits top-right: the move you'd regret not making, and one you could largely undo.
      </span>
    </div>
  );
}
