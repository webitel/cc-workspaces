# Member — as built

> **Source of truth:** `src/features/modules/member`,
> `src/ui/modules/work-section/modules/member`,
> `src/ui/store/agent-workspace.js`, at 26.8.0.

## 1. Layout

```
features/modules/member/member.js                     116 lines — the whole store
ui/modules/work-section/modules/member/
├── components/the-member.vue
├── components/member-header.vue
├── components/member-communications.vue
└── enums/MemberTab.enum.ts
```

The left-panel list lives with the calls:
`queue-section/modules/call-queue/components/offline-queue/`, with a dedicated
`offline-queue-preview-callback.vue`.

## 2. State

```js
state = {
  agent: null,              // never written — see delta M-04
  memberList: [],
  memberOnWorkspace: {},    // never written
  selectedCommId: null,
}
```

Getters:

```js
MEMBER_ON_WORKSPACE:       rootGetters['workspace/WORKSRACE_STATE'] === MEMBER && TASK_ON_WORKSPACE
IS_COMMUNICATION_SELECTED: Number.isInteger(state.selectedCommId)
```

`Number.isInteger` means a communication id is expected to be a **number**, and
that `null` (the initial value) correctly reads as "nothing selected".

## 3. Loading the list

```js
LOAD_DATA_LIST: async (context, payload) => {
  const page   = payload?.page   || 1;
  const size   = payload?.size   || 20;
  const search = payload?.search || '';
  const agent  = await context.dispatch('GET_AGENT_INSTANCE');
  const response = await agent.offlineMembers(search, page, size);
  context.commit('SET_DATA_LIST', { page, items: response.items });
  return response;
}
```

Straight from the SDK agent session: `agent.offlineMembers(search, page, size)`.

**Default page size is 20**, and the API accepts a `search` term.

`SET_DATA_LIST` replaces on page 1 and appends otherwise — infinite-scroll
paging, with the comment *"if component is re-rendered, reset persistent storage
data"*.

## 4. Polling

```js
SUBSRIBE_MEMBER_LIST: (context) => {
  const { subscribe } = useCachedInterval({ timeout: 15 * 1000 });
  subscribe(async () => {
    const response = await context.dispatch('LOAD_DATA_LIST');
  });
}
```

The list is **polled every 15 seconds** via `useCachedInterval` from
`@webitel/ui-sdk` — there is no push for offline members, unlike every other
activity type.

Note the action name is misspelled (`SUBSRIBE`), and `response` is assigned and
unused.

## 5. Placing the callback

```js
CALL: async (context, { id, communicationId }) => {
  const memberId = id || context.getters.MEMBER_ON_WORKSPACE.id;
  const commId   = communicationId || state.selectedCommId;
  const agent    = await context.dispatch('GET_AGENT_INSTANCE');
  await agent.directMember(memberId, commId);
  return context.dispatch('LOAD_DATA_LIST');
}
```

`agent.directMember(memberId, commId)` — the SDK places the call. The list is
then reloaded so the member disappears or changes state.

`commId` falls back to **the module-scope `state` object**, not `context.state`
— see [`delta.md`](./delta.md) M-01.

## 6. Workspace state integration

`member` is one of four `WorkspaceState` values:

```js
{ CALL: 'call', MEMBER: 'member', CHAT: 'chat', JOB: 'job' }
```

`SET_WORKSPACE` pushes `{ type: MEMBER, task: member }` onto the workspace state
history like any activity.

`RESET_WORKSPACE` is the **only one of the four that passes a config**:

```js
context.dispatch('workspace/RESET_WORKSPACE_STATE', { type: WorkspaceStates.MEMBER }, { root: true })
```

Calls, chats and jobs all pass `null`.

### 6.1. What the config does

`RESET_WORKSPACE_STATE(config)` in `ui/store/agent-workspace.js`:

```js
if (config) {
  const { type } = config;
  if (type) stateHistory = stateHistory.filter(({ type: typeName }) => type !== typeName);
}

while (stateHistory.length) {
  const { type, task } = stateHistory.at(-1);
  if (context.rootState.features[type][`${type}List`]?.includes(task)) break;
  stateHistory.pop();
}
```

The filter implements [WTEL-3064](https://webitel.atlassian.net/browse/WTEL-3064),
quoted in the source:

> *"When repeatedly clicking on a member in an offline queue, the last active
> event should be displayed in agent-workspace-action panel, excluding all
> offline queues"*

The `while` loop then pops history entries whose task is no longer in its
channel's list, resolving the list by **string convention**:
`features[type][`${type}List`]` → `features.call.callList`,
`features.job.jobList`, `features.member.memberList`, `features.chat.chatList`.

## 7. Central panel

`MemberTab.enum.ts` declares **three** tabs:

```ts
Communications | History | Contacts
```

`the-member.vue` maps **two**:

```js
const memberTabComponents = {
  [MemberTab.Communications]: MemberCommunications,
  [MemberTab.History]: History,
};
```

`History` is the shared `workspace-history` component, also used elsewhere.
Default tab is `Communications`.

`member-communications.vue` renders the communications with
`v-for`, marks the selected one with a `selected` class on
`communication.id === selectedCommId`, and dispatches `SELECT_COMMUNICATION`.
