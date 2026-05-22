// @author @Lera24
// https://webitel.atlassian.net/browse/WTEL-9570?focusedCommentId=755185

const getMembersWithoutAgent = ({ chat, userId }) => {
	// we don't show the current user
	const filteredMembers = chat?.members
		? [
				...chat.members,
			]
		: [];
	const firstMatchIndex = filteredMembers.findIndex(
		(member) => Number(member?.user_id) === Number(userId),
	);
	if (firstMatchIndex > -1) filteredMembers.splice(firstMatchIndex, 1);
	return filteredMembers.map((member) => member?.name);
};

const getExtraNames = ({ chat, contact, userId }) => {
	const value = getMembersWithoutAgent({
		chat,
		userId,
	});
	// If a contact is identified, but you need to exclude his name coming from the messenger
	return contact?.id ? value.slice(1) : value;
};

export default function getDisplayChatName({ chat, contact, userId }) {
	let fullName;

	const extraNames = getExtraNames({
		chat,
		contact,
		userId,
	});

	if (contact?.id) {
		if (!extraNames.length) {
			fullName = contact?.name;
		}
		fullName = [
			contact.name,
			...extraNames,
		].join(', ');
	} else if (!contact?.id && extraNames.length) {
		fullName = extraNames.join(', ');
	} else if (chat?.title) {
		fullName = chat.title;
	} else fullName = 'unknown';

	return {
		contactName: contact?.name ?? null,
		extraNames: extraNames.join(', '),
		fullName,
	};
}
