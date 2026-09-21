# Video calls — as built

> **Source of truth:** `src/features/modules/call/video-call`,
> `src/features/modules/call/screenshots`, `src/ui/modules/video-container`,
> `src/ui/modules/work-section/modules/call/module/video-call`, at 26.8.0.
>
> Video is a sub-mode of calls — read [`../call/as-built.md`](../call/as-built.md) first.

## 1. Where video lives

Video code is deliberately **scattered across the call module and the shell**,
not gathered into one place:

```
features/modules/call/
├── video-call/video-call.js                  getters + in-call video toggle
├── video-call/modules/chat/store/chat.js     in-call chat store
└── screenshots/screenshots.ts                screenshots datalist (Pinia)

ui/modules/video-container/                   THE VIDEO SURFACE — shell level
├── components/video-container.vue            280 lines
├── composable/useScreenshot.ts               capture + recording
└── types/videoCall.types.ts

ui/modules/work-section/modules/call/module/video-call/
├── components/the-video-call.vue
├── enums/VideoCallTab.enum.ts
└── module/chat/components/the-video-call-chat.vue
```

`video-container` is mounted by `the-agent-workspace.vue` **outside** the
three-pane grid, as a sibling of `workspace-wrap`. That is what lets it float
over the layout and go full screen.

## 2. Detecting a video call

```js
IS_VIDEO_CALL: () => (call) => call?.remoteVideo === VideoMediaFlow.SendRecv
```

A call is a video call when the **remote** side is sending and receiving video.
There is no separate video call type — it is a property of an ordinary call.

`IS_VIDEO_CALL_ON_WORKSPACE` applies it to `CALL_ON_WORKSPACE`.

`features/call/ACTIVE_VIDEO_CALL` finds the first call that is a video call and
is not incoming-ringing.

## 3. Two different "toggle video"

| Action | Effect |
| --- | --- |
| `features/call/TOGGLE_VIDEO` | flips the **outgoing-video preference** `isVideo`, persisted to `localStorage['isVideo']`; read when placing a call |
| `features/call/videoCall/TOGGLE_VIDEO` | `call.muteVideo(!call.mutedVideo)` — mutes video on the **current call** |

Same name, different scope. See [`../call/delta.md`](../call/delta.md) C-09.

`HotkeyAction.TOGGLE_VIDEO` exists in the hotkey enum.

## 4. Window sizes

`video-container.vue` holds `videoContainerSize` as a `ComponentSize` ref,
defaulting to `ComponentSize.SM`, changed through `changeVideoContainerSize`.

Full screen is handled through the **native Fullscreen API**: the component
watches `document.fullscreenElement`, and on exit resets the size back to
`ComponentSize.SM`.

## 5. Screenshots

### 5.1. Capture (`useScreenshot.ts`)

`makeScreenshot(call)` calls `call.screenshot()` on the SDK object, which returns
`{ blob, file }`. The composable then:

- revokes any previous object URL
- creates `URL.createObjectURL(result.blob)` as the preview
- keeps `result.file` for upload
- sets status `done`, or `error` on throw (re-thrown through
  `applyTransform(err, [notify])`)

Status auto-clears after **2000 ms**, timed deliberately against the 1000 ms
loading timeout of `wt-button`
(ref [WTEL-7992](https://webitel.atlassian.net/browse/WTEL-7992)).

Object URLs are revoked on close and in `onBeforeUnmount` — no leak.

### 5.2. Recording

`toggleRecordAction(call)` branches on `call.recordings`:

```js
if (call.recordings) await call.stopRecord?.();
else                 await call.startRecord?.();
```

Errors surface via `eventBus.$emit('notification', …)` with
`error.message || 'Record error'` — the fallback string is **hardcoded English,
not localised**.

Both `startRecord` and `stopRecord` are optional-chained, so a call object
lacking them fails silently.

### 5.3. Listing (`screenshots.ts`)

```ts
export const useScreenshotsDataListStore = createTableStore(
  'features/call/screenshots/datalist',
  { apiModule: { getList: FileServicesAPI.getListByCall }, headers },
);
```

**This is Pinia + `createTableStore` from `@webitel/ui-datalist`** — the modern
monorepo pattern, sitting inside an otherwise Vuex-based feature tree. Screenshots
are fetched per call via `FileServicesAPI.getListByCall`.

Columns: `screenshots`, `view_name`, `uploaded_at` — sorting is `null` on both
sortable-looking fields.

## 6. Video call tabs

`VideoCallTab.enum.ts`:

```ts
State | Contacts | History | Transfer | Chat
```

Compare with the audio-call `CallTab.enum.ts`:

```ts
Numpad | Contacts | History | Transfer | Bridge
```

A video call **swaps** `Numpad` → `State` and `Bridge` → `Chat`. Contacts,
History and Transfer are shared.

`call-header.vue` renders the `chat` icon only for video calls, emitting
`VideoCallTab.Chat`. The button carries an absolute-positioned `warn` badge with
the unseen-message count (`videoCallChatUnseenBadge`, `undefined` when zero).

## 7. In-call chat

A dedicated store (`video-call/modules/chat/store/chat.js`) and a dedicated
component (`the-video-call-chat.vue`), **separate from the `features/chat`
domain**. In-video-call chat does not reuse the chat channel's machinery — with
one exception.

`video-call/modules/chat/composables/useVideoCallChatUnseen.ts`
([WTEL-8866](https://webitel.atlassian.net/browse/WTEL-8866)) owns both the
`isCallChatExist` flag and the unseen badge, and it stores the count in the
**chat channel's** `features/chat/unseen` module:

| Trigger | Effect |
| --- | --- |
| `VIDEO_CALL_CHAT_MESSAGES` grows by exactly 1, agent not on the `Chat` tab, last message not `member.self` | `ADD_UNSEEN_CHAT` |
| agent switches onto the `Chat` tab | `MARK_CHAT_SEEN` |
| `VIDEO_CALL_CHAT` becomes falsy (call ended) | `REMOVE_UNSEEN_CHAT` |

There is no WS event for these messages — they arrive by mutation of the SDK
`Conversation`, so arrival is inferred from array length. See
[`delta.md`](./delta.md) V-13.

## 8. Types

`videoCall.types.ts` defines `ScreenshotFileItem` (`id`, `view_name`),
`ScreenshotsOpenGalleriaPayload` (`callId`, `screenshotId`, `index`),
`VideoCallActionOptions` (`onComplete`) and `VideoCallScreenshotHandler`.

"Galleria" is the viewer component name — PrimeVue's gallery.
