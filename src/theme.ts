import type { CSSProperties } from "react";

/** The single signal accent color — used only for primary actions, active states, and key data points (plan §9). */
export const ACCENT = "#ffa43c";

export const uppercaseLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "var(--gray-300)",
};

export function chipStyle(active: boolean): CSSProperties {
  return {
    padding: "7px 12px",
    borderRadius: 999,
    fontFamily: "inherit",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all .16s ease",
    border: `1px solid ${active ? ACCENT : "var(--gray-700)"}`,
    background: active ? ACCENT : "transparent",
    color: active ? "var(--gray-950)" : "var(--gray-300)",
  };
}

export const ctaStyle: CSSProperties = {
  width: "100%",
  padding: 16,
  borderRadius: 12,
  border: "none",
  background: ACCENT,
  color: "var(--gray-950)",
  fontFamily: "inherit",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  transition: "filter .16s ease",
};

export const ctaDisabledStyle: CSSProperties = {
  ...ctaStyle,
  background: "var(--gray-700)",
  color: "var(--gray-400)",
  cursor: "not-allowed",
};

export const ghostStyle: CSSProperties = {
  flex: "none",
  padding: "16px 18px",
  borderRadius: 12,
  border: "1px solid var(--gray-700)",
  background: "transparent",
  color: "var(--gray-200)",
  fontFamily: "inherit",
  fontSize: 15,
  fontWeight: 400,
  cursor: "pointer",
};

export const backButtonStyle: CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  color: "var(--gray-300)",
  fontSize: 20,
  lineHeight: 1,
  fontFamily: "inherit",
};

export const screenStyle: CSSProperties = {
  padding: "22px 22px 34px",
  display: "flex",
  flexDirection: "column",
  gap: 20,
  maxWidth: 640,
  margin: "0 auto",
  width: "100%",
};
