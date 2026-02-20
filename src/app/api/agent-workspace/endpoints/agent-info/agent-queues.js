import {
	getDefaultGetListResponse,
	getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
	merge,
	mergeEach,
	notify,
	snakeToCamel,
	starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { AgentServiceApiFactory } from 'webitel-sdk';

import instance from '../../../instance';
import configuration from '../../../openAPIConfig';

const service = new AgentServiceApiFactory(configuration, '', instance);

const getList = async (params) => {
	const defaultObject = {
		countMembers: 0,
		waitingMembers: 0,
		maxMemberLimit: 0,
		agents: {},
	};

	const listResponseHandler = (items) => {
		return items.map((item) => ({
			...item,
			agents: {
				busy: item.agents.busy || 0,
				pause: item.agents.pause || 0,
				online: item.agents.online || 0,
				allowPause: item.agents.allowPause,
			},
		}));
	};

	const { parentId, page, size, search, sort, fields, id } = applyTransform(
		params,
		[
			merge(getDefaultGetParams()),
			starToSearch('search'),
		],
	);

	try {
		const response = await service.searchAgentInQueue(
			parentId,
			page,
			size,
			search,
			sort,
			fields,
			id,
		);
		const { items, next } = applyTransform(response.data, [
			snakeToCamel(),
			merge(getDefaultGetListResponse()),
		]);
		return {
			items: applyTransform(items, [
				mergeEach(defaultObject),
				listResponseHandler,
			]),
			next,
		};
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

export default {
	getList,
};
