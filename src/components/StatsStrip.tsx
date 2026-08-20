import { ACCENT } from "../theme";
import { levelFor } from "../domain/levels";
import type { UserStats } from "../domain/types";

export function StatsStrip({ stats }: { stats: UserStats }) {
  const level = levelFor(stats.totalPoints);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <span
        style={{
          padding: "4px 10px",
          border: `1px solid ${ACCENT}`,
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
          color: ACCENT,
        }}
      >
        {stats.totalPoints} pts
      </span>
      <span
        style={{
          padding: "4px 10px",
          border: "1px solid var(--gray-700)",
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 600,
          color: "var(--gray-300)",
        }}
      >
        {level.title}
      </span>
      {stats.currentStreak > 1 && (
        <span
          style={{
            padding: "4px 10px",
            border: "1px solid var(--gray-700)",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 600,
            color: "var(--gray-300)",
          }}
        >
          {stats.currentStreak}-day streak
        </span>
      )}
    </div>
  );
}
