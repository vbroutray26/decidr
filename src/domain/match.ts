import { MODELS } from "./models";
import type { DecisionObject, MatchedModel, MentalModel } from "./types";

const TARGET_SIZE = 5;
const MAX_PER_DOMAIN = 2;

function scoreModel(model: MentalModel, decision: DecisionObject): number {
  let score = 0;
  if (model.decisionTypes.includes(decision.decisionType)) score += 3;
  if (model.stakesFit?.includes(decision.stakes)) score += 1;
  if (model.reversibilityFit?.includes(decision.reversibility)) score += 1;

  const text = decision.rawText.toLowerCase();
  for (const kw of model.keywords) {
    if (text.includes(kw)) score += 2;
  }
  return score;
}

function contradictsAny(model: MentalModel, others: MentalModel[]): boolean {
  return others.some((o) => model.contradicts.includes(o.id) || o.contradicts.includes(model.id));
}

/**
 * Candidate retrieval + diversity-aware selection (§7 steps 2–3): score every
 * model against the decision's shape, then pick a final set that isn't
 * redundant with itself and deliberately includes at least one model that
 * could produce a contradicting verdict.
 */
export function matchModels(decision: DecisionObject): MatchedModel[] {
  const ranked = [...MODELS]
    .map((model) => ({ model, score: scoreModel(model, decision) }))
    .sort((a, b) => b.score - a.score || a.model.id.localeCompare(b.model.id));

  const selected: { model: MentalModel; score: number }[] = [];
  const domainCount = new Map<string, number>();

  for (const entry of ranked) {
    if (selected.length >= TARGET_SIZE) break;
    const count = domainCount.get(entry.model.domain) ?? 0;
    if (count >= MAX_PER_DOMAIN) continue;
    selected.push(entry);
    domainCount.set(entry.model.domain, count + 1);
  }

  // Backfill if domain caps left us short (a sparse match for this decision shape).
  for (const entry of ranked) {
    if (selected.length >= TARGET_SIZE) break;
    if (!selected.some((s) => s.model.id === entry.model.id)) selected.push(entry);
  }

  const hasTension = selected.some((s) => contradictsAny(s.model, selected.map((x) => x.model)));

  if (!hasTension) {
    const selectedModels = selected.map((s) => s.model);
    const contrarian = ranked.find(
      (entry) => !selected.some((s) => s.model.id === entry.model.id) && contradictsAny(entry.model, selectedModels),
    );
    if (contrarian) {
      // Drop the lowest-scoring member that isn't itself load-bearing for domain diversity.
      let dropIndex = selected.length - 1;
      for (let i = selected.length - 1; i >= 0; i--) {
        const domain = selected[i].model.domain;
        if ((domainCount.get(domain) ?? 0) > 1) {
          dropIndex = i;
          break;
        }
      }
      selected.splice(dropIndex, 1, contrarian);
    }
  }

  const finalModels = selected.map((s) => s.model);
  return selected.map(({ model, score }) => ({
    model,
    score,
    isContrarian: contradictsAny(model, finalModels),
  }));
}
