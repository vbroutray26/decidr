import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { ACCENT, ctaDisabledStyle, ctaStyle } from "../theme";
import { useAuth } from "../context/AuthContext";
import { initials } from "../store/auth";

export default function Login() {
  const navigate = useNavigate();
  const { profiles, signIn, addProfile } = useAuth();
  const [showForm, setShowForm] = useState(profiles.length === 0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const canCreate = name.trim().length > 0;

  const handlePick = (id: string) => {
    signIn(id);
    navigate("/");
  };

  const handleCreate = () => {
    if (!canCreate) return;
    addProfile(name, email || undefined);
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: "28px 22px",
        background: "var(--d-canvas)",
      }}
      className="rise"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center", textAlign: "center" }}>
        <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: ".02em" }}>Decidr</span>
        <span style={{ fontSize: 22, fontWeight: 300, letterSpacing: "-.01em", color: "var(--gray-50)" }}>
          {showForm ? "Who's deciding?" : "Whose device is this?"}
        </span>
      </div>

      <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 20 }}>
        {!showForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePick(p.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: "1px solid var(--gray-700)",
                  background: "var(--d-raised)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  color: "inherit",
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: ACCENT,
                    color: "var(--gray-950)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    flex: "none",
                  }}
                >
                  {initials(p.name)}
                </span>
                <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</span>
                  {p.email && <span style={{ fontSize: 12, fontWeight: 350, color: "var(--gray-300)" }}>{p.email}</span>}
                </span>
              </button>
            ))}
            <button
              onClick={() => setShowForm(true)}
              style={{
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px dashed var(--gray-700)",
                background: "transparent",
                color: "var(--gray-300)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              + Add a profile
            </button>
          </div>
        )}

        {showForm && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gray-300)" }}>
                Name
              </span>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                style={inputStyle}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gray-300)" }}>
                Email (optional)
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                style={inputStyle}
              />
            </label>
            <button onClick={handleCreate} disabled={!canCreate} style={canCreate ? ctaStyle : ctaDisabledStyle}>
              Continue
            </button>
            {profiles.length > 0 && (
              <button
                onClick={() => setShowForm(false)}
                style={{ background: "none", border: "none", color: "var(--gray-300)", fontSize: 13, fontWeight: 400, cursor: "pointer", fontFamily: "inherit" }}
              >
                Back to profiles
              </button>
            )}
          </div>
        )}
      </div>

      <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-400)", maxWidth: 320, textAlign: "center" }}>
        This just personalizes Decidr and keeps your saved decisions separate on this device — it isn't password-protected, and
        nothing leaves your browser.
      </span>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  background: "var(--d-raised)",
  border: "1px solid var(--gray-700)",
  borderRadius: 10,
  color: "var(--gray-50)",
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
};
