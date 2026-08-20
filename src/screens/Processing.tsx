import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ACCENT, uppercaseLabel } from "../theme";
import { PROC_STEPS } from "../data/decision";

export default function Processing() {
  const navigate = useNavigate();
  const [proc, setProc] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProc((p) => Math.min(p + 1, PROC_STEPS.length - 1));
    }, 620);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      navigate("/decision/results");
    }, 2700);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div style={{ padding: 22, minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 30, maxWidth: 640, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={uppercaseLabel}>Working</span>
        <span style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-.01em" }}>Scanning 164 models</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {PROC_STEPS.map((label, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--d-raised)" }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                flex: "none",
                background: i <= proc ? ACCENT : "var(--gray-700)",
                animation: i === proc ? "pulse 1.1s infinite" : undefined,
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 350, color: i <= proc ? "var(--gray-50)" : "var(--gray-400)" }}>{label}</span>
          </div>
        ))}
      </div>
      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>
        Two separate passes: structuring, then application. You'll see both.
      </span>
    </div>
  );
}
