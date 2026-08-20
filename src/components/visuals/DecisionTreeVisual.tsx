export function DecisionTreeVisual() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
        Decision tree · expected value
      </span>
      <svg viewBox="0 0 320 200" style={{ width: "100%", height: "auto" }}>
        <line x1="16" y1="100" x2="66" y2="100" stroke="#3d3f45" strokeWidth="1" />
        <circle cx="12" cy="100" r="4" fill="#8b8d90" />
        <line x1="66" y1="100" x2="120" y2="46" stroke="#3d3f45" strokeWidth="1" />
        <line x1="66" y1="100" x2="120" y2="154" stroke="#3d3f45" strokeWidth="1" />
        <text x="126" y="34" fill="#ebebec" fontSize="11" fontWeight="600" fontFamily="Segoe UI">
          Take Singapore
        </text>
        <text x="126" y="166" fill="#ebebec" fontSize="11" fontWeight="600" fontFamily="Segoe UI">
          Stay and wait
        </text>
        <line x1="120" y1="46" x2="188" y2="18" stroke="#2a2c31" />
        <line x1="120" y1="46" x2="188" y2="72" stroke="#2a2c31" />
        <line x1="120" y1="154" x2="188" y2="126" stroke="#2a2c31" />
        <line x1="120" y1="154" x2="188" y2="182" stroke="#2a2c31" />
        <text x="194" y="16" fill="#8b8d90" fontSize="10" fontFamily="Segoe UI">
          thrives · 0.60 → +9
        </text>
        <text x="194" y="76" fill="#8b8d90" fontSize="10" fontFamily="Segoe UI">
          poor fit · 0.40 → +2
        </text>
        <text x="194" y="124" fill="#8b8d90" fontSize="10" fontFamily="Segoe UI">
          promoted · 0.45 → +7
        </text>
        <text x="194" y="186" fill="#8b8d90" fontSize="10" fontFamily="Segoe UI">
          passed over · 0.55 → +3
        </text>
        <text x="126" y="52" fill="#ffa43c" fontSize="12" fontWeight="700" fontFamily="Segoe UI">
          EV 6.2
        </text>
        <text x="126" y="140" fill="#8b8d90" fontSize="12" fontWeight="700" fontFamily="Segoe UI">
          EV 4.8
        </text>
      </svg>
      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>
        Probabilities are your estimates, not mine. Tap any number to change it and the tree recomputes.
      </span>
    </div>
  );
}
