import closedModule from '../closed';

describe('features/chat/closed store: actions', () => {
	let context;

	beforeEach(() => {
		context = {
			rootState: {
				features: {
					chat: {
						chatHistory: {
							next: false,
						},
					},
				},
			},
			dispatch: vi.fn().mockResolvedValue(undefined),
			commit: vi.fn(),
		};
	});

	describe('OPEN_CLOSED_CHAT', () => {
		it('dispatches LOAD_CLOSED_CHAT for a REST stub without an identified contact', async () => {
			const chat = {
				id: '1',
				closedAt: Date.now(),
			};
			await closedModule.actions.OPEN_CLOSED_CHAT(context, chat);
			expect(context.dispatch).toHaveBeenCalledWith('LOAD_CLOSED_CHAT', chat);
		});

		it('dispatches SET_WORKSPACE directly for a REST stub with an identified contact', async () => {
			const chat = {
				id: '1',
				closedAt: Date.now(),
				contact: {
					id: 'contact-1',
				},
			};
			await closedModule.actions.OPEN_CLOSED_CHAT(context, chat);
			expect(context.dispatch).toHaveBeenCalledWith(
				'features/chat/SET_WORKSPACE',
				chat,
				{
					root: true,
				},
			);
			expect(context.dispatch).not.toHaveBeenCalledWith(
				'LOAD_CLOSED_CHAT',
				expect.anything(),
			);
		});

		it('dispatches SET_WORKSPACE for a live SDK Conversation even when contact.id is unset (post-processing) [WTEL-9955]', async () => {
			// a live SDK Conversation instance, not a plain REST object
			class Conversation {
				get contact() {
					return {
						id: null,
					};
				}
			}
			const chat = Object.assign(new Conversation(), {
				id: 'channel-1',
				closedAt: Date.now(),
			});

			await closedModule.actions.OPEN_CLOSED_CHAT(context, chat);

			expect(context.dispatch).toHaveBeenCalledWith(
				'features/chat/SET_WORKSPACE',
				chat,
				{
					root: true,
				},
			);
			expect(context.dispatch).not.toHaveBeenCalledWith(
				'LOAD_CLOSED_CHAT',
				expect.anything(),
			);
		});
	});

	describe('LOAD_CLOSED_CHAT_HISTORY', () => {
		it('loads history for the given contactId (not chat.contact.id) and searches for the target chat', async () => {
			const chat = {
				id: 'channel-1',
				conversationId: 'conv-1',
				// chat.contact.id is null here on purpose: the action must rely on
				// the passed-in contactId instead, see WTEL-9955
				contact: {
					id: null,
				},
			};
			const contactId = 'contact-1';

			await closedModule.actions.LOAD_CLOSED_CHAT_HISTORY(context, {
				chat,
				contactId,
			});

			expect(context.dispatch).toHaveBeenCalledWith('RESET_CLOSED_CHAT');
			expect(context.dispatch).toHaveBeenCalledWith(
				'features/chat/chatHistory/LOAD_CHAT_HISTORY',
				contactId,
				{
					root: true,
				},
			);
			expect(context.dispatch).toHaveBeenCalledWith(
				'FIND_TARGET_CHAT_IN_HISTORY',
				{
					chat,
					contactId,
				},
			);
			expect(context.commit).toHaveBeenCalledWith(
				'SET_IS_CLOSED_CHAT_LOADED',
				true,
			);
		});

		it('still marks the closed chat as loaded when loading history fails', async () => {
			const err = new Error('network error');
			context.dispatch.mockImplementation((action) => {
				if (action === 'features/chat/chatHistory/LOAD_CHAT_HISTORY') {
					return Promise.reject(err);
				}
				return Promise.resolve();
			});

			await expect(
				closedModule.actions.LOAD_CLOSED_CHAT_HISTORY(context, {
					chat: {
						id: 'channel-1',
					},
					contactId: 'contact-1',
				}),
			).rejects.toBeTruthy();

			expect(context.commit).toHaveBeenCalledWith(
				'SET_IS_CLOSED_CHAT_LOADED',
				true,
			);
		});
	});

	describe('FIND_TARGET_CHAT_IN_HISTORY', () => {
		it('returns early without dispatching anything when there is no next history page', async () => {
			context.rootState.features.chat.chatHistory.next = false;
			const chat = {
				id: 'channel-1',
				conversationId: 'conv-1',
			};

			await closedModule.actions.FIND_TARGET_CHAT_IN_HISTORY(context, {
				chat,
				contactId: 'contact-1',
			});

			expect(context.dispatch).not.toHaveBeenCalled();
		});

		it('looks up the target message by conversationId, not by the live chat.id [WTEL-9955]', async () => {
			context.rootState.features.chat.chatHistory.next = true;
			// chat.id is the live channelId, which never appears as message.chat.id
			// in chatHistory data — conversationId does (see ContactChatMessagesAPI)
			const chat = {
				id: 'channel-1',
				conversationId: 'conv-1',
			};

			await closedModule.actions.FIND_TARGET_CHAT_IN_HISTORY(context, {
				chat,
				contactId: 'contact-1',
			});

			expect(context.dispatch).toHaveBeenCalledWith(
				'FIND_TARGET_CHAT_FIRST_MESSAGE',
				'conv-1',
			);
		});

		it('falls back to chat.id when conversationId is missing', async () => {
			context.rootState.features.chat.chatHistory.next = true;
			const chat = {
				id: 'channel-1',
			};

			await closedModule.actions.FIND_TARGET_CHAT_IN_HISTORY(context, {
				chat,
				contactId: 'contact-1',
			});

			expect(context.dispatch).toHaveBeenCalledWith(
				'FIND_TARGET_CHAT_FIRST_MESSAGE',
				'channel-1',
			);
		});

		it('commits the found message id and does not load another history page once the target chat is found', async () => {
			context.rootState.features.chat.chatHistory.next = true;
			const foundMessage = {
				id: 'message-1',
			};
			context.dispatch.mockImplementation((action) => {
				if (action === 'FIND_TARGET_CHAT_FIRST_MESSAGE') {
					return Promise.resolve(foundMessage);
				}
				return Promise.resolve();
			});

			await closedModule.actions.FIND_TARGET_CHAT_IN_HISTORY(context, {
				chat: {
					id: 'channel-1',
					conversationId: 'conv-1',
				},
				contactId: 'contact-1',
			});

			expect(context.commit).toHaveBeenCalledWith(
				'SET_CLOSED_CHAT_FIRST_MESSAGE_ID',
				foundMessage.id,
			);
			expect(context.dispatch).not.toHaveBeenCalledWith(
				'features/chat/chatHistory/LOAD_NEXT',
				expect.anything(),
				expect.anything(),
			);
		});

		it('loads the next history page and recurses with the same contactId when the target chat is not found yet', async () => {
			context.rootState.features.chat.chatHistory.next = true;
			context.dispatch.mockImplementation((action) => {
				if (action === 'FIND_TARGET_CHAT_FIRST_MESSAGE') {
					return Promise.resolve(undefined);
				}
				return Promise.resolve();
			});
			const chat = {
				id: 'channel-1',
				conversationId: 'conv-1',
			};
			const contactId = 'contact-1';

			await closedModule.actions.FIND_TARGET_CHAT_IN_HISTORY(context, {
				chat,
				contactId,
			});

			expect(context.dispatch).toHaveBeenCalledWith(
				'features/chat/chatHistory/LOAD_NEXT',
				contactId,
				{
					root: true,
				},
			);
			expect(context.dispatch).toHaveBeenCalledWith(
				'FIND_TARGET_CHAT_IN_HISTORY',
				{
					chat,
					contactId,
				},
			);
		});
	});
});
