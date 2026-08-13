import { ContactsAPI } from '@webitel/api-services/api';

async function getContactByUserId(task) {
	try {
		if (!task || !task?.members?.length) return null;
		// without user_id the query loses its filter and returns a random contact
		if (!task.members[0].user_id) return null;

		const { items: contacts } = await ContactsAPI.getList({
			q: task?.members[0].user_id,
			qin: 'imclients{user{id}}',
		});

		return contacts[0];
	} catch (error) {
		throw Error(`Can't get contact by User Id. ${error}`);
	}
}

export const getLinkedContact = async (task, openContact) => {
	if (task?.contact?.id && task?.contact?.name) return task.contact;

	if (openContact?.contact) return openContact?.contact;

	const linkedContact = await getContactByUserId(task);
	return linkedContact;
};
