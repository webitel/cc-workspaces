import { UserHelperServiceApiFactory } from 'webitel-sdk';
import { SdkGetterApiConsumer } from 'webitel-sdk/esm2015/api-consumers';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration';
import configuration from '../../../../app/api/old/openAPIConfig';
import instance from '../../../../app/api/old/instance';

const userHelperService = new UserHelperServiceApiFactory(configuration, '', instance);

const itemResponseHandler = (stats) => ({
  ...stats,
  avgHoldSec: convertDuration(stats.avgHoldSec),
  avgTalkSec: convertDuration(stats.avgTalkSec),
  occupancy: `${stats.occupancy.toFixed(2)}%`,
  utilization: `${stats.utilization.toFixed(2)}%`,
  scoreRequiredAvg: `${stats.scoreRequiredAvg.toFixed(2)}`,
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

const getter = new SdkGetterApiConsumer(userHelperService.activityWorkspaceWidget, {
  defaultSingleObject,
  itemResponseHandler,
});

const getWidgets = async () => {
  return getter.getItem({});
};

const widgetsAPIRepository = {
  getWidgets,
};

export default widgetsAPIRepository;
