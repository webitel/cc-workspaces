# Agent status — specified

> **Source of truth:** Jira + Confluence. See [`as-built.md`](./as-built.md) and
> [`delta.md`](./delta.md).

| | |
| --- | --- |
| **Module** | Workspace (cross-cutting) |
| **Feature** | Agent statuses |
| **Status** | Released; one accepted extension still `todo` |
| **Source** | [Call Center User Guide §1.1.5](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/22937735/Webitel+Workspace.+Call+Center+User+Guide), WPR pages below |

> **Cross-cutting.** Agent status is not a channel. It is the gate in front of
> all of them: until the agent is Online in Call Center mode, no call, chat or
> task is distributed. Read alongside [`../00-overview/spec.md`](../00-overview/spec.md) §4.

## 1. Two independent status axes

The top bar carries **two** separate controls that are often confused:

| Control | Scope | Effect |
| --- | --- | --- |
| **DnD switch** | the *user* | when on, the user receives **only queue calls**; no internal user-to-user calls |
| **Call Center switch** | the *agent* | when on, the user acts as an agent and receives queue activity; when off, only calls routed directly to them |

A user can exist without being an agent — Workspace is usable by users without
agent permissions.

## 2. Agent statuses

| Status | Set by | Notes |
| --- | --- | --- |
| **Offline** | agent | |
| **Online** | agent | ready to receive activity |
| **Pause** | agent | requires choosing a **pause cause** |
| **Break out** | **system only** | forced offline after missing the maximum allowed number of calls |

The status control is a timer showing time in the current state, plus a dropdown.
A coloured circle beside the timer encodes the current status.

### 2.1. Pause

Choosing Pause opens the **Select a pause cause** modal. Causes are a lookup
configured in Admin (e.g. *Lunch*).

After confirming, a **pause window** appears with a timer counting time spent in
this pause, and two buttons:

- **Continue work** → Online
- **Logout** → Offline

The pause cause can be changed by selecting Pause again from the status control.

### 2.2. Break out

Cannot be set manually. Opens its own modal, with the same two buttons
(Continue work / Logout).

### 2.3. Pause restriction

Before allowing pause, the system checks **every queue of the agent** against the
queue parameter *"Access to pause when there are more online agents than:"*.

An agent cannot pause if the number of online agents is **equal to or below** that
limit. An **Attention** modal is shown instead.

When the restriction is active, the right panel's General info shows paused agents
as `X/Y`:

- **X** — agents currently paused
- **Y** — online agents minus the configured limit

## 3. User presence statuses

Separate from agent status, users carry a presence indicator used in the Users
list and contact previews. Documented values (User Guide §1.4.2.2):

- SIP connection present
- online
- DnD
- pause
- busy — in a conversation or chat
- unavailable — not in the system, or no SIP connection

[WPR/44997850 `Статуси операторів у Workspace`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/44997850/Workspace)
records the extension of this list: the original set was *logged in with SIP
registration / DnD / Busy / Offline*, and **Online-Callcenter** and **Pause** were
added so that the user list distinguishes an agent working in the call centre
from a merely logged-in user.

## 4. Online activity types — SPECIFIED, `todo`

[WPR/361267206 `todo. v1. [Workspace] Тип статусу "Онлайн"`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/361267206/todo.+v1.+Workspace)

| | |
| --- | --- |
| **Status** | TODO |
| **Priority** | P0 |
| **Source** | Aventus, Telemart |

**Goal:** an agent should be able to work, while online, on only a subset of their
skills — some additional ones, or none at all. Example: an inbound-queue agent
who wants to switch to manual outbound calls only for part of the day.

**Proposed solution:**

- A new Admin lookup **"Activity type"**, by analogy with the pause-cause lookup.
- Each activity type has: **Name** (required), **Description** (optional),
  **Skills** (multi-select, optional).
- **If an activity type has no skills, all the agent's skills become inactive** —
  they process no queues at all.
- In Workspace, choosing Online (or flipping the Call Center switch) opens a modal
  listing the types, with **"Standard Online"** as the default.
- **If the lookup is empty, the modal is not shown.**
- The agent's effective skills are the intersection of their own skills with the
  selected type's skills.
- The same modal appears in Supervisor → Agents when a supervisor puts an agent
  online.

## 5. Offline status notification — SPECIFIED, `des.`

[WPR/1585152006 `des. [Workspace] Сповіщення про статус офлайн`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1585152006/des.+Workspace)

| | |
| --- | --- |
| **Priority** | P1 |
| **Source** | Omnicore |

**Goal:** the agent must clearly see that they are in the Offline status.
Status: at design stage.

## 6. Jira trail

| Ticket | Meaning |
| --- | --- |
| [WTEL-3798](https://webitel.atlassian.net/browse/WTEL-3798) | a user can hold several statuses at once — resolve by priority |
| [WTEL-10195](https://webitel.atlassian.net/browse/WTEL-10195) | block page unload while the agent is online |
