import { ACCENT } from "../../theme";
import type { ScorecardCriterion } from "../../domain/types";

export function WeightedScorecard({
  optionA,
  optionB,
  criteria,
  onChange,
}: {
  optionA: string;
  optionB: string;
  criteria: ScorecardCriterion[];
  onChange: (index: number, patch: Partial<ScorecardCriterion>) => void;
}) {
  const totalWeight = criteria.reduce((t, r) => t + r.weight, 0) || 1;
  const scoreA = criteria.reduce((t, r) => t + r.weight * r.scoreA, 0) / totalWeight;
  const scoreB = criteria.reduce((t, r) => t + r.weight * r.scoreB, 0) / totalWeight;
  const diff = Math.abs(scoreA - scoreB);
  const leader =
    diff < 0.4
      ? "Too close to separate — the weights and scores aren't distinguishing these options yet."
      : `${scoreA > scoreB ? optionA : optionB} leads by ${diff.toFixed(1)} points on your current weights and scores.`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
          Weighted scorecard
        </span>
        <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)" }}>name it, weigh it, score it</span>
      </div>

      {criteria.map((row, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8, paddingBottom: 12, borderBottom: "1px solid var(--d-hairline)" }}>
          <input
            value={row.name}
            onChange={(e) => onChange(i, { name: e.target.value })}
            style={{
              background: "none",
              border: "none",
              borderBottom: "1px dashed var(--gray-700)",
              color: "var(--gray-50)",
              fontSize: 13,
              fontWeight: 400,
              padding: "2px 0",
              width: "100%",
              outline: "none",
            }}
            aria-label={`Criterion name ${i + 1}`}
          />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "var(--gray-300)" }}>Weight</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT }}>{row.weight}</span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={row.weight}
            onChange={(e) => onChange(i, { weight: Number(e.target.value) })}
            style={{ width: "100%" }}
            aria-label={`Weight for ${row.name}`}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 10, color: "var(--gray-300)" }}>{optionA} — score {row.scoreA}</span>
              <input
                type="range"
                min={0}
                max={10}
                value={row.scoreA}
                onChange={(e) => onChange(i, { scoreA: Number(e.target.value) })}
                style={{ width: "100%" }}
                aria-label={`${optionA} score for ${row.name}`}
              />
            </span>
            <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 10, color: "var(--gray-300)" }}>{optionB} — score {row.scoreB}</span>
              <input
                type="range"
                min={0}
                max={10}
                value={row.scoreB}
                onChange={(e) => onChange(i, { scoreB: Number(e.target.value) })}
                style={{ width: "100%" }}
                aria-label={`${optionB} score for ${row.name}`}
              />
            </span>
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, paddingTop: 6 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 11, color: "var(--gray-300)" }}>{optionA}</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: scoreA >= scoreB ? ACCENT : "var(--gray-300)" }}>{scoreA.toFixed(1)}</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 11, color: "var(--gray-300)" }}>{optionB}</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: scoreB > scoreA ? ACCENT : "var(--gray-300)" }}>{scoreB.toFixed(1)}</span>
        </div>
      </div>
      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>{leader}</span>
    </div>
  );
}
