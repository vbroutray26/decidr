import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ACCENT } from "../theme";
import { useAuth } from "../context/AuthContext";
import { useDecision } from "../context/DecisionContext";
import { initials } from "../store/auth";

const DECISION_ROUTES = [
  "/decision/classify",
  "/decision/processing",
  "/decision/results",
  "/decision/verdict",
  "/decision/brief",
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentProfile, signOut } = useAuth();
  const { startNew } = useDecision();

  const goNew = () => {
    startNew();
    navigate("/", { state: { focusCapture: true } });
  };

  const switchProfile = () => {
    signOut();
    navigate("/login");
  };

  const TAB_NAV = [
    { key: "home", label: "Home", icon: "◇", to: "/", match: (p: string) => p === "/" },
    { key: "new", label: "New", icon: "+", onClick: goNew, match: (p: string) => DECISION_ROUTES.includes(p) },
    { key: "history", label: "History", icon: "≡", to: "/history", match: (p: string) => p === "/history" },
  ];

  const RAIL_NAV = [
    { key: "home", label: "Home", to: "/", match: (p: string) => p === "/" },
    { key: "new", label: "New decision", onClick: goNew, match: (p: string) => DECISION_ROUTES.includes(p) },
    { key: "history", label: "History", to: "/history", match: (p: string) => p === "/history" },
    { key: "library", label: "Library", to: "/library", match: (p: string) => p === "/library" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--d-canvas)",
      }}
    >
      <aside className="rail-nav" style={railStyle}>
        <div style={{ padding: "0 10px 18px", fontSize: 15, fontWeight: 700, letterSpacing: ".02em" }}>Decidr</div>
        {RAIL_NAV.map((n) =>
          n.to ? (
            <Link key={n.key} to={n.to} style={railBtnStyle(n.match(pathname))}>
              {n.label}
            </Link>
          ) : (
            <button key={n.key} onClick={n.onClick} style={{ ...railBtnStyle(n.match(pathname)), width: "100%" }}>
              {n.label}
            </button>
          ),
        )}
        {currentProfile && (
          <button
            onClick={switchProfile}
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px",
              borderTop: "1px solid var(--d-hairline-2)",
              border: "none",
              borderRadius: 0,
              background: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: ACCENT,
                color: "var(--gray-950)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                flex: "none",
              }}
            >
              {initials(currentProfile.name)}
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--gray-50)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {currentProfile.name}
              </span>
              <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)" }}>Switch profile</span>
            </span>
          </button>
        )}
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <main style={{ flex: 1, minHeight: 0 }}>{children}</main>

        <nav className="tab-nav" style={tabNavStyle}>
          {TAB_NAV.map((n) => {
            const active = n.match(pathname);
            return n.to ? (
              <Link key={n.key} to={n.to} style={tabBtnStyle(active)}>
                <span style={{ fontSize: 17, lineHeight: 1 }}>{n.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".02em" }}>{n.label}</span>
              </Link>
            ) : (
              <button key={n.key} onClick={n.onClick} style={tabBtnStyle(active)}>
                <span style={{ fontSize: 17, lineHeight: 1 }}>{n.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".02em" }}>{n.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <style>{`
        .rail-nav { display: none; }
        .tab-nav { display: flex; }
        @media (min-width: 900px) {
          .rail-nav { display: flex; }
          .tab-nav { display: none; }
        }
      `}</style>
    </div>
  );
}

const railStyle: import("react").CSSProperties = {
  width: 212,
  flex: "none",
  borderRight: "1px solid var(--d-hairline-2)",
  padding: "22px 14px",
  flexDirection: "column",
  gap: 4,
  background: "var(--d-chrome)",
};

function railBtnStyle(active: boolean): import("react").CSSProperties {
  return {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: active ? 600 : 400,
    background: active ? "var(--d-raised)" : "transparent",
    color: active ? "var(--gray-50)" : "var(--gray-300)",
    textDecoration: "none",
  };
}

const tabNavStyle: import("react").CSSProperties = {
  flex: "none",
  height: 74,
  borderTop: "1px solid var(--d-hairline)",
  background: "var(--d-chrome)",
  alignItems: "center",
  padding: "0 12px calc(12px + env(safe-area-inset-bottom, 0px))",
  position: "sticky",
  bottom: 0,
};

function tabBtnStyle(active: boolean): import("react").CSSProperties {
  return {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
    background: "none",
    border: "none",
    padding: "10px 0 0",
    cursor: "pointer",
    fontFamily: "inherit",
    color: active ? ACCENT : "var(--gray-300)",
    textDecoration: "none",
  };
}
