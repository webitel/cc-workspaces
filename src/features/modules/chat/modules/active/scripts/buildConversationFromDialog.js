import { Conversation } from 'webitel-sdk';
import { AgentTypes } from '../../../enums/AgentTypes.enum';
import { formatChatMessages } from '../../../scripts/formatChatMessages.js';

const normalizedMember = (member) => {
	if (!member) return null;

	const isAgent = member.peer?.type === AgentTypes.USER;

	return {
		id: member.id,
		name: member.peer?.name,
		// ws agents come as 'webitel', rest as 'user'
		type: isAgent ? AgentTypes.WEBITEL : member.peer?.type,
		// client peer.id is the messenger external id, not user_id
		user_id: isAgent ? Number(member.peer?.id) : undefined,
		external_id: isAgent ? undefined : member.peer?.id,
		via: member.via,
	};
};

/**
 * create instance Conversation from REST-dialog
 *
 * agent chanel get from members: agent members id - channelId,

 */
export const buildConversationFromDialog = ({ client, dialog }) => {
	const { user_id: userId } = client.sessionInfo();

	// raw rest member: join/id needed below, shape converted only for sdk
	const currentAgent = dialog.members?.find(
		(member) => Number(member.peer?.id) === Number(userId),
	);

	if (!currentAgent) return null;

	// the backend also returns the conversation itself among `members`
	// (its `member.id === dialog.id`). WS chats have no such member — drop it,
	// otherwise it takes over the client name (getClientName) and the messenger
	// icon (both read from members[0])
	const members = dialog.members
		?.filter(
			(member) =>
				member.id !== dialog.id &&
				member.id !== currentAgent.id &&
				member.peer?.type !== 'bot',
		)
		?.map((member) => normalizedMember(member));

	const conversation = new Conversation(
		client,
		dialog.id,
		dialog.title,
		members,
		dialog.message // last message; the constructor expects an array
			? formatChatMessages([
					dialog.message,
				])
			: [],
		dialog.context,
	);

	// rest dialogs has only the last message^ so we need to use useMissingChatMessages
	conversation.hasMissingMessages = true;

	conversation.createdAt = Number(dialog.started) || Number(dialog.date) || 0;
	conversation.closedAt = Number(dialog.closed) || 0;
	conversation.queue = dialog.queue;

	// agent channelId is his member.id; without it chat actions are disabled
	if (currentAgent.join) {
		conversation.setAnswered(
			currentAgent.id,
			Number(currentAgent.join) || conversation.createdAt,
			normalizedMember(currentAgent),
		);
	}

	return conversation;
};
