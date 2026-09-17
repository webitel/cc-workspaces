# Connection quality — as built

> **Source of truth:** `src/features/modules/connection-quality`,
> `src/app/api/agent-workspace/websocket/useWebSocketLatency.ts`,
> `src/ui/modules/app-header`, at 26.8.0.

## 1. The module is almost empty

```
features/modules/connection-quality/store/connection-quality.js    26 lines
```

State, three getters, no actions:

```js
state = { latency: 0, rtp: null }

LATENCY:       (state) => state.latency
LATENCY_LEVEL: (state) => latency > 300 ? Low : latency >= 150 ? Medium : High
RTP:           (state) => state.rtp
```

**All the behaviour lives elsewhere** — in
`app/api/agent-workspace/websocket/useWebSocketLatency.ts`, outside
`features/modules`. The feature module is a data sink.

## 2. Latency tracking

`useWebSocketLatency.ts`:

```js
const LATENCY_REFRESH_DELAY = 5000;
let latencyIntervalId: number | null = null;
```

`startLatencyTracking(cli)` polls `cli.latency()` every **5 seconds** and commits
to `features/connectionQuality/latency`. A second call while running logs
`'[WS]: latency tracking already started'` and returns — the interval cannot be
double-started.

`stopLatencyTracking()` clears it.

Errors are caught and logged with `console.warn('[WS] latency error', e)` — not
surfaced to the agent.

## 3. Store registration workaround

```js
let storeRef: Store<unknown> | null = null;
export function registerWebSocketStore(store) { storeRef = store; }
```

Documented in the source (refs
[WTEL-8733](https://webitel.atlassian.net/browse/WTEL-8733),
[WTEL-9842](https://webitel.atlassian.net/browse/WTEL-9842)):

> *"`useStore()` needs a component `setup()` context, which these callbacks don't
> have. `store/index.js` registers the store once instead."*

`app/store/index.js` calls `registerWebSocketStore(store)` at module load.
`commitConnectionQuality` guards on `storeRef` and `console.error`s if the
websocket connects before registration.

## 4. RTP quality evaluation

`websocketRtpConnectionLevelHandler(rtp)` runs when RTP metrics arrive. With no
`rtp` it returns `High` and commits nothing.

Otherwise it commits `rtp` to the store and reads three averages:

```js
const jitterAvg     = rtp.jitter?.average     ?? 0;
const packetLossAvg = rtp.packetloss?.average ?? 0;
const mosAvg        = rtp.mos?.average        ?? 5;
```

Then three independent blocks, each assigning to the same `level` variable:

```js
if (jitterAvg > 50)      level = Low;      reasons.push('jitter … (> 50)')
else if (jitterAvg >= 30) level = Medium;  reasons.push('jitter … (30–50)')

if (packetLossAvg > 3)    level = Low;     reasons.push('packet loss … (> 3%)')
else if (packetLossAvg > 1) level = Medium; reasons.push('packet loss … (1–3%)')

const mosLevel = getConnectionQuality(mosAvg);   // from @webitel/ui-sdk
if (mosLevel === Low)         level = Low;    reasons.push('MOS … (< 3.5)')
else if (mosLevel === Medium) level = Medium; reasons.push('MOS … (3.5–4.0)')
```

Thresholds for jitter (30/50) and packet loss (1/3) match the spec exactly.

`reasons` is an array of human-readable strings (`"jitter 62 ms (> 50)"`) —
returned to the caller, **not** shown to the agent.

## 5. Notifications

Emitted from inside the same handler:

```js
if (level === Low)          eventBus.$emit('notification', { type: 'error',   text: t(`notifications.connectionQuality.${Low}`),    timeout: 8000 })
else if (level === Medium)  eventBus.$emit('notification', { type: 'warning', text: t(`notifications.connectionQuality.${Medium}`), timeout: 8000 })
```

Localised via `notifications.connectionQuality.*`, present in all three locale
files (`en`, `uk`, `ru`).

There is **no `High` / info branch**.

Notifications bypass the notifications module entirely and go straight to
`eventBus` — same pattern as the disconnect popup
([`../global-handlers/delta.md`](../global-handlers/delta.md) G-08).

## 6. Header icon

`app-header.vue`:

```vue
<wt-call-media-metric :quality="connectionQuality" show-tooltip />
```

```js
const connectionQuality = computed(
  () => store.getters['features/connectionQuality/LATENCY_LEVEL'],
);
```

The component is **`wt-call-media-metric` from `@webitel/ui-sdk`** — the icon,
its colours and the tooltip live there. Workspace passes one value: the
**latency** level.

No click handler, no loading prop, no callback is passed.

## 7. Where quality is also shown

`work-section/modules/_shared/components/lookup-item/history-lookup-item.vue`
uses `tooltip-text-prefix="calls.connectionQuality"` — call history entries carry
a quality indicator, presumably the History-side feature from
[WPR/1490321650](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1490321650/26.06+History+Workspace).
Not investigated further.
