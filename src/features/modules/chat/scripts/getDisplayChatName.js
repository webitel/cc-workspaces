export default function getDisplayChatName({ chat, contact, userId }) {
	// @author @Lera24
	// https://webitel.atlassian.net/browse/WTEL-9570?focusedCommentId=755185

	const filteredMembers = chat?.members
		? [
				...chat.members,
			]
		: [];
	// we don't show the current user if the chat is without a transfer
	// and show all subsequent times if there was a transfer.
	const firstMatchIndex = filteredMembers.findIndex(
		(member) => Number(member?.user_id) === Number(userId),
	);
	if (firstMatchIndex > -1) filteredMembers.splice(firstMatchIndex, 1);

	const memberNames = filteredMembers.map((member) => member?.name);

	if (contact?.id) {
		if (filteredMembers.length <= 1) return contact.name;

		return [
			contact.name,
			// contact identified - we display the contact, not the client's name from the members
			...memberNames.slice(1),
		].join(', ');
	}

	if (memberNames.length) return memberNames.join(', ');

	if (chat?.title) return chat.title;

	return 'unknown';
}
