import type { MentalModel } from "../../domain/types";

export function NarrativeVisual({ model }: { model: MentalModel }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
        When this applies
      </span>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {model.whenToUse.map((w) => (
          <li key={w} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--orange-500)", flex: "none", marginTop: 7 }} />
            <span style={{ fontSize: 13, fontWeight: 350, lineHeight: 1.55, color: "var(--gray-100)" }}>{w}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
