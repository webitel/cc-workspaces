# Workspace — Overview (specified)

> **Source of truth:** Jira + Confluence. This file describes what Workspace was
> *supposed* to be. For what is actually implemented see [`as-built.md`](./as-built.md),
> for divergences see [`delta.md`](./delta.md).

| | |
| --- | --- |
| **Module** | Workspace |
| **Feature** | Application as a whole |
| **Status** | Released, actively maintained |
| **Owner** | Olena Bilianska, Iryna Iskovych (product) |
| **Source** | Confluence `WbtlDocEn` / `WEB` / `WEP`, `WPR`, `WDEV`; Jira `WTEL` |

## 1. Product goal

Workspace is **the agent's workplace** — a single browser application where a
contact-centre agent handles all assigned activity.

> "The Workspace application is the Agent workplace."
> — [Call Center User Guide](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/22937735/Webitel+Workspace.+Call+Center+User+Guide)

The agent's primary duties are, per the documentation: **servicing calls,
servicing chats, and completing tasks**.

## 2. Preconditions

1. The user is authenticated (see Webitel Start page / auth service).
2. Required browser permissions are granted (microphone, notifications) —
   enforced by a modal shown on entry.
3. A SIP connection is established — without it the agent cannot call.
4. The agent is assigned to **at least one Queue**, otherwise no activity is
   distributed to them.
5. The **Call Center** switch is ON — otherwise the user receives only calls
   routed directly to them, not queue activity.

## 3. Layout

The documented layout is five regions:

| # | Region | Purpose |
| --- | --- | --- |
| 1 | **Top bar** | Agent status management, app navigation, user menu |
| 2 | **Agent metrics bar** | Configurable KPI widgets for the current day |
| 3 | **Left block** | Lists of calls, chats, tasks |
| 4 | **Central block** | The active activity + its tools (dialpad, history, contacts) |
| 5 | **Right block** | Information about the agent and the client |

Every block is collapsible and expandable to full page.

> **Documented constraint:** supports up to **1280 × 610 px** without scroll.

### 3.1. Top bar

1. Design theme switch (dark / light)
2. SIP connection indicator
3. DnD switch — when on, the agent receives **only** queue calls, no internal
   user-to-user calls
4. Call Center switch — enables acting as an agent
5. Status control — timer + status dropdown
6. Applications menu
7. User menu — name, Docs, Settings, Logout, build version

### 3.2. Agent metrics bar

Agent chooses which metrics to display. **All metrics are counted from 00:00
today to the current moment.**

Documented metric set: Inbound calls, Processed calls, Missed calls,
Avg Talk Time, Avg Hold Time, Occupancy, Utilization, Accepted chats,
Chat Handling Time, Total Talk Time, After Call Work Time, Available,
Total VM Time, Queue Talk Time, Task Quantity.

### 3.3. Left block

Three tabs: **calls**, **chats**, **tasks**. A "new activity" marker appears on
call distribution, self-assigned calls, self-assigned chats, and task assignment.

Contains the button that opens the dialpad in the central block.

### 3.4. Central block

Displays the active call, chat or task, plus tools that depend on the activity
state. In the dialing state it consists of: call history, lists tool
(Contacts / Users), phone number input, numeric keypad, number input tool.

- **Contacts** tab requires a **CRM** licence. Without it only **Users** is shown.
- Search supports regex; contacts searchable by Name / Phone / Email.

### 3.5. Right block

Four documented tabs:

1. **General info** — time spent in Offline / Pause / Online, assigned Queues,
   Team / Supervisor / Auditor names, pause limits, call evaluations
2. **Client info** — appears on an inbound or outbound call or chat; sections
   Client, Member description, Variables
3. **Task processing** — shown when processing is enabled
4. **Flow schemas** — requires a **CALL_CENTER** licence

## 4. Agent statuses

| Status | Set by | Notes |
| --- | --- | --- |
| Offline | agent | |
| Online | agent | ready to receive activity |
| Pause | agent | requires selecting a **pause cause** (configured in Admin) |
| Break out | **system only** | forced offline after missing the max allowed number of calls |

**Pause restriction.** Before allowing pause, the system checks every queue of
the agent against the queue parameter *"Access to pause when there are more
online agents than:"*. If the number of online agents is equal to or below that
limit, the agent cannot pause and an **Attention** modal is shown. When the
restriction is active, the right block shows paused agents as `X/Y`, where X is
agents currently paused and Y is online agents minus the limit.

## 5. Channels

### 5.1. Calls

Documented call lists in the left block:

| List | Contents |
| --- | --- |
| **Active calls** | currently ringing or answered calls |
| **Missed calls** | missed/rejected: inbound queue, direct, internal. Max 10 shown, "more" pages by 10 |
| **Offline calls** | subscribers to be called back manually (e.g. left the queue requesting a callback). Max 10 shown |
| **Self-assigned calls** | inbound calls from queues with self-assign distribution; agent picks which to take |

Self-assigned waiting-time bar colouring, as a percentage of the queue's
**Max wait time**: green < 50%, yellow 51–75%, red > 76%.

**Missed-call deduplication:** if a call was distributed to several agents and
nobody answered, it lands in everyone's Missed calls; the first callback removes
it from all of them regardless of whether the subscriber answered. If the last
agent answers, it is not shown as missed to the others.

In-call tools: dialpad, call history, hangup, hold, mute, transfer.
Calling another number while on a call puts the current call on hold.

**Transfer** has two documented forms:
- **Blind** — pick an agent from the list, call moves immediately
- **With consultation** — hold, call the target agent, explain, then connect

Processing, if configured, is shown **only to the first agent**.

Outgoing calls: manual dialing, select from list, call back from history.

### 5.2. Chats

Left-block lists: **Active chats**, **Self-assigned chats**, **Closed chats**.
A blue circle on the tab marks an unaccepted chat.

- **Automatic acceptance** requires queue variable `wbt_auto_answer: true` and
  self-assign switched off.
- **Manual acceptance** — the agent clicks **Accept** in the central block.
- On contact identification the central block shows **the full message history
  of that contact across all connected messengers**, not just the current chat.
- If several contacts match, the agent picks which one to link the chat to.
- Self-assigned chat concurrency is limited by the queue's **Max wait count**.
- **Closed chats** shows only chats from the current day, sorted by close time
  descending, 10 at a time. Three close reasons: subscriber closed, agent
  closed, response timeout.
- **Transfer** targets a **flow scheme**, not another agent. After transfer the
  chat closes for the agent; processing stays fillable without chat access.
- **Auto-close** triggers on inactivity; the timeout is a queue setting.
- Messages support files (button or drag-and-drop), emoji, and audio/video
  messages from the subscriber.

### 5.3. Tasks

An inbound task is announced by a sound and shown in the left block.
**Accept** takes it; **Decline** closes it for this agent and it is redistributed
to another agent until someone accepts. After acceptance, **dynamic
post-processing forms** open in the right block. **Close** closes the task for
the agent.

### 5.4. Video

Video conferencing was specified in [WTEL-1149](https://webitel.atlassian.net/browse/WTEL-1149)
(2020). **It is not covered by the current user documentation** — see
[`delta.md`](./delta.md).

## 6. Processing (post-call / post-chat work)

Two documented modes:

1. **Simple processing** — a form for notes about the conversation. After the
   activity ends a countdown starts; the form closes at zero. A button appears
   near the end of the countdown to extend the time.
   **Clicking Send ends the active call/chat.**
   For unsuccessful calls the agent can schedule the next attempt (date+time, or
   without a specific time).
2. **Dynamic post-processing forms** — configured via Flow schemas in Admin.
   Supported elements: information field, input field, date/time picker,
   dropdown, button, file container.

## 7. Licences

| Licence | Unlocks |
| --- | --- |
| `CALL_CENTER` | Flow schemas tab; queue-based work |
| `CRM` | Contacts tab and contact identification |
| `CUSTOMER_SERVICE` | call transfer to a contact (spec: [WPR/200933385](https://webitel.atlassian.net/wiki/spaces/WPR/pages/200933385/Workspace)) |
| `WFM` | Schedule tab in General info (spec: [WPR/1248821249](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1248821249/EP_06.+Workspace+WFM)) |

## 8. Historical trail

| Ticket | Date | Meaning |
| --- | --- | --- |
| [WTEL-1149](https://webitel.atlassian.net/browse/WTEL-1149) | 2020-04 | video conferencing for the agent |
| [WTEL-1404](https://webitel.atlassian.net/browse/WTEL-1404) | 2020-08 | first epic naming Workspace as a product |
| [WTEL-1547](https://webitel.atlassian.net/browse/WTEL-1547) | 2020-11 | chats in Workspace |
| [WTEL-1845](https://webitel.atlassian.net/browse/WTEL-1845) | 2021-04 | "[Workspace] New functionality" — large Figma-driven epic |
| [WTEL-3239](https://webitel.atlassian.net/browse/WTEL-3239) | 2023-02 | "Workspace sins" — accumulated tech debt, still `To Do` |
| [WTEL-3380](https://webitel.atlassian.net/browse/WTEL-3380) | 2023-04 | desktop build of Agent Workspace |
| [DES-645](https://webitel.atlassian.net/browse/DES-645) | 2026-03 | **New Workspace** — out of scope here |

## 9. Known gaps in the specification itself

The `WPR` space holds mostly **delta specs** (one change each: Problem → As-Is →
To-Be). There is **no consolidated feature spec** for calls, chats or tasks.
Any per-feature `spec.md` in this directory must be assembled by aggregating
those deltas plus the user guide.
