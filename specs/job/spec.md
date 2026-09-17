# Tasks (jobs) — specified

> **Source of truth:** Jira + Confluence. See [`as-built.md`](./as-built.md) and
> [`delta.md`](./delta.md).

| | |
| --- | --- |
| **Module** | Workspace |
| **Feature** | Tasks (Inbound Task Queue) |
| **Status** | Released |
| **Primary spec** | [WPR/44995944 `Inbound Task Queue. User Stories`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/44995944/Inbound+Task+Queue.+User+Stories) (2022-06) |
| **Also** | [Call Center User Guide §4](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/22937735/Webitel+Workspace.+Call+Center+User+Guide) |

> Unlike calls and chats, tasks **do** have a single consolidated product spec.
> It is the oldest complete user-story document in this spec set, and it is
> written as a proposal — several paragraphs are explicitly marked
> *"Припущення"* (assumption) and one open question is left unanswered in the
> text.

## 1. Concept

A new queue type: **Inbound task queue**.

- Works by analogy with inbound call and chat queues.
- Input is the **Members** entity, the same as in dialers.
- **An agent may have only one active task.**

## 2. Preview in the left panel

> Marked in the source as an assumption: *"ліва панель (як прев'ю запрошення в чат)"*.

**Given** the agent is online in Call Center mode,
**when** the system distributes a task to them,
**then** the left panel shows a preview containing:

| Field | Source |
| --- | --- |
| **Name** | client name, if received |
| **Destination** | client number, if received |
| **Queue** | name of the originating queue |
| **Timer** | time since the task was distributed to this agent |

Available actions: **Accept**, **Reject**.

## 3. Preview in the central panel

> Marked as an assumption: *"як відкритий чат перед тим, як його прийняти"*.

On distribution the central panel shows:

- **Queue** — originating queue name
- **Name** — `Member → Name`
- **Destination** — `Member → Destination`
- **Variables** — a `key: value` list from `Member → Variables`

Available actions: **Accept**, **Reject**.

### 3.1. Open question in the source

The spec leaves this unresolved, verbatim:

> *"Що показувати в центральній панелі?"* — with a proposed answer: put task
> data in the central panel only, and use the right panel for the dynamic
> post-processing form if the queue has a **Dynamic processing schema**
> attached; if not, leave the **General** tab.

So the right-panel behaviour is a *proposal*, not a decision.

## 4. Accepting a task

**When** the agent presses **Accept** on the preview, **or** the Accept icon in
the window of an active but unaccepted task,
**then** the same data is shown (Queue, Name, Destination, variables).

The agent can then: **End** — finish processing the task.

## 5. Rejecting a task

**When** the agent presses **Reject** on the preview, or the Reject icon in the
active-but-unaccepted task window,
**then** the preview disappears and **the system routes the task to another
agent**.

Per the User Guide §4, redistribution continues until some agent accepts.

## 6. What the User Guide adds

The user documentation (written later than the user stories) states:

- An inbound task is announced by **an audible signal**.
- **Dynamic post-processing forms** open in the right panel after acceptance,
  and their look varies per task.
- The button is **Close**, not "End".
- The button is **Decline**, not "Reject".

## 7. Self-assigned tasks — SPECIFIED, DRAFT ONLY

[WDEV/109150210 `dft. [Admin] Self-assigned tasks`](https://webitel.atlassian.net/wiki/spaces/WDEV/pages/109150210/dft.+Admin+Self-assigned+tasks)
specifies a **Manual distribution** switch on the Inbound task queue parameters
(off by default). When on, tasks are not distributed by strategy but shown to
every agent assigned to the queue, and an agent picks one — the same model as
self-assigned calls and chats.

Status: `dft.` draft.

## 8. Knowledge Base relation

Task variables are the mechanism behind the Knowledge Base tab — see
[`../00-overview/delta.md`](../00-overview/delta.md) D-01.

Knowledge Base has its own specs, none of which were reviewed in this pass:

- [WPR/1219100675 `Knowledge Base`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1219100675/Knowledge+Base)
- [WPR/1219657729 `CRM Knowledge Base`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1219657729/CRM+Knowledge+Base)
- [WPR/1436844033 `dft. Запити на покращення Knowledge base`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1436844033/dft.+Knowledge+base)
