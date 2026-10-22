---
title: "active-queue-preview.vue: use AgentIcon enum for sender icons"
author: Roman
date: 2026-10-22
standing: true
id: l-8c9f446d
scope: repo
status: active
touches:
  - src/ui/modules/queue-section/modules/chat-queue/components/active-queue/active-queue-preview.vue
  - "src/ui/modules/queue-section/modules/chat-queue/components/active-queue/active-queue-preview.vue#lastMessageSenderIcon"
---

## Decided
In `lastMessageSenderIcon()` of `active-queue-preview.vue`, return `AgentIcon` enum members (for example `AgentIcon.Bot`). Don't return raw icon-name strings like `'bot'`.
Example: in PR #1663, the method returned the literal `'bot'` when `lastMessage.member` was missing. The reviewer said to use `AgentIcon.Bot` and the other members.

_From review on #1663 here, merged Oct 19._
