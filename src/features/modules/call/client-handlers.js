import { CallActions, CallDirection } from 'webitel-sdk';

import openLinkFromVariable from '../../../app/scripts/openLinkFromVariable';

const callHandler = (context) => (action, call) => {
	switch (action) {
		case CallActions.Ringing:
			context.dispatch('HANDLE_RINGING_ACTION', call);
			break;
		case CallActions.Active:
			context.dispatch('HANDLE_ACTIVE_ACTION', call);
			break;
		case CallActions.Hangup:
			context.dispatch('HANDLE_HANGUP_ACTION', call);
			break;
		case CallActions.Destroy:
			context.dispatch('HANDLE_DESTROY_ACTION', call);
			break;
		case CallActions.PeerStream:
			context.dispatch('HANDLE_STREAM_ACTION', call);
			break;
		case CallActions.Info:
			context.dispatch('HANDLE_INFO_ACTION', call);
			break;
		default:
		// console.log('default', action);
	}
};

const dispatchIfVideoCall = (context, call) => {
	if (context.getters['videoCall/IS_VIDEO_CALL']) {
		context.dispatch('HANDLE_INFO_ACTION', call);
	}
};

const actions = {
	SUBSCRIBE_CALLS: async (context) => {
		const client = await context.rootState.client.getCliInstance();
		await client.subscribeCall(callHandler(context), null);
		const callList = client.allCall();
		if (callList.length) context.dispatch('SET_CALL_LIST', callList);
	},

	HANDLE_RINGING_ACTION: async (context, call) => {
		await context.dispatch('ADD_CALL', call);

		if (
			call.direction === CallDirection.Outbound ||
			context.rootGetters['workspace/IS_EMPTY_WORKSPACE']
		) {
			await context.dispatch('SET_WORKSPACE', call);
		}

		dispatchIfVideoCall(context, call);

		// have to check is call not manual or not from offline queue before send notification https://webitel.atlassian.net/browse/WTEL-4502
		if (
			call.allowAnswer &&
			!context.getters.IS_OFFLINE_CALL &&
			!call.queue?.manual_distribution
		) {
			const callId = call.id;

			await context.dispatch(
				'features/callNotifications/HANDLE_INBOUND_CALL_RINGING',
				{
					displayName: call.displayName,
					displayNumber: call.displayNumber,
					queueName: call.queue.queue_name,
					answer: () =>
						context.dispatch('ANSWER', {
							callId,
						}),
					hangup: () =>
						context.dispatch('HANGUP', {
							callId,
						}),
				},
				{
					root: true,
				},
			);
		}
	},

	HANDLE_ACTIVE_ACTION: async (context, call) => {
		if (call.firstActive) openLinkFromVariable(call);
		context.dispatch('HOLD_OTHER_CALLS', call);
		dispatchIfVideoCall(context, call);
	},

	HANDLE_DESTROY_ACTION: async (context, call) => {
		// order is important: awaiting handle_call_end fixes https://my.webitel.com/browse/DEV-2401

		context.commit('REMOVE_CALL', call);

		if (context.getters['missed/IS_CALL_MISSED'](call)) {
			// await context.dispatch('missed/ON_CALL_MISS', call);
		}

		await context.dispatch('RESET_WORKSPACE');
	},

	HANDLE_STREAM_ACTION: (context, call) => {
		const audio = new Audio();
		const stream = call.peerStreams.slice(-1).pop();
		if (stream) {
			audio.srcObject = stream;
			audio.play();
			call.workspaceAudio = audio;
			context.dispatch('HANDLE_START_TALKING');
		}
	},

	HANDLE_INFO_ACTION: (context, call) => {
		const callOnWorkspace = context.getters.CALL_ON_WORKSPACE;
		if (!callOnWorkspace || callOnWorkspace.id !== call.id) return;

		const info = {
			sip: {
				remoteVideoMuted: call.sip?.remoteVideoMuted,
			},
			remoteHold: call.sip?.remoteHold,
			remoteVideoMuted: call.remoteVideoMuted,
		};

		if (Object.keys(info).length) {
			context.commit('UPDATE_CALL_INFO', {
				callId: call.id,
				info,
			});
		}
	},

	HANDLE_HANGUP_ACTION: async (context, call) => {
		if (call.workspaceAudio) {
			call.workspaceAudio.pause();
			call.workspaceAudio = null;
		}

		await context.dispatch('features/call/HANDLE_CALL_END', call, {
			root: true,
		});
	},

	// @author @stanislav-kozak
	// https://webitel.atlassian.net/browse/WTEL-7915
	// We need close notification after start talking
	HANDLE_START_TALKING: async (context) => {
		await context.dispatch(
			'features/swController/HIDE_NOTIFICATIONS',
			{
				title: 'New call',
			},
			{
				root: true,
			},
		);
		context.dispatch('features/callNotifications/HANDLE_CALL_START', null, {
			root: true,
		});
	},
	// @author @stanislav-kozak
	// https://webitel.atlassian.net/browse/WTEL-7915
	// We need close notification after end call
	HANDLE_CALL_END: async (context, call) => {
		await context.dispatch(
			'features/swController/HIDE_NOTIFICATIONS',
			{
				title: 'New call',
			},
			{
				root: true,
			},
		);
		context.dispatch('features/callNotifications/HANDLE_CALL_END', call, {
			root: true,
		});
	},
};

export default {
	actions,
};
