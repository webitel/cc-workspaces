import { AgentServiceApiFactory } from 'webitel-sdk';
import { SdkGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import configuration from '../../../../app/api/old/openAPIConfig';
import instance from '../../../../app/api/old/instance';

const agentService = new AgentServiceApiFactory(configuration, '', instance);

const itemResponseHandler = (stats) => ({
  ...stats,
  avgHoldSec: convertDuration(stats.avgHoldSec),
  avgTalkSec: convertDuration(stats.avgTalkSec),
  occupancy: `${stats.occupancy.toFixed(2)}%`,
  utilization: `${stats.utilization.toFixed(2)}%`,
  scoreRequiredAvg: `${stats.scoreRequiredAvg.toFixed()}`,
  chatAht: convertDuration(stats.chatAht),
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
};

const getter = new SdkGetterApiConsumer(agentService.agentTodayStatistics, {
  defaultSingleObject,
  itemResponseHandler,
});

const getWidgets = async ({
                              agentId,
                            }) => {
  return getter.getItem({ itemId: agentId });
};

const widgetsAPIRepository = {
  getWidgets,
};

export default widgetsAPIRepository;
