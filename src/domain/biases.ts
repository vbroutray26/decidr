import type { BiasFlag, DecisionObject } from "./types";

/**
 * The bias-flag pass (§7 step 5) — a curated subset of §17.1, run separately from
 * model selection. Each bias is scored against the decision object's raw text and
 * shape; the top matches are surfaced as an explicit checklist.
 */
export const BIASES: BiasFlag[] = [
  {
    id: "sunk-cost",
    name: "Sunk cost",
    oneLine: "Weighing what you've already put in, not just what's ahead of you.",
    triggerKeywords: ["invested", "spent", "years", "already put in", "committed", "so far", "waste"],
    note: () => "Time or money already spent is gone either way — it shouldn't tip the scale on what happens next.",
  },
  {
    id: "present-bias",
    name: "Present bias",
    oneLine: "Weighing what's near more heavily than what's the same size but further out.",
    triggerKeywords: ["now", "soon", "immediately", "deadline", "this week", "urgent"],
    triggerWhen: (d) => d.decisionType === "timing",
    note: (d) => `Check whether "${d.optionA}" feels more urgent than it actually is, just because it's closer in time.`,
  },
  {
    id: "loss-aversion",
    name: "Loss aversion",
    oneLine: "A loss looms about twice as large as an equivalent gain.",
    triggerKeywords: ["give up", "lose", "afraid of losing", "keep", "protect"],
    note: (d) => `If one side of this is framed as giving something up (rather than as a plain choice between "${d.optionA}" and "${d.optionB}"), that framing alone can be doing more work than the numbers.`,
  },
  {
    id: "status-quo-bias",
    name: "Status quo bias",
    oneLine: "Staying put feels safe by default, even when it's an active choice with its own cost.",
    triggerKeywords: ["stay", "keep things as they are", "current", "don't change"],
    note: (d) => `Ask whether you'd choose "${d.optionB}" if you were starting from scratch today, not just because it's already how things are.`,
  },
  {
    id: "confirmation-bias",
    name: "Confirmation bias",
    oneLine: "Noticing evidence that supports the option you already favour, and discounting the rest.",
    triggerKeywords: ["obviously", "sure", "convinced", "definitely", "clearly"],
    note: () => "If you already have a favourite, check whether you're evaluating both sides fairly or just collecting reasons for the one you like.",
  },
  {
    id: "anchoring",
    name: "Anchoring",
    oneLine: "The first number or option you were shown quietly sets the scale for everything after.",
    triggerKeywords: ["offer", "quote", "asking", "first told", "initial"],
    note: () => "Whatever number or option you heard first is probably still shaping your sense of what's reasonable — worth checking against a fresh estimate.",
  },
  {
    id: "optimism-bias",
    name: "Optimism bias",
    oneLine: "Assuming things will go better for you than the base rate suggests.",
    triggerKeywords: ["will work out", "confident", "sure it'll", "should be fine"],
    triggerWhen: (d) => d.stakes === "high",
    note: () => "High-stakes plans tend to attract rosier-than-realistic timelines and outcomes — sanity-check your estimate against how these things usually go for others.",
  },
  {
    id: "planning-fallacy",
    name: "Planning fallacy",
    oneLine: "Underestimating how long something will take or how much it will cost, even knowing past examples ran over.",
    triggerKeywords: ["how long", "timeline", "by when", "should take"],
    triggerWhen: (d) => d.decisionType === "timing" || d.decisionType === "resource-allocation",
    note: () => "If there's a timeline or budget baked into this decision, pad it — plans like this one almost always run longer or costlier than the first estimate.",
  },
  {
    id: "social-proof",
    name: "Social proof / bandwagon",
    oneLine: "Leaning toward what similar others are doing as a signal for what's right.",
    triggerKeywords: ["everyone", "everyone else", "most people", "normal to"],
    note: () => "If part of the pull is 'that's what everyone else does,' separate that signal from whether the option actually fits your situation.",
  },
  {
    id: "self-serving-bias",
    name: "Self-serving bias",
    oneLine: "Crediting good outcomes to yourself and bad ones to circumstance — which quietly inflates your confidence.",
    triggerKeywords: ["my track record", "i always", "i'm good at", "usually works for me"],
    note: () => "Past wins you're crediting to skill might owe more to circumstance than you're giving them credit for — worth a harder look before betting on the pattern repeating.",
  },
  {
    id: "framing-effect",
    name: "Framing effect",
    oneLine: "The same facts can feel different depending on how they're worded — as a gain or as a loss.",
    triggerKeywords: ["chance of failing", "chance of success", "risk of", "odds of"],
    note: (d) => `Try restating "${d.optionA}" in the opposite frame (gain instead of loss, or vice versa) and see if it still feels the same.`,
  },
  {
    id: "overconfidence-effect",
    name: "Overconfidence effect",
    oneLine: "Being more certain in an estimate or plan than the actual evidence supports.",
    triggerKeywords: ["certain", "no doubt", "definitely will", "guaranteed"],
    note: () => "Confidence in an estimate isn't the same as its accuracy — widen your range before treating a single number as solid.",
  },
  {
    id: "endowment-effect",
    name: "Endowment effect",
    oneLine: "Valuing something more simply because it's already yours.",
    triggerKeywords: ["mine", "already have", "built this", "my current"],
    note: (d) => `Check whether "${d.optionB}" feels more valuable mainly because you already have it, not because of what it actually delivers.`,
  },
  {
    id: "regret-aversion",
    name: "Anticipated regret",
    oneLine: "Overweighting how bad you expect to feel about a choice, relative to how you'll actually feel later.",
    triggerKeywords: ["regret", "what if", "wonder if", "look back"],
    triggerWhen: (d) => d.stakes === "high",
    note: () => "People consistently overestimate how much they'll regret either path — and underestimate how quickly they adapt to whichever one they take.",
  },
  {
    id: "availability-heuristic",
    name: "Availability heuristic",
    oneLine: "Judging how likely something is by how easily examples come to mind, not by how often it actually happens.",
    triggerKeywords: ["heard of", "happened to", "story about", "case where"],
    note: () => "A vivid example that comes to mind easily isn't the same as a representative one — check whether it's actually typical.",
  },
];

export function pickBiases(decision: DecisionObject, max = 3): BiasFlag[] {
  const text = decision.rawText.toLowerCase();
  const scored = BIASES.map((b) => {
    let score = 0;
    for (const kw of b.triggerKeywords) {
      if (text.includes(kw)) score += 2;
    }
    if (b.triggerWhen?.(decision)) score += 1;
    return { bias: b, score };
  }).sort((a, b) => b.score - a.score);

  const withSignal = scored.filter((s) => s.score > 0);
  const chosen = withSignal.length >= 2 ? withSignal : scored;
  return chosen.slice(0, max).map((s) => s.bias);
}
