import { AgentServiceApiFactory } from 'webitel-sdk';
import { SdkListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import instance from '../../instance';
import configuration from '../../openAPIConfig';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

const defaultListObject = {
  countMembers: 0,
  waitingMembers: 0,
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

const listGetter = new SdkListGetterApiConsumer(agentService.searchAgentInQueue, { defaultListObject })
  .setGetListMethod(_getAgentQueues);
export const getAgentQueuesList = (params) => listGetter.getNestedList(params);

export default {
  getList: getAgentQueuesList,
};
