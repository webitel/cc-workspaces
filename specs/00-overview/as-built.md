# Workspace — Overview (as built)

> **Source of truth:** the `cc-workspaces` source tree. This file describes what
> is *actually* implemented. For the specified behaviour see [`spec.md`](./spec.md),
> for divergences see [`delta.md`](./delta.md).

| | |
| --- | --- |
| **Package** | `@webitel/workspace` |
| **Version at time of writing** | 26.8.0 |
| **Stack** | Vue 3, Vite, Vuex (root store), TypeScript (partial), Biome |
| **Shared packages** | `@webitel/ui-sdk`, `@webitel/api-services`, `@webitel/ui-chats`, `@webitel/styleguide`, `webitel-sdk` |

## 1. Application shell

### 1.1. Routing

`src/app/router/index.ts` defines exactly **three** routes:

| Path | Name | Component |
| --- | --- | --- |
| `/` | `agent-ws` | `ui/components/the-agent-workspace.vue` |
| `/feedback-page` | `feedback-page` | `ui/modules/feedback-page/...` |
| `/:pathMatch(.*)*` | `error-page` | `ui/components/error-page.vue` |

Workspace is effectively a **single-screen application**. All feature navigation
is internal component state, not routing.

**Auth guard.** `feedback-page` and `error-page` are exempt. For every other
route, if `localStorage['access-token']` is absent and no `accessToken` query
param is present, the browser is redirected to `VITE_AUTH_URL` with a
`redirectTo` parameter. An `accessToken` supplied via query is consumed before
app init and then stripped from the URL.

### 1.2. Session lifecycle

`src/app/the-app.vue`:

- `window.unload` → dispatches `workspace/CLOSE_SESSION`
- `window.beforeunload` → if `features/status/IS_AGENT_ONLINE`, calls
  `preventDefault()` to raise the browser's "leave site?" prompt
  (ref: [WTEL-10195](https://webitel.atlassian.net/browse/WTEL-10195))
- Locale is read from `localStorage['lang']` / `localStorage['fallbackLang']`
- `darkMode` is `provide`d down to `ui-sdk` components

Session is **explicitly opened by the user**: `the-agent-workspace.vue` shows a
`welcome-popup` on entry, and `workspace/OPEN_SESSION` only fires when the user
confirms it. Flow lists are then refreshed on a 5-second cached interval.

### 1.3. Layout

`ui/components/the-agent-workspace.vue` composes:

```
cc-header            (ui/modules/app-header)
└── workspace-wrap
    ├── widget-bar        (ui/modules/widget-bar)
    └── section.workspace
        ├── queue-section     (ui/modules/queue-section)     — left
        ├── workspace-section (ui/modules/work-section)       — central
        └── info-section      (ui/modules/info-section)       — right
video-container      (ui/modules/video-container)  — outside the three-pane grid
disconnect-popup     (ref: WTEL-7256)
```

Panel sizes and collapse state are owned by
`ui/composables/usePanelSizeController`. The right panel additionally supports
**pinning** (`pin` state), which disables its collapse action.

Startup popups: `welcome-popup`, `desc-track-auth-error-popup`,
`desc-track-auth-success-popup`, `disconnect-popup`.

Drag-and-drop onto the shell is suppressed globally (`@drop="preventDrop"`).

## 2. Store topology

Root store (`src/app/store/index.js`) holds the WebSocket client, runtime
`config`, and the API instance, and registers three namespaces:

```
features/   <- src/features/store/features.js
ui/         <- src/ui/store/ui.js
workspace/  <- src/ui/store/agent-workspace.js
```

The store is also exposed as `window.$store`.

### 2.1. `features/` — domain modules

| Namespace | Source |
| --- | --- |
| `status` | `features/modules/agent-status` |
| `call` | `features/modules/call` |
| `chat` | `features/modules/chat` |
| `job` | `features/modules/job` |
| `member` | `features/modules/member` |
| `globals` | `features/modules/global-handlers` |
| `notifications` | `features/modules/notifications` |
| `callNotifications` | `features/modules/notifications/call` |
| `chatNotifications` | `features/modules/notifications/chat` |
| `jobNotifications` | `features/modules/notifications/job` |
| `connectionQuality` | `features/modules/connection-quality` |
| `swController` | `features/modules/sw-controller` |

### 2.2. `ui/` — presentation modules

`appearance`, `now` (reactive clock from `ui-sdk`), `infoSec`, `widget`.

## 3. Channels implemented

Three activity channels exist as first-class modules: **call**, **chat**, **job**
(tasks). They surface in the left panel as three tabs
(`the-agent-call-queue`, `the-agent-chat-queue`, `the-agent-job-queue`), driven
by `CallActions`, `ConversationState` and `JobState` enums from `webitel-sdk`.

**Video is not a separate channel** — `video-container` is a shell-level
component rendered outside the three-pane grid, and video is toggled within a
call (see `HotkeyAction.TOGGLE_VIDEO`).

**Email is not implemented** as a channel.

## 4. Left panel (`queue-section`)

Three `wt-tabs`, each with:
- an icon whose colour reflects state,
- a red `wt-badge` indicator (`showIndicator`) for new activity,
- a warning-coloured `wt-chip` with the active count (`countActive`).

A single floating rounded action toggles between "new call"
(`call-ringing` icon) and "cancel" (`close`).

Hotkeys are wired here via `ui/hotkeys/useHotkeys`.

## 5. Right panel (`info-section`)

`the-agent-info-section.vue` registers **six** tab components:

| Tab | Module |
| --- | --- |
| General info | `info-section/modules/general-info` |
| Client info | `info-section/modules/client-info` |
| Processing | `info-section/modules/processing` |
| Flows | `info-section/modules/flows` |
| **Knowledge Base** | `info-section/modules/knowledge-base` |
| **Screenshots** | `info-section/modules/screenshots` |

Visible tabs are computed from activity state plus
`EngineSystemSettingName` / `DefaultWorkspaceTabSettings`, i.e. the tab set is
**server-configurable**, not fixed. Tabs are wrapped in `<keep-alive>`.

## 6. Agent metrics bar (`widget-bar`)

`ui/modules/widget-bar/utils/Widgets.js` defines **19 active widgets**:

| Key | `type` | Default visible |
| --- | --- | --- |
| INBOUND | `callInbound` | yes |
| INBOUND_QUEUE | `callInboundQueue` | yes |
| DIALER_QUEUE | `callDialerQueue` | yes |
| MANUAL_CALLS | `callManual` | yes |
| HANDLED | `callHandled` | yes |
| MISSED | `callMissed` | yes |
| MISSED_QUEUE | `callQueueMissed` | yes |
| AVG_TALK | `avgTalk` | no |
| AVG_HOLD | `avgHold` | no |
| OCCUPANCY | `occupancy` | no |
| UTILIZATION | `utilization` | no |
| CHAT_ACCEPTS | `chatAccepts` | no |
| CHAT_AHT | `chatAht` | no |
| SUM_TALK | `sumTalk` | no |
| PROCESSING | `processing` | no |
| AVAILABLE | `available` | no |
| VOICE_MAIL | `voiceMail` | no |
| QUEUE_TALK | `queueTalk` | no |
| TASK_ACCEPTS | `taskAccepts` | no |

Two further widgets, `SCORE_COUNT` and `SCORE_REQUIRED_AVG`, are **commented
out** in the source.

## 7. Hotkeys

`ui/hotkeys/HotkeysActiom.enum.js` (note the typo in the filename) defines:

`ACCEPT`, `END`, `MUTE`, `HOLD`, `TRANSFER`, `NEW_CALL`, `SUBMIT_FORM`,
`TOGGLE_VIDEO`.

## 8. Other shell modules

| Module | Role |
| --- | --- |
| `ui/modules/appearance` | dark/light theme |
| `ui/modules/app-header` | top bar |
| `ui/modules/userinfo` | current user, user notifications (Pinia store) |
| `ui/modules/feedback-page` | standalone route, no auth required |
| `ui/modules/popups` | welcome, disconnect, desktop-track auth |
| `features/modules/sw-controller` | service worker — Workspace ships as a PWA |
| `features/modules/connection-quality` | network quality monitoring |
| `features/modules/global-handlers` | socket-state handlers: disconnect popup, SIP registration, clearing all tasks on connection loss |
