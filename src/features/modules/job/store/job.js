import WorkspaceStates from '../../../../ui/enums/WorkspaceState.enum';
import clientHandlers from './client-handlers';

const state = {
  jobList: [],
  jobOnWorkspace: null,
};

const actions = {
  ...clientHandlers.actions,
  OPEN_JOB: (context, job) => {
    context.dispatch('workspace/SET_WORKSPACE_STATE', WorkspaceStates.JOB, { root: true });
    context.commit('SET_WORKSPACE', job);
  },
  REMOVE_JOB: (context, job) => {
    if (job === context.state.jobOnWorkspace) context.dispatch('RESET_WORKSPACE');
    context.commit('REMOVE_JOB', job);
  },
  RESET_WORKSPACE: (context) => {
    context.dispatch('workspace/RESET_WORKSPACE_STATE', null, { root: true });
    context.commit('SET_WORKSPACE', {});
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
  SET_WORKSPACE: (state, job) => {
    state.jobOnWorkspace = job;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
