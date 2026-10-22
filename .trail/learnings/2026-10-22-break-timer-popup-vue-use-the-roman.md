---
title: "break-timer-popup.vue: use the UI lib color enum for button colors"
author: Roman
date: 2026-10-22
standing: true
id: l-dbbc1ab2
scope: repo
status: active
touches:
  - src/ui/modules/popups/break-popup/break-timer-popup.vue
---

## Decided
In `break-timer-popup.vue`, `secondaryButtonSettings` must take button colors from the color enum in the Webitel UI lib. Don't use raw strings like `'error'`.
Example: in PR #1622, the secondary button used the literal `color: 'error'`. The reviewer asked for the lib's enum instead.

_From review on #1622 here, merged Sep 24._
