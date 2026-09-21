# Bug Assessment: Closed chat history never loads for a transferred chat that is still active

- **Slug**: wtel-10384-closed-chat-history
- **Created**: 2026-09-17
- **Source**: https://webitel.atlassian.net/browse/WTEL-10384
- **Verdict**: likely valid, needs reproduction
- **Severity**: critical

## Source retrieval

- URL supplied: `https://webitel.atlassian.net/browse/WTEL-10384`
- Host parsed: `webitel.atlassian.net`
- Policy branch: `allowlisted` (`*.atlassian.net`)
- Retrieved through the Atlassian MCP connector (`getJiraIssue`), not a raw web fetch.
  Content below is quoted as data; no instruction inside the issue was acted on.

## Report (summarized)

Jira WTEL-10384, Bug, priority Critical, status Investigation, assignee Roman Zaritskyi,
reported 2026-09-10 by Iryna Bushtyn.

> `[UGB] [FE][Wokrpsce > Chats > Transfer]` Неможливо відкрити історію закритого чату,
> якщо цей чат було переведено і він ще активний

Actual result: an endless scroll is shown when opening the closed chat; no message history
appears, while the chat is transferred and still active for another agent.
Expected result: the closed chat's history renders correctly.

## Symptom

Agent 1 hands a chat to Agent 2 via transfer. The chat leaves Agent 1's active list and
appears under Closed chats, but the conversation itself is still open on Agent 2's side.
When Agent 1 opens that closed chat, the history pane pages forever and never renders
messages, instead of showing the conversation Agent 1 took part in.

## Reproduction

1. Open Workspace as two agents (O1, O2) with the contact centre enabled.
2. Have a client start a chat through a configured text gateway (e.g. a Telegram bot).
3. Accept the chat as O1.
4. Transfer the chat to O2 (requires a configured chat plan).
5. Accept the chat as O2 — it is now closed for O1 and active for O2.
6. As O1, open the chat from the Closed chats list.
7. Observe: endless scroll, no message history.

[NEEDS CLARIFICATION: the report does not say whether the client contact was identified
(a CRM contact bound to the chat). This matters — see Root Cause Hypothesis, the two code
paths diverge exactly on that condition.]

## Suspected Code Paths

- `src/features/modules/chat/modules/closed/store/closed.js:140` — `OPEN_CLOSED_CHAT`
  branches on `chat.contact?.id`. Without a contact it loads messages over REST; with a
  contact it only calls `SET_WORKSPACE` and leaves message loading to the contact-history
  path. The two branches resolve the chat by different identifiers.
- `src/features/modules/chat/modules/closed/store/closed.js:151` —
  `LOAD_CLOSED_CHAT_HISTORY` sets `targetChatId = chat.id` (line 153; the local is
  assigned and never read — biome's `noUnusedVariables` is off, so it survives).
- `src/features/modules/chat/modules/closed/store/closed.js:175` —
  `FIND_TARGET_CHAT_IN_HISTORY` recurses: it pages the contact's chat history through
  `chatHistory/LOAD_NEXT` and calls itself until `next` is false or the target chat's
  first message is found. There is no page cap and no other exit.
- `src/features/modules/chat/modules/closed/store/closed.js:201` —
  `FIND_TARGET_CHAT_FIRST_MESSAGE` matches `message.chat?.id === targetChatId` and
  additionally requires a chat-start boundary (`message.chat?.id !== prevMessage?.chat?.id`).
- `src/features/modules/chat/modules/closed/store/closed.js:78` — the REST branch
  deliberately uses `chat.conversationId || chat.id`, with an in-code comment that
  `chat.id` does not resolve a closed chat (WTEL-9955).
- `src/ui/modules/work-section/modules/chat/chat-messaging/chat-history/the-chat-history.vue:265`
  — `loadMessagesList()` awaits `loadClosedChatHistory()` before
  `scrollToClosedChatFirstMessage()`, so the whole paging loop runs inside the initial
  render of the pane.
- `src/features/modules/chat/store/chat-history.js:42` — `LOAD_NEXT` increments the page
  and prepends; it has no upper bound of its own.

## Root Cause Hypothesis

Confidence: **low**. The leading hypothesis was tested and **falsified** — see below. What
remains established is the failure *mode*, not yet the trigger.

Established: `FIND_TARGET_CHAT_FIRST_MESSAGE` compares identifiers with strict string
equality, and `FIND_TARGET_CHAT_IN_HISTORY` recurses with no page cap. Whenever the target
chat is not matched, the loop pages the contact's entire history and the pane stays empty —
that is the endless scroll. This part holds regardless of why the match fails.

Not established: why the match fails specifically for a transferred chat. The identifier
format explanation is dead (see Falsified below). The remaining candidate is that on
transfer the id `/agent/chats` reports for the closing agent's leg is not among the
`chats[]` the contact history returns — but that has not been observed.

## Empirical Findings (2026-09-17, test.webitel.me)

Read-only GETs against the test stand with the assignee's own token.

### Confirmed

1. Contact chat history nests two levels. Raw `message.chat.id` is a **1-based index into
   `chats[]`**, not an identifier (observed values `'3','3','3','3','22','22','16','12'`).
   `getAllMessages` resolves it via `chat: chats[chat.id - 1]`, so the merged
   `message.chat.id` is the entry from `chats[]`. Anyone reading the raw response in
   DevTools will misread this field.

2. `GET /chat/dialogs/{id}/messages` accepts the conversation id in **either** format —
   dashed and undashed return byte-identical message sets. The server normalizes; the
   frontend does not. This is why the no-contact branch (`LOAD_CLOSED_CHAT`) is robust: it
   hands the id to the server instead of comparing it locally.

3. `GET /agent/chats?only_closed=true` for an ordinary closed chat returns:

   ```json
   {"id":"90fdb75c-feb3-49dd-ab15-f37afc8b486e",
    "contact":{"id":"413","name":"Roman"},
    "close_reason":"agent_leave"}
   ```

   `GET /contacts/413/chat/messages` returns that exact id inside `chats[]`.
   **Exact string match: true.** The reporter-side UI check agrees: the history renders.

### Falsified

- **Identifier format mismatch.** `AgentChat.id` is dash-formatted, and so is
  `chats[].id` in the contact history. There is no format divergence between these two
  endpoints, and no `toUuid` normalization is missing on this path. The earlier reasoning
  inferred the format from the sibling `/chat/dialogs` endpoint, which does return undashed
  ids — that inference did not transfer.

- **Broader scope.** A closed, non-transferred chat with an identified contact resolves
  correctly and renders its history. The defect is **not** general to the contact-history
  branch. The ticket's scope was right and this assessment's earlier scope warning was
  wrong.

### Still unobserved

The transferred scenario itself. It needs the chat to be closed for one agent while active
for another, which the single-account probe could not produce. The decisive data is the
`/agent/chats` item for a **transferred** closed chat: its `id` and `contact.id`, compared
against `chats[]` from `/contacts/{contact.id}/chat/messages`. Same two requests as above.

## Proposed Remediation

**Preferred**: make the contact-history path resolve the target chat by the same stable
identifier the REST path uses, instead of `chat.id`. Concretely, match on the conversation
identifier when the closed chat carries one, falling back to `chat.id` only when it does
not, mirroring the WTEL-9955 fix. Establish first — empirically, against a transferred
chat on a test stand — which field on the closed-chat item and which field on
`message.chat` actually correlate the two views; the assessment cannot settle that from
static reading alone.

Independently of which identifier wins, bound `FIND_TARGET_CHAT_IN_HISTORY` with an
explicit page cap in the style of `MAX_RELOAD_PAGES`, and on exhaustion fall back to the
REST branch (`LOAD_CLOSED_CHAT`) or render what history was loaded, rather than leaving the
pane empty. This turns an unbounded loop into a bounded, diagnosable failure and fixes the
endless-scroll symptom even if the identifier question is later answered differently.

**Alternatives**:
- Always use the REST branch (`LOAD_CLOSED_CHAT`) for closed chats and drop the
  contact-history branch entirely. Simpler and identifier-stable, but it loses the
  cross-chat context that the contact-history view exists to provide, and it would
  regress the intent behind the Confluence item "Показувати історію саме відкритого чату".
- Have the backend return the conversation identifier on agent-chat items, removing the
  correlation problem at its source. Correct long-term, but it is a backend change and
  does not unblock this ticket.

**Files likely to change**:
- `src/features/modules/chat/modules/closed/store/closed.js`
- `src/features/modules/chat/modules/closed/__tests__/closed.spec.js` (does not exist yet)

**Tests to add or update**:
- `FIND_TARGET_CHAT_IN_HISTORY` stops after the page cap when the target chat never appears,
  and does not dispatch `LOAD_NEXT` beyond it.
- `FIND_TARGET_CHAT_IN_HISTORY` sets `closedChatFirstMessageId` when the target chat appears
  on a later page, asserting the id committed — not merely that the action resolved.
- `OPEN_CLOSED_CHAT` routes to `LOAD_CLOSED_CHAT` without a contact and to the
  contact-history path with one, asserting the dispatch and its payload.
- A transferred-chat fixture where the closed item's `id` differs from `message.chat.id`,
  asserting the history still resolves.

Note: `src/features/modules/chat/modules/closed/` currently has **no specs at all**, so
this fix has no regression net under it today.

## Risks & Considerations

- WTEL-9955 is still IN PROGRESS and touches the same resolution logic; the two changes can
  collide. Coordinate before editing `closed.js`.
- Changing the matched identifier risks regressing WTEL-10165 (closed chat shows no history)
  and WTEL-10022 (not all history shown when the contact is unidentified), both recently
  closed. Both need a re-check after the fix.
- WTEL-5861 (closed chat showing the active chat's history) was closed as Cannot Reproduce
  and describes a neighbouring symptom; it may be the same root cause and worth reopening
  if this hypothesis holds.
- Removing the unbounded recursion changes timing on the initial render of the history pane;
  `useObserveHeightUntilStable` and the WTEL-9997 anchor re-alignment depend on that timing.
- The endless scroll may also be exhausting the contact-history endpoint for contacts with
  long histories — a performance and load concern beyond the visual symptom.

## Open Questions

- [NEEDS CLARIFICATION: for a transferred closed chat, does the `/agent/chats` item's `id`
  appear in the contact history's `chats[]`? This is now the single decisive question.]
- [NEEDS CLARIFICATION: on transfer, does the closing agent's leg keep its identifier, or
  does the conversation get recorded under the receiving agent's leg?]
- [NEEDS CLARIFICATION: is the intended product behaviour to show only the closing agent's
  own leg, or the full conversation including what happened after the transfer? The
  Confluence item "todo. [Chats] Закриті чати. Покращення" asks to show "історію саме
  відкритого чату" but does not settle the transfer case. Owner: Olena Bilianska.]
