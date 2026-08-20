import type { DecisionObject, DecisionType, Reversibility, Stakes } from "./types";

const STOPWORDS = new Set(
  "a an the to of in on for and or vs versus is are was were should could would i my me we our you your it its this that with without if then so but not do does did should shouldn't i'm im deciding between whether take stay wait keep go".split(
    " ",
  ),
);

function clean(clause: string): string {
  return clause
    .trim()
    .replace(/^(to |should i |whether to |i should |i could )/i, "")
    .replace(/[?.!,;:]+$/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function capitalize(s: string): string {
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1);
}

/** Splits free text into two named options, following the plan's own worked
 * example ("Should I take the job offer in Singapore, or stay and wait for my
 * promotion?"). Falls back to an implicit "don't do it" second option when the
 * text only names one path. */
function splitOptions(text: string): { optionA: string; optionB: string; isSingleOption: boolean; multiOption: boolean } {
  const stripped = text.replace(/^\s*(should i|whether i should|whether to|do i|i'm deciding whether to|i am deciding whether to)\s*/i, "");

  const orMatches = [...stripped.matchAll(/\bor\b/gi)];
  const versusMatch = stripped.match(/\b(versus|vs\.?)\b/i);

  if (orMatches.length >= 2) {
    // Three or more named paths ("job A, job B, or job C") — represent the first two.
    const parts = stripped.split(/,|\bor\b/i).map((p) => clean(p)).filter(Boolean);
    if (parts.length >= 2) {
      return { optionA: capitalize(parts[0]), optionB: capitalize(parts[1]), isSingleOption: false, multiOption: true };
    }
  }

  if (orMatches.length === 1) {
    const idx = orMatches[0].index ?? -1;
    const left = clean(stripped.slice(0, idx));
    const right = clean(stripped.slice(idx + 2));
    if (left && right) {
      return { optionA: capitalize(left), optionB: capitalize(right), isSingleOption: false, multiOption: false };
    }
  }

  if (versusMatch?.index !== undefined) {
    const idx = versusMatch.index;
    const left = clean(stripped.slice(0, idx));
    const right = clean(stripped.slice(idx + versusMatch[0].length));
    if (left && right) {
      return { optionA: capitalize(left), optionB: capitalize(right), isSingleOption: false, multiOption: false };
    }
  }

  // Single named path — the implicit alternative is not doing it.
  const single = clean(stripped) || "this";
  return { optionA: capitalize(single), optionB: "Don't do it — leave things as they are", isSingleOption: true, multiOption: false };
}

function detectDecisionType(text: string, multiOption: boolean): DecisionType {
  const t = text.toLowerCase();
  if (multiOption) return "multi-option";
  if (/\b(allocate|budget|split|how much (should|to)|invest \$|spend \$|divide|distribute)\b/.test(t)) return "resource-allocation";
  if (/\b(negotiat\w*|counter[- ]?offer\w*|deal(ing)? with|ask(ing)? for a raise|salary (negotiation|ask))\b/.test(t)) return "negotiation";
  if (/\b(when (should|to)|now or later|wait (until|for)|timing|how soon|deadline)\b/.test(t)) return "timing";
  if (/\b(right thing|ethic|loyal|betray|fair to|guilt|obligation)\b/.test(t)) return "values-conflict";
  if (/\b(risk|chance|probability|might (fail|lose)|uncertain|gamble)\b/.test(t)) return "risk";
  return "binary";
}

function detectReversibility(text: string): Reversibility {
  const t = text.toLowerCase();
  if (/\b(quit|resign|sell|marry|divorce|move permanently|close (the|down)|burn|fire (myself|them)|delete permanently|sign away|give up citizenship)\b/.test(t))
    return "one-way";
  if (/\b(try|test|trial|pilot|temporary|for now|see how it goes|month[- ]to[- ]month|probation)\b/.test(t)) return "two-way";
  return "uncertain";
}

function detectStakes(text: string): Stakes {
  const t = text.toLowerCase();
  if (/\b(lunch|what to wear|which movie|weekend plans|minor|trivial)\b/.test(t)) return "low";
  if (
    /\b(job|career|marry|marriage|divorce|health|life savings|house|relocat\w*|salary|company|business|resign|fire someone|move (to|abroad)|mortgage|kids|children)\b/.test(
      t,
    ) ||
    text.length > 140
  )
    return "high";
  return "medium";
}

function detectHorizon(text: string, stakes: Stakes): string {
  const explicit = text.match(/(\d+)\s*(day|week|month|year)s?/i);
  if (explicit) {
    const [, n, unit] = explicit;
    return `Consequences play out over about ${n} ${unit}${n === "1" ? "" : "s"}`;
  }
  if (stakes === "high") return "Consequences likely run 1–5 years";
  if (stakes === "low") return "Consequences resolve within days or weeks";
  return "Consequences likely run months, not years";
}

function detectTension(decisionType: DecisionType, stakes: Stakes): string {
  switch (decisionType) {
    case "resource-allocation":
      return "Efficiency versus resilience";
    case "timing":
      return "Acting now versus waiting for more information";
    case "negotiation":
      return "Claiming value versus preserving the relationship";
    case "values-conflict":
      return "Self-interest versus obligation to others";
    case "risk":
      return "Downside protection versus expected upside";
    case "multi-option":
      return "Breadth of options versus depth of commitment";
    default:
      return stakes === "high" ? "Certainty versus upside" : "Short-term comfort versus long-term outcome";
  }
}

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return [...new Set(words)];
}

/** The structuring step (§7 step 1) — free text in, structured decision object out. */
export function structureDecision(rawText: string): DecisionObject {
  const text = rawText.trim();
  const { optionA, optionB, isSingleOption, multiOption } = splitOptions(text);
  const decisionType = detectDecisionType(text, multiOption);
  const reversibility = detectReversibility(text);
  const stakes = detectStakes(text);
  const horizon = detectHorizon(text, stakes);
  const tension = detectTension(decisionType, stakes);
  const keywords = extractKeywords(text);

  return { rawText: text, optionA, optionB, isSingleOption, decisionType, reversibility, stakes, horizon, tension, keywords };
}

export function decisionTitle(d: DecisionObject): string {
  const title = `${d.optionA} vs. ${d.optionB}`;
  return title.length > 90 ? `${title.slice(0, 87)}…` : title;
}

export const DECISION_TYPE_LABEL: Record<DecisionType, string> = {
  binary: "Binary choice — two named options",
  "multi-option": "Multi-option choice — several named paths",
  "resource-allocation": "Resource allocation — how to split a limited amount",
  timing: "Timing decision — whether now, later, or in sequence",
  risk: "Risk assessment — real uncertainty on the outcome",
  negotiation: "Negotiation — an outcome shaped by another party",
  "values-conflict": "Values conflict — competing principles, not just numbers",
};

export const REVERSIBILITY_LABEL: Record<Reversibility, string> = {
  "one-way": "A one-way door · hard to fully undo",
  "two-way": "A two-way door · reasonably easy to reverse",
  uncertain: "Reversibility unclear · worth treating cautiously",
};
