import { createPinia, setActivePinia } from 'pinia';
import { JobState } from 'webitel-sdk';

import { useLeaveGuardStore } from '../leave-guard';

const clientMock = {
	allConversations: vi.fn(() => []),
};

const vuexStore = {
	state: {
		client: {
			state: 'connected',
			getClientSync: vi.fn(() => clientMock),
		},
		features: {
			call: {
				callList: [],
			},
			job: {
				jobList: [],
			},
		},
	},
	getters: {
		'features/status/IS_AGENT_ONLINE': false,
		'features/chat/active/ALL_CHAT_LIST': [],
	},
};

vi.mock('vuex', () => ({
	useStore: () => vuexStore,
}));

const logoutUser = vi.fn();

vi.mock('../../../../../ui/modules/userinfo/userinfoStore', () => ({
	useUserinfoStore: () => ({
		logoutUser,
	}),
}));

const resetVuex = () => {
	vuexStore.state.features.call.callList = [];
	vuexStore.state.features.job.jobList = [];
	vuexStore.getters['features/status/IS_AGENT_ONLINE'] = false;
	vuexStore.getters['features/chat/active/ALL_CHAT_LIST'] = [];
	vuexStore.state.client.getClientSync.mockImplementation(() => clientMock);
	vuexStore.state.client.state = 'connected';
	clientMock.allConversations.mockImplementation(() => []);
};

const makeEvent = () =>
	({
		preventDefault: vi.fn(),
	}) as unknown as BeforeUnloadEvent;

describe('leave-guard store', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		resetVuex();
		logoutUser.mockReset();
	});

	it('does not ask to confirm leave without online status or work', () => {
		const store = useLeaveGuardStore();
		const event = makeEvent();

		store.handleLeaveAttempt(event);

		expect(store.shouldConfirmLeave).toBe(false);
		expect(event.preventDefault).not.toHaveBeenCalled();
	});

	it.each([
		[
			'agent is online',
			() => {
				vuexStore.getters['features/status/IS_AGENT_ONLINE'] = true;
			},
		],
		[
			'there is a call',
			() => {
				vuexStore.state.features.call.callList = [
					{
						id: '1',
					},
				];
			},
		],
		[
			'there is a job',
			() => {
				vuexStore.state.features.job.jobList = [
					{
						id: '1',
					},
				];
			},
		],
		[
			'there is an active chat',
			() => {
				vuexStore.getters['features/chat/active/ALL_CHAT_LIST'] = [
					{
						id: '1',
					},
				];
			},
		],
		[
			'there is a closed chat in post-processing',
			() => {
				clientMock.allConversations.mockImplementation(() => [
					{
						closedAt: 1,
						task: {
							state: JobState.Processing,
						},
					},
				]);
			},
		],
	])('asks to confirm leave when %s', (_, arrange) => {
		arrange();
		const store = useLeaveGuardStore();
		const event = makeEvent();

		store.handleLeaveAttempt(event);

		expect(event.preventDefault).toHaveBeenCalled();
	});

	it.each([
		[
			'call',
			() => {
				vuexStore.state.features.call.callList = [
					{
						task: {
							state: JobState.Processing,
						},
					},
				];
			},
		],
		[
			'job',
			() => {
				vuexStore.state.features.job.jobList = [
					{
						state: JobState.Processing,
					},
				];
			},
		],
		[
			'chat',
			() => {
				clientMock.allConversations.mockImplementation(() => [
					{
						task: {
							state: JobState.Processing,
						},
					},
				]);
			},
		],
	])('detects post-processing of a %s', (_, arrange) => {
		arrange();
		const store = useLeaveGuardStore();

		expect(store.hasPostProcessing).toBe(true);
	});

	it.each([
		[
			'WS client is not connected',
			() => {
				vuexStore.state.client.state = 'disconnected';
				clientMock.allConversations.mockImplementation(() => [
					{
						task: {
							state: JobState.Processing,
						},
					},
				]);
			},
		],
		[
			'tasks are in another state',
			() => {
				vuexStore.state.features.call.callList = [
					{
						task: {
							state: JobState.Bridged,
						},
					},
				];
				vuexStore.state.features.job.jobList = [
					{
						state: JobState.Bridged,
					},
				];
				clientMock.allConversations.mockImplementation(() => [
					{
						task: {
							state: JobState.Bridged,
						},
					},
				]);
			},
		],
		[
			'call has no queue task',
			() => {
				vuexStore.state.features.call.callList = [
					{
						task: null,
					},
				];
			},
		],
	])('does not detect post-processing when %s', (_, arrange) => {
		arrange();
		const store = useLeaveGuardStore();

		expect(store.hasPostProcessing).toBe(false);
	});

	it('logs out and skips beforeunload prompt even when leave is guarded', async () => {
		vuexStore.getters['features/status/IS_AGENT_ONLINE'] = true;
		const store = useLeaveGuardStore();

		await store.logout();
		const event = makeEvent();
		store.handleLeaveAttempt(event);

		expect(logoutUser).toHaveBeenCalled();
		expect(event.preventDefault).not.toHaveBeenCalled();
	});

	it('resets leaving flag when logout fails', async () => {
		logoutUser.mockRejectedValue(new Error('fail'));
		const store = useLeaveGuardStore();

		await expect(store.logout()).rejects.toThrow('fail');

		expect(store.isLeaving).toBe(false);
	});
});
