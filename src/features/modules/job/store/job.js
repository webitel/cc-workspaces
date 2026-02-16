import WorkspaceStates from '../../../../ui/enums/WorkspaceState.enum';
import clientHandlers from './client-handlers';

const state = {
	jobList: [],
};

const getters = {
	JOB_ON_WORKSPACE: (s, g, rS, rootGetters) =>
		rootGetters['workspace/WORKSRACE_STATE'] === WorkspaceStates.JOB &&
		rootGetters['workspace/TASK_ON_WORKSPACE'],
};

const actions = {
	...clientHandlers.actions,
	OPEN_JOB: (context, job) => {
		context.dispatch(
			'workspace/SET_WORKSPACE_STATE',
			{
				type: WorkspaceStates.JOB,
				task: job,
			},
			{
				root: true,
			},
		);
	},
	REMOVE_JOB: async (context, job) => {
		context.commit('REMOVE_JOB', job);
		await context.dispatch('features/jobNotifications/HANDLE_JOB_END', job, {
			root: true,
		});
		if (job === context.getters.JOB_ON_WORKSPACE)
			context.dispatch('RESET_WORKSPACE');
	},
	RESET_WORKSPACE: (context) => {
		context.dispatch('workspace/RESET_WORKSPACE_STATE', null, {
			root: true,
		});
	},
};

const mutations = {
	SET_JOB_LIST: (state, jobList) => {
		state.jobList = jobList;
	},
	ADD_JOB: (state, job) => {
		state.jobList.push(job);
	},
	REMOVE_JOB: (state, job) => {
		state.jobList.splice(state.jobList.indexOf(job), 1);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
