import { ContactChatMessagesAPI } from '@webitel/api-services/api';

import chatHistoryModule from '../chat-history';

vi.mock('@webitel/api-services/api', async (importOriginal) => ({
	...(await importOriginal()),
	ContactChatMessagesAPI: {
		getAllMessages: vi.fn(),
	},
}));

const { actions, mutations } = chatHistoryModule;

const page = (ids, next = true) => ({
	items: ids.map((id) => ({
		id,
		date: id,
	})),
	next,
});

const createContext = (state = {}) => {
	const context = {
		state: {
			chatHistoryMessages: [],
			page: 1,
			next: false,
			...state,
		},
	};

	context.commit = vi.fn((type, payload) =>
		mutations[type](context.state, payload),
	);
	context.dispatch = vi.fn((type, payload) => actions[type](context, payload));

	return context;
};

describe('features/chat/chatHistory store', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('LOAD_CHAT_HISTORY asks for the first page and puts the counter back to it', async () => {
		// the archive was paged through for another chat before this one opened
		ContactChatMessagesAPI.getAllMessages.mockResolvedValue(
			page([
				'3',
			]),
		);
		const context = createContext({
			page: 4,
			chatHistoryMessages: [
				{
					id: 'old',
				},
			],
		});

		await actions.LOAD_CHAT_HISTORY(context, '413');

		expect(ContactChatMessagesAPI.getAllMessages).toHaveBeenCalledWith({
			contactId: '413',
			page: 1,
		});
		expect(context.state.page).toBe(1);
	});

	it('LOAD_CHAT_HISTORY replaces whatever was loaded before', async () => {
		ContactChatMessagesAPI.getAllMessages.mockResolvedValue(
			page([
				'3',
			]),
		);
		const context = createContext({
			chatHistoryMessages: [
				{
					id: 'old',
				},
			],
		});

		await actions.LOAD_CHAT_HISTORY(context, '413');

		expect(context.state.chatHistoryMessages.map((m) => m.id)).toEqual([
			'3',
		]);
	});

	it('LOAD_NEXT asks for the page after the current one and prepends it', async () => {
		ContactChatMessagesAPI.getAllMessages.mockResolvedValue(
			page([
				'1',
			]),
		);
		const context = createContext({
			page: 2,
			next: true,
			chatHistoryMessages: [
				{
					id: '3',
				},
			],
		});

		await actions.LOAD_NEXT(context, '413');

		expect(ContactChatMessagesAPI.getAllMessages).toHaveBeenCalledWith({
			contactId: '413',
			page: 3,
		});
		expect(context.state.page).toBe(3);
		expect(context.state.chatHistoryMessages.map((m) => m.id)).toEqual([
			'1',
			'3',
		]);
	});

	it('LOAD_NEXT does nothing when the archive has no more pages', async () => {
		const context = createContext({
			page: 2,
			next: false,
		});

		await actions.LOAD_NEXT(context, '413');

		expect(ContactChatMessagesAPI.getAllMessages).not.toHaveBeenCalled();
		expect(context.state.page).toBe(2);
	});

	it('surfaces a failed page instead of swallowing it', async () => {
		ContactChatMessagesAPI.getAllMessages.mockRejectedValue(new Error('boom'));
		const context = createContext({
			page: 2,
			next: true,
		});

		await expect(actions.LOAD_NEXT(context, '413')).rejects.toBeDefined();
		expect(context.state.page).toBe(2);
	});
});
