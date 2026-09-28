import { reactive } from 'vue';
import { RemotePhone } from '../RemotePhone';

describe('RemotePhone', () => {
	it('answerSession works when session lives in a Vue reactive tree', async () => {
		// callStore is deep-reactive; setSip nests the session (and its phone
		// ref) under that proxy. JS #private fields throw on a Proxy receiver.
		const sends = [];
		const phone = new RemotePhone(
			(type, payload) => {
				sends.push({
					type,
					payload,
				});
			},
			() => 'call-1',
		);
		const session = phone.sipSessionByCallId('call-1');
		const proxiedSession = reactive(session);

		await expect(proxiedSession.answer({})).resolves.toBeUndefined();
		expect(sends).toEqual([
			{
				type: 'answer',
				payload: {
					callId: 'call-1',
				},
			},
		]);
	});

	it('resolves sip_id sessions via findCallIdBySession', async () => {
		const sends = [];
		const phone = new RemotePhone(
			(type, payload) => {
				sends.push({
					type,
					payload,
				});
			},
			() => 'resolved-call-id',
		);
		const session = phone.sipSessionBySipId('sip-leg-9');
		await reactive(session).answer({});
		expect(sends).toEqual([
			{
				type: 'answer',
				payload: {
					callId: 'resolved-call-id',
				},
			},
		]);
	});
});
