export const getChatPreviewName = (chat) => {
	if (chat?.members?.length) {
		return chat.members.map((member) => member.name).join(', ');
	}

	return chat?.title || 'unknown';
};
