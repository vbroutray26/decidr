import type { MentalModel, ModelUserInputs } from "../domain/types";
import { DecisionTreeVisual } from "./visuals/DecisionTreeVisual";
import { WeightedScorecard } from "./visuals/WeightedScorecard";
import { ConsequenceChainVisual } from "./visuals/ConsequenceChainVisual";
import { TwoByTwoMatrix } from "./visuals/TwoByTwoMatrix";
import { FeedbackLoopVisual } from "./visuals/FeedbackLoopVisual";
import { NarrativeVisual } from "./visuals/NarrativeVisual";

/** Dispatches a model to its visual template (§8), given whatever inputs the
 * caller is currently holding for it — live decision state in Results, or
 * local example state in the Library's model detail preview. */
export function ModelVisual({
  model,
  optionA,
  optionB,
  inputs,
  onChange,
}: {
  model: MentalModel;
  optionA: string;
  optionB: string;
  inputs: ModelUserInputs;
  onChange: (patch: ModelUserInputs) => void;
}) {
  switch (model.visualTemplate) {
    case "decision-tree":
      return inputs.decisionTree ? (
        <DecisionTreeVisual
          optionA={optionA}
          optionB={optionB}
          inputs={inputs.decisionTree}
          onChange={(patch) => onChange({ decisionTree: { ...inputs.decisionTree!, ...patch } })}
        />
      ) : null;
    case "weighted-scorecard":
      return inputs.scorecard ? (
        <WeightedScorecard
          optionA={optionA}
          optionB={optionB}
          criteria={inputs.scorecard}
          onChange={(i, patch) => {
            const next = inputs.scorecard!.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
            onChange({ scorecard: next });
          }}
        />
      ) : null;
    case "two-by-two":
      return inputs.twoByTwo ? (
        <TwoByTwoMatrix
          modelId={model.id}
          optionA={optionA}
          optionB={optionB}
          inputs={inputs.twoByTwo}
          onChange={(patch) => onChange({ twoByTwo: { ...inputs.twoByTwo!, ...patch } })}
        />
      ) : null;
    case "consequence-chain":
      return inputs.chain ? (
        <ConsequenceChainVisual
          chain={inputs.chain}
          onChange={(i, patch) => {
            const next = inputs.chain!.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
            onChange({ chain: next });
          }}
        />
      ) : null;
    case "feedback-loop":
      return inputs.feedbackLoop ? (
        <FeedbackLoopVisual
          inputs={inputs.feedbackLoop}
          onChange={(patch) => onChange({ feedbackLoop: { ...inputs.feedbackLoop!, ...patch } })}
        />
      ) : null;
    default:
      return <NarrativeVisual model={model} />;
  }
}
