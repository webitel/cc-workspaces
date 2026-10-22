---
title: "global-handlers.js RESTORE_CLIENT_SUBSCRIPTIONS: await SUBSCRIBE_STATUS first"
author: Roman
date: 2026-10-22
standing: true
id: l-10214ec0
scope: repo
status: active
touches:
  - src/features/modules/global-handlers/store/global-handlers.js
---

## Decided
In `RESTORE_CLIENT_SUBSCRIPTIONS` (`global-handlers.js`), follow the order of `OPEN_SESSION`. First `await` `features/status/SUBSCRIBE_STATUS`, then start the other subscriptions in parallel.
`INITIALIZE_MANUAL_LIST` (call and chat) reads `cli.agent.waitingListCalls` and `waitingListChats`. `client.agent` only exists after `agentSession()` inside `SUBSCRIBE_STATUS`, which is an API request.
Example: in PR #1630, everything was dispatched in one `Promise.allSettled`. The manual lists read `cli.agent` while it was still `undefined`, and `allSettled` hid the error. The fix was to await the status subscription first.

## Watch out
`Promise.allSettled` swallows failures, so a wrong order gives no error and the lists just stay empty.

_From review on #1630 here, merged Sep 29._
