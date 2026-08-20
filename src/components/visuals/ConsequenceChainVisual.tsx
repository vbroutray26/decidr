import { ACCENT } from "../../theme";
import type { ChainStep } from "../../domain/types";

export function ConsequenceChainVisual({
  chain,
  onChange,
}: {
  chain: ChainStep[];
  onChange: (index: number, patch: Partial<ChainStep>) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
        Consequence chain
      </span>
      {chain.map((c, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
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
              gap: 6,
            }}
          >
            <input
              value={c.head}
              onChange={(e) => onChange(i, { head: e.target.value })}
              style={{ background: "none", border: "none", color: "var(--gray-50)", fontSize: 13, fontWeight: 600, padding: 0, outline: "none" }}
            />
            <textarea
              value={c.body}
              onChange={(e) => onChange(i, { body: e.target.value })}
              rows={2}
              style={{
                background: "none",
                border: "none",
                color: "var(--gray-300)",
                fontSize: 13,
                fontWeight: 350,
                lineHeight: 1.5,
                padding: 0,
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>
      ))}
      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>
        Fill in your own read of each order of effect — most people stop at the first one.
      </span>
    </div>
  );
}
