import {
	getDefaultGetListResponse,
	getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
	merge,
	mergeEach,
	notify,
	snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { AgentServiceApiFactory } from 'webitel-sdk';

import instance from '../../../instance';
import configuration from '../../../openAPIConfig';

const agentPauseCauseService = new AgentServiceApiFactory(
	configuration,
	'',
	instance,
);

export const getAgentPauseCauses = async ({ agentId }) => {
	const defaultObject = {
		name: '',
		durationMin: 0,
		limitMin: 0,
	};

	try {
		const response =
			await agentPauseCauseService.searchPauseCauseForAgent(agentId);
		const { items, next } = applyTransform(response.data, [
			snakeToCamel(),
			merge(getDefaultGetListResponse()),
		]);
		return {
			items: applyTransform(items, [
				mergeEach(defaultObject),
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
	getList: getAgentPauseCauses,
};
