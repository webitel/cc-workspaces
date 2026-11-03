# Chats — delta

> Divergences between [`spec.md`](./spec.md) and [`as-built.md`](./as-built.md),
> at 26.8.0.
>
> Classification: **UNDOCUMENTED** · **UNIMPLEMENTED** · **DIVERGENT** ·
> **STALE** · **DEFECT**

---

## H-01. Six close reasons in code, three in the spec — DIVERGENT

The user guide names three reasons a chat can appear in Closed chats:
subscriber closed, agent closed, response time expired.

`ChatCloseReason.enum.js` defines six:

| Code value | Documented as |
| --- | --- |
| `client_leave` | "the subscriber closed the chat" |
| `agent_leave` | "the agent closed the chat" |
| `client_timeout` | folded into "response time expired" |
| `agent_timeout` | **not documented** |
| `silence_timeout` | **not documented** |
| `transfer` | **not documented** as a close reason |

Three distinct timeout kinds are collapsed into one sentence in the
documentation, and `transfer` — which the spec describes as a *path* to closing
— is a first-class stored reason.

An agent looking at a closed chat can see a reason the documentation cannot
explain.

---

## H-02. `CLIENT_TIMOUT` is misspelled — DEFECT

```js
CLIENT_TIMOUT: 'client_timeout',
```

The key drops an `E`. The **value** is correct, so anything comparing against
`'client_timeout'` works; anything referring to the key by name reads wrong, and
a future `CLIENT_TIMEOUT` addition would silently create a duplicate.

Cosmetic today, a trap later.

---

## H-03. Chat transfer to a **User** — UNDOCUMENTED

The user guide describes chat transfer as targeting **schemes** only: press
transfer, the central block lists schemes, pick one.

`TRANSFER` supports two destinations:

```js
ChatTransferDestination.USER      → chat.transferToUser(item.id)
ChatTransferDestination.CHATPLAN  → chat.transferToPlan(item.id)
```

Transferring a chat directly to another user is implemented and undocumented.

This mirrors [C-03](../call/delta.md) in calls, where transfer-to-queue is
likewise implemented and undocumented — the transfer surface is broader than the
documentation in **both** channels.

---

## H-04. Quick replies — UNDOCUMENTED

An entire feature: a searchable canned-reply panel with **variable
interpolation** (`${varName}` substituted from chat variables), multi-select
composition, and light/dark empty states. Implemented per
[WTEL-4923](https://webitel.atlassian.net/browse/WTEL-4923).

Nothing in the Call Center User Guide §3 mentions quick replies. §3.6 describes
sending a message as: type text, attach a file, pick an emoji, press send.

For an agent this is one of the most-used daily affordances, and it is invisible
in the specification.

---

## H-05. Failed-file state exists; the spec for it is still `todo` — DIVERGENT

[WPR/1178435596 `todo. [Workspace] Помилки файлів в чаті`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1178435596/todo.+Workspace)
is marked **todo** and specifies visualising file-send errors (wrong size, wrong
type) with localised strings.

But `store/chat.js` already maintains `failedFiles` per chat, appends on send
failure, exposes a `FAILED_FILES` getter and clears it on close.

So part of the mechanism is built while the spec is still open. **What is not
verified** is whether the *UI* renders it, and whether the size/type
distinction from the spec exists — only the store was inspected.

---

## H-06. Antivirus check — UNVERIFIED

[WPR/992706563 `[Admin, Workspace] Антивірус`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/992706563/Admin+Workspace)
specifies blocking files that fail an antivirus scan, in both directions
(agent-uploaded and client-sent).

No antivirus-specific code was found in the chat module during this pass, but
the search was not exhaustive and the rejection may surface as a generic send
failure (see H-05). **Unresolved.**

---

## H-07. Messenger-agnostic contact history is a store-level split — supporting detail

The spec's §3 (full contact history across messengers) is not an incidental
feature: it is a **separate store module** (`chat-history.js`) and a separate UI
subtree (`chat-messaging/chat-history/`) from the current chat.

Not a divergence — recorded because it shows the documented behaviour has real
architectural weight, and the two histories can drift independently.

---

## H-08. Three participant kinds in previews — UNDOCUMENTED

`AgentIcon.enum.ts` renders `Bot` / `Contact` / `Agent` icons in chat previews,
and `AgentTypes.enum.ts` (`webitel`, `user`, `bot`) is what excludes non-clients
when resolving the client's name.

The user guide mentions system messages carry a marker and agent/subscriber
messages carry an avatar, but never describes **bots as visible participants**
with their own icon — despite bots being central to how chats start
(see [WPR/1682243609 on bot control in chat threads](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1682243609/-)).

---

## H-09. Chat status colours — UNDOCUMENTED

`ChatColorsMap` assigns: new → success (green), active → warning (yellow),
closed → disabled, manual → disabled.

So a **self-assigned** chat is rendered in the same muted colour as a **closed**
one, while a new auto-distributed chat is green. Nothing documents this colour
language, and grouping manual with closed is at least unintuitive — a waiting
self-assigned chat is actionable, a closed one is not.

**Whether this is deliberate is unverified.**

---

## H-10. `SET_MEDIA_VIEW` is dead — DEFECT (already known)

`docs/claude/chats.md` records it under "Known problems": `store/chat.js`
declares a `SET_MEDIA_VIEW` mutation, but the root module has no `state` and
nobody commits it. The live one is `chatMedia/SET_MEDIA_VIEW`. Only
`chats.spec.js` calls it, directly on the module object.

Carried here so the spec set is self-contained.

---

## H-11. The engineering doc has no product counterpart — process gap

`docs/claude/chats.md` is unusually good and unusually deep — ids, keying,
lifecycle, traps. There is **no equivalent product-level document**: the WPR
pages for chats are all one-change deltas, and half of them are `todo`, `dft` or
`dropped`.

The result is an inverted documentation shape: transport mechanics are better
specified than agent-facing behaviour. Anyone asking "what is an agent supposed
to be able to do in a chat?" has only the User Guide, which this file shows to be
incomplete on at least four counts (H-01, H-03, H-04, H-08).

---

## H-12. Large draft/dropped backlog — context, not a divergence

Seven chat specs are unaccepted: client-reply timer, soft/hard inactivity
timeouts, exceeding the chat limit for a returning client, WhatsApp group chats,
closed-chat queue/variables in Client info, Chats 2.0, and bot control in
threads.

None are implemented, and none should be treated as missing — they were never
accepted. Recorded so the absences are not mistaken for regressions.

---

## Open questions

1. Does the UI actually render failed files, and does it distinguish size from
   type? (H-05)
2. Is antivirus rejection implemented, and if so where does it surface? (H-06)
3. Is colouring self-assigned chats the same as closed ones deliberate? (H-09)
4. Where is chat transfer-to-user exposed in the UI, and who may use it? (H-03)
5. Which chat variables are available to quick-reply interpolation? (H-04)
