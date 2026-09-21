# Calls — delta

> Divergences between [`spec.md`](./spec.md) and [`as-built.md`](./as-built.md),
> at `@webitel/workspace` 26.8.0.
>
> Classification: **UNDOCUMENTED** (in code, not in spec) ·
> **UNIMPLEMENTED** (in spec, not in code) · **DIVERGENT** · **STALE** ·
> **DEFECT** (code contradicts itself or the spec)

---

## C-01. Conference mode not implemented by the agent — UNIMPLEMENTED

[WDEV/44997404](https://webitel.atlassian.net/wiki/spaces/WDEV/pages/44997404/dft.+Workspace)
specifies a third connection mode (Conference, via Eavesdrop) with a dial-out
view, blinking icon, participant states and disabled transfers.

In code there is **no conference initiation at all**. `CallTab.enum.ts` has five
tabs — Numpad, Contacts, History, Transfer, Bridge — and none is Conference.
Grepping the whole `src` for `conference` / `eavesdrop` returns exactly two
files: `client-handlers.js` (which only *suppresses notifications* when
`call.isEavesdrop`) and `active-queue-preview.vue` (which only *renders an icon*
when `task.eavesdropIsConference`).

**Conclusion:** Workspace can display that it is in a conference, but the agent
cannot start one. Conferences originate in Supervisor.

Consistent with the document's own status — it is a `dft.` draft with "в роботі
дока на ФЕ" at the top, not an accepted spec.

---

## C-02. Prompter / whisper mode — UNDOCUMENTED

`active-queue-preview.vue` renders a `prompter` icon when
`task.eavesdropIsPrompt` is true. Nothing in the user guide or in the reviewed
WPR/WDEV pages describes a prompter (whisper/coaching) state for the agent.

The agent sees an icon whose meaning is documented nowhere.

---

## C-03. Transfer to a **Queue** — UNDOCUMENTED

The user guide describes transfer targets as "a list of agents" only.
`call-transfer/components/` implements three:

- `agents-call-transfer.vue`
- `users-call-transfer.vue`
- `queues-call-transfer.vue`

Transfer to a queue is fully implemented and entirely undocumented.

Note this is *not* the same as
[WPR/1113292812 "Transfer to Dialplan"](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1113292812/todo.+Workspace+Dialplan)
(still `todo`) or
[WPR/200933385 "Transfer to Contact"](https://webitel.atlassian.net/wiki/spaces/WPR/pages/200933385/Workspace)
(still questioned).

---

## C-04. Missed calls are server-side, not event-derived — DIVERGENT

The spec reads as if the agent's client tracks misses (reject → "+1 to missed
calls"). In reality `missed-calls` is a **separate API-backed list**
(`getMissedCalls` / `redialToMissed` / `hideMissedCall`), refreshed on the SDK
`refresh_missed` event.

This explains the deduplication rules in §2.2 of the spec — they are server
behaviour, and the client only renders the result. Any future change to those
rules is a backend change, not a Workspace change.

---

## C-05. Dead miss-handling branch — DEFECT

`client-handlers.js`, `HANDLE_DESTROY_ACTION`:

```js
if (context.getters['missed/IS_CALL_MISSED'](call)) {
  // await context.dispatch('missed/ON_CALL_MISS', call);
}
```

The condition is evaluated and the body is commented out. `IS_CALL_MISSED` is
therefore computed on every call destroy and discarded, and `ON_CALL_MISS` does
not exist in the `missed` module.

Harmless at runtime, but it is a live `if` with no effect — a reader will assume
misses are handled locally (see C-04). Same pattern in `BLIND_TRANSFER` and
`BRIDGE`, where `REMOVE_CALL` / `RESET_WORKSPACE` are commented out.

---

## C-06. Transfer and bridge swallow all errors — DEFECT

```js
BLIND_TRANSFER: async (context, number) => {
  try { await call.blindTransfer(number); } catch {}
},
BRIDGE: async (context, callToBridge) => {
  try { await call.bridgeTo(callToBridge); } catch {}
},
```

Empty `catch {}` — a failed transfer produces **no notification, no log, no state
change**. The agent sees the call simply stay put.

`SEND_DTMF`, `TOGGLE_HOLD` and `HANGUP` do the same.

Contrast with `ANSWER`, which does surface permission errors through
`eventBus.$emit('notification', ...)`. The error-handling policy is inconsistent
within one module.

---

## C-07. `userId` read non-reactively, with a leftover log — DEFECT

`missed-calls.js`, `REQUEST_PARAMS`:

```js
const { userId } = userinfoStore; // NOTE! its not reactive!
console.info('userId got from userinfoStore: ', userId);
```

Two problems: a getter that silently depends on a non-reactive read, and a
`console.info` shipped to production that fires on every missed-calls request.

---

## C-08. External softphone mode — UNDOCUMENTED

`isExternalPhoneActive()` materially changes call behaviour:

- outgoing calls are forced audio-only
- microphone and camera permission checks are skipped entirely

None of the reviewed documentation mentions an external softphone (pjsip) mode,
how it is enabled, or that video becomes unavailable in it.

For an agent this is a visible capability change with no documented cause.

---

## C-09. Video preference persisted across sessions — UNDOCUMENTED

`TOGGLE_VIDEO` writes `localStorage['isVideo']`, restored by
`RESTORE_VIDEO_PARAM`. The agent's outgoing-video choice survives reload and
logout on that browser. Not documented.

Also note the naming collision: `features/call/TOGGLE_VIDEO` (outgoing-video
preference) and `features/call/videoCall/TOGGLE_VIDEO` (mute video on the
current call) are different actions with the same name.

---

## C-10. Hold-others is automatic and unconditional — DIVERGENT

The spec states hold occurs when the agent calls another number during a call.

In code `HANDLE_ACTIVE_ACTION` dispatches `HOLD_OTHER_CALLS` on **every**
transition to Active, and `CALL` holds the existing active call before dialling.
So any second call becoming active holds all others, regardless of who initiated
it.

---

## C-11. `IS_ANY_RINGING` semantics — RESOLVED: name is wrong, logic is right

```js
IS_ANY_RINGING: (state) =>
  state.callList.length &&
  state.callList.every((call) => isIncomingRinging(call)),
```

The name says *any*, the implementation says *every*.

**Resolved while writing [`../notifications/`](../notifications/).** The sole
consumer is the `watch` in
`features/modules/notifications/composables/useAppNotification.ts`, which starts
the ringtone when this getter becomes true and stops it when it becomes false.

`every` is therefore **correct**: the ringtone must play only while *nothing has
been picked up yet*, and must stop the moment any call goes active. `some` would
keep ringing during a conversation whenever a second call arrived.

What remains is the **name**: `IS_ANY_RINGING` describes the opposite quantifier
of what it computes. `IS_NOTHING_ANSWERED_YET` or `IS_ONLY_RINGING` would say it.
Renaming is safe — one consumer.

---

## C-12. `openLinkFromVariable` on first answer — UNDOCUMENTED

`HANDLE_ACTIVE_ACTION` calls `openLinkFromVariable(call)` when `call.firstActive`.
Workspace can **open an external URL** carried in call variables the moment the
call goes active. This is a significant, agent-visible, integration-facing
behaviour and it is not in the user documentation.

---

## C-13. Ringing notification suppression rules — UNDOCUMENTED

Notifications are suppressed for eavesdropped calls, offline-queue calls, and
calls from queues with `manual_distribution`
([WTEL-4502](https://webitel.atlassian.net/browse/WTEL-4502)).

The user guide says self-assigned *chats* arrive without a sound but states
nothing equivalent for calls. The actual rule set is broader and undocumented.

---

## C-14. Destination sanitising is silent — UNDOCUMENTED

`CALL` strips every character outside `0-9 a-z A-Z + * #` from the destination,
and `NORMALIZE_PHONE_NUMBER` separately strips `( ) -` and whitespace. A
mistyped number is silently rewritten rather than rejected. No documented rule
describes what constitutes a valid destination.

---

## C-15. Spec's "10 items" limit is client-side only for missed — partially STALE

The guide states a 10-item cap with paging for Missed, Offline and Self-assigned.
Confirmed in code for **Missed** (`size: 10` hardcoded in `REQUEST_PARAMS`).

For **Offline** and **Self-assigned** the limit was **not verified** — the
self-assigned list comes straight from `cli.agent.waitingListCalls` with no
visible slicing in the store. Needs checking in the UI components.

---

## Open questions

1. ~~Is `IS_ANY_RINGING`'s `every` intentional?~~ **Resolved** — yes, see C-11.
2. What triggers `eavesdropIsPrompt`, and what should the agent do when they see
   it? (C-02)
3. Are Offline and Self-assigned lists actually capped at 10? (C-15)
4. Is the external softphone mode a deployment setting or a per-user one? (C-08)
5. Which call variable does `openLinkFromVariable` read, and who configures it?
   (C-12)
