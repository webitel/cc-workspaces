import ContactsAPI from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/ContactsAPI';
import ConfigurationsAPI
  from '@webitel/ui-sdk/src/api/clients/configurations/configurations.js';
import { EngineSystemSettingName } from 'webitel-sdk';

const state = {
  contact: null, // this is actual contact, linked to the task
  isLoading: false,
  contactsByDestination: [], // contacts, loaded by initial search by destination (number, email, etc.)
  contactsBySearch: [], // contacts, loaded by user manual search
};

const getters = {};

const actions = {
  LOAD_CONTACTS_BY_DESTINATION: async (context, task) => {
    const number = task.displayNumber; // for CALLS
    const searchParams = { q: number, qin: 'emails,phones', size: 5000 }; // load all
    try {
      context.commit('SET_IS_LOADING', true);
      const { data: contacts } = await ContactsAPI.getList(searchParams);

      if (contacts.length === 1) {
        return context.dispatch('LINK_CONTACT', contacts[0]);
      }

      context.commit('SET_CONTACTS_BY_DESTINATION', contacts);
    } finally {
      context.commit('SET_IS_LOADING', false);
    }
  },
  SEARCH_CONTACTS: async (context, searchParams) => {
    try {
      context.commit('SET_IS_LOADING', true);
      const {data: contacts} = await ContactsAPI.getList(searchParams);
      context.commit('SET_CONTACTS_BY_SEARCH', contacts);
    } finally {
      context.commit('SET_IS_LOADING', false);
    }
  },
  LOAD_CHAT_CONTACT: async (context, { id }) => {
    try {
      context.commit('SET_IS_LOADING', true);
      const { data: contacts } = await ContactsAPI.getList({ q: id, qin:'imclients' });
      context.commit('SET_CONTACT', contacts.length ? contacts[0] : null);
    } finally {
      context.commit('SET_IS_LOADING', false);
    }
  },
  CLEAN_CONTACTS_BY_SEARCH: async (context) => {
    context.commit('SET_CONTACTS_BY_SEARCH', []);
  },
  LOAD_CONTACT: async (context, contactId) => {
    try {
      context.commit('SET_IS_LOADING', true);
      const contact = await ContactsAPI.get({ contactId });
      context.commit('SET_CONTACT', contact);
      context.commit('SET_CONTACTS_BY_SEARCH', []);
      context.dispatch('CLEAN_CONTACTS_BY_SEARCH', []);
    } finally {
      context.commit('SET_IS_LOADING', false);
    }
  },
  LINK_CONTACT: async (context, contact) => {
    const task = context.rootGetters['workspace/TASK_ON_WORKSPACE'];
    return task.setContact(Number(contact.id));
  },
  ADD_CONTACT: async (context, draft) => {
    try {
      context.commit('SET_IS_LOADING', true);
      const newContact = await ContactsAPI.add({ itemInstance: draft });
      context.dispatch('LINK_CONTACT', newContact);
    } finally {
      context.commit('SET_IS_LOADING', false);
    }
  },
  CHECK_AUTO_LINK_CALL_TO_CONTACT: async () => {
    const response = await ConfigurationsAPI.getList({ name: EngineSystemSettingName.AutolinkCallToContact });
    return response.items[0]?.value;
  },
  INITIALIZE_CONTACT: async (context) => {
    const isCallWorkspace = context.rootGetters['workspace/IS_CALL_WORKSPACE'];
    const isChatWorkspace = context.rootGetters['workspace/IS_CHAT_WORKSPACE'];
    const task = context.rootGetters['workspace/TASK_ON_WORKSPACE'];

    if (isChatWorkspace) {
      return context.dispatch('LOAD_CHAT_CONTACT', { id: task.members[0].user_id });
    }

    if(isCallWorkspace) {
      if (task.contact.id) {
        return context.dispatch('LOAD_CONTACT', task.contact.id);
      } else {
        context.commit('SET_CONTACT', null);

        const autoLink = await context.dispatch('CHECK_AUTO_LINK_CALL_TO_CONTACT');
        if (autoLink) return;

        return context.dispatch('LOAD_CONTACTS_BY_DESTINATION', task);
      }
    }
  },
};

const mutations = {
  SET_IS_LOADING: (state, value) => {
    state.isLoading = value;
  },
  SET_CONTACT: (state, contact) => {
    state.contact = contact;
  },
  SET_CONTACTS_BY_DESTINATION: (state, contacts) => {
    state.contactsByDestination = contacts;
  },
  SET_CONTACTS_BY_SEARCH: (state, contacts) => {
    state.contactsBySearch = contacts;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
