import ContactsAPI from '../../../../../../../../app/api/agent-workspace/endpoints/contacts/ContactsAPI';

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
    function addPlus(number) {
      if (!number.startsWith('+')) {
        return `+${number}`;
      }
      return number;
    }
    function removePlus(number) {
      if (number.startsWith('+')) {
        return number.slice(1);
      }
      return number;
    }
    const searchParams = { q: number, qin: 'emails,phones', size: 5000 }; // load all
    try {
      context.commit('SET_IS_LOADING', true);
      const { data: contacts } = await ContactsAPI.getList(searchParams);
      if (contacts.length === 0) {
        // try to search without '+'
        const numberWithoutPlus = removePlus(number);
        const searchParamsWithoutPlus = { q: numberWithoutPlus, qin: 'emails,phones', size: 5000 }; // load all
        const { data: contactsWithoutPlus } = await ContactsAPI.getList(searchParamsWithoutPlus);
        if (contactsWithoutPlus.length === 0) {
          // try to search with '+'
          const numberWithPlus = addPlus(number);
          const searchParamsWithPlus = { q: numberWithPlus, qin: 'emails,phones', size: 5000 }; // load all
          const { data: contactsWithPlus } = await ContactsAPI.getList(searchParamsWithPlus);
          if (contactsWithPlus.length === 0) {
            return;
          }
          return context.dispatch('LINK_CONTACT', contactsWithPlus[0]);
        }

        return context.dispatch('LINK_CONTACT', contactsWithoutPlus[0]);
      }


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
  INITIALIZE_CONTACT: async (context) => {
    const task = context.rootGetters['workspace/TASK_ON_WORKSPACE'];
    if (task.contact.id) {
      return context.dispatch('LOAD_CONTACT', task.contact.id);
    } else {
      context.commit('SET_CONTACT', null);
      return context.dispatch('LOAD_CONTACTS_BY_DESTINATION', task);
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
