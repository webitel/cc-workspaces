# Agent status — delta

> Divergences between [`spec.md`](./spec.md) and [`as-built.md`](./as-built.md),
> at 26.8.0.

---

## S-01. `channels` and `onDemand` are always `undefined` — DEFECT

```js
SET_AGENT_WAITING_STATUS: async (context, { activityType } = {}) => {
  const agent = await context.dispatch('GET_AGENT_INSTANCE');
  const { channels, onDemand, onlineSkill } = {
    onlineSkill: activityType,
  };
  ...
  await agent.online(channels, onDemand, onlineSkill);
```

The object being destructured has a single key. `channels` and `onDemand` are
therefore **unconditionally `undefined`**, and the destructuring of those two
names is meaningless — it reads as if it pulls them from somewhere, and it does
not.

Effectively the call is `agent.online(undefined, undefined, activityType)`.

This has the shape of an **incomplete refactor**: someone replaced a real source
object with a literal carrying only the new `activityType` and left the other two
names in the pattern.

**What it costs:** if the SDK's `online()` treats `channels` as "which channels
this agent will serve" and `onDemand` as a mode flag, Workspace can never set
either, and always relies on SDK defaults. **Not verified against the SDK
signature** — that check is the first thing to do here.

Whatever the runtime effect, the code is misleading and should read
`agent.online(undefined, undefined, activityType)` or take the values from a
real source.

---

## S-02. Activity types are implemented; the spec says `todo` — DIVERGENT

[WPR/361267206](https://webitel.atlassian.net/wiki/spaces/WPR/pages/361267206/todo.+v1.+Workspace)
is marked **Status: TODO, Priority: P0**.

But the mechanism is in the code:

- `TOGGLE_CONTACT_CENTER_MODE(activityType)` takes an activity type
- `app-header.vue` passes it: `toggleCCenterMode(activityType)`
- it reaches `agent.online(..., onlineSkill)` as the **online skill**
- `break-timer-popup.vue` imports `wt-cc-activity-type-options` and
  `useActivityTypesOptions` from `@webitel/ui-sdk`

So an agent can already pick an activity type when going online, and when
returning to work from a pause.

**What is not verified:** whether the Admin "Activity type" lookup exists, whether
the "empty lookup → no modal" rule holds, whether "Standard Online" is the
default, and whether the skills intersection behaves as specified. The Workspace
side is present; the feature may be complete and the page simply stale, or
partially delivered.

Either way the WPR page is wrong today, and it is a **P0** page — the kind most
likely to be read as a plan for work not yet started.

---

## S-03. Pause comment shipped; its spec page is undated on status — DIVERGENT

`SET_AGENT_PAUSE_STATUS(note = '')` passes a note straight to `agent.pause(note)`,
which is exactly
[WPR/843087908 `Коментар оператора при переході в "Паузу"`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/843087908/Workspace)
(agent adds a comment explaining the chosen pause cause; supervisor can read it).

The store supports it. **Whether the UI collects the note was not verified** —
the picker lives in `@webitel/ui-sdk`, outside this repository.

Same pattern as S-02: capability present in Workspace, spec page not updated.

---

## S-04. Presence "busy" is matched on `dlg`, not `busy` — UNDOCUMENTED

```js
[UserStatus.BUSY]: presence?.status?.includes('dlg'),
```

Every other flag matches its own name (`dnd`→dnd, `sip`→sip, `web`→web). Busy
matches **`dlg`** — presumably "dialog".

Nothing documents the presence string format or this mapping. A reader of the
enum would reasonably expect `'busy'`, and a backend change to the presence
vocabulary would break this silently.

---

## S-05. Presence parsing is substring matching — fragile

`parseUserStatus` uses `.includes()` on the raw presence value against four
literals. Any presence token that happens to contain `sip`, `web`, `dnd` or `dlg`
as a substring sets the corresponding flag.

The type in `getUserStatusByPriority.ts` declares `status?: string | string[]` —
so the value may be an **array**, in which case `.includes()` performs exact
element matching instead of substring matching. **The two behave differently, and
the code does not distinguish them.**

Which form the backend actually sends was not verified.

---

## S-06. DnD and Busy outrank agent status — UNDOCUMENTED

`getUserStatusByPriority` resolves DND first and BUSY second, **before** looking
at agent status at all. An agent who is Online in the call centre but flagged DND
shows as DND to everyone else.

The User Guide lists the possible indicator values but never states a precedence
order. With
[WTEL-3798](https://webitel.atlassian.net/browse/WTEL-3798) establishing that a
user can hold several statuses at once, the order is the whole substance of the
feature — and it is undocumented.

Also undocumented: **agent Offline shows grey regardless of SIP/WEB presence**,
while a non-agent user with SIP or WEB shows ACTIVE. The same underlying presence
produces a different colour depending on whether the user is an agent.

---

## S-07. Users without an agent session are supported but unspecified — UNDOCUMENTED

```js
try { agent = await client.agentSession(); }
catch (err) { return; }  // abort action, if no agent
```

and in `getUserStatusByPriority.ts`:

> `// because users without agent permissions can use workspase too`

So Workspace explicitly supports **non-agent users**: `state.agent` stays `null`,
`IS_AGENT` is false, and the status control degrades.

No reviewed document describes what Workspace looks like or is for without agent
permissions. Given the entire User Guide is written as "the agent's workplace",
this is a whole undocumented usage mode.

---

## S-08. Silent abort on agent-session failure — DEFECT

The `catch` above swallows **every** error from `agentSession()`, not just
"no agent". A transport failure, a permissions error or a malformed response all
produce the same silent `return`, leaving `state.agent === null`.

The agent then sees a Workspace that looks like the non-agent mode (S-07), with
no indication that something failed.

Contrast with `SET_AGENT_WAITING_STATUS`, which discriminates on `error.id` and
re-throws anything it does not recognise — the correct pattern, in the same file.

---

## S-09. SDK object mutated into a Vue proxy — architecture risk

```js
client.agent = reactive(client.agent);
```

Workspace **overwrites a property on the SDK client** with a Vue reactive proxy so
that template bindings update.

Consequences: SDK-internal identity comparisons against `client.agent` may fail,
and any SDK code holding a pre-existing reference keeps the raw object while
Workspace holds the proxy. It also runs on every `SUBSCRIBE_AGENT_STATUS`, so a
re-subscribe wraps the proxy again.

Same class of concern as `callList` holding live SDK instances
([`../call/as-built.md`](../call/as-built.md) §2) — but here the SDK's own state
is modified, not merely referenced.

---

## S-10. `window.agent` global — minor

`window.agent = agent` alongside the existing `window.$store`. Convenient for
debugging, but it is a production global holding a live session object, and
nothing marks it as debug-only.

---

## S-11. `AGENT_LOGOUT` does not await — minor DEFECT

```js
AGENT_LOGOUT: async (context) => {
  const agent = await context.dispatch('GET_AGENT_INSTANCE');
  agent.offline();     // not awaited
},
```

The action resolves before `offline()` completes. `TOGGLE_CONTACT_CENTER_MODE`
awaits `AGENT_LOGOUT`, so it awaits nothing meaningful; and `the-app.vue` calls
`AGENT_LOGOUT` during teardown, where an un-awaited promise is most likely to be
dropped.

Every sibling action (`online`, `pause`) is awaited.

---

## S-12. Pause restriction is entirely server-side — DIVERGENT

The spec devotes a full section to the pause restriction: checking every queue
against *"Access to pause when there are more online agents than:"*, the
**Attention** modal, and the `X/Y` display in General info.

**None of that logic is in `agent-status`.** The store simply calls
`agent.pause(note)`. The check, the refusal and the counts come from the backend
and are surfaced elsewhere (the `X/Y` display belongs to the General info tab).

Not a defect — worth recording because the spec reads as if Workspace enforces
it, and anyone changing pause behaviour here would find nothing to change.

---

## S-13. The status control is not in this repository — scope note

`agent-status-select.vue` is a pass-through to
**`wt-cc-agent-status-select` from `@webitel/ui-sdk`**. The dropdown, the
pause-cause modal and the activity-type options all live in the SDK.

So the most-documented part of §1.1.5 of the User Guide — how the agent actually
changes status — cannot be verified from `cc-workspaces` alone.

Third occurrence of this pattern: chats depend on `@webitel/ui-chats`
([`../chat/as-built.md`](../chat/as-built.md) §9), screenshots on
`@webitel/ui-datalist` ([`../video/as-built.md`](../video/as-built.md) §5.3).
**Any complete Workspace specification has to cross into the UI SDK.**

---

## Open questions

1. What is the real signature of `agent.online()`, and does dropping `channels` /
   `onDemand` change behaviour? (S-01)
2. Is the activity-types feature actually complete, or only its Workspace half?
   (S-02)
3. Does the UI collect the pause note? (S-03)
4. Is `presence.status` a string or an array on the wire? (S-05)
5. What is Workspace expected to do for a user without agent permissions? (S-07)
