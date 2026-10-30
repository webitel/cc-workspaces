import { CallHistoryAPI } from '@webitel/api-services/api';

import missedAPI from '../missed.js';

vi.mock('@webitel/api-services/api');

describe('missedAPI', () => {
	it('getMissedCalls asks the server to hide numbers', async () => {
		CallHistoryAPI.getListPost = vi.fn(() => Promise.resolve({}));

		await missedAPI.getMissedCalls({
			userId: '1',
		});

		expect(CallHistoryAPI.getListPost).toHaveBeenCalledWith({
			data: expect.objectContaining({
				owner_id: [
					'1',
				],
				hide_number: true,
			}),
		});
	});

	it('redialToMissed delegates to the shared client', async () => {
		const callId = '123';
		CallHistoryAPI.redial = vi.fn(() => Promise.resolve({}));

		const response = await missedAPI.redialToMissed({
			callId,
		});

		expect(CallHistoryAPI.redial).toHaveBeenCalledWith({
			callId,
		});
		expect(response).toEqual({});
	});

	it('hideMissedCall delegates to the shared client', async () => {
		const callId = '123';
		CallHistoryAPI.hideMissed = vi.fn(() => Promise.resolve({}));

		const response = await missedAPI.hideMissedCall({
			callId,
		});

		expect(CallHistoryAPI.hideMissed).toHaveBeenCalledWith({
			callId,
		});
		expect(response).toEqual({});
	});
});
