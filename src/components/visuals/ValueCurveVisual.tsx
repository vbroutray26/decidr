export function ValueCurveVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
        Value function · gains vs losses
      </span>
      <svg viewBox="0 0 320 170" style={{ width: "100%", height: "auto" }}>
        <line x1="160" y1="10" x2="160" y2="160" stroke="#2a2c31" />
        <line x1="20" y1="85" x2="305" y2="85" stroke="#2a2c31" />
        <path d="M20 158 C 90 150 140 120 160 85 C 180 62 230 44 300 38" fill="none" stroke="#ed2921" strokeWidth="2" />
        <text x="24" y="26" fill="#8b8d90" fontSize="10" fontFamily="Segoe UI">
          losses feel ~2× larger
        </text>
        <text x="214" y="72" fill="#8b8d90" fontSize="10" fontFamily="Segoe UI">
          gains
        </text>
        <circle cx="112" cy="136" r="4" fill="#ed2921" />
        <text x="34" y="128" fill="#ebebec" fontSize="10" fontWeight="600" fontFamily="Segoe UI">
          giving up the promotion
        </text>
      </svg>
      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>
        This is the model that pushes back on expected value: the promotion you'd forgo is felt as a loss, so it will weigh heavier
        than its size warrants.
      </span>
    </div>
  );
}
