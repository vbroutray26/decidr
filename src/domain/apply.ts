import type {
  ChainStep,
  DecisionObject,
  DecisionTreeInputs,
  FeedbackLoopInputs,
  Lean,
  MentalModel,
  ModelUserInputs,
  ScorecardCriterion,
  TwoByTwoInputs,
} from "./types";

/** Generic per-model criteria seed, informed by the decision's own tension —
 * the user renames and rescoring these, so this is a starting point, not a guess
 * at their actual values. */
function seedCriteria(decision: DecisionObject): ScorecardCriterion[] {
  const base: ScorecardCriterion[] = [
    { name: "Practical / financial fit", weight: 3, scoreA: 5, scoreB: 5 },
    { name: "Long-term trajectory", weight: 3, scoreA: 5, scoreB: 5 },
    { name: "People & relationships", weight: 3, scoreA: 5, scoreB: 5 },
    { name: "Optionality later", weight: 2, scoreA: 5, scoreB: 5 },
    { name: "Downside risk", weight: 2, scoreA: 5, scoreB: 5 },
  ];
  if (decision.decisionType === "negotiation") {
    base[2] = { name: "Relationship with the other side", weight: 3, scoreA: 5, scoreB: 5 };
  }
  if (decision.decisionType === "values-conflict") {
    base[0] = { name: "Fit with my stated values", weight: 4, scoreA: 5, scoreB: 5 };
  }
  return base;
}

function seedChain(decision: DecisionObject): ChainStep[] {
  return [
    { order: "1st", head: `The visible effect of "${decision.optionA}"`, body: "The easily-sized consequence you're already weighing." },
    { order: "2nd", head: "Who or what else this touches within a year", body: "Costs and effects that don't show up in the headline decision." },
    { order: "3rd", head: "What this looks like once it's fully played out", body: "The consequence with the longest tail — worth pricing before you commit." },
  ];
}

/** A generic placeholder decision for the Library's "see it in action" preview —
 * there's no real decision behind it, just enough shape to render the model's
 * own visual template. */
export function buildExampleDecision(model: MentalModel): DecisionObject {
  return {
    rawText: "An example decision, so you can see how this model behaves.",
    optionA: "Option A",
    optionB: "Option B",
    isSingleOption: false,
    decisionType: model.decisionTypes[0] ?? "binary",
    reversibility: model.reversibilityFit?.[0] ?? "uncertain",
    stakes: model.stakesFit?.[0] ?? "medium",
    horizon: "Consequences likely run months, not years",
    tension: "Certainty versus upside",
    keywords: [],
  };
}

export function defaultInputsFor(model: MentalModel, decision: DecisionObject): ModelUserInputs {
  switch (model.visualTemplate) {
    case "decision-tree":
      return { decisionTree: { probA: 55, payoffAGood: 8, payoffABad: 3, probB: 55, payoffBGood: 6, payoffBBad: 4 } as DecisionTreeInputs };
    case "weighted-scorecard":
      return { scorecard: seedCriteria(decision) };
    case "two-by-two": {
      const x = model.id === "regret-minimization" ? (decision.reversibility === "one-way" ? 25 : decision.reversibility === "two-way" ? 75 : 50) : 40;
      const y = 60;
      return { twoByTwo: { x, y } as TwoByTwoInputs };
    }
    case "consequence-chain":
      return { chain: seedChain(decision) };
    case "feedback-loop":
      return { feedbackLoop: { nodeA: decision.optionA, nodeB: decision.optionB, reinforcing: true } as FeedbackLoopInputs };
    default:
      return {};
  }
}

export function computeLean(model: MentalModel, inputs: ModelUserInputs): Lean {
  switch (model.visualTemplate) {
    case "decision-tree": {
      const t = inputs.decisionTree;
      if (!t) return "neutral";
      const evA = (t.probA / 100) * t.payoffAGood + (1 - t.probA / 100) * t.payoffABad;
      const evB = (t.probB / 100) * t.payoffBGood + (1 - t.probB / 100) * t.payoffBBad;
      if (Math.abs(evA - evB) < 0.15) return "neutral";
      return evA > evB ? "a" : "b";
    }
    case "weighted-scorecard": {
      const rows = inputs.scorecard;
      if (!rows || rows.length === 0) return "neutral";
      const totalWeight = rows.reduce((t, r) => t + r.weight, 0) || 1;
      const scoreA = rows.reduce((t, r) => t + r.weight * r.scoreA, 0) / totalWeight;
      const scoreB = rows.reduce((t, r) => t + r.weight * r.scoreB, 0) / totalWeight;
      if (Math.abs(scoreA - scoreB) < 0.4) return "neutral";
      return scoreA > scoreB ? "a" : "b";
    }
    case "two-by-two": {
      // Only Regret Minimisation forces an A/B lean from this template — Eisenhower-style
      // matrices sort by urgency/importance and don't collapse to a binary verdict.
      if (model.id !== "regret-minimization") return "neutral";
      const r = inputs.twoByTwo;
      if (!r) return "neutral";
      return r.y >= 55 ? "a" : r.y <= 45 ? "b" : "neutral";
    }
    default:
      return "neutral";
  }
}

/** Fills the model's own guidance in around the user's actual options — no
 * per-decision LLM call, just the model's own when-to-use text personalised
 * with the extracted options (§7 step 4, rule-based v1). */
export function appliedText(model: MentalModel, decision: DecisionObject): string {
  const guidance = model.whenToUse[0] ?? model.oneLine;
  const optionClause = decision.isSingleOption
    ? `"${decision.optionA}"`
    : `"${decision.optionA}" against "${decision.optionB}"`;
  return `${model.oneLine} Concretely: weighing ${optionClause}, ${guidance.charAt(0).toLowerCase()}${guidance.slice(1)}`;
}

export function misleadsText(model: MentalModel): string {
  return model.whenItMisleads.join(" ");
}
