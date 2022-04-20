import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import { AgentServiceApiFactory } from 'webitel-sdk';
import { SdkGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import instance from '../../../instance';
import configuration from '../../../openAPIConfig';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

const itemResponseHandler = (item) => ({
  ...item,
  statusDuration: convertDuration(item.statusDuration),
  online: convertDuration(item.online),
  offline: convertDuration(item.offline),
  pause: convertDuration(item.pause),
});

const _getAgent = (get) => function ({
                                       itemId,
                                       from = new Date().setHours(0, 0, 0, 0),
                                       to = new Date().setHours(23, 59, 59, 999),
                                     }) {
  const params = [itemId, from, to];
  return get(params);
};

const sdkGetterApiConsumer = new SdkGetterApiConsumer(agentService.searchAgentStatusStatisticItem, {
  itemResponseHandler,
}).setGetMethod(_getAgent);

const getAgent = (params) => sdkGetterApiConsumer.getItem(params);

export default {
  get: getAgent,
};
