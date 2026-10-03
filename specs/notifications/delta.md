# Notifications — delta

> Divergences between [`spec.md`](./spec.md) and [`as-built.md`](./as-built.md),
> at 26.8.0.

---

## N-01. WTEL-4918 fix is dead code — DEFECT (confirmed)

```js
context.rootState['features/notifications/currentlyPlaying']
  ? setTimeout(playSound, 1000)
  : playSound();
```

`rootState` in Vuex is a **nested object**, not a flat map of namespaced paths.
The correct access is `rootState.features.notifications.currentlyPlaying`.
A key literally named `'features/notifications/currentlyPlaying'` does not exist
on `rootState`, so the expression is **always `undefined`** and the ternary always
takes the `playSound()` branch.

**Confirmed, not inferred:**

- `currentlyPlaying` is defined in `state` of `NotificationsStoreModule`
  (`@webitel/ui-sdk/src/modules/Notifications/store/NotificationsStoreModule`,
  line 49) and mutated there — it is module state, reachable only by the nested
  path.
- A repo-wide grep for `rootState[` returns **exactly this one line**. Every
  other access in the codebase uses the nested form, including
  `context.rootState.features.call.callList` in the very same file, eleven lines
  above.

**Effect:** the 1000 ms delay never happens. The behaviour
[WTEL-4918](https://webitel.atlassian.net/browse/WTEL-4918) was filed to fix —
the ringtone cutting across the still-playing call-end sound — is unfixed in the
one place the fix was written.

The bug is invisible in testing unless you specifically chain a call ending into
a new call arriving within a second.

**Fix:** `context.rootState.features.notifications.currentlyPlaying`.

---

## N-02. The whole notification settings surface is undocumented — UNDOCUMENTED

The code reads four named system settings:

| Setting | Gates |
| --- | --- |
| `CallEndPushNotification` | the "call ended" toast |
| `CallEndSoundNotification` | the call-end sound |
| `SelfAssignedCallSoundNotification` | the self-assigned call sound |
| `PushNotificationTimeout` | how long a toast stays (default **30**) |

Plus a per-user API surface: `UserSettingsAPI.get({ key: 'notification' })`.

**No reviewed Confluence page describes any of this** — not which settings exist,
not where they are configured, not their defaults, not who may change them.

The User Guide's entire notification specification is four sentences about sounds
(see [`spec.md`](./spec.md) §1). An administrator configuring these settings has
no documentation at all.

---

## N-03. `PUSH_NOTIFICATION_TIMEOUT` is not null-guarded — DEFECT

```js
GET_NOTIFICATION_SETTING: (state) => (key) =>
  state.settings ? state?.settings[key] : null,       // guarded

PUSH_NOTIFICATION_TIMEOUT: (state) =>
  state.settings[EngineSystemSettingName.PushNotificationTimeout] || 30,  // NOT guarded
```

Two getters, side by side, on the same nullable `settings` object — one checks,
one does not. `settings` starts as `null` and is filled asynchronously by
`LOAD_NOTIFICATION_SETTINGS`.

Any read of `PUSH_NOTIFICATION_TIMEOUT` before that request resolves throws
`TypeError: Cannot read properties of null`.

Reachable: `HANDLE_CALL_END` reads it when `CallEndPushNotification` is on. A call
ending before the settings request completes — early in a session, or after a
socket reconnect — hits it.

**Not reproduced**, only read. The ordering may make it unreachable in practice;
the asymmetry with its neighbour is a defect either way.

---

## N-04. Push notification action labels are hardcoded English — DEFECT

```js
actions: [
  { action: 'accept',  title: 'Accept'  },
  { action: 'decline', title: 'Decline' },
],
```

The notification **title** and **queue label** in the same object are localised
through `i18n.global.t(…)`. The two button labels the agent actually clicks are
not.

A Ukrainian-speaking agent gets a notification with a Ukrainian title and English
buttons.

Same class as [`../video/delta.md`](../video/delta.md) V-06 (`'Record error'`) —
localisation is applied inconsistently **within single objects**, not merely
across files.

---

## N-05. Self-assigned calls DO make a sound — DIVERGENT

The User Guide is explicit for chats: a self-assigned chat arrives **without** a
sound, unlike an automatically distributed one.

For calls it says nothing — and `HANDLE_SELF_ASSIGNED_CALL_RINGING` plays a
dedicated `SELF_ASSIGNED_CALL_ACTION` sound, conditional on:

1. the `SelfAssignedCallSoundNotification` setting being on, **and**
2. no call currently `active` or `isHold`

So the two channels behave **differently** for the same distribution mode, and
the call side is both undocumented and conditional on agent state.

The second condition is a real product decision — an agent already on a call is
not interrupted for a self-assigned one — and it exists nowhere in writing.

---

## N-06. Ringtone selection shipped differently from its spec — DIVERGENT

[WPR/109445126](https://webitel.atlassian.net/wiki/spaces/WPR/pages/109445126/Workspace+ringtone)
proposes: a Workspace **config file** listing files in `workspaces/media/`, and a
picker in the **user profile**.

Implemented: `localStorage['settings/ringtone']` holding a filename, resolved
against the **`VITE_RINGTONES_URL` environment variable**.

So the list is not a config file, the location is an env-configured URL, and the
choice is **per browser**, not per user account — an agent switching machines
loses their ringtone.

Whether a picker exists in the profile UI was **not verified**; only the consumer
was read.

---

## N-07. Per-channel volume is undocumented — UNDOCUMENTED

`getRingtoneVolume(type)` supports independent volumes for `Call`, `Chat` and
`Task`, stored as JSON in `localStorage['settings/ringtone-volume']`, with a
fallback path for an older single-value format.

Nothing in the documentation mentions volume control at all, let alone per-channel
volume or that it is per-browser.

The presence of a backward-compatibility branch shows this shipped, changed shape,
and shipped again — entirely undocumented across both versions.

---

## N-08. `HIDE_NOTIFICATIONS` matches on a hardcoded English title — fragile

```js
context.dispatch('features/swController/HIDE_NOTIFICATIONS', { title: 'New call' })
```

Called on talking-start and call-end
([WTEL-7915](https://webitel.atlassian.net/browse/WTEL-7915)) to dismiss the OS
notification.

But the notification was **created** with a localised title
(`i18n.global.t('notifications.newCall')`). The dismissal filters by the literal
string `'New call'`.

Unless `getNotifications({ title })` ignores the filter or the locale happens to
be English, **the notification is not dismissed** — it stays on screen after the
agent answers.

The service-worker API's `getNotifications()` officially filters by **`tag`**, not
`title`; the code's own comment says *"Optional: filter by tag if you used one"*,
while passing `title`. **Not verified at runtime** — but there are two independent
reasons to expect this filter does not match, and no tag is set anywhere.

---

## N-09. Per-channel stores are siblings, not children — architecture note

`features.js` registers four namespaces at the same level:

```js
notifications, callNotifications, chatNotifications, jobNotifications
```

The channel stores are not nested under `notifications/`, so every cross-call
uses a fully-qualified root dispatch (`features/notifications/PLAY_SOUND`,
`{ root: true }`). Each of the three repeats the same settings-reading and
sound-playing boilerplate.

Nesting them would remove the `root: true` noise and let shared behaviour live in
one place. Recorded as a refactor opportunity, not a defect.

---

## N-10. Single `subscriber` in the service-worker controller — fragile

```js
let subscriber = null;                       // module scope

INITIALIZE: sw.addEventListener('message', subscriber = …)
DESTROY:    sw.removeEventListener('message', subscriber)
```

One module-level slot. A second `INITIALIZE` without an intervening `DESTROY`
overwrites the reference, leaking the first listener — it stays attached and can
never be removed.

Whether `INITIALIZE` can run twice (reconnect, re-entry to the workspace) was
**not checked**.

---

## N-11. Notifications are the least-specified cross-cutting concern — process gap

Every other area in this spec set has at least one owned document. Notifications
have **four sentences** in the User Guide plus one `WPR` page about ringtone
selection — and behind them sit: four system settings, a per-user settings API,
service-worker push with action buttons, cross-tab coordination via
`localStorage`, per-channel volumes, a hangup-sound interlock, and
distribution-mode-dependent sound rules.

This is the widest documentation gap found so far, and it sits on the surface
agents notice most immediately.

---

## Open questions

1. Does `getNotifications({ title })` actually filter, and is the OS notification
   dismissed? (N-08)
2. Where are the four system settings configured, and what are their defaults?
   (N-02)
3. Is there a ringtone picker in the profile UI? (N-06)
4. Can `sw-controller/INITIALIZE` run more than once per session? (N-10)
5. Is `PUSH_NOTIFICATION_TIMEOUT` reachable before settings load? (N-03)
