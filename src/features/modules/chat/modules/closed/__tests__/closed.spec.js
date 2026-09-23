import CatalogAPI from '../../../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository';
import closedModule from '../store/closed';

vi.mock(
	'../../../../../../app/api/agent-workspace/endpoints/catalog/CatalogAPIRepository',
	() => ({
		default: {
			getChatMessagesList: vi.fn(),
		},
	}),
);

const { actions } = closedModule;

const message = (id, chatId, createdAt) => ({
	id,
	createdAt,
	chat: {
		id: chatId,
	},
});

// dispatch routes the module's own actions to the real ones, so recursion is exercised
const createContext = ({ pages, chatHistory }) => {
	const context = {
		commit: vi.fn(),
		rootState: {
			features: {
				chat: {
					chatHistory,
				},
			},
		},
		rootGetters: {},
	};

	context.dispatch = vi.fn((type, payload) => {
		if (type === 'features/chat/chatHistory/LOAD_NEXT') {
			const nextPage = pages.shift();

			chatHistory.chatHistoryMessages = [
				...(nextPage?.messages || []),
				...chatHistory.chatHistoryMessages,
			];
			chatHistory.next = !!nextPage?.next;

			return Promise.resolve();
		}

		if (actions[type]) return Promise.resolve(actions[type](context, payload));

		return Promise.resolve();
	});

	return context;
};

describe('features/chat/closed store', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('FIND_TARGET_CHAT_FIRST_MESSAGE', () => {
		it('matches the first message of the target chat', async () => {
			const context = createContext({
				pages: [],
				chatHistory: {
					next: false,
					chatHistoryMessages: [
						message('m1', 'chat-a', '100'),
						message('m2', 'chat-a', '200'),
						message('m3', 'chat-b', '300'),
					],
				},
			});

			const found = await actions.FIND_TARGET_CHAT_FIRST_MESSAGE(
				context,
				'chat-b',
			);

			expect(found.id).toBe('m3');
		});

		it('does not match a message in the middle of the target chat', async () => {
			const context = createContext({
				pages: [],
				chatHistory: {
					next: false,
					chatHistoryMessages: [
						message('m1', 'chat-a', '100'),
						message('m2', 'chat-a', '200'),
					],
				},
			});

			const found = await actions.FIND_TARGET_CHAT_FIRST_MESSAGE(
				context,
				'chat-a',
			);

			expect(found.id).toBe('m1');
		});
	});

	describe('FIND_TARGET_CHAT_IN_HISTORY', () => {
		const chat = {
			id: 'chat-b',
			startedAt: '100',
			contact: {
				id: '413',
			},
		};

		it('commits the anchor and resolves true when the chat is on the loaded page', async () => {
			const context = createContext({
				pages: [],
				chatHistory: {
					next: false,
					chatHistoryMessages: [
						message('m1', 'chat-a', '100'),
						message('m2', 'chat-b', '200'),
					],
				},
			});

			const result = await actions.FIND_TARGET_CHAT_IN_HISTORY(context, chat);

			expect(result).toBe(true);
			expect(context.commit).toHaveBeenCalledWith(
				'SET_CLOSED_CHAT_FIRST_MESSAGE_ID',
				'm2',
			);
		});

		it('searches the single loaded page even when there is no next page', async () => {
			const context = createContext({
				pages: [],
				chatHistory: {
					next: false,
					chatHistoryMessages: [
						message('m1', 'chat-a', '100'),
						message('m2', 'chat-b', '200'),
					],
				},
			});

			await actions.FIND_TARGET_CHAT_IN_HISTORY(context, chat);

			expect(context.commit).toHaveBeenCalledWith(
				'SET_CLOSED_CHAT_FIRST_MESSAGE_ID',
				'm2',
			);
		});

		// chat start is confirmed only once an older message precedes it: hence 3 pages, not 2
		it('finds the chat on a later page and stops paging there', async () => {
			const context = createContext({
				pages: [
					{
						messages: [
							message('m0', 'chat-x', '150'),
						],
						next: true,
					},
					{
						messages: [
							message('m00', 'chat-b', '120'),
						],
						next: true,
					},
					{
						messages: [
							message('m000', 'chat-y', '110'),
						],
						next: true,
					},
				],
				chatHistory: {
					next: true,
					chatHistoryMessages: [
						message('m1', 'chat-a', '200'),
					],
				},
			});

			const result = await actions.FIND_TARGET_CHAT_IN_HISTORY(context, chat);

			const loadNextCalls = context.dispatch.mock.calls.filter(
				([type]) => type === 'features/chat/chatHistory/LOAD_NEXT',
			);

			expect(result).toBe(true);
			expect(context.commit).toHaveBeenCalledWith(
				'SET_CLOSED_CHAT_FIRST_MESSAGE_ID',
				'm00',
			);
			expect(loadNextCalls).toHaveLength(3);
		});

		it('stops once the loaded page is older than the chat itself', async () => {
			const context = createContext({
				pages: [
					{
						messages: [
							message('m0', 'chat-x', '50'),
						],
						next: true,
					},
				],
				chatHistory: {
					next: true,
					chatHistoryMessages: [
						message('m1', 'chat-a', '200'),
					],
				},
			});

			const result = await actions.FIND_TARGET_CHAT_IN_HISTORY(context, chat);

			const loadNextCalls = context.dispatch.mock.calls.filter(
				([type]) => type === 'features/chat/chatHistory/LOAD_NEXT',
			);

			expect(result).toBe(false);
			expect(loadNextCalls).toHaveLength(1);
			expect(context.commit).not.toHaveBeenCalledWith(
				'SET_CLOSED_CHAT_FIRST_MESSAGE_ID',
				expect.anything(),
			);
		});
	});

	describe('LOAD_CLOSED_CHAT', () => {
		it('reads the dialog up to the moment the agent left it', async () => {
			CatalogAPI.getChatMessagesList.mockResolvedValue({
				items: [],
				next: false,
			});

			const context = createContext({
				pages: [],
				chatHistory: {
					next: false,
					chatHistoryMessages: [],
				},
			});

			await actions.LOAD_CLOSED_CHAT(context, {
				id: 'chat-b',
				conversationId: 'conv-1',
				closedAt: '1700000000000',
			});

			expect(CatalogAPI.getChatMessagesList).toHaveBeenCalledWith({
				chatId: 'conv-1',
				offsetDate: '1700000000000',
			});
		});

		it('returns the chat with its messages so callers can anchor on them', async () => {
			CatalogAPI.getChatMessagesList.mockResolvedValue({
				items: [
					{
						id: 'm1',
						date: '100',
					},
				],
				next: false,
			});

			const context = createContext({
				pages: [],
				chatHistory: {
					next: false,
					chatHistoryMessages: [],
				},
			});

			const result = await actions.LOAD_CLOSED_CHAT(context, {
				id: 'chat-b',
				closedAt: '200',
			});

			expect(result.messages).toHaveLength(1);
			expect(result.messages[0].id).toBe('m1');
		});
	});

	describe('LOAD_CLOSED_CHAT_HISTORY', () => {
		const chat = {
			id: 'chat-b',
			startedAt: '100',
			closedAt: '300',
			contact: {
				id: '413',
			},
		};

		it('falls back to the dialog and anchors on its first message when the archive has no such chat', async () => {
			CatalogAPI.getChatMessagesList.mockResolvedValue({
				items: [
					{
						id: 'm1',
						date: '100',
					},
				],
				next: false,
			});

			const context = createContext({
				pages: [],
				chatHistory: {
					next: false,
					chatHistoryMessages: [
						message('m9', 'chat-a', '200'),
					],
				},
			});

			await actions.LOAD_CLOSED_CHAT_HISTORY(context, chat);

			expect(CatalogAPI.getChatMessagesList).toHaveBeenCalledWith({
				chatId: 'chat-b',
				offsetDate: '300',
			});
			expect(context.commit).toHaveBeenCalledWith(
				'SET_CLOSED_CHAT_FIRST_MESSAGE_ID',
				'm1',
			);
			expect(context.commit).toHaveBeenCalledWith(
				'SET_IS_CLOSED_CHAT_LOADED',
				true,
			);
		});

		it('does not touch the dialog when the archive already holds the chat', async () => {
			const context = createContext({
				pages: [],
				chatHistory: {
					next: false,
					chatHistoryMessages: [
						message('m9', 'chat-a', '200'),
						message('m10', 'chat-b', '250'),
					],
				},
			});

			await actions.LOAD_CLOSED_CHAT_HISTORY(context, chat);

			expect(CatalogAPI.getChatMessagesList).not.toHaveBeenCalled();
			expect(context.commit).toHaveBeenCalledWith(
				'SET_CLOSED_CHAT_FIRST_MESSAGE_ID',
				'm10',
			);
		});
	});
});
