import { Link } from "react-router-dom";
import { ACCENT, screenStyle, uppercaseLabel } from "../theme";
import { MODELS } from "../domain/models";
import { relativeTime } from "../store/history";
import { useDecision } from "../context/DecisionContext";

const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

const MODEL_OF_THE_DAY = MODELS[dayOfYear(new Date()) % MODELS.length];

export default function Home() {
  const { history } = useDecision();
  const recent = history.slice(0, 2);

  return (
    <div style={{ ...screenStyle, padding: "28px 22px 34px", gap: 26 }} className="rise">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={uppercaseLabel}>{WEEKDAY}</span>
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
          3 credits
        </span>
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: 31,
          lineHeight: 1.18,
          fontWeight: 300,
          letterSpacing: "-.02em",
          color: "var(--gray-50)",
        }}
      >
        Something on your mind?
        <br />
        <span style={{ color: "var(--gray-400)" }}>Tell me the decision, I'll bring the models.</span>
      </h1>

      <Link
        to="/decision/new"
        style={{
          textAlign: "left",
          width: "100%",
          background: "var(--d-raised)",
          border: "1px solid var(--gray-700)",
          borderRadius: 16,
          padding: "18px 18px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          cursor: "pointer",
          color: "inherit",
          fontFamily: "inherit",
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 350, color: "var(--gray-400)" }}>Should I take the job offer in…</span>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".02em", color: ACCENT }}>Start typing</span>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: ACCENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#151517" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
            </svg>
          </span>
        </span>
      </Link>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={uppercaseLabel}>Model of the day</span>
        <Link
          to="/library"
          style={{
            border: "1px solid var(--d-hairline-2)",
            borderLeft: `2px solid ${ACCENT}`,
            borderRadius: 12,
            padding: "16px 18px",
            background: "var(--d-surface)",
            display: "flex",
            flexDirection: "column",
            gap: 7,
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-.01em" }}>{MODEL_OF_THE_DAY.name}</span>
          <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-200)" }}>{MODEL_OF_THE_DAY.oneLine}</span>
          <span style={{ fontSize: 12, fontWeight: 350, color: "var(--gray-300)" }}>{MODEL_OF_THE_DAY.originator}</span>
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={uppercaseLabel}>Recent</span>
        {recent.length === 0 ? (
          <span style={{ fontSize: 13, fontWeight: 350, color: "var(--gray-300)" }}>Nothing yet — your first saved decision will show up here.</span>
        ) : (
          recent.map((r) => (
            <Link
              key={r.id}
              to="/history"
              style={{
                textAlign: "left",
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--d-hairline)",
                padding: "13px 2px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                color: "inherit",
                width: "100%",
                textDecoration: "none",
              }}
            >
              <span style={{ flex: 1, fontSize: 14, fontWeight: 400, lineHeight: 1.35 }}>{r.title}</span>
              <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)", whiteSpace: "nowrap" }}>{relativeTime(r.savedAt)}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
