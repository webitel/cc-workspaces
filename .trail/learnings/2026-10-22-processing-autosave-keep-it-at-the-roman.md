---
title: "processing autosave: keep it at the processing tab, not global store"
author: Roman
date: 2026-10-22
standing: true
id: l-a8ff749d
scope: repo
status: active
touches:
  - src/features/modules/global-handlers/store/global-handlers.js
---

## Decided
Processing form autosave belongs in the processing tab's composable (`useProcessingAutosave.ts`). It should not be a global `SUBSCRIBE_TO_PROCESSING_AUTOSAVE` in `global-handlers.js` that sweeps all tasks every second.
Don't depend on underscore-prefixed fields such as `attempt._processing`. They are private and may change. Prefer typed `.ts` modules for new logic.
Example: in PR #1412, the global handler iterated every task each tick and read `attempt._processing?.autosave`. The logic was moved to the processing module as a typed composable.

_From review on #1412 here, merged Oct 14._
