import APIRepository from '../../../../app/api/APIRepository';

const historyAPI = APIRepository.history;

// NO_ANSWER cause - це коли до тебе має іти дзвінок 20 сєк, і якщо ти не піднімеш то буде помилка
// ORIGINATOR_CANCEL cause - це коли до тебе має іти дзвінок 20 сєк, але клієнт на 10 секунді сам відхиляє дзвінок
const requestParams = {
  size: 10,
  answeredAtFrom: 0,
  answeredAtTo: 0,
  // createdAtFrom: new Date().setHours(0, 0, 0, 0), // today
  createdAtTo: new Date().setHours(23, 59, 59, 999), // today end
  fields: ['from', 'created_at'],
  isMissed: true,
};

const state = {
  isNewMissed: false, // UI flag
  missedList: [],
  page: 0,
  next: false,
};

const getters = {
  REQUEST_PARAMS: (state, g, rootState) => {
    const { userId } = rootState.ui.userinfo;
    return {
      ...requestParams,
      userId,
      page: state.page,
    };
  },
  MISSED_LENGTH: (state) => (state.missedList.length),
};

const actions = {
  LOAD_DATA_LIST: async (context) => {
    const { items, next } = await historyAPI.getHistory(context.getters.REQUEST_PARAMS);
    context.commit('SET_NEXT', next);
    context.commit('SET_DATA_LIST', items);
  },

  LOAD_NEXT_PAGE: async (context) => {
    context.commit('SET_PAGE', context.state.page + 1);

    const { items, next } = await historyAPI.getHistory(context.getters.REQUEST_PARAMS);
    context.commit('SET_NEXT', next);
    context.commit('SET_DATA_LIST', [...context.state.missedList, ...items]);
  },

  RESET_MISSED_LIST: (context) => {
    context.commit('SET_DATA_LIST', []);
    context.commit('SET_PAGE', 0);
  },

  PUSH_MISSED_STUB: (context, { from = {} }) => {
    context.commit('PUSH_SINGLE_MISSED', { from, createdAt: Date.now() });
    context.commit('SET_NEW_MISSED');
  },

  RESET_NEW_MISSED: (context) => {
    context.commit('RESET_NEW_MISSED');
  },
};

const mutations = {
  SET_DATA_LIST: (state, list) => {
    state.missedList = list;
  },

  PUSH_SINGLE_MISSED: (state, missed) => {
    state.missedList.push(missed);
  },

  SET_NEW_MISSED: (state) => {
    state.isNewMissed = true;
  },

  RESET_NEW_MISSED: (state) => {
    state.isNewMissed = false;
  },

  SET_PAGE: (state, page) => {
    state.page = page;
  },

  SET_NEXT: (state, next) => {
    state.next = next;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
