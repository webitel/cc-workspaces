import { Conversation } from 'webitel-sdk';

const normalizedMember = (member) => {
	if (!member) return null;

	return {
		...member,
		// TODO: для клода: у нас є тайпскріпт тип мембера, а також метод в ui-chats, який перероблює мембера
		id: member.id,
		name: member.peer?.name,
		type: member.peer?.type,
		user_id: member.peer?.id,
	};
};
const normalizedMessage = (message = {}) => {
	return {
		...message,
		// TODO: для клода: у нас є тайпскріпт тип повідомлення, а також метод в ui-chats, який вірно його перероблює
		id: Number(message.id),
		channel_id: message.sender?.id || message.chat?.id,
		type: message.kind || 'text',
		text: message.text,
		file: message.file,
		created_at: Number(message.date),
		conversation: message.chat?.id,
	};
};

/**
 * create instance Conversation from REST-dialog
 *
 * agent chanel get from members: agent members id - channelId,

 */
export const buildConversationFromDialog = ({ client, dialog }) => {
	const { user_id: userId } = client.sessionInfo();

	const currentAgent = normalizedMember(
		dialog.members?.find(
			(member) => Number(member.peer?.id) === Number(userId),
		),
	);

	// avoid dialog without current agent in members
	if (!currentAgent) return null;

	// the backend also returns the conversation itself among `members`
	// (its `member.id === dialog.id`). WS chats have no such member — drop it,
	// otherwise it takes over the client name (getClientName) and the messenger
	// icon (both read from members[0])
	const members = dialog.members
		?.filter(
			(member) => member.id !== dialog.id && member.id !== currentAgent.id,
		)
		?.map((member) => normalizedMember(member));

	const conversation = new Conversation(
		client,
		dialog.id,
		dialog.title,
		members,
		dialog.message // last message; the constructor expects an array
			? [
					normalizedMessage(dialog.message),
				]
			: [],
		dialog.context,
	);
	// conversation.id value takes from channelId (after setAnswered()) or conversationId (without setAnswered)

	conversation.createdAt = Number(dialog.started) || Number(dialog.date) || 0;
	conversation.closedAt = Number(dialog.closed) || 0;

	// agent channelId is his member.id; without it chat actions are disabled
	if (currentAgent.join) {
		conversation.setAnswered(
			currentAgent.id,
			Number(currentAgent.join) || conversation.createdAt,
			currentAgent,
		);
	}

	console.log(
		'buildConversation' + 'dialog before:',
		dialog,
		'' + 'members:',
		members,
		'' + 'currentAgent:',
		currentAgent,
		'' + 'conversation:',
		conversation,
	);

	return conversation;
};
