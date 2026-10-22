# Notifications — as built

> **Source of truth:** `src/features/modules/notifications`,
> `src/features/modules/sw-controller`, at 26.8.0.

## 1. Layout

```
features/modules/notifications/
├── store/notifications.js            root: settings + hangup-sound flag
├── call/store/call.js                199 lines — the largest
├── chat/store/chat.js                170 lines
├── job/store/job.js
├── composables/useAppNotification.ts the ringing watcher
└── helpers/getRingtoneVolume.ts

features/modules/sw-controller/store/sw-controller.js
```

Four store namespaces are registered separately in `features.js`:
`notifications`, `callNotifications`, `chatNotifications`, `jobNotifications` —
the per-channel ones are **siblings** of the root, not children of it.

## 2. Root store

Built on **`NotificationsStoreModule` from `@webitel/ui-sdk`**, which supplies
`PLAY_SOUND`, `STOP_SOUND`, `currentlyPlaying`, `IS_MAIN_TAB` and
`SET_CURRENTLY_PLAYING`. Workspace adds:

```js
state = {
  isHangupSoundAllowed: false,  // prevents STOP_SOUND before the hangup sound plays
  settings: null,               // notification settings from the API
}
```

| Getter | Behaviour |
| --- | --- |
| `GET_NOTIFICATION_SETTING(key)` | `state.settings ? state.settings[key] : null` — null-guarded |
| `PUSH_NOTIFICATION_TIMEOUT` | `state.settings[…PushNotificationTimeout] \|\| 30` — **not** null-guarded |

Settings are loaded by `LOAD_NOTIFICATION_SETTINGS` via
`UserSettingsAPI.get({ key: 'notification' })`.

## 3. The ringing watcher

`useAppNotification.ts` — mounted once, in `the-agent-workspace.vue`. Its own
comment explains why it exists:

> *"This composable is needed for watcher to watch ringing; it is not possible to
> watch inside store"*

```js
watch(isAnyRinging, (value) => {
  if (value) playRinging();
  else if (isHangupSoundAllowed.value) changeHangupSoundAllowance(false);
  else stopPlaying();
});
```

`isAnyRinging` is `features/call/IS_ANY_RINGING`, which is true only while **every**
call in the list is still ringing — so the ringtone stops the moment anything is
answered. See [`../call/delta.md`](../call/delta.md) C-11.

`isHangupSoundAllowed` is the interlock that stops the watcher from cancelling the
call-end sound: when set, the watcher consumes the flag instead of calling
`STOP_SOUND`.

## 4. Call notifications

### 4.1. `HANDLE_ANY_CALL_RINGING`

Reads `localStorage['settings/ringtone']`; if present, builds
`${VITE_RINGTONES_URL}/${ringtoneName}` as a custom sound, otherwise passes
`undefined` and the SDK default is used.

Then (ref [WTEL-4918](https://webitel.atlassian.net/browse/WTEL-4918)):

```js
context.rootState['features/notifications/currentlyPlaying']
  ? setTimeout(playSound, 1000)
  : playSound();
```

See [`delta.md`](./delta.md) N-01.

### 4.2. `HANDLE_INBOUND_CALL_RINGING`

Two steps (ref [WTEL-4240](https://webitel.atlassian.net/browse/WTEL-4240)):

1. Subscribe **once** to the service worker's `notificationclick`, mapping
   `accept` → `answer()` and `decline` → `hangup()`. `once: true` means a fresh
   subscription per notification.
2. Send the notification through `swController/SEND_NOTIFICATION`:
   - title: `notifications.newCall`, plus `\nQueue: <prettified name>` when the
     call came from a queue (direct agent-to-agent calls have none)
   - body: `${displayName}: ${displayNumber}`
   - actions: `accept` / `decline`

`prettifyQueue` converts `some_queue_name` → `Some queue name`.

### 4.3. `HANDLE_CALL_END`

Gated on two independent settings:

- `CallEndPushNotification` → `eventBus.$emit('notification', …)` with
  `PUSH_NOTIFICATION_TIMEOUT`
- `CallEndSoundNotification` → set `isHangupSoundAllowed`, then `PLAY_SOUND`
  with `CallActions.Hangup`

Also stops the ringtone, clears `localStorage['wtIsPlaying']` and resets
`currentlyPlaying`.

### 4.4. `HANDLE_SELF_ASSIGNED_CALL_RINGING`

Plays `SELF_ASSIGNED_CALL_ACTION` only when **both** hold:

- `SelfAssignedCallSoundNotification` is on, **and**
- no call is currently `active` or `isHold`

So a self-assigned call is announced only to an idle agent.

### 4.5. `HANDLE_CALL_START`

Stops the ringtone, sets `localStorage['wtIsPlaying'] = 'true'` and
`SET_CURRENTLY_PLAYING(true)`.

`wtIsPlaying` in `localStorage` is a **cross-tab** marker — `localStorage` is
shared between tabs of the same origin, which is how multiple Workspace tabs
avoid ringing over each other (the SDK module also has `IS_MAIN_TAB`).

## 5. Chat and job notifications

Same shape, each reading its own settings through `GET_NOTIFICATION_SETTING` and
playing through the root `PLAY_SOUND`:

- chat: `HANDLE_CHAT_EVENT`, `HANDLE_CHAT_END`, volume from `RingtoneType.Chat`,
  and a `SEND_NOTIFICATION` path of its own
- job: `HANDLE_JOB_DISTRIBUTE`, `HANDLE_JOB_END`, volume from `RingtoneType.Task`

## 6. Volume

`getRingtoneVolume(type)` reads `localStorage['settings/ringtone-volume']`:

- new format: a JSON object keyed by `RingtoneType` (`Call` / `Chat` / `Task`),
  falling back to `1.0` per type
- on parse failure: falls back to the **old single-value format**
  (`parseFloat`), then `1.0`

So per-channel volume is a per-browser setting with backward compatibility for a
previous single-value scheme.

## 7. Service-worker controller

`sw-controller.js` wraps `navigator.serviceWorker` in a store module, using an
`event-emitter` instance as the bus:

| Action | Behaviour |
| --- | --- |
| `INITIALIZE` | attach a `message` listener that re-dispatches to `WORKER_MESSAGE_HANDLER` |
| `DESTROY` | detach it |
| `WORKER_MESSAGE_HANDLER` | `emitter.emit(event.data.type, event.data.action)` |
| `SUBSCRIBE_TO_MESSAGE` | `emitter.once` or `emitter.on` |
| `SEND_NOTIFICATION` | `sw.controller.postMessage({ type: 'notification', payload })` |
| `HIDE_NOTIFICATIONS` | `await sw.ready`, `reg.getNotifications({ title })`, close each |

`subscriber` is a **module-level `let`**, so only one listener can be tracked at a
time.

`HIDE_NOTIFICATIONS` is called by the call module on talking-start and call-end
with the literal title `'New call'`
(ref [WTEL-7915](https://webitel.atlassian.net/browse/WTEL-7915)).
