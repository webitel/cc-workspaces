# Calls — as built

> **Source of truth:** `src/features/modules/call` and
> `src/ui/modules/{queue,work}-section/modules/call`, at `@webitel/workspace` 26.8.0.

## 1. Module layout

```
features/modules/call/
├── call.js                       root Vuex module (341 lines)
├── client-handlers.js            webitel-sdk event handlers (186 lines)
├── modules/manual/               self-assigned calls
├── modules/missed-calls/         missed calls (+ own API client)
├── video-call/                   video sub-module (+ nested chat)
├── screenshots/                  screenshot capture
└── scripts/                      isIncomingRinging, mediaPermissions
```

UI:

```
ui/modules/queue-section/modules/call-queue/   left panel  — 4 lists
ui/modules/work-section/modules/call/          central panel — 5 tabs
```

## 2. State

```js
state = {
  callList: [],        // live webitel-sdk Call instances
  isVideo: false,      // outgoing-video preference, persisted to localStorage
  callInfo: new Map(), // per-call remote media flags
}
```

`callList` holds **SDK objects, not plain data**. Capabilities are read off them
directly: `allowAnswer`, `allowHold`, `allowUnHold`, `allowHangup`, `allowDtmf`.
The store never decides whether an action is permitted — the SDK does.

## 3. Event handling

`SUBSCRIBE_CALLS` subscribes to the SDK client and seeds `callList` from
`client.allCall()`. `callHandler` dispatches on `CallActions`:

| Action | Handler | Effect |
| --- | --- | --- |
| `Ringing` | `HANDLE_RINGING_ACTION` | add call; focus workspace if outbound or workspace empty; fire notification |
| `Active` | `HANDLE_ACTIVE_ACTION` | on `firstActive` open link from variable; **hold all other calls** |
| `Hangup` | `HANDLE_HANGUP_ACTION` | stop audio element, close notifications |
| `Destroy` | `HANDLE_DESTROY_ACTION` | remove call, reset workspace |
| `PeerStream` | `HANDLE_STREAM_ACTION` | create `Audio`, attach `srcObject`, play |
| `Info` | `HANDLE_INFO_ACTION` | update `callInfo` with remote hold / video / audio mute |

**Ringing notification is suppressed** when any of these hold
(ref [WTEL-4502](https://webitel.atlassian.net/browse/WTEL-4502)):
`!call.allowAnswer`, `call.isEavesdrop`, `IS_OFFLINE_CALL`, or
`call.queue?.manual_distribution`.

Audio playback is a raw `new Audio()` per stream, stored on the call object as
`call.workspaceAudio` and paused on hangup.

## 4. Actions

| Action | Notes |
| --- | --- |
| `CALL` | holds any existing active call first; strips everything but `0-9 a-z A-Z + * #` from the destination; `video` is forced off when the external softphone is active |
| `ANSWER` | checks mic permission (skipped under external softphone), and camera permission for video calls; only proceeds `if (call.allowAnswer)` |
| `BLIND_TRANSFER` | `call.blindTransfer(number)` |
| `BRIDGE` | `call.bridgeTo(callToBridge)` |
| `TOGGLE_MUTE` / `TOGGLE_HOLD` / `SET_HOLD` | guarded by SDK `allow*` flags |
| `SEND_DTMF` / `ADD_DIGIT` | `ADD_DIGIT` sends DTMF if `allowDtmf`, otherwise appends to `newNumber` |
| `HANGUP` | guarded by `allowHangup` |
| `HOLD_OTHER_CALLS` | holds every call except the given one, when more than one exists |
| `TOGGLE_VIDEO` | flips `isVideo`, persists to `localStorage['isVideo']` |
| `OPEN_NEW_CALL` | pushes a synthetic `{ _isNew: true, newNumber }` object onto the workspace |

`CALL` rejects the legacy `{ user }` parameter with a thrown error
("deprecated from 20.02.2024").

## 5. Left panel — four lists

`ui/modules/queue-section/modules/call-queue/`:

| Directory | List |
| --- | --- |
| `active-queue/` | Active calls |
| `manual-queue/` | Self-assigned calls |
| `missed-queue/` | Missed calls |
| `offline-queue/` | Offline calls (has a dedicated `offline-queue-preview-callback.vue`) |

`active-queue-preview.vue` computes an **eavesdrop status icon**:

```js
if (task.eavesdropIsConference) return 'conference';
if (task.eavesdropIsPrompt)     return 'prompter';
```

So Workspace **displays** conference and prompter (whisper) states but does not
initiate them — they are driven from Supervisor.

### 5.1. Self-assigned (`manual`)

Backed entirely by the SDK agent object:

- list ← `cli.agent.waitingListCalls`
- accept → `cli.agent.interceptAttempt(task.attemptId)`

Entries carry `attemptId`, `channel`, `communication`, `deadline`, `position`,
`queue`, `wait`. `manual-deadline-progress-bar.vue` renders the waiting bar.

### 5.2. Missed

**Server-backed, not derived from local call events.** Own API client
(`modules/missed-calls/api/missed.js`) with `getMissedCalls`, `redialToMissed`,
`hideMissedCall`.

- Page size is hardcoded to **10**; `LOAD_NEXT_PAGE` appends.
- `INITIALIZE_MISSED` subscribes once to the SDK `refresh_missed` event and
  reloads the list on every occurrence.
- `REDIAL` and `HIDE_MISSED` both re-initialise the whole list afterwards.
- `userId` is read from the Pinia `userinfoStore` **non-reactively** — the source
  comments this explicitly (`NOTE! its not reactive!`) and leaves a
  `console.info` in place.

## 6. Central panel — five tabs

`CallTab.enum.ts`:

```ts
Numpad | Contacts | History | Transfer | Bridge
```

Header buttons (`call-header.vue`): `contacts`, `history`, `call-add-to`
(Bridge), `call-transfer--filled`, `chat` (video calls only), `call-end--filled`,
`call-ringing--filled`.

Footer buttons (`call-footer.vue`): `numpad`, video toggle
(`video-cam` / `video-cam-off`), `hold`, mute (`mic` / `mic-muted`).
Hold and mute are bound to `HotkeyAction.HOLD` / `HotkeyAction.MUTE`.

### 6.1. Transfer

`call-transfer/` offers **three** target types:

- `agents-call-transfer.vue`
- `users-call-transfer.vue`
- `queues-call-transfer.vue`

### 6.2. Bridge

`call-merge/call-bridge-container.vue` — joining two existing calls. This is the
mechanism behind consultative transfer.

## 7. Video

`features/modules/call/video-call/`:

- `IS_VIDEO_CALL(call)` is true when `call.remoteVideo === VideoMediaFlow.SendRecv`
- `TOGGLE_VIDEO({ callId })` → `call.muteVideo(!call.mutedVideo)`
- a nested `chat` store module exists for in-video-call chat
  (UI: `work-section/modules/call/module/video-call/module/chat`)

Video is a **property of a call**, not a separate channel. The outgoing-video
preference (`features/call/isVideo`) and the in-call video mute
(`videoCall/TOGGLE_VIDEO`) are two different things sharing a name.

## 8. External softphone

`app/api/agent-workspace/external-softphone/useExternalSoftphone` exposes
`isExternalPhoneActive()`. When active:

- outgoing calls are forced audio-only ("the external softphone (pjsip) is
  audio-only")
- microphone and camera permission checks are skipped, since audio is captured
  by the local utility rather than the browser

The `RemotePhone` instance is `markRaw`'d before it is handed to the SDK client,
and its internals use TypeScript `private` fields rather than JS `#private`
ones. Both are load-bearing, not style: the session object ends up nested under
the deep-reactive `callStore` proxy, and a `#private` read through a `Proxy`
receiver throws — which is what broke answering inbound calls
([WTEL-10073](https://webitel.atlassian.net/browse/WTEL-10073)). Regression tests
live in `external-softphone/__tests__/RemotePhone.spec.js`.

## 9. Other getters

| Getter | Meaning |
| --- | --- |
| `CALL_ON_WORKSPACE` | the call currently focused in the workspace |
| `IS_ANY_RINGING` | true only if **every** call in a non-empty list is ringing |
| `IS_OFFLINE_CALL` | `queue.queue_type === QueueTypeName.OFFLINE_QUEUE` |
| `IS_NEW_CALL` | the workspace holds the synthetic new-call object |
| `NORMALIZE_PHONE_NUMBER` | strips `( ) -` and whitespace |
