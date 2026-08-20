import { useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACCENT, screenStyle, uppercaseLabel } from "../theme";
import { MODELS } from "../domain/models";
import { relativeTime } from "../store/history";
import { initials } from "../store/auth";
import { useDecision } from "../context/DecisionContext";
import { useAuth } from "../context/AuthContext";
import { useSpeechToText } from "../hooks/useSpeechToText";

const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
const PROMPTS = ["What are you weighing it against?", "What's the deadline?", "What would make it easy?"];

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

const MODEL_OF_THE_DAY = MODELS[dayOfYear(new Date()) % MODELS.length];

export default function Home() {
  const navigate = useNavigate();
  const { history, rawText, setRawText, structureNow } = useDecision();
  const { currentProfile, signOut } = useAuth();
  const recent = history.slice(0, 2);
  const canContinue = rawText.trim().length > 0;

  const baseTextRef = useRef("");
  const handleSpeechUpdate = useCallback(
    (transcript: string) => {
      const base = baseTextRef.current;
      setRawText(base && transcript ? `${base} ${transcript}` : base || transcript);
    },
    [setRawText],
  );
  const { listening, start, stop, supported } = useSpeechToText(handleSpeechUpdate);

  const beginListening = () => {
    baseTextRef.current = rawText;
    start();
  };

  const handleContinue = () => {
    if (!canContinue) return;
    if (listening) stop();
    structureNow();
    navigate("/decision/classify");
  };

  const switchProfile = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div style={{ ...screenStyle, padding: "28px 22px 34px", gap: 26 }} className="rise">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={uppercaseLabel}>{WEEKDAY}</span>
        {currentProfile && (
          <button
            onClick={switchProfile}
            aria-label={`Signed in as ${currentProfile.name}. Switch profile.`}
            title="Switch profile"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: ACCENT,
              color: "var(--gray-950)",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {initials(currentProfile.name)}
          </button>
        )}
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

      <div
        style={{
          width: "100%",
          background: "var(--d-raised)",
          border: "1px solid var(--gray-700)",
          borderRadius: 16,
          padding: "16px 16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Should I take the job offer in Singapore, or stay and wait for my promotion?"
          rows={4}
          style={{
            background: "none",
            border: "none",
            outline: "none",
            resize: "vertical",
            width: "100%",
            fontFamily: "inherit",
            fontSize: 16,
            fontWeight: 350,
            lineHeight: 1.5,
            color: "var(--gray-50)",
            minHeight: 90,
          }}
        />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PROMPTS.map((p) => (
            <span
              key={p}
              style={{
                padding: "7px 11px",
                border: "1px solid var(--gray-800)",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 350,
                color: "var(--gray-300)",
              }}
            >
              {p}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <button
            onPointerDown={supported ? beginListening : undefined}
            onPointerUp={supported ? stop : undefined}
            onPointerLeave={supported ? stop : undefined}
            onPointerCancel={supported ? stop : undefined}
            disabled={!supported}
            title={supported ? "Hold to speak" : "Voice input isn't supported in this browser"}
            aria-label="Hold to speak"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: `1px solid ${listening ? ACCENT : "var(--gray-700)"}`,
              background: listening ? "rgba(255,164,60,.14)" : "var(--d-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: supported ? "pointer" : "not-allowed",
              opacity: supported ? 1 : 0.4,
              flex: "none",
              touchAction: "none",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={listening ? ACCENT : "#8b8d90"} strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
              <path d="M5 11a7 7 0 0 0 14 0" />
              <path d="M12 18v3" />
            </svg>
          </button>

          <span style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: 350, color: listening ? ACCENT : "var(--gray-300)" }}>
            {listening ? "Listening…" : supported ? "Hold the mic to speak" : "Type your decision above"}
          </span>

          <button
            onClick={handleContinue}
            disabled={!canContinue}
            aria-label="Continue"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "none",
              background: canContinue ? ACCENT : "var(--gray-700)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: canContinue ? "pointer" : "not-allowed",
              flex: "none",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={canContinue ? "#151517" : "#8b8d90"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

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
