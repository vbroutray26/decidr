import { ACCENT } from "../../theme";
import { CRITERIA_ROWS, scoreFor } from "../../data/decision";
import { useDecision } from "../../context/DecisionContext";

export function WeightedScorecard() {
  const { weights, setWeight } = useDecision();
  const scoreA = scoreFor(weights, "a");
  const scoreB = scoreFor(weights, "b");
  const diff = Math.round(Math.abs(scoreA - scoreB));
  const leader =
    diff === 0
      ? "Too close to separate — the weights aren't distinguishing these options."
      : `${scoreA > scoreB ? "Singapore" : "Staying"} leads by ${diff} ${diff === 1 ? "point" : "points"} on your current weights.`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
          Weighted scorecard
        </span>
        <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)" }}>drag the weights</span>
      </div>

      {CRITERIA_ROWS.map((row) => (
        <div key={row.key} style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 400, color: "var(--gray-50)" }}>{row.name}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT }}>weight {weights[row.key]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={weights[row.key]}
            onChange={(e) => setWeight(row.key, Number(e.target.value))}
            style={{ width: "100%" }}
            aria-label={`Weight for ${row.name}`}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 10, color: "var(--gray-300)" }}>Singapore</span>
              <span style={{ height: 4, borderRadius: 2, background: "var(--gray-700)", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", background: "var(--orange-500)", width: `${row.a * 10}%` }} />
              </span>
            </span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 10, color: "var(--gray-300)" }}>Stay</span>
              <span style={{ height: 4, borderRadius: 2, background: "var(--gray-700)", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", background: "var(--gray-300)", width: `${row.b * 10}%` }} />
              </span>
            </span>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, paddingTop: 6, borderTop: "1px solid var(--d-hairline)" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 11, color: "var(--gray-300)" }}>Singapore</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: scoreA >= scoreB ? ACCENT : "var(--gray-300)" }}>{scoreA.toFixed(0)}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 11, color: "var(--gray-300)" }}>Stay</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: scoreB > scoreA ? ACCENT : "var(--gray-300)" }}>{scoreB.toFixed(0)}</span>
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>{leader}</span>
    </div>
  );
}
