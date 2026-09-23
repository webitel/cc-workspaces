# chat-history store — why it was rewritten

Branch: `refactor/WTEL-10384/chat-history-store`.

Two files: `chat-history.js` (rewritten) and `__tests__/chat-history.spec.js` (new).

This is not the [WTEL-10384](https://webitel.atlassian.net/browse/WTEL-10384) fix — that one
lives in `modules/closed/store/closed.js` and ships separately. This is what we ran into next
to it: a defect nobody had reported, and the shape that made it possible.

## The defect

`LOAD_CHAT_HISTORY` called the API with no page parameter, so the server always returned the
first page — but `state.page` kept whatever the previously opened chat had left there.

`page` was only reset in `RESET_CHAT_HISTORY_STATE`, and the only caller of that is
`onUnmounted` in `the-chat-history.vue`. Switching between chats of the same contact does not
re-create the component (it reacts to an id `watch`), so the counter survived the switch.

`LOAD_NEXT` then asked for `state.page + 1`. Page through three pages in chat A, open chat B,
scroll up — and the request goes out for page 5 instead of page 2. Pages 2-4 never load and
the conversation has a hole in it.

## What changed

`LOAD_CHAT_HISTORY` only ever runs on open — two call sites, `the-chat-history.vue:190` and
`closed.js:161` — so its page is always 1. That is now written down instead of falling out of
the client's `page || 1` default.

Scrolling goes through `LOAD_NEXT` (`the-chat-history.vue:251`, driven by
`wt-intersection-observer`), so the two actions never disagree about which page to ask for.

Both did the same work, so the shared part moved into `LOAD_PAGE`, which takes the page as an
argument.

Because the page is an argument rather than state committed on the side, `SET_PAGE` writes the
number, the messages and `next` together — they can no longer drift apart.

The first page replaces the list, later pages are prepended. That difference is the only
condition left in the file: `page === 1`.

`isLoaded` was written in three places and read in none, so it is gone along with its
mutation.

## One behaviour change

Error handling lived in `LOAD_CHAT_HISTORY` only; `LOAD_NEXT` failed silently. After the
merge it is shared, so a failed page-in now raises the same notification. That is the only
thing an agent can see — everything else is internal.

## Public surface is unchanged

`LOAD_CHAT_HISTORY`, `LOAD_NEXT` and `RESET_CHAT_HISTORY` keep their names and signatures.
`LOAD_PAGE` is internal. Mutations went from five to two; all of them were already
file-private.

## Tests

Five, each checked by mutating the code and confirming the suite goes red:

| Mutation | Caught |
| --- | --- |
| Initial load reuses the stale counter | yes |
| `LOAD_NEXT` drops the `+ 1` | yes |
| A later page is appended instead of prepended | yes |
| The first page is prepended instead of replacing | yes |
| The `next` guard is removed | yes |
| A failed request is swallowed | yes |

## What to check by hand

The store is shared — active chats use it too, not just closed ones.

1. Active chat: open it, scroll up several times.
2. Two closed chats of the same contact: page up in one, switch to the other, page up again —
   no gap in the conversation.
3. Kill the network while paging up — the notification should appear.
