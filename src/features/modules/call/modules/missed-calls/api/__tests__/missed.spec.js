import { CallHistoryAPI } from '@webitel/api-services/api';

import missedAPI from '../missed.js';

vi.mock('@webitel/api-services/api');

describe('missedAPI', () => {
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
