import { CalendarsAPI } from '@webitel/api-services/api';

const getList = (params) => CalendarsAPI.getTimezonesLookup(params);

const getLookup = (params) =>
	CalendarsAPI.getTimezonesLookup({
		...params,
		fields: params.fields || [
			'id',
			'name',
		],
	});

const TimezonesAPI = {
	getList,
	getLookup,
};

export default TimezonesAPI;
