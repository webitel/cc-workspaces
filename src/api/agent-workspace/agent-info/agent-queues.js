import { AgentServiceApiFactory } from 'webitel-sdk';
import { SdkListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import instance from '../../instance';
import configuration from '../../openAPIConfig';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

const defaultListObject = {
  countMembers: 0,
  waitingMembers: 0,
  agents: {},
};

const listResponseHandler = (response) => {
  const items = response.items.map((item) => ({
    ...item,
    agents: {
      pause: item.agents.pause || 0,
      free: item.agents.free || 0,
    },
  }));
  return {
    ...response,
    items,
  };
};
const _getAgentQueues = (getList) => function ({
                                                 page = 1,
                                                 size = 10,
                                                 search,
                                                 sort,
                                                 fields,
                                                 parentId,
                                               }) {
  // parentId -- agent id
  const params = [parentId, page, size, search, sort, fields, undefined, undefined,
    undefined, undefined, undefined, undefined];
  return getList(params);
};

const listGetter = new SdkListGetterApiConsumer(agentService.searchAgentInQueue,
  { listResponseHandler, defaultListObject })
  .setGetListMethod(_getAgentQueues);
export const getAgentQueuesList = (params) => listGetter.getNestedList(params);

export default {
  getList: getAgentQueuesList,
};
