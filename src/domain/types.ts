/** The repository schema, following the product plan §5.2. */

export type OriginDomain =
  | "psychology"
  | "economics"
  | "probability"
  | "systems"
  | "strategy"
  | "philosophy"
  | "structuring"
  | "negotiation"
  | "management"
  | "personal";

export type DecisionType =
  | "binary"
  | "multi-option"
  | "resource-allocation"
  | "timing"
  | "risk"
  | "negotiation"
  | "values-conflict";

export type Reversibility = "one-way" | "two-way" | "uncertain";
export type Stakes = "low" | "medium" | "high";

export type VisualTemplateId =
  | "decision-tree"
  | "weighted-scorecard"
  | "two-by-two"
  | "consequence-chain"
  | "feedback-loop"
  | "narrative";

export interface MentalModel {
  id: string;
  name: string;
  aliases: string[];
  domain: OriginDomain;
  originator: string;
  primarySource: string;
  oneLine: string;
  whenToUse: string[];
  whenItMisleads: string[];
  decisionTypes: DecisionType[];
  stakesFit?: Stakes[];
  reversibilityFit?: Reversibility[];
  relatedModels: string[];
  contradicts: string[];
  visualTemplate: VisualTemplateId;
  keywords: string[];
}

export interface BiasFlag {
  id: string;
  name: string;
  oneLine: string;
  triggerKeywords: string[];
  /** Triggers when true regardless of keywords (e.g. decision type shape). */
  triggerWhen?: (d: DecisionObject) => boolean;
  note: (d: DecisionObject) => string;
}

/** The structured decision object the structuring step (§7 step 1) produces. */
export interface DecisionObject {
  rawText: string;
  optionA: string;
  optionB: string;
  isSingleOption: boolean;
  decisionType: DecisionType;
  reversibility: Reversibility;
  stakes: Stakes;
  horizon: string;
  tension: string;
  keywords: string[];
}

export interface MatchedModel {
  model: MentalModel;
  score: number;
  isContrarian: boolean;
}

export type Lean = "a" | "b" | "neutral";

export interface DecisionTreeInputs {
  probA: number; // 0-100, chance option A goes well
  payoffAGood: number; // 1-10
  payoffABad: number; // 1-10
  probB: number;
  payoffBGood: number;
  payoffBBad: number;
}

export interface ScorecardCriterion {
  name: string;
  weight: number; // 0-5
  scoreA: number; // 0-10
  scoreB: number; // 0-10
}

export interface TwoByTwoInputs {
  x: number; // 0-100, option A's position on the model's horizontal axis
  y: number; // 0-100, option A's position on the model's vertical axis
}

export interface ChainStep {
  order: string;
  head: string;
  body: string;
}

export interface FeedbackLoopInputs {
  nodeA: string;
  nodeB: string;
  reinforcing: boolean;
}

export interface ModelUserInputs {
  decisionTree?: DecisionTreeInputs;
  scorecard?: ScorecardCriterion[];
  twoByTwo?: TwoByTwoInputs;
  chain?: ChainStep[];
  feedbackLoop?: FeedbackLoopInputs;
}

export interface AppliedModel {
  matched: MatchedModel;
  applied: string;
  misleads: string;
  lean: Lean;
}

export interface SavedDecision {
  id: string;
  title: string;
  savedAt: string;
  decision: DecisionObject;
  modelNames: string[];
  leaning: string;
}
