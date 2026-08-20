# Decidr

A working implementation of the Decidr v1 MVP described in the product plan: describe a real decision in your own words, and get back a curated set of mental models — matched, applied to your actual options, and synthesized into a verdict that doesn't hide disagreement between models.

This isn't a scripted demo. The full pipeline runs client-side, rule-based (no LLM call), against a real decision object it extracts from whatever you type:

- **`src/domain/models.ts`** — a curated, attributed repository of 61 mental models across 10 taxonomy domains (psychology, economics, probability, systems, strategy, philosophy, decision structuring, negotiation, management, personal), each with when-to-use/when-it-misleads guidance, decision-type tags, and deliberate `contradicts` links.
- **`src/domain/structure.ts`** — the structuring step (§7.1): parses free text into a decision object (named options, decision type, reversibility, stakes, horizon, primary tension) via heuristics, editable on the Classify screen.
- **`src/domain/match.ts`** — candidate retrieval + diversity-aware selection (§7.2–3): scores the repository against the decision's shape and picks 5 models that aren't redundant with each other, deliberately including one that could produce a contradicting verdict.
- **`src/domain/apply.ts`** / **`src/domain/synthesize.ts`** — per-model application and verdict synthesis (§7.4–6), computed from *your* numbers (decision-tree probabilities/payoffs, scorecard weights and scores, regret sliders), not canned text.
- **`src/domain/biases.ts`** — a separate bias-flag pass (§7.5) surfacing the cognitive biases most likely to be distorting this specific decision.

Saved decisions persist to `localStorage` (`src/store/history.ts`) — no backend, matching the v1 scope ("save/history, no outcome-tracking loop yet"). The app is an installable, offline-capable PWA (`vite-plugin-pwa`) so saved decisions stay reviewable without a connection.

Screens: Home → Capture → Classify → Processing → Results (dynamic model set, per-model interactive visuals: decision tree, weighted scorecard, 2×2 matrix, consequence chain, feedback loop, or a narrative fallback) → Verdict → Brief → History, plus a searchable/filterable Library over the full repository.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Design system

Colors, type, and spacing tokens live in `src/styles/tokens/`, copied from the Claude Design canvas this app originated from. The dark-canvas surface steps (`--d-*` variables) are layered on top in `src/styles/global.css`.

## Scope notes

Follows the plan's own v1 MVP boundaries (§11): text input only (voice is v1.1), no explicit bias-flag *export*, no outcome tracking, no contributor pipeline. The bias-flag checklist and interactive weighted-criteria sliders are pulled forward from v1.1 since they were already part of the original design canvas.
