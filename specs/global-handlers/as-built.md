# Global handlers — as built

> **Source of truth:** `src/features/modules/global-handlers`,
> `src/ui/modules/popups/disconnect-popup`, at 26.8.0.

## 1. Layout

```
features/modules/global-handlers/
├── store/global-handlers.js       169 lines — the whole module
└── assets/
    ├── disconnect-sound.wav       used
    └── disconnect-sound.mp3       not referenced anywhere
```

Registered in `features.js` under the namespace **`globals`** (not
`globalHandlers`), so components read `mapState('features/globals', …)`.

## 2. State

```js
state = {
  isDisconnectPopup: false,
  isPhoneReg: false,        // SIP phone registration
}
```

`getters` is an **empty object**.

## 3. Entry points

```js
INIT_GLOBAL_HANDLERS: (context) => {
  context.dispatch('SUBSCRIBE_TO_CONNECTION_STATE');
  context.dispatch('SUBSCRIBE_TO_PHONE_REGISTRATION');
  context.dispatch('SUBSCRIBE_TO_CLIENT_DISCONNECT');
  context.dispatch('SUBSCRIBE_TO_CLIENT_CLOSED');
  context.dispatch('SUBSCRIBE_TO_PHONE_UNREGISTERED_NOTIFICATION');
},

RESET_GLOBAL_HANDLERS: (context) => {
  context.dispatch('CLOSE_DISCONNECT_POPUP');
},
```

Five subscriptions on init; **one** popup close on reset.

## 4. Connection state machine

`WebSocketConnectionState.enum.ts`:

```ts
Idle | Connecting | Connected | Reconnecting | Disconnected
```

`SUBSCRIBE_TO_CONNECTION_STATE` is a Vue `watch` on `rootState.client.state`,
with `immediate: true`:

| Transition | Effect |
| --- | --- |
| → `Reconnecting` or `Disconnected` | `OPEN_DISCONNECT_POPUP`; sets a local `isConnectionLost = true` |
| → `Connected` | `CLOSE_DISCONNECT_POPUP` |
| → `Connected` while `isConnectionLost`, and `getClientSync()` is truthy | resets the flag, dispatches **`RESTORE_CLIENT_SUBSCRIPTIONS`** |

The flag replaces the earlier `prev`-state check, so the restore still fires when
the state passes through `Connecting` on the way back.

The comment:

> *"first session is opened by OPEN_SESSION; here we only re-bind subscriptions to
> the new client after the socket comes back"*

A reconnect destroys the old SDK `Client` and creates a new one
(`useWebSocketClient.ts` → `handleDisconnect` → `destroyClient` →
`getCliInstance({ forceReconnect: true })`), so every `client.on(…)` /
`subscribe*` has to be repeated.

`RESTORE_CLIENT_SUBSCRIPTIONS` first **awaits** `features/status/SUBSCRIBE_STATUS`
(agent session), then runs the rest through `Promise.allSettled`:

- `SUBSCRIBE_TO_PHONE_REGISTRATION`, `SUBSCRIBE_TO_CLIENT_DISCONNECT`,
  `SUBSCRIBE_TO_CLIENT_CLOSED` (this module)
- `features/call/SUBSCRIBE_CALLS` — re-seeds `callList` from `client.allCall()`
- `features/chat/SUBSCRIBE_CHATS` — reloads the active chat list
- `features/job/SUBSCRIBE_JOBS` — re-seeds `jobList` from `client.allJob()`
- `features/call/missed/INITIALIZE_MISSED`
- `features/call/manual/INITIALIZE_MANUAL_LIST`,
  `features/chat/manual/INITIALIZE_MANUAL_LIST`

Not restored: `SUBSCRIBE_TO_PHONE_UNREGISTERED_NOTIFICATION` (a Vue `watch`, not
bound to the client) and the notifications module.

Source: [WTEL-10495](https://webitel.atlassian.net/browse/WTEL-10495).

The watcher logs every transition to the console:

```js
console.log('[WS connection state]:', value);
```

## 5. Clearing all tasks

```js
CLEAR_ALL_TASKS: (context) => {
  context.commit('workspace/SET_STATE_HISTORY', [], { root: true });
  context.dispatch('features/call/SET_CALL_LIST', [], { root: true });
  context.commit('features/call/CLEAR_CALL_INFO', null, { root: true });
  context.commit('features/chat/active/SET_VISIBLE_CHAT_IDS', [], { root: true });
  context.commit('features/job/SET_JOB_LIST', [], { root: true });
},
```

Five cross-module writes, reaching into three channel stores and the workspace
state history. Ref [WTEL-8920](https://webitel.atlassian.net/browse/WTEL-8920).

Note the workspace **state history** is cleared first, deliberately — otherwise
`CALL_ON_WORKSPACE` and friends keep resolving against a task that no longer
exists.

Triggered from two SDK events:

- `client.on('disconnected')` → `CLEAR_ALL_TASKS` **and** `OPEN_DISCONNECT_POPUP`
- `client.on('close')` → `CLEAR_ALL_TASKS` only
  (ref [WTEL-8909](https://webitel.atlassian.net/browse/WTEL-8909))

## 6. SIP registration

`SUBSCRIBE_TO_PHONE_REGISTRATION` listens to `phone_registered` and also seeds
the initial value from `client.phoneIsRegister()`.

`SUBSCRIBE_TO_PHONE_UNREGISTERED_NOTIFICATION` watches `state.isPhoneReg` for a
**`true → false`** edge only, and raises a localised error toast:

```js
i18n.global.t('error.websocket.store_sql_user_get_default_device_app_error')
```

So the agent is told when the phone *loses* registration, but not when it gains
one.

## 7. Disconnect popup

`ui/modules/popups/disconnect-popup/components/disconnect-popup.vue`:

- rendered with **`v-show`**, not `v-if`, per
  [WTEL-2827](https://webitel.atlassian.net/browse/WTEL-2827)
- reads `features/globals` state directly via `mapState`
- plays `disconnect-sound.wav`, imported from the **`global-handlers` assets
  folder** — a UI component reaching into a feature module for an asset
- holds `isDisconnectSoundAllow` locally, outside the notifications module
- two actions: **Reload page** and **Close**

The file carries a testing hint in a comment:

```js
// HOW TO TEST DISCONNECT: await cli.socket.close(3001)
```

Note the popup is dismissible, and closing it does not restore the connection —
it only hides the dialog.
