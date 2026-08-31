import { CallHistoryAPI } from '@webitel/api-services/api';

const getHistory = (params) => {
	const defaultParams = {
		sort: '-created_at',
		createdAtFrom: 0,
		createdAtTo: new Date().setHours(23, 59, 59, 999), // today end
	};

	const {
		page,
		size,
		search,
		sort,
		fields,
		createdAtFrom,
		createdAtTo,
		userId,
		ownerId,
		memberId,
		cause,
		direction,
		isMissed,
	} = {
		...defaultParams,
		...params,
	};

	return CallHistoryAPI.getList({
		page,
		size,
		sort,
		fields,
		'created_at.from': createdAtFrom,
		'created_at.to': createdAtTo,
		user_id: userId,
		member_id: memberId,
		owner_id: ownerId,
		cause,
		number: search,
		direction,
		missed: isMissed,
	});
};

const historyAPIRepository = {
	getHistory,
};

export default historyAPIRepository;
