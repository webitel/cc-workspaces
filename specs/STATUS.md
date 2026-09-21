# Status

Last updated: **2026-09-21**, against `@webitel/workspace` **26.8.0**
(main merged in at `6f725bc0`).

> Read this first when resuming work. It is the handover: what exists, how it was
> built, what is unfinished, and what must not be repeated.

## Done

| Section | spec | as-built | delta | Findings |
| --- | --- | --- | --- | --- |
| `00-overview` | ✅ | ✅ | ✅ | 15 (D-01…D-15) |
| `call` | ✅ | ✅ | ✅ | 15 (C-01…C-15) |
| `chat` | ✅ | ✅ | ✅ | 12 (H-01…H-12) |
| `job` | ✅ | ✅ | ✅ | 12 (J-01…J-12) |
| `video` | ✅ | ✅ | ✅ | 13 (V-01…V-13) |
| `agent-status` | ✅ | ✅ | ✅ | 13 (S-01…S-13) |
| `notifications` | ✅ | ✅ | ✅ | 11 (N-01…N-11) |
| `global-handlers` | ✅ | ✅ | ✅ | 11 (G-01…G-11) |
| `connection-quality` | ✅ | ✅ | ✅ | 11 (Q-01…Q-11) |
| `member` | ✅ | ✅ | ✅ | 10 (M-01…M-10) |

**52 open questions** across the ten `delta.md` files, each listed at the bottom
of its file under "Open questions".

## Not started

| Section | Why it matters |
| --- | --- |
| `knowledge-base` | Right-panel tab, fed by the reserved `knowledge_base` task variable (J-08). Has **three** WPR specs of its own, none reviewed: [1219100675](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1219100675/Knowledge+Base), [1219657729](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1219657729/CRM+Knowledge+Base), [1436844033](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1436844033/dft.+Knowledge+base). D-01 should be re-checked when this is written. |
| `processing` | Post-processing forms — simple and dynamic. Referenced by every channel, owned by none. Lives in `ui/modules/info-section/modules/processing`. |
| `client-info` | Right-panel contact identification, CRM integration, minicard. |
| `screenshots` (agent) | Right-panel tab. Documented under [`Video calls` §3.4](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/1706754049/Video+calls), but not covered as its own section. |
| `appearance`, `userinfo`, `hotkeys`, `widget-bar` | Small shell modules. Hotkeys are undocumented everywhere (C-07, J-04). |

## Method notes — read before continuing

These were learned the hard way during this pass.

1. **The Call Center User Guide is not the whole documentation.** Two overview
   findings (D-02, D-06) were wrong because of this assumption. `WbtlDocEn` holds
   separate, current pages the guide never links to. **Always search the space by
   feature name before writing UNDOCUMENTED.** Recorded as D-15.

2. **Do not write findings from memory or from prior conversations.** The
   `global-handlers` description in `00-overview/as-built.md` claimed processing
   autosave lived there; a grep showed no such code exists. Verify in the tree.

3. **Mark uncertainty explicitly.** Every claim not actually checked says
   "unverified" / "not checked" and becomes an open question. Keep this — the
   value of the delta files depends on the reader trusting the confirmed ones.

4. **Claims that a thing is absent need a repo-wide grep**, and the grep should be
   quoted in the finding (see N-01, M-02, C-01).

5. **WPR holds delta specs, not feature specs.** One change each,
   `Проблематика → As-Is → To-Be`. A consolidated feature spec has to be
   assembled. Exceptions found so far: `job` (WPR/44995944),
   `connection-quality` (WPR/1178402825), `video` (WbtlDocEn page).

6. **Spec status fields are unreliable.** Activity types are implemented while
   their page says `TODO / P0` (S-02); network quality is marked `DONE` with
   four user-story-level gaps (Q-01…Q-05).

## Cross-cutting patterns found

Worth stating in any summary or report:

- **Errors swallowed silently.** Empty `catch {}` in call transfer/bridge (C-06);
  optional-chained recording controls (V-07); blanket catch on agent session
  (S-08); latency errors logged only (Q-10).
- **Localisation applied inconsistently inside single objects.** Push
  notification: localised title, hardcoded `'Accept'`/`'Decline'` buttons (N-04).
  Also `'Record error'` (V-06). Backend SQL error key reused as user text (G-11).
- **Notifications emitted outside the notifications module**, so they ignore all
  settings: disconnect sound (G-08), quality toasts (Q-08), permission errors in
  `ANSWER`.
- **Typos frozen into APIs**: `WORKSRACE_STATE` (J-06), `CLIENT_TIMOUT` (H-02),
  `SUBSRIBE_MEMBER_LIST` (M-08).
- **Production console output**: `console.info` per missed-calls request (C-07),
  `console.log` per socket transition (G-06).
- **Workspace cannot be specified from this repo alone.** Status control lives in
  `@webitel/ui-sdk` (S-13), chats in `@webitel/ui-chats`, screenshots in
  `@webitel/ui-datalist`.

## Highest-value confirmed defects

Ranked by likely user impact, all confirmed rather than suspected:

1. **N-01** — `rootState['features/notifications/currentlyPlaying']` is always
   `undefined`; the [WTEL-4918](https://webitel.atlassian.net/browse/WTEL-4918)
   fix never runs. One-line fix.
2. **Q-01** — connection quality severity downgraded by a later parameter; red
   reported as yellow.
3. **M-02** — chat entries always popped from workspace history
   (`features.chat.chatList` does not exist).
4. **Q-02** — MOS drives the agent-facing level, which its spec forbids.
5. **N-08** — OS notification dismissed by hardcoded English title, and by
   `title` where the API filters by `tag`.
6. **S-01** — `channels` / `onDemand` destructured from a literal lacking them.

## Tooling

A skill automates adding a section: **`wt-new-feature`**
(`~/.claude/skills/wt-new-feature/SKILL.md`). It encodes the source order, the
search queries, the three-file templates, the finding classifications, and the
method rules above. Invoke it with `/wt-new-feature <section>`.

To version it with the repo, move it to `.claude/skills/wt-new-feature/`.

## Suggested next steps

1. Resolve the 52 open questions — most are one grep or one SDK signature away.
   Several need only reading `@webitel/ui-sdk`.
2. Write the five missing sections above.
3. Decide what happens to confirmed defects: Jira tickets, or a single
   findings report.
