import { ContactsAPI } from '@webitel/api-services/api';

async function getContactByUserId(task) {
	try {
		if (!task || !task?.members?.length) return null;

		const { items: contacts } = await ContactsAPI.getList({
			q: task?.members[0].user_id,
			qin: 'imclients{user{id}}',
		});

		const contact = contacts[0];
		if (!contact) return contact;

		// consumers (e.g. ChatContact) expect a flat `name` string, while
		// ContactsAPI now returns the raw `{ commonName }` shape
		return {
			...contact,
			name: contact.name?.commonName,
		};
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
