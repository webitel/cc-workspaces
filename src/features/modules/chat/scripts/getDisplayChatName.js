// @author @Lera24
// https://webitel.atlassian.net/browse/WTEL-9570?focusedCommentId=755185

import { ConversationState } from 'webitel-sdk';

const getMembersWithoutCurrentAgent = ({ chat, userId }) => {
	const filteredMembers = chat?.members
		? [
				...chat.members,
			]
		: [];
	if (chat.state === ConversationState.Invite)
		return chat.members.map((member) => member?.name);

	const lastMatchIndex = filteredMembers.findLastIndex(
		(member) => Number(member?.user_id) === Number(userId),
	);
	if (lastMatchIndex > -1) filteredMembers.splice(lastMatchIndex, 1);
	return filteredMembers.map((member) => member?.name);
};

const getExtraNames = ({ chat, contact, userId }) => {
	const value = getMembersWithoutCurrentAgent({
		chat,
		userId,
	});

	if (!value.length && !contact?.id) {
		return chat?.title
			? [
					chat.title,
				]
			: [];
	}
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
