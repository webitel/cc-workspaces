# Global handlers (connection lifecycle) — specified

> **Source of truth:** Jira + Confluence. See [`as-built.md`](./as-built.md) and
> [`delta.md`](./delta.md).

| | |
| --- | --- |
| **Module** | Workspace (cross-cutting) |
| **Feature** | WebSocket / SIP connection lifecycle |
| **Status** | Released |

> **Cross-cutting.** This module owns what happens to *all* channels when the
> connection breaks or returns. It is the only place that can clear calls, chats
> and tasks at once.

## 1. What the documentation says

Almost nothing. The Call Center User Guide covers the connection only from the
agent's side of the top bar (§1.1.2):

> **SIP connection indicator** — there is a SIP connection / there is no SIP
> connection. *"If you have a SIP connection, you can call, if not, you can't."*

**Not documented anywhere reviewed:**

- what the agent sees when the WebSocket drops
- what happens to an in-progress call, chat or task on disconnect
- whether the session recovers automatically
- what the agent is expected to do

There is **no Confluence page** for connection loss, reconnection, or session
recovery. The entire specification of this module is reconstructed from Jira
tickets.

## 2. Jira trail — the de-facto specification

| Ticket | Meaning |
| --- | --- |
| [WTEL-2827](https://webitel.atlassian.net/browse/WTEL-2827) | the disconnect popup must use `v-show`, not `v-if` |
| [WTEL-8909](https://webitel.atlassian.net/browse/WTEL-8909) | also clear tasks on the client `close` event, not only `disconnected` |
| [WTEL-8920](https://webitel.atlassian.net/browse/WTEL-8920) | clear all active tasks (calls, chats, jobs) from the store when the connection is lost |
| [WTEL-7256](https://webitel.atlassian.net/browse/WTEL-7256) | the disconnect popup itself |

[WTEL-8920](https://webitel.atlassian.net/browse/WTEL-8920) carries the design
rationale, quoted in the source:

> *"clears all active tasks (calls, chats, jobs) from store when connection is
> lost … This prevents getters like `CALL_ON_WORKSPACE` from returning stale
> tasks"*

So the rule is: **on connection loss, the client's view of all activity is
discarded rather than kept and reconciled.** The server is the only authority;
the client does not attempt to preserve state across a break.

## 3. Related: network quality

Connection *quality* (as opposed to connection *loss*) is a separate module with
its own accepted spec —
[WPR/1178402825 `26.02 [Workspace] Перевірка якості мережі`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1178402825/26.02+Workspace),
status **done**, and a follow-up for History
([WPR/1490321650](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1490321650/26.06+History+Workspace)).

See `specs/connection-quality/` (not yet written).
