# Workspace — consolidated findings

Reverse-engineering audit of **Webitel Agent Workspace** (`@webitel/workspace`
26.8.0), 2026-09-17.

**122 findings** across 10 sections, derived by comparing Jira + Confluence
("what was specified") against the source tree ("what exists").

| Section | Findings | Section | Findings |
| --- | --- | --- | --- |
| `00-overview` | 15 | `agent-status` | 13 |
| `call` | 15 | `notifications` | 11 |
| `chat` | 12 | `global-handlers` | 11 |
| `job` | 12 | `connection-quality` | 11 |
| `video` | 12 | `member` | 10 |

Full detail in each section's `delta.md`. Method and handover in
[`STATUS.md`](./STATUS.md).

---

## 1. Worst confirmed defects

Ranked by likely impact. Every item here was **verified in code**, not inferred.
Items marked *suspected* are excluded — they live in the per-section files.

### 1.1. A shipped bugfix never executes — [`notifications`](./notifications/delta.md) N-01

```js
context.rootState['features/notifications/currentlyPlaying']
  ? setTimeout(playSound, 1000)
  : playSound();
```

`rootState` is a nested object, not a flat map of namespaced paths. A key
literally named `'features/notifications/currentlyPlaying'` does not exist, so
the expression is always `undefined` and the delay never happens.

`currentlyPlaying` is confirmed to live in `NotificationsStoreModule` state
(`@webitel/ui-sdk`, line 49). A repo-wide grep for `rootState[` returns **exactly
this one line** — every other access in the codebase uses the nested form,
including one eleven lines above in the same file.

**Impact:** [WTEL-4918](https://webitel.atlassian.net/browse/WTEL-4918) was filed
because the ringtone cuts across the still-playing call-end sound. The fix was
written and is dead. Invisible unless a call arrives within one second of the
previous ending.

**Cost to fix:** one line.

### 1.2. Network severity is downgraded by a later parameter — [`connection-quality`](./connection-quality/delta.md) Q-01

Three evaluation blocks assign to the same `level` variable with no regard for
what is already set:

```js
if (jitterAvg > 50)         level = Low;
...
else if (packetLossAvg > 1) level = Medium;   // overwrites Low
```

**Failure:** jitter 60 ms (red) + packet loss 2 % (yellow) → the agent gets a
**warning** toast for a connection the spec classifies as **red**.

The `reasons` array is built correctly and accumulates both problems — the code
knows about both and still reports the milder level.

### 1.3. Chat entries can never survive a workspace reset — [`member`](./member/delta.md) M-02

`RESET_WORKSPACE_STATE` keeps a history entry by string convention:

```js
context.rootState.features[type][`${type}List`]?.includes(task)
```

`callList`, `jobList`, `memberList` all exist. **`features.chat.chatList` does
not** — chat root state is `{ failedFiles: {} }`, confirmed, and no `chatList`
exists anywhere in the codebase.

So for chats the expression is always falsy and the entry is popped. The agent
can never fall back to a previously open chat. The loop's entire purpose fails
for one of its four types.

### 1.4. MOS drives the agent-facing indicator, against an explicit prohibition — [`connection-quality`](./connection-quality/delta.md) Q-02

The spec states it in its own paragraph: *"MOS ніяк не діагностується для
користувача, існує як статистичний параметр."*

In code `getConnectionQuality(mosAvg)` sets the level independently, colouring
the icon and firing the toast. Not an omission — the opposite of what was
written.

### 1.5. OS notifications are probably never dismissed — [`notifications`](./notifications/delta.md) N-08

The notification is created with a **localised** title and dismissed by filtering
on the literal English string `'New call'`. Separately, the Service Worker API's
`getNotifications()` filters by **`tag`**, not `title` — and the code's own
comment says *"Optional: filter by tag if you used one"* while passing `title`.
No tag is set anywhere.

Two independent reasons to expect the filter never matches. Not reproduced at
runtime.

### 1.6. Destructuring from a literal that lacks the keys — [`agent-status`](./agent-status/delta.md) S-01

```js
const { channels, onDemand, onlineSkill } = { onlineSkill: activityType };
await agent.online(channels, onDemand, onlineSkill);
```

`channels` and `onDemand` are unconditionally `undefined`. The shape of an
incomplete refactor: a real source object was replaced by a literal carrying only
the new field, and the other two names were left in the pattern.

Runtime effect depends on the SDK signature, which was not checked. The code is
misleading regardless.

### 1.7. Silent no-op on the record button — [`video`](./video/delta.md) V-07

```js
if (call.recordings) await call.stopRecord?.();
else                 await call.startRecord?.();
```

Optional-chained on both sides. If the call object lacks the method, pressing
record does nothing — no error, no notification, no state change. The agent
cannot tell whether recording started.

---

## 2. Biggest documentation gaps

Ordered by the ratio of implemented behaviour to written specification.

### 2.1. Notifications — four sentences

The entire user-facing specification is four scattered sentences about sounds.
Behind them: four system settings, a per-user settings API, Service Worker push
with action buttons, cross-tab coordination via `localStorage`, per-channel
volumes with a backward-compatibility path, a hangup-sound interlock, and
distribution-mode-dependent sound rules.

Nothing documents which events notify, what the notification contains, how long
it stays, or who can turn it off. An administrator configuring the four settings
has no documentation at all.

### 2.2. Connection loss — nothing

`global-handlers` implements a full policy: popup, sound, destruction of all
client-side activity state, chat re-binding on recovery, SIP warnings. **Not one
line is documented.**

An agent whose socket drops mid-call sees a popup with a sound, the call
vanishing, and a "Reload page" button — with no documented explanation of what
happened to the call.

### 2.3. Offline members — five sentences

§2.3 of the User Guide. Behind it: SDK-backed paging **with search**, a
15-second poll, a communications selector with a typed contract, a member History
view, a dead Contacts tab, and a special-cased workspace-history reset.

### 2.4. Quick replies — absent entirely

A searchable canned-reply panel with **variable interpolation** (`${varName}`
substituted from chat variables) and multi-select composition. One of the most
used daily affordances. §3.6 describes sending a message as: type text, attach a
file, pick an emoji, press send.

### 2.5. Hotkeys — absent entirely

Eight actions implemented (`ACCEPT`, `END`, `MUTE`, `HOLD`, `TRANSFER`,
`NEW_CALL`, `SUBMIT_FORM`, `TOGGLE_VIDEO`). The User Guide describes every one of
them as a button click and never mentions keyboard shortcuts.

### 2.6. Transfer is broader than documented, in both channels

| Channel | Documented targets | Implemented targets |
| --- | --- | --- |
| Calls | agents | agents, users, **queues** |
| Chats | schemes | schemes, **users** |

The same omission in two independent places.

### 2.7. Close reasons — three documented, six stored

`agent_timeout`, `client_timeout`, `silence_timeout`, `agent_leave`,
`client_leave`, `transfer`. Three distinct timeout kinds are collapsed into one
sentence, and `transfer` — described as a *path* to closing — is a stored reason.
An agent can see a reason the documentation cannot explain.

### 2.8. Reserved variable names — undocumented contract

A task variable named `knowledge_base` is silently deleted before rendering
because it feeds the Knowledge Base tab. An integrator sending a variable by that
name watches it disappear with no explanation available anywhere.

---

## 3. Cross-cutting patterns

These repeat across unrelated modules and matter more than any single finding.

### 3.1. Errors swallowed silently

| Where | Form |
| --- | --- |
| Call transfer, bridge, DTMF, hold, hangup | empty `catch {}` |
| Video record start/stop | `?.` on both branches |
| Agent session | blanket `catch { return; }` |
| Latency polling | `console.warn` only |

A failed call transfer produces no notification, no log, no state change — the
agent sees the call simply stay put. Meanwhile `ANSWER`, in the same file, does
surface errors through `eventBus`. The policy is inconsistent **within single
modules**.

### 3.2. Localisation applied inconsistently inside single objects

The push notification has a localised title and **hardcoded English** action
buttons in the same object literal. `'Record error'` is a hardcoded fallback in a
three-locale product. The SIP-registration warning reuses a backend SQL error key
(`store_sql_user_get_default_device_app_error`) as user-facing text.

This is not a translation backlog — it is localisation being skipped line by
line.

### 3.3. Notifications emitted outside the notifications module

The disconnect sound, the connection-quality toasts, and the in-call permission
errors all go straight to `eventBus`, bypassing `features/notifications`.

**Consequence:** they ignore every notification setting, cannot be turned off,
and do not respect the agent's ringtone volume — the disconnect sound can overlap
a ringtone with no code path connecting them.

### 3.4. Typos frozen into public APIs

`WORKSRACE_STATE` (the root workspace getter, misspelled at its definition and at
every call site in four modules), `CLIENT_TIMOUT`, `SUBSRIBE_MEMBER_LIST`.

Consistent, therefore harmless — until someone adds the correctly spelled
variant and creates a silent duplicate.

### 3.5. Production console output

`console.info` on every missed-calls request; `console.log` on every socket state
transition, including normal startup.

### 3.6. Subscriptions created and never released

`global-handlers` creates watchers and `client.on()` listeners with no `off`,
discarding the stop handles it is given. `RESET_GLOBAL_HANDLERS` closes a popup
and stops nothing. `sw-controller`, in the same codebase, implements `DESTROY`
correctly — the pattern exists, just not there.

### 3.7. Three sibling channels, three different architectures

| | Calls | Chats | Tasks |
| --- | --- | --- | --- |
| SDK calls wrapped in store actions | yes | yes | **no** |
| Submodules | 4 lists | 3 lists + history + media | none |
| Own engineering doc | no | **yes** | no |

Task actions are called directly on the SDK object from components
(`@click="task.accept()"`). There is no place to add logging, error handling or
analytics, and no store-level test surface.

### 3.8. Workspace cannot be specified from this repository alone

| Subsystem | Lives in |
| --- | --- |
| Status control, pause causes, activity types | `@webitel/ui-sdk` |
| Chat rendering | `@webitel/ui-chats` |
| Screenshot list | `@webitel/ui-datalist` |
| Sound playback, `IS_MAIN_TAB` | `@webitel/ui-sdk` |
| Network quality icon | `@webitel/ui-sdk` |

The most-documented part of the User Guide — how the agent changes status —
cannot be verified from `cc-workspaces`. Any complete specification must cross
into the UI SDK.

---

## 4. Specification status fields are unreliable

| Page | Says | Reality |
| --- | --- | --- |
| [Online activity types](https://webitel.atlassian.net/wiki/spaces/WPR/pages/361267206/todo.+v1.+Workspace) | `TODO`, `P0` | Workspace side implemented — agent picks a type going online and returning from pause |
| [Network quality](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1178402825/26.02+Workspace) | `DONE` | manual check absent, green notification absent, jitter not monitored outside calls, MOS used against instruction |
| [Pause comment](https://webitel.atlassian.net/wiki/spaces/WPR/pages/843087908/Workspace) | no status | store supports it |
| [File errors in chat](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1178435596/todo.+Workspace) | `TODO` | per-chat failed-file state already tracked |

A `TODO / P0` page describing finished work is the most dangerous kind of stale
spec — it reads as a plan for work not yet started.

---

## 5. The documentation model is the root cause

The `WPR` space holds **delta specs**: one change each,
`Проблематика → As-Is → To-Be`. There is no consolidated "Calls in Workspace" or
"Chats in Workspace" document. Every feature spec in this set had to be assembled
from the User Guide plus dozens of WPR pages plus the Jira trail.

**Three exceptions prove the point:**

| Feature | Has one owned document | Findings |
| --- | --- | --- |
| Video calls | [`Video calls`](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/1706754049/Video+calls) | code matched the spec on **every point checked** |
| Tasks | [WPR/44995944](https://webitel.atlassian.net/wiki/spaces/WPR/pages/44995944/Inbound+Task+Queue.+User+Stories) | divergences are naming drift, not behaviour |
| Network quality | [WPR/1178402825](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1178402825/26.02+Workspace) | gaps are precise and enumerable, because thresholds were written down |

Where a feature owns one living document, the delta collapses. **The problem is
the model, not the developers.**

A second-order effect: the documentation set has no index. Two findings in this
audit were initially wrong because the Call Center User Guide — the page agents
are pointed at — never links to `Video calls`, `Video Call Recording` or
`Screenshots`. Both corrections are recorded in place
([`00-overview/delta.md`](./00-overview/delta.md) D-02, D-06, D-15).

An inverted case exists too: `docs/claude/chats.md` documents chat transport
mechanics in unusual depth, while agent-facing chat behaviour is the least
specified of the three channels.

---

## 6. What was not verified

Stated plainly, because the value of everything above depends on it.

**52 open questions** remain, listed at the end of each `delta.md`. The main
categories:

- **SDK signatures** — does `allowDecline` exist? what does `agent.online()`
  actually take? is a job object identity-stable across its lifecycle?
- **UI SDK internals** — none of `@webitel/ui-sdk`, `@webitel/ui-chats` or
  `@webitel/ui-datalist` was read. Several "not implemented" findings would
  change if the SDK implements the behaviour itself (notably the manual network
  check, Q-03).
- **Runtime behaviour** — no finding here was reproduced in a running app. N-08
  and N-03 in particular are code-reading conclusions.
- **Backend contracts** — presence string format, whether the "one active task"
  rule is enforced server-side, what the four notification settings default to.

Most are one grep or one file away.

---

## 7. How to improve what exists

Two tracks: the **product** (code and documentation) and the **spec set itself**.
Ordered by value per unit of effort.

### 7.1. Product — cheap and high value

| # | Action | Effort | Why now |
| --- | --- | --- | --- |
| P1 | Fix N-01 (`rootState[...]` path) | one line | A shipped fix is dead. Free correctness. |
| P2 | Fix Q-01 (rank the three quality levels, keep the worst) | a few lines | Agents are told "yellow" for red connections. |
| P3 | Fix S-01 (`agent.online()` arguments) | one line + SDK check | Either a real bug or permanently misleading code. |
| P4 | Add `chatList` or change M-02's lookup to not rely on naming convention | small | One of four types silently fails. |
| P5 | Remove production `console.*` (C-07, G-06) | trivial | Noise on every socket transition and every missed-calls request. |
| P6 | Localise `'Accept'` / `'Decline'` / `'Record error'` | trivial | Agent-visible English in a three-locale product. |
| P7 | Delete dead code: `SET_MEDIA_VIEW`, `state.agent`, `memberOnWorkspace`, `MemberTab.Contacts`, `disconnect-sound.mp3`, the commented `ON_CALL_MISS` branch | trivial | Each one misleads the next reader. |

**P1–P3 together are under twenty lines** and remove three confirmed defects.

### 7.2. Product — structural, worth planning

**Adopt one error policy.** The codebase already contains the right pattern
(`ANSWER` surfacing through `eventBus`, `SET_AGENT_WAITING_STATUS`
discriminating on `error.id` and re-throwing). Apply it to the empty
`catch {}` sites. A silent transfer failure is the worst possible outcome for an
agent mid-call.

**Route every notification through `features/notifications`.** Three subsystems
emit their own, so three classes of notification ignore all settings and volume.
This is a small refactor with a visible product result: everything becomes
configurable at once.

**Wrap task SDK calls in store actions.** Brings `job` in line with `call` and
`chat`, and creates the place where logging and error handling can live. Also
makes task behaviour testable at the store level, which it currently is not.

**Own the subscription lifecycle in `global-handlers`.** Capture the stop
handles, add `client.off()`, make `RESET_GLOBAL_HANDLERS` actually reset.
`sw-controller` already shows the shape.

**Decide what happens on reconnect.** Today calls and jobs are cleared and only
chats are re-subscribed. Either re-seed all three, or state openly that reload is
the recovery path — the popup's "Reload page" button suggests the latter is
already the de-facto answer.

### 7.3. Documentation — the highest-leverage change

**Give each feature one owned document.** This is the single finding that
explains most of the others (§5). Video, tasks and network quality each have one,
and each shows a collapsed delta.

Concretely:

1. Start with the two widest gaps: **notifications** and **connection loss**.
   Both are agent-visible daily and have near-zero specification.
2. Use the `WPR` template already in use — it is good. Keep delta specs for
   changes, but let each feature also have a living page that delta specs update.
3. **Add an index to `WbtlDocEn`.** The Call Center User Guide is the page agents
   are pointed at and it links to none of the separate feature pages. Two
   findings in this audit were wrong because of that. A single "see also" section
   would have prevented both.

**Audit the status fields.** §4 lists four pages that misstate their state,
including a `TODO / P0` page describing finished work. A one-pass sweep of WPR
statuses against reality is cheap and restores trust in the field.

**Document the contracts, not just the screens.** Reserved variable names
(`knowledge_base`), presence string tokens (`dlg` meaning busy), the four
notification settings, queue variables like `wbt_auto_answer` — these are
integration surfaces with no documentation. They are what integrators break
against.

### 7.4. The spec set itself

**Close the 52 open questions before writing more sections.** Most are one grep
or one SDK signature away. Every one closed converts a hedge into a fact, and the
set's credibility rests on the reader trusting the confirmed items.

**Read the UI SDK.** §3.8 shows five subsystems living outside this repository,
including the status control — the most-documented UI in the User Guide. Several
"not implemented" findings (notably Q-03, the manual network check) could reverse.
This is the biggest single source of uncertainty in the set.

**Write the five missing sections**, in this order:

1. `processing` — referenced by every channel, owned by none
2. `knowledge-base` — has three unreviewed WPR specs; would also settle D-01
3. `client-info` — CRM integration, contact identification, minicard
4. `screenshots` (agent-side, as its own section)
5. shell modules: `hotkeys`, `widget-bar`, `appearance`, `userinfo`

**Verify at runtime what code reading cannot settle.** N-08 (notification
dismissal) and N-03 (null settings) are the clearest candidates. A single session
with the app open would resolve several long-standing hedges.

**Keep the corrections visible.** D-02, D-06 and C-11 were rewritten in place
with `CORRECTED` / `Resolved` markers rather than quietly edited. Keep doing
this — a spec set that records its own mistakes is more trustworthy than one that
appears to have made none.

### 7.5. Turning this into action

The 122 findings are not a backlog. Suggested split:

- **7 confirmed defects** (§1) → Jira tickets, individually. P1–P3 are same-day.
- **Cross-cutting patterns** (§3) → one technical-debt epic each for error
  policy, notification routing and localisation. They are not bugs, they are
  decisions not yet made.
- **Documentation gaps** (§2) → one initiative, owned by whoever owns `WPR`.
  Start with notifications and connection loss.
- **Everything else** → leave in these files. Their value is as a reference when
  someone next touches a module, not as tasks.
