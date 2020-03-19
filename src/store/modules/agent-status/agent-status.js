import clientHandlers from './client-handlers';
import clientActions from './client-actions';

const state = {
  agent: {},
};

const getters = {};

const actions = {
  ...clientHandlers.actions,
  ...clientActions.actions,
};

const mutations = {
  ...clientHandlers.mutations,
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
