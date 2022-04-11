import { RoutingChatPlanServiceApiFactory } from 'webitel-sdk';
import { SdkListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import instance from '../../instance';
import configuration from '../../openAPIConfig';

const chatplanService = new RoutingChatPlanServiceApiFactory(configuration, '', instance);

const _getChatplans = (getList) => function ({
                                                     page,
                                                     size,
                                                     search,
                                                     fields,
                                                     sort,
                                                     id,
                                                     enabled,
                                                   } = {}) {
  const params = [page, size, search, sort, fields, id, undefined, enabled];
  return getList(params);
};
const listGetter = new SdkListGetterApiConsumer(chatplanService.searchChatPlan)
  .setGetListMethod(_getChatplans);

const getChatplans = (params) => listGetter.getList(params);

const chatplanAPIRepository = {
  getChatplans,
};

export default chatplanAPIRepository;
