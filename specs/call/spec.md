# Calls — specified

> **Source of truth:** Jira + Confluence. What calls in Workspace were *supposed*
> to be. See [`as-built.md`](./as-built.md) and [`delta.md`](./delta.md).
>
> **Assembled, not quoted.** No consolidated "Calls in Workspace" document exists
> upstream. This file aggregates the Call Center User Guide, WPR/WDEV delta specs
> and the Jira trail. See [`../00-overview/delta.md`](../00-overview/delta.md) D-14.

| | |
| --- | --- |
| **Module** | Workspace |
| **Feature** | Calls |
| **Status** | Released |
| **Source** | [Call Center User Guide §2](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/22937735/Webitel+Workspace.+Call+Center+User+Guide), WPR/WDEV delta specs |

## 1. Preconditions

1. **Call Center** switch is ON.
2. A SIP connection exists (indicator in the top bar).
3. The agent is assigned to at least one queue.

Without a SIP connection the agent cannot call at all.

## 2. Call lists (left panel)

### 2.1. Active calls

Ringing and answered calls. An inbound call is announced by a ringtone and shown
in the central block with: subscriber name, phone number, queue name, and three
buttons — **accept**, **transfer**, **hangup**.

- **Answer** connects the agent; the right panel switches to the configured
  processing, or to **Client info** if no processing is configured.
- **Reject** ends the call and increments the agent's missed count — **unless it
  was an internal call**.
- The call acted upon by central-block tools is the one **selected** in the left
  panel, marked with a yellow frame.

### 2.2. Missed calls

Contains calls missed or rejected by the agent, from three origins: inbound
queue, direct calls to the agent, internal calls.

- Up to **10** shown; a button pages the next 10.
- When the block is collapsed, the count is appended to the list name.
- Hovering a record swaps the call icon for a delete icon, which removes the
  missed call.
- A call button redials the number.

**Deduplication rules:**

- Call distributed to several agents, nobody answered → appears in *everyone's*
  Missed calls. The first callback removes it from *all* of them, regardless of
  whether the subscriber picked up.
- Call distributed to several agents, the last one answered → not shown as
  missed to the others.

### 2.3. Offline calls

Subscribers to be called back manually — e.g. someone who left the queue and
requested a callback.

Flow: open the list → select the entry in the left panel → the central block
lists the possible communications for that subscriber (there may be several
numbers) → pick a number → press call at the top of the central block.

- Up to **10** shown.
- Collapsed block appends the count to the list name.
- In the reduced left panel an info icon is shown per record; hovering reveals
  the record details.

### 2.4. Self-assigned calls

Inbound calls from queues configured with self-assign distribution. Any agent of
the queue may take any waiting call by pressing the accept button.

- Up to **10** shown; the count is appended to the list name when at least one
  such call exists.
- A bar under each entry shows the subscriber's waiting time as a percentage of
  the queue's **Max wait time**:
  - green — < 50%
  - yellow — 51–75%
  - red — > 76%

## 3. In-call tools

| Tool | Behaviour |
| --- | --- |
| Numpad | expands the dialpad; **calling another number puts the current call on hold** |
| Call history | list of completed calls with duration, start time, call button |
| Hangup | ends the call |
| Hold | subscriber stops hearing the agent; hears music if configured |
| Mute | turns the microphone off and on |
| Transfer | see §4 |

## 4. Transfer

Two documented forms.

### 4.1. Blind transfer

Press the transfer button, pick an agent from the list. The call moves to that
agent immediately.

Per [WDEV/44997404](https://webitel.atlassian.net/wiki/spaces/WDEV/pages/44997404/dft.+Workspace),
blind transfer also accepts a **manually entered number**, not only a list pick.

### 4.2. Transfer with consultation

1. Agent holds the call with the client.
2. Presses the call button in the left panel.
3. Dials the target agent's number and calls.
4. Talks to the target agent, explains the reason.
5. Presses the bridge button, selects the recipient, presses connect.
6. The call is transferred; the first agent's leg ends.

Per [WDEV/44997404](https://webitel.atlassian.net/wiki/spaces/WDEV/pages/44997404/dft.+Workspace),
while in consultation mode the agent has **two active calls** (subscriber on
hold, consultant active) and three exits: end the consultation and return to the
subscriber, complete the consultative transfer, or escalate to a conference.

> **Processing is shown only to the first agent.**

### 4.3. Conference — SPECIFIED, DRAFT ONLY

[WDEV/44997404 `dft. [Workspace] Консультація і конференція`](https://webitel.atlassian.net/wiki/spaces/WDEV/pages/44997404/dft.+Workspace)
specifies a third mode alongside blind transfer and consultation:

- Available to **all users**, not only agents and supervisors.
- Implemented via **Eavesdrop**.
- The agent keeps talking to the client while the consultant is being dialled.
- The central block shows a dial-out view: avatar, name, phone number, and the
  states *dialling / accepted / rejected*.
- Conference icon blinks black↔transparent while dialling, turns red once the
  consultant answers.
- While in conference, blind and consultative transfer are **disabled**.
- Active-call preview frame colour: **green** = active, **yellow** = hold.

Explicitly marked **OUT OF SCOPE** in the same document:

- Any participant leaving without ending the call for the others. Today, if the
  agent hangs up, the call ends for everyone.
- More than three participants.
- Muting or removing a conference participant.

**Status of this document:** `dft.` prefix, header reads "в роботі дока на ФЕ".
It is a draft, not an accepted spec. Sections are labelled
`ALREADY IMPLEMENTED` (blind transfer) and `наявний функціонал` (much of
consultation), so it is partly a description of existing behaviour and partly a
proposal.

## 5. Outgoing calls

Three documented paths:

1. **Manual dialing** — call button in the left panel, type the number in the
   central block, press the call button that appears at the top.
2. **Select from a list** — opens the agent/user list; the indicator beside each
   name shows their state (SIP connected, online, DnD, pause, busy, unavailable).
3. **Call back from history** — open call history, press the call button beside
   an entry.

## 6. Related delta specs (WPR)

These are individual accepted changes, each a separate page:

| Page | Change | Status |
| --- | --- | --- |
| [1114963981](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1114963981/Workspace) | Queue name in the central panel | done |
| [1120370690](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1120370690/Workspace) | Hold duration display | todo |
| [1113292812](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1113292812/todo.+Workspace+Dialplan) | Transfer call to a Dialplan | todo |
| [200933385](https://webitel.atlassian.net/wiki/spaces/WPR/pages/200933385/Workspace) | Transfer call to a Contact (needs `CUSTOMER_SERVICE`) | questioned |
| [1136066569](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1136066569/26.02+Workspace) | Busy agents count | done |
| [1178402825](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1178402825/26.02+Workspace) | Network quality monitoring | done |
| [1926070276](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1926070276/todo.+Workspace) | Central-panel drawer redesign | todo |

## 7. Jira trail

| Ticket | Meaning |
| --- | --- |
| [WTEL-4502](https://webitel.atlassian.net/browse/WTEL-4502) | suppress ringing notification for manual / offline-queue calls |
| [WTEL-7915](https://webitel.atlassian.net/browse/WTEL-7915) | close the OS notification once talking starts and once the call ends |
| [WTEL-7256](https://webitel.atlassian.net/browse/WTEL-7256) | disconnect popup |
| [WTEL-10195](https://webitel.atlassian.net/browse/WTEL-10195) | block page unload while the agent is online |
