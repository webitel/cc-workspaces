import { PhonesAPI, EmailsAPI, ContactsAPI } from '@webitel/api-services/api';
import applyTransform, {
	notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { ContactPath } from '../enums/ContactPath.ts';

const state = {
	contact: null, // this is actual contact, linked to the task
	isLoading: false,
	contactsByDestination: [], // contacts, loaded by initial search by destination (number, email, etc.)
	contactsBySearch: [], // contacts, loaded by user manual search
	showFullContact: false, // access variable for contact card page in read only mode
};

const getters = {
	CONTACT_LINK: (state) => (id) => {
		const contactPath = !state.showFullContact
			? ContactPath.ReadOnlyContact
			: ContactPath.FullContact;
		return `${import.meta.env.VITE_CRM_URL}/${contactPath}/${id}`;
	}, // pass arguments to getter for different contents of usage
	READ_ONLY_CONTACT_LINK: (state) => (id) => {
		return `${import.meta.env.VITE_CRM_URL}/${ContactPath.ReadOnlyContact}/${id}`;
	},
};

const getContactIdFromEntity = (entity) => {
	const id = entity?.contact?.id ?? entity?.contactId;
	return id != null ? Number(id) : null;
};

const resolveTaskContactId = (task, callList = []) => {
	if (!task) return null;

	const directContactId = getContactIdFromEntity(task);
	if (directContactId) return directContactId;

	if (!task.bridgedId) return null;

	const bridgedCall = callList.find((call) => call.id === task.bridgedId);
	return getContactIdFromEntity(bridgedCall);
};

const actions = {
	INIT_SHOW_FULL_CONTACT_STATE: async (context, value) => {
		context.commit('SET_SHOW_FULL_CONTACT', value);
	},
	LOAD_CONTACTS_BY_DESTINATION: async (context, task) => {
		const isCallWorkspace = context.rootGetters['workspace/IS_CALL_WORKSPACE'];
		const number = task.displayNumber; // for CALLS
		const qin = isCallWorkspace ? 'phones' : 'emails,phones'; // for calls search contacts just by phones https://webitel.atlassian.net/browse/WTEL-7041
		const searchParams = {
			q: number,
			qin,
			size: 100,
		}; // load only 100 (should be enough) // https://webitel.atlassian.net/browse/WTEL-7906
		try {
			context.commit('SET_IS_LOADING', true);
			const { items: contacts } = await ContactsAPI.getList(searchParams);

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
			const { items: contacts } = await ContactsAPI.getList(searchParams);
			context.commit('SET_CONTACTS_BY_SEARCH', contacts);
		} finally {
			context.commit('SET_IS_LOADING', false);
		}
	},
	LOAD_CHAT_CONTACT: async (context, { id }) => {
		try {
			context.commit('SET_IS_LOADING', true);
			// https://webitel.atlassian.net/browse/WTEL-4985
			const { items: contacts } = await ContactsAPI.getList({
				q: id,
				qin: 'imclients{user{id}}',
			});
			context.commit('SET_CONTACT', contacts?.length ? contacts[0] : null);
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
			const contact = await ContactsAPI.get({
				itemId: contactId,
			});
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
			const newContact = await ContactsAPI.add({
				itemInstance: draft,
			});
			context.dispatch('LINK_CONTACT', newContact);
		} finally {
			context.commit('SET_IS_LOADING', false);
		}
	},
	INITIALIZE_CONTACT: async (context) => {
		const isCallWorkspace = context.rootGetters['workspace/IS_CALL_WORKSPACE'];
		const isChatWorkspace = context.rootGetters['workspace/IS_CHAT_WORKSPACE'];
		const task = context.rootGetters['workspace/TASK_ON_WORKSPACE'];

		if (isChatWorkspace) {
			if (state.contactsByDestination)
				context.commit('SET_CONTACTS_BY_DESTINATION', []);
			return context.dispatch('LOAD_CHAT_CONTACT', {
				id: task.members[0].user_id,
			});
		}

		if (isCallWorkspace) {
			const callList = context.rootState.features?.call?.callList || [];
			const contactId = resolveTaskContactId(task, callList);

			if (contactId) {
				return context.dispatch('LOAD_CONTACT', contactId);
			} else {
				context.commit('SET_CONTACT', null);

				return context.dispatch('LOAD_CONTACTS_BY_DESTINATION', task);
			}
		}
	},
	RESET_CONTACT: (context) => {
		context.commit('SET_CONTACT', null);
	},

	ADD_NUMBER_TO_CONTACT: async (context, phoneData) => {
		try {
			const resp = await PhonesAPI.merge({
				contactId: state.contact.id,
				phones: [
					phoneData,
				],
			});

			return context.commit('SET_NUMBER_TO_CONTACT', resp.data);
		} catch (err) {
			throw applyTransform(err, [
				notify,
			]);
		}
	},
	ADD_EMAIL_TO_CONTACT: async (context, emailData) => {
		try {
			const resp = await EmailsAPI.add({
				contactId: state.contact.id,
				emails: [
					emailData,
				],
			});

			return context.commit('SET_EMAIL_TO_CONTACT', resp.data);
		} catch (err) {
			throw applyTransform(err, [
				notify,
			]);
		}
	},
};

const mutations = {
	SET_SHOW_FULL_CONTACT: (state, value) => {
		state.showFullContact = value;
	},
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
	SET_NUMBER_TO_CONTACT: (state, phoneData) => {
		state.contact.phones.push(...phoneData);
	},
	SET_EMAIL_TO_CONTACT: (state, emailData) => {
		state.contact.emails.push(...emailData);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
