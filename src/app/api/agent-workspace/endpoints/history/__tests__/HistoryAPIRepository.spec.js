import { CallHistoryAPI } from '@webitel/api-services/api';

import historyAPIRepository from '../HistoryAPIRepository.js';

vi.mock('@webitel/api-services/api');

describe('historyAPIRepository', () => {
	beforeEach(() => {
		CallHistoryAPI.getList = vi.fn(() => Promise.resolve({}));
		CallHistoryAPI.redial = vi.fn(() => Promise.resolve({}));
	});

	it('getHistory asks the server to hide numbers', async () => {
		await historyAPIRepository.getHistory({
			ownerId: '1',
		});

		expect(CallHistoryAPI.getList).toHaveBeenCalledWith(
			expect.objectContaining({
				owner_id: '1',
				hide_number: true,
			}),
		);
	});

	it('redial delegates to the shared client by call id', async () => {
		await historyAPIRepository.redial({
			callId: '123',
		});

		expect(CallHistoryAPI.redial).toHaveBeenCalledWith({
			callId: '123',
		});
	});
});
