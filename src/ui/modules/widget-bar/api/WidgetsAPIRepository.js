import { AgentServiceApiFactory } from 'webitel-sdk';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
import applyTransform, {
  camelToSnake,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import configuration from '../../../../app/api/old/openAPIConfig';
import instance from '../../../../app/api/instance';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

const itemResponseHandler = (stats) => ({
  ...stats,
  avgHoldSec: convertDuration(stats.avgHoldSec),
  avgTalkSec: convertDuration(stats.avgTalkSec),
  occupancy: `${stats.occupancy.toFixed(2)}%`,
  utilization: `${stats.utilization.toFixed(2)}%`,
  scoreRequiredAvg: `${stats.scoreRequiredAvg.toFixed()}`,
  chatAht: convertDuration(stats.chatAht),
  sumTalkSec: convertDuration(stats.sumTalkSec),
  processing: convertDuration(stats.processing),
  voiceMail: convertDuration(stats.voiceMail),
  queueTalkSec: convertDuration(stats.queueTalkSec),
  available: convertDuration(stats.available),
});

const defaultSingleObject = {
  callInbound: 0,
  callHandled: 0,
  callMissed: 0,
  avgHoldSec: 0,
  avgTalkSec: 0,
  occupancy: 0,
  utilization: 0,
  chatAccepts: 0,
  chatAht: 0,
  scoreCount: 0,
  scoreRequiredAvg: 0,
  sumTalkSec: 0,
  processing: 0,
  available: 0,
  voiceMail: 0,
  queueTalkSec: 0,
  taskAccepts: 0,
};

// const getter = new SdkGetterApiConsumer(agentService.agentTodayStatistics, {
//   defaultSingleObject,
//   itemResponseHandler,
// });

const getWidgets = async ({ itemId: id }) => {
  try {
    const response = await agentService.agentTodayStatistics(id);
    return applyTransform(response.data, [
      merge(defaultSingleObject),
      itemResponseHandler,
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const widgetsAPIRepository = {
  getWidgets,
};

export default widgetsAPIRepository;
