import ContactsAPI from '../contact/api/ContactsAPI';

const state = {
  contact: null, // this is actual contact, linked to the task
  contactsByDestination: [], // contacts, loaded by initial search by destination (number, email, etc.)
  contactsBySearch: [], // contacts, loaded by user manual search
};

const getters = {};

const actions = {
  LOAD_CONTACTS_BY_DESTINATION: async (context, task) => {
    const number = task.from.number; // for CALLS
    const searchParams = { q: number, qin: 'emails,phones', size: 5000 }; // load all
    const contacts = await ContactsAPI.getList(searchParams);
    context.commit('SET_CONTACTS_BY_DESTINATION', contacts);
  },
  SEARCH_CONTACTS: async (context, searchParams) => {
    const contacts = await ContactsAPI.getList(searchParams);
    context.commit('SET_CONTACTS_BY_SEARCH', contacts);
  },
  LOAD_CONTACT: async (context, contactId) => {
    const contact = await ContactsAPI.get({ contactId });
    context.commit('SET_CONTACT', contact);
  },
  LINK_CONTACT: async (context, contact) => {
    const task = context.getters['workspace/TASK_ON_WORKSPACE'];
    await new Promise(async (resolve, reject) => {
      await task.setContact(contact.id);
      const { contactId } = task;
      contactId ? resolve(contactId) : reject();
    });
    return context.dispatch('LOAD_CONTACT', task.contactId);
  },
  ADD_CONTACT: async (context, draft) => {
    const newContact = await ContactsAPI.add({ itemInstance: draft });
    return context.dispatch('LINK_CONTACT', newContact);
  },
  INITIALIZE_CONTACT: async (context) => {
    const task = context.getters['workspace/TASK_ON_WORKSPACE'];
    if (task.contactId) {
      return context.dispatch('LOAD_CONTACT', task.contactId);
    } else {
      return context.dispatch('LOAD_CONTACTS_BY_DESTINATION', task);
    }
  },
};

const mutations = {
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

// export default {
//   namespaced: true,
//   state,
//   getters,
//   actions,
//   mutations,
// };
