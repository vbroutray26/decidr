import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_DECISION_TEXT, DEFAULT_WEIGHTS, MODEL_ORDER, type ModelId, type Weights } from "../data/decision";

interface DecisionState {
  decisionText: string;
  setDecisionText: (v: string) => void;
  promotionStatus: string | null;
  setPromotionStatus: (v: string) => void;
  weights: Weights;
  setWeight: (key: keyof Weights, value: number) => void;
  activeModel: ModelId;
  setActiveModel: (id: ModelId) => void;
  checkedBiases: Record<string, boolean>;
  toggleBias: (name: string) => void;
}

const DecisionContext = createContext<DecisionState | null>(null);

export function DecisionProvider({ children }: { children: ReactNode }) {
  const [decisionText, setDecisionText] = useState(DEFAULT_DECISION_TEXT);
  const [promotionStatus, setPromotionStatus] = useState<string | null>(null);
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [activeModel, setActiveModel] = useState<ModelId>(MODEL_ORDER[0]);
  const [checkedBiases, setCheckedBiases] = useState<Record<string, boolean>>({});

  const value = useMemo<DecisionState>(
    () => ({
      decisionText,
      setDecisionText,
      promotionStatus,
      setPromotionStatus,
      weights,
      setWeight: (key, value) => setWeights((w) => ({ ...w, [key]: value })),
      activeModel,
      setActiveModel,
      checkedBiases,
      toggleBias: (name) => setCheckedBiases((c) => ({ ...c, [name]: !c[name] })),
    }),
    [decisionText, promotionStatus, weights, activeModel, checkedBiases],
  );

  return <DecisionContext.Provider value={value}>{children}</DecisionContext.Provider>;
}

export function useDecision(): DecisionState {
  const ctx = useContext(DecisionContext);
  if (!ctx) throw new Error("useDecision must be used within a DecisionProvider");
  return ctx;
}
