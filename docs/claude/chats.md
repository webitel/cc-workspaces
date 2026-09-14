# Chats in cc-workspaces

State as of 2026-08-27, branch `main`. Verify against the code before asserting anything.

The chat domain also lives in `src/ui/modules/work-section/modules/chat` and
`src/ui/modules/queue-section/modules/chat-queue`; this file covers all three.

## Where chats come from

Two sources, and both are needed.

**WS.** `SUBSCRIBE_CHATS` (`src/features/modules/chat/store/client-handlers.js`) is called
from `src/ui/store/agent-workspace.js` when the agent enters the workspace, and again by
`features/global-handlers` after the socket comes back from Reconnecting/Disconnected. It
also kicks off `active/RELOAD_CHAT_LIST` itself. The SDK keeps every chat as a
`Conversation` instance in its own `conversationStore`. After a page reload the server only
pushes ~40 chats over the socket.

**REST.** `GET /chat/dialogs` via `.../chat/modules/active/api/activeChats.js`
(`getMessages().catalogGetDialogs` from `@webitel/api-services/gen-wire`). Returns flat data
with no methods.

That is why REST data never becomes the working object: a `Conversation` is assembled from
a dialog in `scripts/buildConversationFromDialog.js` and put into `conversationStore` via
`ADD_CHAT_LIST_TO_CLIENT_STORE`. The lists hold ids only — the object itself always comes
from the SDK store.

## The three chat ids

`Conversation.id` is not a field but a getter: `channelId || inviteId || conversationId`.
The SDK stores a chat in `conversationStore` under whatever that value is **at the moment
of writing**:

| chat | key in the store |
|---|---|
| WS, agent joined | `channelId` |
| WS, invite | `inviteId` |
| REST, agent has `member.join` | `channelId` — `setAnswered` runs before the store write |
| REST, no `join` yet | `conversationId` |

After `setAnswered()` the SDK changes `Conversation.id` from `inviteId` to `channelId`,
**but leaves the map key unchanged**. So the key may not match the current `.id`.

`conversationId` never changes, which is why it is the id used in the lists and in `unseen`.
`visibleChatIds` holds `conversationId`, and `VISIBLE_CHAT_LIST` resolves not by key but by
field, off the shared `getClientChats()` helper: `client.allConversations()` (which is
`Array.from(conversationStore.values())` — the SDK store itself, nothing copied), filtered by
`!chat.closedAt`, and empty until the socket state is `Connected`.

## What `/chat/dialogs` returns

Verified against the generated zod schemas in `@webitel/api-services/gen-wire`:

- `dialog.id` is the `conversationId`;
- `members[].id` is documented as "Member / Channel ID", i.e. the member's `channelId` —
  this is what gives an assembled REST chat its `channelId`;
- a non-empty `members[].join` means that member has joined;
- `members[].invite` is `{ date, from }`, i.e. "who invited them". **The API does not return
  `inviteId` at all**, so an invite cannot be set correctly from REST — the only chats worth
  assembling are the ones the agent has already joined.

Empirically (2026-07-29, test stand): the backend ignores `fields`, returns UUIDs without
dashes (hence `toUuid` in our API client — the SDK looks up by dashed values — applied to the
dialog, the members, `invite.from`, `message.sender.id` and `message.chat.id`), and
`fields=closed_cause` makes the backend return a 500. `members[]` also contains the
conversation leg itself — the member whose `member.id === dialog.id`. It has to be filtered
out, otherwise it steals the client's name and the messenger icon; the current agent and bots
are dropped there too.

`snakeToCamel()` from `@webitel/api-services` is recursive and mangles the keys inside
`context` (`cc_attempt_id` → `ccAttemptId`), while the `Conversation` constructor reads
exactly `cc_*` / `wbt_*`. Hence `snakeToCamel(['context'])` in our API client.

## `features/chat` store modules

- **root (`store/chat.js`)** — the workspace-level actions on the chat that is open, plus the
  `client-handlers` actions spread in. It holds no `state` of its own.
- **`active`** — `visibleChatIds` + `size` + `isLoading`; `ALL_CHAT_LIST` is everything the
  client holds (counters, "has more"), `VISIBLE_CHAT_LIST` is only what the panel shows.
- **`active/search`** — a **local** filter over `client.allConversations()` by
  `getClientName`, not a REST search: it sees every chat already in the SDK store, including
  ones outside `visibleChatIds`. `IS_SEARCH_LOADING` only mirrors `active.isLoading`.
- **`closed`** with submodules `unprocessed` and `processed` — REST `AgentChatsAPI`,
  differing only by the `onlyUnprocessed` flag. Both request `size: page * size, page: 1` so
  that every open page is reloaded in a single request (WTEL-5503). Messages of a closed chat
  are pulled from `CatalogAPI` by `chat.conversationId || chat.id` — `chat.id` alone does not
  resolve a closed chat while post-processing is running (WTEL-9955).
- **`manual`** — `cli.agent.waitingListChats`, accepted through
  `interceptAttempt(task.attemptId)`.
- **`chatHistory`** — the conversation history for a contact via
  `contactChatMessagesHistory`, separate from the messages of the current chat.
- **`chatMedia`** — `mediaView` for previewing files and controlling the players, which hang
  directly off the chat object (`chat.players`).
- **`unseen`** — the unread dot. The key is `chat.conversationId || chat.id`, because active
  chats come from the SDK and closed ones from the API. The dot is cleared by
  `MARK_CHAT_SEEN`, dispatched by `useChatScroll` from `@webitel/ui-chats` once the agent has
  actually scrolled to the bottom.

## Lifecycle, and who updates the panel

`chatHandler` in `client-handlers.js` routes `ChatActions` events:

- **UserInvite** → `active/CHAT_INSERT_TO_START`, plus `SET_WORKSPACE` if the workspace is
  empty.
- **Joined** → `active/CHAT_INSERT_TO_START` + `openLinkFromVariable`.
- **Message** → if the message is not mine, a notification and `unseen/ADD_UNSEEN_CHAT`;
  either way `active/CHAT_INSERT_TO_START`.
- **Close** → a notification, and `RESET_CHAT` only if `!chat.allowReporting`. A chat
  awaiting post-processing stays in the panel.
- **Destroy** → `RESET_CHAT`.

`RESET_CHAT` calls `active/REMOVE_CHAT`, resets the unread counter, reloads the closed
chats, and if the closed chat is currently on the workspace — `RESET_WORKSPACE` +
`RESET_CHAT_HISTORY`. The comparison is by `conversationId`: Close/Destroy arrive
asynchronously and the agent may already have another chat open (WTEL-9263).

`CHAT_INSERT_TO_START` and `REMOVE_CHAT` both take a chat, not an id, and work off
`chat.conversationId`.

Division of labour: `RELOAD_CHAT_LIST` pages through REST (40 per page, `MAX_RELOAD_PAGES`
caps a runaway loop), fills the SDK store and then shows the first `size` ids.
`LOAD_NEXT_ACTIVE_CHATS` never touches the network — it only reveals more of what the store
already holds. The panel's "load more" spends the active pages first and only then asks
`closed/unprocessed` for its next page.

## Actions on a chat

All of them go through the `Conversation` instance from the SDK store:

- `join()` and `decline()` require `inviteId`;
- `send()` (which picks `sendText()` / `sendFile()`), `leave()`, `close()`,
  `transferToUser()`, `transferToPlan()` require `channelId` — without it they throw
  `conversation not active`;
- `allowLeave` is `!!channelId && (closedAt === 0 || !hasReporting)`; `ALLOW_CHAT_CLOSE` and
  `ASK_CHAT_CLOSE` are built on it;
- the store's `CLOSE` picks `leave()` or `decline()` based exactly on `allowLeave`.

## Names, messages, files

- `getClientName(members)` — the first member whose `type` is not in `AgentTypes`
  (`webitel`, `user`, `bot`). The queue preview takes the client's name from it, and the
  messenger icon separately from `members[0]`.
- `getDisplayChatName({ chat, contact, userId })` — the name for the header: the contact plus
  the remaining participants, with the current agent dropped from the list (WTEL-9570).
- `formatChatMessages` — reshapes history messages to look like the current chat's messages
  and reverses the order.
- `getFileUrl` — a storage link carrying `access_token` from localStorage.

## Easy things to get wrong

- `rootState.client` is the wrapper from `useWebSocketClient()`; it has neither
  `conversationStore` nor `sessionInfo`. The live instance is `rootState.client.client`,
  reached with `await rootState.client.getCliInstance()` in handlers, or with the synchronous
  `rootState.client.getClientSync()` in getters — that one returns `null` before the socket
  is up, which is why the getters guard on `WebSocketConnectionState.Connected`.
- The key in `conversationStore` does not equal `conversationId` and is not updated after a
  join.
- `unseen` counts by `conversationId`, not by the store key.
- In `subscribeChat` the SDK skips dialogs without `invite_id` / `channel_id`, so we must not
  set such chats either.

## Known problems as of 2026-08-27

- `store/chat.js` still declares a `SET_MEDIA_VIEW` mutation, but the root module has no
  `state` and nobody commits it — the live one is `chatMedia/SET_MEDIA_VIEW`. Only
  `chats.spec.js` calls it, directly on the module object.
