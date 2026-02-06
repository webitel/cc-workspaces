import { WtObject } from '@webitel/ui-sdk/enums';

import FlowsAPI from '../api/flows';
import { useUserAccessControl } from '../../../../../../app/composables/useUserAccessControl';

const state = {
  flows: [],
};

const getters = {
  ALLOW_FLOWS: (state, getters, rootState, rootGetters) => {
    const { hasReadAccess: hasFlowsReadAccess } = useUserAccessControl(WtObject.Flow);
    console.log('trying to get access info from useUserAccessControl composable inside vuex getter: ', hasFlowsReadAccess.value);
    return rootGetters['features/status/IS_AGENT'] && hasFlowsReadAccess.value;
  },
};

const actions = {
  LOAD_FLOWS_LIST: async (context) => {
    const { items } = await FlowsAPI.getLookup({ enabled: true });
    context.commit('SET_FLOWS', items);
  },
};

const mutations = {
  SET_FLOWS: (state, flows) => {
    state.flows = flows;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {},
};
