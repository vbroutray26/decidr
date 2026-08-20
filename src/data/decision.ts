export type ModelId = "m1" | "m2" | "m3" | "m4" | "m5";

export interface ModelContent {
  short: string;
  name: string;
  domain: string;
  origin: string;
  def: string;
  why: string;
  applied: string;
  misleads: string;
}

/** The demo decision: "Should I take the job offer in Singapore, or stay and wait for my promotion?" */
export const MODELS: Record<ModelId, ModelContent> = {
  m1: {
    short: "Expected value",
    name: "Expected Value",
    domain: "Probability",
    origin: "von Neumann & Morgenstern, decision theory",
    def: "Weigh each outcome by how likely it is, not by how vivid it feels.",
    why: "You have two clear options, real uncertainty on both, and payoffs you can roughly size. That's exactly the shape this model was built for.",
    applied:
      "On your own estimates the move scores 6.2 against 4.8 for staying. The gap is meaningful but not overwhelming — it would flip if you put the promotion above 70% likely.",
    misleads:
      "It treats a 40% bad outcome as survivable arithmetic. If the downside would be ruinous rather than merely unpleasant, expected value is the wrong lens and tail risk is the right one.",
  },
  m2: {
    short: "Weighted criteria",
    name: "Weighted Decision Matrix",
    domain: "Decision structuring",
    origin: "Multi-criteria decision analysis; Franklin's moral algebra",
    def: "Name what actually matters, weight it honestly, then score each option against it.",
    why: "Your description mixed money, career trajectory and family proximity in one sentence. Those need separating before they can be compared.",
    applied:
      "Move the weights and watch the ranking move. Family proximity at 4 or above is the point where staying wins — which tells you the decision is really about that one criterion.",
    misleads:
      "The weights are a mirror, not a measurement. It's easy to tune them until they produce the answer you already wanted.",
  },
  m3: {
    short: "Second-order",
    name: "Second-Order Thinking",
    domain: "Systems",
    origin: "Popularised by Howard Marks; Meadows' systems tradition",
    def: "Ask what happens next, and then what happens after that.",
    why: "Relocation decisions have long consequence chains, and the costs usually sit two or three steps out rather than in the first move.",
    applied:
      "First order: more money, new market. Second: a narrower local network and a partner's career on hold. Third: if you return in three years you re-enter at the level you left.",
    misleads:
      "Chains can be extended indefinitely until every option looks bad. Stop at the order where you could still act differently.",
  },
  m4: {
    short: "Regret minimisation",
    name: "Regret Minimisation Framework",
    domain: "Personal decision",
    origin: "Jeff Bezos; regret theory (Loomes & Sugden)",
    def: "Project yourself forward and ask which choice you'd regret not having made.",
    why: "High stakes, low frequency, and an emotional pull in your wording — the conditions where regret predicts satisfaction better than payoff does.",
    applied:
      "Plotted against reversibility, the move is the high-regret, two-way-door quadrant: the version of this you'd struggle to forgive is the one where you never tried it.",
    misleads:
      "Anticipated regret is systematically overestimated. People adapt to both outcomes faster than they predict.",
  },
  m5: {
    short: "Loss aversion",
    name: "Loss Aversion",
    domain: "Psychology",
    origin: "Kahneman & Tversky, prospect theory (1979)",
    def: "A loss of a given size hurts roughly twice as much as an equivalent gain pleases.",
    why: "This one is here to argue with the others. Your framing treats the promotion as something you'd be giving up rather than something you might gain.",
    applied:
      "Reframe it: if you had no promotion pending, would the Singapore offer be an obvious yes? If so, the promotion is functioning as a loss you're protecting, not an option you're choosing.",
    misleads:
      "Naming a bias doesn't neutralise it — and sometimes the aversion is correct, because the loss really is the bigger risk.",
  },
};

export const MODEL_ORDER: ModelId[] = ["m1", "m2", "m3", "m4", "m5"];

export interface CriterionRow {
  key: "comp" | "career" | "family" | "opt" | "risk";
  name: string;
  a: number;
  b: number;
}

export const CRITERIA_ROWS: CriterionRow[] = [
  { key: "comp", name: "Compensation", a: 8, b: 5 },
  { key: "career", name: "Career trajectory", a: 7, b: 6 },
  { key: "family", name: "Family proximity", a: 3, b: 9 },
  { key: "opt", name: "Optionality later", a: 8, b: 4 },
  { key: "risk", name: "Downside protection", a: 4, b: 8 },
];

export type Weights = Record<CriterionRow["key"], number>;

export const DEFAULT_WEIGHTS: Weights = { comp: 3, career: 4, family: 4, opt: 3, risk: 2 };

export const CLASSIFICATION = [
  { k: "Type", v: "Binary choice — two named options" },
  { k: "Reversibility", v: "Mostly a two-way door · re-entry cost within a year" },
  { k: "Stakes", v: "High" },
  { k: "Horizon", v: "Consequences run 3–5 years" },
  { k: "Tension", v: "Certainty versus upside" },
];

export const PROC_STEPS = [
  "Reading your words",
  "Structuring the decision",
  "Retrieving candidate models",
  "Selecting for tension",
];

export const CONSEQUENCE_CHAIN = [
  {
    order: "1st",
    head: "You move, salary rises 40%",
    body: "The visible, easily-sized consequence — and the one you're already weighing.",
  },
  {
    order: "2nd",
    head: "Local network thins, partner's career pauses",
    body: "Costs that arrive within a year and don't appear on any offer letter.",
  },
  {
    order: "3rd",
    head: "Returning in three years means re-entering at the level you left",
    body: "The consequence with the longest tail. Worth pricing before you sign.",
  },
];

export const BIAS_FLAGS = [
  { name: "Sunk cost", note: "Four years invested here is not a reason to stay another one." },
  { name: "Present bias", note: "The promotion feels near and the Singapore upside feels abstract. Both are three years out." },
  { name: "Loss aversion", note: "You described the promotion as something you'd lose, not something you'd gain." },
];

export const RECENT = [
  { title: "Raise the price or hold for another quarter", when: "6 days" },
  { title: "Hire the senior contractor or promote internally", when: "3 weeks" },
];

export interface HistoryEntry {
  title: string;
  when: string;
  models: string[];
  outcome: string;
  logged: boolean;
}

export const HISTORY: HistoryEntry[] = [
  {
    title: "Singapore offer vs waiting for the promotion",
    when: "Today",
    models: ["Expected value", "Regret minimisation", "+3"],
    outcome: "Log what actually happened",
    logged: false,
  },
  {
    title: "Raise the price or hold for another quarter",
    when: "6 days",
    models: ["Elasticity", "Second-order"],
    outcome: "Outcome logged · went well",
    logged: true,
  },
  {
    title: "Hire the senior contractor or promote internally",
    when: "3 weeks",
    models: ["Base rates", "Opportunity cost"],
    outcome: "Log what actually happened",
    logged: false,
  },
  {
    title: "Move the team onto a single repo",
    when: "2 months",
    models: ["Chesterton's fence", "Reversibility"],
    outcome: "Outcome logged · too early to tell",
    logged: true,
  },
];

export const LIBRARY_DOMAINS = ["All", "Psychology", "Economics", "Probability", "Systems", "Strategy", "Philosophy"];

export interface LibraryEntry {
  name: string;
  domain: string;
  def: string;
  origin: string;
}

export const LIBRARY: LibraryEntry[] = [
  { name: "Inversion", domain: "Logic", def: "Work backwards from failure to find what to avoid.", origin: "Carl Jacobi · Charlie Munger" },
  { name: "Opportunity Cost", domain: "Economics", def: "The real cost of a choice is the best thing you gave up for it.", origin: "Frédéric Bastiat" },
  { name: "Base Rates", domain: "Probability", def: "Start from how often this outcome happens in general, then adjust.", origin: "Kahneman & Tversky" },
  { name: "Chesterton's Fence", domain: "Systems", def: "Don't remove what you don't yet understand the purpose of.", origin: "G. K. Chesterton" },
  { name: "BATNA", domain: "Strategy", def: "Your negotiating power is the quality of your walk-away option.", origin: "Fisher & Ury" },
  { name: "Dichotomy of Control", domain: "Philosophy", def: "Separate what you can influence from what you can only respond to.", origin: "Epictetus" },
  { name: "Antifragility", domain: "Probability", def: "Some things gain from disorder rather than merely surviving it.", origin: "Nassim Taleb" },
  { name: "Circle of Competence", domain: "Economics", def: "Know the boundary of what you actually understand, and stay inside it.", origin: "Warren Buffett" },
];

export const PROMPTS = ["What are you weighing it against?", "What's the deadline?", "What would make it easy?"];

export const DEFAULT_DECISION_TEXT =
  "Should I take the job offer in Singapore, or stay and wait for my promotion?";

export function scoreFor(weights: Weights, side: "a" | "b"): number {
  const totalWeight = CRITERIA_ROWS.reduce((t, r) => t + weights[r.key], 0) || 1;
  const weighted = CRITERIA_ROWS.reduce((t, r) => t + weights[r.key] * r[side], 0);
  return (weighted / (totalWeight * 10)) * 100;
}
