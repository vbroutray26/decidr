import { ACCENT } from "../../theme";
import type { DecisionTreeInputs } from "../../domain/types";

function ev(prob: number, good: number, bad: number): number {
  return (prob / 100) * good + (1 - prob / 100) * bad;
}

export function DecisionTreeVisual({
  optionA,
  optionB,
  inputs,
  onChange,
}: {
  optionA: string;
  optionB: string;
  inputs: DecisionTreeInputs;
  onChange: (patch: Partial<DecisionTreeInputs>) => void;
}) {
  const evA = ev(inputs.probA, inputs.payoffAGood, inputs.payoffABad);
  const evB = ev(inputs.probB, inputs.payoffBGood, inputs.payoffBBad);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
        Decision tree · expected value
      </span>

      <svg viewBox="0 0 320 170" style={{ width: "100%", height: "auto" }}>
        <line x1="16" y1="85" x2="66" y2="85" stroke="#3d3f45" strokeWidth="1" />
        <circle cx="12" cy="85" r="4" fill="#8b8d90" />
        <line x1="66" y1="85" x2="140" y2="30" stroke="#3d3f45" strokeWidth="1" />
        <line x1="66" y1="85" x2="140" y2="140" stroke="#3d3f45" strokeWidth="1" />
        <text x="146" y="18" fill="#ebebec" fontSize="11" fontWeight="600" fontFamily="Segoe UI">
          {optionA.length > 26 ? `${optionA.slice(0, 24)}…` : optionA}
        </text>
        <text x="146" y="148" fill="#ebebec" fontSize="11" fontWeight="600" fontFamily="Segoe UI">
          {optionB.length > 26 ? `${optionB.slice(0, 24)}…` : optionB}
        </text>
        <text x="146" y="34" fill={ACCENT} fontSize="13" fontWeight="700" fontFamily="Segoe UI">
          EV {evA.toFixed(1)}
        </text>
        <text x="146" y="165" fill="#8b8d90" fontSize="13" fontWeight="700" fontFamily="Segoe UI">
          EV {evB.toFixed(1)}
        </text>
      </svg>

      {(
        [
          { label: optionA, prob: "probA", good: "payoffAGood", bad: "payoffABad" },
          { label: optionB, prob: "probB", good: "payoffBGood", bad: "payoffBBad" },
        ] as const
      ).map((row) => (
        <div key={row.label} style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 0", borderTop: "1px solid var(--d-hairline)" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-50)" }}>{row.label}</span>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: 11, color: "var(--gray-300)" }}>Chance it goes well</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: ACCENT }}>{inputs[row.prob]}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={inputs[row.prob]}
            onChange={(e) => onChange({ [row.prob]: Number(e.target.value) } as Partial<DecisionTreeInputs>)}
            style={{ width: "100%" }}
            aria-label={`Chance ${row.label} goes well`}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, fontSize: 10, color: "var(--gray-300)" }}>
              Payoff if it goes well (1–10)
              <input
                type="number"
                min={1}
                max={10}
                value={inputs[row.good]}
                onChange={(e) => onChange({ [row.good]: Number(e.target.value) } as Partial<DecisionTreeInputs>)}
                style={numberInputStyle}
              />
            </label>
            <label style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, fontSize: 10, color: "var(--gray-300)" }}>
              Payoff if it doesn't (1–10)
              <input
                type="number"
                min={1}
                max={10}
                value={inputs[row.bad]}
                onChange={(e) => onChange({ [row.bad]: Number(e.target.value) } as Partial<DecisionTreeInputs>)}
                style={numberInputStyle}
              />
            </label>
          </div>
        </div>
      ))}

      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>
        These are your estimates, not ours — adjust them and the expected values recompute live.
      </span>
    </div>
  );
}

const numberInputStyle: import("react").CSSProperties = {
  background: "var(--d-raised)",
  border: "1px solid var(--gray-700)",
  borderRadius: 6,
  color: "var(--gray-50)",
  padding: "6px 8px",
  fontSize: 13,
  width: "100%",
};
