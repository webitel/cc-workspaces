# Chats — specified

> **Source of truth:** Jira + Confluence. What chats in Workspace were *supposed*
> to be. See [`as-built.md`](./as-built.md) and [`delta.md`](./delta.md).
>
> **Assembled, not quoted** — see [`../00-overview/delta.md`](../00-overview/delta.md) D-14.

| | |
| --- | --- |
| **Module** | Workspace |
| **Feature** | Chats |
| **Status** | Released |
| **First epic** | [WTEL-1547 `workspace: chats`](https://webitel.atlassian.net/browse/WTEL-1547) (2020-11) |
| **Source** | [Call Center User Guide §3](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/22937735/Webitel+Workspace.+Call+Center+User+Guide), WPR/WDEV delta specs |

## 1. Chat lists (left panel)

Three lists under the chats tab:

1. **Active chats**
2. **Self-assigned chats**
3. **Closed chats**

A blue circle on the tab indicates an unaccepted chat.

## 2. Accepting a chat

### 2.1. Automatic

Requires queue variable `wbt_auto_answer: true` **and** self-assign switched off.
The chat is accepted the moment it arrives, without the agent clicking anything.
An automatically distributed inbound chat is announced by an audible alarm.

### 2.2. Manual

The agent clicks **Accept** in the central block. Until then a blue circle marks
the chats tab.

### 2.3. Self-assigned

The list is shown to **all** agents of the queue; any of them may take any
waiting chat. Once taken, it disappears from everyone else's list.

- **No sound** is played for self-assigned chats, unlike automatic distribution.
- Concurrency is bounded by the queue's **Max wait count**.
- After acceptance the chat moves into **Active chats**.

## 3. Contact identification and history

On identifying the contact, the central block shows **the full message history
of that contact across every connected messenger** — not just the current
conversation, and regardless of which agents took part.

If several contacts match, the agent picks which one to link the chat to; the
history of the chosen contact is then shown.

Hovering the icon at the start of a conversation reveals the messenger icon and
the chat gateway name.

Specified in [WPR/270336007 `[Workspace] Історія чатів в центральній панелі`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/270336007/Workspace).

## 4. Closed chats

- Only chats **from the current day**.
- Sorted by close time, descending. 10 at a time, a **More** button pages the
  next 10.
- Clicking an entry opens its message history in the central block.

**Three documented close reasons:**

1. the subscriber closed the chat
2. the agent closed the chat
3. the response time expired

If the chat was closed by the subscriber or timed out, the agent presses a button
(revealed on hover in the left panel) to move it into Closed chats.

## 5. Closing a chat

Four documented paths:

1. **Unaccepted chat** — close button at the top of the central block.
2. **Active chat** — close button, then a confirmation modal (**Yes** / **No**).
3. **Transfer** — transferring closes the chat for the agent.
4. **Auto-close** — no response from subscriber or agent for a queue-configured
   period.

In every case, if processing is configured the chat stays **viewable during
processing** but the agent can no longer write into it.

The subscriber may also close the chat themselves — by a messenger command or a
configured button. The close button and the message input then disappear.

## 6. Transfer

Only an **accepted** chat can be transferred.

The agent presses transfer at the top of the central block; the central block
lists the available **schemes** (created in Admin). Each scheme has a button that
transfers the chat to it. The conversation then closes for the agent and the chat
continues in the scheme.

## 7. Messaging

- Text input, emoji, file attachment (button or drag-and-drop).
- Send by button or **Enter**.
- A failed send raises a notification.
- System messages carry a system marker; agent and subscriber messages carry an
  avatar. Names may be hidden.
- Audio and video messages from the subscriber are displayed.

## 8. Processing

Shown after the chat is accepted, and for a configured period after it ends.
Two modes, identical in shape to calls:

1. **Simple processing** — a description field plus a countdown; the form closes
   at zero, and a button near the end extends it.
   **Clicking Send closes the active chat.**
2. **Dynamic post-processing forms** — driven by the queue's Flow schema.

## 9. Accepted delta specs (WPR)

| Page | Change | Status |
| --- | --- | --- |
| [270336007](https://webitel.atlassian.net/wiki/spaces/WPR/pages/270336007/Workspace) | Contact chat history in the central panel | done |
| [340918275](https://webitel.atlassian.net/wiki/spaces/WPR/pages/340918275/Workspace) | Closed chats list and close reasons | done |
| [1207042065](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1207042065/26.02+Chats+Workspace) | Show who sent the last message | done |
| [992706563](https://webitel.atlassian.net/wiki/spaces/WPR/pages/992706563/Admin+Workspace) | Antivirus check on uploaded files | — |

## 10. Specified but not accepted

| Page | State | Content |
| --- | --- | --- |
| [1178435596](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1178435596/todo.+Workspace) | `todo` | visualise file-send errors (wrong size, wrong type) |
| [1736998918](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1736998918/dft.+Workspace) | `dft` | timer for how long the client has not replied |
| [501973002](https://webitel.atlassian.net/wiki/spaces/WPR/pages/501973002/todo.+Chats+.) | `todo` | closed-chat preview should show queue name and variables in Client info |
| [819462254](https://webitel.atlassian.net/wiki/spaces/WDEV/pages/819462254/dropped.+Workspace) | `dropped` | soft / hard client-inactivity timeouts |
| [1624145929](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1624145929/dropped.+Chat) | `dropped` | let an agent exceed the chat limit to answer a returning client |
| [1246134273](https://webitel.atlassian.net/wiki/spaces/WDEV/pages/1246134273/dft.+WhatsApp) | `dft` | WhatsApp group chats distributed to all agents at once |
| [1322647553](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1322647553/Chats+2.0) | — | Chats 2.0 |

## 11. Jira trail

| Ticket | Meaning |
| --- | --- |
| [WTEL-1547](https://webitel.atlassian.net/browse/WTEL-1547) | first chats epic |
| [WTEL-4923](https://webitel.atlassian.net/browse/WTEL-4923) | quick replies panel behaviour |
| [WTEL-5503](https://webitel.atlassian.net/browse/WTEL-5503) | reload all open pages of closed chats in one request |
| [WTEL-9263](https://webitel.atlassian.net/browse/WTEL-9263) | compare by `conversationId` on async Close/Destroy |
| [WTEL-9570](https://webitel.atlassian.net/browse/WTEL-9570) | drop the current agent from the chat header name |
| [WTEL-9955](https://webitel.atlassian.net/browse/WTEL-9955) | resolve closed-chat messages by `conversationId` during post-processing |
