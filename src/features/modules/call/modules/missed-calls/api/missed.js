import { CallHistoryAPI } from '@webitel/api-services/api';

const getMissedCalls = async (params) => {
	const defaultParams = {
		answeredAtFrom: 0,
		answeredAtTo: 0,
		createdAtFrom: new Date().setHours(0, 0, 0, 0), // today
		createdAtTo: new Date().setHours(23, 59, 59, 999), // today end
		fields: [
			'from',
			'created_at',
			'id',
		],
		isMissed: true,
	};

	const {
		page = 1,
		size = 10,
		search,
		sort,
		fields,
		answeredAtFrom,
		answeredAtTo,
		createdAtFrom,
		createdAtTo,
		userId,
		memberId,
		cause,
		direction,
		isMissed,
	} = {
		...defaultParams,
		...params,
	};

	return CallHistoryAPI.getListPost({
		data: {
			page,
			size,
			q: search,
			sort,
			fields,
			created_at: {
				from: createdAtFrom,
				to: createdAtTo,
			},
			answered_at: {
				from: answeredAtFrom,
				to: answeredAtTo,
			},
			owner_id: [
				userId,
			],
			member_id: memberId,
			cause,
			direction,
			missed: isMissed,
		},
	});
};

const missedAPI = {
	getMissedCalls,
	redialToMissed: (params) => CallHistoryAPI.redial(params),
	hideMissedCall: (params) => CallHistoryAPI.hideMissed(params),
};

export default missedAPI;
