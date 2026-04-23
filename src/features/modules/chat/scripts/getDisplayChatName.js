export default function getDisplayChatName({ chat, contact }) {
	if (chat?.members?.length) {
		return chat.members.map((m) => m.name).join(', ');
	}

	if (contact?.id) return contact.name;

	if (chat?.title) return chat.title;

	return 'unknown';
}
