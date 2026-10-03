# Member (offline callbacks) — specified

> **Source of truth:** Jira + Confluence. See [`as-built.md`](./as-built.md) and
> [`delta.md`](./delta.md).

| | |
| --- | --- |
| **Module** | Workspace (cross-cutting) |
| **Feature** | Offline queue members / manual callbacks |
| **Status** | Released |
| **Source** | [Call Center User Guide §2.3](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/22937735/Webitel+Workspace.+Call+Center+User+Guide) |

> **Not a channel, but a workspace state.** `member` is one of four values of
> `WorkspaceState` (`call`, `chat`, `job`, `member`), so it occupies the central
> panel the way an activity does — but nothing is distributed to the agent. The
> agent goes looking for it.

## 1. What it is

The **Offline calls** list: subscribers the agent must call back manually. The
documented example is a caller who did not wait in the queue and chose the
callback option.

Unlike calls, chats and tasks, an offline member is **not pushed to the agent**.
It sits in a list until someone acts on it.

## 2. Documented flow

1. Open the Offline calls list in the left panel.
2. Select a subscriber by clicking the entry.
3. The central block opens the list of possible communications for that
   subscriber — *"for example, several numbers"*.
4. Select the needed number.
5. Press the call button at the top of the central block.

## 3. Documented constraints

- **Up to 10** entries are shown in the list.
- When the block is collapsed, the count is appended to the list name.
- In the reduced left panel an info icon is shown per record; hovering it
  displays that record's details.

## 4. Related behaviour elsewhere

- `IS_OFFLINE_CALL` (`queue.queue_type === OFFLINE_QUEUE`) suppresses the
  ringing notification for calls originating from an offline queue —
  [`../call/as-built.md`](../call/as-built.md) §3,
  ref [WTEL-4502](https://webitel.atlassian.net/browse/WTEL-4502).
- Member data feeds task queues too: the Inbound Task Queue spec states input is
  *"сутність Members, як в дайлерах"* — [`../job/spec.md`](../job/spec.md) §1.

## 5. Jira trail

| Ticket | Meaning |
| --- | --- |
| [WTEL-3064](https://webitel.atlassian.net/browse/WTEL-3064) | repeatedly clicking a member in an offline queue must not fill the workspace history — filter previous states of the same type |

## 6. Gaps in the specification itself

No Confluence page owns this feature. The entire specification is §2.3 of the
User Guide — five sentences and three constraints.

**Nothing documents:**

- how the list is refreshed, or how often
- whether the list is searchable or paged beyond 10
- what happens after the callback is placed
- what `Member → Description` and `Member → Variables` (referenced by the task
  spec) look like here
- the member History and Contacts views that exist in the code
