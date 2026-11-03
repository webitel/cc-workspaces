# Workspace — Overview (delta)

> Divergences between [`spec.md`](./spec.md) (Jira + Confluence) and
> [`as-built.md`](./as-built.md) (source code), as of `@webitel/workspace` 26.8.0.

Each entry is classified:

- **UNDOCUMENTED** — exists in code, absent from the specification
- **UNIMPLEMENTED** — specified, not found in code
- **DIVERGENT** — both exist but disagree
- **STALE** — documentation describes an older state

---

## D-01. Knowledge Base tab — UNDOCUMENTED

The Call Center User Guide lists **four** right-panel tabs (General info,
Client info, Task processing, Flow schemas).
`the-agent-info-section.vue` registers **six**, including
`info-section/modules/knowledge-base`.

No description of this tab exists in the user documentation.

**Impact:** an entire agent-facing feature is invisible to anyone reading the
spec. Needs its own `specs/knowledge-base/`.

---

## D-02. Screenshots tab — ~~UNDOCUMENTED~~ → CORRECTED

**Superseded. This entry was wrong when first written.**

The Screenshots tab *is* documented — just not in the Call Center User Guide.
[`Video calls` §3.4](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/1706754049/Video+calls)
(2026-06) describes it fully: the agent captures screenshots during a **video
call**, and the tab lists them with download / delete / view actions and a
gallery viewer.

The speculation about `descTrack` and the desktop build was also wrong — see
D-03, which stands on its own.

What remains true is narrower: the tab is absent from the User Guide, which is
the document an agent is pointed at. See D-15.

---

## D-03. Desktop track (`descTrack`) — UNDOCUMENTED

`the-agent-workspace.vue` renders `desc-track-auth-error-popup` whenever
`!agent.descTrack` and `IS_DESC_TRACK_AUTH_POPUPS_ALLOW` is true, plus a
matching success popup. This is a blocking-style authorisation flow the agent
sees on entry.

Nothing in the user documentation mentions it.

---

## D-04. Tab set is server-configurable — STALE

The spec presents the right panel as a fixed list of tabs, with only
Flow schemas gated by a licence.

In code, visible tabs are computed from `EngineSystemSettingName` and
`DefaultWorkspaceTabSettings` — i.e. the deployment can change which tabs exist
at all. The documented "four tabs" is one possible configuration, not the
contract.

---

## D-05. Metrics bar — DIVERGENT

The user guide lists 15 metrics. `Widgets.js` defines **19 active** widgets.

Present in code, absent from the documented list:

- `callInboundQueue` — inbound calls from queues
- `callDialerQueue` — dialer queue calls
- `callManual` — manual calls
- `callQueueMissed` — missed queue calls

Naming also diverges: the guide's *"Processed Calls"* corresponds to
`callHandled`, and *"After Call Work Time"* to `processing`. The mapping is
inferred from semantics, **not confirmed against the API field names** — verify
before using.

Additionally, `SCORE_COUNT` and `SCORE_REQUIRED_AVG` are commented out in
`Widgets.js`, while the spec's General info section does promise
*"evaluation of Agent's calls made by Auditors and Supervisors"*. Whether the
evaluation display was moved elsewhere or dropped is **unresolved**.

---

## D-06. Video is not a channel — DIVERGENT (confirmed, and documented after all)

In code, video is **not** a fourth channel: `video-container` sits outside the
three-pane grid at shell level, and video is a toggle inside an existing call
(`HotkeyAction.TOGGLE_VIDEO`). There is no video queue, no video list.

**This part stands.** `specs/video/` is written as a call sub-mode, not a
sibling of `call`/`chat`/`job`.

**Correction to the original entry:** it claimed video "is not covered by the
current user documentation". That was wrong —
[`Video calls`](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/1706754049/Video+calls)
(2026-06) documents it in depth across client, agent and History. It simply is
not referenced from the Call Center User Guide. See [`../video/`](../video/).

---

## D-07. Hotkeys — UNDOCUMENTED

Eight hotkey actions are implemented (`ACCEPT`, `END`, `MUTE`, `HOLD`,
`TRANSFER`, `NEW_CALL`, `SUBMIT_FORM`, `TOGGLE_VIDEO`). The user guide describes
every one of these as a **button click** and never mentions keyboard shortcuts.

The actual key bindings are not recorded here — they live in
`ui/hotkeys/useHotkeys.js` and need to be extracted for the call spec.

---

## D-08. Session is opt-in via welcome popup — UNDOCUMENTED

The guide describes entry as: grant browser permissions, close the modal, set
the Call Center switch.

In code there is an additional gate: `welcome-popup` must be confirmed before
`workspace/OPEN_SESSION` runs. Until then there is no session at all.

The documented permissions modal and this welcome popup may be the same thing
— **unverified**.

---

## D-09. Leaving while online is blocked — UNDOCUMENTED

`the-app.vue` registers a `beforeunload` handler that triggers the browser's
"leave site?" confirmation whenever `IS_AGENT_ONLINE`.
Added per [WTEL-10195](https://webitel.atlassian.net/browse/WTEL-10195).
Not documented.

---

## D-10. PWA / service worker — UNDOCUMENTED

`features/modules/sw-controller` is a registered store module and the project is
built as a PWA. Offline behaviour, update prompts and caching are not described
anywhere in the specification.

---

## D-11. Panel pinning — UNDOCUMENTED

The guide documents collapse and full-page expansion for blocks. The right panel
additionally supports **pinning**, which suppresses its collapse action. Not
documented.

---

## D-12. 1280 × 610 constraint — STALE, unverified

All three language versions of the Workspace page state support "up to
1280 × 610 px without scroll". Nothing in `usePanelSizeController` or the layout
CSS was checked against this claim while writing this file.

**Open question:** is this still true, or a leftover from an early version?

---

## D-13. Email channel — UNIMPLEMENTED (by design)

[WPR/1200488480 `dft. [Workspace] Розділ Emails`](https://webitel.atlassian.net/wiki/spaces/WPR/pages/1200488480/dft.+Workspace+Emails)
specifies an Emails section. It is a **draft** (`dft.` prefix) and belongs to
[DES-645 New Workspace](https://webitel.atlassian.net/browse/DES-645), which is
explicitly out of scope for this spec set. No email code exists in
`cc-workspaces`.

Recorded here only so that the absence is not mistaken for an oversight.

---

## D-14. No consolidated feature specs exist — process gap

The `WPR` space contains delta specs only (Problem → As-Is → To-Be, one change
each). There is no authoritative "Calls in Workspace" or "Chats in Workspace"
document.

Every per-feature `spec.md` in this directory therefore has to be **assembled**
from the user guide plus dozens of WPR pages plus the Jira trail. That
assembly is itself the deliverable — it does not exist upstream.

---

## D-15. The User Guide is not the whole specification — process gap

Two entries in this file (D-02, D-06) were initially wrong because they assumed
the Call Center User Guide was the complete agent-facing documentation. It is
not.

`WbtlDocEn` holds separate, current, detailed pages that the User Guide never
links to — at minimum
[`Video calls`](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/1706754049/Video+calls),
[`Video Call Recording`](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/1707671553/Video+Call+Recording),
[`Screenshots (Supervisor)`](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/1125777409/Screenshots+Supervisor).

**Consequence for this spec set:** before recording anything as UNDOCUMENTED,
search `WbtlDocEn` by feature name, not only the User Guide. Entries written
before this rule was adopted (D-01 through D-14) carry that risk; D-01
(Knowledge Base) in particular has three WPR specs of its own and should be
re-checked when `specs/knowledge-base/` is written.

---

## Open questions

1. Are the Screenshots tab and `descTrack` the same feature? (D-02, D-03)
2. Where did agent call evaluations go, if `SCORE_*` widgets are disabled? (D-05)
3. Is the welcome popup the same as the documented permissions modal? (D-08)
4. Does the 1280 × 610 constraint still hold? (D-12)
5. Which metric `type` values map to which documented metric names? (D-05)
