import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';

import ReportingForm from './ReportingForm';

const state = {
};

const getters = {
};

const actions = {
  INIT_REPORTING_FORM: (context, task = context.rootGetters['workspace/TASK_ON_WORKSPACE']) => {
    if (context.rootGetters['ui/infoSec/processing/ALLOW_PROCESSING'] && isEmpty(task.postProcessData)) {
      task.postProcessData = new ReportingForm(task);
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
