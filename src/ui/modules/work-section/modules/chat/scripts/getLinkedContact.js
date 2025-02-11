import ContactsAPI
  from '../../../../../../app/api/agent-workspace/endpoints/contacts/ContactsAPI.js';


async function getContactByUserId(task) {
  try {
    if (!task || !task?.members?.length) return null;

    const { items: contacts } = await ContactsAPI.getList({
      q: task?.members[0].user_id,
      qin:'imclients{user{id}}'
    });

    return contacts[0];

  } catch (error) {
    console.log('SCRIPT getLinkedContact: Can`t get contact by User Id. Error:', error);
  }
}

export const getLinkedContact = async (task, openContact) => {

  if (openContact?.contact) return openContact?.contact;

  else return await getContactByUserId(task);

}
