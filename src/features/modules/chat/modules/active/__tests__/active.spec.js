import activeModule from '../store/active';

const makeContext = ({ chats, visibleChatIds }) => ({
	state: {
		visibleChatIds,
	},
	rootState: {
		client: {
			state: 'connected',
			getClientSync: () => ({
				allConversations: () => chats,
			}),
		},
	},
	commit: vi.fn(),
});

describe('features/chat/active store: REMOVE_CHAT', () => {
	const oldLeg = {
		conversationId: 'conv-1',
		closedAt: 1,
	};
	const newInvite = {
		conversationId: 'conv-1',
		closedAt: 0,
	};

	it('keeps the chat visible while a new invite of the same conversation is active', () => {
		const context = makeContext({
			chats: [
				oldLeg,
				newInvite,
			],
			visibleChatIds: [
				'conv-1',
			],
		});
		activeModule.actions.REMOVE_CHAT(context, oldLeg);
		expect(context.commit).not.toHaveBeenCalled();
	});

	it('removes the chat when nothing of the conversation is active', () => {
		const context = makeContext({
			chats: [
				oldLeg,
			],
			visibleChatIds: [
				'conv-1',
				'conv-2',
			],
		});
		activeModule.actions.REMOVE_CHAT(context, oldLeg);
		expect(context.commit).toHaveBeenCalledWith('SET_VISIBLE_CHAT_IDS', [
			'conv-2',
		]);
	});
});
