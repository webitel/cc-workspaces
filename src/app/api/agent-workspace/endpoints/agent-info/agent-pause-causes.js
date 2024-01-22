import { AgentServiceApiFactory } from 'webitel-sdk';
import { SdkListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import instance from '../../../instance';
import configuration from '../../../openAPIConfig';
import applyTransform, {
  merge, mergeEach, notify,
  snakeToCamel,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers';
import { getDefaultGetListResponse, getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults';

const agentPauseCauseService = new AgentServiceApiFactory(configuration, '', instance);

// const _getAgentPauseCauses = (getList) => function ({
//                                                       agentId,
//                                                     } = {}) {
//   const params = [agentId];
//   return getList(params);
// };

// const defaultListObject = {
//   name: '',
//   durationMin: 0,
//   limitMin: 0,
// };

// const listGetter = new SdkListGetterApiConsumer(agentPauseCauseService.searchPauseCauseForAgent,
//   { defaultListObject })
// .setGetListMethod(_getAgentPauseCauses);

// export const getAgentPauseCauses = (params) => listGetter.getList(params);
export const getAgentPauseCauses = async (params) => {
  const defaultObject = {
    name: '',
    durationMin: 0,
    limitMin: 0,
  };

  const {
      agentId,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
  ]);

  try {
    const response = await agentPauseCauseService.searchPauseCauseForAgent(
      agentId,
    );
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
