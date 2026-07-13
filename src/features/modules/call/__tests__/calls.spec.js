import { CallDirection } from 'webitel-sdk';

import callModule from '../call';

const call = {
	id: '1',
};

describe('features/call store: actions', () => {
	const context = {
		state: {
			callOnWorkspace: call,
			callList: [],
			isDialing: false,
		},
		dispatch: vi.fn(),
		rootGetters: {
			'workspace/IS_EMPTY_WORKSPACE': null,
		},
		getters: {
			'missed/IS_CALL_MISSED': vi.fn(),
		},
		rootState: {
			config: {
				CLI: {},
			},
		},
	};
	context.commit = vi.fn((type, payload) => {
		callModule.mutations[type]?.(context.state, payload);
	});

	beforeEach(() => {
		context.state = {
			callOnWorkspace: call,
			callList: [],
			isDialing: false,
		};
		callModule.actions.OPEN_NEW_CALL(context, {});
		context.dispatch.mockClear();
		context.commit.mockClear();
	});

	it('empty test', () => {
		expect(callModule).toBeTruthy();
	});

	it('HANDLE_RINGING_ACTION action calls SET_WORKSPACE with call if no task on workspace', async () => {
		context.rootGetters['workspace/IS_EMPTY_WORKSPACE'] = true;
		await callModule.actions.HANDLE_RINGING_ACTION(context, call);
		expect(context.dispatch).toHaveBeenCalledWith('SET_WORKSPACE', call);
	});

	it('HANDLE_RINGING_ACTION action does not call SET_WORKSPACE if something present in workspace', () => {
		context.rootGetters['workspace/IS_EMPTY_WORKSPACE'] = false;
		callModule.actions.HANDLE_RINGING_ACTION(context, call);
		expect(context.dispatch).not.toHaveBeenCalledWith('SET_WORKSPACE');
	});
	it('CALL action calls to number in prior to newNumber', async () => {
		const call = vi.fn().mockResolvedValue(undefined);
		const number = 'number';
		context.rootState.client = {
			getCliInstance: () => ({
				call,
			}),
		};
		context.rootGetters['workspace/TASK_ON_WORKSPACE'] = {
			newNumber: 'newNumber',
		};

		await callModule.actions.CALL(context, {
			number,
		});
		expect(call.mock.calls[0][0].destination).toBe('number');
	});
	it('CALL action with no passed params calls to newNumber', async () => {
		const call = vi.fn().mockResolvedValue(undefined);
		context.rootState.client = {
			getCliInstance: () => ({
				call,
			}),
		};
		context.rootGetters['workspace/TASK_ON_WORKSPACE'] = {
			newNumber: 'new Number ()',
		};

		await callModule.actions.CALL(context, {});
		expect(call.mock.calls[0][0].destination).toBe('newNumber');
	});
	it('CALL action ignores repeated invocation while dialing (double-dial guard)', async () => {
		const call = vi.fn().mockResolvedValue(undefined);
		context.rootState.client = {
			getCliInstance: () => ({
				call,
			}),
		};
		context.rootGetters['workspace/TASK_ON_WORKSPACE'] = {
			newNumber: 'number',
		};

		await callModule.actions.CALL(context, {});
		await callModule.actions.CALL(context, {});
		expect(call).toHaveBeenCalledTimes(1);

		callModule.actions.STOP_DIALING(context);
		await callModule.actions.CALL(context, {});
		expect(call).toHaveBeenCalledTimes(2);
	});
	it('CALL action releases the dialing guard when client.call rejects', async () => {
		const call = vi.fn().mockRejectedValue(new Error('fail'));
		context.rootState.client = {
			getCliInstance: () => ({
				call,
			}),
		};
		context.rootGetters['workspace/TASK_ON_WORKSPACE'] = {
			newNumber: 'number',
		};

		await expect(callModule.actions.CALL(context, {})).rejects.toThrow('fail');
		expect(context.state.isDialing).toBe(false);
	});
	it('HANDLE_RINGING_ACTION releases the dialing guard for outbound call', async () => {
		context.rootGetters['workspace/IS_EMPTY_WORKSPACE'] = false;
		await callModule.actions.HANDLE_RINGING_ACTION(context, {
			id: '2',
			direction: CallDirection.Outbound,
		});
		expect(context.dispatch).toHaveBeenCalledWith('STOP_DIALING');
	});
	it('HANDLE_RINGING_ACTION does not touch the dialing guard for inbound call', async () => {
		context.rootGetters['workspace/IS_EMPTY_WORKSPACE'] = false;
		await callModule.actions.HANDLE_RINGING_ACTION(context, {
			id: '2',
			direction: CallDirection.Inbound,
		});
		expect(context.dispatch).not.toHaveBeenCalledWith('STOP_DIALING');
	});
});
