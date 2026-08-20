import type { DecisionObject, Lean, MatchedModel } from "./types";

export interface AppliedEntry {
  matched: MatchedModel;
  lean: Lean;
}

export interface Synthesis {
  convergenceText: string;
  tensionText: string;
  leaning: string;
  majority: Lean;
}

/**
 * Synthesis (§7 step 6): summarise where the selected models agree and where
 * they conflict, without collapsing that into a single forced "correct answer."
 */
export function synthesize(decision: DecisionObject, entries: AppliedEntry[]): Synthesis {
  const leaned = entries.filter((e) => e.lean !== "neutral");
  const countA = leaned.filter((e) => e.lean === "a").length;
  const countB = leaned.filter((e) => e.lean === "b").length;
  const majority: Lean = countA === countB ? "neutral" : countA > countB ? "a" : "b";
  const majorityOption = majority === "a" ? decision.optionA : majority === "b" ? decision.optionB : null;

  const agreeing = leaned.filter((e) => e.lean === majority);
  const disagreeing = leaned.filter((e) => e.lean !== "neutral" && e.lean !== majority);
  const contrarianQualitative = entries.filter((e) => e.matched.isContrarian && e.lean === "neutral");

  let convergenceText: string;
  if (majority === "neutral" || !majorityOption) {
    convergenceText =
      leaned.length === 0
        ? `None of these models produced a clear numeric lean yet — fill in your own estimates on the Results screen and this will sharpen up.`
        : `The models that took a clear position split evenly between "${decision.optionA}" and "${decision.optionB}." That's a genuine tie, not an oversight — the honest read is that the numbers alone don't settle this one for you.`;
  } else {
    const names = agreeing.map((e) => e.matched.model.name);
    const namesText =
      names.length <= 2
        ? names.join(" and ")
        : `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
    convergenceText = `${namesText} — ${agreeing.length} of ${leaned.length || entries.length} models that reached a clear position — lean toward "${majorityOption}." That's a real signal, worth weighting, but it's still built from the numbers you entered.`;
  }

  let tensionText: string;
  if (disagreeing.length > 0) {
    const d = disagreeing[0].matched.model;
    tensionText = `${d.name} disagrees with the majority here. ${d.whenItMisleads[0] ?? ""} If that concern rings true for your situation, don't let the majority's number override it.`;
  } else if (contrarianQualitative.length > 0) {
    const d = contrarianQualitative[0].matched.model;
    tensionText = `${d.name} is here specifically to push back rather than confirm. ${d.oneLine} Worth sitting with, even though it doesn't reduce to a number here.`;
  } else {
    tensionText = "No sharp contradiction turned up among this set — treat that as mild reassurance, not proof, and still trust your own read of what's missing from the numbers.";
  }

  const leaning =
    majority === "neutral" || !majorityOption
      ? "Too close to call from the models alone — this one comes down to judgment."
      : `Lean toward "${majorityOption}."`;

  return { convergenceText, tensionText, leaning, majority };
}
