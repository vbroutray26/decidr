import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { structureDecision, decisionTitle } from "../domain/structure";
import { matchModels } from "../domain/match";
import { pickBiases } from "../domain/biases";
import { defaultInputsFor, computeLean } from "../domain/apply";
import { synthesize } from "../domain/synthesize";
import { appendHistory, loadHistory, newDecisionId } from "../store/history";
import { useAuth } from "./AuthContext";
import type { BiasFlag, DecisionObject, Lean, MatchedModel, ModelUserInputs, SavedDecision } from "../domain/types";

interface DecisionState {
  rawText: string;
  setRawText: (v: string) => void;

  decision: DecisionObject | null;
  updateDecision: (patch: Partial<DecisionObject>) => void;
  structureNow: () => DecisionObject;
  matched: MatchedModel[];
  biasFlags: BiasFlag[];
  matchNow: () => void;

  inputsByModelId: Record<string, ModelUserInputs>;
  updateInputs: (modelId: string, patch: ModelUserInputs) => void;
  leanFor: (modelId: string) => Lean;

  activeModelId: string | null;
  setActiveModelId: (id: string) => void;

  checkedBiases: Record<string, boolean>;
  toggleBias: (id: string) => void;

  history: SavedDecision[];
  saveCurrentDecision: () => SavedDecision;

  startNew: () => void;
}

const DecisionContext = createContext<DecisionState | null>(null);

export function DecisionProvider({ children }: { children: ReactNode }) {
  const { currentProfile } = useAuth();
  const [rawText, setRawText] = useState("");
  const [decision, setDecision] = useState<DecisionObject | null>(null);
  const [matched, setMatched] = useState<MatchedModel[]>([]);
  const [biasFlags, setBiasFlags] = useState<BiasFlag[]>([]);
  const [inputsByModelId, setInputsByModelId] = useState<Record<string, ModelUserInputs>>({});
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [checkedBiases, setCheckedBiases] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<SavedDecision[]>([]);

  // Saved decisions are scoped per local profile — reload whenever the signed-in profile changes.
  useEffect(() => {
    setHistory(currentProfile ? loadHistory(currentProfile.id) : []);
  }, [currentProfile]);

  const structureNow = (): DecisionObject => {
    const d = structureDecision(rawText);
    setDecision(d);
    return d;
  };

  const updateDecision = (patch: Partial<DecisionObject>) => {
    setDecision((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const matchNow = () => {
    if (!decision) return;
    const m = matchModels(decision);
    const inputs: Record<string, ModelUserInputs> = {};
    for (const entry of m) inputs[entry.model.id] = defaultInputsFor(entry.model, decision);
    setMatched(m);
    setInputsByModelId(inputs);
    setBiasFlags(pickBiases(decision));
    setCheckedBiases({});
    setActiveModelId(m[0]?.model.id ?? null);
  };

  const updateInputs = (modelId: string, patch: ModelUserInputs) => {
    setInputsByModelId((prev) => ({ ...prev, [modelId]: { ...prev[modelId], ...patch } }));
  };

  const leanFor = (modelId: string): Lean => {
    const entry = matched.find((m) => m.model.id === modelId);
    const inputs = inputsByModelId[modelId];
    if (!entry || !inputs) return "neutral";
    return computeLean(entry.model, inputs);
  };

  const toggleBias = (id: string) => setCheckedBiases((c) => ({ ...c, [id]: !c[id] }));

  const saveCurrentDecision = (): SavedDecision => {
    if (!decision) throw new Error("No decision to save yet");
    if (!currentProfile) throw new Error("No profile signed in");
    const entries = matched.map((m) => ({ matched: m, lean: leanFor(m.model.id) }));
    const synthesis = synthesize(decision, entries);
    const entry: SavedDecision = {
      id: newDecisionId(),
      title: decisionTitle(decision),
      savedAt: new Date().toISOString(),
      decision,
      modelNames: matched.map((m) => m.model.name),
      leaning: synthesis.leaning,
    };
    setHistory(appendHistory(currentProfile.id, entry));
    return entry;
  };

  const startNew = () => {
    setDecision(null);
    setMatched([]);
    setBiasFlags([]);
    setInputsByModelId({});
    setCheckedBiases({});
    setActiveModelId(null);
    setRawText("");
  };

  const value = useMemo<DecisionState>(
    () => ({
      rawText,
      setRawText,
      decision,
      updateDecision,
      structureNow,
      matched,
      biasFlags,
      matchNow,
      inputsByModelId,
      updateInputs,
      leanFor,
      activeModelId,
      setActiveModelId,
      checkedBiases,
      toggleBias,
      history,
      saveCurrentDecision,
      startNew,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawText, decision, matched, biasFlags, inputsByModelId, activeModelId, checkedBiases, history, currentProfile],
  );

  return <DecisionContext.Provider value={value}>{children}</DecisionContext.Provider>;
}

export function useDecision(): DecisionState {
  const ctx = useContext(DecisionContext);
  if (!ctx) throw new Error("useDecision must be used within a DecisionProvider");
  return ctx;
}
