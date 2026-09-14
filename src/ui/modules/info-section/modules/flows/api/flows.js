import { AgentTriggersAPI } from '@webitel/api-services/api';
import applyTransform, {
	notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

import i18n from '../../../../../../app/locale/i18n.js';

const { t } = i18n.global;

const getFlowSchemasList = (params) => AgentTriggersAPI.getList(params);

const runFlowSchema = async ({ id }) => {
	try {
		const result = await AgentTriggersAPI.run({
			id,
		});
		return applyTransform(result, [
			notify(({ callback }) =>
				callback({
					type: 'success',
					text: t('infoSec.flows.runFlowSuccess'),
				}),
			),
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify(({ callback }) =>
				callback({
					type: 'error',
					text: t('infoSec.flows.runFlowError'),
				}),
			),
		]);
	}
};

const getFlowsLookup = (params) => AgentTriggersAPI.getLookup(params);

const FlowsAPI = {
	getList: getFlowSchemasList,
	run: runFlowSchema,
	getLookup: getFlowsLookup,
};

export default FlowsAPI;
