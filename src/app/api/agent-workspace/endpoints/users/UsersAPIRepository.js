import { AgentsAPI } from '@webitel/api-services/api';
import applyTransform, {
	notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

import instance from '../../../instance';

const getUsers = async (params) => {
	const defaultObject = {
		extension: '',
		id: '',
		name: '',
		presence: [],
		status: '',
	};

	const { items, next } = await AgentsAPI.getUsersStatus(params);

	return {
		items: items.map((item) => ({
			...defaultObject,
			...item,
		})),
		next,
	};
};

const setUserStatus = async (status) => {
	const url = '/presence';
	try {
		await instance.patch(url, {
			status,
		});
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const getUserStatus = async () => {
	const url = '/user';

	try {
		const response = await instance.get(url);
		return response.data.presence;
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const getLookup = (params) =>
	getUsers({
		...params,
		fields: params.fields || [
			'id',
			'name',
		],
	});

const usersAPIRepository = {
	getUsers,
	setUserStatus,
	getUserStatus,
	getLookup,
};

export default usersAPIRepository;
