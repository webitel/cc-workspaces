import unseenModule from '../unseen.js';

const { getters, mutations, actions } = unseenModule;

describe('features/chat/unseen store', () => {
	const chat = {
		conversationId: 'conv-1',
	};

	let state;

	beforeEach(() => {
		state = {
			unseenChatIds: {},
		};
	});

	it('IS_CHAT_UNSEEN is false and UNSEEN_COUNT is 0 for a chat with no unseen messages', () => {
		expect(getters.IS_CHAT_UNSEEN(state)(chat)).toBe(false);
		expect(getters.UNSEEN_COUNT(state)(chat)).toBe(0);
	});

	it('ADD_UNSEEN_CHAT accumulates a count per chat', () => {
		mutations.ADD_UNSEEN_CHAT(state, chat);
		mutations.ADD_UNSEEN_CHAT(state, chat);
		mutations.ADD_UNSEEN_CHAT(state, chat);

		expect(getters.UNSEEN_COUNT(state)(chat)).toBe(3);
		expect(getters.IS_CHAT_UNSEEN(state)(chat)).toBe(true);
	});

	it('REMOVE_UNSEEN_CHAT resets the count back to 0', () => {
		mutations.ADD_UNSEEN_CHAT(state, chat);
		mutations.REMOVE_UNSEEN_CHAT(state, chat);

		expect(getters.UNSEEN_COUNT(state)(chat)).toBe(0);
		expect(getters.IS_CHAT_UNSEEN(state)(chat)).toBe(false);
	});

	it('MARK_CHAT_SEEN action commits REMOVE_UNSEEN_CHAT', () => {
		const context = {
			commit: vi.fn(),
		};

		actions.MARK_CHAT_SEEN(context, chat);

		expect(context.commit).toHaveBeenCalledWith('REMOVE_UNSEEN_CHAT', chat);
	});

	it('handles a null/undefined chat without throwing', () => {
		expect(getters.IS_CHAT_UNSEEN(state)(null)).toBe(false);
		expect(getters.UNSEEN_COUNT(state)(null)).toBe(0);
		expect(getters.UNSEEN_COUNT(state)(undefined)).toBe(0);

		expect(() => mutations.ADD_UNSEEN_CHAT(state, null)).not.toThrow();
		expect(() => mutations.REMOVE_UNSEEN_CHAT(state, null)).not.toThrow();
		expect(state.unseenChatIds).toEqual({});
	});

	it('keys by conversationId, falling back to id, so active and closed chats share a count', () => {
		mutations.ADD_UNSEEN_CHAT(state, {
			conversationId: 'conv-2',
		});
		mutations.ADD_UNSEEN_CHAT(state, {
			id: 'conv-2',
		});

		expect(
			getters.UNSEEN_COUNT(state)({
				conversationId: 'conv-2',
			}),
		).toBe(2);
	});
});
