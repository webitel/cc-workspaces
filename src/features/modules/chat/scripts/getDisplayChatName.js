// @author @Lera24
// https://webitel.atlassian.net/browse/WTEL-9570?focusedCommentId=755185

const getMembersWithoutCurrentAgent = ({ chat, userId }) => {
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
	const value = getMembersWithoutCurrentAgent({
		chat,
		userId,
	});
	// when contact is identified in other chat participants, then we should output everyone except contact.
	// if the contact is not identified, then output everyone
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
