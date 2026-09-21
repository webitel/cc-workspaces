# Global handlers — delta

> Divergences between [`spec.md`](./spec.md) and [`as-built.md`](./as-built.md),
> at 26.8.0.

---

## G-01. Connection loss is entirely undocumented — UNDOCUMENTED

The module implements a complete connection-loss policy: a popup, a sound, the
destruction of all client-side activity state, chat re-binding on recovery, and
SIP-registration warnings.

**Not one line of it is in the user documentation.** The User Guide's only
connection content is the SIP indicator in the top bar.

An agent whose socket drops mid-call sees: a popup with a sound, the call
vanishing from the panel, and a "Reload page" button — with no documented
explanation of what happened to the call or what they should do.

This is the largest behaviour-to-documentation gap in the spec set after
[`../notifications/delta.md`](../notifications/delta.md) N-11.

---

## G-02. `CLEAR_ALL_TASKS` discards work in progress — DIVERGENT in emphasis

On disconnect, the client wipes calls, chats, jobs and the workspace state
history. The rationale is sound and documented in code
([WTEL-8920](https://webitel.atlassian.net/browse/WTEL-8920)): stale getters are
worse than empty ones.

But the **consequence** is not written down anywhere: a brief network blip clears
the agent's view of an active conversation. Whether the underlying call survives
on the server is a separate question the client no longer reflects.

Specifically unverified, and worth checking:

- if post-processing is open with unsaved data when the socket drops, is it lost?
- does the task reappear after reconnect, or must the agent reload?

The popup offering **Reload page** suggests reload is the expected recovery.

---

## G-03. Only chats are re-subscribed on reconnect — asymmetry

```js
if (prev === Reconnecting || prev === Disconnected) {
  context.dispatch('features/chat/SUBSCRIBE_CHATS', …);
}
```

Chats get an explicit re-bind. Calls and jobs get none.

The comment says the first session is opened by `OPEN_SESSION` and this only
re-binds chats — implying calls and jobs recover through the SDK's own path.
**Not verified.** Given `CLEAR_ALL_TASKS` has just emptied `callList` and
`jobList`, something must re-seed them, and it is not this module.

If the SDK does not re-push them, the agent's call and task lists stay empty
until reload — which would make **Reload page** the only real recovery, not a
convenience.

---

## G-04. Watchers are created and never stopped — DEFECT

```js
SUBSCRIBE_TO_CONNECTION_STATE: (context) => {
  let stop = null;
  stop = watch(…);
  return stop;
},
```

The action returns the stop handle, but `INIT_GLOBAL_HANDLERS` dispatches it
without capturing the return value, so the handle is discarded.

`SUBSCRIBE_TO_PHONE_UNREGISTERED_NOTIFICATION` does not even return one — it
calls `watch()` and drops the result.

`RESET_GLOBAL_HANDLERS` closes the popup and stops nothing.

**Consequence:** every `INIT_GLOBAL_HANDLERS` adds watchers that live for the
page's lifetime. If init can run more than once — re-entering the workspace,
a session restart — watchers accumulate and each transition fires the handler
multiple times.

Whether init runs more than once was **not checked**; the leak exists regardless
of whether it is currently reachable.

The `let stop = null; stop = watch(…)` pattern is also redundant — a plain
`return watch(…)` is equivalent.

---

## G-05. SDK `on()` listeners are never removed — DEFECT

`SUBSCRIBE_TO_CLIENT_DISCONNECT`, `SUBSCRIBE_TO_CLIENT_CLOSED` and
`SUBSCRIBE_TO_PHONE_REGISTRATION` all call `client.on(…)` with no matching
`client.off(…)` anywhere in the module.

Same class as G-04, and the same open question: harmless if init runs once,
compounding if it does not.

Compare `sw-controller`, which does implement a `DESTROY`
([`../notifications/as-built.md`](../notifications/as-built.md) §7) — the pattern
exists in the codebase, just not here.

---

## G-06. Production `console.log` on every connection transition — DEFECT

```js
console.log('[WS connection state]:', value);
```

Unconditional, not behind a debug flag, fires on every state change including
`Connecting` and `Idle` during normal startup.

Second instance of this in the spec set, after
[`../call/delta.md`](../call/delta.md) C-07 (`console.info` on every missed-calls
request).

---

## G-07. Unused asset shipped — minor

`assets/disconnect-sound.mp3` is not referenced anywhere. Only the `.wav` is
imported.

Likely a leftover from a format-compatibility pass. It is bundled dead weight.

---

## G-08. The popup reaches into a feature module for its asset — architecture

```js
import disconnectSound from '../../../../../features/modules/global-handlers/assets/disconnect-sound.wav';
```

A `ui/modules/popups` component climbing five levels into `features/modules` to
import a sound file.

The sound is also played by the component itself with a local
`isDisconnectSoundAllow` flag, **bypassing the notifications module** that owns
every other sound in the app (volume control, `IS_MAIN_TAB`, the
currently-playing interlock).

So the disconnect sound ignores the agent's ringtone volume settings
([`../notifications/as-built.md`](../notifications/as-built.md) §6) and can
overlap with a ringtone. **Not verified** — but no code path connects the two.

---

## G-09. Namespace is `globals`, module is `global-handlers` — minor

`features.js` registers the module as **`globals`**:

```js
import globals from '../modules/global-handlers/store/global-handlers';
```

so consumers write `features/globals`, while the directory, file and this spec
are all called *global-handlers*.

A small papercut when grepping.

---

## G-10. `getters: {}` — dead declaration

The module declares an empty `getters` object and exports it. Harmless, but it
signals an intent that was never filled: everything is read through `mapState`
directly, including from outside the module (`disconnect-popup.vue`).

---

## G-11. Phone registration is signalled only on loss — DIVERGENT

The watcher fires only on `true → false`:

```js
if (prev === true && value === false) { … error toast … }
```

So the agent is told when SIP registration is lost, and **never told when it
returns**. The top-bar indicator presumably reflects recovery, but the loss gets
an explicit interrupt and the recovery does not.

The error string used is
`error.websocket.store_sql_user_get_default_device_app_error` — a **backend SQL
error key** reused as the user-facing text for "your phone is no longer
registered". Whatever it renders as, it is not a message written for this
situation.

---

## Open questions

1. Can `INIT_GLOBAL_HANDLERS` run more than once per page? (G-04, G-05)
2. Are calls and jobs re-seeded after reconnect, or is reload required? (G-03)
3. Is open post-processing data lost when the socket drops? (G-02)
4. Does the disconnect sound respect ringtone volume? (G-08)
5. What does `store_sql_user_get_default_device_app_error` actually render as in
   each locale? (G-11)
