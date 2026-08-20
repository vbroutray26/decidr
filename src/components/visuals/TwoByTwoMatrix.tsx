import type { TwoByTwoInputs } from "../../domain/types";

function truncate(label: string, max = 22): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}

interface AxisConfig {
  title: string;
  xLabel: [string, string];
  yLabel: [string, string];
  xSliderLabel: string;
  ySliderLabel: string;
  editableX: boolean;
}

const CONFIG: Record<string, AxisConfig> = {
  "regret-minimization": {
    title: "2×2 · regret vs. reversibility",
    xLabel: ["one-way door", "two-way door"],
    yLabel: ["low regret", "high regret"],
    xSliderLabel: "How reversible this feels",
    ySliderLabel: "Regret if you don't choose it",
    editableX: false,
  },
  "eisenhower-matrix": {
    title: "2×2 · urgency vs. importance",
    xLabel: ["not urgent", "urgent"],
    yLabel: ["not important", "important"],
    xSliderLabel: "How urgent it is",
    ySliderLabel: "How important it is",
    editableX: true,
  },
};

export function TwoByTwoMatrix({
  modelId,
  optionA,
  optionB,
  inputs,
  onChange,
}: {
  modelId: string;
  optionA: string;
  optionB: string;
  inputs: TwoByTwoInputs;
  onChange: (patch: Partial<TwoByTwoInputs>) => void;
}) {
  const cfg = CONFIG[modelId] ?? CONFIG["regret-minimization"];
  const bx = 100 - inputs.x;
  const by = 100 - inputs.y;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>{cfg.title}</span>

      <div style={{ position: "relative", padding: "0 0 22px 26px" }}>
        <div style={{ position: "relative", height: 210, borderLeft: "1px solid var(--gray-700)", borderBottom: "1px solid var(--gray-700)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: "1px dashed var(--d-hairline-2)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", borderLeft: "1px dashed var(--d-hairline-2)" }} />
          <div
            style={{
              position: "absolute",
              left: `${inputs.x}%`,
              top: `${100 - inputs.y}%`,
              transform: "translate(-50%,-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ width: 13, height: 13, borderRadius: "50%", background: "var(--orange-500)", boxShadow: "0 0 0 5px rgba(255,164,60,.14)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-50)", whiteSpace: "nowrap" }}>{truncate(optionA)}</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: `${bx}%`,
              top: `${100 - by}%`,
              transform: "translate(-50%,-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ width: 13, height: 13, borderRadius: "50%", background: "var(--gray-300)" }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--gray-300)", whiteSpace: "nowrap" }}>{truncate(optionB)}</span>
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
            {cfg.yLabel[1]}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 6, fontSize: 10, color: "var(--gray-300)" }}>
          <span>{cfg.xLabel[0]}</span>
          <span>{cfg.xLabel[1]}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "var(--gray-300)" }}>{cfg.ySliderLabel}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--orange-500)" }}>{inputs.y}%</span>
        </div>
        <input type="range" min={0} max={100} value={inputs.y} onChange={(e) => onChange({ y: Number(e.target.value) })} style={{ width: "100%" }} />
      </div>

      {cfg.editableX && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "var(--gray-300)" }}>{cfg.xSliderLabel}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--orange-500)" }}>{inputs.x}%</span>
          </div>
          <input type="range" min={0} max={100} value={inputs.x} onChange={(e) => onChange({ x: Number(e.target.value) })} style={{ width: "100%" }} />
        </div>
      )}
    </div>
  );
}
