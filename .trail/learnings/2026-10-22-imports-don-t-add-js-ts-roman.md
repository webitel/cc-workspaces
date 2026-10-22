---
title: "Imports: don't add .js/.ts extensions to local import paths"
author: Roman
date: 2026-10-22
standing: true
id: l-e1a81b21
scope: repo
status: active
touches:
  - src/features/modules/global-handlers/store/global-handlers.js
---

## Decided
Write local imports without the file extension (`../scripts/processingAutosave`, not `...processingAutosave.js`). This applies to source files and specs, for example `global-handlers.js` and `processingAutosave.spec.js`. Configure the IDE auto-import so it doesn't append `js`/`ts`.
Example: in PR #1412, new imports of `processingAutosave.js` and `formattingFormBeforeSend.js` were written with extensions. The reviewer asked for them to be removed.

_From review on #1412 here, merged Oct 14._
