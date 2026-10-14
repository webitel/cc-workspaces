import manualModule from '../store/manual';

const { getters, actions } = manualModule;

const createAgent = ({
	maxWaitingListChats = 10,
	waitingChatsSize = 0,
} = {}) => ({
	maxWaitingListChats,
	waitingChatsSize,
	waitingListChats: [],
	limitWaitingListChats: vi.fn(),
});

const createContext = (agent) => ({
	commit: vi.fn(),
	rootState: {
		client: {
			getCliInstance: () =>
				Promise.resolve({
					agent,
				}),
		},
	},
});

const resolveGetters = (state) => {
	const resolved = {};
	resolved.TOTAL_COUNT = getters.TOTAL_COUNT(state);
	resolved.HAS_MORE = getters.HAS_MORE(state, resolved);
	return resolved;
};

describe('Chats: manual store', () => {
	it('TOTAL_COUNT returns untrimmed size from agent', () => {
		const state = {
			manualList: new Array(10),
			agent: createAgent({
				waitingChatsSize: 25,
			}),
		};
		expect(resolveGetters(state).TOTAL_COUNT).toBe(25);
	});

	it('TOTAL_COUNT falls back to list length without agent', () => {
		const state = {
			manualList: new Array(3),
			agent: null,
		};
		expect(resolveGetters(state).TOTAL_COUNT).toBe(3);
	});

	it('HAS_MORE is true when total exceeds shown list', () => {
		const state = {
			manualList: new Array(10),
			agent: createAgent({
				waitingChatsSize: 11,
			}),
		};
		expect(resolveGetters(state).HAS_MORE).toBe(true);
	});

	it('HAS_MORE is false when whole list is shown', () => {
		const state = {
			manualList: new Array(10),
			agent: createAgent({
				waitingChatsSize: 10,
			}),
		};
		expect(resolveGetters(state).HAS_MORE).toBe(false);
	});

	it('INITIALIZE_MANUAL_LIST stores agent and its waiting chats', async () => {
		const agent = createAgent();
		const context = createContext(agent);
		await actions.INITIALIZE_MANUAL_LIST(context);
		expect(context.commit).toHaveBeenCalledWith('SET_AGENT', agent);
		expect(context.commit).toHaveBeenCalledWith(
			'SET_MANUAL_LIST',
			agent.waitingListChats,
		);
	});

	it('LOAD_MORE raises SDK limit by 10', async () => {
		const agent = createAgent({
			maxWaitingListChats: 20,
		});
		await actions.LOAD_MORE(createContext(agent));
		expect(agent.limitWaitingListChats).toHaveBeenCalledWith(30);
	});
});
