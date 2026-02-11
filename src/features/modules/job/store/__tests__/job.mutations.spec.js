import jobModule from '../job';

const job = {
	id: '1',
};

describe('features/job store: mutations', () => {
	it('SET_JOB_LIST sets jobList to state', () => {
		const jobList = [
			job,
		];
		const state = {
			jobList: [],
		};
		jobModule.mutations.SET_JOB_LIST(state, jobList);
		expect(state.jobList).toEqual(jobList);
	});

	it('ADD_JOB pushes new job to jobList', () => {
		const jobList = [
			job,
		];
		const state = {
			jobList: [],
		};
		jobModule.mutations.ADD_JOB(state, job);
		expect(state.jobList).toEqual(jobList);
	});

	it('REMOVE_JOB removes existing job from jobList', () => {
		const jobList = [];
		const state = {
			jobList: [
				job,
			],
		};
		jobModule.mutations.REMOVE_JOB(state, job);
		expect(state.jobList).toEqual(jobList);
	});
});
