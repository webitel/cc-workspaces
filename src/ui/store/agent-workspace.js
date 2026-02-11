import { CallActions, ConversationState } from 'webitel-sdk';

import WorkspaceStates from '../enums/WorkspaceState.enum.js';

const state = {
	stateHistory: [],
};

const getters = {
	TASK_ON_WORKSPACE: (state) => state.stateHistory.at(-1)?.task || {},
	WORKSRACE_STATE: (state) => state.stateHistory.at(-1)?.type,
	IS_EMPTY_WORKSPACE: (state, getters) => !getters.WORKSRACE_STATE,
	IS_CALL_WORKSPACE: (state, getters) =>
		getters.WORKSRACE_STATE === WorkspaceStates.CALL,
	IS_CHAT_WORKSPACE: (state, getters) =>
		getters.WORKSRACE_STATE === WorkspaceStates.CHAT,
	IS_JOB_WORKSPACE: (state, getters) =>
		getters.WORKSRACE_STATE === WorkspaceStates.JOB,
	IS_TASK_ACTIVE: (state, getters) =>
		getters.TASK_ON_WORKSPACE.state === ConversationState.Active ||
		getters.TASK_ON_WORKSPACE.state === CallActions.Active ||
		getters.TASK_ON_WORKSPACE.state === CallActions.Hold,
	// because we need to hide contact actions if call or chat not active
};

const actions = {
	OPEN_SESSION: async (context) => {
		try {
			// Userinfo is initialized in main.ts, so we don't need to call OPEN_SESSION here
			await context.dispatch('features/status/SUBSCRIBE_STATUS', null, {
				root: true,
			});
			// then, async open workspace session
			return Promise.allSettled([
				context.dispatch('ui/now/SET_NOW_WATCHER', null, {
					root: true,
				}),
				context.dispatch('features/globals/INIT_GLOBAL_HANDLERS', null, {
					root: true,
				}),
				context.dispatch('features/notifications/INITIALIZE', null, {
					root: true,
				}),
				context.dispatch('features/swController/INITIALIZE', null, {
					root: true,
				}),
				context.dispatch('features/call/SUBSCRIBE_CALLS', null, {
					root: true,
				}),
				context.dispatch('features/chat/SUBSCRIBE_CHATS', null, {
					root: true,
				}),
				context.dispatch('features/job/SUBSCRIBE_JOBS', null, {
					root: true,
				}),
				context.dispatch('features/call/missed/LOAD_DATA_LIST', null, {
					root: true,
				}),
				context.dispatch('features/call/manual/INITIALIZE_MANUAL_LIST', null, {
					root: true,
				}),
				context.dispatch('features/chat/manual/INITIALIZE_MANUAL_LIST', null, {
					root: true,
				}),
				context.dispatch('features/member/LOAD_DATA_LIST', null, {
					root: true,
				}),
			]);
		} catch (err) {
			throw err;
		}
	},

	CLOSE_SESSION: (context) =>
		Promise.allSettled([
			context.dispatch('ui/now/CLEAR_NOW_WATCHER', null, {
				root: true,
			}),
			context.rootState.client.destroyCliInstance(),
			context.dispatch('features/globals/RESET_GLOBAL_HANDLERS', null, {
				root: true,
			}),
			context.dispatch('features/notifications/DESTROY', null, {
				root: true,
			}),
		]),

	SET_WORKSPACE_STATE: (context, payload) => {
		context.commit('ADD_WORKSPACE_STATE', payload);
	},
	UPDATE_WORKSPACE_TASK: (context, task) => {
		if (!context.state.stateHistory.length) return;

		const lastState =
			context.state.stateHistory[context.state.stateHistory.length - 1];

		if (lastState.task?.id !== task.id) return;

		context.commit('UPDATE_LAST_TASK', task);
	},
	RESET_WORKSPACE_STATE: (context, config) => {
		let stateHistory = [
			...context.state.stateHistory,
		];

		/* Filter the history from tasks if this type was previously selected [WTEL-3064]

      When repeatedly clicking on a member in an offline queue,
      the last active event should be displayed in agent-workspace-action panel,
      excluding all offline queues
      */

		if (config) {
			const { type } = config;

			if (type) {
				stateHistory = stateHistory.filter(
					({ type: typeName }) => type !== typeName,
				);
			}
		}

		while (stateHistory.length) {
			const { type, task } = stateHistory.at(-1);
			if (context.rootState.features[type][`${type}List`].includes(task)) {
				break;
			}
			stateHistory.pop();
		}
		context.commit('SET_STATE_HISTORY', stateHistory);
	},
};

const mutations = {
	SET_STATE_HISTORY: (state, stateHistory) => {
		state.stateHistory = stateHistory;
	},
	ADD_WORKSPACE_STATE: (state, { type, task }) => {
		state.stateHistory.push({
			type,
			task,
		});
	},
	UPDATE_LAST_TASK: (state, task) => {
		if (state.stateHistory.length) {
			const lastIndex = state.stateHistory.length - 1;
			state.stateHistory = [
				...state.stateHistory.slice(0, lastIndex),
				{
					...state.stateHistory[lastIndex],
					task: task,
				},
			];
		}
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
