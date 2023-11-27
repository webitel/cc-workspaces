const state = {
  currentContact: {},
  listContacts: [],
  searchListContacts: [],
};

const actions = {
  SET_CURRENT_CONTACT: async (context, contact) => {
    context.commit('SET_CURRENT_CONTACT', contact);
  },
  SET_LIST_CONTACTS: async (context, list) => {
    context.commit('SET_LIST_CONTACTS', list);
  },
  SET_SEARCH_LIST_CONTACTS: async (context, list) => {
    context.commit('SET_SEARCH_LIST_CONTACTS', list);
  },
};

const mutations = {
  SET_CURRENT_CONTACT: (state, contact) => {
    state.currentContact = contact;
  },
  SET_LIST_CONTACTS: (state, list) => {
    state.listContacts = list;
  },
  SET_SEARCH_LIST_CONTACTS: (state, list) => {
    state.searchListContacts = list;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
