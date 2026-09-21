# Video calls — delta

> Divergences between [`spec.md`](./spec.md) and [`as-built.md`](./as-built.md),
> at 26.8.0.
>
> Video is a call sub-mode — [`../call/delta.md`](../call/delta.md) applies too.

---

## V-01. Best-documented feature in the whole spec set — no divergence found

Unusually, [`Video calls`](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/1706754049/Video+calls)
covers client side, agent side and History, is current (2026-06), and matches
the code on every point checked in this pass: three window sizes, screenshot
capture with download/delete/view, gallery viewer, manual and automatic
recording, chat with files, `meeting_satisfaction`.

Recorded explicitly because it is the counter-example to
[`../chat/delta.md`](../chat/delta.md) H-11 and
[`../00-overview/delta.md`](../00-overview/delta.md) D-14: when a feature *does*
get one owned document, the delta collapses to almost nothing. The problem
elsewhere is the documentation model, not the developers.

---

## V-02. This spec set previously recorded video as undocumented — CORRECTED

`00-overview/delta.md` D-06 originally stated video "is not covered by the
current user documentation", and D-02 called the Screenshots tab undocumented
and speculated it related to the desktop build.

**Both were wrong.** They were written from the Call Center User Guide alone,
which never links to the `Video calls` page. Both entries have been corrected in
place, and D-15 was added recording the search rule that prevents a repeat.

Kept here so the correction is visible from the video side too.

---

## V-03. The User Guide never mentions video — process gap

The Call Center User Guide is the document an agent is pointed at, and it is
structured as: §1 layout, §2 Call, §3 Chats, §4 Tasks. Video appears **nowhere**
in it — not in §2 where it belongs, not as a cross-reference.

An agent reading the guide end to end would not learn that video calls exist.

Not a code divergence. A navigation defect in the documentation set.

---

## V-04. `Bridge` is unavailable on video calls — UNDOCUMENTED

`CallTab` (audio) and `VideoCallTab` differ in two slots:

| Audio | Video |
| --- | --- |
| `Numpad` | `State` |
| `Bridge` | `Chat` |

Dropping `Numpad` is self-evident. Dropping **`Bridge`** is not: bridge is the
mechanism behind **consultative transfer**
([`../call/as-built.md`](../call/as-built.md) §6.2).

So on a video call the agent appears to keep blind transfer but lose
consultative transfer. Neither the video spec nor the call spec says so.

**Unverified:** whether `Transfer` on a video call offers the same three targets
(agents / users / queues), and whether bridging is genuinely impossible or merely
not surfaced. Worth checking before stating it as a limitation.

---

## V-05. What `State` tab shows is unspecified — UNDOCUMENTED

`VideoCallTab.State` has no counterpart in the audio call and is not described
anywhere in the video documentation, which enumerates the mini/medium/fullscreen
controls and the chat but never a "State" view.

**Not investigated** in this pass — the enum value was found, the component
behind it was not read.

---

## V-06. Recording error message is not localised — DEFECT

```js
eventBus.$emit('notification', {
  type: 'error',
  text: error?.message || 'Record error',
});
```

`'Record error'` is a hardcoded English literal in a product that ships Ukrainian,
English and Russian locales. A Ukrainian-speaking agent whose recording fails
without a server message sees English.

Contrast with `ANSWER` in the call module, which uses
`i18n.global.t('error.websocket.…')`.

---

## V-07. Recording controls fail silently if absent — DEFECT

```js
if (call.recordings) await call.stopRecord?.();
else                 await call.startRecord?.();
```

Optional chaining on both. If the SDK call object has no `startRecord`, pressing
record does **nothing at all** — no error, no notification, no state change. The
agent presses the button and cannot tell whether recording started.

Given the spec promises "manual by the agent or automatic" recording, a silent
no-op is the worst failure mode here.

Same class of defect as [`../call/delta.md`](../call/delta.md) C-06 (empty
`catch {}` on transfer and bridge).

---

## V-08. Chat gated on the client's first message — DIVERGENT in emphasis

The spec states it plainly and it is a real constraint:

> The chat opens automatically after the **first message** from the client.
> Until the first message is received, the chat remains unavailable to the agent.

So **the agent cannot initiate the chat**. During a video call, file transfer and
text are one-way-gated: only the client can open that path.

The spec records the behaviour but not the consequence, and the agent-facing
§3.3 lists chat features as if freely available. **Where this gate is enforced in
code was not located** in this pass — `the-video-call-chat.vue` was not read.

---

## V-09. In-call chat reuses the chat channel only for unseen counts — architecture note

Video-call chat has its own store (`video-call/modules/chat/store/chat.js`) and
its own component, entirely separate from `features/chat`.

The one exception, added by
[WTEL-8866](https://webitel.atlassian.net/browse/WTEL-8866): the unseen counter
**is** shared. `video-call/modules/chat/composables/useVideoCallChatUnseen.ts`
commits into `features/chat/unseen` and reads `UNSEEN_COUNT` back out, so the
badge on the `Chat` tab of `call-header.vue` is driven by the chat channel's
store. Confirmed in code.

Everything else remains unshared: quick replies
([`../chat/delta.md`](../chat/delta.md) H-04), contact history and the
`@webitel/ui-chats` machinery have no video-call equivalent. **Still
unverified** as a deliberate product decision rather than an accident.

How the shared counter is fed is itself a defect — see V-13.

---

## V-10. Screenshots use Pinia while everything around them uses Vuex — architecture note

`screenshots.ts` is `createTableStore` from `@webitel/ui-datalist` — Pinia — while
the entire surrounding `features/call` tree is Vuex.

Consistent with the monorepo's stated migration direction (new code → Pinia), and
worth noting as the **only** such store found in the call feature so far. It is
a useful precedent for how the rest of the migration can look.

---

## V-11. Screenshot list columns are not sortable — minor

```js
{ value: 'view_name',   sort: null, … }
{ value: 'uploaded_at', sort: null, … }
```

Both `sort: null`. The spec's §3.4 says the tab shows "name, date, and time of
creation for each file" and does not promise sorting — but a screenshots list
ordered only by insertion becomes awkward on a long call.

Not a divergence. Recorded as a gap between what the data shape invites and what
is enabled.

---

## V-12. Client-side page is out of this repository — scope note

Sections 2.1–2.7 of the spec (link page, device checks, join screen, client
interface, rating screen) describe a **client-facing page**, not Workspace. None
of it is in `cc-workspaces`.

`createMeeting` and `expireSec` are backend/Flow concerns; `meeting_satisfaction`
is written by that flow and read in History.

Recorded so nobody looks for it here and records it as missing.

---

## V-13. Unseen counter for in-call chat is inferred from message-array length — DEFECT

`useVideoCallChatUnseen.ts` has no event to listen to: messages arrive by
mutating the SDK `Conversation` instance, so the composable watches
`VIDEO_CALL_CHAT_MESSAGES` and decides a message is new when

```js
messages?.length - (prevMessages?.length ?? 0) === 1
```

Consequences, read from the code:

- **Only a delta of exactly 1 counts.** Two messages landing in one tick, or a
  page of history being appended, increment the counter by nothing.
- Anything that shortens the array (a deletion, a reload) is silently ignored,
  so the counter and the visible thread can drift apart.
- The counter is never decremented per message — `MARK_CHAT_SEEN` wipes it whole
  when the agent opens the `Chat` tab, and `REMOVE_UNSEEN_CHAT` when the call
  ends.

The comment in the file states the constraint honestly ("there's no WS event to
hook"). The fix belongs on the SDK side; recorded here so the counter is not
read as exact.

---

## Open questions

1. Can a video call be bridged / consultatively transferred at all? (V-04)
2. What does the `State` tab show? (V-05)
3. Where is the "chat until first client message" gate enforced? (V-08)
4. Are quick replies genuinely absent from video-call chat? (Unseen tracking is
   no longer absent — V-09, V-13.)
5. Does `Transfer` on video offer the same three targets as audio? (V-04)
