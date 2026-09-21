# Chats — as built

> **Source of truth:** `src/features/modules/chat`,
> `src/ui/modules/work-section/modules/chat`,
> `src/ui/modules/queue-section/modules/chat-queue`, at 26.8.0.

## ⚠️ Read the existing engineering doc first

**[`docs/claude/chats.md`](../../docs/claude/chats.md)** (166 lines, stated as of
2026-08-27) already documents the chat domain at the SDK/transport level: the
two data sources, the three chat ids, the `conversationStore` keying problem,
per-module store responsibilities, the event lifecycle, and known traps.

**This file does not repeat it.** It covers the *behavioural* layer — what the
agent can do and what the UI exposes — and points at `docs/claude/chats.md` for
mechanism. Where the two disagree, `docs/claude/chats.md` is newer on transport
detail; verify against code either way, as its own header instructs.

Note both `features/modules/chat/CLAUDE.md` and
`ui/modules/queue-section/modules/chat-queue/CLAUDE.md` exist solely to redirect
readers there.

## 1. Module layout

```
features/modules/chat/
├── store/chat.js                root actions on the open chat + failed-file state
├── store/client-handlers.js     ChatActions event routing
├── store/chat-history.js        contact history (separate from current chat)
├── store/chat-media.js          file preview / players
├── store/unseen.js              unread counter (dot + badge)
├── modules/active/              visible chat ids, + local search submodule
├── modules/closed/              REST-backed, submodules: unprocessed, processed
├── modules/manual/              self-assigned
├── modules/post-processing/
├── enums/AgentTypes.enum.ts
└── scripts/                     name / message / file helpers
```

Total ≈1620 lines across the JS/TS files.

## 2. Left panel (`chat-queue`)

Containers: `active-queue`, `manual-queue`, `closed-queue` — matching the three
documented lists.

Two preview densities: `chat-queue-preview-md.vue` and
`chat-queue-preview-sm.vue`, plus a shared `last-message-container.vue`
(implements [WPR/1207042065](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1207042065/26.02+Chats+Workspace),
"show who sent the last message").

`ChatStatus.enum.ts`:

```ts
ChatStatus  = { New: 'new', Active: 'active', Closed: 'closed' }
ChatTypes   = { Manual: 'manual' }
ChatColorsMap = { new: 'success', active: 'warning', closed: 'disabled', manual: 'disabled' }
```

`AgentIcon.enum.ts` distinguishes three participant kinds in previews:
`Bot` / `Contact` / `Agent`.

`AgentTypes.enum.ts` (`webitel`, `user`, `bot`) is what `getClientName` excludes
to find the actual client among the members.

## 3. Actions on the open chat

All go through the SDK `Conversation` instance:

| Store action | SDK call | Guard |
| --- | --- | --- |
| `SEND` | `send()` → `sendText()` / `sendFile()` | needs `channelId` |
| `SEND_FILE` / `SEND_SINGLE_FILE` | per-file, failures collected | — |
| `TRANSFER` | `transferToUser(id)` **or** `transferToPlan(id)` | `ALLOW_CHAT_TRANSFER` |
| `CLOSE` | `leave()` if `allowLeave`, else `decline()` | — |
| join / decline | `join()` / `decline()` | need `inviteId` |

`allowLeave` is `!!channelId && (closedAt === 0 || !hasReporting)`.
`ALLOW_CHAT_CLOSE` and `ASK_CHAT_CLOSE` (the confirmation modal) are built on it.

### 3.1. Transfer destinations

`ChatTransferDestination` has **two** values:

```js
if (destination === ChatTransferDestination.USER)     return chat.transferToUser(item.id);
if (destination === ChatTransferDestination.CHATPLAN) return chat.transferToPlan(item.id);
throw new TypeError('Unknown transfer destination: ', destination);
```

## 4. Close reasons

`modules/closed/enums/ChatCloseReason.enum.js` defines **six**:

```js
AGENT_TIMEOUT   : 'agent_timeout'
CLIENT_TIMOUT   : 'client_timeout'   // key is misspelled in the source
SILENCE_TIMEOUT : 'silence_timeout'
AGENT_LEAVE     : 'agent_leave'
CLIENT_LEAVE    : 'client_leave'
TRANSFER        : 'transfer'
```

## 5. Failed file uploads

`store/chat.js` keeps `failedFiles` keyed by `conversationId || id`:

- `FAILED_FILES` getter returns the failed list for the chat on the workspace
- files are appended on send failure and cleared on `CLOSE`
- `CLEAR_FAILED_FILES` also runs as part of closing

So per-chat file-failure state is tracked and survives while the chat is open.

## 6. Quick replies

`chat-messaging/quick-replies/` with `useQuickReplies.ts`
(ref [WTEL-4923](https://webitel.atlassian.net/browse/WTEL-4923)):

- a searchable panel of canned replies, with empty-state art for light and dark
- **variable interpolation**: `${varName}` in the reply text is replaced from the
  chat's variables; an unknown name is left as-is
- selecting a reply clears the search and closes the panel after a 300 ms delay
  (animation)
- `input()` strips the existing draft out of the typed text so more than one
  reply can be picked in sequence

Surfaced through an autocomplete mechanism —
`chat-messaging/autocomplete/enums/AutocompleteOptions.ts` currently has exactly
one option, `QUICK_REPLIES`.

## 7. Central panel structure

```
work-section/modules/chat/
├── chat-header/
├── chat-footer/
├── chat-messaging/
│   ├── current-chat/
│   ├── chat-history/
│   ├── message/            (components + composables)
│   ├── quick-replies/
│   └── autocomplete/
└── scripts/
```

`chat-history` (contact history across messengers) is a **separate subtree** from
`current-chat`, matching the store split between `chat-history.js` and the active
chat.

## 8. Unread indicator

`store/unseen.js` keys `unseenChatIds` by `conversationId || id` (null-safe; a
chat with neither key is ignored). The value is a **count**: `ADD_UNSEEN_CHAT`
increments, `REMOVE_UNSEEN_CHAT` deletes the key outright. Two getters read it:

| Getter | Used by |
| --- | --- |
| `IS_CHAT_UNSEEN` | the dot on `active-queue-preview.vue`, `closed-queue-preview.vue`, and the scroll-to-bottom affordance in `current-chat.vue` / `the-chat-history.vue` |
| `UNSEEN_COUNT` | the numeric badge on the video call's `Chat` tab |

The module is written to by **two** producers:

- `store/client-handlers.js` — `HANDLE_MESSAGE_ACTION`, for every message the
  agent did not send themselves (`IS_MY_MESSAGE`);
- `video-call/.../useVideoCallChatUnseen.ts` — for in-call chat, by watching the
  message array ([WTEL-8866](https://webitel.atlassian.net/browse/WTEL-8866); see
  [`../video/delta.md`](../video/delta.md) V-13).

`MARK_CHAT_SEEN` likewise has two callers: `useChatScroll` from
`@webitel/ui-chats`, once the agent has actually scrolled to the bottom, and the
video-call composable, as soon as the `Chat` tab is opened.

## 9. External dependency

Chat rendering leans on **`@webitel/ui-chats`**, a shared package — not all chat
behaviour lives in this repository.
