import { createPinia, setActivePinia } from 'pinia';

import { useLeaveGuardStore } from '../leave-guard';

const vuexStore = {
	state: {
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
		'features/chat/postProcessing/CHATS_IN_POSTPROCESSING': [],
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
	vuexStore.getters['features/chat/postProcessing/CHATS_IN_POSTPROCESSING'] =
		[];
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
			'there is a chat in post-processing',
			() => {
				vuexStore.getters[
					'features/chat/postProcessing/CHATS_IN_POSTPROCESSING'
				] = [
					{
						id: '1',
					},
				];
			},
		],
	])('asks to confirm leave when %s', (_, arrange) => {
		arrange();
		const store = useLeaveGuardStore();
		const event = makeEvent();

		store.handleLeaveAttempt(event);

		expect(event.preventDefault).toHaveBeenCalled();
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
