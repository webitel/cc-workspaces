import { toNaiveUtcTimestamp } from '../../../../script/naiveUtcTimestamp';
import ReportingForm from '../ReportingForm';

const comm = {
	id: '123',
};
const member = {
	communications: [
		comm,
	],
};

describe('Reporting class', () => {
	let task;
	let reporting;

	beforeEach(() => {
		task = {
			id: '1',
			reporting: vi.fn(),
			getMember: vi.fn(() => member),
		};
		reporting = new ReportingForm(task);
	});

	it('generateReporting returns base payload when schedule flag is disabled', () => {
		reporting.isScheduleCall = false;
		const form = {
			success: true,
			description: '',
		};
		Object.assign(reporting, form);
		const reportingResult = reporting.generateReporting();
		expect(reportingResult).toEqual(form);
	});

	it('generateReporting includes naive nextDistributeAt when schedule flag enabled', () => {
		const nextDistributeAt = Date.now();

		reporting.nextDistributeAt = nextDistributeAt;

		const nextDistributeAtNaive = toNaiveUtcTimestamp(nextDistributeAt);

		const expectedReporting = {
			success: true,
			description: '',
			nextDistributeAt: nextDistributeAtNaive,
		};
		Object.assign(reporting, {
			success: true,
			description: '',
			nextDistributeAt,
			isScheduleCall: true,
		});
		const result = reporting.generateReporting();
		expect(result).toEqual(expectedReporting);
	});

	it('isScheduleCall is enabled by default', () => {
		expect(reporting.isScheduleCall).toBe(true);
	});
});
