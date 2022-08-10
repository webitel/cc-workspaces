import { CallDirection, JobState } from 'webitel-sdk';

const handler = (context) => (action, job) => {
  switch (action) {
    case JobState.Distribute:
      context.dispatch('HANDLE_DISTRIBUTE_ACTION', { action, job });
      break;
    case JobState.Destroy:
      context.dispatch('HANDLE_DESTROY_ACTION', { action, job });
      break;
    default:
    // console.log('default', action);
  }
};

const actions = {
  SUBSCRIBE_JOBS: async (context) => {
    const client = await context.rootState.client.getCliInstance();
    await client.subscribeJob(handler(context));
    const jobList = client.allJob();
    if (jobList.length) context.commit('SET_JOB_LIST', jobList);
  },
  HANDLE_DISTRIBUTE_ACTION: async (context, { action, job }) => {
    context.commit('ADD_JOB', job);
    await context.dispatch('features/notifications/HANDLE_JOB_DISTRIBUTE', { action, job }, { root: true });
    if (context.rootGetters['workspace/IS_EMPTY_WORKSPACE']) {
      context.dispatch('OPEN_JOB', job);
    }
  },
  HANDLE_DESTROY_ACTION: (context, { job }) => context.dispatch('REMOVE_JOB', job),
};

export default {
  actions,
};
