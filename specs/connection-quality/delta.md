# Connection quality — delta

> Divergences between [`spec.md`](./spec.md) and [`as-built.md`](./as-built.md),
> at 26.8.0.
>
> The spec is marked **DONE**. This file is therefore mostly a list of things
> marked done that are not.

---

## Q-01. Severity is downgraded by a later parameter — DEFECT

```js
if (jitterAvg > 50)         level = Low;
else if (jitterAvg >= 30)   level = Medium;

if (packetLossAvg > 3)      level = Low;
else if (packetLossAvg > 1) level = Medium;   // ← overwrites Low

if (mosLevel === Low)       level = Low;
else if (mosLevel === Medium) level = Medium; // ← overwrites Low
```

Three blocks assign to the same variable with no regard for what is already
there. A **worse** level set by an earlier parameter is **silently replaced** by
a better level from a later one.

**Concrete failure:** jitter 60 ms (red) and packet loss 2 % (yellow).
After block 1, `level = Low`. After block 2, `level = Medium`. The agent gets a
**warning** toast instead of an **error**, for a connection the spec classifies
as red.

Tellingly, `reasons` is built correctly — it accumulates and would read
`["jitter 60 ms (> 50)", "packet loss 2.0 % (1–3%)"]`. So the code *knows* both
problems exist and still reports the milder level.

**Fix:** take the worst of the three, e.g. rank the levels and keep the maximum,
or only downgrade when `level` is still `High`.

---

## Q-02. MOS drives the agent-facing level, against an explicit instruction — DIVERGENT

The spec states it in bold, in its own paragraph:

> *"MOS ніяк не діагностується для користувача, існує як статистичний
> параметр."*

In code MOS is a **first-class input**: `getConnectionQuality(mosAvg)` can set
`level` to `Low` or `Medium` on its own, which colours the icon and fires the
toast.

So an agent can be told their network is poor purely because of a MOS average,
which the spec says must never be diagnosed to them.

This is not an omission — it is the opposite of what was written.

---

## Q-03. Manual deeper check (US_02) not implemented — UNIMPLEMENTED

US_02 has two acceptance criteria: clicking the header icon runs a packet-loss
check, a **loader replaces the icon** during it, and the result updates the icon
plus raises a notification.

In `app-header.vue`:

```vue
<wt-call-media-metric :quality="connectionQuality" show-tooltip />
```

Two props. **No click handler, no loading state, no callback.** Nothing in
`useWebSocketLatency.ts` exposes an on-demand check — it has
`startLatencyTracking`, `stopLatencyTracking` and the RTP handler, all passive.

The spec is marked **DONE** and this user story appears absent.

**Caveat:** `wt-call-media-metric` lives in `@webitel/ui-sdk` and was not read.
If it implements the click itself it would need a way to trigger a check, and no
such prop is passed. Verify in the SDK before declaring it missing.

---

## Q-04. Continuous monitoring measures ping only, not jitter — DIVERGENT

The spec says twice that **two** parameters are tracked continuously and
automatically — **Ping and Jitter** — and that the icon colour reflects both.

In code:

- the 5-second interval polls `cli.latency()` only
- jitter arrives exclusively in `RtpMetrics`, handled by
  `websocketRtpConnectionLevelHandler`
- **RTP metrics exist only during a call**

So outside a call, jitter is not measured at all. And the header icon is bound
to `LATENCY_LEVEL` — a getter computed **purely from latency**:

```js
LATENCY_LEVEL: (state) =>
  state.latency > 300 ? Low : state.latency >= 150 ? Medium : High
```

`rtp` is committed to the store but **no getter derives a level from it**, and
nothing displays it. The RTP-based level is returned from the handler to its
caller and never reaches the icon.

**Result:** the indicator the spec describes as "Ping and Jitter in real time" is
a ping-only indicator.

---

## Q-05. No green notification after a manual check (AC_03.03) — UNIMPLEMENTED

The spec defines three notifications; the code emits two:

| Spec | Implemented |
| --- | --- |
| red → `error` | yes |
| yellow → `warning` | yes |
| green → `info`, manual only | **no branch exists** |

Consistent with Q-03 — with no manual check, the manual-only notification has no
trigger. Recorded separately because the `High` branch is absent from the handler
outright.

---

## Q-06. Notification timeout is 8 seconds, spec says maximum possible — DIVERGENT

> *"Сповіщення повинне відображатися максимальний можливий час."*

```js
timeout: 8000,
```

Eight seconds is a choice, not a maximum. Compare the call-end toast, which uses
the configurable `PUSH_NOTIFICATION_TIMEOUT` (default **30**, per
[`../notifications/as-built.md`](../notifications/as-built.md) §2).

The intent behind "maximum possible" was presumably that a quality warning should
not vanish before the agent notices it mid-call.

---

## Q-07. `reasons` is computed and thrown away — UNDOCUMENTED capability

The handler builds precise diagnostics:

```js
"jitter 62 ms (> 50)", "packet loss 4.2 % (> 3%)", "MOS 3.21 (< 3.5)"
```

and returns them to its caller. Nothing in Workspace displays them. The agent
gets *"Network quality is poor, please check your network"* — the spec's text —
while the exact cause exists in memory and is discarded.

The spec's stated problem is *"оператор не знає **причини** поганої якості"* —
the agent does not know the **cause**. The cause is computed. It is not shown.

**Where `reasons` is consumed, if anywhere, was not traced.**

---

## Q-08. Quality notifications bypass the notifications module — architecture

`eventBus.$emit('notification', …)` directly, rather than going through
`features/notifications`.

Third occurrence of a subsystem emitting its own notifications outside that
module, after the disconnect sound
([`../global-handlers/delta.md`](../global-handlers/delta.md) G-08) and the
in-call permission errors in `ANSWER`.

Consequence: quality toasts are not subject to any of the notification settings
in [`../notifications/spec.md`](../notifications/spec.md) §3, and cannot be
turned off.

---

## Q-09. The feature module holds no logic — architecture

`features/modules/connection-quality` is 26 lines of state and getters. The
measurement, evaluation and notification all live in
`app/api/agent-workspace/websocket/useWebSocketLatency.ts`.

So a reader looking for "how connection quality works" finds a module that only
stores numbers, and must know to look in the websocket API layer.

The `registerWebSocketStore` workaround exists precisely because that code has no
component context — a sign the logic sits at the wrong level.

---

## Q-10. Latency errors are silent — minor

```js
catch (e) { console.warn('[WS] latency error', e); }
```

If `cli.latency()` fails repeatedly, `state.latency` keeps its last value and the
icon keeps showing that level. A measurement failure is indistinguishable from a
good measurement.

---

## Q-11. Tooltip long variants: withdrawn in spec, never implemented — consistent

The spec's tooltip table has the longer texts ("You can click the icon to run a
deeper network analysis…") **struck through**, while the localisation table at
the bottom still lists all three long strings in three languages.

The short forms match what is implemented. Recorded only so the leftover long
strings in the localisation table are not mistaken for a gap — though they may
exist as unused locale keys.

---

## Open questions

1. Does `wt-call-media-metric` implement the manual check internally? (Q-03)
2. Is `reasons` consumed anywhere outside this file? (Q-07)
3. Was MOS deliberately promoted to an agent-facing input after the spec was
   written? (Q-02)
4. Are the long tooltip strings present as unused locale keys? (Q-11)
5. Should the header icon use an RTP-derived level during a call? (Q-04)
