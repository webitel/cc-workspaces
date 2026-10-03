# Member — delta

> Divergences between [`spec.md`](./spec.md) and [`as-built.md`](./as-built.md),
> at 26.8.0.

---

## M-01. `CALL` reads module-scope `state`, not `context.state` — DEFECT

```js
CALL: async (context, { id, communicationId }) => {
  const memberId = id || context.getters.MEMBER_ON_WORKSPACE.id;
  const commId   = communicationId || state.selectedCommId;   // ← not context.state
```

`state` here is the **module-level `const`**, captured by closure. It works today
only because `member.js` declares state as a plain object shared by the single
store instance.

The very same codebase already has the other form: `features/chat/store/chat.js`
declares `const state = () => ({ failedFiles: {} })` — a **factory**. If `member`
is ever converted the same way, or the module is registered twice, `state` in this
closure stops being the live state and `commId` silently becomes `undefined` —
placing a callback to no communication.

Every other read in the file uses `context.state` / `context.getters` correctly.
This is one line out of step.

---

## M-02. Chat history entries are always discarded — DEFECT (cross-module)

`RESET_WORKSPACE_STATE` decides whether to keep a history entry by string
convention:

```js
context.rootState.features[type][`${type}List`]?.includes(task)
```

| type | resolves to | exists? |
| --- | --- | --- |
| `call` | `features.call.callList` | yes |
| `job` | `features.job.jobList` | yes |
| `member` | `features.member.memberList` | yes |
| `chat` | `features.chat.chatList` | **no** |

`features/chat` root state is `{ failedFiles: {} }` — verified. There is no
`chatList` anywhere in the codebase (a grep finds only local `computed`s in two
Vue components).

So for a chat entry the expression is `undefined?.includes(...)` → `undefined` →
falsy → **`pop()`**. A chat can never satisfy the keep-condition.

**Effect:** whenever the workspace state resets, every chat in the history is
popped. The agent cannot fall back to a previously open chat; the history only
ever preserves calls, jobs and members.

Whether this is noticeable depends on how often multiple states stack, but the
loop's whole purpose is restoring the previous activity — and for one of the four
types it cannot work.

**Not reproduced at runtime**, but the data shape is confirmed on both sides.

---

## M-03. `MemberTab.Contacts` has no component — dead enum value

```ts
export const MemberTab = { Communications, History, Contacts };
```

```js
const memberTabComponents = {
  [MemberTab.Communications]: MemberCommunications,
  [MemberTab.History]: History,
};
```

`Contacts` is declared and never mapped. `currentComponent` falls back to
`Communications` for any unmapped tab, so selecting it — if it is selectable at
all — silently shows the wrong panel rather than failing.

Whether the tab is offered in the UI was **not checked**; `member-header.vue` was
not read.

---

## M-04. Two pieces of state are never written — dead code

```js
state = { agent: null, memberOnWorkspace: {}, … }
```

- `agent` has a mutation (`SET_AGENT_INSTANCE`) that **nothing commits**.
  `GET_AGENT_INSTANCE` fetches a fresh session from the client on every call
  instead.
- `memberOnWorkspace` has no mutation at all. The real value is read through the
  `MEMBER_ON_WORKSPACE` getter off the workspace state history.

Both read as leftovers from an earlier design. `SET_AGENT_INSTANCE` duplicates a
mutation name used for real in `agent-status`
([`../agent-status/as-built.md`](../agent-status/as-built.md) §2), which makes
grepping for it misleading.

---

## M-05. Polling every 15 s, undocumented — UNDOCUMENTED

`SUBSRIBE_MEMBER_LIST` reloads the whole list every **15 seconds**.

Member is the **only activity type without push**: calls, chats and tasks all
arrive over the socket. Offline members are polled.

Nothing documents this, its interval, or its consequence — a member called back
by another agent stays visible for up to 15 seconds.

Whether `CALL`'s immediate `LOAD_DATA_LIST` prevents double-calling within that
window was **not verified**; it only refreshes the caller's own view.

---

## M-06. Page size is 20, the spec says 10 — DIVERGENT

The User Guide states *"Up to 10 calls are displayed in the list"* for Offline
calls.

`LOAD_DATA_LIST` defaults to `size: 20`.

The displayed count may still be capped in the UI component, which was not read —
but the store's own default contradicts the documented number, and the default is
what any caller omitting `payload` gets, including the 15-second poller.

Compare missed calls, where `size: 10` is hardcoded in the store and matches the
spec ([`../call/as-built.md`](../call/as-built.md) §5.2).

---

## M-07. Search is implemented, undocumented — UNDOCUMENTED

`agent.offlineMembers(search, page, size)` accepts a search term, defaulting to
`''`.

Nothing in the documentation mentions searching offline members, and §2.3
describes the flow as scrolling a list of up to ten.

Whether the UI exposes a search field was **not checked**.

---

## M-08. `SUBSRIBE_MEMBER_LIST` misspelled — minor

Third typo of this kind in the codebase, after `WORKSRACE_STATE`
([`../job/delta.md`](../job/delta.md) J-06) and `CLIENT_TIMOUT`
([`../chat/delta.md`](../chat/delta.md) H-02).

Also in the same action, `const response = await context.dispatch(…)` assigns a
value that is never used.

---

## M-09. `member` is a workspace state but not a channel — architecture note

`WorkspaceState` has four values; `features/` has four channel-ish modules; but
`member` is neither distributed nor subscribed. It occupies the central panel
like an activity while being a **browsable list**.

This shows up in small asymmetries throughout:

- it is the only type whose `RESET_WORKSPACE` passes a config
  ([`as-built.md`](./as-built.md) §6)
- its left-panel list lives under `call-queue/`, not its own directory
- it polls rather than subscribes (M-05)

None of this is wrong. It is worth stating plainly because the four-value enum
invites the assumption that all four behave alike, and they do not.

---

## M-10. Whole feature rests on five sentences — process gap

§2.3 of the User Guide is the complete specification: open the list, pick a
subscriber, pick a number, press call, plus three display constraints.

Behind it: SDK-backed paging with search, a 15-second poll, a communications
selector with a selected-state contract (`Number.isInteger`), a member History
view, a dead Contacts tab, and a special-cased workspace-history reset
([WTEL-3064](https://webitel.atlassian.net/browse/WTEL-3064)).

The same shape as [`../notifications/delta.md`](../notifications/delta.md) N-11
and [`../global-handlers/delta.md`](../global-handlers/delta.md) G-01 — a
cross-cutting module with substantial behaviour and near-zero written
specification.

---

## Open questions

1. Is the Offline list actually capped at 10 in the UI, despite `size: 20`? (M-06)
2. Is a search field exposed for offline members? (M-07)
3. Is the `Contacts` tab selectable in `member-header.vue`? (M-03)
4. Does the chat-history pop (M-02) cause visible behaviour, or do chats never
   stack in practice?
5. Can two agents call the same member inside the 15-second poll window? (M-05)
