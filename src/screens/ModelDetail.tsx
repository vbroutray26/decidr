import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { backButtonStyle, ctaStyle, uppercaseLabel } from "../theme";
import { MODELS } from "../domain/models";
import { appliedText, buildExampleDecision, defaultInputsFor } from "../domain/apply";
import { ModelVisual } from "../components/ModelVisual";
import type { ModelUserInputs } from "../domain/types";

function findModel(id: string | undefined) {
  return MODELS.find((m) => m.id === id);
}

export default function ModelDetail() {
  const { modelId } = useParams<{ modelId: string }>();
  // Keyed on modelId so navigating between two model detail pages (which
  // share this one route) fully remounts — otherwise React Router keeps the
  // same component instance and useState's lazy initializer never reruns,
  // leaving the "see it in action" preview stuck on the first model's inputs.
  return <ModelDetailView key={modelId} modelId={modelId} />;
}

function ModelDetailView({ modelId }: { modelId: string | undefined }) {
  const navigate = useNavigate();
  const model = findModel(modelId);

  const exampleDecision = useMemo(() => (model ? buildExampleDecision(model) : null), [model]);
  const [inputs, setInputs] = useState<ModelUserInputs>(() =>
    model && exampleDecision ? defaultInputsFor(model, exampleDecision) : {},
  );

  if (!model || !exampleDecision) return <Navigate to="/library" replace />;

  const related = model.relatedModels.map((id) => MODELS.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m);
  const contradicting = model.contradicts.map((id) => MODELS.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m);

  return (
    <div style={{ padding: "22px 22px 34px", display: "flex", flexDirection: "column", gap: 22, maxWidth: 640, margin: "0 auto" }} className="rise">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button onClick={() => navigate("/library")} style={backButtonStyle} aria-label="Back to library">
          ←
        </button>
        <span style={uppercaseLabel}>Library</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span
            style={{
              padding: "3px 8px",
              borderRadius: 4,
              background: "var(--gray-800)",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--gray-200)",
            }}
          >
            {model.domain}
          </span>
          {model.aliases.length > 0 && (
            <span style={{ fontSize: 11, fontWeight: 350, color: "var(--gray-300)" }}>aka {model.aliases.join(", ")}</span>
          )}
        </div>
        <span style={{ fontSize: 26, fontWeight: 300, letterSpacing: "-.02em", color: "var(--gray-50)" }}>{model.name}</span>
        <span style={{ fontSize: 15, fontWeight: 350, lineHeight: 1.55, color: "var(--gray-100)" }}>{model.oneLine}</span>
        <span style={{ fontSize: 12, fontWeight: 350, color: "var(--gray-300)" }}>
          {model.originator} · {model.primarySource}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={uppercaseLabel}>When to use it</span>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {model.whenToUse.map((w) => (
            <li key={w} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--orange-500)", flex: "none", marginTop: 7 }} />
              <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.55, color: "var(--gray-100)" }}>{w}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ ...uppercaseLabel, color: "var(--orange-600)" }}>Where it misleads</span>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {model.whenItMisleads.map((w) => (
            <li key={w} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--gray-500)", flex: "none", marginTop: 7 }} />
              <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.55, color: "var(--gray-300)" }}>{w}</span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={uppercaseLabel}>See it in action</span>
        {model.visualTemplate === "narrative" ? (
          <div style={{ border: "1px solid var(--d-hairline-2)", borderRadius: 16, background: "var(--d-surface)", padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gray-300)" }}>
              Applied to an example decision
            </span>
            <span style={{ fontSize: 14, fontWeight: 350, lineHeight: 1.6, color: "var(--gray-100)" }}>{appliedText(model, exampleDecision)}</span>
          </div>
        ) : (
          <div style={{ border: "1px solid var(--d-hairline-2)", borderRadius: 16, background: "var(--d-surface)", padding: 20 }}>
            <ModelVisual
              model={model}
              optionA={exampleDecision.optionA}
              optionB={exampleDecision.optionB}
              inputs={inputs}
              onChange={(patch) => setInputs((prev) => ({ ...prev, ...patch }))}
            />
          </div>
        )}
        <span style={{ fontSize: 12, fontWeight: 350, lineHeight: 1.5, color: "var(--gray-300)" }}>
          This is a worked example with placeholder options — try it on a real decision from Home to see it applied to yours.
        </span>
      </div>

      {(related.length > 0 || contradicting.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {related.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={uppercaseLabel}>Related models</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {related.map((m) => (
                  <Link
                    key={m.id}
                    to={`/library/${m.id}`}
                    style={{ padding: "7px 12px", border: "1px solid var(--gray-700)", borderRadius: 999, fontSize: 12, fontWeight: 400, color: "var(--gray-200)", textDecoration: "none" }}
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {contradicting.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ ...uppercaseLabel, color: "var(--red-300)" }}>Often disagrees with</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {contradicting.map((m) => (
                  <Link
                    key={m.id}
                    to={`/library/${m.id}`}
                    style={{ padding: "7px 12px", border: "1px solid var(--red-800)", borderRadius: 999, fontSize: 12, fontWeight: 400, color: "var(--red-300)", textDecoration: "none" }}
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Link to="/" style={{ ...ctaStyle, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Try it on your own decision
      </Link>
    </div>
  );
}
