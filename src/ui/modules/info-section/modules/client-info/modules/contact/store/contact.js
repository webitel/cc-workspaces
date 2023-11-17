import WorkspaceStates from '../../../../../../../enums/WorkspaceState.enum';
import ContactsAPI from '../api/ContactsAPI';

const state = {
  selectedContact: {},
  listContact: [],
};

const actions = {
  LOAD_CONTACT: async (context, contact) => {
    context.commit('SET_CONTACT', contact);
  },
  LOAD_LIST_CONTACTS: async (context, list) => {
    context.commit('SET_LIST_CONTACTS', list);
  },
};

const mutations = {
  SET_CONTACT: (state, contact) => {
    state.selectedContact = contact;
  },
  SET_LIST_CONTACTS: (state, list) => {
    state.listContact = list;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
