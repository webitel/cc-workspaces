# Tasks (jobs) — delta

> Divergences between [`spec.md`](./spec.md) and [`as-built.md`](./as-built.md),
> at 26.8.0.

---

## J-01. Terminology drifted between the two specs — DIVERGENT

The 2022 user stories and the later User Guide disagree, and the code follows
neither exactly:

| WPR user stories (2022) | User Guide | Code / i18n key |
| --- | --- | --- |
| **Reject** | Decline | `reusable.decline` → `task.decline()` |
| **End** | Close | `reusable.close` → `task.close()` |
| Accept | Accept | `reusable.accept` → `task.accept()` |

The older product spec is stale on naming. Anyone reading WPR/44995944 today
will look for buttons that do not exist.

The code is now consistent across channels: the chat preview's reject button was
switched from `reusable.reject` to `reusable.decline` in
[WTEL-10462](https://webitel.atlassian.net/browse/WTEL-10462), so **Decline** is
the single wording everywhere.

---

## J-02. Task actions bypass the store — DIVERGENT (architecture)

In `call` and `chat`, every SDK call is wrapped in a Vuex action (`ANSWER`,
`HANGUP`, `TRANSFER`, `CLOSE`…), which is where guards, error handling and
side effects live.

In `job`, components call the SDK object directly:

```vue
@click="task.accept()"    @click="task.decline()"    @click="task.close()"
```

The store has no `ACCEPT` / `DECLINE` / `CLOSE` at all.

Consequences: no single place to add logging, error handling or analytics for
task actions; no way to dispatch them from anywhere but those components; and
task behaviour cannot be unit-tested at the store level the way calls and chats
can.

Not a user-visible bug — a structural inconsistency between three sibling
channels.

---

## J-03. Accept and Decline share one guard — likely DEFECT

```vue
<wt-button v-if="task.allowAccept" @click="task.accept()">
<wt-button v-if="task.allowAccept" @click="task.decline()">
```

Decline is shown exactly when Accept is. There is no `allowDecline`.

If the SDK ever allows declining without allowing accepting (or vice versa), the
UI is wrong in both directions. **Whether `allowDecline` exists in the SDK was
not checked** — if it does, this is a real bug; if it does not, it is an
undocumented assumption.

---

## J-04. `END` hotkey fires two actions — likely DEFECT

```js
callback: () => {
  if (this.task.allowClose)  this.task.close();
  if (this.task.allowAccept) this.task.decline();
}
```

Two sequential `if`s, no `else`. If a task ever satisfies both `allowClose` and
`allowAccept`, the hotkey **closes and declines the same task**.

The button UI treats these as mutually exclusive states (Accept/Decline before
acceptance, Close after), so in practice they probably never overlap — but the
code does not enforce that, and nothing documents the invariant.

---

## J-05. "Only one active task" is not enforced client-side — DIVERGENT

The spec states plainly: *"Оператор може мати лише одну активну задачу."*

The client keeps `jobList: []` — an array — and the left panel renders
`v-for="(task, index) of taskList"`. Nothing in Workspace limits it to one.

The constraint, if enforced, lives in the backend. The client is written as if
several tasks were possible, which is either dead flexibility or an
undocumented relaxation of the rule.

---

## J-06. `WORKSRACE_STATE` — DEFECT (repo-wide)

The getter is misspelled at its definition in
`ui/store/agent-workspace.js:11` and consistently misspelled at all call sites,
including `features/modules/job/store/job.js:10` and
`features/modules/member/member.js:13`.

Consistent, therefore harmless — but it is a public-looking getter name in the
root workspace store, referenced from four modules and at least one component.
Recorded here because `job` is where it is most visible (the module has exactly
one getter and it uses it).

---

## J-07. Task variables are rendered as Markdown — UNDOCUMENTED

The spec says the central panel shows *"Список змінних - key: value"*.

The implementation renders every variable through **MarkdownIt with linkify**
and injects it with **`v-html`**:

```js
res += md.render(`**${name}:** ${variablesCopy[name]}`);
```

So a task variable containing Markdown is formatted, and any URL in a value
becomes a clickable link opening in a new tab.

This is a meaningful capability — an integration can send formatted instructions
to the agent — and it is documented nowhere. It also means variable content is
**not** displayed verbatim, which contradicts the spec's `key: value`.

On safety: `new MarkdownIt({ linkify: true })` leaves `html: false` (the
default), so raw HTML in a variable is escaped rather than executed, and
`patchMDRender` does not enable it. The `v-html` is therefore fed
MarkdownIt-generated markup only. **Worth re-checking if anyone ever enables
`html: true` here** — the same `patchMDRender` is shared with `client-info`,
which does patch `html_block`.

---

## J-08. `knowledge_base` variable is silently stripped — UNDOCUMENTED

```js
delete variablesCopy.knowledge_base;
```

A task variable named `knowledge_base` is removed before rendering, because it
feeds the Knowledge Base tab instead.

Neither the task spec nor the User Guide mentions that a reserved variable name
exists, or that `knowledge_base` is special. An integrator sending a variable by
that name would find it silently disappear from the agent's view.

This is the concrete link for
[`../00-overview/delta.md`](../00-overview/delta.md) D-01 (Knowledge Base tab
undocumented). Knowledge Base has three of its own WPR specs, none reviewed yet
— see [`spec.md`](./spec.md) §8.

---

## J-09. Self-assigned tasks not implemented — UNIMPLEMENTED (expected)

[WDEV/109150210](https://webitel.atlassian.net/wiki/spaces/WDEV/pages/109150210/dft.+Admin+Self-assigned+tasks)
specifies a Manual distribution switch for task queues, mirroring self-assigned
calls and chats.

`job-queue` has a single `active/` container. There is no `manual/` submodule in
`features/modules/job`, and no `waitingListJobs` equivalent to the
`waitingListCalls` / `waitingListChats` used by the other two channels.

Consistent with the document's `dft.` status — recorded so the asymmetry between
the three channels is not read as an oversight.

---

## J-10. `Bridged` does nothing but open a link — UNDOCUMENTED

```js
HANDLE_BRIDGED_ACTION: (context, { job }) => OpenLinkFromVariable(job),
```

The `Bridged` job state produces **no state change** — no list update, no
workspace change, no notification. Its only effect is opening an external URL
from a job variable.

Same mechanism as calls ([C-12](../call/delta.md)) and chats (on `Joined`), and
undocumented in all three. For tasks it is the *entire* meaning of a lifecycle
event, which makes the omission larger here.

---

## J-11. Workspace auto-opens only when empty — UNDOCUMENTED

```js
if (context.rootGetters['workspace/IS_EMPTY_WORKSPACE']) {
  context.dispatch('OPEN_JOB', job);
}
```

A distributed task takes over the central panel **only if nothing else is
there**. If the agent is on a call or in a chat, the task appears in the left
panel and stays there.

The spec describes the central-panel preview as if it always appears on
distribution. The actual rule is conditional and undocumented — and it matters,
since it is exactly the multi-task situation J-05 says should not exist.

---

## J-12. Job removal compares by reference — fragile

```js
if (job === context.getters.JOB_ON_WORKSPACE) context.dispatch('RESET_WORKSPACE');
```

Identity comparison on an SDK object. Chats hit precisely this problem and were
fixed to compare by `conversationId`
([WTEL-9263](https://webitel.atlassian.net/browse/WTEL-9263), documented in
`docs/claude/chats.md`).

Whether the SDK guarantees a stable job instance across `Distribute` → `Destroy`
was **not verified**. If it ever hands back a different object, the workspace
will not reset.

---

## Open questions

1. Does the SDK expose `allowDecline`? (J-03)
2. Can a task ever satisfy `allowClose` and `allowAccept` at once? (J-04)
3. Is "one active task" enforced in the backend, and is the array in the client
   deliberate? (J-05)
4. Is the job object identity stable across its lifecycle? (J-12)
5. What is the shape of the `knowledge_base` variable, and which spec defines it?
   (J-08)
