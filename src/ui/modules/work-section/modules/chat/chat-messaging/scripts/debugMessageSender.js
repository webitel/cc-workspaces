import { AgentTypes } from '../../../../../../../features/modules/chat/enums/AgentTypes.enum';

// tmp debug: чий кожен меседж середньої панелі
const getSender = (message) => {
	const isInternal = message.member?.type === AgentTypes.WEBITEL;
	const isBot =
		message.member?.type === AgentTypes.BOT ||
		(!message.member?.type && !message.channelId) ||
		message.variables?.from === AgentTypes.BOT;

	if (isBot) return 'bot';
	if (message.member?.self) return 'me';
	if (isInternal) return 'transfer';
	return 'client';
};

// яке ім'я реально підставить chat-message.vue під аватар
const getNameFrom = (sender) => {
	if (sender === 'transfer') return 'member.name';
	if (sender === 'me' || sender === 'bot') return 'userinfo.chatName';
	return 'props.username';
};

export const debugMessageSender = (groups) => {
	const rows = Object.entries(groups).flatMap(([from, messages = []]) =>
		messages.map((message) => {
			const sender = getSender(message);

			return {
				from,
				sender,
				side: sender === 'client' ? 'left' : 'right',
				text: (message.text || message.file?.name || '').slice(0, 24),
				'member.type': message.member?.type,
				'member.self': message.member?.self,
				'member.name': message.member?.name,
				channelId: message.channelId,
				'variables.from': message.variables?.from,
				nameFrom: getNameFrom(sender),
			};
		}),
	);

	console.groupCollapsed(`[sender] ${rows.length} msg`);
	console.table(rows);
	console.groupEnd();
};
