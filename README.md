# Decidr

A mobile-first, tappable implementation of the Decidr v1 MVP flow — describe a decision, get back the mental models that apply to it, see the reasoning, and walk away with a verdict.

Built with React + TypeScript + Vite, driven by a single demo decision ("the Singapore offer vs. the promotion") end to end: Home → Capture → Classify → Processing → Results (5 models with live visuals, including a draggable weighted scorecard) → Verdict → Brief → History, plus a searchable Library.

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

Colors, type, and spacing tokens live in `src/styles/tokens/`, copied from the Claude Design canvas this app implements. The dark-canvas surface steps (`--d-*` variables) are layered on top in `src/styles/global.css`.
