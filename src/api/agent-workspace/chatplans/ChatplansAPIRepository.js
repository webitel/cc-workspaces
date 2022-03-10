import { RoutingChatPlanServiceApiFactory } from 'webitel-sdk';
import { SdkListGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import instance from '../../instance';
import configuration from '../../openAPIConfig';

const chatplanService = new RoutingChatPlanServiceApiFactory(configuration, '', instance);

const listGetter = new SdkListGetterApiConsumer(chatplanService.searchChatPlan);

const getChatplans = (params) => listGetter.getList(params);

const chatplanAPIRepository = {
  getChatplans,
};

export default chatplanAPIRepository;
