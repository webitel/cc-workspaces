# Tasks (jobs) — as built

> **Source of truth:** `src/features/modules/job`,
> `src/ui/modules/queue-section/modules/job-queue`,
> `src/ui/modules/work-section/modules/job`, at 26.8.0.

## 1. Module layout

The smallest of the three channels — **two store files, no submodules**:

```
features/modules/job/store/
├── job.js               ~60 lines: state, one getter, three actions
└── client-handlers.js   ~60 lines: JobState event routing
```

UI:

```
queue-section/modules/job-queue/components/active/   one list only
work-section/modules/job/components/
├── the-job.vue
├── job-header/
├── job-variables-container/
└── job-footer/
```

There is **no** `manual/`, `missed/` or `closed/` submodule — unlike calls
(four lists) and chats (three lists), tasks have exactly **one** list.

## 2. State

```js
state = { jobList: [] }
```

`jobList` holds live SDK job objects, as with calls. Capabilities are read off
them: `allowAccept`, `allowClose`.

Single getter:

```js
JOB_ON_WORKSPACE: (s, g, rS, rootGetters) =>
  rootGetters['workspace/WORKSRACE_STATE'] === WorkspaceStates.JOB &&
  rootGetters['workspace/TASK_ON_WORKSPACE'],
```

(`WORKSRACE_STATE` is the real getter name — see [`delta.md`](./delta.md) J-06.)

## 3. Event handling

`SUBSCRIBE_JOBS` subscribes via `client.subscribeJob()` and seeds `jobList` from
`client.allJob()`. `handler` routes three `JobState` values:

| Event | Handler | Effect |
| --- | --- | --- |
| `Distribute` | `HANDLE_DISTRIBUTE_ACTION` | `ADD_JOB`, fire notification, and `OPEN_JOB` **if the workspace is empty** |
| `Bridged` | `HANDLE_BRIDGED_ACTION` | `openLinkFromVariable(job)` only |
| `Destroy` | `HANDLE_DESTROY_ACTION` | `REMOVE_JOB` |

`REMOVE_JOB` removes from the list, notifies `jobNotifications/HANDLE_JOB_END`,
and resets the workspace **if the removed job is the one on the workspace**
(compared by reference: `job === context.getters.JOB_ON_WORKSPACE`).

## 4. Actions on a task

**Not in the store.** Accept / decline / close are called **directly on the SDK
object from the components**:

```vue
<!-- job-footer.vue -->
<wt-button v-if="task.allowAccept"  @click="task.accept()">Accept</wt-button>
<wt-button v-if="task.allowAccept"  @click="task.decline()">Decline</wt-button>
<wt-button v-if="task.allowClose"   @click="task.close()">Close</wt-button>
```

```vue
<!-- job-queue-container.vue -->
@accept="task.accept()"
```

The Vuex module exposes only `OPEN_JOB`, `REMOVE_JOB`, `RESET_WORKSPACE`. This
differs sharply from calls and chats, where every SDK call is wrapped in a store
action.

Note both Accept and Decline are gated on the **same** flag, `allowAccept`.

## 5. Hotkeys

`job-footer.vue` registers two:

| Hotkey | Behaviour |
| --- | --- |
| `ACCEPT` | `if (task.allowAccept) task.accept()` |
| `END` | `if (task.allowClose) task.close();` **then** `if (task.allowAccept) task.decline();` |

`END` runs two independent `if`s, not an `if/else`.

## 6. Central panel

`the-job.vue` composes a `task-container` with three slots:

- **header** → `job-header.vue`, showing `task.displayName`
- **body** → `job-variables-container.vue`
- **footer** → `job-footer.vue`

### 6.1. Variables rendering

`job-variables-container.vue` does **not** render a plain `key: value` list. It:

1. deep-copies `task.variables`
2. **deletes `variables.knowledge_base`**
3. renders each remaining entry through **MarkdownIt** as `**${name}:** ${value}`
4. injects the result with **`v-html`**

```js
const md = new MarkdownIt({ linkify: true });
patchMDRender(md);
```

`patchMDRender` forces `target="_blank"` on links and leaves `html_block`
unminified (refs [WTEL-5112](https://webitel.atlassian.net/browse/WTEL-5112),
[WTEL-4472](https://webitel.atlassian.net/browse/WTEL-4472)). It performs **no
sanitising** — raw HTML is instead neutralised by MarkdownIt's default
`html: false`, which is not overridden here.

So a task variable's value is rendered as **Markdown**, with autolinking.

### 6.2. `knowledge_base` variable

The explicit `delete variablesCopy.knowledge_base` shows that a task variable
named `knowledge_base` is consumed elsewhere — this is the feed for the
Knowledge Base tab recorded as undocumented in
[`../00-overview/delta.md`](../00-overview/delta.md) D-01.

## 7. Left panel

One container, one preview, in `md` and `sm` densities. The preview shows:

- `task.distribute.queue_name` — queue name
- `task.displayName` — client name
- a `queue-preview-timer` bound to the task

Accept is wired directly on the preview.
