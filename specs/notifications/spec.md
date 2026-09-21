# Notifications — specified

> **Source of truth:** Jira + Confluence. See [`as-built.md`](./as-built.md) and
> [`delta.md`](./delta.md).

| | |
| --- | --- |
| **Module** | Workspace (cross-cutting) |
| **Feature** | Sound and push notifications |
| **Status** | Released |

> **Cross-cutting.** Notifications have one sub-store per channel
> (`callNotifications`, `chatNotifications`, `jobNotifications`) plus a shared
> root and a service-worker controller. Every channel spec refers here.

## 1. What the User Guide says

Notification behaviour is scattered across the guide as single sentences rather
than gathered into a section:

| Where | Statement |
| --- | --- |
| §2.1 | "The User is notified about an inbound call with a **ringing sound**." |
| §3.1 | "When chat is automatically allocated to an Agent, an **audible alarm** accompanies an inbound chat." |
| §3.2 | "Unlike automatic chat distribution, adding a new chat to the list of chats waiting to be connected to the Agent is **not accompanied by a sound signal**." |
| §4 | "An **audible signal** accompanies an inbound task." |
| §1 | Browser permissions must be granted before work — the permissions modal. |

That is the entire specification of notifications in the user documentation.

**There is no documented statement of:** which events produce a push
notification, what the notification contains, whether it is actionable, how long
it stays, who can turn any of it off, or how volume is controlled.

## 2. Custom ringtone — SPECIFIED

[WPR/109445126 `[Workspace] додати можливість оператору задавати ringtone`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/109445126/Workspace+ringtone)

**Problem:** customers ask to change the inbound-call ringtone; today it is one
melody for everyone.

**Proposed solution:** a configuration file on the Workspace side listing files
placed in `workspaces/media/`, and a selector in the user profile. New files are
added by Webitel on request.

## 3. Push notification settings — implied by system settings

The spec set has no page describing these, but the code reads named system
settings through `EngineSystemSettingName`, which implies an Admin-side
configuration surface:

- `CallEndPushNotification`
- `CallEndSoundNotification`
- `SelfAssignedCallSoundNotification`
- `PushNotificationTimeout`

**No reviewed Confluence page documents this set.** Their existence is inferred
from the code — see [`delta.md`](./delta.md) N-02.

## 4. Jira trail

| Ticket | Meaning |
| --- | --- |
| [WTEL-4240](https://webitel.atlassian.net/browse/WTEL-4240) | service-worker push notification for a new call |
| [WTEL-4918](https://webitel.atlassian.net/browse/WTEL-4918) | wait for the call-end sound to finish before playing the ringtone |
| [WTEL-4502](https://webitel.atlassian.net/browse/WTEL-4502) | suppress the ringing notification for manual / offline-queue calls |
| [WTEL-7915](https://webitel.atlassian.net/browse/WTEL-7915) | close the OS notification once talking starts, and once the call ends |
