let interval = null;

const state = {
  now: Date.now(),
};

const actions = {
  SET_NOW_WATCHER: (context) => {
    interval = setInterval(() => {
      context.commit('UPDATE_NOW');
    }, 1000);
  },

  CLEAR_NOW_WATCHER: () => {
    clearInterval(interval);
  },
};

const mutations = {
  UPDATE_NOW: (state) => {
    state.now = Date.now();
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
