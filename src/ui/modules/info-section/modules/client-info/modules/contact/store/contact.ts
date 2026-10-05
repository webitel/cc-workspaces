import { ContactsAPI, EmailsAPI, PhonesAPI } from '@webitel/api-services/api';
import { applyTransform, notify } from '@webitel/api-services/api/transformers';
import type { WebitelContactsContact } from '@webitel/api-services/gen/models';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

import { ContactPath } from '../enums/ContactPath';

const getContactIdFromEntity = (entity: any) => {
	const id = entity?.contact?.id ?? entity?.contactId;
	return id != null ? Number(id) : null;
};

const resolveTaskContactId = (task: any, callList: any[] = []) => {
	if (!task) return null;

	const directContactId = getContactIdFromEntity(task);
	if (directContactId) return directContactId;

	if (!task.bridgedId) return null;

	const bridgedCall = callList.find((call) => call.id === task.bridgedId);
	return getContactIdFromEntity(bridgedCall);
};

export const useContactStore = defineStore('ui/infoSec/client/contact', () => {
	const vuexStore = useStore();

	// this is the actual contact, linked to the task
	const contact = ref<WebitelContactsContact | null>(null);
	const isLoading = ref(false);
	// contacts, loaded by initial search by destination (number, email, etc.)
	const contactsByDestination = ref<WebitelContactsContact[]>([]);
	// contacts, loaded by user manual search
	const contactsBySearch = ref<WebitelContactsContact[]>([]);
	// access variable for contact card page in read only mode
	const showFullContact = ref(false);

	const contactLink = computed(() => (id: string | number) => {
		const contactPath = !showFullContact.value
			? ContactPath.ReadOnlyContact
			: ContactPath.FullContact;
		return `${import.meta.env.VITE_CRM_URL}/${contactPath}/${id}`;
	});

	const readOnlyContactLink = computed(
		() => (id: string | number) =>
			`${import.meta.env.VITE_CRM_URL}/${ContactPath.ReadOnlyContact}/${id}`,
	);

	function initShowFullContactState(value: boolean) {
		showFullContact.value = value;
	}

	async function loadContactsByDestination(task: any) {
		const isCallWorkspace = vuexStore.getters['workspace/IS_CALL_WORKSPACE'];
		const number = task.displayNumber; // for CALLS
		if (!number || task.hideNumber) return; // no destination number, then skip contacts loading https://webitel.atlassian.net/browse/DEV-6576?focusedCommentId=759329
		const qin = isCallWorkspace ? 'phones' : 'emails,phones'; // for calls search contacts just by phones https://webitel.atlassian.net/browse/WTEL-7041
		const searchParams = {
			q: number,
			qin,
			size: 100,
		}; // load only 100 (should be enough) // https://webitel.atlassian.net/browse/WTEL-7906
		let linkedContact = false;
		try {
			isLoading.value = true;
			const { items: contacts } = await ContactsAPI.getList(searchParams);

			if (contacts.length === 1) {
				//@author PolinaSukhorukova-webitel
				//isLoading is intentionally not reset here —
				//responsibility is passed to loadContact, which is triggered
				//by the watcher in the-contact.vue after contactId updated.
				//loadContact will reset isLoading in its own finally block.
				linkedContact = true;
				await linkContact(contacts[0]);
				return;
			}

			contactsByDestination.value = contacts;
		} finally {
			if (!linkedContact) {
				isLoading.value = false;
			}
		}
	}

	async function searchContacts(searchParams: any) {
		try {
			isLoading.value = true;
			const { items: contacts } = await ContactsAPI.getList(searchParams);
			contactsBySearch.value = contacts;
		} finally {
			isLoading.value = false;
		}
	}

	async function loadChatContact({ id }: { id: string | number }) {
		try {
			isLoading.value = true;
			// https://webitel.atlassian.net/browse/WTEL-4985
			const { items: contacts } = await ContactsAPI.getList({
				q: id,
				qin: 'imclients{user{id}}',
			});
			contact.value = contacts?.length ? contacts[0] : null;
		} finally {
			isLoading.value = false;
		}
	}

	function cleanContactsBySearch() {
		contactsBySearch.value = [];
	}

	async function loadContact(contactId: string | number) {
		try {
			isLoading.value = true;
			contact.value = await ContactsAPI.get({
				itemId: contactId,
			});
			contactsBySearch.value = [];
		} finally {
			isLoading.value = false;
		}
	}

	async function linkContact(contactToLink: WebitelContactsContact) {
		const task = vuexStore.getters['workspace/TASK_ON_WORKSPACE'];
		return task.setContact(Number(contactToLink.id));
	}

	async function addContact(draft: any) {
		try {
			isLoading.value = true;
			const newContact = await ContactsAPI.add({
				itemInstance: draft,
			});
			await linkContact(newContact);
		} finally {
			isLoading.value = false;
		}
	}

	async function initializeContact() {
		const alreadyLoaded = ({
			contactId,
			userId,
		}: {
			contactId?: string | number;
			userId?: string | number;
		}) => {
			// see https://webitel.atlassian.net/browse/DEV-6576?focusedCommentId=759329
			if (contactId) {
				return contact.value?.id === contactId;
			}
			if (userId) {
				return contact.value?.user?.id === userId;
			}
			return false;
		};

		const isCallWorkspace = vuexStore.getters['workspace/IS_CALL_WORKSPACE'];
		const isChatWorkspace = vuexStore.getters['workspace/IS_CHAT_WORKSPACE'];
		const task = vuexStore.getters['workspace/TASK_ON_WORKSPACE'];

		if (isChatWorkspace) {
			if (contactsByDestination.value) {
				contactsByDestination.value = [];
			}
			if (
				!alreadyLoaded({
					userId: task.members[0].user_id,
				})
			) {
				return loadChatContact({
					id: task.members[0].user_id,
				});
			}
		}

		if (isCallWorkspace) {
			const callList = vuexStore.state.features?.call?.callList || [];
			const contactId = resolveTaskContactId(task, callList);

			if (
				contactId &&
				!alreadyLoaded({
					contactId,
				})
			) {
				return loadContact(contactId);
			} else {
				contact.value = null;

				return loadContactsByDestination(task);
			}
		}
	}

	function resetContact() {
		contact.value = null;
	}

	async function addNumberToContact(phoneData: any) {
		if (!contact.value) return;

		try {
			const resp = await PhonesAPI.merge({
				contactId: contact.value.id,
				phones: [
					phoneData,
				],
				params: {},
				options: {},
			});

			if (contact.value.phones) {
				contact.value.phones.data = [
					...(contact.value.phones.data || []),
					...resp.data,
				];
			}
		} catch (err) {
			throw applyTransform(err, [
				notify,
			]);
		}
	}

	async function addEmailToContact(emailData: any) {
		if (!contact.value) return;

		try {
			const newEmail = await EmailsAPI.add({
				parentId: contact.value.id,
				itemInstance: emailData,
			});

			if (contact.value.emails) {
				contact.value.emails.data = [
					...(contact.value.emails.data || []),
					newEmail,
				];
			}
		} catch (err) {
			throw applyTransform(err, [
				notify,
			]);
		}
	}

	return {
		contact,
		isLoading,
		contactsByDestination,
		contactsBySearch,
		showFullContact,

		contactLink,
		readOnlyContactLink,

		initShowFullContactState,
		loadContactsByDestination,
		searchContacts,
		loadChatContact,
		cleanContactsBySearch,
		loadContact,
		linkContact,
		addContact,
		initializeContact,
		resetContact,
		addNumberToContact,
		addEmailToContact,
	};
});
