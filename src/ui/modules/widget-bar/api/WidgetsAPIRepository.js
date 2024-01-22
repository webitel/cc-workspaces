import { AgentServiceApiFactory } from 'webitel-sdk';
import { SdkGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import configuration from '../../../../app/api/openAPIConfig';
import instance from '../../../../app/api/instance';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

// const itemResponseHandler = (stats) => ({
//   ...stats,
//   avgHoldSec: convertDuration(stats.avgHoldSec),
//   avgTalkSec: convertDuration(stats.avgTalkSec),
//   occupancy: `${stats.occupancy.toFixed(2)}%`,
//   utilization: `${stats.utilization.toFixed(2)}%`,
//   scoreRequiredAvg: `${stats.scoreRequiredAvg.toFixed()}`,
//   chatAht: convertDuration(stats.chatAht),
//   sumTalkSec: convertDuration(stats.sumTalkSec),
//   processing: convertDuration(stats.processing),
//   voiceMail: convertDuration(stats.voiceMail),
//   queueTalkSec: convertDuration(stats.queueTalkSec),
//   available: convertDuration(stats.available),
// });

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

// const getWidgets = async ({
//                               agentId,
//                             }) => {
//   return getter.getItem({ itemId: agentId });
// };

const getWidgets = async ({ itemId: id }) => {
  const defaultObject = {
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

  const responseHandler = (stats) =>  ({
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

  try {
    const response = await agentService.agentTodayStatistics(id);
    return applyTransform(response.data, [
      snakeToCamel(),
      merge(defaultObject),
      responseHandler,
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
