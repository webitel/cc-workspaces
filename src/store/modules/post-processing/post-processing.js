import Vue from 'vue';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import Reporting from './Reporting';

const state = {
};

const getters = {
  IS_TASK_REPORTING: (s, g, rS, rootGetters) => rootGetters['workspace/TASK_ON_WORKSPACE'].hasReporting,
  TASK_POST_PROCESSING: (s, g, rS, rootGetters) => rootGetters['workspace/TASK_ON_WORKSPACE'].postProcessData,
  REPORTING_SENT: (s, g, rS, rootGetters) => rootGetters['workspace/TASK_ON_WORKSPACE'].task.reportedAt,
  IS_MEMBER: (state, getters, rootState, rootGetters) => rootGetters['workspace/TASK_ON_WORKSPACE'].isMember,
  IS_COMMUNICATION_POPUP: (state, getters) => getters.TASK_POST_PROCESSING?.isNewCommunication
    || getters.TASK_POST_PROCESSING?.editedCommunication,
};

const actions = {
  INIT_POST_PROCESSING_FORM: (context, task = context.rootGetters['workspace/TASK_ON_WORKSPACE']) => {
    if (context.getters.IS_TASK_REPORTING && isEmpty(context.getters.TASK_POST_PROCESSING)) {
      Vue.set(task, 'postProcessData', new Reporting(task));
    }
  },
};

const mutations = {
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
