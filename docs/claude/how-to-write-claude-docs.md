# Writing Claude docs for cc-workspaces

The rules below own how a Claude doc is written in this repo — for a domain, a module, a
section, a feature or a set of files. Read this file whenever you are asked to document any
of them. Also available as the `module-docs` skill, which is this same file.

These docs exist for Claude, not for the release notes. A colleague's Claude must pick them
up on its own, without anyone remembering to point at them.

## Discovery mechanics — these dictate the layout

- The root `CLAUDE.md` is loaded at the start of every session. It costs context always, so
  it stays thin.
- A `CLAUDE.md` inside a subdirectory is pulled in on its own when files in that subtree are
  read or edited. It costs nothing until the work actually touches that module. This is the
  mechanism the stubs rely on.
- An `@path` import inside `CLAUDE.md` loads that file **always**, not on demand. Fine for
  one file, wrong for a shelf of domain docs.
- A file under `docs/claude/` is loaded by no mechanism at all. It is reached only because a
  stub that *was* picked up names it. That is the trade the layout makes: the docs sit
  together and cost nothing per session, and the stubs are the only thing making them
  findable — a doc without a stub is invisible.
- Nested `CLAUDE.md` files are not covered by the repo's `.gitignore` (only `.claude` is), so
  they commit without any exception.

## Layout

```
CLAUDE.md                          thin: hard rules + the docs convention
docs/claude/<domain>.md            the domain doc itself
docs/claude/how-to-write-...       this file
src/**/<entry point>/CLAUDE.md     stub pointing at the domain doc
```

Domain logic lives in `src/features/modules/<domain>/`, its UI in `src/ui/modules/<section>/`,
so one domain usually spans several paths and no single directory owns it. Write the doc
**once** in `docs/claude/<domain>.md`, named the way the repo talks about the domain
(`chats.md`), and drop a stub in every directory that touches it — including the one holding
the logic:

```markdown
# <domain> UI

The domain is documented in one place: `docs/claude/<domain>.md`.
Read it before changing anything here.
```

The stub costs nothing and makes the auto-pickup work from any direction. It carries the
pointer and nothing else: the moment a fact lands in a stub, that fact lives in two places.

## Picking the granularity — one file per domain is the common case

Placement is settled by the layout: the doc goes to `docs/claude/`, the stubs go to the
directories. What is left is how much belongs in one file. The rule is:
**one file per domain, and a new file only when an existing one stops being readable.**

- **A feature inside one domain** (active-chats pagination, the unread dot) — not a new
  file. It is a section of that domain's doc, until the doc passes ~150 lines; then split it
  into `docs/claude/<domain>-<feature>.md` and link it from the domain doc, so the stubs keep
  working through one hop.
- **A handful of files** — same answer. A separate file costs a whole discovery hop to
  deliver one paragraph; put the paragraph in the nearest doc above them.
- **A feature spanning several domains** — one doc, under the domain that owns most of the
  logic, with stubs in the directories of the others. Do not split one story across two docs
  to mirror the directory tree; the tree is no longer what decides.
- **Not about code in one place at all** — a convention, a test policy, a workflow — is not
  a domain doc and gets no stub. It goes to `docs/` itself, one level above `docs/claude/`
  (as `docs/test-usefulness-categories.md` does), and if it has to fire every session it
  gets one line in the root `CLAUDE.md` or in `AGENTS.md`.

## What goes into a doc

Write what the code cannot tell on its own:

- traps — where an obvious-looking assumption is wrong;
- empirical facts about the backend that are in no schema (ignored query params, odd id
  formats, endpoints that 500);
- why something is built the way it is, when the reason is not visible locally;
- the division of responsibility between stores, handlers and APIs;
- known problems, with a date.

Leave out what a `Grep` answers in a second: lists of action names, helper signatures, file
inventories. They rot fastest and carry the least.

## Format

- Open with the date and the branch the observations come from, plus a line telling the
  reader to verify against the code before asserting anything.
- Keep it under ~150 lines. Past that, split by sub-topic into another `docs/claude/` file
  linked from the domain doc, rather than growing one file.
- English, as with every AI-facing doc in this repo.
- One **fact**, one place. Two copies of a fact drift apart and the stale one starts lying,
  so a fact living in the domain doc must not be repeated in the root `CLAUDE.md` or in
  memory. Behavioural **rules** work the other way round: they do not rot from repetition,
  and a rule stated once competes with everything else in a long session. Deduplicate facts,
  let rules repeat.

## Anti-patterns

- Piling every domain into the root `CLAUDE.md` — every session pays for what one session in
  ten needs.
- `@`-importing domain docs from the root — same cost, hidden behind nicer syntax.
- Keeping domain prose in `.claude/` — that directory is for skills, commands and settings.
  A domain doc belongs in `docs/claude/`, with stubs pointing at it from the code.
- A doc in `docs/claude/` that no stub names. Nothing loads it, so it only ever helps whoever
  already knew it was there.
- A stub that starts explaining things. It is picked up in every session touching that
  directory, so it stays a pointer — and a fact in a stub is a second copy that will drift.
- Duplicating a fact into memory "so it is not lost". Memory is a dated, per-user layer; a
  fact that belongs to the repo belongs in the repo.
- Keeping a table of domain docs in the root `CLAUDE.md` or `AGENTS.md`. It is a fact that
  needs syncing, it costs context every session, and auto-pickup already covers it — the
  `.claude/chat.md` row in `AGENTS.md` was stale within weeks.

## Before finishing a doc

- Every claim checked against the current code, not against an older doc or a memory file.
- Nothing in it duplicates the root `CLAUDE.md`, `AGENTS.md`, or another domain's doc.
- The root `CLAUDE.md` is left alone — no list of docs is kept anywhere; discovery is
  `ls docs/claude` plus the stubs the auto-pickup finds.
- A stub exists in every directory the domain touches, and each one names the right file.
