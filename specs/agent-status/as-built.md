# Agent status — as built

> **Source of truth:** `src/features/modules/agent-status`,
> `src/ui/modules/app-header`, `src/ui/modules/popups/break-popup`, at 26.8.0.

## 1. Module layout

Small — **220 lines** of JS/TS total:

```
features/modules/agent-status/
├── agent-status.js                    store: 4 getters, 6 actions, 3 mutations
├── client-handlers.js                 subscriptions
└── statusUtils/
    ├── UserStatus.js                  4 constants
    ├── parseUserStatus.js             presence string → flags
    └── getUserStatusByPriority.ts     flags + agent status → one status
```

## 2. State

```js
state = {
  agent: null,            // live SDK agent session object, or null
  user: { status: {} },   // parsed presence flags
  isAgentRemoved: false,
}
```

`agent` is `null` for a user without agent permissions — Workspace stays usable.

| Getter | Meaning |
| --- | --- |
| `IS_AGENT` | `!!state.agent` |
| `IS_CCENTER_ON` | is an agent **and** status ≠ `Offline` |
| `IS_AGENT_ONLINE` | is an agent **and** status === `Online` |
| `AGENT_REMOVED` | the agent was removed server-side |

`IS_AGENT_ONLINE` is what `the-app.vue` uses to block page unload
([WTEL-10195](https://webitel.atlassian.net/browse/WTEL-10195)).

## 3. Subscriptions

`SUBSCRIBE_STATUS` runs both subscriptions through **`Promise.allSettled`** — a
failure of one does not abort the other.

### 3.1. Agent

```js
try {
  agent = await client.agentSession();
  client.agent = reactive(client.agent);
} catch (err) {
  return; // abort action, if no agent
}
```

Two things of note: the SDK's `client.agent` is **replaced in place with a Vue
`reactive()` proxy**, and a user with no agent session causes a **silent return**.

Then `client.subscribeAgentsStatus(cb, { agent_id })` commits the agent instance
on every update. The agent is also exposed as **`window.agent`** (as the store is
exposed as `window.$store`).

### 3.2. User presence

`client.subscribeUsersStatus(cb)` plus an initial HTTP fetch via
`GET_CURRENT_USER_STATUS` → `usersAPI.getUserStatus()`. Both paths run the raw
presence through `parseUserStatus`.

## 4. Presence parsing

`UserStatus.js`:

```js
{ SIP: 'sip', WEB: 'web', DND: 'dnd', BUSY: 'busy' }
```

`parseUserStatus` turns the presence string into four booleans by **substring
matching**:

```js
{
  dnd:  presence?.status?.includes('dnd'),
  busy: presence?.status?.includes('dlg'),   // note: 'dlg', not 'busy'
  sip:  presence?.status?.includes('sip'),
  web:  presence?.status?.includes('web'),
}
```

## 5. Status priority

`getUserStatusByPriority.ts` resolves the several simultaneous statuses a user can
hold into one (ref [WTEL-3798](https://webitel.atlassian.net/browse/WTEL-3798)),
returning `AbstractUserStatus` from `@webitel/ui-sdk`:

```
DND                                   → DND
BUSY                                  → BUSY
no agent  + (SIP or WEB)              → ACTIVE
no agent  + neither                   → OFFLINE
agent ONLINE                          → ONLINE
agent PAUSE or BREAK_OUT              → PAUSE
agent OFFLINE                         → OFFLINE   (regardless of SIP/WEB)
```

DND and BUSY outrank everything, including agent status. The final branch is
commented in the source: *"agent OFFLINE — gray regardless of SIP/WEB presence"*.

## 6. Status transitions

| Action | SDK call |
| --- | --- |
| `SET_AGENT_WAITING_STATUS({ activityType })` | `agent.online(channels, onDemand, onlineSkill)` |
| `SET_AGENT_PAUSE_STATUS(note)` | `agent.pause(note)` — `note` defaults to `''` |
| `AGENT_LOGOUT` | `agent.offline()` |
| `TOGGLE_USER_DND` | `usersAPI.setUserStatus('dnd' \| '')` |
| `TOGGLE_CONTACT_CENTER_MODE(activityType)` | logout if `IS_CCENTER_ON`, else go online |

### 6.1. The `online` arguments

```js
const { channels, onDemand, onlineSkill } = {
  onlineSkill: activityType,
};
await agent.online(channels, onDemand, onlineSkill);
```

The object literal being destructured contains **only** `onlineSkill`, so
`channels` and `onDemand` are always `undefined`. See [`delta.md`](./delta.md) S-01.

### 6.2. Removed-agent handling

`SET_AGENT_WAITING_STATUS` catches exactly one error id:

```js
if (error?.id === 'app.agent.login.app_err') context.commit('SET_AGENT_REMOVED', true);
else throw error;
```

Everything else is re-thrown — unlike the call module, which swallows errors
([`../call/delta.md`](../call/delta.md) C-06).

### 6.3. Pause note

`agent.pause(note)` accepts a note, satisfying
[WPR/843087908 `[Workspace] Коментар оператора при переході в "Паузу"`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/843087908/Workspace).

## 7. UI

### 7.1. Status select

`app-header/components/agent-status-select.vue` is a thin wrapper. The actual
control is **`wt-cc-agent-status-select` from `@webitel/ui-sdk`**
(`src/modules/AgentStatusSelect`). Workspace passes `agent.status`,
`statusDuration`, the call-centre flag and `AGENT_REMOVED`, and forwards a
`changed-call-center-mode` event.

**The status dropdown, pause-cause picking and activity-type options live in the
UI SDK, not in this repository.**

### 7.2. DnD

`app-header/components/user-dnd-switcher.vue`, separate from the status select.

### 7.3. Break / pause popup

`ui/modules/popups/break-popup/break-timer-popup.vue` serves **both** `Pause` and
`BreakOut`, branching on `agentStatus` for its title
(`agentStatus.breakTimer.{pause|break_out}`) and showing `break-timer.vue`.

Buttons: `handleContinueWork` and `agentLogout`.

It imports from the UI SDK:

- `wt-cc-activity-type-options`
- `useActivityTypesOptions`

so returning to work from a pause can require choosing an **activity type**.
